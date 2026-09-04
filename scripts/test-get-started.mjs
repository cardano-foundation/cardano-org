import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseLovelace, isPositiveLovelace, formatAda } from '../src/utils/cardano/lovelace.mjs';
import { decodeBech32, isValidStakeAddress, isValidBaseAddress } from '../src/utils/cardano/bech32.mjs';
import { UNKNOWN, emptyStatus, deriveStatus, drepKind, withWalletBalance } from '../src/utils/getStarted/status.mjs';
import { isValidAccount, emptyLocal, isValidLocal, ACCOUNT_KEY, LOCAL_KEY, LEGACY_STEP_KEY } from '../src/utils/getStarted/storage.mjs';
import { STATION_KEYS, computeStations, firstOpenIndex, allDone, doneCount } from '../src/utils/getStarted/stations.mjs';
import { detectDevice, pickWalletsForDevice } from '../src/utils/getStarted/devices.mjs';
import { wordlist as BIP39_ENGLISH } from '@scure/bip39/wordlists/english.js';
import { DEMO_PHRASE, makeExercise } from '../src/utils/getStarted/demoPhrase.mjs';
import { STATION_QUESTIONS } from '../src/utils/getStarted/questions.mjs';
import { createLatest, checkAccount, EMPTY_NAMES } from '../src/utils/getStarted/check.mjs';

test('parseLovelace accepts only non-negative decimal integers', () => {
  assert.equal(parseLovelace('0'), 0n);
  assert.equal(parseLovelace(' 12 '), 12n);
  assert.equal(parseLovelace(5n), 5n);
  assert.equal(parseLovelace(7), 7n);
  assert.equal(parseLovelace('45000000000000001'), 45000000000000001n);
  assert.equal(parseLovelace('abc'), null);
  assert.equal(parseLovelace('-1'), null);
  assert.equal(parseLovelace('1.5'), null);
  assert.equal(parseLovelace(1.5), null);
  assert.equal(parseLovelace(''), null);
  assert.equal(parseLovelace(null), null);
  assert.equal(parseLovelace(undefined), null);
});

test('isPositiveLovelace treats strings, bigints and garbage correctly', () => {
  assert.equal(isPositiveLovelace('0'), false);
  assert.equal(isPositiveLovelace('1'), true);
  assert.equal(isPositiveLovelace(5n), true);
  assert.equal(isPositiveLovelace(null), false);
  assert.equal(isPositiveLovelace(undefined), false);
  assert.equal(isPositiveLovelace('abc'), false);
  assert.equal(isPositiveLovelace('45000000000000000'), true); // above 2^53
});

test('formatAda keeps precision above the safe integer range', () => {
  assert.equal(formatAda('1000000'), '1.00');
  assert.equal(formatAda('1234567'), '1.23');
  assert.equal(formatAda('999999'), '0.99');
  assert.equal(formatAda('45000000000000001'), '45,000,000,000.00');
  assert.equal(formatAda('1234567890', 'de'), '1.234,56');
});

import { parseCardanoAddress, shortenAddress } from '../src/utils/cardano/address.mjs';

const sdk = await import('@evolution-sdk/evolution');

// Deterministic fixtures built with the SDK itself, no real funds involved.
function keyHash(fill) {
  return new sdk.KeyHash.KeyHash({ hash: new Uint8Array(28).fill(fill) });
}
function baseAddress(networkId) {
  const addr = new sdk.BaseAddress.BaseAddress({ networkId, paymentCredential: keyHash(1), stakeCredential: keyHash(2) });
  return sdk.Address.toBech32(sdk.Address.fromBytes(sdk.BaseAddress.toBytes(addr)));
}
function enterpriseAddress() {
  const addr = new sdk.EnterpriseAddress.EnterpriseAddress({ networkId: 1, paymentCredential: keyHash(1) });
  return sdk.Address.toBech32(sdk.Address.fromBytes(sdk.EnterpriseAddress.toBytes(addr)));
}
const EXPECTED_STAKE = sdk.RewardAccount.toBech32(new sdk.RewardAccount.RewardAccount({ networkId: 1, stakeCredential: keyHash(2) }));

