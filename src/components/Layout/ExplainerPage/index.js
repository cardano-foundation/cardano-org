import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import FAQSection from "@site/src/components/FAQSection";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import { faqJsonLd } from "@site/src/utils/jsonLd";

// Shell shared by the explainer pages (/what-is-cardano, /how-cardano-works,
// /smart-contracts, /defi): meta, FAQPage structured data, hero, the zoom
// background with the page sections, the FAQ and a dark call-to-action band.
// Pages pass translated strings, the shell never calls translate() itself.
export default function ExplainerPage({ title, description, hero, faq, cta, children }) {
  return (
    <Layout title={title} description={description}>
      {faq && (
        <Head>
          <script type="application/ld+json">{faqJsonLd(faq)}</script>
        </Head>
      )}
      <OpenGraphInfo />
      <SiteHero title={hero.title} description={hero.description} bannerType={hero.bannerType} />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            {children}
            {faq && <FAQSection data={faq} />}
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
        {cta && (
          <BackgroundWrapper backgroundType="gradientDark">
            <BoundaryBox>
              <CtaOneColumn title={cta.title} buttonLabel={cta.buttonLabel} buttonLink={cta.buttonLink} />
              <SpacerBox size="small" />
            </BoundaryBox>
          </BackgroundWrapper>
        )}
      </main>
    </Layout>
  );
}
