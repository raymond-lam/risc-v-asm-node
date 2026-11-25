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

import assert from 'node:assert/strict';
import test from 'node:test';

import { assemble } from '#index';

// ---------------------------------------------------------------------------
// Embedded ELF reader — reads enough of an ELF64 object to assert the
// structural properties called for in the spec.  No external dependency.
// ---------------------------------------------------------------------------

type Elf64Reader = Readonly<{
  bytes: Uint8Array;
  eType: number;
  eMachine: number;
  ePhnum: number;
  eFlags: number;
  eShnum: number;
  eShstrndx: number;
  sectionNames: readonly string[];
  sectionSizes: readonly number[];
  sectionTypes: readonly number[];
  sectionFlags: readonly number[];
  sectionLinks: readonly number[];
  sectionInfos: readonly number[];
  sectionAddraligns: readonly number[];
  sectionEntsizes: readonly number[];
  sectionOffsets: readonly number[];
  textBytes: Uint8Array;
  relocations: readonly Elf64Rela[];
  relocationSections: ReadonlyMap<string, readonly Elf64Rela[]>;
  symbols: readonly Elf64Sym[];
  strtab: Uint8Array;
  shstrtab: Uint8Array;
}>;

type Elf64Rela = Readonly<{
  offset: number;
  type: number;
  symIndex: number;
  addend: number;
}>;

type Elf64Sym = Readonly<{
  name: string;
  value: number;
  size: number;
  bind: number;
  type: number;
  shndx: number;
}>;

/**
 * Read a u16 from a buffer at a given offset (little-endian).
 */
const readU16 = (buf: Uint8Array, offset: number): number =>
  (buf[offset] ?? 0) | ((buf[offset + 1] ?? 0) << 8);

/**
 * Read a u32 from a buffer at a given offset (little-endian).
 */
const readU32 = (buf: Uint8Array, offset: number): number =>
  (buf[offset] ?? 0) |
  ((buf[offset + 1] ?? 0) << 8) |
  ((buf[offset + 2] ?? 0) << 16) |
  ((buf[offset + 3] ?? 0) << 24);

/**
 * Read a u64 from a buffer at a given offset (little-endian).
 * JavaScript shift operators truncate to 32 bits, so multiplication is used
 * for the upper half.
 */
const readU64 = (buf: Uint8Array, offset: number): number =>
  readU32(buf, offset) + readU32(buf, offset + 4) * 0x1_0000_0000;

/**
 * Read a null-terminated string from a buffer.
 */
const readCStr = (buf: Uint8Array, offset: number): string => {
  const end = buf.indexOf(0, offset);
  if (end < 0) return '';
  const slice = buf.slice(offset, end);
  return new TextDecoder().decode(slice);
};

/**
 * Parse an ELF64 object into a structured reader.
 *
 * @param elf - Complete ELF object bytes.
 * @returns Structured reader with all expected fields.
 */
