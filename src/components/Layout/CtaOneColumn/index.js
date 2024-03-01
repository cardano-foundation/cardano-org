import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

//
// This component shows some text with a title (optional)
// and a call to action button below

export default function CtaOneColumn({ title, text, buttonLabel, buttonLink }) {

  return (
    <div className={styles.boxWrap}>
      <div className={styles.upperRow}>
        {title && <h1>{title}</h1>}
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
