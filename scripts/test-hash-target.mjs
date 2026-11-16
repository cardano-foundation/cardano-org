import test from 'node:test';
import assert from 'node:assert/strict';
import { hashTargetId } from '../src/utils/hashTarget.mjs';

test('hashTargetId decodes a normal hash', () => {
  assert.equal(hashTargetId('#donate'), 'donate');
  assert.equal(hashTargetId('#caf%C3%A9'), 'café');
});

test('hashTargetId returns null for an empty or malformed hash instead of throwing', () => {
  assert.equal(hashTargetId(''), null);
  assert.equal(hashTargetId('#'), null);
  assert.equal(hashTargetId('#%E0%A4%A'), null);
});
