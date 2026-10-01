// Pure helpers for the treasury overview on /governance/treasury.
// Kept free of @site imports so node --test can load them directly.
import { parseLovelace } from '../cardano/lovelace.mjs';

// Protocol parameters that set the treasury cut. Both values are unchanged
// on mainnet from epoch 208 to at least epoch 658 (db-sync epoch_param).
// If governance ever changes one, turn this into a list with epoch bounds.
export const TREASURY_PARAMS = { tau: 0.2, rho: 0.003 };
export const EPOCHS_PER_YEAR = 73;
export const DEFAULT_WINDOW = EPOCHS_PER_YEAR;
// First epoch with on-chain governance withdrawals (same as GOVERNANCE_EPOCH_THRESHOLD in epochs.js).
export const GOVERNANCE_START_EPOCH = 571;

// Same reference point as src/utils/insights/epochs.js, repeated here because
// that file cannot be loaded by node --test.
const REFERENCE_EPOCH = 209;
const REFERENCE_START_MS = Date.UTC(2020, 7, 3, 21, 44, 0);
const EPOCH_MS = 5 * 24 * 60 * 60 * 1000;

// Lovelace string to ada with three decimals. BigInt first, because the
// early reserves exceed Number.MAX_SAFE_INTEGER in lovelace.
export function lovelaceToAda(value) {
  const n = parseLovelace(value);
  if (n === null) return null;
  return Number(n / 1000n) / 1000;
}

// Koios /totals rows to ascending points in ada. Rows with any unusable
// field are dropped so they never count as zero.
export function normalizeTotals(rows) {
  if (!Array.isArray(rows)) return [];
  const points = [];
  for (const row of rows) {
    const epoch = Number(row?.epoch_no);
    if (!Number.isInteger(epoch)) continue;
    const treasury = lovelaceToAda(row.treasury);
    const reserves = lovelaceToAda(row.reserves);
    const fees = lovelaceToAda(row.fees);
    if (treasury === null || reserves === null || fees === null) continue;
    points.push({ epoch, treasury, reserves, fees });
  }
  return points.sort((a, b) => a.epoch - b.epoch);
}

// Treasury cut per epoch, split by source. totals[N].fees are the fees of
// epoch N-1, which feed the reward pot paid at the start of N, together
// with rho times the reserves at N-1.
export function incomeBySource(points, params = TREASURY_PARAMS) {
  const income = [];
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const cur = points[i];
    if (cur.epoch !== prev.epoch + 1) continue;
    income.push({
      epoch: cur.epoch,
      reserveShare: params.tau * params.rho * prev.reserves,
      feeShare: params.tau * cur.fees,
    });
  }
  return income;
}

// Entries of the last `window` epochs up to and including latestEpoch.
export function inEpochWindow(list, latestEpoch, window) {
  return list.filter((e) => e.epoch > latestEpoch - window && e.epoch <= latestEpoch);
}

function windowSums(income, latestEpoch, window) {
  const slice = inEpochWindow(income, latestEpoch, window);
  if (slice.length < 2) return null;
  let reserve = 0;
  let fee = 0;
  for (const e of slice) {
    reserve += e.reserveShare;
    fee += e.feeShare;
  }
  return { reserve, fee };
}

// Fee share of the treasury's reward income in percent, donations excluded.
export function feeSharePercent(income, latestEpoch, window = DEFAULT_WINDOW) {
  const sums = windowSums(income, latestEpoch, window);
  if (!sums || sums.reserve + sums.fee <= 0) return null;
  return (sums.fee / (sums.reserve + sums.fee)) * 100;
}

export function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Median relative drop of the reserves per epoch over the last window,
// ending at the last point. Lower than rho because undistributed rewards
// flow back into the reserves.
export function effectiveDepletionRate(points, window = DEFAULT_WINDOW) {
  const latest = points[points.length - 1];
  if (!latest) return null;
  const rates = [];
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const cur = points[i];
    if (cur.epoch <= latest.epoch - window) continue;
    if (cur.epoch !== prev.epoch + 1 || prev.reserves <= 0) continue;
    rates.push((prev.reserves - cur.reserves) / prev.reserves);
  }
  if (rates.length < 2) return null;
  return median(rates);
}

export function projectReserves(startEpoch, startReserves, rate, endEpoch) {
  if (rate == null || !Number.isFinite(rate)) return [];
  const series = [];
  let reserves = startReserves;
  for (let epoch = startEpoch; epoch <= endEpoch; epoch += 1) {
    series.push({ epoch, reserves });
    reserves *= 1 - rate;
  }
  return series;
}

export function epochStartMs(epoch) {
  return REFERENCE_START_MS + (epoch - REFERENCE_EPOCH) * EPOCH_MS;
}

