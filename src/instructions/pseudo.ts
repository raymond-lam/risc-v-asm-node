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

// Comprehensive RV64 pseudo-instruction encoders based on the frozen RISC-V
// Assembly Manual (commit 27d6e9e67e6d713327e8bed43ab4fede1d00fb32)
// and ratified V 1.0 specification.
// Each pseudo-instruction is implemented by composing canonical single-instruction
// or multi-instruction forms from canonical.ts.
//
// - Single-instruction aliases return the canonical bytes directly.
// - Multi-instruction aliases concatenate canonical bytes in execution order.
// - PC-relative forms accept resolved high20/low12 fields supplied by the
//   caller or linker: high20 = (offset + 0x800) >> 12 and
//   low12 = offset - (high20 << 12). No unresolved relocations are emitted.
// - All immediates are already sign-extended where needed by the caller.

import {
  encodeAddi,
  encodeAddUw,
  encodeAddiw,
  encodeAndi,
  encodeAuipc,
  encodeBeq,
  encodeBge,
  encodeBgeu,
  encodeBlt,
  encodeBltu,
  encodeBne,
  encodeCsrrc,
  encodeCsrrci,
  encodeCsrrs,
  encodeCsrrsi,
  encodeCsrrw,
  encodeCsrrwi,
  encodeFleD,
  encodeFleH,
  encodeFleQ,
  encodeFleS,
  encodeFltD,
  encodeFltH,
  encodeFltQ,
  encodeFltS,
  encodeFsgnjD,
  encodeFsgnjH,
  encodeFsgnjQ,
  encodeFsgnjS,
  encodeFsgnjnD,
  encodeFsgnjnH,
  encodeFsgnjnQ,
  encodeFsgnjnS,
  encodeFsgnjxD,
  encodeFsgnjxH,
  encodeFsgnjxQ,
  encodeFsgnjxS,
  encodeFence as encodeFenceCanonical,
  encodeJal as encodeJalCanonical,
  encodeJalr,
  encodeLd,
  encodePackw,
  encodeSlli,
  encodeSlt,
  encodeSltiu,
  encodeSltu,
  encodeSub,
  encodeSubw,
  encodeXori,
  encodeVfsgnjnVv,
  encodeVfsgnjxVv,
  encodeVmxorMm,
  encodeVmfleVv,
  encodeVmfltVv,
  encodeVmandMm,
  encodeVmnandMm,
  encodeVmxnorMm,
  encodeVrsubVx,
  encodeVxorVi,
  encodeVl1re8V,
  encodeVl2re8V,
  encodeVl4re8V,
  encodeVl8re8V,
  encodeVmsgtVi,
  encodeVmsgtuVi,
  encodeVmseqVv,
  encodeVmsleVv,
  encodeVmsleuVv,
  encodeVmsltVv,
  encodeVmsltuVv,
  encodeVmsleVi,
  encodeVmsleuVi,
  encodeVmsneVv,
  encodeVnsrlWx,
  encodeVwaddVx,
  encodeVwadduVx,
  encodeVmsltVx,
  encodeVmsltuVx,
} from '#instructions/canonical';

/** Concatenate multiple instruction encodings into a single Uint8Array. */
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

// ============================================================================
// Integer Pseudo-Instructions
// ============================================================================

/** Encode nop as addi x0, x0, 0. */
export const encodeNop = (): Uint8Array => encodeAddi(0, 0, 0);

/** Encode mv rd, rs as addi rd, rs, 0. */
export const encodeMv = (rd: number, rs: number): Uint8Array => encodeAddi(rd, rs, 0);

/** Encode not rd, rs as xori rd, rs, -1. */
export const encodeNot = (rd: number, rs: number): Uint8Array => encodeXori(rd, rs, -1);

/** Encode neg rd, rs as sub rd, x0, rs. */
export const encodeNeg = (rd: number, rs: number): Uint8Array => encodeSub(rd, 0, rs);

/** Encode negw rd, rs as subw rd, x0, rs. */
export const encodeNegw = (rd: number, rs: number): Uint8Array => encodeSubw(rd, 0, rs);

