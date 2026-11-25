import assert from 'node:assert/strict';
import test from 'node:test';

import {
  encodeA,
  encodeAes64ks1iFields,
  encodeBFields,
  encodeCbFields,
  encodeCbShiftImm,
  encodeCi,
  encodeCiw,
  encodeCj,
  encodeClFields,
  encodeClHalf,
  encodeCa,
  encodeCr,
  encodeCsFields,
  encodeCss,
  encodeFenceFields,
  encodeI,
  encodeJ,
  encodeJFields,
  encodeR,
  encodeR4,
  encodeSFields,
  encodeShiftI,
  encodeSm4,
  encodeU,
  encodeV,
  encodeVcfg,
  encodeVl,
  encodeVror,
  encodeVs,
  encodeVsetivliFields,
  encodeVsetvlFields,
  encodeZcmop,
  encodeZcmp,
  encodeZcmpMove,
  encodeZcmt,
  encodeZimop,
  encodeZimopRR,
} from '#instructions/formats';

const bytes = (...values: number[]): Uint8Array => Uint8Array.from(values);

test('base formats encode known instructions', () => {
  assert.deepEqual(
    encodeR(0b0110011, 0b000, 0b0000000, 3, 1, 2), // add x3, x1, x2
    bytes(0xb3, 0x81, 0x20, 0x00)
  );
  assert.deepEqual(
    encodeI(0b0010011, 0b000, -1, 1, 2), // addi x1, x2, -1
    bytes(0x93, 0x00, 0xf1, 0xff)
  );
  assert.deepEqual(
    encodeU(0b0110111, 0x12345, 1), // lui x1, 0x12345
    bytes(0xb7, 0x50, 0x34, 0x12)
  );
  assert.deepEqual(
    encodeJ(0b1101111, 8, 1), // jal x1, +8
    bytes(0xef, 0x00, 0x80, 0x00)
  );
});

test('compressed register and immediate formats encode known instructions', () => {
  assert.deepEqual(
    encodeCr(0b10, 0b1000, 1, 2), // c.mv x1, x2
    bytes(0x8a, 0x80)
  );
  assert.deepEqual(
    encodeCr(0b10, 0b1001, 1, 2), // c.add x1, x2
    bytes(0x8a, 0x90)
  );
  // c.addi x1, 5: imm[5]=0 at inst[12], imm[4:0]=5 at inst[6:2].
  assert.deepEqual(
    encodeCi(0b01, 0b000, 0, 1, 5), // c.addi x1, 5
    bytes(0x95, 0x00)
  );
  assert.deepEqual(
    encodeCi(0b01, 0b010, 0, 1, 1), // c.li x1, 1
    bytes(0x85, 0x40)
  );
  assert.deepEqual(
    encodeCi(0b10, 0b000, 0, 1, 3), // c.slli x1, 3
    bytes(0x8e, 0x00)
  );
});

test('compressed load/store formats encode known instructions', () => {
  assert.deepEqual(
    encodeCi(0b10, 0b010, 0, 6, 0), // c.lwsp x6, 0(x2)
    bytes(0x02, 0x43)
  );
  // c.ldsp offset 8: uimm[4:3]=01 at inst[6:5] and uimm[8:6]=000 at inst[4:2],
  // so the imm5 field is 0b01000.
  assert.deepEqual(
    encodeCi(0b10, 0b011, 0, 6, (0b01 << 3) | 0b000), // c.ldsp x6, 8(x2)
    bytes(0x22, 0x63)
  );
  // c.addi16sp x2, 32: nzimm[9]=0 at inst[12]; nzimm[5] (the 32 value) at inst[2].
  assert.deepEqual(
    encodeCi(0b01, 0b011, 0, 2, 1), // c.addi16sp x2, 32
    bytes(0x05, 0x61)
  );
  assert.deepEqual(
    encodeCi(0b01, 0b011, 1, 1, 0b11111), // c.lui x1, -1 (imm[17:12] = 111111)
    bytes(0xfd, 0x70)
  );
  assert.deepEqual(
    encodeCss(0b10, 0b110, 0, 5), // c.swsp x5, 0(x2)
    bytes(0x16, 0xc0)
  );
  // c.sdsp offset 8: uimm[5:3]=001 at inst[12:10] and uimm[8:6]=000 at
  // inst[9:7], so the imm6 field is 0b001000.
  assert.deepEqual(
    encodeCss(0b10, 0b111, 0b001 << 3, 5), // c.sdsp x5, 8(x2)
    bytes(0x16, 0xe4)
  );
  // c.addi4spn x8, x2, 16: uimm[5:4]=01 at inst[12:11]; uimm[9:6] and
  // uimm[3:2] are zero, so the imm8 field is 0b01000000.
  assert.deepEqual(
    encodeCiw(0b00, 0b000, 0b01 << 6, 8), // c.addi4spn x8, x2, 16
    bytes(0x00, 0x08)
  );
});

