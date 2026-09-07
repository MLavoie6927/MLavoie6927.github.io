# DNS / DHCP Design

## DHCP Options

- router/default gateway = VLAN SVI,
- DNS = district AD/DNS resolvers for managed domain clients,
- NTP/time = approved source where explicitly configured,
- lease durations chosen for device population and mobility.

## DNS

Internal resolvers host/forward internal zones and recurse/forward public lookups according to policy. Split DNS should be documented so identical names returning different internal/external answers are not misdiagnosed.

## Resilience

Use at least two resolvers where architecture permits and monitor response availability, not just host reachability.