/** Encode sext.w rd, rs as addiw rd, rs, 0. */
export const encodeSextW = (rd: number, rs: number): Uint8Array => encodeAddiw(rd, rs, 0);

/** Encode zext.b rd, rs as andi rd, rs, 255. */
export const encodeZextB = (rd: number, rs: number): Uint8Array => encodeAndi(rd, rs, 255);

/** Encode zext.h rd, rs as packw rd, rs, x0 (RV64 Zbb). */
export const encodeZextH = (rd: number, rs: number): Uint8Array => encodePackw(rd, rs, 0);

/** Encode zext.w rd, rs as add.uw rd, rs, x0 (RV64 Zba). */
export const encodeZextW = (rd: number, rs: number): Uint8Array => encodeAddUw(rd, rs, 0);

// Set-if comparisons

/** Encode seqz rd, rs as sltiu rd, rs, 1. */
export const encodeSeqz = (rd: number, rs: number): Uint8Array => encodeSltiu(rd, rs, 1);

/** Encode snez rd, rs as sltu rd, x0, rs. */
export const encodeSnez = (rd: number, rs: number): Uint8Array => encodeSltu(rd, 0, rs);

/** Encode sltz rd, rs as slt rd, rs, x0. */
export const encodeSltz = (rd: number, rs: number): Uint8Array => encodeSlt(rd, rs, 0);

/** Encode sgtz rd, rs as slt rd, x0, rs. */
export const encodeSgtz = (rd: number, rs: number): Uint8Array => encodeSlt(rd, 0, rs);

/** Encode sgt rd, rs, rt as slt rd, rt, rs. */
export const encodeSgt = (rd: number, rs: number, rt: number): Uint8Array => encodeSlt(rd, rt, rs);

/** Encode sgtu rd, rs, rt as sltu rd, rt, rs. */
export const encodeSgtu = (rd: number, rs: number, rt: number): Uint8Array =>
  encodeSltu(rd, rt, rs);

// ============================================================================
// Load Immediate
// ============================================================================

/**
 * Encode li rd, value for RV64.
 * For 12-bit signed values: single addi rd, x0, value.
 * Otherwise: addi rd, x0, top9_sign_extended, then five (slli rd, rd, 11;
 * addi rd, rd, chunk11_unsigned) pairs. This deterministic, non-minimal
 * expansion is 44 bytes; the signed-12-bit case is 4 bytes.
 */
export const encodeLi = (rd: number, value: number | bigint): Uint8Array => {
  let v = BigInt(value);
  v = BigInt.asIntN(64, v);

  // 12-bit signed immediate optimization
  if (v >= -2048n && v <= 2047n) {
    return encodeAddi(rd, 0, Number(v));
  }

  // Generic expansion: signed top 9 bits via addi, then five 11-bit unsigned chunks via slli+addi
  const unsigned = BigInt.asUintN(64, v);
  const instructions: Uint8Array[] = [
    // First: addi rd, x0, sign-extended top 9 bits (bits 63-55)
    encodeAddi(rd, 0, Number(v >> 55n)),
  ];

  // Five 11-bit chunks (bits 54-44, 43-33, 32-22, 21-12, 11-0)
  for (let shift = 44n; shift >= 0n; shift -= 11n) {
    instructions.push(encodeSlli(rd, rd, 11));
    instructions.push(encodeAddi(rd, rd, Number((unsigned >> shift) & 0x7ffn)));
  }

  return concat(...instructions);
};

// ============================================================================
// Load Address Forms
// ============================================================================

/**
 * Encode la rd, symbol (load address) - default form uses auipc + addi.
 * Pattern: auipc rd, %pcrel_hi(symbol); addi rd, rd, %pcrel_lo(symbol)
 */
export const encodeLa = (rd: number, high20: number, low12: number): Uint8Array =>
  concat(encodeAuipc(rd, high20), encodeAddi(rd, rd, low12));

/**
 * Encode lla rd, symbol (load local address) - same as la, uses auipc + addi.
 */
export const encodeLla = (rd: number, high20: number, low12: number): Uint8Array =>
  concat(encodeAuipc(rd, high20), encodeAddi(rd, rd, low12));

