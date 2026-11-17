# CODEX HANDOFF — ATLAS USA Class A CDL GPS Trap & Hazard Atlas v1.1

**Project owner:** Marc Lavoie · **Date:** 2026-11-17 · **Source:** HTML / CSS / vanilla JS / offline JSON

## Prompt to copy into Codex

> Integrate the supplied **ATLAS-USA-Class-A-CDL-Hazard-Atlas-v1.1** folder into my existing ATLAS Class A CDL website. This is a **visual geographical map** of potential GPS-route conflicts, known truck-restricted road segments, low bridges, narrow mountain roads, and pickup/delivery planning. **Do not build quizzes or tests.**
>
> Preserve the existing site's pages, nav hierarchy, and design. Add a separate **U.S. CDL Hazard Map** nav tab; use `/cdl-hazard-map/index.html` as the standalone static route, `?embed=1` to embed the full dashboard, or `?embed=map` for the visual map only. Keep all `assets/css/`, `assets/js/`, and `assets/data/` files and relative paths.
>
> The complete v1.1 implementation contains the original 51 mapped jurisdictions and 80 location entries, with a new **GPS TRAP ROADS** layer of 30 documented named road profiles across 15 states. The map has road markers, zoom-clustering, schematic annotated road traces, a road explorer panel, category filtering/search, clickable official source links, hand-drawn SVG risk diagrams and a truck profile comparison that never authorizes routing.
>
> Match all existing integration patterns, remove any redundant duplicate header caused by the embed, and ensure accessibility and responsive desktop/mobile layouts. Preserve the source policy: 50 editorial planning zones must never become asserted incidents or legal restrictions; schematic GPS road connectors must never become routable road centerlines; the new source-backed roads are published restrictions or operational guidance, not confirmed GPS-provider errors. Do not claim any road is safe simply because it passes one length/weight comparison. No live DOT or accident data is provided. Current signs, authority restrictions and applicable permits take priority over map guidance.
>
> Validate the static site, data JSON, interactive orange map markers, cluster zoom, category search, state filters, source links, selected-road details, low bridge and narrow pass diagrams, registration/weight/overall length/KPRA comparison, map SVG export, map-only embedding and zero horizontal overflow on mobile. Preserve every working v1.0 map feature. Deliver a cumulative, runnable ZIP of the integrated website and list all modified files.

## Current files / JS load order

`index.html` loads scripts with `defer` in this order:

1. `assets/js/geography.js` — `window.ATLAS_GEOGRAPHY` (precomputed state SVG paths)
2. `assets/js/hazards.js` — `window.ATLAS_HAZARDS` (original 80 locations)
3. `assets/js/road-traps.js` — `window.ATLAS_ROAD_TRAPS` (new 30 restrictions)
4. `assets/js/atlas.js` — base map runtime and `window.ATLAS_TEST_API` for map focus/camera state
5. `assets/js/trap-engine.js` — road overlay, explorer, schematic preview, comparison engine

CSS: `assets/css/atlas.css` (standalone scoped classes). The JSON mirrors `assets/js/` browser-ready data. If editing `assets/data/road-traps.json`, rebuild `assets/js/road-traps.js` consistently. Avoid editing the precomputed `x`, `y`, or `trace` by guessing physical road geometry.

## Verification / provenance

- Existing 30 official-source anchors: `docs/SOURCE_REGISTER.md`.
- New 30 named road source register: `docs/GPS_TRAP_SOURCES.md`.
- Main disclaimer: this atlas is not live, does not identify any particular GPS-provider failure, and **does not route vehicles**.
- Source-backed does not mean surveyed coordinate precision; schematic corridors are not the actual restricted road network.
- Some v1.1 road profiles expand on existing v1.0 marker entries. Treat these as cross-references, not distinct physical incident counts.

## Validation

Run these (Python tests require no internet; Playwright browser tests require local Chromium):

```bash
python tests/test_data.py
python tests/test_road_traps.py
python tests/browser_traps.py
node --check assets/js/atlas.js
node --check assets/js/trap-engine.js
```

Use tests solely as engineering validation, **not** as user-facing CDL education quizzes.

## Future architecture (out of scope)

To make this a production truck-safe router requires an authoritative GIS road-segment database, rules by jurisdiction, vehicle class and dimension, live closure and weight restrictions, accuracy/expiration checks, licensed routing topology, and safety review. Do not claim this static v1.1 has those capabilities.
