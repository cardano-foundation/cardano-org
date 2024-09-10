import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import QuoteWithText from "@site/src/components/Layout/QuoteWithText";

export default function TextSectionWithCtaAndQuote({
  texts = [],
  quoteText,
  showButton = true,
  buttonText = "Participate",
  buttonLink = "#",
}) {
  return (
    <div className={styles.sectionWrap}>
      <div className={styles.flexBox}>
        <div className={styles.textWrap}>
          {texts.map((text, index) => (
            <p key={index}>{text}</p>
          ))}

          {showButton && (
            <div className={styles.buttonWrap}>
              <Link
                to={buttonLink}
                className={clsx(
                  "button button--primary button--lg",
                  styles.buttonLink
                )}
              >
                {buttonText}
              </Link>
            </div>
          )}
        </div>

        {quoteText && (
          <div className={styles.quoteWrap}>
            <QuoteWithText text={quoteText} quoteType={"mixed"} />
          </div>
        )}
      </div>
    </div>
  );
}