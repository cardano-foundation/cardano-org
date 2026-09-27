import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { FaCircleInfo } from "react-icons/fa6";
import Modal from "@site/src/components/Modal";
import StatsBar from "@site/src/components/Layout/StatsBar";
import { getFundingStats } from "@site/src/data/funding";
import styles from "./styles.module.css";

const isExternal = (href) => /^https?:\/\//.test(href);

function Breakdown({ breakdown }) {
  return (
    <div className={styles.details}>
      <h2 className={styles.detailsTitle}>{breakdown.title}</h2>
      <p className={styles.detailsText}>{breakdown.intro}</p>
      <dl className={styles.breakdownList}>
        {breakdown.items.map((item) => (
          <div key={item.name} className={styles.breakdownItem}>
            <dt className={styles.detailsLabel}>{item.name}</dt>
            <dd className={styles.breakdownText}>
              {item.text}{" "}
              <Link
                to={item.source.href}
                className={styles.detailsSource}
                {...(isExternal(item.source.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.source.label}
              </Link>
            </dd>
          </div>
        ))}
      </dl>
      <p className={styles.detailsFooter}>{breakdown.reviewed}</p>
    </div>
  );
}

export default function FundingStats() {
  const items = getFundingStats().map((item) => ({
    key: item.key,
    value: item.value,
    label: item.label,
    extra: item.breakdown && (
      <Modal
        label={item.breakdown.title}
        buttonText={
          <>
            <FaCircleInfo aria-hidden="true" />
            <span className={styles.srOnly}>{translate({ id: "funding.stats.infoLabel", message: "How this is counted" })}</span>
          </>
        }
        buttonClassName={styles.infoButton}
      >
        <Breakdown breakdown={item.breakdown} />
      </Modal>
    ),
  }));
  return <StatsBar items={items} ariaLabel={translate({ id: "funding.stats.ariaLabel", message: "Funding at a glance" })} />;
}
