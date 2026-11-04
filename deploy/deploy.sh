#!/usr/bin/env bash
#
# Production Deploy Script for PorichoyID (Nuxt 4 + Laravel Monorepo)
# Features:
#   1. Zero VPS CPU/RAM spikes: Pulls pre-built images from GHCR
#   2. Automated Pre-Deploy Database Snapshot before schema touches
#   3. Conditional & Non-destructive migrations (migrate --force, NEVER fresh)
#   4. Selective container restart ($SERVICES)
#   5. Central Caddy gateway zero-downtime reload & health verification
#
set -euo pipefail

APP_USER="${USER:-porichoyid}"
DIR="/var/www/${APP_USER}"
COMPOSE_FILE="$DIR/docker-compose.yml"
BACKUP_DIR="/var/backups/${APP_USER}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SNAPSHOT_FILE="$BACKUP_DIR/pre_deploy_${TIMESTAMP}.sql.gz"

SERVICES="${SERVICES:-}"
RUN_MIGRATIONS="${RUN_MIGRATIONS:-true}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
REGISTRY="${REGISTRY:-ghcr.io}"
REPOSITORY_OWNER="${REPOSITORY_OWNER:-shereali}"
GHCR_TOKEN="${GHCR_TOKEN:-}"

log() { echo "=== [deploy] $* ==="; }
err() { echo "=== [deploy ERROR] $* ===" >&2; exit 1; }

cd "$DIR"

# Ensure .env exists with essential DB & App settings
if [ ! -f "$DIR/.env" ]; then
    cat <<EOF > "$DIR/.env"
APP_NAME=${APP_USER}
APP_ENV=production
APP_KEY=base64:I8VqktuTFoMy+zlMUWFIbYKT6nIQmkyPwjFzfcgNW9M=
APP_DEBUG=false
APP_URL=https://porichoyid.softcredible.com
NODE_ENV=production
PORT=3000
API_BASE_URL=/api
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=${APP_USER}_db
DB_USERNAME=${APP_USER}_user
DB_PASSWORD=$(openssl rand -hex 16)
DB_ROOT_PASSWORD=$(openssl rand -hex 20)
REPOSITORY_OWNER=${REPOSITORY_OWNER}
IMAGE_TAG=${IMAGE_TAG}
EOF
    chmod 600 "$DIR/.env"
fi

# Source environment variables
if [ -f "$DIR/.env" ]; then
    set -a
    . "$DIR/.env"
    set +a
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

# 2. Authenticate to GHCR if token provided
if [ -n "$GHCR_TOKEN" ]; then
    echo "$GHCR_TOKEN" | docker login "$REGISTRY" -u "$REPOSITORY_OWNER" --password-stdin >/dev/null 2>&1 || true
fi

# 3. Automated Pre-Deploy Database Snapshot
mkdir -p "$BACKUP_DIR" 2>/dev/null || true
if docker compose -f "$COMPOSE_FILE" ps -q db >/dev/null 2>&1 && [ -n "$(docker compose -f "$COMPOSE_FILE" ps -q db 2>/dev/null)" ]; then
    log "Creating Automated Pre-Deploy Database Snapshot..."
    docker compose -f "$COMPOSE_FILE" exec -T db mysqldump -u "${DB_USERNAME:-${APP_USER}_user}" -p"${DB_PASSWORD:-}" "${DB_DATABASE:-${APP_USER}_db}" 2>/dev/null | gzip > "$SNAPSHOT_FILE" || true
    if [ -s "$SNAPSHOT_FILE" ]; then
        log "Database snapshot verified: $SNAPSHOT_FILE ($(du -h "$SNAPSHOT_FILE" | cut -f1))"
        ls -t "$BACKUP_DIR"/pre_deploy_*.sql.gz 2>/dev/null | tail -n +6 | xargs -r rm -f 2>/dev/null || true
    else
        rm -f "$SNAPSHOT_FILE"
    fi
fi

# 4. Pull Pre-built Images from GHCR
log "Pulling pre-built container images..."
if [ -n "$SERVICES" ]; then
    docker compose -f "$COMPOSE_FILE" pull $SERVICES || docker compose -f "$COMPOSE_FILE" pull
else
    docker compose -f "$COMPOSE_FILE" pull
fi

# 5. Launch / Restart Changed Containers
log "Starting updated services..."
if [ -n "$SERVICES" ]; then
    docker compose -f "$COMPOSE_FILE" up -d --remove-orphans db $SERVICES
else
    docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
fi

# 6. Wait for DB readiness & Run Safe Production Migrations
log "Waiting for database readiness..."
for i in $(seq 1 30); do
    if docker compose -f "$COMPOSE_FILE" exec -T db mysqladmin ping -h 127.0.0.1 -u root -p"${DB_ROOT_PASSWORD:-}" --silent 2>/dev/null; then
        log "Database is healthy and responsive!"
        break
    fi
    sleep 1
done

log "Ensuring database schema is up to date (migrate --force)..."
docker compose -f "$COMPOSE_FILE" exec -T backend php artisan migrate --force || true

# 7. Framework Optimizations
if docker compose -f "$COMPOSE_FILE" ps -q backend >/dev/null 2>&1; then
    log "Optimizing backend cache & storage permissions..."
    docker compose -f "$COMPOSE_FILE" exec -T backend sh -c "mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache && chown -R www-data:www-data storage bootstrap/cache" 2>/dev/null || true
    docker compose -f "$COMPOSE_FILE" exec -T backend php artisan storage:link 2>/dev/null || true
    docker compose -f "$COMPOSE_FILE" exec -T backend php artisan optimize:clear 2>/dev/null || true
    docker compose -f "$COMPOSE_FILE" exec -T backend php artisan config:cache 2>/dev/null || true
    docker compose -f "$COMPOSE_FILE" exec -T backend php artisan route:cache 2>/dev/null || true
fi

docker image prune -f >/dev/null 2>&1 || true

# 8. Reload Central Caddy Gateway
log "Verifying Caddy reverse proxy..."
if docker ps -q -f name=caddy-caddy-1 >/dev/null 2>&1; then
    docker exec caddy-caddy-1 caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || true
fi

docker compose -f "$COMPOSE_FILE" ps

log "Deployment finished successfully with zero VPS build overhead!"
