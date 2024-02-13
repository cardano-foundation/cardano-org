import React from "react";
import clsx from "clsx";
import styles from './styles.module.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Divider from '@site/src/components/Divider';

//
// This component:
// Divider with headline
// Image of Ada Lovelace on wide screen
// Title on the right with red dot
// Below some text


const WhatIsAda = ({ headline, title, description, quote, buttonLabel, buttonLink }) => {

  const imageUrl = useBaseUrl(`/img/ada-round.jpeg`);

  return (
    <div className="container">
      <Divider headline={headline} />

    <div className="row">
      <div className={clsx('col col--6', styles.leftColumn)}>
      <div className={clsx(styles.adaRoundWrap, styles.mobileNotVisible)}>
        <img src={imageUrl} alt={title} />  
      </div>
      <h4 className={clsx('red-text', styles.mobileNotVisible)}>
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