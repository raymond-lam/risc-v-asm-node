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
import { INSTRUCTION_MAP } from '#instructions';
import { assembleFlat as assembleFlatStream } from '#assemble/flat';
import { buildSymbolTable } from '#symbol-table';
import { collectBytes, sourceLines } from '#testing/stream';

type SourceFile = Readonly<{ name: string; text: string }>;
type AssemblyOptions = Readonly<{
  baseAddress?: number;
  predefinedSymbols?: ReadonlyMap<string, number>;
}>;

const assembleFlat = async (
  sources: readonly SourceFile[],
  options: AssemblyOptions = {}
): Promise<Uint8Array> => {
  // Replay source lines for the symbol and encoding passes.
  const lines = sources.flatMap(({ text }) => text.split(/\r?\n/));
  const labelSymbols = await buildSymbolTable(sourceLines(lines), options.baseAddress);
  const predefinedSymbols = options.predefinedSymbols ?? new Map<string, number>();
  const symbols = new Map([...predefinedSymbols, ...labelSymbols]);
  return collectBytes(assembleFlatStream(sourceLines(lines), symbols, options.baseAddress ?? 0));
};

test('assembleFlat load with offset(base)', async () => {
  const sources = [{ name: 'test.s', text: 'ld x1, 8(x2)' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
  const ld = INSTRUCTION_MAP.get('ld')!;
  assert.deepEqual(result, ld.encode(1, 2, 8));
});

test('assembleFlat load with omitted offset', async () => {
  const sources = [{ name: 'test.s', text: 'ld x1, (x2)' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
  const ld = INSTRUCTION_MAP.get('ld')!;
  assert.deepEqual(result, ld.encode(1, 2, 0));
});

test('assembleFlat store with offset(base)', async () => {
  const sources = [{ name: 'test.s', text: 'sd x1, 8(x2)' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
  // sd uses split immediate: offset >> 5 and offset & 0x1f
  const sd = INSTRUCTION_MAP.get('sd')!;
  assert.deepEqual(result, sd.encode(0, 2, 1, 8));
});

test('assembleFlat branch with numeric offset 4', async () => {
  const sources = [{ name: 'test.s', text: 'beq x1, x2, 4' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
  // beq offset=4: bimm12hi=0, bimm12lo=4, word=0x00208263
  assert.deepEqual([...result], [0x63, 0x82, 0x20, 0x00]);
});

test('assembleFlat branch with numeric offset 8', async () => {
  const sources = [{ name: 'test.s', text: 'beq x1, x2, 8' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
  // beq offset=8: bimm12hi=0, bimm12lo=8, word=0x00208463
  assert.deepEqual([...result], [0x63, 0x84, 0x20, 0x00]);
});

test('assembleFlat branch with symbol offset', async () => {
  const sources = [{ name: 'test.s', text: 'label: addi x1, x0, 1\nbeq x1, x0, label' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 8);
});

test('assembleFlat branch with backward negative offset', async () => {
  // target is 8 bytes before the branch: beq at address 8, target at 0
  const sources = [{ name: 'test.s', text: 'target: nop\nnop\nbeq x1, x2, target' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 12);
  // branch offset = 0 - 8 = -8
  // -8 as 13-bit signed: imm = 0x1ff8 (sign-extended)
  // bimm12hi = ((-8>>5)&0x3f) | (((-8>>12)&1)<<6)
  //          = (0x1ff8>>5)&0x3f | ((0x1ff8>>12)&1)<<6
  // -8 = 0xfffffff8 → & 0x1fff = 0x1ff8
  // (0x1ff8>>5) & 0x3f = (0xff & 0x3f) = 0x3f
  // ((0x1ff8>>12)&1)<<6 = (1 & 1)<<6 = 0x40
  // bimm12hi = 0x3f | 0x40 = 0x7f
  // bimm12lo = (((-8>>1)&0xf)<<1) | ((-8>>11)&1)
  // (-8>>1) & 0xf = 0xffc & 0xf = 0xc
  // (0xc<<1) = 0x18
  // (-8>>11) & 1 = 0x1fffff & 1 = 1
  // bimm12lo = 0x18 | 1 = 0x19
  // word = (0x7f<<25) | (2<<20) | (1<<15) | (0<<12) | (0x19<<7) | 0x63
  //       = 0xfe000000 | 0x200000 | 0x8000 | 0x0000 | 0x0c80 | 0x63
  //       = 0xfe20_8c63  (but need to compute properly)
  // Let me check with the actual encoder:
  const beq = INSTRUCTION_MAP.get('beq')!;
  const expected = [...beq.encode(0x7f, 1, 2, 0x19)];
  assert.deepEqual([...result.subarray(8, 12)], expected);
});

test('assembleFlat jal with default ra', async () => {
  const sources = [{ name: 'test.s', text: 'jal 8' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
  // jal x1, 8: jimm20=0x800, word=0x008000ef
  assert.deepEqual([...result], [0xef, 0x00, 0x80, 0x00]);
});

test('assembleFlat jal with explicit rd', async () => {
  const sources = [{ name: 'test.s', text: 'jal x5, 8' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
  // jal x5, 8: rd=5, jimm20=0x800, word=0x008002ef
  assert.deepEqual([...result], [0xef, 0x02, 0x80, 0x00]);
});

test('assembleFlat j instruction', async () => {
  const sources = [{ name: 'test.s', text: 'j 8' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
  // j 8: rd=0, jimm20=0x800, word=0x0080006f
  assert.deepEqual([...result], [0x6f, 0x00, 0x80, 0x00]);
});

test('assembleFlat li numeric only (small: 4 bytes)', async () => {
  const sources = [{ name: 'test.s', text: 'li x1, 42' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
});

test('assembleFlat li numeric only (large: 44 bytes)', async () => {
  const sources = [{ name: 'test.s', text: 'li x1, 2048' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 44);
});

test('assembleFlat M instructions under rv64im', async () => {
  const sources = [{ name: 'test.s', text: 'mul x1, x2, x3' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
});

test('assembleFlat assembles labels across two files', async () => {
  const sources = [
    { name: 'a.s', text: 'start: addi x1, x0, 1' },
    { name: 'b.s', text: 'next: addi x2, x1, 2' },
  ];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 8);
});

test('assembleFlat predefined symbols', async () => {
  const sources = [{ name: 'test.s', text: 'addi x1, x0, my_val' }];
  const result = await assembleFlat(sources, {
    predefinedSymbols: new Map([['my_val', 42]]),
  });
  const addi = INSTRUCTION_MAP.get('addi')!;
  assert.deepEqual(result, addi.encode(1, 0, 42));
});

test('assembleFlat layout integrity: dynamic li before branch target', async () => {
  // li with large immediate (44 bytes) followed by a branch targeting it
  const sources = [{ name: 'test.s', text: 'target: li x1, 0xdeadbeef\nbeq x0, x0, target' }];
  const result = await assembleFlat(sources);
  // li = 44 bytes, beq = 4 bytes, branch offset goes backwards from end of beq to target
  assert.strictEqual(result.length, 48);
});

test('assembleFlat --defsym resolves branch target', async () => {
  const sources = [{ name: 'test.s', text: 'beq x1, x0, my_target' }];
  const result = await assembleFlat(sources, {
    predefinedSymbols: new Map([['my_target', 8]]),
  });
  assert.strictEqual(result.length, 4);
});

test('assembleFlat basic R-type instructions', async () => {
  const sources = [{ name: 'test.s', text: 'add x1, x2, x3\nsub x4, x5, x6' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 8);
  const add = INSTRUCTION_MAP.get('add')!;
  assert.deepEqual(result.subarray(0, 4), add.encode(1, 2, 3));
});

test('assembleFlat I-type with immediate', async () => {
  const sources = [{ name: 'test.s', text: 'addi x1, x0, 42' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 4);
  const addi = INSTRUCTION_MAP.get('addi')!;
  assert.deepEqual(result, addi.encode(1, 0, 42));
});

test('assembleFlat shift instructions', async () => {
  const sources = [{ name: 'test.s', text: 'slli x1, x2, 3\nsrli x3, x4, 5\nsrai x5, x6, 7' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 12);
});

test('assembleFlat shift-W instructions encode 15 and 31', async () => {
  const result = await assembleFlat([{ name: 'test.s', text: 'slliw x1, x2, 15' }]);
  assert.strictEqual(result.length, 4);
  const result2 = await assembleFlat([{ name: 'test.s', text: 'slliw x1, x2, 31' }]);
  assert.strictEqual(result2.length, 4);
});

test('assembleFlat lui/auipc', async () => {
  const sources = [{ name: 'test.s', text: 'lui x1, 0x12345\nauipc x2, 0x67890' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 8);
});

test('assembleFlat pseudo-instructions: nop, mv, not, neg, negw, sext.w', async () => {
  const sources = [
    { name: 'test.s', text: 'nop\nmv x1, x2\nnot x3, x4\nneg x5, x6\nnegw x7, x8\nsext.w x9, x10' },
  ];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 24);
});

test('assembleFlat pseudo-instructions: seqz, snez, sltz, sgtz', async () => {
  const sources = [{ name: 'test.s', text: 'seqz x1, x2\nsnez x3, x4\nsltz x5, x6\nsgtz x7, x8' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 16);
});

test('assembleFlat pseudo three-register: sgt, sgtu', async () => {
  const sources = [{ name: 'test.s', text: 'sgt x1, x2, x3\nsgtu x4, x5, x6' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 8);
});

test('assembleFlat branch pseudos: beqz, bnez, blez, bgez, bltz, bgtz', async () => {
  const sources = [
    {
      name: 'test.s',
      text: 'beqz x1, 8\nbnez x2, 16\nblez x3, 24\nbgez x4, 32\nbltz x5, 40\nbgtz x6, 48',
    },
  ];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 24);
});

test('assembleFlat branch pseudos two-register: bgt, ble, bgtu, bleu', async () => {
  const sources = [
    { name: 'test.s', text: 'bgt x1, x2, 8\nble x3, x4, 16\nbgtu x5, x6, 24\nbleu x7, x8, 32' },
  ];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 16);
});

test('assembleFlat M-extension instructions all accepted under rv64im', async () => {
  const mInstrs = ['mul x1, x2, x3', 'mulh x4, x5, x6', 'div x7, x8, x9', 'divu x10, x11, x12'];
  const sources = [{ name: 'test.s', text: mInstrs.join('\n') }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 16);
});

test('assembleFlat accepts baseAddress as its third positional argument', async () => {
  const bytes = await collectBytes(
    assembleFlatStream(sourceLines(['beq x0, x0, target']), new Map([['target', 0x1008]]), 0x1000)
  );
  assert.deepEqual(bytes, Uint8Array.from([0x63, 0x04, 0x00, 0x00]));
});

test('assembleFlat store instructions (sb, sh, sw, sd)', async () => {
  const sources = [
    { name: 'test.s', text: 'sb x1, 8(x2)\nsh x3, 16(x4)\nsw x5, 24(x6)\nsd x7, 32(x8)' },
  ];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 16);
});

test('assembleFlat byte loads (lb, lh, lw, ld, lbu, lhu, lwu)', async () => {
  const sources = [
    {
      name: 'test.s',
      text: 'lb x1, 8(x2)\nlh x3, 16(x4)\nlw x5, 24(x6)\nld x7, 32(x8)\nlbu x9, -8(x10)\nlhu x11, -16(x12)\nlwu x13, 0(x14)',
    },
  ];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 28);
});

test('assembleFlat register ABI names', async () => {
  const sources = [{ name: 'test.s', text: 'addi a0, zero, 42\naddi sp, a1, 10\nmv t0, gp' }];
  const result = await assembleFlat(sources);
  assert.strictEqual(result.length, 12);
});
