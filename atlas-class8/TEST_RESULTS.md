# ATLAS Class 8 v3.0 — Verification report

Marc Lavoie · 2026-11-14

## Verified in current build

**Static data validation — PASS** (`node tests/validate_data.js`):

- 117 unique catalog parts / 29 referenced zones / 10 fluid entries.
- 5 original flow blueprints / 30 valid component-node references.
- 8 diagnostic cases / 18 existing inspection stations / 12 maintenance services / 15 CDL practice questions.
- Component descriptions, ID references, pricing fields and labor-hour bounds validated.

**Pure-model regression — PASS** (`node tests/test_math.js`):

- Drivetrain torque multiplication, tire radius / contact force and ideal speed math.
- Cargo mass conservation, forward/aft reaction shift, nonnegative parameter rejection.
- All 18 tire positions and front-vs-other federal tread thresholds; damage / low-pressure flags.

**Headless Chromium interaction tests — PASS** (`python tests/test_v3.py`):

1. Legacy 117 searchable parts and 29 tractor/trailer illustration hotspots remain available.
2. All six new X-ray layers, selectable SVG callouts and component deep links work.
3. Gear ratio controls update modeled road-speed and drivetrain outputs.
4. Eighteen tire hotspots, simulated failure, record reset and selection function.
5. Cargo location changes force reactions and transfers calculated axle estimates into the original 15-group bridge model.
6. Existing air-brake test can detect an excessive illustrative leak.
7. Existing parts-and-labor repair estimator still builds a work order.
8. New layout renders at desktop and 390-pixel mobile width with no page-level horizontal overflow; mobile navigation works.
9. Host adapter creates the iframe, spans host container width, accepts verified frame resize messages and retains host markup. Child ATLAS UI was injected into an in-memory frame to inspect isolation.
10. No uncaught JavaScript errors on desktop, mobile or embed-host smoke checks.

## Environment limitation / honest scope

The controlled test browser blocks direct navigation to local `file://` and loopback HTTP addresses. Browser tests therefore load the exact local asset bytes in their intended script order using Playwright in-memory injection; host embed tests include injected child content and controlled resize events. This does **not** replace an end-to-end deployment test against the user's actual website, production route, GitHub Pages base path and content security policy. Codex should test those on integration.

These tests verify code behavior and user interface interactions, not the real-world correctness or legality of a vehicle maintenance procedure or operating condition.

## Screenshots

- `preview-v3-dashboard.png`
- `preview-v3-xray.png`
- `preview-v3-powertrain.png`
- `preview-v3-tires.png`
- `preview-v3-cargo.png`
- `preview-v3-mobile.png`
- `preview-v3-website-embed.png` (in-memory iframe integration preview)
