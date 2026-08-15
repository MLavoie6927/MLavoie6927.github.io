# Service Provider NOC Security Incident Casebook

**Analyst:** Marc Lavoie  
**Environment:** Simulated service-provider NOC security lab  
**Evidence classification:** Synthetic and public-safe  
**Time standard:** UTC

## Operating Model

```text
DETECT -> VALIDATE -> CORRELATE -> SCOPE -> CONTAIN
       -> PRESERVE -> ERADICATE -> RECOVER -> IMPROVE
```

Each case separates confirmed facts, working hypotheses, business impact, authority, and remaining questions. No destructive action is taken merely because an alert title sounds severe.

---

# IR-01: DDoS Against an MPLS L3VPN Customer

## Executive Summary

Synthetic monitoring indicates a sharp increase in TCP SYN demand against Customer A's public web VIP, `198.51.100.50`. The modeled event reaches `12,844 SYN packets/second`, drives the 1-Gbps service circuit to 98 percent utilization, and reduces successful application connections. Provider routing and MPLS transport remain healthy.

The investigation classifies the event as a likely volumetric and state-exhaustion attempt rather than a routing outage. Local NGFW SYN protection can protect firewall and server session state while circuit headroom remains. If modeled attack demand exceeds upstream circuit capacity, local controls cannot recover the consumed bandwidth; approved provider filtering, scrubbing, FlowSpec, or RTBH is required.

## Severity

**Critical** when customer service is unavailable or the provider-facing circuit is saturated.  
**High** when the attack is contained locally and service remains available with degraded headroom.

## Synthetic Timeline

| UTC | Event | Evidence | Decision |
|---|---|---|---|
| 14:31:00 | SYN rate crosses baseline | NetFlow, Suricata flow | Observe 60-second window |
| 14:32:00 | SYN-only rate exceeds 6,000/minute and ratio exceeds 8:1 | SIEM correlation | Open IR-01, severity High |
| 14:32:18 | Circuit reaches 85 percent | Interface telemetry | Notify NOC lead and service owner |
| 14:33:02 | Packet sample confirms SYN-heavy traffic | PCAP | Exclude simple routing failure |
| 14:33:30 | NGFW DoS profile enters protect state | NGFW counters | Validate server/session recovery |
| 14:34:10 | Modeled utilization reaches 98 percent | Flow and interface telemetry | Escalate upstream mitigation |
| 14:36:00 | Upstream control reduces malicious demand | Provider case record | Continue monitoring attack adaptation |
| 14:39:00 | Service response and utilization return to baseline | Synthetic transaction, flow | Begin recovery observation period |
| 15:09:00 | No recurrence during observation period | SIEM and service checks | Close containment, retain problem record |

## Investigation Queries and Commands

```text
show interfaces GigabitEthernet0/0 | include rate|drops|errors
show bgp ipv4 unicast summary
show ip ospf neighbor
show mpls ldp neighbor
show mpls forwarding-table
```

```spl
index=network destination.ip="198.51.100.50" destination.port=443
| bin _time span=1m
| stats count AS events sum(network.packets) AS packets
        dc(source.ip) AS sources sum(network.bytes) AS bytes BY _time
| eval pps=round(packets/60,2)
| sort _time
```

Wireshark:

```text
ip.addr == 198.51.100.50 && tcp.flags.syn == 1 && tcp.flags.ack == 0
tcp.flags.syn == 1 && tcp.flags.ack == 1
tcp.analysis.retransmission || tcp.analysis.zero_window
```

## Containment Decision Tree

1. **Server/application bottleneck:** scale or rate-limit at application/reverse-proxy layer; preserve security visibility.
2. **Firewall session bottleneck with circuit headroom:** activate validated zone/DoS protection, SYN cookies, session controls, and application policy.
3. **Customer circuit bottleneck:** coordinate provider edge control before saturation.
4. **Transit/peering saturation:** invoke upstream scrubbing, provider ACL, FlowSpec, or RTBH according to pre-approved playbook.
5. **RTBH:** use only with explicit authorization because the target becomes intentionally unreachable.

## Recovery Criteria

- Public HTTPS synthetic transaction succeeds for 30 minutes.
- Interface utilization remains below the defined warning threshold.
- SYN/ACK ratio returns to baseline.
- NGFW session utilization and drops return to normal.
- No alternate destination or protocol is attacked.
- Upstream control is removed through change control.
- Customer and management communications are complete.

## Lessons and Detection Improvement

- Port allowlisting does not stop attacks against allowed services.
- Alert logic must combine rate, ratio, source distribution, service health, and capacity.
- Upstream contacts and mitigation communities should be verified before an incident.
- The dashboard should display circuit capacity beside attack rate to prevent a firewall-only response.

---

# IR-02: Compromised Customer Web Server

## Executive Summary

