# Changelog

## 4.0.0 — 2026-11-13 — Full Stack Silicon Lab · Marc Lavoie

- **Preserved v3:** entire illustrated v2 hardware atlas; 25 board regions, 14 chip regions, 12 materials, 10 milestones, 39 binary dossiers, 8-stage route, 6 original binary tools, 10 protocol examples.
- **Improved binary routing:** five additional subpanes recognized by existing v3 tab controller without rewriting the host site's navigation.
- **NEW System Scenarios:** six independent end-to-end operations, each with stage-specific actor, byte or signal representation, detailed rationale, interactive route map, previous/next, and a linked physical motherboard/chip inspector.
- **NEW EDU-8:** original assembler, label resolution, error validation, two-byte instruction set, 256-byte RAM, accumulator/flags/PC, code/data memory inspection, disassembly, step tracing, output port, four example programs and bounded execution.
- **NEW Signal Scope:** idealized SPI mode-0 and UART 8N1 waveform generation with custom byte and selection, MSB/LSB interpretation, educational timing annotations.
- **NEW ISA Decoder:** editable x86 `MOV EAX, imm32` bytes and RV32I `ADDI x5, x0, imm12` bit fields, endian representation, register semantics and numeric bounds.
- **NEW Engineering Challenge:** fifteen multiple-choice tests with explanations and a searchable chip/systems glossary, with no persistent tracking.
- **NEW reference exports:** structured, human-readable 39-part catalog as JSON, CSV, Markdown; detailed system architecture guide and EDU-8 ISA specification.
- **NEW QA:** offline Chromium/Playwright v4 tests at desktop, tablet and mobile widths; preserved v3 and v2 regression suites.
- **Packaging:** Codex master prompt, preview, source files, screenshots, reference links and SHA-256 manifest.

### Important limitation

This is a tested local package. It is not committed into, deployed on or connected to the user's website repository without subsequent Codex integration.
