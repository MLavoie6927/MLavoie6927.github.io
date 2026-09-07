# MDF / IDF Runbook

## Physical

UPS, power supplies, temperature, fiber/transceiver, patching, cable labels, switch LEDs.

## Logical

stack/member health, uplink state, CRC/errors, VLANs, trunks, spanning tree, PoE budget, management reachability, NTP, SNMP/syslog.

## Isolation Technique

If failures map to one wing/floor, compare affected switchports against the IDF uplink and upstream MDF. Correlated errors on the uplink are stronger evidence than unrelated client symptoms.
