// Koios access and the async state machines behind StakePoolDelegate. Every
// resource is idle | loading | ready | error with a retry, and a sequence
// number drops responses that arrive after a newer request started.
import { useCallback, useEffect, useRef, useState } from "react";
import { chunk, fisherYates, readCache, writeCache } from "@site/src/components/WalletDelegation/helpers";
import { parseLovelace } from "@site/src/utils/cardano/lovelace.mjs";
import {
  DISPLAY_COUNT, MAX_RESAMPLES, SAMPLE_SIZE, SEARCH_RESULT_LIMIT,
  classifyQuery, eligibleFromIndex, eligibleFromInfo, isValidIndexRow, searchTicker, toPoolModel,
} from "@site/src/utils/cardano/stakePools.mjs";

export const INDEX_CACHE_KEY = "cardano-org.pool-index.v1";
export const INDEX_CACHE_TTL_MS = 15 * 60 * 1000;
const INDEX_PAGE_SIZE = 1000;
// data.cardano.org proxy caps POST bodies at 5120 bytes, 50 bech32 ids fit.
const INFO_BATCH_SIZE = 50;
const INDEX_SELECT = [
  "pool_id_bech32", "ticker", "pool_status", "pool_group",
  "active_stake", "margin", "fixed_cost", "pledge", "retiring_epoch",
].join(",");
const SEARCH_DEBOUNCE_MS = 250;
// Koios account_info status values. Anything else is treated as an error so
// the UI never guesses a certificate path from an unknown value.
const ACCOUNT_STATUS = { registered: "registered", "not registered": "unregistered" };

export async function fetchPoolIndex(api) {
  const rows = [];
  for (let offset = 0; ; offset += INDEX_PAGE_SIZE) {
    const page = await api.get(
      `/pool_list?pool_status=neq.retired&select=${INDEX_SELECT}&limit=${INDEX_PAGE_SIZE}&offset=${offset}`
    );
    const data = Array.isArray(page.data) ? page.data : [];
    rows.push(...data.filter(isValidIndexRow));
    if (data.length < INDEX_PAGE_SIZE) break;
  }
  if (!rows.length) throw new Error("pool_list returned no usable rows");
  return rows;
}

export async function fetchPoolInfo(api, ids) {
  if (!ids.length) return [];
  const results = await Promise.all(
    chunk(ids, INFO_BATCH_SIZE).map((batch) => api.post("/pool_info", { _pool_bech32_ids: batch }))
  );
  return results.flatMap((r) => (Array.isArray(r.data) ? r.data : []));
}

// account_info for the given reward addresses in one POST. Koios omits
// addresses it has never seen, which means an unregistered stake key. A row
// with an unknown status or a non-array response throws.
export async function fetchAccounts(api, stakeAddresses) {
  const res = await api.post("/account_info", { _stake_addresses: stakeAddresses });
  if (!Array.isArray(res.data)) throw new Error("account_info returned no array");
  const byAddr = new Map(res.data.map((r) => [r?.stake_address, r]));
  const poolIds = [...new Set(res.data.map((r) => r?.delegated_pool).filter(Boolean))];
  const infos = await fetchPoolInfo(api, poolIds);
  const poolById = new Map(infos.map((i) => [i.pool_id_bech32, toPoolModel(null, i)]));
  const accounts = {};
  for (const addr of stakeAddresses) {
    const row = byAddr.get(addr);
    if (!row) {
      accounts[addr] = { registration: "unregistered", delegatedPoolId: null, delegatedPool: null, delegatedDrep: null, rewardsAvailable: null };
      continue;
    }
    const registration = ACCOUNT_STATUS[row.status];
    if (!registration) throw new Error(`account_info returned unknown status "${row.status}"`);
    accounts[addr] = {
      registration,
      delegatedPoolId: typeof row.delegated_pool === "string" ? row.delegated_pool : null,
      delegatedPool: row.delegated_pool ? poolById.get(row.delegated_pool) || null : null,
      delegatedDrep: typeof row.delegated_drep === "string" ? row.delegated_drep : null,
      rewardsAvailable: parseLovelace(row.rewards_available) === null ? null : String(row.rewards_available),
    };
  }
  return accounts;
}