Synthetic endpoint and network telemetry on `CUST-A-WEB01` shows a web-service parent process launching PowerShell, followed by a rare DNS request and outbound TLS. The sequence is suspicious because the server's baseline does not require PowerShell or arbitrary Internet egress. The evidence supports containment and forensic preservation but does not, by itself, prove data exfiltration.

## Initial Scope

- Confirmed affected asset: `CUST-A-WEB01` (`10.50.10.10`)
- Potentially affected service: Customer A public web application
- Related identities: web service account and any process token used by PowerShell
- Related infrastructure: DNS01, NGFW-1, IDS01, SIEM, PE1 CUST_A VRF
- Unknowns: initial access, credential theft, lateral movement, persistence, exfiltration

## Synthetic Timeline

| UTC | Event | Evidence | Assessment |
|---|---|---|---|
| 09:11:04 | Web process launches PowerShell | Sysmon Event 1 | Suspicious parent-child relationship |
| 09:11:09 | PowerShell requests rare domain | DNS log, Sysmon Event 22 | Potential C2 discovery |
| 09:11:11 | Host opens outbound TLS | Sysmon Event 3, NGFW traffic | Network behavior correlates |
| 09:12:20 | Registry persistence candidate appears | Sysmon Event 13 | Persistence requires validation |
| 09:13:00 | SIEM sequence alert opens | Correlation rule | Severity High |
| 09:16:00 | Host isolated using approved control | Change/EDR record | Service owner notified |
| 09:18:00 | Volatile and durable evidence preserved | Evidence log | Forensic analysis begins |

## Evidence Collection

1. Volatile process, connection, and logged-on-user state.
2. Sysmon EVTX and relevant Windows event channels.
3. DNS, NGFW, IDS, NetFlow, proxy, and authentication logs.
4. Memory capture when authorized and technically appropriate.
5. Disk image or targeted triage package according to policy.
6. File hashes, signatures, process tree, command line, persistence keys.
7. Packet capture covering the suspicious destination when available.

## Containment

- Isolate the endpoint through an approved EDR or switch/firewall control.
- Preserve management and forensic access if the playbook permits.
- Block confirmed malicious indicators only after validating scope and collision risk.
- Disable or rotate affected credentials through the identity owner.
- Do not delete persistence or execute untrusted samples before evidence is preserved.

## Eradication and Recovery

- Remove the verified initial-access vector and persistence.
- Patch the exploited service or rebuild from a trusted image.
- Reset affected credentials and invalidate sessions.
- Validate application files, scheduled tasks, services, startup locations, and web content.
- Restore service in a monitored segment.
- Require clean vulnerability, EDR, and telemetry checks before normal access.
- Monitor DNS, authentication, process, and egress behavior for recurrence.

## Communication Example

> One customer web server is confirmed affected and has been isolated. Public service is temporarily degraded while evidence is preserved and a clean recovery path is validated. We have not confirmed data exfiltration or additional affected systems. DNS, firewall, authentication, and endpoint telemetry are being reviewed to determine scope. The next update will report containment confidence and restoration status.

---

# NOC-01: Provider Core Link Failure

## Executive Summary

The PE1-to-P1 link is administratively disabled in the isolated lab. BFD and OSPF identify the failed adjacency, OSPF recalculates the route, and MPLS forwarding shifts to the PE1-to-P2-to-P3-to-PE2 path. Customer A site-to-site service remains reachable after convergence.

No evidence indicates malicious traffic or unauthorized configuration. The case remains a network availability event unless additional security evidence appears.

## Validation

Before fault:

```text
show ip ospf neighbor
show bfd neighbors details
show ip route 10.255.255.12
show mpls forwarding-table 10.255.255.12 255.255.255.255
traceroute vrf CUST_A 10.50.20.10 source 10.50.10.1
```

During fault:

```text
show logging | include BFD|OSPF|GigabitEthernet0/0
show ip ospf neighbor
show ip route 10.255.255.12
show mpls ldp neighbor
show mpls forwarding-table
```

## Network Failure vs. Security Incident

| Signal | Network failure | Security concern |
|---|---|---|
| Physical state | Carrier loss/errors on expected link | No physical fault or distributed resets |
| Change record | Approved test or maintenance | No authorization or unexpected actor |
| Protocol pattern | One adjacency follows interface loss | Repeated peers, malformed packets, auth failures |
| Forwarding | Alternate path installs as designed | Unexpected next hop or prefix appears |
| Telemetry | No threat correlation | Config, identity, or IDS anomalies correlate |

## Recovery

1. Restore the interface.
2. Verify physical counters before enabling service.
3. Confirm BFD, OSPF, LDP, routing, and label state.
4. Re-run customer positive and isolation negative tests.
5. Verify SIEM ingestion and close the event only after redundancy is restored.

---

# RSEC-01: Unauthorized Customer Default Route

