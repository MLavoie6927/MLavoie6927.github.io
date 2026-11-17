# ATLAS Class A CDL Safety & Routing Studio v1.0

**Author / project credit:** Marc Lavoie  
**Date:** November 17, 2026  
**Purpose:** A portable, dependency-free, responsive learning and incident-documentation module for **U.S. Class A commercial driver's license combination vehicles**.

## Delivered

- **222 original operational scenario records** in **14 categories**, expanding the supplied 98-entry baseline. Each record includes an ID, severity, Class A scenario context, recommended response, driver/coordination roles, unsafe assumption, evidence checklist, and reference-context link.
- **24 multiple-choice decision drills** with immediate feedback, explanatory answers and links to official material when available.
- **Class A profile and restriction comparison tool**, checking entered gross weight, overall length, height, width, truck prohibition and hazmat ban. Missing data remains `VERIFY`; a blocking conflict returns `STOP`. It never returns a route authorization.
- **28-item predeparture field-guide checklist**, with browser-only saved progress.
- **Dispatcher message builder**, with clipboard export.
- **Hazard reporting**, 3 evidence statuses (unverified observation, observed sign, official source reviewed), local storage, deletion and CSV/JSON export.
- **Source desk** for federal, state, and city authority pages.
- **Responsive dark UI**, keyboard navigation, accessible inputs, search, filters, modal detail and mobile layout.

## Run locally

Open `index.html` in Chrome, Edge, Firefox or another modern browser. No npm install, backend, external web services, account, cloud service, frameworks, external fonts or CDN are required.

Optional local server:

```bash
python -m http.server 8080
# open http://localhost:8080/
```

## Add to a GitHub Pages / existing website

**Option A — separate page:** Copy the full `ATLAS-Class-A-CDL-Safety-Studio-v1.0/` folder into the existing repository, for example `tools/class-a-cdl/`, and link your website navigation to `/tools/class-a-cdl/`. This is simplest and avoids CSS collision.

**Option B — embedded within an existing page:** See `embed-example.html`. It uses a responsive `iframe` whose source points at this folder's `index.html`. Host the full folder alongside your site.

**Option C — merge as a native tab:** Have Codex import the `.atlas-cdl` markup from `index.html`, `assets/styles.css`, and scripts in this exact order: `js/catalog.js`, `js/quiz.js`, `js/logic.js`, `js/app.js` (all deferred). The CSS is mostly scoped to `.atlas-cdl`, but the main `body` reset remains appropriate only for this standalone entrypoint; for native embedding, move page resets to the host stylesheet or omit them. Retain unique DOM IDs. Confirm other host scripts do not use conflicting IDs. `index.html` `<meta>` and `<title>` are separate from the host page.

## Source layout

```
index.html               UI and accessibility structure
embed-example.html       Host-page embedding example
assets/styles.css        Scoped responsive dark theme
js/catalog.js            Compiled catalog (browser global)
js/quiz.js               Original multiple-choice assessment set
js/logic.js              Pure evaluators + filtering + CSV export
js/app.js                UI event and localStorage controllers
docs/catalog.json        Structured copy of the training catalog
docs/README.md           This file
docs/CODEX_HANDOFF.md    Next-phase integration and development instructions
docs/RESEARCH_NOTES.md   Authority hierarchy, rules, limitations
tools/build_catalog.py   Deterministic catalog build source
tests/test-logic.cjs     Node built-in assertions; no npm needed
```

## Developer tests

```bash
node --check js/app.js
node --check js/logic.js
node --check js/quiz.js
node tests/test-logic.cjs
python tools/build_catalog.py  # regenerates catalog files; no third-party Python packages
```

## Important safety limitations

1. **Never use the comparison tool as truck GPS** or as permission to enter a route. It does no GIS pathfinding, turn-envelope modeling, authoritative clearance verification, live restrictions, commercial road-network search, bridge engineering or permit evaluation.
2. **13 feet 6 inches is not a national federal maximum height.** State/local laws and actual posted clearance vary. Likewise the familiar 80,000-pound interstate gross-weight figure does not override axle/group limits, bridge formula, permits or other restrictions.
3. **All presented case scenarios are illustrative training records**, not claims that a specific company, map or road currently has a hazard. The independent source URLs provide applicable *context*, not incident-specific legal rulings.
4. **Reported hazards are not independently verified.** Selecting "official source reviewed" records a driver's assertion; the app does not verify the source.
5. **No sensitive or personally identifying information should be stored here.** All reports persist in that browser's localStorage until exported/deleted; storage may be disabled or cleared.
6. The app does **not** track or submit to government agencies, dispatchers, GIS providers, or carriers. Nothing is transmitted by this module, except when the user chooses to click an external source URL, handled directly by the browser.
7. For production deployment, implement authentication, server validation, role-based approval, audit logs, privacy policies, content moderation, authoritative government feeds, and truck-routing integration before presenting verified hazards to drivers.

## Content maintenance

Regulatory links reflect sources checked November 17, 2026; confirm all authorities before production, especially official 2026/2027 state notices. Compiled `js/catalog.js` is generated from `tools/build_catalog.py`. Do not edit the compiled file alone if you need changes to persist. Do not copy proprietary maps, agency datasets, or third-party content without appropriate license checks.
