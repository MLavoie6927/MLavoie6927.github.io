# ADR-003: Require Positive and Negative Response Verification

**Status:** Accepted

## Context
Containment is not proven merely because an analyst pressed an isolation or block button.

## Decision
Browser OS 3.0 includes a deterministic verification harness. It validates that malicious C2 fails while an approved SOC management path remains available, persistence is absent, sessions are revoked, segmentation blocks lateral movement, and a clean reboot does not recreate the staged process lineage.

## Consequences
- The guided workflow demonstrates operational closure rather than button-click response.
- Incident status should not reach CLOSED without explicit analyst judgment and validation evidence.
