import React from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import LinkCardRow from "@site/src/components/Layout/LinkCardRow";
import { LaterHardFork, NextHardFork, VersionLine } from "@site/src/components/Roadmap";
import { getHardForks, getUpgrades } from "@site/src/data/roadmap";
import { getHardForkHistory } from "@site/src/data/hardforks";

export default function Roadmap() {
  const history = getHardForkHistory();
  const [next, ...later] = getHardForks();
  return (
    <Layout
      title={translate({ id: "roadmap.meta.title", message: "Cardano Network Upgrades" })}
      description={translate({
        id: "roadmap.meta.description",
        message:
          "Every Cardano protocol version so far, the next hard fork, what it changes, and how far along it is.",
      })}
    >
      <OpenGraphInfo />
      <SiteHero
        title={translate({ id: "roadmap.hero.title", message: "Network upgrades" })}
        description={translate({
          id: "roadmap.hero.description",
          message: "Every protocol version so far, and what the next hard fork changes.",
        })}
        bannerType="starburst"
      />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <VersionLine history={history} next={next} />
            <NextHardFork fork={next} upgrades={getUpgrades(next.key)} latest={history[0]} />
            {later.map((fork) => (
              <LaterHardFork key={fork.key} fork={fork} upgrades={getUpgrades(fork.key)} />
            ))}
            <SpacerBox size="medium" />
            <LinkCardRow
              items={[
                { to: "/governance/how-it-works", label: translate({ id: "roadmap.link.decided", message: "How Cardano decides" }) },
                { to: "/hardforks", label: translate({ id: "roadmap.link.history", message: "Hard fork history in detail" }) },
                { to: "/how-cardano-works", label: translate({ id: "roadmap.link.works", message: "How Cardano works" }) },
              ]}
            />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
