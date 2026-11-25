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

/* oxlint-disable func-style -- The export-default const uses a named arrow function. */
/* oxlint-disable complexity -- computeSectionLayout and computeElfParts are inherently complex state machines for ELF layout */

import type { RelocationSpec } from '#relocations';
import type { SymbolReference, SectionState } from '#symbol-table';
import { bytes16, bytes32, bytes64 } from '#utils/bytes';

// ---------------------------------------------------------------------------
// ELF constants
// ---------------------------------------------------------------------------

const EI_NIDENT = 16;
const ELFCLASS64 = 2;
const ELFDATA2LSB = 1;
const EV_CURRENT = 1;

const ET_REL = 1;
const EM_RISCV = 243;
const EF_RISCV_RVC = 0x1;

const SHT_PROGBITS = 1;
const SHT_SYMTAB = 2;
const SHT_STRTAB = 3;
const SHT_RELA = 4;
const SHT_NULL = 0;
const SHT_NOBITS = 8;
const SHT_RISCV_ATTRIBUTES = 0x7000_0003;

// RISC-V attribute tags (A-format).
const TAG_FILE = 0x1;
const TAG_RISCV_STACK_ALIGN = 0x2;
const TAG_RISCV_ARCH = 0x3;

const SHF_WRITE = 0x1;
const SHF_ALLOC = 0x2;
const SHF_EXECINSTR = 0x4;

const SHN_UNDEF = 0;
const SHN_ABS = 0xfff1;

const STT_NOTYPE = 0;
const STB_LOCAL = 0;
const STB_GLOBAL = 1;

const ELF64_EHDR_SIZE = 64;
const ELF64_SHDR_SIZE = 64;
const ELF64_SYMTAB_ENTSIZE = 24;
const ELF64_RELA_ENTSIZE = 24;

// Section index constants for content sections (fixed positions).
const SEC_TEXT = 1;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Serialize a signed 64-bit value as little-endian bytes.
 *
 * @param value - Signed 64-bit integer.
 * @returns An 8-byte little-endian Uint8Array.
 */
const bytes64Signed = (value: number): Uint8Array => {
  const u64 = value >= 0 ? value : value + 0x1_0000_0000_0000_0000;
  return bytes64(u64);
};

/** Leading identification bytes for ELF. */
const elfIdent = (): Uint8Array => {
  const buf = new Uint8Array(EI_NIDENT);
  buf[0] = 0x7f;
  buf[1] = 0x45; // 'E'
  buf[2] = 0x4c; // 'L'
  buf[3] = 0x46; // 'F'
  buf[4] = ELFCLASS64;
  buf[5] = ELFDATA2LSB;
  buf[6] = EV_CURRENT;
  buf[7] = 0; // EI_OSABI
  return buf;
};

/**
 * Build the 64-byte ELF header.
 *
 * @param shoff - File offset of the section header table.
 * @param shstrndx - Section string table index.
 * @param flags - e_flags value.
 * @param shnum - Number of section headers.
 * @returns The ELF header.
 */
const elfHeader = (shoff: number, shstrndx: number, flags: number, shnum: number): Uint8Array => {
  const buf = new Uint8Array(ELF64_EHDR_SIZE);
  buf.set(elfIdent(), 0);
  buf.set(bytes16(ET_REL), 16); // e_type
  buf.set(bytes16(EM_RISCV), 18); // e_machine
  buf.set(bytes32(EV_CURRENT), 20); // e_version
  buf.set(bytes64(0), 24); // e_entry
  buf.set(bytes64(0), 32); // e_phoff
  buf.set(bytes64(shoff), 40); // e_shoff
  buf.set(bytes32(flags), 48); // e_flags
  buf.set(bytes16(ELF64_EHDR_SIZE), 52); // e_ehsize
  buf.set(bytes16(0), 54); // e_phentsize = 0
  buf.set(bytes16(0), 56); // e_phnum = 0
  buf.set(bytes16(ELF64_SHDR_SIZE), 58); // e_shentsize
  buf.set(bytes16(shnum), 60); // e_shnum
  buf.set(bytes16(shstrndx), 62); // e_shstrndx
  return buf;
};

