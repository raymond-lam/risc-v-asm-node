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

import * as publicApi from '#index';
import { collectBytes } from '#testing/stream';

test('public barrel exposes exactly the assemble function', async () => {
  assert.deepEqual(Object.keys(publicApi), ['assemble']);
  const output = publicApi.assemble('nop');
  assert.strictEqual(typeof output.next, 'function');
  const buf = await collectBytes(output);
  // The ELF output should start with ELF magic (0x7f 'E' 'L' 'F')
  assert.strictEqual(buf[0], 0x7f);
  assert.strictEqual(buf[1], 0x45);
  assert.strictEqual(buf[2], 0x4c);
  assert.strictEqual(buf[3], 0x46);
});
