# risc-v-asm

A lightweight ESM-only TypeScript library and GNU-`as`-like CLI for assembling
a strict **RV64I/RV64M** flat-assembler subset of RISC-V. It provides
instruction encoding, label resolution, pseudo-instruction expansion, and Intel
HEX output.

**This is not a full GNU assembler.** There is no ELF object output, linker
relaxation, compressed instructions, assembler directives, relocation support,
floating-point or vector instructions, or debug information.

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

Assemble one or more assembly source files into flat binary or Intel HEX output.
Multiple input files are concatenated in order; labels may refer to addresses
across file boundaries.

At least one source path is required. Standard input and `-` input paths are
**not** supported; `-` is valid only as the output path (`-o -`).

### Options

| Option                     | Description                                               | Default  |
| -------------------------- | --------------------------------------------------------- | -------- |
| `-o, --output <objfile>`   | Output file; `-o -` writes to stdout                      | `a.out`  |
| `--format <format>`        | Output format: `binary`, `ihex`, or `elf` (error)         | `binary` |
| `--base-address <address>` | Flat-output origin; does **not** pad the binary           | `0`      |
| `-march <isa>`             | ISA: `rv64i` or `rv64im`                                  | `rv64i`  |
| `-mabi <abi>`              | ABI: `lp64` only                                          | `lp64`   |
| `--defsym <symbol=value>`  | Define a nonnegative integer absolute symbol (repeatable) | —        |
| `-v, --verbose`            | Print version and continue assembling                     | —        |
| `--target-help`            | Print RISC-V target options and exit 0                    | —        |
| `--version` / `-version`   | Print version and exit 0                                  | —        |
| `--help`                   | Print help and exit 0                                     | —        |

**GNU-compatible normalization** is applied to supported forms such as
`-march=rv64im`, `-mabi=lp64`, `-mno-relax`, `-fno-pic`, `-oFILE`, and
`-version`.

### Required overrides for GNU defaults

GNU `as` defaults to relaxation, ELF architecture attributes, and CSR checking,
but those features are unsupported. Their default flags remain registered, so
assembly requires these explicit supported overrides:

```sh
-mno-relax -mno-arch-attr -mno-csr-check
```

The no-op defaults `--mlittle-endian` and `--fno-pic` are supported and enabled
by default.

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
# Assemble to flat binary (default output: a.out)
risc-v-asm -mno-relax -mno-arch-attr -mno-csr-check test.s

# Intel HEX output
risc-v-asm -mno-relax -mno-arch-attr -mno-csr-check --format=ihex -o firmware.ihex test.s

# Write to stdout
risc-v-asm -mno-relax -mno-arch-attr -mno-csr-check -o - test.s

# Specify base address and define a symbol
risc-v-asm -mno-relax -mno-arch-attr -mno-csr-check --base-address=0x1000 --defsym=base=0x200 test.s

