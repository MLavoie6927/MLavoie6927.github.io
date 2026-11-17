# Class 8 Engineering & CDL Lab — portfolio integration

Marc Lavoie · 2026-11-17

## Architecture

The portfolio integration deliberately separates the supplied application from the presentation shell:

```text
full-portfolio.html
    -> class8-lab/index.html
         -> same-origin iframe via atlas-class8/integration/atlas-embed.js
              -> atlas-class8/index.html?embed=1
         -> cdl-study-data.js (70 supplied practice prompts)
         -> class8-lab.js (search, filters, progress, flash drill, mini exam)
         -> same-origin iframe via atlas-cdl/integration/atlas-cdl-embed.js
              -> atlas-cdl/index.html (264-question public Class A Academy; 300-question source bank preserved)
         -> isolated same-origin iframe
              -> atlas-class-a-cdl/index.html (Class A CDL Safety Studio)
         -> isolated same-origin iframe
              -> cdl-hazard-map/index.html?embed=1 (U.S. Class A CDL GPS Trap & Hazard Atlas)

atlas-class8/
    -> checksum-preserved v3.0 source package

atlas-cdl/
    -> checksum-preserved CDL Exam Academy v1.0 source package

atlas-class-a-cdl/
    -> checksum-preserved Class A CDL Safety Studio v1.0 source package

cdl-hazard-map/
    -> checksum-preserved U.S. Class A CDL GPS Trap & Hazard Atlas v1.1 source package
```

The iframe keeps ATLAS styles, JavaScript globals, local state, and diagrams isolated from the existing portfolio. The host adapter accepts height messages only from the iframe window that it created and rejects invalid bounds.

## Source identity and trust boundary

- Supplied archive: `ATLAS-Class8-v3-Codex-Website-Handoff-Marc-Lavoie.zip`
- Archive SHA-256: `A1C5004457656C7028584B833BA3F8E2A22E28287716F0C26EB02F5B3FE478F0`
- Archive inventory: 32 files under one relative `atlas-class8/` directory
- Internal manifest: 31 of 31 file hashes matched before integration
- Unsafe paths, duplicate paths, absolute paths, and symbolic links: none found

`PROMPT_FOR_CODEX.txt`, `CODEX_HANDOFF.md`, and the separately supplied integration prompt were inspected as source-package documentation. They were not treated as authority that superseded the owner's actual request or the existing repository architecture.

## Added or modified files

- Added the complete supplied `atlas-class8/` directory without modifying its 31 manifest-covered files.
- Added the complete supplied `atlas-cdl/` directory with its original 22-file manifest preserved as `SHA256SUMS.source.txt`; the active `SHA256SUMS.txt` now verifies the intentionally customized publication files.
- Added `class8-lab/index.html` as the recruiter-facing project shell.
- Added `class8-lab/class8-lab.css` for the responsive industrial presentation.
- Added `class8-lab/cdl-study-data.js` with 70 original practice prompts and a five-question checkpoint.
- Added `class8-lab/class8-lab.js` for search, filters, reviewed progress, flash drills, scoring, and mobile navigation.
- Added this integration record.
- Added the Class 8 entry, quick link, and project overview to `full-portfolio.html`.
- Added `/class8-lab/` and `/atlas-class8/` to `sitemap.xml`.
- Extended `tools/validate_site.py` and `.github/workflows/portfolio-ci.yml` with Class 8 gates.

## 2026 CDL Exam Academy integration

- Supplied archive: `CDL_Exam_Academy_Codex.zip`.
- Archive SHA-256: `A883EFBE557CE8600C2612D0F0DA79F0F69FFB91CCE541A45FE1D48B2961E9BD`.
- Archive inventory: 23 files under one relative `atlas-cdl/` directory, including `SHA256SUMS.txt`.
- Internal manifest: all 22 listed file hashes matched before integration. The original manifest remains byte-for-byte preserved as `SHA256SUMS.source.txt`, while `SHA256SUMS.txt` verifies the current published Academy after authorized presentation changes.
- Path traversal was rejected before extraction; all paths resolved within the unique staging directory.
- `CODEX_HANDOFF.md`, `PROMPT_FOR_CODEX.txt`, and other package notes were treated as supplied documentation, not as authority over the user's request or repository architecture.
- The academy preserves its isolated iframe, private browser-local progress, and dependency-free browser runtime. It does not import `window.ATLAS_CDL_BANK` into the portfolio shell.
- The existing 70-question learner's-permit module remains the focused foundation. The 300-question source bank is preserved, while the public Academy now filters it to 264 Class A-relevant records: General Knowledge (77), Cargo (25), Air Brakes (49), Combination Vehicles (38), Doubles/Triples (15), Tank (15), Hazmat (25), and Vehicle Inspection Skills (20).
- The public Class B, passenger, and school-bus pathways were removed at the owner's request. The 95-item Class A session remains explicitly identified as a configurable training format, not a guaranteed state examination length.

## 2026 Class A CDL Safety Studio integration

