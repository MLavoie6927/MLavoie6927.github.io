# Service Provider NOC Security Engineering Lab

## Build, Validation, Failure, and Rollback Runbook

**Owner:** Marc Lavoie  
**Classification:** Public-safe simulated lab  
**Runtime:** Authorized GNS3 or EVE-NG environment  
**Configuration style:** Cisco IOS XE and PAN-OS candidate syntax  
**Evidence:** Synthetic unless an authorized runtime capture is explicitly attached

## 1. Purpose

This runbook builds a service-provider-style environment that combines carrier routing, customer service isolation, firewall engineering, telemetry, incident response, and NOC troubleshooting. It is designed to answer a complete operational question:

> When a customer reports an outage, can the analyst distinguish transport failure, routing failure, firewall policy, application failure, and malicious traffic; restore service; preserve evidence; and prevent recurrence?

This project is not affiliated with a telecommunications company and contains no production configurations, customer information, credentials, or real incident evidence.

## 2. Required Lab Nodes

| Node | Suggested lab image | vCPU | RAM | Interfaces | Purpose |
|---|---|---:|---:|---:|---|
| ISP-1 | IOSv/CSR1000v equivalent | 1-2 | 1-3 GB | 1 | Simulated upstream AS 64501 |
| EDGE-1 | IOSv/CSR1000v equivalent | 1-2 | 1-3 GB | 2 | eBGP edge and RTBH trigger |
| P1, P2, P3 | MPLS-capable IOSv/CSR equivalent | 1-2 | 1-3 GB each | 2-3 | OSPF/BFD/LDP transport |
| PE1, PE2 | MPLS VPN-capable IOSv/CSR equivalent | 2 | 2-4 GB each | 4-5 | MP-BGP, VRF, PE-CE routing |
| CE-A1, CE-A2, CE-B1 | IOSv equivalent | 1 | 512 MB-1 GB | 2 | Customer routing |
| NGFW-1 | Authorized PAN-OS VM or equivalent | Per vendor | Per vendor | 3 | NAT, security, threat and DoS policy |
| WEB01 | Ubuntu Server | 1 | 1 GB | 1 | Public web service |
| DNS01 | Ubuntu Server | 1 | 1 GB | 1 | Authoritative lab DNS |
| SOC01 | Ubuntu Server | 2-4 | 4-8 GB | 2 | SIEM/syslog and analyst tools |
| IDS01 | Ubuntu Server | 2 | 2-4 GB | 2 | Suricata sensor |
| TEST01 | Ubuntu Server | 1 | 1 GB | 1 | Bounded, authorized traffic tests |

Use only properly licensed images. Exact interface names may differ by image; update the link map and configurations before applying them.

## 3. Cabling

Create the links in this order:

```text
ISP-1 Gi0/0   <-> EDGE-1 Gi0/0
EDGE-1 Gi0/1  <-> NGFW-1 ethernet1/1
NGFW-1 ethernet1/2 <-> L2 segment VLAN 310
VLAN 310      <-> PE1 Gi0/3 and PE2 Gi0/3

PE1 Gi0/0 <-> P1 Gi0/0
PE1 Gi0/1 <-> P2 Gi0/0
P1  Gi0/1 <-> P3 Gi0/0
P2  Gi0/1 <-> P3 Gi0/1
P3  Gi0/2 <-> PE2 Gi0/0
P1  Gi0/2 <-> PE2 Gi0/1

PE1 Gi0/2 <-> CE-A1 Gi0/0
PE2 Gi0/2 <-> CE-A2 Gi0/0
PE1 Gi0/4 <-> CE-B1 Gi0/0

CE-A1 Gi0/1 <-> Customer A Site 1 LAN
CE-A2 Gi0/1 <-> Customer A Site 2 LAN
CE-B1 Gi0/1 <-> Customer B Site 1 LAN
```

Mirror NGFW untrust and customer-service traffic to IDS01 where the virtual platform supports a SPAN or packet-capture link. Keep management on an isolated network.

## 4. Preflight