test('parseCardanoAddress derives the stake address from a mainnet base address', () => {
  const input = baseAddress(1);
  const result = parseCardanoAddress(`  ${input}\n`, sdk);
  assert.equal(result.kind, 'base');
  assert.equal(result.stakeAddress, EXPECTED_STAKE);
  assert.equal(result.baseAddress, input);
});

test('parseCardanoAddress accepts a stake address directly', () => {
  const result = parseCardanoAddress(EXPECTED_STAKE, sdk);
  assert.equal(result.kind, 'stake');
  assert.equal(result.stakeAddress, EXPECTED_STAKE);
  assert.equal(result.baseAddress, undefined);
});

test('parseCardanoAddress rejects what it cannot use', () => {
  assert.equal(parseCardanoAddress('', sdk).error, 'empty');
  assert.equal(parseCardanoAddress('   ', sdk).error, 'empty');
  assert.equal(parseCardanoAddress('hello', sdk).error, 'invalid');
  assert.equal(parseCardanoAddress('addr1hello', sdk).error, 'invalid');
  assert.equal(parseCardanoAddress('stake1hello', sdk).error, 'invalid');
  assert.equal(parseCardanoAddress(baseAddress(0), sdk).error, 'testnet');
  assert.equal(parseCardanoAddress('stake_test1uqehkck0lajq8gr28t9uxnuvgcqrc6070x3k9r8048z8y5gh6ffgw', sdk).error, 'testnet');
  assert.equal(parseCardanoAddress('addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x', sdk).error, 'testnet');
  assert.equal(parseCardanoAddress(enterpriseAddress(), sdk).error, 'noStake');
  assert.equal(parseCardanoAddress('Ae2tdPwUPEZFRbyhz3cpfC2CumGzNkFBN2L42rcUc2yjQpEkxDbkPodpMAi', sdk).error, 'invalid');
});

test('shortenAddress keeps both ends readable', () => {
  assert.equal(shortenAddress(EXPECTED_STAKE), `${EXPECTED_STAKE.slice(0, 10)}…${EXPECTED_STAKE.slice(-6)}`);
  assert.equal(shortenAddress('short'), 'short');
});

test('decodeBech32 verifies the checksum and rejects mixed case', () => {
  const decoded = decodeBech32(EXPECTED_STAKE);
  assert.equal(decoded.hrp, 'stake');
  assert.equal(decoded.words.length, 47);
  assert.equal(decodeBech32(EXPECTED_STAKE.slice(0, -1) + 'x'), null);
  assert.equal(decodeBech32(EXPECTED_STAKE.slice(0, 8) + EXPECTED_STAKE.slice(8).toUpperCase()), null);
  assert.equal(decodeBech32('hello'), null);
  assert.equal(decodeBech32(''), null);
});

test('isValidStakeAddress and isValidBaseAddress check hrp, checksum, type and network', () => {
  assert.equal(isValidStakeAddress(EXPECTED_STAKE), true);
  assert.equal(isValidStakeAddress('stake1u9abc'), false);
  assert.equal(isValidStakeAddress(baseAddress(1)), false);
  assert.equal(isValidStakeAddress('stake_test1uqehkck0lajq8gr28t9uxnuvgcqrc6070x3k9r8048z8y5gh6ffgw'), false);
  assert.equal(isValidBaseAddress(baseAddress(1)), true);
  assert.equal(isValidBaseAddress(baseAddress(0)), false);
  assert.equal(isValidBaseAddress(enterpriseAddress()), true);
  assert.equal(isValidBaseAddress('addr1q9abc'), false);
  assert.equal(isValidBaseAddress(EXPECTED_STAKE), false);
});

test('deriveStatus: no row means unknown everywhere', () => {
  assert.deepEqual(deriveStatus(undefined), emptyStatus());
  assert.equal(deriveStatus(null).ada, UNKNOWN);
  assert.equal(deriveStatus({}).ada, UNKNOWN);
});

test('deriveStatus: registered account with pool and drep', () => {
  const s = deriveStatus({ status: 'registered', total_balance: '45000000000000001', delegated_pool: 'pool1abc', delegated_drep: 'drep1xyz' });
  assert.equal(s.ada, true);
  assert.equal(s.balanceLovelace, '45000000000000001');
  assert.equal(s.stake, true);
  assert.equal(s.poolId, 'pool1abc');
  assert.equal(s.vote, true);
  assert.equal(s.drepId, 'drep1xyz');
  assert.equal(s.drepKind, 'drep');
  assert.equal(s.stakeRegistered, true);
});

