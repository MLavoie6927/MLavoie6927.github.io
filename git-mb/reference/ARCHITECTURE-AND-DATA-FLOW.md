# The Binary Beneath Every Chip — Technical Architecture

**Motherboard & Chips · Full Stack Silicon Lab v4.0.0**  
**Research architecture and website integration:** Marc Lavoie  
**Release date:** November 13, 2026

## 1. Scope: what is and is not "binary code"?

**A bit is a logical state, not a universal electrical voltage and not automatically an instruction.** Binary representations occur at many layers, but their interpretation changes with each component. The most important distinctions taught by this release are:

| Representation | Who gives it meaning? | Example | What it is not |
| --- | --- | --- | --- |
| UTF-8 data bytes | Text decoder / browser parser | `3C 68 31` representing `<h1` | Native machine code |
| CPU instructions | Instruction set / CPU decoder | x86 `B8 2A 00 00 00` | An HTML tag or NVMe command |
| GPU instructions | GPU architecture / shader program processor | Vendor-specific GPU ISA | A fixed PC-compatible opcode |
| Memory state | Program and memory controller | DRAM cell state containing `00101100` | A guaranteed text character |
| Device command | Device controller protocol | NVMe READ `0x02` | A PC CPU `READ` instruction |
| Framed traffic | A link's endpoints | EtherType `08 00` | A bare waveform or whole packet |
| Logic level | Circuit's electrical thresholds | 1/0 at GPIO | An 8-bit software instruction |
| Clock / PWM waveform | Timing / power-control circuitry | Repeating switching edges | Executable code |
| Passive routing | Copper trace / pad / connector | Differential copper pair | Hardware that decodes the bits |
| Heat transfer | Thermal device | Heatspreader / heatsink | Binary information processing |

The physical device voltage, timing and layout are analog and vary by platform, process, load, noise and temperature. Digital systems obtain useful abstraction by designing noise margins, timing budgets, clock synchronization and recovery strategies.

## 2. Why a motherboard has no universal ISA

A motherboard connects processing silicon, storage, memory, power distribution and peripheral channels. **It does not execute one shared “motherboard instruction set.”** Different silicon blocks interpret different protocols. A motherboard includes passive devices (capacitors, copper, sockets and connectors) and active devices (VRMs, clock generators, firmware flash, chipset controllers, PHYs, NICs and audio codecs). Even the term “chipset” changes across generations as controllers migrate into the CPU or SoC.

A single motherboard PCB trace may carry a PCIe lane, DDR signal, clock, reset, SMBus/I²C transaction, USB lane or GPIO signal. Those are **not all the same binary encoding**. Some use differential signaling, some single-ended signals, some pulse-width behavior, and some are not digital data at all. Because link layers differ, interpreting a screenshot of ``10101010`` without interface, bit order, clock and framing context is fundamentally ambiguous.

## 3. The full HTML-to-pixel path

**Physical starting point.** Markup may arrive from an SSD, a cached resource, a network response or dynamically generated application memory. The source characters are encoded as a sequence of bytes (UTF-8 is common on the web). With `<h1>Hi</h1>`, the eleven ASCII-compatible UTF-8 bytes are:

```text
3C 68 31 3E 48 69 3C 2F 68 31 3E
```

The source bytes are interpreted by a browser's HTML parser, and parsed markup contributes to a **DOM**. CSS is interpreted into styling and layout rules; JavaScript is handled by a runtime that may use interpretation and/or JIT compilation depending on engine and configuration. The CPU executes the browser and OS's **actual machine code**, while the markup and DOM are data for that software. An HTML string is not inherently executable CPU machine code.

**Memory.** Browser software and its data structures normally reside in system memory. Cache hierarchy and memory controllers move chunks of instructions and data into execution-visible registers. The same `0x41` memory byte can mean an ASCII capital A, number 65, a color channel, a packet field or one byte of an instruction depending on context.

**Graphics.** Browser renderers generate painting/compositing work, sometimes CPU-side, sometimes through a GPU. The GPU consumes its own data/commands; it executes instructions in a GPU-specific architecture when shader programs run. Display hardware scans out frame buffers and transmits display-link symbols to a monitor. The exact path, API, format and buffering depends on the browser/OS/GPU.