/**
 * Build a 64-byte section header.
 */
const sectionHeader = (
  name: number,
  type: number,
  flags: number,
  addr: number,
  offset: number,
  size: number,
  link: number,
  info: number,
  addralign: number,
  entsize: number
): Uint8Array => {
  const buf = new Uint8Array(ELF64_SHDR_SIZE);
  buf.set(bytes32(name), 0);
  buf.set(bytes32(type), 4);
  buf.set(bytes64(flags), 8);
  buf.set(bytes64(addr), 16);
  buf.set(bytes64(offset), 24);
  buf.set(bytes64(size), 32);
  buf.set(bytes32(link), 40);
  buf.set(bytes32(info), 44);
  buf.set(bytes64(addralign), 48);
  buf.set(bytes64(entsize), 56);
  return buf;
};

/**
 * Serialize one Elf64_Sym (24 bytes).
 */
const symEntry = (
  stName: number,
  stValue: number,
  stSize: number,
  stInfo: number,
  stShndx: number
): Uint8Array => {
  const buf = new Uint8Array(ELF64_SYMTAB_ENTSIZE);
  buf.set(bytes32(stName), 0);
  buf[4] = stInfo & 0xff;
  buf[5] = 0;
  buf.set(bytes16(stShndx), 6);
  buf.set(bytes64(stValue), 8);
  buf.set(bytes64(stSize), 16);
  return buf;
};

/**
 * Serialize one Elf64_Rela (24 bytes).
 */
const relaEntry = (rOffset: number, rInfo: number, rAddend: number): Uint8Array => {
  const buf = new Uint8Array(ELF64_RELA_ENTSIZE);
  buf.set(bytes64(rOffset), 0);
  buf.set(bytes64(rInfo), 8);
  buf.set(bytes64Signed(rAddend), 16);
  return buf;
};

/**
 * Build a string table from a list of names.
 */
const buildStrTable = (
  names: readonly string[]
): { table: Uint8Array; offsets: Map<string, number> } => {
  const offsets = new Map<string, number>();
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  chunks.push(new Uint8Array(1));
  offsets.set('', 0);
  for (const name of names) {
    const offset = chunks.reduce((sum, c) => sum + c.length, 0);
    offsets.set(name, offset);
    chunks.push(encoder.encode(name));
    chunks.push(new Uint8Array(1));
  }
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const table = new Uint8Array(total);
  let pos = 0;
  for (const chunk of chunks) {
    table.set(chunk, pos);
    pos += chunk.length;
  }
  return { table, offsets };
};

/**
 * Build the section string table with all section names.
 */
const buildShstrtab = (
  sectionNames: readonly string[]
): { table: Uint8Array; offsets: Map<string, number> } => {
  return buildStrTable(sectionNames);
};

// ---------------------------------------------------------------------------
// Symbol classification
// ---------------------------------------------------------------------------

type SymMeta = {
  readonly name: string;
  readonly value: number;
  readonly shndx: number;
  readonly isGlobal: boolean;
};

/**
 * Build the sorted symbol-table entries.
 */
