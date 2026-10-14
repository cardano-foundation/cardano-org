import test from 'node:test';
import assert from 'node:assert/strict';
import { planRange, collectDonations, mergeSnapshot, runUpdate, FIRST_DONATION_EPOCH } from './update-treasury-donations.mjs';

const noSleep = async () => {};

function fakeKoios(byEpoch, { failures = {}, currentEpoch = 20 } = {}) {
  const calls = [];
  const getJson = async (path) => {
    calls.push(path);
    if (path.startsWith('/tip')) return [{ epoch_no: currentEpoch }];
    const epoch = Number(new URL(path, 'https://x').searchParams.get('_epoch_no'));
    if (failures[epoch] > 0) {
      failures[epoch] -= 1;
      throw new Error('ECONNRESET');
    }
    return epoch in byEpoch ? [{ epoch_no: epoch, treasury_donation: byEpoch[epoch] }] : [];
  };
  return { getJson, calls };
}

function memoryFile(initial) {
  const state = { value: initial, writes: 0 };
  return {
    state,
    readSnapshot: async () => state.value,
    writeSnapshot: async (next) => {
      state.writes += 1;
      state.value = next;
    },
  };
}

test('planRange resumes after updatedEpoch and stops before the running epoch', () => {
  assert.deepEqual(planRange({ updatedEpoch: 650, epochs: [] }, 658), { fromEpoch: 651, toEpoch: 657 });
  assert.deepEqual(planRange(null, 658), { fromEpoch: FIRST_DONATION_EPOCH, toEpoch: 657 });
  assert.equal(planRange({ updatedEpoch: 657, epochs: [] }, 658), null);
});

test('collects only positive donations in the range', async () => {
  const { getJson } = fakeKoios({ 10: '0', 11: '5000000', 12: '0' });
  const found = await collectDonations({ getJson, fromEpoch: 10, toEpoch: 12, sleep: noSleep });
  assert.deepEqual(found, [{ epoch: 11, lovelace: '5000000' }]);
});

test('retries a flaky epoch and then succeeds', async () => {
  const { getJson, calls } = fakeKoios({ 10: '7' }, { failures: { 10: 2 } });
  const found = await collectDonations({ getJson, fromEpoch: 10, toEpoch: 10, sleep: noSleep });
  assert.deepEqual(found, [{ epoch: 10, lovelace: '7' }]);
  assert.equal(calls.length, 3);
});

test('aborts after three failed attempts', async () => {
  const { getJson } = fakeKoios({ 10: '7' }, { failures: { 10: 3 } });
  await assert.rejects(collectDonations({ getJson, fromEpoch: 10, toEpoch: 10, sleep: noSleep }), /epoch 10/);
});

test('a missing row or a null field is an error, never zero', async () => {
  const missing = fakeKoios({});
  await assert.rejects(collectDonations({ getJson: missing.getJson, fromEpoch: 10, toEpoch: 10, sleep: noSleep }), /epoch 10/);
  const nulled = fakeKoios({ 10: null });
  await assert.rejects(collectDonations({ getJson: nulled.getJson, fromEpoch: 10, toEpoch: 10, sleep: noSleep }), /epoch 10/);
});

test('mergeSnapshot appends, sorts and advances updatedEpoch', () => {
  const prev = { updatedEpoch: 11, epochs: [{ epoch: 11, lovelace: '5' }] };
  const next = mergeSnapshot(prev, [{ epoch: 13, lovelace: '9' }], 14);
  assert.deepEqual(next, { updatedEpoch: 14, epochs: [{ epoch: 11, lovelace: '5' }, { epoch: 13, lovelace: '9' }] });
  assert.deepEqual(mergeSnapshot(null, [], 14), { updatedEpoch: 14, epochs: [] });
});

test('runUpdate writes nothing when a later epoch fails after earlier ones succeeded', async () => {
  const koios = fakeKoios({ 16: '5', 17: '0' }, { currentEpoch: 20 }); // 18 and 19 are missing
  const file = memoryFile({ updatedEpoch: 15, epochs: [] });
  await assert.rejects(runUpdate({ getJson: koios.getJson, ...file, sleep: noSleep }), /epoch 18/);
  assert.equal(file.state.writes, 0);
  assert.deepEqual(file.state.value, { updatedEpoch: 15, epochs: [] });
});

test('runUpdate resumes at updatedEpoch + 1 and writes once', async () => {
  const koios = fakeKoios({ 18: '0', 19: '3' }, { currentEpoch: 20 });
  const file = memoryFile({ updatedEpoch: 17, epochs: [{ epoch: 16, lovelace: '5' }] });
  const result = await runUpdate({ getJson: koios.getJson, ...file, sleep: noSleep });
  assert.equal(result.status, 'written');
  assert.equal(file.state.writes, 1);
  assert.deepEqual(file.state.value, { updatedEpoch: 19, epochs: [{ epoch: 16, lovelace: '5' }, { epoch: 19, lovelace: '3' }] });
  const queried = koios.calls.filter((c) => c.includes('_epoch_no=')).map((c) => Number(new URL(c, 'https://x').searchParams.get('_epoch_no')));
  assert.deepEqual(queried, [18, 19]);
});

test('runUpdate does nothing when the snapshot is current', async () => {
  const koios = fakeKoios({}, { currentEpoch: 20 });
  const file = memoryFile({ updatedEpoch: 19, epochs: [] });
  const result = await runUpdate({ getJson: koios.getJson, ...file, sleep: noSleep });
  assert.equal(result.status, 'current');
  assert.equal(file.state.writes, 0);
});

test('a failing write surfaces as an error', async () => {
  const koios = fakeKoios({ 19: '0' }, { currentEpoch: 20 });
  const readSnapshot = async () => ({ updatedEpoch: 18, epochs: [] });
  const writeSnapshot = async () => {
    throw new Error('EACCES');
  };
  await assert.rejects(runUpdate({ getJson: koios.getJson, readSnapshot, writeSnapshot, sleep: noSleep }), /EACCES/);
});
