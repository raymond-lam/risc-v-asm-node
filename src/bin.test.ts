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
 *
 * CLI tests that spawn the actual risc-v-asm binary via tsx so they exercise
 * the real process boundary rather than importing internal functions.
 */

/* oxlint-disable typescript/no-unsafe-call, typescript/no-unsafe-member-access --
   node:child_process spawn API types are not fully resolved by oxlint. */

import assert from 'node:assert/strict';
import test from 'node:test';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BIN = 'src/bin.ts';

/** Spawn the CLI binary and collect its output. */
const runCli = async (
  args: readonly string[]
): Promise<{
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
  readonly stdoutBytes: Uint8Array;
}> => {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      ['tsx', '--conditions', '@risc-v-asm/source', BIN, '--mno-relax', ...args],
      {
        stdio: [null, 'pipe', 'pipe'],
        env: { ...process.env },
        cwd: process.cwd(),
      }
    );

    const outBuf: Uint8Array[] = [];
    const errBuf: Uint8Array[] = [];

    if (child.stdout) {
      child.stdout.on('data', (chunk: Uint8Array | string) => {
        outBuf.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
      });
    }
    if (child.stderr) {
      child.stderr.on('data', (chunk: Uint8Array | string) => {
        errBuf.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
      });
    }

    child.on('exit', (exitCode: number | null) => {
      const stdoutBytes = new Uint8Array(outBuf.reduce((sum, b) => sum + b.length, 0));
      let offset = 0;
      for (const b of outBuf) {
        stdoutBytes.set(b, offset);
        offset += b.length;
      }

      const stderrBytes = new Uint8Array(errBuf.reduce((sum, b) => sum + b.length, 0));
      offset = 0;
      for (const b of errBuf) {
        stderrBytes.set(b, offset);
        offset += b.length;
      }

      resolve({
        exitCode: exitCode ?? 1,
        stdout: new TextDecoder().decode(stdoutBytes),
        stderr: new TextDecoder().decode(stderrBytes),
        stdoutBytes,
      });
    });

    child.on('error', (err: unknown) => {
      reject(err instanceof Error ? err : new Error(String(err)));
    });
  });
};

/** Create a temporary directory and return its path. */
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

/** Create a variant of runCli that does NOT inject --mno-relax. */
const runCliRaw = async (
  args: readonly string[]
): Promise<{
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
  readonly stdoutBytes: Uint8Array;
}> => {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['tsx', '--conditions', '@risc-v-asm/source', BIN, ...args], {
      stdio: [null, 'pipe', 'pipe'],
      env: { ...process.env },
      cwd: process.cwd(),
    });

    const outBuf: Uint8Array[] = [];
    const errBuf: Uint8Array[] = [];

    if (child.stdout) {
      child.stdout.on('data', (chunk: Uint8Array | string) => {
        outBuf.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
      });
    }
    if (child.stderr) {
      child.stderr.on('data', (chunk: Uint8Array | string) => {
        errBuf.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
      });
    }

    child.on('exit', (exitCode: number | null) => {
      const stdoutBytes = new Uint8Array(outBuf.reduce((sum, b) => sum + b.length, 0));
      let offset = 0;
      for (const b of outBuf) {
        stdoutBytes.set(b, offset);
        offset += b.length;
      }

      const stderrBytes = new Uint8Array(errBuf.reduce((sum, b) => sum + b.length, 0));
      offset = 0;
      for (const b of errBuf) {
        stderrBytes.set(b, offset);
        offset += b.length;
      }

      resolve({
        exitCode: exitCode ?? 1,
        stdout: new TextDecoder().decode(stdoutBytes),
        stderr: new TextDecoder().decode(stderrBytes),
        stdoutBytes,
      });
    });

    child.on('error', (err: unknown) => {
      reject(err instanceof Error ? err : new Error(String(err)));
    });
  });
};

/**
 * Assert that a byte array begins with a valid ELF64 ET_REL header.
 *
 * Checks the 64-byte ELF header for:
 *  - magic bytes (\\x7fELF)
 *  - ELF class (2 = 64-bit)
 *  - data encoding (1 = little-endian)
 *  - e_type (1 = ET_REL)
 *  - e_machine (243 = EM_RISCV)
 */
