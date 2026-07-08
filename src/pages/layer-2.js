import React from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import Layer2Card from "@site/src/components/Layer2Card";
import { StateChannels, Rollups, Sidechains } from "@site/src/data/layer-2";
import styles from "./layer-2.module.css";

function CategoryHeader({ category, inverted = false }) {
  return (
    <div className={inverted ? styles.invertedHeader : undefined}>
      <TitleWithText
        title={category.title}
        description={[category.description]}
        titleType="black"
        headingDot={true}
      />
    </div>
  );
}

function CardGrid({ projects }) {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <Layer2Card key={project.name} {...project} />
      ))}
    </div>
  );
}

export default function Layer2() {
  return (
    <Layout
      title={translate({
        id: "layer2.layout.title",
        message: "Cardano Layer 2 Landscape",
      })}
      description={translate({
        id: "layer2.layout.description",
        message:
          "Discover the growing ecosystem of state channels, rollups, and partner chains that enhance Cardano's performance with resilience, data flexibility, and higher rates of transaction speed.",
      })}
    >
      <div className={styles.hero}>
        <SiteHero
          title={translate({
            id: "layer2.hero.title",
            message: "Cardano Layer 2 Landscape",
          })}
          description={translate({
            id: "layer2.hero.description",
            message:
              "Discover the growing ecosystem of state channels, rollups, and partner chains that enhance Cardano's performance. These scaling solutions offer resilience, data flexibility, and lower costs together with higher rates of transaction speed.",
          })}
        />
      </div>

      <main>
        {/* State Channels — light section */}
        <BackgroundWrapper>
          <BoundaryBox>
            <CategoryHeader category={StateChannels} />
            <CardGrid projects={StateChannels.projects} />
          </BoundaryBox>
          <SpacerBox size="medium" />
        </BackgroundWrapper>

        {/* Rollups — deep-blue section with centered "zoom" starburst */}
        <div className={styles.rollupsBackground}>
          <BoundaryBox>
            <CategoryHeader category={Rollups} inverted={true} />
            <CardGrid projects={Rollups.projects} />
          </BoundaryBox>
        </div>

        {/* Sidechains and Private Chains — light section */}
        <BackgroundWrapper>
          <BoundaryBox>
            <CategoryHeader category={Sidechains} />
            <CardGrid projects={Sidechains.projects} />
          </BoundaryBox>
          <SpacerBox size="medium" />
        </BackgroundWrapper>

        {/* Call to action — dark section */}
        <div className={styles.ctaSection}>
          <img
            className={styles.ctaGraphic}
            src="/img/layer-2/footer-right-graphic.svg"
            alt=""
            aria-hidden="true"
          />
          <div className={styles.ctaContainer}>
            <div className={styles.cta}>
              <h2 className={styles.ctaText}>
                <span className={styles.ctaLine1}>
                  {translate({
                    id: "layer2.cta.line1",
                    message: "Build the future of trustless infrastructure.",
                  })}
                </span>
                <span className={styles.ctaLine2}>
                  {translate({ id: "layer2.cta.line2", message: "Use Cardano." })}
                </span>
              </h2>
              <Link
                className={styles.ctaButton}
                to="https://developers.cardano.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {translate({ id: "layer2.cta.button", message: "Start Today" })}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