/**
 * Encode lga rd, symbol (load global address) - PIC form uses auipc + ld.
 * Pattern: auipc rd, %pcrel_hi(symbol); ld rd, %pcrel_lo(symbol)(rd)
 */
export const encodeLga = (rd: number, high20: number, low12: number): Uint8Array =>
  concat(encodeAuipc(rd, high20), encodeLd(rd, rd, low12));

// ============================================================================
// Call and Jump Forms
// ============================================================================

/**
 * Encode call rd, symbol with explicit link register.
 * Pattern: auipc rd, %pcrel_hi(symbol); jalr rd, %pcrel_lo(symbol)(rd)
 */
export const encodeCall = (rd: number, high20: number, low12: number): Uint8Array =>
  concat(encodeAuipc(rd, high20), encodeJalr(rd, rd, low12));

/**
 * Encode tail symbol with default scratch register x6.
 * Pattern: auipc x6, %pcrel_hi(symbol); jalr x0, %pcrel_lo(symbol)(x6)
 */
export const encodeTail = (high20: number, low12: number): Uint8Array =>
  concat(encodeAuipc(6, high20), encodeJalr(0, 6, low12));

/** Encode jump offset, rt as auipc rt, high20; jalr x0, low12(rt). */
export const encodeJump = (rt: number, high20: number, low12: number): Uint8Array =>
  concat(encodeAuipc(rt, high20), encodeJalr(0, rt, low12));

/** Encode j offset as jal x0, offset. */
export const encodeJ = (jimm20: number): Uint8Array => encodeJalCanonical(0, jimm20);

/** Encode jal offset as jal x1, offset. */
export const encodeJal = (jimm20: number): Uint8Array => encodeJalCanonical(1, jimm20);

/** Encode ret (return) as jalr x0, 0(ra). */
export const encodeRet = (): Uint8Array => encodeJalr(0, 1, 0);

/** Encode jr rs (jump register) as jalr x0, 0(rs). */
export const encodeJr = (rs: number): Uint8Array => encodeJalr(0, rs, 0);

// ============================================================================
// Branch Pseudo-Instructions
// ============================================================================

/** Encode beqz rs, offset as beq rs, x0, offset. */
export const encodeBeqz = (rs: number, bimm12hi: number, bimm12lo: number): Uint8Array =>
  encodeBeq(bimm12hi, rs, 0, bimm12lo);

/** Encode bnez rs, offset as bne rs, x0, offset. */
export const encodeBnez = (rs: number, bimm12hi: number, bimm12lo: number): Uint8Array =>
  encodeBne(bimm12hi, rs, 0, bimm12lo);

/** Encode blez rs, offset as bge x0, rs, offset. */
export const encodeBlez = (rs: number, bimm12hi: number, bimm12lo: number): Uint8Array =>
  encodeBge(bimm12hi, 0, rs, bimm12lo);

/** Encode bgez rs, offset as bge rs, x0, offset. */
export const encodeBgez = (rs: number, bimm12hi: number, bimm12lo: number): Uint8Array =>
  encodeBge(bimm12hi, rs, 0, bimm12lo);

/** Encode bltz rs, offset as blt rs, x0, offset. */
export const encodeBltz = (rs: number, bimm12hi: number, bimm12lo: number): Uint8Array =>
  encodeBlt(bimm12hi, rs, 0, bimm12lo);

/** Encode bgtz rs, offset as blt x0, rs, offset. */
export const encodeBgtz = (rs: number, bimm12hi: number, bimm12lo: number): Uint8Array =>
  encodeBlt(bimm12hi, 0, rs, bimm12lo);

/** Encode bgt rs, rt, offset as blt rt, rs, offset. */
export const encodeBgt = (rs: number, rt: number, bimm12hi: number, bimm12lo: number): Uint8Array =>
  encodeBlt(bimm12hi, rt, rs, bimm12lo);

/** Encode ble rs, rt, offset as bge rt, rs, offset. */
export const encodeBle = (rs: number, rt: number, bimm12hi: number, bimm12lo: number): Uint8Array =>
  encodeBge(bimm12hi, rt, rs, bimm12lo);

