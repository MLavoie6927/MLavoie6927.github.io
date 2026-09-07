#!/usr/bin/env bash
set -u

echo "=== K12 Linux Network Triage ==="
date --iso-8601=seconds 2>/dev/null || date
hostname

echo
echo "=== Interfaces ==="
ip -brief address

echo
echo "=== Routes ==="
ip route

echo
echo "=== Neighbor Table ==="
ip neigh

echo
echo "=== DNS Configuration ==="
if command -v resolvectl >/dev/null 2>&1; then
  resolvectl status
else
  cat /etc/resolv.conf
fi

echo
echo "=== Listening/Established Sockets ==="
ss -tupna 2>/dev/null | head -n 50

echo
echo "=== Default Gateway Test ==="
GW="$(ip route | awk '/default/ {print $3; exit}')"
if [[ -n "${GW:-}" ]]; then
  ping -c 3 "$GW"
else
  echo "No default gateway found."
fi

echo
echo "=== External DNS Test ==="
getent hosts example.com || true
