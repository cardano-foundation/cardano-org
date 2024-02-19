import React from "react";
import clsx from "clsx";
import styles from './styles.module.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

//
// This component:
// wrap components in a background wrapper


export default function BackgroundWrapper({ children, backgroundType }) {

  // Use backgroundType to dynamically change the class for the background
  let wrapperClassName;

  switch (backgroundType) {
    case 'solid':
      wrapperClassName = styles.backgroundSolid;
      break;
    case 'zoom':
      wrapperClassName = styles.backgroundZoom;
      break;
    case 'gradient':
      wrapperClassName = styles.backgroundGradient;
      break;  
    default:
      wrapperClassName = styles.backgroundNone;
  }

  return (
    <div className={wrapperClassName}>
      {children}
    </div>
  );
}
 