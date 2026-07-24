#!/usr/bin/env bash
# OBJETIVO DO SCRIPT: Implementa a responsabilidade definida pelo arquivo start-web.sh.
# Comentários explicam os passos operacionais e preservam os comandos originais.
# Ativa opções de segurança do shell para falhar cedo e evitar estados inconsistentes.
set -euo pipefail
# Define uma variável reutilizada pelos comandos seguintes.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# Posiciona a execução no diretório esperado pelo próximo comando.
cd "$ROOT/apps/web"
exec npm start
