import React from "react";
import { translate } from "@docusaurus/Translate";

import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import impactData from "@site/src/data/ambassadorsImpact.json";
import styles from "./styles.module.css";

export default function AmbassadorsMilestones() {
  return (
    <section>
      <Divider
        text={translate({ id: "ambassadors.milestones.divider", message: "Program Milestones" })}
        id="milestones"
      />
      <TitleWithText
        title={translate({
          id: "ambassadors.milestones.title",
          message: "The evolution of the Cardano Ambassador Program",
        })}
        description={[
          translate({
            id: "ambassadors.milestones.description",
            message:
              "From a 2018 initiative to a global network with measurable impact across continents.",
          }),
        ]}
        titleType="black"
        headingDot={true}
      />

      <ol className={styles.timeline}>
        {impactData.milestones.map((m) => (
          <li key={m.id} className={styles.step}>
            <div className={styles.dot} />
            <div className={styles.year}>{m.year}</div>
            <h3 className={styles.stepTitle}>
              {translate({ id: `ambassadors.milestone.${m.id}.title`, message: m.titleDefault })}
            </h3>
            <p className={styles.stepBody}>
              {translate({ id: `ambassadors.milestone.${m.id}.body`, message: m.bodyDefault })}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
