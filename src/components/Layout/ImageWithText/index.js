import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import Divider from "@site/src/components/Layout/Divider";
//
// This component:
// shows an image on one side and some text on the other side.
// text can have title, subtitle and normal text. Sides can be flipped.

export default function ImageWithText({
  imageName,
  title,
  subtitle,
  text,
  isImageRight,
  id,
}) {
  // Construct the image URL using the imageName prop, we may want to handle image load errors in the future
  const imageUrl = useBaseUrl(`/img/${imageName}`);

  return (
    <>
      <Divider id={id} />
      <div
        className={clsx(styles.discoverItemWrap, {
          [styles.flipOrder]: isImageRight,
        })}
      >
        <div className={styles.imageWrap}>
          {imageName && <img src={imageUrl} alt={imageName} />}
        </div>
        <div className={styles.textWrap}>
          {title && <h1 className="headingDot">{title}</h1>}
          {subtitle && <h2>{subtitle}</h2>}
          {text && Array.isArray(text) ? (
            text.map((paragraph, index) => (
              <p key={index}>{parseMarkdownLikeText(paragraph)}</p>
            ))
          ) : (
            <p>{parseMarkdownLikeText(text)}</p>
          )}
        </div>
      </div>
    </>
  );
}
