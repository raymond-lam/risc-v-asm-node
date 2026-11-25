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

// Thin driver over the streaming layout pass.  `buildSymbolTableWithRefs`
// consumes `layout()` once and folds the emitted `Placed` records into the
// symbol-table shape consumed by the ELF writer.  It never recomputes
// addresses, sizes, relocations, or compressed flags; it only accumulates what
// layout emits.

// Single-pass label (symbol) table construction for flat RISC-V instruction
// streams. Labels are case-sensitive; mnemonics are case-insensitive.
//
// The returned ReadonlyMap is type-level read-only only; an explicit cast back
// to Map can still mutate it at runtime.

import layout from '#layout';
import type { Placed } from '#layout';
import type { RelocationSpec } from '#relocations';

// ELF section constants
const SHT_PROGBITS = 1;
const SHT_NOBITS = 8;
const SHF_WRITE = 0x1;
const SHF_ALLOC = 0x2;
const SHF_EXECINSTR = 0x4;

// Fixed content section names in ELF output order.
const SECTION_NAMES = ['.text', '.data', '.rodata', '.bss'] as const;

/**
 * A reference to a symbol from an instruction line that has not yet been
 * resolved to an address or constant.
 */
export type SymbolReference = Readonly<{
  symbol: string;
  line: number;
}>;

export type SectionState = Readonly<{
  name: string;
  shType: number;
  flags: number;
  size: number;
  alignment: number;
}>;

/**
 * The result of the layout pass: the resolved label map, collected symbol
 * references, compressed flag, and relocation records.  Relocations are
 * derived during layout from the encoder signature.
 */
export type SymbolTableWithReferences = Readonly<{
  symbols: ReadonlyMap<string, number>;
  references: readonly SymbolReference[];
  hasCompressed: boolean;
  globalLabels: ReadonlySet<string>;
  sectionStates: ReadonlyMap<string, SectionState>;
  sectionRelocations: ReadonlyMap<string, readonly RelocationSpec[]>;
  /** Map from label name to section name ('.text', '.data', '.rodata'). */
  labelSections: ReadonlyMap<string, string>;
}>;

/** Accumulated state folded out of the `Placed` records emitted by `layout`. */
type FoldState = Readonly<{
  symbols: Map<string, number>;
  labelSections: Map<string, string>;
  globalLabels: Set<string>;
  references: SymbolReference[];
  sectionRelocations: Map<string, RelocationSpec[]>;
  sectionSizes: Map<string, number>;
  sectionAlignments: Map<string, number>;
  seenSections: Set<string>;
  hasCompressed: { value: boolean };
}>;

/** One reducer folding a `Placed` record into the accumulated layout state. */
type PlacedReducer = Readonly<{ add: (state: FoldState, placed: Placed) => void }>;

/**
 * Fold a `Placed` record into the symbol and global-label maps.
 *
 * @param state - Accumulated fold state.
 * @param placed - Layout record to fold.
 */
const foldSymbols = (state: FoldState, placed: Placed): void => {
  if (placed.kind === 'label') {
    state.symbols.set(placed.name, placed.address);
    state.labelSections.set(placed.name, placed.section);
  } else if (placed.kind === 'global') {
    state.globalLabels.add(placed.name);
  }
};

/**
 * Fold a `Placed` record into the collected symbol references.
 *
 * @param state - Accumulated fold state.
 * @param placed - Layout record to fold.
 */
const foldReferences = (state: FoldState, placed: Placed): void => {
  if (placed.kind === 'directive') {
    for (const relocation of placed.relocations) {
      state.references.push({ symbol: relocation.symbolName, line: placed.line });
    }
  } else if (placed.kind === 'instruction') {
    for (const symbol of placed.references) {
      state.references.push({ symbol, line: placed.line });
    }
  }
};

/**
 * Fold a `Placed` record into the per-section relocation lists.
 *
 * @param state - Accumulated fold state.
 * @param placed - Layout record to fold.
 */
const foldRelocations = (state: FoldState, placed: Placed): void => {
  if (placed.kind === 'directive') {
    const sectionRelocs = state.sectionRelocations.get(placed.section)!;
    for (const relocation of placed.relocations) sectionRelocs.push(relocation);
  } else if (placed.kind === 'instruction') {
    const sectionRelocs = state.sectionRelocations.get('.text')!;
    for (const relocation of placed.relocations) sectionRelocs.push(relocation);
  }
};

/**
 * Fold a `Placed` record into per-section sizes, alignments, and visibility.
 *
 * @param state - Accumulated fold state.
 * @param placed - Layout record to fold.
 */
const foldSections = (state: FoldState, placed: Placed): void => {
  if (placed.kind === 'section') {
    state.seenSections.add(placed.name);
    return;
  }
  if (placed.kind === 'directive') {
    state.sectionSizes.set(
      placed.section,
      (state.sectionSizes.get(placed.section) || 0) + placed.size
    );
    // Update section alignment from the requested alignment value.
    if (placed.alignment !== null) {
      const currentAlign = state.sectionAlignments.get(placed.section)!;
      if (placed.alignment > currentAlign) {
        state.sectionAlignments.set(placed.section, placed.alignment);
      }
    }
    return;
  }
  if (placed.kind === 'instruction') {
    state.sectionSizes.set('.text', (state.sectionSizes.get('.text') || 0) + placed.size);
  }
};