const assertValidElfHeader = (bytes: Uint8Array): void => {
  assert.ok(bytes.length >= 64, 'ELF header must be at least 64 bytes');
  assert.strictEqual(bytes[0], 0x7f, 'ELF magic byte 0');
  assert.strictEqual(bytes[1], 0x45, 'ELF magic byte 1 (E)');
  assert.strictEqual(bytes[2], 0x4c, 'ELF magic byte 2 (L)');
  assert.strictEqual(bytes[3], 0x46, 'ELF magic byte 3 (F)');
  assert.strictEqual(bytes[4], 2, 'e_ident class: ELFCLASS64');
  assert.strictEqual(bytes[5], 1, 'e_ident data: little-endian');
  // e_type is little-endian uint16 at offset 16
  const eType = bytes[16]! | (bytes[17]! << 8);
  assert.strictEqual(eType, 1, 'e_type: ET_REL');
  // e_machine is little-endian uint16 at offset 18
  const eMachine = bytes[18]! | (bytes[19]! << 8);
  assert.strictEqual(eMachine, 243, 'e_machine: EM_RISCV');
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test('CLI --version prints 0.0.0 and exits 0', async () => {
  const { exitCode, stdout } = await runCli(['--version']);
  assert.strictEqual(exitCode, 0);
  assert.match(stdout, /0\.0\.0/);
});

test('CLI -version prints 0.0.0 and exits 0', async () => {
  const { exitCode, stdout } = await runCli(['-version']);
  assert.strictEqual(exitCode, 0);
  assert.match(stdout, /0\.0\.0/);
});

test('CLI reads stdin when no input files', async () => {
  const result = await new Promise<{ exitCode: number; stdoutBytes: Uint8Array; stderr: string }>(
    (resolve, reject) => {
      const child = spawn(
        'npx',
        ['tsx', '--conditions', '@risc-v-asm/source', BIN, '--mno-relax', '-o', '-'],
        {
          stdio: ['pipe', 'pipe', 'pipe'],
          env: { ...process.env },
          cwd: process.cwd(),
        }
      );
      const outBuf: Uint8Array[] = [];
      const errBuf: Uint8Array[] = [];
      if (child.stdout) {
        child.stdout.on('data', (chunk: Uint8Array | string) => {
          outBuf.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
        });
      }
      if (child.stderr) {
        child.stderr.on('data', (chunk: Uint8Array | string) => {
          errBuf.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
        });
      }
      child.on('exit', (exitCode: number | null) => {
        const stdoutBytes = new Uint8Array(outBuf.reduce((sum, b) => sum + b.length, 0));
        let offset = 0;
        for (const b of outBuf) {
          stdoutBytes.set(b, offset);
          offset += b.length;
        }
        const stderr =
          errBuf.length > 0
            ? new TextDecoder().decode(new Uint8Array(errBuf.reduce((sum, b) => sum + b.length, 0)))
            : '';
        resolve({ exitCode: exitCode ?? 1, stdoutBytes, stderr });
      });
      child.on('error', (err) => reject(err instanceof Error ? err : new Error(String(err))));
      if (child.stdin) {
        child.stdin.write('addi x1, x0, 42\n');
        child.stdin.end();
      }
    }
  );
  assert.strictEqual(result.exitCode, 0);
  assert.strictEqual(result.stdoutBytes[0], 0x7f);
  assert.strictEqual(result.stdoutBytes[1], 0x45);
  assert.strictEqual(result.stdoutBytes[2], 0x4c);
  assert.strictEqual(result.stdoutBytes[3], 0x46);
});

test('CLI reads stdin when input file is -', async () => {
  const dir = await tempDir();
  const outFile = join(dir, 'a.out');
  const result = await new Promise<{ exitCode: number; stderr: string }>((resolve, reject) => {
    const child = spawn(
      'npx',
      ['tsx', '--conditions', '@risc-v-asm/source', BIN, '--mno-relax', '-o', outFile, '-'],
      {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env },
        cwd: process.cwd(),
      }
    );
    const errBuf: Uint8Array[] = [];
    if (child.stderr) {
      child.stderr.on('data', (chunk: Uint8Array | string) => {
        errBuf.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
      });
    }
    child.on('exit', (exitCode: number | null) => {
      const stderr =
        errBuf.length > 0
          ? new TextDecoder().decode(new Uint8Array(errBuf.reduce((sum, b) => sum + b.length, 0)))
          : '';
      resolve({ exitCode: exitCode ?? 1, stderr });
    });
    child.on('error', (err) => reject(err instanceof Error ? err : new Error(String(err))));
    if (child.stdin) {
      child.stdin.write('addi x1, x0, 1\n');
      child.stdin.end();
    }
  });
  assert.strictEqual(result.exitCode, 0);
  const bytes = await readFile(outFile);
  assert.strictEqual(bytes[0], 0x7f);
  assert.strictEqual(bytes[1], 0x45);
  assert.strictEqual(bytes[2], 0x4c);
  assert.strictEqual(bytes[3], 0x46);
});

