/**
 * Tests for scripts/sitemap-hreflang.js, the self-healing hreflang
 * implementation used by the Docusaurus sitemap plugin.
 *
 * Background: what "self-healing hreflang" means
 * -----------------------------------------------
 * Google's hreflang spec says: when you tell a search engine that
 * `https://cardano.org/de/governance/` is the German alternate of
 * `https://cardano.org/governance/`, you are promising the German URL
 * actually serves German content. If both URLs serve identical English
 * markup (because no translation exists yet), Google sees duplicate
 * content under different URLs and either ignores the hreflang signals,
 * deduplicates the URLs, or shows the wrong one in the wrong locale.
 *
 * Most i18n hreflang setups in the wild are statically configured: every
 * page declares all locales as alternates, regardless of whether a
 * translation exists. That is fine on day one when nothing is translated
 * (Google ignores the bogus alternates) and fine on day N when everything
 * is translated, but in the middle (where this site lives) it is wrong.
 *
 * Our hook, in scripts/sitemap-hreflang.js, instead checks the
 * filesystem for each URL: does an actual translation file exist under
 * `i18n/<locale>/...`? Only those locales become hreflang alternates,
 * and untranslated pages are dropped from the per-locale sitemaps
 * altogether. The result is a sitemap that always reflects reality.
 *
 * It is "self-healing" in the sense that no config change is needed when
 * translation status changes: drop a translated `i18n/de/.../foo.md`
 * into the repo, and on the next build the German hreflang alternate
 * appears automatically (and the German sitemap starts including it).
 * Remove the file, and the alternate disappears. The hreflang annotation
 * tracks the source tree without manual list maintenance.
 *
 * Run from the project root:
 *   yarn test:sitemap            (runs unit + file-system sections)
 *   node scripts/test-sitemap-hreflang.js
 *
 * The "Build-Output Tests" section is opt-in: it only runs when a recent
 * temp-dir build is found on disk, so the tests still complete in well
 * under a second in CI without a full 5-minute build.
 *
 * Three sections:
 *   1. UNIT          pure URL helpers, no IO
 *   2. FILE-SYSTEM   assertions against the real i18n/ directory
 *   3. BUILD-OUTPUT  snapshot-style checks against the latest build/sitemap.xml
 *
 * To add new content types or locales: extend the helpers in
 * scripts/sitemap-hreflang.js and add coverage here.
 */

const fs = require('node:fs');
const path = require('node:path');

const { buildHelpers } = require('./sitemap-hreflang');

const projectRoot = path.resolve(__dirname, '..');
const siteUrl = 'https://cardano.org';
const locales = ['en', 'ja', 'de', 'es', 'vi'];
const defaultLocale = 'en';

const { stripLocale, detectLocale, localeUrl, getTranslationSourcePath, hasTranslation } =
  buildHelpers({ locales, defaultLocale, siteUrl, projectRoot });

// ---- Test runner ----

let passed = 0, failed = 0;
const fails = [];
const expect = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) passed++;
  else { failed++; fails.push({ name, expected, actual }); }
};
const section = (title) => console.log(`\n=== ${title} ===`);

// ============================================================
// 1. UNIT TESTS: pure URL helpers, no IO
// ============================================================

section('detectLocale');
expect('default at root', detectLocale('/'), 'en');
expect('default static page', detectLocale('/governance/'), 'en');
expect('default news post', detectLocale('/news/2021-foo/'), 'en');
expect('default news index', detectLocale('/news/'), 'en');
expect('default deep doc', detectLocale('/docs/get-involved/style-guide/'), 'en');
expect('de root', detectLocale('/de/'), 'de');
expect('de static', detectLocale('/de/governance/'), 'de');
expect('ja static', detectLocale('/ja/apps/'), 'ja');
expect('es deep', detectLocale('/es/docs/use-cases/payments/'), 'es');
expect('vi news', detectLocale('/vi/news/'), 'vi');
expect('not fooled by locale string in path segment', detectLocale('/news/de-something-de-something/'), 'en');
expect('not fooled by trailing locale-like slug', detectLocale('/news/de/'), 'en');

