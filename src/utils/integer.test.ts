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

import { safeInteger } from '#utils/integer';

test('safeInteger converts values within the nonnegative safe range', () => {
  assert.strictEqual(safeInteger(0n, 'value'), 0);
  assert.strictEqual(safeInteger(42n, 'value'), 42);
  assert.strictEqual(
    safeInteger(BigInt(Number.MAX_SAFE_INTEGER), 'value'),
    Number.MAX_SAFE_INTEGER
  );
});

test('safeInteger rejects negative values', () => {
  assert.throws(
    () => safeInteger(-1n, 'value'),
    /value must be a nonnegative safe integer, got -1/
  );
});

test('safeInteger rejects values outside the safe integer range', () => {
  assert.throws(
    () => safeInteger(BigInt(Number.MAX_SAFE_INTEGER) + 1n, 'value'),
    /value must be a nonnegative safe integer/
  );
  assert.throws(
    () => safeInteger(0x1_0000_0000_0000_0000n, 'value'),
    /value must be a nonnegative safe integer/
  );
});
