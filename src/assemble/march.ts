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

import { INSTRUCTION_MAP } from '#instructions';

/**
 * Every extension atom that appears in any INSTRUCTION_MAP entry's `requires`
 * array.  Used to reject `-march` strings that name unsupported extensions.
 */
const KNOWN_EXTENSIONS: ReadonlySet<string> = ((): ReadonlySet<string> => {
  const atoms = new Set<string>();
  for (const entry of INSTRUCTION_MAP.values()) {
    for (const atom of entry.requires) {
      atoms.add(atom);
    }
  }
  return atoms;
})();

// Non-extension internal atoms used for system/CSR instructions. These are
// not normal RISC-V ISA extensions and are never exposed to -march.
const INTERNAL_ATOMS = new Set([
  's',
  'sdext',
  'smrnmi',
  'ssctr',
  'svinval',
  'system',
  'zalasr',
  'zawrs',
  'zicbo',
  'zicfiss',
  'zicond',
  'zimop',
  'zknd',
  'zkne',
  'zknh',
  'zksed',
  'zksh',
  'zvbb',
  'zvbc',
  'zvfbfmin',
  'zvfbfwma',
  'zvkg',
  'zvkned',
  'zvknha',
  'zvksed',
  'zvksh',
  'zfbfmin',
  'zfhmin',
  'zcmop',
  'zcmp',
  'zcmt',
]);

/**
 * Compact single-letter extension names that gas accepts.  In a compact ISA
 * string (without underscore separators), these single letters are recognized
 * as individual extensions.
 */
const SINGLE_LETTER_EXTENSIONS = new Set(['a', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'm', 'q', 'v']);

/**
 * Strip version suffix from an extension atom.  Version digits appear as
 * digits followed by optional `p` and more digits, e.g. `i2p1`, `m2p0`.
 *
 * @param atom - Raw extension token, possibly with version digits.
 * @returns The extension name without version digits.
 */
const stripVersion = (atom: string): string => atom.replace(/[0-9]+(p[0-9]+)?$/, '');

/**
 * Expand gas implication rules on a set of extension atoms.
 *
 * - `g` → `i, m, a, f, d, zicsr, zifencei`
 * - `d` → `f` (also implies `d`)
 * - Single-letter atoms are kept as-is
 * - `z*` atoms are kept as-is
 *
 * @param atoms - Set of raw (unexpanded) extension atoms.
 * @returns Expanded set with all implications resolved.
 */
const expandImplications = (atoms: Iterable<string>): Set<string> => {
  const expanded = new Set<string>();

  for (const atom of atoms) {
    const stripped = stripVersion(atom);
    if (stripped === 'g') {
      expanded.add('i');
      expanded.add('m');
      expanded.add('a');
      expanded.add('f');
      expanded.add('d');
      expanded.add('zicsr');
      expanded.add('zifencei');
    } else {
      expanded.add(stripped);
    }
  }

  // d => f
  if (expanded.has('d')) {
    expanded.add('f');
  }

  // Always include base 'i' if not already present (every instruction depends on i)
  // Actually, no - if the user specifies e.g. -march=rv64c then we only allow c
  // But rv64c on its own doesn't make sense without i. However per spec, let's
  // just do what gas does: if you specify rv64c, you get just c? Actually gas
  // always implies the base I extension when you specify rv64. Let me check...
  // In gas, rv64gc means g + implied i. Actually rv64 always implies I.
  // Let's be safe: if the user specifies rv64 prefix and doesn't include i,
  // include i as the base. But the spec says to just follow gas implications.
  // In gas, rv64`i`mc => i,m,c. rv64c alone would include i because 64-bit
  // implies I. Let me re-check...
  // Actually in RISC-V, rv64 always implies I. And in gas, if you say rv64c,
  // it includes i. Let's add this rule.

  return expanded;
};

/**
 * Parse a `-march=VALUE` ISA string into an expanded set of extension atoms.
 *
 * Supported forms:
 * - rv64imc, rv64gc, rv64i (compact single-letter form)
 * - rv64i_zicsr_zifencei, rv64im_zba_zbb (underscore-separated form)
 * - Version digits accepted and ignored: rv64i2p1_m2p0
 * - rv32 prefix accepted as well (same rules as rv64)
 *
 * @param isa - The raw ISA string from `-march`.
 * @returns Expanded set of extension atoms with implications resolved.
 * @throws Error if the ISA string is malformed.
 */
