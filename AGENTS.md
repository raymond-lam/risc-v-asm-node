# AGENTS.md — risc-v-asm coding guide

## 1. Project purpose

`risc-v-asm` is an **ESM-only TypeScript library** for assembling RISC-V source into **ELF64 ET_REL** object files. It provides instruction encoders (975 mnemonics across I, M, A, F, D, Q, Zfh, C, Zba, Zbb, Zbc, Zbkb, Zbkx, Zbs, Zabha, Zacas, Zicsr, Zifencei, Zcb, Zcmp-style, H, and V), a one-pass symbol table with per-section label tracking, pseudo-instruction expansion, data directives (`.word`/`.dword`/`.byte`/`.string`/`.zero`/`.align`), multi-section support (`.text`/`.data`/`.rodata`/`.bss`), per-section relocations, and an ELF64 ET_REL writer. It is **not** a full GNU assembler: no linker relaxation, no includes, no debug info, no FP/vector CSR checking.

## 2. Required environment

- **Node.js >= 24.2** (declared in `package.json` `engines.node`; required for `import.meta.main`)
- **ESM-only** (`"type": "module"` in `package.json`)
- **TypeScript 7** (`^7.0.2`; uses `ES2022` target and `ESNext` module)
- **Package-import `#` specifiers** — imports look like `#instructions`, `#symbol-table`, `#testing/stream` — no relative imports anywhere in source
- **`moduleResolution: "bundler"`** in `tsconfig.json` (paths map `#*` → `./src/*` and `#testing/*` → `./testing/*`)
- **Commander** (`^15.0.0`) is the only runtime dependency

## 3. Canonical validation commands

| Command         | What it runs                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run check` | `format:check` + `lint` + `type-check` + `test` (full validation gate)                               |
| `npm run fix`   | `format` + `lint:fix` (auto-format and fix lint)                                                     |
| `npm test`      | `tsx --conditions @risc-v-asm/source --test "src/**/*.test.ts"` (runs colocated tests via node:test) |
| `npm run build` | `rimraf dist && rolldown declaration bundle && esbuild shared JS bundles`                            |

`check` breakdown:

1. **`npm run format:check`** — Prettier (semi, singleQuote, trailingComma es5, tabWidth 2, printWidth 100, arrowParens always)
2. **`npm run lint`** — Oxlint (strict type-safety rules, import boundary enforcement, `func-style: expression`)
3. **`npm run type-check`** — `tsc --noEmit` (strict, noUncheckedIndexedAccess, noUnusedLocals, noUnusedParameters, verbatimModuleSyntax)
4. **`npm test`** — node:test runner via `tsx` with `@risc-v-asm/source` condition (resolves `#` imports to source `.ts`)

Tests are **colocated** at `src/**/*.test.ts`. Shared test helpers live in `testing/` and are imported via `#testing/stream` (exports `sourceLines` for producing `AsyncIterable<string>` from arrays, and `collectBytes` for consuming `AsyncGenerator<Uint8Array>` into a single `Uint8Array`).

## 4. Repository architecture and package boundaries

```
src/
├── index.ts                 # Public barrel — exports only the named assemble function
├── bin.ts                   # Executable entry (#!/usr/bin/env node) and CLI implementation
├── parse.ts                 # Standalone parsers: parseInstruction, parseIntegerLiteral (named exports)
├── statements.ts            # Pure line parser: parseStatement → directive or instruction (named export)
├── layout.ts                # Streaming layout pass: layout → Placed records (default export)
├── symbol-table.ts          # buildSymbolTableWithRefs — folds Placed records (named export)
├── utils/
│   ├── bytes.ts             # Little-endian 16/32-bit serializers (named exports)
│   └── integer.ts           # Nonnegative safe-integer conversion (named export safeInteger)
├── assemble/
│   ├── index.ts             # Public two-pass assembler, input streams, and option validation
│   └── encode.ts            # Streaming instruction encoder (named export)
├── instructions/
│   ├── index.ts             # Package barrel — named re-exports INSTRUCTION_MAP, resolveOperands, InstructionSignature
│   ├── instruction-map.ts   # INSTRUCTION_MAP — the authoritative mnemonic→entry registry
│   ├── operands.ts          # resolveOperands, InstructionSignature type (named exports)
│   ├── formats.ts           # Encoder primitives (R/I/S/B/J/U/V/… format functions)
│   ├── canonical.ts         # Standard RV64I/RV64M encoders
│   └── pseudo.ts            # Pseudo-instruction expansion encoders
```

