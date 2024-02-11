import React from "react";
import clsx from "clsx";
import styles from './styles.module.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
//import styles from "./component-name.module.css"; // in case you need local css for this component
//import { makeStyles, Typography, Box } from '@material-ui/core'; // in case you need some material-ui

//
// This component:
// shows a dotted image on the left, below solution and product
// shows a header with some description on the right

function UseCaseTextRight({ title, description, solutions, product, buttonLink }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  // const classes = useStyles();

  return (
    <div className={clsx('row', styles.container)}>
      
      <div className={clsx('col col--4', styles.imageSection)}>
        <img src={useBaseUrl('/img/dotted-icons/education.svg')} alt="Use Case" />
        <div className={styles.solutions}>Solutions</div>
        <div className={styles.solutionsContent}>{solutions}</div>
        <div className={styles.product}>Product</div>
        <div className={styles.productContent}>{product}</div>
      </div>
      
      <div className={clsx('col col--8', styles.textSection)}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <a href={buttonLink} className={clsx('button button--primary button--lg', styles.buttonLink)}>Learn more</a>
      </div>
    </div>
  );
};

export default UseCaseTextRight;