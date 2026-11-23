import assert from 'node:assert/strict';
import test from 'node:test';
import { parseIntegerLiteral, parseInstruction } from '#parse';

test('parseIntegerLiteral', () => {
  assert.strictEqual(parseIntegerLiteral('42'), 42n);
  assert.strictEqual(parseIntegerLiteral('0xFF'), 255n);
  assert.strictEqual(parseIntegerLiteral('0b1010'), 10n);
  assert.strictEqual(parseIntegerLiteral('0o77'), 63n);
  assert.strictEqual(parseIntegerLiteral('+42'), 42n);
  assert.strictEqual(parseIntegerLiteral('-42'), -42n);
  assert.strictEqual(parseIntegerLiteral('0x_'), null);
  assert.strictEqual(parseIntegerLiteral('0b_'), null);
  assert.strictEqual(parseIntegerLiteral('0o_'), null);
  assert.strictEqual(parseIntegerLiteral('abc'), null);
  assert.strictEqual(parseIntegerLiteral(''), null);
});

test('parseInstruction', () => {
  assert.deepEqual(parseInstruction('addi x1, x0, 42'), {
    mnemonic: 'addi',
    operands: ['x1', 'x0', '42'],
  });
  assert.deepEqual(parseInstruction('nop'), { mnemonic: 'nop', operands: [] });
  assert.deepEqual(parseInstruction('label: addi x1, x0, 1'), {
    mnemonic: 'addi',
    operands: ['x1', 'x0', '1'],
  });
  assert.deepEqual(parseInstruction('addi x1, x0, 42  # comment'), {
    mnemonic: 'addi',
    operands: ['x1', 'x0', '42'],
  });
  assert.deepEqual(parseInstruction('addi x1, x0, 1  // comment'), {
    mnemonic: 'addi',
    operands: ['x1', 'x0', '1'],
  });
  assert.deepEqual(parseInstruction('  # comment'), null);
  assert.deepEqual(parseInstruction('  // comment'), null);
  assert.deepEqual(parseInstruction('label1: label2: addi x1, x0, 1'), {
    mnemonic: 'addi',
    operands: ['x1', 'x0', '1'],
  });
  assert.deepEqual(parseInstruction('label  : addi x1, x0, 1'), {
    mnemonic: 'addi',
    operands: ['x1', 'x0', '1'],
  });
  assert.deepEqual(parseInstruction('outer: inner: nop'), { mnemonic: 'nop', operands: [] });
  assert.deepEqual(parseInstruction('label:'), null);
  assert.deepEqual(parseInstruction(''), null);
  assert.deepEqual(parseInstruction('   '), null);
  assert.deepEqual(parseInstruction('ADDI x1, x0, 1'), {
    mnemonic: 'addi',
    operands: ['x1', 'x0', '1'],
  });
});
