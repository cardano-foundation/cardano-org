import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const partners = [
  { name: 'Visa', file: 'visa-logo.png' },
  { name: 'Wirex', file: 'wirex-logo.png' },
  { name: 'Draper Associates', file: 'draper-logo.png' },
];

export default function HomePartnerLogos() {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.row}>
        {partners.map(({ name, file }) => (
          <li key={file} className={styles.item}>
            <img
              src={useBaseUrl(`/img/partners/${file}`)}
              alt={`${name} logo`}
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
