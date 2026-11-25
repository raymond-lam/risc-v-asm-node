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

// RISC-V relocation types used in ELF ET_REL objects.  Values match the psABI
// (https://github.com/riscv-non-isa/riscv-elf-psabi).

import { parseOperator } from '#parse';
import type { InstructionSignature } from '#instructions';

/** R_RISCV_BRANCH — conditional branch to a symbol. */
export const R_RISCV_BRANCH = 16;

/** R_RISCV_JAL — jal to a symbol. */
export const R_RISCV_JAL = 17;

/** R_RISCV_PCREL_HI20 — %pcrel_hi(sym) in a U-type instruction. */
export const R_RISCV_PCREL_HI20 = 23;

/** R_RISCV_PCREL_LO12_I — %pcrel_lo(label) in an I-type instruction. */
export const R_RISCV_PCREL_LO12_I = 24;

/** R_RISCV_PCREL_LO12_S — %pcrel_lo(label) in an S-type instruction. */
export const R_RISCV_PCREL_LO12_S = 25;

/** R_RISCV_HI20 — %hi(sym) in a U-type instruction. */
export const R_RISCV_HI20 = 26;

/** R_RISCV_LO12_I — %lo(sym) in an I-type instruction. */
export const R_RISCV_LO12_I = 27;

/** R_RISCV_LO12_S — %lo(sym) in an S-type instruction. */
export const R_RISCV_LO12_S = 28;

/** R_RISCV_32 — 32-bit absolute relocation for .word. */
export const R_RISCV_32 = 1;

/** R_RISCV_64 — 64-bit absolute relocation for .dword. */
export const R_RISCV_64 = 2;

/**
 * A relocation spec produced during first-pass symbol-table construction.
 * The symbol name is resolved to a section-header index by the ELF writer.
 */
export type RelocationSpec = {
  readonly offset: number;
  readonly section: string;
  readonly type: number;
  readonly symbolName: string;
  readonly addend: number;
};

/**
 * Determine the R_RISCV_* relocation type for an encoder argument whose
 * operand is a symbol reference.
 *
 * @param arg - Encoder argument metadata.
 * @param opText - Original operand text (for detecting %hi/%lo).
 * @param instruction - Instruction entry (for mnemonic detection).
 * @param mnemonic - Normalized mnemonic.
 * @returns The relocation-type constant.
 */
const computeRelocTypeForOperator = (
  op: { operator: 'hi' | 'lo' | 'pcrel_hi' | 'pcrel_lo' },
  arg: Extract<
    InstructionSignature['encoderSignature'][number],
    { readonly type: 'address' | 'number' }
  >
): number | null => {
  if (op.operator === 'hi' || op.operator === 'pcrel_hi') {
    return op.operator === 'hi' ? R_RISCV_HI20 : R_RISCV_PCREL_HI20;
  } else {
    // 'lo' or 'pcrel_lo'
    if (arg.type === 'address') {
      return op.operator === 'lo' ? R_RISCV_LO12_S : R_RISCV_PCREL_LO12_S;
    } else {
      return op.operator === 'lo' ? R_RISCV_LO12_I : R_RISCV_PCREL_LO12_I;
    }
  }
};

export const relocationTypeForArg = (
  arg: Extract<
    InstructionSignature['encoderSignature'][number],
    { readonly type: 'address' | 'number' }
  >,
  opText: string,
  _instruction: unknown,
  mnemonic: string
): number => {
  // If the arg has an explicit relocationType, use it directly.
  if (arg.relocationType !== undefined) return arg.relocationType;

  const op = parseOperator(opText);
  if (op) {
    const result = computeRelocTypeForOperator(op, arg);
    if (result !== null) return result;
    // fall through to default logic
  }
  // No operator: default logic.
  if (arg.type === 'address') {
    switch (arg.addressPart) {
      case 'branchOffsetHigh':
      case 'branchOffsetLow':
      case 'cBranchOffsetHigh':
      case 'cBranchOffsetLow':
        return R_RISCV_BRANCH;
      case 'jumpOffset':
        return R_RISCV_JAL;
      case 'offsetHigh':
      case 'offsetLow':
        return R_RISCV_LO12_S;
      case 'offset':
      default:
        return R_RISCV_LO12_I;
    }
  }
  // 'number' type: default to LO12_I (I-type). If mnemonic is lui/auipc, treat as HI20.
  if (mnemonic === 'lui' || mnemonic === 'auipc') {
    return R_RISCV_HI20;
  }
  return R_RISCV_LO12_I;
};
