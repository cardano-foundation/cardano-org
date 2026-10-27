import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import PillLink from "@site/src/components/BrandAssets/PillLink";
import styles from "./styles.module.css";

// Brand assets hero (Figma 1:111, mobile 8:109 and 8:116). The title, lead, and
// download button on Clarity, then a Cardano Blue band with four tiles that
// jump to the Logo, Colors, Font, and Brand-in-use sections.
//
// The tile artwork is decorative (aria-hidden); each tile's accessible name
// is its pill label. The Type tile is live text so it stays sharp.
//
// Props:
//   hero - HERO from src/data/brand-assets.js

function TileArt({ art }) {
  const starburstUrl = useBaseUrl("/img/brand-assets/cardano-starburst-blue.svg");
  const colorsUrl = useBaseUrl("/img/brand-assets/hero-colors.webp");
  const inUseUrl = useBaseUrl("/img/brand-assets/hero-in-use.webp");

  switch (art) {
    case "logo":
      return <img src={starburstUrl} alt="" className={styles.artStarburst} />;
    case "colors":
      return <img src={colorsUrl} alt="" className={styles.artColors} />;
    case "type":
      return (
        <span className={styles.artType}>
          <span>CARD</span>
          <span>
            AN<span className={styles.artTypeAccent}>O</span>
          </span>
          <span>CARD</span>
        </span>
      );
    case "inUse":
      return <img src={inUseUrl} alt="" className={styles.artPhoto} />;
    default:
      return null;
  }
}

export default function BrandAssetsHero({ hero }) {
  return (
    <header className={styles.hero}>
      <div className={styles.intro}>
        <BoundaryBox>
          <div className={styles.introGrid}>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>{hero.title}</h1>
              <p className={styles.subtitle}>{hero.subtitle}</p>
            </div>
            <div className={styles.lead}>
              <p className={styles.body}>{hero.body}</p>
              <PillLink href={hero.button.href} className={styles.button}>
                {hero.button.label}
              </PillLink>
            </div>
          </div>
        </BoundaryBox>
      </div>

      <div className={styles.band}>
        <BoundaryBox>
          <nav className={styles.tiles} aria-label={hero.title}>
            {hero.tiles.map((tile) => (
              <Link
                key={tile.anchor}
                to={`#${tile.anchor}`}
                className={clsx(styles.tile, styles[`tile_${tile.art}`])}
              >
                <span className={styles.art} aria-hidden="true">
                  <TileArt art={tile.art} />
                </span>
                <span className={styles.tileLabel}>{tile.label}</span>
              </Link>
            ))}
          </nav>
        </BoundaryBox>
      </div>
    </header>
  );
}
