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

import { parseIntegerLiteral, parseOperator } from '#parse';

export type InstructionSignature = {
  readonly sourceSignature: readonly ('register' | 'number' | 'address')[];
  readonly encoderSignature: readonly (
    | { readonly type: 'constant'; readonly value: number }
    | { readonly type: 'generatedLabel'; readonly sourceOperand: number }
    | { readonly type: 'register'; readonly sourceOperand: number }
    | { readonly type: 'number'; readonly sourceOperand: number; readonly relocationType?: number }
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
          | 'jumpOffset'
          | 'cOffsetHiWord'
          | 'cOffsetLoWord'
          | 'cOffsetHiDouble'
          | 'cOffsetLoDouble'
          | 'cOffsetSpWord'
          | 'cOffsetSpDouble'
          | 'cOffsetSpWordHi'
          | 'cOffsetSpWordLo'
          | 'cOffsetSpDoubleHi'
          | 'cOffsetSpDoubleLo'
          | 'cStackAdjustHi'
          | 'cStackAdjustLo'
          | 'cBranchOffsetHigh'
          | 'cBranchOffsetLow';
        readonly relative: boolean;
        readonly relocationType?: number;
      }
  )[];
};

type EncodeContext = Readonly<{
  address: number;
  symbols: ReadonlyMap<string, number>;
  mnemonic: string;
}>;

// Match offset(base): group 1 is the possibly empty offset text before '(';
// group 2 is the nonempty base text inside parentheses. Nested parentheses are rejected.
const OFFSET_BASE_OPERAND = /^(.*)\(([^()]+)\)$/;

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
 * Validate a compressed load/store offset.
 * @param offset - Byte offset (must be nonnegative).
 * @param scaling - Right shift amount (2 for word, 3 for double).
 * @param bits - Number of bits available after shifting.
 * @param description - Human-readable description for error messages.
 * @param minShifted - Minimum allowed shifted value (default 0).
 * @throws Error if offset is misaligned or out of range.
 */
const validateCompressedOffset = (
  offset: number,
  scaling: number,
  bits: number,
  description: string,
  minShifted = 0
): void => {
  if (offset < 0) {
    throw new Error(`offset ${offset} is negative, which is not encodable`);
  }
  const mask = (1 << scaling) - 1;
  if ((offset & mask) !== 0) {
    throw new Error(`offset ${offset} is not encodable: must be a multiple of ${1 << scaling}`);
  }
  const shifted = offset >> scaling;
  const maxShifted = (1 << bits) - 1;
  if (shifted < minShifted || shifted > maxShifted) {
    throw new Error(
      `offset ${offset} is not encodable: ${description} must be within ` +
        `${minShifted << scaling}..${maxShifted << scaling}`
    );
  }
};

/**
 * Resolve a register name to its number.
 *
 * @param text - Register spelling such as `x0`, `a0`, or an ABI alias.
 * @returns The register number, or zero for an unknown register.
 */
/**
 * Determine whether text names a valid register (x0–x31 or ABI alias).
 *
 * @param text - Potential register spelling.
 * @returns True if the text is a register name.
 */
export const isRegisterText = (text: string): boolean => {
  const normalized = text.toLowerCase();
  return /^x(?:[0-9]|[12][0-9]|3[01])$/.test(normalized) || REGISTERS.has(normalized);
};

/**
 * Determine whether one operand text can be read as a signature operand type.
 *
 * Compatibility breaks ties between signatures of equal arity: `c.swsp a0,
 * 4(sp)` must select the `['register', 'address']` variant instead of the raw
 * `['number', 'number']` variant, which would silently encode two zeros.
 *
 * Only a bare register is incompatible with `address`: every other token is a
 * branch target, symbol, `%hi()`/`%lo()` operator, or `offset(base)` form, so
 * an unknown base register is still rejected by address resolution rather than
 * falling through to an unrelated signature.
 *
 * @param type - Operand meaning declared by the signature.
 * @param text - Raw operand text from the source line.
 * @returns True if the text fits that operand type.
 */
