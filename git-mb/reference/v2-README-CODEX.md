# Motherboard & Chip Interactive Atlas — v2.0

**Deliverable type:** Drop-in website tab only, for integration into an existing site by Codex.  
**Reference edition:** 2026  
**Runtime:** Vanilla HTML, CSS, and JavaScript; no packages, remote fonts, external images, CDNs, tracking, build process, or backend.

## What is included

| File | Purpose |
| --- | --- |
| `motherboard-atlas-tab.html` | **Production:** single isolated `<section id="hardware-atlas">` to insert inside your existing tab/page; not a whole site. |
| `motherboard-atlas.css` | **Production:** complete responsive styles, entirely scoped to `#hardware-atlas`. |
| `motherboard-atlas.js` | **Production:** technical data, SVG illustration generator, interactions, filtering, detail inspector, and guided tour. |
| `preview.html` | Preview only: a fake host-site shell containing the same tab. Do **not** overwrite the existing website with this file. |
| `CODEX-INTEGRATION-PROMPT.txt` | Copy/paste instructions for Codex to integrate only the tab. |
| `test-browser.py` | Playwright functional smoke-test. |
| `previews/*.png` | Seven screenshots of the tab and its illustrated states. |
| `CHANGELOG.md` | Architecture and visual changes from v1.0. |
| `SHA256SUMS.txt` | SHA-256 checksums of delivered files. |

## Core functionality

- **Motherboard illustration:** 25 selectable parts: CPU socket, VRM, EPS, memory slots, SATA, PCIe, M.2, power headers, CMOS battery, I/O, clock, firmware flash, networking and more.
- **Chip cutaway:** 14 selectable functional regions: CPU cores, GPU, L3 cache, memory controller, fabric, PHY, silicon, transistors, packaging and thermal structures.
- **Materials library:** 12 differentiated visual material swatches, with material composition, production, physical role, failure modes, and inspection advice.
- **Hardware history:** 10 milestones ranging from the transistor to 2020s chiplet and memory technology.
- **Rich interaction:** precise click/keyboard hotspots, hover identity labels, explanatory technical inspector, component close-ups, glowing selection outlines, component filters, search, and guided tour.
- **Study tools:** 100%–300% zoom, fit, pointer-drag panning at zoom, optional Ctrl+wheel zoom, and conceptual power/data route overlays on the board **and** chip.
- **Responsive:** works at 1600px, 1280px, 760px and 390px test viewports. Respects reduced-motion preference. SVG artwork is crisp at zoom.

### Integration instructions (static HTML site)

1. Copy the CSS and JavaScript into your existing project's appropriate static asset directory; e.g., `/assets/hardware/`.
2. Place the **contents** of `motherboard-atlas-tab.html` inside the existing tab's view/page container. Preserve the surrounding site header, nav, theme, routes, and page structure.
3. Reference the two files **once** on that page, using paths appropriate for your site's build setup:

```html
<link rel="stylesheet" href="/assets/hardware/motherboard-atlas.css" />
<!-- Insert the contents of motherboard-atlas-tab.html inside your existing tab container. -->
<script src="/assets/hardware/motherboard-atlas.js" defer></script>
```

4. For SPA/client-side tabs where HTML is injected **after** page load, call the exported initializer after insertion:

```js
window.HardwareAtlas.init(document.getElementById('hardware-atlas'));
```

The module also calls its own initializer when loaded into an already-present page. A repeat call to `init` on an initialized element is ignored. Only one `#hardware-atlas` instance is supported per page.

### Existing site safety

- No global CSS rules, header replacements, navigation rewrites, `body` styling, analytics, cross-site network calls, or dependency installs.
- All user-facing identifiers begin with `hwat-` or are contained inside `#hardware-atlas`. No site framework assumptions.
- The parent site can wrap this tab in its existing React, Vue, plain HTML, or other routing implementation. If a framework mounts/unmounts the section, initialize it after actual DOM placement.
- This is an original **conceptual educational illustration**, not a real manufacturer's CAD/trace/pinout map. Routing overlays intentionally represent *general relationships* rather than verified copper pathways.
- The history citations in the footer are starting points, not source verification for a particular motherboard model. Component construction varies by manufacturer, socket generation, and circuit design.

## Testing

Install Playwright in a development environment if needed, along with the Chromium browser. Run:

```bash
python test-browser.py
```

The smoke test loads the HTML/CSS/JS without a server, checks all four screen sizes, counts topics, selects board and chip items, verifies keyboard selection, traces, zoom/fit, material/history views, search/reset, guided tour, JavaScript errors, and page overflow.

## Visual design / art

Everything in the diagrams is authored as CSS or runtime SVG, **not an embedded bitmap**. The SVG helpers within `motherboard-atlas.js` draw distinct CPU contacts, socket frame, power chokes, capacitors, PCIe contacts, power connectors, M.2 components, PCH, RTC battery, Ethernet, USB pins, cache banks, GPU tiles, transistor cross-sections, interconnects and chip-package layers. To alter a part's position and active region, edit its `x`, `y`, `w`, and `h` within the data arrays and the corresponding illustration helper where relevant.

## Known boundaries

- Not a 3D physics simulation or electrical CAD tool; no real live board identification.
- Works offline; external source links in the footer only open when the visitor explicitly clicks them and has network access.
- The conceptual model is intentionally not precise enough to act as manufacturer repair documentation.
- Framework integration cannot be fully tested until Codex uses your actual website's build, routing, and CSS environment.
