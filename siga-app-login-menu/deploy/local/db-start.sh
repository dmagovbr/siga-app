#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
command -v docker >/dev/null || { echo "ERRO: Docker não encontrado."; exit 1; }
docker compose -f "$ROOT/docker-compose.yml" up -d postgres
echo "[db] PostgreSQL disponível em localhost:5432/sigacrim"