test('CLI --help prints help and exits 0', async () => {
  const { exitCode, stdout } = await runCli(['--help']);
  assert.strictEqual(exitCode, 0);
  assert.match(stdout, /risc-v-asm/);
});

test('CLI --target-help prints target options and exits 0', async () => {
  const { exitCode, stdout } = await runCli(['--target-help']);
  assert.strictEqual(exitCode, 0);
  assert.match(stdout, /mno-relax/);
  assert.ok(!/--format/.test(stdout), 'should not mention --format');
  assert.ok(!/base-address/.test(stdout), 'should not mention base-address');
});

test('CLI basic assembly produces valid ELF output', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  const { exitCode } = await runCli(['-o', outFile, testFile]);
  assert.strictEqual(exitCode, 0);
  const bytes = await readFile(outFile);
  assertValidElfHeader(bytes);
});

test('CLI with unknown file returns error 1', async () => {
  const { exitCode, stderr } = await runCli(['nonexistent.s']);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /ENOENT.*nonexistent\.s/);
});

test('CLI with --defsym produces valid ELF', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, 'addi x1, x0, val\n');
  const { exitCode } = await runCli(['-o', outFile, '--defsym=val=42', testFile]);
  assert.strictEqual(exitCode, 0);
  const bytes = await readFile(outFile);
  assertValidElfHeader(bytes);
});

test('CLI unregistered options fail as unknown options', async () => {
  for (const flag of [
    '--mabi',
    '-mabi=lp64',
    '--g',
    '-g',
    '--keep-locals',
    '--fpic',
    '-fpic',
    '--fPIC',
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
    const { exitCode, stderr } = await runCli([flag]);
    assert.strictEqual(exitCode, 1, `${flag} should fail`);
    assert.match(stderr, /unknown option/);
    // The error message must name the specific flag
    const flagName = flag.includes('=') ? flag.slice(0, flag.indexOf('=')) : flag;
    assert.ok(stderr.includes(flagName), `stderr should mention "${flagName}"`);
  }
});

test('CLI rejects unsupported explicit defaults', async () => {
  const { exitCode, stderr } = await runCli(['--march-attr', '-o', '-', 'nonexistent.s']);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /ENOENT.*nonexistent\.s/);
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
    const { exitCode, stdout } = await runCli([flag, '--version']);
    assert.strictEqual(exitCode, 0, `${flag} should succeed`);
    assert.match(stdout, /0\.0\.0/);
  }
});

test('CLI multiple files concatenate produces valid ELF', async () => {
  const dir = await tempDir();
  const f1 = join(dir, 'a.s');
  const f2 = join(dir, 'b.s');
  const out = join(dir, 'a.out');
  await writeFile(f1, 'addi x1, x0, 10\n');
  await writeFile(f2, 'addi x2, x1, 20\n');
  const { exitCode } = await runCli(['-o', out, f1, f2]);
  assert.strictEqual(exitCode, 0);
  const bytes = await readFile(out);
  assertValidElfHeader(bytes);
});

test('CLI empty source produces valid ELF output', async () => {
  const dir = await tempDir();
  const input = join(dir, 'empty.s');
  const outFile = join(dir, 'out.elf');
  await writeFile(input, '');
  const { exitCode } = await runCli(['-o', outFile, input]);
  assert.strictEqual(exitCode, 0);
  const bytes = await readFile(outFile);
  assertValidElfHeader(bytes);
});

