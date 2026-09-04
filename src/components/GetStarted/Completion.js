import React, { useState } from 'react';
import { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import AppList from '@site/src/components/AppList';
import { allDone, doneCount } from '@site/src/utils/getStarted/stations.mjs';
import { shortenAddress } from '@site/src/utils/cardano/address.mjs';
import { scrollToAnchor } from './Station';
import styles from './styles.module.css';

const SHARE_URL = 'https://cardano.org/get-started';

// Web Share where available, clipboard otherwise. Returns what happened so
// the button can say it. A share the user dismissed ends as 'cancelled' and
// never falls through to a silent clipboard copy.
async function shareText(text) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch (e) {
      if (e && e.name === 'AbortError') return 'cancelled';
      // unsupported payload or other failure, fall through to the clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch (e) {
    return 'failed';
  }
}

export function drepLabel(status, names) {
  if (status.drepKind === 'abstain') return translate({ id: 'getStarted.done.drepAbstain', message: 'Always abstain' });
  if (status.drepKind === 'noConfidence') return translate({ id: 'getStarted.done.drepNoConfidence', message: 'No confidence' });
  return names.drepName || shortenAddress(status.drepId);
}

export function poolLabel(status, names) {
  return names.poolTicker ? `${names.poolTicker} ${names.poolName || ''}`.trim() : (names.poolName || shortenAddress(status.poolId));
}

export default function Completion({ stations, account, status, names }) {
  const [shareState, setShareState] = useState(null);
  const finished = allDone(stations);

  if (!finished) {
    const open = stations.filter((s) => s.done !== true);
    return (
      <div>
        <h2>{translate({ id: 'getStarted.done.progress', message: '{done} of 5 done' }, { done: doneCount(stations) })}</h2>
        <ul className={styles.openList}>
          {open.map((s) => (
            <li key={s.key}>
              <a href={`#${s.anchor}`} onClick={(e) => { e.preventDefault(); scrollToAnchor(s.anchor); }}>{s.label}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const confirmed = account.ownership === 'wallet-confirmed';
  const pool = poolLabel(status, names);
  const onShare = async () => {
    const result = await shareText(translate({
      id: 'getStarted.done.shareText',
      message: 'I just set up my first Cardano wallet and delegated my stake and my vote. Start here: {url}',
    }, { url: SHARE_URL }));
    setShareState(result);
  };

  return (
    <div>
      <div className={styles.completionCard}>
        <h2>{confirmed
          ? translate({ id: 'getStarted.done.titleYou', message: 'You are in' })
          : translate({ id: 'getStarted.done.titleAddress', message: 'This address is all set' })}</h2>
        <p className={styles.completionRow}>
          <span>{translate({ id: 'getStarted.done.address', message: 'Stake address' })}: <span className={styles.mono}>{shortenAddress(account.stakeAddress)}</span></span>
        </p>
        <p className={styles.completionRow}>
          <span>{translate({ id: 'getStarted.done.pool', message: 'Staked with {pool}' }, { pool })}</span>
          <span>{translate({ id: 'getStarted.done.drep', message: 'Voting through {drep}' }, { drep: drepLabel(status, names) })}</span>
        </p>
        <div className={styles.completionActions}>
          {confirmed ? (
            <button type="button" className="button button--primary" onClick={onShare}>
              {shareState === 'copied'
                ? translate({ id: 'getStarted.done.copied', message: 'Copied to clipboard' })
                : translate({ id: 'getStarted.done.share', message: 'Share' })}
            </button>
          ) : (
            <p className={styles.fieldNote}>{translate({ id: 'getStarted.done.shareUnverified', message: 'Connect the wallet that owns this address to share your progress.' })}</p>
          )}
          <Link className="button button--outline button--primary" to="/learn">
            {translate({ id: 'getStarted.done.learn', message: 'Continue on the learning path' })}
          </Link>
          <Link className="button button--outline button--primary" to="/quiz">
            {translate({ id: 'getStarted.done.quiz', message: 'Test what you learned' })}
          </Link>
        </div>
        {shareState === 'failed' && <p className={styles.fieldError} role="alert">{translate({ id: 'getStarted.done.shareFailed', message: 'Sharing is not available in this browser.' })}</p>}
      </div>
      <AppList
        slugs={['minswap', 'liqwid', 'strike-finance', 'bodega-market', 'wayup']}
        showTags={true}
        categoryTitle={translate({ id: 'getStarted.done.popularApps', message: 'Popular apps' })}
        showTxCount={false}
        showDescription={true}
      />
    </div>
  );
}
