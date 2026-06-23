/**
 * Utilities for the stake pool insights page.
 * Pledge-change helpers are the first module; more stake-pool chart helpers can be added here.
 */

export const PLEDGE_CHANGES_URL = 'https://data.cardano.org/static/pledge-changes.json';

/** Minimum displayed pledge on log-scale Y axis (values at or below 0 are clamped). */
export const LOG_PLEDGE_FLOOR = 1;

/**
 * Upper bound for the individual-pool Y axis (left).
 * Filters unrealistic on-chain pledge declarations from chart scaling.
 */
export const INDIVIDUAL_PLEDGE_Y_MAX = 1_000_000_000;

/** Width of each linear distribution bucket (ADA). */
export const LINEAR_BUCKET_SIZE = 5_000_000;

/**
 * Compact pledge label for chart axes (e.g. 1.5M, 250k).
 *
 * @param {number} ada
 * @returns {string}
 */
export function formatPledgeCompact(ada) {
  const abs = Math.abs(ada);
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000;
    return Number.isInteger(m) ? `${m}M` : `${parseFloat(m.toFixed(1))}M`;
  }
  if (abs >= 1_000) {
    const k = abs / 1_000;
    return Number.isInteger(k) ? `${k}k` : `${parseFloat(k.toFixed(1))}k`;
  }
  return abs.toLocaleString();
}

/**
 * @param {number} lo
 * @param {number} hi
 * @returns {string}
 */
export function formatPledgeRangeLabel(lo, hi) {
  return `${formatPledgeCompact(lo)}–${formatPledgeCompact(hi)}`;
}

/**
 * @param {number} sortKey
 * @param {boolean} useLog
 * @returns {string}
 */
export function getBucketLabelForSortKey(sortKey, useLog) {
  if (useLog) {
    if (sortKey === -1) return '0 ADA';
    if (sortKey === 0) return '< 1 ADA';
    const lo = 10 ** (sortKey - 1);
    const hi = 10 ** sortKey;
    return formatPledgeRangeLabel(lo, hi);
  }
  const lo = sortKey * LINEAR_BUCKET_SIZE;
  const hi = lo + LINEAR_BUCKET_SIZE;
  return formatPledgeRangeLabel(lo, hi);
}

/**
 * @param {number} pledgeAda
 * @param {number} [max]
 * @returns {number}
 */
export function capPledgeValue(pledgeAda, max = INDIVIDUAL_PLEDGE_Y_MAX) {
  if (pledgeAda <= 0) return 0;
  return Math.min(pledgeAda, max);
}

/**
 * @param {number} pledgeAda
 * @param {boolean} useLog
 * @returns {number}
 */
export function clampPledgeForDisplay(pledgeAda, useLog) {
  if (!useLog) return pledgeAda;
  if (pledgeAda <= 0) return LOG_PLEDGE_FLOOR;
  return pledgeAda;
}

/**
 * Clamp pledge for the left (per-pool) Y axis, including log floor and upper cap.
 *
 * @param {number} pledgeAda
 * @param {boolean} useLog
 * @returns {number}
 */
export function clampPledgeForIndividualAxis(pledgeAda, useLog) {
  const capped = capPledgeValue(pledgeAda);
  if (!useLog) return capped;
  if (capped <= 0) return LOG_PLEDGE_FLOOR;
  return capped;
}

/**
 * @param {number} value
 * @param {number} minPledge
 * @param {number|null} maxPledge
 * @returns {boolean}
 */
export function inPledgeRange(value, minPledge, maxPledge) {
  if (value < minPledge) return false;
  if (maxPledge != null && value > maxPledge) return false;
  return true;
}

/**
 * @param {number} a
 * @param {number} b
 * @param {number} minPledge
 * @param {number|null} maxPledge
 * @returns {boolean}
 */
export function segmentIntersectsPledgeRange(a, b, minPledge, maxPledge) {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  if (hi < minPledge) return false;
  if (maxPledge != null && lo > maxPledge) return false;
  return true;
}

/**
 * Read last-reported series value at an epoch from a change array.
 *
 * @param {Array<Record<string, number>>} changes
 * @param {number} epoch
 * @param {string} valueKey
 * @param {string} prevKey
 * @returns {number}
 */
export function getPoolSeriesAtEpoch(changes, epoch, valueKey, prevKey) {
  if (!changes?.length) return 0;

  const sorted = [...changes].sort((a, b) => a.epoch - b.epoch);
  const first = sorted[0];

  if (epoch < first.epoch) {
    return first[prevKey] ?? 0;
  }

  let value = first[valueKey] ?? 0;
  for (const c of sorted) {
    if (c.epoch <= epoch) {
      value = c[valueKey] ?? 0;
    } else {
      break;
    }
  }
  return value;
}

