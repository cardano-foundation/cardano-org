//
// Custom Docusaurus plugin: reads glossary/<slug>.md, registers a static route at
// /glossary/<slug> for each term, and exposes index + redirect data via globalData.
//
// Per-locale: prefers i18n/<locale>/glossary/<slug>.md when present, else falls back to
// the canonical English file. This keeps Phase 1 (EN-only migration) trivial and lets
// Phase 2 (Crowdin sync into i18n/<locale>/glossary/) work without plugin changes.
//

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const GLOSSARY_DIR_NAME = 'glossary';

const VALID_LEVELS = new Set(['beginner', 'intermediate', 'advanced']);

// Parses a single term file without applying defaults. Missing optional fields
// stay undefined so a later baseline-merge can tell "translator omitted this"
// from "translator wrote an explicit empty value".
function parseTermFile(filepath, slug) {
  const raw = fs.readFileSync(filepath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Glossary file ${filepath} has no frontmatter block`);
  const fm = yaml.load(match[1]) || {};
  const body = match[2].trim();
  if (!fm.title) throw new Error(`Glossary file ${filepath} missing required 'title'`);
  if (!fm.short) throw new Error(`Glossary file ${filepath} missing required 'short'`);
  if (!fm.category) throw new Error(`Glossary file ${filepath} missing required 'category'`);
  if ('level' in fm && !VALID_LEVELS.has(fm.level)) {
    throw new Error(`Glossary file ${filepath} has invalid 'level': ${JSON.stringify(fm.level)}. Must be beginner, intermediate, or advanced (or omit the field).`);
  }
  return { slug, fm, body };
}

// Builds the final term shape, applying defaults for missing optional fields.
// When a per-locale file is partial (Crowdin only round-trips user-facing copy),
// structural fields fall back to the English baseline so e.g. `level: beginner`
// from ada.md still shows in /de/glossary/ada/ even if the locale file omits it.
function resolveTerm(localeParse, baselineParse) {
  const fm = localeParse.fm;
  const base = baselineParse ? baselineParse.fm : {};
  const pick = (key) => (key in fm ? fm[key] : base[key]);
  return {
    slug: localeParse.slug,
    title: fm.title,
    short: fm.short,
    category: fm.category,
    aliases: pick('aliases') || [],
    mentalModel: pick('mentalModel') || null,
    related: pick('related') || [],
    sources: pick('sources') || [],
    // Optional cross-link to the canonical cardano.org page that explains
    // this concept in depth (e.g. stablecoin → /stablecoins). Rendered as a
    // prominent CTA on the term detail page.
    link: pick('link') || null,
    // Reader-level hint: beginner concepts surface on the index with a chip
    // and advanced concepts are flagged to set expectations for protocol-
    // research-heavy entries. Intermediate is the implicit default and
    // shows no badge.
    level: pick('level') || 'intermediate',
    body: localeParse.body || (baselineParse ? baselineParse.body : ''),
  };
}

module.exports = function glossaryRoutesPlugin(context) {
  return {
    name: 'glossary-routes',

    async loadContent() {
      const defaultDir = path.join(context.siteDir, GLOSSARY_DIR_NAME);
      const localeDir = path.join(
        context.siteDir,
        'i18n',
        context.i18n.currentLocale,
        GLOSSARY_DIR_NAME,
      );
      if (!fs.existsSync(defaultDir)) {
        throw new Error(`Glossary source dir not found: ${defaultDir}`);
      }
      const files = fs.readdirSync(defaultDir).filter(f => f.endsWith('.md'));
      const terms = files.map(file => {
        const slug = path.basename(file, '.md');
        const baseline = parseTermFile(path.join(defaultDir, file), slug);
        const localePath = path.join(localeDir, file);
        if (!fs.existsSync(localePath)) {
          return resolveTerm(baseline, null);
        }
        const locale = parseTermFile(localePath, slug);
        return resolveTerm(locale, baseline);
      });
      // Stable alphabetical order by title (case-insensitive). Keeps index
      // deterministic across builds.
      terms.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
      return terms;
    },

    async contentLoaded({ content, actions }) {
      const { addRoute, createData, setGlobalData } = actions;
      const baseUrl = context.baseUrl;

      for (const term of content) {
        const dataFile = await createData(
          `glossary-term-${term.slug}.json`,
          JSON.stringify(term),
        );
        addRoute({
          path: `${baseUrl}${GLOSSARY_DIR_NAME}/${term.slug}`,
          component: '@site/src/components/GlossaryTerm',
          modules: { term: dataFile },
          exact: true,
        });
      }

      // Index entries are a slim subset; body is intentionally omitted so the
      // globalData blob stays small in the client bundle.
      const indexEntries = content.map(t => ({
        slug: t.slug,
        title: t.title,
        short: t.short,
        category: t.category,
        aliases: t.aliases,
        level: t.level,
      }));

      // Redirect map: maps the OLD docusaurus-generated anchor IDs from the
      // single-page glossary (e.g. /docs/glossary#ada) to the new slugs.
      // For the migrated file set the mapping is identity (slug === old anchor)
      // with one exception (Jörmungandr → jormungandr); we still build the map
      // explicitly so a future slug rename only touches this plugin.
      const redirectMap = {};
      for (const t of content) {
        redirectMap[t.slug] = t.slug;
      }
      // Hand-added: non-ASCII anchor for Jörmungandr is what docusaurus produced
      // before; map it to the cleaner ASCII slug we use now. Guard against
      // accidentally overwriting a future term that uses the same key as its
      // canonical slug.
      if (!('jörmungandr' in redirectMap)) {
        redirectMap['jörmungandr'] = 'jormungandr';
      }

      setGlobalData({
        terms: indexEntries,
        redirectMap,
      });
    },
  };
};
