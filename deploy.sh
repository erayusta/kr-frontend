#!/bin/bash
set -e

APP_NAME="kr-frontend-app"
IMAGE_NAME="kr-frontend"
PORT="127.0.0.1:3000:3000"
NETWORK="kr-backend_kampanyaradar_network"
INTERNAL_API="http://kampanyaradar_backend/api/v1"

# Renk kodları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERROR]${NC} $1"; }

# 1. Kodu çek
log "Pulling latest code..."
git pull || { err "git pull failed"; exit 1; }

# 2. Docker image build (BuildKit + cache)
log "Building Docker image..."
DOCKER_BUILDKIT=1 docker build \
  -t ${IMAGE_NAME}:latest \
  -t ${IMAGE_NAME}:$(git rev-parse --short HEAD) \
  . || {
  err "Docker build failed"
  exit 1
}

# 3. Eski container'ı durdur ve kaldır
log "Stopping old container..."
docker stop ${APP_NAME} 2>/dev/null || true
docker rm ${APP_NAME} 2>/dev/null || true

# 4. Yeni container'ı başlat
log "Starting new container..."
docker run -d \
  -p ${PORT} \
  --network=${NETWORK} \
  -e INTERNAL_API_URL=${INTERNAL_API} \
  --restart=unless-stopped \
  --name ${APP_NAME} \
  ${IMAGE_NAME}:latest

# 5. Health check (max 30 saniye)
log "Waiting for health check..."
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:3000 > /dev/null 2>&1; then
    log "Health check passed!"
    break
  fi
  if [ $i -eq 30 ]; then
    err "Health check failed after 30s"
    docker logs --tail 20 ${APP_NAME}
    exit 1
  fi
  sleep 1
done

# 6. Eski image'ları temizle (son 3'ü koru)
log "Cleaning up old images..."
docker image prune -f > /dev/null 2>&1 || true

log "Deploy complete! $(git rev-parse --short HEAD)"
