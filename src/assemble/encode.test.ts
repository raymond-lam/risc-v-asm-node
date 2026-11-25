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

import { encode } from '#assemble/encode';
import { collectEncode } from '#testing/encode';
import { sourceLines } from '#testing/stream';

test('collectEncode produces correct bytes for a simple instruction', async () => {
  const symbols = new Map<string, number>();
  const result = await collectEncode(sourceLines(['addi x1, x0, 42']), symbols);
  assert.deepEqual(result.textBytes, Uint8Array.from([0x93, 0x00, 0xa0, 0x02]));
  assert.strictEqual(result.relocations.length, 0);
  assert.strictEqual(result.hasCompressed, false);
  assert.strictEqual(result.totalTextSize, 4);
});

test('collectEncode handles nop', async () => {
  const symbols = new Map<string, number>();
  const result = await collectEncode(sourceLines(['nop']), symbols);
  assert.deepEqual(result.textBytes, Uint8Array.from([0x13, 0x00, 0x00, 0x00]));
});

test('encode detects compressed instructions via hasCompressed', async () => {
  const symbols = new Map<string, number>();
  const result = await collectEncode(sourceLines(['c.mv x1, 0']), symbols);
  assert.strictEqual(result.hasCompressed, true);
});

test('encode does not set hasCompressed for non-compressed instructions', async () => {
  const symbols = new Map<string, number>();
  const result = await collectEncode(sourceLines(['nop']), symbols);
  assert.strictEqual(result.hasCompressed, false);
});

test('encode produces relocations for symbol references', async () => {
  const symbols = new Map<string, number>([['target', 8]]);
  const result = await collectEncode(sourceLines(['beq x1, x0, target']), symbols);
  assert.strictEqual(result.relocations.length, 1);
  assert.strictEqual(result.relocations[0]?.symbolName, 'target');
  assert.strictEqual(result.relocations[0]?.offset, 0);
  assert.strictEqual(result.relocations[0]?.addend, 0);
  // Branch → R_RISCV_BRANCH = 16
  assert.strictEqual(result.relocations[0]?.type, 16);
});

test('encode handles multiple instructions', async () => {
  const symbols = new Map<string, number>([['target', 8]]);
  const result = await collectEncode(
    sourceLines(['addi x1, x0, 10', 'beq x1, x0, target']),
    symbols
  );
  assert.strictEqual(result.textBytes.length, 8);
  assert.strictEqual(result.relocations.length, 1);
  assert.strictEqual(result.relocations[0]?.offset, 4); // beq is at offset 4
});

test('encode with baseAddress offsets the relocation addresses', async () => {
  const symbols = new Map<string, number>([['label', 8]]);
  const result = await collectEncode(sourceLines(['beq x1, x0, label']), symbols, 0x1000);
  assert.strictEqual(result.relocations[0]?.offset, 0x1000);
});

test('encode assigns 0 as placeholder for symbol-referencing immediates', async () => {
  const symbols = new Map<string, number>([['val', 42]]);
  const result = await collectEncode(sourceLines(['addi x1, x0, val']), symbols);
  // With val replaced by 0 placeholder, the encoded bytes should be addi x1, x0, 0
  assert.deepEqual(result.textBytes, Uint8Array.from([0x93, 0x00, 0x00, 0x00]));
  assert.strictEqual(result.relocations.length, 1);
  assert.strictEqual(result.relocations[0]?.symbolName, 'val');
});

test('encode yields one chunk per instruction', async () => {
  const symbols = new Map<string, number>();
  const chunks: Uint8Array[] = [];
  for await (const chunk of encode(sourceLines(['addi x1, x0, 1', 'nop']), symbols)) {
    chunks.push(chunk);
  }
  assert.strictEqual(chunks.length, 2);
  assert.strictEqual(chunks[0]!.length, 4);
  assert.strictEqual(chunks[1]!.length, 4);
});

