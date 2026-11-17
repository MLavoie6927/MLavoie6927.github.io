# ATLAS — U.S. Class A CDL GPS Trap & Hazard Atlas v1.1

**Prepared for Marc Lavoie · 2026-11-17**

A complete, offline-first Class A CDL visual geographic atlas in **HTML, CSS and vanilla JavaScript**, continuing v1.0 rather than replacing it. **No quizzes and no tests for website visitors.** The included developer automated tests are not shown to users.

## Start

1. Extract the ZIP without renaming the `assets` folder.
2. Open `index.html` in a desktop browser. All data, state shapes, icons and map visuals are local; no mapping API key, internet, npm install, or build step is required.
3. Click **GPS TRAP ROADS** to toggle the 30 new documented road profiles; orange markers zoom in to specific locations. Open the **Road conflict explorer** below the map to browse by name, state, category, or issue.
4. To integrate with your existing website, see `docs/CODEX_HANDOFF.md` and `embed-example.html`.

## What's included

- **50 U.S. states plus Washington, D.C.**, offline SVG geography including Alaska/Hawaii insets.
- The original **80 mapped locations** (30 source-backed entries and 50 explicitly illustrative state planning zones) plus a **new layer of 30 named source-backed GPS-conflict road profiles across 15 states**. Some represent the same restriction already summarized by an existing v1.0 marker, now with fuller visual detail; do not interpret these as 110 unique real-world hazards.
- All previous pan/zoom, pins, clustering, search, category and status filters, state selection, layer toggles, visual heat (curated-entry concentration only), corridor guides, and SVG export.
- **New:** orange GPS-trap line-symbol overlays, cluster expansion, searchable road-profile explorer, live selection on map and sidebar, safety/authority panels, precise source links, dedicated schematic risk diagrams, and editable Class A vehicle-profile comparisons.
- Road issues: no-truck parkways, low bridges, tight mountain curves, combined-length restrictions, weight/registration restrictions, California KPRA, tunnel/hazmat constraints, and weather/chain rules.
- Responsive desktop and mobile views, map-only embeddable mode, no network dependencies.

## Accuracy and safety rules

1. This is an **educational visual atlas**, not truck-specific navigation, trip dispatch approval, an exact low-bridge clearance registry, an accident-statistics heatmap, or a current traffic feed.
2. **There is no evidence in this software that a named GPS product currently sends drivers onto these roads.** It identifies published truck restrictions and *possible conflicts with passenger-car navigation*, not verified GPS-app failures.
3. GPS road connectors are **short schematic approximations**, not surveyed road alignments, route geometries or exact restriction boundaries. User should not follow the highlighted line as a path.
4. An officially published restriction can be conditional, exempt, seasonal, or permit-dependent. The road-specific source URL must be consulted, and posted restrictions and current information take precedence.
5. In the Class A profile comparison, the software **only detects possible dimension/weight conflicts** with a cited condition. It **never certifies any road as safe or legally accessible**. Unknown hazmat, weather, axle weights, road width, sign placement, and approach geometry remain unknown.
6. The original 50 planning areas are **illustrative only** and are not incident reports, public safety notices, or verified restricted streets.
7. Heat shading is only the density of curated points, **not crash frequency or empirical risk ranking**. Long-distance dash lines are illustrative hubs, not truck highways.
8. Default vehicle example inputs (73-ft overall length, 13.5-ft height, 80,000-lb gross and registered weight, 41-ft KPRA) are **illustrative**, not universal specification or legal limits. Enter measured dimensions and legal documents for meaningful preliminary comparison.

### Development layout

```text
ATLAS-USA-Class-A-CDL-Hazard-Atlas-v1.1/
├── index.html                       # Finished browser UI
├── embed-example.html               # Embedding starter
├── assets/
│   ├── css/atlas.css                # All styles and responsive design
│   ├── js/geography.js              # 51 simplified state boundaries
│   ├── js/hazards.js                # Existing 80 locations
│   ├── js/road-traps.js             # New 30 profiles
│   ├── js/atlas.js                  # Pan/zoom, base map, clustering, source details, SVG export
│   ├── js/trap-engine.js            # GPS-trap road overlays, panels, diagrams, profile comparison
│   └── data/
│       ├── us-state-geometry.json
│       ├── hazards.json
│       └── road-traps.json          # Authoritative review master for new road profiles
├── tools/
│   ├── build_road_traps.py          # Rebuild offline road data and SVG anchors
│   ├── build_hazards.py             # Original location data build
│   ├── build_geography.py           # Original geographic data build
│   └── upgrade_ui.py               # One-time v1.0→v1.1 UI migration script (do not rerun on v1.1)
├── tests/
│   ├── test_data.py                 # Original 80-location dataset invariants
│   ├── test_road_traps.py           # New 30-road dataset checks
│   ├── browser_smoke.py             # Legacy UI checks
│   └── browser_traps.py             # New interaction and layout smoke tests
└── docs/
    ├── SOURCE_REGISTER.md          # Original 30 government sources
    ├── GPS_TRAP_SOURCES.md          # New 30 named-road source URLs and semantics
    ├── CODEX_HANDOFF.md            # Integration contract and prompt
    ├── desktop-v1.1.png
    └── mobile-v1.1.png
```

The build scripts are **optional developer utilities**. `tools/build_geography.py` depends on a local Basemap county shapefile and `pyproj`; they are not needed to run the finished site.

## Website embed

### Full dashboard

```html
<iframe title="ATLAS U.S. Class A CDL road hazard atlas"
  src="/cdl-hazard-map/index.html?embed=1"
  style="width:100%;height:1050px;border:0;background:#07101d"
  loading="lazy"></iframe>
```

### Visual map only

```html
<iframe title="ATLAS U.S. Class A CDL GPS hazard map"
  src="/cdl-hazard-map/index.html?embed=map"
  style="width:100%;height:800px;border:0;background:#07101d"
  loading="lazy"></iframe>
```

Use relative URLs if your site is deployed in a subdirectory. The map-only variant includes the orange GPS layer on the map but intentionally hides the detailed road explorer. For road details, use the full atlas.

## Testing (developer only)

```bash
python tests/test_data.py
python tests/test_road_traps.py
python tests/browser_traps.py
node --check assets/js/atlas.js
node --check assets/js/trap-engine.js
```

The browser smoke test uses Playwright and Chromium, loading local assets inline in environments where a headless browser cannot open a local file or local HTTP port. Normal website users do not need Python, Node or Playwright.

## Next production milestones (not yet implemented)

- Official GIS **road centerline segments and restriction mileposts**, not schematic traces.
- 511 and authority API ingestion with timestamps, source health, caching and stale-data disclaimers.
- State DOT permit/size-weight rule ingestion, detailed trailer/axle and hazmat profiles, and source conflict reconciliation.
- Auditable user-reported road observations with moderation and separate validation statuses.
- Third-party commercial routing provider integration where properly licensed and validated.

**Historical government-source review:** 2026-11-17. This software contains no auto-refresh or real-time legal update service.
