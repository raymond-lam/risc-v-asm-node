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
import { writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { runCli as runCliCommand } from '#bin';

const SUPPORTED_DEFAULT_OVERRIDES = ['--mno-relax'];

/** Run the CLI with explicit binary output and the required supported overrides. */
const runCli = (
  argv: readonly string[],
  io?: Parameters<typeof runCliCommand>[1]
): Promise<number> => {
  const hasFormat = argv.some(
    (argument) => argument === '--format' || argument.startsWith('--format=')
  );
  const format = hasFormat ? [] : ['--format=binary'];
  return runCliCommand(
    [argv[0]!, argv[1]!, ...SUPPORTED_DEFAULT_OVERRIDES, ...format, ...argv.slice(2)],
    io
  );
};

/** Create a temporary directory and return its path, throwing on failure. */
let dirCounter = 0;
const tempDir = async (): Promise<string> => {
  const base = tmpdir();
  if (base === undefined) throw new Error('tmpdir() returned undefined');
  dirCounter += 1;
  const path = join(base, `riscv-cli-${dirCounter}`);
  if (path === undefined) throw new Error('join() returned undefined');
  await mkdir(path, { recursive: true });
  return path;
};

// Helper to resolve join safely
const jn = (...parts: string[]): string => {
  const result = join(...parts);
  if (result === undefined) throw new Error('join() returned undefined');
  return result;
};

/**
 * Build a CliIo-compatible bag that captures output into arrays.
 * After runCli resolves, call output(h) to get { out, err } strings.
 */
const testIo = (): {
  io: {
    stdout: { write: (chunk: string | Uint8Array) => void };
    stderr: { write: (chunk: string | Uint8Array) => void };
  };
  outChunks: string[];
  errChunks: string[];
} => {
  const outChunks: string[] = [];
  const errChunks: string[] = [];
  return {
    io: {
      stdout: {
        write: (chunk: string | Uint8Array) => {
          outChunks.push(chunk.toString());
        },
      },
      stderr: {
        write: (chunk: string | Uint8Array) => {
          errChunks.push(chunk.toString());
        },
      },
    },
    outChunks,
    errChunks,
  };
};

test('CLI --version prints 0.0.0 and exits 0', async () => {
  const { io, outChunks } = testIo();
  const exitCode = await runCli(['node', 'risc-v-asm', '--version'], io);
  assert.strictEqual(exitCode, 0);
  assert.match(outChunks.join(''), /0\.0\.0/);
});

test('CLI -version prints 0.0.0 and exits 0', async () => {
  const { io, outChunks } = testIo();
  const exitCode = await runCli(['node', 'risc-v-asm', '-version'], io);
  assert.strictEqual(exitCode, 0);
  assert.match(outChunks.join(''), /0\.0\.0/);
});

test('CLI requires at least one input file', async () => {
  const { io, errChunks } = testIo();
  const exitCode = await runCli(['node', 'risc-v-asm', '-o', '-'], io);
  assert.strictEqual(exitCode, 1);
  assert.match(errChunks.join(''), /no input files/);
});

test('CLI --help prints help and exits 0', async () => {
  const { io, outChunks } = testIo();
  const exitCode = await runCli(['node', 'risc-v-asm', '--help'], io);
  assert.strictEqual(exitCode, 0);
  assert.match(outChunks.join(''), /risc-v-asm/);
});

test('CLI --target-help prints target options and exits 0', async () => {
  const { io, outChunks } = testIo();
  const exitCode = await runCli(['node', 'risc-v-asm', '--target-help'], io);
  assert.strictEqual(exitCode, 0);
  assert.match(outChunks.join(''), /mrelax/);
});

test('CLI default format is ELF and fails until overridden', async () => {
  const { io, errChunks } = testIo();
  const exitCode = await runCliCommand(
    ['node', 'risc-v-asm', ...SUPPORTED_DEFAULT_OVERRIDES, '-o', '-', 'nonexistent.s'],
    io
  );
  assert.strictEqual(exitCode, 1);
  assert.match(errChunks.join(''), /ELF object output is not implemented/);
});

test('CLI basic assembly produces output file', async () => {
  const dir = await tempDir();
  const testFile = jn(dir, 'test.s');
  const outFile = jn(dir, 'a.out');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  const exitCode = await runCli(['node', 'risc-v-asm', '-o', outFile, testFile]);
  assert.strictEqual(exitCode, 0);
  assert.ok(readFileSync(outFile).length > 0);
});

test('CLI with --format=ihex produces Intel HEX', async () => {
  const dir = await tempDir();
  const testFile = jn(dir, 'test.s');
  const outFile = jn(dir, 'a.ihex');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  const exitCode = await runCli(['node', 'risc-v-asm', '-o', outFile, '--format=ihex', testFile]);
  assert.strictEqual(exitCode, 0);
  const text = readFileSync(outFile, 'utf8');
  assert.match(text, /^:/);
  assert.match(text, /:00000001FF\n?$/);
});

test('CLI with --format=elf fails with error', async () => {
  const { io, errChunks } = testIo();
  const exitCode = await runCli(
    ['node', 'risc-v-asm', '--format=elf', '-o', '-', 'nonexistent.s'],
    io
  );
  assert.strictEqual(exitCode, 1);
  assert.match(errChunks.join(''), /not implemented/);
});

test('CLI delegates unsupported format validation to assemble', async () => {
  const { io, errChunks } = testIo();
  const exitCode = await runCli(
    ['node', 'risc-v-asm', '--format=text', '-o', '-', 'nonexistent.s'],
    io
  );
  assert.strictEqual(exitCode, 1);
  assert.match(errChunks.join(''), /Unsupported format "text"/);
  assert.doesNotMatch(errChunks.join(''), /unknown option/);
});

test('CLI with unknown file returns error 1', async () => {
  const { io } = testIo();
  const exitCode = await runCli(['node', 'risc-v-asm', 'nonexistent.s'], io);
  assert.strictEqual(exitCode, 1);
});

test('CLI with --defsym', async () => {
  const dir = await tempDir();
  const testFile = jn(dir, 'test.s');
  const outFile = jn(dir, 'a.out');
  await writeFile(testFile, 'addi x1, x0, val\n');
  const exitCode = await runCli(['node', 'risc-v-asm', '-o', outFile, '--defsym=val=42', testFile]);
  assert.strictEqual(exitCode, 0);
  assert.ok(readFileSync(outFile).length > 0);
});

test('CLI unregistered options fail as unknown options', async () => {
  for (const flag of [
    '--mbig-endian',
    '-mbig-endian',
    '-mrelax=yes',
    '--march',
    '-march=rv64im',
    '--mabi',
    '-mabi=lp64',
    '--g',
    '-g',
    '--keep-locals',
    '--fpic',
    '-fpic',
    '--fPIC',
    '-march-attr=yes',
    '--warn',
    '--fatal-warnings',
    '--no-warn',
    '-W',
    '--include',
    '-Ifoo',
    '--statistics',
    '-v',
    '--verbose',
  ]) {
    const { io, errChunks } = testIo();
    const exitCode = await runCli(['node', 'risc-v-asm', flag], io);
    assert.strictEqual(exitCode, 1, `${flag} should fail`);
    assert.match(errChunks.join(''), /unknown option/);
  }
});

test('CLI rejects unsupported explicit defaults', async () => {
  const stages = [
    { args: [], error: /use -mno-relax/ },
    { args: ['--mno-relax', '--march-attr'], error: /use -mno-arch-attr/ },
    { args: ['--mno-relax', '--mcsr-check'], error: /use -mno-csr-check/ },
  ];
  for (const stage of stages) {
    const { io, errChunks } = testIo();
    const exitCode = await runCliCommand(
      ['node', 'risc-v-asm', ...stage.args, '-o', '-', 'nonexistent.s'],
      io
    );
    assert.strictEqual(exitCode, 1);
    assert.match(errChunks.join(''), stage.error);
  }

  const dir = await tempDir();
  const input = jn(dir, 'input.s');
  await writeFile(input, 'nop');
  const { io, outChunks } = testIo();
  const exitCode = await runCliCommand(
    [
      'node',
      'risc-v-asm',
      ...SUPPORTED_DEFAULT_OVERRIDES,
      '--mno-arch-attr',
      '--mno-csr-check',
      '--format=binary',
      '-o',
      '-',
      input,
    ],
    io
  );
  assert.strictEqual(exitCode, 0);
  assert.ok(outChunks.length > 0);
});

test('CLI supported target overrides accept GNU spellings', async () => {
  for (const flag of [
    '--mlittle-endian',
    '-mlittle-endian',
    '--mno-relax',
    '-mno-relax',
    '--mno-arch-attr',
    '-mno-arch-attr',
    '--mno-csr-check',
    '-mno-csr-check',
    '--fno-pic',
    '-fno-pic',
  ]) {
    const { io, outChunks } = testIo();
    const exitCode = await runCli(['node', 'risc-v-asm', flag, '--version'], io);
    assert.strictEqual(exitCode, 0, `${flag} should succeed`);
    assert.match(outChunks.join(''), /0\.0\.0/);
  }
});

test('CLI multiple files concatenate', async () => {
  const dir = await tempDir();
  const f1 = jn(dir, 'a.s');
  const f2 = jn(dir, 'b.s');
  const out = jn(dir, 'a.out');
  await writeFile(f1, 'addi x1, x0, 10\n');
  await writeFile(f2, 'addi x2, x1, 20\n');
  const exitCode = await runCli(['node', 'risc-v-asm', '-o', out, f1, f2]);
  assert.strictEqual(exitCode, 0);
  assert.strictEqual(readFileSync(out).length, 8);
});

test('CLI empty source produces empty binary', async () => {
  const dir = await tempDir();
  const input = jn(dir, 'empty.s');
  await writeFile(input, '');
  const { io, outChunks } = testIo();
  const exitCode = await runCli(['node', 'risc-v-asm', '-o', '-', input], io);
  assert.strictEqual(exitCode, 0);
  assert.strictEqual(outChunks.join('').length, 0);
});

test('CLI IHEX for empty source gets EOF record', async () => {
  const dir = await tempDir();
  const input = jn(dir, 'empty.s');
  const outFile = jn(dir, 'empty.ihex');
  await writeFile(input, '');
  const { io } = testIo();
  const exitCode = await runCli(['node', 'risc-v-asm', '--format=ihex', '-o', outFile, input], io);
  assert.strictEqual(exitCode, 0);
  const text = readFileSync(outFile, 'utf8');
  assert.strictEqual(text, ':00000001FF\n');
});

test('CLI listing option is rejected', async () => {
  const { io, errChunks } = testIo();
  const exitCode = await runCli(['node', 'risc-v-asm', '--listing'], io);
  assert.strictEqual(exitCode, 1);
  assert.match(errChunks.join(''), /unknown option/);
});

test('CLI validation: malformed --defsym fails', async () => {
  const dir = await tempDir();
  const testFile = jn(dir, 'test.s');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  const { io } = testIo();
  const exitCode = await runCli(['node', 'risc-v-asm', '--defsym', 'invalid', testFile], io);
  assert.strictEqual(exitCode, 1);
});

// ---------------------------------------------------------------------------
// Intel HEX output tests
// ---------------------------------------------------------------------------

test('IHEX exact small output with checksum and EOF', async () => {
  // One addi instruction → 4 bytes → one data record + EOF
  const dir = await tempDir();
  const testFile = jn(dir, 'test.s');
  const outFile = jn(dir, 'out.ihex');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  const exitCode = await runCli(['node', 'risc-v-asm', '--format=ihex', '-o', outFile, testFile]);
  assert.strictEqual(exitCode, 0);
  const text = readFileSync(outFile, 'utf8').trimEnd();
  const lines = text.split('\n');
  // Data record: 4 data bytes + 5 field bytes = 9 bytes → :09... (hex length 09)
  assert.ok(lines[0]!.startsWith(':'), 'first line must start with colon');
  // Last line is EOF
  assert.strictEqual(lines[lines.length - 1], ':00000001FF');
  // Verify checksum: sum of all bytes in each line (excluding ':') must be 0x00
  for (const line of lines) {
    const hex = line.slice(1).toLowerCase();
    let sum = 0;
    for (let i = 0; i < hex.length; i += 2) {
      sum += Number.parseInt(hex.substring(i, i + 2), 16);
    }
    assert.strictEqual(sum & 0xff, 0, 'each record must have correct checksum (sum ≡ 0 mod 256)');
  }
});

test('IHEX extended-linear-address record across 64 KiB boundary', async () => {
  // Fill 65536 bytes + 4 more to force crossing 0x10000 → needs an extended-address record
  const dir = await tempDir();
  const testFile = jn(dir, 'big.s');
  const outFile = jn(dir, 'big.ihex');
  // 0x4004 = 16388 nop instructions = 65536 bytes of nop, plus 4 extra bytes
  const nopCount = 0x4005; // 16389 nops = 65536 + 4 = 65540 bytes
  const body = Array.from({ length: nopCount }, () => 'nop').join('\n');
  await writeFile(testFile, body + '\n');
  const exitCode = await runCli(['node', 'risc-v-asm', '--format=ihex', '-o', outFile, testFile]);
  assert.strictEqual(exitCode, 0);
  const text = readFileSync(outFile, 'utf8');
  // Should contain an extended-linear-address record (type 04)
  assert.match(text, /:02000004..../m, 'must contain extended-linear-address record');
  // Must have the EOF record
  assert.match(text, /:00000001FF\n?/);
  // Verify all records have correct checksum
  for (const line of text.trimEnd().split('\n')) {
    const hex = line.slice(1).toLowerCase();
    let sum = 0;
    for (let i = 0; i < hex.length; i += 2) {
      sum += Number.parseInt(hex.substring(i, i + 2), 16);
    }
    assert.strictEqual(sum & 0xff, 0, 'each record must have correct checksum');
  }
});

test('IHEX --base-address shifts IHEX addresses but does not pad binary', async () => {
  const dir = await tempDir();
  const testFile = jn(dir, 'test.s');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  // Binary output with base address should not pad
  const binOut = jn(dir, 'out.bin');
  const bc1 = await runCli(['node', 'risc-v-asm', '-o', binOut, '--base-address=0x1000', testFile]);
  assert.strictEqual(bc1, 0);
  assert.strictEqual(readFileSync(binOut).length, 4, 'binary length unchanged by base-address');
  // IHEX output with base address should have shifted address
  const ihexOut = jn(dir, 'out.ihex');
  const bc2 = await runCli([
    'node',
    'risc-v-asm',
    '--format=ihex',
    '-o',
    ihexOut,
    '--base-address=0x1000',
    testFile,
  ]);
  assert.strictEqual(bc2, 0);
  const text = readFileSync(ihexOut, 'utf8');
  // The data record address should be 0x1000 (big-endian in Intel HEX)
  // Format: :LEN ADDR_HI ADDR_LO TYPE DATA... CKSUM
  // For address 0x1000: ADDR_HI=0x10, ADDR_LO=0x00 → record contains 1000 after colon
  // The extended-address line starts with :02..., the data line with :04...
  const lines = text.split('\n');
  const dataLine = lines.find((l) => l.startsWith(':04'));
  assert.ok(dataLine !== undefined, 'data record line exists');
  if (dataLine !== undefined)
    assert.match(dataLine, /^:041000/, 'IHEX data record shows shifted address 0x1000');
});

// ---------------------------------------------------------------------------
// GNU one-dash machine option tests
// ---------------------------------------------------------------------------

test('GNU one-dash -mlittle-endian succeeds', async () => {
  const dir = await tempDir();
  const testFile = jn(dir, 'test.s');
  await writeFile(testFile, 'nop\n');
  const exitCode = await runCli([
    'node',
    'risc-v-asm',
    '-mlittle-endian',
    '-o',
    jn(dir, 'a.out'),
    testFile,
  ]);
  assert.strictEqual(exitCode, 0);
});

test('GNU one-dash -mno-relax succeeds', async () => {
  const dir = await tempDir();
  const testFile = jn(dir, 'test.s');
  await writeFile(testFile, 'nop\n');
  const exitCode = await runCli([
    'node',
    'risc-v-asm',
    '-mno-relax',
    '-o',
    jn(dir, 'a.out'),
    testFile,
  ]);
  assert.strictEqual(exitCode, 0);
});

test('GNU one-dash --defsym with = syntax works', async () => {
  const dir = await tempDir();
  const testFile = jn(dir, 'test.s');
  await writeFile(testFile, 'addi x1, x0, val\n');
  const outFile = jn(dir, 'a.out');
  const exitCode = await runCli([
    'node',
    'risc-v-asm',
    '--defsym',
    'val=42',
    '-o',
    outFile,
    testFile,
  ]);
  assert.strictEqual(exitCode, 0);
  assert.strictEqual(readFileSync(outFile).length, 4);
});

test('GNU one-dash -o attaches file', async () => {
  const dir = await tempDir();
  const testFile = jn(dir, 'test.s');
  await writeFile(testFile, 'nop\n');
  const outFile = jn(dir, 'my.out');
  const exitCode = await runCli(['node', 'risc-v-asm', `-o${outFile}`, testFile]);
  assert.strictEqual(exitCode, 0);
  assert.ok(readFileSync(outFile).length > 0);
});

// ---------------------------------------------------------------------------
// Regression tests: Intel HEX 64 KiB boundary and GNU option normalization
// ---------------------------------------------------------------------------

test('IHEX does not cross 64 KiB boundary at base-address=0xFFFF', async () => {
  const dir = await tempDir();
  const testFile = jn(dir, 'a.s');
  const outFile = jn(dir, 'x.ihex');
  // Two 4-byte instructions starting at 0xFFFF = 8 bytes starting at offset 0xFFFF.
  // The record starting at 0xFFFF must be at most 1 byte (0x10000 - 0xFFFF = 1).
  await writeFile(testFile, 'addi x1, x0, 42\naddi x2, x0, 43\n');
  const exitCode = await runCli([
    'node',
    'risc-v-asm',
    '--format=ihex',
    '--base-address=0xffff',
    '-o',
    outFile,
    testFile,
  ]);
  assert.strictEqual(exitCode, 0);
  const text = readFileSync(outFile, 'utf8').trimEnd();
  const lines = text.split('\n');
  // Exact record sequence verified against running encoder output:
  assert.strictEqual(lines.length, 5);
  assert.strictEqual(lines[0], ':020000040000FA');
  assert.strictEqual(lines[1], ':01FFFF00936E');
  assert.strictEqual(lines[2], ':020000040001F9');
  assert.strictEqual(lines[3], ':0700000000A0021301B00291');
  assert.strictEqual(lines[4], ':00000001FF');
});
