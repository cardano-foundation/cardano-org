import React from "react";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import HardForkTimeline from "@site/src/components/HardForkTimeline";
import { translate } from "@docusaurus/Translate";

const labelEpoch = () =>
  translate({ id: "hardforks.timeline.label.epoch", message: "Epoch" });
const labelProtocolVersion = () =>
  translate({ id: "hardforks.timeline.label.protocolVersion", message: "Protocol Version" });
const labelTransactionId = () =>
  translate({ id: "hardforks.timeline.label.transactionId", message: "Transaction ID" });
const labelTransactionIds = () =>
  translate({ id: "hardforks.timeline.label.transactionIds", message: "Transaction IDs" });

function getTimelineItems() {
  return [
    {
      era: "Conway Era",
      date: "June, 2026 (tentative)",
      name: "van Rossem",
      description: translate({
        id: "hardforks.timeline.vanrossem.description",
        message:
          "Inter-era upgrade delivering cleaner ledger rules, VRF key uniqueness, Plutus smart contract performance improvements and new cryptographic built-ins",
      }),
      epochLabel: labelEpoch(),
      epoch: "tbd",
      meta: [
        { label: labelProtocolVersion(), value: "11.0" },
        { label: labelTransactionIds(), value: "tbd" },
      ],
    },
    {
      era: "Conway Era",
      date: "January 29, 2025",
      name: "Plomin",
      description: translate({
        id: "hardforks.timeline.plomin.description",
        message:
          "Introducing the second batch of decentralized governance features of CIP-1694. Enabling the full set of governance actions and the DRep role.",
      }),
      epochLabel: labelEpoch(),
      epoch: "537",
      meta: [
        { label: labelProtocolVersion(), value: "10.0" },
        {
          label: labelTransactionIds(),
          value: "0b19476e40bbbb5e1e8ce153523762e2b6859e7ecacbaf06eaa0ee6a447e79b9",
        },
      ],
      active: true,
    },
    {
      era: "Conway Era",
      date: "September 1, 2024",
      name: "Chang",
      description: translate({
        id: "hardforks.timeline.chang1.description",
        message:
          "Introducing the first batch of decentralized governance features of CIP-1694. Enabling only parameter changes and hard fork initiations.",
      }),
      epochLabel: labelEpoch(),
      epoch: "507",
      meta: [
        { label: labelProtocolVersion(), value: "9.0" },
        {
          label: labelTransactionIds(),
          value:
            "9ba6a580bceb8f94e65a683e8291c89382835f46e3cf928eb521f5581ade4820, 4e377ceb5c5721257a3d7960f3053468bbea45ed8ac22cd559c69e757da5e0ae",
        },
      ],
    },
    {
      era: "Babbage Era",
      date: "February 14, 2023",
      name: "Valentine",
      description: translate({
        id: "hardforks.timeline.valentine.description",
        message:
          "Introduced further improvements to Plutus smart contract functionality and overall network performance.",
      }),
      epochLabel: labelEpoch(),
      epoch: "394",
      meta: [
        { label: labelProtocolVersion(), value: "8.0" },
        {
          label: labelTransactionIds(),
          value:
            "a83f479c5635e1e563a19f6e72a1be59fb082bbf31de90cc176850ee799b08ac, 62c3c13187423c47f629e6187f36fbd61a9ba1d05d101588340cfbfdf47b22d2",
        },
      ],
    },
    {
      era: "Babbage Era",
      date: "September 22, 2022",
      name: "Vasil",
      description: translate({
        id: "hardforks.timeline.vasil.description",
        message:
          "Improved the scalability and performance of the network, named after Vasil Dabov, a Cardano community member.",
      }),
      epochLabel: labelEpoch(),
      epoch: "365",
      meta: [
        { label: labelProtocolVersion(), value: "7.0" },
        {
          label: labelTransactionIds(),
          value:
            "3abda97c78c71e8a21473529aca94d78d364dfa1a866ef8245885e18085b4e4c, 8230f33cd7ad3f8601e94ea2b18abdc591187e190ea8ebecc25e20fc66200f13",
        },
      ],
    },
    {
      era: "Alonzo Era",
      date: "October 22, 2021",
      name: "(Lobster)",
      epochLabel: labelEpoch(),
      epoch: "298",
      meta: [
        { label: labelProtocolVersion(), value: "6.0" },
        { label: labelTransactionId(), value: "N/A (Specific transaction ID not provided)" },
      ],
    },
    {
      era: "Alonzo Era",
      date: "September 12, 2021",
      name: "Alonzo",
      description: translate({
        id: "hardforks.timeline.alonzo.description",
        message:
          "Introduced smart contract capabilities using Plutus, enabling the deployment of decentralized applications (dApps).",
      }),
      epochLabel: labelEpoch(),
      epoch: "290",
      meta: [
        { label: labelProtocolVersion(), value: "5.0" },
        { label: labelTransactionId(), value: "N/A (Specific transaction ID not provided)" },
      ],
    },
    {
      era: "Mary Era",
      date: "March 1, 2021",
      name: "Mary",
      description: translate({
        id: "hardforks.timeline.mary.description",
        message:
          "Brought native token functionality to Cardano, allowing users to create and transact with custom tokens.",
      }),
      epochLabel: labelEpoch(),
      epoch: "251",
      meta: [
        { label: labelProtocolVersion(), value: "4.0" },
        {
          label: labelTransactionId(),
          value: "b7f5658a5aabced7f8599cf7bf7cb9d6f730b865a5a0430f2dc7488caf25752e",
        },
      ],
    },
    {
      era: "Allegra Era",
      date: "December 16, 2020",
      name: "Allegra",
      description: translate({
        id: "hardforks.timeline.allegra.description",
        message:
          "Added token locking capabilities, which was a prerequisite for the smart contract functionality.",
      }),
      epochLabel: labelEpoch(),
      epoch: "236",
      meta: [
        { label: labelProtocolVersion(), value: "3.0" },
        {
          label: labelTransactionId(),
          value: "1fbd16c1d1b1933f2f97a313db8c749bdcf65a39d996515b0f5e5535baad68e8",
        },
      ],
    },
    {
      era: "Shelley Era",
      date: "July 29, 2020",
      name: "Shelley",
      description: translate({
        id: "hardforks.timeline.shelley.description",
        message:
          "Introduced staking and decentralization features, transitioning from a federated to a decentralized system.",
      }),
      epochLabel: labelEpoch(),
      epoch: "208",
      meta: [
        { label: labelProtocolVersion(), value: "2.0" },
        { label: labelTransactionId(), value: "N/A (Transitioned through several updates)" },
      ],
    },
    {
      era: "Byron Era",
      date: "September 29, 2017",
      name: "Byron",
      description: translate({
        id: "hardforks.timeline.byron.description",
        message: "The launch of the Cardano mainnet and introduction of the ada cryptocurrency.",
      }),
      epochLabel: labelEpoch(),
      epoch: "0",
      meta: [
        { label: labelProtocolVersion(), value: "1.0" },
        { label: labelTransactionId(), value: "N/A (Genesis block)" },
      ],
    },
  ];
}

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({ id: "hardforks.hero.title", message: "Hard forks" })}
      description={translate({
        id: "hardforks.hero.description",
        message: "What hard forks were implemented, and what functionalities did they introduce?",
      })}
      bannerType="starburst"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({
        id: "hardforks.layout.title",
        message: "Cardano Hard Forks, Network Upgrade History",
      })}
      description={translate({
        id: "hardforks.layout.description",
        message:
          "A complete timeline of Cardano hard forks from Byron to Chang. Explore each network upgrade, what changed, and how the protocol has evolved.",
      })}
    >
      <OpenGraphInfo pageName="hard-forks" />
      <HomepageHeader />
      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <TitleWithText
            title={translate({ id: "hardforks.content.title", message: "Cardano Hard Forks" })}
            description={translate({
              id: "hardforks.content.description",
              message:
                "Hard forks in Cardano do not signify division and differences within the ecosystem. On the contrary, they define a specific and collectively agreed-upon exact time (slot) when all nodes switch from the current era to a new one, applying new functions, validation rules, or parameter values. All stake pool operators need to install the upgrade, and they also have a say and must agree to it. A Cardano hard fork is, therefore, not a separation but a precise collective evolution.",
            })}
            headingDot={true}
          />
          <Divider
            text={translate({ id: "hardforks.divider.timeline", message: "Timeline" })}
            id="timeline"
          />
          <HardForkTimeline items={getTimelineItems()} />
        </BoundaryBox>
      </BackgroundWrapper>

      <BackgroundWrapper backgroundType={"solidGrey"}>
        <BoundaryBox>
          <Divider
            text={translate({
              id: "hardforks.divider.transactionIds",
              message: "hard fork transaction ids",
            })}
          />
          <TitleWithText
            description={translate({
              id: "hardforks.transactionIds.description",
              message:
                "Note that some hard forks, particularly Byron and Shelley, transitioned through a series of updates and may not have a single specific transaction id associated with them. For the others, the provided transaction ids correspond to significant parameter updates leading to the hard forks.",
            })}
          />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </BackgroundWrapper>
    </Layout>
  );
}
