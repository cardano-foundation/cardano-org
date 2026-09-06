// Pure logic behind the stake pool delegation tool: sampling criteria,
// search, query handling and the model the UI renders. No React, no network,
// no SDK, so scripts/test-stake-pools.mjs can run it in plain Node.
import { isValidPoolId, poolIdFromHex } from './bech32.mjs';
import { parseLovelace } from './lovelace.mjs';

// Minimum criteria for the random selection. Active stake from 1M ada
// (roughly one block per epoch, which keeps dormant pools out while small
// active pools stay in), margin below 5 percent (which keeps private 100
// percent pools and expensive pools out) and a declared pledge from 25k ada
// (see MIN_PLEDGE). Ticker and ID search never apply these, only the random
// sample does, and the UI states all three thresholds next to the sample.
export const MIN_ACTIVE_STAKE = 1000000000000n; // lovelace, 1M ada
export const MAX_MARGIN = 0.05;
// A declared pledge below this is not real skin in the game ("pledge met" is
// trivially true for a pledge of zero), so the sample requires 25k ada.
export const MIN_PLEDGE = 25000000000n; // lovelace, 25k ada
// Cards shown in the random selection. How they are loaded lives in
// poolSampler.mjs.
export const DISPLAY_COUNT = 6;
export const SEARCH_RESULT_LIMIT = 12;

const POOL_STATUSES = new Set(['registered', 'retiring', 'retired']);
const POOL_HEX_LENGTH = 56;

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidIndexRow(row) {
  return !!row && typeof row === 'object' && isValidPoolId(row.pool_id_bech32) && POOL_STATUSES.has(row.pool_status);
}

// Stage 1 of the random selection: cheap filter on the pool_list index.
export function eligibleFromIndex(rows) {
  return (rows || []).filter((row) => {
    if (!isValidIndexRow(row)) return false;
    if (row.pool_status !== 'registered' || row.retiring_epoch != null) return false;
    if (!hasText(row.ticker)) return false;
    const stake = parseLovelace(row.active_stake);
    if (stake === null || stake < MIN_ACTIVE_STAKE) return false;
    const pledge = parseLovelace(row.pledge);
    if (pledge === null || pledge < MIN_PLEDGE) return false;
    return typeof row.margin === 'number' && row.margin < MAX_MARGIN;
  });
}

// Stage 2 of the random selection: fine filter on a pool_info row.
export function eligibleFromInfo(row) {
  if (!row || typeof row !== 'object') return false;
  if (row.pool_status !== 'registered' || row.retiring_epoch != null) return false;
  if (typeof row.live_saturation !== 'number' || row.live_saturation >= 100) return false;
  if (typeof row.block_count !== 'number' || row.block_count < 1) return false;
  const pledge = parseLovelace(row.pledge);
  const livePledge = parseLovelace(row.live_pledge);
  if (pledge === null || livePledge === null || livePledge < pledge) return false;
  return hasText(row.meta_json?.name);
}

export function normalizeTicker(value) {
  return String(value || '').replace(/\s+/g, '').toUpperCase();
}

// One field serves both lookups: anything shaped like a pool ID resolves to
// that pool, everything else is a ticker prefix search.
export function classifyQuery(input) {
  const trimmed = typeof input === 'string' ? input.trim() : '';
  if (!trimmed) return { kind: 'empty', value: '' };
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('pool1')) {
    return isValidPoolId(lower) ? { kind: 'id', value: lower } : { kind: 'invalidId', value: trimmed };
  }
  if (trimmed.length === POOL_HEX_LENGTH && /^[0-9a-fA-F]+$/.test(trimmed)) {
    return { kind: 'id', value: poolIdFromHex(trimmed) };
  }
  const ticker = normalizeTicker(trimmed);
  if (ticker.length < 2) return { kind: 'tooShort', value: ticker };
  return { kind: 'ticker', value: ticker };
}

// Exact ticker matches first, then prefix matches, each group in index order.
export function searchTicker(rows, query, limit = SEARCH_RESULT_LIMIT) {
  const wanted = normalizeTicker(query);
  if (!wanted) return [];
  const exact = [];
  const prefix = [];
  for (const row of rows || []) {
    if (!hasText(row?.ticker)) continue;
    const ticker = normalizeTicker(row.ticker);
    if (ticker === wanted) exact.push(row);
    else if (ticker.startsWith(wanted)) prefix.push(row);
  }
  return [...exact, ...prefix].slice(0, limit);
}

// Only a parseable absolute https URL with a host survives.
function httpsOnly(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && url.hostname ? url.href : null;
  } catch (e) {
    return null;
  }
}

function nonNegativeInt(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

// Builds the object the cards render. Returns null for rows that are missing
// or malformed so the caller can skip them without a try/catch.
export function toPoolModel(indexRow, infoRow) {
  if (!infoRow || typeof infoRow !== 'object') return null;
  const id = infoRow.pool_id_bech32;
  if (!isValidPoolId(id) || !POOL_STATUSES.has(infoRow.pool_status)) return null;
  const lovelace = {};
  for (const [key, source] of [
    ['fixedCost', infoRow.fixed_cost], ['pledge', infoRow.pledge],
    ['livePledge', infoRow.live_pledge], ['liveStake', infoRow.live_stake],
  ]) {
    const parsed = parseLovelace(source);
    if (parsed === null) return null;
    lovelace[key] = parsed.toString();
  }
  const meta = infoRow.meta_json && typeof infoRow.meta_json === 'object' ? infoRow.meta_json : {};
  const ticker = hasText(meta.ticker) ? meta.ticker.trim() : hasText(indexRow?.ticker) ? indexRow.ticker.trim() : null;
  return {
    id: id.toLowerCase(),
    ticker,
    name: hasText(meta.name) ? meta.name.trim() : null,
    homepage: httpsOnly(meta.homepage),
    group: hasText(indexRow?.pool_group) ? indexRow.pool_group : null,
    status: infoRow.pool_status,
    retiringEpoch: Number.isInteger(infoRow.retiring_epoch) ? infoRow.retiring_epoch : null,
    saturation: typeof infoRow.live_saturation === 'number' ? infoRow.live_saturation : null,
    margin: typeof infoRow.margin === 'number' ? infoRow.margin : null,
    fixedCost: lovelace.fixedCost,
    pledge: lovelace.pledge,
    livePledge: lovelace.livePledge,
    liveStake: lovelace.liveStake,
    delegators: nonNegativeInt(infoRow.live_delegators),
    blocks: nonNegativeInt(infoRow.block_count),
  };
}