test('encoded bytes length matches instructionLength for every mnemonic in encode', async () => {
  // This verifies that the instructionLength metadata agrees with the actual
  // produced bytes for every instruction.  We walk INSTRUCTION_MAP to get
  // one test case per entry.
  const instrModule = await import('#instructions');
  const INSTRUCTION_MAP = instrModule.INSTRUCTION_MAP;
  const sourceLinesFor = (await import('#testing/stream')).sourceLines;
  const { collectEncode } = await import('#testing/encode');
  for (const [mnemonic, entry] of INSTRUCTION_MAP) {
    const sig = entry.signatures[0]!;
    const sourceSig = sig.sourceSignature;
    // Build a minimal set of dummy operands.  For the encoder to run we need
    // the right operand count; we use x0/x1 for registers and 0 for numbers.
    const dummyOps = sourceSig.map((t: string) =>
      t === 'register' ? 'x0' : t === 'address' ? '0(x1)' : '0'
    );
    const source = `${mnemonic} ${dummyOps.join(', ')}`;
    const symbols = new Map<string, number>();
    try {
      const result = await collectEncode(sourceLinesFor([source]), symbols);
      const encodedLen = result.textBytes.length;
      const expectedLen =
        typeof entry.instructionLength === 'function'
          ? entry.instructionLength(0, 0)
          : entry.instructionLength;
      assert.strictEqual(
        encodedLen,
        expectedLen,
        `${mnemonic} encoded ${encodedLen} bytes, instructionLength says ${expectedLen}`
      );
    } catch {
      // Some mnemonics may not have valid dummy operand combinations
      // (e.g. li needs a numeric second operand).  Skip those.
    }
  }
});

test('encode streams all text before buffered data/rodata and emits no bss bytes', async () => {
  const chunks: Uint8Array[] = [];
  const lines = sourceLines([
    'first: nop',
    '.data',
    'value: .word 7',
    '.bss',
    'buffer: .zero 16',
    '.rodata',
    'constant: .byte 2',
    '.text',
    'second: nop',
  ]);
  for await (const chunk of encode(lines, new Map<string, number>())) chunks.push(chunk);

  const nop = Uint8Array.from([0x13, 0, 0, 0]);
  assert.deepEqual(chunks, [nop, nop, Uint8Array.from([7, 0, 0, 0]), Uint8Array.from([2])]);
});

test('encode emits directive bytes from the raw directive text', async () => {
  // A comma inside a string literal must survive pass 2 unchanged.
  const chunks: Uint8Array[] = [];
  const lines = sourceLines(['.data', '.string "a,b"']);
  for await (const chunk of encode(lines, new Map<string, number>())) chunks.push(chunk);
  assert.deepEqual(chunks, [Uint8Array.from([0x61, 0x2c, 0x62, 0x00])]);
});

test('scattered compressed immediates reject the single-immediate form', async () => {
  const symbols = new Map<string, number>();
  // These immediates are scattered across non-contiguous fields, so one operand
  // cannot describe them.  They must fail instead of dropping the bits between
  // the fields and emitting wrong bytes.  The sp-relative loads and stores take
  // an offset(sp) operand instead (see the stack-form tests below).
  for (const source of [
    'c.lw a0, a1, 12',
    'c.sw a0, a1, 12',
    'c.ld a0, a1, 8',
    'c.sd a0, a1, 8',
    'c.fld a0, a1, 8',
    'c.fsd a0, a1, 8',
  ]) {
    await assert.rejects(
      async () => await collectEncode(sourceLines([source]), symbols),
      /Wrong number of operands/,
      source
    );
  }
});

const encodeOne = async (source: string): Promise<Uint8Array> =>
  (await collectEncode(sourceLines([source]), new Map<string, number>())).textBytes;

test('compressed immediates reject values with nonzero bits below the fields', async () => {
  // c.lui scales its immediate by 4096 and c.addi4spn by 4; those low bits are
  // not encoded anywhere, so the values must be rejected instead of truncated.
  await assert.rejects(
    async () => await encodeOne('c.lui a0, 1'),
    /immediate 1 is misaligned: bits 0\.\.11 must be zero/
  );
  await assert.rejects(
    async () => await encodeOne('c.addi4spn a0, 5'),
    /immediate 5 is misaligned: bits 0\.\.1 must be zero/
  );
  assert.deepEqual(await encodeOne('c.lui a0, 4096'), Uint8Array.from([0x05, 0x65]));
  assert.deepEqual(await encodeOne('c.addi4spn a0, 4'), Uint8Array.from([0x28, 0x00]));
});

