import React, { useEffect, useRef, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { makeApiClient } from "@site/src/utils/insights/api";
import {
  NATIVE_STABLECOINS,
  BRIDGED_STABLECOINS,
} from "@site/src/data/stablecoins";

// 290 bytes is representative for a 1-input / 1-output stablecoin send.
const TYPICAL_STABLECOIN_TX_BYTES = 290;
const RETRY_DELAY_MS = 800;

const ALL_COINGECKO_IDS = [...NATIVE_STABLECOINS, ...BRIDGED_STABLECOINS]
  .map((c) => c.coingeckoId)
  .filter(Boolean)
  .join(",");

function isTransientError(err) {
  if (!err) return false;
  if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") return true;
  if (err.message === "Network Error") return true;
  const status = err.response?.status;
  return typeof status === "number" && status >= 500 && status < 600;
}

async function withSingleRetry(fn) {
  try {
    return await fn();
  } catch (err) {
    if (!isTransientError(err)) throw err;
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    return fn();
  }
}

export default function useStablecoinLiveData() {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const koiosUrl = customFields.CARDANO_ORG_API_URL;
  const cgUrl = customFields.CARDANO_ORG_CG_API_URL;

  const koiosRef = useRef(null);
  const cgRef = useRef(null);
  if (!koiosRef.current && koiosUrl) koiosRef.current = makeApiClient(koiosUrl);
  if (!cgRef.current && cgUrl) cgRef.current = makeApiClient(cgUrl);

  const [pricesById, setPricesById] = useState(null);
  const [pricesStatus, setPricesStatus] = useState("loading");
  const [avgFeeAda, setAvgFeeAda] = useState(null);
  const [feeStatus, setFeeStatus] = useState("loading");

  useEffect(() => {
    if (!koiosUrl || !cgUrl) {
      setPricesStatus("error");
      setFeeStatus("error");
      return undefined;
    }
    const koios = koiosRef.current;
    const cg = cgRef.current;
    if (!koios || !cg) {
      setPricesStatus("error");
      setFeeStatus("error");
      return undefined;
    }

    let cancelled = false;

    async function loadPrices() {
      try {
        const priceRes = await withSingleRetry(() =>
          cg.get(
            `/simple/price?ids=${ALL_COINGECKO_IDS}` +
              `&vs_currencies=usd&include_market_cap=true&precision=0`,
          ),
        );
        if (cancelled) return;

        const prices =
          priceRes?.data && typeof priceRes.data === "object"
            ? { ...priceRes.data }
            : {};

        const koiosFallback = await fetchKoiosMarketCaps(koios, prices);
        if (cancelled) return;
        Object.assign(prices, koiosFallback);

        setPricesById(Object.keys(prices).length > 0 ? prices : null);
        setPricesStatus("ready");
      } catch (err) {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.error("useStablecoinLiveData: prices fetch failed", err);
        setPricesStatus("error");
      }
    }

    async function loadFee() {
      try {
        const paramsRes = await withSingleRetry(() =>
          koios.get("/epoch_params?limit=1"),
        );
        if (cancelled) return;

        const params = paramsRes?.data?.[0];
        if (
          params &&
          typeof params.min_fee_a === "number" &&
          typeof params.min_fee_b === "number"
        ) {
          const lovelace =
            params.min_fee_b + params.min_fee_a * TYPICAL_STABLECOIN_TX_BYTES;
          setAvgFeeAda(lovelace / 1_000_000);
          setFeeStatus("ready");
        } else {
          setFeeStatus("error");
        }
      } catch (err) {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.error("useStablecoinLiveData: fee fetch failed", err);
        setFeeStatus("error");
      }
    }

    loadPrices();
    loadFee();
    return () => {
      cancelled = true;
    };
  }, [koiosUrl, cgUrl]);

  return { pricesById, pricesStatus, avgFeeAda, feeStatus };
}

// Coins whose CoinGecko entry doesn't yet carry market-cap data (preview
// listings, recently launched native assets) but which exist on Cardano as
// native tokens. We fall back to Koios `asset_info` and synthesize a market
// cap from total_supply * pegUsd.
async function fetchKoiosMarketCaps(koios, currentPrices) {
  const targets = [...NATIVE_STABLECOINS, ...BRIDGED_STABLECOINS].filter(
    (c) => {
      if (!c.cardanoAsset || !c.coingeckoId) return false;
      const live = currentPrices[c.coingeckoId];
      return !live || typeof live.usd_market_cap !== "number";
    },
  );
  if (targets.length === 0) return {};

  const assetList = targets.map((c) => [
    c.cardanoAsset.policyId,
    c.cardanoAsset.assetNameHex,
  ]);

  let rows;
  try {
    const res = await withSingleRetry(() =>
      koios.post("/asset_info", { _asset_list: assetList }),
    );
    rows = Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("useStablecoinLiveData: Koios asset_info failed", err);
    return {};
  }

  const byPolicy = new Map(
    rows.map((r) => [`${r.policy_id}:${r.asset_name}`, r]),
  );
  const out = {};
  for (const coin of targets) {
    const key = `${coin.cardanoAsset.policyId}:${coin.cardanoAsset.assetNameHex}`;
    const row = byPolicy.get(key);
    const supplyRaw = row?.total_supply;
    if (!supplyRaw) continue;
    const supply = Number(supplyRaw) / 10 ** coin.cardanoAsset.decimals;
    if (!Number.isFinite(supply)) continue;
    out[coin.coingeckoId] = {
      usd: coin.cardanoAsset.pegUsd,
      usd_market_cap: supply * coin.cardanoAsset.pegUsd,
    };
  }
  return out;
}

const ERROR_TOOLTIP = "Live data temporarily unavailable";

function ErrorPlaceholder() {
  return (
    <span title={ERROR_TOOLTIP} aria-label={ERROR_TOOLTIP}>
      —
    </span>
  );
}

// Format a USD amount as a short human label: "$13.4M", "$1.2B", "$430K".
// Returns "—" for null/undefined; renders a tooltipped placeholder when
// `status === "error"` so users on hover learn that the value is unavailable
// rather than missing-by-design.
export function formatUsdShort(usd, status) {
  if (status === "error") return <ErrorPlaceholder />;
  if (usd == null || !Number.isFinite(usd)) return "—";
  const abs = Math.abs(usd);
  if (abs >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
  return `$${Math.round(usd)}`;
}

// Format an ada fee with leading symbol and two decimals: "₳ 0.17".
export function formatAdaFee(ada, status) {
  if (status === "error") return <ErrorPlaceholder />;
  if (ada == null || !Number.isFinite(ada)) return "—";
  return `₳ ${ada.toFixed(2)}`;
}
