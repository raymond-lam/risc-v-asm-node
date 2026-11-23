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
// Exact signatures are authoritative for flat-supported mnemonics.
// Unsupported entries use mechanical field-level metadata derived from encoder
// parameter names.  Register parameters start with rd/rs/rt/frd/frs/fs1/fs2/fd/vd/vs;
// all others are treated as numbers.

const INSTRUCTION_MAP: ReadonlyMap<
  string,
  Readonly<{
    readonly encode: (...args: number[]) => Uint8Array;
    readonly instructionLength: number | ((rd: number, value: number | bigint) => number);
    readonly signatures: readonly InstructionSignature[];
  }>
> = new Map([
  [
    'lr.d',
    {
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
      ],
    },
  ],
  [
    'c.sd',
    {
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
      ],
    },
  ],
  [
    'c.addiw',
    {
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
      ],
    },
  ],
  [
    'c.srli',
    {
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
      ],
    },
  ],
  [
    'c.srai',
    {
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
      ],
    },
  ],
  [
    'c.subw',
    {
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
      ],
    },
  ],
  [
    'c.ldsp',
    {
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
      ],
    },
  ],
  [
    'c.sdsp',
    {
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
      ],
    },
  ],
  [
    'fcvt.l.d',
    {
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
      encode: canonical.encodeCAddi4spn,
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
    'c.lw',
    {
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
      ],
    },
  ],
  [
    'c.sw',
    {
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
      ],
    },
  ],
  [
    'c.nop',
    {
      encode: canonical.encodeCNop,
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
    'c.addi',
    {
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
      ],
    },
  ],
  [
    'c.li',
    {
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
      ],
    },
  ],
  [
    'c.addi16sp',
    {
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
      ],
    },
  ],
  [
    'c.lui',
    {
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
      ],
    },
  ],
  [
    'c.andi',
    {
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
      ],
    },
  ],
  [
    'c.sub',
    {
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
      ],
    },
  ],
  [
    'c.bnez',
    {
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
      ],
    },
  ],
  [
    'c.lwsp',
    {
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
      ],
    },
  ],
  [
    'c.jr',
    {
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
      encode: canonical.encodeCEbreak,
      instructionLength: 2,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'c.jalr',
    {
      encode: canonical.encodeCJalr,
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
    'c.add',
    {
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
      ],
    },
  ],
  [
    'c.fld',
    {
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
      ],
    },
  ],
  [
    'c.fsd',
    {
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
      ],
    },
  ],
  [
    'c.fldsp',
    {
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
      ],
    },
  ],
  [
    'c.fsdsp',
    {
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
      ],
    },
  ],
  [
    'fld',
    {
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
      encode: canonical.encodeEcall,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'ebreak',
    {
      encode: canonical.encodeEbreak,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'mul',
    {
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
      encode: canonical.encodeSfenceVma,
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
    'sret',
    {
      encode: canonical.encodeSret,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'dret',
    {
      encode: canonical.encodeDret,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'mnret',
    {
      encode: canonical.encodeMnret,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'sctrclr',
    {
      encode: canonical.encodeSctrclr,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'sinval.vma',
    {
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
      encode: canonical.encodeSfenceWInval,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'sfence.inval.ir',
    {
      encode: canonical.encodeSfenceInvalIr,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'hinval.vvma',
    {
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
      encode: canonical.encodeMret,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'wfi',
    {
      encode: canonical.encodeWfi,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'vsetivli',
    {
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
      encode: canonical.encodeWrsNto,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'wrs.sto',
    {
      encode: canonical.encodeWrsSto,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'sh1add',
    {
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
      encode: canonical.encodeFenceI,
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
    'mop.r.N',
    {
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
      encode: pseudo.encodeNop,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'mv',
    {
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
      ],
    },
  ],
  [
    'lla',
    {
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
      ],
    },
  ],
  [
    'tail',
    {
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
      ],
    },
  ],
  [
    'jump',
    {
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
      encode: pseudo.encodeRet,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'jr',
    {
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
      encode: pseudo.encodePause,
      instructionLength: 4,
      signatures: [{ sourceSignature: [] as const, encoderSignature: [] as const }],
    },
  ],
  [
    'rdcycle',
    {
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