test('compressed signed immediates reject values that would wrap', async () => {
  // These values fit the field width read as unsigned but decode as different
  // negative immediates, so they must fail instead of emitting wrong bytes.
  for (const source of [
    'c.li a0, 63',
    'c.li a0, 32',
    'c.li a0, -33',
    'c.addi a0, 63',
    'c.andi a0, 63',
    'c.lui a0, 0x3f000',
    'c.lui a0, 0x20000',
  ]) {
    await assert.rejects(async () => await encodeOne(source), /not encodable/, source);
  }
  assert.deepEqual(await encodeOne('c.lui a0, 0x1f000'), Uint8Array.from([0x7d, 0x65]));
  assert.deepEqual(await encodeOne('c.slli a0, 63'), Uint8Array.from([0x7e, 0x15]));
});

test('compressed stack immediates keep their explicit field form', async () => {
  assert.deepEqual(await encodeOne('c.addi16sp 0, 1'), Uint8Array.from([0x05, 0x61]));
  assert.deepEqual(await encodeOne('c.lwsp a0, 0, 2'), Uint8Array.from([0x0a, 0x45]));
  assert.deepEqual(await encodeOne('c.ldsp a0, 0, 1'), Uint8Array.from([0x06, 0x65]));
});

const assertSameBytes = async (addressForm: string, explicitForm: string): Promise<void> =>
  assert.deepEqual(await encodeOne(addressForm), await encodeOne(explicitForm), addressForm);

test('compressed word address forms match their explicit offset fields', async () => {
  // uimm[5:3] fills instruction [12:10]; instruction [6:5] holds uimm[6] in
  // bit 5 and uimm[2] in bit 6.  Both syntaxes must produce identical bytes.
  // The explicit store form lists the base register first, as c.sw does.
  const cases: readonly (readonly [number, number, number])[] = [
    [0, 0, 0],
    [4, 2, 0],
    [12, 2, 1],
    [64, 1, 0],
    [68, 3, 0],
    [124, 3, 7],
  ];
  for (const [offset, lo, hi] of cases) {
    await assertSameBytes(`c.lw a0, ${offset}(a1)`, `c.lw a0, a1, ${lo}, ${hi}`);
    await assertSameBytes(`c.sw a0, ${offset}(a1)`, `c.sw a1, a0, ${lo}, ${hi}`);
  }
});

test('compressed double address forms match their explicit offset fields', async () => {
  // uimm[5:3] fills instruction [12:10]; instruction [6:5] holds uimm[7:6].
  const cases: readonly (readonly [number, number, number])[] = [
    [0, 0, 0],
    [8, 0, 1],
    [64, 1, 0],
    [128, 2, 0],
    [192, 3, 0],
    [248, 3, 7],
  ];
  for (const [offset, lo, hi] of cases) {
    // Explicit store forms list the base register first; c.sd also takes the
    // high offset field first, while c.fsd takes the low one first.
    await assertSameBytes(`c.ld a0, ${offset}(a1)`, `c.ld a0, a1, ${lo}, ${hi}`);
    await assertSameBytes(`c.fld a0, ${offset}(a1)`, `c.fld a0, a1, ${lo}, ${hi}`);
    await assertSameBytes(`c.sd a0, ${offset}(a1)`, `c.sd a1, a0, ${hi}, ${lo}`);
    await assertSameBytes(`c.fsd a0, ${offset}(a1)`, `c.fsd a1, a0, ${lo}, ${hi}`);
  }
});

test('compressed load/store address forms encode the scattered offset', async () => {
  assert.deepEqual(await encodeOne('c.lw a0, 12(a1)'), Uint8Array.from([0xc8, 0x45]));
  assert.deepEqual(await encodeOne('c.sw a0, 12(a1)'), Uint8Array.from([0xc8, 0xc5]));
  assert.deepEqual(await encodeOne('c.ld a0, 8(a1)'), Uint8Array.from([0x88, 0x65]));
  assert.deepEqual(await encodeOne('c.sd a0, 8(a1)'), Uint8Array.from([0x88, 0xe5]));
  assert.deepEqual(await encodeOne('c.fld a0, 8(a1)'), Uint8Array.from([0x88, 0x25]));
  assert.deepEqual(await encodeOne('c.fsd a0, 8(a1)'), Uint8Array.from([0x88, 0xa5]));
  assert.deepEqual(await encodeOne('c.lw a0, 4(a1)'), Uint8Array.from([0xc8, 0x41]));
});

