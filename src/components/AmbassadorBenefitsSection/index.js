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
 
export default function AmbassadorBenefitsSection({
  headline,
  title,
  description,
  benefits,
  quote,
}) {
  return (
    <div>
      <Divider text={headline} />

      <div className="row">
        <div className={clsx("col col--6", styles.leftColumn)}>
          <div className={clsx(styles.ambassadorLogo, styles.mobileNotVisible)}>
            <ThemedImage
              alt="Ambassador Logo"
              sources={{
                light: useBaseUrl(`/img/logos/ambassadors.svg`),
                dark: useBaseUrl(`/img/logos/ambassadors-dark.svg`),
              }}
            />
          </div>
          <h2 className={clsx("red-text", styles.mobileNotVisible, styles.quote)}>{quote}</h2>
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

            <ul>
            {Array.isArray(benefits) ? (
              benefits.map((list, index) => (
                <li key={index} className="black-text">
                  {list}
                </li>
              ))
            ) : (
              <li className="black-text">{benefits}</li>
            )}
            </ul>
        </div>
      </div>
    </div>
  );
}
