import React from "react";
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
//
// Governance: Proposals
// FIXME: it's questionable if CIP was meant to be here
// FIXME: Funding Proposal seems to talk about Catalyst, consider in the future to talk about treasury withdraw proposal

export default function GovernanceWithinCardanoSection({}) {

  return (
    <div className={styles.sectionWrap}>
      <Divider text="Proposals" white= {true}/>
      <div className={styles.flexBox}>
        <div className={styles.leftTextWrap}>
          <h2>Funding Proposal (FP)</h2>
          <p>
            A formal request or proposal to build something that is not yet
            covered by the Cardano protocol.
          </p>
        </div>

        <div className={styles.rightTextWrap}>
          <h2>Cardano Improvement Proposal (CIP)</h2>
          <p>
            A formally structured proposal touching the Cardano Ecosystem. CIPs
            are publicly visible to the community for discussion, and are
            located in the Cardano Foundation GitHub CIP repository.
          </p>
        </div>
      </div>
    </div>
  );
}
