// Tests for the pure logic behind the stake pool delegation tool:
// src/utils/cardano/bech32.mjs (encoder and pool id helpers),
// src/utils/cardano/lovelace.mjs (whole and compact formatters) and
// src/utils/cardano/stakePools.mjs. Run with `node --test`.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeBech32, encodeBech32, wordsToBytes, isValidPoolId, poolIdFromHex, rewardAddressFromHex,
} from '../src/utils/cardano/bech32.mjs';
import { formatAdaWhole, formatAdaCompact } from '../src/utils/cardano/lovelace.mjs';
import {
  MIN_ACTIVE_STAKE, MAX_MARGIN, MIN_PLEDGE, isValidIndexRow, eligibleFromIndex, eligibleFromInfo,
  classifyQuery, searchTicker, toPoolModel,
} from '../src/utils/cardano/stakePools.mjs';

// Known mainnet values taken from Koios: the NUTS pool and its reward address.
const NUTS_HEX = '0f292fcaa02b8b2f9b3c8f9fd8e0bb21abedb692a6d5058df3ef2735';
const NUTS_BECH32 = 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy';
const NUTS_STAKE_HEX = 'e14f39feccb595162d892abd1e03d80de8e76b8a2015139430e032b2be';
const NUTS_STAKE = 'stake1u98nnlkvkk23vtvf9273uq7cph5ww6u2yq2389psuqet90sv4xv9v';
const BROKEN_ID = `${NUTS_BECH32.slice(0, -1)}${NUTS_BECH32.endsWith('y') ? 'z' : 'y'}`;

function indexRow(overrides = {}) {
  return {
    pool_id_bech32: NUTS_BECH32, ticker: 'NUTS', pool_status: 'registered', pool_group: '5BINARIES',
    active_stake: '6597014404383', margin: 0.049, fixed_cost: '340000000', pledge: '250000000000',
    retiring_epoch: null, ...overrides,
  };
}

function infoRow(overrides = {}) {
  return {
    pool_id_bech32: NUTS_BECH32, pool_status: 'registered', retiring_epoch: null, margin: 0.049,
    fixed_cost: '340000000', pledge: '250000000000', live_pledge: '253973151490',
    live_stake: '6630721844585', live_delegators: 291, live_saturation: 8.53, block_count: 3767,
    meta_json: { name: 'StakeNuts', ticker: 'NUTS', homepage: 'https://stakenuts.com/' },
    ...overrides,
  };
}

test('encodeBech32 round-trips through decodeBech32 and wordsToBytes', () => {
  const bytes = [...Buffer.from(NUTS_HEX, 'hex')];
  assert.equal(encodeBech32('pool', bytes), NUTS_BECH32);
  const decoded = decodeBech32(NUTS_BECH32);
  assert.deepEqual(wordsToBytes(decoded.words), bytes);
  assert.equal(wordsToBytes([31]), null); // leftover bits that are not zero padding
});

test('poolIdFromHex matches Koios for the NUTS pool', () => {
  assert.equal(poolIdFromHex(NUTS_HEX), NUTS_BECH32);
  assert.equal(poolIdFromHex(NUTS_HEX.toUpperCase()), NUTS_BECH32);
});

test('poolIdFromHex rejects wrong length and non-hex', () => {
  assert.equal(poolIdFromHex(NUTS_HEX.slice(1)), null);
  assert.equal(poolIdFromHex(`${NUTS_HEX}00`), null);
  assert.equal(poolIdFromHex(`zz${NUTS_HEX.slice(2)}`), null);
  assert.equal(poolIdFromHex(null), null);
});

test('isValidPoolId verifies checksum, hrp and length', () => {
  assert.equal(isValidPoolId(NUTS_BECH32), true);
  assert.equal(isValidPoolId(NUTS_BECH32.toUpperCase()), true);
  assert.equal(isValidPoolId(BROKEN_ID), false);
  assert.equal(isValidPoolId(NUTS_BECH32.slice(0, -1)), false);
  assert.equal(isValidPoolId(`drep1${NUTS_BECH32.slice(5)}`), false);
  assert.equal(isValidPoolId(`Pool1${NUTS_BECH32.slice(5)}`), false);
  assert.equal(isValidPoolId(NUTS_STAKE), false);
});

test('rewardAddressFromHex matches Koios for the NUTS reward address', () => {
  assert.equal(rewardAddressFromHex(NUTS_STAKE_HEX), NUTS_STAKE);
  assert.deepEqual(wordsToBytes(decodeBech32(NUTS_STAKE).words), [...Buffer.from(NUTS_STAKE_HEX, 'hex')]);
});