/** Encode bgtu rs, rt, offset as bltu rt, rs, offset. */
export const encodeBgtu = (
  rs: number,
  rt: number,
  bimm12hi: number,
  bimm12lo: number
): Uint8Array => encodeBltu(bimm12hi, rt, rs, bimm12lo);

/** Encode bleu rs, rt, offset as bgeu rt, rs, offset. */
export const encodeBleu = (
  rs: number,
  rt: number,
  bimm12hi: number,
  bimm12lo: number
): Uint8Array => encodeBgeu(bimm12hi, rt, rs, bimm12lo);

// ============================================================================
// Floating-Point Move/Abs/Neg
// ============================================================================

/** Encode fmv.h rd, rs as fsgnj.h rd, rs, rs. */
export const encodeFmvH = (rd: number, rs: number): Uint8Array => encodeFsgnjH(rd, rs, rs);

/** Encode fmv.s rd, rs as fsgnj.s rd, rs, rs. */
export const encodeFmvS = (rd: number, rs: number): Uint8Array => encodeFsgnjS(rd, rs, rs);

/** Encode fmv.d rd, rs as fsgnj.d rd, rs, rs. */
export const encodeFmvD = (rd: number, rs: number): Uint8Array => encodeFsgnjD(rd, rs, rs);

/** Encode fmv.q rd, rs as fsgnj.q rd, rs, rs. */
export const encodeFmvQ = (rd: number, rs: number): Uint8Array => encodeFsgnjQ(rd, rs, rs);

/** Encode fabs.h rd, rs as fsgnjx.h rd, rs, rs. */
export const encodeFabsH = (rd: number, rs: number): Uint8Array => encodeFsgnjxH(rd, rs, rs);

/** Encode fabs.s rd, rs as fsgnjx.s rd, rs, rs. */
export const encodeFabsS = (rd: number, rs: number): Uint8Array => encodeFsgnjxS(rd, rs, rs);

/** Encode fabs.d rd, rs as fsgnjx.d rd, rs, rs. */
export const encodeFabsD = (rd: number, rs: number): Uint8Array => encodeFsgnjxD(rd, rs, rs);

/** Encode fabs.q rd, rs as fsgnjx.q rd, rs, rs. */
export const encodeFabsQ = (rd: number, rs: number): Uint8Array => encodeFsgnjxQ(rd, rs, rs);

/** Encode fneg.h rd, rs as fsgnjn.h rd, rs, rs. */
export const encodeFnegH = (rd: number, rs: number): Uint8Array => encodeFsgnjnH(rd, rs, rs);

/** Encode fneg.s rd, rs as fsgnjn.s rd, rs, rs. */
export const encodeFnegS = (rd: number, rs: number): Uint8Array => encodeFsgnjnS(rd, rs, rs);

/** Encode fneg.d rd, rs as fsgnjn.d rd, rs, rs. */
export const encodeFnegD = (rd: number, rs: number): Uint8Array => encodeFsgnjnD(rd, rs, rs);

/** Encode fneg.q rd, rs as fsgnjn.q rd, rs, rs. */
export const encodeFnegQ = (rd: number, rs: number): Uint8Array => encodeFsgnjnQ(rd, rs, rs);

// ============================================================================
// Floating-Point Comparisons (fgt, fge)
// ============================================================================

/** Encode fgt.h rd, rs, rt as flt.h rd, rt, rs. */
export const encodeFgtH = (rd: number, rs: number, rt: number): Uint8Array =>
  encodeFltH(rd, rt, rs);

/** Encode fge.h rd, rs, rt as fle.h rd, rt, rs. */
export const encodeFgeH = (rd: number, rs: number, rt: number): Uint8Array =>
  encodeFleH(rd, rt, rs);

/** Encode fgt.s rd, rs, rt as flt.s rd, rt, rs. */
export const encodeFgtS = (rd: number, rs: number, rt: number): Uint8Array =>
  encodeFltS(rd, rt, rs);

/** Encode fge.s rd, rs, rt as fle.s rd, rt, rs. */
export const encodeFgeS = (rd: number, rs: number, rt: number): Uint8Array =>
  encodeFleS(rd, rt, rs);

/** Encode fgt.d rd, rs, rt as flt.d rd, rt, rs. */
export const encodeFgtD = (rd: number, rs: number, rt: number): Uint8Array =>
  encodeFltD(rd, rt, rs);

