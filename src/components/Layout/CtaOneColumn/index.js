import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { getHeading } from "@site/src/utils/heading";

//
// This component shows some text with a title (optional)
// and a call to action button below

/**
 * Centered call to action with optional title and text and a white button.
 *
 * @param {object} props
 * @param {string} [props.title] Heading text.
 * @param {string} [props.text] Text below the heading.
 * @param {string} props.buttonLabel Button label.
 * @param {string} props.buttonLink Button target.
 * @param {number} [props.headingLevel=1] Heading level of the title. The look stays the same.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function CtaOneColumn({ title, text, buttonLabel, buttonLink, headingLevel, className }) {
  const { Tag, lookClassName } = getHeading(headingLevel, 1);

  return (
    <div className={clsx(styles.boxWrap, className)}>
      <div className={styles.upperRow}>
        {title && <Tag className={lookClassName}>{title}</Tag>}
        {text && <p>{text}</p>}
      </div>
      <div className={styles.lowerRow}>
        <Link
          className={clsx(
            "button button--primary button--lg",
            styles.buttonWhite
          )}
          to={buttonLink}
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}
