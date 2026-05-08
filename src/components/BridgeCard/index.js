import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { parseMarkdownLikeText } from '@site/src/utils/textUtils';
import styles from './styles.module.css';

export default function BridgeCard({ name, logo, body, href }) {
  const logoUrl = useBaseUrl(logo);

  const inner = (
    <>
      <header className={styles.header}>
        <span className={styles.logoWrap} aria-hidden="true">
          <img src={logoUrl} alt="" className={styles.logo} />
        </span>
        <h3 className={styles.name}>{name}</h3>
      </header>
      <p className={styles.body}>{parseMarkdownLikeText(body)}</p>
    </>
  );

  if (href) {
    return (
      <Link to={href} className={clsx(styles.card, styles.linkCard)}>
        {inner}
      </Link>
    );
  }

  return <article className={styles.card}>{inner}</article>;
}
