import React from "react";
import { translate } from "@docusaurus/Translate";
import { HiPencil, HiCalendar, HiGlobeAlt, HiChatAlt2 } from "react-icons/hi";
import { BsCodeSlash } from "react-icons/bs";

import Sparkline from "@site/src/components/Ambassadors/Sparkline";
import impactData from "@site/src/data/ambassadorsImpact.json";
import styles from "./styles.module.css";

const ICONS = {
  content: <HiPencil />,
  events: <HiCalendar />,
  translations: <HiGlobeAlt />,
  channels: <HiChatAlt2 />,
  openSource: <BsCodeSlash />,
};

const ACCENTS = {
  content: "blue",
  events: "green",
  translations: "amber",
  channels: "violet",
  openSource: "teal",
};

function ImpactCard({ entry }) {
  const accent = ACCENTS[entry.id] || "blue";
  const labelTranslated = translate(
    { id: `ambassadors.impact.${entry.id}.label`, message: entry.labelDefault },
  );
  const captionTranslated = translate(
    { id: `ambassadors.impact.${entry.id}.caption`, message: entry.captionDefault },
  );
  return (
    <div className={`${styles.card} ${styles[`accent-${accent}`]}`}>
      <span className={styles.icon} aria-hidden="true">{ICONS[entry.id]}</span>
      <div className={styles.label}>{labelTranslated}</div>
      <div className={styles.value}>{entry.value}</div>
      <div className={styles.caption}>{captionTranslated}</div>
      <div className={styles.sparkWrap}>
        <Sparkline data={entry.trend} ariaLabel={labelTranslated} />
      </div>
    </div>
  );
}

export default function AmbassadorsImpactOverview() {
  return (
    <section id="impact">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <h2 className={styles.title}>
            {translate({ id: "ambassadors.impact.title", message: "Impact Overview" })}
          </h2>
          <p className={styles.description}>
            {translate({
              id: "ambassadors.impact.description",
              message: "Measuring the global impact of Cardano Ambassadors.",
            })}
          </p>
        </div>
        <div className={styles.grid}>
          {impactData.impact.map((entry) => (
            <ImpactCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
