import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import Divider from "@site/src/components/Layout/Divider"; 
import TitleWithText from "@site/src/components/Layout/TitleWithText"; 
import { BsFillPersonLinesFill } from 'react-icons/bs'

/* 
  Ambassador data, for flags please see: https://github.com/wiredmax/react-flags 
  (TODO we still have Ambassadors who did not agree to be listed here)
*/
import ambassadorsData from "@site/src/data/ambassadorsData.json";

function AmbassadorCard({ ambassador }) {
  return (
    <a
      href={ambassador.link}
      className={styles.ambassadorCardLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.ambassadorCard}>
        <BsFillPersonLinesFill className={styles.backgroundIcon} />
        <img
          src={useBaseUrl(`img/flags/${ambassador.country}.svg`)}
          alt={ambassador.country}
          className={styles.flagImage}
        />
        <h2 className={styles.ambassadorName}>{ambassador.name}</h2>
        <p className={styles.ambassadorRole}>{ambassador.role}</p>
      </div>
    </a>
  );
}

const countCountries = (ambassadors) => {
  const countryCounts = {};
  
  ambassadors.forEach(ambassador => {
    const { country } = ambassador;
    if (countryCounts[country]) {
      countryCounts[country] += 1;
    } else {
      countryCounts[country] = 1;
    }
  });

  return countryCounts;
};

export default function AmbassadorRolesSection() {
  const sortedAmbassadorsData = ambassadorsData.sort((a, b) => {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });


  const ambassadorsCount = sortedAmbassadorsData.length;  
  const countryCounts = countCountries(sortedAmbassadorsData);
  const uniqueCountriesCount = Object.keys(countryCounts).length;

  return (
    <div>
      <div className={styles.ambassadorsContainer}>
        <TitleWithText
              title="Who are the Cardano Ambassadors?"
              description={[
                `Explore the profiles of ${ambassadorsCount} Cardano Ambassadors from ${uniqueCountriesCount} different countries.`,
              ]}
              titleType="red"
              headingDot={false}
            />
        <div className={clsx(styles.ambassadorsGrid)}>
          {ambassadorsData.map((ambassador, index) => (
            <AmbassadorCard key={index} ambassador={ambassador} />
          ))}
        </div>
      </div>
    </div>
  );
  }

