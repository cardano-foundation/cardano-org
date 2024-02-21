import React from "react";
import clsx from "clsx";
import styles from './styles.module.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { parseTextWithLinks } from '@site/src/utils/textUtils';


//
// This component:
// shows an image on the left and some text to the right, title, subtitle are optional

function DiscoverItem({ imageName, title, subtitle, text, isImageRight }) {
  
  // Construct the image URL using the imageName prop, we may want to handle image load errors in the future
  const imageUrl = useBaseUrl(`/img/discover/${imageName}.jpg`);
  
  return (
    <div className="container" id={imageName}>
      <div className={clsx(styles.discoverItemWrap, { [styles.flipOrder]: isImageRight })}>
        <div className={styles.imageWrap}>
          <img src={imageUrl} alt={imageName} />
        </div>
        <div className={styles.textWrap}>
          { title && (
          <h1 class="headingDot">{title}</h1>
          )}
          { subtitle && (
          <h3>{subtitle}</h3>
          )}
          { text && (
          <p>{text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscoverItem;

