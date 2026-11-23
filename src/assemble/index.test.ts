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
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { assemble } from '#index';
import { collectBytes } from '#testing/stream';

test('assemble treats a string as source text and emits exact binary bytes', async () => {
  const bytes = await collectBytes(assemble('addi x1, x0, 42\nnop'));
  assert.deepEqual(bytes, Uint8Array.from([0x93, 0x00, 0xa0, 0x02, 0x13, 0x00, 0x00, 0x00]));
});

test('assemble streams file paths afresh for layout and encoding', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'riscv-assemble-'));
  const first = join(directory, 'first.s');
  const second = join(directory, 'second.s');
  await writeFile(first, 'start: addi x1, x0, 42\n');
  await writeFile(second, 'beq x1, x0, start\n');

  const bytes = await collectBytes(assemble([first, second]));
  assert.strictEqual(bytes.length, 8);
  assert.deepEqual(bytes, Uint8Array.from([0x93, 0x00, 0xa0, 0x02, 0xe3, 0x8e, 0x00, 0xfe]));
});

test('assemble treats an empty path array as empty source', async () => {
  assert.deepEqual(await collectBytes(assemble([])), new Uint8Array());
});

test('assemble accepts signed, base-prefixed, underscored base addresses', async () => {
  const bytes = await collectBytes(
    assemble('beq x0, x0, target', {
      baseAddress: '+0x1_000',
      defsym: ['target=0x1008'],
    })
  );
  assert.deepEqual(bytes, Uint8Array.from([0x63, 0x04, 0x00, 0x00]));
});

test('assemble resolves defsym values and lets source labels override them', async () => {
  const defined = await collectBytes(
    assemble('addi x1, x0, value', { defsym: ['value=0b10_1010'] })
  );
  assert.deepEqual(defined, Uint8Array.from([0x93, 0x00, 0xa0, 0x02]));

  const overridden = await collectBytes(
    assemble('value: addi x1, x0, value', { defsym: ['value=42'] })
  );
  assert.deepEqual(overridden, Uint8Array.from([0x93, 0x00, 0x00, 0x00]));
});

test('assemble emits newline-terminated UTF-8 Intel HEX bytes with base addresses', async () => {
  const bytes = await collectBytes(
    assemble('addi x1, x0, 42', { format: 'ihex', baseAddress: 0x1000 })
  );
  const text = new TextDecoder().decode(bytes);
  assert.strictEqual(text, ':020000040000FA\n:041000009300A002B7\n:00000001FF\n');
});

test('assemble rejects unsupported options during iteration', async () => {
  const invalidOptions = [
    { format: 'elf' },
    { format: 'text' },
    { march: 'rv64g' },
    { mabi: 'ilp32' },
    { baseAddress: -1 },
    { baseAddress: '-0x1' },
    { baseAddress: 'not-a-number' },
    { baseAddress: Number.MAX_SAFE_INTEGER + 1 },
    { defsym: ['invalid'] },
    { defsym: ['value=-1'] },
    { defsym: ['value=not-a-number'] },
  ];

  for (const options of invalidOptions) {
    await assert.rejects(collectBytes(assemble('nop', options)));
  }
});

test('assemble emits EOF only for empty Intel HEX input', async () => {
  const bytes = await collectBytes(assemble('', { format: 'ihex' }));
  assert.strictEqual(new TextDecoder().decode(bytes), ':00000001FF\n');
});

test('assemble Intel HEX enforces the 32-bit address space', async () => {
  await assert.rejects(
    collectBytes(assemble('nop', { format: 'ihex', baseAddress: '0x1_0000_0000' })),
    /32-bit addresses/
  );
  await assert.rejects(
    collectBytes(assemble('nop\nnop', { format: 'ihex', baseAddress: 0xffff_fffc })),
    /32-bit addresses/
  );
});
