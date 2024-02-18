import clsx from 'clsx';
import React from "react";
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';

//
// This component:
// shows a (svg) logo and a title below, with some text below and
// a button. The image assumes that: 
// for every log.svg there is also a logo-dark.svg

function WalletLink({ title, imageName, text, subtext, label, link }) {
  
  return (
    <div className={styles.logoContainer}>
      <div className={styles.imageWrap}>
      <ThemedImage
        alt={label}
        sources={{
          light: useBaseUrl(`/img/wallets/${imageName}.svg`),
          dark: useBaseUrl(`/img/wallets/${imageName}.svg`), // fixme: there are no dark images available yet
        }}
      />
      </div>
      <h1 className={styles.headingDot}>
            {title}
      </h1>
      <div className={styles.textWrap}>
        <p className={styles.text}>{text}</p>
        <p className={styles.subtext}>{subtext}</p>
      </div>
      <div className={styles.buttonWrap}>
        <a href={link} className={clsx('button button--primary button--lg', styles.buttonLink)}>{label}</a>
      </div>
       
    </div>
  );
}

export default WalletLink;

