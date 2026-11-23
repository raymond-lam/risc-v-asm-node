import assert from 'node:assert/strict';
import test from 'node:test';
import { intelHex } from '#formats';
import { collectBytes } from '#testing/stream';

const decoder = new TextDecoder();
const toText = (bytes: Uint8Array): string => decoder.decode(bytes);

const chunks = (...chunks: Uint8Array[]): AsyncGenerator<Uint8Array> =>
  (async function* () {
    for (const c of chunks) {
      await Promise.resolve();
      yield c;
    }
  })();

// Verify the checksum of an Intel HEX record.
const verifyRecordChecksum = (record: string): void => {
  assert.ok(record.startsWith(':'), `record must start with colon: ${record}`);
  const hex = record.slice(1);
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  if (bytes.length === 0) return;
  const payload = bytes.slice(0, -1);
  const sum = payload.reduce((a, b) => a + b, 0);
  const expected = -sum & 0xff;
  const checksum = bytes[bytes.length - 1];
  assert.strictEqual(checksum, expected, `checksum mismatch in record ${record}`);
};

test('intelHex empty input yields only EOF', async () => {
  const result = await collectBytes(intelHex(chunks(), 0));
  assert.equal(toText(result), ':00000001FF\n');
});

test('intelHex 16 bytes yields one data record', async () => {
  const data = new Uint8Array(16).fill(0x41);
  const result = await collectBytes(intelHex(chunks(data), 0));
  const text = toText(result);
  const records = text.trimEnd().split('\n');
  // Extended address record + data record + EOF
  assert.equal(records.length, 3, 'extended + data + EOF');
  assert.ok(records[1]!.startsWith(':10'), 'data record has 16 bytes');
});

test('intelHex 17 bytes yields two data records', async () => {
  const data = new Uint8Array(17).fill(0x42);
  const result = await collectBytes(intelHex(chunks(data), 0));
  const text = toText(result);
  const records = text.trimEnd().split('\n');
  // Extended + data16 + data1 + EOF
  assert.equal(records.length, 4, 'extended + two data + EOF');
  assert.ok(records[1]!.startsWith(':10'), 'first data record has 16 bytes');
  assert.ok(records[2]!.startsWith(':01'), 'second data record has 1 byte');
});

test('intelHex two chunks making 17 bytes = same as one 17-byte chunk', async () => {
  const a = new Uint8Array(8).fill(0x43);
  const b = new Uint8Array(9).fill(0x43);
  const result = await collectBytes(intelHex(chunks(a, b), 0));
  const oneChunk = new Uint8Array(17).fill(0x43);
  const expected = await collectBytes(intelHex(chunks(oneChunk), 0));
  const resultLines = toText(result).trimEnd().split('\n');
  const expectedLines = toText(expected).trimEnd().split('\n');
  assert.equal(resultLines.length, expectedLines.length, 'same number of records');
  for (let i = 0; i < resultLines.length; i++) {
    assert.equal(resultLines[i], expectedLines[i], `record ${i} matches`);
  }
});

test('intelHex data at baseAddress 0x1000 yields extended address record', async () => {
  const data = new Uint8Array(16).fill(0x44);
  const result = await collectBytes(intelHex(chunks(data), 0x1000));
  const text = toText(result);
  const records = text.trimEnd().split('\n');
  // Extended address record + data record + EOF
  assert.equal(records.length, 3, 'extended + data + EOF');
  assert.ok(records[0]!.startsWith(':02'), 'extended linear address record starts with :02');
  assert.ok(records[1]!.startsWith(':10'), 'data record has 16 bytes');
});

test('intelHex data crossing 64 KiB boundary emits extended address', async () => {
  // 32 bytes starting at 0xFFF0: first 16 fit, next 16 cross to 0x10000
  const data = new Uint8Array(32).fill(0x45);
  const result = await collectBytes(intelHex(chunks(data), 0xfff0));
  const text = toText(result);
  const records = text.trimEnd().split('\n');
  // extended(0) + data16 + extended(1) + data16 + EOF = 5 records
  assert.equal(records.length, 5, 'extended0 + data16 + extended1 + data16 + EOF');
  assert.ok(records[0]!.startsWith(':02'), 'first extended at upper 0');
  assert.ok(records[1]!.startsWith(':10'), 'first data at 0xFFF0+');
  assert.ok(records[2]!.startsWith(':02'), 'second extended at upper 1');
  assert.ok(records[3]!.startsWith(':10'), 'second data at 0x10000+');
});

test('intelHex baseAddress 0xFFFF wraps boundary across pages', async () => {
  // 2 bytes at 0xFFFF: first byte at 0xFFFF, second at 0x10000
  const data = new Uint8Array(2).fill(0x46);
  const result = await collectBytes(intelHex(chunks(data), 0xffff));
  const text = toText(result);
  const records = text.trimEnd().split('\n');
  // extended(0) + data(1 byte) + extended(1) + data(1 byte) + EOF = 5 records
  assert.equal(records.length, 5, 'cross-page 2 bytes + EOF');
  assert.ok(records[0]!.startsWith(':02'), 'first extended upper 0');
  assert.ok(records[1]!.startsWith(':01'), 'first data 1 byte');
  assert.ok(records[2]!.startsWith(':02'), 'second extended upper 1');
  assert.ok(records[3]!.startsWith(':01'), 'second data 1 byte');
});

test('intelHex baseAddress 0x1_0000_0000 throws 32-bit error', async () => {
  const data = new Uint8Array(4);
  await assert.rejects(async () => {
    await collectBytes(intelHex(chunks(data), 0x1_0000_0000));
  }, /32-bit/);
});

test('intelHex baseAddress 0xFFFF_FFFC with 8 bytes throws 32-bit error', async () => {
  // 4 bytes fit at 0xFFFF_FFFC, next 4 bytes cross into 0x1_0000_0000
  const data = new Uint8Array(8);
  await assert.rejects(async () => {
    await collectBytes(intelHex(chunks(data), 0xffff_fffc));
  }, /32-bit/);
});

test('intelHex checksum of every record is correct', async () => {
  const data = new Uint8Array(32).fill(0x47);
  const result = await collectBytes(intelHex(chunks(data), 0x1000));
  const text = toText(result);
  const records = text.trimEnd().split('\n');
  assert.ok(records.length >= 2, 'at least extended + data + EOF');
  for (const record of records) {
    verifyRecordChecksum(record);
  }
  // EOF marker
  assert.ok(records[records.length - 1]!.startsWith(':00000001'), 'last record is EOF marker');
});

test('intelHex multi-byte li instruction is split across records', async () => {
  // ld (4 bytes) + li with large immediate (44 bytes) = 48 bytes total
  const ld = new Uint8Array(4).fill(0x13);
  const liLarge = new Uint8Array(44).fill(0x48);
  const result = await collectBytes(intelHex(chunks(ld, liLarge), 0));
  const text = toText(result);
  // Extended + data16 + data16 + data16 + EOF = 5 lines
  const records = text.trimEnd().split('\n');
  assert.equal(records.length, 5, 'extended + 3 data + EOF');
  assert.ok(records[0]!.startsWith(':02'), 'extended address record');
  assert.ok(records[1]!.startsWith(':10'), 'first 16-byte data');
  assert.ok(records[2]!.startsWith(':10'), 'second 16-byte data');
  assert.ok(records[3]!.startsWith(':10'), 'third 16-byte data');
  assert.ok(records[4]!.startsWith(':00000001'), 'EOF marker');
  assert.equal(records.filter((r) => r.startsWith(':10')).length, 3);
});
