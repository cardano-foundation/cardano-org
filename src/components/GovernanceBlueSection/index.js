import React from "react";
import clsx from "clsx";
import {translate} from '@docusaurus/Translate';
import styles from "./styles.module.css";

export default function GovernanceBlueSection({}) {

  return (
    <div className={clsx("container", styles.sectionWrapper)}>
      <h1 className={styles.title}>
        {translate({id: 'governance.blue.title', message: 'A Model To Marginalize None, And Give Power To All.'})}
      </h1>
      <p className={styles.text}>
        {translate({id: 'governance.blue.text', message: 'Cardano governance has moved from vision to reality. With a ratified constitution, active DReps, and a funded treasury, the community now directs the network\'s future. This is decentralization not as a promise, but as practice.'})}
      </p>
    </div>
  );
}
