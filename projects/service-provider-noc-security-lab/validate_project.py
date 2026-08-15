#!/usr/bin/env python3
"""Static acceptance gate for the public Service Provider NOC Security Lab."""

from __future__ import annotations

import ipaddress
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
REQUIRED_FILES = {
    "index.html",
    "lab.css",
    "lab.js",
    "architecture.svg",
    "README.md",
    "BUILD-RUNBOOK.md",
    "ROUTER-CONFIGURATIONS.txt",
    "PALO-ALTO-CONFIGURATION.txt",
    "SIEM-AND-DETECTION.txt",
    "INCIDENT-RESPONSE.md",
    "noc_security_health_check.py",
    "sample_telemetry.json",
    "VALIDATION.md",
}
REQUIRED_ROUTER_ROLES = {
    "ISP-1",
    "EDGE-1",
    "P1",
    "P2",
    "P3",
    "PE1",
    "PE2",
    "CE-A1",
    "CE-A2",
    "CE-B1",
}
REQUIRED_SCENARIOS = {
    "normal",
    "ddos",
    "compromise",
    "routing_failure",
    "route_leak",
}
ALLOWED_PUBLIC_NETWORKS = tuple(
    ipaddress.ip_network(prefix)
    for prefix in (
        "192.0.2.0/24",
        "198.51.100.0/24",
        "203.0.113.0/24",
    )
)


class Gate:
    def __init__(self) -> None:
        self.assertions = 0
        self.errors: list[str] = []

    def require(self, condition: bool, message: str) -> None:
        self.assertions += 1
        if not condition:
            self.errors.append(message)


def local_links(html: str) -> set[str]:
    links = set(re.findall(r'href="([^"]+)"', html))
    return {
        link.split("#", 1)[0]
        for link in links
        if link and not link.startswith(("#", "http://", "https://", "mailto:"))
    }


def scan_addresses(text: str) -> list[str]:
    findings: list[str] = []
    candidates = set(re.findall(r"(?<![\d.])(?:\d{1,3}\.){3}\d{1,3}(?![\d.])", text))
    for candidate in sorted(candidates):
        try:
            address = ipaddress.ip_address(candidate)
        except ValueError:
            continue
        allowed = (
            address.is_private
            or address.is_loopback
            or address.is_link_local
            or address.is_unspecified
            or any(address in network for network in ALLOWED_PUBLIC_NETWORKS)
        )
        if not allowed:
            findings.append(candidate)
    return findings


def main() -> int:
    gate = Gate()
    existing = {path.name for path in ROOT.iterdir() if path.is_file()}

    for name in sorted(REQUIRED_FILES):
        gate.require(name in existing, f"Missing required file: {name}")

    text_files = {
        path.name: path.read_text(encoding="utf-8")
        for path in ROOT.iterdir()
        if path.is_file() and path.suffix.lower() in {".html", ".css", ".js", ".svg", ".md", ".txt", ".py", ".json"}
    }

    html = text_files.get("index.html", "")
    for target in sorted(local_links(html)):
        gate.require((ROOT / target).is_file() or (ROOT / target).is_dir(), f"Broken local link: {target}")

    gate.require(html.count('class="scenario-button') == 5, "Dashboard must expose five scenario buttons")
    gate.require("Service Provider NOC Security Engineering Lab" in html, "Project title missing from page")
    gate.require("not affiliated" in html.lower(), "Affiliation boundary missing from page")
    gate.require("synthetic evidence" in html.lower(), "Synthetic-evidence boundary missing from page")

    router_config = text_files.get("ROUTER-CONFIGURATIONS.txt", "")
    for role in sorted(REQUIRED_ROUTER_ROLES):
        gate.require(role in router_config, f"Router role missing from configuration: {role}")
    for token in (
        "router ospf 100",
        "mpls ldp router-id",
        "address-family vpnv4",
        "vrf definition CUST_A",
        "vrf definition CUST_B",
        "maximum-prefix",
        "route-map CUST-A-SITE1-IN",
        "show mpls forwarding-table",
    ):
        gate.require(token in router_config, f"Required routing control missing: {token}")

    firewall = text_files.get("PALO-ALTO-CONFIGURATION.txt", "")
    for token in (
        "DENY-UNTRUST-ICMP",
        "ALLOW-PUBLIC-WEB",
        "ALLOW-PUBLIC-DNS",
        "DEFAULT-DENY",
        "zone-protection-profile",
        "dos-protection",
        "RTBH",
        "ROLLBACK",
    ):
        gate.require(token in firewall, f"Required NGFW control missing: {token}")

    detections = text_files.get("SIEM-AND-DETECTION.txt", "")
    for token in ("SYN RATE ANOMALY", "RARE DNS", "BGP PREFIX REJECT", "TELEMETRY INGESTION", "WIRESHARK"):
        gate.require(token in detections, f"Required detection content missing: {token}")

    telemetry = json.loads(text_files.get("sample_telemetry.json", "{}"))
    gate.require(telemetry.get("metadata", {}).get("synthetic") is True, "Telemetry must declare synthetic=true")
    scenario_names = set(telemetry.get("scenarios", {}))
    gate.require(scenario_names == REQUIRED_SCENARIOS, "Synthetic scenario set does not match acceptance criteria")

    published_content = {
        name: content
        for name, content in text_files.items()
        if name != "validate_project.py"
    }
    combined = "\n".join(published_content.values())
    gate.require("--flood" not in combined, "Unbounded flood option must not appear")
    gate.require("api_key" not in combined.lower(), "API-key field must not appear")
    gate.require("BEGIN PRIVATE KEY" not in combined, "Private key material must not appear")
    unsafe_addresses = scan_addresses(combined)
    gate.require(not unsafe_addresses, f"Non-documentation public IP addresses found: {', '.join(unsafe_addresses)}")

    if gate.errors:
        print(f"STATIC VALIDATION FAILED: {len(gate.errors)} errors across {gate.assertions} assertions")
        for error in gate.errors:
            print(f"- {error}")
        return 1

    print(f"STATIC VALIDATION PASSED: {gate.assertions} assertions, 0 errors")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
