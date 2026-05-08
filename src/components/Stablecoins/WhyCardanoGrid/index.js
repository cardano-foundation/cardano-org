import React from 'react';
import { parseMarkdownLikeText } from '@site/src/utils/textUtils';
import { WHY_CARDANO_REASONS } from '@site/src/data/stablecoins';
import styles from './styles.module.css';

export default function WhyCardanoGrid() {
  return (
    <div className={styles.grid}>
      {WHY_CARDANO_REASONS.map((reason) => (
        <article key={reason.id} className={styles.card}>
          <h3 className={styles.title}>{reason.title}</h3>
          <div className={styles.body}>
            {reason.body.map((paragraph, i) => (
              <p key={i}>{parseMarkdownLikeText(paragraph)}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
