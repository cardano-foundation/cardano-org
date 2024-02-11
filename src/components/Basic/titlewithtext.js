import React from "react";
import clsx from "clsx";
//import styles from "./sitehero.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
//import { makeStyles, Typography, Box } from '@material-ui/core';



{/*}
  // fixme: better with css I assume
import backgroundGraphic from '/static/img/hero-header-dots.webp';



const useStyles = makeStyles((theme) => ({
  header: {
    // Add your styles for the header
  },
  text: {
    // Add your styles for the text
    position: 'relative', // For the background graphic
    marginLeft: theme.spacing(4), // Adjust the spacing as needed
    paddingLeft: theme.spacing(10), // Padding to prevent text overlay on the graphic
    background: `url(${backgroundGraphic}) no-repeat left center`,
    backgroundSize: 'contain', // Ensure the graphic scales properly
  },
}));
*/}

function TitleWithText({ title, description }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  //const classes = useStyles();

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