const isCompatibleOperand = (
  type: InstructionSignature['sourceSignature'][number],
  text: string
): boolean => {
  // A register name is never a literal, symbol, or %hi()/%lo() operand.
  const isRegister = isRegisterText(text);
  return type === 'register' ? isRegister : !isRegister;
};

/**
 * Select the signature variant that matches a line's operands.
 *
 * Candidates are first narrowed by operand count, then by operand shape; the
 * first arity match is returned when no shape fits, so callers keep reporting
 * an operand-count error for genuinely wrong operand lists.
 *
 * @param signatures - Signature variants of one mnemonic, in declaration order.
 * @param operands - Raw operand texts.
 * @returns The selected signature, or undefined when no variant has that arity.
 */
export const selectSignature = (
  signatures: readonly InstructionSignature[],
  operands: readonly string[]
): InstructionSignature | undefined => {
  const candidates = signatures.filter((s) => s.sourceSignature.length === operands.length);
  return (
    candidates.find((s) =>
      s.sourceSignature.every((type, index) => isCompatibleOperand(type, operands[index]!))
    ) ?? candidates[0]
  );
};

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
  const op = parseOperator(text);
  if (op) {
    const innerLiteral = parseIntegerLiteral(op.inner);
    if (innerLiteral !== null) {
      // Compute hi/lo constant.
      const value = Number(innerLiteral);
      if (op.operator === 'hi' || op.operator === 'pcrel_hi') {
        // %hi(x) = (x + 0x800) >> 12
        return ((value + 0x800) >> 12) & 0xfffff;
      } else {
        // %lo(x) = x & 0xfff (sign-extended low 12 bits)
        return value & 0xfff;
      }
    }
    // inner is a symbol, treat as symbol reference.
    const symbol = context.symbols.get(op.inner) ?? 0;
    return relative ? symbol - context.address : symbol;
  }
  const literal = parseIntegerLiteral(text);
  if (literal !== null) return Number(literal);
  const symbol = context.symbols.get(text) ?? 0;
  return relative ? symbol - context.address : symbol;
};

/**
 * Require the base register of a stack-relative compressed operand to be sp.
 *
 * @param mnemonic - Normalized mnemonic, used in the error message.
 * @param baseText - Base register spelling from the source operand.
 * @throws Error if the base register is not the stack pointer.
 */
const requireStackPointer = (mnemonic: string, baseText: string): void => {
  if (baseText.toLowerCase() !== 'sp') {
    throw new Error(`${mnemonic} requires sp as base register, got ${baseText}`);
  }
};

/**
 * Validate a conditional-branch offset for the compressed CB format.
 *
 * A c.beqz/c.bnez target is a 9-bit signed byte offset whose least significant
 * bit is zero, so it reaches -256..254.
 *
 * @param text - Raw operand text, rejected when it uses the offset(base) syntax.
 * @param context - Current address and symbol table.
 * @param offset - Resolved byte offset relative to the branch.
 * @returns The validated offset.
 * @throws Error if the operand is not a bare expression, is misaligned, or out of range.
 */
const resolveCompressedBranchOffset = (
  text: string,
  context: EncodeContext,
  offset: number
): number => {
  if (OFFSET_BASE_OPERAND.test(text)) {
    throw new Error(
      `operand "${text}" is not encodable: ${context.mnemonic} takes a bare target, not offset(base)`
    );
  }
  if ((offset & 1) !== 0) {
    throw new Error(`offset ${offset} is not encodable: must be a multiple of 2`);
  }
  if (offset < -256 || offset > 254) {
    throw new Error(
      `offset ${offset} is not encodable: ${context.mnemonic} offset must be within -256..254`
    );
  }
  return offset;
};

/**
 * Resolve and validate the bare c.addi16sp stack adjustment.
 *
 * nzimm is a nonzero multiple of 16 in -512..496: bits 3..0 scale by 16 and
 * the remaining six bits are signed, so zero is reserved for c.lui.
 *
 * @param text - Bare operand text.
 * @param context - Current address and symbol table.
 * @returns The resolved adjustment in bytes.
 * @throws Error if the operand uses offset(base), is misaligned, zero, or out of range.
 */
