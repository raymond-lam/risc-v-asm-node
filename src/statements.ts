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

// Pure source-line parsing.  This module has no state: it turns one raw line
// into its leading labels plus either a directive or an instruction, or a null
// statement for blank and label-only lines.

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
 * Split a comma-separated operand string and return the trimmed parts.
 *
 * @param operands - Raw operand string after the mnemonic.
 * @returns Individual operand texts.
 */
const splitOperands = (operands: string): string[] => {
  if (operands.length === 0) return [];
  return operands.split(',').map((o) => o.trim());
};

/** A single directive or instruction parsed from a source line. */
export type Statement =
  | { readonly kind: 'directive'; readonly name: string; readonly rest: string }
  | {
      readonly kind: 'instruction';
      readonly written: string;
      readonly mnemonic: string;
      readonly operands: readonly string[];
    };

/** The labels and optional statement parsed from one source line. */
export type ParsedLine = Readonly<{
  readonly labels: readonly string[];
  readonly statement: Statement | null;
}>;

/**
 * Parse a raw source line into its labels and statement.
 *
 * @param raw - Raw source line that may include labels or comments.
 * @param lineNumber - One-based source line used in error messages.
 * @returns The extracted labels and the statement, or a null statement for
 * blank and label-only lines.
 * @throws Error if a label is empty or malformed.
 */
export const parseStatement = (raw: string, lineNumber: number): ParsedLine => {
  const content = stripComment(raw).trim();
  if (content.length === 0) return { labels: [], statement: null };

  const { labels, rest } = extractLabels(content, lineNumber);
  if (rest.length === 0) return { labels, statement: null };

  if (rest.startsWith('.')) {
    // Capture the directive name as the first non-whitespace token.
    const name = /^\S+/.exec(rest)![0];
    return { labels, statement: { kind: 'directive', name, rest } };
  }

  // Capture the mnemonic as the first non-whitespace token.
  const written = /^(\S+)/.exec(rest)![1]!;
  const mnemonic = written.toLowerCase();
  const operands = splitOperands(rest.slice(written.length).trim());
  return { labels, statement: { kind: 'instruction', written, mnemonic, operands } };
};
