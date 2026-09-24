import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { FaCircleInfo } from "react-icons/fa6";
import Modal from "@site/src/components/Modal";
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

function Figure({ item }) {
  return (
    <div className={styles.figure}>
      <span className={styles.figureValue}>
        {item.value}
        {item.breakdown && (
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
        )}
      </span>
      <span className={styles.figureLabel}>{item.label}</span>
    </div>
  );
}

export default function FundingStats() {
  return (
    <div className={styles.bar} role="group" aria-label={translate({ id: "funding.stats.ariaLabel", message: "Funding at a glance" })}>
      {getFundingStats().map((item, index) => (
        <React.Fragment key={item.key}>
          {index > 0 && <span className={styles.barDivider} aria-hidden="true" />}
          <Figure item={item} />
        </React.Fragment>
      ))}
    </div>
  );
}
