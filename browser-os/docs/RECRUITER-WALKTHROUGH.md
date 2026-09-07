# Browser OS 3.0 Recruiter Walkthrough

This is the intended five-minute demonstration path.

## 0:00–0:30 — Establish the truth model
Click **Start 5-Minute Recruiter Demo** from the boot screen. The Recruiter Demo states up front that enterprise telemetry is synthetic while the correlation, rule evaluation, evidence graph, response verification, reporting and state transitions are implemented in the application.

## 0:30–1:15 — Watch evidence accumulate
Start the live scenario. Early events are deliberately not conclusive. An external attachment is delivered, the user opens a document, Office spawns PowerShell, and additional signals appear over time. The scenario eventually develops persistence, DNS resolution, process-attributed TLS, beacon periodicity, credential-access behavior and an attempted SMB movement.

## 1:15–2:00 — Switch to analyst view
Open Process Explorer or the Evidence Graph. Follow:

```text
mturner
  → WS-108
  → WINWORD.EXE
  → powershell.exe
  → rundll32.exe
      → Run key
      → cdn-sync.example
      → 203.0.113.200:443
      → protected-process handle
```

Use graph pivots to jump into the supporting application rather than accepting a single alert as truth.

## 2:00–2:45 — Explain the detection
Open Detection Studio. Run `BOS3-DET-301`. Show the independent telemetry families and compare the scenario against the benign/dual-use updater candidate. Change the signal count or score threshold and rerun the analytic to demonstrate detection-tuning tradeoffs.

## 2:45–3:45 — Contain and remediate
In Incident Commander:

1. Isolate WS-108.
2. Block the synthetic C2 IOC.
3. Revoke mturner's synthetic sessions.
4. Remove the Run-key persistence.
5. Reboot the synthetic endpoint.

The same shared state updates the existing process/network/firewall/identity views.

## 3:45–4:30 — Prove containment worked
Run Response Verification. The desired result is not merely “blocked.” It must show:

- malicious C2 denied;
- authorized SOC management allowed;
- persistence absent;
- compromised session revoked;
- lateral SMB path blocked;
- clean reboot without staged process return.

## 4:30–5:00 — Communicate and show engineering maturity
Generate the Executive Brief and Technical Report. Then open Engineering Proof to show the automated assertion suite, CI workflow, threat model, ADRs and security invariants.

The intended takeaway is that Browser OS demonstrates a complete analytical loop:

```text
DETECTION
   ↓
VALIDATION
   ↓
SCOPING
   ↓
CONTAINMENT
   ↓
REMEDIATION
   ↓
VERIFICATION
   ↓
COMMUNICATION
   ↓
DETECTION IMPROVEMENT
```
