import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
//import styles from "./component-name.module.css"; // in case you need local css for this component
//import { makeStyles, Typography, Box } from '@material-ui/core'; // in case you need some material-ui

//
// This component shows a simple header with some text below
 
function TitleWithText({ title, description }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <div className="container">
      <h2 className="red-text">
      {title}
      </h2>
      <p className="black-text">
      {description}
      </p>
    </div> 
  );
};

export default TitleWithText;