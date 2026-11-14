/* ============================================================================
 * MOTHERBOARD & CHIPS · FULL STACK SILICON LAB · 4.0.0
 * Authored for Marc Lavoie | 2026-11-13 | standalone, zero dependencies.
 * The only I/O is DOM manipulation within #hardware-atlas. No telemetry/storage.
 * Educational computer and signals are explicitly conceptual, not vendor IP.
 * ============================================================================ */
(function(){'use strict';
const esc = x=>String(x ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hx = n=>(n&255).toString(16).toUpperCase().padStart(2,'0');
const bits = n=>(n&255).toString(2).padStart(8,'0');
const stepsOf = a=>a.map(([title,actor,representation,details,chip,kind])=>({title,actor,representation,details,chip,kind}));
const scenarios={
 web:{name:'Render an HTML page',intent:'From UTF-8 markup to light on a display',steps:stepsOf([
 ['Source bytes','SSD / network response','3C 68 31 3E · text bytes','HTML arrives as a file or network response. Its UTF-8 bytes represent markup characters, not machine instructions.','m2','DATA'],
 ['Host transport','NVMe / Ethernet / PCIe','NVMe READ 0x02 (if SSD-backed)','Host controllers transfer storage or network data into memory. An NVMe READ opcode belongs to the NVM command set and is not executed by the CPU as a native instruction.','pcie-x16','PROTOCOL'],
 ['Memory residency','DRAM / CPU caches','0x3C = ASCII <','The operating system and browser hold source bytes in RAM. Cache and memory cells retain patterns whose meaning comes from software.','dimm','DATA'],
 ['HTML parsing','CPU running browser','DOM: element h1, text Hi','The CPU runs browser machine code that parses HTML and creates nodes. HTML markup is interpreted as a data format.','cpu-cores','INSTRUCTION'],
 ['Style and layout','Browser / CPU','CSS rules → layout boxes','Browser code computes visual styles, geometry and paint commands. There is no universal binary opcode for an HTML heading.','cpu-cores','SOFTWARE'],
 ['Rendering','Graphics pipeline / GPU','RGBA bytes (illustrative)','Rendering commands, shaders and image data generate or update a frame buffer. Shader ISA differs from CPU ISA and depends on GPU vendor.','gpu-cores','GPU'],
 ['Display scanout','Display engine / monitor','Video stream (format-dependent)','The display controller transmits timed image information over the relevant display link; monitor electronics produce light.','rear-io','PHYSICAL']
 ])},
 boot:{name:'Power-on and UEFI boot',intent:'Control signals lead to authenticated software execution',steps:stepsOf([
 ['Standby power','ATX supply / RTC domain','PS_ON# = logic low (typical)','The power button is not a stream of CPU instructions. Platform power logic requests power rails and checks readiness.','atx24','POWER'],
 ['Regulated rails','VRM + power controller','PWM switching duty cycle','VRMs deliver regulated core power. PWM transitions control power stages, not general-purpose CPU code.','vrm','POWER'],
 ['Platform reset','CPU / firmware platform','Reset vector (ISA/platform-specific)','After clocks and power become valid, hardware reset transfers control to platform-defined firmware entry mechanisms.','cpu-socket','CONTROL'],
 ['Read firmware','SPI NOR + controller','SPI READ 03 + address (typical)','The flash device responds to commands and returns stored firmware bytes. It is the CPU that executes applicable firmware machine code.','bios','PROTOCOL'],
 ['Initialize hardware','UEFI services and drivers','UEFI PE/COFF image bytes (example)','Firmware configures memory, buses and controllers. Secure Boot, where enabled, verifies certain boot components according to policy.','chipset','FIRMWARE'],
 ['Boot loader','UEFI → OS loader','EFI executable / OS image','The boot manager loads and hands off to a bootloader or OS entry point. TPM measurements, if used, are separate from Secure Boot authorization.','dimm','SOFTWARE'],
 ['OS services','CPU + DRAM + devices','Device driver native code','The kernel configures virtual memory, scheduling and device drivers; applications and browsers can then run.','cpu-cores','INSTRUCTION']
 ])},
 storage:{name:'NVMe file read',intent:'Follow a storage request from program to NAND',steps:stepsOf([
 ['Application request','Application / OS API','read(fd, buffer, length) (concept)','Software requests file bytes. The OS checks permissions and may satisfy the request from page cache instead of physical storage.','cpu-cores','SOFTWARE'],
 ['Translate file request','Filesystem + block layer','LBA + block count (if physical I/O)','The filesystem translates offsets and metadata into block I/O when a device operation is needed.','dimm','SOFTWARE'],
 ['Submission queue','NVMe host driver / RAM','NVM READ opcode 0x02','Host software fills a command entry in an NVMe submission queue, including address/length fields. One opcode byte alone is not a command.','dimm','PROTOCOL'],
 ['Notify controller','CPU / PCIe root port','MMIO doorbell register write','The host updates the submission queue tail doorbell. A PCIe transaction delivers that register write to the device.','pcie-phy','PROTOCOL'],
 ['Execute flash access','SSD controller and NAND','Flash page reads + ECC','SSD firmware maps logical blocks to physical NAND, applies error correction and retrieves data. No universal NAND instruction stream belongs to the M.2 connector.','m2','DEVICE'],
 ['Transfer data','PCIe / DMA into RAM','DMA data buffer','The SSD controller typically uses DMA to move data via PCIe into mapped host memory buffers. The IOMMU may constrain translations and access.','pcb','DATA'],
 ['Completion','NVMe completion queue / CPU','Completion entry + interrupt/poll','The device posts completion status, and the OS makes bytes available to requesting software.','cpu-cores','CONTROL']
 ])},
 keyboard:{name:'USB keyboard press',intent:'One key crosses HID, USB, interrupts and a browser',steps:stepsOf([
 ['Key closes switch','Keyboard matrix electronics','Pressed / released state','Keyboard MCU scans a switch matrix and filters bounce; no ASCII character has yet been determined.','usb-header','PHYSICAL'],
 ['HID report formed','Keyboard microcontroller','Usage 0x04 = keyboard A','In a typical HID keyboard usage page, 0x04 identifies the A-position key. The actual character depends on layout/modifiers.','usb-header','DATA'],
 ['USB transfers report','USB link / host controller','00 00 04 00 00 00 00 00','An eight-byte boot keyboard report is transferred through USB endpoint transactions (not a raw wire packet).','rear-io','PROTOCOL'],
 ['DMA / event handling','Host controller + OS','Ring entries / interrupt','Controller and driver process transfer events, possibly using DMA; the OS input subsystem interprets reports.','chipset','CONTROL'],
 ['Input event dispatched','OS / browser event loop','KeyboardEvent.key = "a" (example)','Layout and active modifiers determine the event. Browser processes input using software running as CPU machine code.','cpu-cores','SOFTWARE'],
 ['Web page updates','DOM / layout / GPU','Character "a" → UTF-8 61 if encoded','The JavaScript event handler may update DOM state; the browser paints glyphs on screen. Key usage 0x04 and text byte 0x61 have different meanings.','gpu-cores','DATA']
 ])},
 network:{name:'HTTPS response',intent:'Packets enter RAM and turn into browser content',steps:stepsOf([
 ['Bits on physical medium','Ethernet or Wi-Fi PHY','PHY line symbols (link dependent)','PHY and radio electronics recover and decode link symbols. Ethernet and Wi-Fi have different frame formats and modulation.','ethernet','PHYSICAL'],
 ['Frame received','NIC MAC / driver','EtherType 08 00 → IPv4','The NIC checks link-layer framing and integrity and provides packet data to host memory. The example is an Ethernet II header field.','ethernet','PROTOCOL'],
 ['IP and transport','Network stack','IP / TCP packet headers','The OS handles relevant network headers, connection state, ordering and transport checks.','dimm','DATA'],
 ['TLS authenticated decryption','Browser / TLS implementation','Authenticated TLS records','TLS normally authenticates the server via certificates and decrypts application data in a negotiated secure channel. Payload is not readable plaintext before successful decryption.','cpu-cores','SOFTWARE'],
 ['HTTP and HTML bytes','Browser parser','3C 70 3E → <p>','Application-level bytes can contain HTML text; browsers interpret the content as markup according to content type and parser rules.','dimm','DATA'],
 ['Page rendered','Browser / graphics pipeline','DOM → draw commands → pixels','Browser machine instructions and optional GPU acceleration produce the visible result.','gpu-cores','GPU']
 ])},
 display:{name:'Display a frame',intent:'From program logic to the monitor panel',steps:stepsOf([
 ['Scene changes','Browser DOM and compositor','Layout tree / render data','A JavaScript or CSS update changes visible content. Browser engines prepare paint and compositing instructions.','cpu-cores','SOFTWARE'],
 ['Commands prepared','Graphics driver + user-mode runtime','GPU command buffer (vendor-specific)','Graphics APIs and drivers encode GPU commands; the format is not a universal x86 instruction stream.','dimm','DATA'],
 ['GPU work submitted','PCIe / integrated fabric','MMIO / shared-memory queues','Commands are transported through the platform’s graphics submission mechanism, which may be on-die or over PCIe.','pcie-x16','PROTOCOL'],
 ['Shader and raster work','GPU execution hardware','Architecture-specific shader instructions','GPU processors calculate samples and pixel colors, writing color buffers in appropriate memory.','gpu-cores','GPU'],
 ['Frame buffer available','VRAM / shared memory','Pixel values, e.g. FF 80 40 FF','Encoded pixels represent color/channel samples in a format that depends on the render target.','memory-controller','DATA'],
 ['Display timing and link','Display engine / rear I/O','Link-encoded pixel/timing symbols','Scanout reads display buffers, sends formatted data across a link, and monitor hardware drives pixel elements.','rear-io','PHYSICAL']
 ])}
};
const opcodes={NOP:{code:0x00,arg:false},LDI:{code:0x10,arg:true},LDA:{code:0x11,arg:true},STA:{code:0x12,arg:true},ADD:{code:0x20,arg:true},ADM:{code:0x21,arg:true},XOR:{code:0x22,arg:true},SUB:{code:0x23,arg:true},JMP:{code:0x30,arg:true},JZ:{code:0x31,arg:true},JNZ:{code:0x32,arg:true},OUT:{code:0x40,arg:false},HLT:{code:0xFF,arg:false}};
const reverseOp=Object.fromEntries(Object.entries(opcodes).map(([k,v])=>[v.code,k]));
const cpuSamples={
 sum:'; Add two immediate values\nLDI 5\nADD 7\nOUT\nHLT',
 memory:'; Store 42 to RAM address 0x80, load it and output\nLDI 42\nSTA 0x80\nLDI 0\nLDA 0x80\nOUT\nHLT',
 countdown:'; Count down and branch until zero\nLDI 3\nloop: OUT\nSUB 1\nJNZ loop\nHLT',
 xor:'; XOR of 0b10101010 and 0b11110000\nLDI 0xAA\nXOR 0xF0\nOUT\nHLT'
};
function assemble(text){
 const tokens=[],labels=new Map(),rows=text.split(/\r?\n/);let pc=0;
 for(let i=0;i<rows.length;i++){
  let line=rows[i].split(';')[0].trim();if(!line)continue;
  const labelMatch=line.match(/^([A-Za-z_][A-Za-z_0-9]*):\s*(.*)$/);
  if(labelMatch){const key=labelMatch[1].toLowerCase();if(labels.has(key))throw Error(`Line ${i+1}: duplicate label ${key}`);labels.set(key,pc);line=labelMatch[2].trim();if(!line)continue;}
  const match=line.match(/^([A-Za-z]+)(?:\s+(.+))?$/);if(!match)throw Error(`Line ${i+1}: invalid assembly syntax`);
  const mnemonic=match[1].toUpperCase(),def=opcodes[mnemonic];if(!def)throw Error(`Line ${i+1}: unsupported instruction ${mnemonic}`);
  const operand=(match[2]||'').trim();if(def.arg && !operand)throw Error(`Line ${i+1}: ${mnemonic} requires one operand`);if(!def.arg&&operand)throw Error(`Line ${i+1}: ${mnemonic} does not accept operands`);
  if(pc+2>256)throw Error(`Line ${i+1}: program exceeds 256-byte address space`);
  tokens.push({pc,line:i+1,mnemonic,operand});pc+=2;
 }
 if(tokens.length===0)throw Error('No instructions: enter at least one instruction.');
 const memory=new Uint8Array(256);
 for(const t of tokens){let arg=0;
  if(t.operand){if(/^[A-Za-z_][A-Za-z_0-9]*$/.test(t.operand)){
    const key=t.operand.toLowerCase();if(!labels.has(key))throw Error(`Line ${t.line}: unknown label ${t.operand}`);arg=labels.get(key);
   }else if(/^(?:0x[0-9a-f]+|[0-9]+)$/i.test(t.operand)){arg=/^0x/i.test(t.operand)?parseInt(t.operand,16):parseInt(t.operand,10);}else throw Error(`Line ${t.line}: malformed operand ${t.operand}`);
   if(!Number.isInteger(arg)||arg<0||arg>255)throw Error(`Line ${t.line}: operand must fit in 0..255`);
  }
  memory[t.pc]=opcodes[t.mnemonic].code;memory[t.pc+1]=arg;
 }
 return {memory,tokens,size:pc};
}
class TinyCPU{
 constructor(program){this.memory=program.memory.slice();this.tokens=program.tokens;this.size=program.size;this.pc=0;this.a=0;this.z=1;this.c=0;this.halted=false;this.cycles=0;this.outputs=[];this.log=[];this.lastRead=null;this.lastWrite=null;this.micro=['Ready: fetch opcode at PC=0x00','Decode two-byte instruction','Execute using accumulator A','Commit flags, memory and next PC'];this.error='';}
 step(){if(this.halted)return false;
  const at=this.pc;
  if(at>254 || at%2!==0){this.error=`Invalid instruction address 0x${hx(at)}.`;this.halted=true;return false;}
  const opcode=this.memory[at],operand=this.memory[at+1],mn=reverseOp[opcode];
  if(!mn){this.error=`Unknown opcode 0x${hx(opcode)} at 0x${hx(at)}.`;this.halted=true;return false;}
  this.pc=at+2;this.cycles++;this.lastRead=null;this.lastWrite=null;
  let desc=mn+(['NOP','OUT','HLT'].includes(mn)?'':' '+`0x${hx(operand)}`);
  const setAcc=(raw,carry=0)=>{this.a=raw&255;this.z=+(this.a===0);this.c=carry?1:0;};
  switch(mn){
   case 'NOP':break;
   case 'LDI':setAcc(operand);break;
   case 'LDA':this.lastRead=operand;setAcc(this.memory[operand]);break;
   case 'STA':this.lastWrite=operand;this.memory[operand]=this.a;break;
   case 'ADD':{const raw=this.a+operand;setAcc(raw,raw>255);break;}
   case 'ADM':{const raw=this.a+this.memory[operand];this.lastRead=operand;setAcc(raw,raw>255);break;}
   case 'SUB':{const raw=this.a-operand;setAcc(raw,raw<0);break;}
   case 'XOR':setAcc(this.a^operand);break;
   case 'JMP':this.pc=operand;break;
   case 'JZ':if(this.z)this.pc=operand;break;
   case 'JNZ':if(!this.z)this.pc=operand;break;
   case 'OUT':this.outputs.push(this.a);break;
   case 'HLT':this.halted=true;break;
  }
  this.micro=[`FETCH · RAM[0x${hx(at)}] = 0x${hx(opcode)}; RAM[0x${hx(at+1)}] = 0x${hx(operand)}`,
   `DECODE · ${desc}`, `EXECUTE · ${mn==='OUT'?'Emit A to output port':mn==='STA'?'Write A into memory':mn==='LDA'?'Read a byte into accumulator':mn==='HLT'?'Stop execution':mn==='JMP'||mn==='JNZ'||mn==='JZ'?'Evaluate branch / update PC':'Apply accumulator operation'}`,
   `COMMIT · PC=0x${hx(this.pc)} A=0x${hx(this.a)} Z=${this.z} C=${this.c}`];
  this.log.unshift(`${String(this.cycles).padStart(2,'0')}. 0x${hx(at)}  ${desc}  → A=${hx(this.a)} PC=${hx(this.pc)}`);if(this.log.length>14)this.log.length=14;
  return true;
 }
}
const questions=[
 ['What does the x86 byte 0xB8 represent in the example MOV EAX,42?',['The UTF-8 character B','The x86 opcode for MOV immediate to EAX','A PCIe TLP header','The DRAM refresh command'],1,'In the x86 example, B8 starts a MOV EAX,imm32 instruction. Its following four bytes encode the immediate integer.'],
 ['Which component actually interprets the 0x02 NVMe NVM READ command?',['The M.2 connector alone','The CPU as an x86 opcode','The NVMe SSD controller','The ATX power supply'],2,'0x02 is an NVMe NVM command opcode interpreted by a compatible NVMe controller. The host driver builds the full command in an NVMe queue.'],
 ['Why is the HTML string <h1>Hi</h1> not executed directly as CPU machine code?',['HTML encodes document structure, not CPU instructions','Because source text is never stored in RAM','Because SSDs execute HTML','Because transistors have no binary behavior'],0,'A browser reads HTML as data. The CPU executes the browser implementation, whose machine code parses the document.'],
 ['Which physical motherboard component is primarily a signal route, not a chip interpreter?',['CPU core','NAND controller','PCIe slot copper contacts','GPU shader processor'],2,'Connectors and copper traces convey electrical signals. Connected controllers interpret packets, commands and data.'],
 ['What does the 0x04 value represent in a USB HID boot keyboard report?',['The ASCII code for the character a','A standard keyboard usage for the A-position key','A processor instruction','The USB line voltage'],1,'The keyboard usage identifies a key position; layout and modifiers determine the produced character. The ASCII/UTF-8 byte for lowercase a is 0x61.'],
 ['Which statement correctly describes a CMOS inverter?',['Logic 0 input produces logic 1 output, and vice versa','It always stores an entire byte','It directly parses HTML','It is an NVMe command'],0,'Complementary transistors implement NOT logic. Practical circuits have analog transition regions and timing constraints.'],
 ['What happens when EDU-8 adds 250 and 10?',['A becomes 260','A becomes 4 and carry becomes 1','The CPU emits a PCIe packet','A always becomes 0'],1,'8-bit arithmetic wraps modulo 256, so 260 becomes 4 with unsigned carry-out set.'],
 ['In little-endian memory, how is 32-bit 0x0000002A stored?',['00 00 00 2A','2A 00 00 00','00 2A 00 00','2A 2A 2A 2A'],1,'The least-significant byte is placed first. This is independent of how an assembler may print the value.'],
 ['Does a heatsink contain motherboard machine code?',['Yes, CPUs execute it','Only when connected through SATA','No; it transfers heat and is passive','Only if it uses DDR5'],2,'Heatsinks provide thermal conduction, not an instruction-set execution function. Sensors nearby are separate devices.'],
 ['What does a SPI NOR 0x9F command commonly request?',['JEDEC identification','An Intel instruction','A USB keystroke','A motherboard reset pin'],0,'Many SPI NOR chips use 0x9F as a JEDEC ID read command; precise response bytes vary by part.'],
 ['Which technology typically moves an NVMe read payload into host RAM?',['DMA over a supported platform link','TextEncoder directly','Power-supply PWM','An ASCII decoder in the motherboard PCB'],0,'NVMe controllers normally DMA between device and mapped host memory; the host can use an IOMMU for DMA isolation.'],
 ['Why must SPI and UART waveform diagrams differ?',['Their framing, clocking and bit orders differ','All serial links share the same encoding','SPI is a transistor type','UART sends CPU instructions only'],0,'SPI commonly uses a separate clock and mode-defined sample edges; UART 8N1 uses start/data/stop bits without a shared clock.'],
 ['Does enabling UEFI Secure Boot automatically encrypt a disk?',['Yes, by definition','No; boot authorization and data-at-rest encryption are separate','Only on SATA SSDs','Only when DRAM uses ECC'],1,'Secure Boot applies image signature/policy validation; storage encryption requires separate protection.'],
 ['Where does a browser DOM node normally live while the page is open?',['As browser-managed data in memory','As an opcode on every motherboard trace','In the CMOS battery','Only inside the monitor'],0,'DOM nodes are browser-managed software data structures in RAM; the exact layout is engine-specific.'],
 ['What is an architectural limitation of the EDU-8 example?',['It cannot demonstrate arithmetic','It is not a vendor ISA or a faithful microarchitecture model','It lacks individual binary opcodes','It cannot access any RAM'],1,'EDU-8 intentionally simplifies to a two-byte instruction format, accumulator, flags and 256 bytes of RAM.']
];
const glossary=[
 ['Bit','A logical binary digit, 0 or 1. Hardware implements states through physical electrical behavior.'],
 ['Byte','Eight bits; one byte can represent an integer, text encoding unit, opcode fragment or data field.'],
 ['Opcode','An instruction or device command field whose meaning comes from its instruction set or protocol.'],
 ['ISA','Instruction Set Architecture: the software-visible machine instructions, registers and execution rules.'],
 ['Microarchitecture','Hardware organization implementing an ISA: pipelines, caches, execution units and predictors.'],
 ['Transistor','Electronic semiconductor device used as a switch or amplifier; complementary MOSFETs form CMOS logic.'],
 ['MOSFET','Metal-oxide-semiconductor field-effect transistor, controlled by gate-to-channel voltage.'],
 ['CMOS','Complementary metal-oxide-semiconductor: logic technology combining n- and p-channel devices.'],
 ['NAND','Boolean gate whose output is 0 only when all its inputs are 1.'],
 ['Flip-flop','Clocked digital storage circuit commonly holding one logical state bit.'],
 ['SRAM','Static random-access memory, usually transistor-based bit cells; widely used in caches.'],
 ['DRAM','Dynamic random-access memory, capacitor-based storage cells requiring refresh.'],
 ['DDR','Double data rate memory interface transfers data on both edges of a timing reference.'],
 ['PCIe','Packetized high-speed serial expansion interconnect using differential lanes and layered protocols.'],
 ['TLP','PCI Express Transaction Layer Packet; carries requests/completions and related metadata.'],
 ['DMA','Direct Memory Access: a device transfers data to/from system memory through permitted bus transactions.'],
 ['IOMMU','Input/Output Memory Management Unit; may translate and restrict DMA address access.'],
 ['NVMe','NVM Express: host/device command sets for non-volatile memory, widely used with PCIe.'],
 ['NAND flash','Non-volatile semiconductor storage technology; managed by a flash controller and translation layer.'],
 ['UEFI','Platform firmware architecture providing boot and pre-OS services.'],
 ['SPI','Serial Peripheral Interface; a clocked synchronous peripheral link with modes defining clock timing.'],
 ['UART','Asynchronous serial transmit/receive interface using agreed frame settings and local bit timing.'],
 ['I²C','Two-wire bus using shared clock/data lines, addressing and acknowledgement cycles.'],
 ['PHY','Physical-layer transceiver implementing electrical or optical line signaling.'],
 ['PWM','Pulse-width modulation; duty cycle of repetitive pulses carries control information.'],
 ['UTF-8','Variable-length character encoding converting Unicode text into byte sequences.'],
 ['DOM','Document Object Model, the browser’s structured in-memory representation of document nodes.'],
 ['JIT','Just-in-time compilation, an optional runtime method producing machine code while a program runs.'],
 ['MMIO','Memory-mapped I/O: CPU reads/writes special address ranges to communicate with device registers.'],
 ['Endianness','Byte order used to represent multi-byte values in memory or a specified protocol field.'],
 ['GPIO','General-purpose input/output pins used for digital states and control signals.'],
 ['ECC','Error-correcting code; provides mechanisms to detect and potentially correct some bit errors.'],
 ['Secure Boot','UEFI mechanism to enforce policy for authorized boot images; not identical to encryption.'],
 ['Framebuffer','Memory representation of pixels or display surfaces, often consumed by display scanout.'],
 ['HID','Human Interface Device; USB HID reports encode keyboard and other interaction data.']
];
function init(target){
 const root=typeof target==='string'?document.querySelector(target):target||document.getElementById('hardware-atlas');
 if(!root||root.dataset.hwatAdvancedReady==='true'||!root.querySelector('[data-bin-content="cpu"]'))return false;
 const $=s=>root.querySelector(s),$$=s=>Array.from(root.querySelectorAll(s));
 const state={scenario:'web',trace:0,cpu:null,cpuSelected:0,scopeMode:'spi',scopeByte:0x9f,scopeAt:0,isaMode:'x86',isaValue:42,q:0,answers:new Map()};
 function gotoChip(id){
  // Existing v3 links own motherboard inspector selection and return navigation.
  const button=$(`[data-bin-jump="${id}"]`);if(button){button.click();return;}
  const profile=window.HardwareBinaryAtlas?.lookup(id);if(!profile)return;
  const targetTab=$(`[data-hwat-view="${profile.layer}"]`);if(targetTab)targetTab.click();
  const directory=$(`[data-hwat-directory="${id}"]`);if(directory)directory.click();
 }
 function renderScenario(){
  const chosen=scenarios[state.scenario],steps=chosen.steps;
  state.trace=Math.max(0,Math.min(steps.length-1,state.trace));const current=steps[state.trace];
  $('[data-v4-trace-title]').textContent=`${chosen.name} / ${chosen.intent}`;
  $('[data-v4-trace-map]').innerHTML=steps.map((step,i)=>`<button type="button" data-v4-trace-step="${i}" class="hwat-v4-route-node ${i===state.trace?'is-current':''} ${i<state.trace?'is-complete':''}" aria-pressed="${i===state.trace}"><span class="hwat-v4-route-number">${String(i+1).padStart(2,'0')}</span><span class="hwat-v4-route-copy"><strong>${esc(step.title)}</strong><small>${esc(step.actor)}</small></span><span class="hwat-v4-route-kind">${esc(step.kind)}</span></button>`).join('');
  $('[data-v4-trace-detail]').innerHTML=`<p class="hwat-v4-kicker">STAGE ${state.trace+1} OF ${steps.length} · ${esc(current.kind)}</p><h4>${esc(current.title)}</h4><p class="hwat-v4-actor">${esc(current.actor)}</p><div class="hwat-v4-encoding"><small>REPRESENTATION AT THIS STAGE</small><code>${esc(current.representation)}</code></div><p>${esc(current.details)}</p><div class="hwat-v4-tip"><strong>Related physical structure</strong><p>This stage may interact with the component highlighted below; not all platforms put this function in a separate discrete chip.</p><button type="button" data-v4-goto-chip="${esc(current.chip)}">Inspect ${esc(window.HardwareBinaryAtlas?.lookup(current.chip)?.name || current.chip)} ↗</button></div><div class="hwat-v4-trace-count">${state.trace+1} / ${steps.length}</div>`;
  $('[data-v4-scenario-prev]').disabled=state.trace===0;$('[data-v4-scenario-next]').disabled=state.trace===steps.length-1;
 }
 function cpuCompile(){
  try{
    const program=assemble($('[data-v4-cpu-source]').value);
    state.cpu=new TinyCPU(program);state.cpuSelected=0;$('[data-v4-cpu-error]').textContent='Assembled '+program.tokens.length+' instructions ('+program.size+' bytes). Ready to step.';
    $('[data-v4-cpu-error]').dataset.error='false';renderCPU();return true;
  }catch(err){state.cpu=null;$('[data-v4-cpu-error]').textContent=err.message;$('[data-v4-cpu-error]').dataset.error='true';renderCPU();return false;}
 }
 function renderCPU(){const cpu=state.cpu;
  if(!cpu){$('[data-v4-cpu-registers]').innerHTML='<p>Fix the assembly error to enable execution.</p>';for(const id of ['disassembly','microsteps','output','log','memory','memory-detail'])$(`[data-v4-cpu-${id}]`).innerHTML='';return;}
  $('[data-v4-cpu-registers]').innerHTML=[['PC',`0x${hx(cpu.pc)}`,'Program counter'],['A',`0x${hx(cpu.a)}`,'Accumulator'],['Z',String(cpu.z),'Zero flag'],['C',String(cpu.c),'Carry / borrow'],['STEPS',String(cpu.cycles),'Executed instructions'],['STATE',cpu.halted?'HALTED':'READY','Execution status']].map(([k,v,sub])=>`<div><small>${k}</small><strong>${esc(v)}</strong><span>${sub}</span></div>`).join('');
  $('[data-v4-cpu-disassembly]').innerHTML=`<div class="hwat-v4-list-head"><span>ADDR</span><span>BYTES</span><span>ASSEMBLY</span></div>${cpu.tokens.map(t=>`<div class="hwat-v4-dis-row ${cpu.pc===t.pc&&!cpu.halted?'is-current':''}"><code>${hx(t.pc)}</code><code>${hx(cpu.memory[t.pc])} ${hx(cpu.memory[t.pc+1])}</code><span>${esc(t.mnemonic+' '+(t.operand||''))}</span></div>`).join('')}`;
  $('[data-v4-cpu-microsteps]').innerHTML=`<div class="hwat-v4-subheading">FOUR MICRO-OPERATION PHASES (CONCEPTUAL)</div>${cpu.micro.map((step,i)=>`<div><span>0${i+1}</span><p>${esc(step)}</p></div>`).join('')}`;
  $('[data-v4-cpu-output]').innerHTML=`<div class="hwat-v4-subheading">OUTPUT PORT · ${cpu.outputs.length} EMISSIONS</div><code>${cpu.outputs.length?cpu.outputs.map(n=>`${n} (0x${hx(n)})`).join(' · '):'— no values emitted —'}</code>`;
  $('[data-v4-cpu-log]').innerHTML=`<div class="hwat-v4-subheading">INSTRUCTION EXECUTION HISTORY</div>${cpu.error?`<p class="hwat-v4-log-error">${esc(cpu.error)}</p>`:''}${cpu.log.map(line=>`<p>${esc(line)}</p>`).join('')||'<p>No instructions executed yet.</p>'}`;
  $('[data-v4-cpu-memory]').innerHTML=Array.from(cpu.memory,(n,i)=>`<button data-v4-memory-address="${i}" type="button" aria-label="RAM address 0x${hx(i)} contains 0x${hx(n)}" aria-pressed="${state.cpuSelected===i}" class="${i===cpu.pc&&!cpu.halted?'is-next':''} ${i===cpu.lastWrite?'is-write':''} ${i===cpu.lastRead?'is-read':''} ${i>=cpu.size&&n===0?'is-empty':''} ${state.cpuSelected===i?'is-selected':''}" title="0x${hx(i)} → 0x${hx(n)}"><small>${hx(i)}</small><strong>${hx(n)}</strong></button>`).join('');
  const addr=state.cpuSelected;
  $('[data-v4-cpu-memory-detail]').innerHTML=`<span>SELECTED RAM ADDRESS</span><strong>0x${hx(addr)}</strong><code>${bits(cpu.memory[addr])}₂ = ${cpu.memory[addr]}₁₀</code><p>${addr<cpu.size?'Within assembled program region':'General memory/data region'} · ${cpu.lastRead===addr?'Last data read · ':''}${cpu.lastWrite===addr?'Last data write · ':''}Memory is byte-addressable in this educational model.</p>`;
  $('[data-v4-cpu-step]').disabled=cpu.halted;$('[data-v4-cpu-run]').disabled=cpu.halted;
 }
 function scopeSvg(){const spi=state.scopeMode==='spi',value=state.scopeByte,at=state.scopeAt;
  const W=840,H=spi?310:232,x0=98,dx=84;
  const data=Array.from({length:8},(_,i)=>spi?((value>>(7-i))&1):((value>>i)&1));
  const uart=[1,0,...data,1,1];
  function waveform(seq,yHigh,yLow,x,unit){let d=`M${x},${seq[0]?yHigh:yLow}`;for(let i=0;i<seq.length;i++){const yy=seq[i]?yHigh:yLow;d+=` H${x+(i+1)*unit}`;if(i<seq.length-1 && seq[i+1]!==seq[i])d+=` V${seq[i+1]?yHigh:yLow}`;}return d;}
  let paths='',lines='',labels='';
  if(spi){
   const clock=Array.from({length:16},(_,i)=>i%2===1?1:0);
   const mosi=data.flatMap(n=>[n,n]);
   paths=`<path d="${waveform(Array(16).fill(0),80,112,x0,dx/2)}" stroke="#8ea6b9" stroke-width="3" fill="none"/><path d="${waveform(clock,69,110,x0,dx/2)}" stroke="#f1bd71" stroke-width="3" fill="none"/><path d="${waveform(mosi,160,205,x0,dx/2)}" stroke="#66e3d2" stroke-width="3.5" fill="none"/><path d="M98,255 H770" stroke="#c0a2ec" stroke-width="3" fill="none"/>`;
   labels=`<text x="10" y="92">SCLK</text><text x="10" y="182">MOSI</text><text x="10" y="258">CS#</text><text x="98" y="285" font-size="12">CS# low throughout this byte; MOSI setup before each rising SCLK edge (mode 0)</text>`;
   lines=Array.from({length:8},(_,i)=>`<path d="M${x0+i*dx} 40 V275" stroke="#426075" stroke-width="1" stroke-dasharray="3 8"/>${i===at?`<rect x="${x0+i*dx}" y="30" width="${dx}" height="246" fill="#46d1bf" opacity=".09"/>`:''}<text x="${x0+i*dx+dx/2}" y="22" text-anchor="middle" font-size="12">b${7-i} = ${data[i]}</text><circle cx="${x0+i*dx+dx/4}" cy="69" r="4" fill="#e6b466"/>`).join('');
  }else{
   const start=98,unit=61;
   const signal=[0,...data,1];
   paths=`<path d="${waveform([1,...signal,1],65,127,start-unit,unit)}" fill="none" stroke="#6ce4d2" stroke-width="4"/>`;
   labels=`<text x="8" y="95">TX</text><text x="98" y="191" font-size="12">START (0)</text><text x="698" y="191" font-size="12">STOP (1)</text>`;
   lines=Array.from({length:10},(_,i)=>{const x=start+i*unit;const active=i===at+1;return `<path d="M${x} 36 V168" stroke="#456174" stroke-dasharray="3 7"/>${active?`<rect x="${x}" y="28" width="${unit}" height="146" fill="#65ebd8" opacity=".10"/>`:''}<text x="${x+unit/2}" y="21" text-anchor="middle" font-size="11">${i===0?'START':i===9?'STOP':'b'+(i-1)}</text>`;}).join('');
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${spi?'SPI mode zero clock and MOSI signal':'UART 8N1 transmit signal'} for hexadecimal ${hx(value)}, selected bit ${at}"><rect x="0" y="0" width="${W}" height="${H}" rx="11" fill="#081423"/>${lines}${paths}<g font-size="14" font-family="system-ui, sans-serif" fill="#b7cfde" font-weight="600">${labels}</g></svg>`;
 }
 function renderScope(){const spi=state.scopeMode==='spi',value=state.scopeByte,at=state.scopeAt;
  $('[data-v4-scope-heading]').textContent=spi?`SPI mode 0 · MOSI 0x${hx(value)} · MSB first`:`UART 8N1 · TX 0x${hx(value)} · LSB first`;
  $('[data-v4-scope-chart]').innerHTML=scopeSvg();$('[data-v4-scope-hex]').value=hx(value);$('[data-v4-scope-position]').value=at;$('[data-v4-scope-mode]').value=state.scopeMode;
  const digit=spi?7-at:at,one=(value>>digit)&1;
  $('[data-v4-scope-readout]').innerHTML=`<div><small>CURRENT BIT</small><strong>b${digit}</strong></div><div><small>LOGIC VALUE</small><strong>${one}</strong></div><div><small>BYTE / DECIMAL</small><strong>0x${hx(value)} / ${value}</strong></div><div><small>SERIAL ORDER</small><strong>${spi?'MSB → LSB':'LSB → MSB'}</strong></div>`;
  $('[data-v4-scope-bits]').innerHTML=Array.from({length:8},(_,i)=>{const b=spi?7-i:i;return `<button data-v4-scope-bit="${i}" class="${at===i?'is-current':''}" type="button" aria-pressed="${at===i}"><small>b${b}</small><strong>${(value>>b)&1}</strong></button>`;}).join('');
  $('[data-v4-scope-fact]').innerHTML=spi?'<strong>SPI mode 0:</strong> CPOL=0, CPHA=0; the illustrative master places MOSI data ahead of each rising clock edge and the receiver samples on that edge. CS# is asserted for this command byte. A complete 0x9F JEDEC exchange requires additional response clocks and device-specific output. Real rise times, timing margins and voltages are not modeled.':'<strong>UART 8N1:</strong> idle-high line, one low start bit, eight data bits LSB-first, no parity, and one high stop bit. Samples occur near each bit interval center under agreed baud timing. The waveform is idealized; real edges and clock tolerance are not modeled.';
 }
 function renderISA(){const riscv=state.isaMode==='riscv';const field=$('[data-v4-isa-value]');field.min=riscv?'-2048':'0';field.max=riscv?'2047':'4294967295';
  let n=Number(field.value);if(!Number.isInteger(n))n=42;n=Math.min(riscv?2047:4294967295,Math.max(riscv?-2048:0,n));state.isaValue=n;field.value=String(n);
  $$('[data-v4-isa-mode]').forEach(b=>{const yes=b.dataset.v4IsaMode===state.isaMode;b.classList.toggle('is-active',yes);b.setAttribute('aria-pressed',String(yes));});
  let bytes,fields,details,title,note;
  if(riscv){
   // Canonical RV32I I-format: imm[11:0] at 31:20, rs1=x0, funct3=000, rd=x5, opcode=0010011.
   const word=(((n&4095)<<20)|(0<<15)|(0<<12)|(5<<7)|0x13)>>>0;
   bytes=[word&255,(word>>>8)&255,(word>>>16)&255,(word>>>24)&255];
   title=`ADDI x5, x0, ${n}`;
   fields=[['imm[11:0]',12,(n&4095).toString(2).padStart(12,'0')],['rs1',5,'00000'],['funct3',3,'000'],['rd',5,'00101'],['opcode',7,'0010011']];
   details=`<p><strong>Meaning:</strong> x5 ← (x0 + ${n}) mod 2³². Since x0 reads as zero, x5 receives the sign-extended immediate.</p><p><strong>Instruction word:</strong> 0x${word.toString(16).toUpperCase().padStart(8,'0')}</p><p><strong>Format:</strong> RV32I I-type; fixed 32-bit uncompressed instruction. Fields shown in MSB→LSB instruction-word order.</p><p><strong>Hardware:</strong> CPU instruction decoder and integer ALU; associated memory contains the four bytes in little-endian order.</p>`;
   note=`For n = ${n}, encoding = 0x${word.toString(16).toUpperCase().padStart(8,'0')} and little-endian bytes = ${bytes.map(hx).join(' ')}. Signed immediate range is −2048..2047.`;
  }else{
   const u=n>>>0;bytes=[0xB8,u&255,(u>>>8)&255,(u>>>16)&255,(u>>>24)&255];
   title=`MOV EAX, ${n}`;
   fields=[['opcode B8',8,'10111000'],['imm32',32,Array.from({length:4},(_,i)=>bits(bytes[4-i])).join(' ')]];
   details=`<p><strong>Meaning:</strong> EAX ← ${n} (as an unsigned 32-bit value). In 64-bit mode, a write to EAX zero-extends into RAX.</p><p><strong>Encoding:</strong> B8 plus a four-byte immediate, little-endian.</p><p><strong>Format:</strong> Variable-length x86 instruction, five bytes for this example.</p><p><strong>Hardware:</strong> CPU decodes an instruction stream from instruction cache and commits register state.</p>`;
   note=`For n = ${n}, opcode B8 is followed by the 32-bit little-endian immediate ${bytes.slice(1).map(hx).join(' ')}. The bytes encode actual x86 machine code.`;
  }
  $('[data-v4-isa-title]').textContent=title;
  $('[data-v4-isa-bytes]').innerHTML=bytes.map((b,i)=>`<div><small>+${i}</small><strong>${hx(b)}</strong><span>${bits(b)}</span></div>`).join('');
  $('[data-v4-isa-fields]').innerHTML=fields.map(([label,width,val],i)=>`<div class="hwat-v4-field f${i%4}"><small>${esc(label)} · ${width} bits</small><code>${val}</code></div>`).join('');
  $('[data-v4-isa-details]').innerHTML=details;
  $('[data-v4-isa-note]').textContent=note;
 }
 function renderQuiz(){const q=questions[state.q],picked=state.answers.get(state.q),score=Array.from(state.answers).filter(([i,a])=>questions[i][2]===a).length;
  $('[data-v4-quiz-progress]').innerHTML=`<span>QUESTION ${state.q+1} / ${questions.length}</span><strong>${score} correct · ${state.answers.size} answered</strong><div class="hwat-v4-progress-track"><span style="width:${100*state.answers.size/questions.length}%"></span></div>`;
  $('[data-v4-quiz-question]').textContent=q[0];
  $('[data-v4-quiz-choices]').innerHTML=q[1].map((answer,i)=>`<button type="button" data-v4-answer="${i}" ${picked!==undefined?'disabled':''} class="${picked!==undefined?(i===q[2]?'is-correct':i===picked?'is-wrong':''):''}"><span>${String.fromCharCode(65+i)}</span>${esc(answer)}</button>`).join('');
  $('[data-v4-quiz-explanation]').innerHTML=picked===undefined?'Choose one answer to reveal the engineering explanation.':`<strong>${picked===q[2]?'Correct.':'Not quite.'}</strong><p>${esc(q[3])}</p>`;
  $('[data-v4-quiz-next]').textContent=state.q===questions.length-1?'Review from question 1 ↺':'Next question →';
 }
 function renderGlossary(){const filter=$('[data-v4-glossary-search]').value.trim().toLowerCase();const subset=glossary.filter(([term,desc])=>`${term} ${desc}`.toLowerCase().includes(filter));
  $('[data-v4-glossary]').innerHTML=subset.length?subset.map(([term,desc])=>`<details><summary>${esc(term)}</summary><p>${esc(desc)}</p></details>`).join(''):'<p>No matching engineering terms.</p>';
 }
 function hook(){
  $('[data-v4-scenario-select]').addEventListener('change',e=>{state.scenario=e.target.value;state.trace=0;renderScenario();});
  $('[data-v4-cpu-sample]').addEventListener('change',e=>{$('[data-v4-cpu-source]').value=cpuSamples[e.target.value];cpuCompile();});
  $('[data-v4-scope-mode]').addEventListener('change',e=>{state.scopeMode=e.target.value;state.scopeAt=0;if(state.scopeMode==='uart' && state.scopeByte===0x9f)state.scopeByte=0x41;renderScope();});
  $('[data-v4-scope-hex]').addEventListener('change',e=>{const str=e.target.value.trim();if(/^[a-f0-9]{1,2}$/i.test(str)){state.scopeByte=parseInt(str,16);}renderScope();});
  $('[data-v4-scope-position]').addEventListener('input',e=>{state.scopeAt=Number(e.target.value);renderScope();});
  $('[data-v4-isa-value]').addEventListener('change',renderISA);
  $('[data-v4-glossary-search]').addEventListener('input',renderGlossary);
  root.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b||!root.contains(b))return;
   if(b.matches('[data-v4-scenario-prev]')){state.trace--;renderScenario();}
   else if(b.matches('[data-v4-scenario-next]')){state.trace++;renderScenario();}
   else if(b.matches('[data-v4-scenario-first]')){state.trace=0;renderScenario();}
   else if(b.matches('[data-v4-trace-step]')){state.trace=Number(b.dataset.v4TraceStep);renderScenario();}
   else if(b.matches('[data-v4-goto-chip]')){gotoChip(b.dataset.v4GotoChip);}
   else if(b.matches('[data-v4-cpu-compile]')){cpuCompile();}
   else if(b.matches('[data-v4-cpu-step]')){if(state.cpu){state.cpu.step();renderCPU();}}
   else if(b.matches('[data-v4-cpu-run]')){if(state.cpu){for(let i=0;i<32&&!state.cpu.halted;i++)state.cpu.step();renderCPU();}}
   else if(b.matches('[data-v4-memory-address]')){state.cpuSelected=Number(b.dataset.v4MemoryAddress);renderCPU();}
   else if(b.matches('[data-v4-scope-preset]')){state.scopeByte=parseInt(b.dataset.v4ScopePreset,16);renderScope();}
   else if(b.matches('[data-v4-scope-bit]')){state.scopeAt=Number(b.dataset.v4ScopeBit);renderScope();}
   else if(b.matches('[data-v4-isa-mode]')){state.isaMode=b.dataset.v4IsaMode;state.isaValue=42;$('[data-v4-isa-value]').value='42';renderISA();}
   else if(b.matches('[data-v4-answer]')){if(!state.answers.has(state.q)){state.answers.set(state.q,Number(b.dataset.v4Answer));renderQuiz();}}
   else if(b.matches('[data-v4-quiz-next]')){state.q=(state.q+1)%questions.length;renderQuiz();}
   else if(b.matches('[data-v4-quiz-reset]')){state.q=0;state.answers.clear();renderQuiz();}
  });
 }
 $('[data-v4-cpu-source]').value=cpuSamples.sum;
 root.dataset.hwatAdvancedReady='true';hook();renderScenario();cpuCompile();renderScope();renderISA();renderQuiz();renderGlossary();return true;
}
window.HardwareAdvancedAtlas=Object.freeze({init,version:'4.0.0',scenarioCount:Object.keys(scenarios).length,quizCount:questions.length,glossaryCount:glossary.length,opcodes:Object.freeze({...opcodes}),assemble,simulate:(source,maxSteps=128)=>{const cpu=new TinyCPU(assemble(source));for(let i=0;i<Math.min(1024,Math.max(0,Math.floor(maxSteps)))&&!cpu.halted;i++)cpu.step();return Object.freeze({a:cpu.a,pc:cpu.pc,z:cpu.z,c:cpu.c,halted:cpu.halted,outputs:cpu.outputs.slice(),cycles:cpu.cycles,error:cpu.error,memory:Array.from(cpu.memory)});}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init(),{once:true});else init();
})();
