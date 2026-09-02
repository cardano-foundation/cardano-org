// src/pages/learn.js
import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { FaRoute } from "react-icons/fa";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import RoleCard from "@site/src/components/Layout/RoleCard";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import { jsonLdString } from "@site/src/utils/jsonLd";
import { getLearningPath, getLevelLabel, ACADEMY_URL } from "@site/src/data/learningPath";
import styles from "./learn.module.css";

const ACCENT_BY_LEVEL = { beginner: "blue", intermediate: "violet", advanced: "teal" };

function LearnHero() {
  return (
    <SiteHero
      title={translate({ id: "learn.hero.title", message: "Learn Cardano" })}
      description={translate({ id: "learn.hero.description", message: "From your first wallet to on-chain governance, one stage at a time." })}
      bannerType="dots"
    />
  );
}

function Stage({ stage, index }) {
  return (
    <>
      <Divider id={stage.anchor} text={translate({ id: "learn.stage.dividerLabel", message: "Stage {number}" }, { number: index + 1 })} />
      <span className={styles.stageMeta}>{getLevelLabel(stage.level)}</span>
      <TitleWithText title={stage.title} description={stage.intro} headingDot={true} />
      <div className={styles.cardGrid}>
        {stage.items.map((item) => (
          <RoleCard key={item.key} accent={ACCENT_BY_LEVEL[stage.level]} icon={item.icon} title={item.title} href={item.href}>
            {item.text}
          </RoleCard>
        ))}
      </div>
      {stage.quiz && <TitleWithText description={stage.quiz} />}
      <SpacerBox size="small" />
    </>
  );
}

export default function Learn() {
  const { siteConfig } = useDocusaurusContext();
  const stages = getLearningPath();
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  return (
    <Layout
      title={translate({ id: "learn.layout.title", message: "Learn Cardano, a Guided Path from Beginner to Advanced" })}
      description={translate({ id: "learn.layout.description", message: "A five-stage learning path through cardano.org: understand the basics, use Cardano safely, learn how the technology works, take part in governance and go deeper with research and courses." })}
    >
      <Head>
        <script type="application/ld+json">
          {jsonLdString({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Learn Cardano",
            "itemListElement": stages.map((stage, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": stage.title,
              "url": `${siteUrl}/learn/#${stage.anchor}`,
            })),
          })}
        </script>
      </Head>
      <OpenGraphInfo />
      <LearnHero />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <SpacerBox size="small" />
            <HighlightCallout icon={<FaRoute />}>
              {translate({ id: "learn.intro.callout", message: "Five stages, each with a handful of pages and a quiz. Read them in order if you are new, or jump in where you already are." })}
            </HighlightCallout>
            {stages.map((stage, index) => (
              <Stage key={stage.key} stage={stage} index={index} />
            ))}
          </BoundaryBox>
        </BackgroundWrapper>
        <BackgroundWrapper backgroundType="gradientDark">
          <BoundaryBox>
            <CtaOneColumn
              title={translate({ id: "learn.cta.title", message: "Want a certificate at the end? The Cardano Academy offers free courses on everything above." })}
              buttonLabel={translate({ id: "learn.cta.button", message: "Explore the Academy" })}
              buttonLink={ACADEMY_URL}
            />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
