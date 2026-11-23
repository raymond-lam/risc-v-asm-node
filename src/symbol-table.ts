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

// Single-pass label (symbol) table construction for flat RISC-V instruction
// streams. Labels are case-sensitive; mnemonics are case-insensitive.
//
// Supported input lines contain optional labels, an optional instruction, and
// optional `#` or `//` comments. Data directives, sections, relocations,
// expressions, and unresolved symbol operands are intentionally unsupported
// and fail loudly rather than silently producing incorrect addresses.
//
// The returned ReadonlyMap is type-level read-only only; an explicit cast back
// to Map can still mutate it at runtime.

import { INSTRUCTION_MAP } from '#instructions';
import { parseIntegerLiteral } from '#parse';

// Capture one leading label name and consume its colon and surrounding whitespace.
// Names start with a letter, underscore, dot, or dollar sign.
const LABEL_PATTERN = /^([A-Za-z_.$][A-Za-z0-9_.$]*)\s*:\s*/;

/**
 * Strip `#` and `//` comments from a source line.
 *
 * @param line - Raw source line.
 * @returns Content before the first comment marker.
 */
const stripComment = (line: string): string => {
  const hash = line.indexOf('#');
  const slashes = line.indexOf('//');
  const ends = [hash, slashes].filter((index) => index >= 0);
  return ends.length === 0 ? line : line.slice(0, Math.min(...ends));
};

type InstructionEntry = NonNullable<ReturnType<typeof INSTRUCTION_MAP.get>>;

/**
 * Extract leading labels from a source fragment.
 *
 * @param text - Source text whose leading labels should be removed.
 * @param lineNumber - One-based source line used in error messages.
 * @returns The extracted label names and remaining instruction text.
 * @throws Error if a label is empty or malformed.
 */
const extractLabels = (text: string, lineNumber: number): { labels: string[]; rest: string } => {
  const labels: string[] = [];
  let rest = text;
  for (;;) {
    const match = LABEL_PATTERN.exec(rest);
    if (!match) break;
    labels.push(match[1]!);
    rest = rest.slice(match[0].length);
  }

  if (rest.startsWith(':')) {
    throw new Error(`Malformed label at line ${lineNumber}: empty label`);
  }
  // Capture the first non-whitespace token to diagnose a malformed label.
  const firstToken = /^\S+/.exec(rest)?.[0];
  if (firstToken?.endsWith(':')) {
    throw new Error(`Malformed label at line ${lineNumber}: "${firstToken.slice(0, -1)}"`);
  }
  return { labels, rest };
};

/**
 * Record resolved label addresses in the symbol table.
 *
 * @param labels - Labels defined on the current line.
 * @param symbols - Symbol map to update.
 * @param address - Address assigned to the current line.
 * @param lineNumber - One-based source line used in error messages.
 * @throws Error if any label is already defined.
 */
const recordLabels = (
  labels: string[],
  symbols: Map<string, number>,
  address: number,
  lineNumber: number
): void => {
  for (const label of labels) {
    if (symbols.has(label)) {
      throw new Error(`Duplicate label "${label}" at line ${lineNumber}`);
    }
    symbols.set(label, address);
  }
};

/**
 * Look up a mnemonic and parse its operand text.
 *
 * @param text - Instruction text after any labels.
 * @param lineNumber - One-based source line used in error messages.
 * @returns The original and normalized mnemonic, operand text, and map entry.
 * @throws Error if the mnemonic is unknown or is a directive.
 */
const lookupInstruction = (
  text: string,
  lineNumber: number
): {
  writtenMnemonic: string;
  mnemonic: string;
  operands: string;
  instruction: InstructionEntry;
} => {
  // Capture the mnemonic as the first non-whitespace token.
  const writtenMnemonic = /^(\S+)/.exec(text)![1]!;
  const mnemonic = writtenMnemonic.toLowerCase();
  const instruction = INSTRUCTION_MAP.get(mnemonic);
  if (!instruction) {
    throw new Error(`Unknown mnemonic "${writtenMnemonic}" at line ${lineNumber}`);
  }
  return {
    writtenMnemonic,
    mnemonic,
    operands: text.slice(writtenMnemonic.length).trim(),
    instruction,
  };
};

/**
 * Resolve an instruction's byte length, including variable-length pseudo-instructions.
 *
 * @param instruction - Parsed instruction metadata.
 * @param mnemonic - Normalized mnemonic used in error messages.
 * @param writtenMnemonic - Source spelling of the mnemonic.
 * @param operands - Raw comma-separated operand text.
 * @param lineNumber - One-based source line used in error messages.
 * @returns The encoded instruction length in bytes.
 * @throws Error if a variable-length instruction has invalid operands.
 */
const resolveInstructionLength = (
  instruction: InstructionEntry,
  mnemonic: string,
  writtenMnemonic: string,
  operands: string,
  lineNumber: number
): number => {
  if (typeof instruction.instructionLength !== 'function') {
    return instruction.instructionLength;
  }

  const values = operands.split(',').map((operand) => operand.trim());
  if (mnemonic !== 'li') {
    throw new Error(
      `Cannot compute variable length for "${writtenMnemonic}" at line ${lineNumber}`
    );
  }
  const literal = values[1];
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
 * Build a label-to-byte-address symbol table from one stream of source lines.
 * Unknown mnemonics, directives, malformed labels, duplicate labels and
 * non-numeric `li` lengths reject with Errors containing the line number.
 *
 * @param lines - Source lines in assembly order.
 * @param startAddress - Address assigned to the first instruction.
 * @returns The resolved symbol table.
 */
export const buildSymbolTable = async (
  lines: AsyncIterable<string>,
  startAddress = 0
): Promise<ReadonlyMap<string, number>> => {
  if (!Number.isSafeInteger(startAddress) || startAddress < 0) {
    throw new Error(`startAddress must be a nonnegative safe integer, got ${startAddress}`);
  }

  const symbols = new Map<string, number>();
  let locationCounter = startAddress;
  let lineNumber = 0;

  for await (const rawLine of lines) {
    lineNumber += 1;
    const content = stripComment(rawLine).trim();
    if (content.length === 0) continue;

    const { labels, rest } = extractLabels(content, lineNumber);
    recordLabels(labels, symbols, locationCounter, lineNumber);
    if (rest.length === 0) continue;

    const { writtenMnemonic, mnemonic, operands, instruction } = lookupInstruction(
      rest,
      lineNumber
    );
    const instructionLength = resolveInstructionLength(
      instruction,
      mnemonic,
      writtenMnemonic,
      operands,
      lineNumber
    );
    const nextLocation = locationCounter + instructionLength;
    if (!Number.isSafeInteger(nextLocation)) {
      throw new Error(`Address overflow at line ${lineNumber}`);
    }
    locationCounter = nextLocation;
  }

  return symbols;
};
