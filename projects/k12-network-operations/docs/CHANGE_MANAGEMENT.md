# Change Management

## Required Change Fields

- change ID
- owner
- customer/district
- objective
- business reason
- affected systems
- risk
- implementation steps
- validation steps
- rollback
- maintenance window
- approval
- completion result

## Example

```text
Change: CHG-2026-0042
District: DIST-12
Objective: Add required FQDN to staff instructional SaaS allowlist
Scope: STAFF group only
Risk: Low
Validation: test application login and core workflow
Rollback: remove allowlist entry
```

## Principle

A support engineer should be able to explain:
1. what changed,
2. why,
3. who approved it,
4. how it was validated,
5. how it can be reversed.
