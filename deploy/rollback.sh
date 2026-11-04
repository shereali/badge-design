#!/usr/bin/env bash
#
# Rollback Script for porichoyid
#
set -euo pipefail

APP_USER="${USER:-porichoyid}"
DIR="/var/www/${APP_USER}"
COMPOSE_FILE="$DIR/docker-compose.yml"
TARGET_TAG="${1:-}"

if [ -z "$TARGET_TAG" ]; then
    echo "Usage: ./deploy/rollback.sh <IMAGE_TAG>"
    exit 1
fi

echo "=== Rolling back $APP_USER to tag: $TARGET_TAG ==="
sed -i "s|^IMAGE_TAG=.*|IMAGE_TAG=$TARGET_TAG|" "$DIR/.env"
docker compose -f "$COMPOSE_FILE" pull web
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans web
echo "=== Rollback complete! ==="

