#!/bin/sh
set -e

echo "→ prisma migrate deploy"
node node_modules/prisma/build/index.js migrate deploy

echo "→ seed (idempotent)"
node prisma/seed.mjs || echo "  seed reported an error (continuing)"

echo "→ starting Next.js"
exec node server.js