test('compressed arithmetic and control formats encode known instructions', () => {
  assert.deepEqual(
    encodeCa(0b01, 0b100011, 8, 0b00, 9), // c.sub x8, x9
    bytes(0x05, 0x8c)
  );
  assert.deepEqual(
    encodeCa(0b01, 0b100111, 8, 0b01, 9), // c.addw x8, x9
    bytes(0x25, 0x9c)
  );
  // c.j +8: offset[3:1]=100 land at inst[5:3], so the 11-bit field is
  // 0b00000010000.
  assert.deepEqual(
    encodeCj(0b01, 0b101, 8), // c.j +8
    bytes(0x21, 0xa0)
  );
});

test('R4 fused floating-point format encodes known instructions', () => {
  // fmadd.s x1, x2, x3, x4 with rounding mode RNE (rm=0) and fmt=0.
  assert.deepEqual(encodeR4(0x43, 0, 0, 1, 2, 3, 4), bytes(0xc3, 0x00, 0x31, 0x20));
});

test('vector formats encode known instructions', () => {
  // vadd.vv vd=1, vs1=2, vs2=3, vm=1.
  assert.deepEqual(encodeV(0x57, 0, 1, 3, 2, 0, 1), bytes(0xd7, 0x00, 0x31, 0x02));

  // vle8.v vd=1, rs1=2, nf=0, mew=0, mop=0, vm=1, op24_20=0.
  assert.deepEqual(encodeVl(0x07, 0, 0, 0, 1, 0, 2, 0, 1), bytes(0x87, 0x00, 0x01, 0x02));

  // vse8.v vs3=1, rs1=2, nf=0, mew=0, mop=0, vm=1, op24_20=0.
  assert.deepEqual(encodeVs(0x27, 0, 0, 0, 1, 0, 2, 0, 1), bytes(0xa7, 0x00, 0x01, 0x02));

  // vsetvli-style configuration with cfg12=0x123, rd=1, rs1=2.
  assert.deepEqual(encodeVcfg(0x57, 7, 0x123, 1, 2), bytes(0xd7, 0x70, 0x31, 0x12));

  // vsetivli zero, 4, e32, m1, ta, ma: cfg12=0xc10, rs1=4.
  assert.deepEqual(encodeVcfg(0x57, 7, 0xc10, 0, 4), bytes(0x57, 0x70, 0x02, 0xc1));

  // vsetvl rd=1, rs1=2, rs2=3: cfg12=0x800|3.
  assert.deepEqual(encodeVcfg(0x57, 7, 0x803, 1, 2), bytes(0xd7, 0x70, 0x31, 0x80));
});

test('Zc compressed extension formats encode known instructions', () => {
  // cm.push with rlist=2 and spimm=1.
  assert.deepEqual(encodeZcmp(0b10, 0b101, 0x18, 2, 1), bytes(0x26, 0xb8));

  // cm.mvsa01 with sreg1=1 and sreg2=2.
  assert.deepEqual(encodeZcmpMove(0b10, 0b101, 3, 1, 1, 2), bytes(0xaa, 0xac));

  // cm.jalt with index=3.
  assert.deepEqual(encodeZcmt(0b10, 0b101, 3), bytes(0x0e, 0xa0));
});

