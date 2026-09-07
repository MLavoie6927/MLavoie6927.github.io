# INC-DNS-01 — AD/DNS Authentication Failure

> **Synthetic portfolio investigation.** No production school data is represented.

**Severity:** P3  
**District:** DIST-01

## User-reported symptom

A classroom can reach IP addresses but domain resources and the internal learning portal fail by hostname.

## Evidence progression

- Client has a valid DHCP lease and default gateway
- Gateway and internal server IPs respond
- Resolve-DnsName for the internal zone fails
- Client received a retired DNS resolver through an old DHCP option

## Fault domain

**DHCP-provided DNS configuration referenced a retired resolver.**

## Action

Correct the scoped DHCP option, renew the affected client lease, and validate AD SRV plus portal resolution.

## Verification standard

The fix is not considered complete until the original workflow succeeds and an adjacent control path is shown to remain intact.
