# Master Network Support Runbook

## Phase 1 — Triage

Capture: district, site, user/device, start time/timezone, exact symptom, scope, workaround, recent changes.

## Phase 2 — Endpoint

Windows: `ipconfig /all`, route table, DNS servers, Event Viewer, `dsregcmd /status`, secure channel, browser/profile.

Linux: `ip -brief address`, `ip route`, resolver status, NTP, sockets, logs.

ChromeOS: managed status, network, user/OU, policy, browser version, certificates/extensions.

## Phase 3 — Network

1. link/interface
2. IP and DHCP
3. gateway
4. VLAN/access/trunk
5. DNS
6. routing
7. firewall
8. filtering/TLS
9. WAN/provider

## Phase 4 — Identity / Cloud

AD/Entra/Google identity, MFA, licensing, group/OU, device enrollment, permissions, provider health.

## Phase 5 — Evidence

Record exact test and result, not just a conclusion.

```text
2026-09-02 13:42 PT
DIST-07 / High School / VLAN 10
10.7.10.24 -> gateway 10.7.10.1 = success
DNS example.edu = success
TCP 443 example.edu = timeout
Traceroute stops at provider handoff
```

## Phase 6 — Resolve

Prefer the smallest reversible change that addresses the identified cause.

## Phase 7 — Verify

Test:
- originally affected user/device,
- second endpoint when scope was multi-user,
- expected negative/security condition when changing access rules.

## Phase 8 — Close

Document root cause, action, verification, customer communication, and preventive follow-up.