export const parseMarch = (isa: string): ReadonlySet<string> => {
  const trimmed = isa.trim();
  if (trimmed.length === 0) {
    throw new Error(`Malformed -march ISA string: "${isa}"`);
  }

  // Match rv32/rv64 prefix
  const prefixMatch = /^rv(32|64)(.*)$/i.exec(trimmed);
  if (!prefixMatch) {
    throw new Error(`Malformed -march ISA string: "${isa}" — must start with rv32 or rv64`);
  }

  const rest = prefixMatch[2]!;

  // Strip version suffix from the rest (rv64i2p1 -> i)
  // The base extension might have version digits before other extensions
  // rv64i2p1_m2p0 -> rest = "i2p1_m2p0"
  // Split by underscore and strip versions
  const parts = rest.split('_');
  const atoms: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    if (part.length === 0) continue;

    if (i === 0 && part.length > 1) {
      // First part might be compact form: "imc2p1" or just "i2p1"
      // Strip version from the base extension
      // Check if it's a compact base (all single-letter extensions)
      const baseMatch = /^([a-z]+?)([0-9].*)?$/i.exec(part);
      if (baseMatch) {
        const letters = baseMatch[1]!;
        // Parse each letter as a separate extension
        for (const ch of letters) {
          if (SINGLE_LETTER_EXTENSIONS.has(ch)) {
            atoms.push(ch);
          } else {
            throw new Error(`Unknown extension "${ch}" in -march "${isa}"`);
          }
        }
      } else {
        // Just a single extension with version
        const stripped = stripVersion(part);
        atoms.push(stripped);
      }
    } else {
      // Non-first parts are always individual extensions (z* or single-letter)
      const stripped = stripVersion(part);
      if (stripped.length === 1) {
        if (SINGLE_LETTER_EXTENSIONS.has(stripped)) {
          atoms.push(stripped);
        } else {
          throw new Error(`Unknown extension "${stripped}" in -march "${isa}"`);
        }
      } else {
        atoms.push(stripped);
      }
    }
  }

  if (atoms.length === 0) {
    throw new Error(`Malformed -march ISA string: "${isa}" — no extensions specified`);
  }

  // Expand implications
  const expanded = expandImplications(atoms);

  // Base rv64/rv32 always implies 'i'
  if (!expanded.has('i')) {
    expanded.add('i');
  }

  return expanded;
};

/**
 * Validate that every extension in the given set is known and supported.
 * Unsupported extensions that appear in no INSTRUCTION_MAP entry produce an
 * error naming the unsupported extension and listing supported ones in a
 * compact form.
 *
 * @param isa - The raw ISA string (for error messages).
 * @param extensions - The expanded extension set.
 * @throws Error if any extension is not in KNOWN_EXTENSIONS.
 */
export const validateMarch = (isa: string, extensions: ReadonlySet<string>): void => {
  const unsupported: string[] = [];
  for (const ext of extensions) {
    if (!KNOWN_EXTENSIONS.has(ext)) {
      unsupported.push(ext);
    }
  }
  if (unsupported.length > 0) {
    const supportedList = [...KNOWN_EXTENSIONS]
      .filter((e) => e !== 's' && e !== 'system' && !INTERNAL_ATOMS.has(e))
      .sort()
      .join(' ');
    throw new Error(
      `Unsupported extension(s) in -march "${isa}": ${unsupported.join(', ')}. ` +
        `Supported extensions: ${supportedList}`
    );
  }
};

/**
 * Check whether an instruction's required extensions are all present in the
 * allowed extension set.
 *
 * @param requires - The instruction's required extension atoms.
 * @param allowedExtensions - The expanded set of allowed extensions from -march.
 * @returns The first missing extension atom, or null if all requirements are met.
 */
export const missingExtension = (
  requires: readonly string[],
  allowedExtensions: ReadonlySet<string>
): string | null => {
  for (const atom of requires) {
    if (!allowedExtensions.has(atom)) {
      return atom;
    }
  }
  return null;
};
