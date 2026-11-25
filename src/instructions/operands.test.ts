import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveOperands, selectSignature } from '#instructions';
import type { InstructionSignature } from '#instructions';

const emptySymbols = new Map<string, number>();
// These unit signatures carry no mnemonic of their own; the label only
// reaches metadata diagnostics.
const noContext = { address: 0, symbols: emptySymbols, mnemonic: 'test' };

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
  const result = resolveOperands(['myval'], numSig, { address: 0, symbols, mnemonic: 'test' });
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
  const result = resolveOperands(['target'], relSig, { address: 16, symbols, mnemonic: 'test' });
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

// ── numberPart: compressed immediate bit fields ──

const numberPartSig = (
  fields: readonly (readonly [number, number])[],
  signed: boolean,
  nonzero = false
): InstructionSignature => ({
  sourceSignature: ['number'],
  encoderSignature: fields.map((bits) => ({
    type: 'numberPart' as const,
    sourceOperand: 0,
    bits,
    signed,
    nonzero,
  })),
});

// c.li's signed imm[5:0] is split across imm[4:0] and imm[5], so the union covers
// bits 0..5.
const ciSig = numberPartSig(
  [
    [0, 4],
    [5, 5],
  ],
  true
);

test("numberPart splits immediates with two's-complement arithmetic", () => {
  // c.li a0, -1 encodes imm[4:0]=0x1f and imm[5]=1.
  assert.deepEqual(resolveOperands(['-1'], ciSig, noContext), [0x1f, 1]);
  // c.li a0, -32 keeps the sign in bit 5 and leaves imm[4:0] clear.
  assert.deepEqual(resolveOperands(['-32'], ciSig, noContext), [0, 1]);
});

test('numberPart rejects immediates that do not fit its field', () => {
  // 100 and 63 exceed the 5-bit field's signed range of -16..15.
  assert.throws(
    () => resolveOperands(['100'], numberPartSig([[0, 4]], true), noContext),
    /not encodable/
  );
  assert.throws(
    () => resolveOperands(['63'], numberPartSig([[0, 4]], true), noContext),
    /not encodable/
  );
  // The same field read as unsigned holds 0..31.
  assert.deepEqual(resolveOperands(['31'], numberPartSig([[0, 4]], false), noContext), [31]);
  assert.throws(
    () => resolveOperands(['32'], numberPartSig([[0, 4]], false), noContext),
    /not encodable/
  );
});

test('numberPart rejects zero for a union that declares nonzero', () => {
  // c.lui and c.addi4spn reserve zero, so the union rejects it before the
  // alignment and range checks.  Other unions keep accepting zero.
  const luiSig = numberPartSig(
    [
      [17, 17],
      [12, 16],
    ],
    true,
    true
  );
  assert.throws(
    () => resolveOperands(['0'], luiSig, noContext),
    /immediate 0 is not encodable: this encoding requires a nonzero immediate/
  );
  assert.deepEqual(resolveOperands(['4096'], luiSig, noContext), [0, 1]);
  assert.deepEqual(resolveOperands(['0'], ciSig, noContext), [0, 0]);
});

test('numberPart rejects a union that mixes signed and unsigned fields', () => {
  const mixedSig: InstructionSignature = {
    sourceSignature: ['number'],
    encoderSignature: [
      { type: 'numberPart', sourceOperand: 0, bits: [0, 4], signed: true, nonzero: false },
      { type: 'numberPart', sourceOperand: 0, bits: [5, 5], signed: false, nonzero: false },
    ],
  };
  assert.throws(
    () => resolveOperands(['1'], mixedSig, noContext),
    /internal metadata error: test declares both signed and unsigned numberPart fields for operand 0/
  );
});

test('numberPart rejects immediates with nonzero bits below the union', () => {
  // c.lui's imm[17:12] union starts at bit 12: the value is scaled by 4096.
  const luiSig = numberPartSig(
    [
      [17, 17],
      [12, 16],
    ],
    true
  );
  assert.throws(
    () => resolveOperands(['1'], luiSig, noContext),
    /immediate 1 is misaligned: bits 0\.\.11 must be zero/
  );
  assert.deepEqual(resolveOperands(['4096'], luiSig, noContext), [0, 1]);
  // c.addi4spn's single imm[9:2] field starts at bit 2.
  const addi4spnSig = numberPartSig([[2, 9]], false);
  assert.throws(
    () => resolveOperands(['5'], addi4spnSig, noContext),
    /immediate 5 is misaligned: bits 0\.\.1 must be zero/
  );
  assert.deepEqual(resolveOperands(['4'], addi4spnSig, noContext), [1]);
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
  const ctx = { address: 0x1000, symbols, mnemonic: 'test' };
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

// ── signature selection ──

const rawNumberSig: InstructionSignature = {
  sourceSignature: ['number', 'number'],
  encoderSignature: [
    { type: 'number', sourceOperand: 0 },
    { type: 'number', sourceOperand: 1 },
  ],
};
const storeSpSig: InstructionSignature = {
  sourceSignature: ['register', 'address'],
  encoderSignature: [
    { type: 'register', sourceOperand: 0 },
    { type: 'address', sourceOperand: 1, addressPart: 'cOffsetSpWord', relative: false },
  ],
};

test('selectSignature prefers the register/address form over the raw number form', () => {
  const selected = selectSignature([rawNumberSig, storeSpSig], ['a0', '4(sp)']);
  assert.strictEqual(selected, storeSpSig);
});

test('selectSignature keeps the raw number form for register-free operands', () => {
  const selected = selectSignature([rawNumberSig, storeSpSig], ['10', '4']);
  assert.strictEqual(selected, rawNumberSig);
});

test('selectSignature treats an offset(base) operand as compatible with address', () => {
  const addressSig: InstructionSignature = {
    sourceSignature: ['address'],
    encoderSignature: [
      { type: 'address', sourceOperand: 0, addressPart: 'offset', relative: false },
    ],
  };
  assert.strictEqual(selectSignature([addressSig], ['4(badreg)']), addressSig);
  assert.strictEqual(selectSignature([addressSig], ['%hi(sym)']), addressSig);
  assert.strictEqual(selectSignature([addressSig], ['sym']), addressSig);
});

test('selectSignature falls back to the first arity match when no shape fits', () => {
  // A register is neither a raw number nor a complete address operand.
  assert.strictEqual(selectSignature([rawNumberSig, storeSpSig], ['a0', 'sp']), rawNumberSig);
});

test('selectSignature returns undefined when no signature has that arity', () => {
  assert.strictEqual(selectSignature([storeSpSig], []), undefined);
  assert.strictEqual(selectSignature([storeSpSig], ['x1']), undefined);
});
