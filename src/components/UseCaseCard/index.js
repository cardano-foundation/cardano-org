import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

export default function UseCaseCard({ title, summary, icon, link }) {
  const iconUrl = useBaseUrl(icon);

  const cardContent = (
    <>
      <div className={styles.iconWrapper}>
        <img src={iconUrl} alt="" className={styles.icon} aria-hidden="true" />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardSummary}>{summary}</p>
      </div>
    </>
  );

  if (link) {
    return (
      <Link to={link} className={clsx("card", styles.useCaseCard, styles.clickable)}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={clsx("card", styles.useCaseCard)}>
      {cardContent}
    </div>
  );
}
