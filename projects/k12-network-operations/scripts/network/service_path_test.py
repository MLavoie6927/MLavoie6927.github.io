#!/usr/bin/env python3
"""
Authorized connectivity validation tool.

Tests DNS resolution and TCP connectivity to explicitly supplied destinations.
It does not scan ranges and does not discover targets.
"""

from __future__ import annotations
import argparse
import socket
import ssl
import time
from dataclasses import dataclass

@dataclass
class Result:
    host: str
    port: int
    resolved: list[str]
    connected: bool
    latency_ms: float | None
    tls: str | None
    error: str | None

def test_target(host: str, port: int, timeout: float, use_tls: bool) -> Result:
    resolved = []
    try:
        infos = socket.getaddrinfo(host, port, type=socket.SOCK_STREAM)
        resolved = sorted({item[4][0] for item in infos})
    except Exception as exc:
        return Result(host, port, [], False, None, None, f"DNS: {exc}")

    started = time.perf_counter()
    try:
        with socket.create_connection((host, port), timeout=timeout) as sock:
            latency = (time.perf_counter() - started) * 1000
            tls_info = None
            if use_tls:
                ctx = ssl.create_default_context()
                with ctx.wrap_socket(sock, server_hostname=host) as tls_sock:
                    cipher = tls_sock.cipher()
                    tls_info = f"{tls_sock.version()} / {cipher[0] if cipher else 'unknown'}"
            return Result(host, port, resolved, True, round(latency, 2), tls_info, None)
    except Exception as exc:
        return Result(host, port, resolved, False, None, None, str(exc))

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("host", help="Authorized hostname to test")
    parser.add_argument("--port", type=int, default=443)
    parser.add_argument("--timeout", type=float, default=4.0)
    parser.add_argument("--tls", action="store_true", help="Perform TLS handshake after connect")
    args = parser.parse_args()

    r = test_target(args.host, args.port, args.timeout, args.tls)
    print(f"Host: {r.host}")
    print(f"Port: {r.port}")
    print(f"Resolved: {', '.join(r.resolved) if r.resolved else 'none'}")
    print(f"Connected: {r.connected}")
    print(f"Latency_ms: {r.latency_ms}")
    print(f"TLS: {r.tls}")
    print(f"Error: {r.error}")

if __name__ == "__main__":
    main()
