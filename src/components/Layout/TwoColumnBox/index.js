import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

//
// This component shows text in two columns, it collapses into one

export default function TwoColumnBox({ leftText, rightText }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <div className={styles.boxWrap}>
      <div className={clsx("row", styles.row)}>
        <div className={clsx("col col--6", styles.leftColumn)}>
          {Array.isArray(leftText) ? (
            leftText.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>{leftText}</p>
          )}
        </div>
        <div className={clsx("col col--6", styles.rightColumn)}>
          {Array.isArray(rightText) ? (
            rightText.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>{rightText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
