import React from "react";
import { translate } from "@docusaurus/Translate";
import { HiPencil, HiCalendar } from "react-icons/hi";
import { MdSchool } from "react-icons/md";
import { BsCodeSlash } from "react-icons/bs";

import impactData from "@site/src/data/ambassadorsImpact.json";
import styles from "./styles.module.css";

const CATEGORIES = [
  {
    key: "content",
    icon: <HiPencil />,
    accent: "blue",
    labelDefault: "Content created",
    captionDefault: "Articles, videos, podcasts and threads",
  },
  {
    key: "education",
    icon: <MdSchool />,
    accent: "violet",
    labelDefault: "Education",
    captionDefault: "Teaching, onboarding and awareness",
  },
  {
    key: "meetups",
    icon: <HiCalendar />,
    accent: "green",
    labelDefault: "Events hosted",
    captionDefault: "Meetups, workshops and hackathons",
  },
  {
    key: "developerSoftware",
    icon: <BsCodeSlash />,
    accent: "amber",
    labelDefault: "Open source",
    captionDefault: "Projects, tools and code contributions",
  },
];

function ImpactCard({ category, value }) {
  const labelTranslated = translate(
    { id: `ambassadors.impact.${category.key}.label`, message: category.labelDefault },
  );
  const captionTranslated = translate(
    { id: `ambassadors.impact.${category.key}.caption`, message: category.captionDefault },
  );
  return (
    <div className={`${styles.card} ${styles[`accent-${category.accent}`]}`}>
      <span className={styles.icon} aria-hidden="true">{category.icon}</span>
      <div className={styles.label}>{labelTranslated}</div>
      <div className={styles.value}>{value.toLocaleString()}</div>
      <div className={styles.caption}>{captionTranslated}</div>
    </div>
  );
}

export default function AmbassadorsImpactOverview() {
  const byCategory = impactData.data.contributionsByCategory;
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
          {CATEGORIES.map((category) => (
            <ImpactCard
              key={category.key}
              category={category}
              value={byCategory[category.key] || 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
