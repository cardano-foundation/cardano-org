import React, { useEffect } from 'react';
import clsx from "clsx";
import styles from "./styles.module.css";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import { scrollToElement } from "@site/src/utils/jsUtils";
import { getHeading } from "@site/src/utils/heading";

//
// This component:
// adds a horizontal line divider with a text
// can use a id optional to link to a specific divider with /page#id

/**
 * Labeled section divider with an optional anchor.
 *
 * @param {object} props
 * @param {string} [props.text] Label shown above the line.
 * @param {string} [props.id] Anchor id, so the section can be linked as /page#id.
 * @param {boolean} [props.white=false] White label and line for dark backgrounds.
 * @param {number} [props.headingLevel=6] Heading level of the label. The look stays the same.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function Divider({ text, id, white = false, headingLevel, className }) {
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
  const { Tag, lookClassName } = getHeading(headingLevel, 6);

  return (
    <div className={className}>
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
          <Tag className={clsx(styles.title, lookClassName)}>{text}{id && <a className="hash-link" href={`#${id}`}>&#8203;</a>}</Tag>
          <div className={styles.horizontalBar}></div>
        </div>
      </>
    )}
  </div>
  );
}
