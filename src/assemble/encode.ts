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

// Streaming encoding pass.  Addresses, sizes, relocations, and zero-substituted
// operands all come from the layout pass; this module only turns each placed
// record into bytes, streaming `.text` chunks and buffering `.data`/`.rodata`
// until the end.

import { INSTRUCTION_MAP, resolveOperands, selectSignature } from '#instructions';
import { parseDataDirective } from '#directives';
import layout from '#layout';
import type { Placed } from '#layout';
import type { RelocationSpec } from '#relocations';

type DirectiveRecord = Extract<Placed, { readonly kind: 'directive' }>;

const EMPTY_BYTES = new Uint8Array(0);

/**
 * Metadata produced by the encoding pass: the total .text size, every
 * relocation that must be emitted into `.rela.text`, and whether any
 * compressed (2-byte) instruction was encoded.
 */
export type EncodeMetadata = {
  readonly totalTextSize: number;
  readonly relocations: readonly RelocationSpec[];
  readonly hasCompressed: boolean;
};

/**
 * Return NOP fill bytes for the given padding size in .text.
 * Uses c.nop (0x0001) for 2-byte units and nop (0x00000013) for 4-byte units.
 *
 * @param size - Number of padding bytes needed.
 * @returns The padding bytes.
 */
const nopFill = (size: number): Uint8Array => {
  const nop4 = Uint8Array.from([0x13, 0x00, 0x00, 0x00]);
  const cNop2 = Uint8Array.from([0x01, 0x00]);
  const result = new Uint8Array(size);
  let pos = 0;
  while (pos + 4 <= size) {
    result.set(nop4, pos);
    pos += 4;
  }
  if (pos + 2 <= size) {
    result.set(cNop2, pos);
  }
  // The caller rejects odd padding, so the remainder is always 0 or 2 here.
  return result;
};

/**
 * Materialize the bytes of one directive record.
 *
 * Directives are laid out (sized) during the layout pass but only turned into
 * bytes here, so `.data` and `.rodata` content stays buffered in the encoder
 * instead of in the symbol table.  `.text` alignment padding is filled with
 * valid instructions rather than zeros, and padding that cannot be expressed
 * as NOPs is rejected.
 *
 * @param placed - Directive record emitted by the layout pass.
 * @returns The bytes this directive contributes to its section.
 * @throws Error if `.text` alignment padding is an odd number of bytes.
 */
const directiveBytes = (placed: DirectiveRecord): Uint8Array => {
  if (placed.alignment !== null) {
    if (placed.section !== '.text') return new Uint8Array(placed.size);
    if (placed.size % 2 !== 0) {
      throw new Error(
        `Cannot align at line ${placed.line}: padding ${placed.size} byte(s) ` +
          'cannot be represented with valid instructions'
      );
    }
    return nopFill(placed.size);
  }
  return parseDataDirective(placed.text, placed.section, placed.address)?.bytes ?? EMPTY_BYTES;
};

/**
 * Encode a stream of source lines into section bytes, yielding one chunk per
 * `.text` instruction line.  Operand resolution, relocation records, and
 * placeholder substitution come from the layout pass, so this pass never
 * re-parses source text or re-derives addresses.
 *
 * @param lines - Source lines in assembly order.
 * @param symbols - Symbol-table mapping label names to byte addresses.
 * @param baseAddress - Address assigned to the first instruction byte.
 * @yields `.text` bytes in source order, then buffered `.data` bytes, then
 * buffered `.rodata` bytes.  `.bss` occupies no file space.
 * @returns The total text size, collected `.text` relocations, and compressed
 * flag when iteration completes.
 * @throws Error if an encoder's byte length disagrees with the size the layout
 * pass assigned to that instruction.
 */
export async function* encode(
  lines: AsyncIterable<string>,
  symbols: ReadonlyMap<string, number>,
  baseAddress = 0
): AsyncGenerator<Uint8Array, EncodeMetadata> {
  const relocations: RelocationSpec[] = [];
  const dataChunks: Uint8Array[] = [];
  const rodataChunks: Uint8Array[] = [];
  const bufferedSections = new Map<string, Uint8Array[]>([
    ['.data', dataChunks],
    ['.rodata', rodataChunks],
  ]);
  let totalTextSize = 0;
  let hasCompressed = false;

  for await (const placed of layout(lines, baseAddress)) {
    if (placed.kind === 'instruction') {
      if (placed.compressed) hasCompressed = true;
      totalTextSize += placed.size;
      const entry = INSTRUCTION_MAP.get(placed.mnemonic)!;
      // The layout pass already validated the operand list, so a match exists.
      const signature = selectSignature(entry.signatures, placed.operands)!;
      const args = resolveOperands(placed.modifiedOperands, signature, {
        address: placed.address,
        symbols,
        mnemonic: placed.mnemonic,
      });
      const bytes = entry.encode(...args);
      if (bytes.length !== placed.size) {
        throw new Error(
          `Instruction at line ${placed.line}: encoder produced ${bytes.length} byte(s) but ` +
            `the layout pass sized it as ${placed.size}`
        );
      }
      yield bytes;
      for (const relocation of placed.relocations) relocations.push(relocation);
      continue;
    }
    if (placed.kind !== 'directive') continue;

    if (placed.compressed) hasCompressed = true;
    const bytes = directiveBytes(placed);
    if (placed.section === '.text') {
      totalTextSize += placed.size;
      if (bytes.length > 0) yield bytes;
      continue;
    }
    const buffer = bufferedSections.get(placed.section);
    if (buffer !== undefined && bytes.length > 0) buffer.push(bytes);
  }

  // Yield buffered data, then rodata bytes after all text instruction chunks.
  for (const chunk of dataChunks) yield chunk;
  for (const chunk of rodataChunks) yield chunk;

  return { totalTextSize, relocations, hasCompressed };
}
