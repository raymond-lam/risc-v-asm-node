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
/* oxlint-disable complexity -- layout tracks per-section state across directives and instructions */

// Streaming layout pass for RISC-V source.  `layout` owns all address and
// section state and emits one `Placed` record per observable event: label
// definitions, section switches, global declarations, and directives or
// instructions with their sizes, references, and relocations.  Consumers fold
// the records into whatever shape they need.

import { INSTRUCTION_MAP, isRegisterText, selectSignature } from '#instructions';
import type { InstructionSignature } from '#instructions';
import { missingExtension } from '#assemble';
import { parseIntegerLiteral, parseOperator } from '#parse';
import {
  R_RISCV_LO12_I,
  R_RISCV_LO12_S,
  R_RISCV_HI20,
  R_RISCV_PCREL_HI20,
  R_RISCV_PCREL_LO12_I,
  R_RISCV_PCREL_LO12_S,
  relocationTypeForArg,
} from '#relocations';
import type { RelocationSpec } from '#relocations';
import { parseDataDirective } from '#directives';
import { parseStatement } from '#statements';

type InstructionEntry = NonNullable<ReturnType<typeof INSTRUCTION_MAP.get>>;

// Match offset(base) where offset may contain parentheses (e.g., %hi(sym)).
const OFFSET_BASE_OPERAND = /^(.*)\(([^()]+)\)$/;

/** A single layout event emitted while streaming the source. */
export type Placed =
  | {
      readonly kind: 'label';
      readonly name: string;
      readonly section: string;
      readonly address: number;
      readonly line: number;
    }
  | { readonly kind: 'section'; readonly name: string }
  | { readonly kind: 'global'; readonly name: string }
  | {
      readonly kind: 'directive';
      readonly name: string;
      /** Directive source text without labels or comments, for pass-2 byte emission. */
      readonly text: string;
      readonly section: string;
      readonly address: number;
      readonly size: number;
      readonly alignment: number | null;
      readonly relocations: readonly RelocationSpec[];
      readonly compressed: boolean;
      readonly line: number;
    }
  | {
      readonly kind: 'instruction';
      readonly written: string;
      readonly mnemonic: string;
      readonly section: string;
      readonly address: number;
      readonly size: number;
      readonly operands: readonly string[];
      readonly modifiedOperands: readonly string[];
      readonly references: readonly string[];
      readonly relocations: readonly RelocationSpec[];
      readonly compressed: boolean;
      readonly line: number;
    };

/**
 * Record defined labels, rejecting duplicates.
 *
 * @param labels - Labels defined on the current line.
 * @param defined - Set of already-defined label names, updated in place.
 * @param lineNumber - One-based source line used in error messages.
 * @throws Error if any label is already defined.
 */
const recordLabels = (
  labels: readonly string[],
  defined: Set<string>,
  lineNumber: number
): void => {
  for (const label of labels) {
    if (defined.has(label)) {
      throw new Error(`Duplicate label "${label}" at line ${lineNumber}`);
    }
    defined.add(label);
  }
};

/**
 * Look up a mnemonic in the authoritative instruction registry.
 *
 * @param written - Source spelling of the mnemonic, used in error messages.
 * @param mnemonic - Normalized (lowercase) mnemonic.
 * @param lineNumber - One-based source line used in error messages.
 * @returns The instruction map entry.
 * @throws Error if the mnemonic is unknown.
 */
const lookupInstruction = (
  written: string,
  mnemonic: string,
  lineNumber: number
): InstructionEntry => {
  const instruction = INSTRUCTION_MAP.get(mnemonic);
  if (!instruction) {
    throw new Error(`Unknown mnemonic "${written}" at line ${lineNumber}`);
  }
  return instruction;
};

/**
 * Resolve an instruction's byte length, including variable-length pseudo-instructions.
 *
 * @param instruction - Parsed instruction metadata.
 * @param mnemonic - Normalized mnemonic used in error messages.
 * @param written - Source spelling of the mnemonic.
 * @param operands - Trimmed operand texts.
 * @param lineNumber - One-based source line used in error messages.
 * @returns The encoded instruction length in bytes.
 * @throws Error if a variable-length instruction has invalid operands.
 */
