// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// Dotenv is a zero-dependency module that loads environment 
// variables from a .env file into process.env
import 'dotenv/config';

// GitHub Settings to setup repository and branch customFields
const vars = require('./variables')

const { createSitemapItemsHook } = require('./scripts/sitemap-hreflang');

// Mega menu definitions (desktop columns plus derived mobile lists)
const getNavbarItems = require('./src/data/navbar');

// enable or disable the announcement header bar (see 'announcementBar' section below)
const isAnnouncementActive = false;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cardano',
  tagline: 'Making The World Work Better For All',
  // Set the production url of your site here
  url: 'https://cardano.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cardano-foundation',
  projectName: 'www-cardano-org',
  
  trailingSlash: true,
  onBrokenLinks: 'throw',
  // Set to 'ignore' because anchor IDs are added dynamically by React components (e.g., Divider)
  // Docusaurus can't detect these at build time
  onBrokenAnchors: 'ignore',

  markdown: {
    format: 'mdx',
    mermaid: false,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  customFields: {
    repository: `${vars.repository}`,
    branch: `${vars.branch}`,

    // 
    // If you use the data.cardano.org endpoint and you want to run this locally you need to disable CORS
    // Alternatively you can also replace it with a Koios endpoint and an Koios API Key.
    CARDANO_ORG_API_URL: 'https://data.cardano.org/k/api/v1',
    // CoinGecko proxy hosted by data.cardano.org. Same host -> already on the
    // CSP connect-src allowlist. The proxy injects the demo / paid API key
    // server-side, so the public site never sees it.
    CARDANO_ORG_CG_API_URL: 'https://data.cardano.org/cg/api/v3',
    // Luma events proxy hosted by data.cardano.org. Same host as the page, so
    // a headerless GET avoids a CORS preflight. The proxy injects the API key.
    CARDANO_ORG_LUMA_API_URL: 'https://data.cardano.org/luma/v1',
    CARDANO_ORG_API_KEY: 'secret',
  },
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'de', 'es', 'vi'],
    localeConfigs: {
      en: { label: 'English', htmlLang: 'en-US' },
      ja: { label: '日本語', htmlLang: 'ja' },
      de: { label: 'Deutsch', htmlLang: 'de' },
      es: { label: 'Español', htmlLang: 'es' },
      vi: { label: 'Tiếng Việt', htmlLang: 'vi' },
    },
  },

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'algolia-site-verification',
        content: '1E8DDBC2D1ADF529',
      },
    },
    {
      // Stub gtag for dev mode to prevent "window.gtag is not a function" errors
      tagName: 'script',
      attributes: {},
      innerHTML: 'window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}',
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        href: '/img/favicon.ico',
        media: '(prefers-color-scheme: light)',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        href: '/img/favicon-light.ico',
        media: '(prefers-color-scheme: dark)',
      },
    },
    // Preload the two Chivo variable fonts so the browser fetches them in
    // parallel with the HTML/CSS instead of waiting for the CSS to declare
    // them. Paths point to /fonts/* which are served from static/ unhashed,
    // matching the @font-face URLs declared inline below.
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        as: 'font',
        type: 'font/ttf',
        href: '/fonts/Chivo-VariableFont_wght.ttf',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        as: 'font',
        type: 'font/ttf',
        href: '/fonts/Chivo-Italic-VariableFont_wght.ttf',
        crossorigin: 'anonymous',
      },
    },
    // Inline @font-face so the URLs stay as /fonts/* (webpack does not see
    // them) and the preload above hits the same cache entry.
    {
      tagName: 'style',
      attributes: {},
      innerHTML: `
        @font-face {
          font-family: 'Chivo';
          font-style: normal;
          font-weight: 100 900;
          font-display: swap;
          src: url('/fonts/Chivo-VariableFont_wght.ttf') format('truetype-variations');
        }
        @font-face {
          font-family: 'Chivo';
          font-style: italic;
          font-weight: 100 900;
          font-display: swap;
          src: url('/fonts/Chivo-Italic-VariableFont_wght.ttf') format('truetype-variations');
        }
      `,
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: `${vars.repository}/edit/${vars.branch}`,
        },
        blog: {
          showReadingTime: false,
          routeBasePath: 'news',
          blogSidebarCount: 50,
          // Only tags defined in blog/tags.yml may be used; any other tag
          // fails the build. Keeps the tag taxonomy from drifting over time.
          onInlineTags: 'throw',
          editUrl: `${vars.repository}/edit/${vars.branch}`,
          onUntruncatedBlogPosts: 'ignore',
          // Replaces the default "Blog | Cardano" page title and missing
          // description on /news/. Translatable via Crowdin.
          blogTitle: 'Cardano News',
          blogDescription: 'Stay current with Cardano: weekly development reports, community digests, governance updates, and ecosystem announcements.',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          // don't be evil
          trackingID: 'G-LGRGXBVYMC',
          anonymizeIP: true,
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['**/tags/**', '**/news/tags/**', '**/news/page/**'],
          // Hook implementation lives in scripts/sitemap-hreflang.js so it can be
          // unit-tested without spinning up a Docusaurus build. See the JSDoc there.
          createSitemapItems: createSitemapItemsHook({ projectRoot: __dirname }),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
      },
    ],
    './plugins/apps-routes',
    './plugins/glossary-routes',
    [
      '@docusaurus/plugin-client-redirects',
      {
        // createRedirects is called per-route per-locale-build with the
        // locale-prefixed route, so a single rule covers all five locales —
        // generating /docs/glossary → /glossary in EN, /de/docs/glossary →
        // /de/glossary in DE, etc. Root.js then handles the hash component
        // (/<locale>/glossary#<old-anchor> → /<locale>/glossary/<slug>).
        createRedirects(existingPath) {
          // trailingSlash=true in this site's config; the plugin handles the
          // canonical trailing-slash variant on its own, so return just the
          // bare form (returning both /docs/glossary and /docs/glossary/
          // collides when the plugin writes build/docs/glossary/index.html).
          const match = existingPath.match(/^(\/(?:ja|de|es|vi))?\/glossary\/?$/);
          if (match) {
            const prefix = match[1] || '';
            return [`${prefix}/docs/glossary`];
          }

          // The blog tag taxonomy was consolidated to the 7 tags in
          // blog/tags.yml. Redirect the retired tag pages to the tag they were
          // folded into so old links and search results keep working.
          const tagMerges = {
            development: ['weekly-development-report', 'developers', 'interoperability'],
            research: ['ouroboros', 'scaling'],
            governance: ['catalyst', 'mbo', 'spo'],
            community: ['community-digest', 'ambassadors'],
            ecosystem: ['media', 'adoption', 'report', 'activity-report', 'strategy'],
            events: ['summit', 'buidler-fest', 'hackathons'],
          };
          const tagMatch = existingPath.match(/^(\/(?:ja|de|es|vi))?\/news\/tags\/([a-z-]+)\/?$/);
          if (tagMatch) {
            const prefix = tagMatch[1] || '';
            const retired = tagMerges[tagMatch[2]];
            if (retired) {
              return retired.map((slug) => `${prefix}/news/tags/${slug}`);
            }
          }

          // Dropped tags (format modifiers) point at the news index.
          const newsIndex = existingPath.match(/^(\/(?:ja|de|es|vi))?\/news\/?$/);
          if (newsIndex) {
            const prefix = newsIndex[1] || '';
            return ['recap', 'survey'].map((slug) => `${prefix}/news/tags/${slug}`);
          }

          return undefined;
        },
      },
    ],
    function (context, options) {
      return {
        name: 'custom-webpack-config',
        configureWebpack(config, isServer) {
          return {
            resolve: {
              fallback: isServer ? {} : {
                process: require.resolve('process/browser.js'),
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                vm: require.resolve('vm-browserify'),
              },
              fullySpecified: false,
            },
            plugins: isServer ? [] : [
              new (require('webpack')).ProvidePlugin({
                process: 'process/browser.js',
                Buffer: ['buffer', 'Buffer'],
              }),
            ],
            node: {
              __dirname: true,
            },
          };
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // The project's social card
      image: 'img/og/default.jpg',

      // Algolia Search
      algolia: {
        appId: '2GOYNZM2J1',
        apiKey: 'b3ea5bee26e2b95a6c6446489bdc6adf',
        indexName: 'staging_pages',
        contextualSearch: true,
        searchPagePath: 'search',
        // Search UI translations moved to i18n/*/docusaurus-theme-classic/theme.json
      },

      navbar: {
        logo: {
          alt: "Cardano Logo",
          src: "img/cardano-logo-blue.svg",
          srcDark: "img/cardano-logo-white.svg",
        },
        items: [
          ...getNavbarItems(),
          {
            type: 'localeDropdown',
            position: 'right',
            dropdownItemsAfter: [
              {
                type: 'html',
                value: '<hr style="margin: 4px 0;">',
              },
              {
                to: '/translations',
                label: 'Help Translate',
              },
            ],
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          /* we may want to hide this, and link it only via localhost link in the read me */
          /*
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          */
          {
            title: 'Entities',
            items: [
              {
                label: 'Cardano Foundation',
                to: '/entities?tab=cardanofoundation',
              },
              {
                label: 'EMURGO',
                to: '/entities?tab=emurgo',
              },
              {
                label: 'Input Output',
                href: '/entities?tab=iog',
              },
              {
                label: 'Intersect',
                href: '/entities?tab=intersect',
              },
              {
                label: 'PRAGMA',
                href: '/entities?tab=pragma',
              },
              {
                label: 'More entities',
                href: '/entities/',
              },
            ],
          },
          {
            title: 'Support',
            items: [
              {
                label: 'Brand Assets',
                to: '/brand-assets',
              },
              {
                label: 'Glossary',
                to: '/glossary',
              },
              {
                label: 'Discord',
                to: '/docs/communities/#cardano-on-discord',
              },
              {
                label: 'Newsletter',
                to: '/newsletter',
              },
              {
                label: 'Contact',
                to: '/contact',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Terms',
                href: 'https://cardanofoundation.org/en/terms-and-conditions',
              },
              {
                label: 'Privacy Policy',
                href: 'https://cardanofoundation.org/en/privacy',
              },
              /* TODO: once we have these files, link locally not to the cf page 
              {
                label: 'Terms',
                to: '/terms-and-conditions',
              },
              {
                label: 'Privacy Policy',
                to: '/privacy-policy',
              },
              {
                label: 'Cookie Policy',
                to: '/cookie-policy',
              },
              */
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Cardano News',
                to: '/news',
              },
              {
                label: 'Get Involved',
                to: '/docs/get-involved',
              },
              {
                label: 'Contributors',
                href: 'https://github.com/cardano-foundation/cardano-org/graphs/contributors',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/cardano-foundation/cardano-org',
              }
            ],
          },
        ],
        copyright: `® Cardano`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },


      // Announcement Bar
      // id: always change it when changing the announcement
      // backgroundColor: use #1442B3 for announcements
      announcementBar: isAnnouncementActive ? {
        id: "announcement_index5", // Any value that will identify this message + increment the number every time to be unique
        content:
          `<strong>Cardano Summit 2025 Berlin</strong> 🎟️ Secure your pass now ➡️ <strong><a href="https://summit.cardano.org/page/5056323/tickets#section-6268783" style="color:white; font-weight:bold; text-decoration:underline;">Visit the ticket shop</a></strong>`,
        backgroundColor: "#1442B3",
        textColor: "#FFFFFF", // Use #FFFFFF
        isCloseable: true, // Use true
      } : undefined,

    }),

  // Custom JavaScript that will be injected into the <head> section of every page
  scripts: [
    {
      src: '/scripts/deactivateServiceWorker.js',
      async: true
    }
  ],
};

export default config;
