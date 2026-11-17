# ATLAS CLASS A CDL — Commercial Truck Safety Studio

**Version 1.0.0 | November 17, 2026 | Marc Lavoie**

This is the complete source-code package for your website and Codex. The module is specifically for **Class A CDL combination vehicles**.

**Start here:** open `index.html` in a modern browser. All scripts and styles are local. For integrating into your existing site, give Codex this whole ZIP and `docs/CODEX_HANDOFF.md`.

**Included:** 222 driver problem scenarios in 14 categories, 24 interactive decision drills, vehicle/restriction comparison, predeparture checklist, dispatcher notification builder, local hazard report logging/export, official source links, and responsive desktop/mobile CSS.

**Developer instructions:** `docs/README.md`  
**Codex master integration prompt:** `docs/CODEX_HANDOFF.md`  
**Safety/regulatory notes:** `docs/RESEARCH_NOTES.md`  
**Unit tests:** `node tests/test-logic.cjs`  
**Optional browser smoke tests:** `python tests/browser_smoke.py` (Playwright + Chromium)

**Safety:** Educational only. This is **not a working truck GPS, a current road database, real-time map or legal permit checker**. A low bridge, no-truck sign, weight restriction, or unknown clearance always requires verification outside the software. Report data is only stored in the browser.
