import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { HiPencil, HiCalendar, HiGlobeAlt, HiChatAlt2, HiArrowRight } from "react-icons/hi";
import { BsCodeSlash } from "react-icons/bs";

import Sparkline from "@site/src/components/Ambassadors/Sparkline";
import impactData from "@site/src/data/ambassadorsImpact.json";
import styles from "./styles.module.css";

const METRICS_URL = "https://cardanofoundation.org/transparency";

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
            {translate({
              id: "ambassadors.impact.title",
              message: "Measuring the global impact of Cardano Ambassadors",
            })}
          </h2>
          <p className={styles.description}>
            {translate({
              id: "ambassadors.impact.description",
              message:
                "Cardano Ambassadors create content, host events, translate, moderate channels and contribute to open source. The numbers below show the breadth of activity across the program.",
            })}
          </p>
          <Link to={METRICS_URL} className={styles.viewMetrics} target="_blank" rel="noopener noreferrer">
            {translate({ id: "ambassadors.impact.viewAll", message: "View all metrics" })}
            <HiArrowRight className={styles.viewMetricsIcon} aria-hidden="true" />
          </Link>
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
