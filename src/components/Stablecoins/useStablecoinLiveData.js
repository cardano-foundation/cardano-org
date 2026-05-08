import React, { useEffect, useRef, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { makeApiClient } from "@site/src/utils/insights/api";
import {
  NATIVE_STABLECOINS,
  BRIDGED_STABLECOINS,
} from "@site/src/data/stablecoins";

const RETRY_DELAY_MS = 800;

const ALL_COINS = [...NATIVE_STABLECOINS, ...BRIDGED_STABLECOINS];

const COIN_BY_COINGECKO_ID = new Map(
  ALL_COINS.filter((c) => c.coingeckoId).map((c) => [c.coingeckoId, c]),
);

const ALL_COINGECKO_IDS = [...COIN_BY_COINGECKO_ID.keys()].join(",");

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
        const priceRes = ALL_COINGECKO_IDS
          ? await withSingleRetry(() =>
              cg.get(
                `/simple/price?ids=${ALL_COINGECKO_IDS}` +
                  `&vs_currencies=usd&include_market_cap=true&precision=0`,
              ),
            )
          : { data: {} };
        if (cancelled) return;

        const cgByCoingeckoId =
          priceRes?.data && typeof priceRes.data === "object"
            ? priceRes.data
            : {};

        // Re-key the CoinGecko response by `coin.id` so coins without a
        // CoinGecko listing (e.g. USDCx, sourced from Koios by design) share
        // the same lookup space as the rest of the page.
        const prices = {};
        for (const [cgId, record] of Object.entries(cgByCoingeckoId)) {
          const coin = COIN_BY_COINGECKO_ID.get(cgId);
          if (coin) prices[coin.id] = record;
        }

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
        // Match the methodology used on /insights/transactions#avg-fee:
        // weighted average over recent epochs, fees / tx_count. This reflects
        // what users actually pay on-chain, not the protocol-min fee floor.
        const epochsRes = await withSingleRetry(() => koios.get("/epoch_info"));
        if (cancelled) return;

        const rows = Array.isArray(epochsRes?.data) ? epochsRes.data : [];
        let totalFees = 0;
        let totalTx = 0;
        for (const row of rows) {
          const fees = Number(row?.fees);
          const txCount = Number(row?.tx_count);
          if (Number.isFinite(fees) && Number.isFinite(txCount) && txCount > 0) {
            totalFees += fees;
            totalTx += txCount;
          }
        }

        if (totalTx > 0) {
          setAvgFeeAda(totalFees / totalTx / 1_000_000);
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

// Source-of-truth path for any Cardano-native stablecoin where CoinGecko data
// is unreliable: either CG has no listing (e.g. USDCx — see `coingeckoId: null`
// in src/data/stablecoins.js) or its listing is missing market-cap data. We
// pull `total_supply` from Koios `asset_info` and synthesize a market cap.
//
// USD multiplier: prefer CoinGecko's live `usd` price when present, so a
// depeg event reflects in the market cap. Fall back to the static `pegUsd`
// only when no live price exists. An implausible CG price (non-finite, ≤0,
// or >50% off peg) is rejected in favour of the peg — that's almost certainly
// bad upstream data, not a real depeg.
async function fetchKoiosMarketCaps(koios, currentPrices) {
  const targets = [...NATIVE_STABLECOINS, ...BRIDGED_STABLECOINS].filter(
    (c) => {
      if (!c.cardanoAsset) return false;
      // Always pull from Koios when there's no CoinGecko listing.
      if (!c.coingeckoId) return true;
      const live = currentPrices[c.id];
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

    const peg = coin.cardanoAsset.pegUsd;
    const cgUsd = currentPrices[coin.id]?.usd;
    const cgUsdIsPlausible =
      typeof cgUsd === "number" &&
      Number.isFinite(cgUsd) &&
      cgUsd > 0 &&
      Math.abs(cgUsd - peg) / peg <= 0.5;
    const usd = cgUsdIsPlausible ? cgUsd : peg;

    out[coin.id] = {
      usd,
      usd_market_cap: supply * usd,
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
