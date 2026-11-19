import React from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import LinkCardRow from "@site/src/components/Layout/LinkCardRow";
import { CompletedHardFork, Explanation, HardFork, Section, VersionLine, openEntry, versionOf } from "@site/src/components/Roadmap";
import { getCompletedChanges, getHardForks } from "@site/src/data/roadmap";
import { getHardForkHistory } from "@site/src/data/hardforks";
import useHashTarget from "@site/src/utils/useHashTarget";

export default function Roadmap() {
  const history = getHardForkHistory();
  const forks = getHardForks();
  const completedChanges = getCompletedChanges();
  // A link to /roadmap#<id> opens the entry it points at.
  useHashTarget(openEntry);
  return (
    <Layout
      title={translate({ id: "roadmap.meta.title", message: "Cardano Network Upgrades" })}
      description={translate({
        id: "roadmap.meta.description",
        message:
          "What the next Cardano hard fork changes, how far along it is, and every protocol version so far.",
      })}
    >
      <OpenGraphInfo />
      <SiteHero
        title={translate({ id: "roadmap.hero.title", message: "Cardano network upgrades" })}
        description={translate({
          id: "roadmap.hero.description",
          message: "What the next hard fork changes and how far along it is.",
        })}
        bannerType="starburst"
      />
      <main>
        <BoundaryBox>
          <VersionLine history={history} upcoming={forks} />
          <Section id="planned" title={translate({ id: "roadmap.section.planned", message: "Upcoming" })}>
            {forks.map((fork) => (
              <HardFork key={fork.key} fork={fork} />
            ))}
          </Section>
          <Section id="completed" title={translate({ id: "roadmap.section.completed", message: "Completed" })}>
            {history.map((item) => (
              <CompletedHardFork key={item.epoch} item={item} changes={completedChanges[versionOf(item)]} />
            ))}
          </Section>
          <Section id="about" title={translate({ id: "roadmap.section.about", message: "About hard forks" })}>
            <Explanation
              id="hard-fork"
              name={translate({ id: "roadmap.about.hardFork", message: "What a hard fork is" })}
              text={translate({
                id: "hardforks.content.description",
                message:
                  "[Hard forks](/glossary/hard-fork) in Cardano do not signify division and differences within the ecosystem. On the contrary, they define a specific and collectively agreed-upon exact time ([slot](/glossary/slot)) when all nodes switch to new protocol rules, sometimes starting a new era, applying new functions, validation rules, or parameter values. Stake pool operators install the new node version ahead of time. Since Plomin, the switch itself is approved on chain through a [hard fork governance action](/glossary/hard-fork-initiation). A Cardano hard fork is, therefore, not a separation but a precise collective evolution.",
              })}
            />
            <Explanation
              id="going-live"
              name={translate({ id: "roadmap.about.goingLive", message: "How upgrades go live" })}
              text={translate({
                id: "hardforks.upgrades.description",
                message:
                  "Every upgrade since Shelley went live through the [hard fork combinator](/glossary/hard-fork-combinator) while the network kept running. How an upgrade is proposed, approved through [governance](/governance) and rolled out is explained in [how Cardano works](/how-cardano-works#upgrades).",
              })}
            />
            <Explanation
              id="transaction-ids"
              name={translate({ id: "roadmap.about.transactionIds", message: "Transaction IDs" })}
              text={translate({
                id: "hardforks.transactionIds.description",
                message:
                  "Byron, the OBFT switch, Shelley, Alonzo and the Lobster upgrade are listed without a single transaction ID. Up to Chang, each ID is a protocol update proposal that triggered the hard fork. Plomin and van Rossem were approved as [hard fork governance actions](/glossary/hard-fork-initiation), and their IDs identify those actions.",
              })}
            />
          </Section>
          <SpacerBox size="medium" />
          <LinkCardRow
            items={[
              { to: "/governance/how-it-works", label: translate({ id: "roadmap.link.vote", message: "How a hard fork is voted on" }) },
              { to: "/ouroboros", label: translate({ id: "roadmap.link.ouroboros", message: "What Ouroboros is" }) },
            ]}
          />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
