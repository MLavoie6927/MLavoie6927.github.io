# Incident Scenario Library

The machine-readable source is `data/scenarios.json`. Each scenario contains severity, fault domain, next actions, required evidence, and escalation guidance.

## INC-DNS-01 — One classroom cannot resolve internal learning portal

- **Severity:** P3
- **Fault domain:** DNS
- **Actions:** Compare resolver settings; Query A/CNAME records; Test known-good internal name; Check DHCP-provided DNS
- **Evidence:** client IP/config, nslookup/Resolve-DnsName output, timestamp, affected VLAN
- **Escalation:** Escalate to DNS/AD owner if authoritative records or resolver service are incorrect.

## INC-WAN-01 — Entire high school loses Internet but local resources work

- **Severity:** P2
- **Fault domain:** WAN/Provider
- **Actions:** Confirm multiple VLANs; Test gateway; Check edge interface/routes; Trace toward provider; Check circuit alarms
- **Evidence:** site, circuit ID, interface state, traceroute, timestamps, recent changes
- **Escalation:** Escalate to upstream NOC/carrier with evidence package.

## INC-FILTER-01 — Teacher instructional SaaS blocked

- **Severity:** P3
- **Fault domain:** Web Filter
- **Actions:** Capture exact URL/FQDN; Check category/block reason; Identify auth/CDN/API dependencies; Validate business need; Create narrow approved exception
- **Evidence:** user/group, URL, filter log, timestamp, before/after result
- **Escalation:** Escalate to filter vendor only if product classification/behavior cannot be resolved locally.

## INC-IDF-01 — One building wing has intermittent connectivity

- **Severity:** P2
- **Fault domain:** Access Network
- **Actions:** Map affected rooms to IDF; Check uplink errors/flaps; Review switch stack health; Inspect fiber/transceiver; Compare unaffected VLANs
- **Evidence:** switch/interface, error counters, timestamps, topology, affected VLANs
- **Escalation:** Escalate to network engineer/hardware vendor if physical/uplink fault is indicated.

## INC-AD-01 — New Windows device cannot access domain resources

- **Severity:** P3
- **Fault domain:** AD/DNS
- **Actions:** Verify DHCP/DNS; Query AD SRV records; Check system time; Verify secure channel; Inspect device/computer object
- **Evidence:** ipconfig, SRV lookup, w32tm, nltest, dsregcmd
- **Escalation:** Escalate to identity or network owner based on failed layer.

## INC-INTUNE-01 — Windows device enrolled but policy is missing

- **Severity:** P3
- **Fault domain:** Intune
- **Actions:** Verify tenant/join state; Check last check-in; Confirm assignment/filter scope; Check conflicting profiles; Review local MDM event log
- **Evidence:** device ID, assignment, event IDs, check-in time
- **Escalation:** Escalate to Intune admin if assignment/service-side state is inconsistent.

## INC-GOOGLE-01 — Chromebook user cannot open Shared Drive

- **Severity:** P4
- **Fault domain:** Google Workspace
- **Actions:** Verify account and OU; Check Shared Drive membership; Check group membership; Review sharing restrictions; Validate browser/network path
- **Evidence:** user/OU, resource, permission path, timestamp
- **Escalation:** Escalate to Workspace admin if organization policy or ownership requires change.

## INC-M365-01 — Microsoft 365 login loop on managed Windows

- **Severity:** P3
- **Fault domain:** Entra/M365
- **Actions:** Check time; Check dsregcmd/SSO state; Review MFA/Conditional Access; Test browser profile; Check provider health
- **Evidence:** error/correlation ID, dsregcmd summary, timestamp, CA result if authorized
- **Escalation:** Escalate to identity/cloud admin with correlation evidence.

## INC-DHCP-01 — Student VLAN clients receive APIPA addresses

- **Severity:** P2
- **Fault domain:** DHCP
- **Actions:** Check scope availability; Check relay/helper; Check VLAN/trunk; Validate server reachability; Check recent network changes
- **Evidence:** client address, VLAN, scope usage, relay path, switchport/uplink state
- **Escalation:** Escalate to DHCP/network owner depending on scope/relay failure.

## INC-PRINT-01 — Staff cannot print to one network printer

- **Severity:** P4
- **Fault domain:** Printer/IoT
- **Actions:** Check device power/link; Verify IP/reservation; Ping/resolve printer; Check print queue; Validate printer VLAN ACL
- **Evidence:** printer IP, queue state, VLAN, error message
- **Escalation:** Escalate to print/device vendor only after network/queue isolation.