**Security correlation.** The web parser is a software trust boundary: source bytes are treated according to document and origin security models; they are not trusted native instructions. The browser process, kernel, device driver and DMA-capable devices interact through distinct trust and isolation layers.

## 4. CPU core, transistor and storage pipeline

At the bottom of the CPU are transistors, whose voltage and current characteristics form reliable logic gates given valid operating conditions. NAND, NOR, inverter, XOR and combinations implement arithmetic networks, decoders and state elements. Latches and flip-flops hold state; pipelines organize fetch, decode, execute, memory access, writeback and retirement. Real superscalar/out-of-order CPUs contain reorder buffers, queues, register renaming, speculative work and precise exception machinery. The v3 instruction examples show **valid x86 bytes**, but they are not a cycle-accurate simulation. The EDU-8 tool intentionally uses a much smaller architecture so every state transition can be verified.

### On-chip vs off-chip memory

- **Registers** are named architectural state visible to the ISA, backed by processor circuits.
- **Caches** typically use SRAM, indexed and tagged according to the processor's memory hierarchy. The L1/L2/L3 arrangement and coherence protocol are microarchitecture-specific.
- **Main RAM** uses DRAM, which stores charge in cells and needs periodic refresh; the controller orchestrates addressing, timing, training, integrity and transfer operations.
- **Firmware NOR flash** stores nonvolatile bytes. Its controller receives flash-specific commands and returns bytes; the NOR chip is not itself an x86 core.
- **NAND SSDs** employ controller firmware, address translation, wear leveling and ECC. A PCIe/NVMe host sends storage commands that the SSD controller interprets.

## 5. Five examples of different encodings

### 5.1 CPU machine-code opcode

For x86-64 `MOV EAX, 42`, the **five instruction bytes** are `B8 2A 00 00 00`. `B8` is the opcode selecting the move-to-EAX form and `2A 00 00 00` is the little-endian 32-bit immediate `0x0000002A` (42). Writing the 32-bit EAX register zero-extends into RAX in 64-bit mode. This is executable **x86 instruction code**, not HTML.

### 5.2 RISC-V instruction encoding

RV32I `ADDI x5, x0, 42` uses 32-bit I-type encoding: immediate bits [31:20]=`000000101010`, rs1 bits [19:15]=`00000`, funct3 [14:12]=`000`, rd [11:7]=`00101` and opcode [6:0]=`0010011`. The instruction word is `0x02A00293` and the little-endian byte sequence is `93 02 A0 02`. The advanced lab recalculates each field for signed immediates from −2048 through 2047. These are valid RV32I encodings, not bytes produced by the browser's HTML parser.

### 5.3 SPI NOR device command

Many SPI NOR devices use `0x03` as a standard read opcode and `0x9F` to request JEDEC identification. These are device command values on a specific peripheral interface, **not CPU ISA opcodes**. Their use and following address/data phases depend on the chip, addressing mode and device manual. The oscilloscope tool depicts **one transmitted byte** with mode-0 clocking; it does not pretend to show a complete manufacturer identification response.

### 5.4 NVMe controller opcode

The NVM command set includes `0x02` READ and `0x01` WRITE. Host software prepares command entries in an NVMe submission queue and notifies the controller through controller registers; an NVMe controller fetches/executes those commands and posts completion. The physical M.2 connector neither creates nor executes the command. The controller is responsible for storage command behavior.

### 5.5 Keyboard and text are different data

A USB HID keyboard's usage `0x04` commonly refers to the physical keyboard **A-position** key. A US English lowercase `a` is encoded as ASCII/UTF-8 **0x61**. The HID usage travels in an input report, and layout/modifiers determine which character the OS/application produces. Conflating keyboard reports with ASCII or USB wire packets is incorrect.

## 6. Transactions across hardware boundaries

A useful hardware explanation records both **actors** and **representations**, rather than connecting boxes with generic "0 and 1" arrows. The six scenario traces in v4 demonstrate this principle:

1. **Render web markup:** source bytes → transport → DRAM → browser parser → CPU code execution → render commands → display signal.
2. **UEFI boot:** power-enable / VRM stability → reset → firmware read → hardware initialization → boot manager → OS services.
3. **Read NVMe:** application read → filesystem/block layer → submission queue → PCIe MMIO doorbell → SSD flash access → DMA → completion.
4. **Keyboard input:** keyboard switch → HID usage → USB report → controller/driver → OS/browser event → DOM update.
5. **HTTPS response:** PHY and MAC → link frame → IP/transport → authenticated TLS decryption → HTTP/HTML parsing → painting.
6. **Draw a frame:** browser scene → GPU command buffers → PCIe/fabric submission → GPU execution → frame buffer → scanout.

The exact details may differ by system. For example, a file read may be served from the OS page cache (no new NVMe command); a GPU may be integrated into the CPU package (no external PCIe slot); a web page may have no JavaScript; networking could be Wi-Fi or Ethernet; Secure Boot may be disabled or configured with different policy.

## 7. Distinguish power and data flows

**Power delivery:** PSU rails → EPS / ATX connector → converters / VRM → regulated CPU and system rails. Switching gate-control waveforms govern the voltage regulator; they are not logical bytes. Capacitors decouple/shape supply behavior and inductors store magnetic energy. Device clocks and reset signals establish timing and valid power sequencing.

**Data flows:** CPU caches ↔ memory controller ↔ DDR memory; CPU/chipset ↔ PCIe root complex ↔ NVMe SSD/GPU/NIC; platform controller ↔ SPI flash; peripheral host controller ↔ USB devices. These require separate protocol decoding and electrical layers, not a shared motherboard command stream.

**Clocking:** CPU and I/O clocks provide reference timing. High-speed links often recover clocks from encoded data streams; oscillator/PLL architectures and training differ. A clock pin's high/low transitions should not automatically be counted as an 8-bit data word.

## 8. Standalone v4 advanced modules

The v4 controller (`motherboard-advanced.js`) adds new labs without altering the inherited motherboard renderer. It requires only the DOM elements prefixed with `data-v4-*` and is scoped to `#hardware-atlas`. The v3 binary controller's single routing function is extended to recognize five new pane names, while v4 owns their logic.

### EDU-8

EDU-8 is a small original, deterministic accumulator CPU, not a vendor ISA: one 8-bit A register; an 8-bit PC; Z and C flags; 256-byte unified RAM; 2-byte fixed-length instructions; an output port; explicit instruction decoder; and a compact assembler with labels. A step updates simulated state and gives conceptual fetch/decode/execute/commit phases. Run is limited to **32 steps per click** to prevent page stalls. Full instruction definitions appear in `EDU8-INSTRUCTION-SET.md`.

### Waveform generator

SPI mode 0 is presented as CPOL=0, CPHA=0 with conceptual sampling on rising SCLK edges, MSB-first byte bits, and CS# asserted for the byte. UART is shown as 8N1: idle high, one start low, eight data bits LSB-first, one stop high. They are *idealized logic-state diagrams*, not measurements; propagation delay, setup/hold margins, line coding, voltages, oversampling and error conditions are omitted.

### Real ISA lab

Two actual encodings demonstrate how opcodes differ from device command bytes:

- x86-64 `MOV EAX,imm32` emits `B8` plus 32-bit little-endian immediate. The valid input range is 0..4,294,967,295.
- RV32I `ADDI x5,x0,imm12` emits a 32-bit I-type instruction and uses sign-extended immediates −2048..2047. The byte array is little-endian.

### Assessment and glossary

Fifteen independently authored questions distinguish wiring vs logic, HTML source vs machine instructions, device commands vs opcodes, DDR memory vs firmware, and SPI vs UART. Scores are in-memory only and reset when the page is refreshed.

## 9. Security, performance and trust boundaries

**Educational sandbox:** Input assembly is parsed and executed by JavaScript as inert arithmetic inside a fixed 256-byte array; the interpreter does not invoke shell commands, write files, execute imported code, attach to real devices or perform network calls. HTML-to-UTF-8 examples are converted using `TextEncoder`, not inserted into `innerHTML` unescaped. All human-readable content derived from a user's input must remain escaped or assigned via `textContent`.

