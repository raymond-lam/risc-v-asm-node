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

// Auto-generated from riscv-opcodes. Each exported function encodes one
// canonical non-pseudo instruction; operands retain their source order.
// Every wrapper is a single call to a helper from the formats package: all shifting,
// masking, and field composition lives in the format helpers.

import {
  encodeA,
  encodeAes64ks1iFields,
  encodeBFields,
  encodeCa,
  encodeCbFields,
  encodeCbShiftImm,
  encodeCi,
  encodeCiw,
  encodeCj,
  encodeClFields,
  encodeClHalf,
  encodeCr,
  encodeCsFields,
  encodeCss,
  encodeFenceFields,
  encodeI,
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

/** Encode lr.d (rv64_a) as a 32-bit instruction. */
export const encodeLrD = (rd: number, rs1: number, aq: number, rl: number): Uint8Array =>
  encodeA(0x2f, 0x2, aq, rl, 0x3, rd, rs1, 0x0);

/** Encode sc.d (rv64_a) as a 32-bit instruction. */
export const encodeScD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x3, aq, rl, 0x3, rd, rs1, rs2);

/** Encode amoswap.d (rv64_a) as a 32-bit instruction. */
export const encodeAmoswapD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x1, aq, rl, 0x3, rd, rs1, rs2);

/** Encode amoadd.d (rv64_a) as a 32-bit instruction. */
export const encodeAmoaddD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x0, aq, rl, 0x3, rd, rs1, rs2);

/** Encode amoxor.d (rv64_a) as a 32-bit instruction. */
export const encodeAmoxorD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x4, aq, rl, 0x3, rd, rs1, rs2);

/** Encode amoand.d (rv64_a) as a 32-bit instruction. */
export const encodeAmoandD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0xc, aq, rl, 0x3, rd, rs1, rs2);

/** Encode amoor.d (rv64_a) as a 32-bit instruction. */
export const encodeAmoorD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x8, aq, rl, 0x3, rd, rs1, rs2);

/** Encode amomin.d (rv64_a) as a 32-bit instruction. */
export const encodeAmominD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x10, aq, rl, 0x3, rd, rs1, rs2);

/** Encode amomax.d (rv64_a) as a 32-bit instruction. */
export const encodeAmomaxD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x14, aq, rl, 0x3, rd, rs1, rs2);

/** Encode amominu.d (rv64_a) as a 32-bit instruction. */
export const encodeAmominuD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x18, aq, rl, 0x3, rd, rs1, rs2);

/** Encode amomaxu.d (rv64_a) as a 32-bit instruction. */
export const encodeAmomaxuD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x1c, aq, rl, 0x3, rd, rs1, rs2);

/** Encode c.ld (rv64_c) as a 16-bit instruction. */
export const encodeCLd = (
  rdP: number,
  rs1P: number,
  cUimm8lo: number,
  cUimm8hi: number
): Uint8Array => encodeClFields(0x0, 0x3, cUimm8hi, cUimm8lo, rs1P, rdP);

/** Encode c.sd (rv64_c) as a 16-bit instruction. */
export const encodeCSd = (
  rs1P: number,
  rs2P: number,
  cUimm8hi: number,
  cUimm8lo: number
): Uint8Array => encodeCsFields(0x0, 0x7, cUimm8hi, cUimm8lo, rs1P, rs2P);

/** Encode c.addiw (rv64_c) as a 16-bit instruction. */
export const encodeCAddiw = (rdRs1N0: number, cImm6lo: number, cImm6hi: number): Uint8Array =>
  encodeCi(0x1, 0x1, cImm6hi, rdRs1N0, cImm6lo);

/** Encode c.srli (rv64_c) as a 16-bit instruction. */
export const encodeCSrli = (rdRs1P: number, cNzuimm6lo: number, cNzuimm6hi: number): Uint8Array =>
  encodeCbShiftImm(0x1, 0x4, cNzuimm6hi, 0x0, cNzuimm6lo, rdRs1P);

/** Encode c.srai (rv64_c) as a 16-bit instruction. */
export const encodeCSrai = (rdRs1P: number, cNzuimm6lo: number, cNzuimm6hi: number): Uint8Array =>
  encodeCbShiftImm(0x1, 0x4, cNzuimm6hi, 0x1, cNzuimm6lo, rdRs1P);

/** Encode c.subw (rv64_c) as a 16-bit instruction. */
export const encodeCSubw = (rdRs1P: number, rs2P: number): Uint8Array =>
  encodeCa(0x1, 0x27, rdRs1P, 0x0, rs2P);

/** Encode c.addw (rv64_c) as a 16-bit instruction. */
export const encodeCAddw = (rdRs1P: number, rs2P: number): Uint8Array =>
  encodeCa(0x1, 0x27, rdRs1P, 0x1, rs2P);

/** Encode c.slli (rv64_c) as a 16-bit instruction. */
export const encodeCSlli = (rdRs1N0: number, cNzuimm6hi: number, cNzuimm6lo: number): Uint8Array =>
  encodeCi(0x2, 0x0, cNzuimm6hi, rdRs1N0, cNzuimm6lo);

/** Encode c.ldsp (rv64_c) as a 16-bit instruction. */
export const encodeCLdsp = (rdN0: number, cUimm9sphi: number, cUimm9splo: number): Uint8Array =>
  encodeCi(0x2, 0x3, cUimm9sphi, rdN0, cUimm9splo);

/** Encode c.sdsp (rv64_c) as a 16-bit instruction. */
export const encodeCSdsp = (cRs2: number, cUimm9spS: number): Uint8Array =>
  encodeCss(0x2, 0x7, cUimm9spS, cRs2);

/** Encode fcvt.l.d (rv64_d) as a 32-bit instruction. */
export const encodeFcvtLD = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x61, rd, rs1, 0x2);

/** Encode fcvt.lu.d (rv64_d) as a 32-bit instruction. */
export const encodeFcvtLuD = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x61, rd, rs1, 0x3);

/** Encode fmv.x.d (rv64_d) as a 32-bit instruction. */
export const encodeFmvXD = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x71, rd, rs1, 0x0);

/** Encode fcvt.d.l (rv64_d) as a 32-bit instruction. */
export const encodeFcvtDL = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x69, rd, rs1, 0x2);

/** Encode fcvt.d.lu (rv64_d) as a 32-bit instruction. */
export const encodeFcvtDLu = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x69, rd, rs1, 0x3);

/** Encode fmv.d.x (rv64_d) as a 32-bit instruction. */
export const encodeFmvDX = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x79, rd, rs1, 0x0);

/** Encode fcvt.l.s (rv64_f) as a 32-bit instruction. */
export const encodeFcvtLS = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x60, rd, rs1, 0x2);

/** Encode fcvt.lu.s (rv64_f) as a 32-bit instruction. */
export const encodeFcvtLuS = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x60, rd, rs1, 0x3);

/** Encode fcvt.s.l (rv64_f) as a 32-bit instruction. */
export const encodeFcvtSL = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x68, rd, rs1, 0x2);

/** Encode fcvt.s.lu (rv64_f) as a 32-bit instruction. */
export const encodeFcvtSLu = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x68, rd, rs1, 0x3);

/** Encode hlv.wu (rv64_h) as a 32-bit instruction. */
export const encodeHlvWu = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x73, 0x4, 0x681, rd, rs1);

/** Encode hlv.d (rv64_h) as a 32-bit instruction. */
export const encodeHlvD = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x73, 0x4, 0x6c0, rd, rs1);

/** Encode hsv.d (rv64_h) as a 32-bit instruction. */
export const encodeHsvD = (rs1: number, rs2: number): Uint8Array =>
  encodeR(0x73, 0x4, 0x37, 0x0, rs1, rs2);

/** Encode lwu (rv64_i) as a 32-bit instruction. */
export const encodeLwu = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x3, 0x6, imm12, rd, rs1);

/** Encode ld (rv64_i) as a 32-bit instruction. */
export const encodeLd = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x3, 0x3, imm12, rd, rs1);

/** Encode sd (rv64_i) as a 32-bit instruction. */
export const encodeSd = (imm12hi: number, rs1: number, rs2: number, imm12lo: number): Uint8Array =>
  encodeSFields(0x23, 0x3, imm12hi, imm12lo, rs1, rs2);

/** Encode slli (rv64_i) as a 32-bit instruction. */
export const encodeSlli = (rd: number, rs1: number, shamtd: number): Uint8Array =>
  encodeShiftI(0x13, 0x1, 0x0, shamtd, rd, rs1);

/** Encode srli (rv64_i) as a 32-bit instruction. */
export const encodeSrli = (rd: number, rs1: number, shamtd: number): Uint8Array =>
  encodeShiftI(0x13, 0x5, 0x0, shamtd, rd, rs1);

/** Encode srai (rv64_i) as a 32-bit instruction. */
export const encodeSrai = (rd: number, rs1: number, shamtd: number): Uint8Array =>
  encodeShiftI(0x13, 0x5, 0x10, shamtd, rd, rs1);

/** Encode addiw (rv64_i) as a 32-bit instruction. */
export const encodeAddiw = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x1b, 0x0, imm12, rd, rs1);

/** Encode slliw (rv64_i) as a 32-bit instruction. */
export const encodeSlliw = (rd: number, rs1: number, shamtw: number): Uint8Array =>
  encodeShiftI(0x1b, 0x1, 0x0, shamtw, rd, rs1);

/** Encode srliw (rv64_i) as a 32-bit instruction. */
export const encodeSrliw = (rd: number, rs1: number, shamtw: number): Uint8Array =>
  encodeShiftI(0x1b, 0x5, 0x0, shamtw, rd, rs1);

/** Encode sraiw (rv64_i) as a 32-bit instruction. */
export const encodeSraiw = (rd: number, rs1: number, shamtw: number): Uint8Array =>
  encodeShiftI(0x1b, 0x5, 0x10, shamtw, rd, rs1);

/** Encode addw (rv64_i) as a 32-bit instruction. */
export const encodeAddw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x0, 0x0, rd, rs1, rs2);

/** Encode subw (rv64_i) as a 32-bit instruction. */
export const encodeSubw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x0, 0x20, rd, rs1, rs2);

/** Encode sllw (rv64_i) as a 32-bit instruction. */
export const encodeSllw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x1, 0x0, rd, rs1, rs2);

/** Encode srlw (rv64_i) as a 32-bit instruction. */
export const encodeSrlw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x5, 0x0, rd, rs1, rs2);

/** Encode sraw (rv64_i) as a 32-bit instruction. */
export const encodeSraw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x5, 0x20, rd, rs1, rs2);

/** Encode mulw (rv64_m) as a 32-bit instruction. */
export const encodeMulw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x0, 0x1, rd, rs1, rs2);

/** Encode divw (rv64_m) as a 32-bit instruction. */
export const encodeDivw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x4, 0x1, rd, rs1, rs2);

/** Encode divuw (rv64_m) as a 32-bit instruction. */
export const encodeDivuw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x5, 0x1, rd, rs1, rs2);

/** Encode remw (rv64_m) as a 32-bit instruction. */
export const encodeRemw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x6, 0x1, rd, rs1, rs2);

/** Encode remuw (rv64_m) as a 32-bit instruction. */
export const encodeRemuw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x7, 0x1, rd, rs1, rs2);

/** Encode fcvt.l.q (rv64_q) as a 32-bit instruction. */
export const encodeFcvtLQ = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x63, rd, rs1, 0x2);

/** Encode fcvt.lu.q (rv64_q) as a 32-bit instruction. */
export const encodeFcvtLuQ = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x63, rd, rs1, 0x3);

/** Encode fcvt.q.l (rv64_q) as a 32-bit instruction. */
export const encodeFcvtQL = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x6b, rd, rs1, 0x2);

/** Encode fcvt.q.lu (rv64_q) as a 32-bit instruction. */
export const encodeFcvtQLu = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x6b, rd, rs1, 0x3);

/** Encode fmvh.x.q (rv64_q_zfa) as a 32-bit instruction. */
export const encodeFmvhXQ = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x73, rd, rs1, 0x1);

/** Encode fmvp.q.x (rv64_q_zfa) as a 32-bit instruction. */
export const encodeFmvpQX = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x5b, rd, rs1, rs2);

/** Encode amocas.q (rv64_zacas) as a 32-bit instruction. */
export const encodeAmocasQ = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x5, aq, rl, 0x4, rd, rs1, rs2);

/** Encode add.uw (rv64_zba) as a 32-bit instruction. */
export const encodeAddUw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x0, 0x4, rd, rs1, rs2);

/** Encode sh1add.uw (rv64_zba) as a 32-bit instruction. */
export const encodeSh1addUw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x2, 0x10, rd, rs1, rs2);

/** Encode sh2add.uw (rv64_zba) as a 32-bit instruction. */
export const encodeSh2addUw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x4, 0x10, rd, rs1, rs2);

/** Encode sh3add.uw (rv64_zba) as a 32-bit instruction. */
export const encodeSh3addUw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x6, 0x10, rd, rs1, rs2);

/** Encode slli.uw (rv64_zba) as a 32-bit instruction. */
export const encodeSlliUw = (rd: number, rs1: number, shamtd: number): Uint8Array =>
  encodeShiftI(0x1b, 0x1, 0x2, shamtd, rd, rs1);

/** Encode clzw (rv64_zbb) as a 32-bit instruction. */
export const encodeClzw = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x1b, 0x1, 0x600, rd, rs1);

/** Encode ctzw (rv64_zbb) as a 32-bit instruction. */
export const encodeCtzw = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x1b, 0x1, 0x601, rd, rs1);

/** Encode cpopw (rv64_zbb) as a 32-bit instruction. */
export const encodeCpopw = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x1b, 0x1, 0x602, rd, rs1);

/** Encode rolw (rv64_zbb) as a 32-bit instruction. */
export const encodeRolw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x1, 0x30, rd, rs1, rs2);

/** Encode rorw (rv64_zbb) as a 32-bit instruction. */
export const encodeRorw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x5, 0x30, rd, rs1, rs2);

/** Encode roriw (rv64_zbb) as a 32-bit instruction. */
export const encodeRoriw = (rd: number, rs1: number, shamtw: number): Uint8Array =>
  encodeShiftI(0x1b, 0x5, 0x18, shamtw, rd, rs1);

/** Encode rori (rv64_zbb) as a 32-bit instruction. */
export const encodeRori = (rd: number, rs1: number, shamtd: number): Uint8Array =>
  encodeShiftI(0x13, 0x5, 0x18, shamtd, rd, rs1);

/** Encode rev8 (rv64_zbb) as a 32-bit instruction. */
export const encodeRev8 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x5, 0x6b8, rd, rs1);

/** Encode packw (rv64_zbkb) as a 32-bit instruction. */
export const encodePackw = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x3b, 0x4, 0x4, rd, rs1, rs2);

/** Encode bclri (rv64_zbs) as a 32-bit instruction. */
export const encodeBclri = (rd: number, rs1: number, shamtd: number): Uint8Array =>
  encodeShiftI(0x13, 0x1, 0x12, shamtd, rd, rs1);

/** Encode bexti (rv64_zbs) as a 32-bit instruction. */
export const encodeBexti = (rd: number, rs1: number, shamtd: number): Uint8Array =>
  encodeShiftI(0x13, 0x5, 0x12, shamtd, rd, rs1);

/** Encode binvi (rv64_zbs) as a 32-bit instruction. */
export const encodeBinvi = (rd: number, rs1: number, shamtd: number): Uint8Array =>
  encodeShiftI(0x13, 0x1, 0x1a, shamtd, rd, rs1);

/** Encode bseti (rv64_zbs) as a 32-bit instruction. */
export const encodeBseti = (rd: number, rs1: number, shamtd: number): Uint8Array =>
  encodeShiftI(0x13, 0x1, 0xa, shamtd, rd, rs1);

/** Encode c.zext.w (rv64_zcb) as a 16-bit instruction. */
export const encodeCZextW = (rdRs1P: number): Uint8Array =>
  encodeCbFields(0x1, 0x4, 0x7, 0x1c, rdRs1P);

/** Encode fcvt.l.h (rv64_zfh) as a 32-bit instruction. */
export const encodeFcvtLH = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x62, rd, rs1, 0x2);

/** Encode fcvt.lu.h (rv64_zfh) as a 32-bit instruction. */
export const encodeFcvtLuH = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x62, rd, rs1, 0x3);

/** Encode fcvt.h.l (rv64_zfh) as a 32-bit instruction. */
export const encodeFcvtHL = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x6a, rd, rs1, 0x2);

/** Encode fcvt.h.lu (rv64_zfh) as a 32-bit instruction. */
export const encodeFcvtHLu = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x6a, rd, rs1, 0x3);

/** Encode aes64dsm (rv64_zknd) as a 32-bit instruction. */
export const encodeAes64dsm = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x0, 0x1f, rd, rs1, rs2);

/** Encode aes64ds (rv64_zknd) as a 32-bit instruction. */
export const encodeAes64ds = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x0, 0x1d, rd, rs1, rs2);

/** Encode aes64ks1i (rv64_zknd) as a 32-bit instruction. */
export const encodeAes64ks1i = (rd: number, rs1: number, rnum: number): Uint8Array =>
  encodeAes64ks1iFields(0x13, 0x1, 0x31, rnum, rd, rs1);

/** Encode aes64im (rv64_zknd) as a 32-bit instruction. */
export const encodeAes64im = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x300, rd, rs1);

/** Encode aes64ks2 (rv64_zknd) as a 32-bit instruction. */
export const encodeAes64ks2 = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x0, 0x3f, rd, rs1, rs2);

/** Encode aes64esm (rv64_zkne) as a 32-bit instruction. */
export const encodeAes64esm = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x0, 0x1b, rd, rs1, rs2);

/** Encode aes64es (rv64_zkne) as a 32-bit instruction. */
export const encodeAes64es = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x0, 0x19, rd, rs1, rs2);

/** Encode sha512sum0 (rv64_zknh) as a 32-bit instruction. */
export const encodeSha512sum0 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x104, rd, rs1);

/** Encode sha512sum1 (rv64_zknh) as a 32-bit instruction. */
export const encodeSha512sum1 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x105, rd, rs1);

/** Encode sha512sig0 (rv64_zknh) as a 32-bit instruction. */
export const encodeSha512sig0 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x106, rd, rs1);

/** Encode sha512sig1 (rv64_zknh) as a 32-bit instruction. */
export const encodeSha512sig1 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x107, rd, rs1);

/** Encode lr.w (rv_a) as a 32-bit instruction. */
export const encodeLrW = (rd: number, rs1: number, aq: number, rl: number): Uint8Array =>
  encodeA(0x2f, 0x2, aq, rl, 0x2, rd, rs1, 0x0);

/** Encode sc.w (rv_a) as a 32-bit instruction. */
export const encodeScW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x3, aq, rl, 0x2, rd, rs1, rs2);

/** Encode amoswap.w (rv_a) as a 32-bit instruction. */
export const encodeAmoswapW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x1, aq, rl, 0x2, rd, rs1, rs2);

/** Encode amoadd.w (rv_a) as a 32-bit instruction. */
export const encodeAmoaddW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x0, aq, rl, 0x2, rd, rs1, rs2);

/** Encode amoxor.w (rv_a) as a 32-bit instruction. */
export const encodeAmoxorW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x4, aq, rl, 0x2, rd, rs1, rs2);

/** Encode amoand.w (rv_a) as a 32-bit instruction. */
export const encodeAmoandW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0xc, aq, rl, 0x2, rd, rs1, rs2);

