import test from 'node:test';
import assert from 'node:assert/strict';
import { readTimedCache, writeTimedCache } from '../src/utils/insights/timedCache.mjs';

function memoryStorage() {
  const map = new Map();
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)) };
}

test('round trip within the ttl', () => {
  const s = memoryStorage();
  writeTimedCache(s, 'k', [1, 2], 1000);
  assert.deepEqual(readTimedCache(s, 'k', 500, 1400), [1, 2]);
});

test('stale entries are ignored', () => {
  const s = memoryStorage();
  writeTimedCache(s, 'k', [1], 1000);
  assert.equal(readTimedCache(s, 'k', 500, 1501), null);
});

test('corrupt or foreign entries are ignored', () => {
  const s = memoryStorage();
  s.setItem('a', '{not json');
  s.setItem('b', JSON.stringify({ value: [1] }));
  s.setItem('c', JSON.stringify({ ts: 'x', value: [1] }));
  assert.equal(readTimedCache(s, 'a', 500, 0), null);
  assert.equal(readTimedCache(s, 'b', 500, 0), null);
  assert.equal(readTimedCache(s, 'c', 500, 0), null);
});

test('throwing or missing storage never throws', () => {
  const broken = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('quota'); } };
  assert.equal(readTimedCache(broken, 'k', 500, 0), null);
  assert.doesNotThrow(() => writeTimedCache(broken, 'k', [1], 0));
  assert.equal(readTimedCache(null, 'k', 500, 0), null);
  assert.doesNotThrow(() => writeTimedCache(undefined, 'k', [1], 0));
});