**Package rule**: Every directory with an `index.ts` is a _package_. Other modules in that directory are private outside the package — they may only be imported by siblings through the package namespace or by `src/**/*.test.ts` files (which are exempt from the sibling-private restriction but still must use `#` imports, never relative paths). Oxlint enforces this via `no-restricted-imports` entries generated from that same `index.ts` discovery in `oxlint.config.ts`.

**Export style**: direct exports are inline at the declaration (`export const`, `export async function*`, `export type`). Post-declaration `export { ... }` statements are reserved for package barrel re-exports in `index.ts`.

**Export convention** (manual style preference; not lint-enforced):

- If a file has exactly one value export and the exported name matches the filename (basename without extension), it **must** use `export default`.
- Otherwise the file **must not** use `export default`.
- Compare exported names exactly: for a default export, the local identifier is the name to compare; for a named export, the external name is used.
- Anonymous default exports are prohibited.
- Type-only exports do not create impossible default-export requirements.
- `index.ts` barrels use **named re-exports** (`export { name }`) regardless of count; the single-export rule still applies to barrel files.
- Example: `src/index.ts` does `export { assemble } from '#assemble';` and has no other exports. `INSTRUCTION_MAP` and `buildSymbolTable` remain internal and are available only through their internal package imports, never the public package root.

**Test files** (`src/**/*.test.ts`) may deep-import private instruction modules to exercise encoders directly; they are exempt from the package-private boundary but still must use `#` imports with no `.js` extension and no relative paths.

## 5. Streaming assembly contract

The package root exposes exactly one named export, `assemble`, implemented in `assemble/index.ts`:

```ts
async function* assemble(
  input: string | readonly string[],
  options?: AssembleOptions
): AsyncGenerator<Uint8Array>
```

- This is a **direct async generator**, not a promise for a generator. Consumers use `for await (const chunk of assemble(...))` without awaiting the call itself.
- A string is always assembly source text. A readonly string array contains file paths; an empty array is empty source and never means stdin.
- `AssembleOptions` is private to `assemble/index.ts`. It contains `defsym` (repeatable `symbol=value` definitions) and `marchAttr` (whether to emit `.riscv.attributes` section).
- Three streaming passes happen when the generator is iterated (see the per-pass sections below). The output is always an **ELF64 ET_REL** object, streamed as the sequence: ELF header, `.text` instruction chunks, trailer sections.
- Path arrays are streamed with `createReadStream` and `readline` on each pass. Source strings are split and streamified afresh. Production source must not synchronously open or read files.

### Internal pass 1: buildSymbolTableWithRefs

```ts
type SectionState = Readonly<{
  name: string;
  shType: number;
  flags: number;
  size: number;
  alignment: number;
}>;

type SymbolTableWithReferences = Readonly<{
  symbols: ReadonlyMap<string, number>;
  references: readonly SymbolReference[];
  hasCompressed: boolean;
  globalLabels: ReadonlySet<string>;
  sectionStates: ReadonlyMap<string, SectionState>;
  sectionRelocations: ReadonlyMap<string, readonly RelocationSpec[]>;
  labelSections: ReadonlyMap<string, string>;
}>;

const buildSymbolTableWithRefs = async (
  lines: AsyncIterable<string>,
  startAddress?: number,
  allowedExtensions?: { readonly set: ReadonlySet<string>; readonly isa: string }
): Promise<SymbolTableWithReferences>
```

