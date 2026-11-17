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
import { getHardForkHistory } from "@site/src/data/hardforks";
import { translate } from "@docusaurus/Translate";

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
          "A complete timeline of Cardano hard forks from Byron to van Rossem. Explore each network upgrade, what changed, and how the protocol has evolved.",
      })}
    >
      <OpenGraphInfo pageName="hard-forks" />
      <HomepageHeader />
      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <TitleWithText headingLevel={2}
            title={translate({ id: "hardforks.content.title", message: "Cardano Hard Forks" })}
            description={translate({
              id: "hardforks.content.description",
              message:
                "[Hard forks](/glossary/hard-fork) in Cardano do not signify division and differences within the ecosystem. On the contrary, they define a specific and collectively agreed-upon exact time ([slot](/glossary/slot)) when all nodes switch to new protocol rules, sometimes starting a new era, applying new functions, validation rules, or parameter values. Stake pool operators install the new node version ahead of time. Since Plomin, the switch itself is approved on chain through a [hard fork governance action](/glossary/hard-fork-initiation). A Cardano hard fork is, therefore, not a separation but a precise collective evolution.",
            })}
            headingDot={true}
          />
          <TitleWithText headingLevel={2}
            description={translate({
              id: "hardforks.upgrades.description",
              message:
                "Every upgrade since Shelley went live through the [hard fork combinator](/glossary/hard-fork-combinator) while the network kept running. How an upgrade is proposed, approved through [governance](/governance) and rolled out is explained in [how Cardano works](/how-cardano-works#upgrades).",
            })}
          />
          <Divider headingLevel={2}
            text={translate({ id: "hardforks.divider.timeline", message: "Timeline" })}
            id="timeline"
          />
          <HardForkTimeline items={getHardForkHistory()} />
        </BoundaryBox>
      </BackgroundWrapper>

      <BackgroundWrapper backgroundType={"solidGrey"}>
        <BoundaryBox>
          <Divider headingLevel={2}
            text={translate({
              id: "hardforks.divider.transactionIds",
              message: "hard fork transaction ids",
            })}
          />
          <TitleWithText headingLevel={2}
            description={translate({
              id: "hardforks.transactionIds.description",
              message:
                "Byron, the OBFT switch, Shelley, Alonzo and the Lobster upgrade are listed without a single transaction ID. Up to Chang, each ID is a protocol update proposal that triggered the hard fork. Plomin and van Rossem were approved as [hard fork governance actions](/glossary/hard-fork-initiation), and their IDs identify those actions.",
            })}
          />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </BackgroundWrapper>
    </Layout>
  );
}
