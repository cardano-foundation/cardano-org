import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import QuoteWithText from "@site/src/components/Layout/QuoteWithText";

//
// This component shows a simple header with some text below.
// title, text, and slight text are optional

export default function GovernanceWithinCardanoSection({}) {

  return (
    <div className={styles.sectionWrap}>
      <div className={styles.flexBox}>
        <div className={styles.textWrap}>
          <p>
            Cardano is defined by its community. Its governance model shows that
            true democracy - in which individuals are incentivized to play a
            role and votes are immutably recorded - is possible. It is a way for
            token holders to decide the future of a platform, and for the
            community to dictate the use of Cardano’s treasury funds.
          </p>

          <p>
            This model and the pioneering technology that underpins it can be
            applied to any application, system, or even society. It is a
            blueprint for change that is decided by the many, as well as the
            few, and which will redistribute power, eliminating intermediaries,
            to improve the lives of all.
          </p>

          <div className={styles.buttonWrap}>
            <Link
              to="https://developers.cardano.org/docs/governance/cardano-governance/governance-model"
              className={clsx(
                "button button--primary button--lg",
                styles.buttonLink
              )}
            >
              Participate
            </Link>
          </div>
        </div>

        <div className={styles.quoteWrap}>
          <QuoteWithText
            text="Change begins with one voice. But is realized through the Compination of many."
            quoteType={"mixed"}
          />
        </div>
      </div>
    </div>
  );
}
