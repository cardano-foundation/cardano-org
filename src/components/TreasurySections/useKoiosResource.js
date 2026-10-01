import { useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { makeApiClient } from "@site/src/utils/insights/api";
import { readTimedCache, writeTimedCache } from "@site/src/utils/insights/timedCache.mjs";

const CACHE_TTL_MS = 10 * 60 * 1000;

// Per cache key: the request while it is in flight, then its normalized
// result. Several sections on the page share both, so each response is
// fetched, normalized and written to sessionStorage once.
const inflight = new Map();
const settled = new Map();

function sessionStore() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function initialData(cacheKey, normalize, isUsable) {
  const memo = settled.get(cacheKey);
  if (memo && Date.now() - memo.ts <= CACHE_TTL_MS) return memo.data;
  const data = normalize(readTimedCache(sessionStore(), cacheKey, CACHE_TTL_MS));
  if (!isUsable(data)) return null;
  settled.set(cacheKey, { ts: Date.now(), data });
  return data;
}

function fetchShared({ apiUrl, cacheKey, path, normalize, isUsable }) {
  if (!inflight.has(cacheKey)) {
    const request = makeApiClient(apiUrl)
      .get(path)
      .then(({ data: raw }) => {
        const data = normalize(raw);
        if (!isUsable(data)) throw new Error(`unusable response for ${cacheKey}`);
        writeTimedCache(sessionStore(), cacheKey, raw);
        settled.set(cacheKey, { ts: Date.now(), data });
        return data;
      })
      .finally(() => inflight.delete(cacheKey));
    inflight.set(cacheKey, request);
  }
  return inflight.get(cacheKey);
}

// Loads a Koios path once per page view (and keeps it ten minutes in
// sessionStorage), returns { status: "loading" | "ready" | "error", data }.
export default function useKoiosResource({ cacheKey, path, normalize, isUsable }) {
  const { siteConfig } = useDocusaurusContext();
  const apiUrl = siteConfig.customFields.CARDANO_ORG_API_URL;
  const [state, setState] = useState(() => {
    const data = initialData(cacheKey, normalize, isUsable);
    return data ? { status: "ready", data } : { status: "loading", data: null };
  });

  useEffect(() => {
    if (state.status !== "loading") return undefined;
    let cancelled = false;
    fetchShared({ apiUrl, cacheKey, path, normalize, isUsable })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`Treasury page: failed to load ${cacheKey}`, err);
        setState({ status: "error", data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [apiUrl, cacheKey, path, normalize, isUsable, state.status]);

  return state;
}