test('field-level format helpers encode known instructions', () => {
  // lr.d x1, (x2) -- AMO with aq=rl=0.
  assert.deepEqual(encodeA(0x2f, 0x2, 0, 0, 0x3, 1, 2, 0), bytes(0xaf, 0x30, 0x01, 0x10));
  // sm4ed x1, x2, x3, 0.
  assert.deepEqual(encodeSm4(0x33, 0x0, 0, 0x18, 1, 2, 3), bytes(0xb3, 0x00, 0x31, 0x30));
  // srai x1, x2, 1.
  assert.deepEqual(encodeShiftI(0x13, 0x5, 0x10, 1, 1, 2), bytes(0x93, 0x50, 0x11, 0x40));
  // aes64ks1i x1, x2, 0.
  assert.deepEqual(encodeAes64ks1iFields(0x13, 0x1, 0x31, 0, 1, 2), bytes(0x93, 0x10, 0x01, 0x31));
  // fence iorw, iorw (fm=0, pred=succ=0xf).
  assert.deepEqual(encodeFenceFields(0xf, 0x0, 0, 0xf, 0xf, 0, 0), bytes(0x0f, 0x00, 0xf0, 0x0f));
  // mop.r.N and mop.rr.N with all selectors zero.
  assert.deepEqual(encodeZimop(0x73, 0x4, 0, 0, 0, 0, 0), bytes(0x73, 0x40, 0xc0, 0x81));
  assert.deepEqual(encodeZimopRR(0x73, 0x4, 0, 0, 0, 0, 0), bytes(0x73, 0x40, 0x00, 0x82));
  // vror.vi v1, v2, 0 with vm=1.
  assert.deepEqual(encodeVror(0x57, 0xa, 0, 1, 2, 0, 0x3, 1), bytes(0xd7, 0x30, 0x20, 0x52));
  // vsetivli zero, 4, e32, m1, ta, ma (zimm10=0x10, zimm5=4).
  assert.deepEqual(encodeVsetivliFields(0x57, 7, 0x10, 4, 0), bytes(0x57, 0x70, 0x02, 0xc1));
  // vsetvl x1, x2, x3.
  assert.deepEqual(encodeVsetvlFields(0x57, 7, 3, 2, 1), bytes(0xd7, 0x70, 0x31, 0x80));
  // c.mop.0.
  assert.deepEqual(encodeZcmop(0x1, 0x3, 0), bytes(0x81, 0x60));
  // sd x3, 4(x2) from the split immediate fields.
  assert.deepEqual(encodeSFields(0x23, 0x3, 0, 4, 2, 3), bytes(0x23, 0x32, 0x31, 0x00));
  // beq x1, x2, +8 from the split offset fields.
  assert.deepEqual(encodeBFields(0x63, 0x0, 0, 4, 1, 2), bytes(0x63, 0x82, 0x20, 0x00));
  // jal x1, +8 from the raw 20-bit immediate field.
  assert.deepEqual(encodeJFields(0x6f, 0x800, 1), bytes(0xef, 0x00, 0x80, 0x00));
  // c.ld x10, 0(x8) and c.ld x15, 0(x15) -- compact-register boundaries.
  assert.deepEqual(encodeClFields(0x0, 0x3, 0, 0, 8, 10), bytes(0x08, 0x60));
  assert.deepEqual(encodeClFields(0x0, 0x3, 0, 0, 15, 15), bytes(0x9c, 0x63));
  assert.throws(() => encodeClFields(0x0, 0x3, 0, 0, 7, 15), RangeError);
  assert.throws(() => encodeClFields(0x0, 0x3, 0, 0, 15, 16), RangeError);
  // Explicit vector-configuration marker bits.
  assert.deepEqual(encodeVcfg(0x57, 7, 0, 0, 0), bytes(0x57, 0x70, 0x00, 0x00));
  assert.deepEqual(encodeVsetivliFields(0x57, 7, 0, 0, 0), bytes(0x57, 0x70, 0x00, 0xc0));
  assert.deepEqual(encodeVsetvlFields(0x57, 7, 0, 0, 0), bytes(0x57, 0x70, 0x00, 0x80));
  // c.lh x10, 0(x8) -- Zcb halfword offset.
  assert.deepEqual(encodeClHalf(0x0, 0x4, 1, 1, 0, 8, 10), bytes(0x48, 0x84));
  // c.sd x9, 0(x8) -- CS offset pieces.
  assert.deepEqual(encodeCsFields(0x0, 0x7, 0, 0, 8, 9), bytes(0x04, 0xe0));
  // c.beqz x8, +8 -- CB offset pieces.
  assert.deepEqual(encodeCbFields(0x1, 0x6, 1, 0, 8), bytes(0x01, 0xc4));
  // c.srai x8, 2 -- CB split immediate with funct2=1.
  assert.deepEqual(encodeCbShiftImm(0x1, 0x4, 0, 1, 2, 8), bytes(0x09, 0x84));
});
