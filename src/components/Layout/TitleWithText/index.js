import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";
import { parseTextWithLinks } from "@site/src/utils/textUtils";

//
// This component shows a simple header with some text below.
// title, text, and slight text are optional

export default function TitleWithText({
  title,
  description,
  titleType,
  headingDot,
  slightText,
}) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  // Use titleType to dynamically change the class for the title
  let titleClassName;

  switch (titleType) {
    case "red":
      titleClassName = styles.titleTypeRed;
      break;
    case "green":
      titleClassName = styles.titleTypeGreen;
      break;
    default:
      titleClassName = styles.titleTypeBlack;
  }

  // clsx allows for conditional className inclusion based on the headingDot flag
  return (
    <div className="container">
      {title && (
        <h1 className={clsx({ headingDot: headingDot }, titleClassName)}>
          {title}
        </h1>
      )}
      {description && (
        <p className="black-text">{parseTextWithLinks(description)}</p>
      )}
      {slightText && (
        <p className="slight-text">{parseTextWithLinks(slightText)}</p>
      )}
    </div>
  );
}