test('rewardAddressFromHex handles testnet and rejects other headers', () => {
  assert.ok(rewardAddressFromHex(`e0${NUTS_STAKE_HEX.slice(2)}`).startsWith('stake_test1'));
  assert.ok(rewardAddressFromHex(`f1${NUTS_STAKE_HEX.slice(2)}`).startsWith('stake1'));
  assert.equal(rewardAddressFromHex(`01${NUTS_STAKE_HEX.slice(2)}`), null);
  assert.equal(rewardAddressFromHex(NUTS_STAKE_HEX.slice(0, -2)), null);
  assert.equal(rewardAddressFromHex(undefined), null);
});

test('formatAdaWhole handles values above Number.MAX_SAFE_INTEGER and locales', () => {
  assert.equal(formatAdaWhole('45000000000000000'), '45,000,000,000');
  assert.equal(formatAdaWhole('340000000'), '340');
  assert.equal(formatAdaWhole('2000000'), '2');
  assert.equal(formatAdaWhole('999999'), '0');
  assert.equal(formatAdaWhole('3973151490', 'de-DE'), '3.973');
  assert.equal(formatAdaWhole('garbage'), null);
  assert.equal(formatAdaWhole(MIN_ACTIVE_STAKE), '1,000,000');
});

test('formatAdaCompact picks the unit by size and follows the locale', () => {
  assert.equal(formatAdaCompact('45000000000000000'), '45.00B');
  assert.equal(formatAdaCompact('6630721844585'), '6.63M');
  assert.equal(formatAdaCompact('253973151490'), '254k');
  assert.equal(formatAdaCompact('340000000'), '340');
  assert.equal(formatAdaCompact('6630721844585', 'de-DE'), '6,63M');
  assert.equal(formatAdaCompact(MIN_ACTIVE_STAKE), '1.00M');
  assert.equal(formatAdaCompact(null), null);
});

test('isValidIndexRow needs a checksum-valid pool id and a known status', () => {
  assert.equal(isValidIndexRow(indexRow()), true);
  assert.equal(isValidIndexRow(indexRow({ pool_id_bech32: BROKEN_ID })), false);
  assert.equal(isValidIndexRow(indexRow({ pool_status: 'weird' })), false);
  assert.equal(isValidIndexRow(null), false);
});

test('eligibleFromIndex applies the thresholds exactly at the boundary', () => {
  const atStake = indexRow({ active_stake: MIN_ACTIVE_STAKE.toString() });
  const belowStake = indexRow({ active_stake: (MIN_ACTIVE_STAKE - 1n).toString() });
  const atMargin = indexRow({ margin: MAX_MARGIN });
  const belowMargin = indexRow({ margin: MAX_MARGIN - 0.001 });
  assert.deepEqual(eligibleFromIndex([atStake]), [atStake]);
  assert.deepEqual(eligibleFromIndex([belowStake]), []);
  assert.deepEqual(eligibleFromIndex([atMargin]), []);
  assert.deepEqual(eligibleFromIndex([belowMargin]), [belowMargin]);
  const atPledge = indexRow({ pledge: MIN_PLEDGE.toString() });
  const belowPledge = indexRow({ pledge: (MIN_PLEDGE - 1n).toString() });
  assert.deepEqual(eligibleFromIndex([atPledge]), [atPledge]);
  assert.deepEqual(eligibleFromIndex([belowPledge]), []);
});

test('eligibleFromIndex drops retiring pools, missing tickers and invalid values', () => {
  for (const o of [
    { pool_status: 'retiring', retiring_epoch: 700 }, { retiring_epoch: 700 }, { ticker: null },
    { ticker: '' }, { active_stake: 'lots' }, { margin: null }, { pool_id_bech32: BROKEN_ID },
    { pledge: '0' }, { pledge: 'lots' },
  ]) assert.deepEqual(eligibleFromIndex([indexRow(o)]), [], JSON.stringify(o));
});

test('eligibleFromInfo accepts the reference pool and checks the boundaries', () => {
  assert.equal(eligibleFromInfo(infoRow()), true);
  assert.equal(eligibleFromInfo(infoRow({ live_saturation: 99.9 })), true);
  assert.equal(eligibleFromInfo(infoRow({ live_saturation: 100 })), false);
  assert.equal(eligibleFromInfo(infoRow({ live_saturation: null })), false);
  assert.equal(eligibleFromInfo(infoRow({ pledge: '100', live_pledge: '100' })), true);
  assert.equal(eligibleFromInfo(infoRow({ pledge: '100', live_pledge: '99' })), false);
});