const resolveInstructionLength = (
  instruction: InstructionEntry,
  mnemonic: string,
  written: string,
  operands: readonly string[],
  lineNumber: number
): number => {
  if (typeof instruction.instructionLength !== 'function') {
    return instruction.instructionLength;
  }

  if (mnemonic !== 'li') {
    throw new Error(`Cannot compute variable length for "${written}" at line ${lineNumber}`);
  }
  const literal = operands[1];
  if (!literal) {
    throw new Error(`Missing li immediate at line ${lineNumber}`);
  }
  const value = parseIntegerLiteral(literal);
  if (value === null) {
    throw new Error(
      `li length at line ${lineNumber} requires a numeric constant, got "${literal}"`
    );
  }
  return instruction.instructionLength(0, value);
};

/**
 * Determine whether an operand text is a symbol reference (not a register or
 * numeric literal).
 *
 * @param text - Trimmed operand text.
 * @returns True if the operand names a symbol that must be relocated.
 */
const isSymbolRef = (text: string): boolean => {
  if (text.length === 0) return false;
  if (isRegisterText(text)) return false;
  const op = parseOperator(text);
  if (op) {
    // If inner is numeric literal, treat as constant, not a symbol reference.
    return parseIntegerLiteral(op.inner) === null;
  }
  return parseIntegerLiteral(text) === null;
};

/**
 * Collect symbol reference texts from an instruction's operand list.
 *
 * @param operands - Individual operand texts.
 * @returns Every operand text that is a symbol reference.
 */
const collectReferences = (operands: readonly string[]): string[] => {
  const refs: string[] = [];
  for (const op of operands) {
    // For address operands like `offset(base)`, check both parts.
    // The base is always a register. The offset may be a symbol.
    if (isSymbolRef(op)) {
      refs.push(op);
    }
  }
  return refs;
};

/**
 * Extract candidate text from an operand for symbol resolution.
 * For address operands, returns the offset part (trimmed) if non-empty,
 * otherwise null indicating no symbol reference.
 */
const extractCandidateText = (
  opText: string,
  encArg: Extract<
    InstructionSignature['encoderSignature'][number],
    { readonly type: 'address' | 'number' }
  >
): string | null => {
  if (encArg.type === 'address') {
    const match = OFFSET_BASE_OPERAND.exec(opText);
    if (match) {
      const offsetText = match[1]!.trim();
      if (offsetText.length === 0) return null; // offset zero, not a symbol reference
      return offsetText;
    }
  }
  return opText;
};

/**
 * Validate that an operator matches the expected relocation type and instruction format.
 */
const validateOperator = (
  op: { operator: string } | null,
  relocType: number,
  mnemonic: string,
  written: string,
  lineNumber: number
): void => {
  if (!op) return;
  if (op.operator === 'hi' || op.operator === 'pcrel_hi') {
    const expected = op.operator === 'hi' ? R_RISCV_HI20 : R_RISCV_PCREL_HI20;
    if (relocType !== expected) {
      throw new Error(
        `%${op.operator} operator used in non-U-type instruction "${written}" at line ${lineNumber}`
      );
    }
    return;
  }
  if (op.operator === 'lo' || op.operator === 'pcrel_lo') {
    if (mnemonic === 'lui' || mnemonic === 'auipc') {
      throw new Error(
        `%${op.operator} operator used in U-type instruction "${written}" at line ${lineNumber}`
      );
    }
    const expectedLo = op.operator === 'lo' ? R_RISCV_LO12_I : R_RISCV_PCREL_LO12_I;
    const expectedS = op.operator === 'lo' ? R_RISCV_LO12_S : R_RISCV_PCREL_LO12_S;
    if (relocType !== expectedLo && relocType !== expectedS) {
      throw new Error(
        `%${op.operator} operator used in non-I/S-type instruction "${written}" at line ${lineNumber}`
      );
    }
    return;
  }
};

