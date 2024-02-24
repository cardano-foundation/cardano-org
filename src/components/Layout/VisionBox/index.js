import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

//
// This component:
// just shows a huge text
// TODO: make the color selectable

export default function VisionBox({ title }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <div className={styles.visionBoxWrap}>
      <div className={styles.visionBox}>
        <h2>
          {Array.isArray(title)
            ? title.map((item, index) => (
                <React.Fragment key={index}>
                  {item}
                  {index < title.length - 1 && <br />}
                </React.Fragment>
              ))
            : title}
        </h2>
      </div>
    </div>
  );
}
