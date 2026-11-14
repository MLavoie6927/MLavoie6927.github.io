# Chip-to-Binary Cross-Reference: 39 Components

**Research and integration: Marc Lavoie · 2026-11-13**

This reference groups the illustrated 25 motherboard parts and 14 chip layers by their actual behavior. The examples are educational representations; a connector or heatsink does not execute code.

## CPU socket (cpu-socket)

- **Layer:** board | **Class:** Passive board interface
- **Type:** Digital interface + power
- **Example:** `CPU instruction bits (example): B8 2A 00 00 00`
- **Behavior:** The CPU socket itself executes no binary code. It carries processor-facing power, ground, high-speed data, reset/clock and controller signals.
- **Actual signals:** DDR command/address and DQ data, PCIe differential pairs, sideband signals and multiple regulated supply rails.
- **System route:** CPU package ↔ socket ↔ motherboard traces ↔ DIMM / M.2 / chipset
- **Qualification:** Pin assignments and signaling change with the CPU platform and socket revision.

## Voltage regulator module (vrm)

- **Layer:** board | **Class:** Power regulation and digital control
- **Type:** Power control, not an ISA
- **Example:** `PWM gate control: 1 / 0 (conceptual)`
- **Behavior:** A multiphase buck regulator switches MOSFET power stages to regulate voltage. A control IC may contain digital logic, telemetry and firmware, but switching states are not general CPU instructions.
- **Actual signals:** Power switching, phase control, voltage/current telemetry; some controllers use PMBus or proprietary buses.
- **System route:** EPS 12 V → VRM stages → CPU power plane
- **Qualification:** High-current switching waveforms are analog power signals; they cannot be represented accurately by arbitrary software bits.

## CPU EPS power connector (eps)

- **Layer:** board | **Class:** Passive power connector
- **Type:** Power-only connector
- **Example:** `12 V DC ≠ a byte`
- **Behavior:** An EPS connector supplies DC electrical power and ground. It does not carry executable machine instructions or a general binary data stream.
- **Actual signals:** 12 V bulk power and return conductors.
- **System route:** PSU → EPS connector → motherboard VRM → processor
- **Qualification:** Do not confuse PCIe GPU power cables with EPS CPU power connectors.

## DDR memory slots (dimm)

- **Layer:** board | **Class:** Memory storage and memory interface
- **Type:** DRAM command + data
- **Example:** `Illustrative DQ byte: 01000001 = 0x41`
- **Behavior:** DRAM memory chips store bit patterns as charge states and exchange data through a memory-controller protocol. The bytes are data; the DRAM chips do not execute CPU machine instructions.
- **Actual signals:** Clock, command/address, DQ data, DQS strobes and power; DDR5 implementations include subchannels and on-module supporting ICs.
- **System route:** CPU memory controller ↔ routed DDR channel ↔ DIMM DRAM
- **Qualification:** Actual DDR waveforms, training, bursts and ECC organization are much more complex than an eight-bit illustration.

## Chipset / PCH (chipset)

- **Layer:** board | **Class:** Protocol and device controller
- **Type:** Platform control and registers
- **Example:** `Example MMIO byte: 0x01`
- **Behavior:** A platform controller hub coordinates selected I/O, storage, USB and lower-speed platform interfaces. Firmware and drivers access control/status registers through platform-defined mechanisms.
- **Actual signals:** PCIe, SPI flash, USB, SATA (when available), sidebands and management/control registers.
- **System route:** CPU ↔ chipset link ↔ USB / storage / firmware
- **Qualification:** Which controllers live in the chipset versus CPU varies widely by system.

## PCI Express x16 slot (pcie-x16)

- **Layer:** board | **Class:** Passive high-speed interconnect
- **Type:** High-speed serial packets
- **Example:** `Illustrative payload: DE AD BE EF`
- **Behavior:** The PCIe slot carries packets through differential serial lanes. Endpoint controllers parse transaction-layer packets; there is no instruction stream belonging to the slot itself.
- **Actual signals:** PCIe TLP/DLLP, link training, scrambling/encoding and lane-level electrical symbols.
- **System route:** CPU / chipset PCIe root port ↔ motherboard slot ↔ GPU / accelerator
- **Qualification:** The sample bytes represent arbitrary payload, not a valid complete PCIe packet.

