# K–12 Security Baseline

## Network

- Default-deny inter-VLAN policy where practical
- Student-to-management access denied
- Guest-to-internal access denied
- Explicit DNS/NTP paths
- Administrative interfaces restricted to management network
- No unnecessary inbound Internet services
- Centralized firewall logging

## Identity

- Unique administrator accounts
- MFA for privileged/cloud administration
- Separate normal and elevated accounts
- Disable stale accounts
- Prompt offboarding
- Group-based access where possible

## Endpoint

- Supported OS versions
- Full-disk encryption where available
- EDR/antimalware
- automatic security updates
- browser policy management
- no local admin for standard users unless required

## Monitoring

Collect, where authorized:

- firewall events
- DNS events
- authentication events
- endpoint security events
- network-device health
- link utilization

## School-Specific Principle

Availability matters, but student safety and least privilege should not be bypassed to make a site "work." Troubleshoot the exact dependency and create the smallest approved exception.
