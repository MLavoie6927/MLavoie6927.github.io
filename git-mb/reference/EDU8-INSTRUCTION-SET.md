# EDU-8 — Executable 8-bit Teaching Processor Instruction Set

**Custom pedagogical ISA** — authored for Marc Lavoie's Motherboard & Chips v4.0 learning lab, November 13, 2026.

**Not a real Intel, ARM, RISC-V or vendor CPU.** The purpose is to expose exact binary encoding, fetch, decode, arithmetic, flags, RAM access and branches without hiding the logic inside a large realistic architecture.

## Architectural state

| State | Size | Definition |
| --- | --- | --- |
| `A` | 8 bits | Unsigned accumulator, stored modulo 256 |
| `PC` | 8-bit address | Byte index for the next two-byte instruction |
| `Z` | 1 bit | 1 when last accumulator-writing instruction produced A=0 |
| `C` | 1 bit | Carry-out from ADD/ADM; borrow on SUB; cleared by other accumulator writes |
| `RAM[0..255]` | 256 bytes | Unified code+data memory, initially zero and loaded with assembled program |
| `OUT` | Byte stream | Append-only list of byte values emitted by OUT |
| `halted` | Boolean | Stops stepping after HLT, invalid PC or unrecognized opcode |
| `cycles` | Abstract steps | Count of instructions executed, *not* hardware clock cycles |

**Instruction format:** Every instruction occupies exactly two bytes: `[OPCODE, OPERAND]`. Operand is zero for instructions without an operand. The next sequential PC is `(PC + 2)`, unless a branch replaces it. The ISA has no interrupts, stack, concurrency, permissions, segmentation or pipeline timing model.

## Opcode table

| Mnemonic | Opcode | Operand | Behavior |
| --- | --- | --- | --- |
| `NOP` | `00` | Ignored | No state change except PC / step count |
| `LDI n` | `10` | Immediate unsigned byte | `A ← n`; set Z; clear C |
| `LDA addr` | `11` | Absolute memory address | `A ← RAM[addr]`; set Z; clear C |
| `STA addr` | `12` | Absolute memory address | `RAM[addr] ← A`; flags unchanged |
| `ADD n` | `20` | Immediate unsigned byte | `A ← (A+n) & 255`; `C ← (A_before+n)>255`; set Z |
| `ADM addr` | `21` | Absolute memory address | `A ← (A+RAM[addr]) & 255`; carry and Z as above |
| `XOR n` | `22` | Immediate unsigned byte | `A ← A XOR n`; set Z; clear C |
| `SUB n` | `23` | Immediate unsigned byte | `A ← (A−n) & 255`; `C ← A_before<n` (borrow); set Z |
| `JMP addr` | `30` | Absolute byte address | `PC ← addr` unconditionally |
| `JZ addr` | `31` | Absolute byte address | If Z=1, `PC ← addr`; otherwise proceed |
| `JNZ addr` | `32` | Absolute byte address | If Z=0, `PC ← addr`; otherwise proceed |
| `OUT` | `40` | Ignored | Append current A to the output list |
| `HLT` | `FF` | Ignored | Stop execution |

**Assembler:** case-insensitive mnemonic and labels, one instruction per line. Comments start at `;`. Labels are written `loop:` or `loop: OUT`. Literal values support decimal and `0x` hexadecimal, 0..255. Duplicate labels, missing operands, invalid opcodes, malformed operands and programs larger than 256 bytes are rejected with line numbers. Label targets resolve to byte addresses; a branch to an odd/unrecognized address produces an execution error rather than an exception. Programs should end with HLT. The user interface limits each run click to 32 steps.

**Self-modifying memory:** Since code and data share RAM, `STA` can write into the program region. The simulator reads the current opcode and operand bytes from RAM on each step; static source listings are not reassembled automatically when overwritten. This feature is not promoted as a security feature or realistic platform behavior.

## Worked example 1 — addition

```asm
LDI 5      ; 10 05   A=5
ADD 7      ; 20 07   A=12, Z=0, C=0
OUT        ; 40 00   output 12
HLT        ; FF 00   halted
```

Bytes starting at memory address 0x00:

```text
00: 10 05 20 07 40 00 FF 00
```

## Worked example 2 — read and write memory

```asm
LDI 42     ; A=42
STA 0x80   ; RAM[0x80] = 0x2A
LDI 0      ; A=0
LDA 0x80   ; A=42
OUT        ; emit 42
HLT
```

This models the idea that a memory access can operate on data bytes, rather than directly on the signal voltage at a physical DIMM pin.

## Worked example 3 — branch until zero

```asm
LDI 3
loop: OUT
SUB 1
JNZ loop
HLT
```

Output byte values are `3`, `2`, `1`. The last subtraction sets A=0 and Z=1; JNZ then **does not** branch, so HLT executes.

## Worked example 4 — 8-bit carry

```asm
LDI 255
ADD 1
OUT
HLT
```

A becomes zero (`0x00`), Z becomes 1 and C becomes 1. Mathematically, 255+1=256; the 8-bit register retains the value modulo 256.

## Micro-operations displayed after each instruction

1. **FETCH:** Read `RAM[oldPC]` (opcode) and `RAM[oldPC+1]` (operand).
2. **DECODE:** Match opcode to an instruction definition.
3. **EXECUTE:** Carry out accumulator, memory, branch, output or halt semantics.
4. **COMMIT:** Update A, PC, Z and C, plus simulated output/memory state.

These are **conceptual transaction phases**, not a cycle-accurate microprogram. Real processors may overlap operations, reorder instructions, stall on caches, replay speculative work or have independent architectural/microarchitectural state.

## Explicit omissions

No supervisor mode, virtual memory, cache coherence, branch predictor, interrupt controller, MMU/IOMMU, DMA device, GPIO driver, physical RAM timing, undocumented opcode, microcode update mechanism, power or clock pin is modeled. Hardware teaching works by adding such layers incrementally, but one must not mistake a small deterministic emulator for a real chip architecture.
