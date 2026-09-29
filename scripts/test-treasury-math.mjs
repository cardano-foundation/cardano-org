import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TREASURY_PARAMS,
  lovelaceToAda,
  normalizeTotals,
  incomeBySource,
  inEpochWindow,
  feeSharePercent,
  reserveToFeeRatio,
  median,
  effectiveDepletionRate,
  projectReserves,
  epochStartMs,
  firstEpochOfYear,
  projectedReserveIncome,
  feesNeededToReplace,
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

test('feeSharePercent and reserveToFeeRatio are ratios of sums over the epoch window', () => {
  close(feeSharePercent(INCOME, 3, 2), (100 / 500) * 100);
  close(feeSharePercent(INCOME, 3, 3), (200 / 1500) * 100);
  close(reserveToFeeRatio(INCOME, 3, 3), 1300 / 200);
  assert.equal(feeSharePercent(INCOME, 3, 1), null);
  assert.equal(reserveToFeeRatio(INCOME.slice(2), 3, 3), null);
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

test('projectedReserveIncome and feesNeededToReplace use tau and rho', () => {
  close(projectedReserveIncome(1000), 1000 * TREASURY_PARAMS.tau * TREASURY_PARAMS.rho);
  const income = [{ epoch: 5, reserveShare: 3000, feeShare: 10 }];
  close(feesNeededToReplace(income, 5), 3000 / TREASURY_PARAMS.tau);
  assert.equal(feesNeededToReplace([], 5), null);
});

test('feesNeededToReplace never falls back to an older epoch', () => {
  const income = [{ epoch: 640, reserveShare: 3000, feeShare: 10 }];
  assert.equal(feesNeededToReplace(income, 642), null);
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
