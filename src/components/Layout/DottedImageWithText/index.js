import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";

// This component:
// shows a dotted image and some text to the right, title is optional

export default function DottedImageWithText({ imageName, title, text, headingDot }) {
  // Construct the image URL using the imageName prop, we may want to handle image load errors in the future
  const imageUrl = useBaseUrl(`/img/dotted-icons/${imageName}.svg`);

  // Function to render text content
  const renderTextContent = (content) => {
    // If it's a string, render it as a paragraph
    if (typeof content === 'string') {
      return <p className="black-text">{parseMarkdownLikeText(content)}</p>;
    }

    // If it's an object and has a 'list' key, render it as a list
    if (content && typeof content === 'object' && content.list) {
      return (
        <div className={styles.textWrap}>
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
              {renderTextContent(item)}
            </React.Fragment>
          ))}
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={imageName} />
      </div>
      <div className={styles.textWrap}>
        {title && <h2 className={clsx({ headingDot: headingDot }, styles.title)}>{title}</h2>}
        {renderTextContent(text)}
      </div>
    </div>
  );
}