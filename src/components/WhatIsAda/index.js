import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Divider from "@site/src/components/Layout/Divider";
import ThemedImage from "@theme/ThemedImage";

//
// This component:
// Divider with headline
// Image of Ada Lovelace on wide screen
// Title on the right with red dot
// Below some text

export default function WhatIsAdaSection({
  headline,
  title,
  description,
  quote,
}) {
  return (
    <div className="container">
      <Divider text={headline} />

      <div className="row">
        <div className={clsx("col col--6", styles.leftColumn)}>
          <div className={clsx(styles.adaRoundWrap, styles.mobileNotVisible)}>
            <ThemedImage
              alt="Ada Lovelace looking to the right"
              sources={{
                light: useBaseUrl(`/img/ada-round.webp`),
                dark: useBaseUrl(`/img/ada-round-dark.webp`),
              }}
            />
          </div>
          <h2 className={clsx("red-text", styles.mobileNotVisible)}>{quote}</h2>
        </div>
        <div className={clsx("col col--6", styles.rightColumn)}>
          <h1 className={clsx("black-text", "headingDot")}>{title}</h1>

          {Array.isArray(description) ? (
            description.map((paragraph, index) => (
              <p key={index} className="black-text">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="black-text">{description}</p>
          )}

          <p>
            <Link
              className="button button--primary button--lg"
              to="/stake-pool-delegation"
            >
              Delegate your stake
            </Link>
          </p>

          <p>
            <Link
              className="button button--primary button--lg"
              to="/stake-pool-operation"
            >
              Operate a stake pool
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
