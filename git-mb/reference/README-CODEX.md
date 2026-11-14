# Motherboard & Chips — Full Stack Silicon Lab v4.0.0

**Prepared for / research architecture:** Marc Lavoie  
**Release date:** November 13, 2026  
**Delivery:** Offline-ready, dependency-free, drop-in website tab for an **existing** cybersecurity / systems engineering portfolio.

> This is a complete Codex handoff, not a replacement website. You must integrate the tab into the existing site's navigation without deleting or overwriting existing site content.

## What's included

- **Four preserved illustrated views:** Motherboard (25 regions), Inside a chip (14 regions), Materials Lab (12 topics), History (10 milestones).
- **Binary atlas:** 39 physical-to-digital component dossiers, search, filters, two-way navigation, eight-stage browser-to-display route, HTML→UTF-8 bytes, 8-bit arithmetic/logic, x86 examples, ten bus/protocol examples.
- **Five entirely new advanced labs:** Six interactive system workflows, working EDU-8 assembler + simulator, SPI/UART ideal signal traces, x86/RISC-V dynamic encoding, and a 15-question knowledge assessment with a searchable 35-term glossary.
- **Reference material:** JSON, CSV, and Markdown cross-reference dossiers for all 39 components; full architecture guide, EDU-8 ISA specification, source/accuracy notes, and Codex integration instructions.
- **QA:** Browser automation at 1600, 1280, 760, and 390 px; original diagram regression tests; new v4 interactions; review screenshots; SHA-256 inventory.

## Production files

| Asset | Purpose |
| --- | --- |
| `motherboard-atlas-tab.html` | A single section fragment: `<section id="hardware-atlas">…</section>` for mounting into the current website |
| `motherboard-atlas.css` | Preserved base illustrated motherboard/CPU atlas CSS |
| `motherboard-atlas.js` | Preserved illustrated atlas, directory, selection, zoom, tour and route overlays |
| `motherboard-binary.css` | Preserved v3 binary lab styles |
| `motherboard-binary.js` | V3 binary atlas with v4 panel routing enabled |
| `motherboard-advanced.css` | NEW scoped advanced laboratory styles |
| `motherboard-advanced.js` | NEW executable EDU-8, six transactions, timing charts, ISA comparison, assessment |

**Load styles in order:** atlas → binary → advanced. **Load scripts in order:** atlas → binary → advanced.

For an existing website with asset paths under `/assets/hardware/`:

```html
<link rel="stylesheet" href="/assets/hardware/motherboard-atlas.css">
<link rel="stylesheet" href="/assets/hardware/motherboard-binary.css">
<link rel="stylesheet" href="/assets/hardware/motherboard-advanced.css">

<!-- Mount motherboard-atlas-tab.html fragment INSIDE your existing site's tab/page container -->

<script defer src="/assets/hardware/motherboard-atlas.js"></script>
<script defer src="/assets/hardware/motherboard-binary.js"></script>
<script defer src="/assets/hardware/motherboard-advanced.js"></script>
```

For dynamic SPA routing, after inserting the fragment (using the site's existing content mounting convention), call:

```js
const root = document.querySelector('#hardware-atlas');
window.HardwareAtlas.init(root);
window.HardwareBinaryAtlas.init(root);
window.HardwareAdvancedAtlas.init(root);
```

All three modules have initialization guards for an individual root. **If your site's route destroys a root and mounts a fresh one, initialize the new root.** Do not call initialization before the root exists.

`preview.html` is a static stand-alone preview **only**. Never copy it over the host site's `index.html`, layout shell or navigation.

## Recommended user journey

1. Enter the **Motherboard & Chips** site tab: the ATX board's editable vector illustration can be searched and zoomed.
2. Inspect the **CPU socket**, **UEFI SPI flash**, **DIMM**, **NVMe M.2 slot**, **VRM**, and **PCIe** link.
3. Select **Decode binary & signals** in a component inspector to jump into its corresponding dossier.
4. In **HTML → binary**, enter `<h1>Hi</h1>` and inspect `3C 68 31 3E 48 69 3C 2F 68 31 3E`.
5. In **System scenarios**, play the NVMe, boot, keypress and browser rendering stages, then click **Inspect [component]** to return to the hardware diagram.
6. In **Run a tiny CPU**, select the countdown demo; step the program and observe the `JNZ` branch until A is zero. Try `LDI 255; ADD 1; OUT; HLT` on separate lines to observe wraparound and the carry flag.
7. Compare **SPI** and **UART** signal timing. In the ISA lab, compare `B8 2A 00 00 00` (x86-64) and `93 02 A0 02` (RV32I).
8. Finish the knowledge challenge, then search the engineering glossary.

## Lab counts and exact meaning

This release has **11 embedded binary labs**, not 11 top-level navigation pages. These are the six inherited v3 binary subpanes plus five new v4 subpanes, underneath the single top-level **Binary & Chip Signals** tab. The original four views remain separate top-level tabs inside the motherboard website tab, so all sections remain accessible.

The scenarios, timing scope and small CPU are deliberately **educational**. The v4 EDU-8 ISA was newly designed for teaching; it is not the architecture of a commercial chip. The x86 and RISC-V encoding examples are actual ISA encodings. The JEDEC/SPI/NVMe examples represent selected documented command fields, not complete vendor-specific frames or physical oscilloscope measurements.

## Local testing

Requires Python, Playwright, and a local Chromium browser. The provided test suite uses `/usr/bin/chromium` in the test environment; adapt the executable path if needed.

```bash
python test-browser.py
python test-binary-v3.py
python test-advanced-v4.py
```

The tests embed HTML, CSS and JS directly for offline execution; no CDNs or external analytics are required. Playwright tests do **not** prove integration with your host site's CSS, CSP, routing or deployment process; Codex should verify those after integrating into the actual repository.

## Safety and maintenance

- All CSS selectors are prefixed with `#hardware-atlas`.
- User-provided assembly is parsed as **data** and executed only by the inert educational simulator. It is never evaluated with `eval`, `new Function`, a shell, or a real CPU emulator.
- HTML example text is converted to UTF-8 bytes with `TextEncoder`; it is **not** inserted as executable HTML.
- Output that could contain user-supplied markup is escaped before injection into generated lab UI.
- No accounts, storage, uploads, tracking, third-party calls, credentials, downloads, or backends.
- All inputs are bounded: source max 2400 characters, 256 bytes of simulator RAM, at most 32 steps per run click, defined byte ranges and bounded quiz bank.
- Device-specific physical diagrams and security protections are explanatory, **not** certified engineering schematics or a reference for work on powered equipment.

For the full wiring and content rationale see `ARCHITECTURE-AND-DATA-FLOW.md`; for the accumulator ISA see `EDU8-INSTRUCTION-SET.md`.
