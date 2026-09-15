import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { translate } from "@docusaurus/Translate";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import StatsBar from "@site/src/components/Layout/StatsBar";
import StatusPill from "@site/src/components/Layout/StatusPill";
import Steps from "@site/src/components/Layout/Steps";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import FAQSection from "@site/src/components/FAQSection";
import { OutcomeCards, UpgradeTimeline, ReaderCards, PhaseStrip, useFormatDate } from "@site/src/components/Roadmap";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import { faqJsonLd } from "@site/src/utils/jsonLd";
import { describeStage, getUpcoming, getUpgrades, getUpgradeSteps, getRoadmapFAQ } from "@site/src/data/roadmap";

function RoadmapHero() {
  return (
    <SiteHero
      title={translate({ id: "roadmap.hero.title", message: "Cardano roadmap" })}
      description={translate({
        id: "roadmap.hero.description",
        message: "What is live, what is being built, and how an upgrade gets decided.",
      })}
      bannerType="starburst"
    />
  );
}

// Four figures derived from the newest enacted upgrade and the next one in
// the data, so the strip changes only when those entries do.
function TodayStrip() {
  const formatDate = useFormatDate();
  const last = getUpgrades()[0];
  const next = getUpcoming()[0];
  const stage = describeStage(next.stage);
  const items = [
    { key: "era", value: last.era, label: translate({ id: "roadmap.today.era", message: "Ledger era on mainnet" }) },
    {
      key: "version",
      value: translate({ id: "roadmap.today.versionValue", message: "v{version}" }, { version: last.version }),
      label: translate({ id: "roadmap.today.version", message: "Protocol version" }),
    },
    {
      key: "last",
      value: last.name,
      label: translate({ id: "roadmap.today.last", message: "Live since {date}" }, { date: formatDate(last.date) }),
    },
    {
      key: "next",
      value: next.name,
      extra: <StatusPill tone={stage.tone} label={stage.label} />,
      label: translate({ id: "roadmap.today.next", message: "Next upgrade" }),
    },
  ];
  return <StatsBar items={items} ariaLabel={translate({ id: "roadmap.today.ariaLabel", message: "Cardano today" })} />;
}

function OutcomesSection() {
  return (
    <>
      <Divider id="whats-changing" text={translate({ id: "roadmap.divider.outcomes", message: "What's changing" })} />
      <TitleWithText
        title={translate({ id: "roadmap.outcomes.title", message: "Three things the next upgrades change" })}
        description={translate({
          id: "roadmap.outcomes.description",
          message:
            "The Dijkstra upgrade is scoped by Intersect's hard fork working group with the core teams, within the community's [Vision 2030](https://product.cardano.intersectmbo.org/vision/). This is what it changes for the people using the network.",
        })}
        headingDot={true}
      />
      <OutcomeCards />
    </>
  );
}

function StepsSection() {
  const steps = getUpgradeSteps().map((step) => ({ ...step, text: parseMarkdownLikeText(step.text) }));
  return (
    <>
      <Divider id="how-upgrades-happen" text={translate({ id: "roadmap.divider.steps", message: "How an upgrade happens" })} />
      <TitleWithText
        title={translate({ id: "roadmap.steps.title", message: "From proposal to mainnet" })}
        description={translate({
          id: "roadmap.steps.description",
          message: "Every protocol change takes the same public path, and the last word is an on-chain vote.",
        })}
        headingDot={true}
      />
      <Steps items={steps} />
    </>
  );
}

function TimelineSection() {
  return (
    <>
      <Divider id="upgrades" text={translate({ id: "roadmap.divider.timeline", message: "Upgrades" })} />
      <TitleWithText
        title={translate({ id: "roadmap.timeline.title", message: "Every upgrade, one timeline" })}
        description={translate({
          id: "roadmap.timeline.description",
          message:
            "A hard fork on Cardano is a scheduled switch of the rules at an epoch boundary, agreed in advance and applied by every node at once. The chain never splits: the [hard fork combinator](/glossary/hard-fork-combinator) carries every past era forward. Targets are the teams' estimates; the on-chain vote sets the date.",
        })}
        headingDot={true}
      />
      <UpgradeTimeline />
    </>
  );
}

function ReadersSection() {
  return (
    <>
      <Divider id="for-you" text={translate({ id: "roadmap.divider.readers", message: "What it means for you" })} />
      <TitleWithText
        title={translate({ id: "roadmap.readers.title", message: "If you use, build on, or run Cardano" })}
        description={translate({
          id: "roadmap.readers.description",
          message: "If you hold or use ada there is nothing to do: wallets and apps upgrade behind you. Builders and stake pool operators have a little more to prepare.",
        })}
        headingDot={true}
      />
      <ReaderCards />
    </>
  );
}

function PhasesSection() {
  return (
    <>
      <Divider id="phases" text={translate({ id: "roadmap.divider.phases", message: "Development phases" })} />
      <TitleWithText
        title={translate({ id: "roadmap.phases.title", message: "The five phases behind the upgrades" })}
        description={translate({
          id: "roadmap.phases.description",
          message:
            "The original roadmap grouped Cardano's development into five phases named after Byron, Shelley, Goguen, Basho and Voltaire. They overlap in time rather than follow one another, and each upgrade above delivered part of one or more of them.",
        })}
        headingDot={true}
      />
      <PhaseStrip />
      <TitleWithText
        description={translate({
          id: "roadmap.phases.outro",
          message: "The research papers and specifications behind each phase are collected on the research page.",
        })}
        buttonLabel={translate({ id: "roadmap.phases.button", message: "Read the research" })}
        buttonLink="/research"
      />
    </>
  );
}

export default function Roadmap() {
  const faq = getRoadmapFAQ();
  return (
    <Layout
      title={translate({ id: "roadmap.meta.title", message: "Cardano Roadmap, Upcoming Upgrades and Hard Fork History" })}
      description={translate({
        id: "roadmap.meta.description",
        message:
          "What runs on Cardano mainnet today, what the Dijkstra upgrade changes (more capacity with Leios, faster settlement with Peras, better programmability), how a hard fork is decided by on-chain vote, and every upgrade from Byron to van Rossem.",
      })}
    >
      <Head>
        <script type="application/ld+json">{faqJsonLd(faq)}</script>
      </Head>
      <OpenGraphInfo pageName="roadmap" />
      <RoadmapHero />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <SpacerBox size="small" />
            <TodayStrip />
            <OutcomesSection />
            <TimelineSection />
            <ReadersSection />
            <StepsSection />
            <PhasesSection />
            <FAQSection data={faq} />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
        <BackgroundWrapper backgroundType="gradientDark">
          <BoundaryBox>
            <CtaOneColumn
              title={translate({
                id: "roadmap.cta.title",
                message: "Want to understand what a hard fork changes under the hood, from consensus to the ledger?",
              })}
              buttonLabel={translate({ id: "roadmap.cta.button", message: "Read how Cardano works" })}
              buttonLink="/how-cardano-works"
            />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
