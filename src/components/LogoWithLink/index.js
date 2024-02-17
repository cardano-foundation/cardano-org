import React from "react";
import clsx from "clsx";
import styles from './styles.module.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { parseTextWithLinks } from '@site/src/utils/textUtils';


//
// This component:
// shows a (svg) logo and a link below

function LogoWithLink({ imageName, label, link }) {
  
  // Construct the image URL using the imageName prop, we may want to handle image load errors in the future
  const imageUrl = useBaseUrl(`/img/logos/${imageName}.svg`);
  
  return (
    <div className={styles.logoContainer}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={label} />
      </div>
      <div className={styles.linkWrap}>
      <a href={link} className={styles.link}>{label}</a>
      </div>
      
       
    </div>
  );
}

export default LogoWithLink;

