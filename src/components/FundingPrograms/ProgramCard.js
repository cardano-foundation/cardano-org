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

// The Details button is the Modal's own trigger, so focus returns to it when
// the dialog closes.
export default function ProgramCard({ program }) {
  const status = useFundingStatus(program);
  const facts = [program.audience, program.funding].filter(Boolean);
  return (
    <article id={`program-${program.key}`} className={styles.card}>
      <div className={styles.cardHeader}>
        <ProgramLogo program={program} />
        <h4 className={styles.cardName}>{program.name}</h4>
      </div>
      <div className={styles.cardTags}>
        <StatusPill tone={status.tone} label={status.label} className={styles.tagStatus} />
        {FundingTypes[program.type] && <span className={styles.tag}>{FundingTypes[program.type]}</span>}
      </div>
      <p className={styles.cardTagline}>{program.tagline}</p>
      <ul className={styles.cardFacts}>
        {facts.map((fact, index) => (
          <li key={index} className={styles.cardFact}>
            <span className={styles.factIcon} aria-hidden="true">
              <FaCheck />
            </span>
            {fact}
          </li>
        ))}
      </ul>
      <Modal
        label={program.name}
        buttonText={translate({ id: "funding.card.details", message: "Details" })}
        buttonClassName={clsx("button button--outline button--primary", styles.cardButton)}
      >
        <ProgramDetails program={program} />
      </Modal>
    </article>
  );
}
