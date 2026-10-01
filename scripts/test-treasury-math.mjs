import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TREASURY_PARAMS,
  lovelaceToAda,
  normalizeTotals,
  incomeBySource,
  inEpochWindow,
  feeSharePercent,
  median,
  effectiveDepletionRate,
  projectReserves,
  epochStartMs,
  firstEpochOfYear,
  projectedReserveIncome,
  GOVERNANCE_START_EPOCH,
  normalizeWithdrawals,
  withdrawalsInWindow,
  flowsOverWindow,
  summarizeDonations,
} from '../src/utils/insights/treasuryMath.mjs';

const close = (actual, expected, eps = 1e-6) =>
  assert.ok(Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);

// Koios /totals rows fetched on 2026-09-28.
const ROW_639 = { epoch_no: 639, treasury: '1471083728713820', reserves: '6286998922878527', fees: '42314408424' };
const ROW_640 = { epoch_no: 640, treasury: '1464901790894939', reserves: '6276810051360413', fees: '37867906892' };
const ROW_641 = { epoch_no: 641, treasury: '1469970597071996', reserves: '6266556836252161', fees: '43626866290' };

test('lovelaceToAda keeps precision and rejects garbage', () => {
  assert.equal(lovelaceToAda('6276810051360413'), 6276810051.36);
  assert.equal(lovelaceToAda('1000000'), 1);
  assert.equal(lovelaceToAda(null), null);
  assert.equal(lovelaceToAda('abc'), null);
  assert.equal(lovelaceToAda('-5'), null);
});

test('normalizeTotals sorts ascending and drops rows with bad fields', () => {
  const rows = [ROW_641, { epoch_no: 700, treasury: null, reserves: '1', fees: '1' }, ROW_639, ROW_640, { epoch_no: 'x' }];
  const points = normalizeTotals(rows);
  assert.deepEqual(points.map((p) => p.epoch), [639, 640, 641]);
  assert.equal(points[1].reserves, 6276810051.36);
  assert.equal(points[2].fees, 43626.866);
});

test('incomeBySource uses previous reserves and current fees', () => {
  const income = incomeBySource(normalizeTotals([ROW_639, ROW_640, ROW_641]));
  assert.equal(income.length, 2);
  assert.equal(income[1].epoch, 641);
  close(income[1].reserveShare, 0.2 * 0.003 * 6276810051.36);
  close(income[1].feeShare, 0.2 * 43626.866);
});

test('incomeBySource skips pairs across a gap', () => {
  const income = incomeBySource(normalizeTotals([ROW_639, ROW_641]));
  assert.deepEqual(income, []);
});

const INCOME = [
  { epoch: 1, reserveShare: 900, feeShare: 100 },
  { epoch: 2, reserveShare: 300, feeShare: 100 },
  { epoch: 3, reserveShare: 100, feeShare: 0 },
];

test('inEpochWindow selects by epoch number', () => {
  assert.deepEqual(inEpochWindow(INCOME, 3, 2).map((e) => e.epoch), [2, 3]);
  assert.deepEqual(inEpochWindow(INCOME, 5, 3).map((e) => e.epoch), [3]);
});

test('feeSharePercent is a ratio of sums over the epoch window', () => {
  close(feeSharePercent(INCOME, 3, 2), (100 / 500) * 100);
  close(feeSharePercent(INCOME, 3, 3), (200 / 1500) * 100);
  assert.equal(feeSharePercent(INCOME, 3, 1), null);
});

test('a gap inside the window shrinks the sample and never reaches further back', () => {
  const withGap = [INCOME[0], INCOME[2]];
  // Window of 2 epochs ending at 3 holds only epoch 3, too few points.
  assert.equal(feeSharePercent(withGap, 3, 2), null);
  close(feeSharePercent(withGap, 3, 3), (100 / 1100) * 100);
});

test('median handles odd, even and empty input', () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([4, 1, 2, 3]), 2.5);
  assert.equal(median([]), null);
});

