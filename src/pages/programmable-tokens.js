import React from "react";
import clsx from "clsx";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import Accordion from "@site/src/components/Layout/Accordion";
import ProgrammableTokensHero from "@site/src/components/ProgrammableTokens/Hero";
import PartnerStrip from "@site/src/components/ProgrammableTokens/PartnerStrip";
import RichText from "@site/src/components/ProgrammableTokens/RichText";
import ResourceCards from "@site/src/components/ProgrammableTokens/ResourceCards";
import ArchitectureDiagram from "@site/src/components/ProgrammableTokens/ArchitectureDiagram";
import DeveloperLinks from "@site/src/components/ProgrammableTokens/DeveloperLinks";
import RegulatoryFrameworks from "@site/src/components/ProgrammableTokens/RegulatoryFrameworks";
import {
  META,
  HERO,
  PARTNERS,
  WHY,
  COMPLIANCE,
  CAPABILITIES,
  ARCHITECTURE,
  REGULATORY,
  CTA,
  FAQ,
} from "@site/src/data/programmable-tokens";
import { faqJsonLd } from "@site/src/utils/jsonLd";
import styles from "./programmable-tokens.module.css";

// /programmable-tokens page: Cardano's CIP-0113 programmable tokens standard
// for regulated assets. All copy lives in src/data/programmable-tokens.js;
// this file only lays the sections out and wires the section components
// together.

// Section header. Wraps TitleWithText so the page can control the rhythm
// between the header and the content below it without touching the shared
// component.
function SectionHeader({ title }) {
  return (
    <div className={styles.sectionHeader}>
      <TitleWithText title={title} titleType="black" headingDot={true} />
    </div>
  );
}

export default function ProgrammableTokens() {
  return (
    <Layout title={META.title} description={META.description}>
      <OpenGraphInfo pageName="programmable-tokens" />
      <Head>
        <script type="application/ld+json">{faqJsonLd(FAQ.items)}</script>
      </Head>
      <ProgrammableTokensHero hero={HERO} />

      <main>
        {/* Partner and user logos: subtle grey band */}
        <BackgroundWrapper backgroundType="solidGrey">
          <BoundaryBox>
            <div className={styles.partnersSection}>
              <PartnerStrip partners={PARTNERS} />
            </div>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Why compliance has to live at the token level: white */}
        <BackgroundWrapper>
          <BoundaryBox>
            <section className={styles.section}>
              <div className={styles.introColumns}>
                <SectionHeader title={WHY.title} />
                <div className={styles.introText}>
                  {WHY.paragraphs.map((paragraph) => (
                    <p key={paragraph}>
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </div>
              </div>

              <figure className={styles.pullQuote}>
                <blockquote>
                  <p>{WHY.quote}</p>
                </blockquote>
              </figure>

              <div className={styles.context}>
                {WHY.context.map((paragraph) => (
                  <p key={paragraph}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </section>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Compliance by design, with the resources carousel: subtle grey band */}
        <BackgroundWrapper backgroundType="solidGrey">
          <BoundaryBox>
            <section className={styles.section}>
              <SectionHeader title={COMPLIANCE.title} />
              <p className={styles.lead}>
                <RichText text={COMPLIANCE.intro} />
              </p>
              <div className={styles.proseGrid}>
                {COMPLIANCE.cards.map((card) => (
                  <p key={card} className={styles.proseCard}>
                    <RichText text={card} />
                  </p>
                ))}
              </div>
              <p className={styles.muted}>
                <RichText text={COMPLIANCE.audit} />
              </p>
              <div className={styles.subsection}>
                <h2 className={styles.subheading}>{COMPLIANCE.resources.title}</h2>
                <ResourceCards resources={COMPLIANCE.resources} />
              </div>
            </section>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Capabilities: brand blue band with translucent orbs and glass cards.
            TitleWithText forces theme text colors, so the header is hand
            rolled here. */}
        <div className={styles.capabilitiesSection}>
          <BoundaryBox>
            <section className={styles.section}>
              <h2 className={clsx("headingDot", styles.invertedTitle)}>{CAPABILITIES.title}</h2>
              <div className={styles.invertedIntro}>
                {CAPABILITIES.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className={styles.capabilityGrid}>
                {CAPABILITIES.items.map((item) => (
                  <article key={item.title} className={styles.glassCard}>
                    <h3 className={styles.glassTitle}>{item.title}</h3>
                    <p className={styles.glassBody}>{item.body}</p>
                  </article>
                ))}
              </div>
              <div className={styles.capabilitiesFooter}>
                <p className={styles.invertedClosing}>{CAPABILITIES.closing}</p>
                <Link
                  className={styles.pillButton}
                  to={CAPABILITIES.button.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CAPABILITIES.button.label}
                </Link>
              </div>
            </section>
          </BoundaryBox>
        </div>

        {/* Technical architecture: white */}
        <BackgroundWrapper>
          <BoundaryBox>
            <section className={styles.section}>
              <SectionHeader title={ARCHITECTURE.title} />
              <div className={styles.architectureColumns}>
                <ArchitectureDiagram diagram={ARCHITECTURE.diagram} />
                <div className={styles.architectureText}>
                  {ARCHITECTURE.paragraphs.map((paragraph) => (
                    <p key={paragraph}>
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </div>
              </div>
              <div className={styles.subsection}>
                <h2 className={styles.subheading}>{ARCHITECTURE.developer.title}</h2>
                <DeveloperLinks links={ARCHITECTURE.developer.links} />
              </div>
            </section>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Regulatory context per jurisdiction: subtle grey band */}
        <BackgroundWrapper backgroundType="solidGrey">
          <BoundaryBox>
            <section className={styles.section}>
              <SectionHeader title={REGULATORY.title} />
              <div className={styles.regulatoryIntro}>
                {REGULATORY.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <p className={styles.disclaimer}>{REGULATORY.disclaimer}</p>
              </div>
              <RegulatoryFrameworks regulatory={REGULATORY} />
              <div className={styles.regulatoryConclusion}>
                {REGULATORY.conclusion.map((paragraph) => (
                  <p key={paragraph}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </section>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Call to action: dark navy band with translucent orbs */}
        <div className={styles.ctaSection}>
          <Link
            className={styles.ctaButton}
            to={CTA.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {CTA.label}
          </Link>
        </div>

        {/* FAQ: white */}
        <BackgroundWrapper>
          <BoundaryBox>
            <section className={styles.section}>
              <SectionHeader title={FAQ.title} />
              <Accordion className={styles.faq} items={FAQ.items} defaultOpenIndex={0} />
            </section>
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
