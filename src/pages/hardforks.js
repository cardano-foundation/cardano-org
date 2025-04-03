import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import { Chrono } from "react-chrono";
import BrowserOnly from '@docusaurus/BrowserOnly';

// Hard Fork List
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
    cardSubtitle: "Name: (Lobster)", //TODO: confirm name
    cardDetailedText: [
      // "-", // FIXME: what changed?
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
      "Transaction IDs: 3abda97c78c71e8a21473529aca94d78d364dfa1a866ef8245885e18085b4e4c, 8230f33cd7ad3f8601e94ea2b18abdc591187e190ea8ebecc25e20fc66200f13",
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
      "Transaction IDs: a83f479c5635e1e563a19f6e72a1be59fb082bbf31de90cc176850ee799b08ac, 62c3c13187423c47f629e6187f36fbd61a9ba1d05d101588340cfbfdf47b22d2",
    ],
  },
  {
    title: "Conway Era",
    cardTitle: "September 1, 2024",
    cardSubtitle: "Name: Chang 1",
    cardDetailedText: [
      "Introducing the first batch of decentralized governance features of CIP-1694. Enabling only parameter changes and hard fork initiations.",
      "Epoch 507",
      "Protocol Version: 9.0",
      "Transaction IDs: 9ba6a580bceb8f94e65a683e8291c89382835f46e3cf928eb521f5581ade4820, 4e377ceb5c5721257a3d7960f3053468bbea45ed8ac22cd559c69e757da5e0ae",
    ],
  },
  {
    title: "Conway Era",
    cardTitle: "January 29, 2025",
    cardSubtitle: "Name: Plomin",
    cardDetailedText: [
      "Introducing the second batch of decentralized governance features of CIP-1694. Enabling the full set of governance actions and the DRep role.",
      "Epoch 537",
      "Protocol Version: 10.0",
      "Transaction IDs: 0b19476e40bbbb5e1e8ce153523762e2b6859e7ecacbaf06eae0ee6a447e79b9",
    ],
  },
];

function HomepageHeader() {
  const { siteTitle } = useDocusaurusContext();
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
      <OpenGraphInfo pageName="hard-forks" />
      <HomepageHeader />
      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <TitleWithText
            title="Cardano Hard Forks"
            description="Hard forks in Cardano do not signify division and differences within the ecosystem. On the contrary, they define a specific and collectively agreed-upon exact time (slot) when all nodes switch from the current era to a new one, applying new functions, validation rules, or parameter values. All stake pool operators need to install the upgrade, and they also have a say and must agree to it. A Cardano hard fork is, therefore, not a separation but a precise collective evolution."
            headingDot={true}
          />
          <Divider text="Timeline" id="timeline"/>

          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => (
              <Chrono
                items={timelineItems}
                mode="VERTICAL_ALTERNATING"
                cardHeight={220}
                activeItemIndex={9}
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
              />
            )}
          </BrowserOnly>
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