- Implemented as a three-stage pipeline. `parseStatement` in `statements.ts` is a pure line parser returning the leading labels plus a directive or instruction. `layout` in `layout.ts` is an `AsyncGenerator<Placed>` that owns all section state (cursors, alignments, compressed detection) and emits one record per label, section switch, global, directive, or instruction, including each instruction's precomputed references and relocations. `buildSymbolTableWithRefs` is a thin driver that folds those records through five reducers (symbols, references, relocations, sections, compressed); it never recomputes addresses, sizes, or relocations.
- Consumes the source stream once to resolve labels to byte addresses, compute per-section sizes, detect compressed (`c.*`) instructions, collect relocation specifications per section for every symbol-referencing operand (including data-directive symbol operands), and collect every operand text that is not a register name or integer literal (as a `SymbolReference`).
- Handles section-switching directives (`.text`, `.data`, `.rodata`, `.bss`, `.section`), data directives (`.word`, `.dword`, `.byte`, `.half`, `.short`, `.string`, `.asciz`, `.zero`, `.space`, `.align`, `.balign`, `.p2align`), and global-visibility directives (`.globl`, `.global`).
- Alignment semantics: `.align <e>` / `.p2align <e>` align to `2^<e>`-byte boundary (power-of-two exponent); `.balign <n>` aligns to `<n>`-byte boundary. `.align 0` is a no-op. Text padding uses 4-byte NOP (`0x00000013`) and/or 2-byte c.nop (`0x0001`); data padding uses zeros. BSS permits only `.zero`/`.space` and alignment directives.
- Rejects unknown mnemonics, unknown directives, malformed labels, duplicate labels, non-numeric `li` immediates, and invalid data-directive arguments with `Error` containing a line number.
- `startAddress` must be a nonnegative safe integer (default `0`).
- Returns the resolved label map, collected references, whether any compressed instruction occurs, the set of global labels, per-section states (type, flags, size, alignment), per-section relocation lists, and a mapping from label names to their containing section name.

### Internal pass 2 (streaming): encode

```ts
type EncodeMetadata = {
  readonly totalTextSize: number;
  readonly relocations: readonly RelocationSpec[];
  readonly hasCompressed: boolean;
};

async function* encode(
  lines: AsyncIterable<string>,
  symbols: ReadonlyMap<string, number>,
  baseAddress = 0
): AsyncGenerator<Uint8Array, EncodeMetadata>
```

- Consumes the `Placed` records produced by `layout` (it calls `layout(lines, baseAddress)` internally) instead of re-parsing source text, so addresses, sizes, zero-substituted operands, and relocations all come from the layout pass.
- Encodes each instruction and yields the bytes as a separate `Uint8Array` chunk (one per instruction line). Data directives in `.data` and `.rodata` are buffered until all text instruction chunks are yielded, then emitted in section order (`.data` bytes first, then `.rodata` bytes); their bytes are materialized here from the directive's `text`, not during pass 1. `.bss` sections contribute no bytes.
- Every operand that is a symbol reference (not a register or integer literal) reaches the encoder as a `0` placeholder; the corresponding `RelocationSpec` (recorded by `layout`) is emitted in the appropriate `.rela.*` section (`.rela.text`, `.rela.data`, `.rela.rodata`). The caller is responsible for resolving relocations.
- This is the **streaming** pass for `.text` instructions (yielded immediately) and buffered for `.data`/`.rodata` (yielded after all instructions).

### ELF streaming writer: writeElfStream

```ts
type ElfParts = Readonly<{
  ehdr: Uint8Array;
  relaData: readonly Uint8Array[];    // one per content section
  symtabData: Uint8Array;
  strData: Uint8Array;
  shstrData: Uint8Array;
  attrData: Uint8Array;
  shdrTable: Uint8Array;
}>;

const computeElfParts = (
  sectionStates: ReadonlyMap<string, SectionState>,
  sectionRelocations: ReadonlyMap<string, readonly RelocationSpec[]>,
  labelSymbols: ReadonlyMap<string, number>,
  references: readonly SymbolReference[],
  predefinedSymbols: ReadonlyMap<string, number>,
  hasCompressed: boolean,
  marchAttr?: boolean,
  globalLabels?: ReadonlySet<string>,
  labelSections?: ReadonlyMap<string, string>
): ElfParts;

async function* writeElfStream(
  contentChunks: AsyncIterable<Uint8Array>,
  parts: ElfParts
): AsyncGenerator<Uint8Array>
```

- `computeElfParts` pre-computes all ELF trailer data per-section (`.rela.text`, `.rela.data`, `.rela.rodata`), `.symtab`, `.strtab`, `.shstrtab`, optional `.riscv.attributes`, and the section header table) using the known per-section sizes and relocation lists. It assigns section indices, computes file offsets, and produces each section header. The caller provides the already-known sizes so the ELF header can be placed first.
- `writeElfStream` yields the complete ELF object as a sequence:
  1. 64-byte ELF header (`e_shoff` pointing past the trailer)
  2. Content sections in order: `.text` (streamed), `.data` (buffered), `.rodata` (buffered)
  3. `.rela.text`, `.rela.data`, `.rela.rodata` sections
  4. `.symtab` section
  5. `.strtab` section
  6. `.shstrtab` section
  7. `.riscv.attributes` section (only if non-empty)
  8. Section header table
