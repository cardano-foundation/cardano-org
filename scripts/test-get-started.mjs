import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLovelace, isPositiveLovelace, formatAda } from '../src/utils/cardano/lovelace.mjs';

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
  assert.equal(parseCardanoAddress(enterpriseAddress(), sdk).error, 'noStake');
  assert.equal(parseCardanoAddress('Ae2tdPwUPEZFRbyhz3cpfC2CumGzNkFBN2L42rcUc2yjQpEkxDbkPodpMAi', sdk).error, 'invalid');
});

test('shortenAddress keeps both ends readable', () => {
  assert.equal(shortenAddress(EXPECTED_STAKE), `${EXPECTED_STAKE.slice(0, 10)}…${EXPECTED_STAKE.slice(-6)}`);
  assert.equal(shortenAddress('short'), 'short');
});
