import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

//
// This component:
// adds a horizontal line divider with a text
// can use a id optional to link to a specific divider with /page#id

export default function Divider({ text, id }) {
  return (
    <div>
      {id && <div id={id} />}
      <br />
      <div className="container">
        <div className={styles.header}>
          <h6>{text}</h6>
          <div className={styles.horizontalBar}></div>
        </div>
      </div>
    </div>
  );
}