/** Encode amoor.w (rv_a) as a 32-bit instruction. */
export const encodeAmoorW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x8, aq, rl, 0x2, rd, rs1, rs2);

/** Encode amomin.w (rv_a) as a 32-bit instruction. */
export const encodeAmominW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x10, aq, rl, 0x2, rd, rs1, rs2);

/** Encode amomax.w (rv_a) as a 32-bit instruction. */
export const encodeAmomaxW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x14, aq, rl, 0x2, rd, rs1, rs2);

/** Encode amominu.w (rv_a) as a 32-bit instruction. */
export const encodeAmominuW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x18, aq, rl, 0x2, rd, rs1, rs2);

/** Encode amomaxu.w (rv_a) as a 32-bit instruction. */
export const encodeAmomaxuW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x1c, aq, rl, 0x2, rd, rs1, rs2);

/** Encode c.addi4spn (rv_c) as a 16-bit instruction. */
export const encodeCAddi4spn = (rdP: number, cNzuimm10: number): Uint8Array =>
  encodeCiw(0x0, 0x0, cNzuimm10, rdP);

/** Encode c.lw (rv_c) as a 16-bit instruction. */
export const encodeCLw = (
  rdP: number,
  rs1P: number,
  cUimm7lo: number,
  cUimm7hi: number
): Uint8Array => encodeClFields(0x0, 0x2, cUimm7hi, cUimm7lo, rs1P, rdP);

/** Encode c.sw (rv_c) as a 16-bit instruction. */
export const encodeCSw = (
  rs1P: number,
  rs2P: number,
  cUimm7lo: number,
  cUimm7hi: number
): Uint8Array => encodeCsFields(0x0, 0x6, cUimm7hi, cUimm7lo, rs1P, rs2P);

/** Encode c.nop (rv_c) as a 16-bit instruction. */
export const encodeCNop = (cNzimm6hi: number, cNzimm6lo: number): Uint8Array =>
  encodeCi(0x1, 0x0, cNzimm6hi, 0x0, cNzimm6lo);

/** Encode c.addi (rv_c) as a 16-bit instruction. */
export const encodeCAddi = (rdRs1N0: number, cNzimm6lo: number, cNzimm6hi: number): Uint8Array =>
  encodeCi(0x1, 0x0, cNzimm6hi, rdRs1N0, cNzimm6lo);

/** Encode c.li (rv_c) as a 16-bit instruction. */
export const encodeCLi = (rdN0: number, cImm6lo: number, cImm6hi: number): Uint8Array =>
  encodeCi(0x1, 0x2, cImm6hi, rdN0, cImm6lo);

/** Encode c.addi16sp (rv_c) as a 16-bit instruction. */
export const encodeCAddi16sp = (cNzimm10hi: number, cNzimm10lo: number): Uint8Array =>
  encodeCi(0x1, 0x3, cNzimm10hi, 0x2, cNzimm10lo);

/** Encode c.lui (rv_c) as a 16-bit instruction. */
export const encodeCLui = (rdN2: number, cNzimm18hi: number, cNzimm18lo: number): Uint8Array =>
  encodeCi(0x1, 0x3, cNzimm18hi, rdN2, cNzimm18lo);

/** Encode c.andi (rv_c) as a 16-bit instruction. */
export const encodeCAndi = (rdRs1P: number, cImm6hi: number, cImm6lo: number): Uint8Array =>
  encodeCbShiftImm(0x1, 0x4, cImm6hi, 0x2, cImm6lo, rdRs1P);

/** Encode c.sub (rv_c) as a 16-bit instruction. */
export const encodeCSub = (rdRs1P: number, rs2P: number): Uint8Array =>
  encodeCa(0x1, 0x23, rdRs1P, 0x0, rs2P);

/** Encode c.xor (rv_c) as a 16-bit instruction. */
export const encodeCXor = (rdRs1P: number, rs2P: number): Uint8Array =>
  encodeCa(0x1, 0x23, rdRs1P, 0x1, rs2P);

/** Encode c.or (rv_c) as a 16-bit instruction. */
export const encodeCOr = (rdRs1P: number, rs2P: number): Uint8Array =>
  encodeCa(0x1, 0x23, rdRs1P, 0x2, rs2P);

/** Encode c.and (rv_c) as a 16-bit instruction. */
export const encodeCAnd = (rdRs1P: number, rs2P: number): Uint8Array =>
  encodeCa(0x1, 0x23, rdRs1P, 0x3, rs2P);

/** Encode c.j (rv_c) as a 16-bit instruction. */
export const encodeCJ = (cImm12: number): Uint8Array => encodeCj(0x1, 0x5, cImm12);

/** Encode c.beqz (rv_c) as a 16-bit instruction. */
export const encodeCBeqz = (rs1P: number, cBimm9lo: number, cBimm9hi: number): Uint8Array =>
  encodeCbFields(0x1, 0x6, cBimm9hi, cBimm9lo, rs1P);

/** Encode c.bnez (rv_c) as a 16-bit instruction. */
export const encodeCBnez = (rs1P: number, cBimm9lo: number, cBimm9hi: number): Uint8Array =>
  encodeCbFields(0x1, 0x7, cBimm9hi, cBimm9lo, rs1P);

/** Encode c.lwsp (rv_c) as a 16-bit instruction. */
export const encodeCLwsp = (rdN0: number, cUimm8sphi: number, cUimm8splo: number): Uint8Array =>
  encodeCi(0x2, 0x2, cUimm8sphi, rdN0, cUimm8splo);

/** Encode c.jr (rv_c) as a 16-bit instruction. */
export const encodeCJr = (rs1N0: number): Uint8Array => encodeCr(0x2, 0x8, rs1N0, 0x0);

/** Encode c.mv (rv_c) as a 16-bit instruction. */
export const encodeCMv = (rdN0: number, cRs2N0: number): Uint8Array =>
  encodeCr(0x2, 0x8, rdN0, cRs2N0);

/** Encode c.ebreak (rv_c) as a 16-bit instruction. */
export const encodeCEbreak = (): Uint8Array => encodeCr(0x2, 0x9, 0x0, 0x0);

/** Encode c.jalr (rv_c) as a 16-bit instruction. */
export const encodeCJalr = (cRs1N0: number): Uint8Array => encodeCr(0x2, 0x9, cRs1N0, 0x0);

/** Encode c.add (rv_c) as a 16-bit instruction. */
export const encodeCAdd = (rdRs1N0: number, cRs2N0: number): Uint8Array =>
  encodeCr(0x2, 0x9, rdRs1N0, cRs2N0);

/** Encode c.swsp (rv_c) as a 16-bit instruction. */
export const encodeCSwsp = (cRs2: number, cUimm8spS: number): Uint8Array =>
  encodeCss(0x2, 0x6, cUimm8spS, cRs2);

/** Encode c.fld (rv_c_d) as a 16-bit instruction. */
export const encodeCFld = (
  rdP: number,
  rs1P: number,
  cUimm8lo: number,
  cUimm8hi: number
): Uint8Array => encodeClFields(0x0, 0x1, cUimm8hi, cUimm8lo, rs1P, rdP);

/** Encode c.fsd (rv_c_d) as a 16-bit instruction. */
export const encodeCFsd = (
  rs1P: number,
  rs2P: number,
  cUimm8lo: number,
  cUimm8hi: number
): Uint8Array => encodeCsFields(0x0, 0x5, cUimm8hi, cUimm8lo, rs1P, rs2P);

/** Encode c.fldsp (rv_c_d) as a 16-bit instruction. */
export const encodeCFldsp = (rd: number, cUimm9sphi: number, cUimm9splo: number): Uint8Array =>
  encodeCi(0x2, 0x1, cUimm9sphi, rd, cUimm9splo);

/** Encode c.fsdsp (rv_c_d) as a 16-bit instruction. */
export const encodeCFsdsp = (cRs2: number, cUimm9spS: number): Uint8Array =>
  encodeCss(0x2, 0x5, cUimm9spS, cRs2);

/** Encode fld (rv_d) as a 32-bit instruction. */
export const encodeFld = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x7, 0x3, imm12, rd, rs1);

/** Encode fsd (rv_d) as a 32-bit instruction. */
export const encodeFsd = (imm12hi: number, rs1: number, rs2: number, imm12lo: number): Uint8Array =>
  encodeSFields(0x27, 0x3, imm12hi, imm12lo, rs1, rs2);

/** Encode fmadd.d (rv_d) as a 32-bit instruction. */
export const encodeFmaddD = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x43, rm, 0x1, rd, rs1, rs2, rs3);

/** Encode fmsub.d (rv_d) as a 32-bit instruction. */
export const encodeFmsubD = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x47, rm, 0x1, rd, rs1, rs2, rs3);

/** Encode fnmsub.d (rv_d) as a 32-bit instruction. */
export const encodeFnmsubD = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x4b, rm, 0x1, rd, rs1, rs2, rs3);

/** Encode fnmadd.d (rv_d) as a 32-bit instruction. */
export const encodeFnmaddD = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x4f, rm, 0x1, rd, rs1, rs2, rs3);

/** Encode fadd.d (rv_d) as a 32-bit instruction. */
export const encodeFaddD = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x1, rd, rs1, rs2);

/** Encode fsub.d (rv_d) as a 32-bit instruction. */
export const encodeFsubD = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x5, rd, rs1, rs2);

/** Encode fmul.d (rv_d) as a 32-bit instruction. */
export const encodeFmulD = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x9, rd, rs1, rs2);

/** Encode fdiv.d (rv_d) as a 32-bit instruction. */
export const encodeFdivD = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0xd, rd, rs1, rs2);

/** Encode fsqrt.d (rv_d) as a 32-bit instruction. */
export const encodeFsqrtD = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x2d, rd, rs1, 0x0);

/** Encode fsgnj.d (rv_d) as a 32-bit instruction. */
export const encodeFsgnjD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x11, rd, rs1, rs2);

/** Encode fsgnjn.d (rv_d) as a 32-bit instruction. */
export const encodeFsgnjnD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x11, rd, rs1, rs2);

/** Encode fsgnjx.d (rv_d) as a 32-bit instruction. */
export const encodeFsgnjxD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x11, rd, rs1, rs2);

/** Encode fmin.d (rv_d) as a 32-bit instruction. */
export const encodeFminD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x15, rd, rs1, rs2);

/** Encode fmax.d (rv_d) as a 32-bit instruction. */
export const encodeFmaxD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x15, rd, rs1, rs2);

/** Encode fcvt.s.d (rv_d) as a 32-bit instruction. */
export const encodeFcvtSD = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x20, rd, rs1, 0x1);

/** Encode fcvt.d.s (rv_d) as a 32-bit instruction. */
export const encodeFcvtDS = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x21, rd, rs1, 0x0);

/** Encode feq.d (rv_d) as a 32-bit instruction. */
export const encodeFeqD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x51, rd, rs1, rs2);

/** Encode flt.d (rv_d) as a 32-bit instruction. */
export const encodeFltD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x51, rd, rs1, rs2);

/** Encode fle.d (rv_d) as a 32-bit instruction. */
export const encodeFleD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x51, rd, rs1, rs2);

/** Encode fclass.d (rv_d) as a 32-bit instruction. */
export const encodeFclassD = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x71, rd, rs1, 0x0);

/** Encode fcvt.w.d (rv_d) as a 32-bit instruction. */
export const encodeFcvtWD = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x61, rd, rs1, 0x0);

/** Encode fcvt.wu.d (rv_d) as a 32-bit instruction. */
export const encodeFcvtWuD = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x61, rd, rs1, 0x1);

/** Encode fcvt.d.w (rv_d) as a 32-bit instruction. */
export const encodeFcvtDW = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x69, rd, rs1, 0x0);

/** Encode fcvt.d.wu (rv_d) as a 32-bit instruction. */
export const encodeFcvtDWu = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x69, rd, rs1, 0x1);

/** Encode fli.d (rv_d_zfa) as a 32-bit instruction. */
export const encodeFliD = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x79, rd, rs1, 0x1);

/** Encode fminm.d (rv_d_zfa) as a 32-bit instruction. */
export const encodeFminmD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x15, rd, rs1, rs2);

/** Encode fmaxm.d (rv_d_zfa) as a 32-bit instruction. */
export const encodeFmaxmD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x3, 0x15, rd, rs1, rs2);

/** Encode fround.d (rv_d_zfa) as a 32-bit instruction. */
export const encodeFroundD = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x21, rd, rs1, 0x4);

/** Encode froundnx.d (rv_d_zfa) as a 32-bit instruction. */
export const encodeFroundnxD = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x21, rd, rs1, 0x5);

/** Encode fcvtmod.w.d (rv_d_zfa) as a 32-bit instruction. */
export const encodeFcvtmodWD = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x61, rd, rs1, 0x8);

/** Encode fleq.d (rv_d_zfa) as a 32-bit instruction. */
export const encodeFleqD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x4, 0x51, rd, rs1, rs2);

/** Encode fltq.d (rv_d_zfa) as a 32-bit instruction. */
export const encodeFltqD = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x5, 0x51, rd, rs1, rs2);

/** Encode fcvt.d.h (rv_d_zfhmin) as a 32-bit instruction. */
export const encodeFcvtDH = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x21, rd, rs1, 0x2);

/** Encode fcvt.h.d (rv_d_zfhmin) as a 32-bit instruction. */
export const encodeFcvtHD = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x22, rd, rs1, 0x1);

/** Encode flw (rv_f) as a 32-bit instruction. */
export const encodeFlw = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x7, 0x2, imm12, rd, rs1);

/** Encode fsw (rv_f) as a 32-bit instruction. */
export const encodeFsw = (imm12hi: number, rs1: number, rs2: number, imm12lo: number): Uint8Array =>
  encodeSFields(0x27, 0x2, imm12hi, imm12lo, rs1, rs2);

/** Encode fmadd.s (rv_f) as a 32-bit instruction. */
export const encodeFmaddS = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x43, rm, 0x0, rd, rs1, rs2, rs3);

/** Encode fmsub.s (rv_f) as a 32-bit instruction. */
export const encodeFmsubS = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x47, rm, 0x0, rd, rs1, rs2, rs3);

/** Encode fnmsub.s (rv_f) as a 32-bit instruction. */
export const encodeFnmsubS = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x4b, rm, 0x0, rd, rs1, rs2, rs3);

/** Encode fnmadd.s (rv_f) as a 32-bit instruction. */
export const encodeFnmaddS = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x4f, rm, 0x0, rd, rs1, rs2, rs3);

/** Encode fadd.s (rv_f) as a 32-bit instruction. */
export const encodeFaddS = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x0, rd, rs1, rs2);

/** Encode fsub.s (rv_f) as a 32-bit instruction. */
export const encodeFsubS = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x4, rd, rs1, rs2);

/** Encode fmul.s (rv_f) as a 32-bit instruction. */
export const encodeFmulS = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x8, rd, rs1, rs2);

/** Encode fdiv.s (rv_f) as a 32-bit instruction. */
export const encodeFdivS = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0xc, rd, rs1, rs2);

/** Encode fsqrt.s (rv_f) as a 32-bit instruction. */
export const encodeFsqrtS = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x2c, rd, rs1, 0x0);

/** Encode fsgnj.s (rv_f) as a 32-bit instruction. */
export const encodeFsgnjS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x10, rd, rs1, rs2);

/** Encode fsgnjn.s (rv_f) as a 32-bit instruction. */
export const encodeFsgnjnS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x10, rd, rs1, rs2);

/** Encode fsgnjx.s (rv_f) as a 32-bit instruction. */
export const encodeFsgnjxS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x10, rd, rs1, rs2);

/** Encode fmin.s (rv_f) as a 32-bit instruction. */
export const encodeFminS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x14, rd, rs1, rs2);

/** Encode fmax.s (rv_f) as a 32-bit instruction. */
export const encodeFmaxS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x14, rd, rs1, rs2);

/** Encode fcvt.w.s (rv_f) as a 32-bit instruction. */
export const encodeFcvtWS = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x60, rd, rs1, 0x0);

/** Encode fcvt.wu.s (rv_f) as a 32-bit instruction. */
export const encodeFcvtWuS = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x60, rd, rs1, 0x1);

/** Encode fmv.x.w (rv_f) as a 32-bit instruction. */
export const encodeFmvXW = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x70, rd, rs1, 0x0);

/** Encode feq.s (rv_f) as a 32-bit instruction. */
export const encodeFeqS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x50, rd, rs1, rs2);

/** Encode flt.s (rv_f) as a 32-bit instruction. */
export const encodeFltS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x50, rd, rs1, rs2);

/** Encode fle.s (rv_f) as a 32-bit instruction. */
export const encodeFleS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x50, rd, rs1, rs2);

/** Encode fclass.s (rv_f) as a 32-bit instruction. */
export const encodeFclassS = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x70, rd, rs1, 0x0);

/** Encode fcvt.s.w (rv_f) as a 32-bit instruction. */
export const encodeFcvtSW = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x68, rd, rs1, 0x0);

/** Encode fcvt.s.wu (rv_f) as a 32-bit instruction. */
export const encodeFcvtSWu = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x68, rd, rs1, 0x1);

/** Encode fmv.w.x (rv_f) as a 32-bit instruction. */
export const encodeFmvWX = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x78, rd, rs1, 0x0);

/** Encode fli.s (rv_f_zfa) as a 32-bit instruction. */
export const encodeFliS = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x78, rd, rs1, 0x1);

/** Encode fminm.s (rv_f_zfa) as a 32-bit instruction. */
export const encodeFminmS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x14, rd, rs1, rs2);

/** Encode fmaxm.s (rv_f_zfa) as a 32-bit instruction. */
export const encodeFmaxmS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x3, 0x14, rd, rs1, rs2);

/** Encode fround.s (rv_f_zfa) as a 32-bit instruction. */
export const encodeFroundS = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x20, rd, rs1, 0x4);

/** Encode froundnx.s (rv_f_zfa) as a 32-bit instruction. */
export const encodeFroundnxS = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x20, rd, rs1, 0x5);

/** Encode fleq.s (rv_f_zfa) as a 32-bit instruction. */
export const encodeFleqS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x4, 0x50, rd, rs1, rs2);

/** Encode fltq.s (rv_f_zfa) as a 32-bit instruction. */
export const encodeFltqS = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x5, 0x50, rd, rs1, rs2);

/** Encode hfence.vvma (rv_h) as a 32-bit instruction. */
export const encodeHfenceVvma = (rs1: number, rs2: number): Uint8Array =>
  encodeR(0x73, 0x0, 0x11, 0x0, rs1, rs2);

/** Encode hfence.gvma (rv_h) as a 32-bit instruction. */
export const encodeHfenceGvma = (rs1: number, rs2: number): Uint8Array =>
  encodeR(0x73, 0x0, 0x31, 0x0, rs1, rs2);

/** Encode hlv.b (rv_h) as a 32-bit instruction. */
export const encodeHlvB = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x73, 0x4, 0x600, rd, rs1);

/** Encode hlv.bu (rv_h) as a 32-bit instruction. */
export const encodeHlvBu = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x73, 0x4, 0x601, rd, rs1);

/** Encode hlv.h (rv_h) as a 32-bit instruction. */
export const encodeHlvH = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x73, 0x4, 0x640, rd, rs1);

/** Encode hlv.hu (rv_h) as a 32-bit instruction. */
export const encodeHlvHu = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x73, 0x4, 0x641, rd, rs1);

/** Encode hlvx.hu (rv_h) as a 32-bit instruction. */
export const encodeHlvxHu = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x73, 0x4, 0x643, rd, rs1);

