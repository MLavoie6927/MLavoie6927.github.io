# ATLAS Class 8 — Semi-Truck & Trailer Engineering Studio v3.0

**Author:** Marc Lavoie  
**Release date:** 2026-11-14  
**Implementation:** original local-first HTML, CSS, JavaScript and SVG; no npm, external fonts, CDN, API keys or server required.  
**Scope:** educational reference configuration, five-axle Class 8 tractor and 53-foot dry van.

## Open it

1. Extract the ZIP while preserving the folder tree.
2. Open `index.html` in a current desktop browser for standalone use.
3. To verify website integration, open `integration/embedded-preview.html` in a current browser. If your browser restricts cross-file frames, serve the folder from any static local HTTP server; e.g. `python -m http.server 8000` in this directory and browse to `/integration/embedded-preview.html`.
4. For incorporation into an existing website, follow `CODEX_HANDOFF.md` and `integration/website-snippet.html`.

## Major features

**Preserved from v2:** 117 searchable parts, 29 clickable tractor/trailer mechanical regions, five interactive technical blueprints, air-brake educational pressure-loss bench, 15 contiguous axle-group calculations, eight fault investigations, 18 inspection stations, ten fluid/capacity references, twelve maintenance-service entries, repair parts/labor estimator with CSV export, 15-question practice check and a source register.

**Added in v3:**

- Six selectable X-ray-style vector overlays with 32 clickable cross-linked component nodes, grounded in existing part records.
- Diesel drivetrain physics lab with independent engine torque, rpm, gearbox ratio, differential ratio, efficiency, tire diameter, vehicle weight and grade controls.
- Eighteen tire positions with selectable diagrams, editable tread depth, pressure reference, condition flag, scenario presets, browser-local persistence, and CSV export.
- Freight-placement lab with draggable via slider center-of-mass parameter and two-support static reactions; transfers estimated loads into the original bridge-limit screen.
- Responsive visual refresh, advanced learning cards, clearer module grouping, keyboard-accessible component nodes, reduced-motion support, diagrams pannable on phones.
- Website-specific iframe embed adapter (`integration/atlas-embed.js`) to prevent conflicts with existing CSS and JavaScript. Optional `?embed=1` child-frame size messages.
- Regression tests for engineering calculations, advanced UI and key v2 functionality.

## Navigation

Navigate using left-side tabs (mobile: top-left menu), or via URL hash:

`#explorer` `#systems` `#air` `#weight` `#diagnostics` `#inspection` `#fluids` `#maintenance` `#repairs` `#knowledge` `#xray` `#drivetrain` `#tires` `#loadplan` `#references`.

## Safety and provenance

**This project is an engineering teaching application, not an approved inspection, loading, tire inflation, brake repair, CDL test, or maintenance procedure.** Truck configuration, VIN-specific fluids, parts fitment, axle/tire ratings, shop labor, and repair costs need separate OEM/manufacturer and professional confirmation. Entered tire pressure values are *references* from an operator-selected load chart, not blanket OEM recommendations. No simulator result authorizes driving an unsafe or overloaded vehicle.

Federal reading list in the app's Reference Library; additional regulations relevant to the new labs:

- [49 CFR 393.75: tires](https://www.ecfr.gov/current/title-49/section-393.75)
- [FHWA Federal Bridge Formula](https://ops.fhwa.dot.gov/freight/publications/brdg_frm_wghts/index.htm)
- [FMCSA cargo securement](https://www.fmcsa.dot.gov/regulations/cargo-securement/cargo-securement-rules)

## Attribution

Original code and SVG diagrams prepared for **Marc Lavoie**, 2026-11-14. This project uses no proprietary vehicle-manufacturer CAD drawings or copies of OEM software.
