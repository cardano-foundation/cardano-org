import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import Head from "@docusaurus/Head";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BrandAssetsHero from "@site/src/components/BrandAssets/Hero";
import PillLink from "@site/src/components/BrandAssets/PillLink";
import {
  META,
  ANCHORS,
  HERO,
  INTRO,
  TONE,
  LOGO,
  ASSETS,
  COLORS,
  FONT,
  IN_USE,
} from "@site/src/data/brand-assets";
import styles from "./brand-assets.module.css";

// /brand-assets page: the Cardano brand kit (logo, colors, type, and examples
// of the brand in use), built from the Brand Hub Figma file. All copy and
// links live in src/data/brand-assets.js; this file lays the sections out.

// Showcase mosaic columns, top to bottom, as in the design. Phones stack the
// cards in the order of IN_USE.cards instead (see .mosaic in the CSS).
const MOSAIC_COLUMNS = [
  ["fairerWorld", "changeBegins"],
  ["roadmap"],
  ["buildTheFuture", "decentralization"],
];

// Large section title with a rule underneath ("Logo", "Colors", "Font",
// "The brand-in-use"). The id is the target of the hero tiles.
function SectionTitle({ id, children }) {
  return (
    <div className={styles.sectionTitle}>
      <h2 id={id} className={styles.sectionHeading}>
        {children}
      </h2>
    </div>
  );
}