# Verbose
risc-v-asm -mno-relax -mno-arch-attr -mno-csr-check -v test.s
```

---

## Source syntax

`risc-v-asm` accepts a minimal flat-assembly syntax without directives or
relocations.

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

Memory operands use the GNU Assembler `offset(base)` syntax:

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

## Supported instructions

### RV64I (default `-march=rv64i`)

**Arithmetic:** `add`, `sub`, `sll`, `slt`, `sltu`, `xor`, `srl`, `sra`, `or`,
`and`, `addw`, `subw`, `sllw`, `srlw`, `sraw`

**Immediate arithmetic:** `addi`, `slti`, `sltiu`, `xori`, `ori`, `andi`,
`addiw`

**Shift immediates** (0–63): `slli`, `srli`, `srai`

**Shift word immediates** (0–31): `slliw`, `srliw`, `sraiw`

**Load:** `lb`, `lh`, `lw`, `ld`, `lbu`, `lhu`, `lwu`

**Store:** `sb`, `sh`, `sw`, `sd`

**Branches:** `beq`, `bne`, `blt`, `bge`, `bltu`, `bgeu`

**Jump / link:** `jal`, `jalr`

**Upper immediate / PC-relative:** `lui`, `auipc`

**Miscellaneous:** `fence`, `ecall`, `ebreak`

### RV64M (with `-march=rv64im`)

**Multiply / divide / remainder:** `mul`, `mulh`, `mulhsu`, `mulhu`, `div`,
`divu`, `rem`, `remu`, `mulw`, `divw`, `divuw`, `remw`, `remuw`

### Pseudo-instructions

| Mnemonic              | Expansion                     |
| --------------------- | ----------------------------- |
| `nop`                 | `addi x0, x0, 0`              |
| `mv rd, rs`           | `addi rd, rs, 0`              |
| `not rd, rs`          | `xori rd, rs, -1`             |
| `neg rd, rs`          | `sub rd, x0, rs`              |
| `negw rd, rs`         | `subw rd, x0, rs`             |
| `sext.w rd, rs`       | `addiw rd, rs, 0`             |
| `seqz rd, rs`         | `sltiu rd, rs, 1`             |
| `snez rd, rs`         | `sltu rd, x0, rs`             |
| `sltz rd, rs`         | `slt rd, rs, x0`              |
| `sgtz rd, rs`         | `slt rd, x0, rs`              |
| `sgt rd, rs, rt`      | `slt rd, rt, rs` (reversed)   |
| `sgtu rd, rs, rt`     | `sltu rd, rt, rs` (reversed)  |
| `li rd, imm`          | Load immediate (numeric only) |
| `j offset`            | `jal x0, offset`              |
| `jr rs`               | `jalr x0, rs, 0`              |
| `ret`                 | `jalr x0, ra, 0`              |
| `beqz rs, offset`     | `beq rs, x0, offset`          |
| `bnez rs, offset`     | `bne rs, x0, offset`          |
| `blez rs, offset`     | `bge x0, rs, offset`          |
| `bgez rs, offset`     | `bge rs, x0, offset`          |
| `bltz rs, offset`     | `blt rs, x0, offset`          |
| `bgtz rs, offset`     | `blt x0, rs, offset`          |
| `bgt rs, rt, offset`  | `blt rt, rs, offset`          |
| `ble rs, rt, offset`  | `bge rt, rs, offset`          |
| `bgtu rs, rt, offset` | `bltu rt, rs, offset`         |
| `bleu rs, rt, offset` | `bgeu rt, rs, offset`         |

Branch pseudo-instructions with two register operands take `rs, rt` (source,
target) and a branch target offset. All pseudo-instructions produce 4-byte
encodings except `li`, which may expand to up to 44 bytes for large immediates.

---

## Intel HEX output

When `--format=ihex` is used, the assembler produces Intel HEX records as
newline-terminated UTF-8 text:

- **Data records** contain up to 16 bytes per line.
- An **extended linear address record** (`:02000004FFFF`) is emitted whenever
  the upper 16 bits of the address change.
- **No data record crosses a 64 KiB page boundary** (to stay within Intel HEX
  address limitations).
- Each record ends with a correct 8-bit checksum.
- The file ends with the EOF record `:00000001FF`.

The base address affects record addresses. An error is raised if any byte would
be written above the 32-bit address space (4 GiB).

---

## Unsupported features

Unsupported ISA, ABI, and ELF output values receive descriptive errors:

| Feature                                | Error                                |
| -------------------------------------- | ------------------------------------ |
| `--format=elf`                         | ELF object output is not implemented |
| `-march` other than `rv64i` / `rv64im` | Unsupported ISA                      |
| `-mabi` other than `lp64`              | Unsupported ABI                      |

Other unimplemented flags such as `--mbig-endian`, `-I`, `-g`, `--fpic`, and
warning-control flags are not registered and are rejected as unknown options.

**Absent from the assembler entirely:**

- Compressed instructions (`RVC`)
- Floating-point / SIMD / vector instructions (`RV64F`, `RV64D`, `RV64V`, etc.)
- Assembler directives (`.file`, `.section`, `.globl`, `.type`, `.size`,
  `.align`, `.zero`, `.fill`, `.space`, `.string`, `.asciz`)
- Relocations and general expression evaluation; only direct symbol references
  are supported
- Expanded mnemonic coverage beyond the RV64I/RV64M and pseudo-instruction
  subsets above

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
- An **empty array is empty source** and produces an empty binary stream (or
  only the Intel HEX EOF record). The library never reads stdin implicitly.

Labels are resolved against `baseAddress` and merged with `defsym` definitions.
A source label overrides a same-named `defsym` definition.

### Options

| Option        | Type                | Default  | Description                                                                   |
| ------------- | ------------------- | -------- | ----------------------------------------------------------------------------- |
| `format`      | `string`            | `binary` | `binary` emits instruction bytes; `ihex` emits Intel HEX records; `elf` fails |
| `baseAddress` | `number \| string`  | `0`      | Address of the first instruction; nonnegative safe integer                    |
| `march`       | `string`            | `rv64i`  | ISA selection; `rv64i` or `rv64im`                                            |
| `mabi`        | `string`            | `lp64`   | ABI selection; `lp64` only                                                    |
| `defsym`      | `readonly string[]` | `[]`     | Repeatable `symbol=value` definitions                                         |

String `baseAddress` and `defsym` values accept the same syntax as source
integer literals: optional `+` or `-`, decimal or `0x`/`0b`/`0o` prefixes, and
underscore separators. Negative values and values outside JavaScript's safe
integer range are rejected. `baseAddress` changes symbol and record addresses
but does not pad flat binary output.

### Binary output

```ts
import { writeFile } from 'node:fs/promises';
import { assemble } from 'risc-v-asm';

// Assemble source text directly
const chunks: Uint8Array[] = [];
for await (const chunk of assemble('addi x1, x0, 42\nnop')) {
  chunks.push(chunk);
}
await writeFile('program.bin', Buffer.concat(chunks));
```

To assemble files instead, pass their paths:

```ts
import { assemble } from 'risc-v-asm';

const output = assemble(['startup.s', 'main.s'], {
  baseAddress: '0x8000_0000',
  march: 'rv64im',
  defsym: ['stack_top=0x8001_0000'],
});
for await (const chunk of output) {
  process.stdout.write(chunk);
}
```

### Intel HEX output

With `format: 'ihex'`, every yielded `Uint8Array` contains UTF-8 text. Records
include their trailing newline. Data records contain at most 16 bytes, never
cross a 64 KiB boundary, and include extended-linear-address records and correct
checksums. The stream ends with `:00000001FF\n`.

```ts
import { assemble } from 'risc-v-asm';

const decoder = new TextDecoder();
for await (const chunk of assemble('nop', { format: 'ihex', baseAddress: 0x1000 })) {
  process.stdout.write(decoder.decode(chunk));
}
```

### Errors

Errors are raised while the returned generator is consumed. Invalid options
(format, ISA, ABI, address, `defsym` values) fail before input is opened.
File I/O failures, unknown mnemonics, malformed or duplicate labels, invalid
`li` operands, and address overflow also fail during iteration. Source-layout
errors include line numbers. Intel HEX conversion additionally rejects output
that would exceed the 32-bit address space.

---

## License

Apache-2.0. Copyright 2026 Raymond Lam.