/** Encode hlv.w (rv_h) as a 32-bit instruction. */
export const encodeHlvW = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x73, 0x4, 0x680, rd, rs1);

/** Encode hlvx.wu (rv_h) as a 32-bit instruction. */
export const encodeHlvxWu = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x73, 0x4, 0x683, rd, rs1);

/** Encode hsv.b (rv_h) as a 32-bit instruction. */
export const encodeHsvB = (rs1: number, rs2: number): Uint8Array =>
  encodeR(0x73, 0x4, 0x31, 0x0, rs1, rs2);

/** Encode hsv.h (rv_h) as a 32-bit instruction. */
export const encodeHsvH = (rs1: number, rs2: number): Uint8Array =>
  encodeR(0x73, 0x4, 0x33, 0x0, rs1, rs2);

/** Encode hsv.w (rv_h) as a 32-bit instruction. */
export const encodeHsvW = (rs1: number, rs2: number): Uint8Array =>
  encodeR(0x73, 0x4, 0x35, 0x0, rs1, rs2);

/** Encode lui (rv_i) as a 32-bit instruction. */
export const encodeLui = (rd: number, imm20: number): Uint8Array => encodeU(0x37, imm20, rd);

/** Encode auipc (rv_i) as a 32-bit instruction. */
export const encodeAuipc = (rd: number, imm20: number): Uint8Array => encodeU(0x17, imm20, rd);

/** Encode jal (rv_i) as a 32-bit instruction. */
export const encodeJal = (rd: number, jimm20: number): Uint8Array =>
  encodeJFields(0x6f, jimm20, rd);

/** Encode jalr (rv_i) as a 32-bit instruction. */
export const encodeJalr = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x67, 0x0, imm12, rd, rs1);

/** Encode beq (rv_i) as a 32-bit instruction. */
export const encodeBeq = (
  bimm12hi: number,
  rs1: number,
  rs2: number,
  bimm12lo: number
): Uint8Array => encodeBFields(0x63, 0x0, bimm12hi, bimm12lo, rs1, rs2);

/** Encode bne (rv_i) as a 32-bit instruction. */
export const encodeBne = (
  bimm12hi: number,
  rs1: number,
  rs2: number,
  bimm12lo: number
): Uint8Array => encodeBFields(0x63, 0x1, bimm12hi, bimm12lo, rs1, rs2);

/** Encode blt (rv_i) as a 32-bit instruction. */
export const encodeBlt = (
  bimm12hi: number,
  rs1: number,
  rs2: number,
  bimm12lo: number
): Uint8Array => encodeBFields(0x63, 0x4, bimm12hi, bimm12lo, rs1, rs2);

/** Encode bge (rv_i) as a 32-bit instruction. */
export const encodeBge = (
  bimm12hi: number,
  rs1: number,
  rs2: number,
  bimm12lo: number
): Uint8Array => encodeBFields(0x63, 0x5, bimm12hi, bimm12lo, rs1, rs2);

/** Encode bltu (rv_i) as a 32-bit instruction. */
export const encodeBltu = (
  bimm12hi: number,
  rs1: number,
  rs2: number,
  bimm12lo: number
): Uint8Array => encodeBFields(0x63, 0x6, bimm12hi, bimm12lo, rs1, rs2);

/** Encode bgeu (rv_i) as a 32-bit instruction. */
export const encodeBgeu = (
  bimm12hi: number,
  rs1: number,
  rs2: number,
  bimm12lo: number
): Uint8Array => encodeBFields(0x63, 0x7, bimm12hi, bimm12lo, rs1, rs2);

/** Encode lb (rv_i) as a 32-bit instruction. */
export const encodeLb = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x3, 0x0, imm12, rd, rs1);

/** Encode lh (rv_i) as a 32-bit instruction. */
export const encodeLh = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x3, 0x1, imm12, rd, rs1);

/** Encode lw (rv_i) as a 32-bit instruction. */
export const encodeLw = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x3, 0x2, imm12, rd, rs1);

/** Encode lbu (rv_i) as a 32-bit instruction. */
export const encodeLbu = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x3, 0x4, imm12, rd, rs1);

/** Encode lhu (rv_i) as a 32-bit instruction. */
export const encodeLhu = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x3, 0x5, imm12, rd, rs1);

/** Encode sb (rv_i) as a 32-bit instruction. */
export const encodeSb = (imm12hi: number, rs1: number, rs2: number, imm12lo: number): Uint8Array =>
  encodeSFields(0x23, 0x0, imm12hi, imm12lo, rs1, rs2);

/** Encode sh (rv_i) as a 32-bit instruction. */
export const encodeSh = (imm12hi: number, rs1: number, rs2: number, imm12lo: number): Uint8Array =>
  encodeSFields(0x23, 0x1, imm12hi, imm12lo, rs1, rs2);

/** Encode sw (rv_i) as a 32-bit instruction. */
export const encodeSw = (imm12hi: number, rs1: number, rs2: number, imm12lo: number): Uint8Array =>
  encodeSFields(0x23, 0x2, imm12hi, imm12lo, rs1, rs2);

/** Encode addi (rv_i) as a 32-bit instruction. */
export const encodeAddi = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x13, 0x0, imm12, rd, rs1);

/** Encode slti (rv_i) as a 32-bit instruction. */
export const encodeSlti = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x13, 0x2, imm12, rd, rs1);

/** Encode sltiu (rv_i) as a 32-bit instruction. */
export const encodeSltiu = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x13, 0x3, imm12, rd, rs1);

/** Encode xori (rv_i) as a 32-bit instruction. */
export const encodeXori = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x13, 0x4, imm12, rd, rs1);

/** Encode ori (rv_i) as a 32-bit instruction. */
export const encodeOri = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x13, 0x6, imm12, rd, rs1);

/** Encode andi (rv_i) as a 32-bit instruction. */
export const encodeAndi = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x13, 0x7, imm12, rd, rs1);

/** Encode add (rv_i) as a 32-bit instruction. */
export const encodeAdd = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x0, 0x0, rd, rs1, rs2);

/** Encode sub (rv_i) as a 32-bit instruction. */
export const encodeSub = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x0, 0x20, rd, rs1, rs2);

/** Encode sll (rv_i) as a 32-bit instruction. */
export const encodeSll = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x1, 0x0, rd, rs1, rs2);

/** Encode slt (rv_i) as a 32-bit instruction. */
export const encodeSlt = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x2, 0x0, rd, rs1, rs2);

/** Encode sltu (rv_i) as a 32-bit instruction. */
export const encodeSltu = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x3, 0x0, rd, rs1, rs2);

/** Encode xor (rv_i) as a 32-bit instruction. */
export const encodeXor = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x4, 0x0, rd, rs1, rs2);

/** Encode srl (rv_i) as a 32-bit instruction. */
export const encodeSrl = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x5, 0x0, rd, rs1, rs2);

/** Encode sra (rv_i) as a 32-bit instruction. */
export const encodeSra = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x5, 0x20, rd, rs1, rs2);

/** Encode or (rv_i) as a 32-bit instruction. */
export const encodeOr = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x6, 0x0, rd, rs1, rs2);

/** Encode and (rv_i) as a 32-bit instruction. */
export const encodeAnd = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x7, 0x0, rd, rs1, rs2);

/** Encode fence (rv_i) as a 32-bit instruction. */
export const encodeFence = (
  fm: number,
  pred: number,
  succ: number,
  rs1: number,
  rd: number
): Uint8Array => encodeFenceFields(0xf, 0x0, fm, pred, succ, rs1, rd);

/** Encode ecall (rv_i) as a 32-bit instruction. */
export const encodeEcall = (): Uint8Array => encodeI(0x73, 0x0, 0x0, 0x0, 0x0);

/** Encode ebreak (rv_i) as a 32-bit instruction. */
export const encodeEbreak = (): Uint8Array => encodeI(0x73, 0x0, 0x1, 0x0, 0x0);

/** Encode mul (rv_m) as a 32-bit instruction. */
export const encodeMul = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x0, 0x1, rd, rs1, rs2);

/** Encode mulh (rv_m) as a 32-bit instruction. */
export const encodeMulh = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x1, 0x1, rd, rs1, rs2);

/** Encode mulhsu (rv_m) as a 32-bit instruction. */
export const encodeMulhsu = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x2, 0x1, rd, rs1, rs2);

/** Encode mulhu (rv_m) as a 32-bit instruction. */
export const encodeMulhu = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x3, 0x1, rd, rs1, rs2);

/** Encode div (rv_m) as a 32-bit instruction. */
export const encodeDiv = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x4, 0x1, rd, rs1, rs2);

/** Encode divu (rv_m) as a 32-bit instruction. */
export const encodeDivu = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x5, 0x1, rd, rs1, rs2);

/** Encode rem (rv_m) as a 32-bit instruction. */
export const encodeRem = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x6, 0x1, rd, rs1, rs2);

/** Encode remu (rv_m) as a 32-bit instruction. */
export const encodeRemu = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x7, 0x1, rd, rs1, rs2);

/** Encode flq (rv_q) as a 32-bit instruction. */
export const encodeFlq = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x7, 0x4, imm12, rd, rs1);

/** Encode fsq (rv_q) as a 32-bit instruction. */
export const encodeFsq = (imm12hi: number, rs1: number, rs2: number, imm12lo: number): Uint8Array =>
  encodeSFields(0x27, 0x4, imm12hi, imm12lo, rs1, rs2);

/** Encode fmadd.q (rv_q) as a 32-bit instruction. */
export const encodeFmaddQ = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x43, rm, 0x3, rd, rs1, rs2, rs3);

/** Encode fmsub.q (rv_q) as a 32-bit instruction. */
export const encodeFmsubQ = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x47, rm, 0x3, rd, rs1, rs2, rs3);

/** Encode fnmsub.q (rv_q) as a 32-bit instruction. */
export const encodeFnmsubQ = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x4b, rm, 0x3, rd, rs1, rs2, rs3);

/** Encode fnmadd.q (rv_q) as a 32-bit instruction. */
export const encodeFnmaddQ = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x4f, rm, 0x3, rd, rs1, rs2, rs3);

/** Encode fadd.q (rv_q) as a 32-bit instruction. */
export const encodeFaddQ = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x3, rd, rs1, rs2);

/** Encode fsub.q (rv_q) as a 32-bit instruction. */
export const encodeFsubQ = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x7, rd, rs1, rs2);

/** Encode fmul.q (rv_q) as a 32-bit instruction. */
export const encodeFmulQ = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0xb, rd, rs1, rs2);

/** Encode fdiv.q (rv_q) as a 32-bit instruction. */
export const encodeFdivQ = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0xf, rd, rs1, rs2);

/** Encode fsqrt.q (rv_q) as a 32-bit instruction. */
export const encodeFsqrtQ = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x2f, rd, rs1, 0x0);

/** Encode fsgnj.q (rv_q) as a 32-bit instruction. */
export const encodeFsgnjQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x13, rd, rs1, rs2);

/** Encode fsgnjn.q (rv_q) as a 32-bit instruction. */
export const encodeFsgnjnQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x13, rd, rs1, rs2);

/** Encode fsgnjx.q (rv_q) as a 32-bit instruction. */
export const encodeFsgnjxQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x13, rd, rs1, rs2);

/** Encode fmin.q (rv_q) as a 32-bit instruction. */
export const encodeFminQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x17, rd, rs1, rs2);

/** Encode fmax.q (rv_q) as a 32-bit instruction. */
export const encodeFmaxQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x17, rd, rs1, rs2);

/** Encode fcvt.s.q (rv_q) as a 32-bit instruction. */
export const encodeFcvtSQ = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x20, rd, rs1, 0x3);

/** Encode fcvt.q.s (rv_q) as a 32-bit instruction. */
export const encodeFcvtQS = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x23, rd, rs1, 0x0);

/** Encode fcvt.d.q (rv_q) as a 32-bit instruction. */
export const encodeFcvtDQ = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x21, rd, rs1, 0x3);

/** Encode fcvt.q.d (rv_q) as a 32-bit instruction. */
export const encodeFcvtQD = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x23, rd, rs1, 0x1);

/** Encode feq.q (rv_q) as a 32-bit instruction. */
export const encodeFeqQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x53, rd, rs1, rs2);

/** Encode flt.q (rv_q) as a 32-bit instruction. */
export const encodeFltQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x53, rd, rs1, rs2);

/** Encode fle.q (rv_q) as a 32-bit instruction. */
export const encodeFleQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x53, rd, rs1, rs2);

/** Encode fclass.q (rv_q) as a 32-bit instruction. */
export const encodeFclassQ = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x73, rd, rs1, 0x0);

/** Encode fcvt.w.q (rv_q) as a 32-bit instruction. */
export const encodeFcvtWQ = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x63, rd, rs1, 0x0);

/** Encode fcvt.wu.q (rv_q) as a 32-bit instruction. */
export const encodeFcvtWuQ = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x63, rd, rs1, 0x1);

/** Encode fcvt.q.w (rv_q) as a 32-bit instruction. */
export const encodeFcvtQW = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x6b, rd, rs1, 0x0);

/** Encode fcvt.q.wu (rv_q) as a 32-bit instruction. */
export const encodeFcvtQWu = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x6b, rd, rs1, 0x1);

/** Encode fli.q (rv_q_zfa) as a 32-bit instruction. */
export const encodeFliQ = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x7b, rd, rs1, 0x1);

/** Encode fminm.q (rv_q_zfa) as a 32-bit instruction. */
export const encodeFminmQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x17, rd, rs1, rs2);

/** Encode fmaxm.q (rv_q_zfa) as a 32-bit instruction. */
export const encodeFmaxmQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x3, 0x17, rd, rs1, rs2);

/** Encode fround.q (rv_q_zfa) as a 32-bit instruction. */
export const encodeFroundQ = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x23, rd, rs1, 0x4);

/** Encode froundnx.q (rv_q_zfa) as a 32-bit instruction. */
export const encodeFroundnxQ = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x23, rd, rs1, 0x5);

/** Encode fleq.q (rv_q_zfa) as a 32-bit instruction. */
export const encodeFleqQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x4, 0x53, rd, rs1, rs2);

/** Encode fltq.q (rv_q_zfa) as a 32-bit instruction. */
export const encodeFltqQ = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x5, 0x53, rd, rs1, rs2);

/** Encode fcvt.q.h (rv_q_zfhmin) as a 32-bit instruction. */
export const encodeFcvtQH = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x23, rd, rs1, 0x2);

/** Encode fcvt.h.q (rv_q_zfhmin) as a 32-bit instruction. */
export const encodeFcvtHQ = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x22, rd, rs1, 0x3);

/** Encode sfence.vma (rv_s) as a 32-bit instruction. */
export const encodeSfenceVma = (rs1: number, rs2: number): Uint8Array =>
  encodeR(0x73, 0x0, 0x9, 0x0, rs1, rs2);

/** Encode sret (rv_s) as a 32-bit instruction. */
export const encodeSret = (): Uint8Array => encodeI(0x73, 0x0, 0x102, 0x0, 0x0);

/** Encode dret (rv_sdext) as a 32-bit instruction. */
export const encodeDret = (): Uint8Array => encodeI(0x73, 0x0, 0x7b2, 0x0, 0x0);

/** Encode mnret (rv_smrnmi) as a 32-bit instruction. */
export const encodeMnret = (): Uint8Array => encodeI(0x73, 0x0, 0x702, 0x0, 0x0);

/** Encode sctrclr (rv_ssctr) as a 32-bit instruction. */
export const encodeSctrclr = (): Uint8Array => encodeI(0x73, 0x0, 0x104, 0x0, 0x0);

/** Encode sinval.vma (rv_svinval) as a 32-bit instruction. */
export const encodeSinvalVma = (rs1: number, rs2: number): Uint8Array =>
  encodeR(0x73, 0x0, 0xb, 0x0, rs1, rs2);

/** Encode sfence.w.inval (rv_svinval) as a 32-bit instruction. */
export const encodeSfenceWInval = (): Uint8Array => encodeI(0x73, 0x0, 0x180, 0x0, 0x0);

/** Encode sfence.inval.ir (rv_svinval) as a 32-bit instruction. */
export const encodeSfenceInvalIr = (): Uint8Array => encodeI(0x73, 0x0, 0x181, 0x0, 0x0);

/** Encode hinval.vvma (rv_svinval_h) as a 32-bit instruction. */
export const encodeHinvalVvma = (rs1: number, rs2: number): Uint8Array =>
  encodeR(0x73, 0x0, 0x13, 0x0, rs1, rs2);

/** Encode hinval.gvma (rv_svinval_h) as a 32-bit instruction. */
export const encodeHinvalGvma = (rs1: number, rs2: number): Uint8Array =>
  encodeR(0x73, 0x0, 0x33, 0x0, rs1, rs2);

/** Encode mret (rv_system) as a 32-bit instruction. */
export const encodeMret = (): Uint8Array => encodeI(0x73, 0x0, 0x302, 0x0, 0x0);

/** Encode wfi (rv_system) as a 32-bit instruction. */
export const encodeWfi = (): Uint8Array => encodeI(0x73, 0x0, 0x105, 0x0, 0x0);

/** Encode vsetivli (rv_v) as a 32-bit instruction. */
export const encodeVsetivli = (zimm10: number, zimm5: number, rd: number): Uint8Array =>
  encodeVsetivliFields(0x57, 0x7, zimm10, zimm5, rd);

/** Encode vsetvli (rv_v) as a 32-bit instruction. */
export const encodeVsetvli = (zimm11: number, rs1: number, rd: number): Uint8Array =>
  encodeVcfg(0x57, 0x7, zimm11, rd, rs1);

/** Encode vsetvl (rv_v) as a 32-bit instruction. */
export const encodeVsetvl = (rs2: number, rs1: number, rd: number): Uint8Array =>
  encodeVsetvlFields(0x57, 0x7, rs2, rs1, rd);

/** Encode vlm.v (rv_v) as a 32-bit instruction. */
export const encodeVlmV = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x0, 0x0, 0x0, 0x1, 0xb, rs1, 0x0, vd);

/** Encode vsm.v (rv_v) as a 32-bit instruction. */
export const encodeVsmV = (rs1: number, vs3: number): Uint8Array =>
  encodeVs(0x27, 0x0, 0x0, 0x0, 0x1, 0xb, rs1, 0x0, vs3);

/** Encode vle8.v (rv_v) as a 32-bit instruction. */
export const encodeVle8V = (nf: number, vm: number, rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, nf, 0x0, 0x0, vm, 0x0, rs1, 0x0, vd);

/** Encode vle16.v (rv_v) as a 32-bit instruction. */
export const encodeVle16V = (nf: number, vm: number, rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, nf, 0x0, 0x0, vm, 0x0, rs1, 0x5, vd);

/** Encode vle32.v (rv_v) as a 32-bit instruction. */
export const encodeVle32V = (nf: number, vm: number, rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, nf, 0x0, 0x0, vm, 0x0, rs1, 0x6, vd);

/** Encode vle64.v (rv_v) as a 32-bit instruction. */
export const encodeVle64V = (nf: number, vm: number, rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, nf, 0x0, 0x0, vm, 0x0, rs1, 0x7, vd);

/** Encode vse8.v (rv_v) as a 32-bit instruction. */
export const encodeVse8V = (nf: number, vm: number, rs1: number, vs3: number): Uint8Array =>
  encodeVs(0x27, nf, 0x0, 0x0, vm, 0x0, rs1, 0x0, vs3);

