// Tests for the network-free parts of the stake pool loading path:
// src/utils/cardano/koiosPools.mjs (Koios reads over an injected client) and
// src/utils/cardano/poolSampler.mjs (the progressive random selection).
// Run with `node --test`.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fetchPoolIndex, fetchPoolInfoOne, fetchPoolInfoSettled, INDEX_PAGE_SIZE, INDEX_PARALLEL_PAGES,
} from '../src/utils/cardano/koiosPools.mjs';
import { createPoolSampler } from '../src/utils/cardano/poolSampler.mjs';
import { encodeBech32 } from '../src/utils/cardano/bech32.mjs';

const NUTS_BECH32 = 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy';

function indexRow(overrides = {}) {
  return {
    pool_id_bech32: NUTS_BECH32, ticker: 'NUTS', pool_status: 'registered', pool_group: null,
    active_stake: '6597014404383', margin: 0.049, fixed_cost: '340000000', pledge: '250000000000',
    retiring_epoch: null, ...overrides,
  };
}

// Fake client that serves `total` index rows in pages of INDEX_PAGE_SIZE and
// records the order in which offsets were requested.
function indexApi(total) {
  const calls = [];
  return {
    calls,
    async get(path) {
      const offset = Number(new URL(`https://x${path}`).searchParams.get('offset'));
      calls.push(offset);
      const count = Math.max(0, Math.min(INDEX_PAGE_SIZE, total - offset));
      return { data: Array.from({ length: count }, () => indexRow()) };
    },
  };
}

test('fetchPoolIndex requests the first pages in parallel and stops after a short page', async () => {
  const api = indexApi(2912);
  const rows = await fetchPoolIndex(api);
  assert.equal(rows.length, 2912);
  assert.deepEqual(api.calls, [0, 1000, 2000, 3000]);
});

test('fetchPoolIndex fetches a second wave when the first wave is full', async () => {
  const api = indexApi(INDEX_PAGE_SIZE * INDEX_PARALLEL_PAGES + 5);
  const rows = await fetchPoolIndex(api);
  assert.equal(rows.length, INDEX_PAGE_SIZE * INDEX_PARALLEL_PAGES + 5);
  assert.equal(api.calls.length, INDEX_PARALLEL_PAGES * 2);
});

test('fetchPoolIndex drops malformed rows and throws when nothing usable comes back', async () => {
  const api = { async get() { return { data: [indexRow({ pool_id_bech32: 'nope' }), indexRow({ pool_status: 'weird' })] }; } };
  await assert.rejects(() => fetchPoolIndex(api), /no usable rows/);
});

function infoRow(id) {
  return {
    pool_id_bech32: id, pool_status: 'registered', retiring_epoch: null, margin: 0.049,
    fixed_cost: '340000000', pledge: '250000000000', live_pledge: '253973151490',
    live_stake: '6630721844585', live_delegators: 291, live_saturation: 8.53, block_count: 3767,
    meta_json: { name: 'StakeNuts', ticker: 'NUTS', homepage: 'https://stakenuts.com/' },
  };
}

// Fake client for pool_info: `failing` ids reject, `missing` ids answer with
// an empty array, everything else answers with one row per id.
function infoApi({ failing = [], missing = [] } = {}) {
  const calls = [];
  return {
    calls,
    async post(path, body, config) {
      assert.equal(path, '/pool_info');
      calls.push({ ids: body._pool_bech32_ids, timeout: config?.timeout, signal: config?.signal });
      const ids = body._pool_bech32_ids;
      if (ids.some((id) => failing.includes(id))) throw new Error('timeout of 30000ms exceeded');
      return { data: ids.filter((id) => !missing.includes(id)).map(infoRow) };
    },
  };
}

test('fetchPoolInfoOne returns the row, null for an unknown pool and throws on failure', async () => {
  const api = infoApi({ failing: ['pool1slow'], missing: ['pool1gone'] });
  const signal = new AbortController().signal;
  const row = await fetchPoolInfoOne(api, 'pool1fast', { signal });
  assert.equal(row.pool_id_bech32, 'pool1fast');
  assert.equal(api.calls[0].signal, signal);
  assert.equal(api.calls[0].timeout, 30000);
  assert.equal(await fetchPoolInfoOne(api, 'pool1gone'), null);
  await assert.rejects(() => fetchPoolInfoOne(api, 'pool1slow'), /timeout/);
});

test('fetchPoolInfoSettled drops a failed batch and keeps the others', async () => {
  const api = infoApi({ failing: ['pool1slow'] });
  const ids = Array.from({ length: 9 }, (_, i) => `pool1a${i}`);
  ids[8] = 'pool1slow';
  const rows = await fetchPoolInfoSettled(api, ids);
  assert.deepEqual(rows.map((r) => r.pool_id_bech32), ids.slice(0, 8));
  assert.deepEqual(api.calls.map((c) => c.ids.length), [8, 1]);
});

test('fetchPoolInfoSettled throws only when every batch failed and returns [] for no ids', async () => {
  const api = infoApi({ failing: ['pool1x', 'pool1y'] });
  await assert.rejects(() => fetchPoolInfoSettled(api, ['pool1x', 'pool1y']), /timeout/);
  assert.deepEqual(await fetchPoolInfoSettled(api, []), []);
});

