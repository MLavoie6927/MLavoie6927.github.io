#!/usr/bin/env bash
set -u
HOST="${1:-example.com}"
PORT="${2:-443}"

echo "=== Service Health ==="
echo "Target: ${HOST}:${PORT}"
getent ahosts "$HOST" | head -n 6 || true
if command -v timeout >/dev/null && command -v bash >/dev/null; then
  if timeout 4 bash -c "</dev/tcp/$HOST/$PORT" 2>/dev/null; then
    echo "TCP: reachable"
  else
    echo "TCP: failed"
  fi
fi
if command -v openssl >/dev/null && [[ "$PORT" == "443" ]]; then
  echo | timeout 6 openssl s_client -connect "$HOST:$PORT" -servername "$HOST" 2>/dev/null | grep -E 'Protocol|Cipher|Verify return code' || true
fi
