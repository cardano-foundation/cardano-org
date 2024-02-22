// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// GitHub Settings to setup repository and branch customFields
const vars = require('./variables')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cardano',
  tagline: 'Making The World Work Better For All',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cardano-foundation', // Usually your GitHub org/user name.
  projectName: 'www-cardano-org', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  customFields: {
    repository: `${vars.repository}`,
    branch: `${vars.branch}`,
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
          blogSidebarCount: 10,
          editUrl: `${vars.repository}/edit/${vars.branch}`,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        logo: {
          alt: "Cardano Logo",
          src: "img/cardano-logo-blue.svg",
          srcDark: "img/cardano-logo-white.svg",
        },
        items: [
          {
            to: '/learn', // This is the parent item
            label: 'Learn',
            position: 'left',
            items: [ // Define nested dropdown items here
              {to: '/what-is-ada', label: 'What ada is'}, 
              {to: '/what-is-ada#wallets', label: 'About Cardano wallets'}, 
              {to: '/stake-pool-delegation', label: 'Delegating your stake'}, 
              {to: '/stake-pool-operation', label: 'Operating a stake pool'}, 
              {to: '/governance', label: 'Participating in governance'}, 
            ],
          },
          {
            to: '/community', // This is the parent item
            label: 'Community',
            position: 'left',
            items: [ // Define nested dropdown items here
              {to: '/community-code-of-conduct', label: 'Code of Conduct'}, 
              {to: '/ambassadors', label: 'Cardano Ambassadors'},
              {to: '/newsletter', label: 'Newsletter'}, 
              {to: '/#follow', label: 'Follow Cardano'},
              {href: 'https://forum.cardano.org', label: 'Cardano Forum'}, 
              {href: 'https://forum.cardano.org/t/cardano-stay-safe-series-official-community-channel-list/20046', label: 'Social Channels'}, 
              
            ],
          },
          {
            to: '/developers', // This is the parent item
            label: 'Developers',
            position: 'left',
            items: [ // Define nested dropdown items here
              {href: 'https://developers.cardano.org', label: 'Developer Portal'},  
              {href: 'https://developers.cardano.org/tools', label: 'Builder Tools'},  
              {href: 'https://developers.cardano.org/showcase', label: 'Project Showcase'},  
              {href: 'https://docs.cardano.org', label: 'Cardano Docs'}, 
              {href: 'https://cardanoupdates.com', label: 'Developer Updates'},  
              {to: '/research', label: 'Cardano Research'},
            ],
          },
          {
            to: '/enterprise', // This is the parent item
            label: 'Enterprise',
            position: 'left',
            items: [ // Define nested dropdown items here
              {to: '/enterprise#solution1', label: 'Solution 1'}, // Nested item 1
              {to: '/enterprise#solution2', label: 'Solution 2'}, // Nested item 2
              {to: '/enterprise#solution3', label: 'Solution 3'}, // Nested item 3
            ],
          },
          /*
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          */
          {to: '/news', label: 'News', position: 'left'},
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
            title: 'Partners',
            items: [
              {
                label: 'Cardano Foundation',
                to: '/partners#cf',
              },
              {
                label: 'EMURGO',
                to: '/partners#emurgo',
              },
              {
                label: 'IOG',
                href: '/partners#iog', /* TODO: last entry should be "more", then link to the partners page */
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
              /* FIXME: once we have these files, link locally not to the cf page 
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
                label: 'News',
                to: '/News',
              },
              {
                label: 'Disclosure',
                to: '/responsible-disclosure',
              },
            ],
          },
        ],
        copyright: `® Cardano`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
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
};

export default config;
