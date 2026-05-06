import React from 'react';
import { translate } from '@docusaurus/Translate';
import { NATIVE_STABLECOINS } from '@site/src/data/stablecoins';
import { formatAdaFee, formatUsdShort } from '../useStablecoinLiveData';
import styles from './styles.module.css';

function combinedMarketCap(pricesById) {
  if (!pricesById) return null;
  let total = 0;
  let any = false;
  for (const coin of NATIVE_STABLECOINS) {
    const p = pricesById[coin.coingeckoId];
    if (p && typeof p.usd_market_cap === 'number') {
      total += p.usd_market_cap;
      any = true;
    }
  }
  return any ? total : null;
}

export default function StablecoinsStatsBar({ liveData }) {
  const pricesById = liveData?.pricesById ?? null;
  const pricesStatus = liveData?.pricesStatus ?? 'loading';
  const avgFeeAda = liveData?.avgFeeAda ?? null;
  const feeStatus = liveData?.feeStatus ?? 'loading';
  const combined = combinedMarketCap(pricesById);

  const items = [
    {
      label: translate({ id: 'stablecoins.stats.averageFee', message: 'Average Fee' }),
      value: formatAdaFee(avgFeeAda, feeStatus),
    },
    {
      label: translate({ id: 'stablecoins.stats.nativeCount', message: 'Native Stablecoins' }),
      value: String(NATIVE_STABLECOINS.length),
    },
    {
      label: translate({ id: 'stablecoins.stats.combinedCap', message: 'Combined Market Cap' }),
      value: formatUsdShort(combined, pricesStatus),
    },
  ];

  return (
    <div
      className={styles.bar}
      role="group"
      aria-label={translate({
        id: 'stablecoins.stats.ariaLabel',
        message: 'Stablecoin ecosystem stats',
      })}
    >
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          <dl className={styles.stat}>
            <dt className={styles.label}>{item.label}</dt>
            <dd className={styles.value}>{item.value}</dd>
          </dl>
          {i < items.length - 1 && <span className={styles.divider} aria-hidden="true" />}
        </React.Fragment>
      ))}
    </div>
  );
}