/** Encode fge.d rd, rs, rt as fle.d rd, rt, rs. */
export const encodeFgeD = (rd: number, rs: number, rt: number): Uint8Array =>
  encodeFleD(rd, rt, rs);

/** Encode fgt.q rd, rs, rt as flt.q rd, rt, rs. */
export const encodeFgtQ = (rd: number, rs: number, rt: number): Uint8Array =>
  encodeFltQ(rd, rt, rs);

/** Encode fge.q rd, rs, rt as fle.q rd, rt, rs. */
export const encodeFgeQ = (rd: number, rs: number, rt: number): Uint8Array =>
  encodeFleQ(rd, rt, rs);

// ============================================================================
// Fence and Pause
// ============================================================================

/** Encode fence (full memory fence) as fence iorw, iorw (fm=0, pred=0xf, succ=0xf). */
export const encodeFence = (): Uint8Array => encodeFenceCanonical(0, 0xf, 0xf, 0, 0);

/** Encode pause as fence w, 0 (fm=0, pred=0x1, succ=0). */
export const encodePause = (): Uint8Array => encodeFenceCanonical(0, 0x1, 0, 0, 0);

// ============================================================================
// CSR Aliases
// ============================================================================

/** Encode rdcycle rd as csrrs rd, cycle, x0. */
export const encodeRdcycle = (rd: number): Uint8Array => encodeCsrrs(rd, 0, 0xc00);

/** Encode rdcycleh rd as csrrs rd, cycleh, x0. */
export const encodeRdcycleh = (rd: number): Uint8Array => encodeCsrrs(rd, 0, 0xc80);

/** Encode rdtime rd as csrrs rd, time, x0. */
export const encodeRdtime = (rd: number): Uint8Array => encodeCsrrs(rd, 0, 0xc01);

/** Encode rdtimeh rd as csrrs rd, timeh, x0. */
export const encodeRdtimeh = (rd: number): Uint8Array => encodeCsrrs(rd, 0, 0xc81);

/** Encode rdinstret rd as csrrs rd, instret, x0. */
export const encodeRdinstret = (rd: number): Uint8Array => encodeCsrrs(rd, 0, 0xc02);

/** Encode rdinstreth rd as csrrs rd, instreth, x0. */
export const encodeRdinstreth = (rd: number): Uint8Array => encodeCsrrs(rd, 0, 0xc82);

/** Encode csrr rd, csr as csrrs rd, csr, x0. */
export const encodeCsrr = (rd: number, csr: number): Uint8Array => encodeCsrrs(rd, 0, csr);

/** Encode csrw csr, rs as csrrw x0, csr, rs. */
export const encodeCsrw = (csr: number, rs: number): Uint8Array => encodeCsrrw(0, rs, csr);

/** Encode csrs csr, rs as csrrs x0, csr, rs. */
export const encodeCsrs = (csr: number, rs: number): Uint8Array => encodeCsrrs(0, rs, csr);

/** Encode csrc csr, rs as csrrc x0, csr, rs. */
export const encodeCsrc = (csr: number, rs: number): Uint8Array => encodeCsrrc(0, rs, csr);

/** Encode csrwi csr, zimm5 as csrrwi x0, csr, zimm5. */
export const encodeCsrwi = (csr: number, zimm5: number): Uint8Array => encodeCsrrwi(0, csr, zimm5);

/** Encode csrsi csr, zimm5 as csrrsi x0, csr, zimm5. */
export const encodeCsrsi = (csr: number, zimm5: number): Uint8Array => encodeCsrrsi(0, csr, zimm5);

/** Encode csrci csr, zimm5 as csrrci x0, csr, zimm5. */
export const encodeCsrci = (csr: number, zimm5: number): Uint8Array => encodeCsrrci(0, csr, zimm5);

// FP CSR aliases

/** Encode frcsr rd as csrrs rd, fcsr, x0. */
export const encodeFrcsr = (rd: number): Uint8Array => encodeCsrrs(rd, 0, 0x003);