## PCI Express x1 slot (pcie-x1)

- **Layer:** board | **Class:** Passive high-speed interconnect
- **Type:** High-speed serial packets
- **Example:** `Illustrative data: 10101100`
- **Behavior:** A smaller PCIe link uses the same layered packet architecture with fewer lanes. Device configuration and register transactions are interpreted by controllers.
- **Actual signals:** PCIe differential pairs, clock/reference timing and sidebands.
- **System route:** Root complex ↔ PCIe x1 slot ↔ NIC / sound / I/O card
- **Qualification:** Link width and speed negotiate with the device; binary data is not a CPU opcode.

## M.2 NVMe connector (m2)

- **Layer:** board | **Class:** Passive high-speed interconnect
- **Type:** PCIe / NVMe storage
- **Example:** `NVMe READ opcode: 0x02`
- **Behavior:** An M.2 connector may carry NVMe over PCIe. An NVMe controller processes commands using memory-resident submission/completion queues.
- **Actual signals:** PCIe transport plus NVMe command structures when the device and slot support it.
- **System route:** CPU/chipset → PCIe lanes → M.2 SSD controller → NAND flash
- **Qualification:** M.2 describes a physical form factor; some slots support SATA or other interfaces instead of NVMe.

## Second M.2 slot (m2-secondary)

- **Layer:** board | **Class:** Passive high-speed interconnect
- **Type:** Connector / interface dependent
- **Example:** `NVMe WRITE opcode: 0x01`
- **Behavior:** A second M.2 connector can carry PCIe/NVMe or other supported signals. Queue commands belong to the SSD controller, not to the connector.
- **Actual signals:** PCIe lanes, clock/reset signals, 3.3 V power; capability depends on board configuration.
- **System route:** CPU/chipset → secondary M.2 slot → SSD controller
- **Qualification:** Lanes may be shared with SATA/PCIe ports depending on the motherboard.

## SATA storage ports (sata)

- **Layer:** board | **Class:** Passive high-speed interconnect
- **Type:** Serialized storage protocol
- **Example:** `Register FIS type byte: 0x27`
- **Behavior:** SATA ports transmit serialized frames to SATA devices. Host controllers format protocol structures that carry commands and data.
- **Actual signals:** SATA physical signaling, FIS, link primitives and frame integrity mechanisms.
- **System route:** CPU/chipset SATA controller ↔ SATA cable ↔ SSD/HDD
- **Qualification:** 0x27 identifies a host-to-device Register FIS type; one byte is not a complete frame.

## 24-pin ATX power connector (atx24)

- **Layer:** board | **Class:** Passive power connector
- **Type:** Power and sideband status
- **Example:** `PS_ON# asserted: logic low`
- **Behavior:** The 24-pin ATX connector primarily brings supply rails and ground to the motherboard. Selected pins carry control/status logic, including power-supply enable and power-good.
- **Actual signals:** 3.3 V, 5 V, 12 V and standby rails, PWR_OK and PS_ON# signaling.
- **System route:** PSU ↔ ATX connector ↔ board regulators and loads
- **Qualification:** ATX power signals should not be described as general bidirectional byte streams.

## UEFI firmware flash (bios)

- **Layer:** board | **Class:** Nonvolatile byte storage and command interface
- **Type:** Serial flash / firmware bytes
- **Example:** `SPI READ: 03 00 10 00 (example)`
- **Behavior:** A SPI NOR flash chip stores UEFI firmware bytes. During boot, the platform fetches firmware data; the flash chip accepts commands but does not itself execute x86/ARM firmware instructions.
- **Actual signals:** SPI clock/chip-select/data pins or other supported flash topology; command, address and data phases.
- **System route:** CPU/SoC firmware path ↔ SPI controller ↔ flash memory
- **Qualification:** 03h is a common SPI NOR READ opcode with a 24-bit address; actual parts may require different modes/address widths.

