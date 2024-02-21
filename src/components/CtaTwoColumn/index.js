import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";  

//
// This component shows some text with a title (optional) to the left (optional)
// and a call to action button on the right
 
function CtaTwoColumn({ title, text, buttonLabel, buttonLink }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <div className={clsx('container', styles.boxWrap)}>
      <div className={clsx('row', styles.row)}> 
        <div className={clsx('col col--6', styles.leftColumn)}>
          { title && ( 
            <h1>{title}</h1>
          )}
          { text && ( 
            <p>{text}</p>
          )}
        </div>
        <div className={clsx('col col--6', styles.rightColumn)}>
        <Link className={clsx("button button--primary button--lg", styles.buttonWhite)} to={buttonLink}>
          {buttonLabel}
        </Link>
        
        </div>
      </div>
    </div>
  );
};

export default CtaTwoColumn;