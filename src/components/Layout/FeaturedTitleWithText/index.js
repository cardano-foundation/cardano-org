import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";

//
// This component:
// shows a header on the left, with with some text on the right,
// a tagline below and a call to action button below the tagline
// fixme: the background here was probably not clever, this should go in a parent component

export default function FeaturedTitleWithText({
  title,
  description,
  quote,
  buttonLabel,
  buttonLink,
  headingDot,
}) {

  return (
    <div>
      <div className="row">
        <div className={clsx("col col--6", styles.leftColumn)}>
          <h1 className={clsx({ headingDot: headingDot })}>{title}</h1>
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
          <h2 className="red-text">{quote}</h2>
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
