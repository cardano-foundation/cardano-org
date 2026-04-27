// Auto-discovers MDX collection files in this directory and renders a list of cards
// linking to each. Pattern mirrors src/pages/insights/index.js.
//
// Each collection MDX must export `frontMatter` with at least `title` and `description`.
// The route slug is derived from the filename (e.g., first-steps.mdx → /apps/collections/first-steps).

import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import { getCollections } from "@site/src/data/collections";

import styles from "./styles.module.css";

const collections = getCollections();

const TITLE = translate({
  id: "apps.collections.title",
  message: "Cardano App Collections",
});
const DESCRIPTION = translate({
  id: "apps.collections.description",
  message: "Curated bundles of Cardano apps for specific use cases.",
});

export default function CollectionsIndex() {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <OpenGraphInfo pageName="apps" />
      <SiteHero title={TITLE} description={DESCRIPTION} />
      <main className="container margin-top--lg margin-bottom--xl">
        <p className={styles.lede}>
          {translate({
            id: "apps.collections.lede",
            message:
              "Each collection groups apps around a specific user goal. They are curated by page maintainers, not exhaustive — see /apps for the full directory.",
          })}
        </p>
        {collections.length === 0 ? (
          <p>
            {translate({
              id: "apps.collections.empty",
              message: "No collections published yet.",
            })}
          </p>
        ) : (
          <ul className={styles.collectionList}>
            {collections.map((c) => (
              <li key={c.slug} className={styles.collectionCard}>
                <h2 className={styles.collectionTitle}>
                  <Link to={c.permalink}>{c.title}</Link>
                </h2>
                {c.description && (
                  <p className={styles.collectionDescription}>{c.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </Layout>
  );
}
