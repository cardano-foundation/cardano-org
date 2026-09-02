/**
 * Navbar mega menu items for cardano.org.
 *
 * Each mega menu is defined ONCE: an optional featured tile plus link
 * columns. The flat `items` array that Docusaurus's mobile drawer consumes
 * is derived from that definition, so the desktop and mobile menus cannot
 * drift apart.
 *
 * Shapes:
 *   featured: {title, description, image, to|href, cta, placement}
 *     placement 'start' puts the tile before the columns, 'end' after.
 *   columns:  [{title, items: [{label, description?, to|href}]}]
 *
 * The component translates these strings with ids keyed by the English
 * text (navbar.mega.*), so label and description changes create new keys.
 */

/** Flatten a mega menu definition into the mobile drawer's link list,
 *  keeping the featured tile in its desktop position. */
function toMobileItems({featured, columns}) {
  const link = ({to, href, label}) => (href ? {href, label} : {to, label});
  const items = columns.flatMap((column) => column.items.map(link));
  if (!featured) {
    return items;
  }
  const tile = link({to: featured.to, href: featured.href, label: featured.title});
  return featured.placement === 'end' ? [...items, tile] : [tile, ...items];
}

function megaMenu({label, featured, columns}) {
  return {
    type: 'dropdown',
    label,
    position: 'left',
    items: toMobileItems({featured, columns}),
    mega: true,
    customProps: {featured, columns},
  };
}

