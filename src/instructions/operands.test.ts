import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveOperands } from '#instructions';
import type { InstructionSignature } from '#instructions';

const emptySymbols = new Map<string, number>();
const noContext = { address: 0, symbols: emptySymbols };

// Helper: a single-register signature
const regSig: InstructionSignature = {
  sourceSignature: ['register'],
  encoderSignature: [{ type: 'register', sourceOperand: 0 }],
};

const numSig: InstructionSignature = {
  sourceSignature: ['number'],
  encoderSignature: [{ type: 'number', sourceOperand: 0 }],
};

// ── register resolution ──

test('resolveRegister x0-x31', () => {
  for (let i = 0; i <= 31; i++) {
    const result = resolveOperands([`x${i}`], regSig, noContext);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], i);
  }
});

test('resolveRegister ABI aliases', () => {
  const check = (name: string, expected: number) => {
    const result = resolveOperands([name], regSig, noContext);
    assert.strictEqual(result[0], expected, `${name} → ${expected}`);
  };
  check('a0', 10);
  check('sp', 2);
  check('gp', 3);
  check('tp', 4);
  check('t0', 5);
  check('t1', 6);
  check('t2', 7);
  check('s0', 8);
  check('fp', 8);
  check('s1', 9);
  check('a1', 11);
  check('a7', 17);
  check('s11', 27);
  check('t6', 31);
  check('zero', 0);
  check('ra', 1);
});

test('resolveRegister unknown returns 0', () => {
  const result = resolveOperands(['badreg'], regSig, noContext);
  assert.strictEqual(result[0], 0);
});

// ── number resolution ──

test('resolveNumber literal', () => {
  const result = resolveOperands(['42'], numSig, noContext);
  assert.strictEqual(result[0], 42);
});

test('resolveNumber symbol', () => {
  const symbols = new Map([['myval', 42]]);
  const result = resolveOperands(['myval'], numSig, { address: 0, symbols });
  assert.strictEqual(result[0], 42);
});

test('resolveNumber unknown symbol returns 0', () => {
  const result = resolveOperands(['unknown'], numSig, noContext);
  assert.strictEqual(result[0], 0);
});

test('resolveNumber relative through address offset', () => {
  // Symbol at address 8, current address 16 → relative offset = -8
  const symbols = new Map([['target', 8]]);
  const relSig: InstructionSignature = {
    sourceSignature: ['address'],
    encoderSignature: [
      { type: 'address', sourceOperand: 0, addressPart: 'offset', relative: true },
    ],
  };
  const result = resolveOperands(['target'], relSig, { address: 16, symbols });
  assert.strictEqual(result[0], -8);
});

// ── constant ──

test('resolveOperands constant', () => {
  const constSig: InstructionSignature = {
    sourceSignature: [],
    encoderSignature: [{ type: 'constant', value: 1 }],
  };
  const result = resolveOperands([], constSig, noContext);
  assert.deepEqual(result, [1]);
});

// ── address: offset(base) ──