## Executive Summary

CE-A1 originates a controlled test `0.0.0.0/0` while its approved export remains `10.50.10.0/24`. PE1's inbound prefix allowlist rejects the unauthorized route. The provider-controlled CUST_A default remains unchanged, CUST_B is unaffected, and a routing-security event is logged.

## Control Objectives

- A customer cannot become transit by advertising default or broad aggregates.
- A customer cannot advertise provider infrastructure or another customer's networks.
- Maximum-prefix limits reduce blast radius from policy or software failure.
- Rejected updates are visible in NOC and SIEM workflows.

## Acceptance

```text
show bgp ipv4 unicast vrf CUST_A neighbors 172.20.101.2 received-routes
show bgp ipv4 unicast vrf CUST_A neighbors 172.20.101.2 routes
show ip route vrf CUST_A 0.0.0.0
show ip route vrf CUST_B
show ip prefix-list CUST-A-SITE1-IN
show route-map CUST-A-SITE1-IN
```

Success requires the customer default to appear only in the pre-policy received view, never in the accepted BGP table, VRF RIB, or FIB.

## Response

1. Verify that no forwarding change occurred.
2. Preserve the BGP update and policy counters.
3. Confirm the customer's approved prefix inventory.
4. Contact the customer or network owner using the established escalation path.
5. Keep the session available if safe; shut it only if policy, scale, or instability requires it.
6. Remove the controlled test route and verify steady state.
7. Review whether RPKI, IRR filters, max-prefix, peer roles, or additional automation should be added at the appropriate boundary.

---

# Evidence and Chain of Custody

## Evidence Register Template

| Evidence ID | Case | Artifact | Source | Collected UTC | Analyst | SHA-256 | Status |
|---|---|---|---|---|---|---|---|
| E-001 | IR-01 | Bounded SYN test PCAP | IDS01 monitored interface | Generated at collection | Marc Lavoie | Generated at collection | Original read-only |
| E-002 | IR-01 | NGFW traffic/threat export | NGFW-1 | Generated at collection | Marc Lavoie | Generated at collection | Original read-only |
| E-003 | IR-02 | Sysmon EVTX | CUST-A-WEB01 | Generated at collection | Marc Lavoie | Generated at collection | Original read-only |
| E-004 | NOC-01 | Routing command transcript | PE1/P1/P2/P3/PE2 | Generated at collection | Marc Lavoie | Generated at collection | Original read-only |
| E-005 | RSEC-01 | BGP received/accepted route output | PE1 | Generated at collection | Marc Lavoie | Generated at collection | Original read-only |

Do not invent hashes before artifacts exist. Generate SHA-256 values from the collected files and preserve the hash manifest with the case.

## Custody Log Template

| UTC | Evidence ID | From | To | Purpose | Integrity verified | Signature/initials |
|---|---|---|---|---|---|---|
| `YYYY-MM-DDTHH:MM:SSZ` | E-001 | Collector | Evidence vault | Initial preservation | Yes | Analyst |
| `YYYY-MM-DDTHH:MM:SSZ` | E-001 | Evidence vault | Working copy | Packet analysis | Yes | Analyst |

## Root Cause Standard

A root cause statement should identify:

- The triggering condition.
- The control that failed, was absent, or behaved as designed.
- Why monitoring did or did not detect the condition.
- The technical and business impact.
- Contributing process, architecture, configuration, or visibility factors.
- Corrective action, owner, due date, validation method, and rollback.

Avoid unsupported statements such as "the firewall failed" when the actual bottleneck was upstream circuit capacity.

---

# Executive Incident Report Template

## Incident

`Case ID and concise title`

## Status

`Investigating / Contained / Recovering / Closed`

## Business Impact

State affected services, customers, locations, duration, SLA impact, and known operational consequences. Separate confirmed impact from possible impact.

## What Happened

Summarize the event in plain language, including first detection and current confidence.

## Scope

List confirmed affected and confirmed unaffected services. List remaining scope questions separately.

## Actions Taken

Describe monitoring, containment, provider coordination, evidence preservation, remediation, and restoration. State the authority or change record for disruptive actions.

## Current Risk

Explain residual risk, monitoring period, and any temporary control.

## Root Cause

State only when evidence supports it. Until then, label the current explanation as a working hypothesis.

## Prevention and Ownership

| Action | Owner | Priority | Due | Validation |
|---|---|---|---|---|
| Tune rate and ratio detection | Detection Engineering | High | Date | Replay synthetic scenario |
| Verify upstream mitigation path | Network Engineering | High | Date | Scheduled tabletop/test |
| Review customer prefix inventory | Network Operations | Medium | Date | Policy diff and negative test |
| Improve telemetry freshness alarm | SOC Platform | Medium | Date | Ingestion interruption test |

## Next Update

State the next decision, evidence target, owner, and update time.