/**
 * Fold a `Placed` record's compressed flag into the accumulated flag.
 *
 * @param state - Accumulated fold state.
 * @param placed - Layout record to fold.
 */
const foldCompressed = (state: FoldState, placed: Placed): void => {
  if (placed.kind === 'directive' || placed.kind === 'instruction') {
    if (placed.compressed) state.hasCompressed.value = true;
  }
};

const symbolReducer: PlacedReducer = { add: foldSymbols };
const referenceReducer: PlacedReducer = { add: foldReferences };
const relocationReducer: PlacedReducer = { add: foldRelocations };
const sectionReducer: PlacedReducer = { add: foldSections };
const compressedReducer: PlacedReducer = { add: foldCompressed };

/** One reducer per concept: symbols, references, relocations, sections, compressed. */
const REDUCERS: readonly PlacedReducer[] = [
  symbolReducer,
  referenceReducer,
  relocationReducer,
  sectionReducer,
  compressedReducer,
];

/**
 * Whether a section belongs in the output: entered sections, non-empty
 * sections, and `.text` (always present) are included.
 *
 * @param state - Accumulated fold state.
 * @param section - Section name to test.
 * @param size - Accumulated section size in bytes.
 * @returns True if the section should appear in sectionStates.
 */
const shouldIncludeSection = (state: FoldState, section: string, size: number): boolean =>
  state.seenSections.has(section) || size > 0 || section === '.text';

/**
 * Build the sectionStates map from folded per-section sizes and alignments.
 *
 * @param state - Accumulated fold state.
 * @param hasCompressed - Whether any compressed instruction or padding occurred.
 * @returns Per-section ELF section states.
 */
const buildSectionStates = (
  state: FoldState,
  hasCompressed: boolean
): Map<string, SectionState> => {
  const sectionStates = new Map<string, SectionState>();
  for (const section of SECTION_NAMES) {
    const size = state.sectionSizes.get(section)!;
    // Skip sections that were never entered and have no size, except .text which is always present.
    if (!shouldIncludeSection(state, section, size)) continue;
    const shType = section === '.bss' ? SHT_NOBITS : SHT_PROGBITS;
    let flags = SHF_ALLOC;
    if (section === '.text') flags |= SHF_EXECINSTR;
    if (section === '.data' || section === '.bss') flags |= SHF_WRITE;
    const alignment = state.sectionAlignments.get(section)!;
    // Update .text alignment based on compressed instructions.
    if (section === '.text' && hasCompressed && alignment < 2) {
      state.sectionAlignments.set('.text', 2);
    }
    sectionStates.set(section, {
      name: section,
      shType,
      flags,
      size,
      alignment: section === '.text' && hasCompressed ? Math.max(alignment, 2) : alignment,
    });
  }

  // Ensure .text always present
  if (!sectionStates.has('.text')) {
    sectionStates.set('.text', {
      name: '.text',
      shType: SHT_PROGBITS,
      flags: SHF_ALLOC | SHF_EXECINSTR,
      size: 0,
      alignment: hasCompressed ? 2 : 4,
    });
  }
  return sectionStates;
};

/**
 * Build a label-to-byte-address symbol table from one stream of source lines,
 * additionally collecting every operand text that is not a register name or
 * integer literal into the `references` array.
 *
 * @param lines - Source lines in assembly order.
 * @param startAddress - Address assigned to the first instruction.
 * @param allowedExtensions - The -march restriction to enforce, or undefined
 * for unrestricted mode.
 * @returns The resolved symbol table and the collected symbol references.
 */
export const buildSymbolTableWithRefs = async (
  lines: AsyncIterable<string>,
  startAddress = 0,
  allowedExtensions?: { readonly set: ReadonlySet<string>; readonly isa: string }
): Promise<SymbolTableWithReferences> => {
  if (!Number.isSafeInteger(startAddress) || startAddress < 0) {
    throw new Error(`startAddress must be a nonnegative safe integer, got ${startAddress}`);
  }

  const state: FoldState = {
    symbols: new Map<string, number>(),
    labelSections: new Map<string, string>(),
    globalLabels: new Set<string>(),
    references: [],
    sectionRelocations: new Map<string, RelocationSpec[]>([
      ['.text', []],
      ['.data', []],
      ['.rodata', []],
      ['.bss', []],
    ]),
    sectionSizes: new Map<string, number>([
      ['.text', 0],
      ['.data', 0],
      ['.rodata', 0],
      ['.bss', 0],
    ]),
    sectionAlignments: new Map<string, number>([
      ['.text', 4],
      ['.data', 8],
      ['.rodata', 8],
      ['.bss', 8],
    ]),
    seenSections: new Set<string>(['.text']),
    hasCompressed: { value: false },
  };

  for await (const placed of layout(lines, startAddress, allowedExtensions)) {
    for (const reducer of REDUCERS) reducer.add(state, placed);
  }

  const hasCompressed = state.hasCompressed.value;

  // Convert sectionRelocations map to ReadonlyMap, dropping empty sections.
  const sectionRelocations = new Map<string, readonly RelocationSpec[]>();
  for (const [section, relocs] of state.sectionRelocations) {
    if (relocs.length > 0) sectionRelocations.set(section, relocs);
  }

  return {
    symbols: state.symbols,
    references: state.references,
    hasCompressed,
    globalLabels: state.globalLabels,
    sectionStates: buildSectionStates(state, hasCompressed),
    sectionRelocations,
    labelSections: state.labelSections,
  };
};