test('deriveStatus: not registered, no delegation, zero balance', () => {
  const s = deriveStatus({ status: 'not registered', total_balance: '0', delegated_pool: null, delegated_drep: null });
  assert.equal(s.ada, false);
  assert.equal(s.stake, false);
  assert.equal(s.vote, false);
  assert.equal(s.stakeRegistered, false);
});

test('deriveStatus: garbage or negative balance stays unknown', () => {
  assert.equal(deriveStatus({ total_balance: 'abc' }).ada, UNKNOWN);
  assert.equal(deriveStatus({ total_balance: '-5' }).ada, UNKNOWN);
  assert.equal(deriveStatus({ total_balance: 'abc' }).balanceLovelace, null);
});

test('deriveStatus: missing balance stays unknown, protocol dreps count as vote', () => {
  const s = deriveStatus({ status: 'registered', delegated_pool: 'pool1abc', delegated_drep: 'drep_always_abstain' });
  assert.equal(s.ada, UNKNOWN);
  assert.equal(s.vote, true);
  assert.equal(s.drepKind, 'abstain');
  assert.equal(drepKind('drep_always_no_confidence'), 'noConfidence');
  assert.equal(drepKind(null), null);
});

test('withWalletBalance only fills an unknown balance', () => {
  const unknown = deriveStatus({ status: 'not registered' });
  assert.equal(withWalletBalance(unknown, '2000000').ada, true);
  assert.equal(withWalletBalance(unknown, '0').ada, false);
  assert.equal(withWalletBalance(unknown, null).ada, UNKNOWN);
  assert.equal(withWalletBalance(unknown, 'abc').ada, UNKNOWN);
  const known = deriveStatus({ total_balance: '0' });
  assert.equal(withWalletBalance(known, '2000000').ada, false);
});

test('storage validators reject tampered or foreign values', () => {
  assert.equal(ACCOUNT_KEY, 'cardano-get-started-account');
  assert.equal(LOCAL_KEY, 'cardano-get-started-local');
  assert.equal(LEGACY_STEP_KEY, 'cardano-get-started-step');
  const good = { stakeAddress: EXPECTED_STAKE, baseAddress: null, ownership: 'unverified', savedAt: '2026-09-04T10:00:00.000Z' };
  assert.ok(isValidAccount(good));
  assert.ok(isValidAccount({ ...good, baseAddress: baseAddress(1), ownership: 'wallet-confirmed' }));
  assert.equal(isValidAccount(null), false);
  assert.equal(isValidAccount({ ...good, stakeAddress: 'stake1u9abc' }), false);
  assert.equal(isValidAccount({ ...good, stakeAddress: baseAddress(1) }), false);
  assert.equal(isValidAccount({ ...good, baseAddress: 'addr1q9abc' }), false);
  assert.equal(isValidAccount({ ...good, ownership: 'owner' }), false);
  assert.equal(isValidAccount({ ...good, savedAt: 5 }), false);
  assert.equal(isValidAccount({ ...good, savedAt: 'yesterday' }), false);
  assert.deepEqual(emptyLocal(), { walletInstalled: false, phrasePracticePassed: false });
  assert.ok(isValidLocal(emptyLocal()));
  assert.equal(isValidLocal({ walletInstalled: 'yes', phrasePracticePassed: false }), false);
  assert.equal(isValidLocal(3), false);
});

test('computeStations without an address', () => {
  const stations = computeStations({ local: emptyLocal(), account: null, status: emptyStatus() });
  assert.deepEqual(stations.map((s) => s.key), STATION_KEYS);
  assert.deepEqual(stations.map((s) => s.done), [false, false, false, false, false]);
  assert.equal(firstOpenIndex(stations), 0);
  assert.equal(allDone(stations), false);
  assert.equal(doneCount(stations), 0);
});

