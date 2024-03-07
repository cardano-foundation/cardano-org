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
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === `#${id}`) {
        // Using setTimeout to ensure the page layout has stabilized
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            const yOffset = -100; // Adjusting the scroll position
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            // Smooth scroll to the calculated position
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100); // A short delay can help ensure layout updates have taken place
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
          <h6>{text}</h6>
          <div className={styles.horizontalBar}></div>
        </div>
      </>
    )}
  </div>
  );
}
