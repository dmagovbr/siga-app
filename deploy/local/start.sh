#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PIDS=()

cleanup() {
  echo
  echo "[start] Encerrando SIGA..."
  for pid in "${PIDS[@]:-}"; do kill "$pid" 2>/dev/null || true; done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

"$ROOT/deploy/local/db-start.sh"

if [[ ! -d "$ROOT/apps/web/node_modules" ]]; then
  echo "ERRO: execute primeiro ./deploy/local/setup.sh"
  exit 1
fi

(
  cd "$ROOT/apps/api"
  exec mvn spring-boot:run
) &
PIDS+=("$!")

(
  cd "$ROOT/apps/web"
  exec npm start
) &
PIDS+=("$!")

echo "[start] SIGACrim iniciado. Pressione Ctrl+C para encerrar."
echo "[start] Site: http://localhost:4200"
echo "[start] API:  http://localhost:8080/api/health"
echo "[start] Operações: http://localhost:8080/api/operacoes"
echo "[start] PostgreSQL: localhost:5432/sigacrim"

wait -n "${PIDS[@]}"