// First epoch that starts on or after 1 January of the given year (UTC).
export function firstEpochOfYear(year) {
  const target = Date.UTC(year, 0, 1);
  return REFERENCE_EPOCH + Math.ceil((target - REFERENCE_START_MS) / EPOCH_MS);
}

export function projectedReserveIncome(reserves, params = TREASURY_PARAMS) {
  return params.tau * params.rho * reserves;
}

// Sums in BigInt lovelace so tiny donations are never rounded away. Only
// the final figures become Numbers.
export function summarizeDonations(snapshot) {
  const epochs = Array.isArray(snapshot?.epochs) ? snapshot.epochs : [];
  let total = 0n;
  let epochCount = 0;
  let largest = null;
  for (const entry of epochs) {
    const n = parseLovelace(entry?.lovelace);
    if (n === null || n <= 0n) continue;
    epochCount += 1;
    total += n;
    if (!largest || n > largest.lovelace) largest = { epoch: entry.epoch, lovelace: n };
  }
  // Exact conversion here. lovelaceToAda truncates to three decimals, which
  // would hide donations below 0.001 ada.
  const toAda = (n) => Number(n) / 1e6;
  const updatedEpoch = Number.isInteger(snapshot?.updatedEpoch) ? snapshot.updatedEpoch : null;
  return {
    totalAda: toAda(total),
    epochCount,
    updatedEpoch,
    largest: largest
      ? { epoch: largest.epoch, ada: toAda(largest.lovelace), sharePercent: (Number(largest.lovelace) / Number(total)) * 100 }
      : null,
  };
}

// Enacted treasury withdrawals from Koios /proposal_list. Each proposal can pay
// several recipients, the amount is their sum. A row with any unusable part is
// dropped, so a broken amount never shows up as 0 ada.
export function normalizeWithdrawals(rows) {
  if (!Array.isArray(rows)) return [];
  const list = [];
  for (const row of rows) {
    if (!row?.proposal_id || row.enacted_epoch == null) continue;
    const epoch = Number(row.enacted_epoch);
    if (!Number.isInteger(epoch)) continue;
    if (!Array.isArray(row.withdrawal) || row.withdrawal.length === 0) continue;
    let total = 0n;
    let valid = true;
    for (const payout of row.withdrawal) {
      const n = parseLovelace(payout?.amount);
      if (n === null) {
        valid = false;
        break;
      }
      total += n;
    }
    if (!valid) continue;
    const title = typeof row.title === 'string' && row.title.trim() ? row.title.trim() : null;
    list.push({ id: row.proposal_id, epoch, title, ada: Number(total) / 1e6 });
  }
  return list.sort((a, b) => b.epoch - a.epoch || b.ada - a.ada);
}

// Withdrawals that took effect in the last `window` epochs up to latestEpoch.
// null when the window reaches back before on-chain governance, where older
// withdrawals would be missing.
export function withdrawalsInWindow(withdrawals, latestEpoch, window = DEFAULT_WINDOW) {
  const startEpoch = latestEpoch - window;
  if (startEpoch < GOVERNANCE_START_EPOCH) return null;
  return withdrawals.filter((w) => w.epoch > startEpoch && w.epoch <= latestEpoch);
}

// Treasury flows over the last `window` epochs up to latestEpoch. Income is the
// nominal estimate, withdrawals count in the epoch they took effect, and a
// donation made in epoch N reaches the balance at N+1. A figure whose data is
// incomplete is null instead of a silent partial sum.
export function flowsOverWindow({ points, withdrawals, donations, latestEpoch, window = DEFAULT_WINDOW }) {
  const startEpoch = latestEpoch - window;
  const paid = withdrawalsInWindow(withdrawals, latestEpoch, window);
  if (paid === null) return null;
  const start = points.find((p) => p.epoch === startEpoch);
  const end = points.find((p) => p.epoch === latestEpoch);
  if (!start || !end) return null;

  const incomeEpochs = inEpochWindow(incomeBySource(points), latestEpoch, window);
  const income =
    incomeEpochs.length === window ? incomeEpochs.reduce((sum, e) => sum + e.reserveShare + e.feeShare, 0) : null;

  let returned = null;
  if (Number.isInteger(donations?.updatedEpoch) && donations.updatedEpoch >= latestEpoch - 1) {
    let total = 0n;
    for (const entry of Array.isArray(donations.epochs) ? donations.epochs : []) {
      const n = parseLovelace(entry?.lovelace);
      if (n !== null && entry.epoch >= startEpoch && entry.epoch < latestEpoch) total += n;
    }
    returned = Number(total) / 1e6;
  }

  return {
    startEpoch,
    startBalance: start.treasury,
    endBalance: end.treasury,
    netChange: end.treasury - start.treasury,
    income,
    paidOut: paid.reduce((sum, w) => sum + w.ada, 0),
    paidOutCount: paid.length,
    returned,
  };
}