## INC-SMTP-01 — Mail client cannot submit messages

- **Severity:** P3
- **Fault domain:** Email
- **Actions:** Check account/auth; Resolve service endpoints; Test TCP/TLS; Review client profile; Check provider status
- **Evidence:** exact error, DNS result, TCP/TLS result, timestamp
- **Escalation:** Escalate to mail/cloud provider with protocol and correlation evidence.

## INC-ROUTE-01 — One remote subnet is unreachable after planned change

- **Severity:** P2
- **Fault domain:** Routing
- **Actions:** Compare routing tables; Verify next-hop; Check dynamic neighbor state if used; Review ACL/firewall; Compare pre-change snapshot
- **Evidence:** prefix, route output, neighbor state, change ID, traceroute
- **Escalation:** Rollback or escalate according to change plan if expected route is absent.

## INC-SEC-01 — Student network can reach management interface

- **Severity:** P1
- **Fault domain:** Segmentation/Security
- **Actions:** Confirm exposure safely; Preserve firewall/switch logs; Identify route/ACL path; Restrict exposure using approved change; Validate negative test
- **Evidence:** source/destination, policy/rule, logs, exposure window, verification
- **Escalation:** Escalate immediately through security/change process; treat as security-impacting incident.

## INC-NTP-01 — Domain authentication failures correlate with clock skew

- **Severity:** P3
- **Fault domain:** NTP/Identity
- **Actions:** Check system time/source; Check domain time hierarchy; Verify NTP reachability; Correct approved time configuration; Retest auth
- **Evidence:** w32tm/timedatectl, offset, NTP source, auth result
- **Escalation:** Escalate to identity/infrastructure owner if authoritative time source is unhealthy.

## INC-WIFI-01 — One classroom has poor Wi-Fi performance

- **Severity:** P3
- **Fault domain:** Wireless
- **Actions:** Compare clients; Identify serving AP; Check RSSI/SNR/channel utilization; Check AP uplink/errors; Test wired baseline
- **Evidence:** AP, SSID, time, signal metrics, uplink status
- **Escalation:** Escalate to wireless/network engineer with RF and wired evidence.

## INC-DNS-02 — Internal DNS works but public recursion fails

- **Severity:** P2
- **Fault domain:** DNS/Firewall
- **Actions:** Query internal name; Query public name; Check forwarders; Test TCP/UDP 53 policy; Compare second resolver
- **Evidence:** resolver, query outputs, firewall logs, forwarder state
- **Escalation:** Escalate to DNS/firewall/upstream depending on failed boundary.

## INC-TLS-01 — Website resolves and TCP/443 connects but browser fails TLS

- **Severity:** P3
- **Fault domain:** TLS/Filter
- **Actions:** Capture browser/TLS error; Inspect certificate chain; Check system clock; Check TLS inspection policy; Compare managed/unmanaged test if authorized
- **Evidence:** certificate/error, hostname, timestamp, filter policy
- **Escalation:** Escalate to filtering/certificate owner if inspection trust/path is broken.

## INC-CAP-01 — WAN utilization repeatedly exceeds 90 percent

- **Severity:** P3
- **Fault domain:** Capacity
- **Actions:** Verify duration and baseline; Identify legitimate schedule/events; Check errors/loss; Summarize trend; Create capacity recommendation
- **Evidence:** utilization graph, 95th percentile, loss/errors, business timing
- **Escalation:** Escalate as capacity/project planning rather than break/fix if service remains functional.

## INC-POWER-01 — IDF switch stack offline after power event

- **Severity:** P2
- **Fault domain:** MDF/IDF
- **Actions:** Check UPS/power; Confirm stack/member state; Check environmental alarms; Verify uplink after restore; Validate VLANs/PoE
- **Evidence:** UPS state, switch state, site, event time
- **Escalation:** Escalate facilities/hardware as indicated by power or device diagnostics.

## INC-SAAS-01 — Cloud application unavailable from multiple districts

- **Severity:** P3
- **Fault domain:** SaaS Provider
- **Actions:** Confirm cross-district scope; Check DNS/TCP from multiple sites; Check provider status; Rule out regional filter change; Communicate workaround/status
- **Evidence:** district list, test results, provider status, timestamps
- **Escalation:** Escalate to SaaS provider if regional network path is healthy.