const parseElf64 = (elf: Uint8Array): Elf64Reader => {
  // ELF64 header offsets:
  //   e_type=16, e_machine=18, e_version=20, e_entry=24, e_phoff=32,
  //   e_shoff=40, e_flags=48, e_ehsize=52, e_phentsize=54, e_phnum=56,
  //   e_shentsize=58, e_shnum=60, e_shstrndx=62
  const eType = readU16(elf, 16);
  const eMachine = readU16(elf, 18);
  const ePhnum = readU16(elf, 56);
  const eFlags = readU32(elf, 48);
  const eShnum = readU16(elf, 60);
  const eShstrndx = readU16(elf, 62);
  const eShoff = readU64(elf, 40);
  const eShentsize = readU16(elf, 58);

  // Read section headers.
  const sectionNames: string[] = [];
  const sectionSizes: number[] = [];
  const sectionTypes: number[] = [];
  const sectionFlags: number[] = [];
  const sectionLinks: number[] = [];
  const sectionInfos: number[] = [];
  const sectionAddraligns: number[] = [];
  const sectionEntsizes: number[] = [];
  const sectionOffsets: number[] = [];

  // First pass: read all section headers to get .shstrtab offset.
  for (let i = 0; i < eShnum; i++) {
    const shOff = eShoff + i * eShentsize;
    const shType = readU32(elf, shOff + 4);
    const shFlags = readU64(elf, shOff + 8);
    const shOffset = readU64(elf, shOff + 24);
    const shSize = readU64(elf, shOff + 32);
    const shLink = readU32(elf, shOff + 40);
    const shInfo = readU32(elf, shOff + 44);
    const shAddralign = readU64(elf, shOff + 48);
    const shEntsize = readU64(elf, shOff + 56);

    sectionNames.push('');
    sectionTypes.push(shType);
    sectionFlags.push(shFlags);
    sectionSizes.push(shSize);
    sectionLinks.push(shLink);
    sectionInfos.push(shInfo);
    sectionAddraligns.push(shAddralign);
    sectionEntsizes.push(shEntsize);
    sectionOffsets.push(shOffset);
  }

  // Read .shstrtab to resolve section names.
  const shstrOff = sectionOffsets[eShstrndx] ?? 0;
  const shstrSize = sectionSizes[eShstrndx] ?? 0;
  const shstrData = elf.slice(shstrOff, shstrOff + shstrSize);

  for (let i = 0; i < eShnum; i++) {
    const shOff = eShoff + i * eShentsize;
    const shName = readU32(elf, shOff);
    sectionNames[i] = readCStr(shstrData, shName);
  }

  // Read .text section data.
  const textIndex = sectionNames.indexOf('.text');
  const textOffset = textIndex >= 0 ? (sectionOffsets[textIndex] ?? 0) : 0;
  const textSize = textIndex >= 0 ? (sectionSizes[textIndex] ?? 0) : 0;
  const textBytes =
    textIndex >= 0 ? elf.slice(textOffset, textOffset + textSize) : new Uint8Array();

  // Read every relocation section, keyed by its section name.
  const relocationSections = new Map<string, readonly Elf64Rela[]>();
  for (let sectionIndex = 0; sectionIndex < eShnum; sectionIndex++) {
    if (sectionTypes[sectionIndex] !== 4) continue;
    const relaEntsize = sectionEntsizes[sectionIndex] ?? 24;
    const relaOff = sectionOffsets[sectionIndex] ?? 0;
    const relaSize = sectionSizes[sectionIndex] ?? 0;
    const relocations: Elf64Rela[] = [];
    for (let i = 0; i < relaSize; i += relaEntsize) {
      const rOffset = readU64(elf, relaOff + i);
      const rInfo = readU64(elf, relaOff + i + 8);
      const rAddend = readU64(elf, relaOff + i + 16);
      const symIndex = Math.floor(rInfo / 0x1_0000_0000);
      const rType = rInfo & 0xffffffff;
      const addend = rAddend > 0x7fff_ffff_ffff_ffff ? rAddend - 0x1_0000_0000_0000_0000 : rAddend;
      relocations.push({ offset: rOffset, type: rType, symIndex, addend });
    }
    relocationSections.set(sectionNames[sectionIndex]!, relocations);
  }
  const relocations = relocationSections.get('.rela.text') ?? [];

  // Read .symtab.
  const symIndex = sectionNames.indexOf('.symtab');
  const symEntsize = symIndex >= 0 ? (sectionEntsizes[symIndex] ?? 24) : 24;
  const symOff = symIndex >= 0 ? (sectionOffsets[symIndex] ?? 0) : 0;
  const symSize = symIndex >= 0 ? (sectionSizes[symIndex] ?? 0) : 0;
  const symbols: Elf64Sym[] = [];

  // Read .strtab for symbol names.
  const strIndex = sectionNames.indexOf('.strtab');
  const strOff = strIndex >= 0 ? (sectionOffsets[strIndex] ?? 0) : 0;
  const strSize = strIndex >= 0 ? (sectionSizes[strIndex] ?? 0) : 0;
  const strData = elf.slice(strOff, strOff + strSize);

  for (let i = 0; i < symSize; i += symEntsize) {
    const stName = readU32(elf, symOff + i);
    const stInfo = elf[symOff + i + 4] ?? 0;
    const stShndx = readU16(elf, symOff + i + 6);
    const stValue = readU64(elf, symOff + i + 8);
    const stSize = readU64(elf, symOff + i + 16);
    const name = readCStr(strData, stName);
    const bind = stInfo >> 4;
    const symType = stInfo & 0xf;
    symbols.push({ name, value: stValue, size: stSize, bind, type: symType, shndx: stShndx });
  }

  return {
    bytes: elf,
    eType,
    eMachine,
    ePhnum,
    eFlags,
    eShnum,
    eShstrndx,
    sectionNames,
    sectionSizes,
    sectionTypes,
    sectionFlags,
    sectionLinks,
    sectionInfos,
    sectionAddraligns,
    sectionEntsizes,
    sectionOffsets,
    textBytes,
    relocations,
    relocationSections,
    symbols,
    strtab: strData,
    shstrtab: shstrData,
  };
};

// ---------------------------------------------------------------------------
// Collect all ELF bytes from assemble()
// ---------------------------------------------------------------------------

const collectElf = async (
  source: string,
  options?: { defsym?: string[]; marchAttr?: boolean }
): Promise<Elf64Reader> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of assemble(source, options)) {
    chunks.push(chunk);
  }
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const buf = new Uint8Array(total);
  let off = 0;
  for (const chunk of chunks) {
    buf.set(chunk, off);
    off += chunk.length;
  }
  return parseElf64(buf);
};