## RTC / CMOS battery (cmos)

- **Layer:** board | **Class:** Battery-backed timekeeping
- **Type:** RTC state / battery-backed power
- **Example:** `RTC seconds BCD: 0x25 = 25`
- **Behavior:** An RTC keeps time and may expose registers, sometimes using BCD encodings. The CMOS coin cell supplies standby energy, not binary data.
- **Actual signals:** Low-speed RTC/register access through platform logic; battery-backed timekeeping.
- **System route:** Battery → RTC power domain; CPU ↔ chipset / RTC registers
- **Qualification:** The specific RTC register map varies; CMOS battery is not a programmable chip.

## Rear I/O stack (rear-io)

- **Layer:** board | **Class:** Passive mixed-protocol connectors
- **Type:** Multiple I/O protocols
- **Example:** `USB keyboard report: 00 00 04 00 00 00 00 00`
- **Behavior:** Rear I/O ports expose different controller protocols, such as USB, Ethernet and audio. Their connectors do not share a single encoding.
- **Actual signals:** USB packetized transfers, Ethernet frames, audio samples and display links depending on port.
- **System route:** External peripheral ↔ I/O connector ↔ controller ↔ CPU/memory
- **Qualification:** The example is a typical boot-protocol USB keyboard report, not generic encoding for all ports.

## Audio codec and capacitors (audio)

- **Layer:** board | **Class:** Sample conversion and control registers
- **Type:** Digital samples + analog conversion
- **Example:** `16-bit PCM sample: 0000000000000000`
- **Behavior:** An audio codec receives and emits digital audio samples, then converts them into analog voltage waveforms; it can also convert analog input into digital samples.
- **Actual signals:** HD Audio, I²S/TDM or other digital audio links, register controls and analog outputs.
- **System route:** Application → OS audio stack → controller → codec → speaker
- **Qualification:** Sample resolution, format, endianness and transport differ across devices.

## Ethernet controller (ethernet)

- **Layer:** board | **Class:** Packet controller and PHY
- **Type:** Network framing and line coding
- **Example:** `EtherType IPv4: 08 00`
- **Behavior:** The Ethernet controller formats link-layer frames with MAC addresses, payload type, data and error checks. A PHY converts framed information into link-specific electrical symbols.
- **Actual signals:** Ethernet MAC frames, preambles and FCS; PHY modulation/line coding depend on Ethernet speed.
- **System route:** CPU/memory ↔ NIC ↔ PHY ↔ twisted pair / fiber
- **Qualification:** 08 00 is a header field value, not a complete Ethernet packet or wire waveform.

## Front USB header (usb-header)

- **Layer:** board | **Class:** Passive protocol connector
- **Type:** USB packetized interface
- **Example:** `HID usage ID for A: 0x04`
- **Behavior:** Internal USB headers link front ports to the host controller. A USB keyboard may encode a physical key as a HID usage ID inside a report.
- **Actual signals:** USB transfer framing, device enumeration, endpoints and payloads.
- **System route:** Front port ↔ USB header ↔ host controller ↔ memory ↔ application
- **Qualification:** The HID usage value is part of a report, not the raw USB wire code.

## Front-panel header (fpanel)

- **Layer:** board | **Class:** Simple digital I/O
- **Type:** GPIO / switch logic
- **Example:** `Power switch: released 1 → pressed 0 (typical)`
- **Behavior:** Front-panel power and reset buttons generally drive simple logic-level signals. Status LEDs are driven through board-level current-limited circuits.
- **Actual signals:** GPIO-like switch sensing and LED drive; not a general serial code stream.
- **System route:** Case switch / LED ↔ front-panel header ↔ platform control
- **Qualification:** Polarity and pull-up arrangement vary by motherboard.

## Fan / pump header (fan)

