#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Create/replace the HTTP Basic Auth user that guards /admin (nginx layer,
# separate from the app's own login form).
#   ./set-admin-password.sh <username>

USER="${1:-admin}"
read -rs -p "Basic-auth password for '$USER': " PASS; echo
HASH="$(openssl passwd -apr1 "$PASS")"
printf '%s:%s\n' "$USER" "$HASH" > nginx/htpasswd
chmod 600 nginx/htpasswd
echo "Wrote nginx/htpasswd for user '$USER'."
echo "Reload nginx to apply:  docker compose exec nginx nginx -s reload"