/**
 * Replace a symbol-reference value in an address operand with the zero literal,
 * preserving the base register.
 *
 * @param operand - Raw address operand such as `8(x2)` or `target`.
 * @returns The modified operand with any symbol offset replaced by `0`.
 */
const zeroAddressOperand = (operand: string): string => {
  const lastOpen = operand.lastIndexOf('(');
  if (lastOpen !== -1 && operand.endsWith(')')) {
    const base = operand.slice(lastOpen + 1, -1).trim();
    const offset = operand.slice(0, lastOpen).trim();
    if (offset.length === 0 || isRegisterText(offset) || parseIntegerLiteral(offset) !== null) {
      return operand;
    }
    return `0(${base})`;
  }
  return '0';
};

/**
 * Process a single encoder argument that is a symbol reference, returning
 * relocation type and inner symbol name, or null if the operand is not a symbol reference.
 */
const processEncoderArgForRelocation = (
  encArg: Extract<
    InstructionSignature['encoderSignature'][number],
    { readonly type: 'address' | 'number' }
  >,
  opText: string,
  written: string,
  mnemonic: string,
  lineNumber: number,
  instruction: InstructionEntry
): { readonly relocType: number; readonly innerSymbol: string } | null => {
  const candidateText = extractCandidateText(opText, encArg);
  if (candidateText === null) return null;
  const op = parseOperator(candidateText);
  const innerSymbol = op ? op.inner : candidateText;
  const relocType = relocationTypeForArg(encArg, candidateText, instruction, mnemonic);
  validateOperator(op, relocType, mnemonic, written, lineNumber);
  return { relocType, innerSymbol };
};

/**
 * Collect relocation specifications for a single instruction line, along with
 * the operand list with symbol operands replaced by zero placeholders.
 *
 * @param instruction - Instruction entry from INSTRUCTION_MAP.
 * @param signature - Matching instruction signature.
 * @param operandList - Trimmed operand strings.
 * @param written - Source spelling of the mnemonic.
 * @param mnemonic - Normalized mnemonic.
 * @param lineNumber - Source line for error context.
 * @param locationCounter - Current byte address.
 * @returns The relocation specifications and zero-substituted operands.
 */
const collectRelocationsForLine = (
  instruction: InstructionEntry,
  signature: InstructionSignature,
  operandList: readonly string[],
  written: string,
  mnemonic: string,
  lineNumber: number,
  locationCounter: number
): { readonly relocations: RelocationSpec[]; readonly modifiedOperands: readonly string[] } => {
  const relocations: RelocationSpec[] = [];
  const modifiedOperands = operandList.slice();
  // Dedup by (sourceOperand, relocType) so branch offsets (same source, same
  // type) produce one relocation, while PC-relative pseudo-instructions (same
  // source, different types) produce multiple relocations.
  const processedRelocKeys = new Set<string>();
  // Check if this signature is a generated-label pseudo-instruction (la/call/tail).
  const hasGeneratedLabel = signature.encoderSignature.some((e) => e.type === 'generatedLabel');
  let subOffset = 0;
  for (const encArg of signature.encoderSignature) {
    if (encArg.type === 'constant' || encArg.type === 'generatedLabel') continue;
    const opIndex = encArg.sourceOperand;
    const opText = operandList[opIndex]!;
    if (!isSymbolRef(opText)) continue;

    const arg = encArg as Extract<
      InstructionSignature['encoderSignature'][number],
      { readonly type: 'address' | 'number' }
    >;
    const result = processEncoderArgForRelocation(
      arg,
      opText,
      written,
      mnemonic,
      lineNumber,
      instruction
    );
    if (result === null) continue;
    const key = `${opIndex}:${result.relocType}`;
    if (processedRelocKeys.has(key)) continue;
    processedRelocKeys.add(key);

    modifiedOperands[opIndex] = arg.type === 'address' ? zeroAddressOperand(opText) : '0';

    // For PCREL_LO12 relocations on generated-label pseudo-instructions, use
    // the generated label instead of the original symbol.
    let symbolName = result.innerSymbol;
    if (hasGeneratedLabel) {
      if (result.relocType === R_RISCV_PCREL_LO12_I || result.relocType === R_RISCV_PCREL_LO12_S) {
        symbolName = `.Lpcrel${locationCounter.toString(16)}`;
      }
    }

    relocations.push({
      offset: locationCounter + subOffset,
      section: '.text',
      type: result.relocType,
      symbolName,
      addend: 0,
    });
    subOffset += 4;
  }
  return { relocations, modifiedOperands };
};