/**
 * Promised (declared) pledge at epoch.
 *
 * @param {{ changes?: PledgeChangeEvent[] }} pool
 * @param {number} epoch
 * @returns {number}
 */
export function getPoolPromisedAtEpoch(pool, epoch) {
  return getPoolSeriesAtEpoch(pool.changes, epoch, 'pledge_ada', 'prev_pledge_ada');
}

/**
 * Pledge active (wallet-held) at epoch from filtered change events.
 *
 * @param {{ pledge_active_changes?: PledgeActiveChangeEvent[] }} pool
 * @param {number} epoch
 * @returns {number}
 */
export function getPoolPledgeActiveAtEpoch(pool, epoch) {
  return getPoolSeriesAtEpoch(
    pool.pledge_active_changes,
    epoch,
    'pledge_active_ada',
    'prev_pledge_active_ada',
  );
}

/**
 * @param {{ changes?: PledgeChangeEvent[], pledge_active_changes?: PledgeActiveChangeEvent[] }} pool
 * @param {number} epoch
 * @param {number} promisedLevel
 * @returns {boolean}
 */
export function isPoolUnderPledgedAtEpoch(pool, epoch, promisedLevel) {
  if (!pool.pledge_active_changes?.length) return false;
  const active = getPoolPledgeActiveAtEpoch(pool, epoch);
  return active < promisedLevel;
}

/**
 * Whether a pool keeps pledge active ≥ promised at a single epoch.
 *
 * @param {PledgeChangesPool} pool
 * @param {number} epoch
 * @returns {boolean}
 */
export function isPoolFulfilledAtEpoch(pool, epoch) {
  if (!pool.changes?.length || !pool.pledge_active_changes?.length) return false;
  const promised = getPoolPromisedAtEpoch(pool, epoch);
  return !isPoolUnderPledgedAtEpoch(pool, epoch, promised);
}

/**
 * @param {Record<string, PledgeChangesPool>} pools
 * @param {number} epochFrom
 * @param {number} epochTo
 * @param {'fulfilled'|'unfulfilled'} mode
 * @returns {Record<string, PledgeChangesPool>}
 */
export function filterPoolsByPledgeFulfillment(pools, epochFrom, epochTo, mode) {
  const filtered = {};

  for (const [poolId, pool] of Object.entries(pools)) {
    if (!pool.changes?.length || !pool.pledge_active_changes?.length) continue;

    let hasUnderPledgedEpoch = false;
    for (let epoch = epochFrom; epoch <= epochTo; epoch++) {
      const promised = getPoolPromisedAtEpoch(pool, epoch);
      if (isPoolUnderPledgedAtEpoch(pool, epoch, promised)) {
        hasUnderPledgedEpoch = true;
        break;
      }
    }

    const include = mode === 'fulfilled' ? !hasUnderPledgedEpoch : hasUnderPledgedEpoch;
    if (include) filtered[poolId] = pool;
  }

  return filtered;
}

/**
 * @param {{ changes?: PledgeChangeEvent[], pledge_active_changes?: PledgeActiveChangeEvent[] }} pool
 * @param {number} epoch
 * @param {boolean} [capPerPool]
 * @returns {{ active: number, promised: number, eligible: boolean }}
 */
export function getEligiblePoolContribution(pool, epoch, capPerPool = true) {
  const hasPromised = Boolean(pool.changes?.length);
  const hasActive = Boolean(pool.pledge_active_changes?.length);

  if (!hasPromised || !hasActive) {
    return { active: 0, promised: 0, eligible: false };
  }

  const promised = capPerPool
    ? getPoolPledgeAtEpochCapped(pool.changes, epoch)
    : getPoolPromisedAtEpoch(pool, epoch);
  const activeRaw = getPoolPledgeActiveAtEpoch(pool, epoch);
  const active = capPerPool ? capPledgeValue(activeRaw) : activeRaw;

  if (active < promised) {
    return { active: 0, promised: 0, eligible: false };
  }

  return { active, promised, eligible: true };
}

/**
 * Pledge declared by a pool at a given epoch, derived from its change history.
 *
 * @param {Array<{epoch: number, pledge_ada: number, prev_pledge_ada: number}>} changes
 * @param {number} epoch
 * @returns {number}
 */
export function getPoolPledgeAtEpoch(changes, epoch) {
  return getPoolSeriesAtEpoch(changes, epoch, 'pledge_ada', 'prev_pledge_ada');
}

