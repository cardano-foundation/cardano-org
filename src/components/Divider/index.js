import React from "react";
import clsx from "clsx";
import styles from './styles.module.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

//
// This component:
// adds a horizontal line divider with a text


const Divider = ({ headline }) => {

  return (
    <div className="container">
      <div className={styles.header}>
        <h6>{headline}</h6>
        <div className={styles.horizontalBar}></div>
      </div>
  </div> 
  );
};

export default Divider;