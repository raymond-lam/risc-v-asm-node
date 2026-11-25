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

/**
 * Parse an ELF64 object's .text section.
 */
const readElfText = (elf: Uint8Array): Uint8Array => {
  if (elf.length < 64) return new Uint8Array();
  const eShoff =
    (elf[40] ?? 0) |
    ((elf[41] ?? 0) << 8) |
    ((elf[42] ?? 0) << 16) |
    ((elf[43] ?? 0) << 24) |
    ((elf[44] ?? 0) * 0x1_0000_0000 +
      (elf[45] ?? 0) * 0x100_0000_0000 +
      (elf[46] ?? 0) * 0x1_0000_0000_0000 +
      (elf[47] ?? 0) * 0x100_0000_0000_0000);
  const eShnum = (elf[60] ?? 0) | ((elf[61] ?? 0) << 8);
  const eShentsize = (elf[58] ?? 0) | ((elf[59] ?? 0) << 8);
  // Read .text section header (index 1)
  if (eShnum < 2) return new Uint8Array();
  const shOff = eShoff + eShentsize;
  const shSize =
    (elf[shOff + 32] ?? 0) |
    ((elf[shOff + 33] ?? 0) << 8) |
    ((elf[shOff + 34] ?? 0) << 16) |
    ((elf[shOff + 35] ?? 0) << 24) |
    ((elf[shOff + 36] ?? 0) * 0x1_0000_0000 +
      (elf[shOff + 37] ?? 0) * 0x100_0000_0000 +
      (elf[shOff + 38] ?? 0) * 0x1_0000_0000_0000 +
      (elf[shOff + 39] ?? 0) * 0x100_0000_0000_0000);
  const shOffset =
    (elf[shOff + 24] ?? 0) |
    ((elf[shOff + 25] ?? 0) << 8) |
    ((elf[shOff + 26] ?? 0) << 16) |
    ((elf[shOff + 27] ?? 0) << 24) |
    ((elf[shOff + 28] ?? 0) * 0x1_0000_0000 +
      (elf[shOff + 29] ?? 0) * 0x100_0000_0000 +
      (elf[shOff + 30] ?? 0) * 0x1_0000_0000_0000 +
      (elf[shOff + 31] ?? 0) * 0x100_0000_0000_0000);
  return elf.slice(shOffset, shOffset + shSize);
};

test('assemble treats a string as source text and emits an ELF object with the correct .text bytes', async () => {
  const buf = await collectBytes(assemble('addi x1, x0, 42\nnop'));
  const text = readElfText(buf);
  assert.deepEqual(text, Uint8Array.from([0x93, 0x00, 0xa0, 0x02, 0x13, 0x00, 0x00, 0x00]));
});

test('assemble streams file paths afresh for layout and encoding', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'riscv-assemble-'));
  const first = join(directory, 'first.s');
  const second = join(directory, 'second.s');
  await writeFile(first, 'start: addi x1, x0, 42\n');
  await writeFile(second, 'beq x1, x0, start\n');

  const buf = await collectBytes(assemble([first, second]));
  const text = readElfText(buf);
  assert.strictEqual(text.length, 8);
  // The ELF encode path replaces symbol references with zero placeholders
  // and records relocations for fixup, so `start` becomes 0 in the text.
  assert.deepEqual(text, Uint8Array.from([0x93, 0x00, 0xa0, 0x02, 0x63, 0x80, 0x00, 0x00]));
});

test('assemble treats an empty path array as empty source', async () => {
  const buf = await collectBytes(assemble([]));
  const text = readElfText(buf);
  assert.strictEqual(text.length, 0);
});

test('assemble resolves defsym values and lets source labels override them', async () => {
  const defined = await collectBytes(
    assemble('addi x1, x0, value', { defsym: ['value=0b10_1010'] })
  );
  const text = readElfText(defined);
  // The ELF encode path replaces symbol references with zero placeholders.
  assert.deepEqual(text, Uint8Array.from([0x93, 0x00, 0x00, 0x00]));

  const overridden = await collectBytes(
    assemble('value: addi x1, x0, value', { defsym: ['value=42'] })
  );
  const text2 = readElfText(overridden);
  assert.deepEqual(text2, Uint8Array.from([0x93, 0x00, 0x00, 0x00]));
});