test('effectiveDepletionRate is the median relative drop inside the window, gaps skipped', () => {
  const points = [
    { epoch: 10, reserves: 1000, treasury: 0, fees: 0 },
    { epoch: 11, reserves: 990, treasury: 0, fees: 0 },
    { epoch: 12, reserves: 970.2, treasury: 0, fees: 0 },
    { epoch: 14, reserves: 500, treasury: 0, fees: 0 },
    { epoch: 15, reserves: 495, treasury: 0, fees: 0 },
  ];
  // Pairs: 10-11 1%, 11-12 2%, 14-15 1%. The 12-14 gap is skipped.
  close(effectiveDepletionRate(points, 73), 0.01);
  // Window of 3 epochs ending at 15 covers epochs 13 to 15: only 14-15 is valid.
  assert.equal(effectiveDepletionRate(points, 3), null);
  assert.equal(effectiveDepletionRate(points.slice(0, 2), 73), null);
});

test('projectReserves compounds the rate per epoch', () => {
  const series = projectReserves(100, 1000, 0.01, 102);
  assert.deepEqual(series.map((p) => p.epoch), [100, 101, 102]);
  close(series[2].reserves, 1000 * 0.99 * 0.99);
  assert.deepEqual(projectReserves(100, 1000, null, 102), []);
});

test('epoch dates follow the Shelley 5-day schedule', () => {
  assert.equal(new Date(epochStartMs(209)).toISOString(), '2020-08-03T21:44:00.000Z');
  assert.equal(new Date(epochStartMs(210)).toISOString(), '2020-08-08T21:44:00.000Z');
  const e2030 = firstEpochOfYear(2030);
  assert.ok(epochStartMs(e2030) >= Date.UTC(2030, 0, 1));
  assert.ok(epochStartMs(e2030 - 1) < Date.UTC(2030, 0, 1));
});

test('projectedReserveIncome uses tau and rho', () => {
  close(projectedReserveIncome(1000), 1000 * TREASURY_PARAMS.tau * TREASURY_PARAMS.rho);
});

test('summarizeDonations totals the snapshot and finds the largest epoch', () => {
  const snap = {
    updatedEpoch: 657,
    epochs: [
      { epoch: 640, lovelace: '19498236000000' },
      { epoch: 652, lovelace: '347425230000' },
      { epoch: 651, lovelace: '2000000' },
    ],
  };
  const s = summarizeDonations(snap);
  close(s.totalAda, 19498236 + 347425.23 + 2);
  assert.equal(s.epochCount, 3);
  assert.equal(s.updatedEpoch, 657);
  assert.equal(s.largest.epoch, 640);
  close(s.largest.sharePercent, (19498236 / s.totalAda) * 100);
});

test('summarizeDonations counts donations below one thousandth of an ada', () => {
  const s = summarizeDonations({ updatedEpoch: 20, epochs: [{ epoch: 10, lovelace: '7' }, { epoch: 11, lovelace: '999' }] });
  assert.equal(s.epochCount, 2);
  close(s.totalAda, 0.001006);
  assert.equal(s.largest.epoch, 11);
});

test('summarizeDonations with no epochs shows zero and no largest', () => {
  const s = summarizeDonations({ updatedEpoch: 657, epochs: [] });
  assert.equal(s.totalAda, 0);
  assert.equal(s.epochCount, 0);
  assert.equal(s.largest, null);
  assert.equal(summarizeDonations(null).largest, null);
});

test('normalizeWithdrawals sums payouts, sorts newest first and drops broken rows', () => {
  const rows = [
    { proposal_id: 'gov_action1a', enacted_epoch: 646, title: 'Mithril', withdrawal: [{ amount: '3810423000000' }] },
    { proposal_id: 'gov_action1b', enacted_epoch: 650, title: 'Prime', withdrawal: [{ amount: '100000000000000' }, { amount: '20000000000000' }] },
    { proposal_id: 'gov_action1c', enacted_epoch: 646, title: '  ', withdrawal: [{ amount: '25400000000000' }] },
    { proposal_id: 'gov_action1d', enacted_epoch: 646, title: 'Bad', withdrawal: [{ amount: 'x' }] },
    { proposal_id: '', enacted_epoch: 646, title: 'No id', withdrawal: [{ amount: '1' }] },
    { proposal_id: 'gov_action1e', enacted_epoch: null, title: 'Not enacted', withdrawal: [{ amount: '1' }] },
    { proposal_id: 'gov_action1f', enacted_epoch: 646, title: 'Empty', withdrawal: [] },
  ];
  const list = normalizeWithdrawals(rows);
  assert.deepEqual(list.map((w) => w.id), ['gov_action1b', 'gov_action1c', 'gov_action1a']);
  assert.equal(list[0].ada, 120000000);
  assert.equal(list[1].title, null);
  assert.equal(list[2].title, 'Mithril');
  assert.deepEqual(normalizeWithdrawals(null), []);
});

