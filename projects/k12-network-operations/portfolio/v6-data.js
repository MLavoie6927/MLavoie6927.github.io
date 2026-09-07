window.K12_V6_DATA = {
  "cases": {
    "INC-WAN-01": {
      "id": "INC-WAN-01",
      "severity": "P2",
      "summary": "Entire high school loses Internet but local resources work",
      "fault_domain": "WAN/Provider",
      "escalation": "Escalate to upstream NOC/carrier with evidence package.",
      "actions": [
        "Confirm multiple VLANs",
        "Test gateway",
        "Check edge interface/routes",
        "Trace toward provider",
        "Check circuit alarms"
      ],
      "evidence": [
        "site",
        "circuit ID",
        "interface state",
        "traceroute",
        "timestamps",
        "recent changes"
      ],
      "files": {
        "closure.md": "# Incident Closure \u2014 INC-WAN-01\n\n## Synthetic Resolution\n\nThe upstream provider confirms a routing failure beyond the district handoff and restores the affected path.\n\n## Verification\n\n- STAFF client external HTTPS: PASS\n- STUDENT client external HTTPS: PASS\n- internal AD/DNS: PASS\n- gateway latency: normal\n- external packet-loss monitor: returned to baseline\n- district edge errors: unchanged / zero\n\n## Closure Statement\n\nNo district configuration was changed. The failed boundary was isolated to the upstream provider path and escalated with sufficient evidence for provider action.\n",
        "escalation.md": "# Upstream NOC / Carrier Escalation\n\n**Subject:** `[DIST-02] [P2] Internet path failure after provider handoff`\n\n## Impact\n\nCentral High School has no Internet access from multiple client VLANs. Internal services remain available.\n\n## Start Time\n\n2026-09-02 10:02 PT (synthetic)\n\n## Known Good\n\n- STAFF and STUDENT clients receive valid addressing.\n- AD/DNS and internal application traffic succeed.\n- VLAN gateways respond normally.\n- District edge WAN interface is `up/up` with zero error growth.\n- Default route remains installed.\n- No local WAN/firewall change occurred in the previous 24 hours.\n\n## Failed Boundary\n\nTraceroute from independent VLANs reaches provider handoff `198.51.100.9` and does not progress beyond it.\n\n## Circuit\n\nSynthetic circuit ID: `LAB-K20-DIST02-001`\n\n## Request\n\nPlease validate upstream routing/circuit state beyond the handoff and restore service if an upstream fault is confirmed. Notify us when the path is restored so we can repeat client and monitoring validation.\n",
        "evidence/client-tests.txt": "SYNTHETIC LAB EVIDENCE \u2014 INC-WAN-01\nTimestamp: 2026-09-02T10:11:22-07:00\n\n[STAFF CLIENT]\nIPv4: 10.2.10.44/24\nGateway: 10.2.10.1\nDNS: 10.2.30.10\n\nping 10.2.10.1\nReply from 10.2.10.1: time<1ms\nReply from 10.2.10.1: time<1ms\n\nnslookup portal.lab.example 10.2.30.10\nAddress: 10.2.30.50\n\nping 10.2.30.50\nReply from 10.2.30.50: time=1ms\n\nTCP 203.0.113.80:443\nFAILED: connection timeout\n\n[STUDENT CLIENT]\nIPv4: 10.2.20.77/23\nGateway: 10.2.20.1\nDNS: 10.2.30.10\n\nGateway: PASS\nInternal DNS: PASS\nInternal application: PASS\nExternal HTTPS: FAIL\n",
        "evidence/edge-interface.txt": "SYNTHETIC DEVICE OUTPUT \u2014 DIST-02 EDGE\n\ninterface GigabitEthernet0/0\n description WAN_TO_REGIONAL_PROVIDER\n line protocol: up\n physical state: up\n input errors: 0\n output errors: 0\n CRC: 0\n last flap: 18 days 04:12:09\n\nRouting:\n0.0.0.0/0 via 198.51.100.9, installed\n10.2.0.0/16 connected/internal summary\n\nRecent approved changes (24h): NONE\n",
        "evidence/snmp-alert.json": "{\n  \"synthetic\": true,\n  \"device\": \"DIST-02-EDGE-01\",\n  \"timestamp\": \"2026-09-02T10:03:08-07:00\",\n  \"metric\": \"wan_reachability\",\n  \"state\": \"critical\",\n  \"interface_state\": \"up\",\n  \"interface_utilization_pct\": 3.2,\n  \"packet_loss_external_pct\": 100.0,\n  \"local_gateway_reachability\": true\n}\n",
        "evidence/traceroute.txt": "SYNTHETIC LAB EVIDENCE \u2014 INC-WAN-01\nDestination: 203.0.113.80\n\n 1  10.2.10.1       <1 ms   DIST-02 L3 core\n 2  10.2.254.1       1 ms   DIST-02 edge\n 3  198.51.100.9      4 ms   provider handoff\n 4  *                  *     timeout\n 5  *                  *     timeout\n 6  *                  *     timeout\n\nSame boundary observed from STAFF and STUDENT test clients.\n",
        "README.md": "# INC-WAN-01 \u2014 High School Internet Outage\n\n![WAN case evidence map](../../assets/portfolio/wan-case-study.svg)\n\n## Executive Summary\n\nTwo independent client VLANs at a fictional high school lose Internet access while local AD/DNS, switching, and the default gateway remain healthy. The investigation establishes a known-good boundary through the district edge and shows the path failing immediately after the provider handoff. No local infrastructure change is required; the incident is escalated with a complete evidence package.\n\n## Initial Report\n\n> \u201cThe high school cannot get to the Internet. The internal file/application services still work.\u201d\n\n## Scope\n\n- District: `DIST-02`\n- Site: `DIST-02-HS`\n- Severity: P2\n- Affected: STAFF and STUDENT VLAN clients\n- Unaffected: local AD/DNS, internal application service, gateway\n- Start: 2026-09-02 10:02 PT (synthetic)\n\n## Investigation\n\n1. Reproduced from one STAFF and one STUDENT client.\n2. Confirmed DHCP configuration and local DNS service.\n3. Confirmed default gateway reachable in <1 ms.\n4. Confirmed district edge WAN interface is `up/up` with no error growth.\n5. Confirmed default route remains installed.\n6. Traceroute reaches the provider handoff `198.51.100.9` and fails beyond it.\n7. Checked change records: no approved local WAN/firewall change in the previous 24 hours.\n8. Escalated to the upstream NOC/carrier with source networks, circuit ID, timestamps, path evidence, and requested action.\n\n## Root-Cause Decision\n\n**Fault domain:** upstream WAN/provider path.\n\nThe important point is not that traceroute timed out. The decision is based on the combination of two affected VLANs, healthy local services, healthy gateway, healthy edge interface, present default route, and a consistent failure boundary at the provider handoff.\n\n## Evidence Files\n\n- [`evidence/client-tests.txt`](evidence/client-tests.txt)\n- [`evidence/traceroute.txt`](evidence/traceroute.txt)\n- [`evidence/edge-interface.txt`](evidence/edge-interface.txt)\n- [`evidence/snmp-alert.json`](evidence/snmp-alert.json)\n- [`escalation.md`](escalation.md)\n- [`closure.md`](closure.md)\n"
      }
    },
    "INC-FILTER-01": {
      "id": "INC-FILTER-01",
      "severity": "P3",
      "summary": "Teacher instructional SaaS blocked",
      "fault_domain": "Web Filter",
      "escalation": "Escalate to filter vendor only if product classification/behavior cannot be resolved locally.",
      "actions": [
        "Capture exact URL/FQDN",
        "Check category/block reason",
        "Identify auth/CDN/API dependencies",
        "Validate business need",
        "Create narrow approved exception"
      ],
      "evidence": [
        "user/group",
        "URL",
        "filter log",
        "timestamp",
        "before/after result"
      ],
      "files": {
        "change-record.md": "# Change Record \u2014 CHG-LAB-0042\n\n- **Requester:** instructional technology lead (synthetic)\n- **Business need:** access approved learning application\n- **Source scope:** STAFF group only\n- **Destination:** `api.learning-example.test`\n- **Service:** HTTPS / TCP 443 through managed web filter\n- **Risk:** low; specific dependency only\n- **Implementation:** add FQDN to STAFF application allowlist\n- **Rollback:** remove the single FQDN entry\n- **Validation:** teacher workflow + STUDENT control test\n- **Approval:** synthetic lab change authority\n",
        "evidence/dependencies.csv": "host,purpose,pre_change,required_scope\nauth.learning-example.test,authentication,ALLOW,STAFF\napi.learning-example.test,application API,BLOCK,STAFF\ncdn.learning-example.test,static content,ALLOW,STAFF\ntelemetry.learning-example.test,optional telemetry,BLOCK,none\n",
        "evidence/filter-event.json": "{\n  \"synthetic\": true,\n  \"timestamp\": \"2026-09-02T10:14:31-07:00\",\n  \"action\": \"BLOCK\",\n  \"user\": \"teacher.demo\",\n  \"group\": \"STAFF\",\n  \"host\": \"api.learning-example.test\",\n  \"category\": \"Newly-Observed\",\n  \"policy\": \"K12-Staff-Standard\",\n  \"reason\": \"Category policy\"\n}\n",
        "evidence/service-tests.txt": "SYNTHETIC LAB EVIDENCE \u2014 INC-FILTER-01\n\nResolve-DnsName learning-example.test        PASS\nTest-NetConnection learning-example.test 443 PASS\nResolve-DnsName auth.learning-example.test   PASS\nTest-NetConnection auth.learning-example.test 443 PASS\nResolve-DnsName api.learning-example.test    PASS\nTCP 443 api.learning-example.test            PASS\nBrowser request through managed filter       BLOCK\n\nInterpretation:\nNetwork path is healthy. Failure occurs at policy enforcement for a specific application dependency.\n",
        "README.md": "# INC-FILTER-01 \u2014 Approved Instructional SaaS Blocked\n\n## Executive Summary\n\nA teacher can browse normally and authenticate to an instructional SaaS application, but the application fails when it calls a newly categorized API endpoint. DNS and TCP connectivity succeed; the web-filter log identifies the exact dependency being blocked for the STAFF policy. A narrow FQDN exception is approved for the required group, and a STUDENT control test confirms that unrelated filtering remains intact.\n\n## Engineering Value\n\nThis case demonstrates why \u201cthe website is blocked\u201d should not result in disabling filtering or broadly allowing an entire cloud/CDN provider.\n\n## Evidence Files\n\n- [`evidence/filter-event.json`](evidence/filter-event.json)\n- [`evidence/service-tests.txt`](evidence/service-tests.txt)\n- [`evidence/dependencies.csv`](evidence/dependencies.csv)\n- [`change-record.md`](change-record.md)\n- [`validation.txt`](validation.txt)\n",
        "validation.txt": "SYNTHETIC VALIDATION \u2014 INC-FILTER-01\n\nSTAFF / teacher.demo\n- login: PASS\n- API call: PASS\n- application workflow: PASS\n\nSTUDENT / student.demo control\n- unrelated policy restrictions: PASS\n- management resources: DENIED as expected\n- no global TLS/filter bypass detected\n\nRollback tested conceptually: remove single FQDN exception.\n"
      }
    },
    "INC-SEC-01": {
      "id": "INC-SEC-01",
      "severity": "P1",
      "summary": "Student network can reach management interface",
      "fault_domain": "Segmentation/Security",
      "escalation": "Escalate immediately through security/change process; treat as security-impacting incident.",
      "actions": [
        "Confirm exposure safely",
        "Preserve firewall/switch logs",
        "Identify route/ACL path",
        "Restrict exposure using approved change",
        "Validate negative test"
      ],
      "evidence": [
        "source/destination",
        "policy/rule",
        "logs",
        "exposure window",
        "verification"
      ],
      "files": {
        "evidence/acl-after.txt": "SYNTHETIC CONFIGURATION SNAPSHOT \u2014 AFTER\n\nip access-list extended STUDENT-IN\n 10 deny   ip 10.2.20.0 0.0.1.255 10.2.40.0 0.0.0.255 log\n 20 permit udp 10.2.20.0 0.0.1.255 host 10.2.30.10 eq domain\n 30 permit tcp 10.2.20.0 0.0.1.255 any eq 443\n\nMGMT administration is governed by a separate authorized management policy.\n",
        "evidence/acl-before.txt": "SYNTHETIC CONFIGURATION SNAPSHOT \u2014 BEFORE\n\nip access-list extended STUDENT-IN\n 10 permit ip 10.2.20.0 0.0.1.255 10.2.40.0 0.0.0.255\n 20 deny   ip 10.2.20.0 0.0.1.255 10.2.40.0 0.0.0.255 log\n 30 permit udp 10.2.20.0 0.0.1.255 host 10.2.30.10 eq domain\n 40 permit tcp 10.2.20.0 0.0.1.255 any eq 443\n\nFinding: sequence 10 permits the exact management subnet before the intended deny.\n",
        "evidence/security-event.json": "{\n  \"synthetic\": true,\n  \"timestamp\": \"2026-09-02T11:22:18-07:00\",\n  \"source\": \"10.2.20.77\",\n  \"source_zone\": \"STUDENT\",\n  \"destination\": \"10.2.40.12\",\n  \"destination_zone\": \"MGMT\",\n  \"service\": \"HTTPS\",\n  \"observed\": \"allowed\",\n  \"expected\": \"denied\",\n  \"validation_scope\": \"single known management target\"\n}\n",
        "incident-report.md": "# Security Incident Report \u2014 INC-SEC-01\n\n## Condition\n\nA STUDENT network path could reach a management-subnet host because an ACL permit sequence preceded the intended deny.\n\n## Response\n\n1. Restricted testing to the single known destination.\n2. Preserved ACL and event evidence.\n3. Identified policy sequence error.\n4. Applied an approved, narrow ACL correction.\n5. Validated both denied student access and allowed authorized management access.\n6. Confirmed ordinary student DNS/HTTPS service remained functional.\n\n## Preventive Improvement\n\nAdd automated configuration validation that checks for broad STUDENT\u2192MGMT permits before deployment and include negative-control segmentation tests in the post-change checklist.\n",
        "README.md": "# INC-SEC-01 \u2014 Student-to-Management Segmentation Exposure\n\n![Campus segmentation model](../../assets/portfolio/segmentation-control-plane.svg)\n\n## Executive Summary\n\nAn authorized validation test detects unintended reachability from the STUDENT VLAN to a known switch management address. The test is kept narrowly scoped. Logs and ACL state are preserved before modification. Root cause is a misplaced permit sequence above the intended deny. The rule is corrected through the approved emergency-change workflow, then validated with both a **negative control** (student access must fail) and a **positive control** (authorized management access must still work).\n\n## Evidence Files\n\n- [`evidence/acl-before.txt`](evidence/acl-before.txt)\n- [`evidence/security-event.json`](evidence/security-event.json)\n- [`evidence/acl-after.txt`](evidence/acl-after.txt)\n- [`validation.txt`](validation.txt)\n- [`incident-report.md`](incident-report.md)\n",
        "validation.txt": "SYNTHETIC POST-CHANGE VALIDATION\n\nNEGATIVE CONTROL\nSTUDENT 10.2.20.77 -> MGMT 10.2.40.12 TCP/443\nRESULT: DENY / expected\nLOG: generated / expected\n\nPOSITIVE CONTROL\nMGMT 10.2.40.25 -> infrastructure management service\nRESULT: ALLOW / expected\n\nUSER-PATH CONTROL\nSTUDENT -> approved DNS + HTTPS Internet workflow\nRESULT: PASS / expected\n"
      }
    },
    "INC-DNS-01": {
      "id": "INC-DNS-01",
      "severity": "P3",
      "summary": "One classroom cannot resolve internal learning portal",
      "fault_domain": "DNS",
      "escalation": "Escalate to DNS/AD owner if authoritative records or resolver service are incorrect.",
      "actions": [
        "Compare resolver settings",
        "Query A/CNAME records",
        "Test known-good internal name",
        "Check DHCP-provided DNS"
      ],
      "evidence": [
        "client IP/config",
        "nslookup/Resolve-DnsName output",
        "timestamp",
        "affected VLAN"
      ],
      "files": {
        "evidence/diagnostics.txt": "SYNTHETIC LAB EVIDENCE\nClient has a valid DHCP lease and default gateway\nGateway and internal server IPs respond\nResolve-DnsName for the internal zone fails\nClient received a retired DNS resolver through an old DHCP option\n",
        "evidence/event.json": "{\n  \"synthetic\": true,\n  \"case\": \"INC-DNS-01\",\n  \"severity\": \"P3\",\n  \"district\": \"DIST-01\",\n  \"facts\": [\n    \"Client has a valid DHCP lease and default gateway\",\n    \"Gateway and internal server IPs respond\",\n    \"Resolve-DnsName for the internal zone fails\",\n    \"Client received a retired DNS resolver through an old DHCP option\"\n  ],\n  \"root_cause\": \"DHCP-provided DNS configuration referenced a retired resolver.\"\n}",
        "README.md": "# INC-DNS-01 \u2014 AD/DNS Authentication Failure\n\n> **Synthetic portfolio investigation.** No production school data is represented.\n\n**Severity:** P3  \n**District:** DIST-01\n\n## User-reported symptom\n\nA classroom can reach IP addresses but domain resources and the internal learning portal fail by hostname.\n\n## Evidence progression\n\n- Client has a valid DHCP lease and default gateway\n- Gateway and internal server IPs respond\n- Resolve-DnsName for the internal zone fails\n- Client received a retired DNS resolver through an old DHCP option\n\n## Fault domain\n\n**DHCP-provided DNS configuration referenced a retired resolver.**\n\n## Action\n\nCorrect the scoped DHCP option, renew the affected client lease, and validate AD SRV plus portal resolution.\n\n## Verification standard\n\nThe fix is not considered complete until the original workflow succeeds and an adjacent control path is shown to remain intact.\n",
        "validation.txt": "SYNTHETIC VALIDATION\nRoot cause: DHCP-provided DNS configuration referenced a retired resolver.\nAction: Correct the scoped DHCP option, renew the affected client lease, and validate AD SRV plus portal resolution.\nResult: PASS\n"
      }
    },
    "INC-WIFI-01": {
      "id": "INC-WIFI-01",
      "severity": "P3",
      "summary": "One classroom has poor Wi-Fi performance",
      "fault_domain": "Wireless",
      "escalation": "Escalate to wireless/network engineer with RF and wired evidence.",
      "actions": [
        "Compare clients",
        "Identify serving AP",
        "Check RSSI/SNR/channel utilization",
        "Check AP uplink/errors",
        "Test wired baseline"
      ],
      "evidence": [
        "AP",
        "SSID",
        "time",
        "signal metrics",
        "uplink status"
      ],
      "files": {
        "evidence/diagnostics.txt": "SYNTHETIC LAB EVIDENCE\nWAN utilization remains normal\nWired loss is below 0.2%\nAffected AP shows channel utilization above 85%\nNeighboring APs share overlapping 5 GHz channel\nClient RSSI is acceptable but retries are elevated\n",
        "evidence/event.json": "{\n  \"synthetic\": true,\n  \"case\": \"INC-WIFI-01\",\n  \"severity\": \"P3\",\n  \"district\": \"DIST-14\",\n  \"facts\": [\n    \"WAN utilization remains normal\",\n    \"Wired loss is below 0.2%\",\n    \"Affected AP shows channel utilization above 85%\",\n    \"Neighboring APs share overlapping 5 GHz channel\",\n    \"Client RSSI is acceptable but retries are elevated\"\n  ],\n  \"root_cause\": \"RF contention and excessive retries in the classroom coverage cell.\"\n}",
        "README.md": "# INC-WIFI-01 \u2014 Classroom Wireless Degradation\n\n> **Synthetic portfolio investigation.** No production school data is represented.\n\n**Severity:** P3  \n**District:** DIST-14\n\n## User-reported symptom\n\nA classroom reports intermittent Google Workspace disconnects while wired systems remain stable.\n\n## Evidence progression\n\n- WAN utilization remains normal\n- Wired loss is below 0.2%\n- Affected AP shows channel utilization above 85%\n- Neighboring APs share overlapping 5 GHz channel\n- Client RSSI is acceptable but retries are elevated\n\n## Fault domain\n\n**RF contention and excessive retries in the classroom coverage cell.**\n\n## Action\n\nRebalance channel assignment, validate client roaming, and confirm retries/latency return to baseline.\n\n## Verification standard\n\nThe fix is not considered complete until the original workflow succeeds and an adjacent control path is shown to remain intact.\n",
        "validation.txt": "SYNTHETIC VALIDATION\nRoot cause: RF contention and excessive retries in the classroom coverage cell.\nAction: Rebalance channel assignment, validate client roaming, and confirm retries/latency return to baseline.\nResult: PASS\n"
      }
    },
    "INC-INTUNE-01": {
      "id": "INC-INTUNE-01",
      "severity": "P3",
      "summary": "Windows device enrolled but policy is missing",
      "fault_domain": "Intune",
      "escalation": "Escalate to Intune admin if assignment/service-side state is inconsistent.",
      "actions": [
        "Verify tenant/join state",
        "Check last check-in",
        "Confirm assignment/filter scope",
        "Check conflicting profiles",
        "Review local MDM event log"
      ],
      "evidence": [
        "device ID",
        "assignment",
        "event IDs",
        "check-in time"
      ],
      "files": {
        "evidence/diagnostics.txt": "SYNTHETIC LAB EVIDENCE\nDNS/TCP/TLS paths to Microsoft endpoints succeed\nUser authentication succeeds\nDevice is Entra joined\nIntune last check-in is stale\nConditional Access denies because device compliance is unknown\n",
        "evidence/event.json": "{\n  \"synthetic\": true,\n  \"case\": \"INC-INTUNE-01\",\n  \"severity\": \"P3\",\n  \"district\": \"DIST-25\",\n  \"facts\": [\n    \"DNS/TCP/TLS paths to Microsoft endpoints succeed\",\n    \"User authentication succeeds\",\n    \"Device is Entra joined\",\n    \"Intune last check-in is stale\",\n    \"Conditional Access denies because device compliance is unknown\"\n  ],\n  \"root_cause\": \"Device compliance state was stale because MDM check-in had not completed.\"\n}",
        "README.md": "# INC-INTUNE-01 \u2014 Intune Compliance / Conditional Access\n\n> **Synthetic portfolio investigation.** No production school data is represented.\n\n**Severity:** P3  \n**District:** DIST-25\n\n## User-reported symptom\n\nA newly issued staff Windows device can browse the Internet but Microsoft 365 access is denied.\n\n## Evidence progression\n\n- DNS/TCP/TLS paths to Microsoft endpoints succeed\n- User authentication succeeds\n- Device is Entra joined\n- Intune last check-in is stale\n- Conditional Access denies because device compliance is unknown\n\n## Fault domain\n\n**Device compliance state was stale because MDM check-in had not completed.**\n\n## Action\n\nRestore Intune check-in, re-evaluate compliance, and validate Microsoft 365 access without weakening Conditional Access.\n\n## Verification standard\n\nThe fix is not considered complete until the original workflow succeeds and an adjacent control path is shown to remain intact.\n",
        "validation.txt": "SYNTHETIC VALIDATION\nRoot cause: Device compliance state was stale because MDM check-in had not completed.\nAction: Restore Intune check-in, re-evaluate compliance, and validate Microsoft 365 access without weakening Conditional Access.\nResult: PASS\n"
      }
    }
  },
  "version": "6.0"
};
