# Codex handoff — ATLAS Class A CDL Studio

## Ready-to-use master prompt

> Continue developing and integrating the supplied **ATLAS Class A CDL Safety & Routing Studio v1.0** (author Marc Lavoie, November 17, 2026) into my existing GitHub Pages website. Preserve the complete existing functionality and source content; do not replace the working project with a mockup. It is dedicated to Class A combination vehicles (tractor + 53-foot trailers, flats, lowboys, doubles/triples when authorized, intermodal and tankers). First inventory the supplied files and the target website's layout/nav, then create a new top-nav tab named **Class A CDL — Truck Safety** with the module embedded naturally in the site's design. Keep existing site functionality stable.
>
> Acceptance requirements:
> 1. Preserve all **222 scenario IDs**, **14 categories**, **24 drills**, predeparture checklist, vehicle checker, hazard reporting, export functions, regulatory references and safety disclaimers.
> 2. Keep HTML, CSS and JS in separate files. Maintain responsive, accessible interactions and keyboard support.
> 3. Refactor as necessary to avoid conflicting global IDs/CSS and avoid external dependencies unless justified; preserve testability and performance.
> 4. Do not claim live truck-safe routing, legal route approval or official DOT verification. Unknown/unverified data must never become a 'go' signal.
> 5. Expand functionality in milestones: (a) vehicle-profile presets and local hazardous-road notes; (b) scenario editorial review and source freshness metadata; (c) GIS map integration using an explicitly licensed truck-aware routing provider and validated state/local restrictions; (d) company/fleet verified hazard workflow with two-person approvals and provenance; (e) role-based dispatcher/driver/admin consoles and secure server persistence; (f) GPS route rejection and audit evidence; (g) more advanced visual maneuvering labs.
> 6. Add integration tests plus browser smoke tests, and test narrow mobile viewports, search, quiz persistence, local report export, modal focus and refusal-to-proceed outcomes.
> 7. Validate compliance claims with current FMCSA/eCFR/FHWA/state DOT sources; never present general recommendations as law. Integrate only grounded legal and location records, with timestamps and authority links.
> 8. Produce updated integrated code, a versioned ZIP, tests and brief changelog. Do not replace original author credit.

## Known v1 limits / recommended engineering milestones

- **v1.1** Add route-hazard provenance timestamps, source authority jurisdiction, effective/expiration dates, site entrance records, citation review. Support imported/exported *reviewed* reports, quarantined until validated.
- **v1.2** Expand simulator with axle loads, tandem position, bridge-formula warning and state-specific dimension-limit *reference UI*; do not replace a certified compliance calculation.
- **v1.3** Build high-resolution SVG illustrations of off-tracking, kingpin/fifth-wheel coupling, tandem placement, blind-side vs sight-side backing, dock restraints and rail-grade breakover.
- **v1.4** Add structured dispatch workflows including refusal-to-proceed, risk assessment, validated revised ETA, detention and HOS impact.
- **v2.0** Optional backend secured with authentication, rate limiting, verification workflow, audit trail and geospatial query. The existing local, no-transmission educational mode must continue to work offline.
- **v2.5** Optional licensed truck-specific GIS integration (do not call ordinary passenger GPS truck-safe), road authority restrictions, map-source governance and out-of-date warning. Display geographic records only with reliable coordinates and timestamps.
- **v3.0** Fleet dashboards and policy engine, driver education competency metrics, incident and near-miss review, hazards by fleet/vehicle configuration, no automated override of official road signs.

## Suggested prioritized review

1. Browser compatibility and visual regression in Chrome, Edge, Firefox and Safari.
2. Functional validation of `js/logic.js` for conservative outcomes and invalid/missing data.
3. Audit safety disclosures before labeling any condition as legal/illegal.
4. Check and improve accessibility of modal focus trap and accessible status updates.
5. Confirm all user-entered text is escaped, and sanitize all imported or external data.
6. Review localStorage quotas and retention, and provide an optional data purge feature.
7. Recheck linked government source URLs, especially state road restrictions for new closure notices.

The JSON catalog and original deterministic compiler make future edits and review straightforward.
