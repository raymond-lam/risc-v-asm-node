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

import * as canonical from '#instructions/canonical';
import type { InstructionSignature } from '#instructions/operands';
import * as pseudo from '#instructions/pseudo';
import * as relocations from '#relocations';

// Exact signatures are authoritative for flat-supported mnemonics.
// Unsupported entries use mechanical field-level metadata derived from encoder
// parameter names.  Register parameters start with rd/rs/rt/frd/frs/fs1/fs2/fd/vd/vs;
// all others are treated as numbers.

const INSTRUCTION_MAP: ReadonlyMap<
  string,
  Readonly<{
    readonly requires: readonly string[];
    readonly encode: (...args: number[]) => Uint8Array;
    readonly instructionLength: number | ((rd: number, value: number | bigint) => number);
    readonly signatures: readonly InstructionSignature[];
  }>
> = new Map([
  [
    'lr.d',
    {
      requires: ['a'],
      encode: canonical.encodeLrD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sc.d',
    {
      requires: ['a'],
      encode: canonical.encodeScD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoswap.d',
    {
      requires: ['a'],
      encode: canonical.encodeAmoswapD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoadd.d',
    {
      requires: ['a'],
      encode: canonical.encodeAmoaddD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoxor.d',
    {
      requires: ['a'],
      encode: canonical.encodeAmoxorD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoand.d',
    {
      requires: ['a'],
      encode: canonical.encodeAmoandD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoor.d',
    {
      requires: ['a'],
      encode: canonical.encodeAmoorD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomin.d',
    {
      requires: ['a'],
      encode: canonical.encodeAmominD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomax.d',
    {
      requires: ['a'],
      encode: canonical.encodeAmomaxD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amominu.d',
    {
      requires: ['a'],
      encode: canonical.encodeAmominuD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomaxu.d',
    {
      requires: ['a'],
      encode: canonical.encodeAmomaxuD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.ld',
    {
      requires: ['c'],
      encode: canonical.encodeCLd,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetLoDouble', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetHiDouble', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.sd',
    {
      requires: ['c'],
      encode: canonical.encodeCSd,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetHiDouble', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetLoDouble', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.addiw',
    {
      requires: ['c'],
      encode: canonical.encodeCAddiw,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [0, 4] as const,
              signed: true,
            },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [5, 5] as const,
              signed: true,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.srli',
    {
      requires: ['c'],
      encode: canonical.encodeCSrli,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [0, 4] as const,
              signed: false,
            },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [5, 5] as const,
              signed: false,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.srai',
    {
      requires: ['c'],
      encode: canonical.encodeCSrai,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [0, 4] as const,
              signed: false,
            },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [5, 5] as const,
              signed: false,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.subw',
    {
      requires: ['c'],
      encode: canonical.encodeCSubw,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.addw',
    {
      requires: ['c'],
      encode: canonical.encodeCAddw,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.slli',
    {
      requires: ['c'],
      encode: canonical.encodeCSlli,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [5, 5] as const,
              signed: false,
            },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [0, 4] as const,
              signed: false,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.ldsp',
    {
      requires: ['c'],
      encode: canonical.encodeCLdsp,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'address',
              sourceOperand: 1,
              addressPart: 'cOffsetSpDoubleHi',
              relative: false,
            },
            {
              type: 'address',
              sourceOperand: 1,
              addressPart: 'cOffsetSpDoubleLo',
              relative: false,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.sdsp',
    {
      requires: ['c'],
      encode: canonical.encodeCSdsp,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetSpDouble', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.l.d',
    {
      requires: ['d'],
      encode: canonical.encodeFcvtLD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.lu.d',
    {
      requires: ['d'],
      encode: canonical.encodeFcvtLuD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmv.x.d',
    {
      requires: ['d'],
      encode: canonical.encodeFmvXD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.d.l',
    {
      requires: ['d'],
      encode: canonical.encodeFcvtDL,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.d.lu',
    {
      requires: ['d'],
      encode: canonical.encodeFcvtDLu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmv.d.x',
    {
      requires: ['d'],
      encode: canonical.encodeFmvDX,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.l.s',
    {
      requires: ['f'],
      encode: canonical.encodeFcvtLS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.lu.s',
    {
      requires: ['f'],
      encode: canonical.encodeFcvtLuS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.s.l',
    {
      requires: ['f'],
      encode: canonical.encodeFcvtSL,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.s.lu',
    {
      requires: ['f'],
      encode: canonical.encodeFcvtSLu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hlv.wu',
    {
      requires: ['h'],
      encode: canonical.encodeHlvWu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hlv.d',
    {
      requires: ['h'],
      encode: canonical.encodeHlvD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hsv.d',
    {
      requires: ['h'],
      encode: canonical.encodeHsvD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'lwu',
    {
      requires: ['i'],
      encode: canonical.encodeLwu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'offset', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'ld',
    {
      requires: ['i'],
      encode: canonical.encodeLd,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'offset', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'sd',
    {
      requires: ['i'],
      encode: canonical.encodeSd,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 1, addressPart: 'offsetHigh', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'offsetLow', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'slli',
    {
      requires: ['i'],
      encode: canonical.encodeSlli,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'srli',
    {
      requires: ['i'],
      encode: canonical.encodeSrli,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'srai',
    {
      requires: ['i'],
      encode: canonical.encodeSrai,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'addiw',
    {
      requires: ['i'],
      encode: canonical.encodeAddiw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'slliw',
    {
      requires: ['i'],
      encode: canonical.encodeSlliw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'srliw',
    {
      requires: ['i'],
      encode: canonical.encodeSrliw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sraiw',
    {
      requires: ['i'],
      encode: canonical.encodeSraiw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'addw',
    {
      requires: ['i'],
      encode: canonical.encodeAddw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'subw',
    {
      requires: ['i'],
      encode: canonical.encodeSubw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sllw',
    {
      requires: ['i'],
      encode: canonical.encodeSllw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'srlw',
    {
      requires: ['i'],
      encode: canonical.encodeSrlw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sraw',
    {
      requires: ['i'],
      encode: canonical.encodeSraw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'mulw',
    {
      requires: ['m'],
      encode: canonical.encodeMulw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'divw',
    {
      requires: ['m'],
      encode: canonical.encodeDivw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'divuw',
    {
      requires: ['m'],
      encode: canonical.encodeDivuw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'remw',
    {
      requires: ['m'],
      encode: canonical.encodeRemw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'remuw',
    {
      requires: ['m'],
      encode: canonical.encodeRemuw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.l.q',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtLQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.lu.q',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtLuQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.q.l',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtQL,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.q.lu',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtQLu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmvh.x.q',
    {
      requires: ['q'],
      encode: canonical.encodeFmvhXQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmvp.q.x',
    {
      requires: ['q'],
      encode: canonical.encodeFmvpQX,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amocas.q',
    {
      requires: ['zacas'],
      encode: canonical.encodeAmocasQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'add.uw',
    {
      requires: ['zba'],
      encode: canonical.encodeAddUw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sh1add.uw',
    {
      requires: ['zba'],
      encode: canonical.encodeSh1addUw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sh2add.uw',
    {
      requires: ['zba'],
      encode: canonical.encodeSh2addUw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sh3add.uw',
    {
      requires: ['zba'],
      encode: canonical.encodeSh3addUw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'slli.uw',
    {
      requires: ['zba'],
      encode: canonical.encodeSlliUw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'clzw',
    {
      requires: ['zbb'],
      encode: canonical.encodeClzw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'ctzw',
    {
      requires: ['zbb'],
      encode: canonical.encodeCtzw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'cpopw',
    {
      requires: ['zbb'],
      encode: canonical.encodeCpopw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'rolw',
    {
      requires: ['zbb'],
      encode: canonical.encodeRolw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'rorw',
    {
      requires: ['zbb'],
      encode: canonical.encodeRorw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'roriw',
    {
      requires: ['zbb'],
      encode: canonical.encodeRoriw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'rori',
    {
      requires: ['zbb'],
      encode: canonical.encodeRori,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'rev8',
    {
      requires: ['zbb'],
      encode: canonical.encodeRev8,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'packw',
    {
      requires: ['zbkb'],
      encode: canonical.encodePackw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'bclri',
    {
      requires: ['zbs'],
      encode: canonical.encodeBclri,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'bexti',
    {
      requires: ['zbs'],
      encode: canonical.encodeBexti,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'binvi',
    {
      requires: ['zbs'],
      encode: canonical.encodeBinvi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'bseti',
    {
      requires: ['zbs'],
      encode: canonical.encodeBseti,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.zext.w',
    {
      requires: ['zcb'],
      encode: canonical.encodeCZextW,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'fcvt.l.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFcvtLH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.lu.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFcvtLuH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.h.l',
    {
      requires: ['zfh'],
      encode: canonical.encodeFcvtHL,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.h.lu',
    {
      requires: ['zfh'],
      encode: canonical.encodeFcvtHLu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'aes64dsm',
    {
      requires: ['zknd'],
      encode: canonical.encodeAes64dsm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'aes64ds',
    {
      requires: ['zknd'],
      encode: canonical.encodeAes64ds,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'aes64ks1i',
    {
      requires: ['zknd'],
      encode: canonical.encodeAes64ks1i,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'aes64im',
    {
      requires: ['zknd'],
      encode: canonical.encodeAes64im,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'aes64ks2',
    {
      requires: ['zknd'],
      encode: canonical.encodeAes64ks2,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'aes64esm',
    {
      requires: ['zkne'],
      encode: canonical.encodeAes64esm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'aes64es',
    {
      requires: ['zkne'],
      encode: canonical.encodeAes64es,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sha512sum0',
    {
      requires: ['zknh'],
      encode: canonical.encodeSha512sum0,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sha512sum1',
    {
      requires: ['zknh'],
      encode: canonical.encodeSha512sum1,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sha512sig0',
    {
      requires: ['zknh'],
      encode: canonical.encodeSha512sig0,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sha512sig1',
    {
      requires: ['zknh'],
      encode: canonical.encodeSha512sig1,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'lr.w',
    {
      requires: ['a'],
      encode: canonical.encodeLrW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sc.w',
    {
      requires: ['a'],
      encode: canonical.encodeScW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoswap.w',
    {
      requires: ['a'],
      encode: canonical.encodeAmoswapW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoadd.w',
    {
      requires: ['a'],
      encode: canonical.encodeAmoaddW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoxor.w',
    {
      requires: ['a'],
      encode: canonical.encodeAmoxorW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoand.w',
    {
      requires: ['a'],
      encode: canonical.encodeAmoandW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoor.w',
    {
      requires: ['a'],
      encode: canonical.encodeAmoorW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomin.w',
    {
      requires: ['a'],
      encode: canonical.encodeAmominW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomax.w',
    {
      requires: ['a'],
      encode: canonical.encodeAmomaxW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amominu.w',
    {
      requires: ['a'],
      encode: canonical.encodeAmominuW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomaxu.w',
    {
      requires: ['a'],
      encode: canonical.encodeAmomaxuW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.addi4spn',
    {
      requires: ['c'],
      encode: canonical.encodeCAddi4spn,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [2, 9] as const,
              signed: false,
              nonzero: true,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.lw',
    {
      requires: ['c'],
      encode: canonical.encodeCLw,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetLoWord', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetHiWord', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.sw',
    {
      requires: ['c'],
      encode: canonical.encodeCSw,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetLoWord', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetHiWord', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.nop',
    {
      requires: ['c'],
      encode: canonical.encodeCNop,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: [] as const,
          encoderSignature: [
            { type: 'constant', value: 0 },
            { type: 'constant', value: 0 },
          ] as const,
        },
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.addi',
    {
      requires: ['c'],
      encode: canonical.encodeCAddi,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [0, 4] as const,
              signed: true,
            },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [5, 5] as const,
              signed: true,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.li',
    {
      requires: ['c'],
      encode: canonical.encodeCLi,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [0, 4] as const,
              signed: true,
            },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [5, 5] as const,
              signed: true,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.addi16sp',
    {
      requires: ['c'],
      encode: canonical.encodeCAddi16sp,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
        {
          sourceSignature: ['number'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 0, addressPart: 'cStackAdjustHi', relative: false },
            { type: 'address', sourceOperand: 0, addressPart: 'cStackAdjustLo', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.lui',
    {
      requires: ['c'],
      encode: canonical.encodeCLui,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [17, 17] as const,
              signed: true,
              nonzero: true,
            },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [12, 16] as const,
              signed: true,
              nonzero: true,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.andi',
    {
      requires: ['c'],
      encode: canonical.encodeCAndi,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [5, 5] as const,
              signed: true,
            },
            {
              type: 'numberPart',
              sourceOperand: 1,
              bits: [0, 4] as const,
              signed: true,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.sub',
    {
      requires: ['c'],
      encode: canonical.encodeCSub,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.xor',
    {
      requires: ['c'],
      encode: canonical.encodeCXor,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.or',
    {
      requires: ['c'],
      encode: canonical.encodeCOr,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.and',
    {
      requires: ['c'],
      encode: canonical.encodeCAnd,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.j',
    {
      requires: ['c'],
      encode: canonical.encodeCJ,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number'] as const,
          encoderSignature: [{ type: 'number', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'c.beqz',
    {
      requires: ['c'],
      encode: canonical.encodeCBeqz,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            // encodeCBeqz takes the scattered offset fields low then high.
            { type: 'address', sourceOperand: 1, addressPart: 'cBranchOffsetLow', relative: true },
            { type: 'address', sourceOperand: 1, addressPart: 'cBranchOffsetHigh', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.bnez',
    {
      requires: ['c'],
      encode: canonical.encodeCBnez,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            // encodeCBnez takes the scattered offset fields low then high.
            { type: 'address', sourceOperand: 1, addressPart: 'cBranchOffsetLow', relative: true },
            { type: 'address', sourceOperand: 1, addressPart: 'cBranchOffsetHigh', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.lwsp',
    {
      requires: ['c'],
      encode: canonical.encodeCLwsp,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetSpWordHi', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetSpWordLo', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.jr',
    {
      requires: ['c'],
      encode: canonical.encodeCJr,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'c.mv',
    {
      requires: ['c'],
      encode: canonical.encodeCMv,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.ebreak',
    {
      requires: ['c'],
      encode: canonical.encodeCEbreak,
      instructionLength: 2,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'c.jalr',
    {
      requires: ['c'],
      encode: canonical.encodeCJalr,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'c.add',
    {
      requires: ['c'],
      encode: canonical.encodeCAdd,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.swsp',
    {
      requires: ['c'],
      encode: canonical.encodeCSwsp,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetSpWord', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.fld',
    {
      requires: ['d', 'c'],
      encode: canonical.encodeCFld,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetLoDouble', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetHiDouble', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.fsd',
    {
      requires: ['d', 'c'],
      encode: canonical.encodeCFsd,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'register', sourceOperand: 0 },
            // encodeCFsd takes the offset fields low then high, unlike encodeCSd.
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetLoDouble', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetHiDouble', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.fldsp',
    {
      requires: ['d', 'c'],
      encode: canonical.encodeCFldsp,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            {
              type: 'address',
              sourceOperand: 1,
              addressPart: 'cOffsetSpDoubleHi',
              relative: false,
            },
            {
              type: 'address',
              sourceOperand: 1,
              addressPart: 'cOffsetSpDoubleLo',
              relative: false,
            },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.fsdsp',
    {
      requires: ['d', 'c'],
      encode: canonical.encodeCFsdsp,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'cOffsetSpDouble', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'fld',
    {
      requires: ['d'],
      encode: canonical.encodeFld,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsd',
    {
      requires: ['d'],
      encode: canonical.encodeFsd,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmadd.d',
    {
      requires: ['d'],
      encode: canonical.encodeFmaddD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmsub.d',
    {
      requires: ['d'],
      encode: canonical.encodeFmsubD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fnmsub.d',
    {
      requires: ['d'],
      encode: canonical.encodeFnmsubD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fnmadd.d',
    {
      requires: ['d'],
      encode: canonical.encodeFnmaddD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fadd.d',
    {
      requires: ['d'],
      encode: canonical.encodeFaddD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsub.d',
    {
      requires: ['d'],
      encode: canonical.encodeFsubD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmul.d',
    {
      requires: ['d'],
      encode: canonical.encodeFmulD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fdiv.d',
    {
      requires: ['d'],
      encode: canonical.encodeFdivD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsqrt.d',
    {
      requires: ['d'],
      encode: canonical.encodeFsqrtD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnj.d',
    {
      requires: ['d'],
      encode: canonical.encodeFsgnjD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnjn.d',
    {
      requires: ['d'],
      encode: canonical.encodeFsgnjnD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnjx.d',
    {
      requires: ['d'],
      encode: canonical.encodeFsgnjxD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmin.d',
    {
      requires: ['d'],
      encode: canonical.encodeFminD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmax.d',
    {
      requires: ['d'],
      encode: canonical.encodeFmaxD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.s.d',
    {
      requires: ['d'],
      encode: canonical.encodeFcvtSD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.d.s',
    {
      requires: ['d'],
      encode: canonical.encodeFcvtDS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'feq.d',
    {
      requires: ['d'],
      encode: canonical.encodeFeqD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'flt.d',
    {
      requires: ['d'],
      encode: canonical.encodeFltD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fle.d',
    {
      requires: ['d'],
      encode: canonical.encodeFleD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fclass.d',
    {
      requires: ['d'],
      encode: canonical.encodeFclassD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.w.d',
    {
      requires: ['d'],
      encode: canonical.encodeFcvtWD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.wu.d',
    {
      requires: ['d'],
      encode: canonical.encodeFcvtWuD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.d.w',
    {
      requires: ['d'],
      encode: canonical.encodeFcvtDW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.d.wu',
    {
      requires: ['d'],
      encode: canonical.encodeFcvtDWu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fli.d',
    {
      requires: ['d', 'zfa'],
      encode: canonical.encodeFliD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fminm.d',
    {
      requires: ['d', 'zfa'],
      encode: canonical.encodeFminmD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmaxm.d',
    {
      requires: ['d', 'zfa'],
      encode: canonical.encodeFmaxmD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fround.d',
    {
      requires: ['d', 'zfa'],
      encode: canonical.encodeFroundD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'froundnx.d',
    {
      requires: ['d', 'zfa'],
      encode: canonical.encodeFroundnxD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvtmod.w.d',
    {
      requires: ['d', 'zfa'],
      encode: canonical.encodeFcvtmodWD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fleq.d',
    {
      requires: ['d', 'zfa'],
      encode: canonical.encodeFleqD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fltq.d',
    {
      requires: ['d', 'zfa'],
      encode: canonical.encodeFltqD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.d.h',
    {
      requires: ['d', 'zfhmin'],
      encode: canonical.encodeFcvtDH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.h.d',
    {
      requires: ['d', 'zfhmin'],
      encode: canonical.encodeFcvtHD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'flw',
    {
      requires: ['f'],
      encode: canonical.encodeFlw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsw',
    {
      requires: ['f'],
      encode: canonical.encodeFsw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmadd.s',
    {
      requires: ['f'],
      encode: canonical.encodeFmaddS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmsub.s',
    {
      requires: ['f'],
      encode: canonical.encodeFmsubS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fnmsub.s',
    {
      requires: ['f'],
      encode: canonical.encodeFnmsubS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fnmadd.s',
    {
      requires: ['f'],
      encode: canonical.encodeFnmaddS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fadd.s',
    {
      requires: ['f'],
      encode: canonical.encodeFaddS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsub.s',
    {
      requires: ['f'],
      encode: canonical.encodeFsubS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmul.s',
    {
      requires: ['f'],
      encode: canonical.encodeFmulS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fdiv.s',
    {
      requires: ['f'],
      encode: canonical.encodeFdivS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsqrt.s',
    {
      requires: ['f'],
      encode: canonical.encodeFsqrtS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnj.s',
    {
      requires: ['f'],
      encode: canonical.encodeFsgnjS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnjn.s',
    {
      requires: ['f'],
      encode: canonical.encodeFsgnjnS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnjx.s',
    {
      requires: ['f'],
      encode: canonical.encodeFsgnjxS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmin.s',
    {
      requires: ['f'],
      encode: canonical.encodeFminS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmax.s',
    {
      requires: ['f'],
      encode: canonical.encodeFmaxS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.w.s',
    {
      requires: ['f'],
      encode: canonical.encodeFcvtWS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.wu.s',
    {
      requires: ['f'],
      encode: canonical.encodeFcvtWuS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmv.x.w',
    {
      requires: ['f'],
      encode: canonical.encodeFmvXW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'feq.s',
    {
      requires: ['f'],
      encode: canonical.encodeFeqS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'flt.s',
    {
      requires: ['f'],
      encode: canonical.encodeFltS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fle.s',
    {
      requires: ['f'],
      encode: canonical.encodeFleS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fclass.s',
    {
      requires: ['f'],
      encode: canonical.encodeFclassS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.s.w',
    {
      requires: ['f'],
      encode: canonical.encodeFcvtSW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.s.wu',
    {
      requires: ['f'],
      encode: canonical.encodeFcvtSWu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmv.w.x',
    {
      requires: ['f'],
      encode: canonical.encodeFmvWX,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fli.s',
    {
      requires: ['f', 'zfa'],
      encode: canonical.encodeFliS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fminm.s',
    {
      requires: ['f', 'zfa'],
      encode: canonical.encodeFminmS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmaxm.s',
    {
      requires: ['f', 'zfa'],
      encode: canonical.encodeFmaxmS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fround.s',
    {
      requires: ['f', 'zfa'],
      encode: canonical.encodeFroundS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'froundnx.s',
    {
      requires: ['f', 'zfa'],
      encode: canonical.encodeFroundnxS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fleq.s',
    {
      requires: ['f', 'zfa'],
      encode: canonical.encodeFleqS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fltq.s',
    {
      requires: ['f', 'zfa'],
      encode: canonical.encodeFltqS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hfence.vvma',
    {
      requires: ['h'],
      encode: canonical.encodeHfenceVvma,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hfence.gvma',
    {
      requires: ['h'],
      encode: canonical.encodeHfenceGvma,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hlv.b',
    {
      requires: ['h'],
      encode: canonical.encodeHlvB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hlv.bu',
    {
      requires: ['h'],
      encode: canonical.encodeHlvBu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hlv.h',
    {
      requires: ['h'],
      encode: canonical.encodeHlvH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hlv.hu',
    {
      requires: ['h'],
      encode: canonical.encodeHlvHu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hlvx.hu',
    {
      requires: ['h'],
      encode: canonical.encodeHlvxHu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hlv.w',
    {
      requires: ['h'],
      encode: canonical.encodeHlvW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hlvx.wu',
    {
      requires: ['h'],
      encode: canonical.encodeHlvxWu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hsv.b',
    {
      requires: ['h'],
      encode: canonical.encodeHsvB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hsv.h',
    {
      requires: ['h'],
      encode: canonical.encodeHsvH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hsv.w',
    {
      requires: ['h'],
      encode: canonical.encodeHsvW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'lui',
    {
      requires: ['i'],
      encode: canonical.encodeLui,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'auipc',
    {
      requires: ['i'],
      encode: canonical.encodeAuipc,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'jal',
    {
      requires: ['i'],
      encode: canonical.encodeJal,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['address'] as const,
          encoderSignature: [
            { type: 'constant', value: 1 },
            { type: 'address', sourceOperand: 0, addressPart: 'jumpOffset', relative: true },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'jumpOffset', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'jalr',
    {
      requires: ['i'],
      encode: canonical.encodeJalr,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [
            { type: 'constant', value: 1 },
            { type: 'register', sourceOperand: 0 },
            { type: 'constant', value: 0 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'offset', relative: false },
          ] as const,
        },
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'beq',
    {
      requires: ['i'],
      encode: canonical.encodeBeq,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bne',
    {
      requires: ['i'],
      encode: canonical.encodeBne,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'blt',
    {
      requires: ['i'],
      encode: canonical.encodeBlt,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bge',
    {
      requires: ['i'],
      encode: canonical.encodeBge,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bltu',
    {
      requires: ['i'],
      encode: canonical.encodeBltu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bgeu',
    {
      requires: ['i'],
      encode: canonical.encodeBgeu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'lb',
    {
      requires: ['i'],
      encode: canonical.encodeLb,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'offset', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'lh',
    {
      requires: ['i'],
      encode: canonical.encodeLh,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'offset', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'lw',
    {
      requires: ['i'],
      encode: canonical.encodeLw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'offset', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'lbu',
    {
      requires: ['i'],
      encode: canonical.encodeLbu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'offset', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'lhu',
    {
      requires: ['i'],
      encode: canonical.encodeLhu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'offset', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'sb',
    {
      requires: ['i'],
      encode: canonical.encodeSb,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 1, addressPart: 'offsetHigh', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'offsetLow', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'sh',
    {
      requires: ['i'],
      encode: canonical.encodeSh,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 1, addressPart: 'offsetHigh', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'offsetLow', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'sw',
    {
      requires: ['i'],
      encode: canonical.encodeSw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 1, addressPart: 'offsetHigh', relative: false },
            { type: 'address', sourceOperand: 1, addressPart: 'base', relative: false },
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'offsetLow', relative: false },
          ] as const,
        },
      ],
    },
  ],
  [
    'addi',
    {
      requires: ['i'],
      encode: canonical.encodeAddi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'slti',
    {
      requires: ['i'],
      encode: canonical.encodeSlti,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sltiu',
    {
      requires: ['i'],
      encode: canonical.encodeSltiu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'xori',
    {
      requires: ['i'],
      encode: canonical.encodeXori,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'ori',
    {
      requires: ['i'],
      encode: canonical.encodeOri,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'andi',
    {
      requires: ['i'],
      encode: canonical.encodeAndi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'add',
    {
      requires: ['i'],
      encode: canonical.encodeAdd,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sub',
    {
      requires: ['i'],
      encode: canonical.encodeSub,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sll',
    {
      requires: ['i'],
      encode: canonical.encodeSll,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'slt',
    {
      requires: ['i'],
      encode: canonical.encodeSlt,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sltu',
    {
      requires: ['i'],
      encode: canonical.encodeSltu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'xor',
    {
      requires: ['i'],
      encode: canonical.encodeXor,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'srl',
    {
      requires: ['i'],
      encode: canonical.encodeSrl,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sra',
    {
      requires: ['i'],
      encode: canonical.encodeSra,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'or',
    {
      requires: ['i'],
      encode: canonical.encodeOr,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'and',
    {
      requires: ['i'],
      encode: canonical.encodeAnd,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fence',
    {
      requires: ['i'],
      encode: canonical.encodeFence,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: [] as const,
          encoderSignature: [
            { type: 'constant', value: 0 },
            { type: 'constant', value: 15 },
            { type: 'constant', value: 15 },
            { type: 'constant', value: 0 },
            { type: 'constant', value: 0 },
          ] as const,
        },
      ],
    },
  ],
  [
    'ecall',
    {
      requires: ['i'],
      encode: canonical.encodeEcall,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'ebreak',
    {
      requires: ['i'],
      encode: canonical.encodeEbreak,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'mul',
    {
      requires: ['m'],
      encode: canonical.encodeMul,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'mulh',
    {
      requires: ['m'],
      encode: canonical.encodeMulh,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'mulhsu',
    {
      requires: ['m'],
      encode: canonical.encodeMulhsu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'mulhu',
    {
      requires: ['m'],
      encode: canonical.encodeMulhu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'div',
    {
      requires: ['m'],
      encode: canonical.encodeDiv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'divu',
    {
      requires: ['m'],
      encode: canonical.encodeDivu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'rem',
    {
      requires: ['m'],
      encode: canonical.encodeRem,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'remu',
    {
      requires: ['m'],
      encode: canonical.encodeRemu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'flq',
    {
      requires: ['q'],
      encode: canonical.encodeFlq,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsq',
    {
      requires: ['q'],
      encode: canonical.encodeFsq,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmadd.q',
    {
      requires: ['q'],
      encode: canonical.encodeFmaddQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmsub.q',
    {
      requires: ['q'],
      encode: canonical.encodeFmsubQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fnmsub.q',
    {
      requires: ['q'],
      encode: canonical.encodeFnmsubQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fnmadd.q',
    {
      requires: ['q'],
      encode: canonical.encodeFnmaddQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fadd.q',
    {
      requires: ['q'],
      encode: canonical.encodeFaddQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsub.q',
    {
      requires: ['q'],
      encode: canonical.encodeFsubQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmul.q',
    {
      requires: ['q'],
      encode: canonical.encodeFmulQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fdiv.q',
    {
      requires: ['q'],
      encode: canonical.encodeFdivQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsqrt.q',
    {
      requires: ['q'],
      encode: canonical.encodeFsqrtQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnj.q',
    {
      requires: ['q'],
      encode: canonical.encodeFsgnjQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnjn.q',
    {
      requires: ['q'],
      encode: canonical.encodeFsgnjnQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnjx.q',
    {
      requires: ['q'],
      encode: canonical.encodeFsgnjxQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmin.q',
    {
      requires: ['q'],
      encode: canonical.encodeFminQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmax.q',
    {
      requires: ['q'],
      encode: canonical.encodeFmaxQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.s.q',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtSQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.q.s',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtQS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.d.q',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtDQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.q.d',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtQD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'feq.q',
    {
      requires: ['q'],
      encode: canonical.encodeFeqQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'flt.q',
    {
      requires: ['q'],
      encode: canonical.encodeFltQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fle.q',
    {
      requires: ['q'],
      encode: canonical.encodeFleQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fclass.q',
    {
      requires: ['q'],
      encode: canonical.encodeFclassQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.w.q',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtWQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.wu.q',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtWuQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.q.w',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtQW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.q.wu',
    {
      requires: ['q'],
      encode: canonical.encodeFcvtQWu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fli.q',
    {
      requires: ['q', 'zfa'],
      encode: canonical.encodeFliQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fminm.q',
    {
      requires: ['q', 'zfa'],
      encode: canonical.encodeFminmQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmaxm.q',
    {
      requires: ['q', 'zfa'],
      encode: canonical.encodeFmaxmQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fround.q',
    {
      requires: ['q', 'zfa'],
      encode: canonical.encodeFroundQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'froundnx.q',
    {
      requires: ['q', 'zfa'],
      encode: canonical.encodeFroundnxQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fleq.q',
    {
      requires: ['q', 'zfa'],
      encode: canonical.encodeFleqQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fltq.q',
    {
      requires: ['q', 'zfa'],
      encode: canonical.encodeFltqQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.q.h',
    {
      requires: ['q', 'zfhmin'],
      encode: canonical.encodeFcvtQH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.h.q',
    {
      requires: ['q', 'zfhmin'],
      encode: canonical.encodeFcvtHQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sfence.vma',
    {
      requires: ['s'],
      encode: canonical.encodeSfenceVma,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: [] as const,
          encoderSignature: [
            { type: 'constant', value: 0 },
            { type: 'constant', value: 0 },
          ] as const,
        },
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'constant', value: 0 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sret',
    {
      requires: ['s'],
      encode: canonical.encodeSret,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'dret',
    {
      requires: ['sdext'],
      encode: canonical.encodeDret,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'mnret',
    {
      requires: ['smrnmi'],
      encode: canonical.encodeMnret,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'sctrclr',
    {
      requires: ['ssctr'],
      encode: canonical.encodeSctrclr,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'sinval.vma',
    {
      requires: ['svinval'],
      encode: canonical.encodeSinvalVma,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sfence.w.inval',
    {
      requires: ['svinval'],
      encode: canonical.encodeSfenceWInval,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'sfence.inval.ir',
    {
      requires: ['svinval'],
      encode: canonical.encodeSfenceInvalIr,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'hinval.vvma',
    {
      requires: ['svinval', 'h'],
      encode: canonical.encodeHinvalVvma,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'hinval.gvma',
    {
      requires: ['svinval', 'h'],
      encode: canonical.encodeHinvalGvma,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'mret',
    {
      requires: ['system'],
      encode: canonical.encodeMret,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'wfi',
    {
      requires: ['system'],
      encode: canonical.encodeWfi,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'vsetivli',
    {
      requires: ['v'],
      encode: canonical.encodeVsetivli,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsetvli',
    {
      requires: ['v'],
      encode: canonical.encodeVsetvli,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsetvl',
    {
      requires: ['v'],
      encode: canonical.encodeVsetvl,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vlm.v',
    {
      requires: ['v'],
      encode: canonical.encodeVlmV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsm.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsmV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vle8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVle8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vle16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVle16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vle32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVle32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vle64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVle64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vse8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVse8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vse16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVse16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vse32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVse32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vse64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVse64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vluxei8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVluxei8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vluxei16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVluxei16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vluxei32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVluxei32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vluxei64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVluxei64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsuxei8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsuxei8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsuxei16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsuxei16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsuxei32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsuxei32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsuxei64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsuxei64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vlse8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVlse8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vlse16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVlse16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vlse32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVlse32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vlse64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVlse64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsse8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsse8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsse16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsse16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsse32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsse32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsse64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsse64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vloxei8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVloxei8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vloxei16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVloxei16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vloxei32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVloxei32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vloxei64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVloxei64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsoxei8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsoxei8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsoxei16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsoxei16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsoxei32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsoxei32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsoxei64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVsoxei64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vle8ff.v',
    {
      requires: ['v'],
      encode: canonical.encodeVle8ffV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vle16ff.v',
    {
      requires: ['v'],
      encode: canonical.encodeVle16ffV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vle32ff.v',
    {
      requires: ['v'],
      encode: canonical.encodeVle32ffV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vle64ff.v',
    {
      requires: ['v'],
      encode: canonical.encodeVle64ffV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl1re8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl1re8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl1re16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl1re16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl1re32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl1re32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl1re64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl1re64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl2re8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl2re8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl2re16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl2re16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl2re32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl2re32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl2re64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl2re64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl4re8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl4re8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl4re16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl4re16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl4re32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl4re32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl4re64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl4re64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl8re8.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl8re8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl8re16.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl8re16V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl8re32.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl8re32V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl8re64.v',
    {
      requires: ['v'],
      encode: canonical.encodeVl8re64V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vs1r.v',
    {
      requires: ['v'],
      encode: canonical.encodeVs1rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vs2r.v',
    {
      requires: ['v'],
      encode: canonical.encodeVs2rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vs4r.v',
    {
      requires: ['v'],
      encode: canonical.encodeVs4rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vs8r.v',
    {
      requires: ['v'],
      encode: canonical.encodeVs8rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfadd.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfaddVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfsub.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfsubVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmin.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfminVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmax.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfmaxVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfsgnj.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfsgnjVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfsgnjn.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfsgnjnVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfsgnjx.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfsgnjxVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfslide1up.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfslide1upVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfslide1down.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfslide1downVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmv.s.f',
    {
      requires: ['v'],
      encode: canonical.encodeVfmvSF,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmerge.vfm',
    {
      requires: ['v'],
      encode: canonical.encodeVfmergeVfm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmv.v.f',
    {
      requires: ['v'],
      encode: canonical.encodeVfmvVF,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmfeq.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVmfeqVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmfle.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVmfleVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmflt.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVmfltVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmfne.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVmfneVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmfgt.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVmfgtVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmfge.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVmfgeVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfdiv.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfdivVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfrdiv.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfrdivVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmul.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfmulVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfrsub.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfrsubVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmadd.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfmaddVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfnmadd.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfnmaddVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmsub.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfmsubVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfnmsub.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfnmsubVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmacc.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfmaccVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfnmacc.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfnmaccVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmsac.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfmsacVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfnmsac.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfnmsacVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwadd.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfwaddVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwsub.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfwsubVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwadd.wf',
    {
      requires: ['v'],
      encode: canonical.encodeVfwaddWf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwsub.wf',
    {
      requires: ['v'],
      encode: canonical.encodeVfwsubWf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwmul.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfwmulVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwmacc.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfwmaccVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwnmacc.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfwnmaccVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwmsac.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfwmsacVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwnmsac.vf',
    {
      requires: ['v'],
      encode: canonical.encodeVfwnmsacVf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfadd.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfaddVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfredusum.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVfredusumVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfsub.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfsubVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfredosum.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVfredosumVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmin.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfminVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfredmin.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVfredminVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmax.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfmaxVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfredmax.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVfredmaxVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfsgnj.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfsgnjVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfsgnjn.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfsgnjnVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfsgnjx.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfsgnjxVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmv.f.s',
    {
      requires: ['v'],
      encode: canonical.encodeVfmvFS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmfeq.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmfeqVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmfle.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmfleVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmflt.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmfltVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmfne.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmfneVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfdiv.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfdivVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmul.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfmulVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmadd.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfmaddVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfnmadd.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfnmaddVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmsub.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfmsubVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfnmsub.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfnmsubVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmacc.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfmaccVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfnmacc.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfnmaccVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfmsac.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfmsacVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfnmsac.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfnmsacVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfcvt.xu.f.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfcvtXuFV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfcvt.x.f.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfcvtXFV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfcvt.f.xu.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfcvtFXuV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfcvt.f.x.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfcvtFXV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfcvt.rtz.xu.f.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfcvtRtzXuFV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfcvt.rtz.x.f.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfcvtRtzXFV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwcvt.xu.f.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfwcvtXuFV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwcvt.x.f.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfwcvtXFV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwcvt.f.xu.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfwcvtFXuV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwcvt.f.x.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfwcvtFXV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwcvt.f.f.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfwcvtFFV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwcvt.rtz.xu.f.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfwcvtRtzXuFV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwcvt.rtz.x.f.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfwcvtRtzXFV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfncvt.xu.f.w',
    {
      requires: ['v'],
      encode: canonical.encodeVfncvtXuFW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfncvt.x.f.w',
    {
      requires: ['v'],
      encode: canonical.encodeVfncvtXFW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfncvt.f.xu.w',
    {
      requires: ['v'],
      encode: canonical.encodeVfncvtFXuW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfncvt.f.x.w',
    {
      requires: ['v'],
      encode: canonical.encodeVfncvtFXW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfncvt.f.f.w',
    {
      requires: ['v'],
      encode: canonical.encodeVfncvtFFW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfncvt.rod.f.f.w',
    {
      requires: ['v'],
      encode: canonical.encodeVfncvtRodFFW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfncvt.rtz.xu.f.w',
    {
      requires: ['v'],
      encode: canonical.encodeVfncvtRtzXuFW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfncvt.rtz.x.f.w',
    {
      requires: ['v'],
      encode: canonical.encodeVfncvtRtzXFW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfsqrt.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfsqrtV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfrsqrt7.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfrsqrt7V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfrec7.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfrec7V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfclass.v',
    {
      requires: ['v'],
      encode: canonical.encodeVfclassV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwadd.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfwaddVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwredusum.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVfwredusumVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwsub.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfwsubVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwredosum.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVfwredosumVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwadd.wv',
    {
      requires: ['v'],
      encode: canonical.encodeVfwaddWv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwsub.wv',
    {
      requires: ['v'],
      encode: canonical.encodeVfwsubWv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwmul.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfwmulVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwmacc.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfwmaccVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwnmacc.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfwnmaccVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwmsac.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfwmsacVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwnmsac.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVfwnmsacVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vadd.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVaddVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsub.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVsubVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrsub.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVrsubVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vminu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVminuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmin.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVminVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmaxu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmaxuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmax.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmaxVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vand.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVandVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vor.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVorVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vxor.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVxorVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrgather.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVrgatherVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vslideup.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVslideupVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vslidedown.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVslidedownVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vadc.vxm',
    {
      requires: ['v'],
      encode: canonical.encodeVadcVxm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmadc.vxm',
    {
      requires: ['v'],
      encode: canonical.encodeVmadcVxm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmadc.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmadcVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsbc.vxm',
    {
      requires: ['v'],
      encode: canonical.encodeVsbcVxm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsbc.vxm',
    {
      requires: ['v'],
      encode: canonical.encodeVmsbcVxm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsbc.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmsbcVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmerge.vxm',
    {
      requires: ['v'],
      encode: canonical.encodeVmergeVxm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmv.v.x',
    {
      requires: ['v'],
      encode: canonical.encodeVmvVX,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmseq.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmseqVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsne.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmsneVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsltu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmsltuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmslt.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmsltVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsleu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmsleuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsle.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmsleVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsgtu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmsgtuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsgt.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmsgtVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsaddu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVsadduVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsadd.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVsaddVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vssubu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVssubuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vssub.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVssubVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsll.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVsllVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsmul.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVsmulVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsrl.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVsrlVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsra.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVsraVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vssrl.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVssrlVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vssra.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVssraVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnsrl.wx',
    {
      requires: ['v'],
      encode: canonical.encodeVnsrlWx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnsra.wx',
    {
      requires: ['v'],
      encode: canonical.encodeVnsraWx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnclipu.wx',
    {
      requires: ['v'],
      encode: canonical.encodeVnclipuWx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnclip.wx',
    {
      requires: ['v'],
      encode: canonical.encodeVnclipWx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vadd.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVaddVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsub.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVsubVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vminu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVminuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmin.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVminVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmaxu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmaxuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmax.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmaxVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vand.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVandVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vor.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVorVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vxor.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVxorVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrgather.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVrgatherVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrgatherei16.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVrgatherei16Vv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vadc.vvm',
    {
      requires: ['v'],
      encode: canonical.encodeVadcVvm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmadc.vvm',
    {
      requires: ['v'],
      encode: canonical.encodeVmadcVvm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmadc.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmadcVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsbc.vvm',
    {
      requires: ['v'],
      encode: canonical.encodeVsbcVvm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsbc.vvm',
    {
      requires: ['v'],
      encode: canonical.encodeVmsbcVvm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsbc.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmsbcVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmerge.vvm',
    {
      requires: ['v'],
      encode: canonical.encodeVmergeVvm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmv.v.v',
    {
      requires: ['v'],
      encode: canonical.encodeVmvVV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmseq.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmseqVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsne.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmsneVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsltu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmsltuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmslt.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmsltVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsleu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmsleuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsle.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmsleVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsaddu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVsadduVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsadd.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVsaddVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vssubu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVssubuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vssub.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVssubVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsll.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVsllVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsmul.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVsmulVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsrl.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVsrlVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsra.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVsraVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vssrl.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVssrlVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vssra.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVssraVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnsrl.wv',
    {
      requires: ['v'],
      encode: canonical.encodeVnsrlWv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnsra.wv',
    {
      requires: ['v'],
      encode: canonical.encodeVnsraWv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnclipu.wv',
    {
      requires: ['v'],
      encode: canonical.encodeVnclipuWv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnclip.wv',
    {
      requires: ['v'],
      encode: canonical.encodeVnclipWv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwredsumu.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVwredsumuVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwredsum.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVwredsumVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vadd.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVaddVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrsub.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVrsubVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vand.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVandVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vor.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVorVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vxor.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVxorVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrgather.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVrgatherVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vslideup.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVslideupVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vslidedown.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVslidedownVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vadc.vim',
    {
      requires: ['v'],
      encode: canonical.encodeVadcVim,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmadc.vim',
    {
      requires: ['v'],
      encode: canonical.encodeVmadcVim,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmadc.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVmadcVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmerge.vim',
    {
      requires: ['v'],
      encode: canonical.encodeVmergeVim,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmv.v.i',
    {
      requires: ['v'],
      encode: canonical.encodeVmvVI,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmseq.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVmseqVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsne.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVmsneVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsleu.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVmsleuVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsle.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVmsleVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsgtu.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVmsgtuVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsgt.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVmsgtVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsaddu.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVsadduVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsadd.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVsaddVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsll.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVsllVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmv1r.v',
    {
      requires: ['v'],
      encode: canonical.encodeVmv1rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmv2r.v',
    {
      requires: ['v'],
      encode: canonical.encodeVmv2rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmv4r.v',
    {
      requires: ['v'],
      encode: canonical.encodeVmv4rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmv8r.v',
    {
      requires: ['v'],
      encode: canonical.encodeVmv8rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsrl.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVsrlVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsra.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVsraVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vssrl.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVssrlVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vssra.vi',
    {
      requires: ['v'],
      encode: canonical.encodeVssraVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnsrl.wi',
    {
      requires: ['v'],
      encode: canonical.encodeVnsrlWi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnsra.wi',
    {
      requires: ['v'],
      encode: canonical.encodeVnsraWi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnclipu.wi',
    {
      requires: ['v'],
      encode: canonical.encodeVnclipuWi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnclip.wi',
    {
      requires: ['v'],
      encode: canonical.encodeVnclipWi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vredsum.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVredsumVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vredand.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVredandVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vredor.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVredorVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vredxor.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVredxorVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vredminu.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVredminuVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vredmin.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVredminVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vredmaxu.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVredmaxuVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vredmax.vs',
    {
      requires: ['v'],
      encode: canonical.encodeVredmaxVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaaddu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVaadduVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaadd.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVaaddVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vasubu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVasubuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vasub.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVasubVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmv.x.s',
    {
      requires: ['v'],
      encode: canonical.encodeVmvXS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vzext.vf8',
    {
      requires: ['v'],
      encode: canonical.encodeVzextVf8,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsext.vf8',
    {
      requires: ['v'],
      encode: canonical.encodeVsextVf8,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vzext.vf4',
    {
      requires: ['v'],
      encode: canonical.encodeVzextVf4,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsext.vf4',
    {
      requires: ['v'],
      encode: canonical.encodeVsextVf4,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vzext.vf2',
    {
      requires: ['v'],
      encode: canonical.encodeVzextVf2,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsext.vf2',
    {
      requires: ['v'],
      encode: canonical.encodeVsextVf2,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vcompress.vm',
    {
      requires: ['v'],
      encode: canonical.encodeVcompressVm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmandn.mm',
    {
      requires: ['v'],
      encode: canonical.encodeVmandnMm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmand.mm',
    {
      requires: ['v'],
      encode: canonical.encodeVmandMm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmor.mm',
    {
      requires: ['v'],
      encode: canonical.encodeVmorMm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmxor.mm',
    {
      requires: ['v'],
      encode: canonical.encodeVmxorMm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmorn.mm',
    {
      requires: ['v'],
      encode: canonical.encodeVmornMm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmnand.mm',
    {
      requires: ['v'],
      encode: canonical.encodeVmnandMm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmnor.mm',
    {
      requires: ['v'],
      encode: canonical.encodeVmnorMm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmxnor.mm',
    {
      requires: ['v'],
      encode: canonical.encodeVmxnorMm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsbf.m',
    {
      requires: ['v'],
      encode: canonical.encodeVmsbfM,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsof.m',
    {
      requires: ['v'],
      encode: canonical.encodeVmsofM,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsif.m',
    {
      requires: ['v'],
      encode: canonical.encodeVmsifM,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'viota.m',
    {
      requires: ['v'],
      encode: canonical.encodeViotaM,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vid.v',
    {
      requires: ['v'],
      encode: canonical.encodeVidV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vcpop.m',
    {
      requires: ['v'],
      encode: canonical.encodeVcpopM,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfirst.m',
    {
      requires: ['v'],
      encode: canonical.encodeVfirstM,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vdivu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVdivuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vdiv.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVdivVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vremu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVremuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrem.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVremVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmulhu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmulhuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmul.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmulVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmulhsu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmulhsuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmulh.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmulhVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmadd.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmaddVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnmsub.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVnmsubVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmacc.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVmaccVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnmsac.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVnmsacVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwaddu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVwadduVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwadd.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVwaddVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsubu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVwsubuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsub.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVwsubVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwaddu.wv',
    {
      requires: ['v'],
      encode: canonical.encodeVwadduWv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwadd.wv',
    {
      requires: ['v'],
      encode: canonical.encodeVwaddWv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsubu.wv',
    {
      requires: ['v'],
      encode: canonical.encodeVwsubuWv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsub.wv',
    {
      requires: ['v'],
      encode: canonical.encodeVwsubWv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmulu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVwmuluVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmulsu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVwmulsuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmul.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVwmulVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmaccu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVwmaccuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmacc.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVwmaccVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmaccsu.vv',
    {
      requires: ['v'],
      encode: canonical.encodeVwmaccsuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaaddu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVaadduVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaadd.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVaaddVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vasubu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVasubuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vasub.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVasubVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmv.s.x',
    {
      requires: ['v'],
      encode: canonical.encodeVmvSX,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vslide1up.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVslide1upVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vslide1down.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVslide1downVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vdivu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVdivuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vdiv.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVdivVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vremu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVremuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrem.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVremVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmulhu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmulhuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmul.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmulVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmulhsu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmulhsuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmulh.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmulhVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmadd.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmaddVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnmsub.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVnmsubVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmacc.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVmaccVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnmsac.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVnmsacVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwaddu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwadduVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwadd.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwaddVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsubu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwsubuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsub.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwsubVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwaddu.wx',
    {
      requires: ['v'],
      encode: canonical.encodeVwadduWx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwadd.wx',
    {
      requires: ['v'],
      encode: canonical.encodeVwaddWx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsubu.wx',
    {
      requires: ['v'],
      encode: canonical.encodeVwsubuWx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsub.wx',
    {
      requires: ['v'],
      encode: canonical.encodeVwsubWx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmulu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwmuluVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmulsu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwmulsuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmul.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwmulVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmaccu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwmaccuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmacc.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwmaccVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmaccus.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwmaccusVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwmaccsu.vx',
    {
      requires: ['v'],
      encode: canonical.encodeVwmaccsuVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoswap.b',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmoswapB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoadd.b',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmoaddB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoxor.b',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmoxorB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoand.b',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmoandB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoor.b',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmoorB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomin.b',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmominB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomax.b',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmomaxB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amominu.b',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmominuB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomaxu.b',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmomaxuB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoswap.h',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmoswapH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoadd.h',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmoaddH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoxor.h',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmoxorH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoand.h',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmoandH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amoor.h',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmoorH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomin.h',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmominH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomax.h',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmomaxH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amominu.h',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmominuH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amomaxu.h',
    {
      requires: ['zabha'],
      encode: canonical.encodeAmomaxuH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amocas.b',
    {
      requires: ['zabha', 'zacas'],
      encode: canonical.encodeAmocasB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amocas.h',
    {
      requires: ['zabha', 'zacas'],
      encode: canonical.encodeAmocasH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amocas.w',
    {
      requires: ['zacas'],
      encode: canonical.encodeAmocasW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'amocas.d',
    {
      requires: ['zacas'],
      encode: canonical.encodeAmocasD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'lb.aq',
    {
      requires: ['zalasr'],
      encode: canonical.encodeLbAq,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'lh.aq',
    {
      requires: ['zalasr'],
      encode: canonical.encodeLhAq,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'lw.aq',
    {
      requires: ['zalasr'],
      encode: canonical.encodeLwAq,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'ld.aq',
    {
      requires: ['zalasr'],
      encode: canonical.encodeLdAq,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sb.rl',
    {
      requires: ['zalasr'],
      encode: canonical.encodeSbRl,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sh.rl',
    {
      requires: ['zalasr'],
      encode: canonical.encodeShRl,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sw.rl',
    {
      requires: ['zalasr'],
      encode: canonical.encodeSwRl,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sd.rl',
    {
      requires: ['zalasr'],
      encode: canonical.encodeSdRl,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'wrs.nto',
    {
      requires: ['zawrs'],
      encode: canonical.encodeWrsNto,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'wrs.sto',
    {
      requires: ['zawrs'],
      encode: canonical.encodeWrsSto,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'sh1add',
    {
      requires: ['zba'],
      encode: canonical.encodeSh1add,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sh2add',
    {
      requires: ['zba'],
      encode: canonical.encodeSh2add,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sh3add',
    {
      requires: ['zba'],
      encode: canonical.encodeSh3add,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'andn',
    {
      requires: ['zbb'],
      encode: canonical.encodeAndn,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'orn',
    {
      requires: ['zbb'],
      encode: canonical.encodeOrn,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'xnor',
    {
      requires: ['zbb'],
      encode: canonical.encodeXnor,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'clz',
    {
      requires: ['zbb'],
      encode: canonical.encodeClz,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'ctz',
    {
      requires: ['zbb'],
      encode: canonical.encodeCtz,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'cpop',
    {
      requires: ['zbb'],
      encode: canonical.encodeCpop,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'max',
    {
      requires: ['zbb'],
      encode: canonical.encodeMax,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'maxu',
    {
      requires: ['zbb'],
      encode: canonical.encodeMaxu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'min',
    {
      requires: ['zbb'],
      encode: canonical.encodeMin,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'minu',
    {
      requires: ['zbb'],
      encode: canonical.encodeMinu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sext.b',
    {
      requires: ['zbb'],
      encode: canonical.encodeSextB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sext.h',
    {
      requires: ['zbb'],
      encode: canonical.encodeSextH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'rol',
    {
      requires: ['zbb'],
      encode: canonical.encodeRol,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'ror',
    {
      requires: ['zbb'],
      encode: canonical.encodeRor,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'orc.b',
    {
      requires: ['zbb'],
      encode: canonical.encodeOrcB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'clmul',
    {
      requires: ['zbc'],
      encode: canonical.encodeClmul,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'clmulr',
    {
      requires: ['zbc'],
      encode: canonical.encodeClmulr,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'clmulh',
    {
      requires: ['zbc'],
      encode: canonical.encodeClmulh,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'pack',
    {
      requires: ['zbkb'],
      encode: canonical.encodePack,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'packh',
    {
      requires: ['zbkb'],
      encode: canonical.encodePackh,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'brev8',
    {
      requires: ['zbkb'],
      encode: canonical.encodeBrev8,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'xperm4',
    {
      requires: ['zbkx'],
      encode: canonical.encodeXperm4,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'xperm8',
    {
      requires: ['zbkx'],
      encode: canonical.encodeXperm8,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'bclr',
    {
      requires: ['zbs'],
      encode: canonical.encodeBclr,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'bext',
    {
      requires: ['zbs'],
      encode: canonical.encodeBext,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'binv',
    {
      requires: ['zbs'],
      encode: canonical.encodeBinv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'bset',
    {
      requires: ['zbs'],
      encode: canonical.encodeBset,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.lbu',
    {
      requires: ['zcb'],
      encode: canonical.encodeCLbu,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.lhu',
    {
      requires: ['zcb'],
      encode: canonical.encodeCLhu,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.lh',
    {
      requires: ['zcb'],
      encode: canonical.encodeCLh,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.sb',
    {
      requires: ['zcb'],
      encode: canonical.encodeCSb,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.sh',
    {
      requires: ['zcb'],
      encode: canonical.encodeCSh,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.zext.b',
    {
      requires: ['zcb'],
      encode: canonical.encodeCZextB,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'c.sext.b',
    {
      requires: ['zcb'],
      encode: canonical.encodeCSextB,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'c.zext.h',
    {
      requires: ['zcb'],
      encode: canonical.encodeCZextH,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'c.sext.h',
    {
      requires: ['zcb'],
      encode: canonical.encodeCSextH,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'c.not',
    {
      requires: ['zcb'],
      encode: canonical.encodeCNot,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'c.mul',
    {
      requires: ['zcb'],
      encode: canonical.encodeCMul,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'c.mop.N',
    {
      requires: ['zcmop'],
      encode: canonical.encodeCMopN,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number'] as const,
          encoderSignature: [{ type: 'number', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'cm.push',
    {
      requires: ['zcmp'],
      encode: canonical.encodeCmPush,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'cm.pop',
    {
      requires: ['zcmp'],
      encode: canonical.encodeCmPop,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'cm.popretz',
    {
      requires: ['zcmp'],
      encode: canonical.encodeCmPopretz,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'cm.popret',
    {
      requires: ['zcmp'],
      encode: canonical.encodeCmPopret,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'cm.mvsa01',
    {
      requires: ['zcmp'],
      encode: canonical.encodeCmMvsa01,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'cm.mva01s',
    {
      requires: ['zcmp'],
      encode: canonical.encodeCmMva01s,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'cm.jalt',
    {
      requires: ['zcmt'],
      encode: canonical.encodeCmJalt,
      instructionLength: 2,
      signatures: [
        {
          sourceSignature: ['number'] as const,
          encoderSignature: [{ type: 'number', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'fcvt.bf16.s',
    {
      requires: ['zfbfmin'],
      encode: canonical.encodeFcvtBf16S,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.s.bf16',
    {
      requires: ['zfbfmin'],
      encode: canonical.encodeFcvtSBf16,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmadd.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFmaddH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmsub.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFmsubH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fnmsub.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFnmsubH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fnmadd.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFnmaddH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fadd.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFaddH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsub.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFsubH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmul.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFmulH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fdiv.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFdivH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsqrt.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFsqrtH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnj.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFsgnjH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnjn.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFsgnjnH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsgnjx.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFsgnjxH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmin.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFminH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmax.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFmaxH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'feq.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFeqH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'flt.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFltH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fle.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFleH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fclass.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFclassH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.w.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFcvtWH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.wu.h',
    {
      requires: ['zfh'],
      encode: canonical.encodeFcvtWuH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.h.w',
    {
      requires: ['zfh'],
      encode: canonical.encodeFcvtHW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.h.wu',
    {
      requires: ['zfh'],
      encode: canonical.encodeFcvtHWu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fli.h',
    {
      requires: ['zfh', 'zfa'],
      encode: canonical.encodeFliH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fminm.h',
    {
      requires: ['zfh', 'zfa'],
      encode: canonical.encodeFminmH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmaxm.h',
    {
      requires: ['zfh', 'zfa'],
      encode: canonical.encodeFmaxmH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fround.h',
    {
      requires: ['zfh', 'zfa'],
      encode: canonical.encodeFroundH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'froundnx.h',
    {
      requires: ['zfh', 'zfa'],
      encode: canonical.encodeFroundnxH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fleq.h',
    {
      requires: ['zfh', 'zfa'],
      encode: canonical.encodeFleqH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fltq.h',
    {
      requires: ['zfh', 'zfa'],
      encode: canonical.encodeFltqH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'flh',
    {
      requires: ['zfhmin'],
      encode: canonical.encodeFlh,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsh',
    {
      requires: ['zfhmin'],
      encode: canonical.encodeFsh,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.s.h',
    {
      requires: ['zfhmin'],
      encode: canonical.encodeFcvtSH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fcvt.h.s',
    {
      requires: ['zfhmin'],
      encode: canonical.encodeFcvtHS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmv.x.h',
    {
      requires: ['zfhmin'],
      encode: canonical.encodeFmvXH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmv.h.x',
    {
      requires: ['zfhmin'],
      encode: canonical.encodeFmvHX,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'cbo.clean',
    {
      requires: ['zicbo'],
      encode: canonical.encodeCboClean,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'cbo.flush',
    {
      requires: ['zicbo'],
      encode: canonical.encodeCboFlush,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'cbo.inval',
    {
      requires: ['zicbo'],
      encode: canonical.encodeCboInval,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'cbo.zero',
    {
      requires: ['zicbo'],
      encode: canonical.encodeCboZero,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'ssamoswap.w',
    {
      requires: ['zicfiss'],
      encode: canonical.encodeSsamoswapW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'ssamoswap.d',
    {
      requires: ['zicfiss'],
      encode: canonical.encodeSsamoswapD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'number', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'czero.eqz',
    {
      requires: ['zicond'],
      encode: canonical.encodeCzeroEqz,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'czero.nez',
    {
      requires: ['zicond'],
      encode: canonical.encodeCzeroNez,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrrw',
    {
      requires: ['zicsr'],
      encode: canonical.encodeCsrrw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrrs',
    {
      requires: ['zicsr'],
      encode: canonical.encodeCsrrs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrrc',
    {
      requires: ['zicsr'],
      encode: canonical.encodeCsrrc,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrrwi',
    {
      requires: ['zicsr'],
      encode: canonical.encodeCsrrwi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrrsi',
    {
      requires: ['zicsr'],
      encode: canonical.encodeCsrrsi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrrci',
    {
      requires: ['zicsr'],
      encode: canonical.encodeCsrrci,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fence.i',
    {
      requires: ['zifencei'],
      encode: canonical.encodeFenceI,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: [] as const,
          encoderSignature: [
            { type: 'constant', value: 0 },
            { type: 'constant', value: 0 },
            { type: 'constant', value: 0 },
          ] as const,
        },
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'mop.r.N',
    {
      requires: ['zimop'],
      encode: canonical.encodeMopRN,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'mop.rr.N',
    {
      requires: ['zimop'],
      encode: canonical.encodeMopRrN,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sha256sum0',
    {
      requires: ['zknh'],
      encode: canonical.encodeSha256sum0,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sha256sum1',
    {
      requires: ['zknh'],
      encode: canonical.encodeSha256sum1,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sha256sig0',
    {
      requires: ['zknh'],
      encode: canonical.encodeSha256sig0,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sha256sig1',
    {
      requires: ['zknh'],
      encode: canonical.encodeSha256sig1,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sm4ed',
    {
      requires: ['zksed'],
      encode: canonical.encodeSm4ed,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sm4ks',
    {
      requires: ['zksed'],
      encode: canonical.encodeSm4ks,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sm3p0',
    {
      requires: ['zksh'],
      encode: canonical.encodeSm3p0,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sm3p1',
    {
      requires: ['zksh'],
      encode: canonical.encodeSm3p1,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vandn.vv',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVandnVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vandn.vx',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVandnVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vbrev.v',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVbrevV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vbrev8.v',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVbrev8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrev8.v',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVrev8V,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vclz.v',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVclzV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vctz.v',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVctzV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vcpop.v',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVcpopV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrol.vv',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVrolVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vrol.vx',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVrolVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vror.vv',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVrorVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vror.vx',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVrorVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vror.vi',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVrorVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
            { type: 'register', sourceOperand: 4 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsll.vv',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVwsllVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsll.vx',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVwsllVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwsll.vi',
    {
      requires: ['zvbb'],
      encode: canonical.encodeVwsllVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vclmul.vv',
    {
      requires: ['zvbc'],
      encode: canonical.encodeVclmulVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vclmul.vx',
    {
      requires: ['zvbc'],
      encode: canonical.encodeVclmulVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vclmulh.vv',
    {
      requires: ['zvbc'],
      encode: canonical.encodeVclmulhVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vclmulh.vx',
    {
      requires: ['zvbc'],
      encode: canonical.encodeVclmulhVx,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfncvtbf16.f.f.w',
    {
      requires: ['zvfbfmin'],
      encode: canonical.encodeVfncvtbf16FFW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwcvtbf16.f.f.v',
    {
      requires: ['zvfbfmin'],
      encode: canonical.encodeVfwcvtbf16FFV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwmaccbf16.vv',
    {
      requires: ['zvfbfwma'],
      encode: canonical.encodeVfwmaccbf16Vv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfwmaccbf16.vf',
    {
      requires: ['zvfbfwma'],
      encode: canonical.encodeVfwmaccbf16Vf,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
            { type: 'register', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vgmul.vv',
    {
      requires: ['zvkg'],
      encode: canonical.encodeVgmulVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vghsh.vv',
    {
      requires: ['zvkg'],
      encode: canonical.encodeVghshVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaesdf.vv',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaesdfVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaesdf.vs',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaesdfVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaesdm.vv',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaesdmVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaesdm.vs',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaesdmVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaesef.vv',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaesefVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaesef.vs',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaesefVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaesem.vv',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaesemVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaesem.vs',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaesemVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaesz.vs',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaeszVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaeskf1.vi',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaeskf1Vi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vaeskf2.vi',
    {
      requires: ['zvkned'],
      encode: canonical.encodeVaeskf2Vi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsha2ms.vv',
    {
      requires: ['zvknha'],
      encode: canonical.encodeVsha2msVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsha2ch.vv',
    {
      requires: ['zvknha'],
      encode: canonical.encodeVsha2chVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsha2cl.vv',
    {
      requires: ['zvknha'],
      encode: canonical.encodeVsha2clVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsm4k.vi',
    {
      requires: ['zvksed'],
      encode: canonical.encodeVsm4kVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsm4r.vv',
    {
      requires: ['zvksed'],
      encode: canonical.encodeVsm4rVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsm4r.vs',
    {
      requires: ['zvksed'],
      encode: canonical.encodeVsm4rVs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsm3c.vi',
    {
      requires: ['zvksh'],
      encode: canonical.encodeVsm3cVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vsm3me.vv',
    {
      requires: ['zvksh'],
      encode: canonical.encodeVsm3meVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'nop',
    {
      requires: ['i'],
      encode: pseudo.encodeNop,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'mv',
    {
      requires: ['i'],
      encode: pseudo.encodeMv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'not',
    {
      requires: ['i'],
      encode: pseudo.encodeNot,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'neg',
    {
      requires: ['i'],
      encode: pseudo.encodeNeg,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'negw',
    {
      requires: ['i'],
      encode: pseudo.encodeNegw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sext.w',
    {
      requires: ['i'],
      encode: pseudo.encodeSextW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'zext.b',
    {
      requires: ['i'],
      encode: pseudo.encodeZextB,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'zext.h',
    {
      requires: ['zbkb'],
      encode: pseudo.encodeZextH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'zext.w',
    {
      requires: ['zba'],
      encode: pseudo.encodeZextW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'seqz',
    {
      requires: ['i'],
      encode: pseudo.encodeSeqz,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'snez',
    {
      requires: ['i'],
      encode: pseudo.encodeSnez,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sltz',
    {
      requires: ['i'],
      encode: pseudo.encodeSltz,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sgtz',
    {
      requires: ['i'],
      encode: pseudo.encodeSgtz,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sgt',
    {
      requires: ['i'],
      encode: pseudo.encodeSgt,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'sgtu',
    {
      requires: ['i'],
      encode: pseudo.encodeSgtu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'li',
    {
      requires: ['i'],
      encode: pseudo.encodeLi,
      instructionLength: (_rd: number, value: number | bigint): number =>
        BigInt(value) >= -2048n && BigInt(value) <= 2047n ? 4 : 44,
      signatures: [
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'la',
    {
      requires: ['i'],
      encode: pseudo.encodeLa,
      instructionLength: 8,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'generatedLabel', sourceOperand: 1 },
            { type: 'number', sourceOperand: 1, relocationType: relocations.R_RISCV_PCREL_HI20 },
            { type: 'number', sourceOperand: 1, relocationType: relocations.R_RISCV_PCREL_LO12_I },
          ] as const,
        },
      ],
    },
  ],
  [
    'lla',
    {
      requires: ['i'],
      encode: pseudo.encodeLla,
      instructionLength: 8,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'lga',
    {
      requires: ['i'],
      encode: pseudo.encodeLga,
      instructionLength: 8,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'call',
    {
      requires: ['i'],
      encode: pseudo.encodeCall,
      instructionLength: 8,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
        {
          sourceSignature: ['address'] as const,
          encoderSignature: [
            { type: 'constant', value: 1 },
            { type: 'generatedLabel', sourceOperand: 0 },
            { type: 'number', sourceOperand: 0, relocationType: relocations.R_RISCV_PCREL_HI20 },
            { type: 'number', sourceOperand: 0, relocationType: relocations.R_RISCV_PCREL_LO12_I },
          ] as const,
        },
      ],
    },
  ],
  [
    'tail',
    {
      requires: ['i'],
      encode: pseudo.encodeTail,
      instructionLength: 8,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
        {
          sourceSignature: ['address'] as const,
          encoderSignature: [
            { type: 'generatedLabel', sourceOperand: 0 },
            { type: 'number', sourceOperand: 0, relocationType: relocations.R_RISCV_PCREL_HI20 },
            { type: 'number', sourceOperand: 0, relocationType: relocations.R_RISCV_PCREL_LO12_I },
          ] as const,
        },
      ],
    },
  ],
  [
    'jump',
    {
      requires: ['i'],
      encode: pseudo.encodeJump,
      instructionLength: 8,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'j',
    {
      requires: ['i'],
      encode: pseudo.encodeJ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['address'] as const,
          encoderSignature: [
            { type: 'address', sourceOperand: 0, addressPart: 'jumpOffset', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'ret',
    {
      requires: ['i'],
      encode: pseudo.encodeRet,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'jr',
    {
      requires: ['i'],
      encode: pseudo.encodeJr,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'beqz',
    {
      requires: ['i'],
      encode: pseudo.encodeBeqz,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bnez',
    {
      requires: ['i'],
      encode: pseudo.encodeBnez,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'blez',
    {
      requires: ['i'],
      encode: pseudo.encodeBlez,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bgez',
    {
      requires: ['i'],
      encode: pseudo.encodeBgez,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bltz',
    {
      requires: ['i'],
      encode: pseudo.encodeBltz,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bgtz',
    {
      requires: ['i'],
      encode: pseudo.encodeBgtz,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'address', sourceOperand: 1, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bgt',
    {
      requires: ['i'],
      encode: pseudo.encodeBgt,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'ble',
    {
      requires: ['i'],
      encode: pseudo.encodeBle,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bgtu',
    {
      requires: ['i'],
      encode: pseudo.encodeBgtu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'bleu',
    {
      requires: ['i'],
      encode: pseudo.encodeBleu,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'address'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetHigh', relative: true },
            { type: 'address', sourceOperand: 2, addressPart: 'branchOffsetLow', relative: true },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmv.h',
    {
      requires: ['zfh'],
      encode: pseudo.encodeFmvH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmv.s',
    {
      requires: ['f'],
      encode: pseudo.encodeFmvS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmv.d',
    {
      requires: ['d'],
      encode: pseudo.encodeFmvD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fmv.q',
    {
      requires: ['q'],
      encode: pseudo.encodeFmvQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fabs.h',
    {
      requires: ['zfh'],
      encode: pseudo.encodeFabsH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fabs.s',
    {
      requires: ['f'],
      encode: pseudo.encodeFabsS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fabs.d',
    {
      requires: ['d'],
      encode: pseudo.encodeFabsD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fabs.q',
    {
      requires: ['q'],
      encode: pseudo.encodeFabsQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fneg.h',
    {
      requires: ['zfh'],
      encode: pseudo.encodeFnegH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fneg.s',
    {
      requires: ['f'],
      encode: pseudo.encodeFnegS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fneg.d',
    {
      requires: ['d'],
      encode: pseudo.encodeFnegD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fneg.q',
    {
      requires: ['q'],
      encode: pseudo.encodeFnegQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fgt.h',
    {
      requires: ['zfh'],
      encode: pseudo.encodeFgtH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fge.h',
    {
      requires: ['zfh'],
      encode: pseudo.encodeFgeH,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fgt.s',
    {
      requires: ['f'],
      encode: pseudo.encodeFgtS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fge.s',
    {
      requires: ['f'],
      encode: pseudo.encodeFgeS,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fgt.d',
    {
      requires: ['d'],
      encode: pseudo.encodeFgtD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fge.d',
    {
      requires: ['d'],
      encode: pseudo.encodeFgeD,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fgt.q',
    {
      requires: ['q'],
      encode: pseudo.encodeFgtQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fge.q',
    {
      requires: ['q'],
      encode: pseudo.encodeFgeQ,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'register', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'pause',
    {
      requires: ['i'],
      encode: pseudo.encodePause,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'rdcycle',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeRdcycle,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'rdcycleh',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeRdcycleh,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'rdtime',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeRdtime,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'rdtimeh',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeRdtimeh,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'rdinstret',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeRdinstret,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'rdinstreth',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeRdinstreth,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'csrr',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeCsrr,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrw',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeCsrw,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrs',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeCsrs,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrc',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeCsrc,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'register'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrwi',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeCsrwi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrsi',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeCsrsi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'csrci',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeCsrci,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['number', 'number'] as const,
          encoderSignature: [
            { type: 'number', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'frcsr',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeFrcsr,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'fscsr',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeFscsr,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'frrm',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeFrrm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'fsrm',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeFsrm,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsrmi',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeFsrmi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'frflags',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeFrflags,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'fsflags',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeFsflags,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'fsflagsi',
    {
      requires: ['zicsr'],
      encode: pseudo.encodeFsflagsi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfneg.v',
    {
      requires: ['v'],
      encode: pseudo.encodeVfnegV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vfabs.v',
    {
      requires: ['v'],
      encode: pseudo.encodeVfabsV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmclr.m',
    {
      requires: ['v'],
      encode: pseudo.encodeVmclrM,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'vmfge.vv',
    {
      requires: ['v'],
      encode: pseudo.encodeVmfgeVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmfgt.vv',
    {
      requires: ['v'],
      encode: pseudo.encodeVmfgtVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmmv.m',
    {
      requires: ['v'],
      encode: pseudo.encodeVmmvM,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmnot.m',
    {
      requires: ['v'],
      encode: pseudo.encodeVmnotM,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmset.m',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsetM,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register'] as const,
          encoderSignature: [{ type: 'register', sourceOperand: 0 }] as const,
        },
      ],
    },
  ],
  [
    'vmsge.vi',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsgeVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsgeu.vi',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsgeuVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsge.vv',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsgeVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsgeu.vv',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsgeuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsgt.vv',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsgtVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsgtu.vv',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsgtuVv,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmslt.vi',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsltVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsltu.vi',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsltuVi,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
            { type: 'number', sourceOperand: 3 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vneg.v',
    {
      requires: ['v'],
      encode: pseudo.encodeVnegV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vnot.v',
    {
      requires: ['v'],
      encode: pseudo.encodeVnotV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vncvt.x.x.w',
    {
      requires: ['v'],
      encode: pseudo.encodeVncvtXXW,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwcvt.x.x.v',
    {
      requires: ['v'],
      encode: pseudo.encodeVwcvtXXV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vwcvtu.x.x.v',
    {
      requires: ['v'],
      encode: pseudo.encodeVwcvtuXXV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl1r.v',
    {
      requires: ['v'],
      encode: pseudo.encodeVl1rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl2r.v',
    {
      requires: ['v'],
      encode: pseudo.encodeVl2rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl4r.v',
    {
      requires: ['v'],
      encode: pseudo.encodeVl4rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vl8r.v',
    {
      requires: ['v'],
      encode: pseudo.encodeVl8rV,
      instructionLength: 4,
      signatures: [
        {
          sourceSignature: ['register', 'register'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'register', sourceOperand: 1 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsge.vx',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsgeVx,
      instructionLength: 8,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
  [
    'vmsgeu.vx',
    {
      requires: ['v'],
      encode: pseudo.encodeVmsgeuVx,
      instructionLength: 8,
      signatures: [
        {
          sourceSignature: ['register', 'number', 'number'] as const,
          encoderSignature: [
            { type: 'register', sourceOperand: 0 },
            { type: 'number', sourceOperand: 1 },
            { type: 'number', sourceOperand: 2 },
          ] as const,
        },
      ],
    },
  ],
]);

export default INSTRUCTION_MAP;
