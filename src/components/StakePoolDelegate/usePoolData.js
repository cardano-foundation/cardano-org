// Koios access and the async state machines behind StakePoolDelegate. Every
// resource is idle | loading | ready | error with a retry, and a sequence
// number drops responses that arrive after a newer request started.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fisherYates, readCache, writeCache } from "@site/src/components/WalletDelegation/helpers";
import { parseLovelace } from "@site/src/utils/cardano/lovelace.mjs";
import {
  fetchPoolIndex, fetchPoolInfoOne, fetchPoolInfoSettled, fetchPoolsByTicker, fetchTickerAliases,
} from "@site/src/utils/cardano/koiosPools.mjs";
import { createPoolSampler } from "@site/src/utils/cardano/poolSampler.mjs";
import {
  SEARCH_RESULT_LIMIT, classifyQuery, eligibleFromIndex, hasExactTicker, mergeTickerMatches,
  remoteTickerPrefix, searchTicker, toPoolModel, withTickerAliases,
} from "@site/src/utils/cardano/stakePools.mjs";

export const INDEX_CACHE_KEY = "cardano-org.pool-index.v1";
export const ALIAS_CACHE_KEY = "cardano-org.pool-tickers.v1";
export const INDEX_CACHE_TTL_MS = 15 * 60 * 1000;
const SEARCH_DEBOUNCE_MS = 250;
// Koios account_info status values. Anything else is treated as an error so
// the UI never guesses a certificate path from an unknown value.
const ACCOUNT_STATUS = { registered: "registered", "not registered": "unregistered" };

