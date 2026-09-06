// Koios reads behind the stake pool delegation tool. Every function takes the
// axios client as its first argument and nothing here touches React or the
// DOM, so scripts/test-pool-loading.mjs can drive it with a fake client.
import { isValidIndexRow } from './stakePools.mjs';

export const INDEX_PAGE_SIZE = 1000;
// Koios caps a page at 1000 rows and the proxy answers a page in about 0.3
// seconds. Mainnet has just under 3000 non-retired pools, so one wave of four
// parallel pages covers the whole index in the time one page used to take.
export const INDEX_PARALLEL_PAGES = 4;
// Batch size for the strict loader used by the preflight and account calls.
// The proxy caps POST bodies at 5120 bytes, 50 ids would be the upper bound.
export const INFO_BATCH_SIZE = 8;
// pool_info is expensive on the Koios side (live stake, pledge and delegator
// counts per pool). Measured 2026-09-06 through the proxy: a single pool took
// 0.6 to 9.5 seconds and occasionally more than 30. The selection and the
// search load pools one by one, so a slow pool only holds its own slot.
export const POOL_INFO_TIMEOUT_MS = 30000;

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
    `/pool_list?pool_status=neq.retired&select=${INDEX_SELECT}&limit=${INDEX_PAGE_SIZE}&offset=${offset}`
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

// Strict loader: every batch must succeed. Used where a missing answer must
// not be mistaken for a missing pool (delegation preflight, account lookup).
export async function fetchPoolInfo(api, ids) {
  if (!ids.length) return [];
  const results = await Promise.all(
    chunk(ids, INFO_BATCH_SIZE).map((batch) =>
      api.post("/pool_info", { _pool_bech32_ids: batch }, { timeout: POOL_INFO_TIMEOUT_MS }))
  );
  return results.flatMap((r) => (Array.isArray(r.data) ? r.data : []));
}

// One pool per request so a slow pool only delays itself. Resolves null when
// Koios does not know the id (retired long ago or never registered), rejects
// on a transport error or timeout so callers can tell the two apart.
export async function fetchPoolInfoOne(api, id, { signal } = {}) {
  const res = await api.post("/pool_info", { _pool_bech32_ids: [id] }, { timeout: POOL_INFO_TIMEOUT_MS, signal });
  const row = Array.isArray(res.data) ? res.data.find((r) => r?.pool_id_bech32 === id) : null;
  return row || null;
}

// Tolerant loader for the search: pools whose request failed are left out.
// Rejects with the first error only when no request succeeded, so a general
// outage still surfaces as an error instead of an empty result.
export async function fetchPoolInfoSettled(api, ids, { signal } = {}) {
  if (!ids.length) return [];
  const settled = await Promise.allSettled(ids.map((id) => fetchPoolInfoOne(api, id, { signal })));
  const rows = settled.filter((s) => s.status === "fulfilled" && s.value).map((s) => s.value);
  if (!rows.length && settled.every((s) => s.status === "rejected")) throw settled[0].reason;
  return rows;
}
