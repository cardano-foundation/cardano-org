import React from "react";
import styles from "./styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
//import styles from "./component-name.module.css"; // in case you need local css for this component
//import { makeStyles, Typography, Box } from '@material-ui/core'; // in case you need some material-ui

//
// This component:
// shows a Cardano logo on the left, with with some text on the right,
// below a quote symbol
// and another text (aka quote)

export default function QuoteBox({ description, quote }) {

  const imageUrl = useBaseUrl(`/img/cardano-white.svg`);

  return (
    <div className={styles.quoteBoxWrap}>
      <div className={styles.quoteBox}>
        <div className={styles.textContainer}>
          <div className={styles.imageWrap}>
            <img src={imageUrl} alt="Cardano Logo" />
          </div>
          <div className={styles.description}>{description}</div>
        </div>
        <div className={styles.quote}>{quote}</div>
      </div>
    </div>
  );
}
