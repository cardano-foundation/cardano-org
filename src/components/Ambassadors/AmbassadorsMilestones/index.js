import React from "react";
import { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";

import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import impactData from "@site/src/data/ambassadorsImpact.json";
import styles from "./styles.module.css";

export default function AmbassadorsMilestones() {
  const creditPrefix = translate({
    id: "ambassadors.milestones.creditPrefix",
    message: "Led by",
  });

  return (
    <section>
      <Divider
        text={translate({ id: "ambassadors.milestones.divider", message: "Top Achievements" })}
        id="milestones"
      />
      <TitleWithText
        title={translate({
          id: "ambassadors.milestones.title",
          message: "Top achievements led by Ambassadors",
        })}
        description={[
          translate({
            id: "ambassadors.milestones.description",
            message:
              "Concrete wins from the program. Partnerships, integrations and events delivered by named ambassadors and ambassador groups.",
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
            {m.creditDefault && (
              <p className={styles.credit}>
                {creditPrefix}{" "}
                <span className={styles.creditName}>
                  {translate({
                    id: `ambassadors.milestone.${m.id}.credit`,
                    message: m.creditDefault,
                  })}
                </span>
              </p>
            )}
            {m.link && (
              <Link
                className={styles.link}
                to={m.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {translate({
                  id: `ambassadors.milestone.${m.id}.linkLabel`,
                  message: m.linkLabelDefault || "Source",
                })}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
