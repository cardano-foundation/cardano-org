import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { getHeading } from "@site/src/utils/heading";

//
// This component shows some text with a title (optional) to the left (optional)
// and a call to action button on the right

/**
 * Two-column call-to-action band with a title, text and button per column.
 *
 * @param {object} props
 * @param {string} [props.leftTitle] Heading of the left column.
 * @param {string|string[]} [props.leftText] Text of the left column, one paragraph per array entry.
 * @param {string} [props.leftButtonLabel] Label of the left button. No button without it.
 * @param {string} [props.leftButtonLink] Target of the left button.
 * @param {boolean} [props.leftHeadingDot] Shows the red dot above the left title.
 * @param {string} [props.leftButtonAlign] "center" centers the left button.
 * @param {string} [props.rightTitle] Heading of the right column.
 * @param {string|string[]} [props.rightText] Text of the right column, one paragraph per array entry.
 * @param {string} [props.rightButtonLabel] Label of the right button. No button without it.
 * @param {string} [props.rightButtonLink] Target of the right button.
 * @param {boolean} [props.rightHeadingDot] Shows the red dot above the right title.
 * @param {string} [props.rightButtonAlign] "center" centers the right button.
 * @param {number} [props.headingLevel=1] Heading level of both titles. The look stays the same.
 * @param {string} [props.className] Extra class on the wrapper.
 */
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
  headingLevel, // heading level of both titles, default 1, the look stays the same
  className,
}) {
  const { Tag, lookClassName } = getHeading(headingLevel, 1);

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
    <div className={clsx(styles.boxWrap, className)}>
      <div className={clsx("row", styles.row)}>
        {/* Adjust the col class based on whether the right column has content */}
        <div className={clsx("col", hasRightContent ? "col--6" : "col--7", styles.leftColumn)}>
          {leftTitle && (
            <Tag className={clsx({ headingDot: leftHeadingDot }, lookClassName)}>
              {leftTitle}
            </Tag>
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
            <Tag className={clsx({ headingDot: rightHeadingDot }, lookClassName)}>
              {rightTitle}
            </Tag>
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
