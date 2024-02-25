import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { parseTextWithLinks } from "@site/src/utils/textUtils";
import Divider from "@site/src/components/Layout/Divider"; 
import TitleWithText from "@site/src/components/Layout/TitleWithText"; 
import { BsFillPersonLinesFill } from 'react-icons/bs'

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

/* 
  Ambassador data, for flags please see: https://github.com/wiredmax/react-flags 
  (FIXME, TODO Not everyone agreed to be listed here)
*/
const ambassadorsData = [
  /* Content Creators */
  {
    name: "Felix Weber",
    role: "Content Creator",
    country: "FR",
    link: "https://forum.cardano.org/u/felix_weber"
  },
  {
    name: "Marcus Vinicius",
    role: "Content Creator",
    country: "BR",
    link: "https://forum.cardano.org/u/marcusoregano"
  },
  {
    name: "Martin Lang",
    role: "Content Creator",
    country: "AT",
    link: "https://forum.cardano.org/u/atada"
  },
  {
    name: "Quentin",
    role: "Content Creator",
    country: "CA",
    link: "https://forum.cardano.org/u/wnipos"
  },
  {
    name: "Yuta Oishi",
    role: "Content Creator",
    country: "JP",
    link: "https://forum.cardano.org/u/yuta_oishi"
  },
  {
    name: "Rena Oishi",
    role: "Content Creator",
    country: "JP",
    link: "https://forum.cardano.org/u/myb_rena"
  },
  {
    name: "Peter",
    role: "Content Creator",
    country: "AU",
    link: "https://forum.cardano.org/u/astroboysoup"
  },
  {
    name: "Efe Şafak Şengül",
    role: "Content Creator",
    country: "TR",
    link: "https://forum.cardano.org/u/hustle"
  },
  {
    name: "Martin Ungar",
    role: "Content Creator",
    country: "AR",
    link: "https://forum.cardano.org/u/latinstakepools"
  },
  /* Meetup Organizers */
  {
    name: "Hassan Michael",
    role: "Meetup Organizer",
    country: "US",
    link: "https://forum.cardano.org/u/dapp360_mike"
  },
  {
    name: "Hideki Takeshi",
    role: "Meetup Organizer",
    country: "JP",
    link: "https://forum.cardano.org/u/HidekiTakeshi"
  },
  {
    name: "Moto",
    role: "Meetup Organizer",
    country: "US",
    link: "https://forum.cardano.org/u/mojira"
  },
  {
    name: "Nori",
    role: "Meetup Organizer",
    country: "CA",
    link: "https://forum.cardano.org/u/xeeban"
  },
  {
    name: "Reng Lee",
    role: "Meetup Organizer",
    country: "CN",
    link: "https://forum.cardano.org/u/ninjis"
  },
  {
    name: "Lucas Macchiavelli",
    role: "Meetup Organizer",
    country: "AR",
    link: "https://forum.cardano.org/u/lucas_mac"
  },
  {
    name: "Daniel David Lezu",
    role: "Meetup Organizer",
    country: "_scotland", 
    link: "https://forum.cardano.org/u/ddlezu"
  },
  {
    name: "Agus",
    role: "Meetup Organizer",
    country: "AR",
    link: "https://forum.cardano.org/u/cardano_agus"
  },
  {
    name: "Fletcher",
    role: "Meetup Organizer",
    country: "US",
    link: "https://forum.cardano.org/u/carpool"
  },
  {
    name: "Θeodore",
    role: "Meetup Organizer",
    country: "CA",
    link: "https://forum.cardano.org/u/cardanochefpool"
  },
  {
    name: "Mohammed Mustapha Yakubu",
    role: "Meetup Organizer",
    country: "GH",
    link: "https://forum.cardano.org/u/chosenfintech"
  },
  /* Moderators */
  {
    name: "Christian",
    role: "Moderator",
    country: "DE",
    link: "https://forum.cardano.org/u/ChrisSTR8"
  },
  {
    name: "Daniel",
    role: "Moderator",
    country: "US",
    link: "https://forum.cardano.org/u/dominatingslash"
  },
  {
    name: "Elton Nápoles Núñez",
    role: "Moderator",
    country: "CU",
    link: "https://forum.cardano.org/u/napoles"
  },
  {
    name: "Harm-Jan Smit",
    role: "Moderator",
    country: "NL",
    link: "https://forum.cardano.org/u/Harm-Jan"
  },
  {
    name: "Josh Daviau",
    role: "Moderator",
    country: "CA",
    link: "https://forum.cardano.org/u/southrye"
  },
  {
    name: "Paul KO",
    role: "Moderator",
    country: "KR",
    link: "https://forum.cardano.org/u/innopia"
  },
  {
    name: "Yuta Uchino",
    role: "Moderator",
    country: "JP",
    link: "https://forum.cardano.org/u/yuta_uchino"
  },
  {
    name: "Tony Chan",
    role: "Moderator",
    country: "CN",
    link: "https://forum.cardano.org/u/tonychan"
  },
  {
    name: "Edickson Aguilera",
    role: "Moderator",
    country: "VE",
    link: "https://forum.cardano.org/u/edickson"
  },
  {
    name: "Gean Brinker",
    role: "Moderator",
    country: "AU",
    link: "https://forum.cardano.org/u/mrbrinker"
  },
  {
    name: "Shaun Byres",
    role: "Moderator",
    country: "_scotland",  
    link: "https://forum.cardano.org/u/byres"
  },
  /* Translators */
  {
    name: "Alex",
    role: "Translator",
    country: "US",
    link: "https://forum.cardano.org/u/cobblybear"
  },
  {
    name: "Andreas Sosilo",
    role: "Translator",
    country: "ID",
    link: "https://forum.cardano.org/u/andreassosilo"
  },
  {
    name: "Dmytro",
    role: "Translator",
    country: "PL",
    link: "https://forum.cardano.org/u/dmitry.stas"
  },
  {
    name: "Fabian",
    role: "Translator",
    country: "CH",
    link: "https://forum.cardano.org/u/zyroxa"
  },
  {
    name: "Jonny",
    role: "Translator",
    country: "DE",
    link: "https://forum.cardano.org/u/jonny22"
  },
  {
    name: "Kornel",
    role: "Translator",
    country: "PL",
    link: "https://forum.cardano.org/u/cornl"
  },
  {
    name: "Leo",
    role: "Translator",
    country: "CU",
    link: "https://forum.cardano.org/u/cubanleo"
  },
  {
    name: "Piero Zanetti",
    role: "Translator",
    country: "IT",
    link: "https://forum.cardano.org/u/lordwotton"
  },
  {
    name: "Wakuda",
    role: "Translator",
    country: "JP",
    link: "https://forum.cardano.org/u/bakucham"
  },
  {
    name: "Jay Hao",
    role: "Translator",
    country: "CN",
    link: "https://forum.cardano.org/u/jayhao"
  },
  {
    name: "Seba",
    role: "Translator",
    country: "AR",
    link: "https://forum.cardano.org/u/cardanocastellano"
  },
  {
    name: "Janice Gu",
    role: "Translator",
    country: "CN",
    link: "https://forum.cardano.org/u/janiceyamgu"
  }
];

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

