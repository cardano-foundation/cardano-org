import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";  

//
// This component shows text in one column
 
export default function OneColumnBox({ text }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <div className={clsx('container', styles.boxWrap)}>
      <div className={clsx('row', styles.row)}> 
        <div className={clsx('col col--12', styles.leftColumn)}>
           {text}
        </div>
      </div>
    </div>
  );
};