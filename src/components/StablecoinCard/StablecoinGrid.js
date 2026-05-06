import React from "react";
import { translate } from "@docusaurus/Translate";
import StablecoinCard from "./index";
import { NATIVE_STABLECOINS } from "@site/src/data/stablecoins";
import { formatUsdShort } from "@site/src/components/Stablecoins/useStablecoinLiveData";
import styles from "./grid.module.css";

const MARKET_CAP_LABEL = translate({
  id: "stablecoins.meta.marketCap",
  message: "Market cap",
});

function withLiveMarketCap(coin, pricesById, pricesStatus) {
  const live = pricesById?.[coin.coingeckoId];
  return [
    {
      label: MARKET_CAP_LABEL,
      value: formatUsdShort(live?.usd_market_cap, pricesStatus),
    },
    ...coin.metadata,
  ];
}

export default function StablecoinGrid({ liveData }) {
  const pricesById = liveData?.pricesById ?? null;
  const pricesStatus = liveData?.pricesStatus ?? "loading";

  return (
    <div className={styles.grid}>
      {NATIVE_STABLECOINS.map((coin) => (
        <StablecoinCard
          key={coin.id}
          {...coin}
          metadata={withLiveMarketCap(coin, pricesById, pricesStatus)}
        />
      ))}
    </div>
  );
}