/** Encode vse16.v (rv_v) as a 32-bit instruction. */
export const encodeVse16V = (nf: number, vm: number, rs1: number, vs3: number): Uint8Array =>
  encodeVs(0x27, nf, 0x0, 0x0, vm, 0x0, rs1, 0x5, vs3);

/** Encode vse32.v (rv_v) as a 32-bit instruction. */
export const encodeVse32V = (nf: number, vm: number, rs1: number, vs3: number): Uint8Array =>
  encodeVs(0x27, nf, 0x0, 0x0, vm, 0x0, rs1, 0x6, vs3);

/** Encode vse64.v (rv_v) as a 32-bit instruction. */
export const encodeVse64V = (nf: number, vm: number, rs1: number, vs3: number): Uint8Array =>
  encodeVs(0x27, nf, 0x0, 0x0, vm, 0x0, rs1, 0x7, vs3);

/** Encode vluxei8.v (rv_v) as a 32-bit instruction. */
export const encodeVluxei8V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x1, vm, vs2, rs1, 0x0, vd);

/** Encode vluxei16.v (rv_v) as a 32-bit instruction. */
export const encodeVluxei16V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x1, vm, vs2, rs1, 0x5, vd);

/** Encode vluxei32.v (rv_v) as a 32-bit instruction. */
export const encodeVluxei32V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x1, vm, vs2, rs1, 0x6, vd);

/** Encode vluxei64.v (rv_v) as a 32-bit instruction. */
export const encodeVluxei64V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x1, vm, vs2, rs1, 0x7, vd);

/** Encode vsuxei8.v (rv_v) as a 32-bit instruction. */
export const encodeVsuxei8V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x1, vm, vs2, rs1, 0x0, vs3);

/** Encode vsuxei16.v (rv_v) as a 32-bit instruction. */
export const encodeVsuxei16V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x1, vm, vs2, rs1, 0x5, vs3);

/** Encode vsuxei32.v (rv_v) as a 32-bit instruction. */
export const encodeVsuxei32V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x1, vm, vs2, rs1, 0x6, vs3);

/** Encode vsuxei64.v (rv_v) as a 32-bit instruction. */
export const encodeVsuxei64V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x1, vm, vs2, rs1, 0x7, vs3);

/** Encode vlse8.v (rv_v) as a 32-bit instruction. */
export const encodeVlse8V = (
  nf: number,
  vm: number,
  rs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x2, vm, rs2, rs1, 0x0, vd);

/** Encode vlse16.v (rv_v) as a 32-bit instruction. */
export const encodeVlse16V = (
  nf: number,
  vm: number,
  rs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x2, vm, rs2, rs1, 0x5, vd);

/** Encode vlse32.v (rv_v) as a 32-bit instruction. */
export const encodeVlse32V = (
  nf: number,
  vm: number,
  rs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x2, vm, rs2, rs1, 0x6, vd);

/** Encode vlse64.v (rv_v) as a 32-bit instruction. */
export const encodeVlse64V = (
  nf: number,
  vm: number,
  rs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x2, vm, rs2, rs1, 0x7, vd);

/** Encode vsse8.v (rv_v) as a 32-bit instruction. */
export const encodeVsse8V = (
  nf: number,
  vm: number,
  rs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x2, vm, rs2, rs1, 0x0, vs3);

/** Encode vsse16.v (rv_v) as a 32-bit instruction. */
export const encodeVsse16V = (
  nf: number,
  vm: number,
  rs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x2, vm, rs2, rs1, 0x5, vs3);

/** Encode vsse32.v (rv_v) as a 32-bit instruction. */
export const encodeVsse32V = (
  nf: number,
  vm: number,
  rs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x2, vm, rs2, rs1, 0x6, vs3);

/** Encode vsse64.v (rv_v) as a 32-bit instruction. */
export const encodeVsse64V = (
  nf: number,
  vm: number,
  rs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x2, vm, rs2, rs1, 0x7, vs3);

/** Encode vloxei8.v (rv_v) as a 32-bit instruction. */
export const encodeVloxei8V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x3, vm, vs2, rs1, 0x0, vd);

/** Encode vloxei16.v (rv_v) as a 32-bit instruction. */
export const encodeVloxei16V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x3, vm, vs2, rs1, 0x5, vd);

/** Encode vloxei32.v (rv_v) as a 32-bit instruction. */
export const encodeVloxei32V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x3, vm, vs2, rs1, 0x6, vd);

/** Encode vloxei64.v (rv_v) as a 32-bit instruction. */
export const encodeVloxei64V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeVl(0x7, nf, 0x0, 0x3, vm, vs2, rs1, 0x7, vd);

/** Encode vsoxei8.v (rv_v) as a 32-bit instruction. */
export const encodeVsoxei8V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x3, vm, vs2, rs1, 0x0, vs3);

/** Encode vsoxei16.v (rv_v) as a 32-bit instruction. */
export const encodeVsoxei16V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x3, vm, vs2, rs1, 0x5, vs3);

/** Encode vsoxei32.v (rv_v) as a 32-bit instruction. */
export const encodeVsoxei32V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x3, vm, vs2, rs1, 0x6, vs3);

/** Encode vsoxei64.v (rv_v) as a 32-bit instruction. */
export const encodeVsoxei64V = (
  nf: number,
  vm: number,
  vs2: number,
  rs1: number,
  vs3: number
): Uint8Array => encodeVs(0x27, nf, 0x0, 0x3, vm, vs2, rs1, 0x7, vs3);

/** Encode vle8ff.v (rv_v) as a 32-bit instruction. */
export const encodeVle8ffV = (nf: number, vm: number, rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, nf, 0x0, 0x0, vm, 0x10, rs1, 0x0, vd);

/** Encode vle16ff.v (rv_v) as a 32-bit instruction. */
export const encodeVle16ffV = (nf: number, vm: number, rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, nf, 0x0, 0x0, vm, 0x10, rs1, 0x5, vd);

/** Encode vle32ff.v (rv_v) as a 32-bit instruction. */
export const encodeVle32ffV = (nf: number, vm: number, rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, nf, 0x0, 0x0, vm, 0x10, rs1, 0x6, vd);

/** Encode vle64ff.v (rv_v) as a 32-bit instruction. */
export const encodeVle64ffV = (nf: number, vm: number, rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, nf, 0x0, 0x0, vm, 0x10, rs1, 0x7, vd);

/** Encode vl1re8.v (rv_v) as a 32-bit instruction. */
export const encodeVl1re8V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x0, 0x0, 0x0, 0x1, 0x8, rs1, 0x0, vd);

/** Encode vl1re16.v (rv_v) as a 32-bit instruction. */
export const encodeVl1re16V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x0, 0x0, 0x0, 0x1, 0x8, rs1, 0x5, vd);

/** Encode vl1re32.v (rv_v) as a 32-bit instruction. */
export const encodeVl1re32V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x0, 0x0, 0x0, 0x1, 0x8, rs1, 0x6, vd);

/** Encode vl1re64.v (rv_v) as a 32-bit instruction. */
export const encodeVl1re64V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x0, 0x0, 0x0, 0x1, 0x8, rs1, 0x7, vd);

/** Encode vl2re8.v (rv_v) as a 32-bit instruction. */
export const encodeVl2re8V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x1, 0x0, 0x0, 0x1, 0x8, rs1, 0x0, vd);

/** Encode vl2re16.v (rv_v) as a 32-bit instruction. */
export const encodeVl2re16V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x1, 0x0, 0x0, 0x1, 0x8, rs1, 0x5, vd);

/** Encode vl2re32.v (rv_v) as a 32-bit instruction. */
export const encodeVl2re32V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x1, 0x0, 0x0, 0x1, 0x8, rs1, 0x6, vd);

/** Encode vl2re64.v (rv_v) as a 32-bit instruction. */
export const encodeVl2re64V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x1, 0x0, 0x0, 0x1, 0x8, rs1, 0x7, vd);

/** Encode vl4re8.v (rv_v) as a 32-bit instruction. */
export const encodeVl4re8V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x3, 0x0, 0x0, 0x1, 0x8, rs1, 0x0, vd);

/** Encode vl4re16.v (rv_v) as a 32-bit instruction. */
export const encodeVl4re16V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x3, 0x0, 0x0, 0x1, 0x8, rs1, 0x5, vd);

/** Encode vl4re32.v (rv_v) as a 32-bit instruction. */
export const encodeVl4re32V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x3, 0x0, 0x0, 0x1, 0x8, rs1, 0x6, vd);

/** Encode vl4re64.v (rv_v) as a 32-bit instruction. */
export const encodeVl4re64V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x3, 0x0, 0x0, 0x1, 0x8, rs1, 0x7, vd);

/** Encode vl8re8.v (rv_v) as a 32-bit instruction. */
export const encodeVl8re8V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x7, 0x0, 0x0, 0x1, 0x8, rs1, 0x0, vd);

/** Encode vl8re16.v (rv_v) as a 32-bit instruction. */
export const encodeVl8re16V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x7, 0x0, 0x0, 0x1, 0x8, rs1, 0x5, vd);

/** Encode vl8re32.v (rv_v) as a 32-bit instruction. */
export const encodeVl8re32V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x7, 0x0, 0x0, 0x1, 0x8, rs1, 0x6, vd);

/** Encode vl8re64.v (rv_v) as a 32-bit instruction. */
export const encodeVl8re64V = (rs1: number, vd: number): Uint8Array =>
  encodeVl(0x7, 0x7, 0x0, 0x0, 0x1, 0x8, rs1, 0x7, vd);

/** Encode vs1r.v (rv_v) as a 32-bit instruction. */
export const encodeVs1rV = (rs1: number, vs3: number): Uint8Array =>
  encodeVs(0x27, 0x0, 0x0, 0x0, 0x1, 0x8, rs1, 0x0, vs3);

/** Encode vs2r.v (rv_v) as a 32-bit instruction. */
export const encodeVs2rV = (rs1: number, vs3: number): Uint8Array =>
  encodeVs(0x27, 0x1, 0x0, 0x0, 0x1, 0x8, rs1, 0x0, vs3);

/** Encode vs4r.v (rv_v) as a 32-bit instruction. */
export const encodeVs4rV = (rs1: number, vs3: number): Uint8Array =>
  encodeVs(0x27, 0x3, 0x0, 0x0, 0x1, 0x8, rs1, 0x0, vs3);

/** Encode vs8r.v (rv_v) as a 32-bit instruction. */
export const encodeVs8rV = (rs1: number, vs3: number): Uint8Array =>
  encodeVs(0x27, 0x7, 0x0, 0x0, 0x1, 0x8, rs1, 0x0, vs3);

/** Encode vfadd.vf (rv_v) as a 32-bit instruction. */
export const encodeVfaddVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x0, vm, vs2, rs1, 0x5, vd);

/** Encode vfsub.vf (rv_v) as a 32-bit instruction. */
export const encodeVfsubVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2, vm, vs2, rs1, 0x5, vd);

/** Encode vfmin.vf (rv_v) as a 32-bit instruction. */
export const encodeVfminVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x4, vm, vs2, rs1, 0x5, vd);

/** Encode vfmax.vf (rv_v) as a 32-bit instruction. */
export const encodeVfmaxVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x6, vm, vs2, rs1, 0x5, vd);

/** Encode vfsgnj.vf (rv_v) as a 32-bit instruction. */
export const encodeVfsgnjVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x8, vm, vs2, rs1, 0x5, vd);

/** Encode vfsgnjn.vf (rv_v) as a 32-bit instruction. */
export const encodeVfsgnjnVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x9, vm, vs2, rs1, 0x5, vd);

/** Encode vfsgnjx.vf (rv_v) as a 32-bit instruction. */
export const encodeVfsgnjxVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xa, vm, vs2, rs1, 0x5, vd);

/** Encode vfslide1up.vf (rv_v) as a 32-bit instruction. */
export const encodeVfslide1upVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xe, vm, vs2, rs1, 0x5, vd);

/** Encode vfslide1down.vf (rv_v) as a 32-bit instruction. */
export const encodeVfslide1downVf = (
  vm: number,
  vs2: number,
  rs1: number,
  vd: number
): Uint8Array => encodeV(0x57, 0xf, vm, vs2, rs1, 0x5, vd);

/** Encode vfmv.s.f (rv_v) as a 32-bit instruction. */
export const encodeVfmvSF = (rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x10, 0x1, 0x0, rs1, 0x5, vd);

/** Encode vfmerge.vfm (rv_v) as a 32-bit instruction. */
export const encodeVfmergeVfm = (vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x17, 0x0, vs2, rs1, 0x5, vd);

/** Encode vfmv.v.f (rv_v) as a 32-bit instruction. */
export const encodeVfmvVF = (rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x17, 0x1, 0x0, rs1, 0x5, vd);

/** Encode vmfeq.vf (rv_v) as a 32-bit instruction. */
export const encodeVmfeqVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x18, vm, vs2, rs1, 0x5, vd);

/** Encode vmfle.vf (rv_v) as a 32-bit instruction. */
export const encodeVmfleVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x19, vm, vs2, rs1, 0x5, vd);

/** Encode vmflt.vf (rv_v) as a 32-bit instruction. */
export const encodeVmfltVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1b, vm, vs2, rs1, 0x5, vd);

/** Encode vmfne.vf (rv_v) as a 32-bit instruction. */
export const encodeVmfneVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1c, vm, vs2, rs1, 0x5, vd);

/** Encode vmfgt.vf (rv_v) as a 32-bit instruction. */
export const encodeVmfgtVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1d, vm, vs2, rs1, 0x5, vd);

/** Encode vmfge.vf (rv_v) as a 32-bit instruction. */
export const encodeVmfgeVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1f, vm, vs2, rs1, 0x5, vd);

/** Encode vfdiv.vf (rv_v) as a 32-bit instruction. */
export const encodeVfdivVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x20, vm, vs2, rs1, 0x5, vd);

/** Encode vfrdiv.vf (rv_v) as a 32-bit instruction. */
export const encodeVfrdivVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x21, vm, vs2, rs1, 0x5, vd);

/** Encode vfmul.vf (rv_v) as a 32-bit instruction. */
export const encodeVfmulVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x24, vm, vs2, rs1, 0x5, vd);

/** Encode vfrsub.vf (rv_v) as a 32-bit instruction. */
export const encodeVfrsubVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x27, vm, vs2, rs1, 0x5, vd);

/** Encode vfmadd.vf (rv_v) as a 32-bit instruction. */
export const encodeVfmaddVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x28, vm, vs2, rs1, 0x5, vd);

/** Encode vfnmadd.vf (rv_v) as a 32-bit instruction. */
export const encodeVfnmaddVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x29, vm, vs2, rs1, 0x5, vd);

/** Encode vfmsub.vf (rv_v) as a 32-bit instruction. */
export const encodeVfmsubVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2a, vm, vs2, rs1, 0x5, vd);

/** Encode vfnmsub.vf (rv_v) as a 32-bit instruction. */
export const encodeVfnmsubVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2b, vm, vs2, rs1, 0x5, vd);

/** Encode vfmacc.vf (rv_v) as a 32-bit instruction. */
export const encodeVfmaccVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2c, vm, vs2, rs1, 0x5, vd);

/** Encode vfnmacc.vf (rv_v) as a 32-bit instruction. */
export const encodeVfnmaccVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2d, vm, vs2, rs1, 0x5, vd);

/** Encode vfmsac.vf (rv_v) as a 32-bit instruction. */
export const encodeVfmsacVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2e, vm, vs2, rs1, 0x5, vd);

/** Encode vfnmsac.vf (rv_v) as a 32-bit instruction. */
export const encodeVfnmsacVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2f, vm, vs2, rs1, 0x5, vd);

/** Encode vfwadd.vf (rv_v) as a 32-bit instruction. */
export const encodeVfwaddVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x30, vm, vs2, rs1, 0x5, vd);

/** Encode vfwsub.vf (rv_v) as a 32-bit instruction. */
export const encodeVfwsubVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x32, vm, vs2, rs1, 0x5, vd);

/** Encode vfwadd.wf (rv_v) as a 32-bit instruction. */
export const encodeVfwaddWf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x34, vm, vs2, rs1, 0x5, vd);

/** Encode vfwsub.wf (rv_v) as a 32-bit instruction. */
export const encodeVfwsubWf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x36, vm, vs2, rs1, 0x5, vd);

/** Encode vfwmul.vf (rv_v) as a 32-bit instruction. */
export const encodeVfwmulVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x38, vm, vs2, rs1, 0x5, vd);

/** Encode vfwmacc.vf (rv_v) as a 32-bit instruction. */
export const encodeVfwmaccVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3c, vm, vs2, rs1, 0x5, vd);

/** Encode vfwnmacc.vf (rv_v) as a 32-bit instruction. */
export const encodeVfwnmaccVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3d, vm, vs2, rs1, 0x5, vd);

/** Encode vfwmsac.vf (rv_v) as a 32-bit instruction. */
export const encodeVfwmsacVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3e, vm, vs2, rs1, 0x5, vd);

/** Encode vfwnmsac.vf (rv_v) as a 32-bit instruction. */
export const encodeVfwnmsacVf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3f, vm, vs2, rs1, 0x5, vd);

/** Encode vfadd.vv (rv_v) as a 32-bit instruction. */
export const encodeVfaddVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x0, vm, vs2, vs1, 0x1, vd);

/** Encode vfredusum.vs (rv_v) as a 32-bit instruction. */
export const encodeVfredusumVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1, vm, vs2, vs1, 0x1, vd);

/** Encode vfsub.vv (rv_v) as a 32-bit instruction. */
export const encodeVfsubVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2, vm, vs2, vs1, 0x1, vd);

/** Encode vfredosum.vs (rv_v) as a 32-bit instruction. */
export const encodeVfredosumVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3, vm, vs2, vs1, 0x1, vd);

/** Encode vfmin.vv (rv_v) as a 32-bit instruction. */
export const encodeVfminVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x4, vm, vs2, vs1, 0x1, vd);

/** Encode vfredmin.vs (rv_v) as a 32-bit instruction. */
export const encodeVfredminVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x5, vm, vs2, vs1, 0x1, vd);

/** Encode vfmax.vv (rv_v) as a 32-bit instruction. */
export const encodeVfmaxVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x6, vm, vs2, vs1, 0x1, vd);

/** Encode vfredmax.vs (rv_v) as a 32-bit instruction. */
export const encodeVfredmaxVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x7, vm, vs2, vs1, 0x1, vd);

/** Encode vfsgnj.vv (rv_v) as a 32-bit instruction. */
export const encodeVfsgnjVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x8, vm, vs2, vs1, 0x1, vd);

/** Encode vfsgnjn.vv (rv_v) as a 32-bit instruction. */
export const encodeVfsgnjnVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x9, vm, vs2, vs1, 0x1, vd);

/** Encode vfsgnjx.vv (rv_v) as a 32-bit instruction. */
export const encodeVfsgnjxVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xa, vm, vs2, vs1, 0x1, vd);

/** Encode vfmv.f.s (rv_v) as a 32-bit instruction. */
export const encodeVfmvFS = (vs2: number, rd: number): Uint8Array =>
  encodeV(0x57, 0x10, 0x1, vs2, 0x0, 0x1, rd);

/** Encode vmfeq.vv (rv_v) as a 32-bit instruction. */
export const encodeVmfeqVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x18, vm, vs2, vs1, 0x1, vd);

/** Encode vmfle.vv (rv_v) as a 32-bit instruction. */
export const encodeVmfleVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x19, vm, vs2, vs1, 0x1, vd);

/** Encode vmflt.vv (rv_v) as a 32-bit instruction. */
export const encodeVmfltVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1b, vm, vs2, vs1, 0x1, vd);