/** Encode fscsr rd, rs as csrrw rd, fcsr, rs. */
export const encodeFscsr = (rd: number, rs: number): Uint8Array => encodeCsrrw(rd, rs, 0x003);

/** Encode frrm rd as csrrs rd, frm, x0. */
export const encodeFrrm = (rd: number): Uint8Array => encodeCsrrs(rd, 0, 0x002);

/** Encode fsrm rd, rs as csrrw rd, frm, rs. */
export const encodeFsrm = (rd: number, rs: number): Uint8Array => encodeCsrrw(rd, rs, 0x002);

/** Encode fsrmi rd, imm as csrrwi rd, frm, imm. */
export const encodeFsrmi = (rd: number, imm: number): Uint8Array => encodeCsrrwi(rd, 0x002, imm);

/** Encode frflags rd as csrrs rd, fflags, x0. */
export const encodeFrflags = (rd: number): Uint8Array => encodeCsrrs(rd, 0, 0x001);

/** Encode fsflags rd, rs as csrrw rd, fflags, rs. */
export const encodeFsflags = (rd: number, rs: number): Uint8Array => encodeCsrrw(rd, rs, 0x001);

/** Encode fsflagsi rd, imm as csrrwi rd, fflags, imm. */
export const encodeFsflagsi = (rd: number, imm: number): Uint8Array => encodeCsrrwi(rd, 0x001, imm);

// ============================================================================
// Vector Pseudo-Instructions (ratified V 1.0)
// ============================================================================

/** Encode vfneg.v vd, vs as unmasked vfsgnjn.vv vd, vs, vs. */
export const encodeVfnegV = (vd: number, vs: number): Uint8Array => encodeVfsgnjnVv(1, vs, vs, vd);

/** Encode vfabs.v vd, vs as unmasked vfsgnjx.vv vd, vs, vs. */
export const encodeVfabsV = (vd: number, vs: number): Uint8Array => encodeVfsgnjxVv(1, vs, vs, vd);

/** Encode vmclr.m vd as vmxor.mm vd, vd, vd. */
export const encodeVmclrM = (vd: number): Uint8Array => encodeVmxorMm(vd, vd, vd);

/** Encode vmfge.vv vd, va, vb, vm as vmfle.vv vd, vb, va, vm. */
export const encodeVmfgeVv = (vd: number, va: number, vb: number, vm: number): Uint8Array =>
  encodeVmfleVv(vm, vb, va, vd);

/** Encode vmfgt.vv vd, va, vb, vm as vmflt.vv vd, vb, va, vm. */
export const encodeVmfgtVv = (vd: number, va: number, vb: number, vm: number): Uint8Array =>
  encodeVmfltVv(vm, vb, va, vd);

/** Encode vmmv.m vd, vs as vmand.mm vd, vs, vs. */
export const encodeVmmvM = (vd: number, vs: number): Uint8Array => encodeVmandMm(vs, vs, vd);

/** Encode vmnot.m vd, vs as vmnand.mm vd, vs, vs. */
export const encodeVmnotM = (vd: number, vs: number): Uint8Array => encodeVmnandMm(vs, vs, vd);

/** Encode vmset.m vd as vmxnor.mm vd, vd, vd. */
export const encodeVmsetM = (vd: number): Uint8Array => encodeVmxnorMm(vd, vd, vd);

/** Encode vmsge.vi for -15 <= i <= 16 as vmsgt.vi with i - 1. */
export const encodeVmsgeVi = (vd: number, va: number, i: number, vm: number): Uint8Array =>
  encodeVmsgtVi(vm, va, i - 1, vd);

/** Encode vmsgeu.vi for -15 <= i <= 16, including the i=0 vmseq.vv case. */
export const encodeVmsgeuVi = (vd: number, va: number, i: number, vm: number): Uint8Array =>
  i === 0 ? encodeVmseqVv(vm, va, va, vd) : encodeVmsgtuVi(vm, va, i - 1, vd);

/** Encode vmsge.vv vd, va, vb, vm as vmsle.vv vd, vb, va, vm. */
export const encodeVmsgeVv = (vd: number, va: number, vb: number, vm: number): Uint8Array =>
  encodeVmsleVv(vm, vb, va, vd);

