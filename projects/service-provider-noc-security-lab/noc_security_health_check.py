#!/usr/bin/env python3
"""Offline NOC/security health check for public-safe synthetic telemetry."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any


STATE_RANK = {"PASS": 0, "WARNING": 1, "CRITICAL": 2}
EXIT_CODE = {"PASS": 0, "WARNING": 1, "CRITICAL": 2}


@dataclass(frozen=True)
class Check:
    name: str
    state: str
    value: str
    expected: str
    recommendation: str = ""


def worsen(current: str, candidate: str) -> str:
    return candidate if STATE_RANK[candidate] > STATE_RANK[current] else current


def add_check(
    checks: list[Check],
    name: str,
    state: str,
    value: str,
    expected: str,
    recommendation: str = "",
) -> None:
    if state not in STATE_RANK:
        raise ValueError(f"Unsupported check state: {state}")
    checks.append(Check(name, state, value, expected, recommendation))


def load_document(path: Path) -> dict[str, Any]:
    try:
        document = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"Input file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Input is not valid JSON: {exc}") from exc

    metadata = document.get("metadata")
    scenarios = document.get("scenarios")
    thresholds = document.get("thresholds")

    if not isinstance(metadata, dict) or metadata.get("synthetic") is not True:
        raise ValueError("Input must explicitly declare metadata.synthetic=true")
    if not isinstance(scenarios, dict) or not scenarios:
        raise ValueError("Input must contain at least one scenario")
    if not isinstance(thresholds, dict):
        raise ValueError("Input must contain thresholds")
    return document


def required(mapping: dict[str, Any], key: str, context: str) -> Any:
    if key not in mapping:
        raise ValueError(f"Missing {context}.{key}")
    return mapping[key]


def evaluate_scenario(document: dict[str, Any], scenario_name: str) -> dict[str, Any]:
    scenarios = document["scenarios"]
    if scenario_name not in scenarios:
        choices = ", ".join(sorted(scenarios))
        raise ValueError(f"Unknown scenario '{scenario_name}'. Available: {choices}")

    scenario = scenarios[scenario_name]
    devices = required(scenario, "devices", scenario_name)
    metrics = required(scenario, "metrics", scenario_name)
    security = required(scenario, "security", scenario_name)
    thresholds = document["thresholds"]
    checks: list[Check] = []
    overall = "PASS"

    bgp = required(devices, "bgp_neighbors", f"{scenario_name}.devices")
    bgp_state = "PASS" if bgp["up"] == bgp["expected"] else "CRITICAL"
    add_check(
        checks,
        "BGP neighbors",
        bgp_state,
        f"{bgp['up']} / {bgp['expected']} up",
        "All expected peers established",
        "Inspect peer state, policy, transport, and last notification." if bgp_state != "PASS" else "",
    )
    overall = worsen(overall, bgp_state)

    ospf = required(devices, "ospf_neighbors", f"{scenario_name}.devices")
    ospf_state = "PASS" if ospf["up"] == ospf["expected"] else "WARNING"
    add_check(
        checks,
        "OSPF neighbors",
        ospf_state,
        f"{ospf['up']} / {ospf['expected']} up",
        "All expected adjacencies established",
        "Correlate interface, BFD, OSPF, and change telemetry." if ospf_state != "PASS" else "",
    )
    overall = worsen(overall, ospf_state)

    lsp_status = str(required(devices, "mpls_lsp_status", f"{scenario_name}.devices"))
    if lsp_status == "healthy":
        lsp_state = "PASS"
    elif lsp_status == "rerouted":
        lsp_state = "WARNING"
    else:
        lsp_state = "CRITICAL"
    add_check(
        checks,
        "MPLS LSPs",
        lsp_state,
        lsp_status,
        "Healthy primary and redundant transport",
        "Verify IGP reachability, LDP peers, bindings, and LFIB." if lsp_state != "PASS" else "",
    )
    overall = worsen(overall, lsp_state)

    sites = required(devices, "customer_sites", f"{scenario_name}.devices")
    sites_state = "PASS" if sites["up"] == sites["expected"] else "CRITICAL"
    add_check(
        checks,
        "Customer sites",
        sites_state,
        f"{sites['up']} / {sites['expected']} reachable",
        "All customer synthetic transactions pass",
        "Trace service path across CE, VRF, MPLS, NGFW, and application." if sites_state != "PASS" else "",
    )
    overall = worsen(overall, sites_state)

    for key, label in (("firewall_status", "NGFW"), ("suricata_status", "Suricata sensor")):
        value = str(required(devices, key, f"{scenario_name}.devices"))
        state = "PASS" if value in {"healthy", "protecting"} else "CRITICAL"
        add_check(
            checks,
            label,
            state,
            value,
            "Healthy and reporting",
            f"Validate {label} service state and telemetry path." if state != "PASS" else "",
        )
        overall = worsen(overall, state)

    siem_age = float(required(devices, "siem_last_event_age_seconds", f"{scenario_name}.devices"))
    stale_limit = float(required(thresholds, "siem_stale_seconds", "thresholds"))
    siem_state = "PASS" if siem_age <= stale_limit else "CRITICAL"
    add_check(
        checks,
        "SIEM ingestion",
        siem_state,
        f"last event {siem_age:.0f}s ago",
        f"fresh within {stale_limit:.0f}s",
        "Check source, queue, parser, index, clock, and ingestion pipeline." if siem_state != "PASS" else "",
    )
    overall = worsen(overall, siem_state)

    utilization = float(required(metrics, "circuit_utilization_percent", f"{scenario_name}.metrics"))
    util_warning = float(required(thresholds, "circuit_utilization_warning_percent", "thresholds"))
    util_critical = float(required(thresholds, "circuit_utilization_critical_percent", "thresholds"))
    if utilization >= util_critical:
        util_state = "CRITICAL"
    elif utilization >= util_warning:
        util_state = "WARNING"
    else:
        util_state = "PASS"
    add_check(
        checks,
        "Circuit utilization",
        util_state,
        f"{utilization:.1f}%",
        f"warning < {util_warning:.1f}%, critical < {util_critical:.1f}%",
        "Locate the bottleneck and prepare upstream mitigation if saturation is attack-driven."
        if util_state != "PASS"
        else "",
    )
    overall = worsen(overall, util_state)

    syn_rate = int(required(metrics, "syn_rate_pps", f"{scenario_name}.metrics"))
    syn_warning = int(required(thresholds, "syn_rate_warning_pps", "thresholds"))
    syn_critical = int(required(thresholds, "syn_rate_critical_pps", "thresholds"))
    if syn_rate >= syn_critical:
        syn_state = "CRITICAL"
    elif syn_rate >= syn_warning:
        syn_state = "WARNING"
    else:
        syn_state = "PASS"
    add_check(
        checks,
        "SYN rate",
        syn_state,
        f"{syn_rate:,} pps",
        f"warning < {syn_warning:,}, critical < {syn_critical:,} pps",
        "Correlate SYN/ACK ratio, source distribution, service health, NGFW state, and circuit capacity."
        if syn_state != "PASS"
        else "",
    )
    overall = worsen(overall, syn_state)

    loss = float(required(metrics, "packet_loss_percent", f"{scenario_name}.metrics"))
    loss_warning = float(required(thresholds, "packet_loss_warning_percent", "thresholds"))
    loss_state = "PASS" if loss < loss_warning else "WARNING"
    add_check(
        checks,
        "Packet loss",
        loss_state,
        f"{loss:.2f}%",
        f"less than {loss_warning:.2f}%",
        "Correlate path, queue drops, interface errors, congestion, and application health."
        if loss_state != "PASS"
        else "",
    )
    overall = worsen(overall, loss_state)

    latency = float(required(metrics, "average_latency_ms", f"{scenario_name}.metrics"))
    latency_warning = float(required(thresholds, "latency_warning_ms", "thresholds"))
    latency_state = "PASS" if latency < latency_warning else "WARNING"
    add_check(
        checks,
        "Average latency",
        latency_state,
        f"{latency:.1f} ms",
        f"less than {latency_warning:.1f} ms",
        "Compare the current path to baseline and locate queueing or service delay."
        if latency_state != "PASS"
        else "",
    )
    overall = worsen(overall, latency_state)

    rare_dns = int(required(security, "rare_dns_queries", f"{scenario_name}.security"))
    powershell = int(required(security, "suspicious_powershell_events", f"{scenario_name}.security"))
    if rare_dns > 0 and powershell > 0:
        endpoint_state = "CRITICAL"
        endpoint_recommendation = (
            "Preserve evidence, validate process ancestry and egress, scope related assets, and contain under authority."
        )
    elif rare_dns > 0 or powershell > 0:
        endpoint_state = "WARNING"
        endpoint_recommendation = "Investigate context before classifying the behavior as malicious."
    else:
        endpoint_state = "PASS"
        endpoint_recommendation = ""
    add_check(
        checks,
        "Endpoint/network correlation",
        endpoint_state,
        f"rare DNS={rare_dns}, suspicious PowerShell={powershell}",
        "No correlated endpoint and egress anomaly",
        endpoint_recommendation,
    )
    overall = worsen(overall, endpoint_state)

    prefix_rejected = bool(required(security, "unauthorized_prefix_rejected", f"{scenario_name}.security"))
    if prefix_rejected:
        prefix_state = "WARNING"
        prefix_value = f"rejected {security.get('rejected_prefix', 'unauthorized prefix')}"
        prefix_recommendation = "Verify no RIB/FIB change, preserve policy counters, and review with the peer owner."
    else:
        prefix_state = "PASS"
        prefix_value = "no unauthorized update observed"
        prefix_recommendation = ""
    add_check(
        checks,
        "BGP routing security",
        prefix_state,
        prefix_value,
        "Only authorized customer prefixes accepted",
        prefix_recommendation,
    )
    overall = worsen(overall, prefix_state)

    return {
        "scenario": scenario_name,
        "display_name": required(scenario, "display_name", scenario_name),
        "event_id": required(scenario, "event_id", scenario_name),
        "state": overall,
        "checks": [asdict(check) for check in checks],
        "observations": scenario.get("observations", []),
        "expected_state": required(scenario, "expected_state", scenario_name),
        "synthetic": True,
    }


def render_text(result: dict[str, Any]) -> str:
    lines = [
        "=" * 68,
        "             NOC SECURITY HEALTH CHECK",
        "=" * 68,
        f"Scenario: {result['display_name']}",
        f"Event:    {result['event_id']}",
        f"State:    {result['state']} (SYNTHETIC)",
        "-" * 68,
    ]

    for check in result["checks"]:
        lines.append(f"{check['name']:<31} {check['state']:<8} {check['value']}")

    recommendations = [
        (check["name"], check["recommendation"])
        for check in result["checks"]
        if check["recommendation"]
    ]
    if recommendations:
        lines.extend(["", "RECOMMENDED NEXT ACTIONS", "-" * 68])
        for name, recommendation in recommendations:
            lines.append(f"- {name}: {recommendation}")

    if result["observations"]:
        lines.extend(["", "OBSERVATIONS", "-" * 68])
        lines.extend(f"- {item}" for item in result["observations"])

    lines.extend(
        [
            "",
            "Evidence boundary: this output evaluates public-safe synthetic data.",
            "It is not proof of a live or production deployment.",
            "=" * 68,
        ]
    )
    return "\n".join(lines)


def self_test(document: dict[str, Any]) -> int:
    failures: list[str] = []
    for scenario_name in sorted(document["scenarios"]):
        result = evaluate_scenario(document, scenario_name)
        if result["state"] != result["expected_state"]:
            failures.append(
                f"{scenario_name}: expected {result['expected_state']}, got {result['state']}"
            )

    if failures:
        print("SELF-TEST FAILED")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"SELF-TEST PASSED: {len(document['scenarios'])} scenarios matched expected state")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Evaluate public-safe synthetic NOC/security telemetry."
    )
    parser.add_argument(
        "--input",
        type=Path,
        default=Path(__file__).with_name("sample_telemetry.json"),
        help="Path to synthetic telemetry JSON.",
    )
    parser.add_argument(
        "--scenario",
        default="normal",
        help="Scenario name to evaluate.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit structured JSON instead of the text dashboard.",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Validate every scenario against its expected state.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        document = load_document(args.input)
        if args.self_test:
            return self_test(document)
        result = evaluate_scenario(document, args.scenario)
    except (OSError, ValueError, TypeError, KeyError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 3

    if args.json:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        print(render_text(result))
    return EXIT_CODE[result["state"]]


if __name__ == "__main__":
    raise SystemExit(main())