- **Layer:** board | **Class:** Motor control and tachometer signaling
- **Type:** PWM control + tachometer
- **Example:** `PWM high/low control: 1/0`
- **Behavior:** A fan header may supply a PWM control signal and receive tachometer pulses. These transitions control or report fan rotation, not CPU instruction bytes.
- **Actual signals:** PWM duty cycle, tachometer pulse frequency, 12 V and ground.
- **System route:** Board fan controller ↔ fan / pump motor
- **Qualification:** PWM frequency, pinout and electrical levels must follow supported fan specification.

## Chipset heatsink (heatsink)

- **Layer:** board | **Class:** Passive thermal management
- **Type:** Thermal / passive
- **Example:** `No executable bits`
- **Behavior:** A heatsink moves heat from chips through conduction and airflow. It is a passive thermal structure, not a binary processor or data receiver.
- **Actual signals:** Thermal energy, thermal resistance and airflow; no data bus inside the heatsink.
- **System route:** Chip package → thermal material → heatsink → air
- **Qualification:** Nearby thermal sensors are separate electronic devices.

## Multilayer PCB stack-up (pcb)

- **Layer:** board | **Class:** Passive routed substrate
- **Type:** Multilayer physical routing
- **Example:** `Differential pair ≠ a byte by itself`
- **Behavior:** The PCB routes power and electrical signals between components. Copper tracks and planes are passive physical pathways; each routed signal is interpreted by its connected controller.
- **Actual signals:** Controlled-impedance traces, return paths, ground/power planes and vias.
- **System route:** CPU ↔ DIMM / PCIe / flash / chipset via board copper
- **Qualification:** Logical bits are abstractions; high-speed channels use equalization, analog waveforms and coding.

## Reference clock generator (clock)

- **Layer:** board | **Class:** Clock generation and synchronization
- **Type:** Periodic timing reference
- **Example:** `Clock transition: 0 → 1 → 0`
- **Behavior:** A reference clock generator supplies oscillating timing signals used for synchronous hardware. The waveform does not normally encode application data.
- **Actual signals:** Differential and single-ended clock output signals, jitter and phase.
- **System route:** Clock generator → clock buffers / controllers / device PHYs
- **Qualification:** A clock is a timing reference; not every transition represents a payload bit.

## POST diagnostic display (debug)

- **Layer:** board | **Class:** Debug/status reporting
- **Type:** Diagnostic status display
- **Example:** `POST code example: 0xA2 (vendor-dependent)`
- **Behavior:** A debug display may show hexadecimal checkpoint codes emitted during platform initialization. Those codes are diagnostic values, not generic motherboard instructions.
- **Actual signals:** Diagnostic I/O writes, embedded controllers, segment display drivers.
- **System route:** Firmware checkpoint → platform registers → debug display
- **Qualification:** POST code meanings are firmware-vendor and board-specific; 0xA2 is an example, not universal.

## Wireless interface module (wifi)

- **Layer:** board | **Class:** Wireless controller, firmware and PHY
- **Type:** Radio frames / modulation
- **Example:** `Wi-Fi data byte: 0x41 (payload example)`
- **Behavior:** A Wi-Fi chipset constructs and decodes 802.11 frames, applies link security and modulates information onto radio carriers.
- **Actual signals:** 802.11 MAC frames, encryption and PHY symbols, OFDM/modulation.
- **System route:** CPU ↔ PCIe/USB/SDIO Wi-Fi interface ↔ radio ↔ antenna
- **Qualification:** The same payload bytes map to different over-the-air waveforms across modulation modes.

## Power capacitors (capacitors)

- **Layer:** board | **Class:** Passive electrical storage/filtering
- **Type:** Analog power conditioning
- **Example:** `No executable bits`
- **Behavior:** Decoupling capacitors store electric charge and smooth supply transients near chips. They do not store application bits in the same manner as DRAM cells.
- **Actual signals:** Analog voltage/current over time.
- **System route:** Regulator rails ↔ decoupling capacitors ↔ chip supply pins
- **Qualification:** Some memory cells use capacitance to store bits; discrete board capacitors normally serve power filtering.

## CPU processing cores (cpu-cores)

