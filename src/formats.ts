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

/**
 * Format one Intel HEX record with its checksum.
 *
 * @param address - 16-bit record address field.
 * @param type - Intel HEX record type.
 * @param data - Record payload bytes.
 * @returns A colon-prefixed uppercase Intel HEX record without a newline.
 */
const hexRecord = (address: number, type: number, data: readonly number[]): string => {
  const fields = [data.length, (address >> 8) & 0xff, address & 0xff, type, ...data];
  const checksum = -fields.reduce((sum, byte) => sum + byte, 0) & 0xff;
  return `:${[...fields, checksum]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
};

const utf8 = new TextEncoder();

/**
 * Convert binary assembly output to Intel HEX records.
 *
 * @param chunks - Encoded instruction bytes in address order.
 * @param baseAddress - Address assigned to the first output byte.
 * @yields Newline-terminated UTF-8 Intel HEX records, including EOF.
 * @throws Error if output would exceed the Intel HEX 32-bit address range.
 */
export async function* intelHex(
  chunks: AsyncIterable<Uint8Array>,
  baseAddress: number
): AsyncGenerator<Uint8Array> {
  if (baseAddress > 0x1_0000_0000) {
    throw new Error('Intel HEX output supports 32-bit addresses only');
  }

  const pending: number[] = [];
  let upper = -1;
  let offset = 0;

  /**
   * Build one data record and any required extended-address record.
   *
   * @param size - Number of pending data bytes to emit.
   * @returns The optional extended-address record and the data record.
   */
  const takeRecord = (size: number): { extended?: string; data: string } => {
    const address = baseAddress + offset;
    if (address + size > 0x1_0000_0000) {
      throw new Error('Intel HEX output supports 32-bit addresses only');
    }
    const nextUpper = Math.floor(address / 0x10000);
    let extended: string | undefined;
    if (nextUpper !== upper) {
      upper = nextUpper;
      extended = hexRecord(0, 4, [(upper >> 8) & 0xff, upper & 0xff]);
    }
    const data = hexRecord(address & 0xffff, 0, pending.splice(0, size));
    offset += size;
    return { extended, data };
  };

  for await (const chunk of chunks) {
    pending.push(...chunk);
    while (pending.length > 0) {
      const address = baseAddress + offset;
      // Do not let a data record cross a 64 KiB boundary.
      const size = Math.min(16, 0x10000 - (address & 0xffff));
      if (pending.length < size) break;
      const { extended, data } = takeRecord(size);
      if (extended) yield utf8.encode(`${extended}\n`);
      yield utf8.encode(`${data}\n`);
    }
  }

  while (pending.length > 0) {
    const address = baseAddress + offset;
    const size = Math.min(16, 0x10000 - (address & 0xffff), pending.length);
    const { extended, data } = takeRecord(size);
    if (extended) yield utf8.encode(`${extended}\n`);
    yield utf8.encode(`${data}\n`);
  }
  yield utf8.encode(':00000001FF\n');
}