**Rendering:** The hardware SVG illustrations are conceptual and are not measured manufacturer wiring. The scope SVGs are derived from local numeric bytes and constant labels. An embedded site should maintain its existing CSP and avoid unsafe inline host-site modifications. No storage/telemetry is required.

**Privacy:** There is no remote API, third-party analytics, cookie or user account dependency in the added v4 laboratories. No data is uploaded when assembling or exploring instructions.

**Accessibility:** Controls are native buttons/inputs/selects, selected states use `aria-pressed`, status changes use live regions, and reduced-motion users are respected. Custom responsive CSS prevents horizontal document overflow at tested widths. The internal 11-tool toolbar scrolls horizontally on narrow screens; it is **not** an extra host-site navigation system.

## 10. Codex integration architecture

```
Host portfolio website (existing index.html/router/nav — preserve)
  └── ONE "Motherboard & Chips" host-level tab
       └── #hardware-atlas HTML fragment
            ├── Motherboard (25 clickable board regions)
            ├── Inside a chip (14 silicon regions)
            ├── Materials Lab (12 dossiers)
            ├── History (10 milestones)
            └── Binary & Chip Signals
                 ├── 00  HTML → UTF-8 bytes
                 ├── 01  Browser-to-pixel route
                 ├── 02  Component dossier / 39 profiles
                 ├── 03  Logic gates / 8-bit ALU
                 ├── 04  x86 machine-code examples
                 ├── 05  Protocol command examples
                 ├── 06  Six system workflows [V4]
                 ├── 07  EDU-8 assembler & CPU [V4]
                 ├── 08  SPI/UART scope [V4]
                 ├── 09  x86 / RISC-V ISA fields [V4]
                 └── 10  Knowledge assessment [V4]
```

Three controller modules use the `window.HardwareAtlas`, `window.HardwareBinaryAtlas`, and `window.HardwareAdvancedAtlas` namespaces, and initialize against the same `#hardware-atlas` root. Production CSS and JS should load exactly once, and the host app should never paste `preview.html` over an existing entrypoint. The component IDs form a stable contract: `data-bin-jump="bios"`, for instance, selects the documented UEFI flash part in the inherited atlas.

## 11. Technical validation summary

- Original SVG and v3 regression paths pass at 1600, 1280, 760 and 390 CSS pixels.
- V4 tests cover six scenario selections, step navigation, board round trip, 256 memory buttons, assembler validation, 4 sample programs and 8-bit carry, SPI/UART sample selection, x86/RISC-V encoding updates, glossary filtering and quiz scoring.
- Screenshots of the original atlas and five new labs are included for review.
- No JavaScript page exceptions or document horizontal overflow were observed in the tested states.
- Host-website router, host CSS cascade, host CSP, real browser network policies, assistive-technology announcements and compatibility outside tested Chromium environments require final verification after site integration.

## 12. Primary references (upstream specifications)

- Intel 64 and IA-32 Software Developer Manuals: https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html
- RISC-V Unprivileged ISA: https://docs.riscv.org/reference/isa/_attachments/riscv-unprivileged.pdf
- NVM Express base specification: https://nvmexpress.org/specification/nvm-express-base-specification/
- NVM Express NVM command set: https://nvmexpress.org/specification/nvm-command-set-specification/
- NVM Express PCIe transport specification: https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/
- Microchip SPI modes CPOL/CPHA: https://onlinedocs.microchip.com/oxy/GUID-A9964E93-D46C-42E6-98D2-4ED783ABB2CE-en-US-2/GUID-0E901CC4-8D8D-458D-8FF5-8898F0C41259.html
- MDN TextEncoder: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder

**Interpretation note:** These sources establish ISA semantics, relevant command set structure, SPI mode definitions, and UTF-8 byte conversion behavior. Specific chip manufacturer layouts, timings and real driver interactions require appropriate component datasheets and platform manuals; conceptual page diagrams do not substitute for them.
