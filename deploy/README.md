# Deploying benichi.dev

Next.js 15 portfolio + PostgreSQL-backed CMS, containerised and served by nginx
with a Let's Encrypt certificate. Built and tested on this host (Ubuntu 24.04,
Docker + compose v2).

```
deploy/
  docker-compose.yml        db (Postgres) + app (Next.js standalone) + nginx + certbot
  .env.example              copy to .env, fill in
  init-letsencrypt.sh       one-time TLS bootstrap
  set-admin-password.sh     create the nginx Basic-Auth user for /admin
  deploy.sh                 rebuild + restart after a git pull
  nginx/
    conf.d/benichi.dev.conf         vhost, routing, /admin + /api/admin gate, /uploads
    conf.d/00-cloudflare-realip.conf  restore visitor IP behind Cloudflare
    snippets/                       proxy / ssl / restricted includes
```

## What runs where

| Path | Access |
|------|--------|
| `/`, `/api/contact`, `/api/health`, `/uploads/*` | public |
| `/admin/**` (pages + server actions) | nginx Basic Auth, then the app's own login form |
| `/api/admin/*` (image upload, asset list) | nginx Basic Auth + app session |

All landing-page content lives in **PostgreSQL** (`db` service, `pgdata` volume)
and is edited from `/admin`. `prisma migrate deploy` + an idempotent seed run on
every app start (see `docker-entrypoint.sh`). Uploaded images live on the
`uploads` volume, shared read-only with nginx and served at `/uploads/*`.

## First-time setup

1. **DNS (Cloudflare).** `A benichi.dev 169.58.8.216` (and `www`). For the first
   cert set it to **DNS only** (grey cloud) for a couple of minutes.

2. **Config:**
   ```bash
   cd /opt/benichi-portfolio/deploy
   cp .env.example .env && $EDITOR .env   # admin creds, SMTP, POSTGRES_PASSWORD, LETSENCRYPT_EMAIL
   ./set-admin-password.sh benichi        # nginx Basic-Auth user
   ```

3. **Bootstrap TLS + start:** `./init-letsencrypt.sh`

4. **Re-enable Cloudflare:** record back to **Proxied**, SSL/TLS **Full (strict)**.
   Renewals keep working (nginx serves `/.well-known/acme-challenge/` over plain
   HTTP without redirect).

## Updates

```bash
cd /opt/benichi-portfolio && git pull
./deploy/deploy.sh          # rebuilds app (runs migrations on start), reloads nginx
```

## Ops

```bash
cd /opt/benichi-portfolio/deploy
docker compose ps
docker compose logs -f app
docker compose exec nginx nginx -s reload

# database backup / restore
docker compose exec -T db pg_dump -U benichi benichi | gzip > benichi-$(date +%F).sql.gz
gunzip -c benichi-YYYY-MM-DD.sql.gz | docker compose exec -T db psql -U benichi benichi

# uploaded images backup
docker run --rm -v benichi-portfolio_uploads:/d -v "$PWD":/b alpine \
  tar czf /b/uploads-$(date +%F).tar.gz -C /d .
```

## Optional: pin /admin to your IP

Edit `nginx/snippets/restricted.conf`, uncomment the `allow` / `deny all` lines,
set your address, reload nginx. `satisfy all` makes it IP **and** Basic Auth.