function Paragraphs({ items, className }) {
  return (
    <div className={clsx(styles.paragraphs, className)}>
      {items.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
}

function Swatch({ swatch, detailed }) {
  return (
    <div
      className={clsx(
        styles.swatch,
        swatch.tone === "dark" ? styles.swatchDark : styles.swatchLight,
        swatch.hex === "#FFFAF3" && styles.swatchClarity,
      )}
      style={{ backgroundColor: swatch.hex }}
    >
      <span className={styles.swatchName}>{swatch.name}</span>
      {detailed && (
        <span className={styles.swatchValues}>
          <span>{swatch.hex}</span>
          <span>{swatch.rgb}</span>
          <span>{swatch.cmyk}</span>
          <span>{swatch.pantone}</span>
        </span>
      )}
    </div>
  );
}

export default function BrandAssets() {
  const { withBaseUrl: img } = useBaseUrlUtils();
  const horizontalLogoUrl = img("/img/brand-assets/cardano-horizontal-blue.svg");
  const safetyAreaUrl = img("/img/brand-assets/logo-safety-area.svg");
  const starburstUrl = img("/img/brand-assets/cardano-starburst-blue.svg");
  const introArtUrl = img("/img/brand-assets/intro-art.webp");
  const fontOrbsUrl = img("/img/brand-assets/font-orbs.webp");

  return (
    <Layout title={META.title} description={META.description}>
      <OpenGraphInfo
        pageName="brand-assets"
        title={META.title}
        description={META.description}
      />
      <Head>
        <meta name="keywords" content={META.keywords} />
      </Head>
      <div className={styles.page}>
        <BrandAssetsHero hero={HERO} />

        <main>
          {/* Intro: title and three statements, with the orb artwork */}
          <section className={styles.introSection}>
            <BoundaryBox className={styles.scaledBox}>
              <div className={styles.introGrid}>
                <div className={styles.introText}>
                  <h2 className={styles.introTitle}>{INTRO.title}</h2>
                  <ul className={styles.introList}>
                    {INTRO.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.introArt}>
                  <img src={introArtUrl} alt="" width="1296" height="1008" loading="lazy" />
                </div>
              </div>
            </BoundaryBox>
          </section>

          {/* Tone: "Cardano is..." on the blue arcs card */}
          <section className={styles.toneSection}>
            <BoundaryBox>
              <div className={styles.toneCard}>
                <p className={styles.toneEyebrow}>{TONE.eyebrow}</p>
                <dl className={styles.toneList}>
                  {TONE.traits.map((trait) => (
                    <div key={trait.word} className={styles.toneRow}>
                      <dt className={styles.toneWord}>{trait.word}</dt>
                      <span className={styles.toneLine} aria-hidden="true" />
                      <dd className={styles.toneMeaning}>{trait.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </BoundaryBox>
          </section>

          {/* Logo */}
          <section className={styles.section}>
            <BoundaryBox>
              <SectionTitle id={ANCHORS.logo}>{LOGO.title}</SectionTitle>

              <div className={clsx(styles.splitRow, styles.logoRow)}>
                <div className={styles.copyBlock}>
                  <h3 className={styles.subheading}>{LOGO.primary.title}</h3>
                  <Paragraphs items={LOGO.primary.paragraphs} />
                  <PillLink href={LOGO.primary.button.href} className={styles.copyButton}>
                    {LOGO.primary.button.label}
                  </PillLink>
                </div>
                <figure className={styles.logoPanel}>
                  <div className={styles.logoLockup}>
                    <img
                      src={horizontalLogoUrl}
                      alt={LOGO.primary.imageAlt}
                      width="1250"
                      height="251"
                    />
                    <div className={styles.logoLegend} aria-hidden="true">
                      <span className={styles.legendIcon}>
                        <span className={styles.legendBracket} />
                        <span className={styles.legendLabel}>
                          <span className={styles.legendPrefix}>{LOGO.primary.iconLabelPrefix}</span>{" "}
                          {LOGO.primary.iconLabel}
                        </span>
                      </span>
                      <span className={styles.legendWordmark}>
                        <span className={styles.legendBracket} />
                        <span className={styles.legendLabel}>{LOGO.primary.wordmarkLabel}</span>
                      </span>
                    </div>
                  </div>
                </figure>
              </div>

              <div className={clsx(styles.splitRow, styles.splitRowReverse, styles.safetyRow)}>
                <figure className={styles.logoPanel}>
                  <img
                    className={styles.safetyImage}
                    src={safetyAreaUrl}
                    alt={LOGO.safety.imageAlt}
                    width="518"
                    height="165"
                    loading="lazy"
                  />
                </figure>
                <div className={styles.copyBlock}>
                  <h3 className={styles.subheading}>{LOGO.safety.title}</h3>
                  <Paragraphs items={LOGO.safety.paragraphs} />
                </div>
              </div>

              <div className={styles.starburstRow}>
                <h3 className={clsx(styles.subheading, styles.starburstTitle)}>
                  {LOGO.starburst.title}
                </h3>
                <p className={clsx(styles.bodyText, styles.starburstBody)}>{LOGO.starburst.body}</p>
                <img
                  className={styles.starburstImage}
                  src={starburstUrl}
                  alt={LOGO.starburst.imageAlt}
                  width="375"
                  height="347"
                  loading="lazy"
                />
              </div>
            </BoundaryBox>
          </section>

          {/* Individual logo downloads: blue band with a Clarity card */}
          <section className={styles.assetsBand}>
            <BoundaryBox>
              <div className={styles.assetsCard}>
                <h2 className={styles.assetsTitle}>{ASSETS.title}</h2>
                <div className={styles.assetsLinks}>
                  {ASSETS.links.map((link) => (
                    <PillLink key={link.href} href={link.href} fixed className={styles.assetsButton}>
                      {link.label}
                    </PillLink>
                  ))}
                </div>
              </div>
            </BoundaryBox>
          </section>

          {/* Colors */}
          <section className={styles.section}>
            <BoundaryBox>
              <SectionTitle id={ANCHORS.colors}>{COLORS.title}</SectionTitle>

              <div className={clsx(styles.splitRow, styles.colorsRow)}>
                <div className={styles.copyBlock}>
                  <h3 className={styles.subheading}>{COLORS.primary.title}</h3>
                  <Paragraphs items={COLORS.primary.paragraphs} />
                  <PillLink href={COLORS.primary.button.href} className={styles.copyButton}>
                    {COLORS.primary.button.label}
                  </PillLink>
                </div>
                <div className={styles.primaryStrip}>
                  {COLORS.primary.swatches.map((swatch) => (
                    <Swatch key={swatch.hex} swatch={swatch} />
                  ))}
                </div>
              </div>

              <div className={clsx(styles.splitRow, styles.colorsRow, styles.extendedRow)}>
                <div className={styles.copyBlock}>
                  <h3 className={styles.subheading}>{COLORS.extended.title}</h3>
                  <Paragraphs items={COLORS.extended.paragraphs} />
                </div>
                <div className={styles.extendedGrid}>
                  {COLORS.extended.swatches.map((swatch) => (
                    <Swatch key={swatch.hex} swatch={swatch} detailed />
                  ))}
                </div>
              </div>
            </BoundaryBox>
          </section>

          {/* Font */}
          <section className={styles.section}>
            <BoundaryBox>
              <SectionTitle id={ANCHORS.font}>{FONT.title}</SectionTitle>

              <div className={styles.fontRow}>
                <div className={styles.copyBlock}>
                  <h3 className={clsx(styles.subheading, styles.subheadingAccent)}>{FONT.name}</h3>
                  <p className={styles.bodyText}>{FONT.body}</p>
                  <PillLink href={FONT.button.href} className={styles.copyButton}>
                    {FONT.button.label}
                  </PillLink>
                </div>
                <div className={styles.specimen} aria-hidden="true">
                  <span className={styles.specimenLabel}>{FONT.specimenLabel}</span>
                  <span className={styles.specimenName}>{FONT.name}</span>
                </div>
              </div>

              <div className={styles.weightsBand}>
                <img className={styles.weightsOrbs} src={fontOrbsUrl} alt="" loading="lazy" />
                <p className={styles.weightsBody}>{FONT.weightsBody}</p>
                <div className={styles.weightsList}>
                  {FONT.weights.map((weight) => (
                    <div key={weight.name} className={styles.weight} style={{ fontWeight: weight.weight }}>
                      <span className={styles.weightName}>{weight.name}</span>
                      <span className={styles.weightSample}>
                        {weight.lines.map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </BoundaryBox>
          </section>

          {/* The brand in use */}
          <section className={clsx(styles.section, styles.inUseSection)}>
            <BoundaryBox className={styles.scaledBox}>
              <SectionTitle id={ANCHORS.inUse}>{IN_USE.title}</SectionTitle>

              <img
                className={styles.inUseHero}
                src={img(IN_USE.hero.src)}
                alt={IN_USE.hero.alt}
                width={IN_USE.hero.width}
                height={IN_USE.hero.height}
                loading="lazy"
              />
              <div className={styles.inUseIntro}>
                {IN_USE.intro.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>

              <div className={styles.mosaic}>
                {MOSAIC_COLUMNS.map((slots) => (
                  <div key={slots.join("-")} className={styles.mosaicColumn}>
                    {slots.map((slot) => {
                      const index = IN_USE.cards.findIndex((card) => card.slot === slot);
                      const card = IN_USE.cards[index];
                      return (
                        <img
                          key={slot}
                          className={styles.mosaicCard}
                          style={{ order: index }}
                          src={img(card.src)}
                          alt={card.alt}
                          width={card.width}
                          height={card.height}
                          loading="lazy"
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {IN_USE.examples.map((example, index) => (
                <div
                  key={example.title}
                  className={clsx(styles.splitRow, styles.exampleRow, index === 0 && styles.exampleRowFirst)}
                >
                  <div className={styles.copyBlock}>
                    <h3 className={clsx(styles.subheading, styles.subheadingAccent)}>{example.title}</h3>
                    <p className={styles.bodyText}>{example.body}</p>
                  </div>
                  <img
                    className={styles.exampleImage}
                    src={img(example.image.src)}
                    alt={example.image.alt}
                    width={example.image.width}
                    height={example.image.height}
                    loading="lazy"
                  />
                </div>
              ))}
            </BoundaryBox>
          </section>
        </main>
      </div>
    </Layout>
  );
}
