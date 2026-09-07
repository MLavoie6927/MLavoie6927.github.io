# INC-301 Scenario Design

## Objective
Demonstrate an evidence-driven investigation without immediately telling the analyst what conclusion to reach.

## Scenario
A finance user on synthetic endpoint `WS-108` receives and opens an external Office document. Subsequent telemetry develops into a suspicious process chain, persistence, DNS resolution, TLS egress, periodic beaconing, credential-access behavior and attempted SMB lateral movement.

The lateral SMB path is blocked by existing segmentation before the analyst begins containment. This gives the analyst an important distinction between **attempted activity** and **successful blast radius**.

## Confidence progression
The local domain/IP context begins weak. Confidence increases only when independent telemetry links the destination to suspicious process lineage and behavioral evidence.

Example progression:

```text
Context-only domain/IP                 LOW–MEDIUM confidence
            ↓
Suspicious process-attributed DNS      MEDIUM confidence
            ↓
Process-attributed TLS                 MEDIUM–HIGH confidence
            ↓
Low-jitter periodic beaconing          HIGH confidence
            ↓
Credential-access + lateral attempt    VERY HIGH confidence
```

## ATT&CK-oriented mapping
- `T1566.001` — Spearphishing Attachment
- `T1204.002` — User Execution: Malicious File
- `T1059.001` — PowerShell
- `T1218.011` — Rundll32
- `T1547.001` — Registry Run Keys / Startup Folder
- `T1071.004` — DNS
- `T1071.001` — Web Protocols
- `T1003` — OS Credential Dumping behavior family
- `T1021.002` — SMB / Windows Admin Shares

The project does not claim the synthetic telemetry is a perfect emulation of each ATT&CK technique. The mapping is used to teach analytical correlation and incident documentation.

## Required response outcome
A strong response must do more than block one destination. The analyst should:

1. scope the affected endpoint and user;
2. validate process lineage and network attribution;
3. isolate the endpoint;
4. block the scenario IOC;
5. revoke the affected user's synthetic sessions;
6. remove persistence;
7. reboot the synthetic endpoint;
8. verify malicious paths fail;
9. verify authorized management still works;
10. communicate the result.
