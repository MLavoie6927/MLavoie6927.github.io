# Engineering Decisions

## Static-first presentation

The portfolio UI uses plain HTML, CSS, SVG, and JavaScript with local datasets. That keeps the project deployable on GitHub Pages and prevents the demo from depending on a backend, credentials, or a live school environment.

## Deterministic synthetic data

Operational data is fictional and deterministic. The purpose is repeatability: an interviewer can reopen the same incident or capacity trend and see the same evidence chain.

## Evidence before remediation

The incident model does not recommend a configuration change until the failure boundary is established. This reduces the risk of broad firewall/filter bypasses or unnecessary infrastructure changes.

## Transparent forecasting

Capacity forecasting uses a simple linear trend. It is intentionally explainable. A portfolio project should not hide a small dataset behind an opaque model and imply predictive certainty.

## Read-only diagnostics first

Windows/Linux collectors emphasize observation. Infrastructure modification remains documented in change records with approval, rollback, and verification.

## Positive and negative verification

A fix is incomplete if only the original user workflow succeeds. Security-sensitive changes also test that protected paths remain blocked and unrelated services remain functional.
