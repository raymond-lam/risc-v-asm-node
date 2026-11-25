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

import { missingExtension, parseMarch, validateMarch } from '#assemble/march';

test('parseMarch: rv64imc parses to i,m,c', () => {
  const set = parseMarch('rv64imc');
  assert.ok(set.has('i'));
  assert.ok(set.has('m'));
  assert.ok(set.has('c'));
  // f,d,a are not implied
  assert.ok(!set.has('f'));
  assert.ok(!set.has('d'));
  assert.ok(!set.has('a'));
});

test('parseMarch: rv64gc expands g to i,m,a,f,d,zicsr,zifencei and includes c', () => {
  const set = parseMarch('rv64gc');
  assert.ok(set.has('i'));
  assert.ok(set.has('m'));
  assert.ok(set.has('a'));
  assert.ok(set.has('f'));
  assert.ok(set.has('d'));
  assert.ok(set.has('zicsr'));
  assert.ok(set.has('zifencei'));
  // c is included because it is explicitly in the ISA string "gc"
  assert.ok(set.has('c'));
  assert.ok(!set.has('v'));
});

test('parseMarch: rv64i_zicsr_zifencei parses underscore-separated extensions', () => {
  const set = parseMarch('rv64i_zicsr_zifencei');
  assert.ok(set.has('i'));
  assert.ok(set.has('zicsr'));
  assert.ok(set.has('zifencei'));
  assert.ok(!set.has('m'));
});

test('parseMarch: rv64im_zba_zbb parses mixed form', () => {
  const set = parseMarch('rv64im_zba_zbb');
  assert.ok(set.has('i'));
  assert.ok(set.has('m'));
  assert.ok(set.has('zba'));
  assert.ok(set.has('zbb'));
});

test('parseMarch: version digits in ISA string are ignored', () => {
  const set = parseMarch('rv64i2p1_m2p0');
  assert.ok(set.has('i'));
  assert.ok(set.has('m'));
});

test('parseMarch: version digits in underscore extensions are ignored', () => {
  const set = parseMarch('rv64i2p1_zicsr2p0_zifencei2p0');
  assert.ok(set.has('i'));
  assert.ok(set.has('zicsr'));
  assert.ok(set.has('zifencei'));
});

test('parseMarch: d implies f', () => {
  const set = parseMarch('rv64id');
  assert.ok(set.has('i'));
  assert.ok(set.has('d'));
  assert.ok(set.has('f'));
});

test('parseMarch: rv32 prefix works', () => {
  const set = parseMarch('rv32imc');
  assert.ok(set.has('i'));
  assert.ok(set.has('m'));
  assert.ok(set.has('c'));
});

test('parseMarch: rv64 alone implies i', () => {
  const set = parseMarch('rv64i');
  assert.ok(set.has('i'));
  assert.strictEqual(set.size, 1);
});

test('parseMarch: empty string throws', () => {
  assert.throws(() => parseMarch(''), /Malformed/);
});

test('parseMarch: no rv32/rv64 prefix throws', () => {
  assert.throws(() => parseMarch('imc'), /must start with rv32 or rv64/);
});

test('parseMarch: unknown single-letter extension throws', () => {
  assert.throws(() => parseMarch('rv64ix'), /Unknown extension/);
});

test('validateMarch: known extensions pass', () => {
  const set = parseMarch('rv64imafdc');
  validateMarch('rv64imafdc', set);
});

test('validateMarch: unknown extension throws', () => {
  const bad = new Set(['i', 'm', 'unknown_ext']);
  assert.throws(() => validateMarch('rv64im_unknown_ext', bad), /Unsupported extension/);
});

test('missingExtension: returns null when all present', () => {
  const allowed = new Set(['i', 'm', 'c']);
  assert.strictEqual(missingExtension(['i'], allowed), null);
  assert.strictEqual(missingExtension(['c'], allowed), null);
  assert.strictEqual(missingExtension(['i', 'm'], allowed), null);
});

test('missingExtension: returns missing atom', () => {
  const allowed = new Set(['i', 'm']);
  assert.strictEqual(missingExtension(['c'], allowed), 'c');
  assert.strictEqual(missingExtension(['v'], allowed), 'v');
});

test('missingExtension: first missing atom returned', () => {
  const allowed = new Set(['i']);
  assert.strictEqual(missingExtension(['m', 'c'], allowed), 'm');
  assert.strictEqual(missingExtension(['a', 'v'], allowed), 'a');
});

test('validateMarch: internal system atoms are known', () => {
  // 'system' and 's' are in KNOWN_EXTENSIONS (used by system instructions),
  // so they should pass validation.
  const set = new Set(['i', 'system']);
  validateMarch('rv64i_system', set);
});