test('computeStations with a wallet-confirmed account marks station 1 done', () => {
  const account = { stakeAddress: 'stake1u9abc', baseAddress: null, ownership: 'wallet-confirmed', savedAt: 'x' };
  const stations = computeStations({ local: emptyLocal(), account, status: emptyStatus() });
  assert.deepEqual(stations.map((s) => s.done), [true, false, true, UNKNOWN, UNKNOWN]);
  assert.equal(firstOpenIndex(stations), 1);
});

test('computeStations with everything confirmed', () => {
  const account = { stakeAddress: 'stake1u9abc', baseAddress: null, ownership: 'unverified', savedAt: 'x' };
  const status = deriveStatus({ status: 'registered', total_balance: '5', delegated_pool: 'p', delegated_drep: 'd' });
  const stations = computeStations({ local: { walletInstalled: true, phrasePracticePassed: true }, account, status });
  assert.equal(allDone(stations), true);
  assert.equal(doneCount(stations), 5);
  assert.equal(firstOpenIndex(stations), null);
});

test('computeStations: delegate is false when one half is confirmed missing, unknown otherwise', () => {
  const account = { stakeAddress: 'stake1u9abc', baseAddress: null, ownership: 'unverified', savedAt: 'x' };
  const half = deriveStatus({ status: 'registered', total_balance: '5', delegated_pool: 'p', delegated_drep: null });
  assert.equal(computeStations({ local: emptyLocal(), account, status: half })[4].done, false);
  const unknownVote = { ...deriveStatus({ total_balance: '5', delegated_pool: 'p' }), vote: UNKNOWN };
  assert.equal(computeStations({ local: emptyLocal(), account, status: unknownVote })[4].done, UNKNOWN);
});

const WALLETS = [
  { title: 'Eternl', maintainerPick: true, walletFeatures: { platforms: ['ios', 'android', 'browser'] } },
  { title: 'Typhon', maintainerPick: true, walletFeatures: { platforms: ['browser'] } },
  { title: 'Lace', maintainerPick: true, walletFeatures: { platforms: ['browser'] } },
  { title: 'VESPR', maintainerPick: true, walletFeatures: { platforms: ['ios', 'android'] } },
  { title: 'Multisig', maintainerPick: true, walletFeatures: { platforms: ['web'] } },
  { title: 'Other', maintainerPick: false, walletFeatures: { platforms: ['ios'] } },
];

