import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {translate} from '@docusaurus/Translate';
import styles from "./styles.module.css";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";


function Role({ title, description }) {
  return (
    <div className={styles.roleWrap}>
      <h2 className={styles.roleTitle}>{title}</h2>
      {description.map((desc, index) => (
        <p key={index} className={styles.roleDescription}>{parseMarkdownLikeText(desc)}</p>
      ))}
    </div>
  );
}

const rolesData = [
  {
    title: translate({id: 'ambassadors.roles.contentCreation.title', message: 'Content Creation'}),
    description: [
      translate({id: 'ambassadors.roles.contentCreation.description', message: 'Producing engaging videos, insightful articles, informative threads, graphics, and podcasts that educate and inspire. [Check out the latest Cardano content here.](https://cardano.org/news)'}),
    ],
  },
  {
    title: translate({id: 'ambassadors.roles.meetups.title', message: 'Meetups & Events'}),
    description: [
      translate({id: 'ambassadors.roles.meetups.description', message: 'Organizing both in-person and virtual gatherings, workshops, and hackathons to unite local communities. [Find your local community events.](https://luma.com/CardanoEvents)'}),
    ],
  },
  {
    title: translate({id: 'ambassadors.roles.education.title', message: 'Education & Advocacy'}),
    description: [
      translate({id: 'ambassadors.roles.education.description', message: "Hosting seminars, advocating for blockchain adoption, and supporting learning initiatives across institutions. [Explore Cardano's research.](https://cardano.org/research)"}),
    ],
  },
  {
    title: translate({id: 'ambassadors.roles.business.title', message: 'Business Development'}),
    description: [
      translate({id: 'ambassadors.roles.business.description', message: "Forging partnerships and leading community-driven projects to expand Cardano's influence. [Explore use cases.](https://cardano.org/use-cases)"}),
    ],
  },
  {
    title: translate({id: 'ambassadors.roles.software.title', message: 'Software Development'}),
    description: [
      translate({id: 'ambassadors.roles.software.description', message: 'Contributing to open-source projects, drafting Cardano Improvement Proposals (CIPs), and creating tools to enhance the ecosystem. [Get started here.](https://cardano.org/developers)'}),
    ],
  },
  {
    title: translate({id: 'ambassadors.roles.translations.title', message: 'Translations'}),
    description: [
      translate({id: 'ambassadors.roles.translations.description', message: "Extending Cardano's reach by translating key content into multiple languages. [Visit the forum.](https://forum.cardano.org/)"}),
    ],
  },
  {
    title: translate({id: 'ambassadors.roles.moderation.title', message: 'Moderation'}),
    description: [
      translate({id: 'ambassadors.roles.moderation.description', message: 'Managing online discussions across 50 [channels](https://forum.cardano.org/t/cardano-stay-safe-series-recommended-community-channel-list/20046) in 17 languages on 9 platforms, ensuring productive and welcoming digital environments in both official and community spaces. All community members must act lawfully, ethically, and in the project\'s best interest, following the [Community Code of Conduct.](https://cardano.org/community-code-of-conduct/)'}),
    ],
  },
  {
    title: translate({id: 'ambassadors.roles.innovative.title', message: 'Innovative Contributions'}),
    description: [
      translate({id: 'ambassadors.roles.innovative.description', message: 'From educational campaigns to groundbreaking community projects, every initiative makes a lasting impact.'}),
    ],
  },
];

export default function AmbassadorRolesSection({}) {
  return (
    <div>
       <Divider text={translate({id: 'ambassadors.roles.divider', message: 'Ambassadors Contributions'})} id="roles"/>
        <TitleWithText
          title={translate({id: 'ambassadors.roles.title', message: 'Ambassadors Contributions'})}
          description={[
            translate({id: 'ambassadors.roles.description', message: 'Cardano Ambassadors drive community growth through various initiatives, including:'}),
          ]}
          titleType="black"
          headingDot={true}
        />
        {rolesData.map((role, index) => (
        <Role key={index} title={role.title} description={role.description} />
      ))}
    </div>
  );
}