/**
 * Check whether an instruction's required extensions are enabled by -march.
 * Throws a descriptive error naming the mnemonic, missing extension, and the
 * requested ISA string when a requirement is not met.
 *
 * @param requires - Extension atoms required by the instruction.
 * @param written - Source spelling of the mnemonic.
 * @param lineNumber - Source line for error context.
 * @param allowedExtensions - The -march restriction to enforce, or undefined
 * for unrestricted mode.
 * @throws Error if a required extension is missing.
 */
const enforceMarchRestrictions = (
  requires: readonly string[],
  written: string,
  lineNumber: number,
  allowedExtensions?: { readonly set: ReadonlySet<string>; readonly isa: string }
): void => {
  if (!allowedExtensions) return;
  const missing = missingExtension(requires, allowedExtensions.set);
  if (missing !== null) {
    throw new Error(
      `Instruction "${written}" at line ${lineNumber} requires extension "${missing}" ` +
        `which is not enabled by -march=${allowedExtensions.isa}`
    );
  }
};

/**
 * Stream source lines and emit one `Placed` record per observable event.
 *
 * Section cursors start at `startAddress` for `.text` and at zero for every
 * other section.  Records are emitted in source order: label records first,
 * then the section/global/directive/instruction record for the statement.
 *
 * @param lines - Source lines in assembly order.
 * @param startAddress - Address assigned to the first `.text` byte.
 * @param allowedExtensions - The -march restriction to enforce, or undefined
 * for unrestricted mode.
 * @yields Layout events in source order.
 * @throws Error on invalid input, unknown mnemonics or directives, duplicate
 * labels, or address overflow.
 */
