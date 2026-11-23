# AGENTS.md — risc-v-asm coding guide

## 1. Project purpose

`risc-v-asm` is an **ESM-only TypeScript library** for assembling a strict **RV64I/RV64M** flat-assembler subset, plus a **GNU-as-like CLI** that wraps that library. It provides instruction encoders, a one-pass symbol table for flat streams, pseudo-instruction expansion, and helpers for Intel HEX output. It is **not** a full GNU assembler: no ELF, no linker relaxation, no compressed instructions, no directives/relocations/includes, no debug info, no FP/vector.

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
├── bin.ts                   # Executable entry (#!/usr/bin/env node) and CLI implementation (named export runCli)
├── formats.ts               # Intel HEX stream formatting (named export intelHex)
├── parse.ts                 # Standalone parsers: parseInstruction, parseIntegerLiteral (named exports)
├── symbol-table.ts          # buildSymbolTable (named export)
├── utils/
│   ├── bytes.ts             # Little-endian 16/32-bit serializers (named exports)
│   └── integer.ts           # Nonnegative safe-integer conversion (named export safeInteger)
├── assemble/
│   ├── index.ts             # Public two-pass assembler, input streams, and option validation
│   └── flat.ts              # assembleFlat async generator (named export)
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
- `AssembleOptions` may remain private to `assemble/index.ts`. It contains optional `format`, `baseAddress`, and `defsym` fields, with the same relevant validation and integer syntax as the CLI. Do not add output, statistics, help, or extra root exports.
- Validation and both assembly passes run when iteration begins. `assemble` creates a fresh line stream for each pass, awaits internal `buildSymbolTable`, merges predefined symbols before labels so labels override same-name definitions, and encodes the fresh stream.
- Path arrays are streamed with `createReadStream` and `readline` on each pass. Source strings are split and streamified afresh. Production source must not synchronously open or read files.
- Binary output yields encoded `Uint8Array` chunks. Intel HEX output also yields `Uint8Array`, containing newline-terminated UTF-8 records, with 16-byte data limits, 64 KiB boundaries, extended addresses, checksums, EOF, and 32-bit range enforcement.

### Internal pass 1: buildSymbolTable

```ts
const buildSymbolTable = async (
  lines: AsyncIterable<string>,
  startAddress?: number
): Promise<ReadonlyMap<string, number>>
```

- Consumes the source stream once to resolve labels to byte addresses.
- Rejects unknown mnemonics, malformed labels, duplicate labels, and non-numeric `li` immediates with `Error` containing a line number.
- `startAddress` must be a nonnegative safe integer (default `0`).
- Returns a type-level-readonly `Map<string, number>`.
- This is internal only; do not re-export it from `src/index.ts`.

### Internal pass 2: assembleFlat

```ts
async function* assembleFlat(
  lines: AsyncIterable<string>,
  symbols: ReadonlyMap<string, number>,
  baseAddress = 0
): AsyncGenerator<Uint8Array>
```

- Encodes each line against the resolved symbol table.
- Yields `Uint8Array` chunks (one per instruction line).
- Does **not** build symbols — `assemble` owns that orchestration.
- Uses only the three positional arguments above. There is no `AssemblyOptions` object and no `extensions` option.
- Intentionally **permissive**: malformed source can trigger a non-null assertion failure, and there is no range checking on immediates or offsets. Public `assemble` validates options before invoking it.

### CLI input and output behavior

- `bin.ts` calls public `assemble` from `#index`; it does not own symbol-table, flat-assembly, source-line, Intel HEX, or defsym implementation details.
- At least one source path is required. CLI stdin and `-` input paths are unsupported; path arrays go directly to `assemble` and are reopened for its two passes. `-` remains valid only as the output path.
- Output remains streaming via `pipeline(Readable.from(output), createWriteStream(path))` or direct stdout writes. Intel HEX conversion tracks only a small pending byte array.

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

### Critical rule: stay table-driven

- **No mnemonic-specific encode helpers** — the flat assembler (`flat.ts`) uses only `INSTRUCTION_MAP.get(mnemonic)!` and `resolveOperands()`; it never inspects which mnemonic it is assembling.
- **No second mnemonic registry** — `INSTRUCTION_MAP` is the one and only.
- **No switches, Sets of mnemonics, or handler closures** — operand resolution in `operands.ts` is purely generic, driven by the encoder signature.
- **No removing instructions** — never delete a mnemonic, encoder, or registry entry unless explicitly requested.

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

### Flat assembly permissiveness

`flat.ts` assumes valid source. It uses non-null assertions (`!`) everywhere: `INSTRUCTION_MAP.get(mnemonic)!`, `signature!`. No range checking on immediates, offsets, or register numbers. That is intentional — the library trusts the symbol-table pass and the caller.

## 8. CLI behavior and scope

`bin.ts` (named export `runCli`) provides the GNU-as-like interface.

### Supported output formats

- **`binary`** — flat binary.
- **`elf`** (default) — rejected unless `--format=binary` or `--format=ihex` is supplied.
- **`ihex`** — Intel HEX (16-byte max data records, extended-linear-address records, correct checksums, `:00000001FF` EOF; 32-bit address space).
- **`elf`** — **rejected** with explicit error message ("ELF object output is not implemented").

### CLI option scope

Non-default unimplemented flags are not registered with Commander and are unknown options. Public assembly validation gives descriptive errors for `--format=elf`.

GNU's unsupported defaults remain registered and enabled by default: `--mrelax`, `--march-attr`, and `--mcsr-check`. Assembly fails until users explicitly select `--mno-relax`, `--mno-arch-attr`, and `--mno-csr-check`. Supported GNU defaults `--mlittle-endian` and `--fno-pic` remain enabled as no-ops.

### CLI features

- `-o, --output <objfile>` — default `a.out`; `-o -` writes to stdout
- `--format <format>` — elf (default, error), binary, or ihex
- `--base-address <address>` — flat-output origin (default `0`); does not pad the binary
- `--defsym <symbol=value>` — repeatable, defines a nonnegative integer absolute symbol
- `--mno-relax --mno-arch-attr --mno-csr-check` — required supported overrides for GNU's unsupported defaults
- `--target-help` — prints RISC-V target options and exits 0
- `--version` / `-version` — prints version and exits 0
- `--help` — prints help and exits 0
- GNU one-dash normalization covers only supported forms such as `-mno-relax`, `-fno-pic`, and `-oFILE`

### Not supported (and loudly rejected or silently absent)

- ELF, compression, `.include`, relocations, debug info, PIC, linker relaxation, FP/vector/CSR
- `.file`, `.section`, `.globl`, `.type`, `.size`, `.align`, `.zero`, `.fill`, `.space`, `.string`, `.asciz` — no directives at all

### CLI options vs public assembly validation

Commander rejects unregistered options as unknown options. `validateCliOptions` rejects GNU's unsupported defaults until their three supported overrides are selected. Public `assemble` validates format, base address, and defsyms so library and CLI behavior agree. Internal `assembleFlat` remains intentionally permissive.

## 9. Coding conventions

### TypeScript strictness

- `strict: true` with `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` enabled.
- **`type` aliases preferred** over `interface`.
- **Required fields only** — no optional fields in metadata types.
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

- Use the `testIo()` helper to produce an in-memory `CliIo` bag.
- Verify unregistered options fail as unknown options; ISA/ABI/format values retain descriptive errors.
- Tests that create files use `tempDir()` (creates a unique temporary directory with `tmpdir()` and `mkdir`).
- Test `--output -` (stdout), `--format=binary`, `--format=ihex`, `--defsym`, `--target-help`, and joined `-oFILE` forms.

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
