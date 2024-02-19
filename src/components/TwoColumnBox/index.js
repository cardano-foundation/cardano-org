import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";  

//
// This component shows text in two columns, it collapses into one
 
function TwoColumnBox({ leftText, rightText }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <div className={clsx('container', styles.boxWrap)}>
      <div className={clsx('row', styles.row)}> 
        <div className={clsx('col col--6', styles.leftColumn)}>
           {leftText}
        </div>
        <div className={clsx('col col--6', styles.rightColumn)}>
           {rightText}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnBox;