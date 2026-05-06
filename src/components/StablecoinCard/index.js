import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { parseMarkdownLikeText } from '@site/src/utils/textUtils';
import styles from './styles.module.css';

const ACCENT_CLASS = {
  blue: styles.accentBlue,
  teal: styles.accentTeal,
  violet: styles.accentViolet,
  gold: styles.accentGold,
};

export default function StablecoinCard({
  name,
  logo,
  accent = 'blue',
  tags = [],
  tagline,
  body = [],
  metadata = [],
  href,
  learnMore,
}) {
  const logoUrl = useBaseUrl(logo);
  const accentClass = ACCENT_CLASS[accent] || ACCENT_CLASS.blue;

  return (
    <article className={clsx(styles.card, accentClass)}>
      <header className={styles.header}>
        <span className={styles.logoWrap} aria-hidden="true">
          <img src={logoUrl} alt="" className={styles.logo} />
        </span>
        <h3 className={styles.name}>{name}</h3>
      </header>

      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className={styles.tagSeparator} aria-hidden="true">·</span>}
              <span className={styles.tag}>{tag}</span>
            </React.Fragment>
          ))}
        </div>
      )}

      {tagline && <p className={styles.tagline}>{tagline}</p>}

      {body.length > 0 && (
        <div className={styles.body}>
          {body.map((paragraph, i) => (
            <p key={i}>{parseMarkdownLikeText(paragraph)}</p>
          ))}
        </div>
      )}

      {metadata.length > 0 && (
        <dl className={styles.metadata}>
          {metadata.map((item, i) => (
            <div key={i} className={styles.metadataRow}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {href && learnMore && (
        <Link to={href} className={styles.learnMore}>
          {learnMore} <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}
