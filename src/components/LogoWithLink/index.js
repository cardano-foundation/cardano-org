import React from "react";
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import Link from "@docusaurus/Link";

//
// This component:
// shows a (svg) logo and a link below, it assumes that: 
// for every log.svg there is also a logo-dark.svg

function LogoWithLink({ imageName, label, link }) {
  
  return (
    <div className={styles.logoContainer}>
      <div className={styles.imageWrap}>
      <ThemedImage
        alt={label}
        sources={{
          light: useBaseUrl(`/img/logos/${imageName}.svg`),
          dark: useBaseUrl(`/img/logos/${imageName}-dark.svg`),
        }}
      />
      </div>
      <div className={styles.linkWrap}>
      <Link to={link} className={styles.link}>{label}</Link>
      </div>
      
       
    </div>
  );
}

export default LogoWithLink;

