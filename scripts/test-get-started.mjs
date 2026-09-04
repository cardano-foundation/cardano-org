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