const buildSymEntries = (
  labelSymbols: ReadonlyMap<string, number>,
  references: readonly SymbolReference[],
  predefinedSymbols: ReadonlyMap<string, number>,
  globalLabels: ReadonlySet<string> = new Set<string>(),
  labelSections: ReadonlyMap<string, string> = new Map<string, string>(),
  sectionIndexMap: ReadonlyMap<string, number> = new Map<string, number>()
): SymMeta[] => {
  const definedLabels = new Set(labelSymbols.keys());

  // Collect undefined symbol names.
  const undefinedRefs = new Set<string>();
  for (const ref of references) {
    if (!definedLabels.has(ref.symbol) && !predefinedSymbols.has(ref.symbol)) {
      undefinedRefs.add(ref.symbol);
    }
  }

  // Per-section label→index helper.
  const shndxFor = (name: string): number => {
    const sec = labelSections.get(name);
    if (sec) return sectionIndexMap.get(sec) ?? SEC_TEXT;
    return SEC_TEXT;
  };

  // Local and global defined symbols.
  const locals: SymMeta[] = [];
  const definedGlobals: SymMeta[] = [];
  for (const name of definedLabels) {
    const shndx = shndxFor(name);
    if (globalLabels.has(name)) {
      definedGlobals.push({
        name,
        value: labelSymbols.get(name)!,
        shndx,
        isGlobal: true,
      });
    } else {
      locals.push({ name, value: labelSymbols.get(name)!, shndx, isGlobal: false });
    }
  }
  locals.sort((a, b) => a.name.localeCompare(b.name));

  // Global symbols: defined globals, --defsym, undefined refs, .globl-only.
  const globals: SymMeta[] = [...definedGlobals];
  for (const name of predefinedSymbols.keys()) {
    globals.push({
      name,
      value: predefinedSymbols.get(name)!,
      shndx: SHN_ABS,
      isGlobal: true,
    });
  }
  for (const name of undefinedRefs) {
    globals.push({ name, value: 0, shndx: SHN_UNDEF, isGlobal: true });
  }
  for (const name of globalLabels) {
    if (!definedLabels.has(name) && !predefinedSymbols.has(name)) {
      globals.push({ name, value: 0, shndx: SHN_UNDEF, isGlobal: true });
    }
  }
  globals.sort((a, b) => a.name.localeCompare(b.name));

  return [{ name: '', value: 0, shndx: 0, isGlobal: false }, ...locals, ...globals];
};

// ---------------------------------------------------------------------------
// ULEB128 encoding
// ---------------------------------------------------------------------------

const uleb128 = (value: number): Uint8Array => {
  const bytes: number[] = [];
  do {
    let byte = value & 0x7f;
    value >>= 7;
    if (value !== 0) byte |= 0x80;
    bytes.push(byte);
  } while (value !== 0);
  return Uint8Array.from(bytes);
};

// ---------------------------------------------------------------------------
// RISC-V attributes section
// ---------------------------------------------------------------------------

const buildRiscvAttributes = (stackAlign: number, archString: string): Uint8Array => {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  chunks.push(Uint8Array.from([0x41, 0x01, 0x00]));
  const subChunks: Uint8Array[] = [];
  const stackAlignBytes = uleb128(stackAlign);
  subChunks.push(uleb128(TAG_RISCV_STACK_ALIGN));
  subChunks.push(uleb128(stackAlignBytes.length));
  subChunks.push(stackAlignBytes);
  const archBytes = encoder.encode(archString);
  subChunks.push(uleb128(TAG_RISCV_ARCH));
  subChunks.push(uleb128(archBytes.length + 1));
  subChunks.push(archBytes);
  subChunks.push(new Uint8Array(1));
  const subTotal = subChunks.reduce((sum, c) => sum + c.length, 0);
  const subPayload = new Uint8Array(subTotal);
  let subOff = 0;
  for (const c of subChunks) {
    subPayload.set(c, subOff);
    subOff += c.length;
  }
  chunks.push(uleb128(TAG_FILE));
  chunks.push(uleb128(subPayload.length));
  chunks.push(subPayload);
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    result.set(c, off);
    off += c.length;
  }
  return result;
};

// ---------------------------------------------------------------------------
// Buffer builders
// ---------------------------------------------------------------------------

const buildSymtabBuffer = (
  entries: readonly SymMeta[],
  strOffsets: ReadonlyMap<string, number>
): Uint8Array => {
  const buf = new Uint8Array(entries.length * ELF64_SYMTAB_ENTSIZE);
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]!;
    const nameOff = strOffsets.get(e.name) ?? 0;
    const binding = e.isGlobal ? STB_GLOBAL : STB_LOCAL;
    const info = (binding << 4) | STT_NOTYPE;
    buf.set(symEntry(nameOff, e.value, 0, info, e.shndx), i * ELF64_SYMTAB_ENTSIZE);
  }
  return buf;
};

const buildRelaBuffer = (
  relocations: readonly RelocationSpec[],
  symIdx: ReadonlyMap<string, number>
): Uint8Array => {
  const buf = new Uint8Array(relocations.length * ELF64_RELA_ENTSIZE);
  for (let i = 0; i < relocations.length; i++) {
    const rel = relocations[i]!;
    const idx = symIdx.get(rel.symbolName) ?? 0;
    const rInfo = idx * 0x1_0000_0000 + rel.type;
    buf.set(relaEntry(rel.offset, rInfo, rel.addend), i * ELF64_RELA_ENTSIZE);
  }
  return buf;
};

