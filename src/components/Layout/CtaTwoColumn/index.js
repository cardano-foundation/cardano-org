import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

//
// This component shows some text with a title (optional) to the left (optional)
// and a call to action button on the right

export default function CtaTwoColumn({
  leftTitle,
  leftText,
  leftButtonLabel,
  leftButtonLink,
  leftHeadingDot,
  rightTitle,
  rightText,
  rightButtonLabel,
  rightButtonLink,
  rightHeadingDot,
}) {
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
    <div className={styles.boxWrap}>
      <div className={clsx("row", styles.row)}>
        <div className={clsx("col col--6", styles.leftColumn)}>
          {leftTitle && <h1 className={clsx({ 'headingDot': leftHeadingDot })}>{leftTitle}</h1>}
          {leftText && renderText(leftText)}
          {leftButtonLabel && (
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.buttonWhite
              )}
              to={leftButtonLink}
            >
              {leftButtonLabel}
            </Link>
          )}
        </div>
        <div className={clsx("col col--6", styles.rightColumn)}>
          {rightTitle && <h1 className={clsx({ 'headingDot': rightHeadingDot })}>{rightTitle}</h1>}
          {rightText && renderText(rightText)}
          {rightButtonLabel && (
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.buttonWhite
              )}
              to={rightButtonLink}
            >
              {rightButtonLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
