import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { parseTextWithLinks } from "@site/src/utils/textUtils";

//
// This component:
// shows a dotted image and some text to the right, title is optional

export default function DottedImageWithText({ imageName, title, text }) {
  // Construct the image URL using the imageName prop, we may want to handle image load errors in the future
  const imageUrl = useBaseUrl(`/img/dotted-icons/${imageName}.svg`);

  return (
    <div className={styles.container}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={imageName} />
      </div>
      <div className={styles.textWrap}>
        {title && <h2>{title}</h2>}
        <p>{text}</p>
      </div>
    </div>
  );
}
