import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

//
// This component shows some text with a title (optional) to the left (optional)
// and a call to action button on the right

export default function CtaTwoColumn({ title, text, buttonLabel, buttonLink }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

   const renderText = (text) => {
    // Check if text is an array
    if (Array.isArray(text)) {
      // Map each string in the array to a <p> tag
      return text.map((line, index) => <p key={index}>{line}</p>);
    } else {
      // Render a single string inside a <p> tag
      return <p>{text}</p>;
    }
  };

  return (
    <div className={clsx("container", styles.boxWrap)}>
      <div className={clsx("row", styles.row)}>
        <div className={clsx("col col--6", styles.leftColumn)}>
          {title && <h1>{title}</h1>}
         {text && renderText(text)}
        </div>
        <div className={clsx("col col--6", styles.rightColumn)}>
          <Link
            className={clsx(
              "button button--primary button--lg",
              styles.buttonWhite
            )}
            to={buttonLink}
          >
            {buttonLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
