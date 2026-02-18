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
        {translate({id: 'governance.blue.text', message: 'Our current systems do not work for everyone. A better, more positive future is possible. If the world is to serve the many, it must be agreed to by the many. Consensus must drive progress and where disagreement occurs, it must drive creative solutions.'})}
      </p>
    </div>
  );
}
