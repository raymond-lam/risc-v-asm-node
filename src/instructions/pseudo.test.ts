import assert from 'node:assert/strict';
import test from 'node:test';

import {
  encodeAddi,
  encodeAddiw,
  encodeAndi,
  encodeAuipc,
  encodeFence,
  encodeJal as encodeJalCanonical,
  encodeJalr,
  encodeLd,
  encodePackw,
  encodeVfsgnjnVv,
  encodeVfsgnjxVv,
  encodeVl1re8V,
  encodeVmandMm,
  encodeVmnandMm,
  encodeVmseqVv,
  encodeVmsgtVi,
  encodeVmsgtuVi,
  encodeVmsleVv,
  encodeVmsleVi,
  encodeVmsleuVv,
  encodeVmsleuVi,
  encodeVmsltVv,
  encodeVmsltVx,
  encodeVmsltuVv,
  encodeVmsltuVx,
  encodeVmsneVv,
  encodeVnsrlWx,
  encodeVrsubVx,
  encodeVwaddVx,
  encodeVwadduVx,
  encodeVxorVi,
  encodeSlli,
  encodeSubw,
} from '#instructions/canonical';
import {
  encodeCall,
  encodeLa,
  encodeLga,
  encodeLi,
  encodeLla,
  encodeMv,
  encodeNegw,
  encodeNop,
  encodePause,
  encodeTail,
  encodeJump,
  encodeVfnegV,
  encodeVfabsV,
  encodeVl1rV,
  encodeVmmvM,
  encodeVmnotM,
  encodeVmsgeVi,
  encodeVmsgeuVi,
  encodeVmsgeVv,
  encodeVmsgeuVv,
  encodeVmsgeVx,
  encodeVmsgeuVx,
  encodeVmsgtVv,
  encodeVmsgtuVv,
  encodeVmsltVi,
  encodeVmsltuVi,
  encodeVncvtXXW,
  encodeVnegV,
  encodeVnotV,
  encodeVwcvtXXV,
  encodeVwcvtuXXV,
  encodeZextB,
  encodeZextH,
} from '#instructions/pseudo';
import * as pseudo from '#instructions/pseudo';

const concat = (...instructions: Uint8Array[]): Uint8Array => {
  const result = new Uint8Array(
    instructions.reduce((length, instruction) => length + instruction.length, 0)
  );
  let offset = 0;
  for (const instruction of instructions) {
    result.set(instruction, offset);
    offset += instruction.length;
  }
  return result;
};

const assertBytes = (actual: Uint8Array, expected: Uint8Array): void => {
  assert.deepEqual(actual, expected);
};

test('known-good nop and mv controls use RV64I aliases', () => {
  assertBytes(encodeNop(), encodeAddi(0, 0, 0));
  assertBytes(encodeMv(9, 10), encodeAddi(9, 10, 0));
});

test('negw uses subw rather than sub', () => {
  assertBytes(encodeNegw(9, 10), encodeSubw(9, 0, 10));
});

test("zext.b and zext.h use the frozen manual's canonical mappings", () => {
  assertBytes(encodeZextB(9, 10), encodeAndi(9, 10, 255));
  assertBytes(encodeZextH(9, 10), encodePackw(9, 10, 0));
});

test('fence and pause use their required fence fields', () => {
  assertBytes(pseudo.encodeFence(), encodeFence(0, 0xf, 0xf, 0, 0));
  assertBytes(encodePause(), encodeFence(0, 0x1, 0, 0, 0));
});

test('la and lla use auipc plus addi for local addresses', () => {
  const expected = concat(encodeAuipc(5, 0x12345), encodeAddi(5, 5, -2048));
  assertBytes(encodeLa(5, 0x12345, -2048), expected);
  assertBytes(encodeLla(5, 0x12345, -2048), expected);
});

test('tail uses x6 as its default scratch register', () => {
  assertBytes(encodeTail(0x12345, -2048), concat(encodeAuipc(6, 0x12345), encodeJalr(0, 6, -2048)));
});

test('call with an explicit link register is a known-good control', () => {
  assertBytes(
    encodeCall(1, 0x12345, -2048),
    concat(encodeAuipc(1, 0x12345), encodeJalr(1, 1, -2048))
  );
});

const expectedLi = (rd: number, value: bigint): Uint8Array => {
  const normalized = BigInt.asIntN(64, value);
  if (normalized >= -2048n && normalized <= 2047n) {
    return encodeAddi(rd, 0, Number(normalized));
  }

  const unsigned = BigInt.asUintN(64, normalized);
  const instructions: Uint8Array[] = [encodeAddi(rd, 0, Number(normalized >> 55n))];
  for (let shift = 44n; shift >= 0n; shift -= 11n) {
    instructions.push(
      encodeSlli(rd, rd, 11),
      encodeAddi(rd, rd, Number((unsigned >> shift) & 0x7ffn))
    );
  }
  return concat(...instructions);
};