- `.text` bytes are never fully buffered; each instruction chunk is yielded as it arrives from the encoder. `.data` and `.rodata` are emitted from the pre-computed `contentChunks` iterable which yields text chunks first, then buffered data and rodata bytes.

### `assemble` orchestration

`assemble` performs exactly two streaming passes over the source, each re-creating the line stream:

1. `buildSymbolTableWithRefs` — resolves labels, collects symbol references, computes per-section sizes, detects compressed instructions, and builds per-section relocation lists (`.rela.text`, `.rela.data`, `.rela.rodata`). Everything needed for the ELF header layout is known after this single pass.
2. `encode` (via `writeElfStream`) — streams instruction bytes one chunk at a time. The ELF header is written first (pre-computed from pass-1 metadata), followed by `.text` chunks (streamed immediately), then `.data` chunks and `.rodata` chunks (buffered until EOF in the encode pass), then the trailer sections (`.rela.text`, `.rela.data`, `.rela.rodata`, `.symtab`, `.strtab`, `.shstrtab`, optional `.riscv.attributes`, and the section header table).

Memory footprint:

- `.text` content: **O(1)** — one instruction chunk at a time.
- `.data`/`.rodata` content: **O(total data size)** — buffered until all instructions are emitted.
- Relocation records: **O(number of symbol references)**, 24 bytes each.
- Symbol/string tables: **O(symbol count)**, small relative to assembly input.

### Collecting helper

A `collectEncode` test helper is provided in `testing/encode.ts` (imported via `#testing/encode`):

```ts
// testing/encode.ts
const collectEncode = async (
  lines: AsyncIterable<string>,
  symbols: ReadonlyMap<string, number>,
  baseAddress?: number
): Promise<{ readonly textBytes: Uint8Array } & EncodeMetadata>
```

### CLI input and output behavior

- `bin.ts` calls public `assemble` from `#index`; it does not own symbol-table, encoding, ELF writing, or defsym implementation details.
- At least one source path is required. CLI stdin and `-` input paths are unsupported; path arrays go directly to `assemble` and are reopened for its two passes. `-` remains valid only as the output path.
- Output is always an ELF64 ET_REL object, streamed via `pipeline(Readable.from(output), createWriteStream(path))` or direct stdout writes.

## 6. Instruction metadata source of truth

`INSTRUCTION_MAP` (a `ReadonlyMap<string, InstructionEntry>` exported from `#instructions/instruction-map.ts`) is the **sole authoritative registry** of mnemonic→encoding metadata. It is populated in one large `new Map([...])` expression.

### Entry shape

```ts
type InstructionEntry = {
  readonly encode: (...args: number[]) => Uint8Array;
  readonly instructionLength: number | ((rd: number, value: number | bigint) => number);
  readonly signatures: readonly InstructionSignature[];
};
```

- `encode` — variadic numeric arguments, returns `Uint8Array`. Encoder arguments are typed as `number[]`; `any` is banned globally.
- `instructionLength` — fixed number, or function for variable-length pseudo-instructions (currently only `li`).
- `signatures` — array of variants for the same mnemonic (differentiated by operand count).

### InstructionSignature

```ts
type InstructionSignature = {
  readonly sourceSignature: readonly ('register' | 'number' | 'address')[];
  readonly encoderSignature: readonly (
    | { readonly type: 'constant'; readonly value: number }
    | { readonly type: 'register'; readonly sourceOperand: number }
    | { readonly type: 'number'; readonly sourceOperand: number }
    | {
        readonly type: 'numberPart';
        readonly sourceOperand: number;
        readonly bits: readonly [number, number];
        readonly signed: boolean;
        readonly nonzero?: boolean;
      }
    | {
        readonly type: 'address';
        readonly sourceOperand: number;
        readonly addressPart:
          | 'base'
          | 'offset'
          | 'offsetHigh'
          | 'offsetLow'
          | 'branchOffsetHigh'
          | 'branchOffsetLow'
          | 'jumpOffset';
        readonly relative: boolean;
      }
  )[];
};
```

