import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css"; 

//
// This component shows a quote and you can select some colors via quoteType
// Particularly worth mentioning here is quoteType = 'mixed' which puts the first
// sentence in red and the rest of the quote in green as used in Cardano 2020 page
 
function QuoteWithText({ text, quoteType }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  // Split the text into sentences for textTypeMixed
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];

  // We render differently if it's a mixed quote type and
  // if we have different sentences at all
  if (quoteType == 'mixed' && sentences.length > 0 ) {
    const firstSentence = sentences.shift(); // The first sentence
    const restOfText = sentences.join(' '); // The rest of the quote
    return (
      <div className={styles.quoteWrap}>
        <p className={clsx(styles.quote)}>
          <span className={styles.quoteTypeRed}>{firstSentence}</span>
          <span className={styles.quoteTypeGreen}>{restOfText}</span>
        </p>
      </div> 
    );
  }

  // Use quoteType to dynamically change the class for the text
  let textClassName;

  switch (quoteType) {
    case 'red':
      textClassName = styles.quoteTypeRed;
      break;
    case 'green':
      textClassName = styles.quoteTypeGreen;
      break;
    default:
      textClassName = styles.quoteTypeBlack;
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