import React from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import { UNKNOWN } from '@site/src/utils/getStarted/status.mjs';
import { scrollToAnchor } from './Station';
import styles from './styles.module.css';

// Three-state chip. The state is always spelled out in text, colour and
// symbol are extra.
function Chip({ label, value }) {
  const text = value === true
    ? translate({ id: 'getStarted.rail.chip.confirmed', message: 'confirmed' })
    : value === false
      ? translate({ id: 'getStarted.rail.chip.notYet', message: 'not yet' })
      : translate({ id: 'getStarted.rail.chip.unknown', message: 'unknown' });
  const cls = value === true ? styles.chipTrue : value === false ? styles.chipFalse : styles.chipUnknown;
  return (
    <span className={clsx(styles.chip, cls)}>
      <span className={styles.chipLabel}>{label}</span>
      <span className={styles.chipState}>{text}</span>
    </span>
  );
}

export default function ProgressRail({ stations, account, status, checking, error, lastChecked, onRefresh, onForget, nextIndex, locale }) {
  const timeFormat = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' });
  const connectionLabel = !account
    ? translate({ id: 'getStarted.rail.notConnected', message: 'Not connected' })
    : account.ownership === 'wallet-confirmed'
      ? translate({ id: 'getStarted.rail.walletConnected', message: 'Wallet connected' })
      : translate({ id: 'getStarted.rail.tracking', message: 'Tracking address' });

  return (
    <div className={styles.rail} role="region" aria-label={translate({ id: 'getStarted.rail.label', message: 'Your progress' })}>
      <BoundaryBox>
        <nav aria-label={translate({ id: 'getStarted.rail.stepsLabel', message: 'Steps' })} className={styles.railSteps}>
          {stations.map((s, i) => (
            <a
              key={s.key}
              href={`#${s.anchor}`}
              aria-current={i === nextIndex ? 'step' : undefined}
              className={clsx(styles.railStep, s.done === true && styles.railStepDone, i === nextIndex && styles.railStepNext)}
              onClick={(e) => { e.preventDefault(); scrollToAnchor(s.anchor); }}
            >
              <span className={styles.railDot} aria-hidden="true">{s.done === true ? '✓' : i + 1}</span>
              <span className={styles.railStepLabel}>{s.label}</span>
              <span className={styles.srOnly}>{s.done === true
                ? translate({ id: 'getStarted.station.state.done', message: 'Done' })
                : s.done === UNKNOWN
                  ? translate({ id: 'getStarted.station.state.unknown', message: 'Could not check yet' })
                  : translate({ id: 'getStarted.station.state.open', message: 'Open' })}</span>
            </a>
          ))}
        </nav>
        <div className={styles.railChips}>
          <span className={clsx(styles.chip, account ? styles.chipTrue : styles.chipUnknown)}>{connectionLabel}</span>
          {account ? (
            <>
              <Chip label={translate({ id: 'getStarted.rail.chip.ada', message: 'Ada' })} value={status.ada} />
              <Chip label={translate({ id: 'getStarted.rail.chip.stake', message: 'Stake' })} value={status.stake} />
              <Chip label={translate({ id: 'getStarted.rail.chip.vote', message: 'Vote' })} value={status.vote} />
              <button type="button" className={styles.railButton} onClick={onRefresh} disabled={checking}>
                {checking
                  ? translate({ id: 'getStarted.rail.checking', message: 'Checking' })
                  : translate({ id: 'getStarted.rail.refresh', message: 'Refresh' })}
              </button>
              {lastChecked && (
                <span className={styles.railMeta}>
                  {translate({ id: 'getStarted.rail.lastChecked', message: 'last checked {time}' }, { time: timeFormat.format(lastChecked) })}
                </span>
              )}
              <button type="button" className={styles.railButtonQuiet} onClick={onForget}>
                {translate({ id: 'getStarted.rail.forget', message: 'Forget address' })}
              </button>
            </>
          ) : (
            <span className={styles.railMeta}>
              {translate({ id: 'getStarted.rail.hint', message: 'Connect in step 3 to see your on-chain status' })}
            </span>
          )}
        </div>
        {error && (
          <p className={styles.railError} role="status">
            {translate({ id: 'getStarted.rail.error', message: 'Chain check unavailable, try again.' })}
          </p>
        )}
      </BoundaryBox>
    </div>
  );
}
