// Koios reads behind the stake pool delegation tool. Every function takes the
// axios client as its first argument and nothing here touches React or the
// DOM, so scripts/test-pool-loading.mjs can drive it with a fake client.
import { isValidPoolId } from './bech32.mjs';
import { isValidIndexRow, normalizeTicker } from './stakePools.mjs';

export const INDEX_PAGE_SIZE = 1000;
// Koios caps a page at 1000 rows and the proxy answers a page in about 0.3
// seconds. Mainnet has just under 3000 non-retired pools, so one wave of four
// parallel pages covers the whole index in the time one page used to take.
export const INDEX_PARALLEL_PAGES = 4;
// Batch size for the search, which renders all results at once anyway. The
// proxy caps POST bodies at 5120 bytes, 50 ids would be the upper bound.
const INFO_BATCH_SIZE = 8;
// pool_info is expensive on the Koios side (live stake, pledge and delegator
// counts per pool). Measured 2026-09-06 through the proxy: a single pool took
// 0.6 to 9.5 seconds and occasionally more than 30. The selection and the
// search load pools in small units, so a slow pool only holds its own slot.
const POOL_INFO_TIMEOUT_MS = 30000;

const INDEX_SELECT = [
  "pool_id_bech32", "ticker", "pool_status", "pool_group",
  "active_stake", "margin", "fixed_cost", "pledge", "retiring_epoch",
].join(",");

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function indexPage(api, offset) {
  return api.get(
    `/pool_list?pool_status=neq.retired&select=${INDEX_SELECT}&order=pool_id_bech32.asc&limit=${INDEX_PAGE_SIZE}&offset=${offset}`
  );
}

// Loads the whole index in waves of INDEX_PARALLEL_PAGES parallel pages. A
// short page ends the walk, pages after it in the same wave are empty anyway.
export async function fetchPoolIndex(api) {
  const rows = [];
  for (let wave = 0; ; wave += 1) {
    const offsets = Array.from(
      { length: INDEX_PARALLEL_PAGES },
      (_, i) => (wave * INDEX_PARALLEL_PAGES + i) * INDEX_PAGE_SIZE
    );
    const pages = await Promise.all(offsets.map((offset) => indexPage(api, offset)));
    let short = false;
    for (const page of pages) {
      const data = Array.isArray(page.data) ? page.data : [];
      rows.push(...data.filter(isValidIndexRow));
      if (data.length < INDEX_PAGE_SIZE) {
        short = true;
        break;
      }
    }
    if (short) break;
  }
  if (!rows.length) throw new Error("pool_list returned no usable rows");
  return rows;
}

// Ticker per pool from the last metadata Koios accepted, including earlier
// registrations. pool_list only carries the ticker of the current one, which
// is empty for every pool whose metadata file no longer matches its
// registered hash. Retired pools come along, callers only read the ids they
// asked about. Pages are walked one by one, this runs beside the index and
// never holds it up.
const ALIAS_MAX_PAGES = 16;

export async function fetchTickerAliases(api, { signal } = {}) {
  const aliases = new Map();
  for (let page = 0; page < ALIAS_MAX_PAGES; page += 1) {
    const res = await api.get(
      `/pool_metadata?select=pool_id_bech32,ticker:meta_json->>ticker&order=pool_id_bech32.asc&limit=${INDEX_PAGE_SIZE}&offset=${page * INDEX_PAGE_SIZE}`,
      { signal }
    );
    const data = Array.isArray(res.data) ? res.data : [];
    for (const row of data) {
      if (isValidPoolId(row?.pool_id_bech32) && typeof row.ticker === 'string' && row.ticker.trim()) {
        aliases.set(row.pool_id_bech32, row.ticker.trim());
      }
    }
    if (data.length < INDEX_PAGE_SIZE) break;
  }
  return aliases;
}

// Ticker prefix search straight at Koios, for the moment the cached index
// has no exact match. The proxy caches pool_list for two hours, so a page
// that arrived without a ticker stays that way for the rest of the session,
// while this request can reach an instance that has the metadata. The prefix
// is validated by remoteTickerPrefix before it gets here.
//
// Measured 2026-09-17 on BROCK, a pool whose metadata is in order: 6 of 8
// fresh queries returned it, 2 came back empty. How much pool metadata an
// answer carries varies between requests, and an empty answer is cached like
// any other, so repeating the same URL only repeats the miss. The second
// attempt therefore asks for one row more: a second cache entry, and with it
// a second chance at a complete answer. Both can miss.
const TICKER_ATTEMPTS = 2;

export async function fetchPoolsByTicker(api, prefix, limit, { signal } = {}) {
  const byId = new Map();
  for (let attempt = 0; attempt < TICKER_ATTEMPTS; attempt += 1) {
    let rows;
    try {
      const res = await api.get(
        `/pool_list?pool_status=neq.retired&ticker=ilike.${encodeURIComponent(prefix)}*&select=${INDEX_SELECT}&order=pool_id_bech32.asc&limit=${limit + attempt}`,
        { signal }
      );
      rows = (Array.isArray(res.data) ? res.data : []).filter(isValidIndexRow);
    } catch (error) {
      // Whatever the first attempt found is worth more than this error. With
      // nothing in hand the caller needs to hear about it.
      if (!byId.size) throw error;
      break;
    }
    // Attempts add up, they do not replace each other: an answer that missed
    // the exact ticker can still be the only one carrying a prefix match.
    for (const row of rows) if (!byId.has(row.pool_id_bech32)) byId.set(row.pool_id_bech32, row);
    if (rows.some((row) => normalizeTicker(row.ticker) === prefix)) break;
  }
  return [...byId.values()];
}

// One pool per request so a slow pool only delays itself. Resolves null when
// Koios does not know the id (retired long ago or never registered), rejects
// on a transport error or timeout so callers can tell the two apart.
export async function fetchPoolInfoOne(api, id, { signal } = {}) {
  const res = await api.post("/pool_info", { _pool_bech32_ids: [id] }, { timeout: POOL_INFO_TIMEOUT_MS, signal });
  const row = Array.isArray(res.data) ? res.data.find((r) => r?.pool_id_bech32 === id) : null;
  return row || null;
}

// Tolerant loader for the search: pools in a batch whose request failed are
// left out. Rejects with the first error only when no batch succeeded, so a
// general outage still surfaces as an error instead of an empty result.
export async function fetchPoolInfoSettled(api, ids, { signal } = {}) {
  if (!ids.length) return [];
  const settled = await Promise.allSettled(
    chunk(ids, INFO_BATCH_SIZE).map((batch) =>
      api.post("/pool_info", { _pool_bech32_ids: batch }, { timeout: POOL_INFO_TIMEOUT_MS, signal }))
  );
  if (settled.every((s) => s.status === "rejected")) throw settled[0].reason;
  return settled.flatMap((s) => (s.status === "fulfilled" && Array.isArray(s.value.data) ? s.value.data : []));
}
