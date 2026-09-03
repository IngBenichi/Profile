#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Bootstrap the TLS certificate for benichi.dev.
#
# The HTTP-01 challenge must reach this host on port 80. If benichi.dev is behind
# the Cloudflare proxy, set its A record to "DNS only" (grey cloud) for the ~2
# minutes this runs, then switch back to "Proxied" + SSL/TLS "Full (strict)".
# Renewals then work with the proxy on (nginx serves /.well-known over plain HTTP,
# no redirect).

DOMAINS=(benichi.dev www.benichi.dev)
[ -f .env ] || { echo "deploy/.env missing (copy from .env.example)"; exit 1; }
[ -f nginx/htpasswd ] || { echo "nginx/htpasswd missing — run ./set-admin-password.sh first"; exit 1; }
set -a; . ./.env; set +a
EMAIL="${LETSENCRYPT_EMAIL:?set LETSENCRYPT_EMAIL in deploy/.env}"
STAGING="${CERTBOT_STAGING:-0}"
LIVE=/etc/letsencrypt/live/benichi.dev

dc() { docker compose "$@"; }

echo "### Building app image"
dc build app

if dc run --rm --entrypoint sh certbot -c "[ -s $LIVE/fullchain.pem ] && openssl x509 -in $LIVE/fullchain.pem -noout -checkend 0 >/dev/null 2>&1 && ! openssl x509 -in $LIVE/fullchain.pem -noout -issuer | grep -qi 'CN=benichi.dev'" ; then
  echo "### Valid CA certificate already present — skipping issuance"
else
  echo "### Placing a temporary self-signed cert so nginx can start"
  dc run --rm --entrypoint sh certbot -c "
    rm -rf /etc/letsencrypt/live/benichi.dev /etc/letsencrypt/archive/benichi.dev /etc/letsencrypt/renewal/benichi.dev.conf &&
    mkdir -p $LIVE &&
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
      -keyout $LIVE/privkey.pem -out $LIVE/fullchain.pem -subj '/CN=benichi.dev'
  "
  dc up -d nginx
  sleep 3

  echo "### Requesting the real certificate from Let's Encrypt"
  dc run --rm --entrypoint sh certbot -c "rm -rf /etc/letsencrypt/live/benichi.dev /etc/letsencrypt/archive/benichi.dev /etc/letsencrypt/renewal/benichi.dev.conf"
  ARGS=(certonly --webroot -w /var/www/certbot --email "$EMAIL" --agree-tos --no-eff-email)
  for d in "${DOMAINS[@]}"; do ARGS+=(-d "$d"); done
  [ "$STAGING" = "1" ] && ARGS+=(--staging)
  dc run --rm --entrypoint certbot certbot "${ARGS[@]}"
fi

echo "### Bringing the stack up + reloading nginx"
dc up -d
sleep 2
dc exec -T nginx nginx -t && dc exec -T nginx nginx -s reload
echo "### Done. https://benichi.dev should serve a valid certificate."