1. Record the image and software release for every node.
2. Confirm that the router image supports MPLS, LDP, VRFs, MP-BGP VPNv4, and BFD.
3. Confirm out-of-band console access.
4. Verify that no interface connects to a production or public network.
5. Replace local password placeholders at the console; never commit them.
6. Create clean snapshots before configuration.
7. Set the project clock to UTC and configure one controlled lab NTP source.

## 5. Router Deployment Order

Apply [`ROUTER-CONFIGURATIONS.txt`](ROUTER-CONFIGURATIONS.txt) in this sequence:

1. Common management baseline on all IOS XE nodes.
2. P1, P2, and P3 underlay interfaces, OSPF, BFD, MPLS, and LDP.
3. PE1 and PE2 underlay and loopback reachability.
4. PE1-to-PE2 MP-BGP VPNv4.
5. CUST_A and CUST_B VRFs and route targets.
6. CE-A1, CE-A2, and CE-B1 eBGP sessions with outbound allowlists.
7. PE inbound prefix allowlists and maximum-prefix controls.
8. EDGE-1 and ISP-1 eBGP with default-only import and owned-prefix export.
9. Customer A firewall transit and controlled default-route export.
10. Normal-operation validation before any negative test.

Do not troubleshoot every protocol at once. Validate each dependency before moving upward:

```text
Interface state
  -> IP adjacency
  -> OSPF reachability
  -> LDP session and labels
  -> MP-BGP VPNv4
  -> VRF route import/export
  -> PE-CE BGP
  -> Customer forwarding
  -> Firewall and NAT
  -> Telemetry
```

## 6. Web Service Host

Run on the isolated WEB01 Ubuntu host. The example uses Nginx and a static status page; package installation requires an approved lab repository connection.

```bash
sudo ip address add 10.50.10.10/24 dev ens3
sudo ip link set ens3 up
sudo ip route replace default via 10.50.10.1

sudo apt-get update
sudo apt-get install -y nginx
sudo systemctl enable --now nginx

sudo tee /var/www/html/index.html >/dev/null <<'HTML'
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Customer A Lab Service</title></head>
<body><h1>Customer A Lab Service</h1><p>Status: operational</p></body>
</html>
HTML

curl -I http://127.0.0.1/
ss -lntp | grep -E ':80|:443'
```

For HTTPS, create a lab-only certificate using the organization's approved test PKI. Do not publish private keys or reuse a production certificate.

## 7. DNS Service Host

Run on DNS01:

```bash
sudo ip address add 10.50.10.53/24 dev ens3
sudo ip link set ens3 up
sudo ip route replace default via 10.50.10.1

sudo apt-get update
sudo apt-get install -y bind9 bind9-utils
sudo tee /etc/bind/db.lab-web.example >/dev/null <<'ZONE'
$TTL 300
@ IN SOA ns1.lab-web.example. admin.lab-web.example. (
  2026081401 3600 600 86400 300 )
@   IN NS ns1.lab-web.example.
ns1 IN A  10.50.10.53
www IN A  198.51.100.50
ZONE

sudo tee /etc/bind/named.conf.local >/dev/null <<'CONF'
zone "lab-web.example" {
  type master;
  file "/etc/bind/db.lab-web.example";
  allow-transfer { none; };
};
CONF

sudo named-checkconf
sudo named-checkzone lab-web.example /etc/bind/db.lab-web.example
sudo systemctl restart bind9
dig @127.0.0.1 www.lab-web.example A +short
```

The public DNS NAT rule is deliberately limited to authoritative DNS. Recursion should remain disabled for untrusted clients.

## 8. NGFW Deployment

Apply [`PALO-ALTO-CONFIGURATION.txt`](PALO-ALTO-CONFIGURATION.txt) in stages:

1. Export the pre-change configuration and record change metadata.
2. Configure interfaces, zones, and static routes.
3. Add public and translated address objects.
4. Add HTTP, HTTPS, TCP DNS, and UDP DNS objects.
5. Configure destination NAT.
6. Configure SIEM log forwarding and licensed threat profiles.
7. Configure zone and classified DoS profiles with bounded lab thresholds.
8. Install policy in explicit order.
9. Validate the candidate and inspect the diff.
10. Commit only after console access and rollback are confirmed.
11. Run positive and negative service tests.

## 9. Syslog and SIEM Collector

The commands below provide a lightweight syslog evidence collector. Splunk or ELK can replace the text collector when licensed/available.

