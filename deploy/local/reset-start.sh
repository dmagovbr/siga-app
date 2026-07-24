#!/usr/bin/env bash
# OBJETIVO DO SCRIPT: Implementa a responsabilidade definida pelo arquivo reset-start.sh.
# Comentários explicam os passos operacionais e preservam os comandos originais.
# Ativa opções de segurança do shell para falhar cedo e evitar estados inconsistentes.
set -Eeuo pipefail

# Define uma variável reutilizada pelos comandos seguintes.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# Posiciona a execução no diretório esperado pelo próximo comando.
cd "$ROOT_DIR"

# Mostra ao desenvolvedor o estado atual da execução.
echo "[reset] Encerrando processos antigos nas portas 4200 e 8080..."
fuser -k 4200/tcp 8080/tcp >/dev/null 2>&1 || true

# Mostra ao desenvolvedor o estado atual da execução.
echo "[reset] Removendo build Java antigo..."
rm -rf apps/api/target

# Mostra ao desenvolvedor o estado atual da execução.
echo "[reset] Mantendo somente a estrutura inicial V1..."
find apps/api/src/main/resources/db/migration -maxdepth 1 -type f ! -name 'V1__operacao_base.sql' -delete

# Mostra ao desenvolvedor o estado atual da execução.
echo "[reset] Apagando completamente o banco local e seus volumes..."
# Controla o serviço em contêiner usado pelo ambiente local.
docker compose down -v --remove-orphans

# Mostra ao desenvolvedor o estado atual da execução.
echo "[reset] Preparando dependências..."
./deploy/local/setup.sh

# Mostra ao desenvolvedor o estado atual da execução.
echo "[reset] Criando o SIGACrim do zero pela V1..."
exec ./deploy/local/start.sh