test('assemble yields more than one chunk for multi-instruction source (streaming)', async () => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of assemble('addi x1, x0, 1\naddi x2, x1, 2\nnop')) {
    chunks.push(chunk);
  }
  assert.ok(chunks.length >= 2, `expected at least 2 chunks, got ${chunks.length}`);
  // Concatenate and verify
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const buf = new Uint8Array(total);
  let off = 0;
  for (const chunk of chunks) {
    buf.set(chunk, off);
    off += chunk.length;
  }
  // Check that the concatenated buffer is a valid ELF with correct .text
  const text = readElfText(buf);
  assert.strictEqual(text.length, 12, '.text should be 12 bytes (3 × 4-byte instructions)');
});

test('assemble without -march allows any mnemonic including vector instructions', async () => {
  const buf = await collectBytes(assemble('vsetvli x1, x0, 0'));
  const text = readElfText(buf);
  assert.strictEqual(text.length, 4);
});

test('assemble with -march=rv64im rejects c.addi', async () => {
  await assert.rejects(
    () => collectBytes(assemble('c.addi x1, x0, 1', { march: 'rv64im' })),
    /c\.addi.*requires extension "c"/
  );
});

test('assemble with -march=rv64im rejects mul instruction (requires m, but i,m present)', async () => {
  // mul requires ['m'], and -march=rv64im has m, so this should succeed.
  const buf = await collectBytes(assemble('mul x1, x2, x3', { march: 'rv64im' }));
  const text = readElfText(buf);
  assert.strictEqual(text.length, 4);
});

test('assemble with -march=rv64imc accepts c.addi and mul', async () => {
  const buf = await collectBytes(
    assemble('c.addi x1, x0, 1\nmul x1, x2, x3', { march: 'rv64imc' })
  );
  const text = readElfText(buf);
  // c.addi = 2 bytes, mul = 4 bytes
  assert.strictEqual(text.length, 6);
});

test('assemble with -march=rv64gc accepts a-extension instruction (lr.d) and rejects v-extension', async () => {
  // lr.d requires ['a'], which is part of g expansion.
  // lr.d takes rd, (rs1), aq, rl.
  const buf = await collectBytes(assemble('lr.d x1, (x2), 0, 0', { march: 'rv64gc' }));
  const text = readElfText(buf);
  assert.strictEqual(text.length, 4);

  // vsetvli requires ['v'] which is not in g expansion
  await assert.rejects(
    () => collectBytes(assemble('vsetvli x1, x0, 0', { march: 'rv64gc' })),
    /vsetvli.*requires extension "v"/
  );
});

test('assemble with -march containing version digits parses correctly', async () => {
  const buf = await collectBytes(assemble('addi x1, x0, 42', { march: 'rv64i2p1' }));
  const text = readElfText(buf);
  assert.strictEqual(text.length, 4);
});

test('assemble with -march naming unsupported extension errors', async () => {
  await assert.rejects(
    () => collectBytes(assemble('nop', { march: 'rv64i_unknown_ext' })),
    /Unsupported extension/
  );
});

test('assemble with malformed -march errors', async () => {
  await assert.rejects(
    () => collectBytes(assemble('nop', { march: 'imc' })),
    /must start with rv32 or rv64/
  );
});

test('assemble -march error message includes mnemonic, missing extension, and ISA string', async () => {
  try {
    await collectBytes(assemble('c.addi x1, x0, 1', { march: 'rv64im' }));
    assert.fail('should have thrown');
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    assert.match(message, /c\.addi/);
    assert.match(message, /requires extension "c"/);
    assert.match(message, /-march=rv64im/);
  }
});
