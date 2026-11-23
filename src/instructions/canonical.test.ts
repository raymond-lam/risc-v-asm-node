import assert from 'node:assert/strict';
import test from 'node:test';

import {
  encodeLrD,
  encodeScD,
  encodeAmoswapD,
  encodeAmoaddD,
  encodeAmoxorD,
  encodeAmoandD,
  encodeAmoorD,
  encodeAmominD,
  encodeAmomaxD,
  encodeAmominuD,
  encodeAmomaxuD,
  encodeCLd,
  encodeCSd,
  encodeCAddiw,
  encodeCSrli,
  encodeCSrai,
  encodeCSubw,
  encodeCAddw,
  encodeCSlli,
  encodeCLdsp,
  encodeCSdsp,
  encodeFcvtLD,
  encodeFcvtLuD,
  encodeFmvXD,
  encodeFcvtDL,
  encodeFcvtDLu,
  encodeFmvDX,
  encodeFcvtLS,
  encodeFcvtLuS,
  encodeFcvtSL,
  encodeFcvtSLu,
  encodeHlvWu,
  encodeHlvD,
  encodeHsvD,
  encodeLwu,
  encodeLd,
  encodeSd,
  encodeSlli,
  encodeSrli,
  encodeSrai,
  encodeAddiw,
  encodeSlliw,
  encodeSrliw,
  encodeSraiw,
  encodeAddw,
  encodeSubw,
  encodeSllw,
  encodeSrlw,
  encodeSraw,
  encodeMulw,
  encodeDivw,
  encodeDivuw,
  encodeRemw,
  encodeRemuw,
  encodeFcvtLQ,
  encodeFcvtLuQ,
  encodeFcvtQL,
  encodeFcvtQLu,
  encodeFmvhXQ,
  encodeFmvpQX,
  encodeAmocasQ,
  encodeAddUw,
  encodeSh1addUw,
  encodeSh2addUw,
  encodeSh3addUw,
  encodeSlliUw,
  encodeClzw,
  encodeCtzw,
  encodeCpopw,
  encodeRolw,
  encodeRorw,
  encodeRoriw,
  encodeRori,
  encodeRev8,
  encodePackw,
  encodeBclri,
  encodeBexti,
  encodeBinvi,
  encodeBseti,
  encodeCZextW,
  encodeFcvtLH,
  encodeFcvtLuH,
  encodeFcvtHL,
  encodeFcvtHLu,
  encodeAes64dsm,
  encodeAes64ds,
  encodeAes64ks1i,
  encodeAes64im,
  encodeAes64ks2,
  encodeAes64esm,
  encodeAes64es,
  encodeSha512sum0,
  encodeSha512sum1,
  encodeSha512sig0,
  encodeSha512sig1,
  encodeLrW,
  encodeScW,
  encodeAmoswapW,
  encodeAmoaddW,
  encodeAmoxorW,
  encodeAmoandW,
  encodeAmoorW,
  encodeAmominW,
  encodeAmomaxW,
  encodeAmominuW,
  encodeAmomaxuW,
  encodeCAddi4spn,
  encodeCLw,
  encodeCSw,
  encodeCNop,
  encodeCAddi,
  encodeCLi,
  encodeCAddi16sp,
  encodeCLui,
  encodeCAndi,
  encodeCSub,
  encodeCXor,
  encodeCOr,
  encodeCAnd,
  encodeCJ,
  encodeCBeqz,
  encodeCBnez,
  encodeCLwsp,
  encodeCJr,
  encodeCMv,
  encodeCEbreak,
  encodeCJalr,
  encodeCAdd,
  encodeCSwsp,
  encodeCFld,
  encodeCFsd,
  encodeCFldsp,
  encodeCFsdsp,
  encodeFld,
  encodeFsd,
  encodeFmaddD,
  encodeFmsubD,
  encodeFnmsubD,
  encodeFnmaddD,
  encodeFaddD,
  encodeFsubD,
  encodeFmulD,
  encodeFdivD,
  encodeFsqrtD,
  encodeFsgnjD,
  encodeFsgnjnD,
  encodeFsgnjxD,
  encodeFminD,
  encodeFmaxD,
  encodeFcvtSD,
  encodeFcvtDS,
  encodeFeqD,
  encodeFltD,
  encodeFleD,
  encodeFclassD,
  encodeFcvtWD,
  encodeFcvtWuD,
  encodeFcvtDW,
  encodeFcvtDWu,
  encodeFliD,
  encodeFminmD,
  encodeFmaxmD,
  encodeFroundD,
  encodeFroundnxD,
  encodeFcvtmodWD,
  encodeFleqD,
  encodeFltqD,
  encodeFcvtDH,
  encodeFcvtHD,
  encodeFlw,
  encodeFsw,
  encodeFmaddS,
  encodeFmsubS,
  encodeFnmsubS,
  encodeFnmaddS,
  encodeFaddS,
  encodeFsubS,
  encodeFmulS,
  encodeFdivS,
  encodeFsqrtS,
  encodeFsgnjS,
  encodeFsgnjnS,
  encodeFsgnjxS,
  encodeFminS,
  encodeFmaxS,
  encodeFcvtWS,
  encodeFcvtWuS,
  encodeFmvXW,
  encodeFeqS,
  encodeFltS,
  encodeFleS,
  encodeFclassS,
  encodeFcvtSW,
  encodeFcvtSWu,
  encodeFmvWX,
  encodeFliS,
  encodeFminmS,
  encodeFmaxmS,
  encodeFroundS,
  encodeFroundnxS,
  encodeFleqS,
  encodeFltqS,
  encodeHfenceVvma,
  encodeHfenceGvma,
  encodeHlvB,
  encodeHlvBu,
  encodeHlvH,
  encodeHlvHu,
  encodeHlvxHu,
  encodeHlvW,
  encodeHlvxWu,
  encodeHsvB,
  encodeHsvH,
  encodeHsvW,
  encodeLui,
  encodeAuipc,
  encodeJal,
  encodeJalr,
  encodeBeq,
  encodeBne,
  encodeBlt,
  encodeBge,
  encodeBltu,
  encodeBgeu,
  encodeLb,
  encodeLh,
  encodeLw,
  encodeLbu,
  encodeLhu,
  encodeSb,
  encodeSh,
  encodeSw,
  encodeAddi,
  encodeSlti,
  encodeSltiu,
  encodeXori,
  encodeOri,
  encodeAndi,
  encodeAdd,
  encodeSub,
  encodeSll,
  encodeSlt,
  encodeSltu,
  encodeXor,
  encodeSrl,
  encodeSra,
  encodeOr,
  encodeAnd,
  encodeFence,
  encodeEcall,
  encodeEbreak,
  encodeMul,
  encodeMulh,
  encodeMulhsu,
  encodeMulhu,
  encodeDiv,
  encodeDivu,
  encodeRem,
  encodeRemu,
  encodeFlq,
  encodeFsq,
  encodeFmaddQ,
  encodeFmsubQ,
  encodeFnmsubQ,
  encodeFnmaddQ,
  encodeFaddQ,
  encodeFsubQ,
  encodeFmulQ,
  encodeFdivQ,
  encodeFsqrtQ,
  encodeFsgnjQ,
  encodeFsgnjnQ,
  encodeFsgnjxQ,
  encodeFminQ,
  encodeFmaxQ,
  encodeFcvtSQ,
  encodeFcvtQS,
  encodeFcvtDQ,
  encodeFcvtQD,
  encodeFeqQ,
  encodeFltQ,
  encodeFleQ,
  encodeFclassQ,
  encodeFcvtWQ,
  encodeFcvtWuQ,
  encodeFcvtQW,
  encodeFcvtQWu,
  encodeFliQ,
  encodeFminmQ,
  encodeFmaxmQ,
  encodeFroundQ,
  encodeFroundnxQ,
  encodeFleqQ,
  encodeFltqQ,
  encodeFcvtQH,
  encodeFcvtHQ,
  encodeSfenceVma,
  encodeSret,
  encodeDret,
  encodeMnret,
  encodeSctrclr,
  encodeSinvalVma,
  encodeSfenceWInval,
  encodeSfenceInvalIr,
  encodeHinvalVvma,
  encodeHinvalGvma,
  encodeMret,
  encodeWfi,
  encodeVsetivli,
  encodeVsetvli,
  encodeVsetvl,
  encodeVlmV,
  encodeVsmV,
  encodeVle8V,
  encodeVle16V,
  encodeVle32V,
  encodeVle64V,
  encodeVse8V,
  encodeVse16V,
  encodeVse32V,
  encodeVse64V,
  encodeVluxei8V,
  encodeVluxei16V,
  encodeVluxei32V,
  encodeVluxei64V,
  encodeVsuxei8V,
  encodeVsuxei16V,
  encodeVsuxei32V,
  encodeVsuxei64V,
  encodeVlse8V,
  encodeVlse16V,
  encodeVlse32V,
  encodeVlse64V,
  encodeVsse8V,
  encodeVsse16V,
  encodeVsse32V,
  encodeVsse64V,
  encodeVloxei8V,
  encodeVloxei16V,
  encodeVloxei32V,
  encodeVloxei64V,
  encodeVsoxei8V,
  encodeVsoxei16V,
  encodeVsoxei32V,
  encodeVsoxei64V,
  encodeVle8ffV,
  encodeVle16ffV,
  encodeVle32ffV,
  encodeVle64ffV,
  encodeVl1re8V,
  encodeVl1re16V,
  encodeVl1re32V,
  encodeVl1re64V,
  encodeVl2re8V,
  encodeVl2re16V,
  encodeVl2re32V,
  encodeVl2re64V,
  encodeVl4re8V,
  encodeVl4re16V,
  encodeVl4re32V,
  encodeVl4re64V,
  encodeVl8re8V,
  encodeVl8re16V,
  encodeVl8re32V,
  encodeVl8re64V,
  encodeVs1rV,
  encodeVs2rV,
  encodeVs4rV,
  encodeVs8rV,
  encodeVfaddVf,
  encodeVfsubVf,
  encodeVfminVf,
  encodeVfmaxVf,
  encodeVfsgnjVf,
  encodeVfsgnjnVf,
  encodeVfsgnjxVf,
  encodeVfslide1upVf,
  encodeVfslide1downVf,
  encodeVfmvSF,
  encodeVfmergeVfm,
  encodeVfmvVF,
  encodeVmfeqVf,
  encodeVmfleVf,
  encodeVmfltVf,
  encodeVmfneVf,
  encodeVmfgtVf,
  encodeVmfgeVf,
  encodeVfdivVf,
  encodeVfrdivVf,
  encodeVfmulVf,
  encodeVfrsubVf,
  encodeVfmaddVf,
  encodeVfnmaddVf,
  encodeVfmsubVf,
  encodeVfnmsubVf,
  encodeVfmaccVf,
  encodeVfnmaccVf,
  encodeVfmsacVf,
  encodeVfnmsacVf,
  encodeVfwaddVf,
  encodeVfwsubVf,
  encodeVfwaddWf,
  encodeVfwsubWf,
  encodeVfwmulVf,
  encodeVfwmaccVf,
  encodeVfwnmaccVf,
  encodeVfwmsacVf,
  encodeVfwnmsacVf,
  encodeVfaddVv,
  encodeVfredusumVs,
  encodeVfsubVv,
  encodeVfredosumVs,
  encodeVfminVv,
  encodeVfredminVs,
  encodeVfmaxVv,
  encodeVfredmaxVs,
  encodeVfsgnjVv,
  encodeVfsgnjnVv,
  encodeVfsgnjxVv,
  encodeVfmvFS,
  encodeVmfeqVv,
  encodeVmfleVv,
  encodeVmfltVv,
  encodeVmfneVv,
  encodeVfdivVv,
  encodeVfmulVv,
  encodeVfmaddVv,
  encodeVfnmaddVv,
  encodeVfmsubVv,
  encodeVfnmsubVv,
  encodeVfmaccVv,
  encodeVfnmaccVv,
  encodeVfmsacVv,
  encodeVfnmsacVv,
  encodeVfcvtXuFV,
  encodeVfcvtXFV,
  encodeVfcvtFXuV,
  encodeVfcvtFXV,
  encodeVfcvtRtzXuFV,
  encodeVfcvtRtzXFV,
  encodeVfwcvtXuFV,
  encodeVfwcvtXFV,
  encodeVfwcvtFXuV,
  encodeVfwcvtFXV,
  encodeVfwcvtFFV,
  encodeVfwcvtRtzXuFV,
  encodeVfwcvtRtzXFV,
  encodeVfncvtXuFW,
  encodeVfncvtXFW,
  encodeVfncvtFXuW,
  encodeVfncvtFXW,
  encodeVfncvtFFW,
  encodeVfncvtRodFFW,
  encodeVfncvtRtzXuFW,
  encodeVfncvtRtzXFW,
  encodeVfsqrtV,
  encodeVfrsqrt7V,
  encodeVfrec7V,
  encodeVfclassV,
  encodeVfwaddVv,
  encodeVfwredusumVs,
  encodeVfwsubVv,
  encodeVfwredosumVs,
  encodeVfwaddWv,
  encodeVfwsubWv,
  encodeVfwmulVv,
  encodeVfwmaccVv,
  encodeVfwnmaccVv,
  encodeVfwmsacVv,
  encodeVfwnmsacVv,
  encodeVaddVx,
  encodeVsubVx,
  encodeVrsubVx,
  encodeVminuVx,
  encodeVminVx,
  encodeVmaxuVx,
  encodeVmaxVx,
  encodeVandVx,
  encodeVorVx,
  encodeVxorVx,
  encodeVrgatherVx,
  encodeVslideupVx,
  encodeVslidedownVx,
  encodeVadcVxm,
  encodeVmadcVxm,
  encodeVmadcVx,
  encodeVsbcVxm,
  encodeVmsbcVxm,
  encodeVmsbcVx,
  encodeVmergeVxm,
  encodeVmvVX,
  encodeVmseqVx,
  encodeVmsneVx,
  encodeVmsltuVx,
  encodeVmsltVx,
  encodeVmsleuVx,
  encodeVmsleVx,
  encodeVmsgtuVx,
  encodeVmsgtVx,
  encodeVsadduVx,
  encodeVsaddVx,
  encodeVssubuVx,
  encodeVssubVx,
  encodeVsllVx,
  encodeVsmulVx,
  encodeVsrlVx,
  encodeVsraVx,
  encodeVssrlVx,
  encodeVssraVx,
  encodeVnsrlWx,
  encodeVnsraWx,
  encodeVnclipuWx,
  encodeVnclipWx,
  encodeVaddVv,
  encodeVsubVv,
  encodeVminuVv,
  encodeVminVv,
  encodeVmaxuVv,
  encodeVmaxVv,
  encodeVandVv,
  encodeVorVv,
  encodeVxorVv,
  encodeVrgatherVv,
  encodeVrgatherei16Vv,
  encodeVadcVvm,
  encodeVmadcVvm,
  encodeVmadcVv,
  encodeVsbcVvm,
  encodeVmsbcVvm,
  encodeVmsbcVv,
  encodeVmergeVvm,
  encodeVmvVV,
  encodeVmseqVv,
  encodeVmsneVv,
  encodeVmsltuVv,
  encodeVmsltVv,
  encodeVmsleuVv,
  encodeVmsleVv,
  encodeVsadduVv,
  encodeVsaddVv,
  encodeVssubuVv,
  encodeVssubVv,
  encodeVsllVv,
  encodeVsmulVv,
  encodeVsrlVv,
  encodeVsraVv,
  encodeVssrlVv,
  encodeVssraVv,
  encodeVnsrlWv,
  encodeVnsraWv,
  encodeVnclipuWv,
  encodeVnclipWv,
  encodeVwredsumuVs,
  encodeVwredsumVs,
  encodeVaddVi,
  encodeVrsubVi,
  encodeVandVi,
  encodeVorVi,
  encodeVxorVi,
  encodeVrgatherVi,
  encodeVslideupVi,
  encodeVslidedownVi,
  encodeVadcVim,
  encodeVmadcVim,
  encodeVmadcVi,
  encodeVmergeVim,
  encodeVmvVI,
  encodeVmseqVi,
  encodeVmsneVi,
  encodeVmsleuVi,
  encodeVmsleVi,
  encodeVmsgtuVi,
  encodeVmsgtVi,
  encodeVsadduVi,
  encodeVsaddVi,
  encodeVsllVi,
  encodeVmv1rV,
  encodeVmv2rV,
  encodeVmv4rV,
  encodeVmv8rV,
  encodeVsrlVi,
  encodeVsraVi,
  encodeVssrlVi,
  encodeVssraVi,
  encodeVnsrlWi,
  encodeVnsraWi,
  encodeVnclipuWi,
  encodeVnclipWi,
  encodeVredsumVs,
  encodeVredandVs,
  encodeVredorVs,
  encodeVredxorVs,
  encodeVredminuVs,
  encodeVredminVs,
  encodeVredmaxuVs,
  encodeVredmaxVs,
  encodeVaadduVv,
  encodeVaaddVv,
  encodeVasubuVv,
  encodeVasubVv,
  encodeVmvXS,
  encodeVzextVf8,
  encodeVsextVf8,
  encodeVzextVf4,
  encodeVsextVf4,
  encodeVzextVf2,
  encodeVsextVf2,
  encodeVcompressVm,
  encodeVmandnMm,
  encodeVmandMm,
  encodeVmorMm,
  encodeVmxorMm,
  encodeVmornMm,
  encodeVmnandMm,
  encodeVmnorMm,
  encodeVmxnorMm,
  encodeVmsbfM,
  encodeVmsofM,
  encodeVmsifM,
  encodeViotaM,
  encodeVidV,
  encodeVcpopM,
  encodeVfirstM,
  encodeVdivuVv,
  encodeVdivVv,
  encodeVremuVv,
  encodeVremVv,
  encodeVmulhuVv,
  encodeVmulVv,
  encodeVmulhsuVv,
  encodeVmulhVv,
  encodeVmaddVv,
  encodeVnmsubVv,
  encodeVmaccVv,
  encodeVnmsacVv,
  encodeVwadduVv,
  encodeVwaddVv,
  encodeVwsubuVv,
  encodeVwsubVv,
  encodeVwadduWv,
  encodeVwaddWv,
  encodeVwsubuWv,
  encodeVwsubWv,
  encodeVwmuluVv,
  encodeVwmulsuVv,
  encodeVwmulVv,
  encodeVwmaccuVv,
  encodeVwmaccVv,
  encodeVwmaccsuVv,
  encodeVaadduVx,
  encodeVaaddVx,
  encodeVasubuVx,
  encodeVasubVx,
  encodeVmvSX,
  encodeVslide1upVx,
  encodeVslide1downVx,
  encodeVdivuVx,
  encodeVdivVx,
  encodeVremuVx,
  encodeVremVx,
  encodeVmulhuVx,
  encodeVmulVx,
  encodeVmulhsuVx,
  encodeVmulhVx,
  encodeVmaddVx,
  encodeVnmsubVx,
  encodeVmaccVx,
  encodeVnmsacVx,
  encodeVwadduVx,
  encodeVwaddVx,
  encodeVwsubuVx,
  encodeVwsubVx,
  encodeVwadduWx,
  encodeVwaddWx,
  encodeVwsubuWx,
  encodeVwsubWx,
  encodeVwmuluVx,
  encodeVwmulsuVx,
  encodeVwmulVx,
  encodeVwmaccuVx,
  encodeVwmaccVx,
  encodeVwmaccusVx,
  encodeVwmaccsuVx,
  encodeAmoswapB,
  encodeAmoaddB,
  encodeAmoxorB,
  encodeAmoandB,
  encodeAmoorB,
  encodeAmominB,
  encodeAmomaxB,
  encodeAmominuB,
  encodeAmomaxuB,
  encodeAmoswapH,
  encodeAmoaddH,
  encodeAmoxorH,
  encodeAmoandH,
  encodeAmoorH,
  encodeAmominH,
  encodeAmomaxH,
  encodeAmominuH,
  encodeAmomaxuH,
  encodeAmocasB,
  encodeAmocasH,
  encodeAmocasW,
  encodeAmocasD,
  encodeLbAq,
  encodeLhAq,
  encodeLwAq,
  encodeLdAq,
  encodeSbRl,
  encodeShRl,
  encodeSwRl,
  encodeSdRl,
  encodeWrsNto,
  encodeWrsSto,
  encodeSh1add,
  encodeSh2add,
  encodeSh3add,
  encodeAndn,
  encodeOrn,
  encodeXnor,
  encodeClz,
  encodeCtz,
  encodeCpop,
  encodeMax,
  encodeMaxu,
  encodeMin,
  encodeMinu,
  encodeSextB,
  encodeSextH,
  encodeRol,
  encodeRor,
  encodeOrcB,
  encodeClmul,
  encodeClmulr,
  encodeClmulh,
  encodePack,
  encodePackh,
  encodeBrev8,
  encodeXperm4,
  encodeXperm8,
  encodeBclr,
  encodeBext,
  encodeBinv,
  encodeBset,
  encodeCLbu,
  encodeCLhu,
  encodeCLh,
  encodeCSb,
  encodeCSh,
  encodeCZextB,
  encodeCSextB,
  encodeCZextH,
  encodeCSextH,
  encodeCNot,
  encodeCMul,
  encodeCMopN,
  encodeCmPush,
  encodeCmPop,
  encodeCmPopretz,
  encodeCmPopret,
  encodeCmMvsa01,
  encodeCmMva01s,
  encodeCmJalt,
  encodeFcvtBf16S,
  encodeFcvtSBf16,
  encodeFmaddH,
  encodeFmsubH,
  encodeFnmsubH,
  encodeFnmaddH,
  encodeFaddH,
  encodeFsubH,
  encodeFmulH,
  encodeFdivH,
  encodeFsqrtH,
  encodeFsgnjH,
  encodeFsgnjnH,
  encodeFsgnjxH,
  encodeFminH,
  encodeFmaxH,
  encodeFeqH,
  encodeFltH,
  encodeFleH,
  encodeFclassH,
  encodeFcvtWH,
  encodeFcvtWuH,
  encodeFcvtHW,
  encodeFcvtHWu,
  encodeFliH,
  encodeFminmH,
  encodeFmaxmH,
  encodeFroundH,
  encodeFroundnxH,
  encodeFleqH,
  encodeFltqH,
  encodeFlh,
  encodeFsh,
  encodeFcvtSH,
  encodeFcvtHS,
  encodeFmvXH,
  encodeFmvHX,
  encodeCboClean,
  encodeCboFlush,
  encodeCboInval,
  encodeCboZero,
  encodeSsamoswapW,
  encodeSsamoswapD,
  encodeCzeroEqz,
  encodeCzeroNez,
  encodeCsrrw,
  encodeCsrrs,
  encodeCsrrc,
  encodeCsrrwi,
  encodeCsrrsi,
  encodeCsrrci,
  encodeFenceI,
  encodeMopRN,
  encodeMopRrN,
  encodeSha256sum0,
  encodeSha256sum1,
  encodeSha256sig0,
  encodeSha256sig1,
  encodeSm4ed,
  encodeSm4ks,
  encodeSm3p0,
  encodeSm3p1,
  encodeVandnVv,
  encodeVandnVx,
  encodeVbrevV,
  encodeVbrev8V,
  encodeVrev8V,
  encodeVclzV,
  encodeVctzV,
  encodeVcpopV,
  encodeVrolVv,
  encodeVrolVx,
  encodeVrorVv,
  encodeVrorVx,
  encodeVrorVi,
  encodeVwsllVv,
  encodeVwsllVx,
  encodeVwsllVi,
  encodeVclmulVv,
  encodeVclmulVx,
  encodeVclmulhVv,
  encodeVclmulhVx,
  encodeVfncvtbf16FFW,
  encodeVfwcvtbf16FFV,
  encodeVfwmaccbf16Vv,
  encodeVfwmaccbf16Vf,
  encodeVgmulVv,
  encodeVghshVv,
  encodeVaesdfVv,
  encodeVaesdfVs,
  encodeVaesdmVv,
  encodeVaesdmVs,
  encodeVaesefVv,
  encodeVaesefVs,
  encodeVaesemVv,
  encodeVaesemVs,
  encodeVaeszVs,
  encodeVaeskf1Vi,
  encodeVaeskf2Vi,
  encodeVsha2msVv,
  encodeVsha2chVv,
  encodeVsha2clVv,
  encodeVsm4kVi,
  encodeVsm4rVv,
  encodeVsm4rVs,
  encodeVsm3cVi,
  encodeVsm3meVv,
} from '#instructions/canonical';