// Fake fetchOne whose promises the test resolves by hand, in any order.
function manualFetch() {
  const pending = new Map();
  const fetchOne = (id) => new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  const settle = async (id, value) => { pending.get(id).resolve(value); pending.delete(id); await flush(); };
  const fail = async (id) => { pending.get(id).reject(new Error(`boom ${id}`)); pending.delete(id); await flush(); };
  return { fetchOne, settle, fail, pending };
}

// Lets the microtask queue drain so promise callbacks inside the sampler run.
async function flush() {
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
}

// Valid pool ids for the sampler tests, toPoolModel rejects made-up strings.
const IDS = Array.from({ length: 30 }, (_, i) => encodeBech32('pool', [...Array(27).fill(0), i]));

function candidates(n) {
  return Array.from({ length: n }, (_, i) => indexRow({ pool_id_bech32: IDS[i], ticker: `C${i}` }));
}

function sampler(fetch, overrides = {}) {
  const snapshots = [];
  const s = createPoolSampler({
    candidates: candidates(30), fetchOne: fetch.fetchOne, onChange: (snap) => snapshots.push(snap),
    displayCount: 3, spareTarget: 2, maxInFlight: 4, maxFailures: 3, ...overrides,
  });
  return { s, snapshots, last: () => snapshots[snapshots.length - 1] };
}

test('sampler starts maxInFlight requests and shows pools as they arrive', async () => {
  const fetch = manualFetch();
  const { s, last } = sampler(fetch);
  s.start();
  assert.equal(fetch.pending.size, 4);
  assert.equal(last().status, 'loading');
  await fetch.settle(IDS[2], infoRow(IDS[2]));
  assert.deepEqual(last().pools.map((p) => p.id), [IDS[2]]);
  assert.equal(last().status, 'loading');
  await fetch.settle(IDS[0], infoRow(IDS[0]));
  await fetch.settle(IDS[1], infoRow(IDS[1]));
  assert.equal(last().status, 'ready');
  assert.deepEqual(last().pools.map((p) => p.id), [IDS[2], IDS[0], IDS[1]]);
  // 3 shown, target 2 spare: two more requests keep running in the background.
  assert.equal(fetch.pending.size, 2);
});

test('sampler serves a shuffle from the spare pool and refills it', async () => {
  const fetch = manualFetch();
  const { s, snapshots, last } = sampler(fetch);
  s.start();
  for (const id of [IDS[0], IDS[1], IDS[2], IDS[3], IDS[4]]) await fetch.settle(id, infoRow(id));
  // Two answers went to the spare pool and no request is left running.
  assert.equal(fetch.pending.size, 0);
  const before = snapshots.length;
  s.shuffle();
  const first = snapshots[before];
  assert.deepEqual(first.pools.map((p) => p.id), [IDS[3], IDS[4]]);
  assert.equal(first.status, 'loading');
  assert.equal(fetch.pending.size, 3);
  await fetch.settle(IDS[5], infoRow(IDS[5]));
  assert.equal(last().status, 'ready');
  assert.deepEqual(last().pools.map((p) => p.id), [IDS[3], IDS[4], IDS[5]]);
});

test('sampler skips unknown and ineligible pools without counting them as failures', async () => {
  const fetch = manualFetch();
  const { s, last } = sampler(fetch);
  s.start();
  await fetch.settle(IDS[0], null);
  await fetch.settle(IDS[1], { ...infoRow(IDS[1]), live_saturation: 120 });
  assert.equal(last().pools.length, 0);
  assert.equal(last().status, 'loading');
  assert.equal(fetch.pending.size, 4);
});

test('sampler stops after maxFailures in a row and reports an error when nothing is shown', async () => {
  const fetch = manualFetch();
  const { s, last } = sampler(fetch);
  s.start();
  // Each failure frees a slot that gets refilled until the third failure.
  await fetch.fail(IDS[0]);
  await fetch.fail(IDS[1]);
  await fetch.fail(IDS[2]);
  assert.equal(fetch.pending.size, 3);
  assert.equal(last().status, 'loading');
  await fetch.fail(IDS[3]);
  await fetch.fail(IDS[4]);
  await fetch.fail(IDS[5]);
  assert.equal(last().status, 'error');
  assert.match(last().error.message, /boom/);
  assert.equal(fetch.pending.size, 0);
});

test('sampler is ready with fewer pools when the candidates run out', async () => {
  const fetch = manualFetch();
  const { s, last } = sampler(fetch, { candidates: candidates(2) });
  s.start();
  await fetch.settle(IDS[0], infoRow(IDS[0]));
  await fetch.settle(IDS[1], infoRow(IDS[1]));
  assert.equal(last().status, 'ready');
  assert.equal(last().pools.length, 2);
});

test('sampler does not report answers that change nothing visible', async () => {
  const fetch = manualFetch();
  const { s, snapshots } = sampler(fetch);
  s.start();
  for (const id of [IDS[0], IDS[1], IDS[2]]) await fetch.settle(id, infoRow(id));
  const count = snapshots.length;
  await fetch.settle(IDS[3], infoRow(IDS[3]));
  await fetch.settle(IDS[4], null);
  assert.equal(snapshots.length, count);
});

test('sampler ignores answers after stop', async () => {
  const fetch = manualFetch();
  const { s, snapshots } = sampler(fetch);
  s.start();
  const count = snapshots.length;
  s.stop();
  await fetch.settle(IDS[0], infoRow(IDS[0]));
  assert.equal(snapshots.length, count);
});