test('withdrawalsInWindow keeps both bounds and the governance era', () => {
  const list = [{ epoch: 610 }, { epoch: 609 }, { epoch: 605 }, { epoch: 604 }];
  assert.deepEqual(withdrawalsInWindow(list, 609, 5).map((w) => w.epoch), [609, 605]);
  assert.equal(withdrawalsInWindow(list, 575, 5), null);
  assert.equal(GOVERNANCE_START_EPOCH, 571);
});

// Ten epochs from 600 to 609, treasury grows by 10 per epoch.
const FLOW_POINTS = Array.from({ length: 10 }, (_, i) => ({ epoch: 600 + i, treasury: 1000 + 10 * i, reserves: 100000, fees: 50 }));
const FLOW_WITHDRAWALS = [
  { id: 'a', epoch: 609, title: 'A', ada: 40 },
  { id: 'b', epoch: 605, title: 'B', ada: 25 },
  { id: 'c', epoch: 604, title: 'C', ada: 99 }, // before the window
];
const FLOW_DONATIONS = { updatedEpoch: 609, epochs: [{ epoch: 604, lovelace: '7000000' }, { epoch: 605, lovelace: '3000000' }, { epoch: 609, lovelace: '1000000' }] };

test('flowsOverWindow sums income, withdrawals and donations over the window', () => {
  const f = flowsOverWindow({ points: FLOW_POINTS, withdrawals: FLOW_WITHDRAWALS, donations: FLOW_DONATIONS, latestEpoch: 609, window: 5 });
  assert.equal(f.startEpoch, 604);
  assert.equal(f.startBalance, 1040);
  assert.equal(f.endBalance, 1090);
  assert.equal(f.netChange, 50);
  // Five income epochs (605 to 609), each 0.2 * (0.003 * 100000 + 50) = 70.
  close(f.income, 350);
  assert.equal(f.paidOut, 65);
  assert.equal(f.paidOutCount, 2);
  // Donations made in 604 to 608 reach the balance inside the window, 609 does not yet.
  close(f.returned, 10);
});

test('flowsOverWindow is null before the governance era or without a start row', () => {
  const early = FLOW_POINTS.map((p) => ({ ...p, epoch: p.epoch - 100 }));
  assert.equal(flowsOverWindow({ points: early, withdrawals: [], donations: FLOW_DONATIONS, latestEpoch: 509, window: 5 }), null);
  assert.equal(flowsOverWindow({ points: FLOW_POINTS.slice(5), withdrawals: [], donations: FLOW_DONATIONS, latestEpoch: 609, window: 5 }), null);
});

test('flowsOverWindow leaves income unknown when an epoch inside the window is missing', () => {
  const gap = FLOW_POINTS.filter((p) => p.epoch !== 607);
  const f = flowsOverWindow({ points: gap, withdrawals: FLOW_WITHDRAWALS, donations: FLOW_DONATIONS, latestEpoch: 609, window: 5 });
  assert.equal(f.income, null);
  assert.equal(f.netChange, 50);
  assert.equal(f.paidOut, 65);
});

test('flowsOverWindow leaves donations unknown when the snapshot is missing or behind', () => {
  const stale = { ...FLOW_DONATIONS, updatedEpoch: 607 };
  assert.equal(flowsOverWindow({ points: FLOW_POINTS, withdrawals: [], donations: stale, latestEpoch: 609, window: 5 }).returned, null);
  assert.equal(flowsOverWindow({ points: FLOW_POINTS, withdrawals: [], donations: null, latestEpoch: 609, window: 5 }).returned, null);
  // A snapshot that ends one epoch before the latest is complete.
  close(flowsOverWindow({ points: FLOW_POINTS, withdrawals: [], donations: { ...FLOW_DONATIONS, updatedEpoch: 608 }, latestEpoch: 609, window: 5 }).returned, 10);
});
