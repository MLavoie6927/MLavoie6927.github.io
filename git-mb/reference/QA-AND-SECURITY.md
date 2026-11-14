# QA Results and Security Review — v4.0.0

**Author / owner:** Marc Lavoie  
**Date:** 2026-11-13  
**Test target:** Standalone website fragment embedded inside the supplied preview shell.

## Completed test coverage

| Test | Expected behavior | Observed |
| --- | --- | --- |
| Motherboard v2 inherited test | 25 selectable board parts, illustrated tour, responsive layout | Pass (1600/1280/760/390 px) |
| V3 original binary suite | 39 profiles, 8-stage browser pathway, x86 instruction, logic/ALU, 10 protocol samples | Pass (1600/1280/760/390 px) |
| V4 six workflows | Select/step traces; component-inspector cross-navigation | Pass (1600/1280/760/390 px) |
| EDU-8 assembler | Encodes 2-byte opcodes; rejects out-of-range operands | Pass (1600/1280/760/390 px) |
| EDU-8 arithmetic | 5+7 → 12, 255+1 → zero with carry | Pass (1600/1280/760/390 px) |
| EDU-8 memory | Store 42 to address 0x80, reload and emit 42 | Pass (1600/1280/760/390 px) |
| EDU-8 branching | Countdown emits 3,2,1 via JNZ | Pass (1600/1280/760/390 px) |
| Full memory visualization | 256 accessible byte cells, selected address | Pass (1600/1280/760/390 px) |
| SPI and UART | Mode change, byte change, sample index/bit order | Pass (1600/1280/760/390 px) |
| ISA examples | x86 B8/2A, RISC-V 93 02 A0 02, signed immediate update | Pass (1600/1280/760/390 px) |
| Assessment | Quiz answer, explanation, navigation, reset; glossary search | Pass (1600/1280/760/390 px) |
| JavaScript runtime | No uncaught page errors in tests | Pass (1600/1280/760/390 px) |
| Responsive width | No document-level horizontal overflow | Pass (1600/1280/760/390 px) |

Test scripts:

```text
python test-browser.py
python test-binary-v3.py
python test-advanced-v4.py
```

They use Playwright/Chromium in offline content-injection mode and report failures by assertion/exit code. Screenshots of the five new labs at 1280 and 390 px are in `previews/`.

## Security properties

1. **No executable user input.** The educational assembler parses grammar to numeric opcodes; its program is simulated through a fixed switch dispatcher, not evaluated as JavaScript/host native code.
2. **No file/network access.** The user can interact locally with input fields only; no request, upload, analytics, persistence, tracking cookie or credentials are used.
3. **Bounded simulations.** CPU RAM is 256 bytes, assembler input 2400 chars maximum in the UI, run click <=32 simulated instructions, data bytes constrained to 0..255.
4. **Escaped content.** Generated HTML fragments escape source-derived strings; HTML source is encoded using TextEncoder rather than interpreted as live markup.
5. **Strict namespace.** Production CSS stays inside `#hardware-atlas`; modules write only within the mounted root and exported namespace objects.
6. **Graceful initialization.** Each module has a per-root guard, and mount functions can be called after dynamic insertion.
7. **No third-party JS dependencies.** The preview and production assets are offline-ready; external reference links are optional documentation, not runtime dependencies.

## Limits of the completed QA

- No proprietary physical motherboard schematic or real hardware was tested.
- No automated cross-browser Safari/Firefox/Edge matrix was run; tests use Chromium.
- No WCAG compliance certification or full screen-reader audit was run; native controls, focus indication and aria attributes were incorporated.
- Test harness runs in an isolated preview; not yet inside the user's actual site. Actual router integration, CSS cascade conflicts, CSP permissions and host layout still require Codex validation.
- No GitHub commit, push or site deployment has been performed as part of this package.

These are explicit limits, not outstanding failures in the isolated preview test suite.
