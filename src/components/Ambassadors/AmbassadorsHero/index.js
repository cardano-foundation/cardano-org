import React, { useEffect, useMemo, useState } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

import ambassadorsData from "@site/src/data/ambassadorsData.json";
import impactData from "@site/src/data/ambassadorsImpact.json";
import centroids from "@site/src/data/countryCentroids.json";

import { present, ambassadorContributions } from "@site/src/utils/ambassadorLanguages";
import { project } from "@site/src/utils/mapProjection";
import AmbassadorsMap from "@site/src/components/Ambassadors/AmbassadorsMap";
import AmbassadorsStatsRow from "@site/src/components/Ambassadors/AmbassadorsStatsRow";
import FeaturedCard from "@site/src/components/Ambassadors/AmbassadorsHero/FeaturedCard";

const TONE_BY_AREA = {
  content: "content",
  events: "events",
  meetups: "events",
  education: "education",
  software: "openSource",
  development: "openSource",
  translations: "translations",
  moderation: "channels",
};

function areaToTag(area) {
  const tone = TONE_BY_AREA[area.toLowerCase()] || "content";
  return { label: area, tone };
}

function buildFeaturedPool() {
  const withBio = ambassadorsData.filter((a) => present(a.tagline));
  const base = withBio.length >= 3 ? withBio : ambassadorsData;
  return base
    .filter((a) => centroids[a.country])
    .map((a) => {
      const [lon, lat] = centroids[a.country];
      const [x, y] = project(lon, lat);
      const areas = ambassadorContributions(a);
      const tags = areas.length > 0 ? areas.slice(0, 3).map(areaToTag) : [];
      return { ...a, x, y, tags };
    });
}

function shuffled(array) {
  const out = array.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const AMBASSADORS_COUNT = ambassadorsData.length;
const COUNTRIES_COUNT = new Set(ambassadorsData.map((a) => a.country)).size;
const FEATURED_POOL = buildFeaturedPool();

export default function AmbassadorsHero() {
  const [items, setItems] = useState(FEATURED_POOL);
  const [activeCountry, setActiveCountry] = useState(FEATURED_POOL[0]?.country || null);
  const [lineHidden, setLineHidden] = useState(false);

  useEffect(() => {
    setItems(shuffled(FEATURED_POOL));
  }, []);

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
                  "A global network of community leaders educating, organizing, moderating, building and supporting Cardano across the world.",
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
                {translate({ id: "ambassadors.hero.cta.join", message: "Become an Ambassador" })}
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroMap}>
              <AmbassadorsMap
                ambassadors={ambassadorsData}
                centroids={centroids}
                activeCountry={activeCountry}
                connectorHidden={lineHidden}
              />
              {items.length > 0 && (
                <FeaturedCard
                  items={items}
                  onActiveChange={setActiveCountry}
                  onLineHiddenChange={setLineHidden}
                />
              )}
            </div>
          </div>
        </div>

        <AmbassadorsStatsRow
          ambassadorsCount={AMBASSADORS_COUNT}
          countriesCount={COUNTRIES_COUNT}
          languages={impactData.stats.languages}
          channels={impactData.data.channelsModerated}
          platforms={impactData.stats.platforms}
        />
      </div>
    </header>
  );
}
