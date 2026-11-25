# risc-v-asm

A lightweight ESM-only TypeScript library and command-line assembler for
RISC-V instruction encoding. It provides label resolution, pseudo-instruction
expansion, and ELF64 ET_REL object output. The instruction table covers **975
mnemonics** spanning I, M, A, F, D, Q, Zfh, C, Zba, Zbb, Zbc, Zbkb, Zbkx,
Zbs, Zabha, Zacas, Zicsr, Zifencei, Zcb, Zcmp-style, H, and V.

**This is a focused ELF-object assembler.** There is no linker relaxation,
no ELF shared-library or executable support, no FP/vector CSR checking, and no
debug information.

---

## Install

```sh
npm install risc-v-asm
```

**Requirements:**

- **Node.js 24.2 or newer** (ESM-only package; `"type": "module"`)
- TypeScript consumers should use `moduleResolution` set to `"bundler"`,
  `"node16"`, or `"nodenext"` to resolve the package's ESM exports.

### CLI usage

After installing, the `risc-v-asm` command is available via `npx`:

```sh
npx risc-v-asm [options] [file...]
```

Or install globally:

```sh
npm install -g risc-v-asm
risc-v-asm [options] [file...]
```

---

## CLI reference

### Synopsis

```
risc-v-asm [options] <file...>
```

Assemble one or more assembly source files into ELF64 ET_REL object output.
Multiple input files are concatenated in order; labels may refer to addresses
across file boundaries.

When no source files are given, or when `-` is one of the source files,
assembly is read from standard input. `-` as the output path (`-o -`)
writes the ELF object to stdout.

### Options

| Option                    | Description                                               | Default      |
| ------------------------- | --------------------------------------------------------- | ------------ |
| `-o, --output <objfile>`  | Output file; `-o -` writes to stdout                      | `a.out`      |
| `--march <ISA>`           | Set architecture (default: no restriction)                | unrestricted |
| `-march-attr`             | Generate ELF architecture attributes                      | off          |
| `--defsym <symbol=value>` | Define a nonnegative integer absolute symbol (repeatable) | —            |
| `--target-help`           | Print RISC-V target options and exit 0                    | —            |
| `--version` / `-version`  | Print version and exit 0                                  | —            |
| `--help`                  | Print help and exit 0                                     | —            |

Supported option spellings are normalized, including `-mno-relax`, `-fno-pic`, `-oFILE`, and `-version`.

### Unsupported defaults and overrides

Linker relaxation is enabled by default but is not implemented, so assembly
requires `-mno-relax`. The flag `-mrelax` is rejected with a message pointing
to `-mno-relax`.

Architecture enforcement (`-march`) is off by default — every mnemonic
assembles. When `-march=ISA` is supplied, only instructions whose required
extensions are present in the ISA set are accepted. Unsupported extension
names in `-march` are rejected with a descriptive error.

ELF architecture attributes (`-march-attr`) are off by default and can be
enabled explicitly. CSR checking is off by default and cannot be enabled
(`-mcsr-check` is rejected). The no-op defaults `--mlittle-endian` and
`--fno-pic` are supported.

### Exit status

- **0** – success, including `--help`, `--version`, and `--target-help`
- **1** – invalid options, assembly errors, validation failures, or unsupported
  features

### Examples

Given a file `test.s`:

```asm
# test.s: compute 4x + 1
start:
    addi x1, x0, 1    // x1 = 1
loop:
    slli x1, x1, 2    # x1 = x1 << 2 (multiply by 4)
    beq  x1, x0, end
    jal  x0, loop
end:
    nop
```

```sh
# Assemble to a.out (ELF64)
risc-v-asm -mno-relax test.s

# Specify output file
risc-v-asm -mno-relax -o program.o test.s

# Write to stdout
risc-v-asm -mno-relax -o - test.s

# Define a symbol
risc-v-asm -mno-relax -o program.o --defsym=base=0x200 test.s

```

---

## Source syntax

`risc-v-asm` accepts assembly source with labels, instructions, and a limited
set of directives. Symbol references in operands produce ELF relocations.

### Comments

- `#` comments: everything from `#` to end of line is ignored.
- `//` comments: everything from `//` to end of line is ignored.

The first occurrence of either delimiter on a line terminates the content.

### Labels

A label is a name followed by a colon (`:`). Multiple labels may appear on one
line, separated by whitespace and colons. Label names start with a letter,
underscore, `.`, or `$`, followed by zero or more letters, digits, underscores,
`.`, or `$` characters. Labels are case-sensitive and resolve to the byte address
of the following instruction.