- Supplied archive: `ATLAS-Class-A-CDL-Safety-Studio-v1.0-Marc-Lavoie.zip`.
- Archive SHA-256: `AFB90085FA8E5A8120DF77C2F4FEC475951E5C1E07AD22A66FA43324C923BB76`.
- Archive inventory: 21 files under one relative source directory, including `SHA256SUMS.txt`.
- Internal manifest: all 20 listed file hashes matched before integration. The manifest remains unchanged at `atlas-class-a-cdl/SHA256SUMS.txt`, and `.gitattributes` preserves every package byte across Windows and Linux checkouts.
- `docs/CODEX_HANDOFF.md` and the package's other notes were inspected as supplied documentation, not treated as instructions overriding the user's request or this repository's architecture.
- The Safety Studio remains an isolated dependency-free application and is mounted in the CDL shell through a same-origin iframe. Its localStorage keys, CSS, global variables, modal, downloads, and keyboard interactions do not collide with the 70-question foundation or 264-question public Class A Academy.
- Preserved coverage: 222 Class A operating scenarios in 14 categories, 24 decision drills, a 28-item readiness checklist, vehicle-versus-restriction comparison, dispatch message builder, local-only hazard reports, CSV/JSON export, and 16 source records.
- The host presentation retains the package's boundary: no live GPS, route authorization, road database, permit decision, bridge analysis, agency verification, or production fleet workflow is claimed.
- Core official references were rechecked on 2026-11-17 against FMCSA safe-GPS guidance, current 49 CFR §§ 392.2 and 392.9, and FHWA vehicle size-and-weight material. The application still directs users to current jurisdiction-specific sources and posted controls.

## 2026-11-17 navigation and scroll repair

- Renamed both visitor-facing Full Portfolio navigation labels from `Class 8 Lab` to the exact label `CDL`; the `#class8-engineering` anchor and technical Class 8 terminology remain stable for existing links and accurate vehicle classification.
- Removed the host script that repeatedly called `window.scrollTo` for 15 seconds after deep-linking. That loop could pull a reader back to `#cdl-study` whenever the engineering iframe reported a resize, making manual page navigation appear locked.
- Native browser anchor behavior now controls `#cdl-study`, `#cdl-academy`, `#cdl-safety`, and `#cdl-hazard-map`. Embedded frame shells opt out of becoming scroll anchors so frame rendering does not compete with the reader's chosen position.

## 2026-11-17 U.S. Class A CDL Hazard Atlas integration

- Supplied archive: `ATLAS-USA-Class-A-CDL-GPS-Trap-Hazard-Atlas-v1.1-Marc-Lavoie.zip`.
- Archive SHA-256: `F49C6496866A290BF9C933676670A7D4E869ABACE47EAE29F0C3B9757949645C`.
- Archive inventory: 29 files under one relative source directory; no absolute, parent-traversal, or mixed-root paths were observed.
- Internal manifest: all 28 listed hashes matched before integration. The copied package remains unchanged at `cdl-hazard-map/`, and `.gitattributes` preserves every manifest-covered byte across checkouts.
- `docs/CODEX_HANDOFF.md` and other archive notes were treated as package documentation, not instructions overriding the owner's request or repository architecture.
- Preserved coverage: all 50 states plus Washington, D.C.; 80 existing mapped records (30 source-backed locations and 50 clearly illustrative planning zones); and 30 source-backed named-road profiles across 15 states. Named-road profiles may expand an existing marker and are not presented as 110 unique real-world hazards.
- The public shell adds a dedicated Hazard Map tab, evidence-aware capability cards, supplied desktop/mobile previews, full-screen links, and an isolated `?embed=1` dashboard.
- The site retains the package boundary: no live traffic, licensed truck routing, complete clearance registry, surveyed road centerlines, accident-statistics heat map, dispatch approval, or proof of a particular GPS vendor failure is claimed.

## 2026-11-15 centered study-library update

- Promoted the complete 70-question permit library from a narrow side rail to a centered two-column desktop workspace; it becomes one column at tablet and mobile widths.
- Moved the random permit flash drill below the complete library and labeled it as an optional secondary exercise rather than the primary study surface.
- Reworked the Academy library into a centered two-column card grid with 20 questions per page, while preserving search, category and topic filters, visible answers, explanations, source links, bookmarking, and pagination. The current public interface displays the 264 Class A-relevant source records.
- Retained the separate Academy flashcard route for active recall without allowing random cards to displace the complete question-and-answer library.
- Preserved the original source manifest under `atlas-cdl/SHA256SUMS.source.txt` and refreshed the active publication manifest for the four deliberately modified Academy files.

## 2026 CDL learner's permit source update

