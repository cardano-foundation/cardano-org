import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import { getHeading } from "@site/src/utils/heading";

//
// This component:
// shows a header on the left, with with some text on the right,
// a quote below and a call to action button below the tagline

/**
 * Large title on the left, text, quote, and button on the right.
 *
 * @param {object} props
 * @param {string} props.title Heading text.
 * @param {string|string[]} props.description Text, one string per paragraph.
 * @param {string} [props.quote] Highlighted quote below the text.
 * @param {string} [props.buttonLabel] Label of the optional button.
 * @param {string} [props.buttonLink] Target of the optional button.
 * @param {boolean} [props.headingDot] Shows the red dot above the title.
 * @param {number} [props.headingLevel=1] Heading level of the title. The look stays the same.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function FeaturedTitleWithText({
  title,
  description,
  quote,
  buttonLabel,
  buttonLink,
  headingDot,
  headingLevel,
  className,
}) {
  const { Tag, lookClassName } = getHeading(headingLevel, 1);

  return (
    <div className={className}>
      <div className="row">
        <div className={clsx("col col--6", styles.leftColumn)}>
          <Tag className={clsx({ headingDot: headingDot }, lookClassName)}>{title}</Tag>
        </div>
        <div className={clsx("col col--6", styles.rightColumn)}>
          {Array.isArray(description) ? (
            description.map((paragraph, index) => (
              <p key={index} className="black-text">
                {parseMarkdownLikeText(paragraph)}
              </p>
            ))
          ) : (
            <p className="black-text">{parseMarkdownLikeText(description)}</p>
          )}
          {quote && <h2 className={clsx("red-text", styles.quote)}>{quote}</h2>}
          {buttonLabel && buttonLink && (
            <Link className="button button--primary button--lg" to={buttonLink}>
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