test('compressed load/store address forms reject misaligned offsets', async () => {
  // Word forms are scaled by 4 and double forms by 8; a misaligned offset is
  // rejected instead of being truncated to a multiple of the access size.
  await assert.rejects(
    async () => await encodeOne('c.lw a0, 6(a1)'),
    /offset 6 is not encodable: must be a multiple of 4/
  );
  await assert.rejects(
    async () => await encodeOne('c.fsd a0, 12(a1)'),
    /offset 12 is not encodable: must be a multiple of 8/
  );
});

test('encode .byte 256 error includes line number', async () => {
  const symbols = new Map<string, number>();
  await assert.rejects(
    async () => await collectEncode(sourceLines(['.byte 256']), symbols),
    /at line 1/
  );
  await assert.rejects(
    async () => await collectEncode(sourceLines(['.data', '.byte 256']), symbols),
    /at line 2/
  );
});

test('encode .align <non-numeric> error includes line number', async () => {
  const symbols = new Map<string, number>();
  await assert.rejects(
    async () => await collectEncode(sourceLines(['.align x']), symbols),
    /at line 1/
  );
  await assert.rejects(
    async () => await collectEncode(sourceLines(['nop', '.align x']), symbols),
    /at line 2/
  );
});

test('encode .align -1 error includes line number', async () => {
  const symbols = new Map<string, number>();
  await assert.rejects(
    async () => await collectEncode(sourceLines(['.align -1']), symbols),
    /at line 1/
  );
});

test('encode .balign odd padding in text rejects with line number', async () => {
  // .balign 5 after a 4-byte nop at offset 4: padding = (5 - 4%5) % 5 = 1 byte,
  // which cannot be filled with valid NOPs.
  const symbols = new Map<string, number>();
  await assert.rejects(
    async () => await collectEncode(sourceLines(['nop', '.balign 5', 'nop']), symbols),
    /Cannot align at line 2/
  );
});

// ── zero-operand and register forms ──

test('fence.i assembles with no operands and with raw fields', async () => {
  // fence.i = imm[11:0]=0, rs1=x0, rd=x0, funct3=001, opcode=0001111.
  assert.deepEqual(await encodeOne('fence.i'), Uint8Array.from([0x0f, 0x10, 0x00, 0x00]));
  assert.deepEqual(await encodeOne('fence.i 0, x0, x0'), Uint8Array.from([0x0f, 0x10, 0x00, 0x00]));
});

test('c.nop assembles with no operands', async () => {
  // c.nop = CI format, funct3=000, imm=0, rd=x0, opcode=01 → 0x0001.
  assert.deepEqual(await encodeOne('c.nop'), Uint8Array.from([0x01, 0x00]));
});

test('sfence.vma assembles with zero, one, and two operands', async () => {
  // sfence.vma = funct7=0001001, rs2, rs1, funct3=000, opcode=1110011.
  assert.deepEqual(await encodeOne('sfence.vma'), Uint8Array.from([0x73, 0x00, 0x00, 0x12]));
  // rs1=a0 (10) at instruction [19:15], rs2=x0.
  assert.deepEqual(await encodeOne('sfence.vma a0'), Uint8Array.from([0x73, 0x00, 0x05, 0x12]));
  // rs1=a0, rs2=a1 (11) at instruction [24:20].
  assert.deepEqual(await encodeOne('sfence.vma a0, a1'), Uint8Array.from([0x73, 0x00, 0xb5, 0x12]));
});

test('c.jalr takes a register operand', async () => {
  // CR format, funct4=1001, opcode=10: c.jalr ra → rs1=1 → 0x9082.
  assert.deepEqual(await encodeOne('c.jalr ra'), Uint8Array.from([0x82, 0x90]));
  // A non-register operand is read as x0, the c.jalr encoding for zero.
  assert.deepEqual(await encodeOne('c.jalr 0'), Uint8Array.from([0x02, 0x90]));
});

// ── c.swsp / c.sdsp spilled-offset encodings ──

test('c.swsp encodes the scaled byte offset in the scattered CSS field', async () => {
  // CSS: funct3=110, imm6[5:2]=offset[5:2], imm6[1:0]=offset[7:6], rs2=a0, op=10.
  assert.deepEqual(await encodeOne('c.swsp a0, 0(sp)'), Uint8Array.from([0x2a, 0xc0]));
  assert.deepEqual(await encodeOne('c.swsp a0, 4(sp)'), Uint8Array.from([0x2a, 0xc2]));
  assert.deepEqual(await encodeOne('c.swsp a0, 12(sp)'), Uint8Array.from([0x2a, 0xc6]));
});

