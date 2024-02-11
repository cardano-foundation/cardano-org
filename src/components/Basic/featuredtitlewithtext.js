import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
//import styles from "./component-name.module.css"; // in case you need local css for this component
//import { makeStyles, Typography, Box } from '@material-ui/core'; // in case you need some material-ui

//
// This component:
// shows a header on the left, with with some text on the right,
// a tagline below and a call to action button below the tagline

function FeaturedTitleWithText({ title, description, quote, buttonLabel, buttonLink }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  //const classes = useStyles();

  return (
    <div className="container">
      <h2 className="black-text">
      {title}
      </h2>
      <p className="black-text">
      {description}
      </p>
      <h4 className="red-text">
      {quote}
      </h4>
      <Link className="button button--primary" to={buttonLink}>
      {buttonLabel}
    </Link>
    </div> 
  );
};

export default FeaturedTitleWithText;