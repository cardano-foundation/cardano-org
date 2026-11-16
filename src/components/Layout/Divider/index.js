import React from 'react';
import clsx from "clsx";
import styles from "./styles.module.css";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import { scrollToElement } from "@site/src/utils/jsUtils";
import useHashTarget from "@site/src/utils/useHashTarget";
import { getHeading } from "@site/src/utils/heading";
import { translate } from "@docusaurus/Translate";

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
 * @param {number} [props.headingLevel=0] 0 renders the label as a small line above the section
 *   title, without heading semantics. Set 2 (or the fitting level) when the label itself names
 *   the section, for example above cards or an FAQ without their own section title.
 *   The look stays the same.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function Divider({ text, id, white = false, headingLevel, className }) {
  useHashTarget((target) => {
    if (target === id) setTimeout(() => scrollToElement(document.getElementById(id)), 100);
  });
  const headerClass = clsx(styles.header, { [styles.white]: white });
  const { Tag, lookClassName } = getHeading(headingLevel ?? 0, 6);

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
          <Tag className={clsx(styles.title, lookClassName)}>{text}{id && <a className="hash-link" href={`#${id}`} aria-label={translate({id: "theme.common.headingLinkTitle", message: "Direct link to {heading}", description: "Title for link to heading"}, {heading: text})}>&#8203;</a>}</Tag>
          <div className={styles.horizontalBar}></div>
        </div>
      </>
    )}
  </div>
  );
}
