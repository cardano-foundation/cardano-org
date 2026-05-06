import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { GET_STARTED_STEPS, DIRECT_MINT_LINKS } from '@site/src/data/stablecoins';
import styles from './styles.module.css';

export default function GetStablecoinsSteps() {
  return (
    <div className={clsx('row', styles.row)}>
      <div className={clsx('col col--6', styles.leftCol)}>
        <h3 className={styles.colHeading}>
          {translate({
            id: 'stablecoins.getStarted.scratch.title',
            message: 'Starting from scratch?',
          })}
        </h3>
        <ol className={styles.steps}>
          {GET_STARTED_STEPS.map((step) => (
            <li key={step.n} className={styles.step}>
              <span className={styles.badge} aria-hidden="true">
                {step.n}
              </span>
              <div className={styles.stepBody}>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepText}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className={clsx('col col--6', styles.rightCol)}>
        <div className={styles.panel}>
          <h3 className={styles.colHeading}>
            {translate({
              id: 'stablecoins.getStarted.alreadyOn.title',
              message: 'Already on a blockchain ecosystem?',
            })}
          </h3>
          <p className={styles.panelLead}>
            {translate({
              id: 'stablecoins.getStarted.alreadyOn.lead',
              message: 'Bridge or buy directly.',
            })}
          </p>
          <ul className={styles.directList}>
            {DIRECT_MINT_LINKS.map((item) => (
              <li key={item.id} className={styles.directItem}>
                {item.href ? (
                  <Link to={item.href} className={styles.directTitle}>
                    {item.title}
                  </Link>
                ) : (
                  <span className={styles.directTitle}>{item.title}</span>
                )}
                <p className={styles.directBody}>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