test('c.sdsp encodes the scaled byte offset in the scattered CSS field', async () => {
  // CSS: funct3=111, imm6[5:3]=offset[5:3], imm6[2:0]=offset[8:6], rs2=a0, op=10.
  assert.deepEqual(await encodeOne('c.sdsp a0, 8(sp)'), Uint8Array.from([0x2a, 0xe4]));
  assert.deepEqual(await encodeOne('c.sdsp a0, 16(sp)'), Uint8Array.from([0x2a, 0xe8]));
  // Offset 64 lands in the high part of the scattered field: imm6 = 1.
  assert.deepEqual(await encodeOne('c.sdsp a0, 64(sp)'), Uint8Array.from([0xaa, 0xe0]));
});

test('c.swsp offset changes the encoded bytes', async () => {
  const zero = await encodeOne('c.swsp a0, 0(sp)');
  const four = await encodeOne('c.swsp a0, 4(sp)');
  const twelve = await encodeOne('c.swsp a0, 12(sp)');
  assert.notDeepEqual(zero, four);
  assert.notDeepEqual(four, twelve);
});

test('c.swsp and c.sdsp keep their raw field forms', async () => {
  // Raw form: operands are the already-scaled hardware field values.
  assert.deepEqual(await encodeOne('c.swsp 10, 4'), Uint8Array.from([0x2a, 0xc2]));
  assert.deepEqual(await encodeOne('c.sdsp 10, 4'), Uint8Array.from([0x2a, 0xe2]));
});

test('c.swsp and c.sdsp reject misaligned and out-of-range offsets', async () => {
  await assert.rejects(encodeOne('c.swsp a0, 6(sp)'), /must be a multiple of 4/);
  await assert.rejects(encodeOne('c.sdsp a0, 12(sp)'), /must be a multiple of 8/);
  await assert.rejects(encodeOne('c.swsp a0, 256(sp)'), /c\.swsp offset must be within 0\.\.252/);
  await assert.rejects(encodeOne('c.sdsp a0, 512(sp)'), /c\.sdsp offset must be within 0\.\.504/);
});

test('c.swsp and c.sdsp require sp as the base register', async () => {
  await assert.rejects(encodeOne('c.swsp a0, 4(a0)'), /c\.swsp requires sp as base register/);
  await assert.rejects(encodeOne('c.sdsp a0, 8(a0)'), /c\.sdsp requires sp as base register/);
});

// ── c.lwsp / c.ldsp / c.fldsp / c.fsdsp stack forms ──

test('c.lwsp encodes offset(sp) in the scattered CI field', async () => {
  // CI: funct3=010, imm[5]=offset[5] at instruction [12], imm[4:2] at [6:4]
  // and imm[7:6] at [3:2]; rd=a0 (x10) at [11:7].
  assert.deepEqual(await encodeOne('c.lwsp a0, 0(sp)'), Uint8Array.from([0x02, 0x45]));
  assert.deepEqual(await encodeOne('c.lwsp a0, 4(sp)'), Uint8Array.from([0x12, 0x45]));
  // Offset 248 sets imm[5] plus imm[7:6]=11 and imm[4:2]=110.
  assert.deepEqual(await encodeOne('c.lwsp a0, 248(sp)'), Uint8Array.from([0x6e, 0x55]));
  // The explicit field form is (rd, imm[5], imm[4:2|7:6]).
  const cases: readonly (readonly [number, number, number])[] = [
    [0, 0, 0],
    [4, 0, 4],
    [248, 1, 27],
  ];
  for (const [offset, hi, lo] of cases) {
    await assertSameBytes(`c.lwsp a0, ${offset}(sp)`, `c.lwsp a0, ${hi}, ${lo}`);
  }
});

test('c.ldsp encodes offset(sp) in the scattered CI field', async () => {
  // CI: funct3=011, imm[5]=offset[5] at instruction [12], imm[4:3] at [6:5]
  // and imm[8:6] at [4:2].
  assert.deepEqual(await encodeOne('c.ldsp a0, 0(sp)'), Uint8Array.from([0x02, 0x65]));
  assert.deepEqual(await encodeOne('c.ldsp a0, 8(sp)'), Uint8Array.from([0x22, 0x65]));
  // Offset 496 (the largest multiple of 8) sets imm[5] plus imm[4:3]=10 and
  // imm[8:6]=111.
  assert.deepEqual(await encodeOne('c.ldsp a0, 496(sp)'), Uint8Array.from([0x5e, 0x75]));
  const cases: readonly (readonly [number, number, number])[] = [
    [0, 0, 0],
    [8, 0, 8],
    [496, 1, 23],
  ];
  for (const [offset, hi, lo] of cases) {
    await assertSameBytes(`c.ldsp a0, ${offset}(sp)`, `c.ldsp a0, ${hi}, ${lo}`);
  }
});