test('eligibleFromInfo needs blocks, a name and an active status', () => {
  for (const o of [
    { block_count: 0 }, { meta_json: { ticker: 'NUTS' } }, { meta_json: null },
    { pool_status: 'retiring', retiring_epoch: 700 }, { retiring_epoch: 700 },
  ]) assert.equal(eligibleFromInfo(infoRow(o)), false, JSON.stringify(o));
});

test('classifyQuery recognises bech32 and hex ids', () => {
  assert.deepEqual(classifyQuery(`  ${NUTS_BECH32}  `), { kind: 'id', value: NUTS_BECH32 });
  assert.deepEqual(classifyQuery(NUTS_BECH32.toUpperCase()), { kind: 'id', value: NUTS_BECH32 });
  assert.deepEqual(classifyQuery(NUTS_HEX), { kind: 'id', value: NUTS_BECH32 });
});

test('classifyQuery flags broken ids instead of searching them as tickers', () => {
  assert.equal(classifyQuery(BROKEN_ID).kind, 'invalidId');
  assert.equal(classifyQuery('pool1abc').kind, 'invalidId');
  assert.equal(classifyQuery(NUTS_HEX.slice(0, 55)).kind, 'ticker');
});

test('classifyQuery handles tickers, short and empty input', () => {
  assert.deepEqual(classifyQuery(' nuts '), { kind: 'ticker', value: 'NUTS' });
  assert.deepEqual(classifyQuery('n'), { kind: 'tooShort', value: 'N' });
  assert.deepEqual(classifyQuery('   '), { kind: 'empty', value: '' });
  assert.deepEqual(classifyQuery(undefined), { kind: 'empty', value: '' });
});

test('searchTicker ranks exact matches before prefix matches and caps results', () => {
  const rows = [
    indexRow({ pool_id_bech32: 'a', ticker: 'NUTSX' }), indexRow({ pool_id_bech32: 'b', ticker: 'NUTS' }),
    indexRow({ pool_id_bech32: 'c', ticker: 'nuts2' }), indexRow({ pool_id_bech32: 'd', ticker: null }),
    indexRow({ pool_id_bech32: 'e', ticker: 'OTHER' }),
  ];
  assert.deepEqual(searchTicker(rows, 'nuts', 10).map((r) => r.pool_id_bech32), ['b', 'a', 'c']);
  assert.deepEqual(searchTicker(rows, 'NUTS', 2).map((r) => r.pool_id_bech32), ['b', 'a']);
  assert.deepEqual(searchTicker(rows, 'zzz', 10), []);
});

test('toPoolModel maps the reference rows', () => {
  assert.deepEqual(toPoolModel(indexRow(), infoRow()), {
    id: NUTS_BECH32, ticker: 'NUTS', name: 'StakeNuts', homepage: 'https://stakenuts.com/', group: '5BINARIES',
    status: 'registered', retiringEpoch: null, saturation: 8.53, margin: 0.049, fixedCost: '340000000',
    pledge: '250000000000', livePledge: '253973151490', liveStake: '6630721844585', delegators: 291, blocks: 3767,
  });
});

test('toPoolModel works without an index row and falls back to the index ticker', () => {
  assert.equal(toPoolModel(null, infoRow()).group, null);
  assert.equal(toPoolModel(indexRow({ ticker: 'IDX' }), infoRow({ meta_json: { name: 'X' } })).ticker, 'IDX');
  const noTicker = toPoolModel(null, infoRow({ meta_json: { name: 'X' } }));
  assert.equal(noTicker.ticker, null);
  assert.equal(noTicker.name, 'X');
});

test('toPoolModel rejects bad rows instead of throwing', () => {
  for (const o of [{ live_stake: 'many' }, { pledge: undefined }, { pool_status: 'unknown' }, { pool_id_bech32: BROKEN_ID }]) {
    assert.equal(toPoolModel(null, infoRow(o)), null, JSON.stringify(o));
  }
  assert.equal(toPoolModel(null, null), null);
});

test('toPoolModel keeps only well-formed https homepages and tolerates missing metadata', () => {
  for (const bad of ['http://x.io', 'javascript:alert(1)', 'https://', 'ftp://x.io', 42]) {
    assert.equal(toPoolModel(null, infoRow({ meta_json: { name: 'X', homepage: bad } })).homepage, null, String(bad));
  }
  assert.equal(toPoolModel(null, infoRow({ meta_json: { name: 'X', homepage: ' https://x.io/path?q=1 ' } })).homepage, 'https://x.io/path?q=1');
  const m = toPoolModel(null, infoRow({ meta_json: null, live_saturation: null, block_count: null, live_delegators: null }));
  assert.equal(m.name, null);
  assert.equal(m.saturation, null);
  assert.equal(m.blocks, 0);
  assert.equal(m.delegators, 0);
});