section('stripLocale');
expect('default unchanged at root', stripLocale('/'), '/');
expect('default unchanged static', stripLocale('/governance/'), '/governance/');
expect('de stripped', stripLocale('/de/governance/'), '/governance/');
expect('vi nested stripped', stripLocale('/vi/docs/get-involved/create-a-page/'), '/docs/get-involved/create-a-page/');
expect('en news unchanged', stripLocale('/news/2021-07-26-july-developer-portal/'), '/news/2021-07-26-july-developer-portal/');
expect('ja news stripped', stripLocale('/ja/news/foo-bar/'), '/news/foo-bar/');
expect('not fooled by mid-path locale', stripLocale('/governance/de-stuff/'), '/governance/de-stuff/');
expect('only strips first segment', stripLocale('/de/de-section/'), '/de-section/');

section('localeUrl');
expect('en root', localeUrl('en', '/'), 'https://cardano.org/');
expect('en static', localeUrl('en', '/governance/'), 'https://cardano.org/governance/');
expect('de static', localeUrl('de', '/governance/'), 'https://cardano.org/de/governance/');
expect('ja deep doc', localeUrl('ja', '/docs/use-cases/payments/'), 'https://cardano.org/ja/docs/use-cases/payments/');
expect('es news index', localeUrl('es', '/news/'), 'https://cardano.org/es/news/');

section('getTranslationSourcePath: structure');
expect('react page returns null (root)', getTranslationSourcePath('/', 'de'), null);
expect('react page returns null (static)', getTranslationSourcePath('/governance/', 'de'), null);
expect('news index returns null', getTranslationSourcePath('/news/', 'de'), null);
expect('docs index returns null', getTranslationSourcePath('/docs/', 'de'), null);
expect('news post: 4 candidates', getTranslationSourcePath('/news/foo-bar/', 'de').length, 4);
expect('docs page: 4 candidates', getTranslationSourcePath('/docs/communities/', 'de').length, 4);
expect('nested docs: 4 candidates', getTranslationSourcePath('/docs/use-cases/payments/', 'ja').length, 4);
expect('multi-segment news slug', getTranslationSourcePath('/news/2026/special-edition/', 'de').length, 4);

section('getTranslationSourcePath: actual paths');
expect(
  'news .md candidate',
  getTranslationSourcePath('/news/abc/', 'de')[0],
  path.join(projectRoot, 'i18n/de/docusaurus-plugin-content-blog/abc.md'),
);
expect(
  'news .mdx candidate',
  getTranslationSourcePath('/news/abc/', 'de')[1],
  path.join(projectRoot, 'i18n/de/docusaurus-plugin-content-blog/abc.mdx'),
);
expect(
  'news index.md candidate',
  getTranslationSourcePath('/news/abc/', 'de')[2],
  path.join(projectRoot, 'i18n/de/docusaurus-plugin-content-blog/abc/index.md'),
);
expect(
  'docs .md candidate',
  getTranslationSourcePath('/docs/x/', 'ja')[0],
  path.join(projectRoot, 'i18n/ja/docusaurus-plugin-content-docs/current/x.md'),
);

// ============================================================
// 2. FILE-SYSTEM TESTS: assert against real i18n/ state
// ============================================================

section('hasTranslation: defaults & React pages');
expect('default locale always true (root)', hasTranslation('/', 'en'), true);
expect('default locale always true (any)', hasTranslation('/anything/whatever/', 'en'), true);
expect('react page in de', hasTranslation('/governance/', 'de'), true);
expect('react page in vi (homepage)', hasTranslation('/', 'vi'), true);
expect('news index in all locales', hasTranslation('/news/', 'de'), true);
expect('news index in ja', hasTranslation('/news/', 'ja'), true);
expect('docs index in es', hasTranslation('/docs/', 'es'), true);