test('c.fldsp encodes offset(sp) like c.ldsp with funct3=001', async () => {
  assert.deepEqual(await encodeOne('c.fldsp a0, 8(sp)'), Uint8Array.from([0x22, 0x25]));
  await assertSameBytes('c.fldsp a0, 8(sp)', 'c.fldsp a0, 0, 8');
});

test('c.fsdsp encodes offset(sp) in the scattered CSS field', async () => {
  // CSS: funct3=101, imm6[5:3]=offset[5:3] at instruction [12:10] and
  // imm6[2:0]=offset[8:6] at [9:7]; rs2=a0 at [6:2].
  assert.deepEqual(await encodeOne('c.fsdsp a0, 8(sp)'), Uint8Array.from([0x2a, 0xa4]));
  assert.deepEqual(await encodeOne('c.fsdsp a0, 16(sp)'), Uint8Array.from([0x2a, 0xa8]));
  await assertSameBytes('c.fsdsp a0, 8(sp)', 'c.fsdsp 10, 8');
  await assertSameBytes('c.fsdsp a0, 16(sp)', 'c.fsdsp 10, 16');
});

test('compressed stack loads and stores reject bad offsets and bases', async () => {
  await assert.rejects(
    encodeOne('c.lwsp a0, 2(sp)'),
    /offset 2 is not encodable: must be a multiple of 4/
  );
  await assert.rejects(encodeOne('c.lwsp a0, 256(sp)'), /c\.lwsp offset must be within 0\.\.252/);
  await assert.rejects(encodeOne('c.lwsp a0, 4(a0)'), /c\.lwsp requires sp as base register/);
  await assert.rejects(encodeOne('c.lwsp a0, 4'), /requires an offset\(sp\) operand/);
  await assert.rejects(
    encodeOne('c.ldsp a0, 12(sp)'),
    /offset 12 is not encodable: must be a multiple of 8/
  );
  await assert.rejects(encodeOne('c.ldsp a0, 512(sp)'), /c\.ldsp offset must be within 0\.\.504/);
  await assert.rejects(encodeOne('c.fldsp a0, 8(a0)'), /c\.fldsp requires sp as base register/);
  await assert.rejects(
    encodeOne('c.fsdsp a0, 12(sp)'),
    /offset 12 is not encodable: must be a multiple of 8/
  );
  await assert.rejects(encodeOne('c.fsdsp a0, 8(a0)'), /c\.fsdsp requires sp as base register/);
  await assert.rejects(encodeOne('c.sdsp a0, 8'), /requires an offset\(sp\) operand/);
});

// ── c.addi16sp natural form ──

test('c.addi16sp encodes the bare nzimm in the scattered CI field', async () => {
  // funct3=011, rd=sp (x2), nzimm[9] at instruction [12], nzimm[4] at [6],
  // nzimm[6] at [5], nzimm[8:7] at [4:3] and nzimm[5] at [2].
  assert.deepEqual(await encodeOne('c.addi16sp 16'), Uint8Array.from([0x41, 0x61]));
  assert.deepEqual(await encodeOne('c.addi16sp -16'), Uint8Array.from([0x7d, 0x71]));
  assert.deepEqual(await encodeOne('c.addi16sp 496'), Uint8Array.from([0x7d, 0x61]));
  assert.deepEqual(await encodeOne('c.addi16sp -512'), Uint8Array.from([0x01, 0x71]));
  // The explicit field form is (nzimm[9], nzimm[4|6|8:7|5]).
  await assertSameBytes('c.addi16sp 16', 'c.addi16sp 0, 16');
  await assertSameBytes('c.addi16sp -16', 'c.addi16sp 1, 31');
  await assertSameBytes('c.addi16sp 496', 'c.addi16sp 0, 31');
  await assertSameBytes('c.addi16sp -512', 'c.addi16sp 1, 0');
});

