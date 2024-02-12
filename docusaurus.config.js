// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          routeBasePath: 'news',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
        //title: 'CARDANO',
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
              {to: '/what-is-ada', label: 'What is ada?'}, 
              {to: '/stake-pool-delegation', label: 'Delegate your stake'}, 
              {to: '/stake-pool-operation', label: 'Operate a stake pool'}, 
            ],
          },
          {
            to: '/community', // This is the parent item
            label: 'Community',
            position: 'left',
            items: [ // Define nested dropdown items here
              {href: 'https://forum.cardano.org', label: 'Cardano Forum'}, 
              {to: '/ambassadors', label: 'Cardano Ambassadors'}, 
              {to: '/newsletter', label: 'Newsletter'}, 
              {to: '/social-channels', label: 'Social Channels'}, 
              {to: '/community-code-of-conduct', label: 'Code of Conduct'}, 
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
          /*
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
          */
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
                label: 'Intersect',
                href: '/partners#intersect',
              },
              {
                label: 'IOG',
                href: '/partners#iog', /* fixme: last entry should be "more", then link to the partners page */
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
                label: 'GitHub',
                href: 'https://github.com/cardano-foundation/www-cardano-org',
              },
              {
                label: 'Responsible Disclosure',
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
