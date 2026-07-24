#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "[reset] Encerrando processos antigos nas portas 4200 e 8080..."
fuser -k 4200/tcp 8080/tcp >/dev/null 2>&1 || true

echo "[reset] Removendo build Java antigo..."
rm -rf apps/api/target

echo "[reset] Mantendo somente a estrutura inicial V1..."
find apps/api/src/main/resources/db/migration -maxdepth 1 -type f ! -name 'V1__operacao_base.sql' -delete

echo "[reset] Apagando completamente o banco local e seus volumes..."
docker compose down -v --remove-orphans

echo "[reset] Preparando dependências..."
./deploy/local/setup.sh

echo "[reset] Criando o SIGACrim do zero pela V1..."
exec ./deploy/local/start.sh
