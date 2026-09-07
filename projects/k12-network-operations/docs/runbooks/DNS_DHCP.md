# DNS & DHCP Runbook

## DHCP

Check lease acquisition, correct scope, gateway, DNS servers, relay/helper path, exhaustion, reservations, and rogue/static conflicts.

## DNS

Test client resolver configuration, A/AAAA/CNAME/SRV records, recursion, forwarders, split-horizon behavior, TCP/UDP 53, and cache effects.

## AD-Specific DNS

A domain client should normally use AD-aware DNS rather than a public resolver directly. Validate `_ldap._tcp.dc._msdcs.<domain>` SRV records and time synchronization before concluding domain authentication is broken.
