# Codex integration handoff — ATLAS Class 8 v3.0

Owner: **Marc Lavoie** · Date: **2026-11-14** · Target: existing personal cybersecurity/engineering portfolio website (static/GitHub Pages compatible).

## Objective

Integrate the complete `ATLAS-Class8-Web-Integration-v3` application into the **existing** website without replacing, restarting or disrupting current pages, navigation, responsive styles, scripts or existing features. Add a visible top-level navigation entry **Semi-Truck Engineering Lab**. Preserve all existing v3 and earlier labs.

## Files to copy

Copy the complete contents of this release into a new subdirectory of the current website repository:

```text
<existing-website-repo>/
    ... existing site files (DO NOT REMOVE) ...
    atlas-class8/
        index.html
        assets/styles.css
        assets/v3.css
        js/catalog.js
        js/training-data.js
        js/blueprints.js
        js/component-art.js
        js/simulations.js
        js/app.js
        js/v3-labs.js
        js/embed-frame.js
        integration/atlas-embed.js
        ... documentation and tests may remain ...
```

**Required:** keep all relative paths within the `atlas-class8` folder unchanged. Do not strip `js/catalog.js` or legacy simulator files; they carry the original 117-part training data and core functionality.

## Preferred integration method: embed without CSS conflicts

1. Add or update a website page/tab called `Semi-Truck Engineering Lab` using the existing website's routing/navigation conventions.
2. In that page's content, insert the HTML from `integration/website-snippet.html`.
3. Correct the `./atlas-class8/` relative paths to work from the actual location of that page; on GitHub Pages project sites, favor **repository-relative** URLs and test the site base path. Do not hardcode a domain-root `/atlas-class8/` if the site is hosted in a subpath.
4. The embed creates its own responsive `<iframe>`, isolates ATLAS CSS from the site's global CSS, and uses the frame's message source to accept its resize events.
5. Provide an **Open full-screen laboratory** link to `atlas-class8/index.html` for accessibility and deep study.

Alternative: link the navigation item directly to `atlas-class8/index.html` (simplest and most robust); keep the user's original website header navigation unchanged except for this new link.

## Required integration checks

- Existing website home, about, resume, SOC projects, detection rules, certificates and other current navigation still work.
- Nav button appears at desktop and mobile widths and opens the correct ATLAS page.
- The interactive semi-truck and trailer drawing displays; click zones change the associated component record.
- All 15 ATLAS destinations work, especially `#xray`, `#drivetrain`, `#tires` and `#loadplan`.
- All 117 legacy component records are available; no network connection is required for in-app diagrams and calculations.
- Tire map shows 18 selectable wheel positions and worn-tread flag.
- Cargo position slider changes kingpin/tandem reactions and bridge-lab handoff opens weight lab.
- Pre-trip, repair calculator, air brake and old features are not broken.
- iframe is not clipped on desktop/mobile; technical SVG diagrams pan horizontally on narrow screens.
- No JavaScript console errors, missing CSS/scripts, or cross-origin message exceptions.
- No project-specific `/` absolute links that break under GitHub Pages base paths.

## Design and security requirements

- Do not import a JS framework or replace the current website's build system unnecessarily.
- Do not replace the illustration code with screenshots; the SVG labels/targets must remain functional.
- Preserve the educational/illustrative safety notices; do not advertise DOT compliance certification or manufacturer-verified parts prices.
- No remote assets, analytics, tracking scripts, third-party runtime packages or API credentials are necessary.
- Preserve `Marc Lavoie` author attribution and revision date in comments/documentation.
- If the existing site already has a content-security policy, allow only the necessary same-origin iframe/script sources and check sandbox restrictions before deployment.

## Commands for Codex to run locally

```bash
node atlas-class8/tests/test_math.js
node atlas-class8/tests/validate_data.js
python atlas-class8/tests/test_v3.py  # requires installed Playwright + Chromium
```

The test environment used to build this project blocks direct browser navigation to `file://` and localhost, so `test_v3.py` explicitly injects local assets in-memory into a headless Chromium test page. **In the actual website repository**, additionally test the website through the repository's normal dev server and production GitHub Pages-style base path.

## Deliverable to owner

A commit/PR in the website repository integrating the ATLAS tab, plus screenshots of the existing site, embedded lab, 390px phone view and any failing checks. Do not claim it was deployed until the actual repository changes are committed and verified.
