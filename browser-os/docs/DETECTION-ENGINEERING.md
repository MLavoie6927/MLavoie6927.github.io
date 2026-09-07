# Detection Engineering — BOS3-DET-301

`BOS3-DET-301` is intentionally a correlation analytic rather than a single-indicator rule.

## Inputs
Potential signals include:

- Office parent process;
- encoded PowerShell;
- Run-key persistence;
- rare/suspicious DNS;
- Rundll32-attributed TLS;
- low-jitter periodicity;
- protected-process access;
- lateral SMB attempt.

## Promotion controls
The rule exposes:

- minimum matched-signal count;
- score threshold;
- process-lineage requirement;
- network-correlation requirement;
- known-updater suppression.

## False-positive lesson
The retained `updater.exe` scenario demonstrates why periodic TLS alone is insufficient. A legitimate updater can be periodic, signed, and network-active. The detector should use parentage, identity, destination context, execution chain and additional telemetry before high-confidence promotion.

## Portfolio point
The important demonstration is not that Browser OS can display a red alert. It is that the analyst can explain **why the rule fired, what evidence made it diagnostic, what could create false positives, how tuning changes behavior, and how to compare before/after results**.
