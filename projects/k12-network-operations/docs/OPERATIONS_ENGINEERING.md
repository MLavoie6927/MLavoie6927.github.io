# Operations Engineering Model

The v5 project is organized around six operational capabilities rather than a collection of unrelated technologies.

## 1. Observe

Synthetic telemetry represents WAN utilization, packet loss, DNS latency, ticket state, interface alerts, and device configuration posture.

## 2. Understand dependencies

`data/services.json` models service dependencies. A failure in DNS, WAN, identity, firewall, or filtering can be traced to the user-facing services that depend on it.

## 3. Isolate faults

Incident cases use the same progression:

`scope → endpoint → LAN → service dependency → security boundary → WAN/cloud → conclusion`

## 4. Control change

Changes include risk, approvals, exact scope, rollback, and validation. `k12ops change-risk` flags weak change records before implementation.

## 5. Verify configuration

`k12ops drift` compares synthetic device snapshots with the compliance baseline and distinguishes security-sensitive drift from normal configuration differences.

## 6. Measure operations

SLA attainment, incident priority, capacity trends, health score, and configuration compliance are reportable without claiming fictional metrics are employer production results.