- **Layer:** chip | **Class:** ISA machine-instruction execution
- **Type:** Machine ISA and micro-ops
- **Example:** `x86 example: B8 2A 00 00 00 = MOV EAX,42`
- **Behavior:** A CPU core fetches machine-code bytes, decodes instructions and executes them using registers, execution units and control logic. Implementations may internally transform instructions into micro-operations.
- **Actual signals:** Instruction fetch, caches, registers, arithmetic and branch/control networks.
- **System route:** System memory/cache → core fetch/decode → ALU → writeback
- **Qualification:** Example is x86/64 encoding; other ISAs have different instruction formats.

## Integrated GPU / accelerator (gpu-cores)

- **Layer:** chip | **Class:** Graphics-specific machine-instruction execution
- **Type:** Graphics/compute instruction streams
- **Example:** `Example pixel channel: 0xFF = 255`
- **Behavior:** GPU execution engines process compiled shader or compute instructions. Pixel bytes and shader instructions are distinct kinds of binary information.
- **Actual signals:** SIMD/SIMT execution, shader instructions, texture/VRAM/cache traffic.
- **System route:** Browser renderer → graphics API → driver → GPU → display
- **Qualification:** GPU instruction encodings are architecture-specific and often proprietary.

## Last-level cache (l3)

- **Layer:** chip | **Class:** Cache bit storage
- **Type:** Cache bit cells + metadata
- **Example:** `Cache data example: 0x41 = 01000001`
- **Behavior:** Last-level cache stores copies of memory data along with tags, valid/dirty state and coherence-related metadata. SRAM circuitry holds the bits; cache itself does not interpret them as a program.
- **Actual signals:** Cache-line payloads, tags, directory/coherence signals, internal fabric traffic.
- **System route:** CPU cores ↔ cache ↔ memory controller / fabric
- **Qualification:** Actual line sizes, cache policies and ECC schemes vary.

## Memory controller (memory-controller)

- **Layer:** chip | **Class:** Memory protocol controller
- **Type:** DRAM protocol sequencing
- **Example:** `READ command (conceptual, not literal bits)`
- **Behavior:** The integrated memory controller schedules DRAM commands, trains timing and handles responses to memory requests. It mediates processor data/address requests into DRAM-specific signaling.
- **Actual signals:** DDR command/address, DQ/DQS, banks/rows/columns and refresh.
- **System route:** Core/cache ↔ memory controller ↔ motherboard DIMM routing
- **Qualification:** No single bit string represents READ across all DDR generations and modes.

## On-die interconnect fabric (fabric)

- **Layer:** chip | **Class:** On-die high-speed interconnect
- **Type:** Internal coherent interconnect
- **Example:** `Payload byte 10100101 (illustrative)`
- **Behavior:** An on-chip interconnect transports requests, responses and data among execution cores, caches, controllers and accelerators. Encodings are implementation-defined.
- **Actual signals:** Addressed transactions, arbitration, flow control and optionally cache coherence.
- **System route:** CPU cores ↔ cache ↔ memory controller / PHY / GPU
- **Qualification:** Fabric packet formats are product-specific, not equivalent to PCIe TLPs.

## PCIe / high-speed PHY (pcie-phy)

- **Layer:** chip | **Class:** Physical signaling and PCIe link controller
- **Type:** SerDes / encoded symbols
- **Example:** `Data payload 11001010 (illustrative)`
- **Behavior:** A high-speed PHY maps coded bit/symbol streams onto differential analog waveforms and reconstructs them at the receiver.
- **Actual signals:** Serial/deserializer, clock recovery, equalization, lane alignment and link training.
- **System route:** PCIe protocol engine ↔ PHY ↔ package pads ↔ motherboard copper
- **Qualification:** High-speed PHY voltage levels and waveforms are not rectangular TTL pulses.

## Silicon power distribution (power-grid)

- **Layer:** chip | **Class:** Passive on-die power delivery
- **Type:** Power distribution network
- **Example:** `Power = voltage/current, not binary source code`
- **Behavior:** Metal planes and meshes distribute supply/ground over the die. Timing and logic correctness depend on stable voltage under changing current.
- **Actual signals:** Analog voltage, return current, resistance/inductance and transient noise.
- **System route:** VRM → socket/package contacts → on-die power grid → logic
- **Qualification:** A power grid is not an address or instruction bus.

