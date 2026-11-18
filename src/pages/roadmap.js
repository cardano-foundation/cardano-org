import React from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import LinkCardRow from "@site/src/components/Layout/LinkCardRow";
import { CompletedHardFork, HardFork, Section, VersionLine, openEntry, versionOf } from "@site/src/components/Roadmap";
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
          <SpacerBox size="medium" />
          <LinkCardRow
            items={[
              { to: "/governance/how-it-works", label: translate({ id: "roadmap.link.vote", message: "How a hard fork is voted on" }) },
              { to: "/hardforks", label: translate({ id: "roadmap.link.hardFork", message: "What a hard fork is" }) },
              { to: "/ouroboros", label: translate({ id: "roadmap.link.ouroboros", message: "What Ouroboros is" }) },
            ]}
          />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