test('li handles RV64 boundaries with the specified generic expansion', () => {
  const values = [
    0n,
    1n,
    -1n,
    2047n,
    2048n,
    -2048n,
    -2049n,
    0x7fff_ffffn,
    0x8000_0000n,
    -0x8000_0000n,
    -0x8000_0001n,
    0x7fff_ffff_ffff_ffffn,
    -0x8000_0000_0000_0000n,
  ];
  for (const value of values) {
    assertBytes(encodeLi(9, value), expectedLi(9, value));
  }
});

test('sext.w remains the RV64 addiw alias', async () => {
  const { encodeSextW } = await import('#instructions/pseudo');
  assertBytes(encodeSextW(9, 10), encodeAddiw(9, 10, 0));
});

test('j, jal, and jump use their distinct canonical expansions', () => {
  assertBytes(pseudo.encodeJ(0x12345), encodeJalCanonical(0, 0x12345));
  assertBytes(pseudo.encodeJal(0x12345), encodeJalCanonical(1, 0x12345));
  assertBytes(
    encodeJump(6, 0x12345, -2048),
    concat(encodeAuipc(6, 0x12345), encodeJalr(0, 6, -2048))
  );
});

test('vector unary aliases use unmasked canonical operands', () => {
  assertBytes(encodeVfnegV(3, 4), encodeVfsgnjnVv(1, 4, 4, 3));
  assertBytes(encodeVfabsV(3, 4), encodeVfsgnjxVv(1, 4, 4, 3));
  assertBytes(encodeVnegV(3, 4), encodeVrsubVx(1, 4, 0, 3));
  assertBytes(encodeVnotV(3, 4, 0), encodeVxorVi(0, 4, -1, 3));
});

test('vector mask and whole-register aliases preserve operand order', () => {
  assertBytes(encodeVmmvM(3, 4), encodeVmandMm(4, 4, 3));
  assertBytes(encodeVmnotM(3, 4), encodeVmnandMm(4, 4, 3));
  assertBytes(encodeVl1rV(3, 5), encodeVl1re8V(5, 3));
});

test('vector immediate comparison aliases handle normal and zero cases', () => {
  assertBytes(encodeVmsgeVi(3, 4, 8, 0), encodeVmsgtVi(0, 4, 7, 3));
  assertBytes(encodeVmsgeuVi(3, 4, 8, 0), encodeVmsgtuVi(0, 4, 7, 3));
  assertBytes(encodeVmsgeuVi(3, 4, 0, 0), encodeVmseqVv(0, 4, 4, 3));
  assertBytes(encodeVmsltVi(3, 4, 8, 0), encodeVmsleVi(0, 4, 7, 3));
  assertBytes(encodeVmsltuVi(3, 4, 8, 0), encodeVmsleuVi(0, 4, 7, 3));
  assertBytes(encodeVmsltuVi(3, 4, 0, 0), encodeVmsneVv(0, 4, 4, 3));
});

test('vector register comparisons swap va and vb', () => {
  assertBytes(encodeVmsgeVv(3, 4, 5, 0), encodeVmsleVv(0, 5, 4, 3));
  assertBytes(encodeVmsgeuVv(3, 4, 5, 0), encodeVmsleuVv(0, 5, 4, 3));
  assertBytes(encodeVmsgtVv(3, 4, 5, 0), encodeVmsltVv(0, 5, 4, 3));
  assertBytes(encodeVmsgtuVv(3, 4, 5, 0), encodeVmsltuVv(0, 5, 4, 3));
});

test('vmsge.vx normal expansion follows the manual form', () => {
  assertBytes(encodeVmsgeVx(3, 4, 5), concat(encodeVmsltVx(1, 4, 5, 3), encodeVmnandMm(3, 3, 3)));
});

test('vmsgeu.vx normal expansion follows the manual form', () => {
  assertBytes(encodeVmsgeuVx(3, 4, 5), concat(encodeVmsltuVx(1, 4, 5, 3), encodeVmnandMm(3, 3, 3)));
});

test('vector conversion aliases use x0 as the scalar source', () => {
  assertBytes(encodeVncvtXXW(3, 4, 0), encodeVnsrlWx(0, 4, 0, 3));
  assertBytes(encodeVwcvtXXV(3, 4, 0), encodeVwaddVx(0, 4, 0, 3));
  assertBytes(encodeVwcvtuXXV(3, 4, 0), encodeVwadduVx(0, 4, 0, 3));
});

test('lga uses auipc plus ld for global addresses', () => {
  assertBytes(
    encodeLla(5, 0x12345, -2048),
    concat(encodeAuipc(5, 0x12345), encodeAddi(5, 5, -2048))
  );
  assertBytes(encodeLga(5, 0x12345, -2048), concat(encodeAuipc(5, 0x12345), encodeLd(5, 5, -2048)));
});
