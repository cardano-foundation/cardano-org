import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { BsPenFill, BsCodeSlash, BsShieldCheck, BsBriefcaseFill } from "react-icons/bs";
import { HiUsers, HiTranslate, HiArrowRight } from "react-icons/hi";
import { MdSchool } from "react-icons/md";

import Divider from "@site/src/components/Layout/Divider";
import styles from "./styles.module.css";

const PROGRAM_URL =
  "https://forum.cardano.org/t/cardano-ambassadors-roles-and-responsibilities/154055";

const ROLES = [
  {
    icon: <BsPenFill />,
    tone: "blue",
    titleId: "ambassadors.roles.contentCreation.title",
    titleDefault: "Content Creation",
    descId: "ambassadors.roles.contentCreation.description",
    descDefault: "Articles, videos, podcasts and social media education.",
  },
  {
    icon: <HiUsers />,
    tone: "green",
    titleId: "ambassadors.roles.meetups.title",
    titleDefault: "Events & Meetups",
    descId: "ambassadors.roles.meetups.description",
    descDefault: "Organizing local meetups, workshops, hackathons and conferences.",
  },
  {
    icon: <MdSchool />,
    tone: "violet",
    titleId: "ambassadors.roles.education.title",
    titleDefault: "Education & Advocacy",
    descId: "ambassadors.roles.education.description",
    descDefault: "Teaching, onboarding new users and raising awareness.",
  },
  {
    icon: <BsCodeSlash />,
    tone: "amber",
    titleId: "ambassadors.roles.software.title",
    titleDefault: "Development",
    descId: "ambassadors.roles.software.description",
    descDefault: "Building tools, contributing to open source and technical docs.",
  },
  {
    icon: <HiTranslate />,
    tone: "teal",
    titleId: "ambassadors.roles.translations.title",
    titleDefault: "Translations",
    descId: "ambassadors.roles.translations.description",
    descDefault: "Making Cardano accessible in local languages.",
  },
  {
    icon: <BsShieldCheck />,
    tone: "rose",
    titleId: "ambassadors.roles.moderation.title",
    titleDefault: "Moderation",
    descId: "ambassadors.roles.moderation.description",
    descDefault: "Creating safe, welcoming and informative spaces.",
  },
  {
    icon: <BsBriefcaseFill />,
    tone: "orange",
    titleId: "ambassadors.roles.business.title",
    titleDefault: "Business Development",
    descId: "ambassadors.roles.business.description",
    descDefault: "Growing partnerships and real-world adoption.",
  },
];

function ContributionTile({ role }) {
  return (
    <div className={`${styles.tile} ${styles[`tone_${role.tone}`]}`}>
      <span className={styles.tileIcon} aria-hidden="true">
        {role.icon}
      </span>
      <div className={styles.tileTitle}>
        {translate({ id: role.titleId, message: role.titleDefault })}
      </div>
      <p className={styles.tileDesc}>
        {translate({ id: role.descId, message: role.descDefault })}
      </p>
    </div>
  );
}

export default function AmbassadorsContributions() {
  return (
    <section>
      <Divider
        text={translate({ id: "ambassadors.roles.divider", message: "Ambassadors Contributions" })}
        id="contributions"
      />
      <div className={styles.layout}>
        <div className={styles.intro}>
          <h2 className={styles.title}>
            {translate({
              id: "ambassadors.contributions.title",
              message: "What ambassadors do",
            })}
          </h2>
          <p className={styles.description}>
            {translate({
              id: "ambassadors.contributions.description",
              message:
                "Ambassadors contribute in many ways to support Cardano's mission and grow the ecosystem.",
            })}
          </p>
          <Link to={PROGRAM_URL} className={styles.learnMore} target="_blank" rel="noopener noreferrer">
            {translate({
              id: "ambassadors.contributions.learnMore",
              message: "Learn more about the program",
            })}
            <HiArrowRight className={styles.learnMoreIcon} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.tilesCard}>
          {ROLES.map((role) => (
            <ContributionTile key={role.titleId} role={role} />
          ))}
        </div>
      </div>
    </section>
  );
}
