import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { milestoneText } from './milestoneText.js';
import { formatDay, formatMonth } from './formatDate.js';
import { groupColor } from './groups.js';
import styles from './explorer.module.css';

const SHOW_MS = 8000;

// Hard forks carry the color of the era they start, repository events have no
// era and are drawn as a hollow ring instead.
export function milestoneColor(milestone) {
  return milestone.kind === 'hardfork' ? groupColor(milestone.group) : null;
}

export function MilestoneDot({ milestone }) {
  const color = milestoneColor(milestone);
  if (!color) return <span className={styles.ringDot} />;
  // currentColor drives the dot glow, so the era color is set as the text color too.
  return <span className={styles.legendDot} style={{ background: color, color }} />;
}

// The chapter the timeline is in. It opens when a milestone is reached and
// folds into a single line after a while, so the current chapter stays visible
// without covering the graph.
export default function MilestoneCard({ milestone, expanded, onExpand, onCollapse }) {
  const { i18n } = useDocusaurusContext();
  const [hold, setHold] = useState(false);
  const focusRef = useRef(null);
  const moveFocus = useRef(false);

  useEffect(() => {
    if (!expanded || hold) return undefined;
    const t = setTimeout(onCollapse, SHOW_MS);
    return () => clearTimeout(t);
  }, [milestone, expanded, hold, onCollapse]);

  // A click swaps the line for the card and back, the focus follows to the
  // new button instead of falling back to the page.
  useEffect(() => {
    if (moveFocus.current) focusRef.current?.focus();
    moveFocus.current = false;
    // A hover on the card is gone once it folds, so the next card starts
    // its timer again.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!expanded) setHold(false);
  }, [expanded]);

  const text = milestoneText(milestone.key);
  const byClick = (fn) => () => {
    moveFocus.current = true;
    fn();
  };

  if (!expanded) {
    return (
      <button ref={focusRef} type="button" className={styles.chapter} aria-expanded="false" onClick={byClick(onExpand)}>
        <MilestoneDot milestone={milestone} />
        <span className={styles.chapterName}>{text.name}</span>
        <span className={styles.chapterDate}>{formatMonth(milestone.date, i18n.currentLocale)}</span>
      </button>
    );
  }

  const external = milestone.link.startsWith('http');
  return (
    <div
      className={styles.card}
      role="status"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <button
        ref={focusRef}
        type="button"
        className={styles.cardClose}
        aria-expanded="true"
        onClick={byClick(onCollapse)}
        aria-label={translate({ id: 'medusa.card.collapse', message: 'Collapse' })}
      >
        ×
      </button>
      <div className={styles.cardDate}>
        <MilestoneDot milestone={milestone} />
        {formatDay(milestone.date, i18n.currentLocale)}
      </div>
      <strong>{text.name}</strong>
      <p>{text.description}</p>
      {external ? (
        <a href={milestone.link} target="_blank" rel="noopener noreferrer">{translate({ id: 'medusa.card.repoLink', message: 'View repository' })}</a>
      ) : (
        <Link to={milestone.link}>{translate({ id: 'medusa.card.link', message: 'About this hard fork' })}</Link>
      )}
    </div>
  );
}
