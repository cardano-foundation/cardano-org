import React from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import { FaCheck } from "react-icons/fa";
import Modal from "@site/src/components/Modal";
import StatusPill from "@site/src/components/Layout/StatusPill";
import { FundingTypes } from "@site/src/data/funding";
import ProgramDetails from "./ProgramDetails";
import ProgramLogo from "./ProgramLogo";
import useFundingStatus from "./useFundingStatus";
import styles from "./styles.module.css";

// One program: logo and name, status and type tags, tagline, one or two
// check facts, and a Details button that opens the shared Modal. The button
// is the Modal's own trigger, so focus returns to it when the dialog closes.
export default function ProgramCard({ venue }) {
  const status = useFundingStatus(venue);
  const facts = [venue.audience, venue.funding].filter(Boolean);
  return (
    <article id={`program-${venue.key}`} className={styles.card}>
      <div className={styles.cardHeader}>
        <ProgramLogo venue={venue} />
        <h4 className={styles.cardName}>{venue.name}</h4>
      </div>
      <div className={styles.cardTags}>
        <StatusPill tone={status.tone} label={status.label} className={styles.tagStatus} />
        {FundingTypes[venue.type] && <span className={styles.tag}>{FundingTypes[venue.type]}</span>}
      </div>
      <p className={styles.cardTagline}>{venue.tagline}</p>
      <ul className={styles.cardFacts}>
        {facts.map((fact, index) => (
          <li key={`${venue.key}-${index}`} className={styles.cardFact}>
            <span className={styles.factIcon} aria-hidden="true">
              <FaCheck />
            </span>
            {fact}
          </li>
        ))}
      </ul>
      <Modal
        label={typeof venue.name === "string" ? venue.name : translate({ id: "funding.card.dialogLabel", message: "Program" })}
        buttonText={translate({ id: "funding.card.details", message: "Details" })}
        buttonClassName={clsx("button button--outline button--primary", styles.cardButton)}
      >
        <ProgramDetails venue={venue} />
      </Modal>
    </article>
  );
}
