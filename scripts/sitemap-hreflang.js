/**
 * Self-healing hreflang annotations for the Docusaurus sitemap plugin.
 *
 * "Self-healing" means: instead of statically declaring all locales as
 * hreflang alternates for every page (which lies to Google about untranslated
 * pages), we check the filesystem at build time. A locale only becomes a
 * hreflang alternate for a page when an actual translation file exists under
 * `i18n/<locale>/...`. Drop a translation in, the alternate appears on the
 * next build; remove it, the alternate disappears. No config maintenance.
 *
 * For every URL in the sitemap, we add `<xhtml:link rel="alternate" hreflang="...">`
 * entries pointing to the equivalent page in each locale that actually has the
 * translated content. We also drop URLs from per-locale sitemaps when the locale
 * has no translation for that page, so we never declare a German URL as an
 * alternate for an English-only article.
 *
 * Three content classes:
 *
 *   1. React pages (src/pages/*)         -> always available in every locale,
 *                                          translations come from i18n JSON
 *                                          catalogs (docusaurus-theme-classic,
 *                                          per-page Translate calls)
 *
 *   2. Docs (docs/*.md)                  -> per-locale source file at
 *                                          i18n/<locale>/docusaurus-plugin-content-docs/current/<path>.md
 *
 *   3. Blog / news (blog/*.md)           -> per-locale source file at
 *                                          i18n/<locale>/docusaurus-plugin-content-blog/<slug>.md
 *                                          (also matches <slug>/index.md for
 *                                          posts laid out as a directory)
 *
 * The news index `/news/` is treated as a React-style page since it is just a
 * paginated list whose UI is fully translated.
 *
 * To extend: if you add a new content plugin (e.g. a second blog at /events),
 * add a clause in `getTranslationSourcePath` that maps its URL prefix to the
 * expected `i18n/<locale>/docusaurus-plugin-<id>/...` path.
 *
 * The helpers are exported separately so they can be unit-tested without
 * spinning up a full Docusaurus build (see scripts/test-sitemap-hreflang.js).
 */

const fs = require('node:fs');
const path = require('node:path');

/**
 * @param {{ locales: string[], defaultLocale: string, siteUrl: string, projectRoot: string }} cfg
 */
function buildHelpers({ locales, defaultLocale, siteUrl, projectRoot }) {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

  // "/de/governance/" -> "/governance/", "/governance/" -> "/governance/"
  const stripLocale = (pathname) => {
    for (const l of locales) {
      if (l !== defaultLocale && pathname.startsWith(`/${l}/`)) {
        return pathname.slice(l.length + 1);
      }
    }
    return pathname;
  };

  // "/de/governance/" -> "de", "/governance/" -> defaultLocale
  const detectLocale = (pathname) => {
    for (const l of locales) {
      if (l !== defaultLocale && pathname.startsWith(`/${l}/`)) return l;
    }
    return defaultLocale;
  };

  const localeUrl = (locale, neutralPathname) =>
    locale === defaultLocale
      ? `${normalizedSiteUrl}${neutralPathname}`
      : `${normalizedSiteUrl}/${locale}${neutralPathname}`;

  // Returns an array of candidate file paths for the translation, or null when
  // the URL is a React page (no source file to check; assumed always-translated).
  const getTranslationSourcePath = (neutralPathname, locale) => {
    const trimmed = neutralPathname.replace(/\/$/, '');

    const newsMatch = trimmed.match(/^\/news\/(.+)$/);
    if (newsMatch) {
      const slug = newsMatch[1];
      const baseDir = path.join(projectRoot, 'i18n', locale, 'docusaurus-plugin-content-blog');
      return [
        path.join(baseDir, `${slug}.md`),
        path.join(baseDir, `${slug}.mdx`),
        path.join(baseDir, slug, 'index.md'),
        path.join(baseDir, slug, 'index.mdx'),
      ];
    }

    const docsMatch = trimmed.match(/^\/docs\/(.+)$/);
    if (docsMatch) {
      const docPath = docsMatch[1];
      const baseDir = path.join(projectRoot, 'i18n', locale, 'docusaurus-plugin-content-docs', 'current');
      return [
        path.join(baseDir, `${docPath}.md`),
        path.join(baseDir, `${docPath}.mdx`),
        path.join(baseDir, docPath, 'index.md'),
        path.join(baseDir, docPath, 'index.mdx'),
      ];
    }

    return null;
  };

  const hasTranslation = (neutralPathname, locale) => {
    if (locale === defaultLocale) return true;
    const candidates = getTranslationSourcePath(neutralPathname, locale);
    if (!candidates) return true;
    return candidates.some((p) => fs.existsSync(p));
  };

  return { stripLocale, detectLocale, localeUrl, getTranslationSourcePath, hasTranslation };
}

/**
 * Factory for the Docusaurus `sitemap.createSitemapItems` callback. The
 * Docusaurus runtime supplies `siteConfig` at call time, so we only need to
 * close over the project root here.
 *
 * @param {{ projectRoot: string }} cfg
 */
function createSitemapItemsHook({ projectRoot }) {
  return async (params) => {
    const { defaultCreateSitemapItems, siteConfig } = params;
    const items = await defaultCreateSitemapItems(params);
    const { locales, defaultLocale } = siteConfig.i18n;
    const { stripLocale, detectLocale, localeUrl, hasTranslation } = buildHelpers({
      locales,
      defaultLocale,
      siteUrl: siteConfig.url,
      projectRoot,
    });

    const result = [];
    for (const item of items) {
      const { pathname } = new URL(item.url);
      const currentLocale = detectLocale(pathname);
      const neutralPathname = stripLocale(pathname);

      if (!hasTranslation(neutralPathname, currentLocale)) continue;

      const translatedLocales = locales.filter((l) => hasTranslation(neutralPathname, l));
      const links = translatedLocales.map((l) => ({ lang: l, url: localeUrl(l, neutralPathname) }));
      links.push({ lang: 'x-default', url: localeUrl(defaultLocale, neutralPathname) });

      result.push({ ...item, links });
    }
    return result;
  };
}

module.exports = { buildHelpers, createSitemapItemsHook };
