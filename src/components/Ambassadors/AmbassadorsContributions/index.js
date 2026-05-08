import React from "react";
import { translate } from "@docusaurus/Translate";
import {
  BsPenFill,
  BsCodeSlash,
  BsShieldCheck,
  BsLightbulbFill,
  BsBriefcaseFill,
} from "react-icons/bs";
import { HiUsers, HiTranslate } from "react-icons/hi";
import { MdSchool } from "react-icons/md";

import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import RoleCard from "@site/src/components/Layout/RoleCard";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import styles from "./styles.module.css";

const ROLES = [
  {
    icon: <BsPenFill />,
    accent: "blue",
    titleId: "ambassadors.roles.contentCreation.title",
    titleDefault: "Content Creation",
    descId: "ambassadors.roles.contentCreation.description",
    descDefault:
      "Producing engaging videos, insightful articles, informative threads, graphics, and podcasts that educate and inspire. [Check out the latest Cardano content here.](https://cardano.org/news)",
  },
  {
    icon: <HiUsers />,
    accent: "violet",
    titleId: "ambassadors.roles.meetups.title",
    titleDefault: "Meetups & Events",
    descId: "ambassadors.roles.meetups.description",
    descDefault:
      "Organizing both in-person and virtual gatherings, workshops, and hackathons to unite local communities. [Find your local community events.](https://luma.com/CardanoEvents)",
  },
  {
    icon: <MdSchool />,
    accent: "teal",
    titleId: "ambassadors.roles.education.title",
    titleDefault: "Education & Advocacy",
    descId: "ambassadors.roles.education.description",
    descDefault:
      "Hosting seminars, advocating for blockchain adoption, and supporting learning initiatives across institutions. [Explore Cardano's research.](https://cardano.org/research)",
  },
  {
    icon: <BsBriefcaseFill />,
    accent: "blue",
    titleId: "ambassadors.roles.business.title",
    titleDefault: "Business Development",
    descId: "ambassadors.roles.business.description",
    descDefault:
      "Forging partnerships and leading community-driven projects to expand Cardano's influence. [Explore use cases.](https://cardano.org/use-cases)",
  },
  {
    icon: <BsCodeSlash />,
    accent: "violet",
    titleId: "ambassadors.roles.software.title",
    titleDefault: "Software Development",
    descId: "ambassadors.roles.software.description",
    descDefault:
      "Contributing to open-source projects, drafting Cardano Improvement Proposals (CIPs), and creating tools to enhance the ecosystem. [Get started here.](https://cardano.org/developers)",
  },
  {
    icon: <HiTranslate />,
    accent: "teal",
    titleId: "ambassadors.roles.translations.title",
    titleDefault: "Translations",
    descId: "ambassadors.roles.translations.description",
    descDefault:
      "Extending Cardano's reach by translating key content into multiple languages. [Visit the forum.](https://forum.cardano.org/)",
  },
  {
    icon: <BsShieldCheck />,
    accent: "blue",
    titleId: "ambassadors.roles.moderation.title",
    titleDefault: "Moderation",
    descId: "ambassadors.roles.moderation.description",
    descDefault:
      "Managing online discussions across 50 [channels](https://forum.cardano.org/t/cardano-stay-safe-series-recommended-community-channel-list/20046) in 17 languages on 9 platforms, ensuring productive and welcoming digital environments in both official and community spaces. All community members must act lawfully, ethically, and in the project's best interest, following the [Community Code of Conduct.](https://cardano.org/community-code-of-conduct/)",
  },
  {
    icon: <BsLightbulbFill />,
    accent: "violet",
    titleId: "ambassadors.roles.innovative.title",
    titleDefault: "Innovative Contributions",
    descId: "ambassadors.roles.innovative.description",
    descDefault:
      "From educational campaigns to groundbreaking community projects, every initiative makes a lasting impact.",
  },
];

export default function AmbassadorsContributions() {
  return (
    <section>
      <Divider
        text={translate({ id: "ambassadors.roles.divider", message: "Ambassadors Contributions" })}
        id="contributions"
      />
      <TitleWithText
        title={translate({
          id: "ambassadors.contributions.title",
          message: "What ambassadors do",
        })}
        description={[
          translate({
            id: "ambassadors.contributions.description",
            message:
              "Ambassadors contribute in many ways to support Cardano's mission and grow the ecosystem.",
          }),
        ]}
        titleType="black"
        headingDot={true}
      />

      <div className={styles.grid}>
        {ROLES.map((role) => (
          <RoleCard
            key={role.titleId}
            icon={role.icon}
            accent={role.accent}
            title={translate({ id: role.titleId, message: role.titleDefault })}
          >
            {parseMarkdownLikeText(translate({ id: role.descId, message: role.descDefault }))}
          </RoleCard>
        ))}
      </div>
    </section>
  );
}
