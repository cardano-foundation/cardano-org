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
// fixme: tell what this component does


const WhatIsAda = ({ headline, title, description, quote, buttonLabel, buttonLink }) => {

  const imageUrl = useBaseUrl(`/img/ada-round.jpeg`);

  return (
    <div className="container">
      <div className={styles.header}>
        <h6>{headline}</h6>
        <div className={styles.horizontalBar}></div>
      </div>

    <div className="row">
      <div className={clsx('col col--6', styles.leftColumn)}>
      <div className={clsx(styles.adaRoundWrap, styles.mobileNoViz)}>
        <img src={imageUrl} alt={title} />  
      </div>
      <h4 className={clsx('red-text', styles.mobileNoViz)}>
          {quote}
      </h4>
        
      </div>
      <div className={clsx('col col--6', styles.rightColumn)}>
        <h3 className={clsx('black-text', styles.headingDot)}>
          {title}
        </h3>

      <p className="black-text">
          {description}
        </p>
        
        <p>
          <Link className="button button--primary button--lg" to='/stake-pool-delegation'>
          Delegate your stake
          </Link>
        </p>
        
        <p>
          <Link className="button button--primary button--lg" to='/stake-pool-operation'>
          Operate a stake pool
          </Link>
        </p>
      </div>
    </div> 
  </div> 
  );
};

export default WhatIsAda;