section('hasTranslation: docs known-translated to all 4 non-default');
const known_translated_docs = [
  '/docs/communities/',
  '/docs/use-cases/',
  '/docs/use-cases/payments/',
  '/docs/use-cases/agriculture/',
  '/docs/use-cases/data-storage/',
  '/docs/use-cases/defi/',
  '/docs/use-cases/digital-identity/',
  '/docs/use-cases/education/',
  '/docs/use-cases/finance-kyc/',
  '/docs/use-cases/government/',
  '/docs/use-cases/healthcare/',
  '/docs/use-cases/logistics/',
  '/docs/use-cases/music-ip/',
  '/docs/use-cases/retail/',
  '/docs/use-cases/social-programs/',
  '/docs/use-cases/tokenized-assets/',
  '/docs/use-cases/voting-systems/',
];
for (const url of known_translated_docs) {
  for (const loc of ['de', 'ja', 'es', 'vi']) {
    expect(`${url} translated in ${loc}`, hasTranslation(url, loc), true);
  }
}

section('hasTranslation: docs known-untranslated');
const known_untranslated_docs = [
  '/docs/glossary/',
  '/docs/get-involved/',
  '/docs/get-involved/style-guide/',
  '/docs/get-involved/add-app/',
  '/docs/get-involved/components/divider/',
  '/docs/get-involved/create-a-page/',
];
for (const url of known_untranslated_docs) {
  for (const loc of ['de', 'ja', 'es', 'vi']) {
    expect(`${url} NOT translated in ${loc}`, hasTranslation(url, loc), false);
  }
}

section('hasTranslation: news posts (none translated, all locales should be false)');
const sample_news = [
  '/news/2021-07-26-july-developer-portal/',
  '/news/2026-04-07-cardano-ecosystem-introduces-rwa-fund/',
  '/news/2025-03-28-weekly-development-report/',
];
for (const url of sample_news) {
  for (const loc of ['de', 'ja', 'es', 'vi']) {
    expect(`${url} NOT translated in ${loc}`, hasTranslation(url, loc), false);
  }
  expect(`${url} translated in en (default)`, hasTranslation(url, 'en'), true);
}

// ============================================================
// 3. BUILD-OUTPUT TESTS: verify the actual generated sitemap (opt-in)
// ============================================================

const findLatestBuildDir = () => {
  const tmpRoot = require('os').tmpdir();
  let parents = [tmpRoot];
  // macOS uses /var/folders/... per-user temp dirs that aren't tmpRoot here.
  // Walk one level if tmpRoot doesn't directly contain tmp.* dirs.
  try {
    const direct = fs.readdirSync(tmpRoot).filter(n => n.startsWith('tmp.'));
    if (direct.length === 0) parents = [tmpRoot];
  } catch {}
  const candidates = [];
  for (const parent of parents) {
    try {
      for (const entry of fs.readdirSync(parent)) {
        if (!entry.startsWith('tmp.')) continue;
        const p = path.join(parent, entry);
        const sitemapPath = path.join(p, 'build/sitemap.xml');
        try {
          if (fs.statSync(sitemapPath).isFile()) candidates.push({ p, mtime: fs.statSync(sitemapPath).mtimeMs });
        } catch {}
      }
    } catch {}
  }
  candidates.sort((a, b) => b.mtime - a.mtime);
  return candidates[0]?.p ?? null;
};

const buildDir = findLatestBuildDir();
section(`Build-Output (using ${buildDir || '<no temp build found, skipping>'})`);

