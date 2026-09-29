import { useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { makeApiClient } from "@site/src/utils/insights/api";
import { readTimedCache, writeTimedCache } from "@site/src/utils/insights/timedCache.mjs";
import { normalizeTotals } from "@site/src/utils/insights/treasuryMath.mjs";

const CACHE_KEY = "cardano-treasury-totals-v1";
const CACHE_TTL_MS = 10 * 60 * 1000;
// Same threshold for cached and fresh data, below it the boards cannot say anything.
const MIN_POINTS = 3;

function sessionStore() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

// Loads all epochs from /totals once and caches the raw rows for ten minutes.
// Returns { status: "loading" | "ready" | "error", points }.
export default function useTreasuryTotals() {
  const { siteConfig } = useDocusaurusContext();
  const apiUrl = siteConfig.customFields.CARDANO_ORG_API_URL;
  const [state, setState] = useState(() => {
    const cached = readTimedCache(sessionStore(), CACHE_KEY, CACHE_TTL_MS);
    const points = normalizeTotals(cached);
    return points.length >= MIN_POINTS ? { status: "ready", points } : { status: "loading", points: [] };
  });

  useEffect(() => {
    if (state.status !== "loading") return undefined;
    let cancelled = false;
    const api = makeApiClient(apiUrl);
    api
      .get("/totals?select=epoch_no,treasury,reserves,fees&order=epoch_no.asc")
      .then(({ data }) => {
        if (cancelled) return;
        const points = normalizeTotals(data);
        if (points.length < MIN_POINTS) throw new Error("too few epochs in /totals");
        writeTimedCache(sessionStore(), CACHE_KEY, data);
        setState({ status: "ready", points });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("TreasuryOverview: failed to load /totals", err);
        setState({ status: "error", points: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [apiUrl, state.status]);

  return state;
}
