import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
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
    title: "Content Creation",
    description: [
      "Producing engaging videos, insightful articles, informative threads, graphics, and podcasts that educate and inspire. [Check out the latest Cardano content here.](https://cardano.org/news)",
    ],
  },
  {
    title: "Meetups & Events",
    description: [
      "Organizing both in-person and virtual gatherings, workshops, and hackathons to unite local communities. [Find your local community events.](https://luma.com/CardanoEvents)",
    ],
  },
  {
    title: "Education & Advocacy",
    description: [
      "Hosting seminars, advocating for blockchain adoption, and supporting learning initiatives across institutions. [Explore Cardano’s research.](https://cardano.org/research)",
    ],
  },
  {
    title: "Business Development",
    description: [
      "Forging partnerships and leading community-driven projects to expand Cardano’s influence. [Explore use cases.](https://cardano.org/use-cases)",
    ],
  },
  {
    title: "Software Development",
    description: [
      "Contributing to open-source projects, drafting Cardano Improvement Proposals (CIPs), and creating tools to enhance the ecosystem. [Get started here.](https://cardano.org/developers)",
    ],
  },
  {
    title: "Translations",
    description: [
      "Extending Cardano’s reach by translating key content into multiple languages. [Visit the forum.](https://forum.cardano.org/)",
    ],
  },
  {
    title: "Moderation",
    description: [
      "Managing online discussions across 50 [channels](https://forum.cardano.org/t/cardano-stay-safe-series-recommended-community-channel-list/20046) in 17 languages on 9 platforms, ensuring productive and welcoming digital environments in both official and community spaces. All community members must act lawfully, ethically, and in the project's best interest, following the [Community Code of Conduct.](https://cardano.org/community-code-of-conduct/)",
    ],
  },
  {
    title: "Innovative Contributions",
    description: [
      "From educational campaigns to groundbreaking community projects, every initiative makes a lasting impact.",
    ],
  },
];

export default function AmbassadorRolesSection({}) {
  const context = useDocusaurusContext();
  const rolesCount = rolesData.length; // the number of roles, to update text automatically if something is changed

  return (
    <div>
       <Divider text="Ambassadors Contributions"  id="roles"/>
        <TitleWithText
          title="Ambassadors Contributions"
          description={[
            `Cardano Ambassadors drive community growth through various initiatives, including:`,  
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
