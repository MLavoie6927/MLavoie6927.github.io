# Technical Sources, Terminology and Limitations

**Marc Lavoie · Full Stack Silicon Lab v4.0 · 2026-11-13**

## Primary upstream documentation

| Component / tool | Source | Relevant material |
| --- | --- | --- |
| x86-64 encoding | [Intel 64 and IA-32 Software Developer's Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) | `MOV r32,imm32`, little-endian immediates, register semantics |
| RV32I instruction format | [RISC-V Unprivileged ISA](https://docs.riscv.org/reference/isa/_attachments/riscv-unprivileged.pdf) | `ADDI`, I-type 12-bit signed immediate, `0010011` opcode |
| NVMe commands | [NVM Express NVM Command Set](https://nvmexpress.org/specification/nvm-command-set-specification/) | Read/write command set and semantics |
| NVMe host-device transport | [NVMe over PCIe Transport](https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/) | Command/queue transport and PCIe interaction |
| NVMe architecture | [NVM Express Base](https://nvmexpress.org/specification/nvm-express-base-specification/) | Host/controller model and specification versions |
| SPI timing | [Microchip SPI Transfer Modes](https://onlinedocs.microchip.com/oxy/GUID-A9964E93-D46C-42E6-98D2-4ED783ABB2CE-en-US-2/GUID-0E901CC4-8D8D-458D-8FF5-8898F0C41259.html) | CPOL/CPHA modes; mode 0 sampling rising edge |
| HTML → bytes | [MDN TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) | UTF-8 encoding into Uint8Array |
| Semiconductor milestones | [Computer History Museum Silicon Engine](https://www.computerhistory.org/siliconengine/timeline/) | Historical reference |

These upstream links are provided as source references; the website operates offline and does not fetch them. No external icon libraries or CSS frameworks are required.

## Provenance

The v4 release is an **expansion of the user's prior v3 drop-in Motherboard & Chips component**, which itself preserved the original v2 illustrated atlas. The 25 board and 14 chip profiles are inherited and made accessible as JSON/CSV/Markdown correlation tables. The five v4 labs and their original teaching algorithms are newly written for this release. The educational EDU-8 instruction set is newly defined in this package, not derived from or asserted to be any vendor's hardware.

## Representation and simulation accuracy

- **Conceptual data paths**: show logical relationships, not netlist-verified motherboards or timings; integrated versus discrete components are platform-specific.
- **Binary profiles**: some chips execute code, some store bytes, some exchange commands, and others are passive; the taxonomy is an explanatory layer rather than component-specific operational certification.
- **Native machine code**: the two ISA byte sequences are actual encodings, but the page does not execute them on the visitor's native processor or compile the HTML into them.
- **Memory**: actual DRAM includes timing, bank/row organization, refresh and training; a DOM node or a numeric byte does not correspond to one physical trace by universal rule.
- **Device command samples**: bytes are selected fields of a command/report, not always complete legal transactions.
- **SPI and UART**: waveforms are idealized logic traces. Oversampling, physical impedance, clock drift, glitch filtering, rise/fall time and analog thresholds are omitted.
- **EDU-8**: executable deterministic JavaScript simulator, fictional simplified ISA; not a real chip, RISC-V core or x86 emulator.
- **Secure Boot**: authorization of certain boot images is distinct from disk encryption and from TPM measured-boot records; configurations vary.
- **Browser runtime**: parsing, GPU acceleration and graphics composition depend on engine and OS; the page does not assert a single mandatory data path.
- **Safety**: never treat the diagrams as instructions to probe live motherboard rails or short pins; repair and lab measurement require qualified practice.

## Verification update policy

When revising this project, Codex should compare opcode/transport semantics against the current edition of the relevant standards; isolate vendor-specific behavior in a clearly labeled platform profile. It should avoid claims that a particular motherboard pinout, packaging technology or GPU instruction format is universal. The static page is an instructional visualization; any real device monitoring must be a separately authorized, explicit user project.
