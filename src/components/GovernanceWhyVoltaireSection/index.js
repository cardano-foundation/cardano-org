import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";


//
// This component shows a simple header with some text below.
// title, text, and slight text are optional

export default function GovernanceWhyVoltaireSection({}) {

  return (
    <div className={styles.sectionWrap}>
      <div className={styles.flexBox}>
        <div className={styles.textWrap}>
          <p>
            Decentralization begins with the technology - with Shelley - but is
            only truly achieved when no single entity is in control. The
            governing principle of decentralization is the redistribution of
            control: global networks that are defined not from the middle, but
            by every participant. This is the purpose of Voltaire.
          </p>

          <p>
            Voltaire adds the ability for the Cardano community to make
            impactful decisions about software updates, technical improvements
            and funding decisions. Known as <Link href="https://developers.cardano.org/docs/governance/cardano-governance/governance-actions/">Governance Actions</Link>, 
            these allow the future of
            Cardano to be determined by its community and funded from the
            platform's treasury.
          </p>

          <p>
            The era will also play host to a series of experiments, as we
            discuss topics such as decentralised governance, the dynamics of
            democracy and consent, evolving Voltaire from research to reality.
            If Shelley was the foundation of a globally coordinated network
            without a central authority, then Voltaire will explore the
            apparatus for shared decision making: the language of
            decentralization.
          </p>

          <div className={styles.buttonWrap}>
            <Link
              to="/research#voltaire"
              className={clsx(
                "button button--primary button--lg",
                styles.buttonLink
              )}
            >
              Read the research
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