```bash
sudo ip address add 10.50.10.40/24 dev ens3
sudo ip link set ens3 up
sudo ip route replace default via 10.50.10.1

sudo apt-get update
sudo apt-get install -y rsyslog jq tcpdump
sudo mkdir -p /var/log/noc-lab

sudo tee /etc/rsyslog.d/30-noc-lab.conf >/dev/null <<'RSYSLOG'
module(load="imudp")
input(type="imudp" port="514")
module(load="imtcp")
input(type="imtcp" port="514")
template(name="NocLab" type="string" string="%timereported:::date-rfc3339% %fromhost-ip% %syslogtag%%msg%\n")
if ($fromhost-ip startswith "10.") or ($fromhost-ip startswith "192.0.2.") then {
  action(type="omfile" file="/var/log/noc-lab/network.log" template="NocLab")
  stop
}
RSYSLOG

sudo systemctl restart rsyslog
sudo ss -lnup | grep ':514'
sudo tail -f /var/log/noc-lab/network.log
```

For Splunk or ELK detections, use [`SIEM-AND-DETECTION.txt`](SIEM-AND-DETECTION.txt). Do not put product credentials or API tokens in deployment scripts.

## 10. Suricata Sensor

On IDS01, connect one interface to the monitored/SPAN segment and one to isolated management.

```bash
sudo apt-get update
sudo apt-get install -y suricata jq
sudo suricata-update
sudo suricata -T -c /etc/suricata/suricata.yaml -v
sudo systemctl enable --now suricata
sudo journalctl -u suricata --since "5 minutes ago"
sudo tail -f /var/log/suricata/eve.json | jq -c 'select(.event_type=="alert" or .event_type=="flow")'
```

Install the custom lab rules from `SIEM-AND-DETECTION.txt`, test with `suricata -T`, and restart only after the rule file passes.

## 11. NetFlow/IPFIX Export

Platform syntax varies. The IOS XE-style flow monitor below is applied only where the image supports Flexible NetFlow.

```text
configure terminal
 flow record NOC-SECURITY-RECORD
  match ipv4 source address
  match ipv4 destination address
  match ip protocol
  match transport source-port
  match transport destination-port
  collect counter packets long
  collect counter bytes long
  collect timestamp sys-uptime first
  collect timestamp sys-uptime last
 exit
 flow exporter NOC-SECURITY-EXPORTER
  destination 10.50.10.40
  source Loopback0
  transport udp 2055
  export-protocol netflow-v9
 exit
 flow monitor NOC-SECURITY-MONITOR
  record NOC-SECURITY-RECORD
  exporter NOC-SECURITY-EXPORTER
  cache timeout active 60
 exit
 interface GigabitEthernet0/0
  ip flow monitor NOC-SECURITY-MONITOR input
  ip flow monitor NOC-SECURITY-MONITOR output
 exit
end
```

Verify with:

```text
show flow exporter NOC-SECURITY-EXPORTER
show flow monitor NOC-SECURITY-MONITOR cache format table
show platform hardware qfp active feature netflow client
```

## 12. Normal-Operation Acceptance

Save output for each command:

```text
show interfaces description
show ip ospf neighbor
show bfd neighbors details
show ip route ospf
show mpls ldp neighbor
show mpls forwarding-table
show bgp vpnv4 unicast all summary
show ip route vrf CUST_A
show ip route vrf CUST_B
show bgp ipv4 unicast vrf CUST_A neighbors
show bgp ipv4 unicast neighbors 203.0.113.1
```

Positive service tests from Customer A Site 1:

```bash
ping -c 5 10.50.20.10
traceroute 10.50.20.10
curl -I --connect-timeout 5 http://198.51.100.50/
dig @198.51.100.53 www.lab-web.example A +time=2 +tries=1
```

Negative isolation tests:

```bash
ping -c 3 10.60.10.10
traceroute 10.60.10.10
curl --connect-timeout 3 http://10.60.10.10/
```

Expected: Customer A has no CUST_B route. Failure should be attributable to route isolation, not a hidden ACL.

## 13. Bounded DDoS-Control Test

