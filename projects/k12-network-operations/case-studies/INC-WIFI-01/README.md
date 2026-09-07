# INC-WIFI-01 — Classroom Wireless Degradation

> **Synthetic portfolio investigation.** No production school data is represented.

**Severity:** P3  
**District:** DIST-14

## User-reported symptom

A classroom reports intermittent Google Workspace disconnects while wired systems remain stable.

## Evidence progression

- WAN utilization remains normal
- Wired loss is below 0.2%
- Affected AP shows channel utilization above 85%
- Neighboring APs share overlapping 5 GHz channel
- Client RSSI is acceptable but retries are elevated

## Fault domain

**RF contention and excessive retries in the classroom coverage cell.**

## Action

Rebalance channel assignment, validate client roaming, and confirm retries/latency return to baseline.

## Verification standard

The fix is not considered complete until the original workflow succeeds and an adjacent control path is shown to remain intact.
