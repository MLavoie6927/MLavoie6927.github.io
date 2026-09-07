# Network Capacity Planning

## Measurements

Track per WAN/uplink:

- 95th percentile utilization,
- sustained peak duration,
- packet loss,
- errors/discards,
- latency where meaningful,
- growth trend,
- major scheduled events/software deployments.

## Review Trigger

Investigate when a link repeatedly exceeds 80% utilization during instructional hours or when errors/discards rise independently of bandwidth use.

## Recommendation Format

```text
Link: DIST-14 WAN
Current capacity: 1 Gbps
95th percentile: 790 Mbps
Peak: 940 Mbps
Trend: +11% quarter over quarter
Operational impact: video-conferencing degradation during 10:00–11:00
Recommendation: validate traffic composition, then evaluate capacity increase or scheduling/QoS changes.
```
