# ADR-002: Use One Shared Incident State Across Applications

**Status:** Accepted

## Context
A portfolio simulator becomes unconvincing when each screen contains unrelated mock data.

## Decision
The live attack, process/network/packet views, evidence graph, detection engine, incident commander, verification suite, audit trail, and reports operate on the same Browser OS state.

## Consequences
- A containment action changes the evidence shown elsewhere.
- Reports are generated from recorded state instead of hard-coded prose.
- Scenario resets must clean tagged artifacts across multiple subsystems.