// ---------------------------------------------------------------------------
// Section layout
// ---------------------------------------------------------------------------

/** Fixed content sections (always present in the section header table). */
const CONTENT_SECTIONS = ['.text', '.data', '.rodata', '.bss'] as const;

/** Rela sections and their target sections. */
const RELA_SECTION_DEFS = [
  { rela: '.rela.text', target: '.text' },
  { rela: '.rela.data', target: '.data' },
  { rela: '.rela.rodata', target: '.rodata' },
] as const;

/** Metadata sections (always present). */
/** Default state for content sections that may be absent from sectionStates. */
const defaultSectionState = (name: string, hasCompressed: boolean): SectionState => {
  if (name === '.text') {
    return {
      name,
      shType: SHT_PROGBITS,
      flags: SHF_ALLOC | SHF_EXECINSTR,
      size: 0,
      alignment: hasCompressed ? 2 : 4,
    };
  }
  if (name === '.data') {
    return { name, shType: SHT_PROGBITS, flags: SHF_ALLOC | SHF_WRITE, size: 0, alignment: 8 };
  }
  if (name === '.rodata') {
    return { name, shType: SHT_PROGBITS, flags: SHF_ALLOC, size: 0, alignment: 8 };
  }
  if (name === '.bss') {
    return { name, shType: SHT_NOBITS, flags: SHF_ALLOC | SHF_WRITE, size: 0, alignment: 8 };
  }
  return { name, shType: SHT_PROGBITS, flags: SHF_ALLOC, size: 0, alignment: 4 };
};

/**
 * Compute the section list, indices, and file offsets for the ELF output.
 *
 * @returns section name list (in header-table order), index map, and per-section metadata.
 */
type SectionLayoutEntry = Readonly<{
  name: string;
  type: number;
  flags: number;
  size: number;
  addralign: number;
  entsize: number;
  link: number;
  info: number;
  offset: number;
}>;

