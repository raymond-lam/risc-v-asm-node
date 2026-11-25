/*
 * Copyright 2026 Raymond Lam
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* oxlint-disable func-style -- Async generators cannot be written as arrow functions. */

import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { Readable } from 'node:stream';

/**
 * Yield lines from each input file in order, closing streams after use.
 *
 * @param filePaths - File paths to read.
 * @yields Lines from each file.
 */
const fileLines = async function* (filePaths: readonly string[]): AsyncGenerator<string> {
  for (const file of filePaths) {
    const stream = createReadStream(file);
    const lines = createInterface({ input: stream, crlfDelay: Infinity });
    try {
      for await (const line of lines) yield line;
    } finally {
      lines.close();
      stream.destroy();
    }
  }
};

import { encode } from '#assemble/encode';
import { computeElfParts, writeElfStream } from '#elf';
import { parseIntegerLiteral } from '#parse';
import { parseMarch, validateMarch } from '#assemble/march';
export { missingExtension } from '#assemble/march';
import { buildSymbolTableWithRefs } from '#symbol-table';
import { safeInteger } from '#utils/integer';

type AssembleOptions = Readonly<{
  defsym?: readonly string[];
  marchAttr?: boolean;
  march?: string;
}>;

/**
 * Parse `symbol=value` definitions into a resolved symbol map.
 *
 * @param definitions - Raw definitions supplied through `defsym`.
 * @returns A map from symbol names to nonnegative safe integers.
 * @throws Error if a definition is malformed or its value is invalid.
 */
const definedSymbols = (definitions: readonly string[] | undefined): Map<string, number> => {
  const symbols = new Map<string, number>();
  for (const definition of definitions ?? []) {
    const match = /^([A-Za-z_.$][A-Za-z0-9_.$]*)=(.*)$/.exec(definition);
    if (!match) throw new Error(`--defsym expects symbol=value, got "${definition}"`);
    const value = parseIntegerLiteral(match[2]!);
    if (value === null) {
      throw new Error(`--defsym value for "${match[1]}" must be an integer`);
    }
    symbols.set(match[1]!, safeInteger(value, `Value of ${match[1]}`));
  }
  return symbols;
};

/**
 * Assemble source text or file paths into an ELF64 ET_REL object.
 * A string is always source text; each array element is a file path.
 * Validation, symbol layout, and encoding begin when the returned generator
 * is iterated.
 *
 * The generator yields a sequence of chunks: first the ELF header, then
 * the .text section in one or more instruction-byte chunks, then the
 * trailer sections (.rela.text, .symtab, .strtab, .shstrtab, optional
 * .riscv.attributes, and the section header table).
 *
 * @param input - Assembly source text, or file paths read in array order.
 * @param options - Predefined symbol definitions and ELF options.
 * @yields The ELF64 ET_REL object as a sequence of byte chunks.
 */
export async function* assemble(
  input: string | readonly string[],
  options: AssembleOptions = {}
): AsyncGenerator<Uint8Array> {
  const predefinedSymbols = definedSymbols(options.defsym);

  // Parse -march if provided.  Default (no flag) is unrestricted — every
  // mnemonic in INSTRUCTION_MAP assembles.
  let allowedExtensions: { set: ReadonlySet<string>; isa: string } | undefined;
  const marchValue = options.march;
  if (marchValue !== undefined) {
    const parsed = parseMarch(marchValue);
    validateMarch(marchValue, parsed);
    allowedExtensions = { set: parsed, isa: marchValue };
  }

  // Pass 1: Build symbol table with references and metadata.
  const {
    symbols: labelSymbols,
    references,
    hasCompressed,
    globalLabels,
    sectionStates,
    sectionRelocations,
    labelSections,
  } = await buildSymbolTableWithRefs(
    typeof input === 'string' ? Readable.from(input.split(/\r?\n/)) : fileLines(input),
    0,
    allowedExtensions
  );
  const allSymbols = new Map([...predefinedSymbols, ...labelSymbols]);

  // Compute ELF parts (header, trailer data) using pass-1 metadata.
  const parts = computeElfParts(
    sectionStates,
    sectionRelocations,
    labelSymbols,
    references,
    predefinedSymbols,
    hasCompressed,
    options.marchAttr,
    globalLabels,
    labelSections
  );

  // Pass 2: Stream the ELF file.
  // encode() yields .text instruction chunks (streamed), then .data bytes
  // (buffered until EOF), then .rodata bytes (buffered until EOF).
  const textSize = sectionStates.get('.text')?.size ?? 0;
  const dataSize = sectionStates.get('.data')?.size ?? 0;
  yield* writeElfStream(
    encode(
      typeof input === 'string' ? Readable.from(input.split(/\r?\n/)) : fileLines(input),
      allSymbols,
      0
    ),
    parts,
    textSize,
    dataSize
  );
}
