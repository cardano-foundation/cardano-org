import React from "react";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

export default function openStickyButton() {
  return (
    <a href="/docs/get-involved/add-app">
      <button className={`${styles.iconBtn} ${styles.addBtn}`}>
        <div className={styles.addIcon}></div>
        <div className={styles.btnText}>
          <span className={styles.btnSpan}>{translate({id: 'apps.stickyButton', message: 'ADD YOUR APP'})}</span>
        </div>
      </button>
    </a>
  );
}
