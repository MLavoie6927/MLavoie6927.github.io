# Service Provider NOC Security Engineering Lab

**Secure MPLS/IP Transport, BGP/OSPF, NGFW, SIEM, DDoS Mitigation, Threat Hunting, Digital Forensics, Incident Response, and Automation**

Author: **Marc Lavoie**

## Executive Overview

This flagship portfolio project models the combined networking and cybersecurity responsibilities of a modern NOC Security Engineer. It is intentionally broader than an isolated SOC investigation or a routing demonstration: the lab connects service availability, carrier routing, customer isolation, firewall policy, security telemetry, packet evidence, response authority, recovery, and continuous improvement.

The project answers one practical question:

> Can an engineer move from a customer-reported outage through Layer 1-3 health, OSPF/BGP/MPLS state, firewall and NAT policy, SIEM and IDS telemetry, packet-level validation, containment, restoration, evidence preservation, and prevention without confusing a network failure with a security incident?

## Credibility and Safety Boundary

- This is an original, public-safe simulation and is not affiliated with an employer.
- Documentation ranges and generic private lab addresses are used.
- No production configurations, logs, incidents, customer data, credentials, or internal project identifiers are included.
- The configuration package is complete at the design and static-validation level.
- Device boot, protocol convergence, PAN-OS commit, and packet evidence require an authorized runtime.
- High-rate DDoS telemetry is synthetic. The only traffic-generation command is bounded to an isolated lab target.
- The project explains where Ciena, Nokia, Calix, Alcatel, and Metaswitch technologies fit without claiming unearned production experience.

## Architecture

```text
Simulated Internet / AS 64501
        |
     EDGE-1 / AS 64500
        |
     NGFW-1
        |
  PE1 == redundant MPLS core == PE2
   |                                |
 CE-A1                            CE-A2
   |                                |
 Customer A Site 1 ======== Customer A Site 2

 PE1 -- CE-B1 -- Customer B Site 1
          |
      Separate VRF and route target

NGFW + PE/EDGE telemetry -> SIEM / Suricata / NetFlow / packet capture
```

### Protocol Roles

| Layer | Technology | Purpose |
|---|---|---|
| Underlay | OSPF Area 0 | Loopback and transport reachability |
| Fast detection | BFD | Rapid link/path failure signal |
| Label transport | MPLS/LDP | Provider forwarding without customer routes on P routers |
| VPN control plane | MP-BGP VPNv4 | Distribute customer routes and route targets between PEs |
| Customer routing | PE-CE eBGP | Exchange only assigned customer prefixes |
| Isolation | VRF/RD/RT | Separate CUST_A and CUST_B routing and forwarding |
| Internet edge | eBGP and prefix policy | Default-only import, owned-prefix export, max-prefix |
| Security edge | NGFW/NAT/DoS policy | Publish approved services and control threats |
| Detection | SIEM/IDS/flow/endpoint | Correlate behavior across layers |
| Response | Runbooks/forensics | Contain, restore, preserve, and improve |

## Addressing Summary

| Segment | Range | Notes |
|---|---|---|
| ISP transit | `203.0.113.0/30` | RFC 5737 documentation range |
| Edge-to-firewall | `192.0.2.0/30` | RFC 5737 documentation range |
| Public service prefix | `198.51.100.0/24` | RFC 5737 documentation range |
| Provider point-to-point | `10.255.0.0/24` carved into `/31` | Isolated lab underlay |
| Provider loopbacks | `10.255.255.0/24` carved into `/32` | Router IDs and BGP/LDP endpoints |
| Customer A | `10.50.10.0/24`, `10.50.20.0/24` | Two-site L3VPN |
| Customer B | `10.60.10.0/24` | Separate L3VPN |

## Eight Core Deliverables

1. **Architecture diagram** with trust, service, routing, and telemetry boundaries.
2. **Complete configurations** for ISP-1, EDGE-1, P1-P3, PE1-PE2, CE-A1, CE-A2, CE-B1, and NGFW-1.
3. **Normal-operation validation** for interfaces, routing, labels, VPNs, services, isolation, and telemetry.
4. **DDoS incident** covering SIEM detection, flow, packet validation, NGFW mitigation, upstream response, and recovery.
5. **Compromise/threat-hunting incident** correlating rare DNS, PowerShell, TLS, persistence, and endpoint/network evidence.
6. **Routing failure and route-leak scenarios** distinguishing availability events from security events.
7. **Python NOC/security automation** that evaluates five reproducible synthetic scenarios offline.
8. **Executive and technical incident reporting** with chain of custody, root cause, ownership, and lessons learned.

## Role Capability Mapping

