#!/usr/bin/env bash
# OBJETIVO DO SCRIPT: Implementa a responsabilidade definida pelo arquivo start.sh.
# Comentários explicam os passos operacionais e preservam os comandos originais.
# Ativa opções de segurança do shell para falhar cedo e evitar estados inconsistentes.
set -Eeuo pipefail

# Define uma variável reutilizada pelos comandos seguintes.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# Define uma variável reutilizada pelos comandos seguintes.
WEB_PORT=4200
# Define uma variável reutilizada pelos comandos seguintes.
API_PORT=8080
# Define uma variável reutilizada pelos comandos seguintes.
PIDS=()
# Define uma variável reutilizada pelos comandos seguintes.
CLEANED_UP=0

kill_port() {
  # Define uma variável reutilizada pelos comandos seguintes.
  local port="$1"

  # Verifica uma condição antes de executar o bloco correspondente.
  if ! command -v fuser >/dev/null 2>&1; then
    # Mostra ao desenvolvedor o estado atual da execução.
    echo "[start] ERRO: comando 'fuser' não encontrado."
    # Mostra ao desenvolvedor o estado atual da execução.
    echo "[start] Instale com: sudo apt update && sudo apt install -y psmisc"
    exit 1
  fi

  # Verifica uma condição antes de executar o bloco correspondente.
  if fuser "${port}/tcp" >/dev/null 2>&1; then
    # Mostra ao desenvolvedor o estado atual da execução.
    echo "[start] Liberando porta ${port}..."
    fuser -k "${port}/tcp" >/dev/null 2>&1 || true
    sleep 1
  fi

  # Verifica uma condição antes de executar o bloco correspondente.
  if fuser "${port}/tcp" >/dev/null 2>&1; then
    # Mostra ao desenvolvedor o estado atual da execução.
    echo "[start] Forçando liberação da porta ${port}..."
    fuser -k -9 "${port}/tcp" >/dev/null 2>&1 || true
    sleep 1
  fi

  # Verifica uma condição antes de executar o bloco correspondente.
  if fuser "${port}/tcp" >/dev/null 2>&1; then
    # Mostra ao desenvolvedor o estado atual da execução.
    echo "[start] ERRO: a porta ${port} continua ocupada."
    fuser -v "${port}/tcp" || true
    exit 1
  fi
}

stop_group() {
  # Define uma variável reutilizada pelos comandos seguintes.
  local pid="$1"
  kill -- "-${pid}" >/dev/null 2>&1 || kill "${pid}" >/dev/null 2>&1 || true
}

cleanup() {
  # Define uma variável reutilizada pelos comandos seguintes.
  local exit_code=$?

  # Verifica uma condição antes de executar o bloco correspondente.
  if [[ "$CLEANED_UP" -eq 1 ]]; then
    return
  fi
  # Define uma variável reutilizada pelos comandos seguintes.
  CLEANED_UP=1

  trap - EXIT INT TERM
  echo
  # Mostra ao desenvolvedor o estado atual da execução.
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

# Posiciona a execução no diretório esperado pelo próximo comando.
cd "$ROOT"

# Mostra ao desenvolvedor o estado atual da execução.
echo "[start] Verificando portas locais..."
kill_port "$WEB_PORT"
kill_port "$API_PORT"

"$ROOT/deploy/local/db-start.sh"

# Verifica uma condição antes de executar o bloco correspondente.
if [[ ! -d "$ROOT/apps/web/node_modules" ]]; then
  # Mostra ao desenvolvedor o estado atual da execução.
  echo "[start] ERRO: dependências do Angular não encontradas."
  # Mostra ao desenvolvedor o estado atual da execução.
  echo "[start] Execute primeiro: ./deploy/local/setup.sh"
  exit 1
fi

# Verifica uma condição antes de executar o bloco correspondente.
if ! command -v mvn >/dev/null 2>&1; then
  # Mostra ao desenvolvedor o estado atual da execução.
  echo "[start] ERRO: Maven não encontrado no PATH."
  # Mostra ao desenvolvedor o estado atual da execução.
  echo "[start] Execute primeiro: ./deploy/local/setup.sh"
  exit 1
fi

# Mostra ao desenvolvedor o estado atual da execução.
echo "[start] Iniciando API Java na porta ${API_PORT}..."
setsid bash -lc "cd '$ROOT/apps/api' && exec mvn spring-boot:run" &
# Define uma variável reutilizada pelos comandos seguintes.
PIDS+=("$!")

# Mostra ao desenvolvedor o estado atual da execução.
echo "[start] Iniciando Angular na porta ${WEB_PORT}..."
setsid bash -lc "cd '$ROOT/apps/web' && exec npm start" &
# Define uma variável reutilizada pelos comandos seguintes.
PIDS+=("$!")

# Mostra ao desenvolvedor o estado atual da execução.
echo "[start] SIGACrim iniciado. Pressione Ctrl+C para encerrar."
# Mostra ao desenvolvedor o estado atual da execução.
echo "[start] Site: http://localhost:${WEB_PORT}"
# Mostra ao desenvolvedor o estado atual da execução.
echo "[start] API:  http://localhost:${API_PORT}/api/health"
# Mostra ao desenvolvedor o estado atual da execução.
echo "[start] Operações: http://localhost:${API_PORT}/api/operacoes"
# Mostra ao desenvolvedor o estado atual da execução.
echo "[start] PostgreSQL: localhost:5432/sigacrim"

wait -n "${PIDS[@]}"
