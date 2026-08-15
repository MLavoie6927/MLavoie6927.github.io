# Acceptance and Validation Matrix

## Validation Philosophy

The project separates four evidence levels:

1. **Designed:** Architecture and intended behavior are documented.
2. **Statically validated:** Required files, devices, controls, scenarios, links, safety limits, and public-safe ranges pass automated checks.
3. **Runtime validated:** Authorized devices boot, protocols converge, services work, controls match, and telemetry arrives.
4. **Production proven:** A real organization has approved, operated, measured, and maintained the implementation.

This repository currently claims levels 1 and 2. The offline telemetry evaluator is executable, but its input is intentionally synthetic. Levels 3 and 4 are explicitly not claimed.

## Automated Gates

Run from the project directory:

```bash
python3 validate_project.py
python3 noc_security_health_check.py --self-test
python3 -c "import ast, pathlib; ast.parse(pathlib.Path('noc_security_health_check.py').read_text(encoding='utf-8')); ast.parse(pathlib.Path('validate_project.py').read_text(encoding='utf-8')); print('PYTHON SYNTAX PASSED')"
```

The static gate checks:

- Required deliverable files.
- Local page links.
- Five dashboard scenarios.
- Project title, affiliation boundary, and synthetic-evidence boundary.
- Every ISP, EDGE, P, PE, and CE role.
- OSPF, LDP, MP-BGP, VRF, maximum-prefix, route-map, and validation commands.
- NGFW allow, deny, NAT, zone, DoS, RTBH, and rollback controls.
- DDoS, compromise, routing, route-security, ingestion, and packet-analysis content.
- Exact synthetic scenario inventory.
- Absence of unrestricted flood flags, private keys, API-key fields, and non-documentation public IP addresses.

## Control-Plane Acceptance

| Control | Pass condition | Evidence |
|---|---|---|
| Interface state | Every intended link is up/up; descriptions match link map | `show interfaces description` |
| OSPF | All expected neighbors FULL; loopbacks reachable; intended paths installed | `show ip ospf neighbor`, `show ip route ospf` |
| BFD | Sessions up on protected core links | `show bfd neighbors details` |
| LDP | Every provider-facing peer established | `show mpls ldp neighbor` |
| MPLS forwarding | Labels exist for remote PE loopbacks | `show mpls forwarding-table` |
| MP-BGP | PE1/PE2 VPNv4 session established; extended communities exchanged | `show bgp vpnv4 unicast all summary` |
| PE-CE BGP | Customer sessions established with authorized prefixes only | Neighbor received/accepted/advertised route views |
| Internet eBGP | Default-only import and public-prefix-only export | EDGE and ISP route/policy outputs |

## VPN and Service Acceptance

| Test | Expected |
|---|---|
| CUST_A Site 1 to Site 2 | Reachable over the VPN |
| CUST_A to CUST_B | No route / not reachable |
| P-router route tables | No customer prefixes |
| Public HTTP/HTTPS | Matches approved NAT/security rule and service succeeds |
| Public authoritative DNS | UDP/TCP 53 succeeds only for approved service |
| Untrusted IPv4 ICMP | Explicit deny and log |
| Unmatched untrusted traffic | Default deny and log |
| Management diagnostics | Allowed only from isolated authorized management network |

## DDoS Scenario Acceptance

- The dashboard and SIEM distinguish rate, bandwidth, connection, and application demand.
- Packet evidence validates SYN-only behavior and response ratio.
- Interface evidence identifies the actual bottleneck.
- Zone/DoS controls enter the expected state during a bounded test.
- No unbounded flood command exists in the package.
- The only packet-generation example is capped at 100 pps and 1,000 packets.
- High-rate values remain labeled synthetic.
- The response escalates upstream when circuit capacity is exceeded.
- RTBH is identified as service-sacrificing and authorization-dependent.
- Recovery measures service health, counters, utilization, and recurrence.

## Compromise Scenario Acceptance

- Process ancestry, command line, DNS, TLS, firewall, IDS, and endpoint data correlate in UTC.
- The case separates suspicious evidence from confirmed exfiltration.
- Volatile and durable evidence are preserved before destructive remediation.
- Containment is scoped to reduce customer impact.
- Identity, persistence, lateral movement, and exfiltration questions are addressed.
- Restoration occurs from a trusted state with increased monitoring.

## Routing-Failure Acceptance

- The selected link fails under an approved lab change.
- BFD and OSPF record the expected adjacency loss.
- An alternate route and LSP install.
- Customer reachability returns and measured loss is recorded.
- No unsupported convergence claim is made.
- The event is not classified as malicious without corroborating evidence.
- The original path returns and redundancy is restored after rollback.

## Route-Leak Acceptance

- CE-A1 originates the controlled test default route.
- PE1's pre-policy view can preserve the update for evidence.
- The inbound prefix allowlist rejects `0.0.0.0/0`.
- No unauthorized route enters BGP, the VRF RIB, or CEF.
- CUST_B and the global table remain unchanged.
- Routing-policy telemetry reaches the SIEM.
- The test route is removed and the normal state is revalidated.

## Evidence Acceptance

Every runtime artifact must include:

- Case ID and description.
- Source system/interface.
- Collector and acquisition method.
- UTC collection time.
- SHA-256 calculated before analysis.
- Original read-only copy and separate working copy.
- Custody transfer record.
- Public-release review before publication.

## Release Blockers

Do not describe the lab as runtime validated if any of these remain:

- Router or firewall image/version is unspecified.
- An expected adjacency is down.
- P routers carry customer routes.
- Customer isolation negative tests are missing.
- PAN-OS candidate validation or commit evidence is missing.
- SIEM/IDS/flow ingestion is stale.
- Packet capture was not bounded and authorized.
- Evidence contains customer or organization-sensitive data.
- Rollback is missing or untested.
- Synthetic values are presented as measured results.

## Current Honest Status

The package provides complete architecture, configuration, detection, automation, incident, forensics, and validation material. Static checks and offline scenario logic can be executed from this public package. Device runtime evidence and production operation remain future authorized stages.

