import React, { useEffect } from 'react';
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import { scrollToElement } from "@site/src/utils/jsUtils";

//
// This component:
// adds a horizontal line divider with a text
// can use a id optional to link to a specific divider with /page#id

export default function Divider({ text, id, white = false }) {
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === `#${id}`) {
        setTimeout(() => scrollToElement(document.getElementById(id)), 100);
      }
    };

    // Execute handleHashChange initially and on hash changes
    handleHashChange(); // For the initial load
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [id]); // Dependency array ensures effect re-runs if 'id' change
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
          <h6>{text}{id && <a className="hash-link" href={`#${id}`}>&#8203;</a>}</h6>
          <div className={styles.horizontalBar}></div>
        </div>
      </>
    )}
  </div>
  );
}
