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

/**
 * Test helper: collect the full encoding result from the encode generator.
 * This is a convenience wrapper used only by tests; it is not part of the
 * production public API.
 */

import { encode } from '#assemble/encode';
import type { EncodeMetadata } from '#assemble/encode';

/**
 * Iterate the encode generator and concatenate all instruction byte chunks
 * into a single buffer, returning both the complete `.text` section and the
 * collected metadata.
 *
 * @param lines - Source lines in assembly order.
 * @param symbols - Symbol-table mapping label names to byte addresses.
 * @param baseAddress - Address assigned to the first instruction byte.
 * @returns Concatenated text bytes and encoding metadata.
 */
export const collectEncode = async (
  lines: AsyncIterable<string>,
  symbols: ReadonlyMap<string, number>,
  baseAddress = 0
): Promise<{ readonly textBytes: Uint8Array } & EncodeMetadata> => {
  const chunks: Uint8Array[] = [];
  const it = encode(lines, symbols, baseAddress);
  let result = await it.next();
  while (!result.done) {
    chunks.push(result.value);
    result = await it.next();
  }
  const meta: EncodeMetadata = result.value;
  const textBytes = new Uint8Array(meta.totalTextSize);
  let offset = 0;
  for (const chunk of chunks) {
    textBytes.set(chunk, offset);
    offset += chunk.length;
  }
  return { ...meta, textBytes };
};
