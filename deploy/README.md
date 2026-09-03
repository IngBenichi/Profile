# Deploying benichi.dev

Next.js 15 portfolio, containerised and served by nginx with a Let's Encrypt
certificate. Built and tested on this host (Ubuntu 24.04, Docker + compose v2).

```
deploy/
  docker-compose.yml        app (Next.js standalone) + nginx + certbot
  .env.example              copy to .env, fill in
  init-letsencrypt.sh       one-time TLS bootstrap
  set-admin-password.sh     create the nginx Basic-Auth user for /admin
  deploy.sh                 rebuild + restart after a git pull
  nginx/
    conf.d/benichi.dev.conf         vhost, routing, /admin + /api/portfolio gate
    conf.d/00-cloudflare-realip.conf  restore visitor IP behind Cloudflare
    snippets/                       proxy / ssl / restricted includes
```

## What runs where

| Path | Access |
|------|--------|
| `/`, `/projects`, `/api/contact` | public |
| `/admin/**` (pages + server actions) | nginx Basic Auth, then the app's own login form |
| `/api/portfolio` | nginx Basic Auth (read endpoint, kept private) |

Content edited in `/admin` is written to `data/portfolio.json`, persisted in the
`portfolio-data` Docker volume — it survives image rebuilds.

## First-time setup

1. **DNS (Cloudflare).** Point `benichi.dev` (and `www`) at this host:
   `A  benichi.dev  169.58.8.216`. For the initial cert, set it to **DNS only**
   (grey cloud) for a couple of minutes.

2. **Config:**
   ```bash
   cd /opt/benichi-portfolio/deploy
   cp .env.example .env && $EDITOR .env      # admin creds, SMTP, LETSENCRYPT_EMAIL
   ./set-admin-password.sh admin             # nginx Basic-Auth user
   ```

3. **Bootstrap TLS + start:**
   ```bash
   ./init-letsencrypt.sh
   ```

4. **Re-enable Cloudflare:** switch the record back to **Proxied** (orange) and
   set SSL/TLS mode to **Full (strict)**. Renewals keep working with the proxy on
   (nginx serves `/.well-known/acme-challenge/` over plain HTTP without redirect).

## Updates

```bash
cd /opt/benichi-portfolio && git pull
./deploy/deploy.sh
```

## Ops

```bash
docker compose -f deploy/docker-compose.yml ps
docker compose -f deploy/docker-compose.yml logs -f app
docker compose -f deploy/docker-compose.yml exec nginx nginx -s reload

# back up editable content
docker run --rm -v benichi-portfolio_portfolio-data:/d -v "$PWD":/b alpine \
  tar czf /b/portfolio-data-$(date +%F).tar.gz -C /d .
```

## Optional: pin /admin to your IP

Edit `nginx/snippets/restricted.conf`, uncomment the `allow` / `deny all` lines,
set your address, then reload nginx. `satisfy all` makes it IP **and** Basic Auth.