const bytes = (...values: number[]): Uint8Array => Uint8Array.from(values);

test('1: lr.d', () => {
  assert.deepEqual(encodeLrD(2, 5, 1, 1), bytes(0x2f, 0xb1, 0x02, 0x16));
});
test('2: sc.d', () => {
  assert.deepEqual(encodeScD(7, 10, 13, 1, 1), bytes(0xaf, 0x33, 0xd5, 0x1e));
});
test('3: amoswap.d', () => {
  assert.deepEqual(encodeAmoswapD(12, 15, 18, 1, 1), bytes(0x2f, 0xb6, 0x27, 0x0f));
});
test('4: amoadd.d', () => {
  assert.deepEqual(encodeAmoaddD(17, 20, 23, 1, 1), bytes(0xaf, 0x38, 0x7a, 0x07));
});
test('5: amoxor.d', () => {
  assert.deepEqual(encodeAmoxorD(22, 25, 28, 1, 1), bytes(0x2f, 0xbb, 0xcc, 0x27));
});
test('6: amoand.d', () => {
  assert.deepEqual(encodeAmoandD(27, 30, 2, 1, 1), bytes(0xaf, 0x3d, 0x2f, 0x66));
});
test('7: amoor.d', () => {
  assert.deepEqual(encodeAmoorD(1, 4, 7, 1, 1), bytes(0xaf, 0x30, 0x72, 0x46));
});
test('8: amomin.d', () => {
  assert.deepEqual(encodeAmominD(6, 9, 12, 1, 1), bytes(0x2f, 0xb3, 0xc4, 0x86));
});
test('9: amomax.d', () => {
  assert.deepEqual(encodeAmomaxD(11, 14, 17, 1, 1), bytes(0xaf, 0x35, 0x17, 0xa7));
});
test('10: amominu.d', () => {
  assert.deepEqual(encodeAmominuD(16, 19, 22, 1, 1), bytes(0x2f, 0xb8, 0x69, 0xc7));
});
test('11: amomaxu.d', () => {
  assert.deepEqual(encodeAmomaxuD(21, 24, 27, 1, 1), bytes(0xaf, 0x3a, 0xbc, 0xe7));
});
test('12: c.ld', () => {
  assert.deepEqual(encodeCLd(11, 12, 3, 3), bytes(0x6c, 0x6e));
});
test('13: c.sd', () => {
  assert.deepEqual(encodeCSd(12, 13, 5, 2), bytes(0x54, 0xf6));
});
test('14: c.addiw', () => {
  assert.deepEqual(encodeCAddiw(5, 8, 1), bytes(0xa1, 0x32));
});
test('15: c.srli', () => {
  assert.deepEqual(encodeCSrli(14, 13, 1), bytes(0x35, 0x93));
});
test('16: c.srai', () => {
  assert.deepEqual(encodeCSrai(15, 18, 1), bytes(0xc9, 0x97));
});
test('17: c.subw', () => {
  assert.deepEqual(encodeCSubw(8, 9), bytes(0x05, 0x9c));
});
test('18: c.addw', () => {
  assert.deepEqual(encodeCAddw(9, 10), bytes(0xa9, 0x9c));
});
test('19: c.slli', () => {
  assert.deepEqual(encodeCSlli(30, 1, 5), bytes(0x16, 0x1f));
});
test('20: c.ldsp', () => {
  assert.deepEqual(encodeCLdsp(4, 1, 10), bytes(0x2a, 0x72));
});
test('21: c.sdsp', () => {
  assert.deepEqual(encodeCSdsp(9, 42), bytes(0x26, 0xf5));
});
test('22: fcvt.l.d', () => {
  assert.deepEqual(encodeFcvtLD(14, 17, 1), bytes(0x53, 0x97, 0x28, 0xc2));
});
test('23: fcvt.lu.d', () => {
  assert.deepEqual(encodeFcvtLuD(19, 22, 6), bytes(0xd3, 0x69, 0x3b, 0xc2));
});
test('24: fmv.x.d', () => {
  assert.deepEqual(encodeFmvXD(24, 27), bytes(0x53, 0x8c, 0x0d, 0xe2));
});
test('25: fcvt.d.l', () => {
  assert.deepEqual(encodeFcvtDL(29, 1, 2), bytes(0xd3, 0xae, 0x20, 0xd2));
});
test('26: fcvt.d.lu', () => {
  assert.deepEqual(encodeFcvtDLu(3, 6, 7), bytes(0xd3, 0x71, 0x33, 0xd2));
});
test('27: fmv.d.x', () => {
  assert.deepEqual(encodeFmvDX(8, 11), bytes(0x53, 0x84, 0x05, 0xf2));
});
test('28: fcvt.l.s', () => {
  assert.deepEqual(encodeFcvtLS(13, 16, 3), bytes(0xd3, 0x36, 0x28, 0xc0));
});
test('29: fcvt.lu.s', () => {
  assert.deepEqual(encodeFcvtLuS(18, 21, 1), bytes(0x53, 0x99, 0x3a, 0xc0));
});
test('30: fcvt.s.l', () => {
  assert.deepEqual(encodeFcvtSL(23, 26, 6), bytes(0xd3, 0x6b, 0x2d, 0xd0));
});
test('31: fcvt.s.lu', () => {
  assert.deepEqual(encodeFcvtSLu(28, 31, 4), bytes(0x53, 0xce, 0x3f, 0xd0));
});
test('32: hlv.wu', () => {
  assert.deepEqual(encodeHlvWu(2, 5), bytes(0x73, 0xc1, 0x12, 0x68));
});
test('33: hlv.d', () => {
  assert.deepEqual(encodeHlvD(7, 10), bytes(0xf3, 0x43, 0x05, 0x6c));
});
test('34: hsv.d', () => {
  assert.deepEqual(encodeHsvD(12, 15), bytes(0x73, 0x40, 0xf6, 0x6e));
});
test('35: lwu', () => {
  assert.deepEqual(encodeLwu(17, 20, 178), bytes(0x83, 0x68, 0x2a, 0x0b));
});
test('36: ld', () => {
  assert.deepEqual(encodeLd(22, 25, 183), bytes(0x03, 0xbb, 0x7c, 0x0b));
});
test('37: sd', () => {
  assert.deepEqual(encodeSd(55, 30, 2, 5), bytes(0xa3, 0x32, 0x2f, 0x6e));
});
test('38: slli', () => {
  assert.deepEqual(encodeSlli(1, 4, 4), bytes(0x93, 0x10, 0x42, 0x00));
});
test('39: srli', () => {
  assert.deepEqual(encodeSrli(6, 9, 9), bytes(0x13, 0xd3, 0x94, 0x00));
});
test('40: srai', () => {
  assert.deepEqual(encodeSrai(11, 14, 14), bytes(0x93, 0x55, 0xe7, 0x40));
});
test('41: addiw', () => {
  assert.deepEqual(encodeAddiw(16, 19, 208), bytes(0x1b, 0x88, 0x09, 0x0d));
});
test('42: slliw', () => {
  assert.deepEqual(encodeSlliw(21, 24, 27), bytes(0x9b, 0x1a, 0xbc, 0x01));
});
test('43: srliw', () => {
  assert.deepEqual(encodeSrliw(26, 29, 1), bytes(0x1b, 0xdd, 0x1e, 0x00));
});
test('44: sraiw', () => {
  assert.deepEqual(encodeSraiw(31, 3, 6), bytes(0x9b, 0xdf, 0x61, 0x40));
});
test('45: addw', () => {
  assert.deepEqual(encodeAddw(5, 8, 11), bytes(0xbb, 0x02, 0xb4, 0x00));
});
test('46: subw', () => {
  assert.deepEqual(encodeSubw(10, 13, 16), bytes(0x3b, 0x85, 0x06, 0x41));
});
test('47: sllw', () => {
  assert.deepEqual(encodeSllw(15, 18, 21), bytes(0xbb, 0x17, 0x59, 0x01));
});
test('48: srlw', () => {
  assert.deepEqual(encodeSrlw(20, 23, 26), bytes(0x3b, 0xda, 0xab, 0x01));
});
test('49: sraw', () => {
  assert.deepEqual(encodeSraw(25, 28, 31), bytes(0xbb, 0x5c, 0xfe, 0x41));
});
test('50: mulw', () => {
  assert.deepEqual(encodeMulw(30, 2, 5), bytes(0x3b, 0x0f, 0x51, 0x02));
});
test('51: divw', () => {
  assert.deepEqual(encodeDivw(4, 7, 10), bytes(0x3b, 0xc2, 0xa3, 0x02));
});
test('52: divuw', () => {
  assert.deepEqual(encodeDivuw(9, 12, 15), bytes(0xbb, 0x54, 0xf6, 0x02));
});
test('53: remw', () => {
  assert.deepEqual(encodeRemw(14, 17, 20), bytes(0x3b, 0xe7, 0x48, 0x03));
});
test('54: remuw', () => {
  assert.deepEqual(encodeRemuw(19, 22, 25), bytes(0xbb, 0x79, 0x9b, 0x03));
});
test('55: fcvt.l.q', () => {
  assert.deepEqual(encodeFcvtLQ(24, 27, 5), bytes(0x53, 0xdc, 0x2d, 0xc6));
});
test('56: fcvt.lu.q', () => {
  assert.deepEqual(encodeFcvtLuQ(29, 1, 3), bytes(0xd3, 0xbe, 0x30, 0xc6));
});
test('57: fcvt.q.l', () => {
  assert.deepEqual(encodeFcvtQL(3, 6, 1), bytes(0xd3, 0x11, 0x23, 0xd6));
});
test('58: fcvt.q.lu', () => {
  assert.deepEqual(encodeFcvtQLu(8, 11, 6), bytes(0x53, 0xe4, 0x35, 0xd6));
});
test('59: fmvh.x.q', () => {
  assert.deepEqual(encodeFmvhXQ(13, 16), bytes(0xd3, 0x06, 0x18, 0xe6));
});
test('60: fmvp.q.x', () => {
  assert.deepEqual(encodeFmvpQX(18, 21, 24), bytes(0x53, 0x89, 0x8a, 0xb7));
});
test('61: amocas.q', () => {
  assert.deepEqual(encodeAmocasQ(23, 26, 29, 1, 1), bytes(0xaf, 0x4b, 0xdd, 0x2f));
});
test('62: add.uw', () => {
  assert.deepEqual(encodeAddUw(28, 31, 3), bytes(0x3b, 0x8e, 0x3f, 0x08));
});
test('63: sh1add.uw', () => {
  assert.deepEqual(encodeSh1addUw(2, 5, 8), bytes(0x3b, 0xa1, 0x82, 0x20));
});
test('64: sh2add.uw', () => {
  assert.deepEqual(encodeSh2addUw(7, 10, 13), bytes(0xbb, 0x43, 0xd5, 0x20));
});
test('65: sh3add.uw', () => {
  assert.deepEqual(encodeSh3addUw(12, 15, 18), bytes(0x3b, 0xe6, 0x27, 0x21));
});
test('66: slli.uw', () => {
  assert.deepEqual(encodeSlliUw(17, 20, 18), bytes(0x9b, 0x18, 0x2a, 0x09));
});
test('67: clzw', () => {
  assert.deepEqual(encodeClzw(22, 25), bytes(0x1b, 0x9b, 0x0c, 0x60));
});
test('68: ctzw', () => {
  assert.deepEqual(encodeCtzw(27, 30), bytes(0x9b, 0x1d, 0x1f, 0x60));
});
test('69: cpopw', () => {
  assert.deepEqual(encodeCpopw(1, 4), bytes(0x9b, 0x10, 0x22, 0x60));
});
test('70: rolw', () => {
  assert.deepEqual(encodeRolw(6, 9, 12), bytes(0x3b, 0x93, 0xc4, 0x60));
});
test('71: rorw', () => {
  assert.deepEqual(encodeRorw(11, 14, 17), bytes(0xbb, 0x55, 0x17, 0x61));
});
test('72: roriw', () => {
  assert.deepEqual(encodeRoriw(16, 19, 22), bytes(0x1b, 0xd8, 0x69, 0x61));
});
test('73: rori', () => {
  assert.deepEqual(encodeRori(21, 24, 53), bytes(0x93, 0x5a, 0x5c, 0x63));
});
test('74: rev8', () => {
  assert.deepEqual(encodeRev8(26, 29), bytes(0x13, 0xdd, 0x8e, 0x6b));
});
test('75: packw', () => {
  assert.deepEqual(encodePackw(31, 3, 6), bytes(0xbb, 0xcf, 0x61, 0x08));
});
test('76: bclri', () => {
  assert.deepEqual(encodeBclri(5, 8, 5), bytes(0x93, 0x12, 0x54, 0x48));
});
test('77: bexti', () => {
  assert.deepEqual(encodeBexti(10, 13, 10), bytes(0x13, 0xd5, 0xa6, 0x48));
});
test('78: binvi', () => {
  assert.deepEqual(encodeBinvi(15, 18, 15), bytes(0x93, 0x17, 0xf9, 0x68));
});
test('79: bseti', () => {
  assert.deepEqual(encodeBseti(20, 23, 20), bytes(0x13, 0x9a, 0x4b, 0x29));
});
test('80: c.zext.w', () => {
  assert.deepEqual(encodeCZextW(15), bytes(0xf1, 0x9f));
});
test('81: fcvt.l.h', () => {
  assert.deepEqual(encodeFcvtLH(30, 2, 2), bytes(0x53, 0x2f, 0x21, 0xc4));
});
test('82: fcvt.lu.h', () => {
  assert.deepEqual(encodeFcvtLuH(4, 7, 7), bytes(0x53, 0xf2, 0x33, 0xc4));
});
test('83: fcvt.h.l', () => {
  assert.deepEqual(encodeFcvtHL(9, 12, 5), bytes(0xd3, 0x54, 0x26, 0xd4));
});
test('84: fcvt.h.lu', () => {
  assert.deepEqual(encodeFcvtHLu(14, 17, 3), bytes(0x53, 0xb7, 0x38, 0xd4));
});
test('85: aes64dsm', () => {
  assert.deepEqual(encodeAes64dsm(19, 22, 25), bytes(0xb3, 0x09, 0x9b, 0x3f));
});
test('86: aes64ds', () => {
  assert.deepEqual(encodeAes64ds(24, 27, 30), bytes(0x33, 0x8c, 0xed, 0x3b));
});
test('87: aes64ks1i', () => {
  assert.deepEqual(encodeAes64ks1i(29, 1, 3), bytes(0x93, 0x9e, 0x30, 0x31));
});
test('88: aes64im', () => {
  assert.deepEqual(encodeAes64im(3, 6), bytes(0x93, 0x11, 0x03, 0x30));
});
test('89: aes64ks2', () => {
  assert.deepEqual(encodeAes64ks2(8, 11, 14), bytes(0x33, 0x84, 0xe5, 0x7e));
});
test('90: aes64esm', () => {
  assert.deepEqual(encodeAes64esm(13, 16, 19), bytes(0xb3, 0x06, 0x38, 0x37));
});
test('91: aes64es', () => {
  assert.deepEqual(encodeAes64es(18, 21, 24), bytes(0x33, 0x89, 0x8a, 0x33));
});
test('92: sha512sum0', () => {
  assert.deepEqual(encodeSha512sum0(23, 26), bytes(0x93, 0x1b, 0x4d, 0x10));
});
test('93: sha512sum1', () => {
  assert.deepEqual(encodeSha512sum1(28, 31), bytes(0x13, 0x9e, 0x5f, 0x10));
});
test('94: sha512sig0', () => {
  assert.deepEqual(encodeSha512sig0(2, 5), bytes(0x13, 0x91, 0x62, 0x10));
});
test('95: sha512sig1', () => {
  assert.deepEqual(encodeSha512sig1(7, 10), bytes(0x93, 0x13, 0x75, 0x10));
});
test('96: lr.w', () => {
  assert.deepEqual(encodeLrW(12, 15, 1, 1), bytes(0x2f, 0xa6, 0x07, 0x16));
});
test('97: sc.w', () => {
  assert.deepEqual(encodeScW(17, 20, 23, 1, 1), bytes(0xaf, 0x28, 0x7a, 0x1f));
});
test('98: amoswap.w', () => {
  assert.deepEqual(encodeAmoswapW(22, 25, 28, 1, 1), bytes(0x2f, 0xab, 0xcc, 0x0f));
});
test('99: amoadd.w', () => {
  assert.deepEqual(encodeAmoaddW(27, 30, 2, 1, 1), bytes(0xaf, 0x2d, 0x2f, 0x06));
});
test('100: amoxor.w', () => {
  assert.deepEqual(encodeAmoxorW(1, 4, 7, 1, 1), bytes(0xaf, 0x20, 0x72, 0x26));
});
test('101: amoand.w', () => {
  assert.deepEqual(encodeAmoandW(6, 9, 12, 1, 1), bytes(0x2f, 0xa3, 0xc4, 0x66));
});
test('102: amoor.w', () => {
  assert.deepEqual(encodeAmoorW(11, 14, 17, 1, 1), bytes(0xaf, 0x25, 0x17, 0x47));
});
test('103: amomin.w', () => {
  assert.deepEqual(encodeAmominW(16, 19, 22, 1, 1), bytes(0x2f, 0xa8, 0x69, 0x87));
});
test('104: amomax.w', () => {
  assert.deepEqual(encodeAmomaxW(21, 24, 27, 1, 1), bytes(0xaf, 0x2a, 0xbc, 0xa7));
});
test('105: amominu.w', () => {
  assert.deepEqual(encodeAmominuW(26, 29, 1, 1, 1), bytes(0x2f, 0xad, 0x1e, 0xc6));
});
test('106: amomaxu.w', () => {
  assert.deepEqual(encodeAmomaxuW(31, 3, 6, 1, 1), bytes(0xaf, 0xaf, 0x61, 0xe6));
});
test('107: c.addi4spn', () => {
  assert.deepEqual(encodeCAddi4spn(10, 25), bytes(0x28, 0x03));
});
test('108: c.lw', () => {
  assert.deepEqual(encodeCLw(11, 12, 3, 7), bytes(0x6c, 0x5e));
});
test('109: c.sw', () => {
  assert.deepEqual(encodeCSw(12, 13, 2, 5), bytes(0x54, 0xd6));
});
test('110: c.nop', () => {
  assert.deepEqual(encodeCNop(1, 23), bytes(0x5d, 0x10));
});
test('111: c.addi', () => {
  assert.deepEqual(encodeCAddi(25, 28, 1), bytes(0xf1, 0x1c));
});
test('112: c.li', () => {
  assert.deepEqual(encodeCLi(30, 2, 1), bytes(0x09, 0x5f));
});
test('113: c.addi16sp', () => {
  assert.deepEqual(encodeCAddi16sp(1, 7), bytes(0x1d, 0x71));
});
test('114: c.lui', () => {
  assert.deepEqual(encodeCLui(9, 1, 15), bytes(0xbd, 0x74));
});
test('115: c.andi', () => {
  assert.deepEqual(encodeCAndi(10, 1, 20), bytes(0x51, 0x99));
});
test('116: c.sub', () => {
  assert.deepEqual(encodeCSub(11, 12), bytes(0x91, 0x8d));
});
test('117: c.xor', () => {
  assert.deepEqual(encodeCXor(12, 13), bytes(0x35, 0x8e));
});
test('118: c.or', () => {
  assert.deepEqual(encodeCOr(13, 14), bytes(0xd9, 0x8e));
});
test('119: c.and', () => {
  assert.deepEqual(encodeCAnd(14, 15), bytes(0x7d, 0x8f));
});
test('120: c.j', () => {
  assert.deepEqual(encodeCJ(597), bytes(0x55, 0xa9));
});
test('121: c.beqz', () => {
  assert.deepEqual(encodeCBeqz(8, 16, 6), bytes(0x41, 0xd8));
});
test('122: c.bnez', () => {
  assert.deepEqual(encodeCBnez(9, 21, 4), bytes(0xd5, 0xf0));
});
test('123: c.lwsp', () => {
  assert.deepEqual(encodeCLwsp(23, 1, 29), bytes(0xf6, 0x5b));
});
test('124: c.jr', () => {
  assert.deepEqual(encodeCJr(28), bytes(0x02, 0x8e));
});
test('125: c.mv', () => {
  assert.deepEqual(encodeCMv(2, 5), bytes(0x16, 0x81));
});
test('126: c.ebreak', () => {
  assert.deepEqual(encodeCEbreak(), bytes(0x02, 0x90));
});
test('127: c.jalr', () => {
  assert.deepEqual(encodeCJalr(12), bytes(0x02, 0x96));
});
test('128: c.add', () => {
  assert.deepEqual(encodeCAdd(17, 20), bytes(0xd2, 0x98));
});
test('129: c.swsp', () => {
  assert.deepEqual(encodeCSwsp(22, 15), bytes(0xda, 0xc7));
});
test('130: c.fld', () => {
  assert.deepEqual(encodeCFld(9, 10, 2, 5), bytes(0x44, 0x35));
});
test('131: c.fsd', () => {
  assert.deepEqual(encodeCFsd(10, 11, 1, 3), bytes(0x2c, 0xad));
});
test('132: c.fldsp', () => {
  assert.deepEqual(encodeCFldsp(6, 1, 12), bytes(0x32, 0x33));
});
test('133: c.fsdsp', () => {
  assert.deepEqual(encodeCFsdsp(11, 35), bytes(0xae, 0xb1));
});
test('134: fld', () => {
  assert.deepEqual(encodeFld(16, 19, 673), bytes(0x07, 0xb8, 0x19, 0x2a));
});
test('135: fsd', () => {
  assert.deepEqual(encodeFsd(37, 24, 27, 30), bytes(0x27, 0x3f, 0xbc, 0x4b));
});
test('136: fmadd.d', () => {
  assert.deepEqual(encodeFmaddD(26, 29, 1, 4, 3), bytes(0x43, 0xbd, 0x1e, 0x22));
});
test('137: fmsub.d', () => {
  assert.deepEqual(encodeFmsubD(31, 3, 6, 9, 1), bytes(0xc7, 0x9f, 0x61, 0x4a));
});
test('138: fnmsub.d', () => {
  assert.deepEqual(encodeFnmsubD(5, 8, 11, 14, 6), bytes(0xcb, 0x62, 0xb4, 0x72));
});
test('139: fnmadd.d', () => {
  assert.deepEqual(encodeFnmaddD(10, 13, 16, 19, 4), bytes(0x4f, 0xc5, 0x06, 0x9b));
});
test('140: fadd.d', () => {
  assert.deepEqual(encodeFaddD(15, 18, 21, 6), bytes(0xd3, 0x67, 0x59, 0x03));
});
test('141: fsub.d', () => {
  assert.deepEqual(encodeFsubD(20, 23, 26, 4), bytes(0x53, 0xca, 0xab, 0x0b));
});
test('142: fmul.d', () => {
  assert.deepEqual(encodeFmulD(25, 28, 31, 2), bytes(0xd3, 0x2c, 0xfe, 0x13));
});
test('143: fdiv.d', () => {
  assert.deepEqual(encodeFdivD(30, 2, 5, 7), bytes(0x53, 0x7f, 0x51, 0x1a));
});
test('144: fsqrt.d', () => {
  assert.deepEqual(encodeFsqrtD(4, 7, 2), bytes(0x53, 0xa2, 0x03, 0x5a));
});
test('145: fsgnj.d', () => {
  assert.deepEqual(encodeFsgnjD(9, 12, 15), bytes(0xd3, 0x04, 0xf6, 0x22));
});
test('146: fsgnjn.d', () => {
  assert.deepEqual(encodeFsgnjnD(14, 17, 20), bytes(0x53, 0x97, 0x48, 0x23));
});
test('147: fsgnjx.d', () => {
  assert.deepEqual(encodeFsgnjxD(19, 22, 25), bytes(0xd3, 0x29, 0x9b, 0x23));
});
test('148: fmin.d', () => {
  assert.deepEqual(encodeFminD(24, 27, 30), bytes(0x53, 0x8c, 0xed, 0x2b));
});
test('149: fmax.d', () => {
  assert.deepEqual(encodeFmaxD(29, 1, 4), bytes(0xd3, 0x9e, 0x40, 0x2a));
});
test('150: fcvt.s.d', () => {
  assert.deepEqual(encodeFcvtSD(3, 6, 4), bytes(0xd3, 0x41, 0x13, 0x40));
});
test('151: fcvt.d.s', () => {
  assert.deepEqual(encodeFcvtDS(8, 11, 2), bytes(0x53, 0xa4, 0x05, 0x42));
});
test('152: feq.d', () => {
  assert.deepEqual(encodeFeqD(13, 16, 19), bytes(0xd3, 0x26, 0x38, 0xa3));
});
test('153: flt.d', () => {
  assert.deepEqual(encodeFltD(18, 21, 24), bytes(0x53, 0x99, 0x8a, 0xa3));
});
test('154: fle.d', () => {
  assert.deepEqual(encodeFleD(23, 26, 29), bytes(0xd3, 0x0b, 0xdd, 0xa3));
});
test('155: fclass.d', () => {
  assert.deepEqual(encodeFclassD(28, 31), bytes(0x53, 0x9e, 0x0f, 0xe2));
});
test('156: fcvt.w.d', () => {
  assert.deepEqual(encodeFcvtWD(2, 5, 6), bytes(0x53, 0xe1, 0x02, 0xc2));
});
test('157: fcvt.wu.d', () => {
  assert.deepEqual(encodeFcvtWuD(7, 10, 4), bytes(0xd3, 0x43, 0x15, 0xc2));
});
test('158: fcvt.d.w', () => {
  assert.deepEqual(encodeFcvtDW(12, 15, 2), bytes(0x53, 0xa6, 0x07, 0xd2));
});
test('159: fcvt.d.wu', () => {
  assert.deepEqual(encodeFcvtDWu(17, 20, 7), bytes(0xd3, 0x78, 0x1a, 0xd2));
});
test('160: fli.d', () => {
  assert.deepEqual(encodeFliD(22, 25), bytes(0x53, 0x8b, 0x1c, 0xf2));
});
test('161: fminm.d', () => {
  assert.deepEqual(encodeFminmD(27, 30, 2), bytes(0xd3, 0x2d, 0x2f, 0x2a));
});
test('162: fmaxm.d', () => {
  assert.deepEqual(encodeFmaxmD(1, 4, 7), bytes(0xd3, 0x30, 0x72, 0x2a));
});
test('163: fround.d', () => {
  assert.deepEqual(encodeFroundD(6, 9, 6), bytes(0x53, 0xe3, 0x44, 0x42));
});
test('164: froundnx.d', () => {
  assert.deepEqual(encodeFroundnxD(11, 14, 4), bytes(0xd3, 0x45, 0x57, 0x42));
});
test('165: fcvtmod.w.d', () => {
  assert.deepEqual(encodeFcvtmodWD(16, 19), bytes(0x53, 0x98, 0x89, 0xc2));
});
test('166: fleq.d', () => {
  assert.deepEqual(encodeFleqD(21, 24, 27), bytes(0xd3, 0x4a, 0xbc, 0xa3));
});
test('167: fltq.d', () => {
  assert.deepEqual(encodeFltqD(26, 29, 1), bytes(0x53, 0xdd, 0x1e, 0xa2));
});
test('168: fcvt.d.h', () => {
  assert.deepEqual(encodeFcvtDH(31, 3, 3), bytes(0xd3, 0xbf, 0x21, 0x42));
});
test('169: fcvt.h.d', () => {
  assert.deepEqual(encodeFcvtHD(5, 8, 1), bytes(0xd3, 0x12, 0x14, 0x44));
});
test('170: flw', () => {
  assert.deepEqual(encodeFlw(10, 13, 853), bytes(0x07, 0xa5, 0x56, 0x35));
});
test('171: fsw', () => {
  assert.deepEqual(encodeFsw(90, 18, 21, 24), bytes(0x27, 0x2c, 0x59, 0xb5));
});
test('172: fmadd.s', () => {
  assert.deepEqual(encodeFmaddS(20, 23, 26, 29, 1), bytes(0x43, 0x9a, 0xab, 0xe9));
});
test('173: fmsub.s', () => {
  assert.deepEqual(encodeFmsubS(25, 28, 31, 3, 6), bytes(0xc7, 0x6c, 0xfe, 0x19));
});
test('174: fnmsub.s', () => {
  assert.deepEqual(encodeFnmsubS(30, 2, 5, 8, 4), bytes(0x4b, 0x4f, 0x51, 0x40));
});
test('175: fnmadd.s', () => {
  assert.deepEqual(encodeFnmaddS(4, 7, 10, 13, 2), bytes(0x4f, 0xa2, 0xa3, 0x68));
});
test('176: fadd.s', () => {
  assert.deepEqual(encodeFaddS(9, 12, 15, 4), bytes(0xd3, 0x44, 0xf6, 0x00));
});
test('177: fsub.s', () => {
  assert.deepEqual(encodeFsubS(14, 17, 20, 2), bytes(0x53, 0xa7, 0x48, 0x09));
});
test('178: fmul.s', () => {
  assert.deepEqual(encodeFmulS(19, 22, 25, 7), bytes(0xd3, 0x79, 0x9b, 0x11));
});
test('179: fdiv.s', () => {
  assert.deepEqual(encodeFdivS(24, 27, 30, 5), bytes(0x53, 0xdc, 0xed, 0x19));
});
test('180: fsqrt.s', () => {
  assert.deepEqual(encodeFsqrtS(29, 1, 7), bytes(0xd3, 0xfe, 0x00, 0x58));
});
test('181: fsgnj.s', () => {
  assert.deepEqual(encodeFsgnjS(3, 6, 9), bytes(0xd3, 0x01, 0x93, 0x20));
});
test('182: fsgnjn.s', () => {
  assert.deepEqual(encodeFsgnjnS(8, 11, 14), bytes(0x53, 0x94, 0xe5, 0x20));
});
test('183: fsgnjx.s', () => {
  assert.deepEqual(encodeFsgnjxS(13, 16, 19), bytes(0xd3, 0x26, 0x38, 0x21));
});
test('184: fmin.s', () => {
  assert.deepEqual(encodeFminS(18, 21, 24), bytes(0x53, 0x89, 0x8a, 0x29));
});
test('185: fmax.s', () => {
  assert.deepEqual(encodeFmaxS(23, 26, 29), bytes(0xd3, 0x1b, 0xdd, 0x29));
});
test('186: fcvt.w.s', () => {
  assert.deepEqual(encodeFcvtWS(28, 31, 2), bytes(0x53, 0xae, 0x0f, 0xc0));
});
test('187: fcvt.wu.s', () => {
  assert.deepEqual(encodeFcvtWuS(2, 5, 7), bytes(0x53, 0xf1, 0x12, 0xc0));
});
test('188: fmv.x.w', () => {
  assert.deepEqual(encodeFmvXW(7, 10), bytes(0xd3, 0x03, 0x05, 0xe0));
});
test('189: feq.s', () => {
  assert.deepEqual(encodeFeqS(12, 15, 18), bytes(0x53, 0xa6, 0x27, 0xa1));
});
test('190: flt.s', () => {
  assert.deepEqual(encodeFltS(17, 20, 23), bytes(0xd3, 0x18, 0x7a, 0xa1));
});
test('191: fle.s', () => {
  assert.deepEqual(encodeFleS(22, 25, 28), bytes(0x53, 0x8b, 0xcc, 0xa1));
});
test('192: fclass.s', () => {
  assert.deepEqual(encodeFclassS(27, 30), bytes(0xd3, 0x1d, 0x0f, 0xe0));
});
test('193: fcvt.s.w', () => {
  assert.deepEqual(encodeFcvtSW(1, 4, 2), bytes(0xd3, 0x20, 0x02, 0xd0));
});
test('194: fcvt.s.wu', () => {
  assert.deepEqual(encodeFcvtSWu(6, 9, 7), bytes(0x53, 0xf3, 0x14, 0xd0));
});
test('195: fmv.w.x', () => {
  assert.deepEqual(encodeFmvWX(11, 14), bytes(0xd3, 0x05, 0x07, 0xf0));
});
test('196: fli.s', () => {
  assert.deepEqual(encodeFliS(16, 19), bytes(0x53, 0x88, 0x19, 0xf0));
});
test('197: fminm.s', () => {
  assert.deepEqual(encodeFminmS(21, 24, 27), bytes(0xd3, 0x2a, 0xbc, 0x29));
});
test('198: fmaxm.s', () => {
  assert.deepEqual(encodeFmaxmS(26, 29, 1), bytes(0x53, 0xbd, 0x1e, 0x28));
});
test('199: fround.s', () => {
  assert.deepEqual(encodeFroundS(31, 3, 4), bytes(0xd3, 0xcf, 0x41, 0x40));
});
test('200: froundnx.s', () => {
  assert.deepEqual(encodeFroundnxS(5, 8, 2), bytes(0xd3, 0x22, 0x54, 0x40));
});
test('201: fleq.s', () => {
  assert.deepEqual(encodeFleqS(10, 13, 16), bytes(0x53, 0xc5, 0x06, 0xa1));
});
test('202: fltq.s', () => {
  assert.deepEqual(encodeFltqS(15, 18, 21), bytes(0xd3, 0x57, 0x59, 0xa1));
});
test('203: hfence.vvma', () => {
  assert.deepEqual(encodeHfenceVvma(20, 23), bytes(0x73, 0x00, 0x7a, 0x23));
});
test('204: hfence.gvma', () => {
  assert.deepEqual(encodeHfenceGvma(25, 28), bytes(0x73, 0x80, 0xcc, 0x63));
});
test('205: hlv.b', () => {
  assert.deepEqual(encodeHlvB(30, 2), bytes(0x73, 0x4f, 0x01, 0x60));
});
test('206: hlv.bu', () => {
  assert.deepEqual(encodeHlvBu(4, 7), bytes(0x73, 0xc2, 0x13, 0x60));
});
test('207: hlv.h', () => {
  assert.deepEqual(encodeHlvH(9, 12), bytes(0xf3, 0x44, 0x06, 0x64));
});
test('208: hlv.hu', () => {
  assert.deepEqual(encodeHlvHu(14, 17), bytes(0x73, 0xc7, 0x18, 0x64));
});
test('209: hlvx.hu', () => {
  assert.deepEqual(encodeHlvxHu(19, 22), bytes(0xf3, 0x49, 0x3b, 0x64));
});
test('210: hlv.w', () => {
  assert.deepEqual(encodeHlvW(24, 27), bytes(0x73, 0xcc, 0x0d, 0x68));
});
test('211: hlvx.wu', () => {
  assert.deepEqual(encodeHlvxWu(29, 1), bytes(0xf3, 0xce, 0x30, 0x68));
});
test('212: hsv.b', () => {
  assert.deepEqual(encodeHsvB(3, 6), bytes(0x73, 0xc0, 0x61, 0x62));
});
test('213: hsv.h', () => {
  assert.deepEqual(encodeHsvH(8, 11), bytes(0x73, 0x40, 0xb4, 0x66));
});
test('214: hsv.w', () => {
  assert.deepEqual(encodeHsvW(13, 16), bytes(0x73, 0xc0, 0x06, 0x6b));
});
test('215: lui', () => {
  assert.deepEqual(encodeLui(18, 1075), bytes(0x37, 0x39, 0x43, 0x00));
});
test('216: auipc', () => {
  assert.deepEqual(encodeAuipc(23, 1080), bytes(0x97, 0x8b, 0x43, 0x00));
});
test('217: jal', () => {
  assert.deepEqual(encodeJal(28, 1085), bytes(0x6f, 0xde, 0x43, 0x00));
});
test('218: jalr', () => {
  assert.deepEqual(encodeJalr(2, 5, 1093), bytes(0x67, 0x81, 0x52, 0x44));
});
test('219: beq', () => {
  assert.deepEqual(encodeBeq(76, 10, 13, 16), bytes(0x63, 0x08, 0xd5, 0x98));
});
test('220: bne', () => {
  assert.deepEqual(encodeBne(81, 15, 18, 21), bytes(0xe3, 0x9a, 0x27, 0xa3));
});
test('221: blt', () => {
  assert.deepEqual(encodeBlt(86, 20, 23, 26), bytes(0x63, 0x4d, 0x7a, 0xad));
});
test('222: bge', () => {
  assert.deepEqual(encodeBge(91, 25, 28, 31), bytes(0xe3, 0xdf, 0xcc, 0xb7));
});
test('223: bltu', () => {
  assert.deepEqual(encodeBltu(96, 30, 2, 5), bytes(0xe3, 0x62, 0x2f, 0xc0));
});
test('224: bgeu', () => {
  assert.deepEqual(encodeBgeu(101, 4, 7, 10), bytes(0x63, 0x75, 0x72, 0xca));
});
test('225: lb', () => {
  assert.deepEqual(encodeLb(6, 9, 1128), bytes(0x03, 0x83, 0x84, 0x46));
});
test('226: lh', () => {
  assert.deepEqual(encodeLh(11, 14, 1133), bytes(0x83, 0x15, 0xd7, 0x46));
});
test('227: lw', () => {
  assert.deepEqual(encodeLw(16, 19, 1138), bytes(0x03, 0xa8, 0x29, 0x47));
});
test('228: lbu', () => {
  assert.deepEqual(encodeLbu(21, 24, 1143), bytes(0x83, 0x4a, 0x7c, 0x47));
});
test('229: lhu', () => {
  assert.deepEqual(encodeLhu(26, 29, 1148), bytes(0x03, 0xdd, 0xce, 0x47));
});
test('230: sb', () => {
  assert.deepEqual(encodeSb(4, 3, 6, 9), bytes(0xa3, 0x84, 0x61, 0x08));
});
test('231: sh', () => {
  assert.deepEqual(encodeSh(9, 8, 11, 14), bytes(0x23, 0x17, 0xb4, 0x12));
});
test('232: sw', () => {
  assert.deepEqual(encodeSw(14, 13, 16, 19), bytes(0xa3, 0xa9, 0x06, 0x1d));
});
test('233: addi', () => {
  assert.deepEqual(encodeAddi(15, 18, 1168), bytes(0x93, 0x07, 0x09, 0x49));
});
test('234: slti', () => {
  assert.deepEqual(encodeSlti(20, 23, 1173), bytes(0x13, 0xaa, 0x5b, 0x49));
});
test('235: sltiu', () => {
  assert.deepEqual(encodeSltiu(25, 28, 1178), bytes(0x93, 0x3c, 0xae, 0x49));
});
test('236: xori', () => {
  assert.deepEqual(encodeXori(30, 2, 1183), bytes(0x13, 0x4f, 0xf1, 0x49));
});
test('237: ori', () => {
  assert.deepEqual(encodeOri(4, 7, 1188), bytes(0x13, 0xe2, 0x43, 0x4a));
});
test('238: andi', () => {
  assert.deepEqual(encodeAndi(9, 12, 1193), bytes(0x93, 0x74, 0x96, 0x4a));
});
test('239: add', () => {
  assert.deepEqual(encodeAdd(14, 17, 20), bytes(0x33, 0x87, 0x48, 0x01));
});
test('240: sub', () => {
  assert.deepEqual(encodeSub(19, 22, 25), bytes(0xb3, 0x09, 0x9b, 0x41));
});
test('241: sll', () => {
  assert.deepEqual(encodeSll(24, 27, 30), bytes(0x33, 0x9c, 0xed, 0x01));
});
test('242: slt', () => {
  assert.deepEqual(encodeSlt(29, 1, 4), bytes(0xb3, 0xae, 0x40, 0x00));
});
test('243: sltu', () => {
  assert.deepEqual(encodeSltu(3, 6, 9), bytes(0xb3, 0x31, 0x93, 0x00));
});
test('244: xor', () => {
  assert.deepEqual(encodeXor(8, 11, 14), bytes(0x33, 0xc4, 0xe5, 0x00));
});
test('245: srl', () => {
  assert.deepEqual(encodeSrl(13, 16, 19), bytes(0xb3, 0x56, 0x38, 0x01));
});
test('246: sra', () => {
  assert.deepEqual(encodeSra(18, 21, 24), bytes(0x33, 0xd9, 0x8a, 0x41));
});
test('247: or', () => {
  assert.deepEqual(encodeOr(23, 26, 29), bytes(0xb3, 0x6b, 0xdd, 0x01));
});
test('248: and', () => {
  assert.deepEqual(encodeAnd(28, 31, 3), bytes(0x33, 0xfe, 0x3f, 0x00));
});
test('249: fence', () => {
  assert.deepEqual(encodeFence(12, 15, 3, 11, 14), bytes(0x0f, 0x87, 0x35, 0xcf));
});
test('250: ecall', () => {
  assert.deepEqual(encodeEcall(), bytes(0x73, 0x00, 0x00, 0x00));
});
test('251: ebreak', () => {
  assert.deepEqual(encodeEbreak(), bytes(0x73, 0x00, 0x10, 0x00));
});
test('252: mul', () => {
  assert.deepEqual(encodeMul(17, 20, 23), bytes(0xb3, 0x08, 0x7a, 0x03));
});
test('253: mulh', () => {
  assert.deepEqual(encodeMulh(22, 25, 28), bytes(0x33, 0x9b, 0xcc, 0x03));
});
test('254: mulhsu', () => {
  assert.deepEqual(encodeMulhsu(27, 30, 2), bytes(0xb3, 0x2d, 0x2f, 0x02));
});
test('255: mulhu', () => {
  assert.deepEqual(encodeMulhu(1, 4, 7), bytes(0xb3, 0x30, 0x72, 0x02));
});
test('256: div', () => {
  assert.deepEqual(encodeDiv(6, 9, 12), bytes(0x33, 0xc3, 0xc4, 0x02));
});
test('257: divu', () => {
  assert.deepEqual(encodeDivu(11, 14, 17), bytes(0xb3, 0x55, 0x17, 0x03));
});
test('258: rem', () => {
  assert.deepEqual(encodeRem(16, 19, 22), bytes(0x33, 0xe8, 0x69, 0x03));
});
test('259: remu', () => {
  assert.deepEqual(encodeRemu(21, 24, 27), bytes(0xb3, 0x7a, 0xbc, 0x03));
});
test('260: flq', () => {
  assert.deepEqual(encodeFlq(26, 29, 1303), bytes(0x07, 0xcd, 0x7e, 0x51));
});
test('261: fsq', () => {
  assert.deepEqual(encodeFsq(32, 3, 6, 9), bytes(0xa7, 0xc4, 0x61, 0x40));
});
test('262: fmadd.q', () => {
  assert.deepEqual(encodeFmaddQ(5, 8, 11, 14, 3), bytes(0xc3, 0x32, 0xb4, 0x76));
});
test('263: fmsub.q', () => {
  assert.deepEqual(encodeFmsubQ(10, 13, 16, 19, 1), bytes(0x47, 0x95, 0x06, 0x9f));
});
test('264: fnmsub.q', () => {
  assert.deepEqual(encodeFnmsubQ(15, 18, 21, 24, 6), bytes(0xcb, 0x67, 0x59, 0xc7));
});
test('265: fnmadd.q', () => {
  assert.deepEqual(encodeFnmaddQ(20, 23, 26, 29, 4), bytes(0x4f, 0xca, 0xab, 0xef));
});
test('266: fadd.q', () => {
  assert.deepEqual(encodeFaddQ(25, 28, 31, 6), bytes(0xd3, 0x6c, 0xfe, 0x07));
});
test('267: fsub.q', () => {
  assert.deepEqual(encodeFsubQ(30, 2, 5, 4), bytes(0x53, 0x4f, 0x51, 0x0e));
});
test('268: fmul.q', () => {
  assert.deepEqual(encodeFmulQ(4, 7, 10, 2), bytes(0x53, 0xa2, 0xa3, 0x16));
});
test('269: fdiv.q', () => {
  assert.deepEqual(encodeFdivQ(9, 12, 15, 7), bytes(0xd3, 0x74, 0xf6, 0x1e));
});
test('270: fsqrt.q', () => {
  assert.deepEqual(encodeFsqrtQ(14, 17, 2), bytes(0x53, 0xa7, 0x08, 0x5e));
});
test('271: fsgnj.q', () => {
  assert.deepEqual(encodeFsgnjQ(19, 22, 25), bytes(0xd3, 0x09, 0x9b, 0x27));
});
test('272: fsgnjn.q', () => {
  assert.deepEqual(encodeFsgnjnQ(24, 27, 30), bytes(0x53, 0x9c, 0xed, 0x27));
});
test('273: fsgnjx.q', () => {
  assert.deepEqual(encodeFsgnjxQ(29, 1, 4), bytes(0xd3, 0xae, 0x40, 0x26));
});
test('274: fmin.q', () => {
  assert.deepEqual(encodeFminQ(3, 6, 9), bytes(0xd3, 0x01, 0x93, 0x2e));
});
test('275: fmax.q', () => {
  assert.deepEqual(encodeFmaxQ(8, 11, 14), bytes(0x53, 0x94, 0xe5, 0x2e));
});
test('276: fcvt.s.q', () => {
  assert.deepEqual(encodeFcvtSQ(13, 16, 4), bytes(0xd3, 0x46, 0x38, 0x40));
});
test('277: fcvt.q.s', () => {
  assert.deepEqual(encodeFcvtQS(18, 21, 2), bytes(0x53, 0xa9, 0x0a, 0x46));
});
test('278: fcvt.d.q', () => {
  assert.deepEqual(encodeFcvtDQ(23, 26, 7), bytes(0xd3, 0x7b, 0x3d, 0x42));
});
test('279: fcvt.q.d', () => {
  assert.deepEqual(encodeFcvtQD(28, 31, 5), bytes(0x53, 0xde, 0x1f, 0x46));
});
test('280: feq.q', () => {
  assert.deepEqual(encodeFeqQ(2, 5, 8), bytes(0x53, 0xa1, 0x82, 0xa6));
});
test('281: flt.q', () => {
  assert.deepEqual(encodeFltQ(7, 10, 13), bytes(0xd3, 0x13, 0xd5, 0xa6));
});
test('282: fle.q', () => {
  assert.deepEqual(encodeFleQ(12, 15, 18), bytes(0x53, 0x86, 0x27, 0xa7));
});
test('283: fclass.q', () => {
  assert.deepEqual(encodeFclassQ(17, 20), bytes(0xd3, 0x18, 0x0a, 0xe6));
});
test('284: fcvt.w.q', () => {
  assert.deepEqual(encodeFcvtWQ(22, 25, 2), bytes(0x53, 0xab, 0x0c, 0xc6));
});
test('285: fcvt.wu.q', () => {
  assert.deepEqual(encodeFcvtWuQ(27, 30, 7), bytes(0xd3, 0x7d, 0x1f, 0xc6));
});
test('286: fcvt.q.w', () => {
  assert.deepEqual(encodeFcvtQW(1, 4, 5), bytes(0xd3, 0x50, 0x02, 0xd6));
});
test('287: fcvt.q.wu', () => {
  assert.deepEqual(encodeFcvtQWu(6, 9, 3), bytes(0x53, 0xb3, 0x14, 0xd6));
});
test('288: fli.q', () => {
  assert.deepEqual(encodeFliQ(11, 14), bytes(0xd3, 0x05, 0x17, 0xf6));
});
test('289: fminm.q', () => {
  assert.deepEqual(encodeFminmQ(16, 19, 22), bytes(0x53, 0xa8, 0x69, 0x2f));
});
test('290: fmaxm.q', () => {
  assert.deepEqual(encodeFmaxmQ(21, 24, 27), bytes(0xd3, 0x3a, 0xbc, 0x2f));
});
test('291: fround.q', () => {
  assert.deepEqual(encodeFroundQ(26, 29, 2), bytes(0x53, 0xad, 0x4e, 0x46));
});
test('292: froundnx.q', () => {
  assert.deepEqual(encodeFroundnxQ(31, 3, 7), bytes(0xd3, 0xff, 0x51, 0x46));
});
test('293: fleq.q', () => {
  assert.deepEqual(encodeFleqQ(5, 8, 11), bytes(0xd3, 0x42, 0xb4, 0xa6));
});
test('294: fltq.q', () => {
  assert.deepEqual(encodeFltqQ(10, 13, 16), bytes(0x53, 0xd5, 0x06, 0xa7));
});
test('295: fcvt.q.h', () => {
  assert.deepEqual(encodeFcvtQH(15, 18, 1), bytes(0xd3, 0x17, 0x29, 0x46));
});
test('296: fcvt.h.q', () => {
  assert.deepEqual(encodeFcvtHQ(20, 23, 6), bytes(0x53, 0xea, 0x3b, 0x44));
});
test('297: sfence.vma', () => {
  assert.deepEqual(encodeSfenceVma(25, 28), bytes(0x73, 0x80, 0xcc, 0x13));
});
test('298: sret', () => {
  assert.deepEqual(encodeSret(), bytes(0x73, 0x00, 0x20, 0x10));
});
test('299: dret', () => {
  assert.deepEqual(encodeDret(), bytes(0x73, 0x00, 0x20, 0x7b));
});
test('300: mnret', () => {
  assert.deepEqual(encodeMnret(), bytes(0x73, 0x00, 0x20, 0x70));
});
test('301: sctrclr', () => {
  assert.deepEqual(encodeSctrclr(), bytes(0x73, 0x00, 0x40, 0x10));
});
test('302: sinval.vma', () => {
  assert.deepEqual(encodeSinvalVma(19, 22), bytes(0x73, 0x80, 0x69, 0x17));
});
test('303: sfence.w.inval', () => {
  assert.deepEqual(encodeSfenceWInval(), bytes(0x73, 0x00, 0x00, 0x18));
});
test('304: sfence.inval.ir', () => {
  assert.deepEqual(encodeSfenceInvalIr(), bytes(0x73, 0x00, 0x10, 0x18));
});
test('305: hinval.vvma', () => {
  assert.deepEqual(encodeHinvalVvma(3, 6), bytes(0x73, 0x80, 0x61, 0x26));
});
test('306: hinval.gvma', () => {
  assert.deepEqual(encodeHinvalGvma(8, 11), bytes(0x73, 0x00, 0xb4, 0x66));
});
test('307: mret', () => {
  assert.deepEqual(encodeMret(), bytes(0x73, 0x00, 0x20, 0x30));
});
test('308: wfi', () => {
  assert.deepEqual(encodeWfi(), bytes(0x73, 0x00, 0x50, 0x10));
});
test('309: vsetivli', () => {
  assert.deepEqual(encodeVsetivli(519, 26, 29), bytes(0xd7, 0x7e, 0x7d, 0xe0));
});
test('310: vsetvli', () => {
  assert.deepEqual(encodeVsetvli(1547, 31, 3), bytes(0xd7, 0xf1, 0xbf, 0x60));
});
test('311: vsetvl', () => {
  assert.deepEqual(encodeVsetvl(2, 5, 8), bytes(0x57, 0xf4, 0x22, 0x80));
});
test('312: vlm.v', () => {
  assert.deepEqual(encodeVlmV(7, 10), bytes(0x07, 0x85, 0xb3, 0x02));
});
test('313: vsm.v', () => {
  assert.deepEqual(encodeVsmV(12, 15), bytes(0xa7, 0x07, 0xb6, 0x02));
});
test('314: vle8.v', () => {
  assert.deepEqual(encodeVle8V(6, 1, 23, 26), bytes(0x07, 0x8d, 0x0b, 0xc2));
});
test('315: vle16.v', () => {
  assert.deepEqual(encodeVle16V(4, 1, 28, 31), bytes(0x87, 0x5f, 0x0e, 0x82));
});
test('316: vle32.v', () => {
  assert.deepEqual(encodeVle32V(2, 1, 2, 5), bytes(0x87, 0x62, 0x01, 0x42));
});
test('317: vle64.v', () => {
  assert.deepEqual(encodeVle64V(7, 1, 7, 10), bytes(0x07, 0xf5, 0x03, 0xe2));
});
test('318: vse8.v', () => {
  assert.deepEqual(encodeVse8V(5, 1, 12, 15), bytes(0xa7, 0x07, 0x06, 0xa2));
});
test('319: vse16.v', () => {
  assert.deepEqual(encodeVse16V(3, 1, 17, 20), bytes(0x27, 0xda, 0x08, 0x62));
});
test('320: vse32.v', () => {
  assert.deepEqual(encodeVse32V(1, 1, 22, 25), bytes(0xa7, 0x6c, 0x0b, 0x22));
});
test('321: vse64.v', () => {
  assert.deepEqual(encodeVse64V(6, 1, 27, 30), bytes(0x27, 0xff, 0x0d, 0xc2));
});
test('322: vluxei8.v', () => {
  assert.deepEqual(encodeVluxei8V(4, 1, 1, 4, 7), bytes(0x87, 0x03, 0x12, 0x86));
});
test('323: vluxei16.v', () => {
  assert.deepEqual(encodeVluxei16V(2, 1, 6, 9, 12), bytes(0x07, 0xd6, 0x64, 0x46));
});
test('324: vluxei32.v', () => {
  assert.deepEqual(encodeVluxei32V(7, 1, 11, 14, 17), bytes(0x87, 0x68, 0xb7, 0xe6));
});
test('325: vluxei64.v', () => {
  assert.deepEqual(encodeVluxei64V(5, 1, 16, 19, 22), bytes(0x07, 0xfb, 0x09, 0xa7));
});
test('326: vsuxei8.v', () => {
  assert.deepEqual(encodeVsuxei8V(3, 1, 21, 24, 27), bytes(0xa7, 0x0d, 0x5c, 0x67));
});
test('327: vsuxei16.v', () => {
  assert.deepEqual(encodeVsuxei16V(1, 1, 26, 29, 1), bytes(0xa7, 0xd0, 0xae, 0x27));
});
test('328: vsuxei32.v', () => {
  assert.deepEqual(encodeVsuxei32V(6, 1, 31, 3, 6), bytes(0x27, 0xe3, 0xf1, 0xc7));
});
test('329: vsuxei64.v', () => {
  assert.deepEqual(encodeVsuxei64V(4, 1, 5, 8, 11), bytes(0xa7, 0x75, 0x54, 0x86));
});
test('330: vlse8.v', () => {
  assert.deepEqual(encodeVlse8V(2, 1, 10, 13, 16), bytes(0x07, 0x88, 0xa6, 0x4a));
});
test('331: vlse16.v', () => {
  assert.deepEqual(encodeVlse16V(7, 1, 15, 18, 21), bytes(0x87, 0x5a, 0xf9, 0xea));
});
test('332: vlse32.v', () => {
  assert.deepEqual(encodeVlse32V(5, 1, 20, 23, 26), bytes(0x07, 0xed, 0x4b, 0xab));
});
test('333: vlse64.v', () => {
  assert.deepEqual(encodeVlse64V(3, 1, 25, 28, 31), bytes(0x87, 0x7f, 0x9e, 0x6b));
});
test('334: vsse8.v', () => {
  assert.deepEqual(encodeVsse8V(1, 1, 30, 2, 5), bytes(0xa7, 0x02, 0xe1, 0x2b));
});
test('335: vsse16.v', () => {
  assert.deepEqual(encodeVsse16V(6, 1, 4, 7, 10), bytes(0x27, 0xd5, 0x43, 0xca));
});
test('336: vsse32.v', () => {
  assert.deepEqual(encodeVsse32V(4, 1, 9, 12, 15), bytes(0xa7, 0x67, 0x96, 0x8a));
});
test('337: vsse64.v', () => {
  assert.deepEqual(encodeVsse64V(2, 1, 14, 17, 20), bytes(0x27, 0xfa, 0xe8, 0x4a));
});
test('338: vloxei8.v', () => {
  assert.deepEqual(encodeVloxei8V(7, 1, 19, 22, 25), bytes(0x87, 0x0c, 0x3b, 0xef));
});
test('339: vloxei16.v', () => {
  assert.deepEqual(encodeVloxei16V(5, 1, 24, 27, 30), bytes(0x07, 0xdf, 0x8d, 0xaf));
});
test('340: vloxei32.v', () => {
  assert.deepEqual(encodeVloxei32V(3, 1, 29, 1, 4), bytes(0x07, 0xe2, 0xd0, 0x6f));
});
test('341: vloxei64.v', () => {
  assert.deepEqual(encodeVloxei64V(1, 1, 3, 6, 9), bytes(0x87, 0x74, 0x33, 0x2e));
});
test('342: vsoxei8.v', () => {
  assert.deepEqual(encodeVsoxei8V(6, 1, 8, 11, 14), bytes(0x27, 0x87, 0x85, 0xce));
});
test('343: vsoxei16.v', () => {
  assert.deepEqual(encodeVsoxei16V(4, 1, 13, 16, 19), bytes(0xa7, 0x59, 0xd8, 0x8e));
});
test('344: vsoxei32.v', () => {
  assert.deepEqual(encodeVsoxei32V(2, 1, 18, 21, 24), bytes(0x27, 0xec, 0x2a, 0x4f));
});
test('345: vsoxei64.v', () => {
  assert.deepEqual(encodeVsoxei64V(7, 1, 23, 26, 29), bytes(0xa7, 0x7e, 0x7d, 0xef));
});
test('346: vle8ff.v', () => {
  assert.deepEqual(encodeVle8ffV(5, 1, 28, 31), bytes(0x87, 0x0f, 0x0e, 0xa3));
});
test('347: vle16ff.v', () => {
  assert.deepEqual(encodeVle16ffV(3, 1, 2, 5), bytes(0x87, 0x52, 0x01, 0x63));
});
test('348: vle32ff.v', () => {
  assert.deepEqual(encodeVle32ffV(1, 1, 7, 10), bytes(0x07, 0xe5, 0x03, 0x23));
});
test('349: vle64ff.v', () => {
  assert.deepEqual(encodeVle64ffV(6, 1, 12, 15), bytes(0x87, 0x77, 0x06, 0xc3));
});
test('350: vl1re8.v', () => {
  assert.deepEqual(encodeVl1re8V(11, 14), bytes(0x07, 0x87, 0x85, 0x02));
});
test('351: vl1re16.v', () => {
  assert.deepEqual(encodeVl1re16V(16, 19), bytes(0x87, 0x59, 0x88, 0x02));
});
test('352: vl1re32.v', () => {
  assert.deepEqual(encodeVl1re32V(21, 24), bytes(0x07, 0xec, 0x8a, 0x02));
});
test('353: vl1re64.v', () => {
  assert.deepEqual(encodeVl1re64V(26, 29), bytes(0x87, 0x7e, 0x8d, 0x02));
});
test('354: vl2re8.v', () => {
  assert.deepEqual(encodeVl2re8V(31, 3), bytes(0x87, 0x81, 0x8f, 0x22));
});
test('355: vl2re16.v', () => {
  assert.deepEqual(encodeVl2re16V(5, 8), bytes(0x07, 0xd4, 0x82, 0x22));
});
test('356: vl2re32.v', () => {
  assert.deepEqual(encodeVl2re32V(10, 13), bytes(0x87, 0x66, 0x85, 0x22));
});
test('357: vl2re64.v', () => {
  assert.deepEqual(encodeVl2re64V(15, 18), bytes(0x07, 0xf9, 0x87, 0x22));
});
test('358: vl4re8.v', () => {
  assert.deepEqual(encodeVl4re8V(20, 23), bytes(0x87, 0x0b, 0x8a, 0x62));
});
test('359: vl4re16.v', () => {
  assert.deepEqual(encodeVl4re16V(25, 28), bytes(0x07, 0xde, 0x8c, 0x62));
});
test('360: vl4re32.v', () => {
  assert.deepEqual(encodeVl4re32V(30, 2), bytes(0x07, 0x61, 0x8f, 0x62));
});
test('361: vl4re64.v', () => {
  assert.deepEqual(encodeVl4re64V(4, 7), bytes(0x87, 0x73, 0x82, 0x62));
});
test('362: vl8re8.v', () => {
  assert.deepEqual(encodeVl8re8V(9, 12), bytes(0x07, 0x86, 0x84, 0xe2));
});
test('363: vl8re16.v', () => {
  assert.deepEqual(encodeVl8re16V(14, 17), bytes(0x87, 0x58, 0x87, 0xe2));
});
test('364: vl8re32.v', () => {
  assert.deepEqual(encodeVl8re32V(19, 22), bytes(0x07, 0xeb, 0x89, 0xe2));
});
test('365: vl8re64.v', () => {
  assert.deepEqual(encodeVl8re64V(24, 27), bytes(0x87, 0x7d, 0x8c, 0xe2));
});
test('366: vs1r.v', () => {
  assert.deepEqual(encodeVs1rV(29, 1), bytes(0xa7, 0x80, 0x8e, 0x02));
});
test('367: vs2r.v', () => {
  assert.deepEqual(encodeVs2rV(3, 6), bytes(0x27, 0x83, 0x81, 0x22));
});
test('368: vs4r.v', () => {
  assert.deepEqual(encodeVs4rV(8, 11), bytes(0xa7, 0x05, 0x84, 0x62));
});
test('369: vs8r.v', () => {
  assert.deepEqual(encodeVs8rV(13, 16), bytes(0x27, 0x88, 0x86, 0xe2));
});
test('370: vfadd.vf', () => {
  assert.deepEqual(encodeVfaddVf(1, 21, 24, 27), bytes(0xd7, 0x5d, 0x5c, 0x03));
});
test('371: vfsub.vf', () => {
  assert.deepEqual(encodeVfsubVf(1, 26, 29, 1), bytes(0xd7, 0xd0, 0xae, 0x0b));
});
test('372: vfmin.vf', () => {
  assert.deepEqual(encodeVfminVf(1, 31, 3, 6), bytes(0x57, 0xd3, 0xf1, 0x13));
});
test('373: vfmax.vf', () => {
  assert.deepEqual(encodeVfmaxVf(1, 5, 8, 11), bytes(0xd7, 0x55, 0x54, 0x1a));
});
test('374: vfsgnj.vf', () => {
  assert.deepEqual(encodeVfsgnjVf(1, 10, 13, 16), bytes(0x57, 0xd8, 0xa6, 0x22));
});
test('375: vfsgnjn.vf', () => {
  assert.deepEqual(encodeVfsgnjnVf(1, 15, 18, 21), bytes(0xd7, 0x5a, 0xf9, 0x26));
});
test('376: vfsgnjx.vf', () => {
  assert.deepEqual(encodeVfsgnjxVf(1, 20, 23, 26), bytes(0x57, 0xdd, 0x4b, 0x2b));
});
test('377: vfslide1up.vf', () => {
  assert.deepEqual(encodeVfslide1upVf(1, 25, 28, 31), bytes(0xd7, 0x5f, 0x9e, 0x3b));
});
test('378: vfslide1down.vf', () => {
  assert.deepEqual(encodeVfslide1downVf(1, 30, 2, 5), bytes(0xd7, 0x52, 0xe1, 0x3f));
});
test('379: vfmv.s.f', () => {
  assert.deepEqual(encodeVfmvSF(1, 4), bytes(0x57, 0xd2, 0x00, 0x42));
});
test('380: vfmerge.vfm', () => {
  assert.deepEqual(encodeVfmergeVfm(6, 9, 12), bytes(0x57, 0xd6, 0x64, 0x5c));
});
test('381: vfmv.v.f', () => {
  assert.deepEqual(encodeVfmvVF(11, 14), bytes(0x57, 0xd7, 0x05, 0x5e));
});
test('382: vmfeq.vf', () => {
  assert.deepEqual(encodeVmfeqVf(1, 19, 22, 25), bytes(0xd7, 0x5c, 0x3b, 0x63));
});
test('383: vmfle.vf', () => {
  assert.deepEqual(encodeVmfleVf(1, 24, 27, 30), bytes(0x57, 0xdf, 0x8d, 0x67));
});
test('384: vmflt.vf', () => {
  assert.deepEqual(encodeVmfltVf(1, 29, 1, 4), bytes(0x57, 0xd2, 0xd0, 0x6f));
});
test('385: vmfne.vf', () => {
  assert.deepEqual(encodeVmfneVf(1, 3, 6, 9), bytes(0xd7, 0x54, 0x33, 0x72));
});
test('386: vmfgt.vf', () => {
  assert.deepEqual(encodeVmfgtVf(1, 8, 11, 14), bytes(0x57, 0xd7, 0x85, 0x76));
});
test('387: vmfge.vf', () => {
  assert.deepEqual(encodeVmfgeVf(1, 13, 16, 19), bytes(0xd7, 0x59, 0xd8, 0x7e));
});
test('388: vfdiv.vf', () => {
  assert.deepEqual(encodeVfdivVf(1, 18, 21, 24), bytes(0x57, 0xdc, 0x2a, 0x83));
});
test('389: vfrdiv.vf', () => {
  assert.deepEqual(encodeVfrdivVf(1, 23, 26, 29), bytes(0xd7, 0x5e, 0x7d, 0x87));
});
test('390: vfmul.vf', () => {
  assert.deepEqual(encodeVfmulVf(1, 28, 31, 3), bytes(0xd7, 0xd1, 0xcf, 0x93));
});
test('391: vfrsub.vf', () => {
  assert.deepEqual(encodeVfrsubVf(1, 2, 5, 8), bytes(0x57, 0xd4, 0x22, 0x9e));
});
test('392: vfmadd.vf', () => {
  assert.deepEqual(encodeVfmaddVf(1, 7, 10, 13), bytes(0xd7, 0x56, 0x75, 0xa2));
});
test('393: vfnmadd.vf', () => {
  assert.deepEqual(encodeVfnmaddVf(1, 12, 15, 18), bytes(0x57, 0xd9, 0xc7, 0xa6));
});
test('394: vfmsub.vf', () => {
  assert.deepEqual(encodeVfmsubVf(1, 17, 20, 23), bytes(0xd7, 0x5b, 0x1a, 0xab));
});
test('395: vfnmsub.vf', () => {
  assert.deepEqual(encodeVfnmsubVf(1, 22, 25, 28), bytes(0x57, 0xde, 0x6c, 0xaf));
});
test('396: vfmacc.vf', () => {
  assert.deepEqual(encodeVfmaccVf(1, 27, 30, 2), bytes(0x57, 0x51, 0xbf, 0xb3));
});
test('397: vfnmacc.vf', () => {
  assert.deepEqual(encodeVfnmaccVf(1, 1, 4, 7), bytes(0xd7, 0x53, 0x12, 0xb6));
});
test('398: vfmsac.vf', () => {
  assert.deepEqual(encodeVfmsacVf(1, 6, 9, 12), bytes(0x57, 0xd6, 0x64, 0xba));
});
test('399: vfnmsac.vf', () => {
  assert.deepEqual(encodeVfnmsacVf(1, 11, 14, 17), bytes(0xd7, 0x58, 0xb7, 0xbe));
});
test('400: vfwadd.vf', () => {
  assert.deepEqual(encodeVfwaddVf(1, 16, 19, 22), bytes(0x57, 0xdb, 0x09, 0xc3));
});
test('401: vfwsub.vf', () => {
  assert.deepEqual(encodeVfwsubVf(1, 21, 24, 27), bytes(0xd7, 0x5d, 0x5c, 0xcb));
});
test('402: vfwadd.wf', () => {
  assert.deepEqual(encodeVfwaddWf(1, 26, 29, 1), bytes(0xd7, 0xd0, 0xae, 0xd3));
});
test('403: vfwsub.wf', () => {
  assert.deepEqual(encodeVfwsubWf(1, 31, 3, 6), bytes(0x57, 0xd3, 0xf1, 0xdb));
});
test('404: vfwmul.vf', () => {
  assert.deepEqual(encodeVfwmulVf(1, 5, 8, 11), bytes(0xd7, 0x55, 0x54, 0xe2));
});
test('405: vfwmacc.vf', () => {
  assert.deepEqual(encodeVfwmaccVf(1, 10, 13, 16), bytes(0x57, 0xd8, 0xa6, 0xf2));
});
test('406: vfwnmacc.vf', () => {
  assert.deepEqual(encodeVfwnmaccVf(1, 15, 18, 21), bytes(0xd7, 0x5a, 0xf9, 0xf6));
});
test('407: vfwmsac.vf', () => {
  assert.deepEqual(encodeVfwmsacVf(1, 20, 23, 26), bytes(0x57, 0xdd, 0x4b, 0xfb));
});
test('408: vfwnmsac.vf', () => {
  assert.deepEqual(encodeVfwnmsacVf(1, 25, 28, 31), bytes(0xd7, 0x5f, 0x9e, 0xff));
});
test('409: vfadd.vv', () => {
  assert.deepEqual(encodeVfaddVv(1, 30, 2, 5), bytes(0xd7, 0x12, 0xe1, 0x03));
});
test('410: vfredusum.vs', () => {
  assert.deepEqual(encodeVfredusumVs(1, 4, 7, 10), bytes(0x57, 0x95, 0x43, 0x06));
});
test('411: vfsub.vv', () => {
  assert.deepEqual(encodeVfsubVv(1, 9, 12, 15), bytes(0xd7, 0x17, 0x96, 0x0a));
});
test('412: vfredosum.vs', () => {
  assert.deepEqual(encodeVfredosumVs(1, 14, 17, 20), bytes(0x57, 0x9a, 0xe8, 0x0e));
});
test('413: vfmin.vv', () => {
  assert.deepEqual(encodeVfminVv(1, 19, 22, 25), bytes(0xd7, 0x1c, 0x3b, 0x13));
});
test('414: vfredmin.vs', () => {
  assert.deepEqual(encodeVfredminVs(1, 24, 27, 30), bytes(0x57, 0x9f, 0x8d, 0x17));
});
test('415: vfmax.vv', () => {
  assert.deepEqual(encodeVfmaxVv(1, 29, 1, 4), bytes(0x57, 0x92, 0xd0, 0x1b));
});
test('416: vfredmax.vs', () => {
  assert.deepEqual(encodeVfredmaxVs(1, 3, 6, 9), bytes(0xd7, 0x14, 0x33, 0x1e));
});
test('417: vfsgnj.vv', () => {
  assert.deepEqual(encodeVfsgnjVv(1, 8, 11, 14), bytes(0x57, 0x97, 0x85, 0x22));
});
test('418: vfsgnjn.vv', () => {
  assert.deepEqual(encodeVfsgnjnVv(1, 13, 16, 19), bytes(0xd7, 0x19, 0xd8, 0x26));
});
test('419: vfsgnjx.vv', () => {
  assert.deepEqual(encodeVfsgnjxVv(1, 18, 21, 24), bytes(0x57, 0x9c, 0x2a, 0x2b));
});
test('420: vfmv.f.s', () => {
  assert.deepEqual(encodeVfmvFS(20, 23), bytes(0xd7, 0x1b, 0x40, 0x43));
});
test('421: vmfeq.vv', () => {
  assert.deepEqual(encodeVmfeqVv(1, 28, 31, 3), bytes(0xd7, 0x91, 0xcf, 0x63));
});
test('422: vmfle.vv', () => {
  assert.deepEqual(encodeVmfleVv(1, 2, 5, 8), bytes(0x57, 0x94, 0x22, 0x66));
});
test('423: vmflt.vv', () => {
  assert.deepEqual(encodeVmfltVv(1, 7, 10, 13), bytes(0xd7, 0x16, 0x75, 0x6e));
});
test('424: vmfne.vv', () => {
  assert.deepEqual(encodeVmfneVv(1, 12, 15, 18), bytes(0x57, 0x99, 0xc7, 0x72));
});
test('425: vfdiv.vv', () => {
  assert.deepEqual(encodeVfdivVv(1, 17, 20, 23), bytes(0xd7, 0x1b, 0x1a, 0x83));
});
test('426: vfmul.vv', () => {
  assert.deepEqual(encodeVfmulVv(1, 22, 25, 28), bytes(0x57, 0x9e, 0x6c, 0x93));
});
test('427: vfmadd.vv', () => {
  assert.deepEqual(encodeVfmaddVv(1, 27, 30, 2), bytes(0x57, 0x11, 0xbf, 0xa3));
});
test('428: vfnmadd.vv', () => {
  assert.deepEqual(encodeVfnmaddVv(1, 1, 4, 7), bytes(0xd7, 0x13, 0x12, 0xa6));
});
test('429: vfmsub.vv', () => {
  assert.deepEqual(encodeVfmsubVv(1, 6, 9, 12), bytes(0x57, 0x96, 0x64, 0xaa));
});
test('430: vfnmsub.vv', () => {
  assert.deepEqual(encodeVfnmsubVv(1, 11, 14, 17), bytes(0xd7, 0x18, 0xb7, 0xae));
});
test('431: vfmacc.vv', () => {
  assert.deepEqual(encodeVfmaccVv(1, 16, 19, 22), bytes(0x57, 0x9b, 0x09, 0xb3));
});
test('432: vfnmacc.vv', () => {
  assert.deepEqual(encodeVfnmaccVv(1, 21, 24, 27), bytes(0xd7, 0x1d, 0x5c, 0xb7));
});
test('433: vfmsac.vv', () => {
  assert.deepEqual(encodeVfmsacVv(1, 26, 29, 1), bytes(0xd7, 0x90, 0xae, 0xbb));
});
test('434: vfnmsac.vv', () => {
  assert.deepEqual(encodeVfnmsacVv(1, 31, 3, 6), bytes(0x57, 0x93, 0xf1, 0xbf));
});
test('435: vfcvt.xu.f.v', () => {
  assert.deepEqual(encodeVfcvtXuFV(1, 5, 8), bytes(0x57, 0x14, 0x50, 0x4a));
});
test('436: vfcvt.x.f.v', () => {
  assert.deepEqual(encodeVfcvtXFV(1, 10, 13), bytes(0xd7, 0x96, 0xa0, 0x4a));
});
test('437: vfcvt.f.xu.v', () => {
  assert.deepEqual(encodeVfcvtFXuV(1, 15, 18), bytes(0x57, 0x19, 0xf1, 0x4a));
});
test('438: vfcvt.f.x.v', () => {
  assert.deepEqual(encodeVfcvtFXV(1, 20, 23), bytes(0xd7, 0x9b, 0x41, 0x4b));
});
test('439: vfcvt.rtz.xu.f.v', () => {
  assert.deepEqual(encodeVfcvtRtzXuFV(1, 25, 28), bytes(0x57, 0x1e, 0x93, 0x4b));
});
test('440: vfcvt.rtz.x.f.v', () => {
  assert.deepEqual(encodeVfcvtRtzXFV(1, 30, 2), bytes(0x57, 0x91, 0xe3, 0x4b));
});
test('441: vfwcvt.xu.f.v', () => {
  assert.deepEqual(encodeVfwcvtXuFV(1, 4, 7), bytes(0xd7, 0x13, 0x44, 0x4a));
});
test('442: vfwcvt.x.f.v', () => {
  assert.deepEqual(encodeVfwcvtXFV(1, 9, 12), bytes(0x57, 0x96, 0x94, 0x4a));
});
test('443: vfwcvt.f.xu.v', () => {
  assert.deepEqual(encodeVfwcvtFXuV(1, 14, 17), bytes(0xd7, 0x18, 0xe5, 0x4a));
});
test('444: vfwcvt.f.x.v', () => {
  assert.deepEqual(encodeVfwcvtFXV(1, 19, 22), bytes(0x57, 0x9b, 0x35, 0x4b));
});
test('445: vfwcvt.f.f.v', () => {
  assert.deepEqual(encodeVfwcvtFFV(1, 24, 27), bytes(0xd7, 0x1d, 0x86, 0x4b));
});
test('446: vfwcvt.rtz.xu.f.v', () => {
  assert.deepEqual(encodeVfwcvtRtzXuFV(1, 29, 1), bytes(0xd7, 0x10, 0xd7, 0x4b));
});
test('447: vfwcvt.rtz.x.f.v', () => {
  assert.deepEqual(encodeVfwcvtRtzXFV(1, 3, 6), bytes(0x57, 0x93, 0x37, 0x4a));
});
test('448: vfncvt.xu.f.w', () => {
  assert.deepEqual(encodeVfncvtXuFW(1, 8, 11), bytes(0xd7, 0x15, 0x88, 0x4a));
});
test('449: vfncvt.x.f.w', () => {
  assert.deepEqual(encodeVfncvtXFW(1, 13, 16), bytes(0x57, 0x98, 0xd8, 0x4a));
});
test('450: vfncvt.f.xu.w', () => {
  assert.deepEqual(encodeVfncvtFXuW(1, 18, 21), bytes(0xd7, 0x1a, 0x29, 0x4b));
});
test('451: vfncvt.f.x.w', () => {
  assert.deepEqual(encodeVfncvtFXW(1, 23, 26), bytes(0x57, 0x9d, 0x79, 0x4b));
});
test('452: vfncvt.f.f.w', () => {
  assert.deepEqual(encodeVfncvtFFW(1, 28, 31), bytes(0xd7, 0x1f, 0xca, 0x4b));
});
test('453: vfncvt.rod.f.f.w', () => {
  assert.deepEqual(encodeVfncvtRodFFW(1, 2, 5), bytes(0xd7, 0x92, 0x2a, 0x4a));
});
test('454: vfncvt.rtz.xu.f.w', () => {
  assert.deepEqual(encodeVfncvtRtzXuFW(1, 7, 10), bytes(0x57, 0x15, 0x7b, 0x4a));
});
test('455: vfncvt.rtz.x.f.w', () => {
  assert.deepEqual(encodeVfncvtRtzXFW(1, 12, 15), bytes(0xd7, 0x97, 0xcb, 0x4a));
});
test('456: vfsqrt.v', () => {
  assert.deepEqual(encodeVfsqrtV(1, 17, 20), bytes(0x57, 0x1a, 0x10, 0x4f));
});
test('457: vfrsqrt7.v', () => {
  assert.deepEqual(encodeVfrsqrt7V(1, 22, 25), bytes(0xd7, 0x1c, 0x62, 0x4f));
});
test('458: vfrec7.v', () => {
  assert.deepEqual(encodeVfrec7V(1, 27, 30), bytes(0x57, 0x9f, 0xb2, 0x4f));
});
test('459: vfclass.v', () => {
  assert.deepEqual(encodeVfclassV(1, 1, 4), bytes(0x57, 0x12, 0x18, 0x4e));
});
test('460: vfwadd.vv', () => {
  assert.deepEqual(encodeVfwaddVv(1, 6, 9, 12), bytes(0x57, 0x96, 0x64, 0xc2));
});
test('461: vfwredusum.vs', () => {
  assert.deepEqual(encodeVfwredusumVs(1, 11, 14, 17), bytes(0xd7, 0x18, 0xb7, 0xc6));
});
test('462: vfwsub.vv', () => {
  assert.deepEqual(encodeVfwsubVv(1, 16, 19, 22), bytes(0x57, 0x9b, 0x09, 0xcb));
});
test('463: vfwredosum.vs', () => {
  assert.deepEqual(encodeVfwredosumVs(1, 21, 24, 27), bytes(0xd7, 0x1d, 0x5c, 0xcf));
});
test('464: vfwadd.wv', () => {
  assert.deepEqual(encodeVfwaddWv(1, 26, 29, 1), bytes(0xd7, 0x90, 0xae, 0xd3));
});
test('465: vfwsub.wv', () => {
  assert.deepEqual(encodeVfwsubWv(1, 31, 3, 6), bytes(0x57, 0x93, 0xf1, 0xdb));
});
test('466: vfwmul.vv', () => {
  assert.deepEqual(encodeVfwmulVv(1, 5, 8, 11), bytes(0xd7, 0x15, 0x54, 0xe2));
});
test('467: vfwmacc.vv', () => {
  assert.deepEqual(encodeVfwmaccVv(1, 10, 13, 16), bytes(0x57, 0x98, 0xa6, 0xf2));
});
test('468: vfwnmacc.vv', () => {
  assert.deepEqual(encodeVfwnmaccVv(1, 15, 18, 21), bytes(0xd7, 0x1a, 0xf9, 0xf6));
});
test('469: vfwmsac.vv', () => {
  assert.deepEqual(encodeVfwmsacVv(1, 20, 23, 26), bytes(0x57, 0x9d, 0x4b, 0xfb));
});
test('470: vfwnmsac.vv', () => {
  assert.deepEqual(encodeVfwnmsacVv(1, 25, 28, 31), bytes(0xd7, 0x1f, 0x9e, 0xff));
});
test('471: vadd.vx', () => {
  assert.deepEqual(encodeVaddVx(1, 30, 2, 5), bytes(0xd7, 0x42, 0xe1, 0x03));
});
test('472: vsub.vx', () => {
  assert.deepEqual(encodeVsubVx(1, 4, 7, 10), bytes(0x57, 0xc5, 0x43, 0x0a));
});
test('473: vrsub.vx', () => {
  assert.deepEqual(encodeVrsubVx(1, 9, 12, 15), bytes(0xd7, 0x47, 0x96, 0x0e));
});
test('474: vminu.vx', () => {
  assert.deepEqual(encodeVminuVx(1, 14, 17, 20), bytes(0x57, 0xca, 0xe8, 0x12));
});
test('475: vmin.vx', () => {
  assert.deepEqual(encodeVminVx(1, 19, 22, 25), bytes(0xd7, 0x4c, 0x3b, 0x17));
});
test('476: vmaxu.vx', () => {
  assert.deepEqual(encodeVmaxuVx(1, 24, 27, 30), bytes(0x57, 0xcf, 0x8d, 0x1b));
});
test('477: vmax.vx', () => {
  assert.deepEqual(encodeVmaxVx(1, 29, 1, 4), bytes(0x57, 0xc2, 0xd0, 0x1f));
});
test('478: vand.vx', () => {
  assert.deepEqual(encodeVandVx(1, 3, 6, 9), bytes(0xd7, 0x44, 0x33, 0x26));
});
test('479: vor.vx', () => {
  assert.deepEqual(encodeVorVx(1, 8, 11, 14), bytes(0x57, 0xc7, 0x85, 0x2a));
});
test('480: vxor.vx', () => {
  assert.deepEqual(encodeVxorVx(1, 13, 16, 19), bytes(0xd7, 0x49, 0xd8, 0x2e));
});
test('481: vrgather.vx', () => {
  assert.deepEqual(encodeVrgatherVx(1, 18, 21, 24), bytes(0x57, 0xcc, 0x2a, 0x33));
});
test('482: vslideup.vx', () => {
  assert.deepEqual(encodeVslideupVx(1, 23, 26, 29), bytes(0xd7, 0x4e, 0x7d, 0x3b));
});
test('483: vslidedown.vx', () => {
  assert.deepEqual(encodeVslidedownVx(1, 28, 31, 3), bytes(0xd7, 0xc1, 0xcf, 0x3f));
});
test('484: vadc.vxm', () => {
  assert.deepEqual(encodeVadcVxm(30, 2, 5), bytes(0xd7, 0x42, 0xe1, 0x41));
});
test('485: vmadc.vxm', () => {
  assert.deepEqual(encodeVmadcVxm(4, 7, 10), bytes(0x57, 0xc5, 0x43, 0x44));
});
test('486: vmadc.vx', () => {
  assert.deepEqual(encodeVmadcVx(9, 12, 15), bytes(0xd7, 0x47, 0x96, 0x46));
});
test('487: vsbc.vxm', () => {
  assert.deepEqual(encodeVsbcVxm(14, 17, 20), bytes(0x57, 0xca, 0xe8, 0x48));
});
test('488: vmsbc.vxm', () => {
  assert.deepEqual(encodeVmsbcVxm(19, 22, 25), bytes(0xd7, 0x4c, 0x3b, 0x4d));
});
test('489: vmsbc.vx', () => {
  assert.deepEqual(encodeVmsbcVx(24, 27, 30), bytes(0x57, 0xcf, 0x8d, 0x4f));
});
test('490: vmerge.vxm', () => {
  assert.deepEqual(encodeVmergeVxm(29, 1, 4), bytes(0x57, 0xc2, 0xd0, 0x5d));
});
test('491: vmv.v.x', () => {
  assert.deepEqual(encodeVmvVX(3, 6), bytes(0x57, 0xc3, 0x01, 0x5e));
});
test('492: vmseq.vx', () => {
  assert.deepEqual(encodeVmseqVx(1, 11, 14, 17), bytes(0xd7, 0x48, 0xb7, 0x62));
});
test('493: vmsne.vx', () => {
  assert.deepEqual(encodeVmsneVx(1, 16, 19, 22), bytes(0x57, 0xcb, 0x09, 0x67));
});
test('494: vmsltu.vx', () => {
  assert.deepEqual(encodeVmsltuVx(1, 21, 24, 27), bytes(0xd7, 0x4d, 0x5c, 0x6b));
});
test('495: vmslt.vx', () => {
  assert.deepEqual(encodeVmsltVx(1, 26, 29, 1), bytes(0xd7, 0xc0, 0xae, 0x6f));
});
test('496: vmsleu.vx', () => {
  assert.deepEqual(encodeVmsleuVx(1, 31, 3, 6), bytes(0x57, 0xc3, 0xf1, 0x73));
});
test('497: vmsle.vx', () => {
  assert.deepEqual(encodeVmsleVx(1, 5, 8, 11), bytes(0xd7, 0x45, 0x54, 0x76));
});
test('498: vmsgtu.vx', () => {
  assert.deepEqual(encodeVmsgtuVx(1, 10, 13, 16), bytes(0x57, 0xc8, 0xa6, 0x7a));
});
test('499: vmsgt.vx', () => {
  assert.deepEqual(encodeVmsgtVx(1, 15, 18, 21), bytes(0xd7, 0x4a, 0xf9, 0x7e));
});
test('500: vsaddu.vx', () => {
  assert.deepEqual(encodeVsadduVx(1, 20, 23, 26), bytes(0x57, 0xcd, 0x4b, 0x83));
});
test('501: vsadd.vx', () => {
  assert.deepEqual(encodeVsaddVx(1, 25, 28, 31), bytes(0xd7, 0x4f, 0x9e, 0x87));
});
test('502: vssubu.vx', () => {
  assert.deepEqual(encodeVssubuVx(1, 30, 2, 5), bytes(0xd7, 0x42, 0xe1, 0x8b));
});
test('503: vssub.vx', () => {
  assert.deepEqual(encodeVssubVx(1, 4, 7, 10), bytes(0x57, 0xc5, 0x43, 0x8e));
});
test('504: vsll.vx', () => {
  assert.deepEqual(encodeVsllVx(1, 9, 12, 15), bytes(0xd7, 0x47, 0x96, 0x96));
});
test('505: vsmul.vx', () => {
  assert.deepEqual(encodeVsmulVx(1, 14, 17, 20), bytes(0x57, 0xca, 0xe8, 0x9e));
});
test('506: vsrl.vx', () => {
  assert.deepEqual(encodeVsrlVx(1, 19, 22, 25), bytes(0xd7, 0x4c, 0x3b, 0xa3));
});
test('507: vsra.vx', () => {
  assert.deepEqual(encodeVsraVx(1, 24, 27, 30), bytes(0x57, 0xcf, 0x8d, 0xa7));
});
test('508: vssrl.vx', () => {
  assert.deepEqual(encodeVssrlVx(1, 29, 1, 4), bytes(0x57, 0xc2, 0xd0, 0xab));
});
test('509: vssra.vx', () => {
  assert.deepEqual(encodeVssraVx(1, 3, 6, 9), bytes(0xd7, 0x44, 0x33, 0xae));
});
test('510: vnsrl.wx', () => {
  assert.deepEqual(encodeVnsrlWx(1, 8, 11, 14), bytes(0x57, 0xc7, 0x85, 0xb2));
});
test('511: vnsra.wx', () => {
  assert.deepEqual(encodeVnsraWx(1, 13, 16, 19), bytes(0xd7, 0x49, 0xd8, 0xb6));
});
test('512: vnclipu.wx', () => {
  assert.deepEqual(encodeVnclipuWx(1, 18, 21, 24), bytes(0x57, 0xcc, 0x2a, 0xbb));
});
test('513: vnclip.wx', () => {
  assert.deepEqual(encodeVnclipWx(1, 23, 26, 29), bytes(0xd7, 0x4e, 0x7d, 0xbf));
});
test('514: vadd.vv', () => {
  assert.deepEqual(encodeVaddVv(1, 28, 31, 3), bytes(0xd7, 0x81, 0xcf, 0x03));
});
test('515: vsub.vv', () => {
  assert.deepEqual(encodeVsubVv(1, 2, 5, 8), bytes(0x57, 0x84, 0x22, 0x0a));
});
test('516: vminu.vv', () => {
  assert.deepEqual(encodeVminuVv(1, 7, 10, 13), bytes(0xd7, 0x06, 0x75, 0x12));
});
test('517: vmin.vv', () => {
  assert.deepEqual(encodeVminVv(1, 12, 15, 18), bytes(0x57, 0x89, 0xc7, 0x16));
});
test('518: vmaxu.vv', () => {
  assert.deepEqual(encodeVmaxuVv(1, 17, 20, 23), bytes(0xd7, 0x0b, 0x1a, 0x1b));
});
test('519: vmax.vv', () => {
  assert.deepEqual(encodeVmaxVv(1, 22, 25, 28), bytes(0x57, 0x8e, 0x6c, 0x1f));
});
test('520: vand.vv', () => {
  assert.deepEqual(encodeVandVv(1, 27, 30, 2), bytes(0x57, 0x01, 0xbf, 0x27));
});
test('521: vor.vv', () => {
  assert.deepEqual(encodeVorVv(1, 1, 4, 7), bytes(0xd7, 0x03, 0x12, 0x2a));
});
test('522: vxor.vv', () => {
  assert.deepEqual(encodeVxorVv(1, 6, 9, 12), bytes(0x57, 0x86, 0x64, 0x2e));
});
test('523: vrgather.vv', () => {
  assert.deepEqual(encodeVrgatherVv(1, 11, 14, 17), bytes(0xd7, 0x08, 0xb7, 0x32));
});
test('524: vrgatherei16.vv', () => {
  assert.deepEqual(encodeVrgatherei16Vv(1, 16, 19, 22), bytes(0x57, 0x8b, 0x09, 0x3b));
});
test('525: vadc.vvm', () => {
  assert.deepEqual(encodeVadcVvm(18, 21, 24), bytes(0x57, 0x8c, 0x2a, 0x41));
});
test('526: vmadc.vvm', () => {
  assert.deepEqual(encodeVmadcVvm(23, 26, 29), bytes(0xd7, 0x0e, 0x7d, 0x45));
});
test('527: vmadc.vv', () => {
  assert.deepEqual(encodeVmadcVv(28, 31, 3), bytes(0xd7, 0x81, 0xcf, 0x47));
});
test('528: vsbc.vvm', () => {
  assert.deepEqual(encodeVsbcVvm(2, 5, 8), bytes(0x57, 0x84, 0x22, 0x48));
});
test('529: vmsbc.vvm', () => {
  assert.deepEqual(encodeVmsbcVvm(7, 10, 13), bytes(0xd7, 0x06, 0x75, 0x4c));
});
test('530: vmsbc.vv', () => {
  assert.deepEqual(encodeVmsbcVv(12, 15, 18), bytes(0x57, 0x89, 0xc7, 0x4e));
});
test('531: vmerge.vvm', () => {
  assert.deepEqual(encodeVmergeVvm(17, 20, 23), bytes(0xd7, 0x0b, 0x1a, 0x5d));
});
test('532: vmv.v.v', () => {
  assert.deepEqual(encodeVmvVV(22, 25), bytes(0xd7, 0x0c, 0x0b, 0x5e));
});
test('533: vmseq.vv', () => {
  assert.deepEqual(encodeVmseqVv(1, 30, 2, 5), bytes(0xd7, 0x02, 0xe1, 0x63));
});
test('534: vmsne.vv', () => {
  assert.deepEqual(encodeVmsneVv(1, 4, 7, 10), bytes(0x57, 0x85, 0x43, 0x66));
});
test('535: vmsltu.vv', () => {
  assert.deepEqual(encodeVmsltuVv(1, 9, 12, 15), bytes(0xd7, 0x07, 0x96, 0x6a));
});
test('536: vmslt.vv', () => {
  assert.deepEqual(encodeVmsltVv(1, 14, 17, 20), bytes(0x57, 0x8a, 0xe8, 0x6e));
});
test('537: vmsleu.vv', () => {
  assert.deepEqual(encodeVmsleuVv(1, 19, 22, 25), bytes(0xd7, 0x0c, 0x3b, 0x73));
});
test('538: vmsle.vv', () => {
  assert.deepEqual(encodeVmsleVv(1, 24, 27, 30), bytes(0x57, 0x8f, 0x8d, 0x77));
});
test('539: vsaddu.vv', () => {
  assert.deepEqual(encodeVsadduVv(1, 29, 1, 4), bytes(0x57, 0x82, 0xd0, 0x83));
});
test('540: vsadd.vv', () => {
  assert.deepEqual(encodeVsaddVv(1, 3, 6, 9), bytes(0xd7, 0x04, 0x33, 0x86));
});
test('541: vssubu.vv', () => {
  assert.deepEqual(encodeVssubuVv(1, 8, 11, 14), bytes(0x57, 0x87, 0x85, 0x8a));
});
test('542: vssub.vv', () => {
  assert.deepEqual(encodeVssubVv(1, 13, 16, 19), bytes(0xd7, 0x09, 0xd8, 0x8e));
});
test('543: vsll.vv', () => {
  assert.deepEqual(encodeVsllVv(1, 18, 21, 24), bytes(0x57, 0x8c, 0x2a, 0x97));
});
test('544: vsmul.vv', () => {
  assert.deepEqual(encodeVsmulVv(1, 23, 26, 29), bytes(0xd7, 0x0e, 0x7d, 0x9f));
});
test('545: vsrl.vv', () => {
  assert.deepEqual(encodeVsrlVv(1, 28, 31, 3), bytes(0xd7, 0x81, 0xcf, 0xa3));
});
test('546: vsra.vv', () => {
  assert.deepEqual(encodeVsraVv(1, 2, 5, 8), bytes(0x57, 0x84, 0x22, 0xa6));
});
test('547: vssrl.vv', () => {
  assert.deepEqual(encodeVssrlVv(1, 7, 10, 13), bytes(0xd7, 0x06, 0x75, 0xaa));
});
test('548: vssra.vv', () => {
  assert.deepEqual(encodeVssraVv(1, 12, 15, 18), bytes(0x57, 0x89, 0xc7, 0xae));
});
test('549: vnsrl.wv', () => {
  assert.deepEqual(encodeVnsrlWv(1, 17, 20, 23), bytes(0xd7, 0x0b, 0x1a, 0xb3));
});
test('550: vnsra.wv', () => {
  assert.deepEqual(encodeVnsraWv(1, 22, 25, 28), bytes(0x57, 0x8e, 0x6c, 0xb7));
});
test('551: vnclipu.wv', () => {
  assert.deepEqual(encodeVnclipuWv(1, 27, 30, 2), bytes(0x57, 0x01, 0xbf, 0xbb));
});
test('552: vnclip.wv', () => {
  assert.deepEqual(encodeVnclipWv(1, 1, 4, 7), bytes(0xd7, 0x03, 0x12, 0xbe));
});
test('553: vwredsumu.vs', () => {
  assert.deepEqual(encodeVwredsumuVs(1, 6, 9, 12), bytes(0x57, 0x86, 0x64, 0xc2));
});
test('554: vwredsum.vs', () => {
  assert.deepEqual(encodeVwredsumVs(1, 11, 14, 17), bytes(0xd7, 0x08, 0xb7, 0xc6));
});
test('555: vadd.vi', () => {
  assert.deepEqual(encodeVaddVi(1, 16, 19, 22), bytes(0x57, 0xbb, 0x09, 0x03));
});
test('556: vrsub.vi', () => {
  assert.deepEqual(encodeVrsubVi(1, 21, 24, 27), bytes(0xd7, 0x3d, 0x5c, 0x0f));
});
test('557: vand.vi', () => {
  assert.deepEqual(encodeVandVi(1, 26, 29, 1), bytes(0xd7, 0xb0, 0xae, 0x27));
});
test('558: vor.vi', () => {
  assert.deepEqual(encodeVorVi(1, 31, 3, 6), bytes(0x57, 0xb3, 0xf1, 0x2b));
});
test('559: vxor.vi', () => {
  assert.deepEqual(encodeVxorVi(1, 5, 8, 11), bytes(0xd7, 0x35, 0x54, 0x2e));
});
test('560: vrgather.vi', () => {
  assert.deepEqual(encodeVrgatherVi(1, 10, 13, 16), bytes(0x57, 0xb8, 0xa6, 0x32));
});
test('561: vslideup.vi', () => {
  assert.deepEqual(encodeVslideupVi(1, 15, 18, 21), bytes(0xd7, 0x3a, 0xf9, 0x3a));
});
test('562: vslidedown.vi', () => {
  assert.deepEqual(encodeVslidedownVi(1, 20, 23, 26), bytes(0x57, 0xbd, 0x4b, 0x3f));
});
test('563: vadc.vim', () => {
  assert.deepEqual(encodeVadcVim(22, 25, 28), bytes(0x57, 0xbe, 0x6c, 0x41));
});
test('564: vmadc.vim', () => {
  assert.deepEqual(encodeVmadcVim(27, 30, 2), bytes(0x57, 0x31, 0xbf, 0x45));
});
test('565: vmadc.vi', () => {
  assert.deepEqual(encodeVmadcVi(1, 4, 7), bytes(0xd7, 0x33, 0x12, 0x46));
});
test('566: vmerge.vim', () => {
  assert.deepEqual(encodeVmergeVim(6, 9, 12), bytes(0x57, 0xb6, 0x64, 0x5c));
});
test('567: vmv.v.i', () => {
  assert.deepEqual(encodeVmvVI(11, 14), bytes(0x57, 0xb7, 0x05, 0x5e));
});
test('568: vmseq.vi', () => {
  assert.deepEqual(encodeVmseqVi(1, 19, 22, 25), bytes(0xd7, 0x3c, 0x3b, 0x63));
});
test('569: vmsne.vi', () => {
  assert.deepEqual(encodeVmsneVi(1, 24, 27, 30), bytes(0x57, 0xbf, 0x8d, 0x67));
});
test('570: vmsleu.vi', () => {
  assert.deepEqual(encodeVmsleuVi(1, 29, 1, 4), bytes(0x57, 0xb2, 0xd0, 0x73));
});
test('571: vmsle.vi', () => {
  assert.deepEqual(encodeVmsleVi(1, 3, 6, 9), bytes(0xd7, 0x34, 0x33, 0x76));
});
test('572: vmsgtu.vi', () => {
  assert.deepEqual(encodeVmsgtuVi(1, 8, 11, 14), bytes(0x57, 0xb7, 0x85, 0x7a));
});
test('573: vmsgt.vi', () => {
  assert.deepEqual(encodeVmsgtVi(1, 13, 16, 19), bytes(0xd7, 0x39, 0xd8, 0x7e));
});
test('574: vsaddu.vi', () => {
  assert.deepEqual(encodeVsadduVi(1, 18, 21, 24), bytes(0x57, 0xbc, 0x2a, 0x83));
});
test('575: vsadd.vi', () => {
  assert.deepEqual(encodeVsaddVi(1, 23, 26, 29), bytes(0xd7, 0x3e, 0x7d, 0x87));
});
test('576: vsll.vi', () => {
  assert.deepEqual(encodeVsllVi(1, 28, 31, 3), bytes(0xd7, 0xb1, 0xcf, 0x97));
});
test('577: vmv1r.v', () => {
  assert.deepEqual(encodeVmv1rV(30, 2), bytes(0x57, 0x31, 0xe0, 0x9f));
});
test('578: vmv2r.v', () => {
  assert.deepEqual(encodeVmv2rV(4, 7), bytes(0xd7, 0xb3, 0x40, 0x9e));
});
test('579: vmv4r.v', () => {
  assert.deepEqual(encodeVmv4rV(9, 12), bytes(0x57, 0xb6, 0x91, 0x9e));
});
test('580: vmv8r.v', () => {
  assert.deepEqual(encodeVmv8rV(14, 17), bytes(0xd7, 0xb8, 0xe3, 0x9e));
});
test('581: vsrl.vi', () => {
  assert.deepEqual(encodeVsrlVi(1, 22, 25, 28), bytes(0x57, 0xbe, 0x6c, 0xa3));
});
test('582: vsra.vi', () => {
  assert.deepEqual(encodeVsraVi(1, 27, 30, 2), bytes(0x57, 0x31, 0xbf, 0xa7));
});
test('583: vssrl.vi', () => {
  assert.deepEqual(encodeVssrlVi(1, 1, 4, 7), bytes(0xd7, 0x33, 0x12, 0xaa));
});
test('584: vssra.vi', () => {
  assert.deepEqual(encodeVssraVi(1, 6, 9, 12), bytes(0x57, 0xb6, 0x64, 0xae));
});
test('585: vnsrl.wi', () => {
  assert.deepEqual(encodeVnsrlWi(1, 11, 14, 17), bytes(0xd7, 0x38, 0xb7, 0xb2));
});
test('586: vnsra.wi', () => {
  assert.deepEqual(encodeVnsraWi(1, 16, 19, 22), bytes(0x57, 0xbb, 0x09, 0xb7));
});
test('587: vnclipu.wi', () => {
  assert.deepEqual(encodeVnclipuWi(1, 21, 24, 27), bytes(0xd7, 0x3d, 0x5c, 0xbb));
});
test('588: vnclip.wi', () => {
  assert.deepEqual(encodeVnclipWi(1, 26, 29, 1), bytes(0xd7, 0xb0, 0xae, 0xbf));
});
test('589: vredsum.vs', () => {
  assert.deepEqual(encodeVredsumVs(1, 31, 3, 6), bytes(0x57, 0xa3, 0xf1, 0x03));
});
test('590: vredand.vs', () => {
  assert.deepEqual(encodeVredandVs(1, 5, 8, 11), bytes(0xd7, 0x25, 0x54, 0x06));
});
test('591: vredor.vs', () => {
  assert.deepEqual(encodeVredorVs(1, 10, 13, 16), bytes(0x57, 0xa8, 0xa6, 0x0a));
});
test('592: vredxor.vs', () => {
  assert.deepEqual(encodeVredxorVs(1, 15, 18, 21), bytes(0xd7, 0x2a, 0xf9, 0x0e));
});
test('593: vredminu.vs', () => {
  assert.deepEqual(encodeVredminuVs(1, 20, 23, 26), bytes(0x57, 0xad, 0x4b, 0x13));
});
test('594: vredmin.vs', () => {
  assert.deepEqual(encodeVredminVs(1, 25, 28, 31), bytes(0xd7, 0x2f, 0x9e, 0x17));
});
test('595: vredmaxu.vs', () => {
  assert.deepEqual(encodeVredmaxuVs(1, 30, 2, 5), bytes(0xd7, 0x22, 0xe1, 0x1b));
});
test('596: vredmax.vs', () => {
  assert.deepEqual(encodeVredmaxVs(1, 4, 7, 10), bytes(0x57, 0xa5, 0x43, 0x1e));
});
test('597: vaaddu.vv', () => {
  assert.deepEqual(encodeVaadduVv(1, 9, 12, 15), bytes(0xd7, 0x27, 0x96, 0x22));
});
test('598: vaadd.vv', () => {
  assert.deepEqual(encodeVaaddVv(1, 14, 17, 20), bytes(0x57, 0xaa, 0xe8, 0x26));
});
test('599: vasubu.vv', () => {
  assert.deepEqual(encodeVasubuVv(1, 19, 22, 25), bytes(0xd7, 0x2c, 0x3b, 0x2b));
});
test('600: vasub.vv', () => {
  assert.deepEqual(encodeVasubVv(1, 24, 27, 30), bytes(0x57, 0xaf, 0x8d, 0x2f));
});
test('601: vmv.x.s', () => {
  assert.deepEqual(encodeVmvXS(26, 29), bytes(0xd7, 0x2e, 0xa0, 0x43));
});
test('602: vzext.vf8', () => {
  assert.deepEqual(encodeVzextVf8(1, 3, 6), bytes(0x57, 0x23, 0x31, 0x4a));
});
test('603: vsext.vf8', () => {
  assert.deepEqual(encodeVsextVf8(1, 8, 11), bytes(0xd7, 0xa5, 0x81, 0x4a));
});
test('604: vzext.vf4', () => {
  assert.deepEqual(encodeVzextVf4(1, 13, 16), bytes(0x57, 0x28, 0xd2, 0x4a));
});
test('605: vsext.vf4', () => {
  assert.deepEqual(encodeVsextVf4(1, 18, 21), bytes(0xd7, 0xaa, 0x22, 0x4b));
});
test('606: vzext.vf2', () => {
  assert.deepEqual(encodeVzextVf2(1, 23, 26), bytes(0x57, 0x2d, 0x73, 0x4b));
});
test('607: vsext.vf2', () => {
  assert.deepEqual(encodeVsextVf2(1, 28, 31), bytes(0xd7, 0xaf, 0xc3, 0x4b));
});
test('608: vcompress.vm', () => {
  assert.deepEqual(encodeVcompressVm(30, 2, 5), bytes(0xd7, 0x22, 0xe1, 0x5f));
});
test('609: vmandn.mm', () => {
  assert.deepEqual(encodeVmandnMm(4, 7, 10), bytes(0x57, 0xa5, 0x43, 0x62));
});
test('610: vmand.mm', () => {
  assert.deepEqual(encodeVmandMm(9, 12, 15), bytes(0xd7, 0x27, 0x96, 0x66));
});
test('611: vmor.mm', () => {
  assert.deepEqual(encodeVmorMm(14, 17, 20), bytes(0x57, 0xaa, 0xe8, 0x6a));
});
test('612: vmxor.mm', () => {
  assert.deepEqual(encodeVmxorMm(19, 22, 25), bytes(0xd7, 0x2c, 0x3b, 0x6f));
});
test('613: vmorn.mm', () => {
  assert.deepEqual(encodeVmornMm(24, 27, 30), bytes(0x57, 0xaf, 0x8d, 0x73));
});
test('614: vmnand.mm', () => {
  assert.deepEqual(encodeVmnandMm(29, 1, 4), bytes(0x57, 0xa2, 0xd0, 0x77));
});
test('615: vmnor.mm', () => {
  assert.deepEqual(encodeVmnorMm(3, 6, 9), bytes(0xd7, 0x24, 0x33, 0x7a));
});
test('616: vmxnor.mm', () => {
  assert.deepEqual(encodeVmxnorMm(8, 11, 14), bytes(0x57, 0xa7, 0x85, 0x7e));
});
test('617: vmsbf.m', () => {
  assert.deepEqual(encodeVmsbfM(1, 16, 19), bytes(0xd7, 0xa9, 0x00, 0x53));
});
test('618: vmsof.m', () => {
  assert.deepEqual(encodeVmsofM(1, 21, 24), bytes(0x57, 0x2c, 0x51, 0x53));
});
test('619: vmsif.m', () => {
  assert.deepEqual(encodeVmsifM(1, 26, 29), bytes(0xd7, 0xae, 0xa1, 0x53));
});
test('620: viota.m', () => {
  assert.deepEqual(encodeViotaM(1, 31, 3), bytes(0xd7, 0x21, 0xf8, 0x53));
});
test('621: vid.v', () => {
  assert.deepEqual(encodeVidV(1, 5), bytes(0xd7, 0xa2, 0x08, 0x52));
});
test('622: vcpop.m', () => {
  assert.deepEqual(encodeVcpopM(1, 10, 13), bytes(0xd7, 0x26, 0xa8, 0x42));
});
test('623: vfirst.m', () => {
  assert.deepEqual(encodeVfirstM(1, 15, 18), bytes(0x57, 0xa9, 0xf8, 0x42));
});
test('624: vdivu.vv', () => {
  assert.deepEqual(encodeVdivuVv(1, 20, 23, 26), bytes(0x57, 0xad, 0x4b, 0x83));
});
test('625: vdiv.vv', () => {
  assert.deepEqual(encodeVdivVv(1, 25, 28, 31), bytes(0xd7, 0x2f, 0x9e, 0x87));
});
test('626: vremu.vv', () => {
  assert.deepEqual(encodeVremuVv(1, 30, 2, 5), bytes(0xd7, 0x22, 0xe1, 0x8b));
});
test('627: vrem.vv', () => {
  assert.deepEqual(encodeVremVv(1, 4, 7, 10), bytes(0x57, 0xa5, 0x43, 0x8e));
});
test('628: vmulhu.vv', () => {
  assert.deepEqual(encodeVmulhuVv(1, 9, 12, 15), bytes(0xd7, 0x27, 0x96, 0x92));
});
test('629: vmul.vv', () => {
  assert.deepEqual(encodeVmulVv(1, 14, 17, 20), bytes(0x57, 0xaa, 0xe8, 0x96));
});
test('630: vmulhsu.vv', () => {
  assert.deepEqual(encodeVmulhsuVv(1, 19, 22, 25), bytes(0xd7, 0x2c, 0x3b, 0x9b));
});
test('631: vmulh.vv', () => {
  assert.deepEqual(encodeVmulhVv(1, 24, 27, 30), bytes(0x57, 0xaf, 0x8d, 0x9f));
});
test('632: vmadd.vv', () => {
  assert.deepEqual(encodeVmaddVv(1, 29, 1, 4), bytes(0x57, 0xa2, 0xd0, 0xa7));
});
test('633: vnmsub.vv', () => {
  assert.deepEqual(encodeVnmsubVv(1, 3, 6, 9), bytes(0xd7, 0x24, 0x33, 0xae));
});
test('634: vmacc.vv', () => {
  assert.deepEqual(encodeVmaccVv(1, 8, 11, 14), bytes(0x57, 0xa7, 0x85, 0xb6));
});
test('635: vnmsac.vv', () => {
  assert.deepEqual(encodeVnmsacVv(1, 13, 16, 19), bytes(0xd7, 0x29, 0xd8, 0xbe));
});
test('636: vwaddu.vv', () => {
  assert.deepEqual(encodeVwadduVv(1, 18, 21, 24), bytes(0x57, 0xac, 0x2a, 0xc3));
});
test('637: vwadd.vv', () => {
  assert.deepEqual(encodeVwaddVv(1, 23, 26, 29), bytes(0xd7, 0x2e, 0x7d, 0xc7));
});
test('638: vwsubu.vv', () => {
  assert.deepEqual(encodeVwsubuVv(1, 28, 31, 3), bytes(0xd7, 0xa1, 0xcf, 0xcb));
});
test('639: vwsub.vv', () => {
  assert.deepEqual(encodeVwsubVv(1, 2, 5, 8), bytes(0x57, 0xa4, 0x22, 0xce));
});
test('640: vwaddu.wv', () => {
  assert.deepEqual(encodeVwadduWv(1, 7, 10, 13), bytes(0xd7, 0x26, 0x75, 0xd2));
});
test('641: vwadd.wv', () => {
  assert.deepEqual(encodeVwaddWv(1, 12, 15, 18), bytes(0x57, 0xa9, 0xc7, 0xd6));
});
test('642: vwsubu.wv', () => {
  assert.deepEqual(encodeVwsubuWv(1, 17, 20, 23), bytes(0xd7, 0x2b, 0x1a, 0xdb));
});
test('643: vwsub.wv', () => {
  assert.deepEqual(encodeVwsubWv(1, 22, 25, 28), bytes(0x57, 0xae, 0x6c, 0xdf));
});
test('644: vwmulu.vv', () => {
  assert.deepEqual(encodeVwmuluVv(1, 27, 30, 2), bytes(0x57, 0x21, 0xbf, 0xe3));
});
test('645: vwmulsu.vv', () => {
  assert.deepEqual(encodeVwmulsuVv(1, 1, 4, 7), bytes(0xd7, 0x23, 0x12, 0xea));
});
test('646: vwmul.vv', () => {
  assert.deepEqual(encodeVwmulVv(1, 6, 9, 12), bytes(0x57, 0xa6, 0x64, 0xee));
});
test('647: vwmaccu.vv', () => {
  assert.deepEqual(encodeVwmaccuVv(1, 11, 14, 17), bytes(0xd7, 0x28, 0xb7, 0xf2));
});
test('648: vwmacc.vv', () => {
  assert.deepEqual(encodeVwmaccVv(1, 16, 19, 22), bytes(0x57, 0xab, 0x09, 0xf7));
});
test('649: vwmaccsu.vv', () => {
  assert.deepEqual(encodeVwmaccsuVv(1, 21, 24, 27), bytes(0xd7, 0x2d, 0x5c, 0xff));
});
test('650: vaaddu.vx', () => {
  assert.deepEqual(encodeVaadduVx(1, 26, 29, 1), bytes(0xd7, 0xe0, 0xae, 0x23));
});
test('651: vaadd.vx', () => {
  assert.deepEqual(encodeVaaddVx(1, 31, 3, 6), bytes(0x57, 0xe3, 0xf1, 0x27));
});
test('652: vasubu.vx', () => {
  assert.deepEqual(encodeVasubuVx(1, 5, 8, 11), bytes(0xd7, 0x65, 0x54, 0x2a));
});
test('653: vasub.vx', () => {
  assert.deepEqual(encodeVasubVx(1, 10, 13, 16), bytes(0x57, 0xe8, 0xa6, 0x2e));
});
test('654: vmv.s.x', () => {
  assert.deepEqual(encodeVmvSX(12, 15), bytes(0xd7, 0x67, 0x06, 0x42));
});
test('655: vslide1up.vx', () => {
  assert.deepEqual(encodeVslide1upVx(1, 20, 23, 26), bytes(0x57, 0xed, 0x4b, 0x3b));
});
test('656: vslide1down.vx', () => {
  assert.deepEqual(encodeVslide1downVx(1, 25, 28, 31), bytes(0xd7, 0x6f, 0x9e, 0x3f));
});
test('657: vdivu.vx', () => {
  assert.deepEqual(encodeVdivuVx(1, 30, 2, 5), bytes(0xd7, 0x62, 0xe1, 0x83));
});
test('658: vdiv.vx', () => {
  assert.deepEqual(encodeVdivVx(1, 4, 7, 10), bytes(0x57, 0xe5, 0x43, 0x86));
});
test('659: vremu.vx', () => {
  assert.deepEqual(encodeVremuVx(1, 9, 12, 15), bytes(0xd7, 0x67, 0x96, 0x8a));
});
test('660: vrem.vx', () => {
  assert.deepEqual(encodeVremVx(1, 14, 17, 20), bytes(0x57, 0xea, 0xe8, 0x8e));
});
test('661: vmulhu.vx', () => {
  assert.deepEqual(encodeVmulhuVx(1, 19, 22, 25), bytes(0xd7, 0x6c, 0x3b, 0x93));
});
test('662: vmul.vx', () => {
  assert.deepEqual(encodeVmulVx(1, 24, 27, 30), bytes(0x57, 0xef, 0x8d, 0x97));
});
test('663: vmulhsu.vx', () => {
  assert.deepEqual(encodeVmulhsuVx(1, 29, 1, 4), bytes(0x57, 0xe2, 0xd0, 0x9b));
});
test('664: vmulh.vx', () => {
  assert.deepEqual(encodeVmulhVx(1, 3, 6, 9), bytes(0xd7, 0x64, 0x33, 0x9e));
});
test('665: vmadd.vx', () => {
  assert.deepEqual(encodeVmaddVx(1, 8, 11, 14), bytes(0x57, 0xe7, 0x85, 0xa6));
});
test('666: vnmsub.vx', () => {
  assert.deepEqual(encodeVnmsubVx(1, 13, 16, 19), bytes(0xd7, 0x69, 0xd8, 0xae));
});
test('667: vmacc.vx', () => {
  assert.deepEqual(encodeVmaccVx(1, 18, 21, 24), bytes(0x57, 0xec, 0x2a, 0xb7));
});
test('668: vnmsac.vx', () => {
  assert.deepEqual(encodeVnmsacVx(1, 23, 26, 29), bytes(0xd7, 0x6e, 0x7d, 0xbf));
});
test('669: vwaddu.vx', () => {
  assert.deepEqual(encodeVwadduVx(1, 28, 31, 3), bytes(0xd7, 0xe1, 0xcf, 0xc3));
});
test('670: vwadd.vx', () => {
  assert.deepEqual(encodeVwaddVx(1, 2, 5, 8), bytes(0x57, 0xe4, 0x22, 0xc6));
});
test('671: vwsubu.vx', () => {
  assert.deepEqual(encodeVwsubuVx(1, 7, 10, 13), bytes(0xd7, 0x66, 0x75, 0xca));
});
test('672: vwsub.vx', () => {
  assert.deepEqual(encodeVwsubVx(1, 12, 15, 18), bytes(0x57, 0xe9, 0xc7, 0xce));
});
test('673: vwaddu.wx', () => {
  assert.deepEqual(encodeVwadduWx(1, 17, 20, 23), bytes(0xd7, 0x6b, 0x1a, 0xd3));
});
test('674: vwadd.wx', () => {
  assert.deepEqual(encodeVwaddWx(1, 22, 25, 28), bytes(0x57, 0xee, 0x6c, 0xd7));
});
test('675: vwsubu.wx', () => {
  assert.deepEqual(encodeVwsubuWx(1, 27, 30, 2), bytes(0x57, 0x61, 0xbf, 0xdb));
});
test('676: vwsub.wx', () => {
  assert.deepEqual(encodeVwsubWx(1, 1, 4, 7), bytes(0xd7, 0x63, 0x12, 0xde));
});
test('677: vwmulu.vx', () => {
  assert.deepEqual(encodeVwmuluVx(1, 6, 9, 12), bytes(0x57, 0xe6, 0x64, 0xe2));
});
test('678: vwmulsu.vx', () => {
  assert.deepEqual(encodeVwmulsuVx(1, 11, 14, 17), bytes(0xd7, 0x68, 0xb7, 0xea));
});
test('679: vwmul.vx', () => {
  assert.deepEqual(encodeVwmulVx(1, 16, 19, 22), bytes(0x57, 0xeb, 0x09, 0xef));
});
test('680: vwmaccu.vx', () => {
  assert.deepEqual(encodeVwmaccuVx(1, 21, 24, 27), bytes(0xd7, 0x6d, 0x5c, 0xf3));
});
test('681: vwmacc.vx', () => {
  assert.deepEqual(encodeVwmaccVx(1, 26, 29, 1), bytes(0xd7, 0xe0, 0xae, 0xf7));
});
test('682: vwmaccus.vx', () => {
  assert.deepEqual(encodeVwmaccusVx(1, 31, 3, 6), bytes(0x57, 0xe3, 0xf1, 0xfb));
});
test('683: vwmaccsu.vx', () => {
  assert.deepEqual(encodeVwmaccsuVx(1, 5, 8, 11), bytes(0xd7, 0x65, 0x54, 0xfe));
});
test('684: amoswap.b', () => {
  assert.deepEqual(encodeAmoswapB(7, 10, 13, 1, 1), bytes(0xaf, 0x03, 0xd5, 0x0e));
});
test('685: amoadd.b', () => {
  assert.deepEqual(encodeAmoaddB(12, 15, 18, 1, 1), bytes(0x2f, 0x86, 0x27, 0x07));
});
test('686: amoxor.b', () => {
  assert.deepEqual(encodeAmoxorB(17, 20, 23, 1, 1), bytes(0xaf, 0x08, 0x7a, 0x27));
});
test('687: amoand.b', () => {
  assert.deepEqual(encodeAmoandB(22, 25, 28, 1, 1), bytes(0x2f, 0x8b, 0xcc, 0x67));
});
test('688: amoor.b', () => {
  assert.deepEqual(encodeAmoorB(27, 30, 2, 1, 1), bytes(0xaf, 0x0d, 0x2f, 0x46));
});
test('689: amomin.b', () => {
  assert.deepEqual(encodeAmominB(1, 4, 7, 1, 1), bytes(0xaf, 0x00, 0x72, 0x86));
});
test('690: amomax.b', () => {
  assert.deepEqual(encodeAmomaxB(6, 9, 12, 1, 1), bytes(0x2f, 0x83, 0xc4, 0xa6));
});
test('691: amominu.b', () => {
  assert.deepEqual(encodeAmominuB(11, 14, 17, 1, 1), bytes(0xaf, 0x05, 0x17, 0xc7));
});
test('692: amomaxu.b', () => {
  assert.deepEqual(encodeAmomaxuB(16, 19, 22, 1, 1), bytes(0x2f, 0x88, 0x69, 0xe7));
});
test('693: amoswap.h', () => {
  assert.deepEqual(encodeAmoswapH(21, 24, 27, 1, 1), bytes(0xaf, 0x1a, 0xbc, 0x0f));
});
test('694: amoadd.h', () => {
  assert.deepEqual(encodeAmoaddH(26, 29, 1, 1, 1), bytes(0x2f, 0x9d, 0x1e, 0x06));
});
test('695: amoxor.h', () => {
  assert.deepEqual(encodeAmoxorH(31, 3, 6, 1, 1), bytes(0xaf, 0x9f, 0x61, 0x26));
});
test('696: amoand.h', () => {
  assert.deepEqual(encodeAmoandH(5, 8, 11, 1, 1), bytes(0xaf, 0x12, 0xb4, 0x66));
});
test('697: amoor.h', () => {
  assert.deepEqual(encodeAmoorH(10, 13, 16, 1, 1), bytes(0x2f, 0x95, 0x06, 0x47));
});
test('698: amomin.h', () => {
  assert.deepEqual(encodeAmominH(15, 18, 21, 1, 1), bytes(0xaf, 0x17, 0x59, 0x87));
});
test('699: amomax.h', () => {
  assert.deepEqual(encodeAmomaxH(20, 23, 26, 1, 1), bytes(0x2f, 0x9a, 0xab, 0xa7));
});
test('700: amominu.h', () => {
  assert.deepEqual(encodeAmominuH(25, 28, 31, 1, 1), bytes(0xaf, 0x1c, 0xfe, 0xc7));
});
test('701: amomaxu.h', () => {
  assert.deepEqual(encodeAmomaxuH(30, 2, 5, 1, 1), bytes(0x2f, 0x1f, 0x51, 0xe6));
});
test('702: amocas.b', () => {
  assert.deepEqual(encodeAmocasB(4, 7, 10, 1, 1), bytes(0x2f, 0x82, 0xa3, 0x2e));
});
test('703: amocas.h', () => {
  assert.deepEqual(encodeAmocasH(9, 12, 15, 1, 1), bytes(0xaf, 0x14, 0xf6, 0x2e));
});
test('704: amocas.w', () => {
  assert.deepEqual(encodeAmocasW(14, 17, 20, 1, 1), bytes(0x2f, 0xa7, 0x48, 0x2f));
});
test('705: amocas.d', () => {
  assert.deepEqual(encodeAmocasD(19, 22, 25, 1, 1), bytes(0xaf, 0x39, 0x9b, 0x2f));
});
test('706: lb.aq', () => {
  assert.deepEqual(encodeLbAq(24, 27, 1), bytes(0x2f, 0x8c, 0x0d, 0x36));
});
test('707: lh.aq', () => {
  assert.deepEqual(encodeLhAq(29, 1, 1), bytes(0xaf, 0x9e, 0x00, 0x36));
});
test('708: lw.aq', () => {
  assert.deepEqual(encodeLwAq(3, 6, 1), bytes(0xaf, 0x21, 0x03, 0x36));
});
test('709: ld.aq', () => {
  assert.deepEqual(encodeLdAq(8, 11, 1), bytes(0x2f, 0xb4, 0x05, 0x36));
});
test('710: sb.rl', () => {
  assert.deepEqual(encodeSbRl(13, 16, 1), bytes(0x2f, 0x80, 0x06, 0x3f));
});
test('711: sh.rl', () => {
  assert.deepEqual(encodeShRl(18, 21, 1), bytes(0x2f, 0x10, 0x59, 0x3f));
});
test('712: sw.rl', () => {
  assert.deepEqual(encodeSwRl(23, 26, 1), bytes(0x2f, 0xa0, 0xab, 0x3f));
});
test('713: sd.rl', () => {
  assert.deepEqual(encodeSdRl(28, 31, 1), bytes(0x2f, 0x30, 0xfe, 0x3f));
});
test('714: wrs.nto', () => {
  assert.deepEqual(encodeWrsNto(), bytes(0x73, 0x00, 0xd0, 0x00));
});
test('715: wrs.sto', () => {
  assert.deepEqual(encodeWrsSto(), bytes(0x73, 0x00, 0xd0, 0x01));
});
test('716: sh1add', () => {
  assert.deepEqual(encodeSh1add(12, 15, 18), bytes(0x33, 0xa6, 0x27, 0x21));
});
test('717: sh2add', () => {
  assert.deepEqual(encodeSh2add(17, 20, 23), bytes(0xb3, 0x48, 0x7a, 0x21));
});
test('718: sh3add', () => {
  assert.deepEqual(encodeSh3add(22, 25, 28), bytes(0x33, 0xeb, 0xcc, 0x21));
});
test('719: andn', () => {
  assert.deepEqual(encodeAndn(27, 30, 2), bytes(0xb3, 0x7d, 0x2f, 0x40));
});
test('720: orn', () => {
  assert.deepEqual(encodeOrn(1, 4, 7), bytes(0xb3, 0x60, 0x72, 0x40));
});
test('721: xnor', () => {
  assert.deepEqual(encodeXnor(6, 9, 12), bytes(0x33, 0xc3, 0xc4, 0x40));
});
test('722: clz', () => {
  assert.deepEqual(encodeClz(11, 14), bytes(0x93, 0x15, 0x07, 0x60));
});
test('723: ctz', () => {
  assert.deepEqual(encodeCtz(16, 19), bytes(0x13, 0x98, 0x19, 0x60));
});
test('724: cpop', () => {
  assert.deepEqual(encodeCpop(21, 24), bytes(0x93, 0x1a, 0x2c, 0x60));
});
test('725: max', () => {
  assert.deepEqual(encodeMax(26, 29, 1), bytes(0x33, 0xed, 0x1e, 0x0a));
});
test('726: maxu', () => {
  assert.deepEqual(encodeMaxu(31, 3, 6), bytes(0xb3, 0xff, 0x61, 0x0a));
});
test('727: min', () => {
  assert.deepEqual(encodeMin(5, 8, 11), bytes(0xb3, 0x42, 0xb4, 0x0a));
});
test('728: minu', () => {
  assert.deepEqual(encodeMinu(10, 13, 16), bytes(0x33, 0xd5, 0x06, 0x0b));
});
test('729: sext.b', () => {
  assert.deepEqual(encodeSextB(15, 18), bytes(0x93, 0x17, 0x49, 0x60));
});
test('730: sext.h', () => {
  assert.deepEqual(encodeSextH(20, 23), bytes(0x13, 0x9a, 0x5b, 0x60));
});
test('731: rol', () => {
  assert.deepEqual(encodeRol(25, 28, 31), bytes(0xb3, 0x1c, 0xfe, 0x61));
});
test('732: ror', () => {
  assert.deepEqual(encodeRor(30, 2, 5), bytes(0x33, 0x5f, 0x51, 0x60));
});
test('733: orc.b', () => {
  assert.deepEqual(encodeOrcB(4, 7), bytes(0x13, 0xd2, 0x73, 0x28));
});
test('734: clmul', () => {
  assert.deepEqual(encodeClmul(9, 12, 15), bytes(0xb3, 0x14, 0xf6, 0x0a));
});
test('735: clmulr', () => {
  assert.deepEqual(encodeClmulr(14, 17, 20), bytes(0x33, 0xa7, 0x48, 0x0b));
});
test('736: clmulh', () => {
  assert.deepEqual(encodeClmulh(19, 22, 25), bytes(0xb3, 0x39, 0x9b, 0x0b));
});
test('737: pack', () => {
  assert.deepEqual(encodePack(24, 27, 30), bytes(0x33, 0xcc, 0xed, 0x09));
});
test('738: packh', () => {
  assert.deepEqual(encodePackh(29, 1, 4), bytes(0xb3, 0xfe, 0x40, 0x08));
});
test('739: brev8', () => {
  assert.deepEqual(encodeBrev8(3, 6), bytes(0x93, 0x51, 0x73, 0x68));
});
test('740: xperm4', () => {
  assert.deepEqual(encodeXperm4(8, 11, 14), bytes(0x33, 0xa4, 0xe5, 0x28));
});
test('741: xperm8', () => {
  assert.deepEqual(encodeXperm8(13, 16, 19), bytes(0xb3, 0x46, 0x38, 0x29));
});
test('742: bclr', () => {
  assert.deepEqual(encodeBclr(18, 21, 24), bytes(0x33, 0x99, 0x8a, 0x49));
});
test('743: bext', () => {
  assert.deepEqual(encodeBext(23, 26, 29), bytes(0xb3, 0x5b, 0xdd, 0x49));
});
test('744: binv', () => {
  assert.deepEqual(encodeBinv(28, 31, 3), bytes(0x33, 0x9e, 0x3f, 0x68));
});
test('745: bset', () => {
  assert.deepEqual(encodeBset(2, 5, 8), bytes(0x33, 0x91, 0x82, 0x28));
});
test('746: c.lbu', () => {
  assert.deepEqual(encodeCLbu(9, 10, 1), bytes(0x24, 0x81));
});
test('747: c.lhu', () => {
  assert.deepEqual(encodeCLhu(10, 11, 1), bytes(0xa8, 0x85));
});
test('748: c.lh', () => {
  assert.deepEqual(encodeCLh(11, 12, 1), bytes(0x6c, 0x86));
});
test('749: c.sb', () => {
  assert.deepEqual(encodeCSb(12, 13, 1), bytes(0xb0, 0x8a));
});
test('750: c.sh', () => {
  assert.deepEqual(encodeCSh(13, 14, 1), bytes(0x34, 0x8f));
});
test('751: c.zext.b', () => {
  assert.deepEqual(encodeCZextB(14), bytes(0x61, 0x9f));
});
test('752: c.sext.b', () => {
  assert.deepEqual(encodeCSextB(15), bytes(0xe5, 0x9f));
});
test('753: c.zext.h', () => {
  assert.deepEqual(encodeCZextH(8), bytes(0x69, 0x9c));
});
test('754: c.sext.h', () => {
  assert.deepEqual(encodeCSextH(9), bytes(0xed, 0x9c));
});
test('755: c.not', () => {
  assert.deepEqual(encodeCNot(10), bytes(0x75, 0x9d));
});
test('756: c.mul', () => {
  assert.deepEqual(encodeCMul(11, 12), bytes(0xd1, 0x9d));
});
test('757: c.mop.N', () => {
  assert.deepEqual(encodeCMopN(2), bytes(0x81, 0x62));
});
test('758: cm.push', () => {
  assert.deepEqual(encodeCmPush(7, 1), bytes(0x76, 0xb8));
});
test('759: cm.pop', () => {
  assert.deepEqual(encodeCmPop(12, 3), bytes(0xce, 0xba));
});
test('760: cm.popretz', () => {
  assert.deepEqual(encodeCmPopretz(2, 2), bytes(0x2a, 0xbc));
});
test('761: cm.popret', () => {
  assert.deepEqual(encodeCmPopret(7, 1), bytes(0x76, 0xbe));
});
test('762: cm.mvsa01', () => {
  assert.deepEqual(encodeCmMvsa01(6, 2), bytes(0x2a, 0xaf));
});
test('763: cm.mva01s', () => {
  assert.deepEqual(encodeCmMva01s(4, 7), bytes(0x7e, 0xae));
});
test('764: cm.jalt', () => {
  assert.deepEqual(encodeCmJalt(247), bytes(0xde, 0xa3));
});
test('765: fcvt.bf16.s', () => {
  assert.deepEqual(encodeFcvtBf16S(9, 12, 6), bytes(0xd3, 0x64, 0x86, 0x44));
});
test('766: fcvt.s.bf16', () => {
  assert.deepEqual(encodeFcvtSBf16(14, 17, 4), bytes(0x53, 0xc7, 0x68, 0x40));
});
test('767: fmadd.h', () => {
  assert.deepEqual(encodeFmaddH(19, 22, 25, 28, 1), bytes(0xc3, 0x19, 0x9b, 0xe5));
});
test('768: fmsub.h', () => {
  assert.deepEqual(encodeFmsubH(24, 27, 30, 2, 6), bytes(0x47, 0xec, 0xed, 0x15));
});
test('769: fnmsub.h', () => {
  assert.deepEqual(encodeFnmsubH(29, 1, 4, 7, 4), bytes(0xcb, 0xce, 0x40, 0x3c));
});
test('770: fnmadd.h', () => {
  assert.deepEqual(encodeFnmaddH(3, 6, 9, 12, 2), bytes(0xcf, 0x21, 0x93, 0x64));
});
test('771: fadd.h', () => {
  assert.deepEqual(encodeFaddH(8, 11, 14, 4), bytes(0x53, 0xc4, 0xe5, 0x04));
});
test('772: fsub.h', () => {
  assert.deepEqual(encodeFsubH(13, 16, 19, 2), bytes(0xd3, 0x26, 0x38, 0x0d));
});
test('773: fmul.h', () => {
  assert.deepEqual(encodeFmulH(18, 21, 24, 7), bytes(0x53, 0xf9, 0x8a, 0x15));
});
test('774: fdiv.h', () => {
  assert.deepEqual(encodeFdivH(23, 26, 29, 5), bytes(0xd3, 0x5b, 0xdd, 0x1d));
});
test('775: fsqrt.h', () => {
  assert.deepEqual(encodeFsqrtH(28, 31, 7), bytes(0x53, 0xfe, 0x0f, 0x5c));
});
test('776: fsgnj.h', () => {
  assert.deepEqual(encodeFsgnjH(2, 5, 8), bytes(0x53, 0x81, 0x82, 0x24));
});
test('777: fsgnjn.h', () => {
  assert.deepEqual(encodeFsgnjnH(7, 10, 13), bytes(0xd3, 0x13, 0xd5, 0x24));
});
test('778: fsgnjx.h', () => {
  assert.deepEqual(encodeFsgnjxH(12, 15, 18), bytes(0x53, 0xa6, 0x27, 0x25));
});
test('779: fmin.h', () => {
  assert.deepEqual(encodeFminH(17, 20, 23), bytes(0xd3, 0x08, 0x7a, 0x2d));
});
test('780: fmax.h', () => {
  assert.deepEqual(encodeFmaxH(22, 25, 28), bytes(0x53, 0x9b, 0xcc, 0x2d));
});
test('781: feq.h', () => {
  assert.deepEqual(encodeFeqH(27, 30, 2), bytes(0xd3, 0x2d, 0x2f, 0xa4));
});
test('782: flt.h', () => {
  assert.deepEqual(encodeFltH(1, 4, 7), bytes(0xd3, 0x10, 0x72, 0xa4));
});
test('783: fle.h', () => {
  assert.deepEqual(encodeFleH(6, 9, 12), bytes(0x53, 0x83, 0xc4, 0xa4));
});
test('784: fclass.h', () => {
  assert.deepEqual(encodeFclassH(11, 14), bytes(0xd3, 0x15, 0x07, 0xe4));
});
test('785: fcvt.w.h', () => {
  assert.deepEqual(encodeFcvtWH(16, 19, 1), bytes(0x53, 0x98, 0x09, 0xc4));
});
test('786: fcvt.wu.h', () => {
  assert.deepEqual(encodeFcvtWuH(21, 24, 6), bytes(0xd3, 0x6a, 0x1c, 0xc4));
});
test('787: fcvt.h.w', () => {
  assert.deepEqual(encodeFcvtHW(26, 29, 4), bytes(0x53, 0xcd, 0x0e, 0xd4));
});
test('788: fcvt.h.wu', () => {
  assert.deepEqual(encodeFcvtHWu(31, 3, 2), bytes(0xd3, 0xaf, 0x11, 0xd4));
});
test('789: fli.h', () => {
  assert.deepEqual(encodeFliH(5, 8), bytes(0xd3, 0x02, 0x14, 0xf4));
});
test('790: fminm.h', () => {
  assert.deepEqual(encodeFminmH(10, 13, 16), bytes(0x53, 0xa5, 0x06, 0x2d));
});
test('791: fmaxm.h', () => {
  assert.deepEqual(encodeFmaxmH(15, 18, 21), bytes(0xd3, 0x37, 0x59, 0x2d));
});
test('792: fround.h', () => {
  assert.deepEqual(encodeFroundH(20, 23, 1), bytes(0x53, 0x9a, 0x4b, 0x44));
});
test('793: froundnx.h', () => {
  assert.deepEqual(encodeFroundnxH(25, 28, 6), bytes(0xd3, 0x6c, 0x5e, 0x44));
});
test('794: fleq.h', () => {
  assert.deepEqual(encodeFleqH(30, 2, 5), bytes(0x53, 0x4f, 0x51, 0xa4));
});
test('795: fltq.h', () => {
  assert.deepEqual(encodeFltqH(4, 7, 10), bytes(0x53, 0xd2, 0xa3, 0xa4));
});
test('796: flh', () => {
  assert.deepEqual(encodeFlh(9, 12, 3983), bytes(0x87, 0x14, 0xf6, 0xf8));
});
test('797: fsh', () => {
  assert.deepEqual(encodeFsh(45, 17, 20, 23), bytes(0xa7, 0x9b, 0x48, 0x5b));
});
test('798: fcvt.s.h', () => {
  assert.deepEqual(encodeFcvtSH(19, 22, 3), bytes(0xd3, 0x39, 0x2b, 0x40));
});
test('799: fcvt.h.s', () => {
  assert.deepEqual(encodeFcvtHS(24, 27, 1), bytes(0x53, 0x9c, 0x0d, 0x44));
});
test('800: fmv.x.h', () => {
  assert.deepEqual(encodeFmvXH(29, 1), bytes(0xd3, 0x8e, 0x00, 0xe4));
});
test('801: fmv.h.x', () => {
  assert.deepEqual(encodeFmvHX(3, 6), bytes(0xd3, 0x01, 0x03, 0xf4));
});
test('802: cbo.clean', () => {
  assert.deepEqual(encodeCboClean(8), bytes(0x0f, 0x20, 0x14, 0x00));
});
test('803: cbo.flush', () => {
  assert.deepEqual(encodeCboFlush(13), bytes(0x0f, 0xa0, 0x26, 0x00));
});
test('804: cbo.inval', () => {
  assert.deepEqual(encodeCboInval(18), bytes(0x0f, 0x20, 0x09, 0x00));
});
test('805: cbo.zero', () => {
  assert.deepEqual(encodeCboZero(23), bytes(0x0f, 0xa0, 0x4b, 0x00));
});
test('806: ssamoswap.w', () => {
  assert.deepEqual(encodeSsamoswapW(28, 31, 3, 1, 1), bytes(0x2f, 0xae, 0x3f, 0x4e));
});
test('807: ssamoswap.d', () => {
  assert.deepEqual(encodeSsamoswapD(2, 5, 8, 1, 1), bytes(0x2f, 0xb1, 0x82, 0x4e));
});
test('808: czero.eqz', () => {
  assert.deepEqual(encodeCzeroEqz(7, 10, 13), bytes(0xb3, 0x53, 0xd5, 0x0e));
});
test('809: czero.nez', () => {
  assert.deepEqual(encodeCzeroNez(12, 15, 18), bytes(0x33, 0xf6, 0x27, 0x0f));
});
test('810: csrrw', () => {
  assert.deepEqual(encodeCsrrw(17, 20, 4053), bytes(0xf3, 0x18, 0x5a, 0xfd));
});
test('811: csrrs', () => {
  assert.deepEqual(encodeCsrrs(22, 25, 4058), bytes(0x73, 0xab, 0xac, 0xfd));
});
test('812: csrrc', () => {
  assert.deepEqual(encodeCsrrc(27, 30, 4063), bytes(0xf3, 0x3d, 0xff, 0xfd));
});
test('813: csrrwi', () => {
  assert.deepEqual(encodeCsrrwi(1, 4065, 7), bytes(0xf3, 0xd0, 0x13, 0xfe));
});
test('814: csrrsi', () => {
  assert.deepEqual(encodeCsrrsi(6, 4070, 12), bytes(0x73, 0x63, 0x66, 0xfe));
});
test('815: csrrci', () => {
  assert.deepEqual(encodeCsrrci(11, 4075, 17), bytes(0xf3, 0xf5, 0xb8, 0xfe));
});
test('816: fence.i', () => {
  assert.deepEqual(encodeFenceI(4077, 19, 22), bytes(0x0f, 0x9b, 0xd9, 0xfe));
});
test('817: mop.r.N', () => {
  assert.deepEqual(encodeMopRN(1, 2, 2, 30, 2), bytes(0x73, 0x4f, 0xe1, 0xc9));
});
test('818: mop.rr.N', () => {
  assert.deepEqual(encodeMopRrN(1, 1, 1, 4, 7), bytes(0xf3, 0x40, 0x72, 0xc6));
});
test('819: sha256sum0', () => {
  assert.deepEqual(encodeSha256sum0(31, 3), bytes(0x93, 0x9f, 0x01, 0x10));
});
test('820: sha256sum1', () => {
  assert.deepEqual(encodeSha256sum1(5, 8), bytes(0x93, 0x12, 0x14, 0x10));
});
test('821: sha256sig0', () => {
  assert.deepEqual(encodeSha256sig0(10, 13), bytes(0x13, 0x95, 0x26, 0x10));
});
test('822: sha256sig1', () => {
  assert.deepEqual(encodeSha256sig1(15, 18), bytes(0x93, 0x17, 0x39, 0x10));
});
test('823: sm4ed', () => {
  assert.deepEqual(encodeSm4ed(20, 23, 26, 2), bytes(0x33, 0x8a, 0xab, 0xb1));
});
test('824: sm4ks', () => {
  assert.deepEqual(encodeSm4ks(25, 28, 31, 1), bytes(0xb3, 0x0c, 0xfe, 0x75));
});
test('825: sm3p0', () => {
  assert.deepEqual(encodeSm3p0(30, 2), bytes(0x13, 0x1f, 0x81, 0x10));
});
test('826: sm3p1', () => {
  assert.deepEqual(encodeSm3p1(4, 7), bytes(0x13, 0x92, 0x93, 0x10));
});
test('827: vandn.vv', () => {
  assert.deepEqual(encodeVandnVv(1, 12, 15, 18), bytes(0x57, 0x89, 0xc7, 0x06));
});
test('828: vandn.vx', () => {
  assert.deepEqual(encodeVandnVx(1, 17, 20, 23), bytes(0xd7, 0x4b, 0x1a, 0x07));
});
test('829: vbrev.v', () => {
  assert.deepEqual(encodeVbrevV(1, 22, 25), bytes(0xd7, 0x2c, 0x65, 0x4b));
});
test('830: vbrev8.v', () => {
  assert.deepEqual(encodeVbrev8V(1, 27, 30), bytes(0x57, 0x2f, 0xb4, 0x4b));
});
test('831: vrev8.v', () => {
  assert.deepEqual(encodeVrev8V(1, 1, 4), bytes(0x57, 0xa2, 0x14, 0x4a));
});
test('832: vclz.v', () => {
  assert.deepEqual(encodeVclzV(1, 6, 9), bytes(0xd7, 0x24, 0x66, 0x4a));
});
test('833: vctz.v', () => {
  assert.deepEqual(encodeVctzV(1, 11, 14), bytes(0x57, 0xa7, 0xb6, 0x4a));
});
test('834: vcpop.v', () => {
  assert.deepEqual(encodeVcpopV(1, 16, 19), bytes(0xd7, 0x29, 0x07, 0x4b));
});
test('835: vrol.vv', () => {
  assert.deepEqual(encodeVrolVv(1, 21, 24, 27), bytes(0xd7, 0x0d, 0x5c, 0x57));
});
test('836: vrol.vx', () => {
  assert.deepEqual(encodeVrolVx(1, 26, 29, 1), bytes(0xd7, 0xc0, 0xae, 0x57));
});
test('837: vror.vv', () => {
  assert.deepEqual(encodeVrorVv(1, 31, 3, 6), bytes(0x57, 0x83, 0xf1, 0x53));
});
test('838: vror.vx', () => {
  assert.deepEqual(encodeVrorVx(1, 5, 8, 11), bytes(0xd7, 0x45, 0x54, 0x52));
});
test('839: vror.vi', () => {
  assert.deepEqual(encodeVrorVi(1, 1, 13, 16, 19), bytes(0xd7, 0x39, 0xd8, 0x56));
});
test('840: vwsll.vv', () => {
  assert.deepEqual(encodeVwsllVv(1, 15, 18, 21), bytes(0xd7, 0x0a, 0xf9, 0xd6));
});
test('841: vwsll.vx', () => {
  assert.deepEqual(encodeVwsllVx(1, 20, 23, 26), bytes(0x57, 0xcd, 0x4b, 0xd7));
});
test('842: vwsll.vi', () => {
  assert.deepEqual(encodeVwsllVi(1, 25, 28, 31), bytes(0xd7, 0x3f, 0x9e, 0xd7));
});
test('843: vclmul.vv', () => {
  assert.deepEqual(encodeVclmulVv(1, 30, 2, 5), bytes(0xd7, 0x22, 0xe1, 0x33));
});
test('844: vclmul.vx', () => {
  assert.deepEqual(encodeVclmulVx(1, 4, 7, 10), bytes(0x57, 0xe5, 0x43, 0x32));
});
test('845: vclmulh.vv', () => {
  assert.deepEqual(encodeVclmulhVv(1, 9, 12, 15), bytes(0xd7, 0x27, 0x96, 0x36));
});
test('846: vclmulh.vx', () => {
  assert.deepEqual(encodeVclmulhVx(1, 14, 17, 20), bytes(0x57, 0xea, 0xe8, 0x36));
});
test('847: vfncvtbf16.f.f.w', () => {
  assert.deepEqual(encodeVfncvtbf16FFW(1, 19, 22), bytes(0x57, 0x9b, 0x3e, 0x4b));
});
test('848: vfwcvtbf16.f.f.v', () => {
  assert.deepEqual(encodeVfwcvtbf16FFV(1, 24, 27), bytes(0xd7, 0x9d, 0x86, 0x4b));
});
test('849: vfwmaccbf16.vv', () => {
  assert.deepEqual(encodeVfwmaccbf16Vv(1, 29, 1, 4), bytes(0x57, 0x92, 0xd0, 0xef));
});
test('850: vfwmaccbf16.vf', () => {
  assert.deepEqual(encodeVfwmaccbf16Vf(1, 3, 6, 9), bytes(0xd7, 0x54, 0x33, 0xee));
});
test('851: vgmul.vv', () => {
  assert.deepEqual(encodeVgmulVv(5, 8), bytes(0x77, 0xa4, 0x58, 0xa2));
});
test('852: vghsh.vv', () => {
  assert.deepEqual(encodeVghshVv(10, 13, 16), bytes(0x77, 0xa8, 0xa6, 0xb2));
});
test('853: vaesdf.vv', () => {
  assert.deepEqual(encodeVaesdfVv(15, 18), bytes(0x77, 0xa9, 0xf0, 0xa2));
});
test('854: vaesdf.vs', () => {
  assert.deepEqual(encodeVaesdfVs(20, 23), bytes(0xf7, 0xab, 0x40, 0xa7));
});
test('855: vaesdm.vv', () => {
  assert.deepEqual(encodeVaesdmVv(25, 28), bytes(0x77, 0x2e, 0x90, 0xa3));
});
test('856: vaesdm.vs', () => {
  assert.deepEqual(encodeVaesdmVs(30, 2), bytes(0x77, 0x21, 0xe0, 0xa7));
});
test('857: vaesef.vv', () => {
  assert.deepEqual(encodeVaesefVv(4, 7), bytes(0xf7, 0xa3, 0x41, 0xa2));
});
test('858: vaesef.vs', () => {
  assert.deepEqual(encodeVaesefVs(9, 12), bytes(0x77, 0xa6, 0x91, 0xa6));
});
test('859: vaesem.vv', () => {
  assert.deepEqual(encodeVaesemVv(14, 17), bytes(0xf7, 0x28, 0xe1, 0xa2));
});
test('860: vaesem.vs', () => {
  assert.deepEqual(encodeVaesemVs(19, 22), bytes(0x77, 0x2b, 0x31, 0xa7));
});
test('861: vaesz.vs', () => {
  assert.deepEqual(encodeVaeszVs(24, 27), bytes(0xf7, 0xad, 0x83, 0xa7));
});
test('862: vaeskf1.vi', () => {
  assert.deepEqual(encodeVaeskf1Vi(29, 1, 4), bytes(0x77, 0xa2, 0xd0, 0x8b));
});
test('863: vaeskf2.vi', () => {
  assert.deepEqual(encodeVaeskf2Vi(3, 6, 9), bytes(0xf7, 0x24, 0x33, 0xaa));
});
test('864: vsha2ms.vv', () => {
  assert.deepEqual(encodeVsha2msVv(8, 11, 14), bytes(0x77, 0xa7, 0x85, 0xb6));
});
test('865: vsha2ch.vv', () => {
  assert.deepEqual(encodeVsha2chVv(13, 16, 19), bytes(0xf7, 0x29, 0xd8, 0xba));
});
test('866: vsha2cl.vv', () => {
  assert.deepEqual(encodeVsha2clVv(18, 21, 24), bytes(0x77, 0xac, 0x2a, 0xbf));
});
test('867: vsm4k.vi', () => {
  assert.deepEqual(encodeVsm4kVi(23, 26, 29), bytes(0xf7, 0x2e, 0x7d, 0x87));
});
test('868: vsm4r.vv', () => {
  assert.deepEqual(encodeVsm4rVv(28, 31), bytes(0xf7, 0x2f, 0xc8, 0xa3));
});
test('869: vsm4r.vs', () => {
  assert.deepEqual(encodeVsm4rVs(2, 5), bytes(0xf7, 0x22, 0x28, 0xa6));
});
test('870: vsm3c.vi', () => {
  assert.deepEqual(encodeVsm3cVi(7, 10, 13), bytes(0xf7, 0x26, 0x75, 0xae));
});
test('871: vsm3me.vv', () => {
  assert.deepEqual(encodeVsm3meVv(12, 15, 18), bytes(0x77, 0xa9, 0xc7, 0x82));
});