`sourceSignature` describes what the source operand _means_; `encoderSignature` maps each encoder positional argument to a source operand (or constant). The `addressPart` field distributes address/branch/jump offset bits to the scattered immediate fields in the encoder.

`numberPart` declares one field of an immediate that a compressed instruction splits across several encoder arguments; `bits` is that field's `[low, high]` position in the immediate. `signed` is required and states whether the immediate those fields spell together is a signed or unsigned value (c.li's imm[5:0] is signed, c.slli's shamt is unsigned), because `operands.ts` checks the range of the assembled immediate from the union of the fields sharing one source operand. Every field in one union must declare the same `signed`; a mixed union is a metadata error. `nonzero` is optional and marks the zero immediate as a reserved encoding (c.lui and c.addi4spn); an absent `nonzero` means zero is allowed, and a union is nonzero when any of its fields sets it.

### Critical rule: stay table-driven

- **No mnemonic-specific encode helpers** — the assembler uses only `INSTRUCTION_MAP.get(mnemonic)!` and `resolveOperands()`; it never inspects which mnemonic it is assembling.
- **No second mnemonic registry** — `INSTRUCTION_MAP` is the one and only.
- **No switches, Sets of mnemonics, or handler closures** — operand resolution in `operands.ts` is purely generic, driven by the encoder signature.
- **No removing instructions** — never delete a mnemonic, encoder, or registry entry unless explicitly requested.

### `-march` enforcement

`-march=VALUE` parsing and validation live in `src/assemble/march.ts`:
`parseMarch` expands the ISA string (including gas implications like
g→i,m,a,f,d,zicsr,zifencei and d→f), and `validateMarch` rejects unsupported
extension names. When a non-undefined march is passed to `assemble()`,
`buildSymbolTableWithRefs` in `symbol-table.ts` checks every instruction's
`requires` field against the allowed set and throws a descriptive error
naming the mnemonic, missing extension, and ISA string during pass 1 (before
any output). The default (no flag) is unrestricted — every mnemonic in
`INSTRUCTION_MAP` assembles.

### Linting configuration

Oxlint configuration lives in `oxlint.config.ts` at the project root. It discovers package roots from `src/**/index.ts` and generates the private-sibling import restrictions dynamically. Key differences from the old ESLint setup:

- **Built-in rules only** — oxlint natively supports the configured TypeScript type-safety rules, import boundary enforcement, and style rules.
- **JS plugins** (`eslint-plugin-sonarjs`, `eslint-plugin-security`) are not used because oxlint 1.94.0 crashes on Linux arm64 when loading JS plugins. Their rules are replaced by built-in equivalents where possible.
- **Replaced rule**: `sonarjs/cognitive-complexity` → `complexity` (cyclomatic rather than cognitive, same max 15).
- **Lint rule waivers**: Oxlint's JS-plugin API crashes on memory-constrained Linux (including arm64) in 1.94.0, so these syntactic rules are not enforced: `sonarjs/no-duplicate-string`, `sonarjs/no-identical-functions`, and `security/detect-non-literal-regexp`. `import/no-unresolved` is unsupported by Oxlint and is covered by `tsc` instead. `FunctionExpression` and `export default function` are manual style rules in section 9; `func-style: expression` still rejects function declarations.
- **Formatting** is handled by Prettier separately (`npm run format:check` / `npm run format`).

The `resolveOperands` function in `operands.ts` walks `signature.encoderSignature` and resolves each argument through `resolveRegister`, `resolveNumber`, or `resolveAddress` — no per-mnemonic branching.

## 7. Parsing and errors

### parseInstruction (parse.ts)

```ts
const parseInstruction = (raw: string): { mnemonic: string; operands: string[] } | null
```

- Strips `#` and `//` comments (first occurrence terminates).
- Removes leading labels (`name:`) — supports multiple labels and whitespace around colons.
- Lowercases the mnemonic.
- Splits operands on `,` and trims each; returns empty array if no operands.
- Returns `null` for blank or comment-only lines.
- Does not validate the mnemonic or operand count — that is the caller's concern.

### parseIntegerLiteral (parse.ts)

```ts
const parseIntegerLiteral = (text: string): bigint | null
```

- Accepts optional leading `+` or `-`.
- Supports decimal (`42`), hex (`0xFF`), binary (`0b1010`), octal (`0o77`).
- Allows underscore separators (`0xdead_beef`).
- Returns `BigInt` or `null` if the text does not match any literal pattern.