if (!buildDir) {
  console.log('  Build-Output Tests skipped. Run "yarn build" in a temp dir to enable.');
} else {
  const parseSitemap = (file) => {
    const xml = fs.readFileSync(file, 'utf8');
    const urls = [];
    const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
    for (const block of urlBlocks) {
      const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
      const lastmod = (block.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1];
      const links = [...block.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)].map(m => ({ lang: m[1], url: m[2] }));
      urls.push({ loc, lastmod, links });
    }
    return urls;
  };

  const sitemaps = Object.fromEntries(
    locales.map(l => [
      l,
      parseSitemap(path.join(buildDir, l === defaultLocale ? 'build/sitemap.xml' : `build/${l}/sitemap.xml`)),
    ]),
  );

  expect('en sitemap has > 400 urls', sitemaps.en.length > 400, true);
  expect(
    'per-locale sitemaps roughly equal',
    [sitemaps.de, sitemaps.ja, sitemaps.es, sitemaps.vi].every(s => s.length === sitemaps.de.length),
    true,
  );
  expect('per-locale sitemap is a subset of EN by count', sitemaps.de.length < sitemaps.en.length, true);

  const enWithLastmod = sitemaps.en.filter(u => u.lastmod).length;
  expect('most EN urls have lastmod', enWithLastmod / sitemaps.en.length > 0.9, true);
  expect(
    'EN lastmod values are YYYY-MM-DD',
    sitemaps.en.filter(u => u.lastmod).every(u => /^\d{4}-\d{2}-\d{2}$/.test(u.lastmod)),
    true,
  );

  const newsPosts = sitemaps.en.filter(u => /\/news\/[^/]+\/$/.test(new URL(u.loc).pathname) && !u.loc.endsWith('/news/'));
  expect('EN has many news posts', newsPosts.length > 100, true);
  expect(
    'all EN news posts have only [en, x-default]',
    newsPosts.every(u => {
      const langs = u.links.map(l => l.lang).sort();
      return JSON.stringify(langs) === JSON.stringify(['en', 'x-default']);
    }),
    true,
  );

  for (const loc of ['de', 'ja', 'es', 'vi']) {
    const newsInLoc = sitemaps[loc].filter(
      u => /\/news\/[^/]+\/$/.test(new URL(u.loc).pathname) && !u.loc.endsWith('/news/'),
    );
    expect(`${loc} sitemap has 0 news posts`, newsInLoc.length, 0);
  }

  for (const loc of locales) {
    const newsIndex = sitemaps[loc].find(u => u.loc.endsWith('/news/'));
    expect(`${loc} sitemap contains /news/ index`, !!newsIndex, true);
    if (newsIndex) {
      const langs = newsIndex.links.map(l => l.lang).sort();
      expect(`${loc} /news/ index has all 5 + x-default hreflang`, langs, ['de', 'en', 'es', 'ja', 'vi', 'x-default']);
    }
  }

  for (const loc of locales) {
    const govPath = loc === defaultLocale ? '/governance/' : `/${loc}/governance/`;
    const gov = sitemaps[loc].find(u => new URL(u.loc).pathname === govPath);
    expect(`${loc} sitemap contains governance with full hreflang`, gov ? gov.links.length : 0, 6);
  }

  for (const loc of locales) {
    const commPath = loc === defaultLocale ? '/docs/communities/' : `/${loc}/docs/communities/`;
    const comm = sitemaps[loc].find(u => new URL(u.loc).pathname === commPath);
    expect(`${loc} sitemap contains /docs/communities/`, !!comm, true);
  }

  expect('EN has /docs/glossary/', !!sitemaps.en.find(u => new URL(u.loc).pathname === '/docs/glossary/'), true);
  for (const loc of ['de', 'ja', 'es', 'vi']) {
    const gloss = sitemaps[loc].find(u => new URL(u.loc).pathname === `/${loc}/docs/glossary/`);
    expect(`${loc} sitemap does NOT contain glossary`, !!gloss, false);
  }

  for (const loc of locales) {
    const wrongXDefault = sitemaps[loc].find(u => {
      const xd = u.links.find(l => l.lang === 'x-default');
      return xd && (xd.url.includes('/de/') || xd.url.includes('/ja/') || xd.url.includes('/es/') || xd.url.includes('/vi/'));
    });
    expect(`${loc} x-default never points to non-default locale`, !!wrongXDefault, false);
  }

  for (const loc of locales) {
    const broken = sitemaps[loc].filter(u => {
      const self = u.links.find(l => l.lang === loc);
      return self && self.url !== u.loc;
    });
    expect(`${loc} self-hreflang matches its loc`, broken.length, 0);
  }

  for (const loc of locales) {
    const noisy = sitemaps[loc].filter(u => /\/tags\/|\/news\/page\/|\/news\/tags\//.test(u.loc));
    expect(`${loc} sitemap has no tag/page noise`, noisy.length, 0);
  }
}

// ============================================================
// Summary
// ============================================================

console.log(`\n${'='.repeat(60)}`);
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('\nFailures:');
  for (const f of fails) {
    console.log(`  - ${f.name}`);
    console.log(`      expected ${JSON.stringify(f.expected)}`);
    console.log(`      got      ${JSON.stringify(f.actual)}`);
  }
}
process.exit(failed > 0 ? 1 : 0);
