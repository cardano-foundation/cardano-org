import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
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
    title: "Content Creator",
    description: [
      "Content Creators drive adoption by educating the community and the wider public about the project through engaging, \
      informative and insightful content in the form of videos, blogs, graphic designs, podcasts, or any other form of artistic \
      production.",
    ],
  },
  {
    title: "Meetup Organizer",
    description: [
      "Meetup Organizers drive adoption by hosting regular offline Cardano meetups, connect with local blockchain enthusiasts \
      to educate them about Cardano, create think-tanks and have open debates. Meetup Organizers take networking to the next \
      level by exploring new paradigms of social interaction through discussing the use of smart contracts and decentralized \
      finances, trade and communication. [Maybe there is already a Cardano Meetup in your area?](https://www.meetup.com/pro/cardano/)",
    ],
  },
  {
    title: "Moderator",
    description: [
      "Moderators drive adoption by keeping our official online social media channels informative, productive and a pleasant \
      place for the community to come together in multiple languages across various platforms. All participants in the community \
      are expected to act lawfully, honestly, ethically and in the best interest of the project \
      [in the spirit of Community Code of Conduct](/community-code-of-conduct).",
    ],
  },
  {
    title: "Translator",
    description: [
      "Translators drive adoption by expanding the Cardano project to non-English speaking communities by translating and \
      sharing content in different languages. [Visit the Cardano Forum to see which languages are currently covered.](https://forum.cardano.org)",
    ],
  },
];

export default function AmbassadorRolesSection({}) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  const rolesCount = rolesData.length; // the number of roles, to update text automatically if something is changed

  return (
    <div>
       <Divider text="Ambassador Roles"  id="roles"/>
        <TitleWithText
          title="Ambassador Roles"
          description={[
            `There are currently ${rolesCount} roles for a Cardano Ambassador. While ambassadors may engage in multiple roles, they typically identify a primary role that best represents their contribution to the community:`,  
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