test('CLI listing option is rejected', async () => {
  const { exitCode, stderr } = await runCli(['--listing']);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /unknown option/);
});

test('CLI validation: malformed --defsym fails', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  const { exitCode, stderr } = await runCli(['--defsym', 'invalid', testFile]);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /--defsym expects symbol=value/);
});

test('CLI writes ELF to stdout with -o -', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  const { exitCode, stdoutBytes } = await runCli(['-o', '-', testFile]);
  assert.strictEqual(exitCode, 0);
  assert.strictEqual(stdoutBytes[0], 0x7f);
  assert.strictEqual(stdoutBytes[1], 0x45);
  assert.strictEqual(stdoutBytes[2], 0x4c);
  assert.strictEqual(stdoutBytes[3], 0x46);
});

test('CLI -march=rv64imc accepts valid instruction', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, 'c.addi x1, x0, 1\n');
  const { exitCode } = await runCli(['-o', outFile, '--march=rv64imc', testFile]);
  assert.strictEqual(exitCode, 0);
  const bytes = await readFile(outFile);
  assertValidElfHeader(bytes);
});

test('CLI -march=rv64im rejects c.addi with error', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, 'c.addi x1, x0, 1\n');
  const { exitCode, stderr } = await runCli(['-o', outFile, '--march=rv64im', testFile]);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /c\.addi/);
  assert.match(stderr, /requires extension "c"/);
  assert.match(stderr, /rv64im/);
});

test('CLI -march with joined form (-march=rv64imc) works', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, 'addi x1, x0, 1\n');
  const { exitCode } = await runCli(['-o', outFile, '-march=rv64imc', testFile]);
  assert.strictEqual(exitCode, 0);
  const bytes = await readFile(outFile);
  assertValidElfHeader(bytes);
});

test('CLI --target-help includes -march, -mno-relax, --defsym, -o', async () => {
  const { exitCode, stdout } = await runCli(['--target-help']);
  assert.strictEqual(exitCode, 0);
  assert.match(stdout, /-march=ISA/);
  assert.match(stdout, /mno-relax/);
  assert.match(stdout, /defsym/);
  assert.match(stdout, /--output/);
  assert.ok(!/--format/.test(stdout), 'should not mention --format');
  assert.ok(!/base-address/.test(stdout), 'should not mention base-address');
});

test('CLI rejects missing -mno-relax', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  // Use runCliRaw to avoid the injected --mno-relax
  const { exitCode, stderr } = await runCliRaw(['-o', outFile, testFile]);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /-mno-relax/);
});

test('CLI rejects -mrelax', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  // Use runCliRaw to avoid the injected --mno-relax, then pass --mrelax explicitly
  const { exitCode, stderr } = await runCliRaw(['-o', outFile, '--mrelax', testFile]);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /-mno-relax/);
});

test('CLI rejects --mcsr-check naming -mno-csr-check', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  const { exitCode, stderr } = await runCliRaw([
    '-o',
    outFile,
    '--mcsr-check',
    '--mno-relax',
    testFile,
  ]);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /-mno-csr-check/);
});

test('CLI rejects --mbig-endian naming -mlittle-endian', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, 'addi x1, x0, 42\n');
  const { exitCode, stderr } = await runCliRaw([
    '-o',
    outFile,
    '--mbig-endian',
    '--mno-relax',
    testFile,
  ]);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /-mlittle-endian/);
});

test('CLI rejects unknown mnemonic with line number', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, 'foobar x1, x0, 1\n');
  const { exitCode, stderr } = await runCli(['-o', outFile, testFile]);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /line 1/);
});

test('CLI rejects malformed label with line number', async () => {
  const dir = await tempDir();
  const testFile = join(dir, 'test.s');
  const outFile = join(dir, 'a.out');
  await writeFile(testFile, ':addi x1, x0, 1\n');
  const { exitCode, stderr } = await runCli(['-o', outFile, testFile]);
  assert.strictEqual(exitCode, 1);
  assert.match(stderr, /line 1/);
});
