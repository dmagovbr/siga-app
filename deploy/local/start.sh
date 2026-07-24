#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WEB_PORT=4200
API_PORT=8080
PIDS=()
CLEANED_UP=0

kill_port() {
  local port="$1"

  if ! command -v fuser >/dev/null 2>&1; then
    echo "[start] ERRO: comando 'fuser' não encontrado."
    echo "[start] Instale com: sudo apt update && sudo apt install -y psmisc"
    exit 1
  fi

  if fuser "${port}/tcp" >/dev/null 2>&1; then
    echo "[start] Liberando porta ${port}..."
    fuser -k "${port}/tcp" >/dev/null 2>&1 || true
    sleep 1
  fi

  if fuser "${port}/tcp" >/dev/null 2>&1; then
    echo "[start] Forçando liberação da porta ${port}..."
    fuser -k -9 "${port}/tcp" >/dev/null 2>&1 || true
    sleep 1
  fi

  if fuser "${port}/tcp" >/dev/null 2>&1; then
    echo "[start] ERRO: a porta ${port} continua ocupada."
    fuser -v "${port}/tcp" || true
    exit 1
  fi
}

stop_group() {
  local pid="$1"
  kill -- "-${pid}" >/dev/null 2>&1 || kill "${pid}" >/dev/null 2>&1 || true
}

cleanup() {
  local exit_code=$?

  if [[ "$CLEANED_UP" -eq 1 ]]; then
    return
  fi
  CLEANED_UP=1

  trap - EXIT INT TERM
  echo
  echo "[start] Encerrando SIGACrim..."

  for pid in "${PIDS[@]:-}"; do
    [[ -n "$pid" ]] && stop_group "$pid"
  done

  sleep 1

  for pid in "${PIDS[@]:-}"; do
    [[ -n "$pid" ]] && kill -9 -- "-${pid}" >/dev/null 2>&1 || true
  done

  wait 2>/dev/null || true
  exit "$exit_code"
}

trap cleanup EXIT INT TERM

cd "$ROOT"

echo "[start] Verificando portas locais..."
kill_port "$WEB_PORT"
kill_port "$API_PORT"

"$ROOT/deploy/local/db-start.sh"

if [[ ! -d "$ROOT/apps/web/node_modules" ]]; then
  echo "[start] ERRO: dependências do Angular não encontradas."
  echo "[start] Execute primeiro: ./deploy/local/setup.sh"
  exit 1
fi

if ! command -v mvn >/dev/null 2>&1; then
  echo "[start] ERRO: Maven não encontrado no PATH."
  echo "[start] Execute primeiro: ./deploy/local/setup.sh"
  exit 1
fi

echo "[start] Iniciando API Java na porta ${API_PORT}..."
setsid bash -lc "cd '$ROOT/apps/api' && exec mvn spring-boot:run" &
PIDS+=("$!")

echo "[start] Iniciando Angular na porta ${WEB_PORT}..."
setsid bash -lc "cd '$ROOT/apps/web' && exec npm start" &
PIDS+=("$!")

echo "[start] SIGACrim iniciado. Pressione Ctrl+C para encerrar."
echo "[start] Site: http://localhost:${WEB_PORT}"
echo "[start] API:  http://localhost:${API_PORT}/api/health"
echo "[start] Operações: http://localhost:${API_PORT}/api/operacoes"
echo "[start] PostgreSQL: localhost:5432/sigacrim"

wait -n "${PIDS[@]}"