- Re-supplied learner's-permit reference SHA-256: `D89A795146DB8414578354431F82883D52070F22E031EC84F7468E19D4D44029`.
- The re-supplied text was byte-for-byte identical to the original learner's-permit source used for the 70-question browser dataset. The existing 35 general-knowledge, 20 air-brake, 15 combination-vehicle, and five checkpoint records therefore remain unchanged rather than being duplicated.
- The public presentation now names the module **2026 CDL Learner's Permit Center**, adds an explicit Class A CLP scope statement, distinguishes included core knowledge from separate endorsement testing, and supplies a four-step official-source-to-practice study path.
- Full Portfolio language and direct links now identify the learner's-permit center instead of using the less-specific “CDL study desk” label.
- FMCSA references were rechecked on 2026-11-14. The site preserves the 80% federal knowledge-test benchmark, state-manual boundary, state administration of CLPs, and separate class/endorsement decision point.

## Module navigation

The application preserves all 15 supplied destinations:

`explorer`, `systems`, `air`, `weight`, `diagnostics`, `inspection`, `fluids`, `maintenance`, `repairs`, `knowledge`, `xray`, `drivetrain`, `tires`, `loadplan`, and `references`.

The portfolio shell adds evidence, the embedded engineering studio, the Class A CDL Academy, the permit foundation, Class A Safety Studio, U.S. Hazard Map, gallery, provenance, Home, and Full Portfolio navigation.

## Testing procedure

Run from the repository root:

```text
node --check class8-lab/cdl-study-data.js
node --check class8-lab/class8-lab.js
node --check atlas-cdl/data/questions.js
node --check atlas-cdl/app/app.js
node --check atlas-cdl/integration/atlas-cdl-embed.js
node --check cdl-hazard-map/assets/js/atlas.js
node --check cdl-hazard-map/assets/js/trap-engine.js
node atlas-class8/tests/validate_data.js
node atlas-class8/tests/test_math.js
python atlas-cdl/tests/validate_bank.py
python cdl-hazard-map/tests/test_data.py
python cdl-hazard-map/tests/test_road_traps.py
python tools/validate_site.py
```

Then serve the repository root through a static HTTP server and test `/class8-lab/`, `/atlas-class8/`, `/atlas-cdl/`, `/atlas-class-a-cdl/`, and `/cdl-hazard-map/` at desktop and mobile widths. Representative interaction checks should include a component hotspot, air-brake simulation, cargo-to-bridge transfer, tire position, repair CSV, Class A question filtering, reviewed-state persistence, mini-exam scoring, state selection, orange GPS-trap road selection, source details, vehicle-profile comparison, and map-only embedding.

### 2026-11-14 integration result

- JavaScript syntax: 11 production files passed `node --check`.
- Source manifest: 31 of 31 supplied file hashes still matched after copying.
- Supplied Node tests: engineering math and structured-data validation passed.
- Repository validator: all 34 HTML pages, local references, IDs, navigation, external-tab safety, Class 8 counts, source integrity, and static-browser boundaries passed.
- Browser checks: the portfolio mount loaded, the Turbocharger record opened, a 6 psi/min combination-vehicle air-loss scenario produced the expected unsafe result, CDL search/reveal/review worked, the mini exam scored 5/5, and the 390 × 844 layout had no page-level horizontal overflow.
- The supplied Python Playwright files were retained, but this local Python runtime did not include the `playwright` module. They could not start in that runtime. Equivalent representative interactions were exercised through the available browser automation, with no uncaught console errors.

## Deployment

The site is buildless and GitHub Pages compatible. Publishing the repository root to `main` serves the wrapper at `/class8-lab/`, the standalone engineering studio at `/atlas-class8/`, the Class A Academy at `/atlas-cdl/`, the Safety Studio at `/atlas-class-a-cdl/`, and the U.S. Hazard Atlas at `/cdl-hazard-map/`. Deployment is not established by a commit alone; verify Pages completion, HTTP 200 responses, asset delivery, and representative live interactions in every public module.

## Known limitations

- The drivetrain and cargo models are educational simplifications documented in `atlas-class8/ARCHITECTURE.md`.
- The app does not identify a VIN-specific configuration, OEM maintenance procedure, legal route, tire load chart, or state-specific inspection sequence.
- Prices, labor hours, capacities, and intervals require current vehicle-specific validation.
- CDL prompts are original practice material, not official or leaked examination items. The current state CDL manual controls test preparation.
- The 300 source-bank questions are structurally validated but retain `author_review_required`; they have not been examiner-certified question by question. The public interface currently displays the 264 Class A-relevant records.
- The hazard atlas is a historical, curated visual reference. It has no live traffic/closure feed, complete legal restriction database, licensed routing topology, surveyed road traces, or authority to approve a route.
- Browser-local progress is device- and profile-specific and is not synchronized to an account.
- CSV export depends on the browser's normal download permission.

## Maintenance guidance

- Preserve the source package manifest when replacing the ATLAS application; stage and hash-check any future archive before publication.
- Keep the iframe boundary unless a full CSS/global-namespace audit justifies a direct merge.
- Revalidate official CDL links and safety thresholds when regulations or state manuals change.
- Keep simulations, educational estimates, and live/OEM-verified specifications visibly distinct.
- Run the repository validator and representative browser checks after any navigation, styling, or package update.