// account_info for the given reward addresses in one POST. Koios omits
// addresses it has never seen, which means an unregistered stake key. A row
// with an unknown status or a non-array response throws.
export async function fetchAccounts(api, stakeAddresses) {
  const res = await api.post("/account_info", { _stake_addresses: stakeAddresses });
  if (!Array.isArray(res.data)) throw new Error("account_info returned no array");
  const byAddr = new Map(res.data.map((r) => [r?.stake_address, r]));
  const poolIds = [...new Set(res.data.map((r) => r?.delegated_pool).filter(Boolean))];
  const infos = await Promise.all(poolIds.map((id) => fetchPoolInfoOne(api, id)));
  const poolById = new Map(infos.filter(Boolean).map((i) => [i.pool_id_bech32, toPoolModel(null, i)]));
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
  // Every run gets a signal, and starting or ending a run aborts the one
  // before it. Loaders that chain several requests then stop after the
  // current one instead of finishing work nobody waits for any more.
  const controller = useRef(null);
  const run = useCallback(() => {
    const id = ++seq.current;
    controller.current?.abort();
    controller.current = null;
    if (!loader) {
      setState({ status: "idle", data: null, error: null });
      return;
    }
    const aborter = new AbortController();
    controller.current = aborter;
    setState({ status: "loading", data: null, error: null });
    Promise.resolve()
      .then(() => loader({ signal: aborter.signal }))
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
    return () => {
      seq.current += 1;
      controller.current?.abort();
      controller.current = null;
    };
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

// Ticker fallbacks, loaded on their own so nothing waits for them. The
// search uses them where the index has no ticker, the random sample never
// sees them: it draws from the untouched index, where a missing ticker is
// one of its criteria.
export function usePoolTickerAliases(api) {
  return useResource(
    api
      ? async ({ signal }) => {
          const cached = readCache(ALIAS_CACHE_KEY, INDEX_CACHE_TTL_MS);
          if (Array.isArray(cached) && cached.length) return new Map(cached);
          const aliases = await fetchTickerAliases(api, { signal });
          writeCache(ALIAS_CACHE_KEY, [...aliases]);
          return aliases;
        }
      : null,
    [api]
  );
}

// Random selection: the sampler loads pool_info one pool at a time and
// reports every arrival, so cards render as they come in. It keeps a spare
// pool so a shuffle shows the next set at once. Nothing is cached across
// visits, every mount draws fresh. retry starts a new sampler, which is also
// the way out of the error state.
const IDLE_STATE = { status: "idle", data: null, error: null };

export function useRandomSample(api, indexRows) {
  const [nonce, setNonce] = useState(0);
  const [state, setState] = useState(IDLE_STATE);
  const samplerRef = useRef(null);

  useEffect(() => {
    if (!api || !indexRows) return undefined;
    const controller = new AbortController();
    const sampler = createPoolSampler({
      candidates: fisherYates(eligibleFromIndex(indexRows)),
      fetchOne: (id) => fetchPoolInfoOne(api, id, { signal: controller.signal }),
      onChange: (snap) => {
        if (snap.status === "error") console.error("StakePoolDelegate: resource failed", snap.error);
        setState({ status: snap.status, data: snap.pools, error: snap.error });
      },
    });
    samplerRef.current = sampler;
    sampler.start();
    return () => {
      sampler.stop();
      controller.abort();
      samplerRef.current = null;
      setState(IDLE_STATE);
    };
  }, [api, indexRows, nonce]);

  const shuffle = useCallback(() => samplerRef.current?.shuffle(), []);
  const retry = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, shuffle, retry };
}

// Ticker search waits for the index: while it is still loading, the ticker
// branch stays idle instead of reporting the list as unavailable.
export function usePoolSearch(api, indexRows, query, indexStatus, aliases) {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  const searchRows = useMemo(() => withTickerAliases(indexRows, aliases), [indexRows, aliases]);
  const parsed = classifyQuery(debounced);
  const active = api && (parsed.kind === "id" || parsed.kind === "invalidId" || (parsed.kind === "ticker" && (indexRows || indexStatus === "error")));
  const resource = useResource(
    active
      ? async ({ signal }) => {
          if (parsed.kind === "invalidId") return { kind: "invalidId", pools: [] };
          const byId = new Map(searchRows.map((r) => [r.pool_id_bech32, r]));
          if (parsed.kind === "id") {
            const infos = await fetchPoolInfoSettled(api, [parsed.value], { signal });
            const pools = infos.map((info) => toPoolModel(byId.get(info.pool_id_bech32) || null, info)).filter(Boolean);
            return { kind: "id", pools };
          }
          if (!indexRows) return { kind: "ticker", pools: [], indexMissing: true };
          let matches = searchTicker(searchRows, parsed.value, SEARCH_RESULT_LIMIT);
          // Without an exact hit the cached index may simply be missing this
          // ticker: Koios instances differ in how much pool metadata they
          // hold, and the proxy caches a page for two hours. A prefix hit is
          // not good enough here, "BROCK2" must not hide "BROCK". Failure is
          // fine, the local matches still render.
          const prefix = hasExactTicker(matches, parsed.value) ? null : remoteTickerPrefix(parsed.value);
          if (prefix) {
            try {
              const remote = await fetchPoolsByTicker(api, prefix, SEARCH_RESULT_LIMIT, { signal });
              matches = mergeTickerMatches(matches, remote, parsed.value, SEARCH_RESULT_LIMIT);
            } catch (error) {
              // With local matches in hand the lookup was a bonus. Without
              // them it was the whole search, and a failed request must not
              // read as "no pool has this ticker".
              if (!matches.length) throw error;
              console.error("StakePoolDelegate: ticker lookup failed", error);
            }
          }
          const infos = await fetchPoolInfoSettled(api, matches.map((r) => r.pool_id_bech32), { signal });
          const infoById = new Map(infos.map((i) => [i.pool_id_bech32, i]));
          const pools = matches
            .map((row) => { const info = infoById.get(row.pool_id_bech32); return info ? toPoolModel(row, info) : null; })
            .filter(Boolean);
          // matched tells the empty state apart: no pool carries this ticker,
          // or pool_info did not return usable rows for the pools that do.
          return { kind: "ticker", pools, matched: matches.length };
        }
      : null,
    [api, indexRows, searchRows, parsed.kind, parsed.value, indexStatus]
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
