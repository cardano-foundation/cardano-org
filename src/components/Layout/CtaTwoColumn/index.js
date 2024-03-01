import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
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
  leftButtonAlign, // 'center' for centering the button, undefined or any other value keeps default alignment
  rightTitle,
  rightText,
  rightButtonLabel,
  rightButtonLink,
  rightHeadingDot,
  rightButtonAlign, // 'center' for centering the button, undefined or any other value keeps default alignment
}) {

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

  // Determine if the right column has text content
  const hasRightContent = rightTitle || rightText;

  // Inline style for centering button
  const centerButtonStyle = { margin: '0 auto', display: 'block' };

  return (
    <div className={styles.boxWrap}>
      <div className={clsx("row", styles.row)}>
        {/* Adjust the col class based on whether the right column has content */}
        <div className={clsx("col", hasRightContent ? "col--6" : "col--7", styles.leftColumn)}>
          {leftTitle && (
            <h1 className={clsx({ headingDot: leftHeadingDot })}>
              {leftTitle}
            </h1>
          )}
          {leftText && renderText(leftText)}
          {leftButtonLabel && (
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.buttonWhite
              )}
              to={leftButtonLink}
              style={leftButtonAlign === "center" ? centerButtonStyle : {}}
            >
              {leftButtonLabel}
            </Link>
          )}
        </div>
       {/* Adjust the col class based on whether the right column has content */}
       <div className={clsx("col", hasRightContent ? "col--6" : "col--5", styles.leftColumn)}>
          {rightTitle && (
            <h1 className={clsx({ headingDot: rightHeadingDot })}>
              {rightTitle}
            </h1>
          )}
          {rightText && renderText(rightText)}
          {rightButtonLabel && (
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.buttonWhite
              )}
              to={rightButtonLink}
              style={rightButtonAlign === "center" ? centerButtonStyle : {}}
            >
              {rightButtonLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
