import clsx from "clsx";
import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";

//
// This component:
// shows a (svg) logo and a title below, with some text below and
// a button. The image assumes that:
// for every log.svg there is also a logo-dark.svg

export default function WalletLink({
  title,
  imageName,
  text,
  subtext,
  label,
  link,
}) {
  return (
    <div className={styles.logoContainer}>
      {imageName && (
        <div className={styles.imageWrap}>
          <ThemedImage
            alt={label}
            sources={{
              light: useBaseUrl(`/img/wallets/${imageName}.svg`),
              dark: useBaseUrl(`/img/wallets/${imageName}.svg`), // fixme: there are no dark images available yet
            }}
          />
        </div>
      )}
      <h1 className="headingDot">{title}</h1>
      <div className={styles.textWrap}>
        <p className={styles.text}>{parseMarkdownLikeText(text)}</p>
        <p className="slight-text">{subtext}</p>
      </div>
      <div className={styles.buttonWrap}>
        <Link
          href={link}
          className={clsx(
            "button button--primary button--lg",
            styles.buttonLink
          )}
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