// Generic loader. Pass null as loader to keep the resource idle (for example
// while no wallet is connected). deps decide when the loader reruns.
export function useResource(loader, deps) {
  const [state, setState] = useState({ status: "idle", data: null, error: null });
  const seq = useRef(0);
  const run = useCallback(() => {
    const id = ++seq.current;
    if (!loader) {
      setState({ status: "idle", data: null, error: null });
      return;
    }
    setState({ status: "loading", data: null, error: null });
    Promise.resolve()
      .then(loader)
      .then(
        (data) => {
          if (seq.current === id) setState({ status: "ready", data, error: null });
        },
        (error) => {
          if (seq.current !== id) return;
          console.error("StakePoolDelegate: resource failed", error);
          setState({ status: "error", data: null, error });
        }
      );
  // The caller owns the dependency list, like a custom useMemo.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
    return () => { seq.current += 1; };
  }, [run]);

  return { ...state, retry: run };
}

export function usePoolIndex(api) {
  return useResource(
    api
      ? async () => {
          const cached = readCache(INDEX_CACHE_KEY, INDEX_CACHE_TTL_MS);
          if (Array.isArray(cached) && cached.length) return cached;
          const rows = await fetchPoolIndex(api);
          writeCache(INDEX_CACHE_KEY, rows);
          return rows;
        }
      : null,
    [api]
  );
}

// Random selection (spec 3.6): shuffle the index candidates, load pool_info
// in SAMPLE_SIZE batches and keep what passes the fine filter, topping up at
// most MAX_RESAMPLES times. Nothing about the sample is cached, every visit
// and every shuffle draws fresh.
export function useRandomSample(api, indexRows) {
  const [nonce, setNonce] = useState(0);
  const resource = useResource(
    api && indexRows
      ? async () => {
          const candidates = fisherYates(eligibleFromIndex(indexRows));
          const byId = new Map(indexRows.map((r) => [r.pool_id_bech32, r]));
          const picked = [];
          let offset = 0;
          for (let round = 0; round <= MAX_RESAMPLES; round += 1) {
            if (picked.length >= DISPLAY_COUNT || offset >= candidates.length) break;
            const batch = candidates.slice(offset, offset + SAMPLE_SIZE);
            offset += SAMPLE_SIZE;
            const infos = await fetchPoolInfo(api, batch.map((r) => r.pool_id_bech32));
            for (const info of infos) {
              if (picked.length >= DISPLAY_COUNT) break;
              if (!eligibleFromInfo(info)) continue;
              const model = toPoolModel(byId.get(info.pool_id_bech32) || null, info);
              if (model) picked.push(model);
            }
          }
          return picked;
        }
      : null,
    [api, indexRows, nonce]
  );
  const shuffle = useCallback(() => setNonce((n) => n + 1), []);
  return { ...resource, shuffle };
}

export function usePoolSearch(api, indexRows, query) {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  const parsed = classifyQuery(debounced);
  const active = api && (parsed.kind === "id" || parsed.kind === "ticker" || parsed.kind === "invalidId");
  const resource = useResource(
    active
      ? async () => {
          if (parsed.kind === "invalidId") return { kind: "invalidId", pools: [] };
          const byId = new Map((indexRows || []).map((r) => [r.pool_id_bech32, r]));
          if (parsed.kind === "id") {
            const infos = await fetchPoolInfo(api, [parsed.value]);
            const pools = infos.map((info) => toPoolModel(byId.get(info.pool_id_bech32) || null, info)).filter(Boolean);
            return { kind: "id", pools };
          }
          if (!indexRows) return { kind: "ticker", pools: [], indexMissing: true };
          const matches = searchTicker(indexRows, parsed.value, SEARCH_RESULT_LIMIT);
          const infos = await fetchPoolInfo(api, matches.map((r) => r.pool_id_bech32));
          const infoById = new Map(infos.map((i) => [i.pool_id_bech32, i]));
          const pools = matches
            .map((row) => { const info = infoById.get(row.pool_id_bech32); return info ? toPoolModel(row, info) : null; })
            .filter(Boolean);
          return { kind: "ticker", pools };
        }
      : null,
    [api, indexRows, parsed.kind, parsed.value]
  );
  return { ...resource, kind: parsed.kind, query: debounced };
}

export function useProtocolParams(api) {
  return useResource(
    api
      ? async () => {
          const res = await api.get("/epoch_params?limit=1&order=epoch_no.desc&select=epoch_no,min_pool_cost,key_deposit");
          const row = Array.isArray(res.data) ? res.data[0] : null;
          if (!row || parseLovelace(row.key_deposit) === null || parseLovelace(row.min_pool_cost) === null) {
            throw new Error("epoch_params returned no usable row");
          }
          return { keyDeposit: String(row.key_deposit), minPoolCost: String(row.min_pool_cost) };
        }
      : null,
    [api]
  );
}

export function useAccounts(api, stakeAddresses) {
  return useResource(
    api && stakeAddresses && stakeAddresses.length ? () => fetchAccounts(api, stakeAddresses) : null,
    [api, stakeAddresses]
  );
}