const layout = async function* (
  lines: AsyncIterable<string>,
  startAddress = 0,
  allowedExtensions?: { readonly set: ReadonlySet<string>; readonly isa: string }
): AsyncGenerator<Placed> {
  let currentSection = '.text';
  const sectionCounters = new Map<string, number>([
    ['.text', startAddress],
    ['.data', 0],
    ['.rodata', 0],
    ['.bss', 0],
  ]);
  const definedLabels = new Set<string>();
  let lineNumber = 0;

  for await (const rawLine of lines) {
    lineNumber += 1;
    const { labels, statement } = parseStatement(rawLine, lineNumber);
    const locationCounter = sectionCounters.get(currentSection)!;

    recordLabels(labels, definedLabels, lineNumber);
    for (const label of labels) {
      yield {
        kind: 'label',
        name: label,
        section: currentSection,
        address: locationCounter,
        line: lineNumber,
      };
    }
    if (statement === null) continue;

    if (statement.kind === 'directive') {
      const { name, rest } = statement;
      const parts = rest.split(/\s+/);

      // Section switching directives
      if (name === '.text' || name === '.data' || name === '.rodata' || name === '.bss') {
        currentSection = name;
        yield { kind: 'section', name };
        continue;
      }
      if (name === '.section') {
        const sectionName = parts[1];
        if (sectionName === undefined) {
          throw new Error(`'.section' requires a section name at line ${lineNumber}`);
        }
        // Only allow known sections
        if (
          sectionName !== '.text' &&
          sectionName !== '.data' &&
          sectionName !== '.rodata' &&
          sectionName !== '.bss'
        ) {
          throw new Error(`Unsupported section "${sectionName}" at line ${lineNumber}`);
        }
        currentSection = sectionName;
        yield { kind: 'section', name: sectionName };
        continue;
      }

      // Global symbol directives
      if (name === '.globl' || name === '.global') {
        const globalName = parts[1];
        if (globalName === undefined) {
          throw new Error(`"${name}" at line ${lineNumber} requires a label name`);
        }
        yield { kind: 'global', name: globalName };
        continue;
      }

      // Data directives
      let dirResult: ReturnType<typeof parseDataDirective>;
      try {
        dirResult = parseDataDirective(rest, currentSection, locationCounter);
      } catch (e) {
        throw new Error(`${(e as Error).message} at line ${lineNumber}`);
      }
      if (dirResult !== null) {
        // In .bss, only zero/space (reservations) and alignment directives are allowed.
        if (currentSection === '.bss') {
          if (
            name !== '.zero' &&
            name !== '.space' &&
            name !== '.align' &&
            name !== '.p2align' &&
            name !== '.balign'
          ) {
            throw new Error(
              `"${name}" at line ${lineNumber} in .bss section is not allowed; use .data or .rodata for initialized data`
            );
          }
        }
        // Detect when text alignment padding will use c.nop in pass 2
        // (padding >= 2 bytes and not a multiple of 4).
        const compressed =
          currentSection === '.text' &&
          (name === '.align' || name === '.p2align' || name === '.balign') &&
          dirResult.size >= 2 &&
          dirResult.size % 4 !== 0;
        sectionCounters.set(currentSection, locationCounter + dirResult.size);
        yield {
          kind: 'directive',
          name,
          text: rest,
          section: currentSection,
          address: locationCounter,
          size: dirResult.size,
          alignment: dirResult.alignment ?? null,
          relocations: dirResult.relocations,
          compressed,
          line: lineNumber,
        };
        continue;
      }

      // Unknown directive
      throw new Error(`Unknown directive "${name}" at line ${lineNumber}`);
    }

    // Instruction (only in .text section)
    if (currentSection !== '.text') {
      throw new Error(`Instruction not allowed in ${currentSection} section at line ${lineNumber}`);
    }

    const instruction = lookupInstruction(statement.written, statement.mnemonic, lineNumber);

    // Enforce -march restrictions during pass 1 (before any output).
    enforceMarchRestrictions(
      instruction.requires,
      statement.written,
      lineNumber,
      allowedExtensions
    );

    const operandList = statement.operands;
    const references = collectReferences(operandList);
    const compressed = statement.mnemonic.startsWith('c.');

    const signature = selectSignature(instruction.signatures, operandList);
    if (!signature) {
      throw new Error(
        `Wrong number of operands for "${statement.written}" at line ${lineNumber}: ` +
          `expected ${instruction.signatures.map((s) => s.sourceSignature.length).join(' or ')} operand(s), got ${operandList.length}`
      );
    }
    // If the signature uses a generatedLabel, define the label at this
    // instruction's offset *after* recording user labels on the same line.
    const hasGeneratedLabel = signature.encoderSignature.some((e) => e.type === 'generatedLabel');
    if (hasGeneratedLabel) {
      const genLabel = `.Lpcrel${locationCounter.toString(16)}`;
      if (definedLabels.has(genLabel)) {
        throw new Error(
          `Generated label "${genLabel}" at line ${lineNumber} conflicts with existing definition`
        );
      }
      definedLabels.add(genLabel);
      yield {
        kind: 'label',
        name: genLabel,
        section: '.text',
        address: locationCounter,
        line: lineNumber,
      };
    }

    const { relocations, modifiedOperands } = collectRelocationsForLine(
      instruction,
      signature,
      operandList,
      statement.written,
      statement.mnemonic,
      lineNumber,
      locationCounter
    );
    const instructionLength = resolveInstructionLength(
      instruction,
      statement.mnemonic,
      statement.written,
      operandList,
      lineNumber
    );
    const nextLocation = locationCounter + instructionLength;
    if (!Number.isSafeInteger(nextLocation)) {
      throw new Error(`Address overflow at line ${lineNumber}`);
    }
    sectionCounters.set('.text', nextLocation);
    yield {
      kind: 'instruction',
      written: statement.written,
      mnemonic: statement.mnemonic,
      section: '.text',
      address: locationCounter,
      size: instructionLength,
      operands: operandList,
      modifiedOperands,
      references,
      relocations,
      compressed,
      line: lineNumber,
    };
  }
};

export default layout;
