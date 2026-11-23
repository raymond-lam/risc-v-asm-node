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

import { INSTRUCTION_MAP, resolveOperands } from '#instructions';
import type { InstructionSignature } from '#instructions';
import { parseInstruction } from '#parse';

/**
 * Assemble a stream of source lines with a previously resolved symbol table.
 *
 * @param lines - Source lines in assembly order.
 * @param symbols - Label and predefined-symbol addresses.
 * @param baseAddress - Address assigned to the first instruction.
 * @yields Encoded instruction bytes in source order.
 */
export async function* assembleFlat(
  lines: AsyncIterable<string>,
  symbols: ReadonlyMap<string, number>,
  baseAddress = 0
): AsyncGenerator<Uint8Array> {
  let address = baseAddress;

  for await (const line of lines) {
    const instruction = parseInstruction(line);
    if (instruction === null) continue;
    const { mnemonic, operands } = instruction;
    const entry = INSTRUCTION_MAP.get(mnemonic)!;
    // The source operand count selects the instruction's metadata variant.
    const signature = entry.signatures.find(
      (s: InstructionSignature) => s.sourceSignature.length === operands.length
    )!;

    const args = resolveOperands(operands, signature, {
      address,
      symbols,
    });

    const bytes = entry.encode(...args);
    address += bytes.length;
    yield bytes;
  }
}