test('resolveAddress offset(base) produces base and offset', () => {
  // ld x1, 8(x2): rd=x1=1, base=x2=2, offset=8
  const loadAddrSig: InstructionSignature = {
    sourceSignature: ['register', 'address'],
    encoderSignature: [
      { type: 'register', sourceOperand: 0 },
      { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
      { type: 'address', sourceOperand: 1, addressPart: 'offset', relative: false },
    ],
  };
  const result = resolveOperands(['x1', '8(x2)'], loadAddrSig, noContext);
  assert.strictEqual(result[0], 1);
  assert.strictEqual(result[1], 2);
  assert.strictEqual(result[2], 8);
});

test('resolveAddress empty offset in offset(base)', () => {
  // ld x1, (x2): offset=0, base=2
  const loadAddrSig: InstructionSignature = {
    sourceSignature: ['register', 'address'],
    encoderSignature: [
      { type: 'register', sourceOperand: 0 },
      { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
      { type: 'address', sourceOperand: 1, addressPart: 'offset', relative: false },
    ],
  };
  const result = resolveOperands(['x1', '(x2)'], loadAddrSig, noContext);
  assert.strictEqual(result[0], 1);
  assert.strictEqual(result[1], 2);
  assert.strictEqual(result[2], 0);
});

// ── address: split immediate (offsetHigh/offsetLow) ──

test('resolveAddress store split immediate offsetHigh/offsetLow', () => {
  // sd x1, 36(x2): offset 36 → high=(36>>5)&0x7f=1, low=36&0x1f=4
  const storeSig: InstructionSignature = {
    sourceSignature: ['register', 'address'],
    encoderSignature: [
      { type: 'register', sourceOperand: 0 },
      { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
      { type: 'address', sourceOperand: 1, addressPart: 'offsetHigh', relative: false },
      { type: 'address', sourceOperand: 1, addressPart: 'offsetLow', relative: false },
    ],
  };
  const result = resolveOperands(['x1', '36(x2)'], storeSig, noContext);
  assert.strictEqual(result[0], 1);
  assert.strictEqual(result[1], 2);
  assert.strictEqual(result[2], 1);
  assert.strictEqual(result[3], 4);
});

// ── address: branch offset ──

test('resolveAddress branchOffsetHigh/branchOffsetLow from literal', () => {
  // beq x1, x2, 8: branch offset = 8 (relative)
  // branchOffsetHigh = ((8>>5)&0x3f) | ((8>>12)&1)<<6 = 0 | 0 = 0
  // branchOffsetLow = (((8>>1)&0xf)<<1) | ((8>>11)&1) = (4<<1)|0 = 8
  const branchSig: InstructionSignature = {
    sourceSignature: ['register', 'register', 'address'],
    encoderSignature: [
      { type: 'register', sourceOperand: 0 },
      { type: 'register', sourceOperand: 1 },
      { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
      { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
    ],
  };
  const result = resolveOperands(['x1', 'x2', '8'], branchSig, noContext);
  assert.strictEqual(result[0], 1);
  assert.strictEqual(result[1], 2);
  assert.strictEqual(result[2], 0);
  assert.strictEqual(result[3], 8);
});

// ── address: jump offset ──

test('resolveAddress jumpOffset from literal', () => {
  // jal 8: jump offset = 8 → jimm20 = 0x800
  const jumpSig: InstructionSignature = {
    sourceSignature: ['address'],
    encoderSignature: [
      { type: 'address', sourceOperand: 0, addressPart: 'jumpOffset', relative: true },
    ],
  };
  const result = resolveOperands(['8'], jumpSig, noContext);
  assert.strictEqual(result[0], 0x800);
});

// ── address: relative addressing ──

test('resolveAddress branchOffset with symbol resolves relative', () => {
  const symbols = new Map([['target', 0x1008]]);
  const ctx = { address: 0x1000, symbols };
  const branchSig: InstructionSignature = {
    sourceSignature: ['address'],
    encoderSignature: [
      { type: 'address', sourceOperand: 0, addressPart: 'branchOffsetHigh', relative: true },
      { type: 'address', sourceOperand: 0, addressPart: 'branchOffsetLow', relative: true },
    ],
  };
  // target - current = 0x1008 - 0x1000 = 8
  // branchOffsetHigh = ((8>>5)&0x3f) | ((8>>12)&1)<<6 = 0
  // branchOffsetLow = (((8>>1)&0xf)<<1) | ((8>>11)&1) = 8
  const result = resolveOperands(['target'], branchSig, ctx);
  assert.deepEqual(result, [0, 8]);
});

// ── malformed address ──

test('resolveAddress malformed text with addressPart base returns 0', () => {
  // Bare text without parens when encoder expects base → returns 0
  const badBaseSig: InstructionSignature = {
    sourceSignature: ['address'],
    encoderSignature: [{ type: 'address', sourceOperand: 0, addressPart: 'base', relative: false }],
  };
  const result = resolveOperands(['x2'], badBaseSig, noContext);
  assert.strictEqual(result[0], 0);
});
