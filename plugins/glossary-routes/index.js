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

function readTermFile(filepath, slug) {
  const raw = fs.readFileSync(filepath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Glossary file ${filepath} has no frontmatter block`);
  const fm = yaml.load(match[1]) || {};
  const body = match[2].trim();
  if (!fm.title) throw new Error(`Glossary file ${filepath} missing required 'title'`);
  if (!fm.short) throw new Error(`Glossary file ${filepath} missing required 'short'`);
  if (!fm.category) throw new Error(`Glossary file ${filepath} missing required 'category'`);
  return {
    slug,
    title: fm.title,
    short: fm.short,
    category: fm.category,
    aliases: fm.aliases || [],
    featured: Boolean(fm.featured),
    mentalModel: fm.mentalModel || null,
    related: fm.related || [],
    sources: fm.sources || [],
    body,
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
        const localePath = path.join(localeDir, file);
        const filepath = fs.existsSync(localePath)
          ? localePath
          : path.join(defaultDir, file);
        return readTermFile(filepath, slug);
      });
      // Stable alphabetical order by title (case-insensitive) — keeps index
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

      // Index entries are a slim subset — body is intentionally omitted so the
      // globalData blob stays small in the client bundle.
      const indexEntries = content.map(t => ({
        slug: t.slug,
        title: t.title,
        short: t.short,
        category: t.category,
        aliases: t.aliases,
        featured: t.featured,
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