/**
 * Pledge at epoch with per-pool cap applied (for chart totals).
 *
 * @param {Array<{epoch: number, pledge_ada: number, prev_pledge_ada: number}>} changes
 * @param {number} epoch
 * @param {number} [max]
 * @returns {number}
 */
export function getPoolPledgeAtEpochCapped(changes, epoch, max = INDIVIDUAL_PLEDGE_Y_MAX) {
  return capPledgeValue(getPoolPledgeAtEpoch(changes, epoch), max);
}

/**
 * @typedef {Object} PledgeChangeEvent
 * @property {number} epoch
 * @property {number} pledge_ada
 * @property {number} prev_pledge_ada
 * @property {number} delta_pledge_ada
 * @property {'up'|'down'} direction
 */

/**
 * @typedef {Object} PledgeChangesPool
 * @property {string|null} ticker
 * @property {PledgeChangeEvent[]} changes
 * @property {PledgeActiveChangeEvent[]} [pledge_active_changes]
 */

/**
 * @typedef {Object} PledgeActiveChangeEvent
 * @property {number} epoch
 * @property {number} pledge_active_ada
 * @property {number} prev_pledge_active_ada
 * @property {number} delta_pledge_active_ada
 * @property {'up'|'down'} direction
 */

/**
 * @typedef {Object} PledgeChangesDataset
 * @property {Object} meta
 * @property {Record<string, PledgeChangesPool>} pools
 */

/**
 * @typedef {Object} BuildPledgeSegmentsOptions
 * @property {number} epochFrom
 * @property {number} epochTo
 * @property {number} [minPledge]
 * @property {number|null} [maxPledge]
 * @property {number} extendToEpoch
 * @property {boolean} [useLog]
 */

/**
 * @typedef {Object} LineSegment
 * @property {string} poolId
 * @property {string|null} ticker
 * @property {[[number, number], [number, number]]} coords
 * @property {'up'|'down'} [direction]
 * @property {PledgeChangeEvent} [event]
 */

/**
 * Build flat (stable) and delta (up/down) line segments for the pledge chart.
 *
 * @param {Record<string, PledgeChangesPool>} pools
 * @param {BuildPledgeSegmentsOptions} options
 * @returns {{ flatSegments: LineSegment[], deltaSegments: LineSegment[] }}
 */
export function buildPledgeChangeSegments(pools, options) {
  const {
    epochFrom,
    epochTo,
    minPledge = 0,
    maxPledge = null,
    extendToEpoch,
    useLog = false,
  } = options;

  const flatSegments = [];
  const deltaSegments = [];

  for (const [poolId, pool] of Object.entries(pools)) {
    const { ticker, changes } = pool;
    if (!changes?.length) continue;

    const sorted = [...changes].sort((a, b) => a.epoch - b.epoch);

    for (let i = 0; i < sorted.length; i++) {
      const c = sorted[i];
      const next = sorted[i + 1];

      if (c.epoch >= epochFrom && c.epoch <= epochTo) {
        const prevY = clampPledgeForIndividualAxis(c.prev_pledge_ada, useLog);
        const nextY = clampPledgeForIndividualAxis(c.pledge_ada, useLog);
        if (segmentIntersectsPledgeRange(c.prev_pledge_ada, c.pledge_ada, minPledge, maxPledge)) {
          deltaSegments.push({
            poolId,
            ticker,
            coords: [[c.epoch, prevY], [c.epoch, nextY]],
            direction: c.direction,
            event: c,
          });
        }
      }

      const flatStart = Math.max(c.epoch, epochFrom);
      const flatEnd = Math.min(next ? next.epoch : extendToEpoch, epochTo);
      const pledgeLevel = c.pledge_ada;

      if (flatStart < flatEnd && inPledgeRange(pledgeLevel, minPledge, maxPledge)) {
        const y = clampPledgeForIndividualAxis(pledgeLevel, useLog);
        flatSegments.push({
          poolId,
          ticker,
          coords: [[flatStart, y], [flatEnd, y]],
        });
      }
    }
  }

  return { flatSegments, deltaSegments };
}

/**
 * Eligible totals per epoch (pools where pledge active ≥ promised).
 *
 * @param {Record<string, PledgeChangesPool>} pools
 * @param {number} epochFrom
 * @param {number} epochTo
 * @param {boolean} [capPerPool]
 * @returns {Array<{epoch: number, totalActiveAda: number, totalPromisedAda: number}>}
 */