const computeSectionLayout = (
  sectionStates: ReadonlyMap<string, SectionState>,
  sectionRelocations: ReadonlyMap<string, readonly RelocationSpec[]>,
  symtabSize: number,
  strtabSize: number,
  shstrtabSize: number,
  attrSize: number,
  hasCompressed: boolean,
  emitAttributes: boolean,
  symtabLink: number,
  symtabInfo: number
): {
  entries: SectionLayoutEntry[];
  indexMap: Map<string, number>;
  shoff: number;
  shstrndx: number;
  flags: number;
} => {
  const entries: SectionLayoutEntry[] = [];
  const indexMap = new Map<string, number>();

  // Track which rela sections have entries.
  const relaSizes = new Map<string, number>();
  for (const def of RELA_SECTION_DEFS) {
    const relocs = sectionRelocations.get(def.target);
    const size = relocs ? relocs.length * ELF64_RELA_ENTSIZE : 0;
    if (size > 0) relaSizes.set(def.rela, size);
  }

  // Compute total number of sections.
  let relaCount = 0;
  for (const def of RELA_SECTION_DEFS) {
    if (relaSizes.has(def.rela)) relaCount++;
  }
  const symIndex = 1 + CONTENT_SECTIONS.length + relaCount;
  const strIndex = symIndex + 1;
  const shstrIndex = strIndex + 1;
  const attrIndex = emitAttributes ? shstrIndex + 1 : 0;

  // 0: NULL
  indexMap.set('', 0);
  entries.push({
    name: '',
    type: SHT_NULL,
    flags: 0,
    size: 0,
    addralign: 0,
    entsize: 0,
    link: 0,
    info: 0,
    offset: 0,
  });

  // 1-4: Content sections
  for (const name of CONTENT_SECTIONS) {
    const state = sectionStates.get(name) ?? defaultSectionState(name, hasCompressed);
    const index = entries.length;
    indexMap.set(name, index);
    const type = name === '.bss' ? SHT_NOBITS : state.shType !== 0 ? state.shType : SHT_PROGBITS;
    const flags =
      name === '.text'
        ? SHF_ALLOC | SHF_EXECINSTR
        : name === '.data' || name === '.bss'
          ? SHF_ALLOC | SHF_WRITE
          : SHF_ALLOC;
    // Compressed .text always uses alignment 2.
    const addralign =
      name === '.text' && hasCompressed ? 2 : state.alignment !== 0 ? state.alignment : 4;
    entries.push({
      name,
      type,
      flags,
      size: state.size,
      addralign,
      entsize: 0,
      link: 0,
      info: 0,
      offset: 0, // set below
    });
  }

  // Rela sections (only if non-empty)
  for (const def of RELA_SECTION_DEFS) {
    const size = relaSizes.get(def.rela);
    if (size === undefined || size === 0) continue;
    const index = entries.length;
    indexMap.set(def.rela, index);
    const targetIndex = indexMap.get(def.target) ?? 0;
    entries.push({
      name: def.rela,
      type: SHT_RELA,
      flags: 0,
      size,
      addralign: 4,
      entsize: ELF64_RELA_ENTSIZE,
      link: symIndex,
      info: targetIndex,
      offset: 0,
    });
  }

  // .symtab
  indexMap.set('.symtab', symIndex);
  entries.push({
    name: '.symtab',
    type: SHT_SYMTAB,
    flags: 0,
    size: symtabSize,
    addralign: 8,
    entsize: ELF64_SYMTAB_ENTSIZE,
    link: symtabLink,
    info: symtabInfo,
    offset: 0,
  });

  // .strtab
  indexMap.set('.strtab', strIndex);
  entries.push({
    name: '.strtab',
    type: SHT_STRTAB,
    flags: 0,
    size: strtabSize,
    addralign: 1,
    entsize: 0,
    link: 0,
    info: 0,
    offset: 0,
  });

  // .shstrtab
  indexMap.set('.shstrtab', shstrIndex);
  entries.push({
    name: '.shstrtab',
    type: SHT_STRTAB,
    flags: 0,
    size: shstrtabSize,
    addralign: 1,
    entsize: 0,
    link: 0,
    info: 0,
    offset: 0,
  });

  // Optional .riscv.attributes
  if (emitAttributes) {
    indexMap.set('.riscv.attributes', attrIndex);
    entries.push({
      name: '.riscv.attributes',
      type: SHT_RISCV_ATTRIBUTES,
      flags: 0,
      size: attrSize,
      addralign: 1,
      entsize: 0,
      link: 0,
      info: 0,
      offset: 0,
    });
  }

  // Compute file offsets.
  let fileOffset = ELF64_EHDR_SIZE;

  const assignOffset = (name: string): void => {
    const idx = indexMap.get(name);
    if (idx === undefined) return;
    const e = entries[idx]!;
    if (e.type === SHT_NULL) return;
    // Align file offset to the section's addralign.
    if (e.addralign > 1) {
      const misalignment = fileOffset % e.addralign;
      if (misalignment > 0) fileOffset += e.addralign - misalignment;
    }
    entries[idx] = { ...e, offset: fileOffset };
    fileOffset += e.size;
  };

  // Assign file-bearing content sections first (text, data, rodata).
  assignOffset('.text');
  assignOffset('.data');
  assignOffset('.rodata');

  // Assign NOBITS section (bss) in its logical section-order position.
  // NOBITS sections occupy no file space: the offset is set but fileOffset does NOT advance,
  // so subsequent sections share the same offset if they have no alignment padding.
  const bssIdx = indexMap.get('.bss');
  if (bssIdx !== undefined) {
    const e = entries[bssIdx]!;
    // Align bss offset to its addralign for the section header.
    let bssOffset = fileOffset;
    if (e.addralign > 1) {
      const misalignment = bssOffset % e.addralign;
      if (misalignment > 0) bssOffset += e.addralign - misalignment;
    }
    entries[bssIdx] = { ...e, offset: bssOffset };
    // NOBITS does not advance fileOffset for subsequent sections.
  }

  // Rela sections
  for (const def of RELA_SECTION_DEFS) {
    if (relaSizes.has(def.rela)) assignOffset(def.rela);
  }

  // Metadata sections
  assignOffset('.symtab');
  assignOffset('.strtab');
  assignOffset('.shstrtab');
  if (emitAttributes) assignOffset('.riscv.attributes');

  const shoff = fileOffset;

  // e_flags
  const flags = hasCompressed ? EF_RISCV_RVC : 0;

  return { entries, indexMap, shoff, shstrndx: shstrIndex, flags };
};