/** Encode vmfne.vv (rv_v) as a 32-bit instruction. */
export const encodeVmfneVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1c, vm, vs2, vs1, 0x1, vd);

/** Encode vfdiv.vv (rv_v) as a 32-bit instruction. */
export const encodeVfdivVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x20, vm, vs2, vs1, 0x1, vd);

/** Encode vfmul.vv (rv_v) as a 32-bit instruction. */
export const encodeVfmulVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x24, vm, vs2, vs1, 0x1, vd);

/** Encode vfmadd.vv (rv_v) as a 32-bit instruction. */
export const encodeVfmaddVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x28, vm, vs2, vs1, 0x1, vd);

/** Encode vfnmadd.vv (rv_v) as a 32-bit instruction. */
export const encodeVfnmaddVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x29, vm, vs2, vs1, 0x1, vd);

/** Encode vfmsub.vv (rv_v) as a 32-bit instruction. */
export const encodeVfmsubVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2a, vm, vs2, vs1, 0x1, vd);

/** Encode vfnmsub.vv (rv_v) as a 32-bit instruction. */
export const encodeVfnmsubVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2b, vm, vs2, vs1, 0x1, vd);

/** Encode vfmacc.vv (rv_v) as a 32-bit instruction. */
export const encodeVfmaccVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2c, vm, vs2, vs1, 0x1, vd);

/** Encode vfnmacc.vv (rv_v) as a 32-bit instruction. */
export const encodeVfnmaccVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2d, vm, vs2, vs1, 0x1, vd);

/** Encode vfmsac.vv (rv_v) as a 32-bit instruction. */
export const encodeVfmsacVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2e, vm, vs2, vs1, 0x1, vd);

/** Encode vfnmsac.vv (rv_v) as a 32-bit instruction. */
export const encodeVfnmsacVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2f, vm, vs2, vs1, 0x1, vd);

/** Encode vfcvt.xu.f.v (rv_v) as a 32-bit instruction. */
export const encodeVfcvtXuFV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x0, 0x1, vd);

/** Encode vfcvt.x.f.v (rv_v) as a 32-bit instruction. */
export const encodeVfcvtXFV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x1, 0x1, vd);

/** Encode vfcvt.f.xu.v (rv_v) as a 32-bit instruction. */
export const encodeVfcvtFXuV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x2, 0x1, vd);

/** Encode vfcvt.f.x.v (rv_v) as a 32-bit instruction. */
export const encodeVfcvtFXV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x3, 0x1, vd);

/** Encode vfcvt.rtz.xu.f.v (rv_v) as a 32-bit instruction. */
export const encodeVfcvtRtzXuFV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x6, 0x1, vd);

/** Encode vfcvt.rtz.x.f.v (rv_v) as a 32-bit instruction. */
export const encodeVfcvtRtzXFV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x7, 0x1, vd);

/** Encode vfwcvt.xu.f.v (rv_v) as a 32-bit instruction. */
export const encodeVfwcvtXuFV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x8, 0x1, vd);

/** Encode vfwcvt.x.f.v (rv_v) as a 32-bit instruction. */
export const encodeVfwcvtXFV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x9, 0x1, vd);

/** Encode vfwcvt.f.xu.v (rv_v) as a 32-bit instruction. */
export const encodeVfwcvtFXuV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0xa, 0x1, vd);

/** Encode vfwcvt.f.x.v (rv_v) as a 32-bit instruction. */
export const encodeVfwcvtFXV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0xb, 0x1, vd);

/** Encode vfwcvt.f.f.v (rv_v) as a 32-bit instruction. */
export const encodeVfwcvtFFV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0xc, 0x1, vd);

/** Encode vfwcvt.rtz.xu.f.v (rv_v) as a 32-bit instruction. */
export const encodeVfwcvtRtzXuFV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0xe, 0x1, vd);

/** Encode vfwcvt.rtz.x.f.v (rv_v) as a 32-bit instruction. */
export const encodeVfwcvtRtzXFV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0xf, 0x1, vd);

/** Encode vfncvt.xu.f.w (rv_v) as a 32-bit instruction. */
export const encodeVfncvtXuFW = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x10, 0x1, vd);

/** Encode vfncvt.x.f.w (rv_v) as a 32-bit instruction. */
export const encodeVfncvtXFW = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x11, 0x1, vd);

/** Encode vfncvt.f.xu.w (rv_v) as a 32-bit instruction. */
export const encodeVfncvtFXuW = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x12, 0x1, vd);

/** Encode vfncvt.f.x.w (rv_v) as a 32-bit instruction. */
export const encodeVfncvtFXW = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x13, 0x1, vd);

/** Encode vfncvt.f.f.w (rv_v) as a 32-bit instruction. */
export const encodeVfncvtFFW = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x14, 0x1, vd);

/** Encode vfncvt.rod.f.f.w (rv_v) as a 32-bit instruction. */
export const encodeVfncvtRodFFW = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x15, 0x1, vd);

/** Encode vfncvt.rtz.xu.f.w (rv_v) as a 32-bit instruction. */
export const encodeVfncvtRtzXuFW = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x16, 0x1, vd);

/** Encode vfncvt.rtz.x.f.w (rv_v) as a 32-bit instruction. */
export const encodeVfncvtRtzXFW = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x17, 0x1, vd);

/** Encode vfsqrt.v (rv_v) as a 32-bit instruction. */
export const encodeVfsqrtV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x13, vm, vs2, 0x0, 0x1, vd);

/** Encode vfrsqrt7.v (rv_v) as a 32-bit instruction. */
export const encodeVfrsqrt7V = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x13, vm, vs2, 0x4, 0x1, vd);

/** Encode vfrec7.v (rv_v) as a 32-bit instruction. */
export const encodeVfrec7V = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x13, vm, vs2, 0x5, 0x1, vd);

/** Encode vfclass.v (rv_v) as a 32-bit instruction. */
export const encodeVfclassV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x13, vm, vs2, 0x10, 0x1, vd);

/** Encode vfwadd.vv (rv_v) as a 32-bit instruction. */
export const encodeVfwaddVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x30, vm, vs2, vs1, 0x1, vd);

/** Encode vfwredusum.vs (rv_v) as a 32-bit instruction. */
export const encodeVfwredusumVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x31, vm, vs2, vs1, 0x1, vd);

/** Encode vfwsub.vv (rv_v) as a 32-bit instruction. */
export const encodeVfwsubVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x32, vm, vs2, vs1, 0x1, vd);

/** Encode vfwredosum.vs (rv_v) as a 32-bit instruction. */
export const encodeVfwredosumVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x33, vm, vs2, vs1, 0x1, vd);

/** Encode vfwadd.wv (rv_v) as a 32-bit instruction. */
export const encodeVfwaddWv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x34, vm, vs2, vs1, 0x1, vd);

/** Encode vfwsub.wv (rv_v) as a 32-bit instruction. */
export const encodeVfwsubWv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x36, vm, vs2, vs1, 0x1, vd);

/** Encode vfwmul.vv (rv_v) as a 32-bit instruction. */
export const encodeVfwmulVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x38, vm, vs2, vs1, 0x1, vd);

/** Encode vfwmacc.vv (rv_v) as a 32-bit instruction. */
export const encodeVfwmaccVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3c, vm, vs2, vs1, 0x1, vd);

/** Encode vfwnmacc.vv (rv_v) as a 32-bit instruction. */
export const encodeVfwnmaccVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3d, vm, vs2, vs1, 0x1, vd);

/** Encode vfwmsac.vv (rv_v) as a 32-bit instruction. */
export const encodeVfwmsacVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3e, vm, vs2, vs1, 0x1, vd);

/** Encode vfwnmsac.vv (rv_v) as a 32-bit instruction. */
export const encodeVfwnmsacVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3f, vm, vs2, vs1, 0x1, vd);

/** Encode vadd.vx (rv_v) as a 32-bit instruction. */
export const encodeVaddVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x0, vm, vs2, rs1, 0x4, vd);

/** Encode vsub.vx (rv_v) as a 32-bit instruction. */
export const encodeVsubVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2, vm, vs2, rs1, 0x4, vd);

/** Encode vrsub.vx (rv_v) as a 32-bit instruction. */
export const encodeVrsubVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3, vm, vs2, rs1, 0x4, vd);

/** Encode vminu.vx (rv_v) as a 32-bit instruction. */
export const encodeVminuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x4, vm, vs2, rs1, 0x4, vd);

/** Encode vmin.vx (rv_v) as a 32-bit instruction. */
export const encodeVminVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x5, vm, vs2, rs1, 0x4, vd);

/** Encode vmaxu.vx (rv_v) as a 32-bit instruction. */
export const encodeVmaxuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x6, vm, vs2, rs1, 0x4, vd);

/** Encode vmax.vx (rv_v) as a 32-bit instruction. */
export const encodeVmaxVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x7, vm, vs2, rs1, 0x4, vd);

/** Encode vand.vx (rv_v) as a 32-bit instruction. */
export const encodeVandVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x9, vm, vs2, rs1, 0x4, vd);

/** Encode vor.vx (rv_v) as a 32-bit instruction. */
export const encodeVorVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xa, vm, vs2, rs1, 0x4, vd);

/** Encode vxor.vx (rv_v) as a 32-bit instruction. */
export const encodeVxorVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xb, vm, vs2, rs1, 0x4, vd);

/** Encode vrgather.vx (rv_v) as a 32-bit instruction. */
export const encodeVrgatherVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xc, vm, vs2, rs1, 0x4, vd);

/** Encode vslideup.vx (rv_v) as a 32-bit instruction. */
export const encodeVslideupVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xe, vm, vs2, rs1, 0x4, vd);

/** Encode vslidedown.vx (rv_v) as a 32-bit instruction. */
export const encodeVslidedownVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xf, vm, vs2, rs1, 0x4, vd);

/** Encode vadc.vxm (rv_v) as a 32-bit instruction. */
export const encodeVadcVxm = (vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x10, 0x0, vs2, rs1, 0x4, vd);

/** Encode vmadc.vxm (rv_v) as a 32-bit instruction. */
export const encodeVmadcVxm = (vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x11, 0x0, vs2, rs1, 0x4, vd);

/** Encode vmadc.vx (rv_v) as a 32-bit instruction. */
export const encodeVmadcVx = (vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x11, 0x1, vs2, rs1, 0x4, vd);

/** Encode vsbc.vxm (rv_v) as a 32-bit instruction. */
export const encodeVsbcVxm = (vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, 0x0, vs2, rs1, 0x4, vd);

/** Encode vmsbc.vxm (rv_v) as a 32-bit instruction. */
export const encodeVmsbcVxm = (vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x13, 0x0, vs2, rs1, 0x4, vd);

/** Encode vmsbc.vx (rv_v) as a 32-bit instruction. */
export const encodeVmsbcVx = (vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x13, 0x1, vs2, rs1, 0x4, vd);

/** Encode vmerge.vxm (rv_v) as a 32-bit instruction. */
export const encodeVmergeVxm = (vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x17, 0x0, vs2, rs1, 0x4, vd);

/** Encode vmv.v.x (rv_v) as a 32-bit instruction. */
export const encodeVmvVX = (rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x17, 0x1, 0x0, rs1, 0x4, vd);

/** Encode vmseq.vx (rv_v) as a 32-bit instruction. */
export const encodeVmseqVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x18, vm, vs2, rs1, 0x4, vd);

/** Encode vmsne.vx (rv_v) as a 32-bit instruction. */
export const encodeVmsneVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x19, vm, vs2, rs1, 0x4, vd);

/** Encode vmsltu.vx (rv_v) as a 32-bit instruction. */
export const encodeVmsltuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1a, vm, vs2, rs1, 0x4, vd);

/** Encode vmslt.vx (rv_v) as a 32-bit instruction. */
export const encodeVmsltVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1b, vm, vs2, rs1, 0x4, vd);

/** Encode vmsleu.vx (rv_v) as a 32-bit instruction. */
export const encodeVmsleuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1c, vm, vs2, rs1, 0x4, vd);

/** Encode vmsle.vx (rv_v) as a 32-bit instruction. */
export const encodeVmsleVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1d, vm, vs2, rs1, 0x4, vd);

/** Encode vmsgtu.vx (rv_v) as a 32-bit instruction. */
export const encodeVmsgtuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1e, vm, vs2, rs1, 0x4, vd);

/** Encode vmsgt.vx (rv_v) as a 32-bit instruction. */
export const encodeVmsgtVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1f, vm, vs2, rs1, 0x4, vd);

/** Encode vsaddu.vx (rv_v) as a 32-bit instruction. */
export const encodeVsadduVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x20, vm, vs2, rs1, 0x4, vd);

/** Encode vsadd.vx (rv_v) as a 32-bit instruction. */
export const encodeVsaddVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x21, vm, vs2, rs1, 0x4, vd);

/** Encode vssubu.vx (rv_v) as a 32-bit instruction. */
export const encodeVssubuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x22, vm, vs2, rs1, 0x4, vd);

/** Encode vssub.vx (rv_v) as a 32-bit instruction. */
export const encodeVssubVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x23, vm, vs2, rs1, 0x4, vd);

/** Encode vsll.vx (rv_v) as a 32-bit instruction. */
export const encodeVsllVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x25, vm, vs2, rs1, 0x4, vd);

/** Encode vsmul.vx (rv_v) as a 32-bit instruction. */
export const encodeVsmulVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x27, vm, vs2, rs1, 0x4, vd);

/** Encode vsrl.vx (rv_v) as a 32-bit instruction. */
export const encodeVsrlVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x28, vm, vs2, rs1, 0x4, vd);

/** Encode vsra.vx (rv_v) as a 32-bit instruction. */
export const encodeVsraVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x29, vm, vs2, rs1, 0x4, vd);

/** Encode vssrl.vx (rv_v) as a 32-bit instruction. */
export const encodeVssrlVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2a, vm, vs2, rs1, 0x4, vd);

/** Encode vssra.vx (rv_v) as a 32-bit instruction. */
export const encodeVssraVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2b, vm, vs2, rs1, 0x4, vd);

/** Encode vnsrl.wx (rv_v) as a 32-bit instruction. */
export const encodeVnsrlWx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2c, vm, vs2, rs1, 0x4, vd);

/** Encode vnsra.wx (rv_v) as a 32-bit instruction. */
export const encodeVnsraWx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2d, vm, vs2, rs1, 0x4, vd);

/** Encode vnclipu.wx (rv_v) as a 32-bit instruction. */
export const encodeVnclipuWx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2e, vm, vs2, rs1, 0x4, vd);

/** Encode vnclip.wx (rv_v) as a 32-bit instruction. */
export const encodeVnclipWx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2f, vm, vs2, rs1, 0x4, vd);

/** Encode vadd.vv (rv_v) as a 32-bit instruction. */
export const encodeVaddVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x0, vm, vs2, vs1, 0x0, vd);

/** Encode vsub.vv (rv_v) as a 32-bit instruction. */
export const encodeVsubVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2, vm, vs2, vs1, 0x0, vd);

/** Encode vminu.vv (rv_v) as a 32-bit instruction. */
export const encodeVminuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x4, vm, vs2, vs1, 0x0, vd);

/** Encode vmin.vv (rv_v) as a 32-bit instruction. */
export const encodeVminVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x5, vm, vs2, vs1, 0x0, vd);

/** Encode vmaxu.vv (rv_v) as a 32-bit instruction. */
export const encodeVmaxuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x6, vm, vs2, vs1, 0x0, vd);

/** Encode vmax.vv (rv_v) as a 32-bit instruction. */
export const encodeVmaxVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x7, vm, vs2, vs1, 0x0, vd);

/** Encode vand.vv (rv_v) as a 32-bit instruction. */
export const encodeVandVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x9, vm, vs2, vs1, 0x0, vd);

/** Encode vor.vv (rv_v) as a 32-bit instruction. */
export const encodeVorVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xa, vm, vs2, vs1, 0x0, vd);

/** Encode vxor.vv (rv_v) as a 32-bit instruction. */
export const encodeVxorVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xb, vm, vs2, vs1, 0x0, vd);

/** Encode vrgather.vv (rv_v) as a 32-bit instruction. */
export const encodeVrgatherVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xc, vm, vs2, vs1, 0x0, vd);

/** Encode vrgatherei16.vv (rv_v) as a 32-bit instruction. */
export const encodeVrgatherei16Vv = (
  vm: number,
  vs2: number,
  vs1: number,
  vd: number
): Uint8Array => encodeV(0x57, 0xe, vm, vs2, vs1, 0x0, vd);

/** Encode vadc.vvm (rv_v) as a 32-bit instruction. */
export const encodeVadcVvm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x10, 0x0, vs2, vs1, 0x0, vd);

/** Encode vmadc.vvm (rv_v) as a 32-bit instruction. */
export const encodeVmadcVvm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x11, 0x0, vs2, vs1, 0x0, vd);

/** Encode vmadc.vv (rv_v) as a 32-bit instruction. */
export const encodeVmadcVv = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x11, 0x1, vs2, vs1, 0x0, vd);

/** Encode vsbc.vvm (rv_v) as a 32-bit instruction. */
export const encodeVsbcVvm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, 0x0, vs2, vs1, 0x0, vd);

/** Encode vmsbc.vvm (rv_v) as a 32-bit instruction. */
export const encodeVmsbcVvm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x13, 0x0, vs2, vs1, 0x0, vd);

/** Encode vmsbc.vv (rv_v) as a 32-bit instruction. */
export const encodeVmsbcVv = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x13, 0x1, vs2, vs1, 0x0, vd);

/** Encode vmerge.vvm (rv_v) as a 32-bit instruction. */
export const encodeVmergeVvm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x17, 0x0, vs2, vs1, 0x0, vd);

/** Encode vmv.v.v (rv_v) as a 32-bit instruction. */
export const encodeVmvVV = (vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x17, 0x1, 0x0, vs1, 0x0, vd);

/** Encode vmseq.vv (rv_v) as a 32-bit instruction. */
export const encodeVmseqVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x18, vm, vs2, vs1, 0x0, vd);

/** Encode vmsne.vv (rv_v) as a 32-bit instruction. */
export const encodeVmsneVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x19, vm, vs2, vs1, 0x0, vd);

/** Encode vmsltu.vv (rv_v) as a 32-bit instruction. */
export const encodeVmsltuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1a, vm, vs2, vs1, 0x0, vd);

/** Encode vmslt.vv (rv_v) as a 32-bit instruction. */
export const encodeVmsltVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1b, vm, vs2, vs1, 0x0, vd);

/** Encode vmsleu.vv (rv_v) as a 32-bit instruction. */
export const encodeVmsleuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1c, vm, vs2, vs1, 0x0, vd);

/** Encode vmsle.vv (rv_v) as a 32-bit instruction. */
export const encodeVmsleVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1d, vm, vs2, vs1, 0x0, vd);

/** Encode vsaddu.vv (rv_v) as a 32-bit instruction. */
export const encodeVsadduVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x20, vm, vs2, vs1, 0x0, vd);

/** Encode vsadd.vv (rv_v) as a 32-bit instruction. */
export const encodeVsaddVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x21, vm, vs2, vs1, 0x0, vd);

/** Encode vssubu.vv (rv_v) as a 32-bit instruction. */
export const encodeVssubuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x22, vm, vs2, vs1, 0x0, vd);

/** Encode vssub.vv (rv_v) as a 32-bit instruction. */
export const encodeVssubVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x23, vm, vs2, vs1, 0x0, vd);

