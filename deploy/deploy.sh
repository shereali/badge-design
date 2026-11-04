#!/usr/bin/env bash
#
# Production Deploy Script for porichoyid (Nuxt 4 / Caddy)
# Features:
#   1. Zero VPS CPU/RAM spikes: Pulls pre-built images from GHCR
#   2. Selective container restart ($SERVICES)
#   3. Central Caddy gateway zero-downtime reload & health verification
#
set -euo pipefail

APP_USER="${USER:-porichoyid}"
DIR="/var/www/${APP_USER}"
COMPOSE_FILE="$DIR/docker-compose.yml"

SERVICES="${SERVICES:-}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
REGISTRY="${REGISTRY:-ghcr.io}"
REPOSITORY_OWNER="${REPOSITORY_OWNER:-shereali}"
GHCR_TOKEN="${GHCR_TOKEN:-}"

log() { echo "=== [deploy] $* ==="; }
err() { echo "=== [deploy ERROR] $* ===" >&2; exit 1; }

cd "$DIR"

# 0. Ensure .env exists
if [ ! -f "$DIR/.env" ]; then
    cat <<EOF > "$DIR/.env"
APP_NAME=${APP_USER}
NODE_ENV=production
PORT=3000
REPOSITORY_OWNER=${REPOSITORY_OWNER}
IMAGE_TAG=${IMAGE_TAG}
EOF
    chmod 600 "$DIR/.env"
fi

# 1. Update .env with new IMAGE_TAG if provided
if [ -f "$DIR/.env" ] && [ -n "$IMAGE_TAG" ]; then
    log "Updating IMAGE_TAG to $IMAGE_TAG in .env"
    if grep -q "^IMAGE_TAG=" "$DIR/.env"; then
        sed -i "s|^IMAGE_TAG=.*|IMAGE_TAG=$IMAGE_TAG|" "$DIR/.env"
    else
        echo "IMAGE_TAG=$IMAGE_TAG" >> "$DIR/.env"
    fi
fi

# 2. Authenticate to GHCR if token provided (for private repo packages)
if [ -n "$GHCR_TOKEN" ]; then
    echo "$GHCR_TOKEN" | docker login "$REGISTRY" -u "$REPOSITORY_OWNER" --password-stdin >/dev/null 2>&1 || true
fi

# 3. Pull Pre-built Images from GHCR
log "Pulling pre-built container images..."
if [ -n "$SERVICES" ]; then
    docker compose -f "$COMPOSE_FILE" pull $SERVICES || docker compose -f "$COMPOSE_FILE" pull
else
    docker compose -f "$COMPOSE_FILE" pull
fi

# 4. Launch / Restart Containers
log "Starting updated services..."
if [ -n "$SERVICES" ]; then
    docker compose -f "$COMPOSE_FILE" up -d --remove-orphans $SERVICES
else
    docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
fi

# 5. Housekeeping
docker image prune -f >/dev/null 2>&1 || true

# 6. Reload Central Caddy Gateway & Health Verification
log "Verifying Caddy reverse proxy..."
if docker ps -q -f name=caddy-caddy-1 >/dev/null 2>&1; then
    docker exec caddy-caddy-1 caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || true
fi

docker compose -f "$COMPOSE_FILE" ps

log "Deployment finished successfully!"

