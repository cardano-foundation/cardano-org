import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";

//
// This component:
// shows a dotted image and some text to the right, title is optional

export default function DottedImageWithText({ imageName, title, text, headingDot }) {
  // Construct the image URL using the imageName prop, we may want to handle image load errors in the future
  const imageUrl = useBaseUrl(`/img/dotted-icons/${imageName}.svg`);

  // Function to render text. Checks if text is an array and renders accordingly
  const renderText = (content) => {
    // If content is an array, map through it and return paragraphs
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <p key={index}>{parseMarkdownLikeText(item)}</p>
      ));
    }
    // If content is not an array, simply return a single paragraph
    return <p>{parseMarkdownLikeText(content)}</p>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={imageName} />
      </div>
      <div className={styles.textWrap}>
        {title && <h2 className={clsx({ headingDot: headingDot }, styles.title)}>{title}</h2>}
        {renderText(text)}
      </div>
    </div>
  );
}


