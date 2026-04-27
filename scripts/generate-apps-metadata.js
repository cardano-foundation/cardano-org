//
// Generates src/data/apps-metadata.json from src/data/apps.js for the apps-routes plugin.
// Each entry includes a slug derived from the title, plus the JSON-serializable Showcase
// fields. Preview images and walletFeatures are intentionally omitted — preview uses
// webpack require() (not JSON-serializable) and walletFeatures is consumed by a separate
// path. Detail pages render only icon + text fields in V1.
// Command: yarn run build-apps-meta
//

const fs = require('fs');
const path = require('path');
const {
  parseShowcases,
  assertEntryCountMatches,
} = require('./lib/parse-apps.cjs');

const appsSource = path.join(__dirname, '../src/data/apps.js');
const outputPath = path.join(__dirname, '../src/data/apps-metadata.json');

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const source = fs.readFileSync(appsSource, 'utf8');
const { apps, block } = parseShowcases(source);
assertEntryCountMatches(apps, block);

const slugs = new Set();
const enriched = apps.map((app) => {
  const slug = slugify(app.title);
  if (slugs.has(slug)) {
    console.error(`Slug collision: "${slug}" (from "${app.title}")`);
    process.exit(1);
  }
  slugs.add(slug);
  return { slug, ...app };
});

fs.writeFileSync(outputPath, JSON.stringify(enriched, null, 2));
console.log(`✅ Generated apps-metadata.json with ${enriched.length} apps`);
