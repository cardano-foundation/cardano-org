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

// enable or disable the announcement header bar (see 'announcementBar' section below)
const isAnnouncementActive = false;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cardano',
  tagline: 'Making The World Work Better For All',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://cardano.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cardano-foundation',
  projectName: 'www-cardano-org',

  onBrokenLinks: 'throw',
  // Set to 'ignore' because anchor IDs are added dynamically by React components (e.g., Divider)
  // Docusaurus can't detect these at build time
  onBrokenAnchors: 'ignore',

  markdown: {
    format: 'mdx',
    mermaid: false,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
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
    locales: ['en'],
  },

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
          trackingID: 'GTM-5BC4HH7',
          anonymizeIP: true,
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
          if (!isServer) {
            return {
              resolve: {
                fallback: {
                  process: require.resolve('process/browser.js'),
                  crypto: require.resolve('crypto-browserify'),
                  stream: require.resolve('stream-browserify'),
                  vm: require.resolve('vm-browserify'),
                },
                fullySpecified: false,
              },
              plugins: [
                new (require('webpack')).ProvidePlugin({
                  process: 'process/browser.js',
                  Buffer: ['buffer', 'Buffer'],
                }),
              ],
            };
          }
          return {};
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
              { to: '/#follow', label: 'Follow Cardano' },
              { to: '/newsletter', label: 'Newsletter' },
              { to: '/docs/communities/', label: 'Online Communities' },
              { to: '/ambassadors', label: 'Cardano Ambassadors' },
              { to: '/events', label: 'Cardano Events' },
              { href: 'https://forum.cardano.org', label: 'Cardano Forum' },
              { to: '/docs/get-involved', label: 'Get involved in cardano.org' },
              { to: '/governance', label: 'Participate in governance' },
              { to: '/apps?tags=governance', label: 'Governance Tools' },
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
                    { to: '/#follow', label: 'Follow Cardano', description: 'Stay Updated', icon: 'link-solid' },
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
                    { to: '/governance', label: 'Participate in governance', description: 'Shape Cardano\'s future', icon: 'scroll-solid' },
                    { to: '/apps?tags=governance', label: 'Governance Tools', description: 'Tools for transparent, community-driven decisions', icon: 'scroll-solid' },
                    { to: '/constitution', label: 'Cardano Constitution', description: 'Learn about governance', icon: 'scroll-solid' },
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
              { to: '/research', label: 'Cardano Research' },
              { to: '/exchanges', label: 'Integrate Cardano' },
              { href: 'https://developers.cardano.org', label: 'Developer Portal' },
              { href: 'https://developers.cardano.org/tools', label: 'Builder Tools' },
              { to: '/entities/#companies', label: 'Companies building on Cardano' },
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
                    { to: '/research', label: 'Cardano Research', description: 'Peer-reviewed research and papers', icon: 'flask-solid' },
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
          /*
          // Needs revamp
          {
            to: '/use-cases',  
            label: 'Use Cases',
            position: 'left',
            items: [  
              {to: '/use-cases#identity', label: 'Identity'},  
              {to: '/use-cases#finance', label: 'Finance'},  
              {to: '/use-cases#supply-chain', label: 'Supply Chain'},  
              {to: '/use-cases#social-impact', label: 'Social Impact'},  
              {to: '/use-cases#data-technology', label: 'Data & Technology'},  
              {to: '/use-cases#diverse', label: 'Diverse Opportunities'},  
            ],
          },
          */
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
            to: '/news', label: 'News', position: 'left',
            /*
            items: [  
              {to: '/news', label: 'All Articles (Chronological)'},  
              {to: '/news/tags/community-digest', label: 'Community Digest'},
              {to: '/news/tags/education', label: 'Education'},
              {to: '/news/tags/development', label: 'Development'},
              {to: '/news/tags/governance', label: 'Governance'},
              {to: '/news/tags/scaling', label: 'Scaling'},
              {to: '/news/tags', label: 'View Tags'},  
          ],
          */
          },
          {
            to: "/docs/communities/#cardano-on-discord",
            position: "right",
            className: "header-discord-link",
            "aria-label": "Discord",
          },
          {
            href: `${vars.repository}`,
            position: "right",
            className: "header-github-link",
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
                href: '/entities/#companies',
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

      head: [
        // ...
        {
          tagName: 'link',
          attributes: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css?family=Chivo', // replace with your font URL
          },
        },
      ],
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