export function computeEligibleTotalsByEpoch(pools, epochFrom, epochTo, capPerPool = true) {
  const poolList = Object.values(pools);
  const result = [];

  for (let epoch = epochFrom; epoch <= epochTo; epoch++) {
    let totalActiveAda = 0;
    let totalPromisedAda = 0;
    for (const pool of poolList) {
      const { active, promised, eligible } = getEligiblePoolContribution(pool, epoch, capPerPool);
      if (!eligible) continue;
      totalActiveAda += active;
      totalPromisedAda += promised;
    }
    result.push({ epoch, totalActiveAda, totalPromisedAda });
  }

  return result;
}

/**
 * @deprecated Use computeEligibleTotalsByEpoch — kept for callers expecting promised-only totals.
 */
export function computeTotalPledgeByEpoch(pools, epochFrom, epochTo, capPerPool = true) {
  return computeEligibleTotalsByEpoch(pools, epochFrom, epochTo, capPerPool).map((row) => ({
    epoch: row.epoch,
    totalPledgeAda: row.totalActiveAda,
  }));
}

/**
 * Eligible total pledge active at a single epoch.
 */
export function computeTotalPledgeAtEpoch(pools, epoch, capPerPool = true) {
  let total = 0;
  for (const pool of Object.values(pools)) {
    const { active, eligible } = getEligiblePoolContribution(pool, epoch, capPerPool);
    if (eligible) total += active;
  }
  return total;
}

/**
 * @param {Record<string, PledgeChangesPool>} pools
 * @param {number} epochFrom
 * @param {number} epochTo
 * @param {boolean} [capPerPool]
 * @returns {number}
 */
export function computeTotalPledgeDelta(pools, epochFrom, epochTo, capPerPool = true) {
  return (
    computeTotalPledgeAtEpoch(pools, epochTo, capPerPool) -
    computeTotalPledgeAtEpoch(pools, epochFrom, capPerPool)
  );
}

/**
 * @typedef {Object} PledgeDistributionBucket
 * @property {string} label
 * @property {number} count
 * @property {number} sortKey
 */

/**
 * Collect per-pool pledge values at an epoch (pools not yet registered are omitted).
 *
 * @param {Record<string, PledgeChangesPool>} pools
 * @param {number} epoch
 * @param {boolean} [capPerPool]
 * @param {number} [minPledge]
 * @param {number|null} [maxPledge]
 * @returns {number[]}
 */
export function collectPoolPledgesAtEpoch(
  pools,
  epoch,
  capPerPool = true,
  minPledge = 0,
  maxPledge = null,
  pledgeView = null,
) {
  const pledges = [];

  for (const pool of Object.values(pools)) {
    if (!pool.changes?.length) continue;

    if (pledgeView === 'fulfilled' && !isPoolFulfilledAtEpoch(pool, epoch)) continue;
    if (pledgeView === 'unfulfilled') {
      if (!pool.pledge_active_changes?.length) continue;
      if (isPoolFulfilledAtEpoch(pool, epoch)) continue;
    }

    const sorted = [...pool.changes].sort((a, b) => a.epoch - b.epoch);
    const first = sorted[0];
    if (epoch < first.epoch && first.prev_pledge_ada === 0) continue;

    const pledge = capPerPool
      ? getPoolPledgeAtEpochCapped(pool.changes, epoch)
      : getPoolPromisedAtEpoch(pool, epoch);

    if (!inPledgeRange(pledge, minPledge, maxPledge)) continue;
    pledges.push(pledge);
  }

  return pledges;
}

function formatLinearBucketLabel(index) {
  return getBucketLabelForSortKey(index, false);
}

function getLogBucketMeta(pledge) {
  if (pledge <= 0) {
    return { sortKey: -1, label: '0 ADA' };
  }
  if (pledge < 1) {
    return { sortKey: 0, label: '< 1 ADA' };
  }
  const exp = Math.floor(Math.log10(pledge));
  const sortKey = exp + 1;
  return {
    sortKey,
    label: getBucketLabelForSortKey(sortKey, true),
  };
}

/**
 * Bucket pool pledges for the distribution chart (horizontal bars, categories on Y).
 *
 * @param {number[]} pledges
 * @param {boolean} useLog
 * @returns {PledgeDistributionBucket[]}
 */