```asm
start:          # single label
also:  here:    # multiple labels
```

### Directives

#### Section switching

- `.text` — switch to the `.text` section (executable code, `PROGBITS`, `AX` flags).
  This is the initial section.
- `.data` — switch to the `.data` section (writable data, `PROGBITS`, `WA` flags).
- `.rodata` — switch to the `.rodata` section (read-only data, `PROGBITS`, `A` flags).
- `.bss` — switch to the `.bss` section (zero-initialised writable data, `NOBITS`,
  `WA` flags). `.bss` sections contribute to the ELF section size but consume no
  file space.
- `.section <name>` — switch to a named section where `<name>` must be one of
  `.text`, `.data`, `.rodata`, or `.bss`. Any other section name is rejected.

Labels defined in a section are assigned that section's index in the symbol table.
Each section has its own relocation section (`.rela.text`, `.rela.data`,
`.rela.rodata`). No relocations are emitted for `.bss` (it has no bytes in the
file).

#### Global visibility

- `.globl <name>` / `.global <name>` — mark a label as global (`STB_GLOBAL`)
  in the symbol table. The label must be defined in the same source.

#### Data directives

Data directives emit bytes (and optionally relocations) in `.data`, `.rodata`,
and `.bss` sections. In `.text`, they are permitted but produce literal bytes
in the instruction stream.

- `.byte <expr>[, <expr>...]` — emit one byte per expression. Each expression
  may be a numeric literal (-128–255) or a symbol (produces an `R_RISCV_32`
  relocation).
- `.half <expr>[, <expr>...]` / `.short <expr>...` / `.2byte <expr>...` — emit
  two bytes per expression in little-endian order. Numeric range: -32768–65535.
  Symbols produce `R_RISCV_32`.
- `.word <expr>[, <expr>...]` / `.4byte <expr>...` / `.long <expr>...` — emit
  four bytes per expression in little-endian order. Numeric range: 32-bit
  signed. Symbols produce **`R_RISCV_32`**.
- `.dword <expr>[, <expr>...]` / `.8byte <expr>...` / `.quad <expr>...` — emit
  eight bytes per expression in little-endian order. 64-bit literal values are
  accepted. Symbols produce **`R_RISCV_64`**.
- `.string "<text>"` / `.asciz "<text>"` — emit the text as UTF-8 followed by
  a null terminator.
- `.zero <n>` / `.space <n>` — emit `<n>` zero bytes.
- `.align <e>` / `.p2align <e>` — add padding so that the next byte is at a
  `2^<e>`-byte boundary (power-of-two exponent). `.align 0` is a no-op.
  Padding bytes are zeros in data sections and NOP instructions in `.text`.
  When the padding is not a multiple of 4 (i.e., 2 bytes), **c.nop**
  (`0x0001`) is used, which sets the EF_RISCV_RVC flag.
- `.balign <n>` — align to an `<n>`-byte boundary (any positive integer).
  Padding strategy matches `.align`/`.p2align`.

### Instructions

- The mnemonic is the first non-whitespace token after any labels.
- Mnemonics are **case-insensitive** (`ADDI` and `addi` both work).
- Operands are separated by commas (`,`), with optional surrounding whitespace.
- Operand order follows the RISC-V assembly convention: destination first,
  source(s) next, immediate last.

### Registers

Registers can be written as `x0`–`x31` or by their ABI names:

| Name        | Number |
| ----------- | ------ |
| `zero`      | 0      |
| `ra`        | 1      |
| `sp`        | 2      |
| `gp`        | 3      |
| `tp`        | 4      |
| `t0`        | 5      |
| `t1`        | 6      |
| `t2`        | 7      |
| `s0` / `fp` | 8      |
| `s1`        | 9      |
| `a0`–`a7`   | 10–17  |
| `s2`–`s11`  | 18–27  |
| `t3`–`t6`   | 28–31  |

### Address operands

Memory operands use the `offset(base)` syntax:

```asm
ld   x1, 8(x2)       # x1 = *(x2 + 8)
sd   x3, -4(sp)      # *(sp - 4) = x3
```

The offset may be omitted (`(base)` implies offset 0). The base must be a
register name or number.

### Numeric literals

Immediates can be written as:

- **Decimal:** `42`, `-1`
- **Hexadecimal:** `0xFF`, `-0x100`
- **Binary:** `0b1010`
- **Octal:** `0o77`

Underscore separators are allowed: `0xdead_beef`. A leading `+` or `-` is
accepted for all bases.

### Symbol references

Labels and `--defsym` symbols can be used in place of immediates where an
address or numeric value is expected:

```asm
jal  x0, target_label
addi x1, x0, my_const
```

### The `li` pseudo-instruction

`li` (load immediate) accepts a **numeric constant only**. Symbol references
are not supported:

```asm
li x1, 42       # OK
li x1, 0x800    # OK
li x1, label    # ERROR: not a numeric constant
```

`li` emits a single 4-byte `addi` when the value fits in a 12-bit signed
immediate. Larger values expand to a deterministic sequence of `addi` and
`slli` instructions, up to 44 bytes for 64-bit immediates.

---

## Instruction coverage

The encoder table covers **975 mnemonics** spanning the following RISC-V
extension sets:

**Base:** RV64I (i)
**Standard extensions:** M, A, F, D, Q, C, H, V
**Z extensions:** Zfh (half-precision float), Zba/Zbb/Zbc/Zbkb/Zbkx/Zbs
(bit-manipulation), Zabha, Zacas (atomic), Zicsr, Zifencei, Zcb (compressed
bit-manipulation), Zcmp-style, and additional cryptography/vector
sub-extensions.

Common assembler aliases and pseudo-instructions (`nop`, `mv`, `li`, `call`,
`tail`, `la`, `lla`, `j`, `jr`, `ret`, `neg`, etc.) are also included.

When `-march` is specified, only mnemonics whose required extensions are all
present in the requested ISA set are accepted. Without `-march`, every
registered mnemonic assembles (no restriction). This is strictly more
permissive than gas's build-time default.

---

## Unsupported features

Unimplemented flags such as `--mbig-endian`, `-I`, `-g`, `--fpic`, and
warning-control flags are not registered and are rejected as unknown options.

**Absent from the assembler entirely:**

- Linker relaxation and `R_RISCV_RELAX`/`R_RISCV_ALIGN` markers
- RV32-only instruction encodings
- `.file`, `.type`, `.size`, `.fill` directives
- General expression evaluation (only direct symbol references are supported)

---

## Library API

The package root exports exactly one item: the named `assemble` function.

```ts
import { assemble } from 'risc-v-asm';

async function* assemble(
  input: string | readonly string[],
  options?: AssembleOptions
): AsyncGenerator<Uint8Array>;
```

`AssembleOptions` describes the options below and is not itself exported.
`assemble` is an async generator — do **not** await the call to `assemble`.
Consume its byte stream directly with `for await`, `Readable.from`, or another
async-iterable consumer. Validation, symbol layout, and encoding begin when
iteration starts.

### Input

- A **string always contains assembly source text**, even if its contents look
  like a path. Unix LF and Windows CRLF line endings are accepted.
- A **readonly string array contains file paths**, assembled in array order.
  Labels may refer to addresses across file boundaries.
- An **empty array is empty source** and produces an empty output stream. The library never reads stdin implicitly.

Labels are resolved from the start address `0` and merged with `defsym` definitions.
A source label overrides a same-named `defsym` definition.

### Options

| Option      | Type                | Default | Description                                                |
| ----------- | ------------------- | ------- | ---------------------------------------------------------- |
| `defsym`    | `readonly string[]` | `[]`    | Repeatable `symbol=value` definitions                      |
| `marchAttr` | `boolean`           | `false` | Generate `.riscv.attributes` section                       |
| `march`     | `string`            | —       | Architecture restriction string; absent means unrestricted |

`defsym` values accept the same syntax as source integer literals: optional
`+` or `-`, decimal or `0x`/`0b`/`0o` prefixes, and underscore separators.
Negative values and values outside JavaScript's safe integer range are rejected.

### Assembly example

```ts
import { writeFile } from 'node:fs/promises';
import { assemble } from 'risc-v-asm';

// Assemble source text directly
const chunks: Uint8Array[] = [];
for await (const chunk of assemble('addi x1, x0, 42\nnop')) {
  chunks.push(chunk);
}
await writeFile('program.o', Buffer.concat(chunks));
```

To assemble files instead, pass their paths:

```ts
import { assemble } from 'risc-v-asm';

const output = assemble(['startup.s', 'main.s'], {
  defsym: ['stack_top=0x8001_0000'],
});
for await (const chunk of output) {
  process.stdout.write(chunk);
}
```

### Errors

Errors are raised while the returned generator is consumed. Invalid options
(ISA, `defsym` values) fail before input is opened.
File I/O failures, unknown mnemonics, malformed or duplicate labels, invalid
`li` operands, and address overflow also fail during iteration. Source-layout
errors include line numbers.

---

## License

Apache-2.0. Copyright 2026 Raymond Lam.