function getNavbarItems() {
  return [
    megaMenu({
      label: 'Learn',
      featured: {
        title: 'What is Cardano?',
        description: 'The platform, how it works and why it is different.',
        image: '/img/nav/learn.webp',
        to: '/what-is-cardano',
        cta: 'Start here',
        placement: 'start',
      },
      columns: [
        {
          title: 'Get to know',
          items: [
            {to: '/learn', label: 'Learn step by step', description: 'A guided path from beginner to advanced'},
            {to: '/what-is-ada', label: 'What is ada?', description: 'Cardano\'s native token'},
            {to: '/what-is-a-wallet', label: 'What is a Wallet?', description: 'Understand wallet types and security'},
            {to: '/common-scams', label: 'Protect your ada', description: 'Don\'t fall for scams'},
            {to: '/get-started', label: 'Get started with Cardano', description: 'Learn the basics and start using Cardano'},
            {to: '/quiz', label: 'Cardano Quiz', description: 'Test your knowledge and earn a badge'},
          ],
        },
        {
          title: 'Go deeper',
          items: [
            {to: '/how-cardano-works', label: 'How Cardano works', description: 'Consensus, ledger, tokens and upgrades in plain terms'},
            {to: '/smart-contracts', label: 'Smart contracts and dApps', description: 'How contracts run on Cardano and how to use apps safely'},
            {href: 'https://academy.cardanofoundation.org/', label: 'Cardano Academy', description: 'Free, self-paced blockchain courses'},
            {to: '/research', label: 'Cardano Research', description: 'Peer-reviewed research and papers'},
            {href: '/insights', label: 'Cardano Insights', description: 'On-chain or regularly refreshed data'},
            {to: '/ouroboros', label: 'Ouroboros', description: 'Cardano\'s proof-of-stake consensus protocol'},
            {to: '/hardforks', label: 'Hard Forks', description: 'Implemented Upgrades'},
          ],
        },
      ],
    }),
    megaMenu({
      label: 'Use',
      featured: {
        title: 'Cardano Apps',
        description: 'Explore curated applications built on Cardano.',
        image: '/img/nav/use.webp',
        to: '/apps',
        cta: 'Explore apps',
        placement: 'start',
      },
      columns: [
        {
          title: 'Get set up',
          items: [
            {to: '/wallets', label: 'Find a Wallet', description: 'Find the right wallet for you'},
            {to: '/where-to-get-ada', label: 'Where to get ada?', description: 'Obtain ada to use Cardano'},
          ],
        },
        {
          title: 'Do more',
          items: [
            {to: '/stake-pool-delegation', label: 'Delegate your ada', description: 'Be a part of it and earn rewards'},
            {to: '/governance/delegate', label: 'Delegate your vote', description: 'Lend your voting power to a DRep'},
            {to: '/stablecoins', label: 'Stablecoins', description: 'Stablecoins on Cardano and their live data'},
          ],
        },
      ],
    }),
    megaMenu({
      label: 'Build',
      featured: {
        title: 'Start Here',
        description: 'The 7-module path from zero to shipping, fundamentals through production.',
        image: '/img/nav/build.webp',
        href: 'https://developers.cardano.org/docs/developers/',
        cta: 'Start the curriculum',
        placement: 'start',
      },
      columns: [
        {
          title: 'Get started',
          items: [
            {to: '/developers', label: 'Start building on Cardano', description: 'Developer resources and tooling'},
            {to: '/exchanges', label: 'Integrate Cardano', description: 'Exchange and integration guides'},
          ],
        },
        {
          title: 'Tools & Ecosystem',
          items: [
            {href: 'https://developers.cardano.org', label: 'Developer Portal', description: 'Cardano developer portal and docs'},
            {href: 'https://developers.cardano.org/tools', label: 'Builder Tools', description: 'Tools to build on Cardano'},
            {to: '/entities/', label: 'Companies building on Cardano', description: 'Companies, associations, and collaborations'},
          ],
        },
      ],
    }),
    megaMenu({
      label: 'Participate',
      featured: {
        title: 'Delegate your voting power',
        description: 'Your ada is your voice. Choose a DRep to represent you in Cardano governance.',
        image: '/img/nav/participate.webp',
        to: '/governance/delegate',
        cta: 'Choose a DRep',
        placement: 'end',
      },
      columns: [
        {
          title: 'Connect',
          items: [
            {to: '/news', label: 'News', description: 'Latest Cardano news and updates'},
            {to: '/docs/communities/', label: 'Online Communities', description: 'Recommended Channels'},
            {to: '/ambassadors', label: 'Ambassador Program', description: 'Meet Cardano Ambassadors'},
            {to: '/signal-operator-notification', label: 'Operator Notifications', description: 'Technical updates for stake pool operators'},
          ],
        },
        {
          title: 'Engage',
          items: [
            {to: '/events', label: 'Cardano Events', description: 'Join Cardano community events'},
            {href: 'https://forum.cardano.org', label: 'Cardano Forum', description: 'Structured long-format discussions'},
            {to: '/docs/get-involved', label: 'Get involved in cardano.org', description: 'If you\'d like to participate, this will get you started'},
            {to: '/stake-pool-operation', label: 'Run a Stake Pool', description: 'Operate a pool and help secure the network'},
          ],
        },
        {
          title: 'Governance',
          items: [
            {to: '/governance', label: 'Governance Overview', description: 'How Cardano governance works'},
            {to: '/governance#tools', label: 'Governance Tools', description: 'Tools for governance participation'},
            {to: '/constitution', label: 'Cardano Constitution', description: 'The ratified Cardano Constitution'},
          ],
        },
      ],
    }),
    megaMenu({
      label: 'Solutions',
      featured: {
        title: 'AI Agents',
        description: 'Why AI needs Cardano.',
        image: '/img/nav/solutions.webp',
        to: '/ai',
        cta: 'Explore AI on Cardano',
        placement: 'start',
      },
      columns: [
        {
          title: 'For Enterprise',
          items: [
            {to: '/solutions', label: 'Enterprise Solutions', description: 'Case studies and proven deployments'},
            {href: 'https://cardanofoundation.org/contact', label: 'Contact the Foundation', description: 'Partner with the Cardano Foundation'},
          ],
        },
        {
          title: 'Use Cases',
          items: [
            {to: '/use-cases', label: 'All Use Cases', description: 'Explore blockchain applications'},
            {to: '/use-cases#identity', label: 'Identity', description: 'Credentials and verification'},
            {to: '/use-cases#finance', label: 'Finance', description: 'DeFi and stablecoins'},
            {to: '/use-cases#supply-chain', label: 'Supply Chain', description: 'Traceability and provenance'},
          ],
        },
      ],
    }),
  ];
}

module.exports = getNavbarItems;
