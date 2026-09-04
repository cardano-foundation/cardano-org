import React from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

// Scrolls to a station, honours reduced motion, updates the hash without a
// jump and moves focus so keyboard and screen reader users follow along.
export function scrollToAnchor(id) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The sticky rail wraps to several rows on narrow screens, so the offset is
  // measured from the live rail height instead of a fixed scroll-margin.
  const rail = document.querySelector('[data-get-started-rail]');
  const navbar = document.querySelector('.navbar');
  const offset = (rail ? rail.getBoundingClientRect().height : 0) + (navbar ? navbar.getBoundingClientRect().height : 0) + 16;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
  // pushState keeps every station in the history, so the back button walks
  // back through the stations the way plain anchor links would.
  if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
  el.focus({ preventScroll: true });
}

function stateLabel(state) {
  if (state === 'done') return translate({ id: 'getStarted.station.state.done', message: 'Done' });
  if (state === 'unknown') return translate({ id: 'getStarted.station.state.unknown', message: 'Could not check yet' });
  return translate({ id: 'getStarted.station.state.open', message: 'Open' });
}

export default function Station({ anchor, number, title, state = 'open', why, action, proof, question, nextAnchor }) {
  const titleId = `${anchor}-title`;
  return (
    <section
      id={anchor}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={clsx(styles.station, styles[`station_${state}`])}
    >
      <header className={styles.stationHeader}>
        <span className={styles.stationNumber} aria-hidden="true">{state === 'done' ? '✓' : number}</span>
        <div>
          <h2 id={titleId} className={styles.stationTitle}>{title}</h2>
          <p className={styles.stationState}>
            {translate({ id: 'getStarted.station.stepOf', message: 'Step {number} of 5' }, { number })}
            {' · '}
            {stateLabel(state)}
          </p>
        </div>
      </header>
      {why && <div className={styles.why}>{why}</div>}
      {action && <div className={styles.action}>{action}</div>}
      {proof && <div className={styles.proof}>{proof}</div>}
      {question && <div className={styles.question}>{question}</div>}
      {nextAnchor && (
        <div className={styles.stationFooter}>
          <button type="button" className="button button--primary" onClick={() => scrollToAnchor(nextAnchor)}>
            {translate({ id: 'getStarted.station.continue', message: 'Continue' })}
          </button>
        </div>
      )}
    </section>
  );
}