/**
 * Build the section header table from layout entries.
 */
const buildSectionHeaders = (
  entries: readonly SectionLayoutEntry[],
  shstrOffsets: ReadonlyMap<string, number>
): Uint8Array => {
  const buf = new Uint8Array(entries.length * ELF64_SHDR_SIZE);
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]!;
    const nameOff = shstrOffsets.get(e.name) ?? 0;
    buf.set(
      sectionHeader(
        nameOff,
        e.type,
        e.flags,
        0,
        e.offset,
        e.size,
        e.link,
        e.info,
        e.addralign,
        e.entsize
      ),
      i * ELF64_SHDR_SIZE
    );
  }
  return buf;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * An intermediate representation of the ELF sections that can be assembled
 * into a complete file by yielding the header, text chunks, and trailer
 * portions in sequence.
 */
type ElfParts = Readonly<{
  readonly ehdr: Uint8Array;
  readonly relaTextData: Uint8Array;
  readonly relaDataData: Uint8Array;
  readonly relaRodataData: Uint8Array;
  readonly symtabData: Uint8Array;
  readonly strData: Uint8Array;
  readonly shstrData: Uint8Array;
  readonly attrData: Uint8Array;
  readonly shdrTable: Uint8Array;
  /** Section index map: section name → section header index. */
  readonly sectionIndexMap: ReadonlyMap<string, number>;
  /** File offsets for each section. */
  readonly sectionOffsets: ReadonlyMap<string, number>;
}>;

/**
 * Compute all ELF section pieces needed to write a complete ELF64 ET_REL
 * object with support for .text, .data, .rodata, .bss sections.
 *
 * @param sectionStates - Per-section metadata from pass 1.
 * @param sectionRelocations - Per-section relocation lists from pass 1.
 * @param labelSymbols - Label symbol definitions (offset within section).
 * @param labelSections - Label → section name map.
 * @param references - Symbol references from the first pass.
 * @param predefinedSymbols - --defsym definitions.
 * @param hasCompressed - Whether any 2-byte compressed instruction is present.
 * @param marchAttr - Whether to emit .riscv.attributes section.
 * @param globalLabels - Set of .globl global labels.
 * @returns Pre-computed ELF parts.
 */