/** Encode vsll.vv (rv_v) as a 32-bit instruction. */
export const encodeVsllVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x25, vm, vs2, vs1, 0x0, vd);

/** Encode vsmul.vv (rv_v) as a 32-bit instruction. */
export const encodeVsmulVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x27, vm, vs2, vs1, 0x0, vd);

/** Encode vsrl.vv (rv_v) as a 32-bit instruction. */
export const encodeVsrlVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x28, vm, vs2, vs1, 0x0, vd);

/** Encode vsra.vv (rv_v) as a 32-bit instruction. */
export const encodeVsraVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x29, vm, vs2, vs1, 0x0, vd);

/** Encode vssrl.vv (rv_v) as a 32-bit instruction. */
export const encodeVssrlVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2a, vm, vs2, vs1, 0x0, vd);

/** Encode vssra.vv (rv_v) as a 32-bit instruction. */
export const encodeVssraVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2b, vm, vs2, vs1, 0x0, vd);

/** Encode vnsrl.wv (rv_v) as a 32-bit instruction. */
export const encodeVnsrlWv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2c, vm, vs2, vs1, 0x0, vd);

/** Encode vnsra.wv (rv_v) as a 32-bit instruction. */
export const encodeVnsraWv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2d, vm, vs2, vs1, 0x0, vd);

/** Encode vnclipu.wv (rv_v) as a 32-bit instruction. */
export const encodeVnclipuWv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2e, vm, vs2, vs1, 0x0, vd);

/** Encode vnclip.wv (rv_v) as a 32-bit instruction. */
export const encodeVnclipWv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2f, vm, vs2, vs1, 0x0, vd);

/** Encode vwredsumu.vs (rv_v) as a 32-bit instruction. */
export const encodeVwredsumuVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x30, vm, vs2, vs1, 0x0, vd);

/** Encode vwredsum.vs (rv_v) as a 32-bit instruction. */
export const encodeVwredsumVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x31, vm, vs2, vs1, 0x0, vd);

/** Encode vadd.vi (rv_v) as a 32-bit instruction. */
export const encodeVaddVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x0, vm, vs2, simm5, 0x3, vd);

/** Encode vrsub.vi (rv_v) as a 32-bit instruction. */
export const encodeVrsubVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3, vm, vs2, simm5, 0x3, vd);

/** Encode vand.vi (rv_v) as a 32-bit instruction. */
export const encodeVandVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x9, vm, vs2, simm5, 0x3, vd);

/** Encode vor.vi (rv_v) as a 32-bit instruction. */
export const encodeVorVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xa, vm, vs2, simm5, 0x3, vd);

/** Encode vxor.vi (rv_v) as a 32-bit instruction. */
export const encodeVxorVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xb, vm, vs2, simm5, 0x3, vd);

/** Encode vrgather.vi (rv_v) as a 32-bit instruction. */
export const encodeVrgatherVi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xc, vm, vs2, zimm5, 0x3, vd);

/** Encode vslideup.vi (rv_v) as a 32-bit instruction. */
export const encodeVslideupVi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xe, vm, vs2, zimm5, 0x3, vd);

/** Encode vslidedown.vi (rv_v) as a 32-bit instruction. */
export const encodeVslidedownVi = (
  vm: number,
  vs2: number,
  zimm5: number,
  vd: number
): Uint8Array => encodeV(0x57, 0xf, vm, vs2, zimm5, 0x3, vd);

/** Encode vadc.vim (rv_v) as a 32-bit instruction. */
export const encodeVadcVim = (vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x10, 0x0, vs2, simm5, 0x3, vd);

/** Encode vmadc.vim (rv_v) as a 32-bit instruction. */
export const encodeVmadcVim = (vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x11, 0x0, vs2, simm5, 0x3, vd);

/** Encode vmadc.vi (rv_v) as a 32-bit instruction. */
export const encodeVmadcVi = (vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x11, 0x1, vs2, simm5, 0x3, vd);

/** Encode vmerge.vim (rv_v) as a 32-bit instruction. */
export const encodeVmergeVim = (vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x17, 0x0, vs2, simm5, 0x3, vd);

/** Encode vmv.v.i (rv_v) as a 32-bit instruction. */
export const encodeVmvVI = (simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x17, 0x1, 0x0, simm5, 0x3, vd);

/** Encode vmseq.vi (rv_v) as a 32-bit instruction. */
export const encodeVmseqVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x18, vm, vs2, simm5, 0x3, vd);

/** Encode vmsne.vi (rv_v) as a 32-bit instruction. */
export const encodeVmsneVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x19, vm, vs2, simm5, 0x3, vd);

/** Encode vmsleu.vi (rv_v) as a 32-bit instruction. */
export const encodeVmsleuVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1c, vm, vs2, simm5, 0x3, vd);

/** Encode vmsle.vi (rv_v) as a 32-bit instruction. */
export const encodeVmsleVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1d, vm, vs2, simm5, 0x3, vd);

/** Encode vmsgtu.vi (rv_v) as a 32-bit instruction. */
export const encodeVmsgtuVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1e, vm, vs2, simm5, 0x3, vd);

/** Encode vmsgt.vi (rv_v) as a 32-bit instruction. */
export const encodeVmsgtVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1f, vm, vs2, simm5, 0x3, vd);

/** Encode vsaddu.vi (rv_v) as a 32-bit instruction. */
export const encodeVsadduVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x20, vm, vs2, simm5, 0x3, vd);

/** Encode vsadd.vi (rv_v) as a 32-bit instruction. */
export const encodeVsaddVi = (vm: number, vs2: number, simm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x21, vm, vs2, simm5, 0x3, vd);

/** Encode vsll.vi (rv_v) as a 32-bit instruction. */
export const encodeVsllVi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x25, vm, vs2, zimm5, 0x3, vd);

/** Encode vmv1r.v (rv_v) as a 32-bit instruction. */
export const encodeVmv1rV = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x27, 0x1, vs2, 0x0, 0x3, vd);

/** Encode vmv2r.v (rv_v) as a 32-bit instruction. */
export const encodeVmv2rV = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x27, 0x1, vs2, 0x1, 0x3, vd);

/** Encode vmv4r.v (rv_v) as a 32-bit instruction. */
export const encodeVmv4rV = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x27, 0x1, vs2, 0x3, 0x3, vd);

/** Encode vmv8r.v (rv_v) as a 32-bit instruction. */
export const encodeVmv8rV = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x27, 0x1, vs2, 0x7, 0x3, vd);

/** Encode vsrl.vi (rv_v) as a 32-bit instruction. */
export const encodeVsrlVi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x28, vm, vs2, zimm5, 0x3, vd);

/** Encode vsra.vi (rv_v) as a 32-bit instruction. */
export const encodeVsraVi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x29, vm, vs2, zimm5, 0x3, vd);

/** Encode vssrl.vi (rv_v) as a 32-bit instruction. */
export const encodeVssrlVi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2a, vm, vs2, zimm5, 0x3, vd);

/** Encode vssra.vi (rv_v) as a 32-bit instruction. */
export const encodeVssraVi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2b, vm, vs2, zimm5, 0x3, vd);

/** Encode vnsrl.wi (rv_v) as a 32-bit instruction. */
export const encodeVnsrlWi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2c, vm, vs2, zimm5, 0x3, vd);

/** Encode vnsra.wi (rv_v) as a 32-bit instruction. */
export const encodeVnsraWi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2d, vm, vs2, zimm5, 0x3, vd);

/** Encode vnclipu.wi (rv_v) as a 32-bit instruction. */
export const encodeVnclipuWi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2e, vm, vs2, zimm5, 0x3, vd);

/** Encode vnclip.wi (rv_v) as a 32-bit instruction. */
export const encodeVnclipWi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2f, vm, vs2, zimm5, 0x3, vd);

/** Encode vredsum.vs (rv_v) as a 32-bit instruction. */
export const encodeVredsumVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x0, vm, vs2, vs1, 0x2, vd);

/** Encode vredand.vs (rv_v) as a 32-bit instruction. */
export const encodeVredandVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1, vm, vs2, vs1, 0x2, vd);

/** Encode vredor.vs (rv_v) as a 32-bit instruction. */
export const encodeVredorVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2, vm, vs2, vs1, 0x2, vd);

/** Encode vredxor.vs (rv_v) as a 32-bit instruction. */
export const encodeVredxorVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3, vm, vs2, vs1, 0x2, vd);

/** Encode vredminu.vs (rv_v) as a 32-bit instruction. */
export const encodeVredminuVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x4, vm, vs2, vs1, 0x2, vd);

/** Encode vredmin.vs (rv_v) as a 32-bit instruction. */
export const encodeVredminVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x5, vm, vs2, vs1, 0x2, vd);

/** Encode vredmaxu.vs (rv_v) as a 32-bit instruction. */
export const encodeVredmaxuVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x6, vm, vs2, vs1, 0x2, vd);

/** Encode vredmax.vs (rv_v) as a 32-bit instruction. */
export const encodeVredmaxVs = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x7, vm, vs2, vs1, 0x2, vd);

/** Encode vaaddu.vv (rv_v) as a 32-bit instruction. */
export const encodeVaadduVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x8, vm, vs2, vs1, 0x2, vd);

/** Encode vaadd.vv (rv_v) as a 32-bit instruction. */
export const encodeVaaddVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x9, vm, vs2, vs1, 0x2, vd);

/** Encode vasubu.vv (rv_v) as a 32-bit instruction. */
export const encodeVasubuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xa, vm, vs2, vs1, 0x2, vd);

/** Encode vasub.vv (rv_v) as a 32-bit instruction. */
export const encodeVasubVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xb, vm, vs2, vs1, 0x2, vd);

/** Encode vmv.x.s (rv_v) as a 32-bit instruction. */
export const encodeVmvXS = (vs2: number, rd: number): Uint8Array =>
  encodeV(0x57, 0x10, 0x1, vs2, 0x0, 0x2, rd);

/** Encode vzext.vf8 (rv_v) as a 32-bit instruction. */
export const encodeVzextVf8 = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x2, 0x2, vd);

/** Encode vsext.vf8 (rv_v) as a 32-bit instruction. */
export const encodeVsextVf8 = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x3, 0x2, vd);

/** Encode vzext.vf4 (rv_v) as a 32-bit instruction. */
export const encodeVzextVf4 = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x4, 0x2, vd);

/** Encode vsext.vf4 (rv_v) as a 32-bit instruction. */
export const encodeVsextVf4 = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x5, 0x2, vd);

/** Encode vzext.vf2 (rv_v) as a 32-bit instruction. */
export const encodeVzextVf2 = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x6, 0x2, vd);

/** Encode vsext.vf2 (rv_v) as a 32-bit instruction. */
export const encodeVsextVf2 = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x7, 0x2, vd);

/** Encode vcompress.vm (rv_v) as a 32-bit instruction. */
export const encodeVcompressVm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x17, 0x1, vs2, vs1, 0x2, vd);

/** Encode vmandn.mm (rv_v) as a 32-bit instruction. */
export const encodeVmandnMm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x18, 0x1, vs2, vs1, 0x2, vd);

/** Encode vmand.mm (rv_v) as a 32-bit instruction. */
export const encodeVmandMm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x19, 0x1, vs2, vs1, 0x2, vd);

/** Encode vmor.mm (rv_v) as a 32-bit instruction. */
export const encodeVmorMm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1a, 0x1, vs2, vs1, 0x2, vd);

/** Encode vmxor.mm (rv_v) as a 32-bit instruction. */
export const encodeVmxorMm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1b, 0x1, vs2, vs1, 0x2, vd);

/** Encode vmorn.mm (rv_v) as a 32-bit instruction. */
export const encodeVmornMm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1c, 0x1, vs2, vs1, 0x2, vd);

/** Encode vmnand.mm (rv_v) as a 32-bit instruction. */
export const encodeVmnandMm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1d, 0x1, vs2, vs1, 0x2, vd);

/** Encode vmnor.mm (rv_v) as a 32-bit instruction. */
export const encodeVmnorMm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1e, 0x1, vs2, vs1, 0x2, vd);

/** Encode vmxnor.mm (rv_v) as a 32-bit instruction. */
export const encodeVmxnorMm = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1f, 0x1, vs2, vs1, 0x2, vd);

/** Encode vmsbf.m (rv_v) as a 32-bit instruction. */
export const encodeVmsbfM = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x14, vm, vs2, 0x1, 0x2, vd);

/** Encode vmsof.m (rv_v) as a 32-bit instruction. */
export const encodeVmsofM = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x14, vm, vs2, 0x2, 0x2, vd);

/** Encode vmsif.m (rv_v) as a 32-bit instruction. */
export const encodeVmsifM = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x14, vm, vs2, 0x3, 0x2, vd);

/** Encode viota.m (rv_v) as a 32-bit instruction. */
export const encodeViotaM = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x14, vm, vs2, 0x10, 0x2, vd);

/** Encode vid.v (rv_v) as a 32-bit instruction. */
export const encodeVidV = (vm: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x14, vm, 0x0, 0x11, 0x2, vd);

/** Encode vcpop.m (rv_v) as a 32-bit instruction. */
export const encodeVcpopM = (vm: number, vs2: number, rd: number): Uint8Array =>
  encodeV(0x57, 0x10, vm, vs2, 0x10, 0x2, rd);

/** Encode vfirst.m (rv_v) as a 32-bit instruction. */
export const encodeVfirstM = (vm: number, vs2: number, rd: number): Uint8Array =>
  encodeV(0x57, 0x10, vm, vs2, 0x11, 0x2, rd);

/** Encode vdivu.vv (rv_v) as a 32-bit instruction. */
export const encodeVdivuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x20, vm, vs2, vs1, 0x2, vd);

/** Encode vdiv.vv (rv_v) as a 32-bit instruction. */
export const encodeVdivVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x21, vm, vs2, vs1, 0x2, vd);

/** Encode vremu.vv (rv_v) as a 32-bit instruction. */
export const encodeVremuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x22, vm, vs2, vs1, 0x2, vd);

/** Encode vrem.vv (rv_v) as a 32-bit instruction. */
export const encodeVremVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x23, vm, vs2, vs1, 0x2, vd);

/** Encode vmulhu.vv (rv_v) as a 32-bit instruction. */
export const encodeVmulhuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x24, vm, vs2, vs1, 0x2, vd);

/** Encode vmul.vv (rv_v) as a 32-bit instruction. */
export const encodeVmulVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x25, vm, vs2, vs1, 0x2, vd);

/** Encode vmulhsu.vv (rv_v) as a 32-bit instruction. */
export const encodeVmulhsuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x26, vm, vs2, vs1, 0x2, vd);

/** Encode vmulh.vv (rv_v) as a 32-bit instruction. */
export const encodeVmulhVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x27, vm, vs2, vs1, 0x2, vd);

/** Encode vmadd.vv (rv_v) as a 32-bit instruction. */
export const encodeVmaddVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x29, vm, vs2, vs1, 0x2, vd);

/** Encode vnmsub.vv (rv_v) as a 32-bit instruction. */
export const encodeVnmsubVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2b, vm, vs2, vs1, 0x2, vd);

/** Encode vmacc.vv (rv_v) as a 32-bit instruction. */
export const encodeVmaccVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2d, vm, vs2, vs1, 0x2, vd);

/** Encode vnmsac.vv (rv_v) as a 32-bit instruction. */
export const encodeVnmsacVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2f, vm, vs2, vs1, 0x2, vd);

/** Encode vwaddu.vv (rv_v) as a 32-bit instruction. */
export const encodeVwadduVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x30, vm, vs2, vs1, 0x2, vd);

/** Encode vwadd.vv (rv_v) as a 32-bit instruction. */
export const encodeVwaddVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x31, vm, vs2, vs1, 0x2, vd);

/** Encode vwsubu.vv (rv_v) as a 32-bit instruction. */
export const encodeVwsubuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x32, vm, vs2, vs1, 0x2, vd);

/** Encode vwsub.vv (rv_v) as a 32-bit instruction. */
export const encodeVwsubVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x33, vm, vs2, vs1, 0x2, vd);

/** Encode vwaddu.wv (rv_v) as a 32-bit instruction. */
export const encodeVwadduWv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x34, vm, vs2, vs1, 0x2, vd);

/** Encode vwadd.wv (rv_v) as a 32-bit instruction. */
export const encodeVwaddWv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x35, vm, vs2, vs1, 0x2, vd);

/** Encode vwsubu.wv (rv_v) as a 32-bit instruction. */
export const encodeVwsubuWv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x36, vm, vs2, vs1, 0x2, vd);

/** Encode vwsub.wv (rv_v) as a 32-bit instruction. */
export const encodeVwsubWv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x37, vm, vs2, vs1, 0x2, vd);

/** Encode vwmulu.vv (rv_v) as a 32-bit instruction. */
export const encodeVwmuluVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x38, vm, vs2, vs1, 0x2, vd);

/** Encode vwmulsu.vv (rv_v) as a 32-bit instruction. */
export const encodeVwmulsuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3a, vm, vs2, vs1, 0x2, vd);

/** Encode vwmul.vv (rv_v) as a 32-bit instruction. */
export const encodeVwmulVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3b, vm, vs2, vs1, 0x2, vd);

/** Encode vwmaccu.vv (rv_v) as a 32-bit instruction. */
export const encodeVwmaccuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3c, vm, vs2, vs1, 0x2, vd);

/** Encode vwmacc.vv (rv_v) as a 32-bit instruction. */
export const encodeVwmaccVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3d, vm, vs2, vs1, 0x2, vd);

/** Encode vwmaccsu.vv (rv_v) as a 32-bit instruction. */
export const encodeVwmaccsuVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3f, vm, vs2, vs1, 0x2, vd);

/** Encode vaaddu.vx (rv_v) as a 32-bit instruction. */
export const encodeVaadduVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x8, vm, vs2, rs1, 0x6, vd);

/** Encode vaadd.vx (rv_v) as a 32-bit instruction. */
export const encodeVaaddVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x9, vm, vs2, rs1, 0x6, vd);

/** Encode vasubu.vx (rv_v) as a 32-bit instruction. */
export const encodeVasubuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xa, vm, vs2, rs1, 0x6, vd);

/** Encode vasub.vx (rv_v) as a 32-bit instruction. */
export const encodeVasubVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xb, vm, vs2, rs1, 0x6, vd);

/** Encode vmv.s.x (rv_v) as a 32-bit instruction. */
export const encodeVmvSX = (rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x10, 0x1, 0x0, rs1, 0x6, vd);

/** Encode vslide1up.vx (rv_v) as a 32-bit instruction. */
export const encodeVslide1upVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xe, vm, vs2, rs1, 0x6, vd);

/** Encode vslide1down.vx (rv_v) as a 32-bit instruction. */
export const encodeVslide1downVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xf, vm, vs2, rs1, 0x6, vd);

/** Encode vdivu.vx (rv_v) as a 32-bit instruction. */
export const encodeVdivuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x20, vm, vs2, rs1, 0x6, vd);

/** Encode vdiv.vx (rv_v) as a 32-bit instruction. */
export const encodeVdivVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x21, vm, vs2, rs1, 0x6, vd);

/** Encode vremu.vx (rv_v) as a 32-bit instruction. */
export const encodeVremuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x22, vm, vs2, rs1, 0x6, vd);

/** Encode vrem.vx (rv_v) as a 32-bit instruction. */
export const encodeVremVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x23, vm, vs2, rs1, 0x6, vd);

/** Encode vmulhu.vx (rv_v) as a 32-bit instruction. */
export const encodeVmulhuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x24, vm, vs2, rs1, 0x6, vd);

