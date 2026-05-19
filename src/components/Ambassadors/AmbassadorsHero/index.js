import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

import ambassadorsData from "@site/src/data/ambassadorsData.json";
import impactData from "@site/src/data/ambassadorsImpact.json";
import centroids from "@site/src/data/countryCentroids.json";

import AmbassadorsMap from "@site/src/components/Ambassadors/AmbassadorsMap";
import AmbassadorsStatsRow from "@site/src/components/Ambassadors/AmbassadorsStatsRow";
import FeaturedCard from "@site/src/components/Ambassadors/AmbassadorsHero/FeaturedCard";

function resolveFeatured(featuredHero) {
  if (!featuredHero) return [];
  const entries = featuredHero.ambassadors
    || (featuredHero.ambassadorRef
      ? [{ ref: featuredHero.ambassadorRef, tags: featuredHero.tags }]
      : []);
  const byName = new Map(ambassadorsData.map((a) => [a.name, a]));
  return entries
    .map((e) => {
      const a = byName.get(e.ref);
      return a ? { ...a, tags: e.tags || [] } : null;
    })
    .filter(Boolean);
}

const AMBASSADORS_COUNT = ambassadorsData.length;
const COUNTRIES_COUNT = new Set(ambassadorsData.map((a) => a.country)).size;
const FEATURED = resolveFeatured(impactData.featuredHero);

export default function AmbassadorsHero() {

  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              {translate({ id: "ambassadors.hero.eyebrow", message: "Since 2018" })}
            </span>
            <h1 className={styles.heroTitle}>
              {translate({ id: "ambassadors.hero.titleNew", message: "Cardano Ambassadors" })}
              <br />
              <span className={styles.heroTitleAccent}>
                {translate({ id: "ambassadors.hero.titleAccent", message: "in action" })}
              </span>
            </h1>
            <p className={styles.heroLede}>
              {translate({
                id: "ambassadors.hero.lede",
                message:
                  "A global network of community leaders educating, organizing, translating, building and supporting Cardano across the world.",
              })}
            </p>
            <div className={styles.heroCtas}>
              <Link to="#directory" className={styles.primaryCta}>
                {translate({ id: "ambassadors.hero.cta.directory", message: "View directory" })}
              </Link>
              <Link
                to="https://forum.cardano.org/t/cardano-ambassadors-roles-and-responsibilities/154055"
                className={styles.secondaryCta}
              >
                {translate({ id: "ambassadors.hero.cta.join", message: "Become an ambassador" })}
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroMap}>
              <AmbassadorsMap ambassadors={ambassadorsData} centroids={centroids} />
              {FEATURED.length > 0 && <FeaturedCard items={FEATURED} />}
            </div>
          </div>
        </div>

        <AmbassadorsStatsRow
          ambassadorsCount={AMBASSADORS_COUNT}
          countriesCount={COUNTRIES_COUNT}
          languages={impactData.stats.languages}
          channels={impactData.stats.moderatedChannels}
          platforms={impactData.stats.platforms}
        />
      </div>
    </header>
  );
}