| NOC Security Engineer responsibility | Project evidence |
|---|---|
| BGP/OSPF and Ethernet/IP operations | Full underlay, edge, PE-CE, failure, and show-command package |
| Service-provider transport awareness | MPLS/LDP, MP-BGP VPNv4, P/PE separation, access/transport placement |
| NGFW administration | PAN-OS-style interfaces, zones, routes, NAT, App-ID policy, logging, threat and DoS profiles |
| Security monitoring | SIEM data model, SPL/KQL, ingestion health, flow, IDS, firewall and endpoint correlation |
| Incident triage and investigation | Four casebooks with evidence pivots, scope, severity, decisions, and unknowns |
| Incident leadership | Containment authority, upstream escalation, restoration criteria, executive communication |
| Digital forensics | Evidence register, SHA-256, working copies, custody log, timeline and preservation sequence |
| Threat hunting | DNS rarity, process ancestry, outbound TLS, persistence and network corroboration |
| Tool tuning | False-positive/false-negative analysis, baseline thresholds, maintenance suppression and test cases |
| Documentation and improvement | Build runbook, rollback, acceptance gate, root-cause and corrective-action templates |
| Scripting | Offline Python health check with validation, structured output and self-test |
| Communication | Ten-second dashboard, technical files, executive reports, and explicit uncertainty |

## Operational Scenarios

### 1. Normal Operation

Proves that the topology is useful before fault injection:

- All OSPF and BFD adjacencies are established.
- MPLS/LDP labels are present on provider-facing links.
- PE1 and PE2 exchange VPNv4 routes with extended communities.
- Customer A sites import matching route targets and communicate.
- Customer B remains isolated because no CUST_B route target enters CUST_A.
- Public HTTP/HTTPS and authoritative DNS match only approved NGFW rules.
- Untrusted IPv4 ICMP and unmatched traffic are denied and logged.
- SIEM and IDS ingestion remains fresh.

### 2. Customer DDoS

The scenario distinguishes:

- SYN flood vs. UDP/ICMP flood.
- Volumetric saturation vs. session exhaustion.
- Network-layer demand vs. application-layer demand.
- Local firewall protection vs. upstream circuit protection.

The central conclusion is:

> A firewall behind a saturated 1-Gbps circuit cannot recover bandwidth already consumed upstream. Local flood controls protect firewall and server resources; upstream filtering, scrubbing, FlowSpec, or RTBH protects the circuit.

### 3. Compromised Server

Correlates:

```text
Web process -> PowerShell -> rare DNS -> outbound TLS -> persistence candidate
```

The case preserves uncertainty: this sequence justifies containment and forensic work but does not automatically prove exfiltration.

### 4. Core Routing Failure

PE1-to-P1 fails. BFD and OSPF signal the event, the alternate label-switched path installs, and customer traffic is tested. The evidence supports a network availability classification unless unauthorized change or threat telemetry appears.

### 5. Unauthorized BGP Advertisement

CE-A1 attempts to advertise `0.0.0.0/0`. The PE receives but rejects it through a prefix allowlist. Maximum-prefix remains healthy and the forwarding table does not change.

## DDoS Control Layers

```text
Application controls
        |
NGFW classified DoS policy and session limits
        |
Zone protection and control-plane protection
        |
Provider edge ACL / BGP FlowSpec
        |
Upstream scrubbing / RTBH
        |
Capacity planning, Anycast, CDN, and architecture
```

Allowing only TCP 80/443 and UDP/TCP 53 does not provide DDoS protection. Those permitted services remain attack targets.

## Run the Offline Health Check

No network access, credentials, third-party packages, or administrative rights are required:

```bash
python3 noc_security_health_check.py --self-test
python3 noc_security_health_check.py --scenario normal
python3 noc_security_health_check.py --scenario ddos
python3 noc_security_health_check.py --scenario compromise
python3 noc_security_health_check.py --scenario routing_failure
python3 noc_security_health_check.py --scenario route_leak --json
```

Expected self-test:

```text
SELF-TEST PASSED: 5 scenarios matched expected state
```

## Project Files

| File | Purpose |
|---|---|
| [`index.html`](index.html) | Interactive recruiter-facing project page |
| [`architecture.svg`](architecture.svg) | Full topology and telemetry diagram |
| [`BUILD-RUNBOOK.md`](BUILD-RUNBOOK.md) | Deployment, service-host, test, evidence and rollback sequence |
| [`ROUTER-CONFIGURATIONS.txt`](ROUTER-CONFIGURATIONS.txt) | Complete IOS XE-style device configurations |
| [`PALO-ALTO-CONFIGURATION.txt`](PALO-ALTO-CONFIGURATION.txt) | NGFW candidate configuration and DDoS controls |
| [`SIEM-AND-DETECTION.txt`](SIEM-AND-DETECTION.txt) | SIEM, IDS, packet filters, tuning and detection logic |
| [`INCIDENT-RESPONSE.md`](INCIDENT-RESPONSE.md) | Four incidents, chain of custody and executive templates |
| [`noc_security_health_check.py`](noc_security_health_check.py) | Offline health and scenario evaluator |
| [`sample_telemetry.json`](sample_telemetry.json) | Public-safe synthetic source data |
| [`VALIDATION.md`](VALIDATION.md) | Acceptance criteria and runtime boundaries |
| [`validate_project.py`](validate_project.py) | Static file, link, control, safety, and public-address gate |

## Production Next Steps

The next authorized stage is to import the configuration into properly licensed GNS3/EVE-NG images, boot each node, capture protocol and service evidence, measure convergence, validate the PAN-OS candidate configuration, and replace synthetic dashboard values with redacted lab measurements.

That distinction matters: complete engineering preparation is valuable, but it is not represented as production experience or runtime proof until the authorized environment generates the evidence.
