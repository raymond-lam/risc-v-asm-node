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

/* oxlint-disable func-style -- Async generators cannot be written as arrow functions. */

import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { Readable } from 'node:stream';

import { assembleFlat } from '#assemble/flat';
import { intelHex } from '#formats';
import { parseIntegerLiteral } from '#parse';
import { buildSymbolTable } from '#symbol-table';
import { safeInteger } from '#utils/integer';

type AssembleOptions = Readonly<{
  format?: string;
  baseAddress?: number | string;
  march?: string;
  mabi?: string;
  defsym?: readonly string[];
}>;

type ValidatedOptions = Readonly<{
  format: 'binary' | 'ihex';
  baseAddress: number;
  predefinedSymbols: ReadonlyMap<string, number>;
}>;

/**
 * Parse `symbol=value` definitions into a resolved symbol map.
 *
 * @param definitions - Raw definitions supplied through `defsym`.
 * @returns A map from symbol names to nonnegative safe integers.
 * @throws Error if a definition is malformed or its value is invalid.
 */
const definedSymbols = (definitions: readonly string[] | undefined): Map<string, number> => {
  const symbols = new Map<string, number>();
  for (const definition of definitions ?? []) {
    // Capture a valid symbol name before the first '=' and its full value after it.
    const match = /^([A-Za-z_.$][A-Za-z0-9_.$]*)=(.*)$/.exec(definition);
    if (!match) throw new Error(`--defsym expects symbol=value, got "${definition}"`);
    const value = parseIntegerLiteral(match[2]!);
    if (value === null) {
      throw new Error(`--defsym value for "${match[1]}" must be an integer`);
    }
    symbols.set(match[1]!, safeInteger(value, `Value of ${match[1]}`));
  }
  return symbols;
};

/**
 * Validate and normalize public assembly options before opening any input.
 *
 * @param options - Caller-supplied assembly options.
 * @returns Options with explicit defaults and parsed symbol definitions.
 * @throws Error if any option has an unsupported or invalid value.
 */
const validateAssembleOptions = (options: AssembleOptions): ValidatedOptions => {
  const format = options.format ?? 'binary';
  if (format === 'elf') {
    throw new Error('ELF object output is not implemented; use --format=binary or ihex');
  }
  if (format !== 'binary' && format !== 'ihex') {
    throw new Error(`Unsupported format "${format}"; currently use binary or ihex`);
  }

  const march = options.march ?? 'rv64i';
  if (march !== 'rv64i' && march !== 'rv64im') {
    throw new Error(`Unsupported -march="${march}"; currently use rv64i or rv64im`);
  }

  const mabi = options.mabi ?? 'lp64';
  if (mabi !== 'lp64') {
    throw new Error(`Unsupported -mabi="${mabi}"; currently use lp64`);
  }

  let baseAddress = 0;
  if (options.baseAddress !== undefined) {
    if (typeof options.baseAddress === 'number') {
      if (!Number.isSafeInteger(options.baseAddress) || options.baseAddress < 0) {
        throw new Error(
          `--base-address must be a nonnegative safe integer, got ${options.baseAddress}`
        );
      }
      baseAddress = options.baseAddress;
    } else {
      const literal = parseIntegerLiteral(options.baseAddress);
      if (literal === null) {
        throw new Error(`--base-address requires an integer, got "${options.baseAddress}"`);
      }
      baseAddress = safeInteger(literal, '--base-address');
    }
  }

  return {
    format,
    baseAddress,
    predefinedSymbols: definedSymbols(options.defsym),
  };
};

/**
 * Assemble source text or file paths into a stream of binary or Intel HEX bytes.
 * A string is always source text; each array element is a file path. Validation,
 * symbol layout, and encoding begin when the returned generator is iterated.
 *
 * @param input - Assembly source text, or file paths read in array order.
 * @param options - Output format, address, ISA/ABI, and predefined symbols.
 * @yields Encoded binary chunks or UTF-8 Intel HEX records in source order.
 */
export async function* assemble(
  input: string | readonly string[],
  options: AssembleOptions = {}
): AsyncGenerator<Uint8Array> {
  const validated = validateAssembleOptions(options);

  /**
   * Create a fresh line stream for one assembly pass.
   *
   * @returns Source text as an async stream, or reopened file input for a path array.
   */
  const inputLines = (): AsyncIterable<string> => {
    if (typeof input === 'string') return Readable.from(input.split(/\r?\n/));
    /**
     * Yield the lines of every input file in order.
     *
     * @yields Lines from each file, with file streams closed after use.
     */
    async function* fileLines(): AsyncGenerator<string> {
      for (const file of input) {
        const stream = createReadStream(file);
        const lines = createInterface({ input: stream, crlfDelay: Infinity });
        try {
          for await (const line of lines) yield line;
        } finally {
          lines.close();
          stream.destroy();
        }
      }
    }
    return fileLines();
  };

  const labelSymbols = await buildSymbolTable(inputLines(), validated.baseAddress);
  const symbols = new Map([...validated.predefinedSymbols, ...labelSymbols]);
  const bytes = assembleFlat(inputLines(), symbols, validated.baseAddress);

  if (validated.format === 'ihex') {
    yield* intelHex(bytes, validated.baseAddress);
    return;
  }
  yield* bytes;
}
