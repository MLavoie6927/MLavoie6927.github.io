/* ===========================================================================
 * Motherboard & Chip Atlas v3 — Binary & Signals interactive learning layer
 * Author/Research Architecture: Marc Lavoie | Date: 2026-11-13
 * Drop-in alongside v2 atlas, not a replacement for existing site shell.
 * Educational models; examples explicitly labeled where not true bus frames.
 * =========================================================================== */
(function () {
'use strict';
const profiles = [
  {
    "id": "cpu-socket",
    "name": "CPU socket",
    "layer": "board",
    "kind": "Digital interface + power",
    "example": "CPU instruction bits (example): B8 2A 00 00 00",
    "behavior": "The CPU socket itself executes no binary code. It carries processor-facing power, ground, high-speed data, reset/clock and controller signals.",
    "signal": "DDR command/address and DQ data, PCIe differential pairs, sideband signals and multiple regulated supply rails.",
    "path": "CPU package ↔ socket ↔ motherboard traces ↔ DIMM / M.2 / chipset",
    "note": "Pin assignments and signaling change with the CPU platform and socket revision."
  },
  {
    "id": "vrm",
    "name": "Voltage regulator module",
    "layer": "board",
    "kind": "Power control, not an ISA",
    "example": "PWM gate control: 1 / 0 (conceptual)",
    "behavior": "A multiphase buck regulator switches MOSFET power stages to regulate voltage. A control IC may contain digital logic, telemetry and firmware, but switching states are not general CPU instructions.",
    "signal": "Power switching, phase control, voltage/current telemetry; some controllers use PMBus or proprietary buses.",
    "path": "EPS 12 V → VRM stages → CPU power plane",
    "note": "High-current switching waveforms are analog power signals; they cannot be represented accurately by arbitrary software bits."
  },
  {
    "id": "eps",
    "name": "CPU EPS power connector",
    "layer": "board",
    "kind": "Power-only connector",
    "example": "12 V DC ≠ a byte",
    "behavior": "An EPS connector supplies DC electrical power and ground. It does not carry executable machine instructions or a general binary data stream.",
    "signal": "12 V bulk power and return conductors.",
    "path": "PSU → EPS connector → motherboard VRM → processor",
    "note": "Do not confuse PCIe GPU power cables with EPS CPU power connectors."
  },
  {
    "id": "dimm",
    "name": "DDR memory slots",
    "layer": "board",
    "kind": "DRAM command + data",
    "example": "Illustrative DQ byte: 01000001 = 0x41",
    "behavior": "DRAM memory chips store bit patterns as charge states and exchange data through a memory-controller protocol. The bytes are data; the DRAM chips do not execute CPU machine instructions.",
    "signal": "Clock, command/address, DQ data, DQS strobes and power; DDR5 implementations include subchannels and on-module supporting ICs.",
    "path": "CPU memory controller ↔ routed DDR channel ↔ DIMM DRAM",
    "note": "Actual DDR waveforms, training, bursts and ECC organization are much more complex than an eight-bit illustration."
  },
  {
    "id": "chipset",
    "name": "Chipset / PCH",
    "layer": "board",
    "kind": "Platform control and registers",
    "example": "Example MMIO byte: 0x01",
    "behavior": "A platform controller hub coordinates selected I/O, storage, USB and lower-speed platform interfaces. Firmware and drivers access control/status registers through platform-defined mechanisms.",
    "signal": "PCIe, SPI flash, USB, SATA (when available), sidebands and management/control registers.",
    "path": "CPU ↔ chipset link ↔ USB / storage / firmware",
    "note": "Which controllers live in the chipset versus CPU varies widely by system."
  },
  {
    "id": "pcie-x16",
    "name": "PCI Express x16 slot",
    "layer": "board",
    "kind": "High-speed serial packets",
    "example": "Illustrative payload: DE AD BE EF",
    "behavior": "The PCIe slot carries packets through differential serial lanes. Endpoint controllers parse transaction-layer packets; there is no instruction stream belonging to the slot itself.",
    "signal": "PCIe TLP/DLLP, link training, scrambling/encoding and lane-level electrical symbols.",
    "path": "CPU / chipset PCIe root port ↔ motherboard slot ↔ GPU / accelerator",
    "note": "The sample bytes represent arbitrary payload, not a valid complete PCIe packet."
  },
  {
    "id": "pcie-x1",
    "name": "PCI Express x1 slot",
    "layer": "board",
    "kind": "High-speed serial packets",
    "example": "Illustrative data: 10101100",
    "behavior": "A smaller PCIe link uses the same layered packet architecture with fewer lanes. Device configuration and register transactions are interpreted by controllers.",
    "signal": "PCIe differential pairs, clock/reference timing and sidebands.",
    "path": "Root complex ↔ PCIe x1 slot ↔ NIC / sound / I/O card",
    "note": "Link width and speed negotiate with the device; binary data is not a CPU opcode."
  },
  {
    "id": "m2",
    "name": "M.2 NVMe connector",
    "layer": "board",
    "kind": "PCIe / NVMe storage",
    "example": "NVMe READ opcode: 0x02",
    "behavior": "An M.2 connector may carry NVMe over PCIe. An NVMe controller processes commands using memory-resident submission/completion queues.",
    "signal": "PCIe transport plus NVMe command structures when the device and slot support it.",
    "path": "CPU/chipset → PCIe lanes → M.2 SSD controller → NAND flash",
    "note": "M.2 describes a physical form factor; some slots support SATA or other interfaces instead of NVMe."
  },
  {
    "id": "m2-secondary",
    "name": "Second M.2 slot",
    "layer": "board",
    "kind": "Connector / interface dependent",
    "example": "NVMe WRITE opcode: 0x01",
    "behavior": "A second M.2 connector can carry PCIe/NVMe or other supported signals. Queue commands belong to the SSD controller, not to the connector.",
    "signal": "PCIe lanes, clock/reset signals, 3.3 V power; capability depends on board configuration.",
    "path": "CPU/chipset → secondary M.2 slot → SSD controller",
    "note": "Lanes may be shared with SATA/PCIe ports depending on the motherboard."
  },
  {
    "id": "sata",
    "name": "SATA storage ports",
    "layer": "board",
    "kind": "Serialized storage protocol",
    "example": "Register FIS type byte: 0x27",
    "behavior": "SATA ports transmit serialized frames to SATA devices. Host controllers format protocol structures that carry commands and data.",
    "signal": "SATA physical signaling, FIS, link primitives and frame integrity mechanisms.",
    "path": "CPU/chipset SATA controller ↔ SATA cable ↔ SSD/HDD",
    "note": "0x27 identifies a host-to-device Register FIS type; one byte is not a complete frame."
  },
  {
    "id": "atx24",
    "name": "24-pin ATX power connector",
    "layer": "board",
    "kind": "Power and sideband status",
    "example": "PS_ON# asserted: logic low",
    "behavior": "The 24-pin ATX connector primarily brings supply rails and ground to the motherboard. Selected pins carry control/status logic, including power-supply enable and power-good.",
    "signal": "3.3 V, 5 V, 12 V and standby rails, PWR_OK and PS_ON# signaling.",
    "path": "PSU ↔ ATX connector ↔ board regulators and loads",
    "note": "ATX power signals should not be described as general bidirectional byte streams."
  },
  {
    "id": "bios",
    "name": "UEFI firmware flash",
    "layer": "board",
    "kind": "Serial flash / firmware bytes",
    "example": "SPI READ: 03 00 10 00 (example)",
    "behavior": "A SPI NOR flash chip stores UEFI firmware bytes. During boot, the platform fetches firmware data; the flash chip accepts commands but does not itself execute x86/ARM firmware instructions.",
    "signal": "SPI clock/chip-select/data pins or other supported flash topology; command, address and data phases.",
    "path": "CPU/SoC firmware path ↔ SPI controller ↔ flash memory",
    "note": "03h is a common SPI NOR READ opcode with a 24-bit address; actual parts may require different modes/address widths."
  },
  {
    "id": "cmos",
    "name": "RTC / CMOS battery",
    "layer": "board",
    "kind": "RTC state / battery-backed power",
    "example": "RTC seconds BCD: 0x25 = 25",
    "behavior": "An RTC keeps time and may expose registers, sometimes using BCD encodings. The CMOS coin cell supplies standby energy, not binary data.",
    "signal": "Low-speed RTC/register access through platform logic; battery-backed timekeeping.",
    "path": "Battery → RTC power domain; CPU ↔ chipset / RTC registers",
    "note": "The specific RTC register map varies; CMOS battery is not a programmable chip."
  },
  {
    "id": "rear-io",
    "name": "Rear I/O stack",
    "layer": "board",
    "kind": "Multiple I/O protocols",
    "example": "USB keyboard report: 00 00 04 00 00 00 00 00",
    "behavior": "Rear I/O ports expose different controller protocols, such as USB, Ethernet and audio. Their connectors do not share a single encoding.",
    "signal": "USB packetized transfers, Ethernet frames, audio samples and display links depending on port.",
    "path": "External peripheral ↔ I/O connector ↔ controller ↔ CPU/memory",
    "note": "The example is a typical boot-protocol USB keyboard report, not generic encoding for all ports."
  },
  {
    "id": "audio",
    "name": "Audio codec and capacitors",
    "layer": "board",
    "kind": "Digital samples + analog conversion",
    "example": "16-bit PCM sample: 0000000000000000",
    "behavior": "An audio codec receives and emits digital audio samples, then converts them into analog voltage waveforms; it can also convert analog input into digital samples.",
    "signal": "HD Audio, I²S/TDM or other digital audio links, register controls and analog outputs.",
    "path": "Application → OS audio stack → controller → codec → speaker",
    "note": "Sample resolution, format, endianness and transport differ across devices."
  },
  {
    "id": "ethernet",
    "name": "Ethernet controller",
    "layer": "board",
    "kind": "Network framing and line coding",
    "example": "EtherType IPv4: 08 00",
    "behavior": "The Ethernet controller formats link-layer frames with MAC addresses, payload type, data and error checks. A PHY converts framed information into link-specific electrical symbols.",
    "signal": "Ethernet MAC frames, preambles and FCS; PHY modulation/line coding depend on Ethernet speed.",
    "path": "CPU/memory ↔ NIC ↔ PHY ↔ twisted pair / fiber",
    "note": "08 00 is a header field value, not a complete Ethernet packet or wire waveform."
  },
  {
    "id": "usb-header",
    "name": "Front USB header",
    "layer": "board",
    "kind": "USB packetized interface",
    "example": "HID usage ID for A: 0x04",
    "behavior": "Internal USB headers link front ports to the host controller. A USB keyboard may encode a physical key as a HID usage ID inside a report.",
    "signal": "USB transfer framing, device enumeration, endpoints and payloads.",
    "path": "Front port ↔ USB header ↔ host controller ↔ memory ↔ application",
    "note": "The HID usage value is part of a report, not the raw USB wire code."
  },
  {
    "id": "fpanel",
    "name": "Front-panel header",
    "layer": "board",
    "kind": "GPIO / switch logic",
    "example": "Power switch: released 1 → pressed 0 (typical)",
    "behavior": "Front-panel power and reset buttons generally drive simple logic-level signals. Status LEDs are driven through board-level current-limited circuits.",
    "signal": "GPIO-like switch sensing and LED drive; not a general serial code stream.",
    "path": "Case switch / LED ↔ front-panel header ↔ platform control",
    "note": "Polarity and pull-up arrangement vary by motherboard."
  },
  {
    "id": "fan",
    "name": "Fan / pump header",
    "layer": "board",
    "kind": "PWM control + tachometer",
    "example": "PWM high/low control: 1/0",
    "behavior": "A fan header may supply a PWM control signal and receive tachometer pulses. These transitions control or report fan rotation, not CPU instruction bytes.",
    "signal": "PWM duty cycle, tachometer pulse frequency, 12 V and ground.",
    "path": "Board fan controller ↔ fan / pump motor",
    "note": "PWM frequency, pinout and electrical levels must follow supported fan specification."
  },
  {
    "id": "heatsink",
    "name": "Chipset heatsink",
    "layer": "board",
    "kind": "Thermal / passive",
    "example": "No executable bits",
    "behavior": "A heatsink moves heat from chips through conduction and airflow. It is a passive thermal structure, not a binary processor or data receiver.",
    "signal": "Thermal energy, thermal resistance and airflow; no data bus inside the heatsink.",
    "path": "Chip package → thermal material → heatsink → air",
    "note": "Nearby thermal sensors are separate electronic devices."
  },
  {
    "id": "pcb",
    "name": "Multilayer PCB stack-up",
    "layer": "board",
    "kind": "Multilayer physical routing",
    "example": "Differential pair ≠ a byte by itself",
    "behavior": "The PCB routes power and electrical signals between components. Copper tracks and planes are passive physical pathways; each routed signal is interpreted by its connected controller.",
    "signal": "Controlled-impedance traces, return paths, ground/power planes and vias.",
    "path": "CPU ↔ DIMM / PCIe / flash / chipset via board copper",
    "note": "Logical bits are abstractions; high-speed channels use equalization, analog waveforms and coding."
  },
  {
    "id": "clock",
    "name": "Reference clock generator",
    "layer": "board",
    "kind": "Periodic timing reference",
    "example": "Clock transition: 0 → 1 → 0",
    "behavior": "A reference clock generator supplies oscillating timing signals used for synchronous hardware. The waveform does not normally encode application data.",
    "signal": "Differential and single-ended clock output signals, jitter and phase.",
    "path": "Clock generator → clock buffers / controllers / device PHYs",
    "note": "A clock is a timing reference; not every transition represents a payload bit."
  },
  {
    "id": "debug",
    "name": "POST diagnostic display",
    "layer": "board",
    "kind": "Diagnostic status display",
    "example": "POST code example: 0xA2 (vendor-dependent)",
    "behavior": "A debug display may show hexadecimal checkpoint codes emitted during platform initialization. Those codes are diagnostic values, not generic motherboard instructions.",
    "signal": "Diagnostic I/O writes, embedded controllers, segment display drivers.",
    "path": "Firmware checkpoint → platform registers → debug display",
    "note": "POST code meanings are firmware-vendor and board-specific; 0xA2 is an example, not universal."
  },
  {
    "id": "wifi",
    "name": "Wireless interface module",
    "layer": "board",
    "kind": "Radio frames / modulation",
    "example": "Wi-Fi data byte: 0x41 (payload example)",
    "behavior": "A Wi-Fi chipset constructs and decodes 802.11 frames, applies link security and modulates information onto radio carriers.",
    "signal": "802.11 MAC frames, encryption and PHY symbols, OFDM/modulation.",
    "path": "CPU ↔ PCIe/USB/SDIO Wi-Fi interface ↔ radio ↔ antenna",
    "note": "The same payload bytes map to different over-the-air waveforms across modulation modes."
  },
  {
    "id": "capacitors",
    "name": "Power capacitors",
    "layer": "board",
    "kind": "Analog power conditioning",
    "example": "No executable bits",
    "behavior": "Decoupling capacitors store electric charge and smooth supply transients near chips. They do not store application bits in the same manner as DRAM cells.",
    "signal": "Analog voltage/current over time.",
    "path": "Regulator rails ↔ decoupling capacitors ↔ chip supply pins",
    "note": "Some memory cells use capacitance to store bits; discrete board capacitors normally serve power filtering."
  },
  {
    "id": "cpu-cores",
    "name": "CPU processing cores",
    "layer": "chip",
    "kind": "Machine ISA and micro-ops",
    "example": "x86 example: B8 2A 00 00 00 = MOV EAX,42",
    "behavior": "A CPU core fetches machine-code bytes, decodes instructions and executes them using registers, execution units and control logic. Implementations may internally transform instructions into micro-operations.",
    "signal": "Instruction fetch, caches, registers, arithmetic and branch/control networks.",
    "path": "System memory/cache → core fetch/decode → ALU → writeback",
    "note": "Example is x86/64 encoding; other ISAs have different instruction formats."
  },
  {
    "id": "gpu-cores",
    "name": "Integrated GPU / accelerator",
    "layer": "chip",
    "kind": "Graphics/compute instruction streams",
    "example": "Example pixel channel: 0xFF = 255",
    "behavior": "GPU execution engines process compiled shader or compute instructions. Pixel bytes and shader instructions are distinct kinds of binary information.",
    "signal": "SIMD/SIMT execution, shader instructions, texture/VRAM/cache traffic.",
    "path": "Browser renderer → graphics API → driver → GPU → display",
    "note": "GPU instruction encodings are architecture-specific and often proprietary."
  },
  {
    "id": "l3",
    "name": "Last-level cache",
    "layer": "chip",
    "kind": "Cache bit cells + metadata",
    "example": "Cache data example: 0x41 = 01000001",
    "behavior": "Last-level cache stores copies of memory data along with tags, valid/dirty state and coherence-related metadata. SRAM circuitry holds the bits; cache itself does not interpret them as a program.",
    "signal": "Cache-line payloads, tags, directory/coherence signals, internal fabric traffic.",
    "path": "CPU cores ↔ cache ↔ memory controller / fabric",
    "note": "Actual line sizes, cache policies and ECC schemes vary."
  },
  {
    "id": "memory-controller",
    "name": "Memory controller",
    "layer": "chip",
    "kind": "DRAM protocol sequencing",
    "example": "READ command (conceptual, not literal bits)",
    "behavior": "The integrated memory controller schedules DRAM commands, trains timing and handles responses to memory requests. It mediates processor data/address requests into DRAM-specific signaling.",
    "signal": "DDR command/address, DQ/DQS, banks/rows/columns and refresh.",
    "path": "Core/cache ↔ memory controller ↔ motherboard DIMM routing",
    "note": "No single bit string represents READ across all DDR generations and modes."
  },
  {
    "id": "fabric",
    "name": "On-die interconnect fabric",
    "layer": "chip",
    "kind": "Internal coherent interconnect",
    "example": "Payload byte 10100101 (illustrative)",
    "behavior": "An on-chip interconnect transports requests, responses and data among execution cores, caches, controllers and accelerators. Encodings are implementation-defined.",
    "signal": "Addressed transactions, arbitration, flow control and optionally cache coherence.",
    "path": "CPU cores ↔ cache ↔ memory controller / PHY / GPU",
    "note": "Fabric packet formats are product-specific, not equivalent to PCIe TLPs."
  },
  {
    "id": "pcie-phy",
    "name": "PCIe / high-speed PHY",
    "layer": "chip",
    "kind": "SerDes / encoded symbols",
    "example": "Data payload 11001010 (illustrative)",
    "behavior": "A high-speed PHY maps coded bit/symbol streams onto differential analog waveforms and reconstructs them at the receiver.",
    "signal": "Serial/deserializer, clock recovery, equalization, lane alignment and link training.",
    "path": "PCIe protocol engine ↔ PHY ↔ package pads ↔ motherboard copper",
    "note": "High-speed PHY voltage levels and waveforms are not rectangular TTL pulses."
  },
  {
    "id": "power-grid",
    "name": "Silicon power distribution",
    "layer": "chip",
    "kind": "Power distribution network",
    "example": "Power = voltage/current, not binary source code",
    "behavior": "Metal planes and meshes distribute supply/ground over the die. Timing and logic correctness depend on stable voltage under changing current.",
    "signal": "Analog voltage, return current, resistance/inductance and transient noise.",
    "path": "VRM → socket/package contacts → on-die power grid → logic",
    "note": "A power grid is not an address or instruction bus."
  },
  {
    "id": "clock-grid",
    "name": "Clock distribution network",
    "layer": "chip",
    "kind": "Clock tree / timing",
    "example": "Clock edges: ↑ ↓ ↑ ↓",
    "behavior": "The clock distribution network delivers timing edges to synchronous logic. Clock-gating cells may disable local clock activity to reduce power.",
    "signal": "Clock phase, skew, jitter and gating control.",
    "path": "Clock source / PLL → clock buffers → flip-flops",
    "note": "Clock-domain crossings require synchronizers or other safe mechanisms."
  },
  {
    "id": "silicon",
    "name": "Silicon substrate",
    "layer": "chip",
    "kind": "Semiconductor substrate",
    "example": "Doped junction control underlies 0/1",
    "behavior": "Semiconductor processing creates transistor structures whose voltage-controlled conduction implements switching behavior. The bare substrate contains no human-readable program.",
    "signal": "Charge carriers, electric fields, doped regions and device isolation.",
    "path": "CMOS transistors → logic gates → circuits → chips",
    "note": "Binary is a logic abstraction implemented through analog semiconductor physics."
  },
  {
    "id": "interconnect",
    "name": "Metal interconnect layers",
    "layer": "chip",
    "kind": "On-die signal wiring",
    "example": "Wire voltage interpreted as logic 0/1",
    "behavior": "Patterned metal layers connect transistor devices into gates and functional blocks. Signal integrity, parasitics and buffering affect reliable logic timing.",
    "signal": "On-die nets, vias, buffers, interconnect capacitance and resistance.",
    "path": "Logic cell output → metal net → next cell input",
    "note": "A copper segment does not intrinsically identify whether it carries data, clock, power or control."
  },
  {
    "id": "transistor",
    "name": "CMOS transistor devices",
    "layer": "chip",
    "kind": "Logic primitives",
    "example": "CMOS inverter: IN 0 → OUT 1",
    "behavior": "Complementary MOSFET devices switch to form logic gates. Large combinations produce adders, registers, decoders and controllers.",
    "signal": "Voltage-driven transistors, logic gates, flip-flops and state machines.",
    "path": "MOSFETs → NAND/NOR/NOT → registers / ALU → CPU",
    "note": "Real transistors operate continuously in voltage/current, not as perfect mathematical switches."
  },
  {
    "id": "package",
    "name": "Organic package substrate",
    "layer": "chip",
    "kind": "Substrate / physical fanout",
    "example": "Signals through bump → package trace → pad",
    "behavior": "A package connects fine-pitch silicon die contacts to larger board socket/land contacts and spreads power, high-speed data and heat.",
    "signal": "Package transmission lines, power/ground, high-speed interfaces and sidebands.",
    "path": "Die bumps ↔ package traces ↔ socket ↔ motherboard PCB",
    "note": "The package is not a separately executing instruction engine."
  },
  {
    "id": "bumps",
    "name": "Solder bumps / balls",
    "layer": "chip",
    "kind": "Electrical contact array",
    "example": "Data-contact state depends on attached circuit",
    "behavior": "Solder bumps and balls carry power, ground and signal currents across device/package boundaries. The bumps are passive conductors.",
    "signal": "Electronic contact between die and package or BGA and PCB.",
    "path": "Silicon pad → solder bump → package / board pad",
    "note": "Physical contact resistance, electromigration and mechanical fatigue matter."
  },
  {
    "id": "heatspreader",
    "name": "Integrated heat spreader",
    "layer": "chip",
    "kind": "Thermal / passive",
    "example": "No code: heat transport only",
    "behavior": "The heat spreader conducts thermal energy away from chip dies toward the cooler.",
    "signal": "Heat flux and thermal interface contact, not a bit protocol.",
    "path": "Die → thermal interface → metal heat spreader → cooler",
    "note": "A heat spreader does not itself decode bits or instructions."
  }
];
const pathSteps = [
  {title:'01 · HTML source bytes',subtitle:'UTF-8 text is read by the browser',code:'3C 68 31 3E 48 69 3C 2F 68 31 3E',detail:'The bytes encode <h1>Hi</h1> in UTF-8/ASCII-compatible notation. These are text characters on storage or in network payloads, not instructions the CPU executes directly.',links:['m2','sata','bios']},
  {title:'02 · Browser DOM and styles',subtitle:'Parsing and layout rules',code:'DOM: Element(h1) → Text("Hi")',detail:'The browser parses the markup into a document object model. CSS rules affect computed styles and layout. DOM nodes are browser data structures in memory, not fixed 8-bit hardware opcodes.',links:['dimm','l3','memory-controller']},
  {title:'03 · JavaScript runtime / OS',subtitle:'Code engines, syscalls and drivers',code:'JavaScript → bytecode/JIT/interpreter (engine-dependent)',detail:'JavaScript engines may interpret bytecode or compile hot functions into native machine instructions. The operating system manages memory and scheduling; rendering libraries and drivers submit work to graphics hardware.',links:['cpu-cores','chipset','bios']},
  {title:'04 · CPU fetch and execution',subtitle:'Instructions act on registers and data',code:'B8 2A 00 00 00 → MOV EAX, 42',detail:'The independent x86 encoding shown here is a valid example of CPU machine instructions. It is not compiled from the HTML above. A CPU core fetches instruction bytes, decodes and performs operations in execution units.',links:['cpu-socket','cpu-cores','transistor','l3']},
  {title:'05 · Cache and DRAM',subtitle:'Bit values stored and retrieved',code:'01000001 = 0x41 = 65 decimal',detail:'Caches commonly use SRAM bit cells and main memory uses DRAM bit cells. The bit pattern may represent an ASCII character, number, instruction or part of a pixel, depending on software context.',links:['l3','memory-controller','dimm']},
  {title:'06 · Motherboard links',subtitle:'Packeting, signaling and routing',code:'PCIe packet ≠ CPU opcode; SPI opcode ≠ x86 opcode',detail:'Electrical signaling carries high-level data across physical links. PCIe transports transactions, DDR exchanges memory data, SPI flash receives device commands, and USB transports endpoint payloads.',links:['pcie-x16','pcie-phy','m2','sata','bios','pcb']},
  {title:'07 · GPU draws the frame',subtitle:'Shaders, buffers and pixel values',code:'RGBA pixel: FF 6B 57 FF (example)',detail:'Rendering software converts a scene into display commands and data. The GPU executes its own architecture-specific instructions and may write image buffers. Final display scanout reads the frames.',links:['gpu-cores','pcie-x16','dimm']},
  {title:'08 · Pixels on your monitor',subtitle:'Display link and electronic light control',code:'A displayed pixel is not one byte on a wire',detail:'A display controller transmits encoded timing and pixel information over a supported link. The monitor electronics drive its pixel elements. Actual formats, timings and signaling depend on display hardware.',links:['rear-io','gpu-cores']}
];
const protocols = [
 {id:'spi',name:'SPI NOR flash · READ',host:'SPI controller',device:'Firmware flash',bytes:[0x03,0x00,0x10,0x00],labels:['READ (0x03)','Address high','Address mid','Address low'],detail:'03h is a common standard READ command. The next three bytes illustrate a 24-bit address of 0x001000; the controller would clock out response data afterward. Actual flash parts can support 32-bit addressing and alternate command modes.',links:['bios','chipset']},
 {id:'jedec',name:'SPI NOR flash · JEDEC ID',host:'SPI controller',device:'Firmware flash',bytes:[0x9f],labels:['Read ID (0x9F)'],detail:'0x9F is the common JEDEC ID request opcode for many SPI NOR devices. Manufacturer/device ID response depends on the specific part and is not shown as a universal constant.',links:['bios']},
 {id:'i2c',name:'I²C · 7-bit address 0x50 write',host:'I²C master',device:'EEPROM / sensor',bytes:[0xa0],labels:['(0x50 << 1) | W=0'],detail:'This illustrative first address byte uses a 7-bit target address 0x50 plus a write direction bit of zero: 10100000₂. It excludes the start condition, acknowledgement cycles and payload.',links:['dimm','chipset']},
 {id:'nvme',name:'NVMe · READ opcode',host:'NVMe host driver',device:'SSD controller',bytes:[0x02],labels:['Command opcode 0x02'],detail:'NVMe NVM READ uses opcode 0x02 in the command capsule. The full 64-byte submission-queue command includes fields such as namespace, pointers and block information; PCIe transports the data used by the controller.',links:['m2','pcie-x16']},
 {id:'nvme-write',name:'NVMe · WRITE opcode',host:'NVMe host driver',device:'SSD controller',bytes:[0x01],labels:['Command opcode 0x01'],detail:'Opcode 0x01 identifies an NVM WRITE. Showing the opcode alone does not form a valid NVMe request. The example demonstrates the difference between controller-specific commands and CPU ISA instructions.',links:['m2-secondary','m2']},
 {id:'hid',name:'USB HID · keyboard report',host:'Keyboard HID device',device:'USB host',bytes:[0,0,4,0,0,0,0,0],labels:['Mods','Reserved','A key','None','None','None','None','None'],detail:'A standard 8-byte boot-protocol keyboard input report can carry keyboard usage 0x04 (“A”). It is report payload data carried by USB, not electrical USB packet encoding, and the displayed character still depends on layout and modifiers.',links:['usb-header','rear-io']},
 {id:'ethernet',name:'Ethernet II · IPv4 EtherType',host:'Ethernet MAC',device:'PHY and remote MAC',bytes:[0x08,0x00],labels:['EtherType hi','EtherType lo'],detail:'0800h is the EtherType indicating IPv4 in an Ethernet II frame. The destination/source MAC, payload, FCS and on-the-wire physical symbols are deliberately excluded.',links:['ethernet','rear-io']},
 {id:'sata',name:'SATA · register FIS identifier',host:'SATA controller',device:'SATA drive',bytes:[0x27],labels:['Host-to-device register FIS type'],detail:'0x27 identifies a host-to-device Register FIS. It is not the complete SATA frame, host command or an x86 machine-code instruction.',links:['sata','chipset']},
 {id:'uart',name:'UART 8N1 · character A',host:'Serial transmitter',device:'Serial receiver',bytes:[0x41],labels:['Data 0x41'],detail:'An illustrative UART 8N1 transmission of ASCII A uses start=0, eight data bits sent least-significant-bit first (1,0,0,0,0,0,1,0) and stop=1. This protocol is provided for logic education, not as a claim that the motherboard has a UART port.',links:['chipset','fpanel']},
 {id:'pcie',name:'PCIe · arbitrary transaction payload',host:'Root complex',device:'PCIe endpoint',bytes:[0xDE,0xAD,0xBE,0xEF],labels:['Data 0','Data 1','Data 2','Data 3'],detail:'DE AD BE EF is an arbitrary sequence of example payload bytes. PCIe actually carries framed TLP/DLLP information over encoded and scrambled serial links; this selection is NOT a valid complete PCIe transaction.',links:['pcie-x16','pcie-phy']}
];
const $esc = value=>String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byteText = n=>(n&255).toString(2).padStart(8,'0');
const hexText = n=>'0x'+(n&255).toString(16).padStart(2,'0').toUpperCase();
const validByte = (v, fallback)=>{const n=Number(v);return v!=='' && Number.isFinite(n)?Math.min(255,Math.max(0,Math.trunc(n))):fallback;};
function init(target) {
 const root = typeof target==='string'?document.querySelector(target):target||document.getElementById('hardware-atlas');
 if(!root || root.dataset.hwatBinaryReady==='true')return false;
 const $ = q=>root.querySelector(q), $$ = q=>Array.from(root.querySelectorAll(q));
 const page=$('[data-hwat-binary-page]'), tab=$('[data-hwat-binary-tab]'), atlas=$('[data-hwat-workspace]'), learning=$('[data-hwat-learning-panel]');
 if(!page || !tab || !atlas || !learning)return false;
 const state={active:false,pane:'path',path:0,profile:'cpu-cores',layer:'all',search:'',byte:65,aluA:5,aluB:3,gA:0,gB:1,instruction:'mov',protocol:'spi'};
 const profileFor=id=>profiles.find(p=>p.id===id);
 function showBinary(pane='path',id=null){
   state.active=true; if(id && profileFor(id)){state.profile=id;pane='catalog';state.layer='all';state.search='';const inp=$('[data-bin-search]');if(inp)inp.value='';const sel=$('[data-bin-layer]');if(sel)sel.value='all';}
   page.hidden=false;atlas.hidden=true;learning.hidden=true;
   $$('[data-hwat-view]').forEach(b=>{b.classList.remove('is-active');b.setAttribute('aria-pressed','false');});
   tab.classList.add('is-active');tab.setAttribute('aria-pressed','true');root.dataset.hwatBinaryMode='true';
   setPane(pane);
 }
 function exitBinary(){state.active=false;page.hidden=true;atlas.hidden=false;learning.hidden=false;tab.classList.remove('is-active');tab.setAttribute('aria-pressed','false');root.dataset.hwatBinaryMode='false';}
 function setPane(pane){if(!['html','path','catalog','bits','instructions','protocols','scenarios','cpu','scope','isa','academy'].includes(pane))return;state.pane=pane;
   $$('[data-bin-pane]').forEach(b=>{const on=b.dataset.binPane===pane;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',String(on));});
   $$('[data-bin-content]').forEach(el=>{el.hidden=el.dataset.binContent!==pane;});
   if(pane==='html')renderHtmlBytes(); else if(pane==='path')renderPath(); else if(pane==='catalog')renderProfiles(); else if(pane==='bits')renderBits(); else if(pane==='instructions')renderInstructions(); else if(pane==='protocols')renderProtocol();
 }
 function renderHtmlBytes(){
   const source=$('[data-bin-html-source]');if(!source)return;
   const str=source.value;
   const utf8 = typeof TextEncoder!=='undefined' ? new TextEncoder().encode(str) : Uint8Array.from(str,c=>c.charCodeAt(0)&255);
   const count = utf8.length;
   $('[data-bin-html-stats]').textContent=`${[...str].length} Unicode code points · ${count} UTF-8 bytes · ${count*8} bits`;
   const list=Array.from(utf8.slice(0,180));
   $('[data-bin-html-sequence]').innerHTML=list.length
     ? list.map((n,i)=>`<div class="hwat-bin-html-byte"><small>byte ${i+1}</small><strong>${n.toString(16).toUpperCase().padStart(2,'0')}</strong><code>${byteText(n)}</code></div>`).join('')
     : '<p class="hwat-bin-empty">Enter a short HTML fragment to see its binary representation.</p>';
 }
 function chipButtons(ids){return `<div class="hwat-bin-related"><span>SEE PHYSICAL HARDWARE:</span>${ids.filter(id=>profileFor(id)).map(id=>{const p=profileFor(id);return `<button type="button" data-bin-jump="${$esc(id)}">${$esc(p.name)}</button>`;}).join('')}</div>`;}
 function renderPath(){
   $('[data-bin-path]').innerHTML=pathSteps.map((x,i)=>`<button type="button" class="hwat-bin-path-node ${i===state.path?'is-active':''}" data-bin-path-step="${i}" aria-pressed="${i===state.path}"><span class="hwat-bin-node-num">${String(i+1).padStart(2,'0')}</span><span class="hwat-bin-node-body"><strong>${$esc(x.title)}</strong><small>${$esc(x.subtitle)}</small></span><span class="hwat-bin-node-chevron">→</span></button>`).join('');
   const x=pathSteps[state.path];
   $('[data-bin-path-detail]').innerHTML=`<div class="hwat-bin-panel-heading"><span>SELECTED SYSTEM STAGE</span><h4>${$esc(x.title)}</h4></div><div class="hwat-bin-code-line">${$esc(x.code)}</div><p>${$esc(x.detail)}</p>${chipButtons(x.links)}<div class="hwat-bin-step-actions"><button type="button" data-bin-step-nav="back" ${state.path===0?'disabled':''}>← Previous</button><span>${state.path+1} of ${pathSteps.length}</span><button type="button" data-bin-step-nav="next" ${state.path===pathSteps.length-1?'disabled':''}>Next →</button></div>`;
 }
 function renderProfiles(){
   const visible=profiles.filter(p=>(state.layer==='all'||state.layer===p.layer)&&(`${p.name} ${p.id} ${p.kind} ${p.example} ${p.signal} ${p.behavior}`.toLowerCase().includes(state.search)));
   $('[data-bin-index]').innerHTML=visible.length?visible.map(p=>`<button type="button" data-bin-profile="${$esc(p.id)}" class="hwat-bin-index-item ${state.profile===p.id?'is-active':''}" aria-pressed="${state.profile===p.id}"><small>${p.layer==='board'?'MOTHERBOARD':'INSIDE PROCESSOR'}</small><strong>${$esc(p.name)}</strong><span>${$esc(p.kind)}</span></button>`).join(''):'<p class="hwat-bin-empty">No matching components. Try a different term or hardware layer.</p>';
   const p=profileFor(state.profile);
   if(!p) return;
   $('[data-bin-dossier]').innerHTML=`<div class="hwat-bin-panel-heading"><span>${p.layer==='board'?'MOTHERBOARD COMPONENT':'PROCESSOR CHIP REGION'} / ENGINEERING REFERENCE</span><h4>${$esc(p.name)}</h4></div>
     <div class="hwat-bin-tag">${$esc(p.kind)}</div><p>${$esc(p.behavior)}</p>
     <div class="hwat-bin-dossier-box"><span>ENCODING OR SIGNAL EXAMPLE</span><code>${$esc(p.example)}</code></div>
     <div class="hwat-bin-fact"><h5>Actual physical or logical signals</h5><p>${$esc(p.signal)}</p></div>
     <div class="hwat-bin-fact"><h5>How it links to the motherboard</h5><p>${$esc(p.path)}</p></div>
     <div class="hwat-bin-fact"><h5>Technical qualification</h5><p>${$esc(p.note)}</p></div>
     <button class="hwat-bin-go-board" type="button" data-bin-jump="${$esc(p.id)}">↗ Highlight on the ${p.layer==='board'?'motherboard':'chip'} illustration</button>`;
 }
 function renderBits(){
   const bits=$('[data-bin-bits]');bits.innerHTML=Array.from({length:8},(_,i)=>{const weight=2**(7-i),on=Boolean(state.byte&weight);return `<button data-bin-bit="${7-i}" type="button" class="hwat-bin-bit ${on?'is-one':'is-zero'}" aria-label="Bit ${7-i}, weight ${weight}, value ${on?1:0}; click to toggle" aria-pressed="${on}"><small>b${7-i} · ${weight}</small><strong>${on?'1':'0'}</strong></button>`;}).join('');
   const printable=state.byte>=32 && state.byte<=126?String.fromCharCode(state.byte):'non-printable';
   $('[data-bin-numeric]').innerHTML=`<div><small>BASE 2</small><strong>${byteText(state.byte)}</strong></div><div><small>BASE 10</small><strong>${state.byte}</strong></div><div><small>BASE 16</small><strong>${hexText(state.byte)}</strong></div><div><small>ASCII (7-BIT)</small><strong>${$esc(printable)}</strong></div>`;
   const x0=26,yhigh=30,ylow=96,w=65;let d=`M${x0} ${state.byte&128?yhigh:ylow}`;
   for(let i=0;i<8;i++){const b=Boolean(state.byte&(1<<(7-i)));const y=b?yhigh:ylow;const next=i<7?Boolean(state.byte&(1<<(6-i))):b;d+=` H${x0+(i+1)*w}`;if(next!==b)d+=` V${next?yhigh:ylow}`;}
   const svg=`<svg viewBox="0 0 588 132" role="img" aria-label="Abstract high/low level chart for bits ${byteText(state.byte)}"><rect width="588" height="132" fill="transparent"/><path d="M26 30H550 M26 96H550" stroke="#345568" stroke-dasharray="3 8"/><text x="2" y="33" fill="#8db7d1" font-size="12">1</text><text x="2" y="99" fill="#8db7d1" font-size="12">0</text><path d="${d}" stroke="#65f5df" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${Array.from({length:8},(_,i)=>`<text x="${x0+i*w+30}" y="120" text-anchor="middle" font-size="12" fill="#a1b8cb">b${7-i}</text>`).join('')}</svg>`;
   $('[data-bin-waveform]').innerHTML=svg;
   $('[data-bin-byte-value]').value=state.byte;
   const g=$('[data-bin-gates]');g.innerHTML=`<div class="hwat-bin-gate-switch">${[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>`<button type="button" data-bin-gate-pair="${a}${b}" class="${a===state.gA&&b===state.gB?'is-active':''}" aria-pressed="${a===state.gA&&b===state.gB}">A=${a}, B=${b}</button>`).join('')}</div>
   <table class="hwat-bin-truth"><thead><tr><th>A</th><th>B</th><th>AND</th><th>OR</th><th>XOR</th><th>NAND</th></tr></thead><tbody>${[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>`<tr class="${a===state.gA&&b===state.gB?'is-selected':''}"><td>${a}</td><td>${b}</td><td>${a&b}</td><td>${a|b}</td><td>${a^b}</td><td>${1-(a&b)}</td></tr>`).join('')}</tbody></table>`;
   renderAlu();
 }
 function renderAlu(){
   $('[data-bin-alu-a]').value=state.aluA; $('[data-bin-alu-b]').value=state.aluB;
   const a=state.aluA,b=state.aluB,sum=a+b,low=sum&255,carry=sum>255,overflow=Boolean((~(a^b)&(a^low)&128));
   $('[data-bin-alu-result]').innerHTML=`<div class="hwat-bin-alu-equation"><span>${byteText(a)}</span><b>+</b><span>${byteText(b)}</span><b>=</b><strong>${byteText(low)}</strong></div><div class="hwat-bin-alu-flags"><span>Unsigned result: <b>${low}</b></span><span>Carry-out: <b>${+carry}</b></span><span>Zero: <b>${+(low===0)}</b></span><span>Signed overflow: <b>${+overflow}</b></span></div><small>${a} + ${b} = ${sum}, 8-bit result ${low}${carry?' after wraparound':''}.</small>`;
 }
 const instructionDefs={
  mov:{name:'MOV EAX, 42',bytes:[0xB8,0x2A,0,0,0],fields:[['B8','Opcode · load immediate into EAX'],['2A 00 00 00','Little-endian immediate 0x0000002A = 42']],result:'EAX ← 0x0000002A (42). In 64-bit mode, writing EAX zero-extends into RAX.'},
  add:{name:'ADD EAX, 1',bytes:[0x83,0xC0,0x01],fields:[['83','Opcode family: arithmetic with sign-extended 8-bit immediate'],['C0','ModR/M: mod=11, reg/opcode=000 (ADD), r/m=000 (EAX)'],['01','8-bit signed immediate +1']],result:'EAX ← (EAX + 1) modulo 2³²; condition flags updated. If EAX was 42, it becomes 43.'}
 };
 function renderInstructions(){const ins=instructionDefs[state.instruction];$$('[data-bin-instruction]').forEach(b=>{const a=b.dataset.binInstruction===state.instruction;b.classList.toggle('is-active',a);b.setAttribute('aria-pressed',String(a));});
  $('[data-bin-instruction-detail]').innerHTML=`<div class="hwat-bin-ins-bytes">${ins.bytes.map(n=>`<span>${n.toString(16).toUpperCase().padStart(2,'0')}</span>`).join('')}</div><p class="hwat-bin-asm-name">${ins.name}</p><table class="hwat-bin-decode"><tbody>${ins.fields.map(([k,v])=>`<tr><th>${$esc(k)}</th><td>${$esc(v)}</td></tr>`).join('')}</tbody></table><p class="hwat-bin-ins-result">${$esc(ins.result)}</p>`;
  $('[data-bin-pipeline]').innerHTML=[['Fetch','Read encoded instruction bytes from cache/memory'],['Decode','Interpret opcode and operand fields'],['Execute','Calculate or move data in execution units'],['Writeback / retire','Update architectural state according to processor rules']].map((x,i)=>`<div class="hwat-bin-pipeline-step"><span>0${i+1}</span><div><strong>${x[0]}</strong><small>${x[1]}</small></div></div>`).join('');
 }
 function renderProtocol(){const p=protocols.find(p=>p.id===state.protocol)||protocols[0];
  const select=$('[data-bin-protocol]');if(!select.options.length)select.innerHTML=protocols.map(p=>`<option value="${$esc(p.id)}">${$esc(p.name)}</option>`).join('');select.value=p.id;
  $('[data-bin-protocol-diagram]').innerHTML=`<div class="hwat-bin-proto-node">${$esc(p.host)}</div><div class="hwat-bin-proto-link"><span>encoded exchange →</span><div class="hwat-bin-proto-track"><i></i></div></div><div class="hwat-bin-proto-node">${$esc(p.device)}</div>`;
  $('[data-bin-protocol-hex]').innerHTML=p.bytes.map((n,i)=>`<div><strong>${n.toString(16).toUpperCase().padStart(2,'0')}</strong><small>${byteText(n)}</small><span>${$esc(p.labels[i]||'Data')}</span></div>`).join('');
  $('[data-bin-protocol-detail]').innerHTML=`<div class="hwat-bin-panel-heading"><span>PROTOCOL SEMANTICS</span><h4>${$esc(p.name)}</h4></div><p>${$esc(p.detail)}</p>${chipButtons(p.links)}<div class="hwat-bin-fact"><h5>Interpretation warning</h5><p>This depicts selected command/header fields or an explicitly illustrative payload, not the entire packet and not the underlying line encoding.</p></div>`;
 }
 function jumpTo(id){const p=profileFor(id);if(!p)return;
   const btn=$(`[data-hwat-view="${p.layer}"]`);if(!btn)return;
   // The existing original Atlas event controller handles both interactions.
   btn.click();const row=root.querySelector(`[data-hwat-directory="${id}"]`);if(row)row.click();
   if(window.matchMedia && window.matchMedia('(max-width: 930px)').matches){const inspector=$('[data-hwat-inspector]'); if(inspector)inspector.scrollIntoView({behavior:'auto',block:'start'});}
 }
 root.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||!root.contains(button))return;
    if(button===tab){event.preventDefault();event.stopPropagation();showBinary('path');return;}
    if(button.matches('[data-hwat-open-binary]')){event.preventDefault();event.stopPropagation();showBinary('catalog',button.dataset.hwatOpenBinary);return;}
    if(button.matches('[data-hwat-view]') && state.active){exitBinary();return;}
    if(button.matches('[data-bin-pane]')){setPane(button.dataset.binPane);return;}
    if(button.matches('[data-bin-html-trace]')){state.path=0;setPane('path');return;}
    if(button.matches('[data-bin-path-step]')){state.path=Number(button.dataset.binPathStep);renderPath();return;}
    if(button.matches('[data-bin-step-nav]')){state.path=Math.max(0,Math.min(pathSteps.length-1,state.path+(button.dataset.binStepNav==='next'?1:-1)));renderPath();return;}
    if(button.matches('[data-bin-profile]')){state.profile=button.dataset.binProfile;renderProfiles();return;}
    if(button.matches('[data-bin-jump]')){jumpTo(button.dataset.binJump);return;}
    if(button.matches('[data-bin-bit]')){state.byte^=(1<<Number(button.dataset.binBit));renderBits();return;}
    if(button.matches('[data-bin-gate-pair]')){const pair=button.dataset.binGatePair;state.gA=Number(pair[0]);state.gB=Number(pair[1]);renderBits();return;}
    if(button.matches('[data-bin-instruction]')){state.instruction=button.dataset.binInstruction;renderInstructions();return;}
 },true);
 $('[data-bin-html-source]').addEventListener('input',renderHtmlBytes);
 const inputSearch=$('[data-bin-search]');inputSearch.addEventListener('input',e=>{state.search=e.target.value.trim().toLowerCase();renderProfiles();});
 $('[data-bin-layer]').addEventListener('change',e=>{state.layer=e.target.value;renderProfiles();});
 $('[data-bin-byte-value]').addEventListener('input',e=>{state.byte=validByte(e.target.value,state.byte);renderBits();});
 $('[data-bin-alu-a]').addEventListener('change',e=>{state.aluA=validByte(e.target.value,state.aluA);renderAlu();});
 $('[data-bin-alu-b]').addEventListener('change',e=>{state.aluB=validByte(e.target.value,state.aluB);renderAlu();});
 $('[data-bin-protocol]').addEventListener('change',e=>{state.protocol=e.target.value;renderProtocol();});
 root.dataset.hwatBinaryReady='true';renderPath();return true;
}
window.HardwareBinaryAtlas=Object.freeze({init,version:'4.0.0',profileCount:profiles.length,protocolCount:protocols.length,lookup:id=>{const p=profiles.find(p=>p.id===id);return p?Object.freeze({...p}):null;}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init(),{once:true});else init();
})();
