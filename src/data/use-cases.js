import {translate} from '@docusaurus/Translate';

export const UseCaseCategories = [
  {
    id: 'identity',
    title: translate({id: 'useCases.category.identity', message: 'Identity'}),
    useCases: [
      { title: translate({id: 'useCases.card.education.title', message: 'Education'}), icon: '/img/icons/book-solid.svg', summary: translate({id: 'useCases.card.education.summary', message: 'Blockchain-verified academic credentials'}), link: '/docs/use-cases/education' },
      { title: translate({id: 'useCases.card.digitalIdentity.title', message: 'Digital Identity'}), icon: '/img/icons/users-solid.svg', summary: translate({id: 'useCases.card.digitalIdentity.summary', message: 'Own and control your digital identity'}), link: '/docs/use-cases/digital-identity' },
      { title: translate({id: 'useCases.card.financeKyc.title', message: 'Finance KYC'}), icon: '/img/icons/building-solid.svg', summary: translate({id: 'useCases.card.financeKyc.summary', message: 'Streamlined identity verification'}), link: '/docs/use-cases/finance-kyc' },
      { title: translate({id: 'useCases.card.government.title', message: 'Government'}), icon: '/img/icons/scroll-solid.svg', summary: translate({id: 'useCases.card.government.summary', message: 'Tamper-proof official documents'}), link: '/docs/use-cases/government' },
    ],
  },
  {
    id: 'finance',
    title: translate({id: 'useCases.category.finance', message: 'Finance'}),
    useCases: [
      { title: 'DeFi', icon: '/img/icons/coins-solid.svg', summary: translate({id: 'useCases.card.defi.summary', message: 'Decentralized lending and exchanges'}), link: '/docs/use-cases/defi' },
      { title: translate({id: 'useCases.card.payments.title', message: 'Payments'}), icon: '/img/icons/wallet-solid.svg', summary: translate({id: 'useCases.card.payments.summary', message: 'Fast, low-cost cross-border transfers'}), link: '/docs/use-cases/payments' },
    ],
  },
  {
    id: 'supply-chain',
    title: translate({id: 'useCases.category.supplyChain', message: 'Supply Chain'}),
    useCases: [
      { title: translate({id: 'useCases.card.agriculture.title', message: 'Agriculture'}), icon: '/img/icons/leaf-solid.svg', summary: translate({id: 'useCases.card.agriculture.summary', message: 'Farm-to-table traceability'}), link: '/docs/use-cases/agriculture' },
      { title: translate({id: 'useCases.card.retail.title', message: 'Retail'}), icon: '/img/icons/certificate-solid.svg', summary: translate({id: 'useCases.card.retail.summary', message: 'Combat counterfeiting with provenance'}), link: '/docs/use-cases/retail' },
      { title: translate({id: 'useCases.card.logistics.title', message: 'Logistics'}), icon: '/img/icons/route-solid.svg', summary: translate({id: 'useCases.card.logistics.summary', message: 'Real-time tracking and verification'}), link: '/docs/use-cases/logistics' },
    ],
  },
  {
    id: 'social-impact',
    title: translate({id: 'useCases.category.socialImpact', message: 'Social Impact'}),
    useCases: [
      { title: translate({id: 'useCases.card.socialPrograms.title', message: 'Social Programs'}), icon: '/img/icons/heart-solid.svg', summary: translate({id: 'useCases.card.socialPrograms.summary', message: 'Transparent fund distribution'}), link: '/docs/use-cases/social-programs' },
    ],
  },
  {
    id: 'data-technology',
    title: translate({id: 'useCases.category.dataTech', message: 'Data & Technology'}),
    useCases: [
      { title: translate({id: 'useCases.card.dataStorage.title', message: 'Data Storage'}), icon: '/img/icons/database-solid.svg', summary: translate({id: 'useCases.card.dataStorage.summary', message: 'Decentralized, secure storage'}), link: '/docs/use-cases/data-storage' },
      { title: translate({id: 'useCases.card.tokenizedAssets.title', message: 'Tokenized Assets'}), icon: '/img/icons/shapes-solid.svg', summary: translate({id: 'useCases.card.tokenizedAssets.summary', message: 'Fractional ownership of real-world assets'}), link: '/docs/use-cases/tokenized-assets' },
    ],
  },
  {
    id: 'emerging',
    title: translate({id: 'useCases.category.emerging', message: 'Emerging Applications'}),
    useCases: [
      { title: translate({id: 'useCases.card.votingSystems.title', message: 'Voting Systems'}), icon: '/img/icons/square-poll-vertical-solid.svg', summary: translate({id: 'useCases.card.votingSystems.summary', message: 'Secure, transparent elections'}), link: '/docs/use-cases/voting-systems' },
      { title: translate({id: 'useCases.card.healthcare.title', message: 'Healthcare'}), icon: '/img/icons/flask-solid.svg', summary: translate({id: 'useCases.card.healthcare.summary', message: 'Portable, secure health records'}), link: '/docs/use-cases/healthcare' },
      { title: translate({id: 'useCases.card.musicIp.title', message: 'Music & IP'}), icon: '/img/icons/share-nodes-solid.svg', summary: translate({id: 'useCases.card.musicIp.summary', message: 'Direct royalty payments to artists'}), link: '/docs/use-cases/music-ip' },
    ],
  },
];
