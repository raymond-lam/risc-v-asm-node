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

// Match a complete optionally signed decimal, hex, binary, or octal literal.
// Digit runs may contain underscore separators; no whitespace or other text is allowed.
const INTEGER_LITERAL = /^[+-]?(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|[0-9][0-9_]*)$/;

// Match %hi(symbol), %lo(symbol), %pcrel_hi(symbol), %pcrel_lo(symbol) case-insensitively, no whitespace.
const OPERATOR_PATTERN = new RegExp('^%((?:hi|lo|pcrel_hi|pcrel_lo))\\(([^)]+)\\)$', 'i');

/**
 * Parse a decimal, hexadecimal, binary, or octal integer literal.
 *
 * @param text - Literal text with an optional sign and underscore separators.
 * @returns The parsed BigInt, or `null` when the text is not an integer literal.
 */
export const parseIntegerLiteral = (text: string): bigint | null => {
  if (!INTEGER_LITERAL.test(text)) return null;
  try {
    const normalized = text.replaceAll('_', '');
    const magnitude = BigInt(normalized.replace(/^[+-]/, ''));
    return normalized.startsWith('-') ? -magnitude : magnitude;
  } catch {
    return null;
  }
};

/**
 * Parse a %hi(symbol), %lo(symbol), %pcrel_hi(symbol), or %pcrel_lo(symbol) operator.
 *
 * @param text - Operand text possibly containing %hi, %lo, %pcrel_hi, or %pcrel_lo.
 * @returns The operator ('hi', 'lo', 'pcrel_hi', or 'pcrel_lo') and the inner symbol, or null if not an operator.
 */
export const parseOperator = (
  text: string
): { operator: 'hi' | 'lo' | 'pcrel_hi' | 'pcrel_lo'; inner: string } | null => {
  const match = OPERATOR_PATTERN.exec(text);
  if (!match) return null;
  const op = match[1]!.toLowerCase() as 'hi' | 'lo' | 'pcrel_hi' | 'pcrel_lo';
  return { operator: op, inner: match[2]!.trim() };
};

/**
 * Parse a source line into its mnemonic and operands.
 *
 * @param raw - Source line that may include labels or comments.
 * @returns The lowercase mnemonic and trimmed operands, or `null` for a blank line.
 */
export const parseInstruction = (raw: string): { mnemonic: string; operands: string[] } | null => {
  const text = raw
    // Strip a # or // comment through the end of the line.
    .replace(/#.*|\/\/.*/, '')
    .trim()
    // Remove leading labels with valid names and whitespace around each colon.
    .replace(/^(?:[A-Za-z_.$][A-Za-z0-9_.$]*\s*:\s*)+/, '')
    .trim();
  if (text.length === 0) return null;

  // Capture the mnemonic as the first non-whitespace token.
  const writtenMnemonic = /^(\S+)/.exec(text)![1]!;
  const mnemonic = writtenMnemonic.toLowerCase();
  const operandsText = text.slice(writtenMnemonic.length).trim();
  const operands = operandsText.length === 0 ? [] : operandsText.split(',').map((x) => x.trim());
  return { mnemonic, operands };
};
