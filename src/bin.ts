#!/usr/bin/env node
/* Copyright 2026 Raymond Lam
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

/* oxlint-disable func-style -- Async generators cannot be written as arrow functions. */

import { createWriteStream } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import { Command, CommanderError } from 'commander';
import { assemble } from '#index';
import packageMetadata from '#package.json' with { type: 'json' };

type WriteSink = { write: (chunk: string | Uint8Array) => void };

type CliIo = Readonly<{
  stdout: WriteSink;
  stderr: WriteSink;
}>;

type CliOptions = Readonly<{
  output: string;
  mrelax?: boolean;
  mnoRelax?: boolean;
  march?: string;
  marchAttr: boolean;
  mnoArchAttr?: boolean;
  mcsrCheck?: boolean;
  mnoCsrCheck?: boolean;
  mbigEndian?: boolean;
  defsym: string[];
  targetHelp?: boolean;
}>;

const VERSION = packageMetadata.version;
const TARGET_HELP = `RISC-V options:
  -march=ISA                set architecture (default: no restriction)
  --mlittle-endian           little-endian output (default)
  --mno-relax                disable linker relaxation (required override)
  --march-attr               generate ELF arch attributes
  --mno-arch-attr            do not generate ELF arch attributes (default)
  --mno-csr-check            disable CSR checking (default)
  --fno-pic                  non-position-independent code (default)
  -o, --output FILE          output file (default: a.out)
  --defsym SYM=VAL           define a nonnegative integer absolute symbol
`;

const defaultIo: CliIo = {
  stdout: process.stdout,
  stderr: process.stderr,
};

/**
 * Accumulate repeated Commander option values.
 *
 * @param value - Newly supplied option value.
 * @param previous - Values collected so far.
 * @returns The previous values with the new value appended.
 */
const collect = (value: string, previous: string[]): string[] => [...previous, value];

/**
 * Read the entirety of stdin as a single string.
 *
 * @returns The complete stdin content.
 */
const stdinText = async (): Promise<string> => {
  const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
  const lines: string[] = [];
  for await (const line of rl) {
    lines.push(line);
  }
  rl.close();
  return lines.join('\n');
};

/**
 * Normalize supported GNU-style one-dash and joined options to long options.
 *
 * @param argv - Raw command-line arguments, including the executable and script.
 * @returns Arguments with supported forms expanded for Commander.
 */
const normalizeArguments = (argv: readonly string[]): string[] =>
  argv.flatMap((argument, index) => {
    if (index < 2) return [argument];
    if (argument === '-version') return ['--version'];
    // Normalize supported one-dash target defaults to their long forms.
    const machineBool =
      /^(-m(?:little-endian|relax|no-relax|big-endian|arch-attr|no-arch-attr|csr-check|no-csr-check))$/.exec(
        argument
      );
    if (machineBool) return [`--${machineBool[1]!.slice(1)}`];
    // Normalize -march=VALUE to --march=VALUE for Commander.
    const marchArg = /^-march=(.+)$/.exec(argument);
    if (marchArg) return [`--march=${marchArg[1]!}`];
    // Split the joined -oFILE form into separate flag and value arguments.
    if (/^-o.+/.test(argument)) return ['-o', argument.slice(2)];
    if (argument === '-fno-pic') return ['--fno-pic'];
    return [argument];
  });

/**
 * Reject unsupported defaults unless their supported overrides were selected.
 *
 * @param options - Parsed CLI options.
 * @throws Error for the first unsupported default that lacks an explicit override.
 */
const validateCliOptions = (options: CliOptions): void => {
  if (options.mrelax) {
    throw new Error('Linker relaxation is not implemented; use -mno-relax');
  }
  if (!options.mnoRelax) {
    throw new Error('Linker relaxation is not implemented; use -mno-relax');
  }
  if (options.mcsrCheck) {
    throw new Error('CSR checking is not implemented; use -mno-csr-check');
  }
  if (options.mbigEndian) {
    throw new Error('Big-endian output is not implemented; use -mlittle-endian');
  }
};

/**
 * Create and configure the Commander program.
 *
 * @param io - Output sinks used for help, version, and errors.
 * @returns The configured Commander program.
 */
const createProgram = (io: CliIo): Command => {
  const program = new Command();
  program
    .name('risc-v-asm')
    .description('Assemble RISC-V assembly into ELF64 object files (975+ mnemonics).')
    .usage('[options] [file...]')
    .argument('[file...]', 'assembly source files')
    .option('-o, --output <objfile>', 'output file; - writes stdout', 'a.out')
    .option('--mlittle-endian', 'little-endian output (default)')
    .option('--mrelax', 'linker relaxation (not implemented); use --mno-relax')
    .option('--mno-relax', 'disable linker relaxation (required override)')
    .option('--march <arch>', 'set architecture (default: no restriction)')
    .option('--march-attr', 'generate ELF arch attributes')
    .option('--mno-arch-attr', 'do not generate ELF arch attributes (default)')
    .option('--mcsr-check', 'CSR checking (not implemented); use --mno-csr-check')
    .option('--mno-csr-check', 'disable CSR checking (default)')
    .option('--mbig-endian', 'big-endian output (not implemented); use --mlittle-endian')
    .option('--fno-pic', 'non-position-independent code (default)')
    .option('--defsym <symbol=value>', 'define an integer symbol', collect, [])
    .option('--target-help', 'print RISC-V target options')
    .version(VERSION, '--version', 'print version and exit')
    .exitOverride()
    .configureOutput({
      writeOut: (text) => io.stdout.write(text),
      writeErr: (text) => io.stderr.write(text),
    });
  return program;
};

/**
 * Run the CLI: parse arguments, assemble source files, and write output.
 *
 * @param argv - Command-line arguments, defaulting to the current process arguments.
 * @param io - Output sinks, defaulting to the process streams.
 * @returns The process exit code.
 */
const runCli = async (
  argv: readonly string[] = process.argv,
  io: CliIo = defaultIo
): Promise<number> => {
  const program = createProgram(io);
  try {
    program.action(async (files: string[]) => {
      const options = program.opts<CliOptions>();
      if (options.targetHelp) {
        io.stdout.write(TARGET_HELP);
        return;
      }
      validateCliOptions(options);
      const useStdin = files.length === 0 || files.includes('-');
      const bytes = useStdin
        ? assemble(await stdinText(), {
            defsym: options.defsym,
            marchAttr: options.marchAttr,
            march: options.march,
          })
        : assemble(files, {
            defsym: options.defsym,
            marchAttr: options.marchAttr,
            march: options.march,
          });
      if (options.output === '-') {
        for await (const chunk of bytes) io.stdout.write(chunk);
        return;
      }
      await pipeline(Readable.from(bytes), createWriteStream(options.output));
    });
    await program.parseAsync(normalizeArguments(argv), { from: 'node' });
    return 0;
  } catch (error) {
    if (error instanceof CommanderError) return error.exitCode;
    const message = error instanceof Error ? error.message : String(error);
    io.stderr.write(`risc-v-asm: error: ${message}\n`);
    return 1;
  }
};

if (import.meta.main) process.exitCode = await runCli(process.argv);
