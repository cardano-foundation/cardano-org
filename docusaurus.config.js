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
          editUrl: `${vars.repository}/edit/${vars.branch}`,
          onUntruncatedBlogPosts: 'ignore',
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
      // Toggle display of icons in the mega menu. Icons need to be added to /static/img/icons/ as svg files
      megaMenuIcons: false,
      // Toggle display of icons in mega menu column titles.
      megaMenuColumnIcons: true,

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
          {
            // The collapsed mega menu for "Learn"
            label: 'Learn',
            type: 'dropdown',
            position: 'left',
            items: [
              { to: '/what-is-ada', label: 'What is ada?' },
              { to: '/get-started', label: 'Get started with Cardano' },
              { to: '/wallets', label: 'Find a Wallet' },
              { to: '/where-to-get-ada', label: 'Where to get ada?' },
              { to: '/common-scams', label: 'Protect your ada' },
              { to: '/stake-pool-delegation', label: 'Delegate your ada' },
              { to: '/apps', label: 'Use Cardano Apps' },
              { to: '/research', label: 'Cardano Research' },
              { href: '/insights', label: 'Cardano Insights' },
              { to: '/hardforks', label: 'Hard Forks' },
            ],
            // The mega menu full version for "Learn"
            mega: true,
            customProps: {
              columns: [
                {
                  title: 'Get to know',
                  icon: 'book-solid',
                  items: [
                    { to: '/what-is-ada', label: 'What is ada?', description: 'Cardano\'s native token', icon: 'ada' },
                    { to: '/get-started', label: 'Get started with Cardano', description: 'Learn the basics and start using Cardano', icon: 'wallet-solid' },
                    { to: '/where-to-get-ada', label: 'Where to get ada?', description: 'Obtain ada to use Cardano', icon: 'coins-solid' },
                    { to: '/common-scams', label: 'Protect your ada', description: 'Don\'t fall for scams', icon: 'shield-solid' },
                  ],
                },
                {
                  title: 'Take part',
                  icon: 'shapes-solid',
                  items: [
                    { to: '/wallets', label: 'Find a Wallet', description: 'Find the right wallet for you', icon: 'wallet-solid' },
                    { to: '/stake-pool-delegation', label: 'Delegate your ada', description: 'Be a part of it and earn rewards', icon: 'handshake-solid' },
                    { to: '/apps', label: 'Use Cardano Apps', description: 'Explore curated applications', icon: 'shapes-solid' },
                    { to: '/community-code-of-conduct', label: 'Code of Conduct', description: 'Community standards and values', icon: 'heart-solid' },

                  ],
                },
                {
                  title: 'Research',
                  icon: 'flask-vial-solid',
                  items: [
                    { to: '/research', label: 'Cardano Research', description: 'Peer-reviewed research and papers', icon: 'flask-vial-solid' },
                    { href: '/insights', label: 'Cardano Insights', description: 'On‑chain or regularly refreshed data', icon: 'chart-line-solid' },
                    { to: '/hardforks', label: 'Hard Forks', description: 'Implemented Upgrades', icon: 'code-branch-solid' },
                  ],
                },
              ],
            },
          },
          {
            // The collapsed mega menu for "Participate"
            label: 'Participate',
            type: 'dropdown',
            position: 'left',
            items: [
              { to: '/news', label: 'News' },
              { to: '/newsletter', label: 'Newsletter' },
              { to: '/docs/communities/', label: 'Online Communities' },
              { to: '/ambassadors', label: 'Cardano Ambassadors' },
              { to: '/events', label: 'Cardano Events' },
              { href: 'https://forum.cardano.org', label: 'Cardano Forum' },
              { to: '/docs/get-involved', label: 'Get involved in cardano.org' },
              { to: '/governance', label: 'Governance Overview' },
              { to: '/governance/delegate', label: 'Delegate your vote' },
              { to: '/governance#lead', label: 'Become a DRep' },
              { to: '/governance#tools', label: 'Governance Tools' },
              { to: '/constitution', label: 'Cardano Constitution' },
            ],
            // The mega menu full version for "Participate"
            mega: true,
            customProps: {
              columns: [
                {
                  title: 'Connect',
                  icon: 'link-solid',
                  items: [
                    { to: '/news', label: 'News', description: 'Latest Cardano news and updates', icon: 'newspaper-solid' },
                    { to: '/newsletter', label: 'Newsletter', description: 'Stay updated with Cardano news', icon: 'envelope-solid' },
                    { to: '/docs/communities/', label: 'Online Communities', description: 'Recommended Channels', icon: 'share-nodes-solid' },
                    { to: '/ambassadors', label: 'Ambassador Program', description: 'Meet Cardano Ambassadors', icon: 'people-group-solid' },
                  ],
                },
                {
                  title: 'Engage',
                  icon: 'comments-solid',
                  items: [
                    { to: '/events', label: 'Cardano Events', description: 'Join Cardano community events', icon: 'calendar-solid' },
                    { href: 'https://forum.cardano.org', label: 'Cardano Forum', description: 'Structured long-format discussions', icon: 'comments-solid' },

                    { to: '/docs/get-involved', label: 'Get involved in cardano.org', description: 'If you’d like to participate, this will get you started', icon: 'shapes-solid' },
                  ],
                },
                {
                  title: 'Governance',
                  icon: 'users-solid',
                  items: [
                    { to: '/governance', label: 'Governance Overview', description: 'How Cardano governance works', icon: 'scroll-solid' },
                    { to: '/governance/delegate', label: 'Delegate your vote', description: 'Lend your voting power to a DRep', icon: 'scroll-solid' },
                    { to: '/governance#lead', label: 'Become a DRep', description: 'Represent your community', icon: 'scroll-solid' },
                    { to: '/governance#tools', label: 'Governance Tools', description: 'Tools for governance participation', icon: 'scroll-solid' },
                  ],
                },
              ],
            },
          },
          /* 
          {
            
            label: 'Insights',
            position: 'left',
            items: [  
              {to: '/insights/demo/', label: 'Simple Demo'},
              {to: '/insights/supply/', label: 'Supply'}, 
            ],
          },*/
          {
            // The collapsed mega menu for "Build"
            label: 'Build',
            type: 'dropdown',
            position: 'left',
            items: [
              { to: '/developers', label: 'Start building on Cardano' },
              { to: '/exchanges', label: 'Integrate Cardano' },
              { href: 'https://developers.cardano.org', label: 'Developer Portal' },
              { href: 'https://developers.cardano.org/tools', label: 'Builder Tools' },
              { to: '/entities/', label: 'Companies building on Cardano' },
            ],
            // The mega menu full version for "Build"
            mega: true,
            customProps: {
              columnCount: 2,
              columns: [
                {
                  title: 'Get started',
                  icon: 'code-solid',
                  items: [
                    { to: '/developers', label: 'Start building on Cardano', description: 'Developer resources and tooling', icon: 'code-solid' },
                    { to: '/exchanges', label: 'Integrate Cardano', description: 'Exchange and integration guides', icon: 'plug-solid' },
                  ],
                },
                {
                  title: 'Tools',
                  icon: 'wrench-solid',
                  items: [
                    { href: 'https://developers.cardano.org', label: 'Developer Portal', description: 'Cardano developer portal and docs', icon: 'book-solid' },
                    { href: 'https://developers.cardano.org/tools', label: 'Builder Tools', description: 'Tools to build on Cardano', icon: 'wrench-solid' },
                    { to: '/entities/#companies', label: 'Companies building on Cardano', description: 'Companies, associations, and collaborations', icon: 'building-solid' },
                  ],
                },
              ],
            },
          },
          {
            // The collapsed mega menu for "Solutions"
            label: 'Solutions',
            type: 'dropdown',
            position: 'left',
            items: [
              { to: '/solutions', label: 'Enterprise Solutions' },
              { to: '/use-cases', label: 'Use Cases' },
              { to: '/use-cases#identity', label: 'Identity' },
              { to: '/use-cases#finance', label: 'Finance' },
              { to: '/use-cases#supply-chain', label: 'Supply Chain' },
            ],
            // The mega menu full version for "Solutions"
            mega: true,
            customProps: {
              columnCount: 2,
              columns: [
                {
                  title: 'For Enterprise',
                  icon: 'building-solid',
                  items: [
                    { to: '/solutions', label: 'Enterprise Solutions', description: 'Case studies and proven deployments', icon: 'building-solid' },
                    { href: 'https://cardanofoundation.org/contact', label: 'Contact the Foundation', description: 'Partner with the Cardano Foundation', icon: 'envelope-solid' },
                  ],
                },
                {
                  title: 'Use Cases',
                  icon: 'shapes-solid',
                  items: [
                    { to: '/use-cases', label: 'All Use Cases', description: 'Explore blockchain applications', icon: 'shapes-solid' },
                    { to: '/use-cases#identity', label: 'Identity', description: 'Credentials & verification', icon: 'users-solid' },
                    { to: '/use-cases#supply-chain', label: 'Supply Chain', description: 'Traceability & provenance', icon: 'route-solid' },
                  ],
                },
              ],
            },
          },
          /* we may want to hide this, and link it only via localhost link in the read me */
          /*
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          */
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
                to: '/docs/glossary#cardano-glossary',
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
