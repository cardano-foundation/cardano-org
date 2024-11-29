import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import Link from "@docusaurus/Link"; // Import the Link component

// This component shows a simple header with some text below.
// title, text, slight text, and an optional button

export default function TitleWithText({
  title,
  description,
  titleType,
  headingDot,
  slightText,
  buttonLabel,  
  buttonLink,   
}) {
  // Function to render description content
  const renderDescriptionContent = (content) => {
    // If it's a string, render it as a paragraph
    if (typeof content === 'string') {
      return <p className="black-text">{parseMarkdownLikeText(content)}</p>;
    }

    // If it's an object and has a 'list' key, render it as a list
    if (content && typeof content === 'object' && content.list) {
      return (
        <div className={styles.titleWithTextWrap}>
          <ul className="black-text">
            {content.list.map((item, index) => (
              <li key={index}>{parseMarkdownLikeText(item)}</li>
            ))}
          </ul>
        </div>
      );
    }

    // If it's an array, render each element according to its type
    if (Array.isArray(content)) {
      return (
        <div>
          {content.map((item, index) => (
            <React.Fragment key={index}>
              {renderDescriptionContent(item)}
            </React.Fragment>
          ))}
        </div>
      );
    }
  };

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
    <div>
      {title && (
        <h1 className={clsx({ headingDot: headingDot }, titleClassName)}>
          {title}
        </h1>
      )}
      {description && (
        <React.Fragment>
          {renderDescriptionContent(description)}
        </React.Fragment>
      )}
      {slightText && Array.isArray(slightText) && (
        <div>
          {slightText.map((text, index) => (
            <p key={index} className="slight-text">
              {parseMarkdownLikeText(text)}
            </p>
          ))}
        </div>
      )}
      {/* Render the button if both buttonLabel and buttonLink are provided */}
      {buttonLabel && buttonLink && (
        <Link className="button button--primary button--lg" to={buttonLink}>
          {buttonLabel}
        </Link>
      )}
    </div>
  );
}