# INC-INTUNE-01 — Intune Compliance / Conditional Access

> **Synthetic portfolio investigation.** No production school data is represented.

**Severity:** P3  
**District:** DIST-25

## User-reported symptom

A newly issued staff Windows device can browse the Internet but Microsoft 365 access is denied.

## Evidence progression

- DNS/TCP/TLS paths to Microsoft endpoints succeed
- User authentication succeeds
- Device is Entra joined
- Intune last check-in is stale
- Conditional Access denies because device compliance is unknown

## Fault domain

**Device compliance state was stale because MDM check-in had not completed.**

## Action

Restore Intune check-in, re-evaluate compliance, and validate Microsoft 365 access without weakening Conditional Access.

## Verification standard

The fix is not considered complete until the original workflow succeeds and an adjacent control path is shown to remain intact.
