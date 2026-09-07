# Escalation Matrix

| Fault Domain | Local Team Action | Escalate To | Required Evidence |
|---|---|---|---|
| Endpoint | isolate and reproduce | desktop/admin team | device, user, logs |
| AD/Identity | validate object/DNS/time | identity admin | user/device IDs, event IDs |
| Access switch | port/VLAN/counters | network engineer | port, VLAN, errors |
| Firewall | policy/log review | firewall admin | rule/log/session |
| Filter | category/dependency review | filtering admin/vendor | URL, user group, block reason |
| District WAN | route/interface check | K-20/upstream NOC | traceroute, timestamps, circuit |
| ISP/Tail circuit | local demarc checks | carrier/vendor | circuit ID, alarms, timestamps |
| M365 | tenant/local validation | Microsoft/vendor | correlation IDs, timestamps |
| Google | policy/account validation | Google/vendor | user/OU, timestamps |
| Hardware | diagnostics | vendor | serial/model, diagnostics |

## Escalation Quality Standard

Never send:
> Internet is down. Please investigate.

Send:
> DIST-07, Building A lost upstream connectivity at 13:42 PT. Local switching and gateway remain reachable. Edge WAN interface is up, but traceroute stops at the provider handoff. Two test clients in VLANs 10 and 20 show the same behavior. No local firewall change occurred in the preceding 24 hours. Circuit ID and timestamps are attached.
