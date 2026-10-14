import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

/**
 * Full-width call to action band with a title, a description, and one or two buttons.
 *
 * @param {object} props
 * @param {string} props.title Heading of the band.
 * @param {string} props.description Text below the heading.
 * @param {string} props.href Target of the main button.
 * @param {string} props.buttonText Label of the main button.
 * @param {{ href: string, label: string }} [props.secondaryButton] Optional outline button next to the main one.
 * @param {"secondary"|"primary"} [props.variant="secondary"] Neutral band with grey buttons, or a band with brand blue buttons.
 */
export default function PageCTA({
  title,
  description,
  href,
  buttonText,
  secondaryButton = null,
  variant = "secondary",
}) {
  const isPrimary = variant === "primary";
  return (
    <section className={clsx(styles.cta, isPrimary && styles.ctaPrimary)}>
      <div className="container">
        <div className={styles.inner}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
          <div className={styles.buttonRow}>
            <Link
              className={clsx(
                "button button--lg",
                isPrimary ? "button--primary" : "button--secondary",
                styles.button
              )}
              to={href}
            >
              {buttonText}
            </Link>
            {secondaryButton && (
              <Link
                className={clsx(
                  "button button--lg button--outline",
                  isPrimary ? "button--primary" : "button--secondary",
                  styles.button
                )}
                to={secondaryButton.href}
              >
                {secondaryButton.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
