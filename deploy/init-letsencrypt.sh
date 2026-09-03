#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Bootstrap the TLS certificate for benichi.dev.
#
# Cloudflare proxy note: the HTTP-01 challenge must reach this host on port 80.
# Easiest path: in the Cloudflare dashboard set the benichi.dev A record to
# "DNS only" (grey cloud) for the ~2 minutes this script runs, then switch it
# back to "Proxied" and set SSL/TLS mode to "Full (strict)". Renewals afterwards
# work with the proxy on (nginx serves /.well-known over plain HTTP).

DOMAINS=(benichi.dev www.benichi.dev)
[ -f .env ] || { echo "deploy/.env missing (copy from .env.example)"; exit 1; }
[ -f nginx/htpasswd ] || { echo "nginx/htpasswd missing — run ./set-admin-password.sh first"; exit 1; }
set -a; . ./.env; set +a
EMAIL="${LETSENCRYPT_EMAIL:?set LETSENCRYPT_EMAIL in deploy/.env}"
STAGING="${CERTBOT_STAGING:-0}"

compose() { docker compose "$@"; }

echo "### Building app image + starting nginx with a temporary self-signed cert"
compose build app
LIVE=/etc/letsencrypt/live/benichi.dev
compose run --rm --entrypoint sh certbot -c "
  mkdir -p $LIVE &&
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout $LIVE/privkey.pem -out $LIVE/fullchain.pem \
    -subj '/CN=benichi.dev'
"
compose up -d nginx
sleep 3

echo "### Requesting the real certificate from Let's Encrypt"
ARGS=(certonly --webroot -w /var/www/certbot --email "$EMAIL"
      --agree-tos --no-eff-email --force-renewal)
for d in "${DOMAINS[@]}"; do ARGS+=(-d "$d"); done
[ "$STAGING" = "1" ] && ARGS+=(--staging)

compose run --rm --entrypoint certbot certbot "${ARGS[@]}"

echo "### Reloading nginx and bringing everything up"
compose up -d
compose exec nginx nginx -s reload
echo "### Done. https://benichi.dev should now serve a valid certificate."
