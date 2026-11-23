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
import { buildSymbolTable } from '#symbol-table';
import { sourceLines } from '#testing/stream';

test('symbols use exact cumulative byte addresses across mixed lengths', async () => {
  const symbols = await buildSymbolTable(
    sourceLines([
      'start: addi x1, x0, 4',
      'compressed: c.addi x1, 1',
      'address: la x2, %pcrel_hi(data)',
      'large: li x3, 0x123456789abcdef',
      'end: add x4, x5, x6',
    ])
  );

  assert.equal(symbols.get('start'), 0);
  assert.equal(symbols.get('compressed'), 4);
  assert.equal(symbols.get('address'), 6);
  assert.equal(symbols.get('large'), 14);
  assert.equal(symbols.get('end'), 58);
  assert.equal(symbols.size, 5);
});

test('label-only lines and multiple labels share the current address', async () => {
  const symbols = await buildSymbolTable(
    sourceLines(['outer: inner: addi x1, x0, 4', 'next:', 'third: nop', 'last:'])
  );

  assert.equal(symbols.get('outer'), 0);
  assert.equal(symbols.get('inner'), 0);
  assert.equal(symbols.get('next'), 4);
  assert.equal(symbols.get('third'), 4);
  assert.equal(symbols.get('last'), 8);
});

test('comments and blank lines are handled', async () => {
  const symbols = await buildSymbolTable(
    sourceLines([
      '# leading comment',
      '// another comment',
      '',
      'start: addi x1, x0, 4 # trailing',
      '  // ignored',
      'end: li x2, 1 // trailing',
    ])
  );
  assert.equal(symbols.get('start'), 0);
  assert.equal(symbols.get('end'), 4);
});

test('startAddress is honored and must be a nonnegative safe integer', async () => {
  const lines = ['start: addi x1, x0, 4'];
  assert.equal((await buildSymbolTable(sourceLines(lines), 16)).get('start'), 16);
  await assert.rejects(async () => await buildSymbolTable(sourceLines(lines), -1), /startAddress/);
  await assert.rejects(async () => await buildSymbolTable(sourceLines(lines), 1.5), /startAddress/);
  await assert.rejects(
    async () => await buildSymbolTable(sourceLines(lines), Number.NaN),
    /startAddress/
  );
});

test('li uses 4 or 44 bytes at all signed-12-bit boundaries', async () => {
  const symbols = await buildSymbolTable(
    sourceLines([
      'small: li x1, 2047',
      'low: li x2, -2048',
      'large: li x3, 2048',
      'negative: li x4, -2049',
      'end:',
    ])
  );

  assert.equal(symbols.get('small'), 0);
  assert.equal(symbols.get('low'), 4);
  assert.equal(symbols.get('large'), 8);
  assert.equal(symbols.get('negative'), 52);
  assert.equal(symbols.get('end'), 96);
});

test('duplicate and malformed labels fail with line numbers', async () => {
  await assert.rejects(
    async () => await buildSymbolTable(sourceLines(['one: nop', 'one: nop'])),
    /Duplicate label "one" at line 2/
  );
  await assert.rejects(
    async () => await buildSymbolTable(sourceLines(['same: same: nop'])),
    /Duplicate label "same" at line 1/
  );
  await assert.rejects(
    async () => await buildSymbolTable(sourceLines(['bad-label: nop'])),
    /Malformed label at line 1/
  );
  await assert.rejects(
    async () => await buildSymbolTable(sourceLines([': nop'])),
    /Malformed label at line 1/
  );
});

test('unknown mnemonics and directives fail with line numbers', async () => {
  await assert.rejects(
    async () => await buildSymbolTable(sourceLines(['start: nop', 'bogus x1'])),
    /Unknown mnemonic "bogus" at line 2/
  );
  await assert.rejects(
    async () => await buildSymbolTable(sourceLines(['.text'])),
    /Unknown mnemonic ".text" at line 1/
  );
});

test('li requires a numeric constant for variable-length layout', async () => {
  await assert.rejects(
    async () => await buildSymbolTable(sourceLines(['bad: li x1, target'])),
    /numeric constant.*target/
  );
  await assert.rejects(
    async () => await buildSymbolTable(sourceLines(['bad: li x1'])),
    /Missing li immediate at line 1/
  );
});

test('fixed-length pseudos ignore relocation-like operand text', async () => {
  const symbols = await buildSymbolTable(
    sourceLines([
      'address: la x1, %pcrel_hi(target)',
      'call: call x2, %pcrel_lo(target)',
      'end: nop',
    ])
  );

  assert.equal(symbols.get('address'), 0);
  assert.equal(symbols.get('call'), 8);
  assert.equal(symbols.get('end'), 16);
});

test('literal forms include signs, prefixes, and underscore separators', async () => {
  const symbols = await buildSymbolTable(
    sourceLines([
      'hex: li x1, 0x7ff',
      'binary: li x2, 0b1000_0000_0000',
      'octal: li x3, -0o10',
      'plus: li x4, +2047',
      'plusHex: li x5, +0X800',
      'negativeHex: li x6, -0x800',
      'negativeZero: li x7, -0',
      'end:',
    ])
  );

  assert.equal(symbols.get('hex'), 0);
  assert.equal(symbols.get('binary'), 4);
  assert.equal(symbols.get('octal'), 48);
  assert.equal(symbols.get('plus'), 52);
  assert.equal(symbols.get('plusHex'), 56);
  assert.equal(symbols.get('negativeHex'), 100);
  assert.equal(symbols.get('negativeZero'), 104);
  assert.equal(symbols.get('end'), 108);
});

test('address overflow is rejected at the safe-integer boundary', async () => {
  await assert.rejects(
    async () => await buildSymbolTable(sourceLines(['nop']), Number.MAX_SAFE_INTEGER),
    /Address overflow at line 1/
  );
});

test("symbol layout advances by the instruction map's reported length", async () => {
  const reported = INSTRUCTION_MAP.get('addi')?.instructionLength;
  assert.equal(typeof reported, 'number');
  const lines = ['start:', 'addi x1, x0, 4', 'end:'];
  assert.equal((await buildSymbolTable(sourceLines(lines))).get('end'), reported);
});
