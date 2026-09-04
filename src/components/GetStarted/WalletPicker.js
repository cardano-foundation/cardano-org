import React, { useEffect, useState } from 'react';
import { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import WalletFinderCard from '@site/src/components/WalletFinderCard';
import { getWallets } from '@site/src/utils/walletFinderUtils';
import { detectDevice, pickWalletsForDevice } from '@site/src/utils/getStarted/devices.mjs';
import styles from './styles.module.css';

export default function WalletPicker({ installed, onInstalledChange }) {
  // null until mount so the static render shows every pick instead of nothing.
  const [device, setDevice] = useState(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- user agent is only available in the browser
    setDevice(detectDevice(navigator.userAgent));
  }, []);
  const wallets = pickWalletsForDevice(getWallets(), device);

  return (
    <div>
      <div className={styles.walletGrid}>
        {wallets.map((w) => <WalletFinderCard key={w.title} wallet={w} />)}
      </div>
      <p>
        <Link to="/wallets">{translate({ id: 'getStarted.wallet.finderLink', message: 'Compare all wallets in the Wallet Finder' })}</Link>
        {' · '}
        <Link to="/what-is-a-wallet">{translate({ id: 'getStarted.wallet.learnLink', message: 'What is a wallet?' })}</Link>
      </p>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={!!installed} onChange={(e) => onInstalledChange(e.target.checked)} />
        <span>{translate({ id: 'getStarted.wallet.installedCheckbox', message: 'I have installed a wallet.' })}</span>
      </label>
    </div>
  );
}
