import { useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { makeApiClient } from "@site/src/utils/insights/api";
import { convertLovelacesToAda } from "@site/src/utils/insights/numbers";

const PAGE_SIZE = 1000;
const MAX_PAGES = 20;
// The data.cardano.org proxy caps POST bodies (about 80 drep ids max), so
// drep_info is queried in small batches. 50 is the safe size used elsewhere.
const DREP_INFO_BATCH = 50;
const STATS_CACHE_KEY = "cardano-accountability-stats-v1";
const STATS_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function readStatsCache() {
  try {
    const raw = sessionStorage.getItem(STATS_CACHE_KEY);
    if (!raw) return null;
    const { ts, figures } = JSON.parse(raw);
    if (Date.now() - ts > STATS_CACHE_TTL_MS) return null;
    if (!figures || typeof figures !== "object") return null;
    return figures;
  } catch {
    return null;
  }
}

function writeStatsCache(figures) {
  try {
    sessionStorage.setItem(STATS_CACHE_KEY, JSON.stringify({ ts: Date.now(), figures }));
  } catch {
    // Quota exceeded or storage disabled - cache is best-effort.
  }
}

// Sum a paginated PostgREST list endpoint by walking limit/offset pages until
// a short page is returned (fewer rows than the page size) or the iteration
// cap is hit. The API does not expose a count header we can rely on in the
// browser, so counting rows page by page is the verified approach. The path
// must include an explicit order clause so row order is stable across pages.
async function countAll(api, path, isCancelled) {
  let total = 0;
  for (let page = 0; page < MAX_PAGES; page += 1) {
    if (isCancelled()) break;
    const offset = page * PAGE_SIZE;
    const separator = path.includes("?") ? "&" : "?";
    const { data } = await api.get(`${path}${separator}limit=${PAGE_SIZE}&offset=${offset}`);
    const rows = Array.isArray(data) ? data.length : 0;
    total += rows;
    if (rows < PAGE_SIZE) break;
  }
  return total;
}

// Collect all registered DRep ids by walking the paginated list.
async function fetchRegisteredDrepIds(api, isCancelled) {
  const ids = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    if (isCancelled()) break;
    const offset = page * PAGE_SIZE;
    const { data } = await api.get(
      `/drep_list?registered=eq.true&select=drep_id&order=drep_id&limit=${PAGE_SIZE}&offset=${offset}`
    );
    const rows = Array.isArray(data) ? data : [];
    for (const r of rows) if (r.drep_id) ids.push(r.drep_id);
    if (rows.length < PAGE_SIZE) break;
  }
  return ids;
}

// Count DReps whose voting power currently counts. The "active" flag lives on
// drep_info (a POST), so registered ids are fetched first, then queried in
// small batches, and the active ones are tallied.
async function countActiveDreps(api, isCancelled) {
  const ids = await fetchRegisteredDrepIds(api, isCancelled);
  if (isCancelled()) return 0;
  const batches = [];
  for (let i = 0; i < ids.length; i += DREP_INFO_BATCH) {
    batches.push(ids.slice(i, i + DREP_INFO_BATCH));
  }
  const results = await Promise.all(
    batches.map((b) => api.post("/drep_info", { _drep_ids: b }))
  );
  let active = 0;
  for (const res of results) {
    for (const d of res.data || []) if (d.active === true) active += 1;
  }
  return active;
}

export default function useAccountabilityStats() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const [state, setState] = useState({ dreps: null, committee: null, spos: null, treasury: null });

  useEffect(() => {
    if (!API_URL) return undefined;

    const cached = readStatsCache();
    if (cached) {
      // Hydrate all four figures from the client-only sessionStorage cache
      // and skip fetching entirely.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({
        dreps: cached.dreps ?? null,
        committee: cached.committee ?? null,
        spos: cached.spos ?? null,
        treasury: cached.treasury ?? null,
      });
      return undefined;
    }

    const api = makeApiClient(API_URL);
    let cancelled = false;

    // Track resolution of each figure separately from state so a fresh
    // cache write only happens once all four have settled, and only when
    // none of them came back null (a partial/failed result is never cached).
    const resolved = { dreps: false, committee: false, spos: false, treasury: false };
    const values = { dreps: null, committee: null, spos: null, treasury: null };

    // Each figure resolves independently: one call failing must not blank the others.
    const settle = (key, value) => {
      values[key] = value;
      resolved[key] = true;
      if (!cancelled) setState((s) => ({ ...s, [key]: value }));
      if (!cancelled && Object.values(resolved).every(Boolean)) {
        const allPresent = Object.values(values).every((v) => v != null);
        if (allPresent) writeStatsCache(values);
      }
    };

    countActiveDreps(api, () => cancelled)
      .then((count) => settle("dreps", count))
      .catch(() => settle("dreps", null));

    api.get("/committee_info")
      .then((r) => {
        const members = r.data?.[0]?.members;
        // Count only seated members. committee_info also returns members whose
        // status is "resigned", who are no longer part of the committee.
        const seated = Array.isArray(members)
          ? members.filter((m) => m.status !== "resigned").length
          : null;
        settle("committee", seated);
      })
      .catch(() => settle("committee", null));

    countAll(api, "/pool_list?pool_status=eq.registered&active_stake=gt.0&select=pool_id_bech32&order=pool_id_bech32", () => cancelled)
      .then((count) => settle("spos", count))
      .catch(() => settle("spos", null));

    api.get("/tip")
      .then(async (tip) => {
        const epoch = tip.data?.[0]?.epoch_no;
        if (!epoch) {
          settle("treasury", null);
          return;
        }
        try {
          const t = await api.post("/totals", { _epoch_no: epoch });
          const treasury = t.data?.[0]?.treasury;
          settle("treasury", treasury != null ? convertLovelacesToAda(treasury) : null);
        } catch {
          try {
            const t = await api.post("/totals", { _epoch_no: epoch - 1 });
            const treasury = t.data?.[0]?.treasury;
            settle("treasury", treasury != null ? convertLovelacesToAda(treasury) : null);
          } catch {
            settle("treasury", null);
          }
        }
      })
      .catch(() => settle("treasury", null));

    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  return state;
}
