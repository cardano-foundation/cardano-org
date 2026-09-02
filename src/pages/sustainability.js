import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import NumberedCard from "@site/src/components/NumberedCard";
import Accordion from "@site/src/components/Layout/Accordion";
import SustainabilityHero from "@site/src/components/Sustainability/Hero";
import EnergyComparisonTable from "@site/src/components/Sustainability/EnergyComparisonTable";
import NetworkDistribution from "@site/src/components/Sustainability/NetworkDistribution";
import CcriResults from "@site/src/components/Sustainability/CcriResults";
import ResourceCards from "@site/src/components/Sustainability/ResourceCards";
import {
  META,
  DIFFERENTIATION,
  COMPARISON,
  MICA,
  RESULTS,
  RESOURCES,
  FAQ,
  CTA,
} from "@site/src/data/sustainability";
import styles from "./sustainability.module.css";

// /sustainability page: Cardano's energy consumption and carbon footprint as
// verified by the Crypto Carbon Ratings Institute (CCRI) and reported under
// MiCA. All copy lives in src/data/sustainability.js; this file only lays the
// sections out and wires the section components together.

// Section header. Wraps TitleWithText so the page can control the rhythm
// between the header and the content below it without touching the shared
// component.
function SectionHeader({ title, description, headingDot }) {
  return (
    <div className={styles.sectionHeader}>
      <TitleWithText
        title={title}
        description={description}
        titleType="black"
        headingDot={headingDot}
      />
    </div>
  );
}

export default function Sustainability() {
  return (
    <Layout title={META.title} description={META.description}>
      <OpenGraphInfo pageName="sustainability" />
      <SustainabilityHero />

      <main>
        {/* How Cardano achieves low energy consumption: white */}
        <BackgroundWrapper>
          <BoundaryBox>
            <section className={styles.section}>
              <SectionHeader
                title={DIFFERENTIATION.title}
                description={DIFFERENTIATION.intro}
                headingDot={true}
              />
              <h2 className={styles.subheading}>{DIFFERENTIATION.cardsHeading}</h2>
              <div className={styles.cardGrid}>
                {DIFFERENTIATION.cards.map((card) => (
                  <NumberedCard key={card.index} index={card.index} title={card.title}>
                    {card.body}
                  </NumberedCard>
                ))}
              </div>
            </section>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Blockchain energy consumption comparison: subtle grey band */}
        <BackgroundWrapper backgroundType="solidGrey">
          <BoundaryBox>
            <section className={styles.section}>
              <SectionHeader
                title={COMPARISON.title}
                description={[COMPARISON.subtitle]}
                headingDot={true}
              />
              <EnergyComparisonTable />
            </section>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Network distribution (map + top countries table): white */}
        <BackgroundWrapper>
          <BoundaryBox>
            <section className={styles.section}>
              <NetworkDistribution />
            </section>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* The MiCA framework: brand blue band with inverted text. TitleWithText
            forces theme text colors, so the header is hand rolled here. */}
        <div className={styles.micaSection}>
          <BoundaryBox>
            <section className={styles.section}>
              <div className={styles.micaColumns}>
                <h2 className={clsx("headingDot", styles.micaTitle)}>{MICA.title}</h2>
                <div className={styles.micaText}>
                  {MICA.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div
                className={clsx(styles.cardGrid, styles.micaGrid)}
                role="list"
                aria-label={MICA.methodologyAriaLabel}
              >
                {MICA.methodology.map((step) => (
                  <div role="listitem" key={step.index}>
                    <NumberedCard index={step.index} title={step.title}>
                      {step.body}
                    </NumberedCard>
                  </div>
                ))}
              </div>
            </section>
          </BoundaryBox>
        </div>

        {/* Key CCRI results: white */}
        <BackgroundWrapper>
          <BoundaryBox>
            <section className={styles.section}>
              <SectionHeader
                title={RESULTS.title}
                description={[RESULTS.subtitle]}
                headingDot={false}
              />
              <CcriResults />
            </section>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Resources carousel: subtle grey band */}
        <BackgroundWrapper backgroundType="solidGrey">
          <BoundaryBox>
            <section className={styles.section}>
              <SectionHeader title={RESOURCES.title} headingDot={false} />
              <ResourceCards />
            </section>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* FAQ: white */}
        <BackgroundWrapper>
          <BoundaryBox>
            <section className={styles.section}>
              <SectionHeader title={FAQ.title} headingDot={false} />
              <Accordion items={FAQ.items} defaultOpenIndex={0} />
            </section>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Call to action: dark navy band with circle artwork and noise */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <div className={styles.cta}>
              <h2 className={styles.ctaHeading}>{CTA.heading}</h2>
              <p className={styles.ctaSupporting}>{CTA.supporting}</p>
              <Link
                className={styles.ctaButton}
                to={CTA.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CTA.button}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
