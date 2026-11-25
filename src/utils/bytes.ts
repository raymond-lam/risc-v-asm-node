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
 * Serialize a value into a 32-bit little-endian byte sequence.
 * Only the low 32 bits of the input are used.
 *
 * @param value - Numeric value to serialize.
 * @returns A four-byte little-endian `Uint8Array`.
 */
export const bytes32 = (value: number): Uint8Array => {
  const bytes = new Uint8Array(4);
  bytes[0] = value & 0xff;
  bytes[1] = (value >>> 8) & 0xff;
  bytes[2] = (value >>> 16) & 0xff;
  bytes[3] = (value >>> 24) & 0xff;
  return bytes;
};

/**
 * Serialize a value into a 16-bit little-endian byte sequence.
 * Only the low 16 bits of the input are used.
 *
 * @param value - Numeric value to serialize.
 * @returns A two-byte little-endian `Uint8Array`.
 */
export const bytes16 = (value: number): Uint8Array => {
  const bytes = new Uint8Array(2);
  bytes[0] = value & 0xff;
  bytes[1] = (value >>> 8) & 0xff;
  return bytes;
};

/**
 * Serialize a nonnegative value into a 64-bit little-endian byte sequence.
 * JavaScript numbers can represent at most 53-bit integers precisely, so the
 * caller must ensure that the value fits within the safe integer range.
 *
 * @param value - Nonnegative integer to serialize.
 * @returns An eight-byte little-endian `Uint8Array`.
 */
export const bytes64 = (value: number): Uint8Array => {
  // JavaScript's >> operator masks the shift count to 5 bits (32-bit), so
  // value >> 32 would equal value >> 0 for non-negative values.  Use
  // integer division to obtain the upper 32 bits safely.
  const low32 = value & 0xffff_ffff;
  const high32 = Math.floor(value / 0x1_0000_0000) & 0xffff_ffff;
  const bytes = new Uint8Array(8);
  bytes[0] = low32 & 0xff;
  bytes[1] = (low32 >>> 8) & 0xff;
  bytes[2] = (low32 >>> 16) & 0xff;
  bytes[3] = (low32 >>> 24) & 0xff;
  bytes[4] = high32 & 0xff;
  bytes[5] = (high32 >>> 8) & 0xff;
  bytes[6] = (high32 >>> 16) & 0xff;
  bytes[7] = (high32 >>> 24) & 0xff;
  return bytes;
};
