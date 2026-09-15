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
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import FAQSection from "@site/src/components/FAQSection";
import FundingPrograms from "@site/src/components/FundingPrograms";
import FundingStats from "@site/src/components/FundingPrograms/FundingStats";
import { faqJsonLd } from "@site/src/utils/jsonLd";
import { getApplySteps, getFundingFAQ } from "@site/src/data/funding";
import programStyles from "@site/src/components/FundingPrograms/styles.module.css";

function FundingHero() {
  return (
    <SiteHero
      title={translate({ id: "funding.hero.title", message: "Grants and Funding" })}
      description={translate({
        id: "funding.hero.description",
        message: "Grants, accelerators, and investment for teams building on Cardano, in one place.",
      })}
      bannerType="ada"
    />
  );
}

function ProgramsSection() {
  return (
    <>
      <Divider id="programs" text={translate({ id: "funding.divider.programs", message: "Programs" })} />
      <TitleWithText
        title={translate({ id: "funding.programs.title", message: "Apply for funding" })}
        description={translate({
          id: "funding.programs.description",
          message: "Tell us where you are, and we'll show the programs that fit.",
        })}
        headingDot={true}
      />
      <FundingPrograms />
    </>
  );
}

function ApplySection() {
  return (
    <>
      <Divider id="how-to-apply" text={translate({ id: "funding.divider.apply", message: "How to apply" })} />
      <TitleWithText
        title={translate({ id: "funding.apply.title", message: "Three steps, whichever program you choose" })}
        headingDot={true}
      />
      <ol className={programStyles.steps}>
        {getApplySteps().map((step) => (
          <li key={step.title} className={programStyles.step}>
            <span className={programStyles.stepTitle}>{step.title}</span>
            <p className={programStyles.stepText}>{step.text}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

export default function GrantsFunding() {
  const faq = getFundingFAQ();
  return (
    <Layout
      title={translate({ id: "funding.meta.title", message: "Grants and Funding on Cardano" })}
      description={translate({
        id: "funding.meta.description",
        message:
          "Grants, accelerators, venture funding, and paid open-source work for people building on Cardano: Project Catalyst, the Cardano Treasury, Intersect, the Cardano Accelerator Program, the Orion Fund, and more.",
      })}
    >
      <Head>
        <script type="application/ld+json">{faqJsonLd(faq)}</script>
      </Head>
      <OpenGraphInfo pageName="grants-funding" />
      <FundingHero />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <SpacerBox size="small" />
            <FundingStats />
            <ProgramsSection />
            <ApplySection />
            <FAQSection data={faq} />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
        <BackgroundWrapper backgroundType="gradientDark">
          <BoundaryBox>
            <CtaOneColumn
              title={translate({ id: "funding.cta.title", message: "Not building yet? The developer portal is the place to start." })}
              buttonLabel={translate({ id: "funding.cta.button", message: "Go to the developer portal" })}
              buttonLink="https://developers.cardano.org"
            />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