Never use unrestricted flood options. The high-rate values in the dashboard are synthetic. The only packet generator example is bounded to the isolated documentation VIP:

```bash
TARGET=198.51.100.50
nping --tcp -p 443 --flags syn --rate 100 --count 1000 "$TARGET"
```

Before running:

- Verify the destination exists only in the lab.
- Confirm the authorized test window and owner.
- Capture NGFW counters and SIEM state.
- Keep the rate at or below 100 packets per second and count at or below 1,000.
- Stop if any traffic exits the isolated environment.

Packet capture:

```bash
sudo timeout 20 tcpdump -i ens4 -nn -s 0 -w IR-01-bounded-syn-test.pcap \
  'host 198.51.100.50 and tcp port 443'
sha256sum IR-01-bounded-syn-test.pcap
capinfos IR-01-bounded-syn-test.pcap
```

## 14. Routing Failure Test

Use the fault-injection and rollback commands in `ROUTER-CONFIGURATIONS.txt`. Record:

- BFD detection time.
- OSPF adjacency loss and SPF completion.
- New route and label path.
- Packet loss during convergence.
- Customer service status.
- Time to restore the failed link.

Do not claim sub-second convergence unless packet evidence and timestamps prove it.

## 15. Route-Leak Prevention Test

Use the CE-A1 negative test in `ROUTER-CONFIGURATIONS.txt`. Success requires all of the following:

- CE-A1 originates the controlled test default.
- PE1 receives but rejects the unauthorized update.
- The CUST_A forwarding table remains unchanged except for the provider-controlled NGFW default.
- CUST_B and the global table remain unchanged.
- The SIEM receives a routing-policy event.
- The test route is removed and post-test health is verified.

## 16. Offline Health Check

No network access or credentials are required:

```bash
python3 noc_security_health_check.py --input sample_telemetry.json --scenario normal
python3 noc_security_health_check.py --input sample_telemetry.json --scenario ddos
python3 noc_security_health_check.py --input sample_telemetry.json --scenario compromise
python3 noc_security_health_check.py --input sample_telemetry.json --scenario routing_failure
python3 noc_security_health_check.py --input sample_telemetry.json --scenario route_leak --json
```

## 17. Evidence Preservation

```bash
CASE=IR-01
mkdir -p "evidence/$CASE/original" "evidence/$CASE/working" "evidence/$CASE/reports"
cp --preserve=timestamps IR-01-bounded-syn-test.pcap "evidence/$CASE/original/"
find "evidence/$CASE/original" -type f -print0 | sort -z | xargs -0 sha256sum \
  > "evidence/$CASE/${CASE}-SHA256SUMS.txt"
cp -a "evidence/$CASE/original/." "evidence/$CASE/working/"
chmod -R a-w "evidence/$CASE/original"
date -u +'%Y-%m-%dT%H:%M:%SZ' > "evidence/$CASE/${CASE}-collection-utc.txt"
```

Record analyst, source, acquisition method, original path, destination, hash, UTC timestamp, and every custody transfer. Never publish real packet captures or logs until they have been reviewed for credentials, customer data, public IPs, hostnames, domains, tokens, and personal data.

## 18. Final Acceptance Gate

The lab is operationally complete only when:

1. All required nodes are present and interface descriptions match the link map.
2. Expected OSPF, BFD, LDP, MP-BGP, and PE-CE BGP peers are established.
3. P routers contain no customer routes.
4. CUST_A and CUST_B import only their matching route targets.
5. Positive Customer A site-to-site traffic succeeds.
6. Cross-customer tests fail because no route is imported.
7. Public HTTP/HTTPS and DNS match only approved NAT and security rules.
8. Untrusted ICMP and unmatched traffic are denied and logged.
9. SIEM, IDS, flow, firewall, DNS, and endpoint telemetry are fresh.
10. The routing failure uses the alternate path and recovers cleanly.
11. The unauthorized prefix is rejected with no forwarding change.
12. The bounded traffic test triggers expected counters without external impact.
13. Rollback steps are tested or independently reviewed.
14. Evidence is timestamped, hashed, attributable, and public-safe.

Until those runtime checks are performed on an authorized platform, the portfolio accurately describes this package as a complete engineering design with static validation and synthetic evidence, not as a production deployment.