### Symbol-table validation

`symbol-table.ts` performs strict validation:

- Unknown mnemonics → `Error` with line number.
- Malformed labels (e.g., empty label, standalone `:`) → `Error` with line number.
- Duplicate labels → `Error` with line number.
- `li` with non-numeric immediate → `Error`.
- Address overflow → `Error`.

## 8. CLI behavior and scope

`bin.ts` (the CLI implementation) provides the GNU-as-like interface.

Linker relaxation remains enabled by default and is unsupported, so `-mno-relax` is required. Architecture attributes and CSR checking are off by default; `--mno-arch-attr` and `--mno-csr-check` are accepted no-ops, while explicit `--march-attr` or `--mcsr-check` requests fail as unimplemented. Supported defaults `--mlittle-endian` and `--fno-pic` remain enabled as no-ops.

### CLI features

- `-o, --output <objfile>` — default `a.out`; `-o -` writes to stdout
- `--march <ISA>` — set architecture (default: no restriction)
- `--defsym <symbol=value>` — repeatable, defines a nonnegative integer absolute symbol
- `--mno-relax` — required override for unsupported relaxation
- `--mno-arch-attr` / `--mno-csr-check` — accepted no-op defaults
- `--march-attr` / `--mcsr-check` — explicit requests rejected as unimplemented
- `--target-help` — prints RISC-V target options and exits 0
- `--version` / `-version` — prints version and exits 0
- `--help` — prints help and exits 0
- GNU one-dash normalization covers `-oFILE`, `-march=VALUE`, `-mno-relax`, `-fno-pic`, and `-version`

### Not supported (and loudly rejected or silently absent)

- ELF, compression, `.include`, relocations, debug info, PIC, linker relaxation, FP/vector/CSR
- `.file`, `.type`, `.size`, `.fill` — unsupported directives (rejected if encountered)

### CLI options vs public assembly validation

Commander rejects unregistered options as unknown options. `validateCliOptions` requires `-mno-relax` and rejects explicit architecture-attribute or CSR-checking requests. Public `assemble` validates defsyms so library and CLI behavior agree.

## 9. Coding conventions

### TypeScript strictness

- `strict: true` with `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` enabled.
- **`type` aliases preferred** over `interface`.
- **Required fields only** — no optional fields in metadata types. The single permitted exception is `numberPart.nonzero`: the zero-immediate constraint applies to only two mnemonics, so requiring the field everywhere would force meaningless `nonzero: false` declarations across the rest of the table.
- **`any` is banned globally** — `typescript/no-explicit-any` is an error with no file exceptions.
- **Export convention**: see section 4. This is a manual style preference, not machine-enforced.

### Function style

- **Arrow functions** — `const f = (...): T => { ... }` everywhere.
- **No `FunctionExpression`** — avoid `function () {}` expressions; use arrows. Manual preference, not lint-enforced.
- **No `export default function`** — use named exports or `const` plus default export where the filename convention requires a default. Manual preference, not lint-enforced.
- **Exception**: generator declarations (`async function*` / `function*`) are required because JavaScript has no arrow-generator syntax. Use `/* oxlint-disable func-style */` at file top with a comment explaining.
- **Prettier is authoritative** for formatting (`.prettierrc`: semi, singleQuote, trailingComma es5, tabWidth 2, printWidth 100, arrowParens always).

### Import conventions

- **Always use `#` package imports**, never relative paths (enforced by oxlint `no-restricted-imports`).
- **No `.js` extensions** in import specifiers — the bundler resolves them.
- Tests may import private instruction siblings (e.g., `#instructions/canonical`) but must still use `#` syntax.
- The `#testing/stream` helper is available to all tests.

### Documentation and naming

- **JSDoc headers** for every production helper function, including local named functions. The exception is the large instruction-encoder families in `src/instructions/canonical.ts`, `src/instructions/pseudo.ts`, and `src/instructions/formats.ts`.
- **Brief comments** for nontrivial regexes (`OFFSET_BASE_OPERAND`, `INTEGER_LITERAL`, `LABEL_PATTERN`, `stripComment`).
- **One spelling per concept** — no aliasing.
- **No unused / test-only exports** in production code.
- **No comments that restate the obvious**.

### Dependencies

