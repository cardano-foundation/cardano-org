import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { milestoneText } from './milestoneText.js';
import styles from './explorer.module.css';

const SHOW_MS = 6000;

export default function MilestoneCard({ milestone, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, SHOW_MS);
    return () => clearTimeout(t);
  }, [milestone, onDismiss]);
  const text = milestoneText(milestone.key);
  const external = milestone.link.startsWith('http');
  return (
    <div className={styles.card} role="status">
      <button type="button" className={styles.cardClose} onClick={onDismiss} aria-label={translate({ id: 'medusa.card.close', message: 'Dismiss' })}>
        ×
      </button>
      <div className={styles.cardDate}>{milestone.date}</div>
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
