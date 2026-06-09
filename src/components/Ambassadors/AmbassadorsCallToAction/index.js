import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { HiUsers } from "react-icons/hi";
import { FiExternalLink } from "react-icons/fi";

import styles from "./styles.module.css";

const FORUM_URL = "https://forum.cardano.org/c/ambassador-hub/141";
const JOIN_URL =
  "https://forum.cardano.org/t/cardano-ambassadors-roles-and-responsibilities/154055";

export default function AmbassadorsCallToAction() {
  return (
    <section className={styles.banner} aria-labelledby="cta-banner-title">
      <div className={styles.copy}>
        <div className={styles.iconWrap} aria-hidden="true">
          <HiUsers />
        </div>
        <div>
          <h2 id="cta-banner-title" className={styles.title}>
            {translate({
              id: "ambassadors.cta.bannerTitle",
              message: "Ready to make an impact?",
            })}
          </h2>
          <p className={styles.body}>
            {translate({
              id: "ambassadors.cta.bannerBody",
              message:
                "Help grow Cardano in your community. Start contributing on the Cardano Forum and become part of our global Ambassador Program.",
            })}
          </p>
        </div>
      </div>
      <div className={styles.actions}>
        <Link
          to={FORUM_URL}
          className={`button button--lg ${styles.primaryButton}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate({
            id: "ambassadors.cta.bannerForumLabel",
            message: "Start on the Forum",
          })}
          <FiExternalLink className={styles.buttonIcon} aria-hidden="true" />
        </Link>
        <Link
          to={JOIN_URL}
          className={`button button--lg ${styles.secondaryButton}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate({
            id: "ambassadors.cta.bannerJoinLabel",
            message: "Learn How to Join",
          })}
          <FiExternalLink className={styles.buttonIcon} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
