import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css"; 

//
// This component shows a quote and you can select some colors
 
function QuoteWithText({ text, quoteType }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  // Use quoteType to dynamically change the class for the text
  let textClassName;

  switch (quoteType) {
    case 'red':
      textClassName = styles.textTypeRed;
      break;
    case 'green':
      textClassName = styles.textTypeGreen;
      break;
    default:
      textClassName = styles.textTypeBlack;
  }

  return (
    <div className={styles.quoteWrap}>
      <p className={clsx(styles.quote, textClassName)}>
      {text}
      </p>
    </div> 
  );
};

export default QuoteWithText;