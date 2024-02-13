import React from "react";
import clsx from "clsx";
import styles from './styles.module.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
//import styles from "./component-name.module.css"; // in case you need local css for this component
//import { makeStyles, Typography, Box } from '@material-ui/core'; // in case you need some material-ui

//
// This component:
// shows a header on the left, with with some text on the right,
// a tagline below and a call to action button below the tagline
// fixme: the background here was probably not clever, this should go in a parent component

function FeaturedTitleWithText({ title, description, quote, buttonLabel, buttonLink }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  // const classes = useStyles();

  return (
    <div className="container">
      <div className="row">
        <div className={clsx('col col--6', styles.leftColumn)}>
          <h4 className={clsx('black-text', styles.headingDot)}>
            {title}
          </h4>
          
        </div>
        <div className={clsx('col col--6', styles.rightColumn)}>
        <p className="black-text">
            {description}
          </p>
          <h4 className="red-text">
            {quote}
          </h4>
          <Link className="button button--primary button--lg" to={buttonLink}>
            {buttonLabel}
          </Link>
        </div>
      </div> 
    </div> 
  );
};

export default FeaturedTitleWithText;