# ATLAS Class A CDL Exam Academy v1.1 — 264 displayed Class A questions

**Author:** Marc Lavoie · **Date:** 2026-11-14

A complete offline-capable HTML/CSS/JavaScript practice exam module for integration with the **ATLAS Class 8 Engineering Studio** and a static portfolio website. The preserved source bank contains 300 original questions; the public v1.1 interface filters it to the 264 questions supporting Marc Lavoie's Class A path.

## Features

- 264 displayed Class A practice questions with answers, explanations and source references.
- Preserved 300-question source bank for provenance; passenger and school-bus sections are not exposed in the public Class A workspace.
- General Knowledge (77), Cargo (25), Air Brakes (49), Combination Vehicles (38), Doubles/Triples (15), Tank (15), Hazmat (25), Passenger (18), School Bus (18), and Vehicle Inspection Skills (20).
- Full Class A 95-item practice exam (50 general/cargo, 25 air, 20 combination); category-specific 10/20/25/50-item exams (limited to available items).
- Per-category >=80% pass calculations, missed-answer review, practice results JSON export.
- Question search, category/topic filter, visual flashcards, bookmarks, source links.
- Eighteen-point illustrated walk-around study checklist and concise study guide.
- Professional responsive UI; no framework, CDN, authentication, tracking or API key required.

## Run locally

Unzip the file and open `index.html` in a modern desktop browser, keeping relative directories intact. All data are loaded from `data/questions.js` without `fetch()` so basic functions also work from local files. For accurate website deployment testing, run the site's normal local server and check its production base path.

## Integrate into website

Read **`CODEX_HANDOFF.md`**. Place the release at `atlas-cdl/`, add a navigation link, and if embedding, use `integration/website-snippet.html` and `integration/atlas-cdl-embed.js`. The iframe isolates styles and script globals from the existing portfolio and ATLAS Class 8 lab.

## Important exam disclaimer

These are **original practice questions**, not exact live state-issued examination questions or a leaked/official DMV question bank. State tests are not standardized as a public all-question nationwide dataset. The 95-item Class A grouping is a teaching convention. Real credentials and exams are administered by state agencies. The modernized skills exam is separate from the written tests. Study the current licensing-state manual and complete required ELDT.

See `docs/SOURCES.md` and `docs/CONTENT_REVIEW.md` for verified sources and editorial caveats.
