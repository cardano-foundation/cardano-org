import { useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { makeApiClient } from "@site/src/utils/insights/api";
import { readTimedCache, writeTimedCache } from "@site/src/utils/insights/timedCache.mjs";

const CACHE_TTL_MS = 10 * 60 * 1000;

// One request per cache key while it is in flight, so several sections on the
// page that need the same data share it.
const inflight = new Map();

function sessionStore() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function fetchShared(apiUrl, cacheKey, path) {
  if (!inflight.has(cacheKey)) {
    const request = makeApiClient(apiUrl)
      .get(path)
      .then(({ data }) => data)
      .finally(() => inflight.delete(cacheKey));
    inflight.set(cacheKey, request);
  }
  return inflight.get(cacheKey);
}

// Loads a Koios path once, keeps the raw rows in sessionStorage for ten
// minutes and returns { status: "loading" | "ready" | "error", data }.
export default function useKoiosResource({ cacheKey, path, normalize, isUsable }) {
  const { siteConfig } = useDocusaurusContext();
  const apiUrl = siteConfig.customFields.CARDANO_ORG_API_URL;
  const [state, setState] = useState(() => {
    const data = normalize(readTimedCache(sessionStore(), cacheKey, CACHE_TTL_MS));
    return isUsable(data) ? { status: "ready", data } : { status: "loading", data: null };
  });

  useEffect(() => {
    if (state.status !== "loading") return undefined;
    let cancelled = false;
    fetchShared(apiUrl, cacheKey, path)
      .then((raw) => {
        if (cancelled) return;
        const data = normalize(raw);
        if (!isUsable(data)) throw new Error(`unusable response for ${cacheKey}`);
        writeTimedCache(sessionStore(), cacheKey, raw);
        setState({ status: "ready", data });
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
