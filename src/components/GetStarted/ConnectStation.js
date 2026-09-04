import React, { useEffect, useRef, useState } from 'react';
import { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import { detectWallets, enableWallet, firstRewardAddressBech32, firstAddressBech32, loadEvolution } from '@site/src/utils/cardano/wallet';
import { parseCardanoAddress, shortenAddress } from '@site/src/utils/cardano/address.mjs';
import { UNKNOWN } from '@site/src/utils/getStarted/status.mjs';
import { formatAda } from '@site/src/utils/cardano/lovelace.mjs';
import styles from './styles.module.css';

const MAINNET = 1;
const CIP30_REFUSED = -3;
// Confirmed in the Task 0 spike, adjust if the spike note says otherwise.
const EXPLORER_STAKE_URL = 'https://cexplorer.io/stake/';

function errorMessage(code) {
  switch (code) {
    case 'testnet':
      return translate({ id: 'getStarted.connect.error.testnet', message: 'This is a test network address. Paste a mainnet address.' });
    case 'noStake':
      return translate({ id: 'getStarted.connect.error.noStake', message: 'This address has no stake part. Use another receiving address from the same wallet.' });
    case 'empty':
    case 'invalid':
    default:
      return translate({ id: 'getStarted.connect.error.invalid', message: 'That does not look like a Cardano address.' });
  }
}

function activityText(status, lastResult, locale) {
  if (status.ada === true) {
    return translate({ id: 'getStarted.connect.result.balance', message: '{amount} ada found.' }, { amount: formatAda(status.balanceLovelace, locale) });
  }
  if (status.ada === false) {
    return translate({ id: 'getStarted.connect.result.zero', message: 'Nothing here yet. That changes in the next step.' });
  }
  if (lastResult === 'empty') {
    return translate({ id: 'getStarted.connect.result.noActivity', message: 'No on-chain activity found for this address yet. That changes in the next step.' });
  }
  return translate({ id: 'getStarted.connect.result.unknown', message: 'Could not check this address yet. Refresh to try again.' });
}

function ResultCard({ account, status, lastResult, locale, forget }) {
  const confirmed = account.ownership === 'wallet-confirmed';
  return (
    <div className={styles.proof}>
      <h3>{confirmed
        ? translate({ id: 'getStarted.connect.result.you', message: 'This is you' })
        : translate({ id: 'getStarted.connect.result.tracking', message: 'Tracking this address' })}</h3>
      <p className={styles.mono}>{shortenAddress(account.stakeAddress)}</p>
      {!confirmed && (
        <p>{translate({ id: 'getStarted.connect.result.unverified', message: 'Pasting an address does not prove it is yours. Connect the wallet to confirm.' })}</p>
      )}
      <p>{activityText(status, lastResult, locale)}</p>
      <p>
        <Link href={`${EXPLORER_STAKE_URL}${account.stakeAddress}`} target="_blank" rel="noopener noreferrer">
          {translate({ id: 'getStarted.connect.result.explorer', message: 'View on an explorer' })}
        </Link>
        {' · '}
        <button type="button" className="button button--link" onClick={forget}>
          {translate({ id: 'getStarted.connect.result.change', message: 'Use a different address' })}
        </button>
      </p>
    </div>
  );
}

export default function ConnectStation({ account, setAccount, forget, status, lastResult, locale }) {
  const [tab, setTab] = useState('wallet');
  const [wallets, setWallets] = useState(null);
  const [walletError, setWalletError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    let cancelled = false;
    detectWallets().then((found) => {
      if (cancelled) return;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- wallet detection is async client-only work started after mount
      setWallets(found);
      if (found.length === 0) setTab('paste');
    });
    return () => { cancelled = true; };
  }, []);

  // Two tabs: left and right both move to the other tab.
  const onTabKey = (e, index) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (index + 1) % 2;
    setTab(next === 0 ? 'wallet' : 'paste');
    tabRefs.current[next]?.focus();
  };

  const handleConnect = async (walletId) => {
    setBusy(true);
    setWalletError(null);
    let api;
    try {
      api = await enableWallet(walletId);
    } catch (e) {
      setWalletError(e && e.code === CIP30_REFUSED
        ? translate({ id: 'getStarted.connect.error.cancelled', message: 'Connection cancelled.' })
        : translate({ id: 'getStarted.connect.error.failed', message: 'Could not connect to the wallet. Try again, or paste your address.' }));
      setBusy(false);
      return;
    }
    try {
      const networkId = await api.getNetworkId();
      if (networkId !== MAINNET) {
        setWalletError(translate({ id: 'getStarted.connect.error.wrongNetwork', message: 'Your wallet is on a test network. Switch it to mainnet and connect again.' }));
        return;
      }
      const stakeAddress = await firstRewardAddressBech32(api);
      if (!stakeAddress) {
        setWalletError(translate({ id: 'getStarted.connect.error.noReward', message: 'This wallet did not return a stake address. Try pasting a receiving address instead.' }));
        return;
      }
      // The payment address is optional context, a failure here must not
      // throw away a valid stake address.
      let baseAddress = null;
      try {
        baseAddress = await firstAddressBech32(api);
      } catch (e) {
        baseAddress = null;
      }
      setAccount({ stakeAddress, baseAddress, ownership: 'wallet-confirmed' }, api);
    } catch (e) {
      setWalletError(translate({ id: 'getStarted.connect.error.failed', message: 'Could not connect to the wallet. Try again, or paste your address.' }));
    } finally {
      setBusy(false);
    }
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    setBusy(true);
    setInputError(null);
    try {
      const sdk = await loadEvolution();
      const result = parseCardanoAddress(input, sdk);
      if (result.error) {
        setInputError(errorMessage(result.error));
        return;
      }
      setAccount({ stakeAddress: result.stakeAddress, baseAddress: result.baseAddress || null, ownership: 'unverified' }, null);
      setInput('');
    } catch (err) {
      setInputError(translate({ id: 'getStarted.connect.error.sdk', message: 'Could not check the address in this browser. Reload the page and try again.' }));
    } finally {
      setBusy(false);
    }
  };

  if (account) return <ResultCard account={account} status={status} lastResult={lastResult} locale={locale} forget={forget} />;

  const privacy = (
    <p className={styles.fieldNote}>
      {translate({ id: 'getStarted.connect.privacy', message: "Your address is stored only in this browser. To check its public on-chain activity, it is sent to cardano.org's chain-data service, the same way an explorer works." })}{' '}
      <Link to="/privacy-policy">{translate({ id: 'getStarted.connect.privacyLink', message: 'Privacy policy' })}</Link>
    </p>
  );

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label={translate({ id: 'getStarted.connect.tabsLabel', message: 'How to identify your account' })}>
        <button type="button" role="tab" id="connect-tab-wallet" aria-selected={tab === 'wallet'} aria-controls="connect-panel-wallet"
          tabIndex={tab === 'wallet' ? 0 : -1} ref={(el) => { tabRefs.current[0] = el; }} onKeyDown={(e) => onTabKey(e, 0)}
          className={styles.tab} onClick={() => setTab('wallet')}>
          {translate({ id: 'getStarted.connect.tab.wallet', message: 'Connect wallet' })}
        </button>
        <button type="button" role="tab" id="connect-tab-paste" aria-selected={tab === 'paste'} aria-controls="connect-panel-paste"
          tabIndex={tab === 'paste' ? 0 : -1} ref={(el) => { tabRefs.current[1] = el; }} onKeyDown={(e) => onTabKey(e, 1)}
          className={styles.tab} onClick={() => setTab('paste')}>
          {translate({ id: 'getStarted.connect.tab.paste', message: 'Paste address' })}
        </button>
      </div>

      {tab === 'wallet' && (
        <div role="tabpanel" id="connect-panel-wallet" aria-labelledby="connect-tab-wallet">
          {wallets === null && <p>{translate({ id: 'getStarted.connect.detecting', message: 'Looking for wallets in this browser.' })}</p>}
          {wallets && wallets.length === 0 && (
            <p>{translate({ id: 'getStarted.connect.noWallet', message: "No wallet extension found in this browser. On a phone, open this page in your wallet's browser, or paste your address." })}</p>
          )}
          {wallets && wallets.length > 0 && (
            <div className={styles.walletButtons}>
              {wallets.map((w) => (
                <button key={w.id} type="button" className={styles.walletButton} disabled={busy} onClick={() => handleConnect(w.id)}>
                  {w.icon && <img src={w.icon} alt="" />}
                  <span>{w.name}</span>
                </button>
              ))}
            </div>
          )}
          {walletError && <p className={styles.fieldError} role="alert">{walletError}</p>}
          {privacy}
        </div>
      )}

      {tab === 'paste' && (
        <form role="tabpanel" id="connect-panel-paste" aria-labelledby="connect-tab-paste" onSubmit={handlePaste}>
          <label htmlFor="connect-address">{translate({ id: 'getStarted.connect.pasteLabel', message: 'Receiving address or stake address' })}</label>
          <div className={styles.addressForm}>
            <input id="connect-address" className={styles.addressInput} value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="addr1… or stake1…" autoComplete="off" spellCheck="false"
              aria-invalid={inputError ? 'true' : undefined} aria-describedby={inputError ? 'connect-address-error' : undefined} />
            <button type="submit" className="button button--primary" disabled={busy || !input.trim()}>
              {translate({ id: 'getStarted.connect.pasteButton', message: 'Track this address' })}
            </button>
          </div>
          {inputError && <p id="connect-address-error" className={styles.fieldError} role="alert">{inputError}</p>}
          {privacy}
        </form>
      )}
    </div>
  );
}
