import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import StatusPill from "@site/src/components/Layout/StatusPill";
import { FundingTypes, defaultLinkLabel } from "@site/src/data/funding";
import ProgramLogo from "./ProgramLogo";
import useFundingStatus from "./useFundingStatus";
import styles from "./styles.module.css";

// Modal body: who runs the program, what it is, and the way in.
export default function ProgramDetails({ program }) {
  const status = useFundingStatus(program);
  return (
    <div className={styles.details}>
      <div className={styles.detailsHeader}>
        <ProgramLogo program={program} size="dialog" />
        <div className={styles.detailsHeaderText}>
          <div className={styles.detailsPills}>
            <StatusPill tone={status.tone} label={status.label} />
            {FundingTypes[program.type] && <StatusPill tone="neutral" label={FundingTypes[program.type]} />}
          </div>
          <h2 className={styles.detailsTitle}>{program.name}</h2>
        </div>
      </div>
      <p className={styles.detailsRunBy}>
        <span className={styles.detailsLabel}>{translate({ id: "funding.details.runBy", message: "Run by" })}</span> {program.runBy}
      </p>
      <p className={styles.detailsText}>{program.description}</p>
      {program.link && (
        <div className={styles.detailsActions}>
          <Link to={program.link.href} className="button button--primary" target="_blank" rel="noopener noreferrer">
            {program.link.label || defaultLinkLabel()}
          </Link>
        </div>
      )}
    </div>
  );
}
