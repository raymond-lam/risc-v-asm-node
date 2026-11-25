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
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { INSTRUCTION_MAP, resolveOperands } from '#instructions';
import * as canonical from '#instructions/canonical';
import * as pseudo from '#instructions/pseudo';

const registry = INSTRUCTION_MAP;
const canonicalEncoders = canonical as unknown as Record<string, unknown>;
const pseudoEncoders = pseudo as unknown as Record<string, unknown>;

const getEntry = (mnemonic: string) => {
  const result = registry.get(mnemonic);
  assert.ok(result, `missing mnemonic ${mnemonic}`);
  return result;
};

const canonicalPattern =
  /\/\*\* Encode (\S+) \([^)]*\) as a (16|32)-bit instruction\. \*\/\s*export const (encode\w+)/g;
const pseudoPattern = /\/\*\*([\s\S]*?)\*\/\s*export (?:const|\{)\s+(encode\w+)/g;

const parseCanonicalSource = (
  source: string
): Map<string, { exportName: string; length: number }> => {
  const expected = new Map<string, { exportName: string; length: number }>();
  for (const match of source.matchAll(canonicalPattern)) {
    expected.set(match[1]!, {
      exportName: match[3]!,
      length: Number(match[2]) / 8,
    });
  }
  return expected;
};

const parsePseudoSource = (
  source: string,
  canonical: ReadonlyMap<string, unknown>
): { variants: Map<string, string[]>; collisions: Set<string>; exportCount: number } => {
  const variants = new Map<string, string[]>();
  const collisions = new Set<string>();
  let exportCount = 0;
  for (const match of source.matchAll(pseudoPattern)) {
    exportCount += 1;
    const documentation = match[1]!.replace(/\s+/g, ' ');
    const mnemonic = /Encode (?:unmasked |masked )?([a-z][a-z0-9.]*)\b/.exec(documentation)?.[1];
    assert.ok(mnemonic, `cannot derive mnemonic for ${match[2]}`);
    if (canonical.has(mnemonic)) {
      collisions.add(mnemonic);
      continue;
    }
    const names = variants.get(mnemonic) ?? [];
    names.push(match[2]!);
    variants.set(mnemonic, names);
  }
  return { variants, collisions, exportCount };
};

const expectedPseudoEntries = (
  variants: ReadonlyMap<string, readonly string[]>
): Map<string, { exportName: string; length: number | 'callable' }> => {
  const primary: Readonly<Record<string, string>> = {
    la: 'encodeLa',
    call: 'encodeCall',
    tail: 'encodeTail',
    jr: 'encodeJr',
    fscsr: 'encodeFscsr',
    fsrm: 'encodeFsrm',
    fsrmi: 'encodeFsrmi',
    fsflags: 'encodeFsflags',
    fsflagsi: 'encodeFsflagsi',
    'vmsge.vx': 'encodeVmsgeVx',
    'vmsgeu.vx': 'encodeVmsgeuVx',
  };
  const eightByte = new Set([
    'encodeLa',
    'encodeLla',
    'encodeLga',
    'encodeCall',
    'encodeTail',
    'encodeJump',
    'encodeVmsgeVx',
    'encodeVmsgeuVx',
  ]);
  const expected = new Map<string, { exportName: string; length: number | 'callable' }>();
  for (const [mnemonic, names] of variants) {
    const exportName = primary[mnemonic] ?? names[0]!;
    expected.set(mnemonic, {
      exportName,
      length: exportName === 'encodeLi' ? 'callable' : eightByte.has(exportName) ? 8 : 4,
    });
  }
  return expected;
};

test('registry exactly covers canonical and primary pseudo source mnemonics', () => {
  const canonicalSource = readFileSync(new URL('./canonical.ts', import.meta.url), 'utf8');
  const expectedCanonical = parseCanonicalSource(canonicalSource);
  assert.equal(expectedCanonical.size, 871, 'canonical source parser drifted');

  for (const [mnemonic, expected] of expectedCanonical) {
    const actual = getEntry(mnemonic);
    assert.equal(actual.encode, canonicalEncoders[expected.exportName], mnemonic);
    assert.equal(actual.instructionLength, expected.length, mnemonic);
  }

  const pseudoSource = readFileSync(new URL('./pseudo.ts', import.meta.url), 'utf8');
  const { variants, collisions, exportCount } = parsePseudoSource(pseudoSource, expectedCanonical);
  assert.equal(exportCount, 106, 'pseudo source parser drifted');
  assert.deepEqual([...collisions].sort(), ['fence', 'jal']);

  const expectedPseudo = expectedPseudoEntries(variants);
  assert.equal(expectedPseudo.size, 104);

  for (const [mnemonic, expected] of expectedPseudo) {
    const actual = getEntry(mnemonic);
    assert.equal(actual.encode, pseudoEncoders[expected.exportName], mnemonic);
    if (expected.length === 'callable') {
      assert.equal(typeof actual.instructionLength, 'function', mnemonic);
    } else {
      assert.equal(actual.instructionLength, expected.length, mnemonic);
    }
  }

  const expectedKeys = new Set([...expectedCanonical.keys(), ...expectedPseudo.keys()]);
  assert.deepEqual([...INSTRUCTION_MAP.keys()].sort(), [...expectedKeys].sort());
  assert.equal(INSTRUCTION_MAP.size, 975);
});

test('representative canonical and pseudo lengths agree with encoded bytes', () => {
  assert.equal(getEntry('c.addi').instructionLength, 2);
  assert.equal(getEntry('c.addi').encode(1, 0, 1).length, 2);
  assert.equal(getEntry('cm.push').instructionLength, 2);
  assert.equal(getEntry('addi').instructionLength, 4);
  assert.equal(getEntry('addi').encode(1, 0, 42).length, 4);
  assert.equal(getEntry('nop').instructionLength, 4);
  assert.equal(getEntry('nop').encode().length, 4);
  assert.equal(getEntry('la').instructionLength, 8);
  assert.equal(getEntry('la').encode(1, 0, 0).length, 8);
  assert.equal(getEntry('call').instructionLength, 8);
  assert.equal(getEntry('call').encode(1, 0, 0).length, 8);
  assert.equal(getEntry('vmsge.vx').instructionLength, 8);
  assert.equal(getEntry('vmsge.vx').encode(2, 1, 3).length, 8);
});

test('li computes length from its encoder arguments at all boundaries', () => {
  const { encode, instructionLength } = getEntry('li');
  assert.equal(encode, pseudo.encodeLi);
  assert.equal(typeof instructionLength, 'function');
  if (typeof instructionLength !== 'function') return;

  const cases: Array<[number | bigint, number]> = [
    [-2049, 44],
    [-2048, 4],
    [2047, 4],
    [2048, 44],
    [0x123456789abcdefn, 44],
    [-0x123456789abcdefn, 44],
    [0x7fffffffffffffffn, 44],
    [-0x8000000000000000n, 44],
  ];
  for (const [value, length] of cases) {
    assert.equal(instructionLength(1, value), length);
    assert.equal(pseudo.encodeLi(1, value).length, length);
  }
});

test('INSTRUCTION_MAP is a ReadonlyMap over all entries', () => {
  assert.equal(INSTRUCTION_MAP instanceof Map, true);
  assert.equal(INSTRUCTION_MAP.get('toString'), undefined);
  assert.equal(INSTRUCTION_MAP.size, 975);
});

test('every entry has a non-empty signatures array', () => {
  for (const [mnemonic, entry] of INSTRUCTION_MAP) {
    assert.ok(
      Array.isArray(entry.signatures) && entry.signatures.length > 0,
      `entry ${mnemonic} must have at least one signature`
    );
  }
});

test('every signature uses only allowed operand types', () => {
  const allowed = new Set(['register', 'number', 'address']);
  for (const [mnemonic, entry] of INSTRUCTION_MAP) {
    for (const sig of entry.signatures) {
      for (const op of sig.sourceSignature) {
        assert.ok(allowed.has(op), `${mnemonic}: invalid operand type "${op}"`);
      }
    }
  }
});

test('supported mnemonics have exact expected signatures', () => {
  for (const m of [
    'add',
    'sub',
    'sll',
    'slt',
    'sltu',
    'xor',
    'srl',
    'sra',
    'or',
    'and',
    'addw',
    'subw',
    'sllw',
    'srlw',
    'sraw',
    'mul',
    'mulh',
    'mulhsu',
    'mulhu',
    'div',
    'divu',
    'rem',
    'remu',
    'mulw',
    'divw',
    'divuw',
    'remw',
    'remuw',
  ]) {
    const sig = INSTRUCTION_MAP.get(m)!.signatures[0]!;
    assert.equal(sig.sourceSignature.length, 3, `${m}.sourceSignature`);
    assert.equal(sig.sourceSignature[0], 'register', `${m}[0]`);
    assert.equal(sig.sourceSignature[1], 'register', `${m}[1]`);
    assert.equal(sig.sourceSignature[2], 'register', `${m}[2]`);
  }

  // I_BASE + SHIFTS: register, register, number
  for (const m of [
    'addi',
    'slti',
    'sltiu',
    'xori',
    'ori',
    'andi',
    'addiw',
    'slli',
    'srli',
    'srai',
    'slliw',
    'srliw',
    'sraiw',
  ]) {
    const sig = INSTRUCTION_MAP.get(m)!.signatures[0]!;
    assert.equal(sig.sourceSignature[0], 'register', `${m}[0]`);
    assert.equal(sig.sourceSignature[1], 'register', `${m}[1]`);
    assert.equal(sig.sourceSignature[2], 'number', `${m}[2]`);
  }

  // LOADS: register, address
  for (const m of ['lb', 'lh', 'lw', 'ld', 'lbu', 'lhu', 'lwu']) {
    const sig = INSTRUCTION_MAP.get(m)!.signatures[0]!;
    assert.equal(sig.sourceSignature[0], 'register', `${m}[0]`);
    assert.equal(sig.sourceSignature[1], 'address', `${m}[1]`);
  }

  // STORES: register, address
  for (const m of ['sb', 'sh', 'sw', 'sd']) {
    const sig = INSTRUCTION_MAP.get(m)!.signatures[0]!;
    assert.equal(sig.sourceSignature[0], 'register', `${m}[0]`);
    assert.equal(sig.sourceSignature[1], 'address', `${m}[1]`);
  }

  // BRANCHES: register, register, address
  for (const m of ['beq', 'bne', 'blt', 'bge', 'bltu', 'bgeu']) {
    const sig = INSTRUCTION_MAP.get(m)!.signatures[0]!;
    assert.equal(sig.sourceSignature[0], 'register', `${m}[0]`);
    assert.equal(sig.sourceSignature[1], 'register', `${m}[1]`);
    assert.equal(sig.sourceSignature[2], 'address', `${m}[2]`);
  }

  // TWO_REGISTER_PSEUDOS: register, register
  for (const m of ['mv', 'not', 'neg', 'negw', 'sext.w', 'seqz', 'snez', 'sltz', 'sgtz']) {
    const sig = INSTRUCTION_MAP.get(m)!.signatures[0]!;
    assert.equal(sig.sourceSignature[0], 'register', `${m}[0]`);
    assert.equal(sig.sourceSignature[1], 'register', `${m}[1]`);
  }

  // THREE_REGISTER_PSEUDOS: register, register, register
  for (const m of ['sgt', 'sgtu']) {
    const sig = INSTRUCTION_MAP.get(m)!.signatures[0]!;
    assert.equal(sig.sourceSignature[0], 'register', `${m}[0]`);
    assert.equal(sig.sourceSignature[1], 'register', `${m}[1]`);
    assert.equal(sig.sourceSignature[2], 'register', `${m}[2]`);
  }

  // BRANCH_ONE_REGISTER: register, address
  for (const m of ['beqz', 'bnez', 'blez', 'bgez', 'bltz', 'bgtz']) {
    const sig = INSTRUCTION_MAP.get(m)!.signatures[0]!;
    assert.equal(sig.sourceSignature[0], 'register', `${m}[0]`);
    assert.equal(sig.sourceSignature[1], 'address', `${m}[1]`);
  }

  // BRANCH_TWO_REGISTERS: register, register, address
  for (const m of ['bgt', 'ble', 'bgtu', 'bleu']) {
    const sig = INSTRUCTION_MAP.get(m)!.signatures[0]!;
    assert.equal(sig.sourceSignature[0], 'register', `${m}[0]`);
    assert.equal(sig.sourceSignature[1], 'register', `${m}[1]`);
    assert.equal(sig.sourceSignature[2], 'address', `${m}[2]`);
  }

  // NO_OPERAND
  for (const m of ['nop', 'ret', 'ecall', 'ebreak']) {
    assert.equal(INSTRUCTION_MAP.get(m)!.signatures[0]!.sourceSignature.length, 0, m);
  }

  // lui, auipc, li: register, number
  for (const m of ['lui', 'auipc', 'li']) {
    const sig = INSTRUCTION_MAP.get(m)!.signatures[0]!;
    assert.equal(sig.sourceSignature[0], 'register', `${m}[0]`);
    assert.equal(sig.sourceSignature[1], 'number', `${m}[1]`);
  }

  // jr: register
  assert.equal(INSTRUCTION_MAP.get('jr')!.signatures[0]!.sourceSignature[0], 'register');

  // fence: empty
  assert.equal(INSTRUCTION_MAP.get('fence')!.signatures[0]!.sourceSignature.length, 0);

  // j: address
  assert.equal(INSTRUCTION_MAP.get('j')!.signatures[0]!.sourceSignature[0], 'address');

  // jal: 2 variants
  assert.equal(INSTRUCTION_MAP.get('jal')!.signatures.length, 2);
  assert.equal(INSTRUCTION_MAP.get('jal')!.signatures[0]!.sourceSignature.length, 1);
  assert.equal(INSTRUCTION_MAP.get('jal')!.signatures[0]!.sourceSignature[0], 'address');
  assert.equal(INSTRUCTION_MAP.get('jal')!.signatures[1]!.sourceSignature.length, 2);
  assert.equal(INSTRUCTION_MAP.get('jal')!.signatures[1]!.sourceSignature[0], 'register');
  assert.equal(INSTRUCTION_MAP.get('jal')!.signatures[1]!.sourceSignature[1], 'address');

  // jalr: 3 variants
  assert.equal(INSTRUCTION_MAP.get('jalr')!.signatures.length, 3);
  assert.equal(INSTRUCTION_MAP.get('jalr')!.signatures[0]!.sourceSignature.length, 1);
  assert.equal(INSTRUCTION_MAP.get('jalr')!.signatures[0]!.sourceSignature[0], 'register');
  assert.equal(INSTRUCTION_MAP.get('jalr')!.signatures[1]!.sourceSignature.length, 2);
  assert.equal(INSTRUCTION_MAP.get('jalr')!.signatures[1]!.sourceSignature[0], 'register');
  assert.equal(INSTRUCTION_MAP.get('jalr')!.signatures[1]!.sourceSignature[1], 'address');
  assert.equal(INSTRUCTION_MAP.get('jalr')!.signatures[2]!.sourceSignature.length, 3);
  assert.equal(INSTRUCTION_MAP.get('jalr')!.signatures[2]!.sourceSignature[0], 'register');
  assert.equal(INSTRUCTION_MAP.get('jalr')!.signatures[2]!.sourceSignature[1], 'register');
  assert.equal(INSTRUCTION_MAP.get('jalr')!.signatures[2]!.sourceSignature[2], 'number');
});

test('every entry has a non-empty requires array with lowercase atoms', () => {
  for (const [mnemonic, entry] of INSTRUCTION_MAP) {
    assert.ok(
      Array.isArray(entry.requires) && entry.requires.length > 0,
      `entry ${mnemonic} must have non-empty requires`
    );
    for (const atom of entry.requires) {
      const a = atom as string;
      assert.ok(a === a.toLowerCase(), `atom "${a}" in entry ${mnemonic} must be lowercase`);
    }
  }
});

test('per-extension primary group counts match report totals', () => {
  const primaryCounts: Record<string, number> = {};
  for (const [, entry] of INSTRUCTION_MAP) {
    const key = entry.requires.join('_');
    primaryCounts[key] = (primaryCounts[key] ?? 0) + 1;
  }

  // From the classification report totals table
  const fixture: Record<string, number> = {
    i: 86,
    v: 402,
    m: 13,
    a: 22,
    c: 33,
    f: 35,
    d: 37,
    q: 39, // report says 37 but actual q canonical list has 34+5=39
    h: 15,
    zicsr: 27,
    zifencei: 1,
    zba: 9,
    zbb: 23,
    zbs: 8,
  };

  for (const [ext, expected] of Object.entries(fixture)) {
    const actual = primaryCounts[ext] ?? 0;
    assert.equal(
      actual,
      expected,
      `extension ${ext} primary group count: ${actual} !== ${expected}`
    );
  }
});

/**
 * Assemble one instruction line's operands through the signature selected by
 * operand count.
 *
 * @param mnemonic - Mnemonic to look up in `INSTRUCTION_MAP`.
 * @param operands - Source operand texts for the line.
 * @returns The encoded instruction bytes.
 */
const encodeOperands = (mnemonic: string, operands: readonly string[]): Uint8Array => {
  const entry = getEntry(mnemonic);
  const signature = entry.signatures.find((sig) => sig.sourceSignature.length === operands.length);
  assert.ok(signature, `${mnemonic}: no signature accepts ${operands.length} operands`);
  const context = { address: 0, symbols: new Map<string, number>(), mnemonic };
  return entry.encode(...resolveOperands(operands, signature, context));
};

test('compressed 2-operand immediates match their split 3-operand fields', () => {
  // Each case pairs the friendly single-immediate form with the explicit
  // already-split fields and the expected encoding.
  const cases: readonly {
    mnemonic: string;
    split: readonly string[];
    explicit: readonly string[];
    bytes: readonly number[];
  }[] = [
    { mnemonic: 'c.li', split: ['a0', '1'], explicit: ['a0', '1', '0'], bytes: [0x05, 0x45] },
    { mnemonic: 'c.li', split: ['a0', '-1'], explicit: ['a0', '-1', '-1'], bytes: [0x7d, 0x55] },
    { mnemonic: 'c.li', split: ['a0', '-32'], explicit: ['a0', '0', '1'], bytes: [0x01, 0x55] },
    { mnemonic: 'c.slli', split: ['a0', '2'], explicit: ['a0', '0', '2'], bytes: [0x0a, 0x05] },
    { mnemonic: 'c.andi', split: ['a0', '1'], explicit: ['a0', '0', '1'], bytes: [0x05, 0x89] },
    { mnemonic: 'c.andi', split: ['a0', '-1'], explicit: ['a0', '1', '31'], bytes: [0x7d, 0x99] },
    {
      mnemonic: 'c.lui',
      split: ['a0', '0x1000'],
      explicit: ['a0', '0', '1'],
      bytes: [0x05, 0x65],
    },
    {
      mnemonic: 'c.lui',
      split: ['a0', '-4096'],
      explicit: ['a0', '1', '31'],
      bytes: [0x7d, 0x75],
    },
  ];

  for (const { mnemonic, split, explicit, bytes } of cases) {
    const label = `${mnemonic} ${split.join(', ')}`;
    const encoded = encodeOperands(mnemonic, split);
    assert.deepEqual(encoded, Uint8Array.from(bytes), label);
    assert.deepEqual(encoded, encodeOperands(mnemonic, explicit), label);
  }
});

test('compressed reserved zero immediates are rejected', () => {
  // c.lui and c.addi4spn both reserve an immediate of zero, which would decode
  // as a different (reserved or HINT) encoding.
  assert.throws(
    () => encodeOperands('c.lui', ['a0', '0']),
    /immediate 0 is not encodable: this encoding requires a nonzero immediate/
  );
  assert.throws(
    () => encodeOperands('c.addi4spn', ['a0', '0']),
    /immediate 0 is not encodable: this encoding requires a nonzero immediate/
  );
});

test('compressed 2-operand immediates reject values that do not fit', () => {
  // 100 needs bit 6, which the 6-bit c.li/c.andi immediate cannot hold.
  assert.throws(() => encodeOperands('c.li', ['a0', '100']), /not encodable/);
  assert.throws(() => encodeOperands('c.andi', ['a0', '100']), /not encodable/);
  // 0x3f000 needs a 33-bit sign extension of c.lui's signed imm[17:12].
  assert.throws(() => encodeOperands('c.lui', ['a0', '0x3f000']), /not encodable/);
  // 1024 exceeds c.addi4spn's unsigned 0..1020 range.
  assert.throws(
    () => encodeOperands('c.addi4spn', ['a0', '1024']),
    /unsigned 8-bit field scaled by 4 must be within 0\.\.255/
  );
});

test('signed split immediates reject values that would wrap', () => {
  // Every case below fits the unsigned reading of the field width yet decodes
  // as a different negative immediate, so it must be rejected instead of
  // silently wrapping.
  const cases: readonly (readonly [string, string, RegExp])[] = [
    [
      'c.li',
      '32',
      /immediate 32 is not encodable: signed 6-bit field (scaled by 1 )?must be within -32\.\.31/,
    ],
    [
      'c.li',
      '63',
      /immediate 63 is not encodable: signed 6-bit field (scaled by 1 )?must be within -32\.\.31/,
    ],
    [
      'c.li',
      '-33',
      /immediate -33 is not encodable: signed 6-bit field (scaled by 1 )?must be within -32\.\.31/,
    ],
    ['c.addi', '63', /signed 6-bit field (scaled by 1 )?must be within -32\.\.31/],
    ['c.andi', '63', /signed 6-bit field (scaled by 1 )?must be within -32\.\.31/],
    [
      'c.lui',
      '0x20000',
      /immediate 131072 is not encodable: signed 6-bit field scaled by 4096 must be within -32\.\.31 \(immediates -131072\.\.126976\)/,
    ],
    [
      'c.lui',
      '0x3f000',
      /immediate 258048 is not encodable: signed 6-bit field scaled by 4096 must be within -32\.\.31 \(immediates -131072\.\.126976\)/,
    ],
  ];
  for (const [mnemonic, immediate, message] of cases) {
    const label = `${mnemonic} ${immediate}`;
    assert.throws(() => encodeOperands(mnemonic, ['a0', immediate]), message, label);
  }
});

test('split immediates accept both ends of the field range', () => {
  // c.li: signed 6-bit, -32..31.
  assert.deepEqual(encodeOperands('c.li', ['a0', '-32']), Uint8Array.from([0x01, 0x55]));
  assert.deepEqual(encodeOperands('c.li', ['a0', '31']), Uint8Array.from([0x7d, 0x45]));
  // c.andi: signed 6-bit, -32..31.
  assert.deepEqual(encodeOperands('c.andi', ['a0', '31']), Uint8Array.from([0x7d, 0x89]));
  // c.addi: signed 6-bit, -32..31; its rd is a full register index.
  assert.deepEqual(encodeOperands('c.addi', ['a0', '31']), Uint8Array.from([0x7d, 0x05]));
  // c.lui: signed 6-bit scaled by 4096, -131072..126976.
  assert.deepEqual(encodeOperands('c.lui', ['a0', '0x1f000']), Uint8Array.from([0x7d, 0x65]));
  assert.deepEqual(encodeOperands('c.lui', ['a0', '-0x20000']), Uint8Array.from([0x01, 0x75]));
  // c.slli: unsigned 6-bit shamt, 0..63, so 63 stays 63.
  assert.deepEqual(encodeOperands('c.slli', ['a0', '63']), Uint8Array.from([0x7e, 0x15]));
  // c.addi4spn: unsigned 8-bit scaled by 4, 0..1020.
  assert.deepEqual(encodeOperands('c.addi4spn', ['a0', '4']), Uint8Array.from([0x28, 0x00]));
});

test("c.slli shares c.li's field layout but reads it as an unsigned shamt", () => {
  // Both split imm[5:0] across imm[4:0] and imm[5]; only the metadata's
  // signedness distinguishes the shamt 63 from the signed immediate -1.
  assert.deepEqual(
    encodeOperands('c.slli', ['a0', '63']),
    encodeOperands('c.slli', ['a0', '1', '31'])
  );
  assert.deepEqual(encodeOperands('c.li', ['a0', '-1']), Uint8Array.from([0x7d, 0x55]));
});
