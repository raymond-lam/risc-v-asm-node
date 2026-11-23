import { Readable } from 'node:stream';

/**
 * Turn an array of source lines into an async line stream.
 *
 * @param lines - Source lines in assembly order.
 * @returns An async iterable over the supplied lines.
 */
export const sourceLines = (lines: readonly string[]): AsyncIterable<string> =>
  Readable.from(lines);

/**
 * Collect an async byte stream into one contiguous buffer.
 *
 * @param chunks - Byte chunks in output order.
 * @returns All chunks concatenated into a single `Uint8Array`.
 */
export const collectBytes = async (chunks: AsyncIterable<Uint8Array>): Promise<Uint8Array> => {
  const collected: Uint8Array[] = [];
  let length = 0;
  for await (const chunk of chunks) {
    collected.push(chunk);
    length += chunk.length;
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of collected) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
};
