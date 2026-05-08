import React from 'react';
import { parseMarkdownLikeText } from '@site/src/utils/textUtils';
import { TYPE_DEFINITIONS } from '@site/src/data/stablecoins';
import styles from './styles.module.css';

export default function ThreeTypesGrid() {
  return (
    <div className={styles.grid}>
      {TYPE_DEFINITIONS.map((type) => (
        <div key={type.id} className={styles.col}>
          <h3 className={styles.title}>{type.title}</h3>
          <p className={styles.body}>{parseMarkdownLikeText(type.body)}</p>
        </div>
      ))}
    </div>
  );
}