## Clock distribution network (clock-grid)

- **Layer:** chip | **Class:** Clock distribution
- **Type:** Clock tree / timing
- **Example:** `Clock edges: ↑ ↓ ↑ ↓`
- **Behavior:** The clock distribution network delivers timing edges to synchronous logic. Clock-gating cells may disable local clock activity to reduce power.
- **Actual signals:** Clock phase, skew, jitter and gating control.
- **System route:** Clock source / PLL → clock buffers → flip-flops
- **Qualification:** Clock-domain crossings require synchronizers or other safe mechanisms.

## Silicon substrate (silicon)

- **Layer:** chip | **Class:** Semiconductor substrate
- **Type:** Semiconductor substrate
- **Example:** `Doped junction control underlies 0/1`
- **Behavior:** Semiconductor processing creates transistor structures whose voltage-controlled conduction implements switching behavior. The bare substrate contains no human-readable program.
- **Actual signals:** Charge carriers, electric fields, doped regions and device isolation.
- **System route:** CMOS transistors → logic gates → circuits → chips
- **Qualification:** Binary is a logic abstraction implemented through analog semiconductor physics.

## Metal interconnect layers (interconnect)

- **Layer:** chip | **Class:** Passive on-die signaling
- **Type:** On-die signal wiring
- **Example:** `Wire voltage interpreted as logic 0/1`
- **Behavior:** Patterned metal layers connect transistor devices into gates and functional blocks. Signal integrity, parasitics and buffering affect reliable logic timing.
- **Actual signals:** On-die nets, vias, buffers, interconnect capacitance and resistance.
- **System route:** Logic cell output → metal net → next cell input
- **Qualification:** A copper segment does not intrinsically identify whether it carries data, clock, power or control.

## CMOS transistor devices (transistor)

- **Layer:** chip | **Class:** Switching primitive
- **Type:** Logic primitives
- **Example:** `CMOS inverter: IN 0 → OUT 1`
- **Behavior:** Complementary MOSFET devices switch to form logic gates. Large combinations produce adders, registers, decoders and controllers.
- **Actual signals:** Voltage-driven transistors, logic gates, flip-flops and state machines.
- **System route:** MOSFETs → NAND/NOR/NOT → registers / ALU → CPU
- **Qualification:** Real transistors operate continuously in voltage/current, not as perfect mathematical switches.

## Organic package substrate (package)

- **Layer:** chip | **Class:** Passive electrical fanout
- **Type:** Substrate / physical fanout
- **Example:** `Signals through bump → package trace → pad`
- **Behavior:** A package connects fine-pitch silicon die contacts to larger board socket/land contacts and spreads power, high-speed data and heat.
- **Actual signals:** Package transmission lines, power/ground, high-speed interfaces and sidebands.
- **System route:** Die bumps ↔ package traces ↔ socket ↔ motherboard PCB
- **Qualification:** The package is not a separately executing instruction engine.

## Solder bumps / balls (bumps)

- **Layer:** chip | **Class:** Passive electrical contacts
- **Type:** Electrical contact array
- **Example:** `Data-contact state depends on attached circuit`
- **Behavior:** Solder bumps and balls carry power, ground and signal currents across device/package boundaries. The bumps are passive conductors.
- **Actual signals:** Electronic contact between die and package or BGA and PCB.
- **System route:** Silicon pad → solder bump → package / board pad
- **Qualification:** Physical contact resistance, electromigration and mechanical fatigue matter.

## Integrated heat spreader (heatspreader)

- **Layer:** chip | **Class:** Passive thermal management
- **Type:** Thermal / passive
- **Example:** `No code: heat transport only`
- **Behavior:** The heat spreader conducts thermal energy away from chip dies toward the cooler.
- **Actual signals:** Heat flux and thermal interface contact, not a bit protocol.
- **System route:** Die → thermal interface → metal heat spreader → cooler
- **Qualification:** A heat spreader does not itself decode bits or instructions.