const resolveStackAdjustment = (text: string, context: EncodeContext): number => {
  if (OFFSET_BASE_OPERAND.test(text)) {
    throw new Error(
      `operand "${text}" is not encodable: ${context.mnemonic} takes a bare immediate, not offset(base)`
    );
  }
  const immediate = resolveNumber(text, context);
  if (immediate % 16 !== 0) {
    throw new Error(`immediate ${immediate} is misaligned: bits 0..3 must be zero`);
  }
  if (immediate === 0) {
    throw new Error(
      `immediate 0 is not encodable: ${context.mnemonic} requires a nonzero adjustment`
    );
  }
  if (immediate < -512 || immediate > 496) {
    throw new Error(
      `immediate ${immediate} is not encodable: ${context.mnemonic} must be within -512..496`
    );
  }
  return immediate;
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
  // c.addi16sp's nzimm has no base register, so its scattered fields are read
  // from a bare immediate; the stack-relative compressed loads and stores
  // describe an offset inside offset(base), never a bare number.
  switch (part) {
    case 'cStackAdjustHi': {
      const immediate = resolveStackAdjustment(text, context);
      return (immediate >> 9) & 0x1;
    }
    case 'cStackAdjustLo': {
      const immediate = resolveStackAdjustment(text, context);
      return (
        ((immediate >> 5) & 0x1) |
        (((immediate >> 7) & 0x1) << 1) |
        (((immediate >> 8) & 0x1) << 2) |
        (((immediate >> 6) & 0x1) << 3) |
        (((immediate >> 4) & 0x1) << 4)
      );
    }
    case 'cOffsetSpWord':
    case 'cOffsetSpDouble':
    case 'cOffsetSpWordHi':
    case 'cOffsetSpWordLo':
    case 'cOffsetSpDoubleHi':
    case 'cOffsetSpDoubleLo':
      if (!OFFSET_BASE_OPERAND.test(text)) {
        throw new Error(
          `operand "${text}" is not encodable: ${context.mnemonic} requires an offset(sp) operand`
        );
      }
      break;
    default:
      break;
  }

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
      // c.lw/c.sw: uimm[5:3] sits at instruction [12:10] and instruction [6:5]
      // holds uimm[2] at bit 6 and uimm[6] at bit 5.
      case 'cOffsetHiWord': {
        validateCompressedOffset(offset, 2, 5, 'c.lw/c.sw offset');
        return (offset >> 3) & 0x7;
      }
      case 'cOffsetLoWord': {
        validateCompressedOffset(offset, 2, 5, 'c.lw/c.sw offset');
        return ((offset >> 6) & 1) | (((offset >> 2) & 1) << 1);
      }
      // c.ld/c.sd/c.fld/c.fsd: uimm[5:3] sits at instruction [12:10] and
      // instruction [6:5] holds uimm[7:6] in numeric order.
      case 'cOffsetHiDouble': {
        validateCompressedOffset(offset, 3, 5, 'c.ld/c.sd offset');
        return (offset >> 3) & 0x7;
      }
      case 'cOffsetLoDouble': {
        validateCompressedOffset(offset, 3, 5, 'c.ld/c.sd offset');
        return (offset >> 6) & 0x3;
      }
      // c.swsp/c.sdsp: the CSS-format imm6 field carries the scattered hardware
      // offset, so c.swsp keeps byte offset [5:2] at field [5:2] and byte
      // offset [7:6] at field [1:0], while c.sdsp keeps byte offset [5:3] at
      // field [5:3] and byte offset [8:6] at field [2:0].
      case 'cOffsetSpWord': {
        requireStackPointer(context.mnemonic, baseText);
        validateCompressedOffset(offset, 2, 6, `${context.mnemonic} offset`);
        return (((offset >> 2) & 0xf) << 2) | ((offset >> 6) & 0x3);
      }
      case 'cOffsetSpDouble': {
        requireStackPointer(context.mnemonic, baseText);
        validateCompressedOffset(offset, 3, 6, `${context.mnemonic} offset`);
        return (((offset >> 3) & 0x7) << 3) | ((offset >> 6) & 0x7);
      }
      // c.lwsp: uimm[5] sits at instruction [12], uimm[4:2] at [6:4] and
      // uimm[7:6] at [3:2].
      case 'cOffsetSpWordHi': {
        requireStackPointer(context.mnemonic, baseText);
        validateCompressedOffset(offset, 2, 6, `${context.mnemonic} offset`);
        return (offset >> 5) & 0x1;
      }
      case 'cOffsetSpWordLo': {
        requireStackPointer(context.mnemonic, baseText);
        validateCompressedOffset(offset, 2, 6, `${context.mnemonic} offset`);
        return (((offset >> 2) & 0x7) << 2) | ((offset >> 6) & 0x3);
      }
      // c.ldsp/c.fldsp: uimm[5] sits at instruction [12], uimm[4:3] at [6:5]
      // and uimm[8:6] at [4:2].
      case 'cOffsetSpDoubleHi': {
        requireStackPointer(context.mnemonic, baseText);
        validateCompressedOffset(offset, 3, 6, `${context.mnemonic} offset`);
        return (offset >> 5) & 0x1;
      }
      case 'cOffsetSpDoubleLo': {
        requireStackPointer(context.mnemonic, baseText);
        validateCompressedOffset(offset, 3, 6, `${context.mnemonic} offset`);
        return (((offset >> 3) & 0x3) << 3) | ((offset >> 6) & 0x7);
      }
      default:
        // The stack-adjustment and branch-offset parts read bare expressions
        // only; resolveStackAdjustment and resolveCompressedBranchOffset
        // report a helpful error for offset(base) text.
        break;
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
      // c.beqz/c.bnez: imm[8] sits at instruction [12], imm[4:3] at [11:10],
      // imm[7:6] at [6:5], imm[2:1] at [4:3] and imm[5] at [2].
      case 'cBranchOffsetHigh': {
        const offset = resolveCompressedBranchOffset(text, context, value);
        return (((offset >> 8) & 0x1) << 2) | ((offset >> 3) & 0x3);
      }
      case 'cBranchOffsetLow': {
        const offset = resolveCompressedBranchOffset(text, context, value);
        return (
          ((offset >> 5) & 0x1) |
          (((offset >> 1) & 0x1) << 1) |
          (((offset >> 2) & 0x1) << 2) |
          (((offset >> 6) & 0x1) << 3) |
          (((offset >> 7) & 0x1) << 4)
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
 * Immediate bits covered by one source operand's `numberPart` fields, plus the
 * signedness those fields share and whether zero is a reserved encoding.
 */
type ImmediateFieldBits = Readonly<{
  lowBit: number;
  topBit: number;
  signed: boolean;
  nonzero: boolean;
}>;

/**
 * Compute the immediate bit range that the union of all `numberPart` fields
 * sharing one source operand reads.
 *
 * Every field in a union must agree on `signed`: the union's range check can
 * only apply one interpretation, so a mixed union is a metadata bug rather
 * than an operand error.
 *
 * @param signature - Encoder signature whose fields should be grouped.
 * @param mnemonic - Mnemonic owning the signature, for the metadata diagnostic.
 * @returns The lowest and highest immediate bit read, and the signedness, for
 * each source operand index.
 * @throws Error if the fields of one union disagree on `signed`.
 */
const numberPartFieldBits = (
  signature: InstructionSignature,
  mnemonic: string
): ReadonlyMap<number, ImmediateFieldBits> => {
  const fieldBits = new Map<number, ImmediateFieldBits>();
  for (const arg of signature.encoderSignature) {
    if (arg.type !== 'numberPart') continue;
    const current = fieldBits.get(arg.sourceOperand);
    if (current === undefined) {
      fieldBits.set(arg.sourceOperand, {
        lowBit: arg.bits[0],
        topBit: arg.bits[1],
        signed: arg.signed,
        nonzero: arg.nonzero ?? false,
      });
      continue;
    }
    if (current.signed !== arg.signed) {
      throw new Error(
        `internal metadata error: ${mnemonic} declares both signed and unsigned ` +
          `numberPart fields for operand ${arg.sourceOperand}`
      );
    }
    fieldBits.set(arg.sourceOperand, {
      lowBit: Math.min(current.lowBit, arg.bits[0]),
      topBit: Math.max(current.topBit, arg.bits[1]),
      signed: arg.signed,
      nonzero: current.nonzero || (arg.nonzero ?? false),
    });
  }
  return fieldBits;
};

/**
 * Validate an immediate against the union of the fields a compressed
 * instruction splits it across.
 *
 * The bits below the union's lowest field are not encoded anywhere, so the
 * value must be a multiple of the union's alignment (c.lui values are
 * multiples of 4096, c.addi4spn values multiples of 4).  The remaining width is
 * then read as one immediate, whose range follows the union's `signed` flag:
 * a signed 6-bit union holds -32..31 (c.li, c.addi, c.andi), an unsigned one
 * holds 0..63 (c.slli's shamt).  The signedness comes from the metadata because
 * the same field layout carries both kinds of immediate.  A union whose fields
 * declare `nonzero` rejects zero, the encoding c.lui and c.addi4spn reserve.
 *
 * @param value - Resolved immediate value.
 * @param fieldBits - Lowest and highest immediate bit read by any field for
 * this operand, plus the signedness and zero rules those fields share.
 * @throws Error if the value is zero for a nonzero union, the bits below the
 * union's lowest field are nonzero, or the scaled value does not fit the
 * union's width.
 */
const validateSplitImmediate = (
  value: number,
  { lowBit, topBit, signed, nonzero }: ImmediateFieldBits
): void => {
  if (nonzero && value === 0) {
    throw new Error('immediate 0 is not encodable: this encoding requires a nonzero immediate');
  }
  if (value % 2 ** lowBit !== 0) {
    throw new Error(`immediate ${value} is misaligned: bits 0..${lowBit - 1} must be zero`);
  }
  const scale = 2 ** lowBit;
  const scaled = value / scale;
  const width = topBit - lowBit + 1;
  const minScaled = signed ? -(2 ** (width - 1)) : 0;
  const maxScaled = signed ? 2 ** (width - 1) - 1 : 2 ** width - 1;
  if (scaled < minScaled || scaled > maxScaled) {
    const field = `${signed ? 'signed' : 'unsigned'} ${width}-bit field`;
    const range =
      scale === 1
        ? `must be within ${minScaled}..${maxScaled}`
        : `must be within ${minScaled}..${maxScaled} (immediates ${minScaled * scale}..${maxScaled * scale})`;
    throw new Error(`immediate ${value} is not encodable: ${field} scaled by ${scale} ${range}`);
  }
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
  const splitFieldBits = numberPartFieldBits(signature, context.mnemonic);
  return signature.encoderSignature.map((arg) => {
    switch (arg.type) {
      case 'constant':
        return arg.value;
      case 'generatedLabel':
        // No numeric value needed; label will be defined elsewhere.
        return 0;
      case 'register':
        return resolveRegister(operands[arg.sourceOperand]!);
      case 'number':
        return resolveNumber(operands[arg.sourceOperand]!, context);
      case 'numberPart': {
        // Extract bits [low..high] of a value that a compressed instruction splits
        // across several immediate fields.  Validation uses the union of every
        // field that reads this operand, because a single field cannot check the
        // range of the immediate the fields spell together.
        const value = resolveNumber(operands[arg.sourceOperand]!, context);
        validateSplitImmediate(value, splitFieldBits.get(arg.sourceOperand)!);
        const lowBit = arg.bits[0];
        const partWidth = arg.bits[1] - lowBit + 1;
        return (value >> lowBit) & ((1 << partWidth) - 1);
      }
      case 'address':
        return resolveAddress(operands[arg.sourceOperand]!, context, arg);
    }
  });
};