/** Encode vmul.vx (rv_v) as a 32-bit instruction. */
export const encodeVmulVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x25, vm, vs2, rs1, 0x6, vd);

/** Encode vmulhsu.vx (rv_v) as a 32-bit instruction. */
export const encodeVmulhsuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x26, vm, vs2, rs1, 0x6, vd);

/** Encode vmulh.vx (rv_v) as a 32-bit instruction. */
export const encodeVmulhVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x27, vm, vs2, rs1, 0x6, vd);

/** Encode vmadd.vx (rv_v) as a 32-bit instruction. */
export const encodeVmaddVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x29, vm, vs2, rs1, 0x6, vd);

/** Encode vnmsub.vx (rv_v) as a 32-bit instruction. */
export const encodeVnmsubVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2b, vm, vs2, rs1, 0x6, vd);

/** Encode vmacc.vx (rv_v) as a 32-bit instruction. */
export const encodeVmaccVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2d, vm, vs2, rs1, 0x6, vd);

/** Encode vnmsac.vx (rv_v) as a 32-bit instruction. */
export const encodeVnmsacVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x2f, vm, vs2, rs1, 0x6, vd);

/** Encode vwaddu.vx (rv_v) as a 32-bit instruction. */
export const encodeVwadduVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x30, vm, vs2, rs1, 0x6, vd);

/** Encode vwadd.vx (rv_v) as a 32-bit instruction. */
export const encodeVwaddVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x31, vm, vs2, rs1, 0x6, vd);

/** Encode vwsubu.vx (rv_v) as a 32-bit instruction. */
export const encodeVwsubuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x32, vm, vs2, rs1, 0x6, vd);

/** Encode vwsub.vx (rv_v) as a 32-bit instruction. */
export const encodeVwsubVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x33, vm, vs2, rs1, 0x6, vd);

/** Encode vwaddu.wx (rv_v) as a 32-bit instruction. */
export const encodeVwadduWx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x34, vm, vs2, rs1, 0x6, vd);

/** Encode vwadd.wx (rv_v) as a 32-bit instruction. */
export const encodeVwaddWx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x35, vm, vs2, rs1, 0x6, vd);

/** Encode vwsubu.wx (rv_v) as a 32-bit instruction. */
export const encodeVwsubuWx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x36, vm, vs2, rs1, 0x6, vd);

/** Encode vwsub.wx (rv_v) as a 32-bit instruction. */
export const encodeVwsubWx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x37, vm, vs2, rs1, 0x6, vd);

/** Encode vwmulu.vx (rv_v) as a 32-bit instruction. */
export const encodeVwmuluVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x38, vm, vs2, rs1, 0x6, vd);

/** Encode vwmulsu.vx (rv_v) as a 32-bit instruction. */
export const encodeVwmulsuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3a, vm, vs2, rs1, 0x6, vd);

/** Encode vwmul.vx (rv_v) as a 32-bit instruction. */
export const encodeVwmulVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3b, vm, vs2, rs1, 0x6, vd);

/** Encode vwmaccu.vx (rv_v) as a 32-bit instruction. */
export const encodeVwmaccuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3c, vm, vs2, rs1, 0x6, vd);

/** Encode vwmacc.vx (rv_v) as a 32-bit instruction. */
export const encodeVwmaccVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3d, vm, vs2, rs1, 0x6, vd);

/** Encode vwmaccus.vx (rv_v) as a 32-bit instruction. */
export const encodeVwmaccusVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3e, vm, vs2, rs1, 0x6, vd);

/** Encode vwmaccsu.vx (rv_v) as a 32-bit instruction. */
export const encodeVwmaccsuVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3f, vm, vs2, rs1, 0x6, vd);

/** Encode amoswap.b (rv_zabha) as a 32-bit instruction. */
export const encodeAmoswapB = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x1, aq, rl, 0x0, rd, rs1, rs2);

/** Encode amoadd.b (rv_zabha) as a 32-bit instruction. */
export const encodeAmoaddB = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x0, aq, rl, 0x0, rd, rs1, rs2);

/** Encode amoxor.b (rv_zabha) as a 32-bit instruction. */
export const encodeAmoxorB = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x4, aq, rl, 0x0, rd, rs1, rs2);

/** Encode amoand.b (rv_zabha) as a 32-bit instruction. */
export const encodeAmoandB = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0xc, aq, rl, 0x0, rd, rs1, rs2);

/** Encode amoor.b (rv_zabha) as a 32-bit instruction. */
export const encodeAmoorB = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x8, aq, rl, 0x0, rd, rs1, rs2);

/** Encode amomin.b (rv_zabha) as a 32-bit instruction. */
export const encodeAmominB = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x10, aq, rl, 0x0, rd, rs1, rs2);

/** Encode amomax.b (rv_zabha) as a 32-bit instruction. */
export const encodeAmomaxB = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x14, aq, rl, 0x0, rd, rs1, rs2);

/** Encode amominu.b (rv_zabha) as a 32-bit instruction. */
export const encodeAmominuB = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x18, aq, rl, 0x0, rd, rs1, rs2);

/** Encode amomaxu.b (rv_zabha) as a 32-bit instruction. */
export const encodeAmomaxuB = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x1c, aq, rl, 0x0, rd, rs1, rs2);

/** Encode amoswap.h (rv_zabha) as a 32-bit instruction. */
export const encodeAmoswapH = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x1, aq, rl, 0x1, rd, rs1, rs2);

/** Encode amoadd.h (rv_zabha) as a 32-bit instruction. */
export const encodeAmoaddH = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x0, aq, rl, 0x1, rd, rs1, rs2);

/** Encode amoxor.h (rv_zabha) as a 32-bit instruction. */
export const encodeAmoxorH = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x4, aq, rl, 0x1, rd, rs1, rs2);

/** Encode amoand.h (rv_zabha) as a 32-bit instruction. */
export const encodeAmoandH = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0xc, aq, rl, 0x1, rd, rs1, rs2);

/** Encode amoor.h (rv_zabha) as a 32-bit instruction. */
export const encodeAmoorH = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x8, aq, rl, 0x1, rd, rs1, rs2);

/** Encode amomin.h (rv_zabha) as a 32-bit instruction. */
export const encodeAmominH = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x10, aq, rl, 0x1, rd, rs1, rs2);

/** Encode amomax.h (rv_zabha) as a 32-bit instruction. */
export const encodeAmomaxH = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x14, aq, rl, 0x1, rd, rs1, rs2);

/** Encode amominu.h (rv_zabha) as a 32-bit instruction. */
export const encodeAmominuH = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x18, aq, rl, 0x1, rd, rs1, rs2);

/** Encode amomaxu.h (rv_zabha) as a 32-bit instruction. */
export const encodeAmomaxuH = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x1c, aq, rl, 0x1, rd, rs1, rs2);

/** Encode amocas.b (rv_zabha_zacas) as a 32-bit instruction. */
export const encodeAmocasB = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x5, aq, rl, 0x0, rd, rs1, rs2);

/** Encode amocas.h (rv_zabha_zacas) as a 32-bit instruction. */
export const encodeAmocasH = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x5, aq, rl, 0x1, rd, rs1, rs2);

/** Encode amocas.w (rv_zacas) as a 32-bit instruction. */
export const encodeAmocasW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x5, aq, rl, 0x2, rd, rs1, rs2);

/** Encode amocas.d (rv_zacas) as a 32-bit instruction. */
export const encodeAmocasD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x5, aq, rl, 0x3, rd, rs1, rs2);

/** Encode lb.aq (rv_zalasr) as a 32-bit instruction. */
export const encodeLbAq = (rd: number, rs1: number, rl: number): Uint8Array =>
  encodeA(0x2f, 0x6, 0x1, rl, 0x0, rd, rs1, 0x0);

/** Encode lh.aq (rv_zalasr) as a 32-bit instruction. */
export const encodeLhAq = (rd: number, rs1: number, rl: number): Uint8Array =>
  encodeA(0x2f, 0x6, 0x1, rl, 0x1, rd, rs1, 0x0);

/** Encode lw.aq (rv_zalasr) as a 32-bit instruction. */
export const encodeLwAq = (rd: number, rs1: number, rl: number): Uint8Array =>
  encodeA(0x2f, 0x6, 0x1, rl, 0x2, rd, rs1, 0x0);

/** Encode ld.aq (rv_zalasr) as a 32-bit instruction. */
export const encodeLdAq = (rd: number, rs1: number, rl: number): Uint8Array =>
  encodeA(0x2f, 0x6, 0x1, rl, 0x3, rd, rs1, 0x0);

/** Encode sb.rl (rv_zalasr) as a 32-bit instruction. */
export const encodeSbRl = (rs1: number, rs2: number, aq: number): Uint8Array =>
  encodeA(0x2f, 0x7, aq, 0x1, 0x0, 0x0, rs1, rs2);

/** Encode sh.rl (rv_zalasr) as a 32-bit instruction. */
export const encodeShRl = (rs1: number, rs2: number, aq: number): Uint8Array =>
  encodeA(0x2f, 0x7, aq, 0x1, 0x1, 0x0, rs1, rs2);

/** Encode sw.rl (rv_zalasr) as a 32-bit instruction. */
export const encodeSwRl = (rs1: number, rs2: number, aq: number): Uint8Array =>
  encodeA(0x2f, 0x7, aq, 0x1, 0x2, 0x0, rs1, rs2);

/** Encode sd.rl (rv_zalasr) as a 32-bit instruction. */
export const encodeSdRl = (rs1: number, rs2: number, aq: number): Uint8Array =>
  encodeA(0x2f, 0x7, aq, 0x1, 0x3, 0x0, rs1, rs2);

/** Encode wrs.nto (rv_zawrs) as a 32-bit instruction. */
export const encodeWrsNto = (): Uint8Array => encodeI(0x73, 0x0, 0xd, 0x0, 0x0);

/** Encode wrs.sto (rv_zawrs) as a 32-bit instruction. */
export const encodeWrsSto = (): Uint8Array => encodeI(0x73, 0x0, 0x1d, 0x0, 0x0);

/** Encode sh1add (rv_zba) as a 32-bit instruction. */
export const encodeSh1add = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x2, 0x10, rd, rs1, rs2);

/** Encode sh2add (rv_zba) as a 32-bit instruction. */
export const encodeSh2add = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x4, 0x10, rd, rs1, rs2);

/** Encode sh3add (rv_zba) as a 32-bit instruction. */
export const encodeSh3add = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x6, 0x10, rd, rs1, rs2);

/** Encode andn (rv_zbb) as a 32-bit instruction. */
export const encodeAndn = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x7, 0x20, rd, rs1, rs2);

/** Encode orn (rv_zbb) as a 32-bit instruction. */
export const encodeOrn = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x6, 0x20, rd, rs1, rs2);

/** Encode xnor (rv_zbb) as a 32-bit instruction. */
export const encodeXnor = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x4, 0x20, rd, rs1, rs2);

/** Encode clz (rv_zbb) as a 32-bit instruction. */
export const encodeClz = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x600, rd, rs1);

/** Encode ctz (rv_zbb) as a 32-bit instruction. */
export const encodeCtz = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x601, rd, rs1);

/** Encode cpop (rv_zbb) as a 32-bit instruction. */
export const encodeCpop = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x602, rd, rs1);

/** Encode max (rv_zbb) as a 32-bit instruction. */
export const encodeMax = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x6, 0x5, rd, rs1, rs2);

/** Encode maxu (rv_zbb) as a 32-bit instruction. */
export const encodeMaxu = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x7, 0x5, rd, rs1, rs2);

/** Encode min (rv_zbb) as a 32-bit instruction. */
export const encodeMin = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x4, 0x5, rd, rs1, rs2);

/** Encode minu (rv_zbb) as a 32-bit instruction. */
export const encodeMinu = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x5, 0x5, rd, rs1, rs2);

/** Encode sext.b (rv_zbb) as a 32-bit instruction. */
export const encodeSextB = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x604, rd, rs1);

/** Encode sext.h (rv_zbb) as a 32-bit instruction. */
export const encodeSextH = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x605, rd, rs1);

/** Encode rol (rv_zbb) as a 32-bit instruction. */
export const encodeRol = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x1, 0x30, rd, rs1, rs2);

/** Encode ror (rv_zbb) as a 32-bit instruction. */
export const encodeRor = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x5, 0x30, rd, rs1, rs2);

/** Encode orc.b (rv_zbb) as a 32-bit instruction. */
export const encodeOrcB = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x5, 0x287, rd, rs1);

/** Encode clmul (rv_zbc) as a 32-bit instruction. */
export const encodeClmul = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x1, 0x5, rd, rs1, rs2);

/** Encode clmulr (rv_zbc) as a 32-bit instruction. */
export const encodeClmulr = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x2, 0x5, rd, rs1, rs2);

/** Encode clmulh (rv_zbc) as a 32-bit instruction. */
export const encodeClmulh = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x3, 0x5, rd, rs1, rs2);

/** Encode pack (rv_zbkb) as a 32-bit instruction. */
export const encodePack = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x4, 0x4, rd, rs1, rs2);

/** Encode packh (rv_zbkb) as a 32-bit instruction. */
export const encodePackh = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x7, 0x4, rd, rs1, rs2);

/** Encode brev8 (rv_zbkb) as a 32-bit instruction. */
export const encodeBrev8 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x5, 0x687, rd, rs1);

/** Encode xperm4 (rv_zbkx) as a 32-bit instruction. */
export const encodeXperm4 = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x2, 0x14, rd, rs1, rs2);

/** Encode xperm8 (rv_zbkx) as a 32-bit instruction. */
export const encodeXperm8 = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x4, 0x14, rd, rs1, rs2);

/** Encode bclr (rv_zbs) as a 32-bit instruction. */
export const encodeBclr = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x1, 0x24, rd, rs1, rs2);

/** Encode bext (rv_zbs) as a 32-bit instruction. */
export const encodeBext = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x5, 0x24, rd, rs1, rs2);

/** Encode binv (rv_zbs) as a 32-bit instruction. */
export const encodeBinv = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x1, 0x34, rd, rs1, rs2);

/** Encode bset (rv_zbs) as a 32-bit instruction. */
export const encodeBset = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x1, 0x14, rd, rs1, rs2);

/** Encode c.lbu (rv_zcb) as a 16-bit instruction. */
export const encodeCLbu = (rdP: number, rs1P: number, cUimm2: number): Uint8Array =>
  encodeClFields(0x0, 0x4, 0x0, cUimm2, rs1P, rdP);

/** Encode c.lhu (rv_zcb) as a 16-bit instruction. */
export const encodeCLhu = (rdP: number, rs1P: number, cUimm1: number): Uint8Array =>
  encodeClFields(0x0, 0x4, 0x1, cUimm1, rs1P, rdP);

/** Encode c.lh (rv_zcb) as a 16-bit instruction. */
export const encodeCLh = (rdP: number, rs1P: number, cUimm1: number): Uint8Array =>
  encodeClHalf(0x0, 0x4, 0x1, 0x1, cUimm1, rs1P, rdP);

/** Encode c.sb (rv_zcb) as a 16-bit instruction. */
export const encodeCSb = (rs2P: number, rs1P: number, cUimm2: number): Uint8Array =>
  encodeCsFields(0x0, 0x4, 0x2, cUimm2, rs1P, rs2P);

/** Encode c.sh (rv_zcb) as a 16-bit instruction. */
export const encodeCSh = (rs2P: number, rs1P: number, cUimm1: number): Uint8Array =>
  encodeCsFields(0x0, 0x4, 0x3, cUimm1, rs1P, rs2P);

/** Encode c.zext.b (rv_zcb) as a 16-bit instruction. */
export const encodeCZextB = (rdRs1P: number): Uint8Array =>
  encodeCbFields(0x1, 0x4, 0x7, 0x18, rdRs1P);

/** Encode c.sext.b (rv_zcb) as a 16-bit instruction. */
export const encodeCSextB = (rdRs1P: number): Uint8Array =>
  encodeCbFields(0x1, 0x4, 0x7, 0x19, rdRs1P);

/** Encode c.zext.h (rv_zcb) as a 16-bit instruction. */
export const encodeCZextH = (rdRs1P: number): Uint8Array =>
  encodeCbFields(0x1, 0x4, 0x7, 0x1a, rdRs1P);

/** Encode c.sext.h (rv_zcb) as a 16-bit instruction. */
export const encodeCSextH = (rdRs1P: number): Uint8Array =>
  encodeCbFields(0x1, 0x4, 0x7, 0x1b, rdRs1P);

/** Encode c.not (rv_zcb) as a 16-bit instruction. */
export const encodeCNot = (rdRs1P: number): Uint8Array =>
  encodeCbFields(0x1, 0x4, 0x7, 0x1d, rdRs1P);

/** Encode c.mul (rv_zcb) as a 16-bit instruction. */
export const encodeCMul = (rdRs1P: number, rs2P: number): Uint8Array =>
  encodeCa(0x1, 0x27, rdRs1P, 0x2, rs2P);

/** Encode c.mop.N (rv_zcmop) as a 16-bit instruction. */
export const encodeCMopN = (cMopT: number): Uint8Array => encodeZcmop(0x1, 0x3, cMopT);

/** Encode cm.push (rv_zcmp) as a 16-bit instruction. */
export const encodeCmPush = (cRlist: number, cSpimm: number): Uint8Array =>
  encodeZcmp(0x2, 0x5, 0x18, cRlist, cSpimm);

/** Encode cm.pop (rv_zcmp) as a 16-bit instruction. */
export const encodeCmPop = (cRlist: number, cSpimm: number): Uint8Array =>
  encodeZcmp(0x2, 0x5, 0x1a, cRlist, cSpimm);

/** Encode cm.popretz (rv_zcmp) as a 16-bit instruction. */
export const encodeCmPopretz = (cRlist: number, cSpimm: number): Uint8Array =>
  encodeZcmp(0x2, 0x5, 0x1c, cRlist, cSpimm);

/** Encode cm.popret (rv_zcmp) as a 16-bit instruction. */
export const encodeCmPopret = (cRlist: number, cSpimm: number): Uint8Array =>
  encodeZcmp(0x2, 0x5, 0x1e, cRlist, cSpimm);

/** Encode cm.mvsa01 (rv_zcmp) as a 16-bit instruction. */
export const encodeCmMvsa01 = (cSreg1: number, cSreg2: number): Uint8Array =>
  encodeZcmpMove(0x2, 0x5, 0x3, 0x1, cSreg1, cSreg2);

/** Encode cm.mva01s (rv_zcmp) as a 16-bit instruction. */
export const encodeCmMva01s = (cSreg1: number, cSreg2: number): Uint8Array =>
  encodeZcmpMove(0x2, 0x5, 0x3, 0x3, cSreg1, cSreg2);

/** Encode cm.jalt (rv_zcmt) as a 16-bit instruction. */
export const encodeCmJalt = (cIndex: number): Uint8Array => encodeZcmt(0x2, 0x5, cIndex);

/** Encode fcvt.bf16.s (rv_zfbfmin) as a 32-bit instruction. */
export const encodeFcvtBf16S = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x22, rd, rs1, 0x8);

/** Encode fcvt.s.bf16 (rv_zfbfmin) as a 32-bit instruction. */
export const encodeFcvtSBf16 = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x20, rd, rs1, 0x6);

/** Encode fmadd.h (rv_zfh) as a 32-bit instruction. */
export const encodeFmaddH = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x43, rm, 0x2, rd, rs1, rs2, rs3);