- **Do not add dependencies without need.** Currently only `commander` (runtime) and standard dev dependencies (oxlint, prettier, tsx, esbuild, rimraf, typescript, @types/node).

## 10. Testing guidance

### Test framework

- **`node:test`** (built-in Node test runner) with **`node:assert/strict`** (deep equal, strict equal).
- Tests are **colocated**: `src/**/*.test.ts` sits next to the module it tests.
- Runner: `tsx --conditions @risc-v-asm/source --test "src/**/*.test.ts"`.
- Shared helpers at `testing/stream.ts` imported via `#testing/stream`:
  - `sourceLines(lines: string[]): AsyncIterable<string>` — wraps an array as an async iterable.
  - `collectBytes(chunks: AsyncIterable<Uint8Array>): Promise<Uint8Array>` — concatenates byte chunks.

### Encoder tests

- **Assert exact bytes** — use `assert.deepEqual(result, Uint8Array.from([...]))` or compare against `INSTRUCTION_MAP.get(mnemonic)!.encode(...)` directly (as `canonical.test.ts` and `formats.test.ts` do).
- Do **not** weaken byte tests to length-only assertions. Length checks are acceptable for composite assembly scenarios where exact bytes are derived from the encoder being tested separately.
- Test files may deep-import private encoder modules (`#instructions/canonical`, `#instructions/formats`, `#instructions/pseudo`) to exercise individual encoders directly.

### CLI tests

- CLI tests spawn the entry point as a subprocess via `npx tsx --conditions @risc-v-asm/source src/bin.ts ...` using the `runCli` helper defined in `src/bin.test.ts`, which injects `--mno-relax` automatically. The helper returns `{ exitCode, stdout, stderr, stdoutBytes }` so tests can assert on exit code, stderr text, and output bytes.
- Verify unregistered options fail as unknown options.
- Tests that create files use `tempDir()` (creates a unique temporary directory with `tmpdir()` and `mkdir`).
- Test `--output -` (stdout), `--defsym`, `--target-help`, and joined `-oFILE` forms.

### Regression tests

- Add a regression test for any bug fixed.
- Run `npm run check` before claiming success — do not rely on a subset.

## 11. Build/package notes

### Build pipeline

```
npm run build
  → rimraf dist
  → rolldown -c rolldown.config.mjs   # bundled dist/index.d.ts + .d.ts.map
  → esbuild src/index.ts src/bin.ts --splitting --sourcemap=external
```

- `rolldown-plugin-dts` uses its Oxc generator, so declaration bundling does not require the TypeScript compiler API.
- The build emits one public declaration file (`dist/index.d.ts`) and one declaration map.
- esbuild bundles both entry points with a shared chunk, external package dependencies, ESM output, and external JavaScript source maps.
- Test files never enter `dist/`; declaration input starts at `src/index.ts`.

### Package exports

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" }
  },
  "bin": { "risc-v-asm": "./dist/bin.js" },
  "files": ["dist", "README.md", "LICENSE"]
}
```

Only `dist/`, `README.md`, and `LICENSE` are published. **`dist/` is generated and must never be hand-edited.**

### Import map (for development and testing)

```json
{
  "imports": {
    "#index": { "@risc-v-asm/source": "./src/index.ts" },
    "#assemble": { "@risc-v-asm/source": "./src/assemble/index.ts" },
    "#instructions": { "@risc-v-asm/source": "./src/instructions/index.ts" },
    "#package.json": { "@risc-v-asm/source": "./package.json", "default": "./package.json" },
    "#*": { "@risc-v-asm/source": "./src/*.ts" }
  }
}
```

The `@risc-v-asm/source` condition resolves `#` imports to TypeScript source during development/testing (`tsx --conditions @risc-v-asm/source`). Published consumers use only the package-root `exports` map, whose types point to the bundled `dist/index.d.ts`.

## 12. Git/workflow safety

- **Worktree may contain intentional uncommitted changes.** Do not assume a clean working tree.
- **Do not `commit`, `push`, `amend`, `reset`, or `discard changes`** unless explicitly asked.
- **Inspect `git status` and `git diff`** before and after editing; there are no concurrent writers.
- **Do not add generated artifacts, logs, or `a.out`** to the repository.
- **Do not stage files** as part of any task unless instructed.
- Run `npm run format:check` (or `fix`) before final output to ensure formatting compliance.
- Use `npm run check` as the definitive validation gate.
