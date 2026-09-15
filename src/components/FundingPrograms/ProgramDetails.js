import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import StatusPill from "@site/src/components/Layout/StatusPill";
import { FundingTypes, defaultLinkLabel } from "@site/src/data/funding";
import ProgramLogo from "./ProgramLogo";
import useFundingStatus from "./useFundingStatus";
import styles from "./styles.module.css";

// Body of the program modal: what the program is, who runs it, and the way
// in. Everything else lives on the official page the button leads to.
export default function ProgramDetails({ venue }) {
  const status = useFundingStatus(venue);
  return (
    <div className={styles.details}>
      <div className={styles.detailsHeader}>
        <ProgramLogo venue={venue} size="dialog" />
        <div className={styles.detailsHeaderText}>
          <div className={styles.detailsPills}>
            <StatusPill tone={status.tone} label={status.label} />
            {FundingTypes[venue.type] && <StatusPill tone="neutral" label={FundingTypes[venue.type]} />}
          </div>
          <h2 className={styles.detailsTitle}>{venue.name}</h2>
        </div>
      </div>
      <p className={styles.detailsRunBy}>
        <span className={styles.detailsLabel}>{translate({ id: "funding.details.runBy", message: "Run by" })}</span> {venue.runBy}
      </p>
      <p className={styles.detailsText}>{venue.description}</p>
      {venue.link && (
        <div className={styles.detailsActions}>
          <Link to={venue.link.href} className="button button--primary" target="_blank" rel="noopener noreferrer">
            {venue.link.label || defaultLinkLabel()}
          </Link>
        </div>
      )}
    </div>
  );
}