export function buildPledgeDistribution(pledges, useLog) {
  const counts = new Map();

  if (useLog) {
    for (const pledge of pledges) {
      const { sortKey, label } = getLogBucketMeta(pledge);
      const entry = counts.get(sortKey) || { label, count: 0 };
      entry.count += 1;
      counts.set(sortKey, entry);
    }
  } else {
    for (const pledge of pledges) {
      const index = pledge <= 0 ? 0 : Math.floor(pledge / LINEAR_BUCKET_SIZE);
      const label = formatLinearBucketLabel(index);
      const entry = counts.get(index) || { label, count: 0 };
      entry.count += 1;
      counts.set(index, entry);
    }
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a - b)
    .map(([sortKey, { label, count }]) => ({ label, count, sortKey }));
}

/**
 * @typedef {Object} MergedPledgeDistributionRow
 * @property {number} sortKey
 * @property {string} label
 * @property {number} currentCount
 * @property {number} compareCount
 */

/**
 * Align two distribution snapshots on shared pledge buckets (Y-axis categories).
 *
 * @param {PledgeDistributionBucket[]} current
 * @param {PledgeDistributionBucket[]} [compare]
 * @param {boolean} useLog
 * @returns {MergedPledgeDistributionRow[]}
 */
export function mergePledgeDistributions(current, compare, useLog) {
  const sortKeys = new Set();
  current.forEach((b) => sortKeys.add(b.sortKey));
  (compare || []).forEach((b) => sortKeys.add(b.sortKey));

  const currentMap = new Map(current.map((b) => [b.sortKey, b.count]));
  const compareMap = new Map((compare || []).map((b) => [b.sortKey, b.count]));

  return [...sortKeys]
    .sort((a, b) => a - b)
    .map((sortKey) => ({
      sortKey,
      label: getBucketLabelForSortKey(sortKey, useLog),
      currentCount: currentMap.get(sortKey) ?? 0,
      compareCount: compareMap.get(sortKey) ?? 0,
    }));
}

/**
 * @typedef {Object} PledgeRangeStats
 * @property {number} poolCount
 * @property {number} changeCount
 * @property {number} upCount
 * @property {number} downCount
 * @property {number} totalPledgeDelta
 */

/**
 * @param {Record<string, PledgeChangesPool>} pools
 * @param {number} epochFrom
 * @param {number} epochTo
 * @param {number} [minPledge]
 * @param {number|null} [maxPledge]
 * @returns {PledgeRangeStats}
 */
export function computePledgeChangeStats(pools, epochFrom, epochTo, minPledge = 0, maxPledge = null) {
  const poolsWithChanges = new Set();
  let changeCount = 0;
  let upCount = 0;
  let downCount = 0;

  for (const [poolId, pool] of Object.entries(pools)) {
    for (const c of pool.changes || []) {
      if (c.epoch < epochFrom || c.epoch > epochTo) continue;
      if (!segmentIntersectsPledgeRange(c.prev_pledge_ada, c.pledge_ada, minPledge, maxPledge)) {
        continue;
      }

      poolsWithChanges.add(poolId);
      changeCount += 1;

      if (c.direction === 'up') {
        upCount += 1;
      } else {
        downCount += 1;
      }
    }
  }

  const totalPledgeDelta = computeTotalPledgeDelta(pools, epochFrom, epochTo);

  return {
    poolCount: poolsWithChanges.size,
    changeCount,
    upCount,
    downCount,
    totalPledgeDelta,
  };
}

/**
 * Filter pools to those with at least one change or flat segment visible in range.
 *
 * @param {Record<string, PledgeChangesPool>} pools
 * @param {BuildPledgeSegmentsOptions} options
 * @returns {Record<string, PledgeChangesPool>}
 */
export function filterPoolsForPledgeRange(pools, options) {
  const { epochFrom, epochTo, minPledge = 0, maxPledge = null, extendToEpoch } = options;
  const filtered = {};

  for (const [poolId, pool] of Object.entries(pools)) {
    const sorted = [...(pool.changes || [])].sort((a, b) => a.epoch - b.epoch);
    let visible = false;

    for (let i = 0; i < sorted.length; i++) {
      const c = sorted[i];
      const next = sorted[i + 1];

      if (c.epoch >= epochFrom && c.epoch <= epochTo) {
        if (segmentIntersectsPledgeRange(c.prev_pledge_ada, c.pledge_ada, minPledge, maxPledge)) {
          visible = true;
          break;
        }
      }

      const flatStart = Math.max(c.epoch, epochFrom);
      const flatEnd = Math.min(next ? next.epoch : extendToEpoch, epochTo);
      if (flatStart < flatEnd && inPledgeRange(c.pledge_ada, minPledge, maxPledge)) {
        visible = true;
        break;
      }
    }

    if (visible) {
      filtered[poolId] = pool;
    }
  }

  return filtered;
}
