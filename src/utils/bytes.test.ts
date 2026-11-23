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

import { bytes16, bytes32 } from '#utils/bytes';

test('bytes32 serializes 32-bit values little-endian', () => {
  assert.deepEqual(bytes32(0x1234_5678), Uint8Array.from([0x78, 0x56, 0x34, 0x12]));
  assert.deepEqual(bytes32(0xffff_ffff), Uint8Array.from([0xff, 0xff, 0xff, 0xff]));
});

test('bytes32 uses only the low 32 bits', () => {
  assert.deepEqual(bytes32(0x1_2345_6789), Uint8Array.from([0x89, 0x67, 0x45, 0x23]));
});

test('bytes16 serializes 16-bit values little-endian', () => {
  assert.deepEqual(bytes16(0xabcd), Uint8Array.from([0xcd, 0xab]));
  assert.deepEqual(bytes16(0xffff), Uint8Array.from([0xff, 0xff]));
});

test('bytes16 uses only the low 16 bits', () => {
  assert.deepEqual(bytes16(0x1234_abcd), Uint8Array.from([0xcd, 0xab]));
});
