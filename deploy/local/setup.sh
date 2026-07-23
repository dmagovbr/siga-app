#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

command -v java >/dev/null || { echo "ERRO: Java 21 não encontrado."; exit 1; }
command -v node >/dev/null || { echo "ERRO: Node.js não encontrado."; exit 1; }
command -v npm >/dev/null || { echo "ERRO: npm não encontrado."; exit 1; }

if ! command -v mvn >/dev/null; then
  echo "Maven não encontrado. Instale com: sudo apt update && sudo apt install -y maven"
  exit 1
fi

echo "[setup] Instalando dependências Angular..."
cd "$ROOT/apps/web"
npm install

echo "[setup] Validando API Java..."
cd "$ROOT/apps/api"
mvn -q -DskipTests package

echo "[setup] Concluído. Execute: ./deploy/local/start.sh"
