#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Build + (re)start the stack. Run after `git pull` to ship new changes.
# First-time setup: run ./init-letsencrypt.sh instead.

[ -f .env ] || { echo "deploy/.env missing (copy from .env.example)"; exit 1; }
[ -f nginx/htpasswd ] || { echo "nginx/htpasswd missing — run ./set-admin-password.sh"; exit 1; }

docker compose build app
docker compose up -d
docker compose exec nginx nginx -t && docker compose exec nginx nginx -s reload
docker compose ps
