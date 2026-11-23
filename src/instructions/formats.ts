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

// Standalone RISC-V 64 instruction-format helpers.
//
// Each function packs the fields for one instruction format and returns the
// encoded instruction as a little-endian Uint8Array:
//   - base 32-bit formats (R, I, S, B, U, J) return 4 bytes
//   - compressed 16-bit formats (CR, CI, CSS, CIW, CL, CS, CA, CB, CJ) return 2 bytes
//
import { bytes16, bytes32 } from '#utils/bytes';

// These helpers are intentionally low level. They do not validate instruction
// semantics; they only pack the supplied fields into the correct bit positions.
//
// All immediates and offsets are given in their already-decoded numeric form
// (a signed value that is then masked to its field width). Signedness is
// handled by masking: the two's-complement low bits of a negative value land
// in the correct field positions. For branch/jump offsets the trailing zero
// bit(s) mandated by the architecture are not encoded; the caller supplies an
// offset whose bit 0 is 0.

/**
 * Maps an x-register number to the 3-bit compressed encoding used by the
 * CIW, CL, CS, CA, and CB formats, which can only address x8-x15.
 *
 * @throws RangeError if `register` is outside x8-x15.
 */
const compactRegister = (register: number): number => {
  if (register < 8 || register > 15) {
    throw new RangeError(`compact register field requires x8-x15, got x${register}`);
  }
  return register - 8;
};