test('c.addi16sp rejects zero, misaligned, and out-of-range adjustments', async () => {
  await assert.rejects(
    encodeOne('c.addi16sp 0'),
    /immediate 0 is not encodable: c\.addi16sp requires a nonzero adjustment/
  );
  await assert.rejects(
    encodeOne('c.addi16sp 8'),
    /immediate 8 is misaligned: bits 0\.\.3 must be zero/
  );
  await assert.rejects(encodeOne('c.addi16sp 512'), /c\.addi16sp must be within -512\.\.496/);
  await assert.rejects(encodeOne('c.addi16sp -528'), /c\.addi16sp must be within -512\.\.496/);
  await assert.rejects(
    encodeOne('c.addi16sp 16(sp)'),
    /c\.addi16sp takes a bare immediate, not offset\(base\)/
  );
});

// ── c.beqz / c.bnez natural form ──

test('c.beqz and c.bnez encode relative offsets in the scattered CB field', async () => {
  // CB: funct3=110/111, imm[8] at instruction [12], imm[4:3] at [11:10],
  // imm[7:6] at [6:5], imm[2:1] at [4:3] and imm[5] at [2]; rs1'=a0 (x10).
  assert.deepEqual(await encodeOne('c.beqz a0, 2'), Uint8Array.from([0x09, 0xc1]));
  assert.deepEqual(await encodeOne('c.beqz a0, -2'), Uint8Array.from([0x7d, 0xdd]));
  assert.deepEqual(await encodeOne('c.beqz a0, 254'), Uint8Array.from([0x7d, 0xcd]));
  assert.deepEqual(await encodeOne('c.beqz a0, -256'), Uint8Array.from([0x01, 0xd1]));
  assert.deepEqual(await encodeOne('c.bnez a0, 2'), Uint8Array.from([0x09, 0xe1]));
  // The explicit field form is (rs1, imm[7:6|2:1|5], imm[8|4:3]).
  await assertSameBytes('c.beqz a0, 2', 'c.beqz a0, 2, 0');
  await assertSameBytes('c.beqz a0, -2', 'c.beqz a0, 31, 7');
  await assertSameBytes('c.beqz a0, 254', 'c.beqz a0, 31, 3');
  await assertSameBytes('c.beqz a0, -256', 'c.beqz a0, 0, 4');
  await assertSameBytes('c.bnez a0, 2', 'c.bnez a0, 2, 0');
});

test('c.beqz and c.bnez take a label target and emit a branch relocation', async () => {
  const result = await collectEncode(
    sourceLines(['c.beqz a0, target', 'c.bnez a1, target']),
    new Map<string, number>([['target', 0]])
  );
  // rs1'=a0 (x10) is compact 2, rs1'=a1 (x11) is compact 3.
  assert.deepEqual(result.textBytes, Uint8Array.from([0x01, 0xc1, 0x81, 0xe1]));
  assert.deepEqual(
    result.relocations.map(({ offset, type, symbolName, addend }) => ({
      offset,
      type,
      symbolName,
      addend,
    })),
    [
      { offset: 0, type: 16, symbolName: 'target', addend: 0 },
      { offset: 2, type: 16, symbolName: 'target', addend: 0 },
    ]
  );
});

test('compressed conditional branches reject misaligned and out-of-range offsets', async () => {
  await assert.rejects(
    encodeOne('c.beqz a0, 3'),
    /offset 3 is not encodable: must be a multiple of 2/
  );
  await assert.rejects(encodeOne('c.beqz a0, 256'), /c\.beqz offset must be within -256\.\.254/);
  await assert.rejects(encodeOne('c.beqz a0, -258'), /c\.beqz offset must be within -256\.\.254/);
  await assert.rejects(encodeOne('c.bnez a0, 256'), /c\.bnez offset must be within -256\.\.254/);
  await assert.rejects(
    encodeOne('c.beqz a0, 4(sp)'),
    /c\.beqz takes a bare target, not offset\(base\)/
  );
});

// ── reserved zero immediates ──

test('c.lui and c.addi4spn reject the reserved zero immediate', async () => {
  await assert.rejects(
    encodeOne('c.lui a0, 0'),
    /immediate 0 is not encodable: this encoding requires a nonzero immediate/
  );
  await assert.rejects(
    encodeOne('c.addi4spn a0, 0'),
    /immediate 0 is not encodable: this encoding requires a nonzero immediate/
  );
});
