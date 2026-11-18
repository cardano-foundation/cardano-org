import React from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import LinkCardRow from "@site/src/components/Layout/LinkCardRow";
import { CompletedHardFork, HardFork, ProposalGroup, Section, VersionLine } from "@site/src/components/Roadmap";
import { getChanges, getHardForks, getUnscheduled } from "@site/src/data/roadmap";
import { getHardForkHistory } from "@site/src/data/hardforks";

export default function Roadmap() {
  const history = getHardForkHistory();
  const forks = getHardForks();
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
          message: "What the next hard fork changes, and how far along it is.",
        })}
        bannerType="starburst"
      />
      <main>
        <BoundaryBox>
          <VersionLine history={history} upcoming={forks} />
          <Section id="planned" title={translate({ id: "roadmap.section.planned", message: "Planned" })}>
            {forks.map((fork) => (
              <HardFork key={fork.key} fork={fork} changes={getChanges(fork.key)} />
            ))}
          </Section>
          <Section id="not-scheduled" title={translate({ id: "roadmap.section.unscheduled", message: "Not scheduled" })}>
            {getUnscheduled().map((group) => (
              <ProposalGroup key={group.key} group={group} />
            ))}
          </Section>
          <Section id="completed" title={translate({ id: "roadmap.section.completed", message: "Completed" })}>
            {history.map((item) => (
              <CompletedHardFork key={item.epoch} item={item} />
            ))}
          </Section>
          <SpacerBox size="medium" />
          <LinkCardRow
            items={[
              { to: "/governance/how-it-works", label: translate({ id: "roadmap.link.decided", message: "How Cardano decides" }) },
              { to: "/hardforks", label: translate({ id: "roadmap.link.history", message: "Every hard fork so far" }) },
              { to: "/how-cardano-works", label: translate({ id: "roadmap.link.works", message: "How Cardano works" }) },
            ]}
          />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
