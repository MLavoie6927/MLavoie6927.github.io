# Motherboard & Chip Interactive Atlas: v2.0

## New visual design

- New dark navy engineering editorial art direction with teal highlights, satin-metal details and readable technical labeling.
- Original, more elaborate inline vector illustrations for the board and chip; not externally sourced pictures or noninteractive image overlays.
- Hardware-specific drawings (socket contact matrix, power stage/heatsink fins, RAM contact slots, expansion fingers, M.2 chips, chipset, debug readout, battery, headers and other components).
- Inside-chip cutaway with detailed CPU core tiles, GPU compute tiles, cache arrays, memory controller, power grid, transistor devices and layer stackups.
- Close-up SVG artwork attached to each technical inspector dossier; fixed SVG paint-server scoping and passive hotspot fill.
- Distinct material texture swatches and historical milestone timeline.
- Redesigned hero, tabs, directory, toolbar, detail panel and typography.

## New interactions

- Hover-to-identify labels.
- Zoom in/out, fit (100–300%) and pointer-drag panning on zoomed diagrams; optional Ctrl+wheel zoom.
- Conceptual glowing power and data route overlays for both diagrams.
- Focus/selected glow and motion-reduction accessibility handling.

## Preserved from v1.0

- 25 board topics, 14 chip topics, 12 material dossiers, 10 hardware-history milestones.
- Detailed materials/manufacturing/signaling/failure-analysis/inspection descriptions.
- Search, component filters, keyboard selection, responsive layout, guided tour, no dependencies and tab-only integration.

## QA

- Tested Chromium/Playwright at 1600, 1280, 760 and 390 CSS-pixel widths.
- Passed selection, traces, zoom/fit, keyboard navigation, all four views, search, reset, tour, console-error and overflow checks.
- Final integration into the original host website is delegated to Codex.
