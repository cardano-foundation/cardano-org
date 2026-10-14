import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

//
// This component shows text in one column

/**
 * Full-width text block with one or more paragraphs.
 *
 * @param {object} props
 * @param {string|string[]} props.text Paragraph text, or an array with one entry per paragraph.
 */
export default function OneColumnBox({ text }) {

  return (
    <div className={styles.boxWrap}>
      <div className={clsx("row", styles.row)}>
        <div className={clsx("col col--12", styles.leftColumn)}>
          {Array.isArray(text) ? (
            text.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>{text}</p>
          )}
        </div>
      </div>
    </div>
  );
}
