#!/usr/bin/env bash
# OBJETIVO DO SCRIPT: Implementa a responsabilidade definida pelo arquivo db-start.sh.
# Comentários explicam os passos operacionais e preservam os comandos originais.
# Ativa opções de segurança do shell para falhar cedo e evitar estados inconsistentes.
set -euo pipefail
# Define uma variável reutilizada pelos comandos seguintes.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
command -v docker >/dev/null || { echo "ERRO: Docker não encontrado."; exit 1; }
# Controla o serviço em contêiner usado pelo ambiente local.
docker compose -f "$ROOT/docker-compose.yml" up -d postgres
# Mostra ao desenvolvedor o estado atual da execução.
echo "[db] PostgreSQL disponível em localhost:5432/sigacrim"
