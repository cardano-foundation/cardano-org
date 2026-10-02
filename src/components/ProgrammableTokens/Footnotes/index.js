import React from "react";
import clsx from "clsx";
import { sourceId } from "@site/src/components/ProgrammableTokens/RichText";
import styles from "./styles.module.css";

// Numbered source list at the bottom of the /programmable-tokens page. Each
// entry has the id the in-text references ([^n] in RichText) link to; the
// title is an external link (in italics for publications), followed by its
// source.
//
// Props:
//   footnotes - FOOTNOTES from src/data/programmable-tokens.js

export default function Footnotes({ footnotes }) {
  return (
    <section className={styles.footnotes} aria-labelledby="sources-heading">
      <h2 id="sources-heading" className={styles.srOnly}>
        {footnotes.title}
      </h2>
      <ol className={styles.list}>
        {footnotes.items.map((item) => (
          <li key={item.number} id={sourceId(item.number)} className={styles.item}>
            <span className={styles.number} aria-hidden="true">
              {item.number}
            </span>
            <span className={styles.text}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(styles.title, item.italic && styles.italic)}
              >
                {item.title}
              </a>
              {item.joiner}
              {item.suffix}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
