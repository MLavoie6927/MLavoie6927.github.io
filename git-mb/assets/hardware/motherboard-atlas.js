/* ===========================================================================
   Motherboard & Silicon Atlas — standalone, dependency-free tab controller.
   Namespaced under #hardware-atlas. Embed into an existing website.
   Data below describe illustrative architecture, not a vendor-specific board.
   =========================================================================== */
(function () {
  'use strict';

  const board = [
    {
      id:'cpu-socket', name:'CPU socket', label:'CPU SOCKET', group:'Compute', x:270,y:156,w:210,h:205, shape:'socket', icon:'◈',
      summary:'Mechanical and electrical interface between the processor package and the motherboard. Pinout, socket geometry, retention hardware, and supported CPUs are platform-specific.',
      materials:'Glass-fiber-reinforced polymer housing, copper-alloy spring contacts with nickel and gold plating, steel load plate and retention lever.',
      manufacture:'Precision injection molding, contact stamping and plating, automated insertion, solder assembly, coplanarity inspection, and socket retention testing.',
      signals:'Connects power/ground contacts to the voltage regulators and routes memory channels, PCIe lanes, clocks, and control signals to the CPU.',
      failure:'Bent LGA contacts, socket contamination, uneven cooler mounting pressure, power-pin damage, or BIOS incompatibility.',
      inspect:'Inspect contact geometry under magnification without touching pins; verify CPU support, mounting torque, power rails, and thermal installation.',
      history:'Early systems commonly soldered processors or used DIP/sockets; contemporary desktop sockets support high pin counts and replaceable packages.'
    },
    {
      id:'vrm',name:'Voltage regulator module',label:'CPU VRM',group:'Power',x:124,y:166,w:112,h:147,shape:'power',icon:'⚡',
      summary:'Converts supply power into lower, tightly regulated voltages for the CPU. Multiple switching phases distribute current and reduce ripple.',
      materials:'Silicon power MOSFETs or integrated power stages, ferrite inductors, copper planes, ceramic/polymer capacitors, thermal pads and aluminum heatsinks.',
      manufacture:'Surface-mount placement and reflow; electrical test of power stages, thermal imaging, load transient testing and phase-current balancing.',
      signals:'Receives power from EPS connectors, follows regulator control/telemetry, and supplies the CPU through heavy copper planes.',
      failure:'Overheating, failed power stages, bad capacitors, cracked solder joints, or unstable voltage during rapid load changes.',
      inspect:'Check for discoloration and damaged components when powered off; on a qualified bench, measure ripple and transient behavior with proper instrumentation.',
      history:'Processors required increasingly sophisticated multiphase voltage regulation as power density and load dynamics increased.'
    },
    {
      id:'eps',name:'CPU EPS power connector',label:'EPS 8-PIN',group:'Power',x:127,y:54,w:111,h:55,shape:'connector',icon:'↯',
      summary:'Delivers 12 V from the power supply to the processor power-conversion circuitry; motherboard and PSU connectors must match.',
      materials:'Copper-alloy contacts, plated terminals, flame-rated polymer housing, insulated copper wire in the mating cable.',
      manufacture:'Terminal stamping and plating, housing molding, crimped harness contacts, insertion-force and temperature-rise qualification.',
      signals:'Bulk 12 V input is converted into multiple lower CPU supply rails by the VRM.',
      failure:'Incorrect connector use, loose engagement, overheating contacts, or insufficient PSU capacity.',
      inspect:'Unplug the computer before inspection; check latch seating and connector condition. Never substitute a PCIe plug for EPS power.',
      history:'Dedicated CPU power connectors became common as motherboard power demands increased.'
    },
    {
      id:'dimm',name:'DDR memory slots',label:'DIMM SLOTS',group:'Memory',x:538,y:123,w:114,h:244,shape:'dimm',icon:'▥',
      summary:'Holds removable DRAM modules and routes memory channels between the CPU memory controller and memory devices.',
      materials:'High-temperature polymer connector body, copper-alloy spring contacts, thin gold plating, fiberglass-epoxy circuit board for the DIMM module.',
      manufacture:'Fine-pitch connector molding, contact forming and plating, SMT or through-hole assembly, channel validation and memory training.',
      signals:'High-speed data, strobes, commands, address lines, clocks, and power must meet tight timing and signal-integrity limits.',
      failure:'Unseated modules, mismatched memory configuration, contaminated contacts, signal-integrity faults, or training failures.',
      inspect:'Verify compatibility, correct slot population, fully latched modules and supported speed/timings according to the board manual.',
      history:'Replaceable DRAM evolved from SIMMs to multiple DIMM generations with increasingly complex signaling and power management.'
    },
    {
      id:'chipset',name:'Chipset / PCH',label:'CHIPSET',group:'Platform',x:778,y:425,w:121,h:108,shape:'chip',icon:'▣',
      summary:'Platform controller circuitry coordinating selected I/O, storage, USB and management features; division of work between CPU and chipset varies by architecture.',
      materials:'Silicon die, organic or ceramic package substrate, solder balls, epoxy underfill or encapsulation, often a passive heatsink.',
      manufacture:'Semiconductor wafer fabrication, die packaging, board-level BGA attachment, functional tests and platform validation.',
      signals:'Connects the processor over a platform interconnect and fans out supported low- and medium-speed I/O interfaces.',
      failure:'Thermal or electrical faults, damaged BGA interconnects, or malfunctioning platform firmware.',
      inspect:'Validate peripheral enumeration, chipset temperatures, bus logs and firmware revisions before assuming the package itself failed.',
      history:'Traditional northbridge and southbridge functions were gradually consolidated or moved into CPUs and platform controller hubs.'
    },
    {
      id:'pcie-x16',name:'PCI Express x16 slot',label:'PCIe x16',group:'Expansion',x:266,y:464,w:399,h:34,shape:'slot',icon:'⇄',
      summary:'Long expansion connector commonly used for graphics cards and accelerators. A mechanical x16 slot does not guarantee sixteen active electrical lanes.',
      materials:'Gold-plated copper-alloy contacts, engineered thermoplastic housing, copper differential-pair routing, optional steel slot reinforcement.',
      manufacture:'Connector molding and plating, board reflow or press-fit mounting, lane-loss measurement, compliance testing and mechanical retention.',
      signals:'Carries high-speed PCIe differential transmit/receive pairs, reference clocks, control signals, and limited slot power.',
      failure:'Insufficient seating, card sag, damaged retention hardware, contamination, or marginal high-speed connections.',
      inspect:'Confirm lane wiring, power cables, link width/speed and retention; remove power before reseating any add-in card.',
      history:'PCI Express replaced older parallel expansion buses with scalable point-to-point serial links.'
    },
    {
      id:'pcie-x1',name:'PCI Express x1 slot',label:'PCIe x1',group:'Expansion',x:270,y:536,w:203,h:24,shape:'slot',icon:'↔',
      summary:'Short expansion interface designed for devices needing fewer PCI Express lanes, such as capture, network, audio, and specialized cards.',
      materials:'Glass-filled thermoplastic connector, gold-plated spring contacts and copper signal traces.',
      manufacture:'Precision connector manufacturing, automated board placement, solder inspection and protocol compliance tests.',
      signals:'One lane of point-to-point PCIe communication, subject to slot electrical wiring and platform configuration.',
      failure:'Unseated cards, slot contamination, bandwidth limitation, BIOS configuration, or unsupported device drivers.',
      inspect:'Compare card and slot requirements; verify device detection and negotiated link characteristics.',
      history:'A range of PCIe link widths enabled expansion devices to match bandwidth to cost and footprint.'
    },
    {
      id:'m2',name:'M.2 NVMe connector',label:'M.2 • NVMe',group:'Storage',x:275,y:405,w:355,h:28,shape:'slot',icon:'▭',
      summary:'Compact expansion connector frequently connecting NVMe solid-state drives over PCI Express; M.2 is a form factor, not a guarantee of a particular protocol.',
      materials:'Gold-plated contacts, thermoplastic socket, copper traces, steel standoff and screw, thermal interface material for optional heatsink.',
      manufacture:'SMT mounting, connector inspection, mechanical keying, link verification, thermal testing and storage workload qualification.',
      signals:'Depending on slot configuration, may carry PCIe/NVMe or SATA signals; high-speed lanes generally terminate at CPU or chipset.',
      failure:'Wrong key or unsupported protocol, missing standoff, thermal throttling, intermittent contact or firmware configuration.',
      inspect:'Confirm key type, device length, protocol support and screw position; avoid excessive torque on storage modules.',
      history:'M.2 accelerated compact high-bandwidth SSD designs as NVMe storage became prevalent.'
    },
    {
      id:'m2-secondary',name:'Second M.2 slot',label:'M.2 SLOT 2',group:'Storage',x:287,y:601,w:354,h:27,shape:'slot',icon:'▭',
      summary:'Additional expansion position for storage or other M.2 devices. Sharing of PCIe lanes or SATA ports depends on motherboard routing.',
      materials:'Copper-alloy contacts with noble-metal plating, high-temperature connector plastic, stainless fasteners, board copper planes.',
      manufacture:'SMT assembly and inspection; board-level signal-integrity testing and mechanical-key qualification.',
      signals:'May share a finite lane budget with other storage or expansion slots; always consult the platform block diagram.',
      failure:'Slot sharing disables other ports, incorrect key, poor module seating, or excess heat.',
      inspect:'Use the board manual to verify lane sharing and supported devices; secure the module on the correct standoff.',
      history:'Multiple onboard M.2 positions became common as solid-state storage displaced mechanical drives.'
    },
    {
      id:'sata',name:'SATA storage ports',label:'SATA',group:'Storage',x:936,y:430,w:73,h:86,shape:'connector',icon:'▰',
      summary:'Serial ATA connectors link compatible drives to a storage controller; unlike PCIe NVMe, SATA uses its own interface and protocol stack.',
      materials:'Copper-alloy plated contacts, L-keyed polymer housing, copper differential routing, shielded or controlled-impedance cables.',
      manufacture:'Connector molding, solder assembly and electrical interface validation; SATA cable retention testing.',
      signals:'Dedicated serial transmit and receive connections between storage controller and drive.',
      failure:'Loose cable, damaged L-key, failing disk, or storage controller configuration issues.',
      inspect:'Check power and data cables separately and consult S.M.A.R.T. drive health data for supported drives.',
      history:'SATA progressively replaced parallel ATA ribbon cabling in mainstream personal computers.'
    },
    {
      id:'atx24',name:'24-pin ATX power connector',label:'ATX 24',group:'Power',x:714,y:154,w:43,h:208,shape:'connector',icon:'↯',
      summary:'Main motherboard power input distributing regulated PSU rails and power-control signals.',
      materials:'Tin-plated copper-alloy terminals, molded flame-retardant polymer housing and copper harness conductors.',
      manufacture:'Terminal stamping/crimping, insulation verification, insertion force and temperature-rise tests.',
      signals:'Distributes primary input rails and coordination signals used for system startup and power-good sequencing.',
      failure:'Partial insertion, overheating contact, damage to PSU harness, shorts, or incorrect modular cable usage.',
      inspect:'Power off and unplug first; inspect for fully engaged latch and damaged pins. PSU-side modular pinouts are not universally interchangeable.',
      history:'ATX standardized motherboard power arrangements and encouraged broader compatibility among PC components.'
    },
    {
      id:'bios',name:'UEFI firmware flash',label:'UEFI SPI',group:'Firmware',x:769,y:562,w:114,h:40,shape:'chip',icon:'✦',
      summary:'Nonvolatile flash device storing firmware used to initialize hardware, discover devices and transfer execution to boot software.',
      materials:'Silicon nonvolatile memory cells, epoxy or plastic package, copper leadframe and solder contacts.',
      manufacture:'Wafer processing and packaging, in-circuit programming, firmware signing and update-validation testing.',
      signals:'Often communicates over SPI to a processor or platform controller; its image includes firmware code and platform metadata.',
      failure:'Interrupted flash update, corrupt firmware image, hardware compatibility errors or insecure firmware configuration.',
      inspect:'Use vendor-verified images and recovery methods; verify firmware provenance, update signature and board-specific version.',
      history:'Modern UEFI firmware replaced many legacy BIOS interfaces while remaining commonly called “BIOS” by users.'
    },
    {
      id:'cmos',name:'RTC / CMOS battery',label:'RTC',group:'Firmware',x:909,y:540,w:69,h:68,shape:'round',icon:'◉',
      summary:'Coin-cell power source typically maintains a real-time clock and selected low-power circuitry while the system is unplugged. Firmware settings may be stored in nonvolatile memory.',
      materials:'Lithium primary cell chemistry, stainless steel can, nickel-plated contacts and insulating polymer holder.',
      manufacture:'Coin-cell assembly and sealed packaging; motherboard holder stamping, solder mounting and power-leakage tests.',
      signals:'Supplies low-current backup power to the clock domain rather than powering the main processor.',
      failure:'Depleted battery, intermittent holder contacts, system clock resets or RTC errors.',
      inspect:'Check the manual for replacement method and polarity. Never charge a primary coin cell or short its terminals.',
      history:'Battery-backed CMOS memory was common in earlier PCs; modern platforms often retain the battery mainly for RTC functionality.'
    },
    {
      id:'rear-io',name:'Rear I/O stack',label:'REAR I/O',group:'I/O',x:37,y:139,w:61,h:249,shape:'io',icon:'⇆',
      summary:'External connectors for USB, display, networking, audio and other platform interfaces. Exact assortment depends on the board.',
      materials:'Copper-alloy plated contacts, steel connector shells, molded insulation, EMI gaskets and sometimes optical components.',
      manufacture:'Stamped shells, molded insulators, automated placement, reflow or wave soldering and connector insertion-cycle testing.',
      signals:'Carries assorted high- and low-speed digital or analog signals outside the chassis.',
      failure:'Broken mechanical tongues, damaged solder anchors, bent shells or electrostatic discharge damage.',
      inspect:'Identify the correct port and cable before mating; avoid using force and inspect suspect ports with the device unpowered.',
      history:'Rear I/O evolved from serial/parallel and PS/2 ports toward USB, modern display standards and integrated networking.'
    },
    {
      id:'audio',name:'Audio codec and capacitors',label:'AUDIO',group:'I/O',x:84,y:566,w:155,h:62,shape:'chip',icon:'♫',
      summary:'Converts digital audio to and from analog signals and interfaces with jacks, amplifiers and front-panel audio connections.',
      materials:'Silicon mixed-signal IC, PCB copper, ceramic or polymer capacitors, small resistors and shielding/ground structures.',
      manufacture:'CMOS mixed-signal chip fabrication and SMT assembly; acoustic distortion and electromagnetic interference testing.',
      signals:'Digital audio links reach the codec; sensitive analog paths are routed with attention to noise, grounding and isolation.',
      failure:'Noisy audio due to interference, damaged ports, incorrect jack detection or codec driver faults.',
      inspect:'Isolate software, cables and peripherals; inspect analog routing, jack detection and audio-device enumeration.',
      history:'PC sound moved from dedicated add-in cards to broadly integrated motherboard codecs.'
    },
    {
      id:'ethernet',name:'Ethernet controller',label:'ETHERNET',group:'I/O',x:94,y:438,w:132,h:67,shape:'chip',icon:'⇶',
      summary:'Network interface controller implements Ethernet link functions and interfaces with magnetics and an external cable or PHY.',
      materials:'Silicon controller or PHY, copper traces, ferrite-containing magnetics, plated connector contacts and shielded connector shell.',
      manufacture:'Chip packaging, SMT placement, impedance control and link compliance/EMC testing.',
      signals:'High-speed serial data crosses a PCIe or other internal link; twisted-pair network signals pass through isolation magnetics.',
      failure:'Link flapping, damaged magnetics, driver faults, ESD damage, cabling or switch negotiation problems.',
      inspect:'Check link lights, logs, negotiated speed, cable quality and PHY health before replacing components.',
      history:'Motherboards increasingly integrated Ethernet networking rather than requiring separate expansion cards.'
    },
    {
      id:'usb-header',name:'Front USB header',label:'USB HDR',group:'I/O',x:902,y:295,w:116,h:47,shape:'connector',icon:'⊞',
      summary:'Internal connector for case-mounted USB ports. Pin assignments and bandwidth depend on header type.',
      materials:'Copper-alloy header pins, insulating polymer shroud, copper signal routing and protective ESD components.',
      manufacture:'Connector molding, pin insertion, solder assembly and interface signal-integrity testing.',
      signals:'Routes USB data, power and control between chipset or controller and front-panel receptacles.',
      failure:'Misaligned connector, crushed pins, damaged cable, ESD faults or unsupported case header.',
      inspect:'Match the case cable to the keyed motherboard header; never force connectors or bridge pins.',
      history:'Internal USB headers expanded as cases moved from legacy external ports to easily accessible front I/O.'
    },
    {
      id:'fpanel',name:'Front-panel header',label:'PWR / LED',group:'I/O',x:874,y:618,w:133,h:28,shape:'connector',icon:'▤',
      summary:'Small header for the chassis power switch, reset switch and status LEDs. Pin positions are board-specific.',
      materials:'Plated copper-alloy pins, polymer shroud or pin strip, copper routing and small discrete components.',
      manufacture:'Simple pin-header placement and soldering, continuity inspection and power-button behavior validation.',
      signals:'Low-voltage logic signals convey button state and LED status to motherboard control logic.',
      failure:'Incorrect case wiring, missing power-button connection, loose leads, or LED polarity errors.',
      inspect:'Use the printed board legend and manufacturer pinout—not assumed wire colors—to connect each case lead.',
      history:'Standardized cases still use varied front-panel header layouts, making the board manual essential.'
    },
    {
      id:'fan',name:'Fan / pump header',label:'FAN PWM',group:'I/O',x:769,y:67,w:111,h:36,shape:'connector',icon:'✺',
      summary:'Provides controlled power and feedback for a system fan or compatible cooling pump.',
      materials:'Copper-alloy contacts, polymer header body, power MOSFETs and monitoring circuitry elsewhere on the board.',
      manufacture:'SMT or through-hole header assembly and fan-control verification across supported speed ranges.',
      signals:'Depending on header type: ground, supply, tachometer feedback and PWM control.',
      failure:'Overloaded header, incompatible high-current pump, wiring errors or stopped fan.',
      inspect:'Check header current rating and control mode; confirm RPM telemetry and safe cooling behavior.',
      history:'Motherboards advanced from fixed-speed fans toward firmware-managed thermal and acoustic control.'
    },
    {
      id:'heatsink',name:'Chipset heatsink',label:'HEATSINK',group:'Platform',x:779,y:349,w:121,h:54,shape:'sink',icon:'▥',
      summary:'Thermally conductive structure that spreads and dissipates heat from a controller or other package beneath it.',
      materials:'Aluminum, sometimes copper, thermal interface pads or paste, anodized surface treatment and steel retention.',
      manufacture:'Extrusion, die casting, stamping or machining; surface finishing and attachment/thermal resistance testing.',
      signals:'Transfers heat by conduction to fins or surface area, then to moving or natural-convection air.',
      failure:'Degraded thermal pad, loose mounting, blocked airflow, or insufficient contact pressure.',
      inspect:'Check attachment and temperatures; replacing thermal materials requires product-specific thickness and compression.',
      history:'Higher integration increased the need to control thermal resistance in compact motherboard controllers.'
    },
    {
      id:'pcb',name:'Multilayer PCB stack-up',label:'PCB LAYERS',group:'Platform',x:250,y:64,w:242,h:51,shape:'trace',icon:'☷',
      summary:'The motherboard itself is a multilayer printed circuit board carrying signal traces, copper power planes, ground references and plated vias.',
      materials:'FR-4 glass-fiber/epoxy laminates, copper foil, solder mask, surface-finish metals, prepreg bonding layers and solder.',
      manufacture:'Laminate imaging, etching, multilayer layup/lamination, drilling, via plating, solder-mask application, routing and electrical test.',
      signals:'Controlled-impedance differential pairs, power distribution, return-current paths and crosstalk control rely on carefully designed layer stacks.',
      failure:'Via-barrel cracks, delamination, corrosion, shorted copper, trace damage or manufacturing defects.',
      inspect:'Assess visible damage, board warpage and connector solder joints; internal layer defects require specialist electrical or imaging methods.',
      history:'Multilayer PCB technology made dense, high-speed computer platforms economical and manufacturable.'
    },
    {
      id:'clock',name:'Reference clock generator',label:'CLOCK',group:'Platform',x:685,y:395,w:68,h:44,shape:'chip',icon:'⏱',
      summary:'Clock generation and distribution circuitry provides precise timing references to selected devices and communication links.',
      materials:'Quartz resonator or MEMS timing component, silicon oscillator/clock IC, ceramic capacitors and PCB copper.',
      manufacture:'Quartz or MEMS fabrication, IC packaging, SMT assembly and frequency/jitter qualification.',
      signals:'Clock outputs establish timing references for system devices; high-speed buses have strict jitter requirements.',
      failure:'Clock instability, loss of reference, oscillator power faults or layout-related noise.',
      inspect:'Use correct high-bandwidth probing and manufacturer test procedures; poor probing can disturb high-speed clocks.',
      history:'Complex platforms developed dedicated low-jitter clock trees to support faster buses and tighter timing margins.'
    },
    {
      id:'debug',name:'POST diagnostic display',label:'POST',group:'Firmware',x:907,y:74,w:93,h:65,shape:'chip',icon:'88',
      summary:'Optional onboard display or indicator lights report firmware power-on self-test progress and selected board fault codes.',
      materials:'LED segments, plastic package, silicon driver circuitry, ceramic capacitors and PCB copper.',
      manufacture:'Component soldering, optical inspection and firmware/debug-function tests.',
      signals:'Displays board-specific state codes generated during startup and hardware initialization.',
      failure:'A persistent code can indicate memory training, CPU initialization, device enumeration or firmware problems.',
      inspect:'Interpret codes using the exact board manual; the same hexadecimal code may mean different things across manufacturers.',
      history:'Diagnostic LEDs and seven-segment displays made troubleshooting more accessible outside professional debug labs.'
    },
    {
      id:'wifi',name:'Wireless interface module',label:'Wi-Fi',group:'I/O',x:102,y:516,w:129,h:38,shape:'chip',icon:'≈',
      summary:'Optional radio module or onboard circuitry adds Wi-Fi and often Bluetooth connectivity.',
      materials:'Silicon radio ICs, RF laminate, copper microstrip lines, ceramic filters, shielding cans and antenna connectors.',
      manufacture:'RF assembly, module test, radio calibration, antenna tuning and regulatory emissions certification.',
      signals:'RF paths connect radios to antennas; data/control paths connect to the platform over supported digital buses.',
      failure:'Disconnected antennas, interference, driver or firmware issues, poor antenna placement or damaged RF connectors.',
      inspect:'Check antenna connections, regulatory-approved module support and operating-system radio status.',
      history:'Integrated wireless networking transitioned from laptop-only convenience toward common desktop board functionality.'
    },
    {
      id:'capacitors',name:'Power capacitors',label:'CAP BANK',group:'Power',x:128,y:337,w:111,h:57,shape:'caps',icon:'◉',
      summary:'Energy-storage and decoupling components stabilize power rails and suppress supply noise close to fast-switching circuits.',
      materials:'Multilayer ceramic dielectrics/electrodes, conductive-polymer or aluminum electrolytic capacitors, tin/silver/copper solder.',
      manufacture:'Powder or foil processing, electrode layering, firing or winding, termination plating, SMT reflow and capacitance/ESR tests.',
      signals:'Supply current pulses circulate through nearby capacitors and planes, limiting voltage excursions.',
      failure:'Ceramic cracking, electrolyte aging, excessive ripple current or poor solder joints.',
      inspect:'Check visible damage; electrical evaluation measures capacitance, leakage and equivalent series resistance within suitable test conditions.',
      history:'Lower-voltage, high-current CPUs increased the importance of distributed high-frequency decoupling.'
    }
  ];

  const chip = [
    {
      id:'cpu-cores',name:'CPU processing cores',label:'CPU CORES',group:'Compute',x:279,y:187,w:238,h:165,shape:'chip',icon:'⚙',
      summary:'General-purpose execution engines that fetch, decode, schedule and retire machine instructions. Core count and microarchitecture differ by CPU.',
      materials:'Doped silicon transistor structures, high-k/metal-gate stacks on applicable process nodes, dielectric layers and multi-level metal wiring.',
      manufacture:'Hundreds of photolithography, deposition, etch, doping and planarization operations; wafer probe and functional binning.',
      signals:'Work with caches, execution units, branch prediction, on-die interconnect and memory hierarchy.',
      failure:'Timing-margin violations, thermal hotspots, power instability and defect-related yield loss.',
      inspect:'Pre-silicon simulation, post-silicon validation, power/thermal characterization and hardware error telemetry.',
      history:'Single-core processors gave way to multicore designs as power density limited straightforward clock-speed scaling.'
    },
    {
      id:'gpu-cores',name:'Integrated GPU / accelerator',label:'GRAPHICS',group:'Compute',x:547,y:187,w:232,h:165,shape:'chip',icon:'▨',
      summary:'Parallel compute hardware often present in system-on-chip designs; the block may be absent on CPUs without integrated graphics.',
      materials:'Silicon CMOS logic, on-die SRAM, copper interconnect and package-level thermal interfaces.',
      manufacture:'Lithography and semiconductor backend processing; graphics validation and shader/compute stress testing.',
      signals:'Shares fabric bandwidth, memory access paths and power budgets with other SoC blocks.',
      failure:'Thermal throttling, power-domain instability, driver/firmware errors or defective compute units.',
      inspect:'Validate workloads, power limits and driver diagnostics; distinguish software issues from silicon faults.',
      history:'Dedicated GPU logic became integrated into many client processors and SoCs.'
    },
    {
      id:'l3',name:'Last-level cache',label:'L3 CACHE',group:'Cache',x:279,y:397,w:238,h:65,shape:'chip',icon:'▤',
      summary:'Large on-die cache reduces average latency and off-chip memory traffic; size and sharing policy vary across architectures.',
      materials:'Dense silicon SRAM cells, interconnect dielectrics and multiple levels of copper routing.',
      manufacture:'High-density bit-cell patterning, redundancy repair, memory-array test and power/performance characterization.',
      signals:'Exchanges cache lines and coherence transactions with CPU cores, other agents and memory fabric.',
      failure:'Uncorrectable memory-array faults, parity/ECC errors or coherence-protocol defects.',
      inspect:'Characterize cache error telemetry, stress tests and coherency verification.',
      history:'Increasing on-chip cache capacity became essential as processor speed outpaced external DRAM latency.'
    },
    {
      id:'memory-controller',name:'Memory controller',label:'DRAM CTRL',group:'I/O',x:546,y:394,w:233,h:68,shape:'chip',icon:'▥',
      summary:'Schedules reads and writes to external RAM and coordinates DRAM timing, initialization and training.',
      materials:'Silicon logic transistors, PLL circuits, advanced interconnect metallization, I/O driver circuitry.',
      manufacture:'Mixed-signal and digital wafer fabrication; board-level DDR timing and signal-integrity characterization.',
      signals:'Translates fabric requests into memory-channel command, address, clock and data transactions.',
      failure:'Training failure, timing sensitivity, voltage margin loss, or incompatibility with RAM topology.',
      inspect:'Analyze memory training logs, ECC counters, timing parameters and supported DIMM configurations.',
      history:'Many desktop CPUs integrated the DRAM controller rather than relying on a separate northbridge.'
    },
    {
      id:'fabric',name:'On-die interconnect fabric',label:'INTERNAL FABRIC',group:'Fabric',x:279,y:489,w:500,h:43,shape:'trace',icon:'⇄',
      summary:'Internal communication architecture moving requests, responses and data between cores, caches, graphics and I/O.',
      materials:'Patterned metal interconnect layers, dielectric films, vias and buffers built in silicon.',
      manufacture:'Back-end-of-line metal deposition, lithography, etch/damascene processing and clock/timing analysis.',
      signals:'Transfers coherent and non-coherent transactions while managing latency, arbitration and bandwidth.',
      failure:'Congestion, protocol deadlocks, timing faults and clock-domain crossing errors.',
      inspect:'Use architecture performance counters and simulation/verification to evaluate throughput and correctness.',
      history:'As chips accumulated more functional blocks, scalable internal networks replaced simpler shared connections.'
    },
    {
      id:'pcie-phy',name:'PCIe / high-speed PHY',label:'SERDES',group:'I/O',x:811,y:189,w:118,h:164,shape:'chip',icon:'↭',
      summary:'High-speed serializer/deserializer and I/O logic bridging on-die signals to external PCIe or other differential links.',
      materials:'CMOS transistors, specialized analog circuitry, on-package routing, controlled-impedance copper interconnect.',
      manufacture:'Mixed-signal wafer processing, package routing verification and high-speed eye-diagram/jitter testing.',
      signals:'Transmits and receives encoded serial data, using equalization and clock recovery as required.',
      failure:'Signal loss, crosstalk, timing skew, inadequate equalization or connector/channel discontinuities.',
      inspect:'Run standardized link compliance tests and validate package/PCB channel characteristics.',
      history:'Multi-gigabit serial links displaced many wide parallel interfaces.'
    },
    {
      id:'power-grid',name:'Silicon power distribution',label:'PWR GRID',group:'Power',x:810,y:388,w:118,h:65,shape:'power',icon:'⚡',
      summary:'On-die and package distribution network delivers current to circuits while controlling resistance, inductance and voltage droop.',
      materials:'Copper or other metal power interconnects, via arrays, decoupling structures and package power/ground contacts.',
      manufacture:'Patterned power metallization, bump bonding and power integrity validation.',
      signals:'Distributes regulated voltages through a hierarchy of package, die and local power networks.',
      failure:'IR drop, electromigration, localized current concentration or transient supply collapse.',
      inspect:'Review power-grid extraction, dynamic droop analysis, electromigration limits and silicon telemetry.',
      history:'Power delivery became a major bottleneck in highly integrated, high-current processors.'
    },
    {
      id:'clock-grid',name:'Clock distribution network',label:'CLOCK TREE',group:'Fabric',x:810,y:479,w:118,h:48,shape:'chip',icon:'◴',
      summary:'Hierarchical network distributes precisely timed edges to synchronous circuitry with controlled skew and jitter.',
      materials:'Low-resistance interconnects, CMOS buffers, PLL/DLL blocks and dielectric insulation.',
      manufacture:'Clock-tree synthesis, routed metal optimization and silicon timing characterization.',
      signals:'Provides clock domains for sequential logic and synchronization across processing blocks.',
      failure:'Timing violations, skew, power noise or improper cross-domain synchronization.',
      inspect:'Perform static timing analysis and jitter/skew measurements within qualified test conditions.',
      history:'Complex clock trees and frequency domains grew with multicore SoCs.'
    },
    {
      id:'silicon',name:'Silicon substrate',label:'Si WAFER',group:'Process',x:112,y:188,w:117,h:54,shape:'chip',icon:'Si',
      summary:'Single-crystal silicon wafer provides the semiconductor foundation in which transistors and numerous electrical structures are made.',
      materials:'Ultra-high-purity crystalline silicon with precisely controlled dopant concentration and defect density.',
      manufacture:'Silicon purification, crystal growth, wafer slicing, edge shaping, polishing and surface cleaning.',
      signals:'Doped regions and junctions form the active devices; insulating layers separate electrical structures.',
      failure:'Crystal defects, contamination, dislocations or wafer-induced stress can reduce manufacturing yield.',
      inspect:'Surface inspection, electrical defect metrology, wafer mapping and process-control monitoring.',
      history:'Silicon displaced earlier germanium in many mainstream semiconductor applications thanks to manufacturable oxide and mature processes.'
    },
    {
      id:'interconnect',name:'Metal interconnect layers',label:'METAL',group:'Process',x:112,y:295,w:117,h:58,shape:'trace',icon:'☷',
      summary:'Stacked microscopic wiring layers and vertical vias connect transistors into functioning circuits.',
      materials:'Copper interconnect with barrier/liner systems in many process generations; low-k dielectric films and patterned contacts.',
      manufacture:'Photolithography, deposition, etch, damascene fill and chemical-mechanical planarization.',
      signals:'Carries power, clocks and logic signals between devices; resistance/capacitance influence speed and energy.',
      failure:'Open vias, shorts, electromigration, dielectric breakdown or excessive interconnect delay.',
      inspect:'Use inline metrology, defect inspection and physical failure analysis after electrical localization.',
      history:'Multi-layer metallization enabled increasing chip complexity after the invention of monolithic ICs.'
    },
    {
      id:'transistor',name:'CMOS transistor devices',label:'CMOS FET',group:'Process',x:112,y:398,w:117,h:58,shape:'chip',icon:'T',
      summary:'Tiny voltage-controlled semiconductor switches combine to implement digital logic and memory circuits.',
      materials:'Silicon channel structures, source/drain dopants, gate dielectric, metal gates and contact materials.',
      manufacture:'Advanced lithography, ion implantation or epitaxy, gate-stack deposition, etching and device-level parametric tests.',
      signals:'A gate electric field controls charge carriers in a semiconductor channel, changing device conduction.',
      failure:'Gate-oxide damage, bias temperature instability, hot-carrier effects, leakage and manufacturing variation.',
      inspect:'Use transistor-characterization structures, device modeling and foundry-qualified reliability tests.',
      history:'The transistor, invented in 1947, laid the groundwork for compact integrated computing.'
    },
    {
      id:'package',name:'Organic package substrate',label:'SUBSTRATE',group:'Package',x:321,y:567,w:448,h:37,shape:'slot',icon:'≋',
      summary:'Package-level wiring translates fine die contacts to larger motherboard contacts and provides mechanical support.',
      materials:'Build-up dielectric films, copper redistribution layers, organic laminates, solder mask and plated contacts.',
      manufacture:'Sequential build-up lamination, photopatterning, microvia creation, copper plating and electrical inspection.',
      signals:'Fans out dense die interconnect to power, ground and high-speed external I/O contacts.',
      failure:'Package warpage, delamination, microvia defects or brittle solder-joint fatigue.',
      inspect:'Evaluate warpage, X-ray images, package electrical continuity and thermal cycling performance.',
      history:'High-density package substrates allowed semiconductor dies to communicate with much coarser motherboard circuitry.'
    },
    {
      id:'bumps',name:'Solder bumps / balls',label:'BGA CONTACTS',group:'Package',x:322,y:617,w:445,h:21,shape:'pins',icon:'••',
      summary:'Solder interconnects join the die to its substrate and, for many packages, the package to the board.',
      materials:'Engineered solder alloys, copper pads, nickel barrier layers and surface-finish metals.',
      manufacture:'Solder deposition/ball placement, controlled reflow, flux cleaning and X-ray or other nondestructive testing.',
      signals:'Provide electrical and mechanical connections for thousands of package signals and power/ground paths.',
      failure:'Thermomechanical fatigue cracks, voiding, head-in-pillow defects or damage from bending.',
      inspect:'Use X-ray inspection and qualification thermal cycling; successful reflow alone is not evidence of long-term reliability.',
      history:'Area-array packaging supported greater pin counts than perimeter-leaded packages.'
    },
    {
      id:'heatspreader',name:'Integrated heat spreader',label:'HEAT SPREADER',group:'Package',x:369,y:91,w:377,h:38,shape:'sink',icon:'▤',
      summary:'Metal cap on many processor packages transfers heat from a die or chiplets toward a cooling solution. Not all chips use one.',
      materials:'Nickel-plated copper or other thermally conductive metal, thermal interface material and package sealant.',
      manufacture:'Metal stamping or machining, surface finishing, controlled bond line and thermal resistance qualification.',
      signals:'Thermal conduction—not electrical communication—is the main function of the heat-spreader assembly.',
      failure:'Poor die contact, degraded thermal interface, warpage or uneven cooling pressure.',
      inspect:'Use product-approved cooling mounting methods and monitor temperature under representative workloads.',
      history:'Processor heat spreaders became more important as package heat flux and cooling requirements increased.'
    }
  ];

  const materials = [
    {id:'fr4',code:'FR-4',name:'Glass-fiber / epoxy laminate',role:'Printed circuit board core and prepreg',icon:'▤',
      summary:'Glass-reinforced epoxy composite widely used as the structural dielectric of conventional PCBs. Specific high-speed laminates are selected for lower loss and controlled electrical properties.',
      materials:'Woven glass cloth, thermosetting epoxy resin, resin additives and copper foil laminated into a rigid panel.',
      manufacture:'Impregnate reinforcing cloth, form prepreg, laminate under heat/pressure, image and etch copper, drill and plate vias.',
      signals:'Provides mechanical stability and dielectric separation between copper circuits. Permittivity and loss tangent affect high-frequency transmission.',
      failure:'Delamination, conductive anodic filament risk, moisture effects, thermal expansion mismatch and via-barrel fatigue.',
      inspect:'Specify glass transition temperature, coefficient of thermal expansion, flammability, dielectric loss, and PCB acceptance standards.'},
    {id:'cu',code:'Cu',name:'Copper',role:'Traces, planes, heat spreaders and wiring',icon:'Cu',
      summary:'Copper is the principal board conductor because of its high electrical and thermal conductivity and practical manufacturing economics.',
      materials:'Rolled or electrodeposited copper foil, electroplated via copper, plated contact copper and high-purity package metallization.',
      manufacture:'Foil bonding, photolithographic etching, electroless/electrolytic deposition and machining for larger thermal parts.',
      signals:'Carries data, power, ground return currents and heat. Trace width, thickness and geometry influence loss and temperature rise.',
      failure:'Corrosion, electromigration in fine features, etching defects, excess current density and fatigue cracking.',
      inspect:'Verify specified copper weight, impedance, plating thickness and current/thermal design margins.'},
    {id:'si',code:'Si',name:'Monocrystalline silicon',role:'Transistor and integrated-circuit substrate',icon:'Si',
      summary:'Semiconducting crystalline material whose electrical behavior can be engineered through patterned structures and controlled doping.',
      materials:'Ultrapure silicon with selectively introduced dopants, oxide/nitride dielectrics, and metals used to build functional devices.',
      manufacture:'Crystal pulling, wafer polishing, deposition, photolithography, implantation, etching, and multilayer metal interconnection.',
      signals:'Supports MOS field-effect transistors, diodes and other active elements; device designs determine performance and leakage.',
      failure:'Particle contamination, oxide defects, process drift, intrinsic device aging and thermal reliability limits.',
      inspect:'Use wafer defect metrology, electrical test structures, parametric monitoring and device qualification.'},
    {id:'au',code:'Au',name:'Gold surface finish',role:'Low-corrosion mating contacts',icon:'Au',
      summary:'Thin gold over a suitable barrier metal is used on selected connector mating surfaces because it resists oxidation and maintains reliable low-current contacts.',
      materials:'Gold deposited over nickel or another qualified barrier onto a copper-alloy contact substrate.',
      manufacture:'Electroplating or selected surface-finishing methods, thickness measurement and contact-resistance tests.',
      signals:'Provides stable contact interfaces; gold is generally a surface coating, not the bulk conductor of motherboard traces.',
      failure:'Porosity, worn plating, fretting, contamination or poor barrier integrity.',
      inspect:'Specify plating thickness, contact force, mating cycles and environmental test conditions.'},
    {id:'snagcu',code:'SAC',name:'Lead-free solder alloys',role:'SMT/BGA electrical joints',icon:'Sn',
      summary:'Tin-silver-copper solder families are commonly used in lead-free electronic assemblies; exact alloy and process window depend on application requirements.',
      materials:'Tin with controlled silver and copper additions, flux chemistry and finished component pads.',
      manufacture:'Stencil paste printing, automated placement, qualified reflow profile and solder-joint inspection.',
      signals:'Electrical connection and mechanical restraint between packages, connectors and PCB pads.',
      failure:'Thermomechanical fatigue, voiding, brittle intermetallic growth, nonwetting and whisker risks in some tin systems.',
      inspect:'Review solder alloy selection, reflow temperature profile, joint geometry, IPC acceptance and accelerated aging tests.'},
    {id:'al',code:'Al',name:'Aluminum alloys',role:'Heatsinks, shields and chassis parts',icon:'Al',
      summary:'Lightweight structural and thermal material commonly extruded, cast or machined for cooling and mechanical components.',
      materials:'Application-specific wrought or cast aluminum alloy, sometimes anodized or coated to improve corrosion resistance.',
      manufacture:'Extrusion, casting, CNC machining, surface finishing, thermal-interface application and dimensional inspection.',
      signals:'Spreads heat and offers mechanical support; typically not part of high-speed signaling traces.',
      failure:'Insufficient contact area, galvanic corrosion, warpage, cracking or blocked airflow.',
      inspect:'Compare thermal conductivity, manufacturability, alloy temper, surface finish and mechanical loads.'},
    {id:'ni',code:'Ni',name:'Nickel plating and barriers',role:'Diffusion barriers and protective coatings',icon:'Ni',
      summary:'Nickel helps prevent unwanted diffusion between metal layers and is a common protective underlayer beneath gold finishes.',
      materials:'Electroless or electrolytic nickel coatings over copper and beneath final surface finishes.',
      manufacture:'Surface cleaning, controlled plating chemistry, bath monitoring and thickness/composition measurement.',
      signals:'Protects contact surfaces and stabilizes interfaces rather than replacing copper as the main conductor.',
      failure:'Porosity, brittle interfacial phases, inadequate plating thickness or adhesion loss.',
      inspect:'Specify plating process, deposit composition, thickness, solderability and environmental durability.'},
    {id:'ferrite',code:'Fe/O',name:'Ferrites and magnetic cores',role:'VRM inductors and EMI suppression',icon:'Φ',
      summary:'Engineered magnetic ceramics and powder-core composites provide inductance and control alternating magnetic fields in power circuits.',
      materials:'Iron-, manganese-, zinc- or nickel-containing magnetic formulations selected for saturation, frequency and loss properties.',
      manufacture:'Powder preparation, pressing/molding, sintering or composite curing, coil winding and electrical qualification.',
      signals:'Stores magnetic energy in switching converters and suppresses unwanted high-frequency noise.',
      failure:'Magnetic saturation, excessive core loss, cracked cores, winding hot spots or insulation damage.',
      inspect:'Check inductance versus current, temperature-rise rating and operating-frequency losses.'},
    {id:'ceramic',code:'MLCC',name:'Ceramic capacitor dielectrics',role:'Decoupling and filtering',icon:'▦',
      summary:'Multilayer ceramic capacitor technology provides high-frequency local energy storage in compact board footprints.',
      materials:'Formulated dielectric ceramic, internal metal electrodes, plated terminations and protective layers.',
      manufacture:'Tape casting, layer stacking, firing, termination formation, plating and capacitance/voltage testing.',
      signals:'Bypasses power noise and stabilizes supply rails near fast-switching electronics.',
      failure:'Flex-induced cracks, dielectric aging, DC-bias capacitance loss and excessive voltage stress.',
      inspect:'Review capacitance at actual DC bias, derating, acoustic response and board bending limits.'},
    {id:'polyimide',code:'PI',name:'Polyimide films',role:'Flexible circuits and packaging insulation',icon:'PI',
      summary:'Temperature-resistant polymer used for flexible printed circuits, insulation layers and selected semiconductor packaging applications.',
      materials:'Aromatic polyimide films and adhesives or coatings with application-specific formulations.',
      manufacture:'Film casting and curing, lamination, laser processing and controlled flexible-circuit fabrication.',
      signals:'Acts as electrical insulation and mechanical flex support for thin copper interconnect.',
      failure:'Adhesion problems, repeated-flex fatigue or environmental degradation in unsuitable applications.',
      inspect:'Measure bend radius, dielectric strength, thermal aging and compatibility with manufacturing chemicals.'},
    {id:'epoxy',code:'UF',name:'Epoxy underfill / encapsulation',role:'Mechanical protection for silicon packages',icon:'E',
      summary:'Polymer material used to reduce stress concentration and protect delicate interconnects in many chip packages.',
      materials:'Epoxy resin system with hardener, fillers and tailored thermal/mechanical properties.',
      manufacture:'Controlled dispensing, capillary flow or molding, cure-profile control and inspection for voids.',
      signals:'Offers insulation and mechanical stabilization; does not perform digital signal processing.',
      failure:'Voids, incomplete cure, moisture-induced cracking, delamination or excessive thermal mismatch.',
      inspect:'Evaluate glass transition, coefficient of thermal expansion, flow quality and thermal-cycle reliability.'},
    {id:'tim',code:'TIM',name:'Thermal interface materials',role:'Heat transfer across interfaces',icon:'T',
      summary:'Thermal paste, pad, gel or phase-change material fills microscopic air gaps between heat sources and cooling structures.',
      materials:'Polymer or grease matrix with ceramic, metallic or other thermally conductive fillers; chemistry varies by product.',
      manufacture:'Controlled dispensing, screen printing or pad cutting; assembly under target pressure and contact-area specifications.',
      signals:'Reduces thermal contact resistance from chip to heat spreader or heatsink.',
      failure:'Pump-out, dry-out, incorrect pad thickness, poor contact pressure or thermal aging.',
      inspect:'Assess bond-line thickness, thermal impedance, material lifetime and electrical conductivity/safety properties.'}
  ];

  const history = [
    {id:'1947',year:'1947',name:'The transistor is demonstrated',summary:'Bell Labs demonstrates the transistor, enabling a shift away from vacuum tubes.',detail:'The point-contact transistor launched semiconductor electronics. Subsequent junction and planar devices made reliable mass production practical.',materials:'Early devices included germanium; later silicon and insulating oxides enabled dominant integrated-circuit processes.',impact:'A tiny electronic switch made computers more reliable and power-efficient and created the foundation for integrated circuits.'},
    {id:'1958',year:'1958',name:'Integrated-circuit proof of concept',summary:'Jack Kilby demonstrates an integrated semiconductor circuit at Texas Instruments.',detail:'Kilby demonstrated that multiple circuit functions could be made from semiconductor material. His early demonstration used germanium and external fine-wire connections.',materials:'Germanium semiconductor slices with fine gold wiring in the original demonstration.',impact:'The concept condensed circuits that previously required numerous separate components.'},
    {id:'1959',year:'1959',name:'Planar processing and monolithic integration',summary:'Jean Hoerni develops a planar process; Robert Noyce advances the manufacturable monolithic IC concept.',detail:'The planar process and integrated interconnection methods became foundations for scaling semiconductor production.',materials:'Silicon, silicon dioxide passivation and patterned conducting layers.',impact:'Lithographic patterning made IC complexity and wafer-scale manufacturing possible.'},
    {id:'1971',year:'1971',name:'Intel 4004 commercial microprocessor',summary:'A programmable 4-bit CPU becomes commercially available on a single chip.',detail:'Intel publicly introduced the 4004 in November 1971. It brought a programmable processor to applications that otherwise needed custom fixed-function hardware.',materials:'Silicon MOS transistors in a ceramic dual-in-line package with metal leads.',impact:'Software-reprogrammable processing could be built into many smaller electronic products.'},
    {id:'1981',year:'1981',name:'IBM PC expands motherboard influence',summary:'The IBM Personal Computer helps popularize modular desktop system architecture.',detail:'The PC system board combined a processor, memory sockets, expansion interfaces and controller circuitry, influencing later compatible designs.',materials:'Fiberglass-epoxy printed circuit boards, copper, silicon ICs and plated edge connectors.',impact:'Modular expansion and broad ecosystem compatibility became defining characteristics of desktop PCs.'},
    {id:'1995',year:'1995',name:'ATX motherboard form factor',summary:'Intel introduces ATX to improve desktop board layout, airflow and power connectivity.',detail:'ATX moved major components and standardized many physical relationships to improve serviceability and case interoperability.',materials:'Multilayer FR-4 PCBs, standardized power connectors and integrated I/O assemblies.',impact:'Physical interface standards made PC cases, boards and supplies easier to mix and match.'},
    {id:'2003',year:'2003',name:'PCI Express ecosystem emerges',summary:'Serial point-to-point expansion technology begins replacing older parallel expansion arrangements.',detail:'Early PCI Express specifications established scalable links that evolved across many bandwidth generations.',materials:'Controlled-impedance PCB copper traces, plated connectors and advanced silicon serializer/deserializer circuits.',impact:'GPUs, network devices, SSDs and accelerators gained a scalable, high-performance connection model.'},
    {id:'2011',year:'2011',name:'NVMe 1.0 is published',summary:'NVM Express standardizes a modern command/interface model for PCIe solid-state storage.',detail:'The NVMe organization dates release of its initial 1.0 specification to March 1, 2011.',materials:'Silicon flash-controller ICs, NAND memory packages, PCB copper and solid-state storage modules.',impact:'Reduced protocol overhead and parallel queues better matched flash storage than older disk-oriented stacks.'},
    {id:'2013',year:'2010s',name:'Compact M.2 storage spreads',summary:'M.2 and compact PCIe-connected SSDs make storage easier to integrate onto boards.',detail:'Slim card form factors and increasingly available NVMe-capable platforms drove widespread onboard SSD support during the 2010s.',materials:'Gold-plated edge contacts, thin FR-4 SSD modules, NAND packages and copper routing.',impact:'More direct storage connections and fewer cables were possible in laptops and desktops.'},
    {id:'2020s',year:'2020s',name:'Chiplets, DDR5 and advanced packaging',summary:'Modern products combine advanced memory interfaces with more complex silicon packaging.',detail:'Different manufacturers use monolithic dies, chiplets, advanced interposers and other approaches. Not every product contains every feature.',materials:'Dense silicon dies, organic substrates, fine-pitch solder interconnects, dielectric films and high-speed PCB laminates.',impact:'Performance increasingly depends on system-level packaging, power integrity, thermal design and memory bandwidth.'}
  ];

  const tour = ['cpu-socket','vrm','dimm','pcie-x16','m2','bios'];
  const stageCopy = {
    board: ['ATX architecture • conceptual map','Explore the circuit board'],
    chip: ['Silicon floorplan • conceptual model','Inside a processor package'],
    materials: ['Material science • component selection','Explore 12 essential materials'],
    history: ['From transistors to chiplets','A timeline of computing hardware']
  };

  function escapeHtml(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function norm(str) { return String(str || '').toLocaleLowerCase().trim(); }
  function attrs(part) { return `data-hwat-part="${escapeHtml(part.id)}" role="button" tabindex="0" aria-label="Show information about ${escapeHtml(part.name)}" aria-controls="hwat-info"`; }

  // ================================================================
  // ILLUSTRATION SYSTEM v2.0 — original, fully editable vector artwork.
  // Every SVG target remains tied to the matching technical dossier.
  // This is a conceptual educational depiction, not a PCB CAD file.
  // ================================================================
  const svgText = (x,y,s,size=11,color='#b6d5dd',extra='') => `<text x="${x}" y="${y}" font-family="system-ui,Arial,sans-serif" font-size="${size}" font-weight="750" letter-spacing=".7" fill="${color}" ${extra}>${escapeHtml(s)}</text>`;
  const panel = (x,y,w,h,r=5,fill='url(#hwat-enclosure)',stroke='#526f83') => `<rect x="${x+1}" y="${y+3}" width="${w}" height="${h}" rx="${r}" fill="#030a14" opacity=".52"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
  const smallChip = (x,y,w,h,label='') => `<g>${panel(x,y,w,h,3,'url(#hwat-ic)','#486477')}${Array.from({length:Math.min(8,Math.floor(w/9))},(_,i)=>`<path d="M${x+5+i*(w-10)/Math.min(8,Math.floor(w/9))} ${y-3}v3M${x+5+i*(w-10)/Math.min(8,Math.floor(w/9))} ${y+h}v3" stroke="#b4a77c" stroke-width="1.6"/>`).join('')}${label?svgText(x+w/2,y+h/2+3,label,Math.min(12,w/5),'#bed4df','text-anchor="middle"'):''}</g>`;
  const pinMatrix = (x,y,cols,rows,stepX,stepY,rad=1.7,color='#d6bd88') => Array.from({length:cols*rows},(_,i)=>`<circle cx="${(x+(i%cols)*stepX).toFixed(2)}" cy="${(y+Math.floor(i/cols)*stepY).toFixed(2)}" r="${rad}" fill="${color}" opacity="${i%9===0?.95:.61}"/>`).join('');
  const fingers = (x,y,n,step,height,vertical=false) => Array.from({length:n},(_,i)=>vertical?`<path d="M${x+i*step} ${y}v${height}" stroke="#c4a46b" stroke-width="2" opacity=".92"/>`:`<path d="M${x} ${y+i*step}h${height}" stroke="#c4a46b" stroke-width="2" opacity=".9"/>`).join('');
  const vent = (x,y,w,h,n=8) => Array.from({length:n},(_,i)=>`<path d="M${x+6+i*(w-12)/(n-1)} ${y+5}v${h-10}" stroke="#90a4b5" stroke-width="2" opacity=".58"/>`).join('');
  const screw = (x,y,r=5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#hwat-metal)" stroke="#152c35" stroke-width="1.2"/><path d="M${x-r*.45} ${y}h${r*.9}M${x} ${y-r*.45}v${r*.9}" stroke="#405b66" stroke-width="1.15"/>`;
  const cap = (x,y,r=10) => `<ellipse cx="${x}" cy="${y+3}" rx="${r+1}" ry="${r+1}" fill="#07101a"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#hwat-metal)" stroke="#5f798a" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="${r-3}" fill="#566677"/><path d="M${x-r*.45} ${y}h${r*.9}M${x} ${y-r*.45}v${r*.9}" stroke="#aabccc" stroke-width="1.4" opacity=".7"/>`;
  function partBody(part) {
    const {x,y,w,h,id,shape}=part;
    let art='';
    if(id==='cpu-socket') {
      art=`${panel(x,y,w,h,12,'url(#hwat-metal)','#9aafb9')}<rect x="${x+9}" y="${y+9}" width="${w-18}" height="${h-18}" rx="8" fill="#1d2d3a" stroke="#bdcfcd" stroke-width="2"/><rect x="${x+24}" y="${y+24}" width="${w-48}" height="${h-48}" rx="5" fill="#283844" stroke="#a1aaba" stroke-width="2"/>${pinMatrix(x+35,y+36,13,12,(w-70)/12,(h-73)/11,2.25,'#c9a975')}<rect x="${x+30}" y="${y+29}" width="${w-60}" height="${h-58}" rx="5" fill="none" stroke="#dde2dc" stroke-width="2"/>${[0,1,2,3].map((_,i)=>screw(x+(i%2? w-12:12),y+(i>1?h-13:13),5)).join('')}<path d="M${x+w-6} ${y+24}h18v${h-62}h-10" stroke="#b1c0bc" stroke-width="7" fill="none" stroke-linejoin="round"/>${svgText(x+w/2,y+h/2+4,'LGA SOCKET',14,'#ebf0e6','text-anchor="middle"')}`;
    } else if(id==='vrm') {
      art=`${panel(x,y,w,h,7,'#1d353c','#446a6a')}${Array.from({length:5},(_,i)=>`<rect x="${x+7+i*20}" y="${y+8}" width="15" height="${h-17}" rx="3" fill="url(#hwat-metal-dark)" stroke="#6e8a90"/><path d="M${x+11+i*20} ${y+12}v${h-26}" stroke="#a9c0c0" stroke-width="1.4" opacity=".56"/>`).join('')}${[0,1,2].map(i=>`<rect x="${x+8+i*34}" y="${y+h-30}" width="27" height="21" rx="3" fill="#242d35" stroke="#9b8a61"/>`).join('')}${svgText(x+w/2,y+26,'12V VRM',11,'#f8e3b2','text-anchor="middle"')}`;
    } else if(id==='eps') {
      art=`${panel(x,y,w,h,5,'#1c252e','#a6b7bb')}<rect x="${x+8}" y="${y+8}" width="${w-16}" height="${h-16}" rx="4" fill="#080f17"/>${Array.from({length:8},(_,i)=>{let px=x+15+(i%4)*22,py=y+13+Math.floor(i/4)*19;return `<rect x="${px}" y="${py}" width="17" height="16" rx="2.5" fill="#14242a" stroke="#b8bbc1"/><circle cx="${px+8.5}" cy="${py+8}" r="3.3" fill="#e3c48e"/>`;}).join('')}<rect x="${x+40}" y="${y-6}" width="33" height="8" rx="2" fill="#748b91"/>`;
    } else if(id==='dimm') {
      art=Array.from({length:4},(_,i)=>{const sx=x+5+i*27;return `<rect x="${sx}" y="${y}" width="21" height="${h}" rx="3" fill="#233644" stroke="#8c9eac" stroke-width="1.8"/><rect x="${sx+6}" y="${y+14}" width="9" height="${h-28}" rx="2" fill="#050d16"/>${fingers(sx+7,y+21,36,(h-42)/36,7)}<rect x="${sx-2}" y="${y-4}" width="25" height="15" rx="3" fill="url(#hwat-metal)" stroke="#8294a0"/><rect x="${sx-2}" y="${y+h-11}" width="25" height="15" rx="3" fill="url(#hwat-metal)" stroke="#8294a0"/>`;}).join('')+svgText(x+57,y+h+17,'DDR MEMORY CHANNELS',10,'#92c7c3','text-anchor="middle"');
    } else if(id==='pcie-x16'||id==='pcie-x1') {
      art=`${panel(x,y,w,h,5,'#c3c9cb','#4e7c8a')}<rect x="${x+9}" y="${y+6}" width="${w-23}" height="${Math.max(9,h-12)}" rx="2" fill="#1c2834"/>${fingers(x+12,y+11,Math.min(82,Math.floor(w/6)),Math.max(4,(w-38)/Math.min(82,Math.floor(w/6))),8,true)}<path d="M${x+49} ${y+5}v${h-11}" stroke="#c6cbd0" stroke-width="4"/><rect x="${x+w-14}" y="${y-4}" width="15" height="${h+8}" rx="3" fill="#778b98"/>${svgText(x+w/2,y-8,id==='pcie-x16'?'PCIE  x16':'PCIE  x1',10,'#a4c1cc','text-anchor="middle"')}`;
    } else if(id==='m2'||id==='m2-secondary') {
      art=`<rect x="${x+2}" y="${y+1}" width="${w-5}" height="${h-2}" rx="4" fill="url(#hwat-ssd)" stroke="#517b7c" stroke-width="1.6"/>${Array.from({length:3},(_,i)=>smallChip(x+49+i*83,y+5,59,h-10, i===0?'CTRL':'NAND')).join('')}<rect x="${x}" y="${y-3}" width="22" height="${h+6}" rx="2" fill="url(#hwat-metal)" stroke="#b7aaa0"/>${pinMatrix(x+5,y+3,2,3,8,8,2.2)}${screw(x+w-12,y+h/2,6)}`;
    } else if(id==='chipset') {
      art=`${panel(x,y,w,h,11,'url(#hwat-chip-purple)','#6f8b9d')}<rect x="${x+10}" y="${y+11}" width="${w-20}" height="${h-22}" rx="5" fill="url(#hwat-ic)" stroke="#a9b7bb" stroke-width="1.8"/>${Array.from({length:9},(_,i)=>`<path d="M${x+12+i*12} ${y+6}v6M${x+12+i*12} ${y+h-12}v7" stroke="#c4a16e" stroke-width="2"/>`).join('')}${svgText(x+w/2,y+h/2-1,'PCH',17,'#cde9dc','text-anchor="middle"')}${svgText(x+w/2,y+h/2+16,'SYSTEM I/O',8,'#8eacb6','text-anchor="middle"')}`;
    } else if(id==='sata') {
      art=Array.from({length:4},(_,i)=>{let px=x+(i%2)*37,py=y+Math.floor(i/2)*43;return `<rect x="${px}" y="${py}" width="34" height="38" rx="5" fill="#2d4149" stroke="#88b2b0" stroke-width="2"/><path d="M${px+7} ${py+7}h20v24h-10v-5h-10z" fill="#0b161c" stroke="#c2ad85" stroke-width="2"/>`;}).join('');
    } else if(id==='atx24') {
      art=`${panel(x,y,w,h,5,'#15252f','#8d9da5')}<rect x="${x+6}" y="${y+6}" width="${w-12}" height="${h-12}" fill="#090f18" rx="3"/>${Array.from({length:24},(_,i)=>{let px=x+9+(i%2)*15,py=y+10+Math.floor(i/2)*15.6;return `<rect x="${px}" y="${py}" width="11" height="12" rx="2" fill="#24363b" stroke="#b6b4a2"/><circle cx="${px+5.5}" cy="${py+5.5}" r="2.4" fill="#c8a777"/>`;}).join('')}`;
    } else if(id==='rear-io') {
      art=`${panel(x,y,w,h,6,'url(#hwat-metal)','#9bb5ba')}${[0,1,2].map(i=>`<rect x="${x+8}" y="${y+12+i*56}" width="${w-16}" height="39" rx="3" fill="#101b26" stroke="#738c95"/>${i===2?`${[0,1,2].map(j=>`<circle cx="${x+19+j*12}" cy="${y+12+i*56+20}" r="6" fill="${['#85bcd0','#e3b0ba','#c6d9b2'][j]}" stroke="#72828c"/>`).join('')}`:`<rect x="${x+15}" y="${y+23+i*56}" width="${w-30}" height="16" fill="#243b4c" stroke="#4a7d93"/>`}`).join('')}<rect x="${x+7}" y="${y+190}" width="${w-14}" height="45" rx="3" fill="#12222e" stroke="#657e8c"/>${pinMatrix(x+15,y+202,5,2,7,12,2.4)}`;
    } else if(id==='cmos') {
      art=`<circle cx="${x+w/2}" cy="${y+h/2+2}" r="${Math.min(w,h)/2}" fill="#081524" stroke="#c3bfaa" stroke-width="3"/><circle cx="${x+w/2}" cy="${y+h/2}" r="${Math.min(w,h)/2-5}" fill="url(#hwat-metal)" stroke="#718493" stroke-width="2"/><circle cx="${x+w/2}" cy="${y+h/2}" r="${Math.min(w,h)/2-12}" fill="none" stroke="#b1c4c8" stroke-width="1"/>${svgText(x+w/2,y+h/2+5,'+',24,'#334e59','text-anchor="middle"')}`;
    } else if(id==='heatsink') {
      art=`${panel(x,y,w,h,6,'url(#hwat-metal-dark)','#7b9aa2')}${vent(x+4,y+4,w-8,h-8,14)}${svgText(x+w/2,y+h/2+5,'THERMAL',11,'#d5e9e9','text-anchor="middle"')}`;
    } else if(id==='pcb') {
      art=`${panel(x,y,w,h,5,'#102b39','#66847d')}${[0,1,2,3,4].map((_,i)=>`<path d="M${x+13} ${y+10+i*8}h${w-26}" stroke="${i%2?'#b27e53':'#43b3ab'}" stroke-width="${i===2?5:3}" opacity=".72"/>`).join('')}${svgText(x+w/2,y+19,'MULTILAYER PCB',11,'#ccdee8','text-anchor="middle"')}`;
    } else if(id==='debug') {
      art=`${panel(x,y,w,h,6,'#182632','#7b9aa5')}<rect x="${x+9}" y="${y+8}" width="${w-18}" height="${h-16}" rx="4" fill="#0a0b11" stroke="#4d626a"/>${svgText(x+w/2,y+h/2+13,'88',42,'#f48568','text-anchor="middle" style="filter:drop-shadow(0px 0px 7px #ed7154)"')}`;
    } else if(id==='capacitors') {
      art=`${[0,1,2,3,4].map((_,i)=>cap(x+12+i*22,y+27,i%2===0?11:10)).join('')}`;
    } else if(id==='fan'||id==='usb-header'||id==='fpanel') {
      const cols=id==='fan'?4:id==='usb-header'?9:10, rows=id==='fan'?1:2;
      art=`${panel(x,y,w,h,5,'#182630','#6e8c98')}<rect x="${x+7}" y="${y+6}" width="${w-14}" height="${h-12}" rx="3" fill="#07131a"/>${pinMatrix(x+15,y+h/2-(rows-1)*6,cols,rows,(w-30)/(cols-1),12,3.1,'#e5c08a')}`;
    } else if(id==='wifi') {
      art=`${panel(x,y,w,h,6,'url(#hwat-metal)','#8db0bd')}<rect x="${x+7}" y="${y+8}" width="${w-14}" height="${h-16}" rx="3" fill="#8b9fa1"/>${svgText(x+w/2,y+h/2+5,'Wi-Fi / RF',14,'#1c3742','text-anchor="middle"')}`;
    } else if(id==='audio'||id==='ethernet'||id==='bios'||id==='clock') {
      art=`${smallChip(x,y,w,h,id==='audio'?'AUDIO':id==='ethernet'?'LAN / PHY':id==='bios'?'UEFI FLASH':'CLK')}<path d="M${x+7} ${y+h-10}h${w-14}" stroke="#679ba4" stroke-width="1" opacity=".6"/>`;
      if(id==='audio')art+=`${cap(x+w-13,y-9,8)}${cap(x+w+2,y+12,7)}`;
    } else if(id==='silicon') {
      art=`${panel(x,y,w,h,6,'url(#hwat-silicon)','#899cdb')}${pinMatrix(x+13,y+12,8,2,12,18,2,'#a1b3f6')}${svgText(x+w/2,y+h/2+5,'Si WAFER',11,'#e2e4ff','text-anchor="middle"')}`;
    } else if(id==='interconnect') {
      art=`${panel(x,y,w,h,6,'#24284c','#8592dc')}${Array.from({length:7},(_,i)=>`<path d="M${x+9} ${y+9+i*6}h${w-18}" stroke="${i%2?'#e4b47d':'#a7aaf9'}" stroke-width="2.6" opacity=".81"/>`).join('')}`;
    } else if(id==='transistor') {
      art=`${panel(x,y,w,h,6,'#1d3059','#818ce1')}${[0,1,2].map((_,i)=>`<g transform="translate(${x+14+i*33},${y+16})"><path d="M0 20h20M7 0v20M14 0v20" stroke="#92e2d3" stroke-width="3"/><rect x="6" y="6" width="9" height="8" fill="#dbbd86"/></g>`).join('')}`;
    } else if(id==='cpu-cores'||id==='gpu-cores') {
      const cols=id==='cpu-cores'?4:9,rows=id==='cpu-cores'?2:5,gap=id==='cpu-cores'?8:4,margin=12;
      art=`${panel(x,y,w,h,7,id==='cpu-cores'?'url(#hwat-silicon)':'url(#hwat-chip-purple)','#9696d7')}${Array.from({length:cols*rows},(_,i)=>{const tw=(w-2*margin-(cols-1)*gap)/cols, th=(h-2*margin-(rows-1)*gap)/rows;const bx=x+margin+(i%cols)*(tw+gap), by=y+margin+Math.floor(i/cols)*(th+gap);return `<rect x="${bx}" y="${by}" width="${tw}" height="${th}" rx="${id==='cpu-cores'?5:2}" fill="${id==='cpu-cores'?'#304e75':'#3b3b81'}" stroke="${id==='cpu-cores'?'#7ec3c6':'#ac99dd'}" stroke-width="1.4"/>${id==='cpu-cores'?`<path d="M${bx+8} ${by+8}h${tw-16}v${th-16}h-${tw-16}z" fill="none" stroke="#9ba9f0" opacity=".45"/>`:''}`;}).join('')}${svgText(x+w/2,y+h+17,id==='cpu-cores'?'CPU COMPUTE CLUSTERS':'INTEGRATED GPU / ACCELERATOR',11,'#aebbf3','text-anchor="middle"')}`;
    } else if(id==='l3'||id==='memory-controller'||id==='fabric') {
      art=`${panel(x,y,w,h,5,'url(#hwat-silicon)','#727fc4')}${Array.from({length:id==='l3'?15:id==='fabric'?23:11},(_,i)=>{const n=id==='l3'?15:id==='fabric'?23:11,sw=(w-19)/n-3;return `<rect x="${x+10+i*(w-20)/n}" y="${y+9}" width="${Math.max(3,sw)}" height="${h-18}" rx="1" fill="${i%3===0?'#a8b1f6':'#4f6caa'}" opacity=".64"/>`;}).join('')}${svgText(x+w/2,y+h/2+4,part.label,11,'#eff1ff','text-anchor="middle"')}`;
    } else if(id==='pcie-phy'||id==='power-grid'||id==='clock-grid') {
      art=`${panel(x,y,w,h,5,'url(#hwat-chip-purple)','#6f8eb7')}${pinMatrix(x+12,y+12,7,id==='pcie-phy'?10:3,(w-24)/6,(h-24)/(id==='pcie-phy'?9:2),2.2,'#9a9edb')}${svgText(x+w/2,y+h/2+4,id==='pcie-phy'?'PCIe PHY':id==='power-grid'?'PWR GRID':'CLK GRID',10,'#eff3ff','text-anchor="middle"')}`;
    } else if(id==='package'||id==='bumps'||id==='heatspreader') {
      if(id==='heatspreader')art=`${panel(x,y,w,h,8,'url(#hwat-metal)','#aec1ce')}${svgText(x+w/2,y+h/2+4,'INTEGRATED HEAT SPREADER',12,'#294551','text-anchor="middle"')}`;
      if(id==='package')art=`${panel(x,y,w,h,5,'url(#hwat-substrate)','#ba9a67')}${Array.from({length:3},(_,i)=>`<path d="M${x+12} ${y+8+i*10}h${w-24}" stroke="#c9a57a" stroke-width="2" opacity=".68"/>`).join('')}`;
      if(id==='bumps')art=`${Array.from({length:42},(_,i)=>`<ellipse cx="${x+8+i*(w-16)/41}" cy="${y+h/2}" rx="4" ry="7" fill="url(#hwat-metal)" stroke="#aba9bb" stroke-width=".8"/>`).join('')}`;
    } else {
      art=`${panel(x,y,w,h,6)}${svgText(x+w/2,y+h/2+4,part.label,Math.max(9,Math.min(13,w/7)),'#d9edf7','text-anchor="middle"')}`;
    }
    // Transparent polygon is the complete pointer/keyboard selection target.
    // The border is visible only for hover, selected, or focus states.
    const outline = shape==='round' ? `<circle class="hwat-hotspot-border" cx="${x+w/2}" cy="${y+h/2}" r="${Math.min(w,h)/2+2}"/>` : `<rect class="hwat-hotspot-border" x="${x-2}" y="${y-2}" width="${w+4}" height="${h+4}" rx="8"/>`;
    const hit = shape==='round'?`<circle cx="${x+w/2}" cy="${y+h/2}" r="${Math.min(w,h)/2+6}" fill="transparent"/>`:`<rect x="${x-2}" y="${y-2}" width="${w+4}" height="${h+4}" rx="7" fill="transparent"/>`;
    return `<g class="hwat-illustrated-device">${art}${outline}${hit}</g>`;
  }

  // Deterministic engineering-board routing detail; never suggests real pinout.
  function circuitTraces() {
    let result='',seed=48291;
    function rand() {seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
    for(let i=0;i<215;i++){
      const x=Math.round(46+rand()*958),y=Math.round(46+rand()*574),length=Math.round(26+rand()*115),bend=Math.round(8+rand()*40);
      const d=i%2===0?`M${x} ${y}h${length}l${bend} ${bend}`:`M${x} ${y}v${length/2}h${bend}`;
      result+=`<path d="${d}" fill="none" stroke="${i%4===0?'#dca66c':i%3===0?'#518e83':'#4da4a6'}" stroke-width="${i%5===0?2:1}" opacity="${i%7===0?.24:.11}"/>`;
      if(i%3===0)result+=`<circle cx="${x}" cy="${y}" r="${i%2?3.2:2}" fill="none" stroke="#7bbaad" stroke-width="1.3" opacity=".22"/>`;
    }
    return result;
  }
  function svgDefs(){return `<defs>
    <linearGradient id="hwat-pcb" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#18484a"/><stop offset=".46" stop-color="#103337"/><stop offset="1" stop-color="#08282e"/></linearGradient>
    <linearGradient id="hwat-metal" x1="0" y1="0" x2=".95" y2="1"><stop stop-color="#dbe5e6"/><stop offset=".22" stop-color="#738d9b"/><stop offset=".50" stop-color="#becdd2"/><stop offset=".78" stop-color="#697f8d"/><stop offset="1" stop-color="#c1cfd0"/></linearGradient>
    <linearGradient id="hwat-metal-dark" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#182e3c"/><stop offset=".5" stop-color="#627d86"/><stop offset="1" stop-color="#142932"/></linearGradient>
    <linearGradient id="hwat-enclosure" x1="0" y1="0" x2=".75" y2="1"><stop stop-color="#3f5560"/><stop offset="1" stop-color="#172532"/></linearGradient>
    <linearGradient id="hwat-ic" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#263647"/><stop offset=".5" stop-color="#0b1527"/><stop offset="1" stop-color="#22283b"/></linearGradient>
    <linearGradient id="hwat-chip-purple" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#3f4c86"/><stop offset=".55" stop-color="#252757"/><stop offset="1" stop-color="#141d3c"/></linearGradient>
    <linearGradient id="hwat-silicon" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#385a8d"/><stop offset=".42" stop-color="#333b77"/><stop offset="1" stop-color="#20284d"/></linearGradient>
    <linearGradient id="hwat-ssd" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#123b39"/><stop offset=".60" stop-color="#155050"/><stop offset="1" stop-color="#132c32"/></linearGradient>
    <linearGradient id="hwat-substrate" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#74664c"/><stop offset=".5" stop-color="#38544a"/><stop offset="1" stop-color="#827356"/></linearGradient>
    <radialGradient id="hwat-stage-glow"><stop stop-color="#183b50"/><stop offset=".55" stop-color="#0a1d2b"/><stop offset="1" stop-color="#060d18"/></radialGradient>
    <pattern id="hwat-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".8" fill="#73c4bd" opacity=".23"/></pattern>
    <pattern id="hwat-blueprint" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#6c95ac" stroke-opacity=".15" stroke-width="1"/></pattern>
    <filter id="hwat-shadow" x="-25%" y="-25%" width="150%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="hwat-glow" x="-45%" y="-50%" width="190%" height="200%"><feGaussianBlur stdDeviation="4.5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="hwat-brilliance" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.5"/></filter>
  </defs>`;}

  const routeSvg = `<g class="hwat-route hwat-route--power" fill="none" stroke="#ffbd78" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M195 115V140H187V156"/><path d="M238 244H254V259H266"/><path d="M759 259H690V305H498"/><path d="M709 269H678V220H664"/></g>
    <g class="hwat-route hwat-route--data" fill="none" stroke="#7bf1e5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M482 224H518V232H533"/><path d="M376 365V381H465V402"/><path d="M379 362V446H510V460"/><path d="M482 291H677V451H771"/><path d="M893 486H931"/></g>`;
  function motherboardSvg(){
    const mount=[[51,52],[1041,52],[51,636],[1041,636]];
    const guide=`${svgText(45,688,'EXPLORER / ATX CONCEPT • CLICK COMPONENTS TO INSPECT',12,'#8aa6b6')}${svgText(1045,688,'REV 2.0 / EDUCATIONAL',11,'#7898aa','text-anchor="end"')}`;
    return `<svg viewBox="0 0 1080 710" xmlns="http://www.w3.org/2000/svg" aria-label="Detailed illustration of a conceptual ATX motherboard, with 25 interactive hardware components" role="group">
      <title>Illustrated ATX motherboard explorer</title>${svgDefs()}
      <rect width="1080" height="710" fill="url(#hwat-stage-glow)"/><rect width="1080" height="710" fill="url(#hwat-blueprint)"/>
      <rect x="31" y="34" width="1042" height="640" rx="21" fill="#000" opacity=".55" filter="url(#hwat-shadow)"/>
      <rect x="19" y="21" width="1042" height="639" rx="13" fill="url(#hwat-pcb)" stroke="#638681" stroke-width="3"/>
      <rect x="25" y="27" width="1030" height="626" rx="11" fill="url(#hwat-dots)"/>
      <rect x="33" y="35" width="1014" height="611" rx="5" fill="none" stroke="#7db0a3" stroke-opacity=".23" stroke-width="1.5"/>
      ${circuitTraces()}
      <g fill="none" stroke="#9b895c" opacity=".26" stroke-width="3"><path d="M72 114H248V126H505V106H706"/><path d="M504 371H690V348H769"/><path d="M676 486V555H766"/><path d="M798 153H887V234H1006"/></g>
      <g fill="#c9bb7e" opacity=".32">${Array.from({length:78},(_,i)=>{const x=70+(i*113)%946,y=81+(i*83)%514;return `<rect x="${x}" y="${y}" width="11" height="3" rx="1"/>`;}).join('')}</g>
      ${routeSvg}
      <g>${mount.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="16" fill="#1b2a29" stroke="#b2a77c" stroke-width="3"/><circle cx="${x}" cy="${y}" r="9" fill="#07141a" stroke="#6b7668" stroke-width="2"/>${screw(x,y,5)}`).join('')}</g>
      ${svgText(85,51,'HARDWARE ATLAS',13,'#a6d4c9')}${svgText(80,647,'PCB / FR-4 + COPPER · CONCEPTUAL',10,'#8eaca3')}
      ${board.map(p=>`<g class="hwat-svg-part" ${attrs(p)} data-hwat-group="${escapeHtml(p.group)}"><title>${escapeHtml(p.name)}</title>${partBody(p)}</g>`).join('')}
      ${guide}
    </svg>`;
  }
  function chipSvg(){
    const traces=Array.from({length:120},(_,i)=>{const x=256+(i*67)%678,y=155+(i*47)%376;return `<path d="M${x} ${y}h${5+i%30}v${i%4*4}" stroke="${i%3===0?'#7ecbd6':'#b38cde'}" stroke-width="1.1" opacity=".22" fill="none"/>`;}).join('');
    return `<svg viewBox="0 0 1080 710" xmlns="http://www.w3.org/2000/svg" aria-label="Detailed interactive conceptual processor die and packaging, with 14 selectable regions" role="group">
      <title>Silicon processor cutaway, functional block diagram</title>${svgDefs()}
      <rect width="1080" height="710" fill="url(#hwat-stage-glow)"/><rect width="1080" height="710" fill="url(#hwat-blueprint)"/>
      <rect x="91" y="67" width="897" height="595" rx="31" fill="#000" opacity=".5" filter="url(#hwat-shadow)"/>
      <rect x="78" y="55" width="900" height="600" rx="27" fill="url(#hwat-substrate)" stroke="#aa9166" stroke-width="3"/>
      ${Array.from({length:27},(_,i)=>`<circle cx="${108+i*30.7}" cy="${78}" r="4" fill="#d7bd8a" opacity=".74"/><circle cx="${108+i*30.7}" cy="${635}" r="4" fill="#d7bd8a" opacity=".74"/>`).join('')}
      <rect x="245" y="153" width="708" height="391" rx="13" fill="url(#hwat-chip-purple)" stroke="#a19ada" stroke-width="6"/>
      <rect x="250" y="158" width="698" height="381" rx="8" fill="url(#hwat-dots)"/>
      ${traces}
      <g class="hwat-route hwat-route--power" fill="none" stroke="#ffbd78" stroke-width="5" stroke-dasharray="9 9" stroke-linecap="round"><path d="M866 410H801V368H496V330"/><path d="M866 413H787V346H671"/></g>
      <g class="hwat-route hwat-route--data" fill="none" stroke="#7bf1e5" stroke-width="5" stroke-dasharray="9 9" stroke-linecap="round"><path d="M398 360V389"/><path d="M659 356V384"/><path d="M512 415H542"/><path d="M653 466V478"/></g>
      <path d="M527 169V538M796 167V538M253 377H943" stroke="#bac4f1" opacity=".18" stroke-width="3"/>
      ${svgText(114,84,'ADVANCED PROCESSOR · EXPLODED FUNCTIONAL VIEW',13,'#d4d2af')}
      ${chip.map(p=>`<g class="hwat-svg-part" ${attrs(p)} data-hwat-group="${escapeHtml(p.group)}"><title>${escapeHtml(p.name)}</title>${partBody(p)}</g>`).join('')}
      ${svgText(45,689,'SILICON / LOGIC / PACKAGE · CONCEPTUAL TOPOLOGY',12,'#8aa6b6')}${svgText(1032,689,'NOT A VENDOR DIE MAP',11,'#7898aa','text-anchor="end"')}
    </svg>`;
  }

  function init(target) {
    const root = typeof target === 'string' ? document.querySelector(target) : (target || document.getElementById('hardware-atlas'));
    if (!root || root.dataset.hwatInitialized === 'true') return false;
    const $ = selector => root.querySelector(selector);
    const state = {
      view:'board', category:'All', search:'', tourIndex:-1, trace:'off',zoom:1,centerX:540,centerY:355,drag:null,
      selected: {board:'cpu-socket', chip:'cpu-cores', materials:'fr4', history:'1947'}
    };
    const elements = {
      diagram: $('[data-hwat-diagram]'), categories: $('[data-hwat-categories]'),
      list: $('[data-hwat-part-list]'), count: $('[data-hwat-count]'), info: $('[data-hwat-info]'),
      stage: $('[data-hwat-stage-heading]'), overline: $('[data-hwat-stage-label]'),
      search: $('[data-hwat-search]'), listTitle: $('[data-hwat-list-title]'), inspector: $('[data-hwat-inspector]'), hover: $('[data-hwat-hover-card]'), zoomLabel: $('[data-hwat-zoom-level]'), wrap: $('[data-hwat-diagram-wrap]')
    };
    if (Object.values(elements).some(el => !el)) return false;
    root.dataset.hwatInitialized = 'true';

    function collection() { return state.view==='board' ? board : state.view==='chip' ? chip : state.view==='materials' ? materials : history; }
    function filtered() {
      return collection().filter(p => {
        const categoryOk = (state.view==='board' || state.view==='chip') ? (state.category==='All' || p.group===state.category) : true;
        const fields = [p.name,p.code,p.group,p.role,p.summary,p.materials,p.manufacture,p.signals,p.failure,p.impact,p.year,p.detail].join(' ');
        return categoryOk && (!state.search || norm(fields).includes(state.search));
      });
    }
    function updateSelectedStyles() {
      const selected = state.selected[state.view];
      root.querySelectorAll('[data-hwat-part], [data-hwat-item], [data-hwat-directory]').forEach(element => {
        const id = element.getAttribute('data-hwat-part') || element.getAttribute('data-hwat-item') || element.getAttribute('data-hwat-directory');
        const isSelected = id === selected;
        element.classList.toggle('is-selected', isSelected);
        if (element.tagName.toLowerCase() === 'button') element.setAttribute('aria-pressed',String(isSelected));
      });
    }
    function clamp(value,min,max) { return Math.min(max,Math.max(min,value)); }
    function applyViewport() {
      const svg=elements.diagram.querySelector('svg');
      if(!svg)return;
      const width=1080/state.zoom,height=710/state.zoom;
      state.centerX=clamp(state.centerX,width/2,1080-width/2);
      state.centerY=clamp(state.centerY,height/2,710-height/2);
      svg.setAttribute('viewBox',`${(state.centerX-width/2).toFixed(2)} ${(state.centerY-height/2).toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)}`);
      elements.zoomLabel.textContent=`${Math.round(state.zoom*100)}%`;
      elements.diagram.dataset.hwatPannable=String(state.zoom>1.001);
    }
    function zoomTo(next) {
      next=clamp(next,1,3);
      if(state.zoom===1 && next>1 && (state.view==='board'||state.view==='chip')) {
        const item=collection().find(p=>p.id===state.selected[state.view]);
        if(item){state.centerX=item.x+item.w/2;state.centerY=item.y+item.h/2;}
      }
      state.zoom=next;
      if(next===1){state.centerX=540;state.centerY=355;}
      applyViewport();
    }
    function updateTraceButtons() {
      root.dataset.hwatTrace=state.trace;
      root.querySelectorAll('button[data-hwat-trace]').forEach(button=>{
        const active=button.getAttribute('data-hwat-trace')===state.trace;
        button.classList.toggle('is-active',active);
        button.setAttribute('aria-pressed',String(active));
      });
    }
    function hideHover(){elements.hover.classList.remove('is-visible');elements.hover.setAttribute('aria-hidden','true');}
    function showHover(event){
      if(state.drag)return;
      const part=event.target.closest('[data-hwat-part]');
      if(!part || part.classList.contains('is-dimmed')){hideHover();return;}
      const id=part.getAttribute('data-hwat-part');
      const item=collection().find(p=>p.id===id);
      if(!item){hideHover();return;}
      elements.hover.innerHTML=`<strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.group)} · click to inspect</small>`;
      const r=elements.wrap.getBoundingClientRect();
      const x=clamp(event.clientX-r.left+12,8,Math.max(8,r.width-231));
      const y=clamp(event.clientY-r.top-66,12,Math.max(12,r.height-90));
      elements.hover.style.left=`${x}px`;
      elements.hover.style.top=`${y}px`;
      elements.hover.setAttribute('aria-hidden','false');
      elements.hover.classList.add('is-visible');
    }
    function renderInspector() {
      const item = collection().find(p=>p.id===state.selected[state.view]);
      if (!item) return;
      const isHistory=state.view==='history';
      const parts = [];
      if (isHistory) {
        parts.push(['What changed',item.detail]);
        parts.push(['Materials and technology',item.materials]);
        parts.push(['Why it mattered',item.impact]);
      } else {
        parts.push(['What it does',item.signals]);
        parts.push(['Materials and composition',item.materials]);
        parts.push(['How it is manufactured',item.manufacture]);
        parts.push(['Typical failure modes',item.failure]);
        parts.push(['Engineering / inspection best practices',item.inspect]);
        if (item.history) parts.push(['Historical context',item.history]);
      }
      const overline = state.view==='materials' ? 'Materials science / selection' : isHistory ? `Hardware history / ${item.year}` : `${item.group} / Engineering reference`;
      // Give the inspector its own gradient IDs; nested SVGs cannot rely on
      // duplicate document-wide paint server IDs in some Chromium versions.
      const detailDefs=svgDefs().replaceAll('id="hwat-','id="hwat-detail-').replaceAll('url(#hwat-','url(#hwat-detail-');
      const detailArt=(state.view==='board' || state.view==='chip') ? partBody(item).replaceAll('url(#hwat-','url(#hwat-detail-') : '';
      const illustrative = (state.view==='board' || state.view==='chip') ?
        `<div class="hwat-detail-visual"><span class="hwat-detail-visual-label">ILLUSTRATED COMPONENT CLOSE-UP</span>
          <svg viewBox="${item.x-25} ${item.y-29} ${item.w+50} ${item.h+58}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${detailDefs}${detailArt}</svg>
          <span class="hwat-detail-visual-note">Visual aid · conceptual geometry · not a manufacturer drawing</span></div>` :
        state.view==='materials' ? `<div class="hwat-detail-visual is-material" data-hwat-material="${escapeHtml(item.id)}"><span class="hwat-detail-visual-label">ENGINEERING MATERIAL</span><span class="hwat-visual-material-disc">${escapeHtml(item.code)}</span></div>` :
        `<div class="hwat-detail-visual is-year"><span class="hwat-detail-visual-label">HARDWARE HISTORY</span><strong>${escapeHtml(item.year)}</strong></div>`;
      elements.info.innerHTML = `<div class="hwat-selected-icon" aria-hidden="true">${escapeHtml(item.icon || (isHistory ? '◷':'◆'))}</div>
        <div class="hwat-detail-overline">${escapeHtml(overline)}</div>
        <h3 id="hwat-info-title">${escapeHtml(item.name)}</h3>
        <p class="hwat-summary">${escapeHtml(item.summary)}</p>
        ${illustrative}
        ${parts.filter(([_,value])=>Boolean(value)).map(([label,content])=>`<div class="hwat-detail-section"><h4>${escapeHtml(label)}</h4><p>${escapeHtml(content)}</p></div>`).join('')}
        ${!isHistory && item.group ? `<div class="hwat-detail-section"><h4>Classification</h4><span class="hwat-mini-tag">${escapeHtml(item.group)}</span><span class="hwat-mini-tag">${escapeHtml(state.view==='board'?'Motherboard':state.view==='chip'?'Chip architecture':'Materials engineering')}</span></div>` : ''}
        ${state.tourIndex >= 0 && state.view==='board' ? `<div class="hwat-detail-progress">Guided tour: ${state.tourIndex+1} of ${tour.length}</div><button type="button" class="hwat-detail-next" data-hwat-next-step>${state.tourIndex===tour.length-1?'Finish tour':'Next component →'}</button>` : ''}
        <p class="hwat-part-note">${isHistory ? 'Dates describe documented milestones; parallel inventions and improvements occurred across organizations.' : 'Educational engineering reference. Material choices and electrical interfaces require manufacturer and standard-specific verification.'}</p>`;
    }
    function renderCategories() {
      if(state.view!=='board' && state.view!=='chip') { elements.categories.innerHTML=''; return; }
      const groups=['All',...new Set(collection().map(p=>p.group))];
      elements.categories.innerHTML=groups.map(group=>`<button type="button" class="hwat-filter ${group===state.category?'is-active':''}" data-hwat-category="${escapeHtml(group)}" aria-pressed="${group===state.category}">${escapeHtml(group)}</button>`).join('');
    }
    function renderDirectory() {
      if (state.view !== 'board' && state.view !== 'chip') { elements.list.innerHTML=''; elements.count.textContent=''; return; }
      const items=filtered();
      elements.list.innerHTML=items.length ? items.map(p=>`<button type="button" class="hwat-directory-button" data-hwat-directory="${escapeHtml(p.id)}" title="${escapeHtml(p.name)}" aria-pressed="false">${escapeHtml(p.name)}</button>`).join('') : '<div class="hwat-directory-empty">No matches. Clear the search or select a different category.</div>';
      elements.count.textContent=`${items.length} of ${collection().length} shown`;
      updateSelectedStyles();
    }
    function renderAlternative() {
      const items=filtered();
      if(state.view==='materials') {
        elements.diagram.innerHTML=items.length ? `<div class="hwat-materials-grid">${items.map(p=>`<button type="button" class="hwat-material" data-hwat-item="${escapeHtml(p.id)}" aria-pressed="false"><span class="hwat-material-code">${escapeHtml(p.code)}</span><span class="hwat-material-name">${escapeHtml(p.name)}</span><span class="hwat-material-role">${escapeHtml(p.role)}</span></button>`).join('')}</div>` : '<p class="hwat-alt-no-results">No materials matched that search.</p>';
      } else {
        elements.diagram.innerHTML=items.length ? `<div class="hwat-timeline">${items.map(p=>`<button type="button" class="hwat-year" data-hwat-item="${escapeHtml(p.id)}" aria-pressed="false"><span class="hwat-year-year">${escapeHtml(p.year)}</span><span class="hwat-year-title">${escapeHtml(p.name)}</span><span class="hwat-year-summary">${escapeHtml(p.summary)}</span></button>`).join('')}</div>` : '<p class="hwat-alt-no-results">No milestones matched that search.</p>';
      }
      updateSelectedStyles();
    }
    function updateDiagramFilter() {
      const visible=new Set(filtered().map(p=>p.id));
      elements.diagram.querySelectorAll('[data-hwat-part]').forEach(el=>{
        const shown=visible.has(el.getAttribute('data-hwat-part'));
        el.classList.toggle('is-dimmed',!shown);
        el.setAttribute('tabindex',shown?'0':'-1');
        el.setAttribute('aria-hidden',String(!shown));
      });
    }
    function renderStage() {
      const [small,title]=stageCopy[state.view];
      root.dataset.hwatCurrentView=state.view;
      elements.stage.textContent=title;
      elements.overline.textContent=small;
      elements.listTitle.textContent=state.view==='board'?'Motherboard component directory':'Processor component directory';
      root.querySelectorAll('[data-hwat-view]').forEach(button=>{
        const selected=button.getAttribute('data-hwat-view')===state.view;
        button.classList.toggle('is-active',selected);
        button.setAttribute('aria-pressed',String(selected));
      });
      if(state.view==='board' || state.view==='chip') {
        elements.diagram.innerHTML=state.view==='board' ? motherboardSvg() : chipSvg();
        renderCategories(); renderDirectory(); updateDiagramFilter();
      } else {
        renderCategories(); renderDirectory(); renderAlternative();
      }
      updateSelectedStyles(); renderInspector();
      hideHover();
      updateTraceButtons();
      applyViewport();
    }
    function select(id, fromInteraction=false) {
      const p=collection().find(item=>item.id===id);
      if(!p) return;
      state.selected[state.view]=id;
      if(state.tourIndex>=0 && state.view==='board' && tour[state.tourIndex]!==id) state.tourIndex=-1;
      updateSelectedStyles(); renderInspector();
      // On small layouts the inspector is below the map: scroll to the actual information.
      if(fromInteraction && window.matchMedia && window.matchMedia('(max-width: 930px)').matches) {
        elements.inspector.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      }
    }
    function changeView(view) {
      if(!Object.prototype.hasOwnProperty.call(stageCopy,view)) return;
      state.view=view; state.category='All'; state.search=''; state.tourIndex=-1; state.trace='off';state.zoom=1;state.centerX=540;state.centerY=355;
      elements.search.value='';
      elements.search.placeholder=view==='materials'?'Search materials…':view==='history'?'Search timeline…':'Search components…';
      renderStage();
    }
    function reset() {
      state.category='All'; state.search=''; state.tourIndex=-1;state.trace='off';state.zoom=1;state.centerX=540;state.centerY=355;
      elements.search.value='';
      renderStage();
    }
    function startTour() {
      if(state.view!=='board') changeView('board');
      state.search=''; state.category='All'; elements.search.value=''; state.tourIndex=0;
      renderStage(); select(tour[0],true);
    }
    function nextTour() {
      if(state.tourIndex<0) return;
      if(state.tourIndex===tour.length-1) {state.tourIndex=-1;renderInspector(); return;}
      state.tourIndex+=1; select(tour[state.tourIndex],true);
    }

    root.addEventListener('click', event=>{
      const viewBtn=event.target.closest('[data-hwat-view]');
      if(viewBtn && root.contains(viewBtn)) { changeView(viewBtn.getAttribute('data-hwat-view')); return; }
      const filterBtn=event.target.closest('[data-hwat-category]');
      if(filterBtn && root.contains(filterBtn)) {
        state.category=filterBtn.getAttribute('data-hwat-category');
        renderCategories();renderDirectory();updateDiagramFilter(); return;
      }
      const traceBtn=event.target.closest('button[data-hwat-trace]');
      if(traceBtn && root.contains(traceBtn)) {
        state.trace=traceBtn.getAttribute('data-hwat-trace');updateTraceButtons();return;
      }
      const zoomBtn=event.target.closest('[data-hwat-zoom]');
      if(zoomBtn && root.contains(zoomBtn)) {
        const kind=zoomBtn.getAttribute('data-hwat-zoom');
        zoomTo(kind==='fit'?1:state.zoom+(kind==='in'?.4:-.4));return;
      }
      const part=event.target.closest('[data-hwat-part], [data-hwat-directory], [data-hwat-item]');
      if(part && root.contains(part)) {
        const id=part.getAttribute('data-hwat-part')||part.getAttribute('data-hwat-directory')||part.getAttribute('data-hwat-item');
        select(id,true);return;
      }
      if(event.target.closest('[data-hwat-reset]')) {reset();return;}
      if(event.target.closest('[data-hwat-tour]')) {startTour();return;}
      if(event.target.closest('[data-hwat-next-step]')) {nextTour();return;}
    });
    root.addEventListener('keydown', event=>{
      const part=event.target.closest('[data-hwat-part]');
      if(part && (event.key==='Enter'||event.key===' ')) {event.preventDefault();select(part.getAttribute('data-hwat-part'),true);}
    });
    elements.search.addEventListener('input', event=>{
      state.search=norm(event.target.value);
      if(state.view==='board'||state.view==='chip') {renderDirectory();updateDiagramFilter();}
      else renderAlternative();
    });
    elements.diagram.addEventListener('pointermove',event=>{
      if(state.drag){
        const dx=event.clientX-state.drag.x,dy=event.clientY-state.drag.y;
        const rect=elements.diagram.getBoundingClientRect();
        const factor=(1080/state.zoom)/Math.max(1,rect.width);
        state.centerX=state.drag.cx-dx*factor;
        state.centerY=state.drag.cy-dy*factor;
        applyViewport();
      }else showHover(event);
    });
    elements.diagram.addEventListener('pointerleave',hideHover);
    elements.diagram.addEventListener('pointerdown',event=>{
      // Do not hijack click/touch events on selectable regions.
      if(state.zoom<=1 || event.target.closest('[data-hwat-part]') || event.button!==0)return;
      state.drag={x:event.clientX,y:event.clientY,cx:state.centerX,cy:state.centerY};
      elements.diagram.classList.add('is-panning');hideHover();
      elements.diagram.setPointerCapture(event.pointerId);
    });
    function finishDrag(){state.drag=null;elements.diagram.classList.remove('is-panning');}
    elements.diagram.addEventListener('pointerup',finishDrag);
    elements.diagram.addEventListener('pointercancel',finishDrag);
    elements.diagram.addEventListener('wheel',event=>{
      // Control-wheel intentionally zooms the illustration, not normal page scrolling.
      if(!event.ctrlKey || !['board','chip'].includes(state.view))return;
      event.preventDefault();zoomTo(state.zoom+(event.deltaY<0?.2:-.2));
    },{passive:false});
    renderStage();
    return true;
  }

  // Host may call this again after injecting the HTML into a client-side route.
  window.HardwareAtlas = Object.freeze({ init, version:'2.0.0', counts:Object.freeze({board:board.length,chip:chip.length,materials:materials.length,history:history.length}) });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>init(),{once:true});
  else init();
})();
