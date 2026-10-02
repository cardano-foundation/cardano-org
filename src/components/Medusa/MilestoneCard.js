import React, { memo, useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { milestoneText } from './milestoneText.js';
import { formatDay, formatMonth } from './formatDate.js';
import MilestoneDot from './MilestoneDot.js';
import styles from './explorer.module.css';

const SHOW_MS = 8000;

// The open card folds itself after a while, unless the pointer or the focus
// rests on it. Its hold state lives and dies with the open card.
function OpenCard({ milestone, locale, buttonRef, onCollapse, onClose }) {
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (hold) return undefined;
    const t = setTimeout(onCollapse, SHOW_MS);
    return () => clearTimeout(t);
  }, [hold, onCollapse]);

  const text = milestoneText(milestone.key);
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
        ref={buttonRef}
        type="button"
        className={styles.cardClose}
        aria-expanded="true"
        onClick={onClose}
        aria-label={translate({ id: 'medusa.card.collapse', message: 'Collapse' })}
      >
        ×
      </button>
      <div className={styles.cardDate}>
        <MilestoneDot milestone={milestone} />
        {formatDay(milestone.date, locale)}
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

// The chapter the timeline is in. It opens when a milestone is reached and
// folds into a single line, so the current chapter stays visible without
// covering the graph.
function MilestoneCard({ milestone, expanded, onExpand, onCollapse }) {
  const { i18n } = useDocusaurusContext();
  const buttonRef = useRef(null);
  const moveFocus = useRef(false);

  // A click swaps the line for the card and back, the focus follows to the
  // new button instead of falling back to the page.
  useEffect(() => {
    if (moveFocus.current) buttonRef.current?.focus();
    moveFocus.current = false;
  }, [expanded]);

  const byClick = (fn) => () => {
    moveFocus.current = true;
    fn();
  };

  if (expanded) {
    return <OpenCard key={milestone.key} milestone={milestone} locale={i18n.currentLocale} buttonRef={buttonRef} onCollapse={onCollapse} onClose={byClick(onCollapse)} />;
  }
  return (
    <button ref={buttonRef} type="button" className={styles.chapter} aria-expanded="false" onClick={byClick(() => onExpand(milestone.key))}>
      <MilestoneDot milestone={milestone} />
      <span className={styles.chapterName}>{milestoneText(milestone.key).name}</span>
      <span className={styles.chapterDate}>{formatMonth(milestone.date, i18n.currentLocale)}</span>
    </button>
  );
}

// The explorer rerenders on every animation frame, the card only needs to when
// the chapter or its state changes.
export default memo(MilestoneCard);
