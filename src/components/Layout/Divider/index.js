import React, { useEffect } from 'react';
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import SpacerBox from "@site/src/components/Layout/SpacerBox";

//
// This component:
// adds a horizontal line divider with a text
// can use a id optional to link to a specific divider with /page#id

export default function Divider({ text, id, white = false }) {
  // This effect runs once after the initial render
  useEffect(() => {
    // Check if the URL's hash matches this divider's ID
    if (window.location.hash === `#${id}`) {
      // Use setTimeout to allow the page to render and layout changes to complete
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView();
      }, 100);  
    }
  }, [id]); // Effect dependencies, re-run if id changes

  const headerClass = clsx(styles.header, { [styles.white]: white });

  return (
    <div>
    {id && (
      <>
        <div id={id} />
        <SpacerBox size="small" />
      </>
    )}
    {text && (
      <>
        <br />
        <div className={headerClass}>
          <h6>{text}</h6>
          <div className={styles.horizontalBar}></div>
        </div>
      </>
    )}
  </div>
  );
}
