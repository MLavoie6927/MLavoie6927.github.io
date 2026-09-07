# Upstream NOC / Carrier Escalation

**Subject:** `[DIST-02] [P2] Internet path failure after provider handoff`

## Impact

Central High School has no Internet access from multiple client VLANs. Internal services remain available.

## Start Time

2026-09-02 10:02 PT (synthetic)

## Known Good

- STAFF and STUDENT clients receive valid addressing.
- AD/DNS and internal application traffic succeed.
- VLAN gateways respond normally.
- District edge WAN interface is `up/up` with zero error growth.
- Default route remains installed.
- No local WAN/firewall change occurred in the previous 24 hours.

## Failed Boundary

Traceroute from independent VLANs reaches provider handoff `198.51.100.9` and does not progress beyond it.

## Circuit

Synthetic circuit ID: `LAB-K20-DIST02-001`

## Request

Please validate upstream routing/circuit state beyond the handoff and restore service if an upstream fault is confirmed. Notify us when the path is restored so we can repeat client and monitoring validation.