export const computeElfParts = (
  sectionStates: ReadonlyMap<string, SectionState>,
  sectionRelocations: ReadonlyMap<string, readonly RelocationSpec[]>,
  labelSymbols: ReadonlyMap<string, number>,
  references: readonly SymbolReference[],
  predefinedSymbols: ReadonlyMap<string, number>,
  hasCompressed: boolean,
  marchAttr?: boolean,
  globalLabels: ReadonlySet<string> = new Set<string>(),
  labelSections: ReadonlyMap<string, string> = new Map<string, string>()
): ElfParts => {
  const emitAttributes = marchAttr === true;

  // Build .riscv.attributes content if requested.
  const stackAlign = hasCompressed ? 16 : 4;
  const archParts: string[] = ['rv64i2p1_m2p0'];
  if (hasCompressed) archParts.push('c2p0');
  const archString = archParts.join('_');
  const attrData = emitAttributes
    ? buildRiscvAttributes(stackAlign, archString)
    : new Uint8Array(0);

  // Collect all section names for .shstrtab.
  // (buildStrTable implicitly adds the leading null byte for the empty name.)
  const allNames = new Set<string>();
  allNames.add('.text');
  allNames.add('.data');
  allNames.add('.rodata');
  allNames.add('.bss');
  // Rela sections if they have entries.
  for (const def of RELA_SECTION_DEFS) {
    const relocs = sectionRelocations.get(def.target);
    if (relocs && relocs.length > 0) allNames.add(def.rela);
  }
  allNames.add('.symtab');
  allNames.add('.strtab');
  allNames.add('.shstrtab');
  if (emitAttributes) allNames.add('.riscv.attributes');

  const shstrResult = buildShstrtab([...allNames].sort());
  const shstrData = shstrResult.table;
  const shstrOffsets = shstrResult.offsets;

  // Compute section layout to determine indices.
  const { entries, indexMap } = computeSectionLayout(
    sectionStates,
    sectionRelocations,
    0, // symtabSize - will update below
    0, // strtabSize
    shstrData.length,
    attrData.length,
    hasCompressed,
    emitAttributes,
    0, // symtabLink - will update
    0 // symtabInfo - will update
  );

  // Build symbol table entries.
  const symEntries = buildSymEntries(
    labelSymbols,
    references,
    predefinedSymbols,
    globalLabels,
    labelSections,
    indexMap
  );

  // Build symbol-name → sym-index map.
  const symIdx = new Map<string, number>();
  for (let i = 0; i < symEntries.length; i++) {
    symIdx.set(symEntries[i]!.name, i);
  }

  // Build .strtab.
  const strNames = symEntries.map((e) => e.name);
  const strResult = buildStrTable(strNames);
  const strData = strResult.table;
  const strOffsets = strResult.offsets;

  // Find first global symbol index for .symtab sh_info.
  let firstGlobal = symEntries.length;
  for (let i = 0; i < symEntries.length; i++) {
    if (symEntries[i]!.isGlobal) {
      firstGlobal = i;
      break;
    }
  }

  // Build section data buffers.
  const symtabData = buildSymtabBuffer(symEntries, strOffsets);

  // Build per-section rela buffers.
  const relaTextData = buildRelaBuffer(sectionRelocations.get('.text') ?? [], symIdx);
  const relaDataData = buildRelaBuffer(sectionRelocations.get('.data') ?? [], symIdx);
  const relaRodataData = buildRelaBuffer(sectionRelocations.get('.rodata') ?? [], symIdx);

  // Symtab section indices.
  const strIndex = indexMap.get('.strtab') ?? entries.length;

  // Recompute layout with actual sizes.
  const {
    entries: finalEntries,
    indexMap: finalIndexMap,
    shoff: finalShoff,
    shstrndx: finalShstrndx,
    flags: finalFlags,
  } = computeSectionLayout(
    sectionStates,
    sectionRelocations,
    symtabData.length,
    strData.length,
    shstrData.length,
    attrData.length,
    hasCompressed,
    emitAttributes,
    strIndex,
    firstGlobal
  );

  const secCount = finalEntries.length;

  // Rebuild section header table with final layout.
  const shdrTable = buildSectionHeaders(finalEntries, shstrOffsets);

  const ehdr = elfHeader(finalShoff, finalShstrndx, finalFlags, secCount);

  // Build sectionOffsets map for writeElfStream.
  const sectionOffsets = new Map<string, number>();
  for (const entry of finalEntries) {
    if (entry.name.length > 0) sectionOffsets.set(entry.name, entry.offset);
  }

  return {
    ehdr,
    relaTextData,
    relaDataData,
    relaRodataData,
    symtabData,
    strData,
    shstrData,
    attrData,
    shdrTable,
    sectionIndexMap: finalIndexMap,
    sectionOffsets,
  };
};

/**
 * Write a complete ELF64 ET_REL object as an async generator that yields
 * individual file regions.  The yielded byte chunks are, in order:
 *   1. ELF header (64 bytes)
 *   2. All chunks from encodeGenerator: .text instruction chunks, then
 *      .data bytes, then .rodata bytes (the encode generator produces these
 *      in the correct order for the output ELF)
 *   3. .rela.text section data (if non-empty)
 *   4. .rela.data section data (if non-empty)
 *   5. .rela.rodata section data (if non-empty)
 *   6. .symtab section data
 *   7. .strtab section data
 *   8. .shstrtab section data
 *   9. .riscv.attributes section data (only if non-empty)
 *  10. Section header table
 *
 * Text bytes are streamed per-instruction as produced by the encoder.
 * Data/rodata bytes are buffered by the encoder until EOF, then flushed
 * in section order (data before rodata).
 *
 * @param encodeChunks - Async generator from encode(). Yields .text chunks,
 * then .data bytes, then .rodata bytes.
 * @param parts - Pre-computed ELF parts from `computeElfParts`.
 * @yields The ELF object as a sequence of byte chunks.
 */