/** Encode fmsub.h (rv_zfh) as a 32-bit instruction. */
export const encodeFmsubH = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x47, rm, 0x2, rd, rs1, rs2, rs3);

/** Encode fnmsub.h (rv_zfh) as a 32-bit instruction. */
export const encodeFnmsubH = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x4b, rm, 0x2, rd, rs1, rs2, rs3);

/** Encode fnmadd.h (rv_zfh) as a 32-bit instruction. */
export const encodeFnmaddH = (
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number,
  rm: number
): Uint8Array => encodeR4(0x4f, rm, 0x2, rd, rs1, rs2, rs3);

/** Encode fadd.h (rv_zfh) as a 32-bit instruction. */
export const encodeFaddH = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x2, rd, rs1, rs2);

/** Encode fsub.h (rv_zfh) as a 32-bit instruction. */
export const encodeFsubH = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x6, rd, rs1, rs2);

/** Encode fmul.h (rv_zfh) as a 32-bit instruction. */
export const encodeFmulH = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0xa, rd, rs1, rs2);

/** Encode fdiv.h (rv_zfh) as a 32-bit instruction. */
export const encodeFdivH = (rd: number, rs1: number, rs2: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0xe, rd, rs1, rs2);

/** Encode fsqrt.h (rv_zfh) as a 32-bit instruction. */
export const encodeFsqrtH = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x2e, rd, rs1, 0x0);

/** Encode fsgnj.h (rv_zfh) as a 32-bit instruction. */
export const encodeFsgnjH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x12, rd, rs1, rs2);

/** Encode fsgnjn.h (rv_zfh) as a 32-bit instruction. */
export const encodeFsgnjnH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x12, rd, rs1, rs2);

/** Encode fsgnjx.h (rv_zfh) as a 32-bit instruction. */
export const encodeFsgnjxH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x12, rd, rs1, rs2);

/** Encode fmin.h (rv_zfh) as a 32-bit instruction. */
export const encodeFminH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x16, rd, rs1, rs2);

/** Encode fmax.h (rv_zfh) as a 32-bit instruction. */
export const encodeFmaxH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x16, rd, rs1, rs2);

/** Encode feq.h (rv_zfh) as a 32-bit instruction. */
export const encodeFeqH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x52, rd, rs1, rs2);

/** Encode flt.h (rv_zfh) as a 32-bit instruction. */
export const encodeFltH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x52, rd, rs1, rs2);

/** Encode fle.h (rv_zfh) as a 32-bit instruction. */
export const encodeFleH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x52, rd, rs1, rs2);

/** Encode fclass.h (rv_zfh) as a 32-bit instruction. */
export const encodeFclassH = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x1, 0x72, rd, rs1, 0x0);

/** Encode fcvt.w.h (rv_zfh) as a 32-bit instruction. */
export const encodeFcvtWH = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x62, rd, rs1, 0x0);

/** Encode fcvt.wu.h (rv_zfh) as a 32-bit instruction. */
export const encodeFcvtWuH = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x62, rd, rs1, 0x1);

/** Encode fcvt.h.w (rv_zfh) as a 32-bit instruction. */
export const encodeFcvtHW = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x6a, rd, rs1, 0x0);

/** Encode fcvt.h.wu (rv_zfh) as a 32-bit instruction. */
export const encodeFcvtHWu = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x6a, rd, rs1, 0x1);

/** Encode fli.h (rv_zfh_zfa) as a 32-bit instruction. */
export const encodeFliH = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x7a, rd, rs1, 0x1);

/** Encode fminm.h (rv_zfh_zfa) as a 32-bit instruction. */
export const encodeFminmH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x2, 0x16, rd, rs1, rs2);

/** Encode fmaxm.h (rv_zfh_zfa) as a 32-bit instruction. */
export const encodeFmaxmH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x3, 0x16, rd, rs1, rs2);

/** Encode fround.h (rv_zfh_zfa) as a 32-bit instruction. */
export const encodeFroundH = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x22, rd, rs1, 0x4);

/** Encode froundnx.h (rv_zfh_zfa) as a 32-bit instruction. */
export const encodeFroundnxH = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x22, rd, rs1, 0x5);

/** Encode fleq.h (rv_zfh_zfa) as a 32-bit instruction. */
export const encodeFleqH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x4, 0x52, rd, rs1, rs2);

/** Encode fltq.h (rv_zfh_zfa) as a 32-bit instruction. */
export const encodeFltqH = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x53, 0x5, 0x52, rd, rs1, rs2);

/** Encode flh (rv_zfhmin) as a 32-bit instruction. */
export const encodeFlh = (rd: number, rs1: number, imm12: number): Uint8Array =>
  encodeI(0x7, 0x1, imm12, rd, rs1);

/** Encode fsh (rv_zfhmin) as a 32-bit instruction. */
export const encodeFsh = (imm12hi: number, rs1: number, rs2: number, imm12lo: number): Uint8Array =>
  encodeSFields(0x27, 0x1, imm12hi, imm12lo, rs1, rs2);

/** Encode fcvt.s.h (rv_zfhmin) as a 32-bit instruction. */
export const encodeFcvtSH = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x20, rd, rs1, 0x2);

/** Encode fcvt.h.s (rv_zfhmin) as a 32-bit instruction. */
export const encodeFcvtHS = (rd: number, rs1: number, rm: number): Uint8Array =>
  encodeR(0x53, rm, 0x22, rd, rs1, 0x0);

/** Encode fmv.x.h (rv_zfhmin) as a 32-bit instruction. */
export const encodeFmvXH = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x72, rd, rs1, 0x0);

/** Encode fmv.h.x (rv_zfhmin) as a 32-bit instruction. */
export const encodeFmvHX = (rd: number, rs1: number): Uint8Array =>
  encodeR(0x53, 0x0, 0x7a, rd, rs1, 0x0);

/** Encode cbo.clean (rv_zicbo) as a 32-bit instruction. */
export const encodeCboClean = (rs1: number): Uint8Array => encodeI(0xf, 0x2, 0x1, 0x0, rs1);

/** Encode cbo.flush (rv_zicbo) as a 32-bit instruction. */
export const encodeCboFlush = (rs1: number): Uint8Array => encodeI(0xf, 0x2, 0x2, 0x0, rs1);

/** Encode cbo.inval (rv_zicbo) as a 32-bit instruction. */
export const encodeCboInval = (rs1: number): Uint8Array => encodeI(0xf, 0x2, 0x0, 0x0, rs1);

/** Encode cbo.zero (rv_zicbo) as a 32-bit instruction. */
export const encodeCboZero = (rs1: number): Uint8Array => encodeI(0xf, 0x2, 0x4, 0x0, rs1);

/** Encode ssamoswap.w (rv_zicfiss) as a 32-bit instruction. */
export const encodeSsamoswapW = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x9, aq, rl, 0x2, rd, rs1, rs2);

/** Encode ssamoswap.d (rv_zicfiss) as a 32-bit instruction. */
export const encodeSsamoswapD = (
  rd: number,
  rs1: number,
  rs2: number,
  aq: number,
  rl: number
): Uint8Array => encodeA(0x2f, 0x9, aq, rl, 0x3, rd, rs1, rs2);

/** Encode czero.eqz (rv_zicond) as a 32-bit instruction. */
export const encodeCzeroEqz = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x5, 0x7, rd, rs1, rs2);

/** Encode czero.nez (rv_zicond) as a 32-bit instruction. */
export const encodeCzeroNez = (rd: number, rs1: number, rs2: number): Uint8Array =>
  encodeR(0x33, 0x7, 0x7, rd, rs1, rs2);

/** Encode csrrw (rv_zicsr) as a 32-bit instruction. */
export const encodeCsrrw = (rd: number, rs1: number, csr: number): Uint8Array =>
  encodeI(0x73, 0x1, csr, rd, rs1);

/** Encode csrrs (rv_zicsr) as a 32-bit instruction. */
export const encodeCsrrs = (rd: number, rs1: number, csr: number): Uint8Array =>
  encodeI(0x73, 0x2, csr, rd, rs1);

/** Encode csrrc (rv_zicsr) as a 32-bit instruction. */
export const encodeCsrrc = (rd: number, rs1: number, csr: number): Uint8Array =>
  encodeI(0x73, 0x3, csr, rd, rs1);

/** Encode csrrwi (rv_zicsr) as a 32-bit instruction. */
export const encodeCsrrwi = (rd: number, csr: number, zimm5: number): Uint8Array =>
  encodeI(0x73, 0x5, csr, rd, zimm5);

/** Encode csrrsi (rv_zicsr) as a 32-bit instruction. */
export const encodeCsrrsi = (rd: number, csr: number, zimm5: number): Uint8Array =>
  encodeI(0x73, 0x6, csr, rd, zimm5);

/** Encode csrrci (rv_zicsr) as a 32-bit instruction. */
export const encodeCsrrci = (rd: number, csr: number, zimm5: number): Uint8Array =>
  encodeI(0x73, 0x7, csr, rd, zimm5);

/** Encode fence.i (rv_zifencei) as a 32-bit instruction. */
export const encodeFenceI = (imm12: number, rs1: number, rd: number): Uint8Array =>
  encodeI(0xf, 0x1, imm12, rd, rs1);

/** Encode mop.r.N (rv_zimop) as a 32-bit instruction. */
export const encodeMopRN = (
  mopRT30: number,
  mopRT2726: number,
  mopRT2120: number,
  rd: number,
  rs1: number
): Uint8Array => encodeZimop(0x73, 0x4, mopRT30, mopRT2726, mopRT2120, rs1, rd);

/** Encode mop.rr.N (rv_zimop) as a 32-bit instruction. */
export const encodeMopRrN = (
  mopRrT30: number,
  mopRrT2726: number,
  rd: number,
  rs1: number,
  rs2: number
): Uint8Array => encodeZimopRR(0x73, 0x4, mopRrT30, mopRrT2726, rs2, rs1, rd);

/** Encode sha256sum0 (rv_zknh) as a 32-bit instruction. */
export const encodeSha256sum0 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x100, rd, rs1);

/** Encode sha256sum1 (rv_zknh) as a 32-bit instruction. */
export const encodeSha256sum1 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x101, rd, rs1);

/** Encode sha256sig0 (rv_zknh) as a 32-bit instruction. */
export const encodeSha256sig0 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x102, rd, rs1);

/** Encode sha256sig1 (rv_zknh) as a 32-bit instruction. */
export const encodeSha256sig1 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x103, rd, rs1);

/** Encode sm4ed (rv_zksed) as a 32-bit instruction. */
export const encodeSm4ed = (rd: number, rs1: number, rs2: number, bs: number): Uint8Array =>
  encodeSm4(0x33, 0x0, bs, 0x18, rd, rs1, rs2);

/** Encode sm4ks (rv_zksed) as a 32-bit instruction. */
export const encodeSm4ks = (rd: number, rs1: number, rs2: number, bs: number): Uint8Array =>
  encodeSm4(0x33, 0x0, bs, 0x1a, rd, rs1, rs2);

/** Encode sm3p0 (rv_zksh) as a 32-bit instruction. */
export const encodeSm3p0 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x108, rd, rs1);

/** Encode sm3p1 (rv_zksh) as a 32-bit instruction. */
export const encodeSm3p1 = (rd: number, rs1: number): Uint8Array =>
  encodeI(0x13, 0x1, 0x109, rd, rs1);

/** Encode vandn.vv (rv_zvbb) as a 32-bit instruction. */
export const encodeVandnVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1, vm, vs2, vs1, 0x0, vd);

/** Encode vandn.vx (rv_zvbb) as a 32-bit instruction. */
export const encodeVandnVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x1, vm, vs2, rs1, 0x4, vd);

/** Encode vbrev.v (rv_zvbb) as a 32-bit instruction. */
export const encodeVbrevV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0xa, 0x2, vd);

/** Encode vbrev8.v (rv_zvbb) as a 32-bit instruction. */
export const encodeVbrev8V = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x8, 0x2, vd);

/** Encode vrev8.v (rv_zvbb) as a 32-bit instruction. */
export const encodeVrev8V = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x9, 0x2, vd);

/** Encode vclz.v (rv_zvbb) as a 32-bit instruction. */
export const encodeVclzV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0xc, 0x2, vd);

/** Encode vctz.v (rv_zvbb) as a 32-bit instruction. */
export const encodeVctzV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0xd, 0x2, vd);

/** Encode vcpop.v (rv_zvbb) as a 32-bit instruction. */
export const encodeVcpopV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0xe, 0x2, vd);

/** Encode vrol.vv (rv_zvbb) as a 32-bit instruction. */
export const encodeVrolVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x15, vm, vs2, vs1, 0x0, vd);

/** Encode vrol.vx (rv_zvbb) as a 32-bit instruction. */
export const encodeVrolVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x15, vm, vs2, rs1, 0x4, vd);

/** Encode vror.vv (rv_zvbb) as a 32-bit instruction. */
export const encodeVrorVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x14, vm, vs2, vs1, 0x0, vd);

/** Encode vror.vx (rv_zvbb) as a 32-bit instruction. */
export const encodeVrorVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x14, vm, vs2, rs1, 0x4, vd);

/** Encode vror.vi (rv_zvbb) as a 32-bit instruction. */
export const encodeVrorVi = (
  zimm6hi: number,
  vm: number,
  vs2: number,
  zimm6lo: number,
  vd: number
): Uint8Array => encodeVror(0x57, 0xa, zimm6hi, vm, vs2, zimm6lo, 0x3, vd);

/** Encode vwsll.vv (rv_zvbb) as a 32-bit instruction. */
export const encodeVwsllVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x35, vm, vs2, vs1, 0x0, vd);

/** Encode vwsll.vx (rv_zvbb) as a 32-bit instruction. */
export const encodeVwsllVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x35, vm, vs2, rs1, 0x4, vd);

/** Encode vwsll.vi (rv_zvbb) as a 32-bit instruction. */
export const encodeVwsllVi = (vm: number, vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x35, vm, vs2, zimm5, 0x3, vd);

/** Encode vclmul.vv (rv_zvbc) as a 32-bit instruction. */
export const encodeVclmulVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xc, vm, vs2, vs1, 0x2, vd);

/** Encode vclmul.vx (rv_zvbc) as a 32-bit instruction. */
export const encodeVclmulVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xc, vm, vs2, rs1, 0x6, vd);

/** Encode vclmulh.vv (rv_zvbc) as a 32-bit instruction. */
export const encodeVclmulhVv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xd, vm, vs2, vs1, 0x2, vd);

/** Encode vclmulh.vx (rv_zvbc) as a 32-bit instruction. */
export const encodeVclmulhVx = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0xd, vm, vs2, rs1, 0x6, vd);

/** Encode vfncvtbf16.f.f.w (rv_zvfbfmin) as a 32-bit instruction. */
export const encodeVfncvtbf16FFW = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0x1d, 0x1, vd);

/** Encode vfwcvtbf16.f.f.v (rv_zvfbfmin) as a 32-bit instruction. */
export const encodeVfwcvtbf16FFV = (vm: number, vs2: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x12, vm, vs2, 0xd, 0x1, vd);

/** Encode vfwmaccbf16.vv (rv_zvfbfwma) as a 32-bit instruction. */
export const encodeVfwmaccbf16Vv = (vm: number, vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3b, vm, vs2, vs1, 0x1, vd);

/** Encode vfwmaccbf16.vf (rv_zvfbfwma) as a 32-bit instruction. */
export const encodeVfwmaccbf16Vf = (vm: number, vs2: number, rs1: number, vd: number): Uint8Array =>
  encodeV(0x57, 0x3b, vm, vs2, rs1, 0x5, vd);

/** Encode vgmul.vv (rv_zvkg) as a 32-bit instruction. */
export const encodeVgmulVv = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x28, 0x1, vs2, 0x11, 0x2, vd);

/** Encode vghsh.vv (rv_zvkg) as a 32-bit instruction. */
export const encodeVghshVv = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x2c, 0x1, vs2, vs1, 0x2, vd);

/** Encode vaesdf.vv (rv_zvkned) as a 32-bit instruction. */
export const encodeVaesdfVv = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x28, 0x1, vs2, 0x1, 0x2, vd);

/** Encode vaesdf.vs (rv_zvkned) as a 32-bit instruction. */
export const encodeVaesdfVs = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x29, 0x1, vs2, 0x1, 0x2, vd);

/** Encode vaesdm.vv (rv_zvkned) as a 32-bit instruction. */
export const encodeVaesdmVv = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x28, 0x1, vs2, 0x0, 0x2, vd);

/** Encode vaesdm.vs (rv_zvkned) as a 32-bit instruction. */
export const encodeVaesdmVs = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x29, 0x1, vs2, 0x0, 0x2, vd);

/** Encode vaesef.vv (rv_zvkned) as a 32-bit instruction. */
export const encodeVaesefVv = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x28, 0x1, vs2, 0x3, 0x2, vd);

/** Encode vaesef.vs (rv_zvkned) as a 32-bit instruction. */
export const encodeVaesefVs = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x29, 0x1, vs2, 0x3, 0x2, vd);

/** Encode vaesem.vv (rv_zvkned) as a 32-bit instruction. */
export const encodeVaesemVv = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x28, 0x1, vs2, 0x2, 0x2, vd);

/** Encode vaesem.vs (rv_zvkned) as a 32-bit instruction. */
export const encodeVaesemVs = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x29, 0x1, vs2, 0x2, 0x2, vd);

/** Encode vaesz.vs (rv_zvkned) as a 32-bit instruction. */
export const encodeVaeszVs = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x29, 0x1, vs2, 0x7, 0x2, vd);

/** Encode vaeskf1.vi (rv_zvkned) as a 32-bit instruction. */
export const encodeVaeskf1Vi = (vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x22, 0x1, vs2, zimm5, 0x2, vd);

/** Encode vaeskf2.vi (rv_zvkned) as a 32-bit instruction. */
export const encodeVaeskf2Vi = (vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x2a, 0x1, vs2, zimm5, 0x2, vd);

/** Encode vsha2ms.vv (rv_zvknha) as a 32-bit instruction. */
export const encodeVsha2msVv = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x2d, 0x1, vs2, vs1, 0x2, vd);

/** Encode vsha2ch.vv (rv_zvknha) as a 32-bit instruction. */
export const encodeVsha2chVv = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x2e, 0x1, vs2, vs1, 0x2, vd);

/** Encode vsha2cl.vv (rv_zvknha) as a 32-bit instruction. */
export const encodeVsha2clVv = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x2f, 0x1, vs2, vs1, 0x2, vd);

/** Encode vsm4k.vi (rv_zvksed) as a 32-bit instruction. */
export const encodeVsm4kVi = (vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x21, 0x1, vs2, zimm5, 0x2, vd);

/** Encode vsm4r.vv (rv_zvksed) as a 32-bit instruction. */
export const encodeVsm4rVv = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x28, 0x1, vs2, 0x10, 0x2, vd);

/** Encode vsm4r.vs (rv_zvksed) as a 32-bit instruction. */
export const encodeVsm4rVs = (vs2: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x29, 0x1, vs2, 0x10, 0x2, vd);

/** Encode vsm3c.vi (rv_zvksh) as a 32-bit instruction. */
export const encodeVsm3cVi = (vs2: number, zimm5: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x2b, 0x1, vs2, zimm5, 0x2, vd);

/** Encode vsm3me.vv (rv_zvksh) as a 32-bit instruction. */
export const encodeVsm3meVv = (vs2: number, vs1: number, vd: number): Uint8Array =>
  encodeV(0x77, 0x20, 0x1, vs2, vs1, 0x2, vd);
