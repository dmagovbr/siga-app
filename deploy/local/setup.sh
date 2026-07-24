#!/usr/bin/env bash
# OBJETIVO DO SCRIPT: Implementa a responsabilidade definida pelo arquivo setup.sh.
# Comentários explicam os passos operacionais e preservam os comandos originais.
# Ativa opções de segurança do shell para falhar cedo e evitar estados inconsistentes.
set -euo pipefail
# Define uma variável reutilizada pelos comandos seguintes.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

command -v java >/dev/null || { echo "ERRO: Java 21 não encontrado."; exit 1; }
command -v node >/dev/null || { echo "ERRO: Node.js não encontrado."; exit 1; }
command -v npm >/dev/null || { echo "ERRO: npm não encontrado."; exit 1; }
command -v docker >/dev/null || { echo "ERRO: Docker não encontrado."; exit 1; }

# Verifica uma condição antes de executar o bloco correspondente.
if ! command -v mvn >/dev/null; then
  # Mostra ao desenvolvedor o estado atual da execução.
  echo "Maven não encontrado. Instale com: sudo apt update && sudo apt install -y maven"
  exit 1
fi

# Mostra ao desenvolvedor o estado atual da execução.
echo "[setup] Iniciando PostgreSQL..."
"$ROOT/deploy/local/db-start.sh"

# Mostra ao desenvolvedor o estado atual da execução.
echo "[setup] Instalando dependências Angular..."
# Posiciona a execução no diretório esperado pelo próximo comando.
cd "$ROOT/apps/web"
# Executa a ferramenta principal desta etapa do projeto.
npm install

# Mostra ao desenvolvedor o estado atual da execução.
echo "[setup] Validando API Java..."
# Posiciona a execução no diretório esperado pelo próximo comando.
cd "$ROOT/apps/api"
# Executa a ferramenta principal desta etapa do projeto.
mvn -q -DskipTests package

# Mostra ao desenvolvedor o estado atual da execução.
echo "[setup] Concluído. Execute: ./deploy/local/start.sh"
