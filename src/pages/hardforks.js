import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";
import SpacerBox from "@site/src/components/Layout/SpacerBox"; 
import { Chrono } from "react-chrono";

// Hard Fork List
// TODO: timeline data should go into a JSON file
const timelineItems = [
  {
    title: "Byron Era",
    cardTitle: "September 29, 2017",
    cardSubtitle: "Name: Byron",
    cardDetailedText: [
      "The launch of the Cardano mainnet and introduction of the ada cryptocurrency.",
      "Epoch 0",
      "Protocol Version: 1.0",
      "Transaction ID: N/A (Genesis block)",
    ],
  },
  {
    title: "Shelley Era",
    cardTitle: "July 29, 2020",
    cardSubtitle: "Name: Shelley",
    cardDetailedText: [
      "Introduced staking and decentralization features, transitioning from a federated to a decentralized system.",
      "Epoch 208",
      "Protocol Version: 2.0",
      "Transaction ID: N/A (Transitioned through several updates)",
    ],
  },
  {
    title: "Allegra Era",
    cardTitle: "December 16, 2020",
    cardSubtitle: "Name: Allegra",
    cardDetailedText: [
      "Added token locking capabilities, which was a prerequisite for the smart contract functionality.",
      "Epoch 236",
      "Protocol Version: 3.0",
      "Transaction ID: 1fbd16c1d1b1933f2f97a313db8c749bdcf65a39d996515b0f5e5535baad68e8",
    ],
  },
  {
    title: "Mary Era",
    cardTitle: "March 1, 2021",
    cardSubtitle: "Name: Mary",
    cardDetailedText: [
      "Brought native token functionality to Cardano, allowing users to create and transact with custom tokens.",
      "Epoch 251",
      "Protocol Version: 4.0",
      "Transaction ID: b7f5658a5aabced7f8599cf7bf7cb9d6f730b865a5a0430f2dc7488caf25752e",
    ],
  },
  {
    title: "Alonzo Era",
    cardTitle: "September 12, 2021",
    cardSubtitle: "Name: Alonzo",
    cardDetailedText: [
      "Introduced smart contract capabilities using Plutus, enabling the deployment of decentralized applications (dApps).",
      "Epoch 290",
      "Protocol Version: 5.0",
      "Transaction ID: N/A (Specific transaction ID not provided)",
    ],
  },
  {
    title: "Alonzo Era",
    cardTitle: "October 22, 2021",
    cardSubtitle: "Name: (Lobster)", //todo: confirm
    cardDetailedText: [
      // "-", // fixme
      "Epoch 298", 
      "Protocol Version: 6.0",
      "Transaction ID: N/A (Specific transaction ID not provided)",
    ],
  },
  {
    title: "Babbage Era",
    cardTitle: "September 22, 2022",
    cardSubtitle: "Name: Vasil",
    cardDetailedText: [
      "Improved the scalability and performance of the network, named after Vasil Dabov, a Cardano community member.",
      "Epoch 365",
      "Protocol Version: 7.0",
      "Transaction ID: 8230f33cd7ad3f8601e94ea2b18abdc591187e190ea8ebecc25e20fc66200f13",
    ],
  },
  {
    title: "Babbage Era",
    cardTitle: "February 14, 2023",
    cardSubtitle: "Name: Valentine",
    cardDetailedText: [
      "Introduced further improvements to Plutus smart contract functionality and overall network performance.",
      "Epoch 394",
      "Protocol Version: 8.0",
      "Transaction ID: a83f479c5635e1e563a19f6e72a1be59fb082bbf31de90cc176850ee799b08ac",
    ],
  },
];

function TestContent() {
  return (
    <Link href="https://google.de">Google</Link>
  );
}

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Hard forks"
      description="What hard forks were implemented, and what functionalities did they introduce?"
      bannerType="starburst"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title="Which hard forks have occurred? | cardano.org"
      description="An environmentally sustainable, verifiably secure proof-of-stake protocol with rigorous security guarantees."
    >
      <OpenGraphImage pageName="hardforks" /> {/* fixme: does not exist */}
      <HomepageHeader />
      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <TitleWithText
            title="Cardano Hard Forks"
            description="Hard forks in Cardano do not signify division and differences within the ecosystem. On the contrary, they define a specific and collectively agreed-upon exact time (slot) when all nodes switch from the current era to a new one, applying new functions, validation rules, or parameter values. All stake pool operators need to install the upgrade, and they also have a say and must agree to it. A Cardano hard fork is, therefore, not a separation but a precise collective evolution."
            headingDot={true}
          />
          <Divider text="Timeline" id="timeline"/>

          <Chrono
            items={timelineItems} 
            mode="VERTICAL_ALTERNATING"
            cardHeight={220}
            activeItemIndex={7}
            disableToolbar={true}
            disableClickOnCircle={true}
            disableInteraction={true}
            disableTimelinePoint={false}
            theme={{
              primary: "#093DB0",
              secondary: "#007FFF",
              cardBgColor: "white",
              titleColor: "#093DB0",
              titleColorActive: "#FF7676",
            }}
          ></Chrono>
        </BoundaryBox>
      </BackgroundWrapper>

      <BackgroundWrapper backgroundType={"solidGrey"}>
        <BoundaryBox>

          <Divider text="hard fork transaction ids" />
          <TitleWithText
                  description="Note that some hard forks, particularly Byron and Shelley, transitioned through a series of updates and may not have a single specific transaction id associated with them. For the others, the provided transaction ids correspond to significant parameter updates leading to the hard forks."
                />
          <SpacerBox size="medium"/>
        </BoundaryBox>
        
      </BackgroundWrapper>
    </Layout>
  );
}