/**
 * Encodes a base R-format instruction as a 4-byte little-endian encoding.
 *
 * R format performs register-register ALU operations (e.g. add, sub, sll,
 * and, or, xor, slt, plus their RV64 W-suffixed 32-bit variants such as
 * addw and subw, distinguished only by opcode/funct fields).
 *
 * Bit layout of the 32-bit instruction:
 *   funct7 [31:25] | rs2 [24:20] | rs1 [19:15] | funct3 [14:12] | rd [11:7] | opcode [6:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode, `funct3` -> funct3, `funct7` -> funct7
 * - `rd`  -> rd (destination register)
 * - `rs1` -> rs1, `rs2` -> rs2 (source registers)
 *
 * On RV64, `funct7` bit 30 selects the 32-bit W variants (e.g. addw), and
 * the shamt-encoded shifts use a different (I) format, not this one.
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeR = (
  opcode: number,
  funct3: number,
  funct7: number,
  rd: number,
  rs1: number,
  rs2: number
): Uint8Array =>
  bytes32(
    ((funct7 & 0x7f) << 25) |
      ((rs2 & 0x1f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a base I-format instruction as a 4-byte little-endian encoding.
 *
 * I format performs register-immediate ALU operations (addi, slti, andi, ...),
 * loads (lb, lh, lw, ld), JALR, and, on RV64, the variable shifts slli/srli/
 * srai (shift amount in imm12) and the 32-bit variants addiw, slliw, srliw,
 * sraiw, lbu, lhu, lwu.
 *
 * Bit layout of the 32-bit instruction:
 *   imm12 [31:20] | rs1 [19:15] | funct3 [14:12] | rd [11:7] | opcode [6:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode, `funct3` -> funct3
 * - `imm12` -> imm12 (12-bit immediate; a negative value is sign-extended
 *   by the mask into bits [31:20])
 * - `rs1` -> rs1 (source/base register)
 * - `rd`  -> rd (destination register)
 *
 * On RV64, the immediate for W-suffixed instructions and 32-bit loads is
 * still sign-extended from bit 31 at execution time; this encoder only
 * stores the low 12 bits.
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeI = (
  opcode: number,
  funct3: number,
  imm12: number,
  rd: number,
  rs1: number
): Uint8Array =>
  bytes32(
    ((imm12 & 0xfff) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a base S-format instruction as a 4-byte little-endian encoding.
 *
 * S format performs stores (sb, sh, sw, sd; on RV64, sd stores 64 bits).
 *
 * Bit layout of the 32-bit instruction:
 *   imm[11:5] [31:25] | rs2 [24:20] | rs1 [19:15] | funct3 [14:12] | imm[4:0] [11:7] | opcode [6:0]
 *
 * The 12-bit immediate is split: its upper 7 bits go to instruction bits
 * [31:25] and its lower 5 bits to instruction bits [11:7].
 *
 * Argument mapping:
 * - `opcode` -> opcode, `funct3` -> funct3 (store width)
 * - `rs1` -> rs1 (base address register), `rs2` -> rs2 (source data register)
 * - `imm12` -> the split immediate (byte offset; negative offsets are
 *   handled by masking the two's-complement value)
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
/**
 * Encodes a base B-format instruction as a 4-byte little-endian encoding.
 *
 * B format performs conditional branches (beq, bne, blt, bge, bltu, bgeu).
 *
 * Bit layout of the 32-bit instruction (offset bits are scattered):
 *   off[12] [32] | off[10:5] [30:25] | rs2 [24:20] | rs1 [19:15] |
 *   funct3 [14:12] | off[4:1] [11:8] | off[11] [7] | opcode [6:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode, `funct3` -> funct3 (branch condition)
 * - `rs1` -> rs1, `rs2` -> rs2 (compared registers)
 * - `offset13` -> the 13-bit offset in normal numeric order; the pieces
 *   are extracted and scattered to the positions above
 *
 * Note: offset bit 0 must be 0 (B offsets are multiples of 2) and is not
 * encoded. Negative offsets are handled by masking the two's-complement
 * value before the shifts.
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
/**
 * Encodes a base U-format instruction as a 4-byte little-endian encoding.
 *
 * U format is used by lui and auipc.
 *
 * Bit layout of the 32-bit instruction:
 *   imm20 [31:12] | rd [11:7] | opcode [6:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode, `rd` -> rd (destination register)
 * - `imm20` -> imm20 (the upper 20 bits of the instruction; on RV64 the
 *   executed value is sign-extended from instruction bit 31)
 *
 * On RV64, lui + addi/addiw pairs build 32-bit constants, and the RV64
 * convention is that lui's sign bit is bit 31 of the placed immediate;
 * callers must account for that when choosing imm20 for 64-bit constants.
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeU = (opcode: number, imm20: number, rd: number): Uint8Array =>
  bytes32(((imm20 & 0xfffff) << 12) | ((rd & 0x1f) << 7) | (opcode & 0x7f));

/**
 * Encodes a base J-format instruction as a 4-byte little-endian encoding.
 *
 * J format is used by jal.
 *
 * Bit layout of the 32-bit instruction (offset bits are scattered):
 *   off[20] [31] | off[10:1] [30:21] | off[11] [20] | off[19:12] [19:12] |
 *   rd [11:7] | opcode [6:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode, `rd` -> rd (link register)
 * - `offset21` -> the 21-bit offset in normal numeric order; the pieces
 *   are extracted and scattered to the positions above
 *
 * Note: offset bit 0 must be 0 (J offsets are multiples of 2) and is not
 * encoded. Negative offsets are handled by masking the two's-complement
 * value before the shifts. The offset range is +/- 1 MiB.
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeJ = (opcode: number, offset21: number, rd: number): Uint8Array =>
  // The offset pieces are scattered: bit 20 to [31], bits [10:1] to [30:21],
  // bit 11 to [20], and bits [19:12] to [19:12].
  bytes32(
    ((((offset21 & 0x1fffff) >> 20) & 0x1) << 31) |
      ((((offset21 & 0x1fffff) >> 1) & 0x3ff) << 21) |
      ((((offset21 & 0x1fffff) >> 11) & 0x1) << 20) |
      ((((offset21 & 0x1fffff) >> 12) & 0xff) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a compressed CR-format instruction as a 2-byte little-endian encoding.
 *
 * CR format is used by c.mv, c.add, c.jr, c.jalr, c.ebreak and (on RV64)
 * c.addw / c.subw. Both registers are full 5-bit x0-x31 registers.
 *
 * Bit layout of the 16-bit compressed instruction:
 *   funct4 [15:12] | rd/rs1 [11:7] | rs2 [6:2] | opcode [1:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode (quadrant), `funct4` -> funct4
 * - `rd` -> rd/rs1 (bits [11:7]; some CR instructions read it as rs1)
 * - `rs2` -> rs2 (bits [6:2]; serves as source or, for c.jr/c.jalr,
 *   the jump target register)
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeCr = (opcode: number, funct4: number, rd: number, rs2: number): Uint8Array =>
  bytes16(((funct4 & 0xf) << 12) | ((rd & 0x1f) << 7) | ((rs2 & 0x1f) << 2) | (opcode & 0x3));

/**
 * Encodes a compressed CI-format instruction as a 2-byte little-endian encoding.
 *
 * CI format is used by c.addi, c.nop, c.li, c.lui, c.slli and, on RV64,
 * c.addiw and c.slli with a 6-bit shift amount (shifts with shamt[5]=1 are
 * RV64-only).
 *
 * Bit layout of the 16-bit compressed instruction:
 *   funct3 [15:13] | bit12 [12] | rd/rs1 [11:7] | imm5 [6:2] | opcode [1:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode (quadrant), `funct3` -> funct3
 * - `bit12` -> a single immediate bit placed at instruction bit 12
 *   (the top bit of the 6-bit CI immediates such as c.addi/c.slli)
 * - `rd` -> rd/rs1 (bits [11:7]; the register is both source and
 *   destination for c.addi/c.slli)
 * - `imm5` -> the low 5 immediate bits placed contiguously at [6:2]
 *
 * Negative immediates: the caller masks the two's-complement value into
 * `bit12` and `imm5` before calling; this encoder only places the bits.
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeCi = (
  opcode: number,
  funct3: number,
  bit12: number,
  rd: number,
  imm5: number
): Uint8Array =>
  bytes16(
    ((funct3 & 0x7) << 13) |
      ((bit12 & 0x1) << 12) |
      ((rd & 0x1f) << 7) |
      ((imm5 & 0x1f) << 2) |
      (opcode & 0x3)
  );

/**
 * Encodes a compressed CSS-format instruction as a 2-byte little-endian encoding.
 *
 * CSS format is used by c.swsp, and on RV64 by c.sdsp (64-bit store).
 *
 * Bit layout of the 16-bit compressed instruction:
 *   funct3 [15:13] | imm6 [12:7] | rs2 [6:2] | opcode [1:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode (quadrant), `funct3` -> funct3
 * - `imm6` -> the 6-bit unsigned offset field placed contiguously at [12:7];
 *   it addresses the stack pointer in scaled units (e.g. 8-byte units for
 *   c.sdsp/c.swsp on RV64 vs. 4-byte units for c.swsp on RV32)
 * - `rs2` -> rs2 (source data register)
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeCss = (opcode: number, funct3: number, imm6: number, rs2: number): Uint8Array =>
  bytes16(((funct3 & 0x7) << 13) | ((imm6 & 0x3f) << 7) | ((rs2 & 0x1f) << 2) | (opcode & 0x3));

/**
 * Encodes a compressed CIW-format instruction as a 2-byte little-endian encoding.
 *
 * CIW format is used by c.addi4spn (adds a zero-extended multiple of 4 to
 * the stack pointer; the offset is a 8-bit unsigned field scaled by 4).
 *
 * Bit layout of the 16-bit compressed instruction:
 *   funct3 [15:13] | imm8 [12:5] | rd' [4:2] | opcode [1:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode (quadrant), `funct3` -> funct3
 * - `imm8` -> the 8-bit unsigned offset placed contiguously at [12:5]
 * - `rd`  -> rd' (compact 3-bit register field; must be x8-x15, encoded
 *   as register number minus 8)
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeCiw = (opcode: number, funct3: number, imm8: number, rd: number): Uint8Array =>
  bytes16(
    ((funct3 & 0x7) << 13) | ((imm8 & 0xff) << 5) | (compactRegister(rd) << 2) | (opcode & 0x3)
  );

/**
 * Encodes a compressed CL-format instruction as a 2-byte little-endian encoding.
 *
 * CL format is used by c.lw and, on RV64, by c.ld (64-bit load).
 *
 * Bit layout of the 16-bit compressed instruction (the 5-bit offset is split
 * and scattered):
 *   funct3 [15:13] | offset[4:2] [12:10] | rs1' [9:7] | offset[1:0] [6:5] |
 *   rd' [4:2] | opcode [1:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode (quadrant), `funct3` -> funct3
 * - `offset5` -> the 5-bit unsigned offset in normal numeric order; its
 *   bits [4:2] are scattered to [12:10] and its bits [1:0] to [6:5]
 * - `rs1` -> rs1' (compact 3-bit base register; must be x8-x15)
 * - `rd`  -> rd' (compact 3-bit destination register; must be x8-x15)
 *
 * The caller is responsible for any scaling (the architecture scales the
 * CL offset by the access size) before passing `offset5`.
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
/**
 * Encodes a compressed CS-format instruction as a 2-byte little-endian encoding.
 *
 * CS format is used by c.sw and, on RV64, by c.sd (64-bit store).
 *
 * Bit layout of the 16-bit compressed instruction (the 5-bit offset is split
 * and scattered):
 *   funct3 [15:13] | offset[4:2] [12:10] | rs1' [9:7] | offset[1:0] [6:5] |
 *   rs2' [4:2] | opcode [1:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode (quadrant), `funct3` -> funct3
 * - `offset5` -> the 5-bit unsigned offset in normal numeric order; its
 *   bits [4:2] are scattered to [12:10] and its bits [1:0] to [6:5]
 * - `rs1` -> rs1' (compact 3-bit base register; must be x8-x15)
 * - `rs2` -> rs2' (compact 3-bit source data register; must be x8-x15)
 *
 * The caller is responsible for any scaling (the architecture scales the
 * CS offset by the access size) before passing `offset5`.
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
/**
 * Encodes a compressed CA-format instruction as a 2-byte little-endian encoding.
 *
 * CA format is used by c.sub, c.xor, c.or, c.and and, on RV64, by the
 * 32-bit arithmetic variants c.subw and c.addw.
 *
 * Bit layout of the 16-bit compressed instruction:
 *   funct6 [15:10] | rd' [9:7] | funct2 [6:5] | rs2' [4:2] | opcode [1:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode (quadrant), `funct6` -> funct6, `funct2` -> funct2
 *   (together these select the operation)
 * - `rd`  -> rd' (compact 3-bit register; destination and first source,
 *   must be x8-x15)
 * - `rs2` -> rs2' (compact 3-bit second source register; must be x8-x15)
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeCa = (
  opcode: number,
  funct6: number,
  rd: number,
  funct2: number,
  rs2: number
): Uint8Array =>
  bytes16(
    ((funct6 & 0x3f) << 10) |
      (compactRegister(rd) << 7) |
      ((funct2 & 0x3) << 5) |
      (compactRegister(rs2) << 2) |
      (opcode & 0x3)
  );

/**
 * Encodes a compressed CB-format instruction as a 2-byte little-endian encoding.
 *
 * CB format is used by c.beqz/c.bnez and by the shift-immediate group
 * c.srli/c.srai/c.andi (including RV64's 6-bit shift amounts).
 *
 * Bit layout of the 16-bit compressed instruction (the 8-bit offset is split
 * and scattered):
 *   funct3 [15:13] | offset[7:5] [12:10] | rs1' [9:7] | offset[4:0] [6:2] |
 *   opcode [1:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode (quadrant), `funct3` -> funct3
 * - `offset8` -> the 8-bit offset in normal numeric order; its bits [7:5]
 *   are scattered to [12:10] and its bits [4:0] to [6:2]
 * - `rs1` -> rs1' (compact 3-bit register; must be x8-x15)
 *
 * Note: CB branch offsets are multiples of 2; the caller supplies a
 * `offset8` already converted to the field's bit numbering.
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
/**
 * Encodes a compressed CJ-format instruction as a 2-byte little-endian encoding.
 *
 * CJ format is used by c.j and (on RV32 only) c.jal; on RV64 the link form
 * is unavailable.
 *
 * Bit layout of the 16-bit compressed instruction:
 *   funct3 [15:13] | offset11 [12:2] | opcode [1:0]
 *
 * Argument mapping:
 * - `opcode` -> opcode (quadrant), `funct3` -> funct3
 * - `offset11` -> the 11-bit offset placed contiguously at [12:2] in
 *   normal numeric order (MSB at instruction bit 12, LSB at bit 2)
 *
 * Note: CJ jump offsets are multiples of 2; the caller supplies `offset11`
 * already converted to the field's bit numbering.
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeCj = (opcode: number, funct3: number, offset11: number): Uint8Array =>
  bytes16(((funct3 & 0x7) << 13) | ((offset11 & 0x7ff) << 2) | (opcode & 0x3));

/**
 * Encodes an R4-format instruction as a 4-byte little-endian encoding.
 *
 * R4 is the fused floating-point format used by instructions such as
 * fmadd.s, fmsub.s, fnmadd.s, and their RV64 double-precision counterparts.
 *
 * Bit layout of the 32-bit instruction:
 *   rs3 [31:27] | fmt [26:25] | rs2 [24:20] | rs1 [19:15] |
 *   rm [14:12] | rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeR4 = (
  opcode: number,
  rm: number,
  fmt: number,
  rd: number,
  rs1: number,
  rs2: number,
  rs3: number
): Uint8Array =>
  bytes32(
    ((rs3 & 0x1f) << 27) |
      ((fmt & 0x3) << 25) |
      ((rs2 & 0x1f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((rm & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a vector arithmetic instruction as a 4-byte little-endian encoding.
 *
 * This is the common vector arithmetic layout used by OPFVV, OPIVV, and the
 * other vector arithmetic subformats. Scalar register operands may occupy the
 * `vs1` or `vs2` field positions, depending on the instruction.
 *
 * Bit layout of the 32-bit instruction:
 *   funct6 [31:26] | vm [25] | vs2 [24:20] | vs1 [19:15] |
 *   funct3 [14:12] | vd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeV = (
  opcode: number,
  funct6: number,
  vm: number,
  vs2: number,
  vs1: number,
  funct3: number,
  vd: number
): Uint8Array =>
  bytes32(
    ((funct6 & 0x3f) << 26) |
      ((vm & 0x1) << 25) |
      ((vs2 & 0x1f) << 20) |
      ((vs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((vd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a vector load instruction as a 4-byte little-endian encoding.
 *
 * `op24_20` is the addressing-mode operand at bits 24:20: it is `lumop` for
 * unit-stride, whole-register, and fault-only-first forms, or `rs2`/`vs2` for
 * strided and indexed forms.
 *
 * Bit layout of the 32-bit instruction:
 *   nf [31:29] | mew [28] | mop [27:26] | vm [25] | op24_20 [24:20] |
 *   rs1 [19:15] | width [14:12] | vd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeVl = (
  opcode: number,
  nf: number,
  mew: number,
  mop: number,
  vm: number,
  op24_20: number,
  rs1: number,
  width: number,
  vd: number
): Uint8Array =>
  bytes32(
    ((nf & 0x7) << 29) |
      ((mew & 0x1) << 28) |
      ((mop & 0x3) << 26) |
      ((vm & 0x1) << 25) |
      ((op24_20 & 0x1f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((width & 0x7) << 12) |
      ((vd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a vector store instruction as a 4-byte little-endian encoding.
 *
 * `op24_20` is the addressing-mode operand at bits 24:20: it is `sumop` for
 * unit-stride forms, or `rs2`/`vs2` for strided and indexed forms.
 *
 * Bit layout of the 32-bit instruction:
 *   nf [31:29] | mew [28] | mop [27:26] | vm [25] | op24_20 [24:20] |
 *   rs1 [19:15] | width [14:12] | vs3 [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeVs = (
  opcode: number,
  nf: number,
  mew: number,
  mop: number,
  vm: number,
  op24_20: number,
  rs1: number,
  width: number,
  vs3: number
): Uint8Array =>
  bytes32(
    ((nf & 0x7) << 29) |
      ((mew & 0x1) << 28) |
      ((mop & 0x3) << 26) |
      ((vm & 0x1) << 25) |
      ((op24_20 & 0x1f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((width & 0x7) << 12) |
      ((vs3 & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a vector configuration instruction as a 4-byte little-endian encoding.
 *
 * The 12-bit `cfg12` field is passed wholesale so this covers vsetvli,
 * vsetivli, and vsetvl. For vsetivli, the AVL immediate occupies the `rs1`
 * position and the vector-type immediate is included in `cfg12`; for vsetvl,
 * the second register operand is packed into `cfg12`.
 *
 * Example: `vsetivli zero, 4, e32, m1, ta, ma` uses `cfg12 = 0xc10` and
 * `rs1 = 4`, producing 0xc1027057.
 *
 * Bit layout of the 32-bit instruction:
 *   cfg12 [31:20] | rs1 [19:15] | funct3 [14:12] | rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeVcfg = (
  opcode: number,
  funct3: number,
  cfg12: number,
  rd: number,
  rs1: number
): Uint8Array =>
  bytes32(
    ((cfg12 & 0xfff) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a Zcmp push/pop instruction as a 2-byte little-endian encoding.
 *
 * Used by cm.push, cm.pop, cm.popret, and cm.popretz.
 *
 * Bit layout of the 16-bit compressed instruction:
 *   funct3 [15:13] | funct5 [12:8] | rlist [7:4] | spimm [3:2] | opcode [1:0]
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeZcmp = (
  opcode: number,
  funct3: number,
  funct5: number,
  rlist: number,
  spimm: number
): Uint8Array =>
  bytes16(
    ((funct3 & 0x7) << 13) |
      ((funct5 & 0x1f) << 8) |
      ((rlist & 0xf) << 4) |
      ((spimm & 0x3) << 2) |
      (opcode & 0x3)
  );

/**
 * Encodes a Zcmp register-move instruction as a 2-byte little-endian encoding.
 *
 * Used by cm.mvsa01 and cm.mva01s.
 *
 * Bit layout of the 16-bit compressed instruction:
 *   funct3 [15:13] | funct3Mid [12:10] | sreg1 [9:7] |
 *   funct2Low [6:5] | sreg2 [4:2] | opcode [1:0]
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeZcmpMove = (
  opcode: number,
  funct3: number,
  funct3Mid: number,
  funct2Low: number,
  sreg1: number,
  sreg2: number
): Uint8Array =>
  bytes16(
    ((funct3 & 0x7) << 13) |
      ((funct3Mid & 0x7) << 10) |
      ((sreg1 & 0x7) << 7) |
      ((funct2Low & 0x3) << 5) |
      ((sreg2 & 0x7) << 2) |
      (opcode & 0x3)
  );

/**
 * Encodes a Zcmt table-jump instruction as a 2-byte little-endian encoding.
 *
 * Used by cm.jalt; the 3-bit field at bits 12:10 is fixed to zero.
 *
 * Bit layout of the 16-bit compressed instruction:
 *   funct3 [15:13] | 000 [12:10] | index [9:2] | opcode [1:0]
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeZcmt = (opcode: number, funct3: number, index: number): Uint8Array =>
  bytes16(((funct3 & 0x7) << 13) | ((index & 0xff) << 2) | (opcode & 0x3));

// ---------------------------------------------------------------------------
// Field-level format helpers.
//
// The generated instruction wrappers are pure pass-throughs: each exported
// encoder is a single call to one of these helpers with the instruction's
// operands passed directly. All shifting, masking, field splitting, and
// immediate reassembly therefore lives here. Where a helper takes split field
// pieces (e.g. `imm12hi`/`imm12lo`) it reassembles them internally; where a
// field mixes constant and operand bits (e.g. AMO `funct5`/`aq`/`rl`) the
// pieces are separate parameters.
// ---------------------------------------------------------------------------

/**
 * Encodes an A-format (atomic memory operation) instruction as 4 bytes.
 *
 * A format is used by lr/sc, the amoswap/amoadd/... family, Zacas amocas, and
 * the Zalasr load-acquire/store-release forms. `funct5` is the operation, and
 * `aq`/`rl` are the acquire/release bits (fixed to 0 when the source defines
 * no such operand). The remaining fields match R format.
 *
 *   funct5 [31:27] | aq [26] | rl [25] | rs2 [24:20] | rs1 [19:15] |
 *   funct3 [14:12] | rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeA = (
  opcode: number,
  funct5: number,
  aq: number,
  rl: number,
  funct3: number,
  rd: number,
  rs1: number,
  rs2: number
): Uint8Array =>
  bytes32(
    ((funct5 & 0x1f) << 27) |
      ((aq & 0x1) << 26) |
      ((rl & 0x1) << 25) |
      ((rs2 & 0x1f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes an SM4 round instruction (sm4ed/sm4ks) as 4 bytes.
 *
 * The 2-bit `bs` operand occupies the top of `funct7`; `funct5` holds the
 * remaining operation bits at [29:25]. Layout:
 *   bs [31:30] | funct5 [29:25] | rs2 [24:20] | rs1 [19:15] |
 *   funct3 [14:12] | rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeSm4 = (
  opcode: number,
  funct3: number,
  bs: number,
  funct5: number,
  rd: number,
  rs1: number,
  rs2: number
): Uint8Array =>
  bytes32(
    ((bs & 0x3) << 30) |
      ((funct5 & 0x1f) << 25) |
      ((rs2 & 0x1f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a shift-immediate I-format instruction as 4 bytes.
 *
 * Shift instructions place a 6-bit `funct6` (0 for logical shifts, 0x10 for
 * arithmetic right shifts) in the top of the immediate and the shift amount in
 * [25:20]. The 5-bit RV64 word shifts pass their amount in the low bits, so
 * the extra high bit stays 0. Layout:
 *   funct6 [31:26] | shamt [25:20] | rs1 [19:15] | funct3 [14:12] |
 *   rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeShiftI = (
  opcode: number,
  funct3: number,
  funct6: number,
  shamt: number,
  rd: number,
  rs1: number
): Uint8Array =>
  bytes32(
    ((funct6 & 0x3f) << 26) |
      ((shamt & 0x3f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes aes64ks1i as 4 bytes.
 *
 * The 8-bit `imm8` (0x31 for both aes64ks1i and aes64im) occupies [31:24] and
 * the 4-bit round number `rnum` occupies [23:20]. Layout:
 *   imm8 [31:24] | rnum [23:20] | rs1 [19:15] | funct3 [14:12] |
 *   rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeAes64ks1iFields = (
  opcode: number,
  funct3: number,
  imm8: number,
  rnum: number,
  rd: number,
  rs1: number
): Uint8Array =>
  bytes32(
    ((imm8 & 0xff) << 24) |
      ((rnum & 0xf) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a FENCE-format instruction as 4 bytes.
 *
 * FENCE places the four 4-bit masks `fm`, `pred`, and `succ` in [31:20].
 * Layout:
 *   fm [31:28] | pred [27:24] | succ [23:20] | rs1 [19:15] |
 *   funct3 [14:12] | rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeFenceFields = (
  opcode: number,
  funct3: number,
  fm: number,
  pred: number,
  succ: number,
  rs1: number,
  rd: number
): Uint8Array =>
  bytes32(
    ((fm & 0xf) << 28) |
      ((pred & 0xf) << 24) |
      ((succ & 0xf) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes mop.r.N (Zimop) as 4 bytes.
 *
 * The reserved high bits (bit 31 set, [29:28] and [25:22] zero/one per the
 * Zimop encoding) are fixed inside the helper; the caller supplies only the
 * opcode, funct3, and the three `t` selectors. Layout:
 *   1 [31] | t30 [30] | 00 [29:28] | t27:26 [27:26] | 0111 [25:22] |
 *   t21:20 [21:20] | rs1 [19:15] | funct3 [14:12] | rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeZimop = (
  opcode: number,
  funct3: number,
  t30: number,
  t2726: number,
  t2120: number,
  rs1: number,
  rd: number
): Uint8Array =>
  bytes32(
    (1 << 31) |
      ((t30 & 0x1) << 30) |
      ((t2726 & 0x3) << 26) |
      (0x7 << 22) |
      ((t2120 & 0x3) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes mop.rr.N (Zimop) as 4 bytes.
 *
 * Same reserved bits as {@link encodeZimop}, plus the register-register form's
 * set bit 25. Layout:
 *   1 [31] | t30 [30] | 00 [29:28] | t27:26 [27:26] | 1 [25] |
 *   rs2 [24:20] | rs1 [19:15] | funct3 [14:12] | rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeZimopRR = (
  opcode: number,
  funct3: number,
  t30: number,
  t2726: number,
  rs2: number,
  rs1: number,
  rd: number
): Uint8Array =>
  bytes32(
    (1 << 31) |
      ((t30 & 0x1) << 30) |
      ((t2726 & 0x3) << 26) |
      (1 << 25) |
      ((rs2 & 0x1f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes vror.vi (vector rotate by immediate) as 4 bytes.
 *
 * `funct5` is the vector opcode prefix at [31:27] and the top bit of the 6-bit
 * rotate amount sits at bit 26. Layout:
 *   funct5 [31:27] | imm6hi [26] | vm [25] | vs2 [24:20] | imm6lo [19:15] |
 *   funct3 [14:12] | vd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeVror = (
  opcode: number,
  funct5: number,
  imm6hi: number,
  vm: number,
  vs2: number,
  imm6lo: number,
  funct3: number,
  vd: number
): Uint8Array =>
  bytes32(
    ((funct5 & 0x1f) << 27) |
      ((imm6hi & 0x1) << 26) |
      ((vm & 0x1) << 25) |
      ((vs2 & 0x1f) << 20) |
      ((imm6lo & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((vd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes vsetivli as 4 bytes.
 *
 * The fixed top two bits (11) sit at [31:30], the vtype immediate at [29:20],
 * and the AVL immediate in the rs1 position. Layout:
 *   11 [31:30] | vtype [29:20] | AVL [19:15] | funct3 [14:12] |
 *   rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeVsetivliFields = (
  opcode: number,
  funct3: number,
  zimm10: number,
  zimm5: number,
  rd: number
): Uint8Array =>
  bytes32(
    (3 << 30) |
      ((zimm10 & 0x3ff) << 20) |
      ((zimm5 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes vsetvl as 4 bytes.
 *
 * The fixed bit 31 and zero bits [30:25] sit above the AVL register. Layout:
 *   1 [31] | 0 [30:25] | rs2 [24:20] | rs1 [19:15] | funct3 [14:12] |
 *   rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeVsetvlFields = (
  opcode: number,
  funct3: number,
  rs2: number,
  rs1: number,
  rd: number
): Uint8Array =>
  bytes32(
    (1 << 31) |
      ((rs2 & 0x1f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((rd & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes c.mop.N (Zcmop) as 2 bytes.
 *
 * The 3-bit selector occupies [10:8]; bits 12 and 11 are zero and bit 7 is
 * one. Layout:
 *   funct3 [15:13] | 00 [12:11] | mop_t [10:8] | 1 [7] | 00000 [6:2] |
 *   opcode [1:0]
 *
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeZcmop = (opcode: number, funct3: number, mopT: number): Uint8Array =>
  bytes16(((funct3 & 0x7) << 13) | ((mopT & 0x7) << 8) | (1 << 7) | (opcode & 0x3));

/**
 * Encodes an S-format instruction from its two immediate field pieces.
 *
 * `imm12hi` is the [11:5] piece at instruction [31:25]; `imm12lo` is the [4:0]
 * piece at instruction [11:7]. Layout:
 *   imm12hi [31:25] | rs2 [24:20] | rs1 [19:15] | funct3 [14:12] |
 *   imm12lo [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeSFields = (
  opcode: number,
  funct3: number,
  imm12hi: number,
  imm12lo: number,
  rs1: number,
  rs2: number
): Uint8Array =>
  bytes32(
    ((imm12hi & 0x7f) << 25) |
      ((rs2 & 0x1f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((imm12lo & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a B-format instruction from its two offset field pieces.
 *
 * `bimm12hi` is the [12,10:5] piece at instruction [31:25]; `bimm12lo` is the
 * [4:1,11] piece at instruction [11:7]. Layout:
 *   bimm12hi [31:25] | rs2 [24:20] | rs1 [19:15] | funct3 [14:12] |
 *   bimm12lo [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeBFields = (
  opcode: number,
  funct3: number,
  bimm12hi: number,
  bimm12lo: number,
  rs1: number,
  rs2: number
): Uint8Array =>
  bytes32(
    ((bimm12hi & 0x7f) << 25) |
      ((rs2 & 0x1f) << 20) |
      ((rs1 & 0x1f) << 15) |
      ((funct3 & 0x7) << 12) |
      ((bimm12lo & 0x1f) << 7) |
      (opcode & 0x7f)
  );

/**
 * Encodes a J-format instruction from its raw 20-bit immediate field.
 *
 * `jimm20` is instruction [31:12] exactly as encoded (the scattered offset
 * bits), so the caller does not rearrange them. Layout:
 *   jimm20 [31:12] | rd [11:7] | opcode [6:0]
 *
 * @returns 4-byte little-endian Uint8Array containing the encoding.
 */
