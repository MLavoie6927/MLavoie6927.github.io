# Troubleshooting Decision Tree

```text
START
 |
 +-- Is the problem reproducible?
 |      +-- No -> gather timestamps/user examples; monitor
 |      +-- Yes
 |
 +-- One user/device?
 |      +-- Yes -> endpoint/account/browser/profile first
 |      +-- No
 |
 +-- One room / IDF / VLAN?
 |      +-- Yes -> switchport/VLAN/uplink/DHCP
 |      +-- No
 |
 +-- Local resources reachable?
 |      +-- No -> LAN/gateway/routing
 |      +-- Yes
 |
 +-- DNS resolves?
 |      +-- No -> resolver/path/forwarder/split-DNS
 |      +-- Yes
 |
 +-- TCP service reachable?
 |      +-- No -> firewall/filter/routing/provider
 |      +-- Yes
 |
 +-- Authentication succeeds?
 |      +-- No -> identity/clock/MFA/policy/license
 |      +-- Yes
 |
 +-- Application still fails?
        +-- browser/TLS/CDN/API/provider/app policy
```

## Evidence-First Rule

Before a high-impact change, capture the condition that proves the current state. After the change, repeat the same test. This turns troubleshooting into an auditable before/after comparison.
