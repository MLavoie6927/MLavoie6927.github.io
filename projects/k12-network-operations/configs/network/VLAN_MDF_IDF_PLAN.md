# VLAN / MDF / IDF Plan

## Example VLAN Scheme

| VLAN | Name | Example CIDR | Access |
|---:|---|---|---|
| 10 | STAFF | 10.10.10.0/24 | staff endpoints |
| 20 | STUDENT | 10.10.20.0/24 | student endpoints |
| 30 | SERVER | 10.10.30.0/24 | internal services |
| 40 | MGMT | 10.10.40.0/24 | switch/firewall/AP management |
| 50 | GUEST | 10.10.50.0/24 | Internet only |
| 60 | IOT | 10.10.60.0/24 | printers / approved IoT |

## MDF Checklist

- dual power where supported
- UPS health
- labeled patch panels
- uplink redundancy if available
- environmental monitoring
- core switch config backup
- fiber/transceiver inventory
- management VLAN
- SNMPv3
- NTP
- syslog

## IDF Checklist

- uplink status
- switch stack health
- error counters
- PoE budget
- AP uplinks
- cable labeling
- rack/UPS condition
- documented port-to-room mapping

## Troubleshooting an IDF

```text
Building issue
  -> affected rooms?
  -> affected VLANs?
  -> access ports?
  -> switch?
  -> uplink?
  -> fiber/transceiver?
  -> MDF?
  -> core?
```