/** Encode vmsgeu.vv vd, va, vb, vm as vmsleu.vv vd, vb, va, vm. */
export const encodeVmsgeuVv = (vd: number, va: number, vb: number, vm: number): Uint8Array =>
  encodeVmsleuVv(vm, vb, va, vd);

/** Encode vmsgt.vv vd, va, vb, vm as vmslt.vv vd, vb, va, vm. */
export const encodeVmsgtVv = (vd: number, va: number, vb: number, vm: number): Uint8Array =>
  encodeVmsltVv(vm, vb, va, vd);

/** Encode vmsgtu.vv vd, va, vb, vm as vmsltu.vv vd, vb, va, vm. */
export const encodeVmsgtuVv = (vd: number, va: number, vb: number, vm: number): Uint8Array =>
  encodeVmsltuVv(vm, vb, va, vd);

/** Encode vmslt.vi for -15 <= i <= 16 as vmsle.vi with i - 1. */
export const encodeVmsltVi = (vd: number, va: number, i: number, vm: number): Uint8Array =>
  encodeVmsleVi(vm, va, i - 1, vd);

/** Encode vmsltu.vi for -15 <= i <= 16, including the i=0 vmsne.vv case. */
export const encodeVmsltuVi = (vd: number, va: number, i: number, vm: number): Uint8Array =>
  i === 0 ? encodeVmsneVv(vm, va, va, vd) : encodeVmsleuVi(vm, va, i - 1, vd);

/** Encode vneg.v vd, vs as unmasked vrsub.vx vd, vs, x0. */
export const encodeVnegV = (vd: number, vs: number): Uint8Array => encodeVrsubVx(1, vs, 0, vd);

/** Encode vnot.v vd, vs, vm as vxor.vi vd, vs, -1, vm. */
export const encodeVnotV = (vd: number, vs: number, vm: number): Uint8Array =>
  encodeVxorVi(vm, vs, -1, vd);

/** Encode vncvt.x.x.w vd, vs, vm as vnsrl.wx vd, vs, x0, vm. */
export const encodeVncvtXXW = (vd: number, vs: number, vm: number): Uint8Array =>
  encodeVnsrlWx(vm, vs, 0, vd);

/** Encode vwcvt.x.x.v vd, vs, vm as vwadd.vx vd, vs, x0, vm. */
export const encodeVwcvtXXV = (vd: number, vs: number, vm: number): Uint8Array =>
  encodeVwaddVx(vm, vs, 0, vd);

/** Encode vwcvtu.x.x.v vd, vs, vm as vwaddu.vx vd, vs, x0, vm. */
export const encodeVwcvtuXXV = (vd: number, vs: number, vm: number): Uint8Array =>
  encodeVwadduVx(vm, vs, 0, vd);

/** Encode vl1r.v vd, (rs1) as vl1re8.v vd, (rs1). */
export const encodeVl1rV = (vd: number, rs1: number): Uint8Array => encodeVl1re8V(rs1, vd);

/** Encode vl2r.v vd, (rs1) as vl2re8.v vd, (rs1). */
export const encodeVl2rV = (vd: number, rs1: number): Uint8Array => encodeVl2re8V(rs1, vd);

/** Encode vl4r.v vd, (rs1) as vl4re8.v vd, (rs1). */
export const encodeVl4rV = (vd: number, rs1: number): Uint8Array => encodeVl4re8V(rs1, vd);

/** Encode vl8r.v vd, (rs1) as vl8re8.v vd, (rs1). */
export const encodeVl8rV = (vd: number, rs1: number): Uint8Array => encodeVl8re8V(rs1, vd);

/** Encode unmasked vmsge.vx as vmslt.vx followed by vmnand.mm. */
export const encodeVmsgeVx = (vd: number, va: number, x: number): Uint8Array =>
  concat(encodeVmsltVx(1, va, x, vd), encodeVmnandMm(vd, vd, vd));

/** Encode unmasked vmsgeu.vx as vmsltu.vx followed by vmnand.mm. */
export const encodeVmsgeuVx = (vd: number, va: number, x: number): Uint8Array =>
  concat(encodeVmsltuVx(1, va, x, vd), encodeVmnandMm(vd, vd, vd));