export async function* writeElfStream(
  encodeChunks: AsyncIterable<Uint8Array>,
  parts: ElfParts,
  textSize: number,
  dataSize: number
): AsyncGenerator<Uint8Array> {
  // Helper: emit zero-padding bytes to advance fileOffset toward target.
  const emitPad = function* (target: number, fileOffset: { v: number }): Generator<Uint8Array> {
    while (fileOffset.v < target) {
      const sz = Math.min(4096, target - fileOffset.v);
      yield new Uint8Array(sz);
      fileOffset.v += sz;
    }
  };

  yield parts.ehdr;
  const fpos = { v: ELF64_EHDR_SIZE };

  // Phase 1: iterate encode chunks (text, then data, then rodata).
  let textConsumed = 0;
  let dataConsumed = 0;
  let dataYielded = false;
  let rodataYielded = false;

  for await (const chunk of encodeChunks) {
    if (textConsumed < textSize) {
      // Text section: no padding needed (starts at ELF header boundary).
      yield chunk;
      textConsumed += chunk.length;
      fpos.v += chunk.length;
    } else if (!dataYielded) {
      // First non-text byte: pad to .data offset, then yield.
      const dataOffset = parts.sectionOffsets.get('.data') ?? fpos.v;
      yield* emitPad(dataOffset, fpos);
      yield chunk;
      dataConsumed = chunk.length;
      dataYielded = true;
      fpos.v += chunk.length;
    } else if (dataConsumed < dataSize || dataSize === 0) {
      // Still in data section (or all data is one chunk).
      // Check if this is the first data chunk (dataConsumed tracks pre-yield size).
      if (dataSize === 0) {
        // No data section; this is actually rodata. Fall through to rodata handling.
        if (!rodataYielded) {
          const rodataOffset = parts.sectionOffsets.get('.rodata') ?? fpos.v;
          yield* emitPad(rodataOffset, fpos);
          rodataYielded = true;
        }
        yield chunk;
        fpos.v += chunk.length;
      } else {
        // Data chunk.
        dataConsumed += chunk.length;
        if (dataSize > 0 && dataConsumed > dataSize) {
          // Overlap: this chunk straddles data→rodata boundary.
          // Split conceptually: first dataSize - (dataConsumed - chunk.length) bytes are data,
          // rest is rodata. But encode doesn't split chunks. Mark data as complete
          // and treat excess as rodata.
          if (!rodataYielded) {
            const rodataOffset = parts.sectionOffsets.get('.rodata') ?? fpos.v;
            yield* emitPad(rodataOffset, fpos);
            rodataYielded = true;
          }
          yield chunk;
          fpos.v += chunk.length;
        } else {
          yield chunk;
          fpos.v += chunk.length;
        }
      }
    } else {
      // Rodata chunk.
      if (!rodataYielded) {
        const rodataOffset = parts.sectionOffsets.get('.rodata') ?? fpos.v;
        yield* emitPad(rodataOffset, fpos);
        rodataYielded = true;
      }
      yield chunk;
      fpos.v += chunk.length;
    }
  }

  // Trailer sections: pad to aligned offset, then yield section bytes.
  for (const [sectionName, data] of [
    ['.rela.text', parts.relaTextData],
    ['.rela.data', parts.relaDataData],
    ['.rela.rodata', parts.relaRodataData],
    ['.symtab', parts.symtabData],
    ['.strtab', parts.strData],
    ['.shstrtab', parts.shstrData],
    ['.riscv.attributes', parts.attrData],
  ] as const) {
    if (data.length === 0) continue;
    const target = parts.sectionOffsets.get(sectionName) ?? fpos.v;
    if (target > fpos.v) {
      yield new Uint8Array(target - fpos.v);
      fpos.v = target;
    }
    yield data;
    fpos.v += data.length;
  }

  yield parts.shdrTable;
}
