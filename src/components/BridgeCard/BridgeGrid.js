import React from 'react';
import BridgeCard from './index';
import { BRIDGED_STABLECOINS } from '@site/src/data/stablecoins';
import styles from './grid.module.css';

export default function BridgeGrid() {
  return (
    <div className={styles.grid}>
      {BRIDGED_STABLECOINS.map((coin) => (
        <BridgeCard key={coin.id} {...coin} />
      ))}
    </div>
  );
}