export const encodeJFields = (opcode: number, jimm20: number, rd: number): Uint8Array =>
  bytes32(((jimm20 & 0xfffff) << 12) | ((rd & 0x1f) << 7) | (opcode & 0x7f));

/**
 * Encodes a CL-format instruction from its two offset field pieces.
 *
 * `offsetHi` is the 3-bit piece at instruction [12:10] and `offsetLo` the
 * 2-bit piece at [6:5]. Both registers are compact x8-x15 fields. Layout:
 *   funct3 [15:13] | offsetHi [12:10] | rs1' [9:7] | offsetLo [6:5] |
 *   rd' [4:2] | opcode [1:0]
 *
 * @throws RangeError if `rs1` or `rd` is outside x8-x15.
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeClFields = (
  opcode: number,
  funct3: number,
  offsetHi: number,
  offsetLo: number,
  rs1: number,
  rd: number
): Uint8Array =>
  bytes16(
    ((funct3 & 0x7) << 13) |
      ((offsetHi & 0x7) << 10) |
      (compactRegister(rs1) << 7) |
      ((offsetLo & 0x3) << 5) |
      (compactRegister(rd) << 2) |
      (opcode & 0x3)
  );

/**
 * Encodes a CL-format instruction whose offset is a single high bit plus one
 * low bit (the Zcb halfword forms c.lhu/c.lh). Layout:
 *   funct3 [15:13] | offsetHi [12:10] | rs1' [9:7] | bit6 [6] | bit5 [5] |
 *   rd' [4:2] | opcode [1:0]
 *
 * @throws RangeError if `rs1` or `rd` is outside x8-x15.
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeClHalf = (
  opcode: number,
  funct3: number,
  offsetHi: number,
  bit6: number,
  bit5: number,
  rs1: number,
  rd: number
): Uint8Array =>
  bytes16(
    ((funct3 & 0x7) << 13) |
      ((offsetHi & 0x7) << 10) |
      (compactRegister(rs1) << 7) |
      ((bit6 & 0x1) << 6) |
      ((bit5 & 0x1) << 5) |
      (compactRegister(rd) << 2) |
      (opcode & 0x3)
  );

/**
 * Encodes a CS-format instruction from its two offset field pieces.
 *
 * `offsetHi` is the 3-bit piece at instruction [12:10] and `offsetLo` the
 * 2-bit piece at [6:5]. Both registers are compact x8-x15 fields. Layout:
 *   funct3 [15:13] | offsetHi [12:10] | rs1' [9:7] | offsetLo [6:5] |
 *   rs2' [4:2] | opcode [1:0]
 *
 * @throws RangeError if `rs1` or `rs2` is outside x8-x15.
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeCsFields = (
  opcode: number,
  funct3: number,
  offsetHi: number,
  offsetLo: number,
  rs1: number,
  rs2: number
): Uint8Array =>
  bytes16(
    ((funct3 & 0x7) << 13) |
      ((offsetHi & 0x7) << 10) |
      (compactRegister(rs1) << 7) |
      ((offsetLo & 0x3) << 5) |
      (compactRegister(rs2) << 2) |
      (opcode & 0x3)
  );

/**
 * Encodes a CB-format instruction from its two offset field pieces.
 *
 * `offsetHi` is the 3-bit piece at instruction [12:10] and `offsetLo` the
 * 5-bit piece at [6:2]. The register is a compact x8-x15 field. Layout:
 *   funct3 [15:13] | offsetHi [12:10] | rs1' [9:7] | offsetLo [6:2] |
 *   opcode [1:0]
 *
 * @throws RangeError if `rs1` is outside x8-x15.
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeCbFields = (
  opcode: number,
  funct3: number,
  offsetHi: number,
  offsetLo: number,
  rs1: number
): Uint8Array =>
  bytes16(
    ((funct3 & 0x7) << 13) |
      ((offsetHi & 0x7) << 10) |
      (compactRegister(rs1) << 7) |
      ((offsetLo & 0x1f) << 2) |
      (opcode & 0x3)
  );

/**
 * Encodes the CB-format shift/immediate group (c.andi/c.srli/c.srai).
 *
 * The 6-bit immediate is split: `imm6hi` is bit 5 at instruction bit 12 and
 * `imm6lo` the low 5 bits at [6:2]; `funct2` is the operation selector at
 * [11:10]. Layout:
 *   funct3 [15:13] | imm6hi [12] | funct2 [11:10] | rs1' [9:7] |
 *   imm6lo [6:2] | opcode [1:0]
 *
 * @throws RangeError if `rs1` is outside x8-x15.
 * @returns 2-byte little-endian Uint8Array containing the encoding.
 */
export const encodeCbShiftImm = (
  opcode: number,
  funct3: number,
  imm6hi: number,
  funct2: number,
  imm6lo: number,
  rs1: number
): Uint8Array =>
  bytes16(
    ((funct3 & 0x7) << 13) |
      ((imm6hi & 0x1) << 12) |
      ((funct2 & 0x3) << 10) |
      (compactRegister(rs1) << 7) |
      ((imm6lo & 0x1f) << 2) |
      (opcode & 0x3)
  );