test('detectDevice reads the user agent', () => {
  assert.equal(detectDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'), 'ios');
  assert.equal(detectDevice('Mozilla/5.0 (Linux; Android 14; Pixel 8)'), 'android');
  assert.equal(detectDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)'), 'desktop');
  assert.equal(detectDevice(''), 'desktop');
  assert.equal(detectDevice(undefined), 'desktop');
});

test('pickWalletsForDevice filters maintainer picks by platform and caps at three', () => {
  assert.deepEqual(pickWalletsForDevice(WALLETS, 'ios').map((w) => w.title), ['Eternl', 'VESPR']);
  assert.deepEqual(pickWalletsForDevice(WALLETS, 'android').map((w) => w.title), ['Eternl', 'VESPR']);
  assert.deepEqual(pickWalletsForDevice(WALLETS, 'desktop').map((w) => w.title), ['Eternl', 'Typhon', 'Lace']);
  assert.deepEqual(pickWalletsForDevice(WALLETS, null).map((w) => w.title), ['Eternl', 'Typhon', 'Lace']);
  assert.deepEqual(pickWalletsForDevice(WALLETS, 'desktop', 1).map((w) => w.title), ['Eternl']);
});

test('the demo phrase can never derive a real wallet', () => {
  assert.equal(DEMO_PHRASE.length, 12);
  assert.equal(new Set(DEMO_PHRASE).size, 12);
  for (const word of DEMO_PHRASE) {
    assert.match(word, /^[a-z]+$/);
    assert.equal(BIP39_ENGLISH.includes(word), false, `${word} is a BIP39 word`);
  }
});

test('makeExercise builds distinct rounds with four unique options each', () => {
  let seed = 42;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const rounds = makeExercise(random, 3);
  assert.equal(rounds.length, 3);
  assert.equal(new Set(rounds.map((r) => r.position)).size, 3);
  for (const round of rounds) {
    assert.ok(round.position >= 1 && round.position <= 12);
    assert.equal(round.options.length, 4);
    assert.equal(new Set(round.options).size, 4);
    assert.equal(round.options[round.answer], DEMO_PHRASE[round.position - 1]);
  }
});

test('every curated station question exists in its quiz source', () => {
  for (const [station, refs] of Object.entries(STATION_QUESTIONS)) {
    assert.ok(refs.length >= 1, `${station} has no question`);
    for (const { quiz, id } of refs) {
      const source = JSON.parse(readFileSync(new URL(`../src/data/quiz/${quiz}.json`, import.meta.url), 'utf8'));
      const questions = source.questions || source;
      assert.ok(questions.some((q) => q.id === id), `${id} missing in ${quiz}.json`);
    }
  }
});

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

test('createLatest: only the newest id is current', () => {
  const latest = createLatest();
  const a = latest.next();
  const b = latest.next();
  assert.equal(latest.isCurrent(a), false);
  assert.equal(latest.isCurrent(b), true);
  latest.invalidate();
  assert.equal(latest.isCurrent(b), false);
});

test('checkAccount returns status, names and result', async () => {
  const api = {
    post: async (path) => {
      if (path === '/account_info') return { data: [{ status: 'registered', total_balance: '3000000', delegated_pool: 'pool1abc', delegated_drep: 'drep1xyz' }] };
      if (path === '/pool_info') return { data: [{ meta_json: { name: 'Example Pool', ticker: 'EXMPL' } }] };
      if (path === '/drep_metadata') return { data: [{ meta_json: { body: { givenName: { '@value': 'Alice' } } } }] };
      throw new Error(`unexpected ${path}`);
    },
  };
  const out = await checkAccount({ api, stakeAddress: 'stake1u9abc', isCurrent: () => true });
  assert.equal(out.result, 'ok');
  assert.equal(out.status.ada, true);
  assert.deepEqual(out.names, { poolName: 'Example Pool', poolTicker: 'EXMPL', drepName: 'Alice' });
});

test('checkAccount: empty array is result empty, wallet balance fills the unknown ada flag', async () => {
  const api = { post: async () => ({ data: [] }) };
  const out = await checkAccount({ api, stakeAddress: 'stake1u9abc', readWalletBalance: async () => '5000000', isCurrent: () => true });
  assert.equal(out.result, 'empty');
  assert.equal(out.status.ada, true);
  assert.equal(out.status.stake, UNKNOWN);
  assert.deepEqual(out.names, EMPTY_NAMES);
});

test('checkAccount: failing name lookups do not fail the check', async () => {
  const api = {
    post: async (path) => {
      if (path === '/account_info') return { data: [{ delegated_pool: 'pool1abc', delegated_drep: 'drep1xyz', total_balance: '1' }] };
      throw new Error('down');
    },
  };
  const out = await checkAccount({ api, stakeAddress: 'stake1u9abc', isCurrent: () => true });
  assert.equal(out.status.stake, true);
  assert.deepEqual(out.names, EMPTY_NAMES);
});

test('checkAccount: a superseded request resolves to null even when it finishes last', async () => {
  const latest = createLatest();
  const first = deferred();
  const second = deferred();
  let calls = 0;
  const api = {
    post: async (path) => {
      if (path !== '/account_info') return { data: [] };
      calls += 1;
      return calls === 1 ? first.promise : second.promise;
    },
  };
  const idA = latest.next();
  const runA = checkAccount({ api, stakeAddress: 'stake1u9abc', isCurrent: () => latest.isCurrent(idA) });
  const idB = latest.next();
  const runB = checkAccount({ api, stakeAddress: 'stake1u9abc', isCurrent: () => latest.isCurrent(idB) });
  second.resolve({ data: [{ total_balance: '2' }] });
  first.resolve({ data: [{ total_balance: '1' }] });
  const [a, b] = await Promise.all([runA, runB]);
  assert.equal(a, null);
  assert.equal(b.status.balanceLovelace, '2');
});

test('checkAccount rejects when the account query fails', async () => {
  const api = { post: async () => { throw new Error('timeout'); } };
  await assert.rejects(checkAccount({ api, stakeAddress: 'stake1u9abc', isCurrent: () => true }));
});
