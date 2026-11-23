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

// Generic operand resolution for metadata-driven assembly.  This module has no
// mnemonic-specific logic: every operand value is derived purely from the
// InstructionSignature's encoder signature.

import { parseIntegerLiteral } from '#parse';

export type InstructionSignature = {
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

type EncodeContext = Readonly<{
  address: number;
  symbols: ReadonlyMap<string, number>;
}>;

// Match offset(base): group 1 is the possibly empty offset text before '(';
// group 2 is the nonempty base text inside parentheses. Nested parentheses are rejected.
const OFFSET_BASE_OPERAND = /^([^()]*)\(([^()]+)\)$/;

const REGISTERS = new Map<string, number>([
  ['zero', 0],
  ['ra', 1],
  ['sp', 2],
  ['gp', 3],
  ['tp', 4],
  ['t0', 5],
  ['t1', 6],
  ['t2', 7],
  ['s0', 8],
  ['fp', 8],
  ['s1', 9],
  ['a0', 10],
  ['a1', 11],
  ['a2', 12],
  ['a3', 13],
  ['a4', 14],
  ['a5', 15],
  ['a6', 16],
  ['a7', 17],
  ['s2', 18],
  ['s3', 19],
  ['s4', 20],
  ['s5', 21],
  ['s6', 22],
  ['s7', 23],
  ['s8', 24],
  ['s9', 25],
  ['s10', 26],
  ['s11', 27],
  ['t3', 28],
  ['t4', 29],
  ['t5', 30],
  ['t6', 31],
]);

/**
 * Resolve a register name to its number.
 *
 * @param text - Register spelling such as `x0`, `a0`, or an ABI alias.
 * @returns The register number, or zero for an unknown register.
 */
const resolveRegister = (text: string): number => {
  const normalized = text.toLowerCase();
  // Match x0 through x31: one digit, 10-29, or 30-31.
  if (/^x(?:[0-9]|[12][0-9]|3[01])$/.test(normalized)) {
    return Number(normalized.slice(1));
  }
  return REGISTERS.get(normalized) ?? 0;
};

/**
 * Resolve an integer literal or symbol reference.
 *
 * @param text - Numeric literal or symbol name.
 * @param context - Current address and symbol table.
 * @param relative - Whether symbol values should be relative to the current address.
 * @returns The resolved numeric value; unknown symbols resolve to zero.
 */
const resolveNumber = (text: string, context: EncodeContext, relative = false): number => {
  const literal = parseIntegerLiteral(text);
  if (literal !== null) return Number(literal);
  const symbol = context.symbols.get(text) ?? 0;
  return relative ? symbol - context.address : symbol;
};

/**
 * Resolve one address operand or one of its scattered immediate parts.
 *
 * @param text - Address text such as `offset(base)` or a bare expression.
 * @param context - Current address and symbol table.
 * @param addressPart - Address-part metadata selected by the encoder signature.
 * @returns The resolved base, offset, or encoded offset fragment.
 */
/* oxlint-disable-next-line complexity -- nested switch splitting offset parts is structurally clean */
const resolveAddress = (
  text: string,
  context: EncodeContext,
  {
    addressPart: part,
    relative,
  }: Extract<InstructionSignature['encoderSignature'][number], { readonly type: 'address' }>
): number => {
  const match = OFFSET_BASE_OPERAND.exec(text);
  if (match) {
    const offsetText = match[1]!.trim();
    const baseText = match[2]!.trim();
    const offset = offsetText.length === 0 ? 0 : resolveNumber(offsetText, context);

    switch (part) {
      case 'base':
        return resolveRegister(baseText);
      case 'offset':
        return offset;
      case 'offsetHigh':
        return (offset >> 5) & 0x7f;
      case 'offsetLow':
        return offset & 0x1f;
      case 'branchOffsetHigh': {
        const truncated = offset & 0x1fff;
        return ((truncated >> 5) & 0x3f) | (((truncated >> 12) & 1) << 6);
      }
      case 'branchOffsetLow': {
        const truncated = offset & 0x1fff;
        return (((truncated >> 1) & 0xf) << 1) | ((truncated >> 11) & 1);
      }
      case 'jumpOffset': {
        const truncated = offset & 0x1fffff;
        return (
          (((truncated >> 20) & 1) << 19) |
          (((truncated >> 1) & 0x3ff) << 9) |
          (((truncated >> 11) & 1) << 8) |
          ((truncated >> 12) & 0xff)
        );
      }
    }
  }

  // Bare expression (branch target, jump target, or simple number)
  if (relative) {
    const value = resolveNumber(text, context, true);
    switch (part) {
      case 'offset':
        return value;
      case 'branchOffsetHigh': {
        const truncated = value & 0x1fff;
        return ((truncated >> 5) & 0x3f) | (((truncated >> 12) & 1) << 6);
      }
      case 'branchOffsetLow': {
        const truncated = value & 0x1fff;
        return (((truncated >> 1) & 0xf) << 1) | ((truncated >> 11) & 1);
      }
      case 'jumpOffset': {
        // Scattered 20-bit J-immediate from a 21-bit signed byte offset.
        const truncated = value & 0x1fffff;
        return (
          (((truncated >> 20) & 1) << 19) |
          (((truncated >> 1) & 0x3ff) << 9) |
          (((truncated >> 11) & 1) << 8) |
          ((truncated >> 12) & 0xff)
        );
      }
      default:
        return 0;
    }
  }

  // Malformed or bare memory fallback
  if (part === 'base') return 0;
  const fallback = resolveNumber(text, context);
  return part === 'offset' ? fallback : 0;
};

/**
 * Resolve all operands according to the encoder signature.
 * `operands` are the raw source-text operand strings (trimmed).
 * Returns an array of positional arguments for `entry.encode(...)`.
 */
export const resolveOperands = (
  operands: readonly string[],
  signature: InstructionSignature,
  context: EncodeContext
): number[] => {
  return signature.encoderSignature.map((arg) => {
    switch (arg.type) {
      case 'constant':
        return arg.value;
      case 'register':
        return resolveRegister(operands[arg.sourceOperand]!);
      case 'number':
        return resolveNumber(operands[arg.sourceOperand]!, context);
      case 'address':
        return resolveAddress(operands[arg.sourceOperand]!, context, arg);
    }
  });
};