/** Read a PROGBITS section's payload from the collected ELF bytes. */
const sectionBytes = (elf: Elf64Reader, name: string): Uint8Array => {
  const index = elf.sectionNames.indexOf(name);
  assert.ok(index >= 0, `missing section ${name}`);
  const offset = elf.sectionOffsets[index]!;
  return elf.bytes.slice(offset, offset + elf.sectionSizes[index]!);
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test('ELF header has e_type=1, e_machine=243, e_phnum=0', async () => {
  const elf = await collectElf('nop');
  assert.strictEqual(elf.eType, 1);
  assert.strictEqual(elf.eMachine, 243);
  assert.strictEqual(elf.ePhnum, 0);
});

test('ELF header e_flags has EF_RISCV_RVC set and float-ABI bits zero', async () => {
  const elf = await collectElf('nop\nc.ebreak');
  // e_flags should have EF_RISCV_RVC (0x1) because c.ebreak is a compressed instruction
  assert.ok((elf.eFlags & 0x1) === 0x1, 'EF_RISCV_RVC should be set');
  // Float-ABI bits (0x6) must be zero (soft-float is the default)
  assert.strictEqual(elf.eFlags & 0x6, 0, 'float-ABI bits must be 0');
});

test('ELF header e_flags has float-ABI bits zero even when no compressed instruction', async () => {
  const elf = await collectElf('nop');
  assert.strictEqual(elf.eFlags & 0x6, 0, 'float-ABI bits must be 0');
});

test('empty source produces valid ELF with only null section and sections', async () => {
  const elf = await collectElf('');
  // At minimum: NULL, .text, .data, .rodata, .bss, .symtab, .strtab, .shstrtab
  assert.ok(elf.eShnum >= 8, 'at least 8 sections');
  assert.strictEqual(elf.sectionNames[0], '');
  assert.ok(elf.sectionNames.includes('.text'));
  assert.ok(elf.sectionNames.includes('.symtab'));
  assert.ok(elf.sectionNames.includes('.strtab'));
  assert.ok(elf.sectionNames.includes('.shstrtab'));
  // .rela.text is only emitted if there are relocations
  assert.ok(elf.sectionNames.includes('.data'));
  assert.ok(elf.sectionNames.includes('.rodata'));
  assert.ok(elf.sectionNames.includes('.bss'));
});

test('section types are correct', async () => {
  // Use a source that produces a .text relocation so .rela.text is present.
  const elf = await collectElf('target: nop\nbeq x1, x0, target');
  const textIdx = elf.sectionNames.indexOf('.text');
  const dataIdx = elf.sectionNames.indexOf('.data');
  const rodataIdx = elf.sectionNames.indexOf('.rodata');
  const bssIdx = elf.sectionNames.indexOf('.bss');
  const relaIdx = elf.sectionNames.indexOf('.rela.text');
  const symIdx = elf.sectionNames.indexOf('.symtab');
  const strIdx = elf.sectionNames.indexOf('.strtab');
  const shstrIdx = elf.sectionNames.indexOf('.shstrtab');

  assert.strictEqual(elf.sectionTypes[dataIdx], 1); // SHT_PROGBITS
  assert.strictEqual(elf.sectionTypes[rodataIdx], 1); // SHT_PROGBITS
  assert.strictEqual(elf.sectionTypes[bssIdx], 8); // SHT_NOBITS
  assert.strictEqual(elf.sectionTypes[textIdx], 1); // SHT_PROGBITS
  assert.strictEqual(elf.sectionTypes[relaIdx], 4); // SHT_RELA
  assert.strictEqual(elf.sectionTypes[symIdx], 2); // SHT_SYMTAB
  assert.strictEqual(elf.sectionTypes[strIdx], 3); // SHT_STRTAB
  assert.strictEqual(elf.sectionTypes[shstrIdx], 3); // SHT_STRTAB
});

test('sh_link/sh_info consistency', async () => {
  // Use a source that produces a relocation so .rela.text is present.
  const elf = await collectElf('jal target\ntarget: nop');
  const textIdx = elf.sectionNames.indexOf('.text');
  const relaIdx = elf.sectionNames.indexOf('.rela.text');
  const symIdx = elf.sectionNames.indexOf('.symtab');

  // .rela.text sh_link = .symtab index, sh_info = .text index
  assert.strictEqual(elf.sectionLinks[relaIdx], symIdx);
  assert.strictEqual(elf.sectionInfos[relaIdx], textIdx);

  // .symtab sh_link = .strtab index
  const strIdx = elf.sectionNames.indexOf('.strtab');
  assert.strictEqual(elf.sectionLinks[symIdx], strIdx);
});

test('sh_addralign is 4 when only 4-byte instructions are emitted', async () => {
  const elf = await collectElf('nop');
  const textIdx = elf.sectionNames.indexOf('.text');
  assert.strictEqual(elf.sectionAddraligns[textIdx], 4);
});

test('sh_addralign is 2 when compressed instruction is present', async () => {
  const elf = await collectElf('c.ebreak');
  const textIdx = elf.sectionNames.indexOf('.text');
  assert.strictEqual(elf.sectionAddraligns[textIdx], 2);
});

test('sh_entsize for .rela.text is 24 and .symtab is 24', async () => {
  // Use a source that produces a relocation so .rela.text is present.
  const elf = await collectElf('jal target\ntarget: nop');
  const relaIdx = elf.sectionNames.indexOf('.rela.text');
  const symIdx = elf.sectionNames.indexOf('.symtab');

  assert.strictEqual(elf.sectionEntsizes[relaIdx], 24);
  assert.strictEqual(elf.sectionEntsizes[symIdx], 24);
});

test('symbol table: entry 0 is all-zero, then locals, then globals', async () => {
  const elf = await collectElf(`
    start: addi x1, x0, 1
    end: nop
  `);

  assert.ok(elf.symbols.length >= 3, 'null + start + end');
  // Entry 0
  assert.strictEqual(elf.symbols[0]?.name, '');
  assert.strictEqual(elf.symbols[0]?.value, 0);
  assert.strictEqual(elf.symbols[0]?.shndx, 0);

  // Locals (sorted by name): 'end', 'start'
  assert.strictEqual(elf.symbols[1]?.name, 'end');
  assert.strictEqual(elf.symbols[2]?.name, 'start');
});

test('symbol shndx for defined labels is .text section index', async () => {
  const elf = await collectElf('label: nop');
  const textIdx = elf.sectionNames.indexOf('.text');
  // Symbol entry 1 should be our label
  assert.strictEqual(elf.symbols[1]?.shndx, textIdx);
});

test('symbol values match label offsets in .text', async () => {
  const elf = await collectElf(`
    first: addi x1, x0, 1
    second: nop
  `);
  // first is at 0, second is at 4 (addi = 4 bytes)
  assert.strictEqual(elf.symbols.find((s) => s.name === 'first')?.value, 0);
  assert.strictEqual(elf.symbols.find((s) => s.name === 'second')?.value, 4);
});

test('undefined symbol is STB_GLOBAL, SHN_UNDEF, st_value=0', async () => {
  const elf = await collectElf('jal nowhere');
  // 'nowhere' is referenced but undefined → global, SHN_UNDEF (0)
  const sym = elf.symbols.find((s) => s.name === 'nowhere');
  assert.ok(sym !== undefined);
  assert.strictEqual(sym.bind, 1); // STB_GLOBAL
  assert.strictEqual(sym.shndx, 0); // SHN_UNDEF
  assert.strictEqual(sym.value, 0);
});

test('defined labels are STB_LOCAL', async () => {
  const elf = await collectElf('target: nop');
  const sym = elf.symbols.find((s) => s.name === 'target');
  assert.ok(sym !== undefined);
  assert.strictEqual(sym.bind, 0); // STB_LOCAL
});

test('--defsym symbols are STB_GLOBAL, SHN_ABS', async () => {
  const elf = await collectElf('addi x1, x0, val', { defsym: ['val=42'] });
  const sym = elf.symbols.find((s) => s.name === 'val');
  assert.ok(sym !== undefined, 'val should be in symbol table');
  assert.strictEqual(sym.bind, 1); // STB_GLOBAL
  assert.strictEqual(sym.shndx, 0xfff1); // SHN_ABS
  assert.strictEqual(sym.value, 42);
});

test('branch to defined label emits R_RISCV_BRANCH relocation', async () => {
  const elf = await collectElf('target: nop\nbeq x1, x0, target');
  assert.ok(elf.relocations.length >= 1, 'at least one relocation');
  const rel = elf.relocations[0]!;
  assert.strictEqual(rel.type, 16); // R_RISCV_BRANCH
  assert.strictEqual(rel.offset, 4); // beq is at offset 4
  assert.strictEqual(rel.addend, 0);
  // symIndex should point to the 'target' symbol
  const sym = elf.symbols[rel.symIndex];
  assert.strictEqual(sym?.name, 'target');
});

test('jal to undefined symbol emits R_RISCV_JAL relocation', async () => {
  const elf = await collectElf('jal elsewhere');
  assert.ok(elf.relocations.length >= 1);
  const rel = elf.relocations[0]!;
  assert.strictEqual(rel.type, 17); // R_RISCV_JAL
  assert.strictEqual(rel.offset, 0);
  const sym = elf.symbols[rel.symIndex];
  assert.strictEqual(sym?.name, 'elsewhere');
  assert.strictEqual(sym?.bind, 1); // global (undefined)
});

test('every r_offset falls on an instruction boundary', async () => {
  const elf = await collectElf(`
    start: addi x1, x0, 1
    beq x1, x0, start
    nop
  `);
  // addi = 4 bytes, beq = 4 bytes → offsets 0, 4, 8
  for (const rel of elf.relocations) {
    assert.ok(rel.offset % 4 === 0 || rel.offset % 2 === 0, 'r_offset on instruction boundary');
  }
});

test('.symtab sh_info is index of first GLOBAL symbol', async () => {
  const elf = await collectElf('target: nop\nbeq x1, x0, somewhere');
  const symIdx = elf.sectionNames.indexOf('.symtab');
  const firstGlobal = elf.sectionInfos[symIdx];
  // Entry 0 = null, entry 1 = 'target' (local), entry 2 = 'somewhere' (global)
  assert.strictEqual(firstGlobal, 2, 'first global is entry 2');
});

test('relocation symIndex matches the correct symbol', async () => {
  const elf = await collectElf('target: nop\nbeq x1, x0, target');
  const rel = elf.relocations[0]!;
  const sym = elf.symbols[rel.symIndex];
  assert.strictEqual(sym?.name, 'target');
  assert.strictEqual(sym?.value, 0);
});

test('.shstrndx points to .shstrtab section', async () => {
  const elf = await collectElf('nop');
  assert.strictEqual(elf.eShstrndx, elf.sectionNames.indexOf('.shstrtab'));
});

test('text bytes are correct for simple instructions', async () => {
  const elf = await collectElf('addi x1, x0, 42');
  assert.deepEqual(elf.textBytes, Uint8Array.from([0x93, 0x00, 0xa0, 0x02]));
});

test('two files concatenated produce correct single ELF', async () => {
  // Can't use file paths in unit test without temp files,
  // but a multi-line string works for the source-concatenation test.
  const elf = await collectElf('addi x1, x0, 1\naddi x2, x1, 2');
  assert.strictEqual(elf.textBytes.length, 8);
});

// ---------------------------------------------------------------------------
// .riscv.attributes section tests
// ---------------------------------------------------------------------------

test('.riscv.attributes absent by default (no -march-attr)', async () => {
  const elf = await collectElf('nop');
  assert.strictEqual(elf.sectionNames.indexOf('.riscv.attributes'), -1);
});

test('.riscv.attributes absent under -mno-arch-attr', async () => {
  const elf = await collectElf('nop', { marchAttr: false });
  assert.strictEqual(elf.sectionNames.indexOf('.riscv.attributes'), -1);
});

test('.riscv.attributes present and parseable under -march-attr', async () => {
  const elf = await collectElf('nop\nc.ebreak', { marchAttr: true });
  const idx = elf.sectionNames.indexOf('.riscv.attributes');
  assert.ok(idx >= 0, '.riscv.attributes section must exist');

  // Read section data.
  assert.strictEqual(elf.sectionTypes[idx], 0x70000003);

  // Verify the data starts with 'A' format header: 'A', version 1, format 0
  // We need direct buffer access.
  // Re-parse from the buffer: read the section data from the offset stored in
  // sectionOffsets array (we must traverse the ELF again).
  // Use the chunk collection from assemble.
  const chunks2: Uint8Array[] = [];
  for await (const chunk of assemble('nop\nc.ebreak', { marchAttr: true })) {
    chunks2.push(chunk);
  }
  const total = chunks2.reduce((sum, c) => sum + c.length, 0);
  const buf2 = new Uint8Array(total);
  let o = 0;
  for (const c of chunks2) {
    buf2.set(c, o);
    o += c.length;
  }

  const attrIdx = parseElf64(buf2).sectionNames.indexOf('.riscv.attributes');
  // Read section offset from the buffer directly.
  // Section header at position eShoff + attrIdx * 64
  const eShoff = readU64(buf2, 40);
  const eShentsize = readU16(buf2, 58);
  const shOff = eShoff + attrIdx * eShentsize;
  const shOffset = readU64(buf2, shOff + 24);
  const shSize = readU64(buf2, shOff + 32);
  const attrData = buf2.slice(shOffset, shOffset + shSize);

  assert.strictEqual(attrData[0], 0x41, 'starts with A');
  assert.strictEqual(attrData[1], 0x01, 'version 1');
  assert.strictEqual(attrData[2], 0x00, 'A format');

  // Parse the 'A' format to find Tag_File (0x1) and its sub-tags.
  // After 3-byte header, look for Tag_File.
  let pos = 3;
  const readUleb128 = (buf: Uint8Array, start: number): { value: number; end: number } => {
    let result = 0;
    let shift = 0;
    let idx = start;
    while (idx < buf.length) {
      const byte = buf[idx]!;
      result |= (byte & 0x7f) << shift;
      shift += 7;
      idx++;
      if ((byte & 0x80) === 0) break;
    }
    return { value: result, end: idx };
  };

  // Expect Tag_File (0x1)
  const tagFile = readUleb128(attrData, pos);
  assert.strictEqual(tagFile.value, 0x1, 'Tag_File');
  pos = tagFile.end;

  // Read size of Tag_File payload
  const tagFileSize = readUleb128(attrData, pos);
  pos = tagFileSize.end;
  const subEnd = pos + tagFileSize.value;

  // Expect sub-tags in the payload
  let foundStackAlign = false;
  let foundArch = false;
  while (pos < subEnd) {
    const subTag = readUleb128(attrData, pos);
    pos = subTag.end;
    const subSize = readUleb128(attrData, pos);
    pos = subSize.end;

    if (subTag.value === 0x2) {
      // Tag_RISCV_stack_align: payload is a uleb128 value
      const alignVal = readUleb128(attrData, pos);
      assert.strictEqual(alignVal.value, 16, 'stack_align is 16 (compressed)');
      foundStackAlign = true;
    } else if (subTag.value === 0x3) {
      // Tag_RISCV_arch: payload is NUL-terminated string
      const archStr = new TextDecoder().decode(
        attrData.slice(pos, subSize.value + pos - 1) // exclude NUL
      );
      assert.ok(archStr.length > 0, 'arch string is non-empty');
      assert.ok(archStr.includes('rv64i'), 'arch string contains rv64i');
      assert.ok(archStr.includes('c2p0'), 'arch string contains c2p0 (compressed)');
      foundArch = true;
    }
    pos += subSize.value;
  }

  assert.ok(foundStackAlign, 'Tag_RISCV_stack_align should be present');
  assert.ok(foundArch, 'Tag_RISCV_arch should be present');
});

test('.riscv.attributes section header linkage is correct', async () => {
  const elf = await collectElf('nop', { marchAttr: true });
  const attrIdx = elf.sectionNames.indexOf('.riscv.attributes');
  assert.ok(attrIdx >= 0);
  // Type is SHT_RISCV_ATTRIBUTES
  assert.strictEqual(elf.sectionTypes[attrIdx], 0x70000003);
  // sh_link and sh_info are 0
  assert.strictEqual(elf.sectionLinks[attrIdx], 0);
  assert.strictEqual(elf.sectionInfos[attrIdx], 0);
});

test('content sections have exact ELF flags and zero link/info fields', async () => {
  const elf = await collectElf(`
    .text
    nop
    .data
    .word 7
    .rodata
    .byte 1
    .bss
    .zero 16
  `);
  const expectedFlags = new Map([
    ['.text', 0x6],
    ['.rodata', 0x2],
    ['.data', 0x3],
    ['.bss', 0x3],
  ]);
  for (const [name, flags] of expectedFlags) {
    const index = elf.sectionNames.indexOf(name);
    assert.ok(index >= 0, `missing section ${name}`);
    assert.strictEqual(elf.sectionFlags[index], flags, `${name} sh_flags`);
    assert.strictEqual(elf.sectionLinks[index], 0, `${name} sh_link`);
    assert.strictEqual(elf.sectionInfos[index], 0, `${name} sh_info`);
  }
});

test('.bss has NOBITS type, size, aligned offset, does not advance file offset', async () => {
  const elf = await collectElf(`
    .text
    nop
    .data
    .word 7
    .rodata
    .byte 1
    .bss
    buf: .zero 16
  `);
  const bssIndex = elf.sectionNames.indexOf('.bss');
  const symtabIndex = elf.sectionNames.indexOf('.symtab');
  const rodataIndex = elf.sectionNames.indexOf('.rodata');

  // Type and size.
  assert.strictEqual(elf.sectionTypes[bssIndex], 8, 'SHT_NOBITS');
  assert.strictEqual(elf.sectionSizes[bssIndex], 16);

  // bss offset is aligned to its addralign.
  const bssAddralign = elf.sectionAddraligns[bssIndex]!;
  assert.ok(bssAddralign > 0);
  assert.strictEqual(elf.sectionOffsets[bssIndex]! % bssAddralign, 0, 'bss offset aligned');

  // bss offset is at its logical position (after rodata), not at EOF.
  const eShoff = readU64(elf.bytes, 40);
  assert.ok(
    elf.sectionOffsets[bssIndex]! < eShoff,
    'bss offset is before e_shoff (logical position, not EOF)'
  );

  // bss offset is at or after rodata end, aligned to bss addralign.
  const rodataEnd = elf.sectionOffsets[rodataIndex]! + elf.sectionSizes[rodataIndex]!;
  const expectedBssAlign = ((rodataEnd + bssAddralign - 1) / bssAddralign) * bssAddralign;
  assert.strictEqual(
    elf.sectionOffsets[bssIndex]!,
    expectedBssAlign,
    'bss offset at aligned rodata end position'
  );

  // symtab offset is not advanced past rodata by bss.
  assert.ok(
    elf.sectionOffsets[symtabIndex]! >= rodataEnd,
    'symtab after rodata (bss does not advance file offset)'
  );

  // Symbol in .bss has correct shndx.
  assert.strictEqual(elf.symbols.find((symbol) => symbol.name === 'buf')?.shndx, bssIndex);
});

test('ELF file size is e_shoff plus the complete section header table', async () => {
  const elf = await collectElf(`
    .data
    msg: .asciz "hi"
    ptr: .dword msg
    n: .word 7
    .bss
    buf: .zero 16
    .text
    .globl _start
    _start: la a0, msg
  `);
  const eShoff = readU64(elf.bytes, 40);
  const eShentsize = readU16(elf.bytes, 58);
  assert.ok(eShoff < elf.bytes.length, 'e_shoff is the section table start, not EOF');
  assert.strictEqual(elf.bytes.length, eShoff + elf.eShnum * eShentsize);

  // Regression: .bss NOBITS offset must be at its logical section-order position
  // (after .rodata), not at the end of file.  In this layout .text ends at 0x48,
  // .data ends at 0x57, empty .rodata is aligned to 0x58, so .bss must be 0x58.
  const bssIndex = elf.sectionNames.indexOf('.bss');
  const rodataIndex = elf.sectionNames.indexOf('.rodata');
  const relaTextIndex = elf.sectionNames.indexOf('.rela.text');
  assert.strictEqual(elf.sectionOffsets[bssIndex], 0x58, 'bss offset at logical position 0x58');
  assert.strictEqual(
    elf.sectionOffsets[relaTextIndex],
    elf.sectionOffsets[bssIndex],
    'rela.text offset equals bss offset (NOBITS does not advance file offset)'
  );
  assert.ok((elf.sectionOffsets[bssIndex] ?? 0) < eShoff, '.bss offset before e_shoff');
  // The file offset after .rodata is 0x58; .bss NOBITS does not advance it.
  const rodataEnd = elf.sectionOffsets[rodataIndex]! + elf.sectionSizes[rodataIndex]!;
  assert.strictEqual(rodataEnd, 0x58, '.rodata ends at 0x58');
  assert.strictEqual(
    elf.sectionOffsets[bssIndex],
    rodataEnd,
    'bss offset equals rodata end (no padding needed at this alignment)'
  );
});

test('.word and .dword labels emit absolute relocations and zero placeholders', async () => {
  const elf = await collectElf(`
    .data
    msg: .asciz "hi"
    word: .word msg
    dword: .dword msg
  `);
  const dataIndex = elf.sectionNames.indexOf('.data');
  const relaIndex = elf.sectionNames.indexOf('.rela.data');
  const symtabIndex = elf.sectionNames.indexOf('.symtab');
  const data = sectionBytes(elf, '.data');
  const relocations = elf.relocationSections.get('.rela.data');

  assert.deepEqual(data.slice(0, 3), Uint8Array.from([0x68, 0x69, 0]));
  assert.deepEqual(data.slice(3), new Uint8Array(12));
  assert.strictEqual(relocations?.length, 2);
  assert.deepEqual(
    relocations?.map(({ offset, type, addend }) => ({ offset, type, addend })),
    [
      { offset: 3, type: 1, addend: 0 },
      { offset: 7, type: 2, addend: 0 },
    ]
  );
  for (const relocation of relocations ?? []) {
    const symbol = elf.symbols[relocation.symIndex];
    assert.strictEqual(symbol?.name, 'msg');
    assert.strictEqual(symbol?.shndx, dataIndex);
    assert.strictEqual(symbol?.value, 0);
  }
  assert.strictEqual(elf.sectionLinks[relaIndex], symtabIndex);
  assert.strictEqual(elf.sectionInfos[relaIndex], dataIndex);
});

test('immediate .word emits little-endian bytes without a relocation', async () => {
  const elf = await collectElf('.data\nn: .word 7');
  assert.deepEqual(sectionBytes(elf, '.data'), Uint8Array.from([7, 0, 0, 0]));
  assert.strictEqual(elf.relocationSections.has('.rela.data'), false);
});

test('text-data-text matches consolidated text and symbols retain section offsets', async () => {
  const split = await collectElf(`
    first: nop
    .data
    msg: .word 7
    .text
    second: nop
  `);
  const consolidated = await collectElf('first: nop\nsecond: nop');
  const textIndex = split.sectionNames.indexOf('.text');
  const dataIndex = split.sectionNames.indexOf('.data');

  assert.deepEqual(split.textBytes, consolidated.textBytes);
  assert.deepEqual(sectionBytes(split, '.data'), Uint8Array.from([7, 0, 0, 0]));
  assert.deepEqual(
    ['first', 'second', 'msg'].map((name) => {
      const symbol = split.symbols.find((entry) => entry.name === name);
      return { shndx: symbol?.shndx, value: symbol?.value };
    }),
    [
      { shndx: textIndex, value: 0 },
      { shndx: textIndex, value: 4 },
      { shndx: dataIndex, value: 0 },
    ]
  );
});

test('text .align 2 (4-byte) uses NOP fill, .balign 3 uses c.nop, RVC set with c.nop', async () => {
  const nop = Uint8Array.from([0x13, 0, 0, 0]);
  const cNop = Uint8Array.from([0x01, 0x00]);

  // .align 2 = 4-byte alignment. After 4-byte nop, already aligned → no padding.
  const elf1 = await collectElf(`
    nop
    .align 2
    nop
  `);
  assert.deepEqual(elf1.textBytes, Uint8Array.from([...nop, ...nop]));
  assert.strictEqual(elf1.eFlags & 0x1, 0, 'RVC not set with 4-byte NOPs only');

  // .align 3 = 8-byte alignment. After 4-byte nop, 4 bytes NOP fill.
  const elf2 = await collectElf(`
    nop
    .align 3
    nop
  `);
  assert.deepEqual(elf2.textBytes, Uint8Array.from([...nop, ...nop, ...nop]));
  assert.strictEqual(elf2.eFlags & 0x1, 0, 'RVC not set with 4-byte NOPs only');

  // .p2align 3 = 8-byte alignment.
  const elf3 = await collectElf(`
    nop
    .p2align 3
    nop
  `);
  assert.deepEqual(elf3.textBytes, Uint8Array.from([...nop, ...nop, ...nop]));
  assert.strictEqual(elf3.eFlags & 0x1, 0, 'RVC not set with 4-byte NOPs only');

  // .balign 3 = 3-byte alignment. After 4-byte nop at offset 4, align to 3 → 2 bytes padding.
  const elf4 = await collectElf(`
    nop
    .balign 3
    nop
  `);
  // nop(4) + c.nop(2) + nop(4) = 10 bytes
  assert.deepEqual(elf4.textBytes, Uint8Array.from([...nop, ...cNop, ...nop]));
  // c.nop sets RVC flag.
  assert.strictEqual(elf4.eFlags & 0x1, 0x1, 'RVC set when c.nop is emitted');

  // .align 0 = no-op.
  const elf5 = await collectElf(`
    nop
    .align 0
    nop
  `);
  assert.deepEqual(elf5.textBytes, Uint8Array.from([...nop, ...nop]));
  assert.strictEqual(elf5.eFlags & 0x1, 0, 'RVC not set');
});

test('data alignment uses zero bytes for .align and .balign', async () => {
  // .align 2 = 4-byte alignment.
  const elf = await collectElf(`
    .data
    .byte 1
    .align 2
    .byte 2
  `);
  // After byte(1) at offset 1, padding = 3 zero bytes.
  assert.deepEqual(sectionBytes(elf, '.data'), Uint8Array.from([1, 0, 0, 0, 2]));

  // .balign 3 = 3-byte alignment.
  const elf2 = await collectElf(`
    .data
    .byte 1
    .balign 3
    .byte 2
  `);
  // After byte(1) at offset 1, align to 3: padding = 2 zero bytes.
  assert.deepEqual(sectionBytes(elf2, '.data'), Uint8Array.from([1, 0, 0, 2]));
});

test('.word local symbol emits R_RISCV_32 relocation with correct symIndex and zero bytes', async () => {
  const elf = await collectElf(`
    .data
    target: .word 7
    ref: .word target
  `);
  const relocations = elf.relocationSections.get('.rela.data');
  assert.ok(relocations !== undefined, '.rela.data must exist');
  assert.strictEqual(relocations.length, 1);
  const rel = relocations[0]!;
  assert.strictEqual(rel.type, 1, 'R_RISCV_32');
  assert.strictEqual(rel.offset, 4); // 'ref' starts at offset 4
  assert.strictEqual(rel.addend, 0);
  const sym = elf.symbols[rel.symIndex];
  assert.strictEqual(sym?.name, 'target');
  // The ref word is all zeros (placeholder for the symbol)
  assert.deepEqual(
    sectionBytes(elf, '.data').slice(4, 8),
    new Uint8Array(4),
    'placeholder bytes must be zero'
  );
});

test('.dword local symbol emits R_RISCV_64 relocation with correct symIndex and zero bytes', async () => {
  const elf = await collectElf(`
    .data
    target: .word 7
    ref: .dword target
  `);
  const relocations = elf.relocationSections.get('.rela.data');
  assert.ok(relocations !== undefined, '.rela.data must exist');
  assert.strictEqual(relocations.length, 1);
  const rel = relocations[0]!;
  assert.strictEqual(rel.type, 2, 'R_RISCV_64');
  assert.strictEqual(rel.offset, 4); // 'ref' starts at offset 4
  assert.strictEqual(rel.addend, 0);
  const sym = elf.symbols[rel.symIndex];
  assert.strictEqual(sym?.name, 'target');
  // The ref dword is all zeros (placeholder for the symbol)
  assert.deepEqual(
    sectionBytes(elf, '.data').slice(4, 12),
    new Uint8Array(8),
    'placeholder bytes must be zero'
  );
});

test('.bss .zero and .space increase sh_size with NOBITS and no file bytes', async () => {
  const elf = await collectElf(`
    .bss
    buf1: .zero 32
    buf2: .space 16
    .text
    nop
  `);
  const bssIndex = elf.sectionNames.indexOf('.bss');
  assert.ok(bssIndex >= 0, '.bss section exists');
  assert.strictEqual(elf.sectionTypes[bssIndex], 8, 'SHT_NOBITS');
  assert.strictEqual(elf.sectionSizes[bssIndex], 48, 'bss size is 32 + 16');
  // NOBITS sections occupy no file space; the next PROGBITS section
  // (or symtab) should start at the same or later offset.
  assert.strictEqual(elf.relocationSections.has('.rela.bss'), false);
  // Symbols in .bss have correct shndx.
  assert.strictEqual(elf.symbols.find((s) => s.name === 'buf1')?.shndx, bssIndex);
  assert.strictEqual(elf.symbols.find((s) => s.name === 'buf2')?.shndx, bssIndex);
});

test('.align 0 in data section is a no-op (no padding)', async () => {
  const elf = await collectElf(`
    .data
    .byte 1
    .align 0
    .byte 2
  `);
  // After byte(1), .align 0 adds no padding, so byte(2) immediately follows.
  assert.deepEqual(
    sectionBytes(elf, '.data'),
    Uint8Array.from([1, 2]),
    '.align 0 should produce no padding'
  );
  // Also verify no padding when used with .zero/.space in .data
  const elf2 = await collectElf(`
    .data
    .zero 3
    .align 0
    .byte 2
  `);
  assert.deepEqual(
    sectionBytes(elf2, '.data'),
    Uint8Array.from([0, 0, 0, 2]),
    '.align 0 after .zero produces no extra padding'
  );
});

test('sh_addralign tracks max requested alignment across directives per section', async () => {
  const elf = await collectElf(`
    .text
    nop
    .data
    .align 2
    .word 0
    .balign 16
    .byte 1
    .rodata
    .align 4
    .byte 0
    .bss
    .align 3
    .zero 1
  `);
  // .data: max alignment from .align 2 → 4, .balign 16 → 16
  const dataIndex = elf.sectionNames.indexOf('.data');
  assert.strictEqual(elf.sectionAddraligns[dataIndex], 16, '.data addralign = max(4, 16)');
  // .rodata: .align 4 → 16
  const rodataIndex = elf.sectionNames.indexOf('.rodata');
  assert.strictEqual(elf.sectionAddraligns[rodataIndex], 16, '.rodata addralign = 16');
  // .bss: .align 3 → 8
  const bssIndex = elf.sectionNames.indexOf('.bss');
  assert.strictEqual(elf.sectionAddraligns[bssIndex], 8, '.bss addralign = 8');
  // .text: default 4 (no alignment directives, no compressed instructions)
  const textIndex = elf.sectionNames.indexOf('.text');
  assert.strictEqual(elf.sectionAddraligns[textIndex], 4, '.text addralign = 4');
});

test('sh_addralign tracks max alignment and does not decrease for smaller requests', async () => {
  // Default addralign for .data is 8. A .balign 1 (1-byte alignment) should
  // not reduce the alignment below the default (alignment tracks the max).
  const elf = await collectElf(`
    .data
    .balign 1
    .byte 0
  `);
  const dataIndex = elf.sectionNames.indexOf('.data');
  // Addralign is still 8 (the default), because .balign 1 requests alignment
  // of 1 which is smaller than the existing 8.
  assert.strictEqual(elf.sectionAddraligns[dataIndex], 8);
});

test('.align 2 in text forces actual NOP padding when misaligned', async () => {
  // After unaligned instruction, .align 2 should pad to 4-byte boundary.
  // c.nop is used for 2-byte fill; nop for 4-byte fill.
  // After one 2-byte c.nop at offset 0 from a c.nop, .align 2 aligns to 4:
  // padding = 2 bytes c.nop.
  const elf = await collectElf(`
    c.mv x1, 0
    .align 2
    nop
  `);
  // c.mv x1, 0 is 2 bytes at offset 0. .align 2 -> 4-byte boundary at offset 4, padding 2 bytes.
  // Total: c.mv(2) + c.nop(2) + nop(4) = 8 bytes
  assert.strictEqual(elf.textBytes.length, 8);
  // The 2-byte padding should be c.nop (0x0001 little-endian)
  assert.strictEqual(elf.textBytes[2], 0x01, 'c.nop first byte');
  assert.strictEqual(elf.textBytes[3], 0x00, 'c.nop second byte');
  assert.strictEqual(elf.eFlags & 0x1, 0x1, 'RVC set when c.nop is emitted');
});

test('.balign 3 in data section forces actual zero padding', async () => {
  // After a .byte 1 at offset 1, .balign 3 → padding to 3: 2 zero bytes.
  const elf = await collectElf(`
    .data
    .byte 1
    .balign 3
    .byte 2
  `);
  assert.deepEqual(
    sectionBytes(elf, '.data'),
    Uint8Array.from([1, 0, 0, 2]),
    '.balign 3 after offset 1 adds 2 zero bytes'
  );
});

test('.bss offset is padded when rodata ends at a non-aligned offset', async () => {
  // .rodata ends at offset 0x51 (aligned 0x50 + 1 byte). .bss has addralign 8,
  // so its section-header offset must be padded to the next 8-byte boundary (0x58).
  // Since .bss is NOBITS this padding does NOT advance the file offset for .symtab.
  const elf = await collectElf(`
    .text
    nop
    .data
    .word 7
    .rodata
    .byte 1
    .bss
    buf: .zero 16
  `);
  const bssIndex = elf.sectionNames.indexOf('.bss');
  const rodataIndex = elf.sectionNames.indexOf('.rodata');
  const symtabIndex = elf.sectionNames.indexOf('.symtab');

  // .rodata ends at 0x51 (offset 0x50 + 1 byte).
  const rodataEnd = elf.sectionOffsets[rodataIndex]! + elf.sectionSizes[rodataIndex]!;
  // .bss offset must be padded to the next 8-byte boundary.
  const expectedBssOffset = ((rodataEnd + 7) / 8) * 8;
  assert.strictEqual(expectedBssOffset, 0x58, 'expected alignment to 0x58');
  assert.strictEqual(
    elf.sectionOffsets[bssIndex],
    expectedBssOffset,
    '.bss offset padded to next 8-byte boundary'
  );

  // .symtab start offset must be >= rodataEnd (NOBITS padding doesn't advance file offset).
  assert.ok(elf.sectionOffsets[symtabIndex]! >= rodataEnd, 'symtab not advanced by NOBITS padding');

  // No file payload for .bss (still size 16 in section header but no file bytes).
  const eShoff = readU64(elf.bytes, 40);
  const eShentsize = readU16(elf.bytes, 58);
  assert.strictEqual(elf.sectionSizes[bssIndex], 16, '.bss size is 16');
  // Verify file size equals e_shoff + section header table (no bss payload).
  assert.strictEqual(elf.bytes.length, eShoff + elf.eShnum * eShentsize);
  // Sanity: no .rela.* sections (no relocations in this source).
  assert.strictEqual(elf.relocationSections.size, 0);
});
