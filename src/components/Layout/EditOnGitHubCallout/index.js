import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { getHeading } from "@site/src/utils/heading";
import GitHubIcon from "@site/src/components/icons/GitHubIcon";
import styles from "./styles.module.css";

/**
 * Closing callout that asks readers to correct the page on GitHub: an icon
 * tile, a heading, one line of text, and a button link with the GitHub mark.
 * Pass the texts translated.
 *
 * @param {object} props
 * @param {React.ReactNode} props.title Heading, for example "Spotted something off?".
 * @param {React.ReactNode} props.description One line on why and how to help.
 * @param {string} props.href Link to the file on GitHub, opens in a new tab.
 * @param {React.ReactNode} props.buttonLabel Text of the button, for example "Edit Minswap on GitHub".
 * @param {number} [props.headingLevel=2] Heading level of the title, 0 renders a div.
 * @param {string} [props.className] Extra class on the callout.
 */
export default function EditOnGitHubCallout({ title, description, href, buttonLabel, headingLevel, className }) {
  // Only the element changes with the level, the module sets the whole look.
  const { Tag } = getHeading(headingLevel, 2);
  return (
    <aside className={clsx(styles.callout, className)}>
      <div className={styles.icon} aria-hidden>
        <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
          <path
            fill="currentColor"
            d="M12 3 2 8l10 5 10-5-10-5zm-8 9.5L12 17l8-4.5 2 1L12 19 2 13.5l2-1zm0 4L12 21l8-4.5 2 1L12 23 2 17.5l2-1z"
          />
        </svg>
      </div>
      <Tag className={styles.heading}>{title}</Tag>
      <p className={styles.copy}>{description}</p>
      <Link href={href} className={styles.button}>
        <GitHubIcon />
        {buttonLabel}
      </Link>
    </aside>
  );
}
