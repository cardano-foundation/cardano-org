//
// Generates src/data/apps-metadata.json from src/data/apps.js for the apps-routes plugin.
// Each entry includes a slug derived from the title, plus the JSON-serializable Showcase
// fields. The preview screenshot lives under src/data/app-screenshots/ (consumed by
// webpack require() at /apps index render); this script copies each preview to
// static/img/app-screenshots/ and writes a `previewUrl` so the SSR-rendered detail
// pages can reference it via a plain URL. walletFeatures is consumed by a separate path.
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
const screenshotsSrcDir = path.join(__dirname, '../src/data/app-screenshots');
const screenshotsStaticDir = path.join(__dirname, '../static/img/app-screenshots');

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

fs.mkdirSync(screenshotsStaticDir, { recursive: true });
const expectedFilenames = new Set();

const slugs = new Set();
const enriched = apps.map((app) => {
  const slug = slugify(app.title);
  if (slugs.has(slug)) {
    console.error(`Slug collision: "${slug}" (from "${app.title}")`);
    process.exit(1);
  }
  slugs.add(slug);

  let previewUrl = null;
  const { previewFile, extraPreviewFiles = [], ...rest } = app;
  const allFiles = [previewFile, ...extraPreviewFiles].filter(Boolean);
  for (const file of allFiles) {
    const srcFile = path.join(screenshotsSrcDir, file);
    const destFile = path.join(screenshotsStaticDir, file);
    if (!fs.existsSync(srcFile)) {
      console.error(`Missing preview file: ${srcFile} (referenced by "${app.title}")`);
      process.exit(1);
    }
    fs.copyFileSync(srcFile, destFile);
    expectedFilenames.add(file);
  }
  if (previewFile) previewUrl = `/img/app-screenshots/${previewFile}`;
  const previewUrls = allFiles.map((f) => `/img/app-screenshots/${f}`);
  return { slug, ...rest, previewUrl, previewUrls };
});

// Drop stale files from the static mirror so deletions in apps.js propagate.
for (const name of fs.readdirSync(screenshotsStaticDir)) {
  if (!expectedFilenames.has(name)) {
    fs.unlinkSync(path.join(screenshotsStaticDir, name));
  }
}

fs.writeFileSync(outputPath, JSON.stringify(enriched, null, 2));
console.log(`✅ Generated apps-metadata.json with ${enriched.length} apps`);
console.log(`   Mirrored ${expectedFilenames.size} preview screenshots to static/img/app-screenshots/`);
