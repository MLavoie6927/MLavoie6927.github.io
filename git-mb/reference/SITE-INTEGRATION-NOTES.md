# Motherboard Atlas site integration notes

## Published route

- Route: `https://mlavoie6927.github.io/git-mb/`
- Portfolio label: **GIT & MB**
- Integrated release: **Motherboard & Silicon Atlas V4 Full-Stack Silicon Lab**
- Site owner: **Marc Lavoie**
- Integration date: **2026-11-13**

## Verified source packages

| Package | SHA-256 | Preflight result |
|---|---|---|
| Motherboard Chip Atlas V2 Illustrated Codex Handoff | `38893704296065a3f65f1c60b69b4b96c0f72d5eb2e018c16d10c909b04635d1` | 16 archive entries; safe relative paths; no symlinks, duplicates, or absolute paths; all 15 listed internal checksums matched |
| Motherboard Chip Atlas V4 Full-Stack Silicon Lab Marc Lavoie Codex Handoff | `a1f8a4b1b9f988eb1779b2feb6dd76a3e113a466cce872483972fb7207310d63` | 42 archive entries; safe relative paths; no symlinks, duplicates, or absolute paths; all 41 listed internal checksums matched |

The archive contents were treated as source data. Embedded integration prompts were not executed as instructions.

## Integration architecture

The V4 release is a superset of the V2 illustrated atlas. The site therefore upgrades the existing `git-mb` route in place instead of creating a disconnected second experience.

The runtime loads in this order:

1. `motherboard-atlas.css` and `motherboard-atlas.js` provide the illustrated motherboard, chip, materials, history, inspector, trace overlays, zoom, search, and guided tour.
2. `motherboard-binary.css` and `motherboard-binary.js` add the binary catalog, source-byte laboratory, system data path, logic and ALU exercises, machine-code examples, and bus/protocol explorer.
3. `motherboard-advanced.css` and `motherboard-advanced.js` add six system workflows, the EDU-8 assembler/simulator, SPI/UART timing views, x86/RISC-V field decoding, the assessment, and the glossary.
4. `page.css` and `page.js` provide the portfolio shell, responsive navigation, recruiter-facing evidence layer, and shortcuts into the laboratory.

## Integration correction

The supplied V4 instruction-set decoder calculated new x86 and RISC-V bytes when the immediate value changed, but its explanatory note remained hard-coded to the value `42`. The published integration corrects that note so it reports the selected value, instruction word, and little-endian byte sequence. The original package checksum record remains published for provenance, and the deployed asset is locked separately by the site validator.

## Published coverage

- 25 illustrated motherboard components
- 14 illustrated processor regions
- 12 engineering materials
- 10 history milestones
- 39 motherboard/chip binary profiles
- 11 interactive laboratory views
- 6 end-to-end system workflows
- 256 visible EDU-8 memory addresses
- 15 assessment questions
- 35 glossary terms
- 21 supplied preview captures
- Architecture, instruction-set, profile, security, source-note, manifest, changelog, and checksum records

## Evidence boundary

- EDU-8 is an invented educational ISA, not a commercial processor architecture.
- The SPI and UART plots are ideal teaching traces, not physical oscilloscope measurements.
- Motherboard placement and system routing are conceptual and are not repair CAD or a substitute for a manufacturer schematic.
- x86 and RISC-V examples are identified as real instruction encodings, distinct from HTML/UTF-8 data and interface commands.
- The site does not execute user-supplied code and does not use a backend, account, tracking, network API, `eval`, or the `Function` constructor.

## Validation record

- All production JavaScript passed `node --check`.
- The repository validator checks the complete page structure, local links, load order, safety boundary, source-package records, reference assets, and exact hashes for all runtime modules and core references.
- Browser interaction checks covered the illustrated board, editable HTML-to-UTF-8 conversion, the 39-profile catalog, a multi-step UEFI boot trace, EDU-8 execution yielding decimal `12`, SPI-to-UART timing changes, negative RISC-V immediate encoding, assessment feedback, glossary filtering, desktop navigation, and the 390-pixel mobile hamburger menu.
- The supplied Python browser scripts are retained under `tools/motherboard-atlas/` for environments with Playwright installed.

