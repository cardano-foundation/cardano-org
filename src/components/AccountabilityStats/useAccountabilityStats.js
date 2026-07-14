import { useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { makeApiClient } from "@site/src/utils/insights/api";
import { convertLovelacesToAda } from "@site/src/utils/insights/numbers";

const PAGE_SIZE = 1000;
const MAX_PAGES = 20;

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

export default function useAccountabilityStats() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const [state, setState] = useState({ dreps: null, committee: null, spos: null, treasury: null });

  useEffect(() => {
    if (!API_URL) return undefined;
    const api = makeApiClient(API_URL);
    let cancelled = false;

    // Each figure resolves independently: one call failing must not blank the others.
    const settle = (key, value) => {
      if (!cancelled) setState((s) => ({ ...s, [key]: value }));
    };

    countAll(api, "/drep_list?registered=eq.true&select=drep_id&order=drep_id", () => cancelled)
      .then((count) => settle("dreps", count))
      .catch(() => settle("dreps", null));

    api.get("/committee_info")
      .then((r) => {
        const members = r.data?.[0]?.members;
        settle("committee", Array.isArray(members) ? members.length : null);
      })
      .catch(() => settle("committee", null));

    countAll(api, "/pool_list?pool_status=eq.registered&select=pool_id_bech32&order=pool_id_bech32", () => cancelled)
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
