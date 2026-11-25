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

/* oxlint-disable complexity -- parseDataDirective is a large switch over directive types, unavoidable */

import { parseIntegerLiteral } from '#parse';
import { R_RISCV_32, R_RISCV_64 } from '#relocations';
import type { RelocationSpec } from '#relocations';

/**
 * Result of processing a data directive line in pass 1 (size computation) or
 * pass 2 (byte emission).
 */
type DirectiveResult = Readonly<{
  /** Size in bytes added to the current section. */
  size: number;
  /** Relocations introduced by this directive (empty for numeric literals). */
  relocations: readonly RelocationSpec[];
  /** Bytes to emit in pass 2 (empty for .bss). */
  bytes?: Uint8Array;
  /** Requested alignment for the section (set for .align/.p2align/.balign). */
  alignment?: number;
}>;

/**
 * Parse a data directive line and compute its size and relocations.
 * This function is used by both pass 1 and pass 2; pass 1 ignores `bytes`,
 * pass 2 uses it to emit bytes.
 *
 * @param line - Directive line without leading labels or comments.
 * @param currentSection - Name of the section where this directive appears.
 * @param offset - Offset within the current section (for relocation offsets).
 * @returns Directive result, or null if the line is not a known data directive.
 */
export const parseDataDirective = (
  line: string,
  currentSection: string,
  offset: number
): DirectiveResult | null => {
  const parts = line.trim().split(/\s+/);
  const directive = parts[0]!;
  const args = parts.slice(1).join(' ');

  // Helper to parse comma-separated list of values.
  const parseValues = (text: string): Array<bigint | string> => {
    return text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const lit = parseIntegerLiteral(s);
        if (lit !== null) return lit;
        return s; // symbol
      });
  };

  switch (directive) {
    case '.byte': {
      const values = parseValues(args);
      const size = values.length;
      const relocations: RelocationSpec[] = [];
      const bytes = new Uint8Array(size);
      for (let i = 0; i < values.length; i++) {
        const v = values[i]!;
        if (typeof v === 'bigint') {
          const n = Number(v);
          if (n < -128 || n > 255) throw new Error(`Byte value ${n} out of range`);
          bytes[i] = n & 0xff;
        } else {
          bytes[i] = 0;
          relocations.push({
            offset: offset + i,
            section: currentSection,
            type: R_RISCV_32,
            symbolName: v,
            addend: 0,
          });
        }
      }
      return { size, relocations, bytes };
    }

    case '.half':
    case '.short':
    case '.2byte': {
      const values = parseValues(args);
      const size = values.length * 2;
      const relocations: RelocationSpec[] = [];
      const bytes = new Uint8Array(size);
      for (let i = 0; i < values.length; i++) {
        const v = values[i]!;
        const idx = i * 2;
        if (typeof v === 'bigint') {
          const n = Number(v);
          if (n < -32768 || n > 65535) throw new Error(`Half value ${n} out of range`);
          bytes[idx] = n & 0xff;
          bytes[idx + 1] = (n >> 8) & 0xff;
        } else {
          bytes[idx] = 0;
          bytes[idx + 1] = 0;
          relocations.push({
            offset: offset + idx,
            section: currentSection,
            type: R_RISCV_32,
            symbolName: v,
            addend: 0,
          });
        }
      }
      return { size, relocations, bytes };
    }

    case '.word':
    case '.4byte':
    case '.long': {
      const values = parseValues(args);
      const size = values.length * 4;
      const relocations: RelocationSpec[] = [];
      const bytes = new Uint8Array(size);
      for (let i = 0; i < values.length; i++) {
        const v = values[i]!;
        const idx = i * 4;
        if (typeof v === 'bigint') {
          const n = Number(v);
          bytes[idx] = n & 0xff;
          bytes[idx + 1] = (n >> 8) & 0xff;
          bytes[idx + 2] = (n >> 16) & 0xff;
          bytes[idx + 3] = (n >> 24) & 0xff;
        } else {
          for (let j = 0; j < 4; j++) bytes[idx + j] = 0;
          relocations.push({
            offset: offset + idx,
            section: currentSection,
            type: R_RISCV_32,
            symbolName: v,
            addend: 0,
          });
        }
      }
      return { size, relocations, bytes };
    }

    case '.dword':
    case '.8byte':
    case '.quad': {
      const values = parseValues(args);
      const size = values.length * 8;
      const relocations: RelocationSpec[] = [];
      const bytes = new Uint8Array(size);
      for (let i = 0; i < values.length; i++) {
        const v = values[i]!;
        const idx = i * 8;
        if (typeof v === 'bigint') {
          const n = v;
          const lo = Number(n & 0xffffffffn);
          const hi = Number(n >> 32n);
          bytes[idx] = lo & 0xff;
          bytes[idx + 1] = (lo >> 8) & 0xff;
          bytes[idx + 2] = (lo >> 16) & 0xff;
          bytes[idx + 3] = (lo >> 24) & 0xff;
          bytes[idx + 4] = hi & 0xff;
          bytes[idx + 5] = (hi >> 8) & 0xff;
          bytes[idx + 6] = (hi >> 16) & 0xff;
          bytes[idx + 7] = (hi >> 24) & 0xff;
        } else {
          for (let j = 0; j < 8; j++) bytes[idx + j] = 0;
          relocations.push({
            offset: offset + idx,
            section: currentSection,
            type: R_RISCV_64,
            symbolName: v,
            addend: 0,
          });
        }
      }
      return { size, relocations, bytes };
    }

    case '.asciz':
    case '.string': {
      const match = /^"([^"]*)"$/.exec(args.trim());
      if (!match) throw new Error(`Expected string literal, got ${args}`);
      const str = match[1]!;
      const size = str.length + 1;
      const bytes = new Uint8Array(size);
      for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
      bytes[str.length] = 0;
      return { size, relocations: [], bytes };
    }

    case '.zero':
    case '.space': {
      const val = parseIntegerLiteral(args.trim());
      if (val === null) throw new Error(`Expected integer size, got ${args}`);
      const size = Number(val);
      if (size < 0) throw new Error(`Negative size ${size}`);
      const bytes = new Uint8Array(size);
      return { size, relocations: [], bytes };
    }

    case '.p2align':
    case '.align': {
      // .align N and .p2align N: align to 2^N bytes boundary
      const val = parseIntegerLiteral(args.trim());
      if (val === null) throw new Error(`Expected integer exponent, got ${args}`);
      if (val < 0n) throw new Error(`Negative alignment exponent ${val}`);
      const exponent = Number(val);
      if (!Number.isSafeInteger(exponent)) throw new Error(`Alignment exponent too large: ${val}`);
      const align = 1 << exponent;
      let padding = 0;
      if (align > 1) padding = (align - (offset % align)) % align;
      // For .align 0: no-op (padding=0), but alignment value is 1
      const alignment = exponent === 0 ? 1 : align;
      const bytes = new Uint8Array(padding);
      return { size: padding, relocations: [], bytes, alignment };
    }

    case '.balign': {
      // .balign N: align to N bytes boundary (not power-of-two)
      const val = parseIntegerLiteral(args.trim());
      if (val === null) throw new Error(`Expected integer alignment, got ${args}`);
      if (val < 0n) throw new Error(`Negative alignment value ${val}`);
      const align = Number(val);
      if (!Number.isSafeInteger(align)) throw new Error(`Alignment value too large: ${val}`);
      let padding = 0;
      if (align > 1) padding = (align - (offset % align)) % align;
      const bytes = new Uint8Array(padding);
      return { size: padding, relocations: [], bytes, alignment: align };
    }

    default:
      return null;
  }
};
