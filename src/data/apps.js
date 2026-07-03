/*
 * APPS SECTION INFO
 *
 * The Cardano applications page should be a place where someone new to the ecosystem
 * can come to see what can be done - it should not be seen as a database where
 * every project is promoted.
 *
 * HOW TO ADD YOUR APP: See docs/get-involved/add-app.md
 */

import React from "react";
import { sortBy, difference } from "../utils/jsUtils";

// Primary categories — each Showcase has exactly one. Answers: "what is this app?".
// `trackable: true` means on-chain tx count is a meaningful usage signal for that category;
// activity badges and the "Most active" section gate on this.
// `prominent: true` categories lead /apps in the Browse-by-category carousel.
// `prominent: false` categories live in the lower "Tools, Trackers & Insights"
// section — read-only utilities (analytics, explorers, education) that still
// belong on the page but shouldn't compete for attention with apps people can
// actually transact with.
export const Categories = {
  analytics: {
    label: "Analytics",
    description: "Tools that provide special insights related to Cardano.",
    color: '#6A8EAE',  // Cool Steel Blue
    trackable: false,
    prominent: false,
  },
  bridge: {
    label: "Bridge",
    description: "Projects that provide cross-chain bridge support.",
    color: '#FFC107',  // Golden Yellow
    trackable: true,
    prominent: true,
  },
  dex: {
    label: "DEX",
    description: "Decentralised exchanges allow direct peer-to-peer cryptocurrency transactions to take place online securely.",
    color: '#3D5AFE',  // Bright Blue
    trackable: true,
    prominent: true,
  },
  distribution: {
    label: "Distribution",
    description: "Platforms for distributing tokens, airdrops, and rewards to the Cardano community.",
    color: '#E07850',  // Warm Coral
    trackable: true,
    prominent: true,
  },
  ecosystem: {
    label: "Ecosystem",
    description: "Projects that map out the Cardano Ecosystem.",
    color: '#9C27B0',  // Purple
    trackable: false,
    prominent: false,
  },
  education: {
    label: "Education",
    description: "Courses, tutorials, and learning communities for Cardano.",
    color: '#FB8C00',  // Warm Orange
    trackable: false,
    prominent: false,
  },
  explorer: {
    label: "Block Explorer",
    description: "Block explorers are browsers for the Cardano blockchain. They can display the contents of individual blocks and transactions.",
    color: '#2E3B4E',  // Deep Navy Blue
    trackable: false,
    prominent: false,
  },
  game: {
    label: "Game",
    description: "Games on the Cardano blockchain.",
    color: '#008080',  // Teal
    trackable: true,
    prominent: true,
  },
  governance: {
    label: "Governance",
    description: "Governance tools.",
    color: '#673AB7',  // Deep Purple
    trackable: true,
    prominent: true,
  },
  identity: {
    label: "Identity",
    description: "Decentralized identifiers (DIDs).",
    color: '#212121',  // Solid Black
    trackable: true,
    prominent: true,
  },
  lending: {
    label: "Lending",
    description: "Projects that provide lending and borrowing of ada.",
    color: '#9E1C1C',  // Deep Red
    trackable: true,
    prominent: true,
  },
  marketplace: {
    label: "Marketplace",
    description: "Marketplace where you can buy or sell NFTs.",
    color: '#E53935',  // Bright Red
    trackable: true,
    prominent: true,
  },
  minting: {
    label: "Minting",
    description: "Minting Tool.",
    color: '#42A5F5',  // Light Blue
    trackable: true,
    prominent: true,
  },
  notary: {
    label: "Notary",
    description: "Tools that provide proof of existence or timestamp files on the Cardano blockchain.",
    color: '#5D4037',  // Warm Brown
    trackable: true,
    prominent: true,
  },
  pooltool: {
    label: "Pool Tool",
    description: "Pool tools provide delegates with the necessary tools to find a good pool.",
    color: '#6C6FFF',  // Soft Blue
    trackable: false,
    prominent: false,
  },
  wallet: {
    label: "Wallet",
    description: "Cardano wallets store the public and/or private keys to access and manage your funds.",
    color: '#7BC8A6',  // Soft Green
    trackable: false,
    prominent: true,
  },
  other: {
    label: "Other",
    description: "Apps that don't fit a primary category yet — thin segments grouped together until they have enough peers to warrant their own category.",
    color: '#607D8B',  // Blue Grey
    trackable: false,
    prominent: false,
  },
};

// Additive properties — zero or more per Showcase. Answers: "what does this app also offer?".
// Properties never act as primary classification.
export const Properties = {
  mobile: {
    label: "Mobile",
    description: "Great mobile experience (native app, not a responsive site).",
    color: '#3e09deff',  // Dark blue
  },
  nft: {
    label: "NFT",
    description: "App that supports or uses NFTs (not image-based NFT collections).",
    color: '#B8860B',  // Dark Gold
  },
  opensource: {
    label: "Open-Source",
    description: "Open-source code is available and can be inspected, forked, or contributed to.",
    color: '#8C2F00',  // Dark Orange-Red
  },
};

// Backwards-compat union for components that look up tag metadata by name without
// caring which axis (category vs property) it belongs to.
export const Tags = { ...Categories, ...Properties };

export const CategoryList = Object.keys(Categories);
export const PropertyList = Object.keys(Properties);

// Add your project to (THE END OF) this list.
// Leave maintainerPick: false — that flag is set by maintainers via the Maintainer picks process.
// See docs/get-involved/maintainer-picks.md for the proposal workflow.
//
// ICON FIELD (optional):
// - Add an 'icon' field to display a logo/icon in some app cards (e.g., DEX grid)
// - Icons should be stored in /static/img/app-icons/ and referenced as string URLs
// - If no icon is provided, components will show the first letter as a fallback badge
// - Example: icon: "/img/app-icons/minswap.svg"
//
// STATS LABEL FIELD (optional):
// - Add a 'statsLabel' field to explicitly map your app to transaction statistics
// - Must match a 'label' in /src/data/tx-stats.json exactly
// - If not provided, the system will try to match using the normalized app title
// - Example: statsLabel: "minswap"
//
// SCREENSHOTS:
// - Format: WebP, 2048×1440 source (rendered 1024×720 @ 2x), quality 80, ≤500 KB
// - Convert with: cwebp -q 80 -m 6 in.png -o out.webp
// - Naming: primary uses the slug (e.g. "example.webp"); extras add a kebab suffix
//   describing the view (e.g. "example-analytics.webp", "example-qrcodes.webp")
// - For multi-screenshot detail pages, list extras via `extraPreviews: [...]`
//
// EXAMPLE APP ENTRY:
// {
//   title: "Example Dex",
//   description: "A decentralized exchange on Cardano.",
//   preview: require("./app-screenshots/example.webp"),
//   extraPreviews: [
//     require("./app-screenshots/example-analytics.webp"),
//   ],
//   icon: "/img/app-icons/example.svg",  // Optional - for logo display
//   statsLabel: "example",  // Optional - for transaction data mapping see https://cardano.org/docs/get-involved/tx-rankings/
//   website: "https://example.com",
//   source: "https://github.com/example/repo",  // or null if closed source
//   category: "dex",                  // exactly one — see Categories above
//   properties: ["opensource"],       // zero or more — see Properties above
//   maintainerPick: false,
//   beginnerFriendly: false,
// }
export const Showcases = [
  {
    title: "Open DJED",
    description:
      "Mint and burn DJED, Cardano's overcollateralized stablecoin, on an open-source platform. Transparent alternative to DJED.xyz built by Artifi Labs.",
    tagline: "Open-source DJED stablecoin minting platform",
    icon: "/img/app-icons/djed.png",
    website: "https://djed.artifi.finance/",
    source: "https://github.com/artifi-labs/open-djed",
    category: "other",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Wall",
    description:
      "Demonstrates use cases for Cardano transaction metadata. Sign messages, anchor files as proof of existence, and verify them on-chain.",
    tagline: "Sign messages and create proof of existence",
    icon: "/img/app-icons/cardano-wall.jpg",
    website: "https://cardanowall.com",
    source: null,
    category: "notary",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "NMKR",
    description:
      "NFT minting, fiat and crypto sales, token launches, and secondary markets — full launchpad stack delivered through a single API.",
    tagline: "NFT minting platform with fiat and crypto checkout",
    icon: "/img/app-icons/nmkr.png",
    website: "https://www.nmkr.io/",
    source: null,
    category: "minting",
    properties: ["nft"],
    maintainerPick: true,
    beginnerFriendly: false,
    x: "nmkr_io",
    spotlight: {
      url: "https://developers.cardano.org/blog/2021-07-26-july/",
      title: "Cardano Developer Spotlight: July 2021",
      date: "2021-07-26",
    },
  },
  {
    title: "AdaStat",
    description:
      "Cardano explorer with deep statistics and insights covering blocks, transactions, addresses, stake pools, and protocol parameters.",
    tagline: "Detailed Cardano explorer with stats and insights",
    icon: "/img/app-icons/adastat.png",
    website: "https://adastat.net",
    source: null,
    category: "explorer",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Explorer Index",
    description:
      "Community-curated index of Cardano block explorers, pool tools, and analytics dashboards built and maintained by the community.",
    tagline: "Community index of Cardano explorers",
    website: "https://explorer.cardano.org",
    source: "https://github.com/cardano-foundation/cf-explorer-landing",
    category: "explorer",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "CExplorer",
    description:
        "Independent Cardano explorer with all-in-one dashboards covering blocks, transactions, stake pools, governance, and asset statistics.",
    tagline: "Independent Cardano explorer with dashboards",
    icon: "/img/app-icons/cexplorer.png",
    website: "https://cexplorer.io/",
    source: null,
    category: "explorer",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Scan",
    description:
      "Block explorer and pool tool from the makers of Typhon, with its own indexing stack providing fast access to the full Cardano ledger.",
    tagline: "Block explorer and pool tool with own db-sync",
    icon: "/img/app-icons/cardano-scan.jpg",
    website: "https://cardanoscan.io/",
    source: null,
    category: "explorer",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Pool PM",
    description:
      "Cardano block explorer that visualizes transactions as interactive UTXO graphs, making asset flows and stake operations easy to follow.",
    tagline: "Block explorer with visual transaction graphs",
    icon: "/img/app-icons/pool-pm.ico",
    website: "https://pool.pm",
    source: null,
    category: "explorer",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "PoolTool",
    description:
      "Feature-rich, unbiased Cardano pool tool with delegation analytics, missed-block detection, and a companion native mobile app.",
    tagline: "Feature-rich pool tool with companion native app",
    icon: "/img/app-icons/pooltool.png",
    website: "https://pooltool.io",
    source: null,
    category: "pooltool",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "AdaLite",
    description:
      "AdaLite was developed by vacuumlabs, they were also responsible for the Cardano Ledger app and won the crypto puzzle at the IOHK Summit 2019.",
    tagline: "Lightweight in-browser Cardano wallet",
    icon: "/img/app-icons/adalite.jpg",
    website: "https://adalite.io",
    source: null,
    category: "wallet",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["web"],
      custody: "non-custodial",
      features: ["staking", "hardware-wallet", "multi-account"],
      type: "light",
    },
  },
  {
    title: "Atomic Wallet",
    description:
      "Multi-cryptocurrency wallet that supports Cardano. During the integration they contributed code to the Cardano Rust library.",
    tagline: "Multi-cryptocurrency wallet with Cardano support",
    icon: "/img/app-icons/atomic.jpg",
    website: "https://atomicwallet.io",
    source: null,
    category: "wallet",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["ios", "android", "desktop"],
      custody: "non-custodial",
      features: ["staking", "multi-asset"],
      type: "light",
    },
  },
  {
    title: "Daedalus",
    description:
      "Full-node Cardano wallet developed by IOG, one of Cardano's founding entities. Validates the chain locally rather than trusting third parties.",
    tagline: "Full-node Cardano wallet by IOG",
    icon: "/img/app-icons/daedalus.svg",
    website: "https://daedaluswallet.io",
    source: "https://github.com/input-output-hk/daedalus",
    category: "wallet",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["desktop"],
      custody: "non-custodial",
      features: ["staking", "multi-account"],
      type: "full-node",
    },
  },
  {
    title: "SecondFi",
    description:
      "Self-custody neofinance platform on Cardano for spending, trading, earning, and saving. The successor to Yoroi, built by EMURGO.",
    tagline: "Self-custody neofinance, successor to Yoroi",
    icon: "/img/app-icons/secondfi.png",
    website: "https://secondfi.io",
    source: null,
    category: "wallet",
    properties: ["nft", "mobile"],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["ios", "android", "browser"],
      custody: "non-custodial",
      features: ["staking", "nft", "dapp-connector", "hardware-wallet", "governance", "qr-claim"],
      type: "light",
    },
  },
  {
    title: "Cardano Updates",
    description:
      "Tracks Cardano development progress in real time, surfacing pull-request activity and release status without needing to dig through GitHub.",
    tagline: "Cardano development tracker without GitHub digging",
    icon: "/img/app-icons/cardano-updates.jpg",
    website: "https://cardanoupdates.com",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "Pool Stats",
    description: "Cardano stake-pool monitoring with heat-map visualizations of performance, saturation, and rewards across the entire pool universe.",
    tagline: "Pool tool with heat-map visualizations",
    icon: "/img/app-icons/pool-stats.png",
    website: "https://poolstats.io",
    source: null,
    category: "pooltool",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "NOWPayments",
    description:
      "Payment gateway that lets merchants and creators accept ada and other cryptocurrencies for sales, subscriptions, and donations.",
    tagline: "Payment gateway for ada payments and donations",
    icon: "/img/app-icons/nowpayments.ico",
    website: "https://nowpayments.io",
    source: null,
    category: "other",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "NOWPayments_io",
  },
  {
    title: "Gimbalabs",
    description:
      "Collaborative community and space where dApps and open-source tools are developed in the Playground project-based learning experience on Cardano.",
    tagline: "Project-based learning community for Cardano dApps",
    icon: "/img/app-icons/gimbalabs.jpg",
    website: "https://gimbalabs.com",
    source: "https://gitlab.com/gimbalabs",
    category: "education",
    properties: ["opensource"],
    maintainerPick: true,
    beginnerFriendly: false,
    x: "gimbalabs",
    spotlight: {
      url: "https://developers.cardano.org/blog/2023-01-02-january/",
      title: "Cardano Developer Spotlight: January 2023",
      date: "2023-01-02",
    },
  },
  {
    title: "Eternl",
    description:
      "Feature-rich Cardano light wallet for browser and mobile. Favored by experienced users for power features the community has requested most.",
    tagline: "Power-user wallet for browser and mobile",
    preview: require("./app-screenshots/eternl.webp"),
    extraPreviews: [
      require("./app-screenshots/eternl-staking.webp"),
      require("./app-screenshots/eternl-governance.webp"),
    ],
    icon: "/img/app-icons/eternl.jpg",
    website: "https://eternl.io",
    source: null,
    category: "wallet",
    properties: ["nft", "mobile"],
    maintainerPick: true,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["ios", "android", "browser"],
      custody: "non-custodial",
      features: ["staking", "nft", "dapp-connector", "multi-asset", "hardware-wallet", "multi-account", "governance", "qr-claim"],
      type: "light",
    },
  },
  {
    title: "Token & NFT Builder",
    description:
      "Create your own native Cardano tokens and NFTs without writing any code, with policy management and metadata templates handled in-app.",
    tagline: "No-code native token and NFT minting tool",
    website: "https://cardano-native-token.com/",
    source: null,
    category: "minting",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "cardano-tools.io",
    description:
      "Open-source CNFT minting toolkit. Configure metadata, royalties, and minting policies entirely client-side; you only pay network fees.",
    tagline: "Open-source CNFT maker, pay only network fees",
    icon: "/img/app-icons/cardano-tools-io.png",
    website: "https://cardano-tools.io",
    source: "https://github.com/wutzebaer/cardano-tools",
    category: "minting",
    properties: ["nft", "opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Typhon",
    description:
      "Light wallet from the creators of cardanoscan.io. It comes with features like NFT gallery, transaction metadata, vote registration, among other features.",
    tagline: "Light wallet with NFT gallery and metadata tools",
    icon: "/img/app-icons/typhon.jpg",
    website: "https://typhonwallet.io",
    source: null,
    category: "wallet",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["browser"],
      custody: "non-custodial",
      features: ["staking", "nft", "dapp-connector", "multi-asset", "hardware-wallet", "multi-account", "governance"],
      type: "light",
    },
  },
  {
    title: "Reward Calculator",
    description:
      "Detailed Cardano staking rewards calculator showing expected returns to operators and delegators, with a Monte Carlo simulation for return variability.",
    tagline: "Pool reward calculator with Monte Carlo sim",
    icon: "/img/app-icons/reward-calculator.png",
    preview: require("./app-screenshots/reward-calculator.webp"),
    extraPreviews: [
      require("./app-screenshots/reward-calculator-pools.webp"),
      require("./app-screenshots/reward-calculator-parameters.webp"),
    ],
    website: "https://cardano.org/calculator/",
    source: null,
    category: "pooltool",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "MuesliSwap",
    description:
      "Order-book DEX with limit orders and matching running natively on Cardano, also operating on Smart Bitcoin Cash for cross-chain orders.",
    tagline: "Order-book DEX on Cardano",
    icon: "/img/app-icons/muesliswap.webp",
    statsLabel: "muesliswap",
    website: "https://muesliswap.com/",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "SundaeSwap",
    description:
      "Native, scalable Cardano AMM DEX with automated liquidity provision, yield farming, and an order-book overlay built on Plutus.",
    tagline: "Native scalable AMM DEX on Cardano",
    preview: require("./app-screenshots/sundaeswap.webp"),
    extraPreviews: [
      require("./app-screenshots/sundaeswap-pools.webp"),
      require("./app-screenshots/sundaeswap-portfolio.webp"),
    ],
    icon: "/img/app-icons/sundaeswap.jpg",
    website: "https://app.sundae.fi",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "DripDropz",
    description:
      "We provide token dispensing services to the Cardano community. An intuitive platform that offers projects a comprehensive selection of distribution parameters.",
    tagline: "Token dispensing and airdrop platform",
    preview: require("./app-screenshots/dripdropz.webp"),
    icon: "/img/app-icons/dripdropz.jpg",
    website: "https://dripdropz.io",
    source: null,
    category: "distribution",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "Minswap",
    description:
      "Multi-pool decentralized exchange on Cardano with deep liquidity, yield farming, and one of the highest-volume venues for native token swaps.",
    tagline: "Multi-pool decentralized exchange on Cardano",
    preview: require("./app-screenshots/minswap.webp"),
    extraPreviews: [
      require("./app-screenshots/minswap-trade.webp"),
      require("./app-screenshots/minswap-chart.webp"),
    ],
    icon: "/img/app-icons/minswap.svg",
    statsLabel: "minswap",
    website: "https://minswap.org",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: true,
    x: "MinswapDEX",
    spotlight: {
      url: "https://developers.cardano.org/blog/2022-04-27-april/",
      title: "Cardano Developer Spotlight: April 2022",
      date: "2022-04-27",
    },
  },
  {
    title: "GameChanger Wallet",
    description:
      "The ultimate wallet experience for the Web, with native NFT and token features, powered by Cardano and third party applications.",
    tagline: "Web wallet with native NFT and dApp connector",
    icon: "/img/app-icons/gamechanger.jpg",
    website: "https://gamechanger.finance",
    source: null,
    category: "wallet",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["browser", "web"],
      custody: "non-custodial",
      features: ["nft", "dapp-connector", "multi-asset"],
      type: "light",
    },
  },
  {
    title: "GeroWallet",
    description:
      "Start exploring the possibilities of Cardano. Purchase, send, and receive ADA - the cryptocurrency for Cardano. Available as a browser extension.",
    tagline: "Cardano browser-extension wallet for ada and tokens",
    icon: "/img/app-icons/gero.jpg",
    website: "https://gerowallet.io",
    source: null,
    category: "wallet",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["browser"],
      custody: "non-custodial",
      features: ["staking", "dapp-connector"],
      type: "light",
    },
  },
  {
    title: "Built on Cardano",
    description:
      "Discovery directory for projects, dApps, and developer tools on Cardano. Browse by category, find similar projects, and navigate the ecosystem easily.",
    tagline: "Discover projects and developer tools on Cardano",
    icon: "/img/app-icons/built-on-cardano.jpg",
    website: "https://builtoncardano.com",
    source: null,
    category: "ecosystem",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "gerowallet",
  },
  {
    title: "CardanoCube",
    description:
      "Curated directory of 650+ projects building on Cardano, organized by category with filters for DeFi, NFTs, governance, infrastructure, and more.",
    tagline: "Directory of 650+ projects building on Cardano",
    icon: "/img/app-icons/cardanocube.png",
    website: "https://www.cardanocube.com/",
    source: null,
    category: "ecosystem",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
    x: "CardanoCube",
  },
  {
    title: "Pavia",
    description:
      "User-owned virtual world on Cardano where players buy land NFTs, build experiences, and trade assets with other residents of the metaverse.",
    tagline: "User-owned virtual world on Cardano",
    icon: "/img/app-icons/pavia.svg",
    website: "https://www.pavia.io",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "Pavia_io",
  },
  {
    title: "WingRiders",
    description:
      "Native AMM DEX on Cardano focused on fast settlement and predictable fees, with stableswap pools and an integrated yield-farming layer.",
    tagline: "Native AMM DEX on Cardano",
    preview: require("./app-screenshots/wingriders.webp"),
    extraPreviews: [
      require("./app-screenshots/wingriders-pools.webp"),
    ],
    icon: "/img/app-icons/wingriders.png",
    statsLabel: "wingriders",
    website: "https://www.wingriders.com",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "wingriderscom",
  },
  {
    title: "Lido Nation",
    description:
      "Aggregator for Project Catalyst that surfaces proposals, voting results, community feedback, and DRep activity in a single dashboard.",
    tagline: "Aggregator for Project Catalyst proposals",
    icon: "/img/app-icons/lido-nation.png",
    website: "https://www.lidonation.com/en/catalyst-explorer",
    source: null,
    category: "ecosystem",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "eUTxO",
    description:
      "Visual Cardano blockchain explorer that maps transactions, datums, and assets across the eUTXO model into interactive graphs.",
    tagline: "Visual blockchain explorer for Cardano",
    icon: "/img/app-icons/eutxo.png",
    website: "https://eutxo.org",
    source: null,
    category: "explorer",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Vibrant",
    description:
      "Community integration tool for stake-pool operators and NFT projects to verify delegators and holders, run polls, and manage whitelists via Discord.",
    tagline: "Discord verification for stake pools and NFT teams",
    icon: "/img/app-icons/vibrant.png",
    website: "https://www.vibrantnet.io",
    source: "https://github.com/nilscodes/hazelnet",
    category: "other",
    properties: ["nft", "opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "VibrantNet_io",
  },
  {
    title: "Book.io",
    description:
      "NFT marketplace where readers buy, read, and resell eBooks and audiobooks. Each title is an asset with verifiable provenance and resale rights.",
    tagline: "NFT marketplace for eBooks and audiobooks",
    preview: require("./app-screenshots/book-io.webp"),
    extraPreviews: [
      require("./app-screenshots/book-io-detail.webp"),
    ],
    icon: "/img/app-icons/book-io.jpg",
    website: "https://book.io",
    source: null,
    category: "marketplace",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "NuFi Wallet",
    description:
      "Non-custodial multi-chain wallet supporting Cardano alongside other major networks, with an in-app DEX for swaps without leaving the wallet.",
    tagline: "Non-custodial multi-chain wallet with built-in DEX",
    icon: "/img/app-icons/nufi.png",
    website: "https://nu.fi",
    source: null,
    category: "wallet",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["browser"],
      custody: "non-custodial",
      features: ["staking", "nft", "dapp-connector", "multi-asset", "dex", "hardware-wallet"],
      type: "light",
    },
  },
  {
    title: "CNFTLab Party",
    description:
      "CNFT minting platform with policy ID management, on-chain royalty configuration, and bulk minting workflows ready in minutes.",
    tagline: "CNFT minting with policy and royalty controls",
    icon: "/img/app-icons/cnftlab-party.ico",
    website: "https://www.cnftlab.party/",
    source: null,
    category: "minting",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "nufiwallet",
  },
  {
    title: "TapTools",
    description:
      "All-in-one Cardano portfolio tracker and market analytics with token charts, NFT generation tools, and on-chain activity dashboards.",
    tagline: "Cardano portfolio tracker and market analytics",
    icon: "/img/app-icons/taptools.jpg",
    website: "https://www.taptools.io",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "Dune",
    description: "Dune is a powerful tool for blockchain research, providing instant on-chain data analysis and community-driven dashboards for the Cardano ecosystem.",
    tagline: "On-chain data analysis with community dashboards",
    icon: "/img/app-icons/dune.svg",
    website: "https://dune.com/browse/dashboards?q=cardano",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Chainport",
    description:
      "Audited blockchain bridge connecting EVM chains to Cardano with a single-click experience, smart-contract attestations, and ported asset tracking.",
    tagline: "Bridge between EVM chains and Cardano",
    icon: "/img/app-icons/chainport.svg",
    website: "https://www.chainport.io/",
    source: null,
    category: "bridge",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "chain_port",
  },
  {
    title: "Cardano Studio",
    description:
      "Mint NFTs on Cardano fully in your browser. Keys, metadata, and policy IDs stay on your device — no third party touches the minting flow.",
    tagline: "Self-custody NFT minting in your browser",
    icon: "/img/app-icons/cardano-studio.jpg",
    website: "https://cardano-studio.app",
    source: null,
    category: "minting",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "cardano_studio",
  },
  {
    title: "Cardano Relay Map",
    description:
      "Geographic map of Cardano stake-pool relay nodes with filters for region, pool, and operator. Useful for monitoring decentralization in real time.",
    tagline: "Geographic map of Cardano stake-pool relays",
    icon: "/img/app-icons/cardano-relay-map.png",
    website: "https://monadpool.com/cardano.html",
    source: null,
    category: "pooltool",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Finitum Bridge",
    description:
      "Cross-chain bridge for moving supported tokens between Cardano and BSC. Wraps assets on the destination chain with custodian-backed reserves.",
    tagline: "Cross-chain bridge between Cardano and BSC",
    icon: "/img/app-icons/finitum-bridge.png",
    website: "https://finitum.io/bridge",
    source: null,
    category: "bridge",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "BALANCE Analytics",
    description:
      "Graphical, configurable analytics dashboards specialising in Cardano PoS decentralization metrics, stake distribution, and network health signals.",
    tagline: "Decentralization metrics dashboards for Cardano",
    icon: "/img/app-icons/balance-analytics.svg",
    website: "https://www.balanceanalytics.io/",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "adahandle",
    description:
      "Standardized NFT that maps a Cardano wallet address to a human-readable handle. Used by wallets and dApps as the network's de facto naming layer.",
    tagline: "Human-readable Cardano addresses as NFTs",
    icon: "/img/app-icons/adahandle.jpg",
    website: "https://handle.me/",
    source: null,
    category: "identity",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Lace",
    description:
      "Light wallet platform from IOG, audited by an independent reviewer. Lace lets you manage your digital assets and connect to Web3 dApps on Cardano.",
    tagline: "Light wallet from IOG with Web3 integrations",
    icon: "/img/app-icons/lace.jpg",
    website: "https://www.lace.io/",
    source: "https://github.com/input-output-hk/lace",
    category: "wallet",
    properties: ["nft", "opensource"],
    maintainerPick: true,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["browser"],
      custody: "non-custodial",
      features: ["staking", "nft", "dapp-connector", "multi-asset", "hardware-wallet", "governance"],
      type: "light",
    },
  },
  {
    title: "Continuity Token",
    description:
      "Provides secure, long-term cold-storage backups of Cardano NFT media so collections survive even if the original IPFS or Arweave host disappears.",
    tagline: "Cold-storage backups of Cardano NFT media",
    icon: "/img/app-icons/continuity-token.svg",
    website: "https://continuity.to/",
    source: null,
    category: "notary",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "lace_io",
  },
  {
    title: "VESPR",
    description:
      "Non-custodial mobile wallet for Cardano. Designed for newcomers with simple onboarding, friendly defaults, and security that keeps private keys on-device.",
    tagline: "Beginner-friendly mobile wallet",
    preview: require("./app-screenshots/vespr.webp"),
    extraPreviews: [
      require("./app-screenshots/vespr-nfts.webp"),
      require("./app-screenshots/vespr-swap.webp"),
    ],
    icon: "/img/app-icons/vespr.jpg",
    statsLabel: "vespr",
    website: "https://www.vespr.xyz/#/",
    source: null,
    category: "wallet",
    properties: ["nft", "mobile"],
    maintainerPick: true,
    beginnerFriendly: false,
    spotlight: {
      url: "https://developers.cardano.org/blog/2024-01-22-january/",
      title: "Cardano Developer Spotlight: January 2024",
      date: "2024-01-22",
    },
    walletFeatures: {
      platforms: ["ios", "android"],
      custody: "non-custodial",
      features: ["staking", "nft", "dapp-connector", "multi-asset", "governance", "qr-claim", "easy-setup"],
      type: "light",
    },
  },
  {
    title: "DexHunter",
    description:
      "Cardano DEX aggregator that routes trades across all major venues for competitive pricing, with real-time alerts and a unified interface.",
    tagline: "Cardano DEX aggregator with real-time alerts",
    preview: require("./app-screenshots/dexhunter.webp"),
    extraPreviews: [
      require("./app-screenshots/dexhunter-trending.webp"),
    ],
    icon: "/img/app-icons/dexhunter.svg",
    statsLabel: "dexhunter",
    website: "https://www.dexhunter.io/",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "dexhunterio",
    spotlight: {
      url: "https://developers.cardano.org/blog/2024-12-09-december/",
      title: "Cardano Developer Spotlight: December 2024",
      date: "2024-12-09",
    },
  },
  {
    title: "Liqwid",
    description:
      "Non-custodial pooled lending protocol on Cardano with liquid staking, supporting multiple supplied assets and qToken collateral receipts.",
    tagline: "Non-custodial lending with liquid staking",
    preview: require("./app-screenshots/liqwid.webp"),
    extraPreviews: [
      require("./app-screenshots/liqwid-loans.webp"),
      require("./app-screenshots/liqwid-swap.webp"),
    ],
    icon: "/img/app-icons/liqwid.png",
    statsLabel: "liqwid-finance",
    website: "https://app.liqwid.finance",
    source: "https://github.com/liqwid-labs",
    category: "lending",
    properties: ["opensource"],
    maintainerPick: true,
    beginnerFriendly: true,
    x: "liqwidfinance",
  },
  {
    title: "Charli3",
    description:
      "Charli3 is a decentralized Oracle solution on Cardano, built natively for the chain, producing fully auditable data records on Cardano ledger.",
    tagline: "Native decentralized oracle on Cardano",
    icon: "/img/app-icons/charli3.jpg",
    statsLabel: "charli3",
    website: "https://charli3.io",
    source: "https://github.com/Charli3-Official/charli3-pull-oracle-contracts",
    category: "other",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "Oraclecharli3",
  },
  {
    title: "Cardano Academy",
    description:
      "Online courses on blockchain fundamentals, consensus algorithms, transaction models, scaling, and Cardano governance, staking, and dApp development.",
    tagline: "Online courses on Cardano and blockchain basics",
    icon: "/img/brand-assets/cardano-starburst-blue.svg",
    website: "https://learn.academy.cardanofoundation.org",
    source: null,
    category: "education",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Governance Tool",
    description:
      "A collection of tools to delegate voting power, become a DRep, become a direct voter, browse or proposa a governance actions on Cardano blockchain.",
    tagline: "Delegate, register as DRep, and vote on proposals",
    icon: "/img/app-icons/govtools.svg",
    website: "https://gov.tools",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Treasury Donation",
    description:
      "Connect a CIP-30 wallet and donate ada directly to the Cardano treasury in a single, non-custodial transaction. Hosted on cardano.org.",
    tagline: "Donate ada to the Cardano treasury",
    website: "https://cardano.org/governance/treasury",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Chang Watch",
    description:
      "Cardano governance dashboard with donut charts and tables that visualize vote distribution, DRep concentration, and governance action outcomes.",
    tagline: "Vote distribution and DRep insights dashboard",
    icon: "/img/app-icons/changwatch.png",
    website: "https://www.changwatch.com",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Medusa Wallet",
    description:
        "A lightweight Cardano wallet focused on privacy and user protection, enabling easy and secure access to funds even in untrusted or compromised environments. ",
    tagline: "Privacy-focused lightweight Cardano wallet",
    icon: "/img/app-icons/medusa.jpg",
    website: "https://adawallet.io",
    source: null,
    category: "wallet",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["web"],
      custody: "non-custodial",
      features: ["staking"],
      type: "light",
    },
   },
  {
    title: "Dano Finance",
    description:
      "All-in-one DeFi platform on Cardano combining lending, borrowing, and trading with cross-pool collateral and unified interest rate markets.",
    tagline: "DeFi platform for lending, borrowing, and trading",
    preview: require("./app-screenshots/dano-finance.webp"),
    extraPreviews: [
      require("./app-screenshots/dano-finance-leverage.webp"),
      require("./app-screenshots/dano-finance-pools.webp"),
    ],
    icon: "/img/app-icons/dano-finance.png",
    statsLabel: "dano-finance",
    website: "https://danogo.io/",
    source: null,
    category: "lending",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Multisig Wallet",
    description:
      "Secure team treasury management and governance participation on Cardano using native multi-signature scripts and an approval workflow UI.",
    tagline: "Multi-signature treasury and governance for teams",
    icon: "/img/app-icons/multisig.png",
    website: "https://multisig.meshjs.dev/features",
    source: null,
    category: "wallet",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["web"],
      custody: "non-custodial",
      features: ["governance", "multi-asset"],
      type: "light",
    },
  },
  {
    title: "Tempo",
    description:
      "Governance tool that streamlines Cardano's decision making. Helps DReps register, gain delegations, and engage delegators; supports DAOs and SPOs too.",
    tagline: "Governance tool for DReps to register and engage",
    icon: "/img/app-icons/tempo.png",
    website: "https://tempo.vote",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Nio",
    description:
      "Tracks and monitors all assets across Cardano wallets and DeFi smart contracts in one dashboard. Surfaces lending positions, LP shares, and yields.",
    tagline: "Track wallets and DeFi smart contract assets",
    icon: "/img/app-icons/nio.png",
    website: "https://nioapp.io",
    source: null,
    category: "other",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "NioApp",
  },
  {
    title: "Begin Wallet",
    description:
      "Non-custodial Cardano wallet for browser and mobile with payment links, deep-link support, Begin ID usernames (ENS-style), and Ledger and Keystone hardware support.",
    tagline: "Non-custodial Cardano wallet for browser and mobile",
    icon: "/img/app-icons/begin.jpg",
    website: "https://begin.is",
    source: null,
    category: "wallet",
    properties: ["nft", "mobile"],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["ios", "android", "browser"],
      custody: "non-custodial",
      features: ["nft", "dapp-connector", "hardware-wallet", "qr-claim", "easy-setup"],
      type: "light",
    },
  },
  {
    title: "Onboard Ninja",
    description:
      "Lets Cardano creators distribute airdrops at in-person events. Attendees scan a code, claim tokens to their wallet, and walk away onboarded.",
    tagline: "In-person Cardano airdrop distribution platform",
    icon: "/img/app-icons/onboard-ninja.png",
    website: "https://onboard.ninja",
    source: null,
    category: "distribution",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "BeginWallet",
  },
    {
    title: "Stuff.io",
    description:
      "Digital-ownership platform on Cardano letting consumers own, share, gift, or resell their movies, music, ebooks, audiobooks, and podcasts as NFTs.",
    tagline: "True digital ownership for media you can resell",
    icon: "/img/app-icons/stuff-io.png",
    website: "https://stuff.io",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "stuff_io",
  },
  {
    title: "Veridian Wallet",
    description:
      "Manages identity across platforms using decentralized public key infrastructure and verifiable credentials. Built on KERI, optionally anchored to Cardano.",
    tagline: "Decentralized identity and verifiable credentials",
    icon: "/img/app-icons/veridian-wallet.png",
    website: "https://www.veridian.id/",
    source: "https://github.com/cardano-foundation/veridian-wallet",
    category: "identity",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    spotlight: {
      url: "https://developers.cardano.org/blog/2025-11-07-media-cardano-developer-office-hours/",
      title: "Cardano Developer Office Hours",
      date: "2025-11-07",
    },
  },
  {
    title: "Governance Space",
    description:
      "Blockchain governance platform for DAOs, projects, and institutions, providing indexing and analytics for DReps, governance actions, and committee work.",
    tagline: "Indexer and analytics for Cardano governance",
    icon: "/img/app-icons/govspace.png",
    website: "https://governancespace.com/",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Adastack.io",
    description:
      "Comprehensive Cardano ecosystem explorer: Explore intro guides, wallets, DApps, NFTs, games, governance, Project Catalyst, DAOs, development, sidechains, L2s and more.",
    tagline: "Cardano ecosystem explorer and intro guide hub",
    icon: "/img/app-icons/adastack-io.png",
    website: "https://www.adastack.io",
    source: null,
    category: "ecosystem",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "adastackio",
  },
  {
    title: "ADAM Cardano App",
    description:
      "Mobile app (iOS and Android) for tracking your Cardano wallets, staking rewards, and funds in one cohesive interface, with price widgets and insights.",
    tagline: "iOS and Android tracker for Cardano wallets",
    icon: "/img/app-icons/adam-cardano-app.png",
    website: "https://androdevs.de",
    source: null,
    category: "other",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Governance Voting Tool",
    description:
      "Simple voting tool for Cardano stakeholders to participate in on-chain governance with clear ballot UI, DRep info, and action explanations.",
    tagline: "Simple on-chain governance voting tool",
    icon: "/img/app-icons/cardano-governance-voting-tool.png",
    website: "https://voting.cardanofoundation.org/",
    source: "https://github.com/cardano-foundation/cardano-governance-voting-tool",
    category: "governance",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Andamio",
    description:
      "Verified trust protocol for distributed work on Cardano. Organizations mint credentials and find contributors; individuals learn, join, and launch projects.",
    tagline: "Verified credentials and project work coordination",
    icon: "/img/app-icons/andamio.jpg",
    website: "https://www.andamio.io/",
    source: null,
    category: "identity",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "andamio_teams",
  },
  {
    title: "CSWAP",
    description:
      "CSWAP Systems is a next-gen decentralized exchange (DEX) that bridges tokens, NFTs, and real-world assets in one seamless trading ecosystem. ",
    tagline: "DEX for tokens, NFTs, and real-world assets",
    preview: require("./app-screenshots/cswap.webp"),
    extraPreviews: [
      require("./app-screenshots/cswap-farms.webp"),
    ],
    icon: "/img/app-icons/cswap.jpg",
    statsLabel: "cswap",
    website: "https://www.cswap.fi/",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "FluidTokens",
    description:
      "Cardano-Bitcoin DeFi protocol covering lending, borrowing, staking, sponsored transactions, rental positions, and boosted-stake products.",
    tagline: "Cardano-Bitcoin lending and borrowing protocol",
    preview: require("./app-screenshots/fluidtokens.webp"),
    extraPreviews: [
      require("./app-screenshots/fluidtokens-borrow.webp"),
      require("./app-screenshots/fluidtokens-gold.webp"),
    ],
    icon: "/img/app-icons/fluidtoken.png",
    website: "https://fluidtokens.com/",
    source: "https://github.com/fluidtokens",
    category: "lending",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "FluidTokens",
    spotlight: {
      url: "https://developers.cardano.org/blog/2025-02-03-february/",
      title: "Cardano Developer Spotlight: February 2025",
      date: "2025-02-03",
    },
  },
  {
    title: "Genius Yield",
    description:
      "All-in-one Cardano DeFi platform combining a fully on-chain order-book DEX with an automated yield optimizer that compounds positions.",
    tagline: "Order-book DEX with built-in yield optimizer",
    icon: "/img/app-icons/genius-yield.jpg",
    statsLabel: "geniusyield",
    website: "https://www.geniusyield.co/",
    source: "https://github.com/geniusyield",
    category: "dex",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "GeniusyieldO",
  },
  {
    title: "Iagon",
    description:
      "Iagon is an AI-driven shared storage and compute economy. Bridging decentralization with compliance to revolutionize cloud services.",
    tagline: "Decentralized storage and compute marketplace",
    icon: "/img/app-icons/iagon.png",
    website: "https://iagon.com",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "IagonOfficial",
    spotlight: {
      url: "https://developers.cardano.org/blog/2025-09-29-september/",
      title: "Cardano Developer Spotlight: September 2025",
      date: "2025-09-29",
    },
  },
  {
    title: "VyFinance",
    description:
      "Cardano DeFi protocol with a decentralized exchange, redistributive BAR mechanism, governance, lottery, and token and NFT vaults bundled together.",
    tagline: "DeFi protocol with DEX, vaults, and governance",
    icon: "/img/app-icons/vyfinance.png",
    statsLabel: "vyfinance",
    website: "https://vyfi.io",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Splash",
    description:
      "Open-source decentralized protocol for efficient market-making and trading on Cardano, with batched settlement and gas-efficient routing.",
    tagline: "Open-source market-making and trading protocol",
    icon: "/img/app-icons/splash.svg",
    statsLabel: "splash",
    website: "https://www.splash.trade/",
    source: "https://github.com/splashprotocol/splash-core",
    category: "dex",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Palmyra",
    description:
      "Real-world-asset tokenization on Cardano focused on underserved commodities, opening fractional investment access to producers and traders.",
    tagline: "Tokenization for underserved RWA commodities",
    icon: "/img/app-icons/palmyra.png",
    website: "https://palmeconomy.io/",
    source: "https://github.com/zenGate-Global/winter-cardano",
    category: "marketplace",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "palmeconomy",
  },
  {
    title: "Optim Finance",
    description:
      "Decentralized yield optimization on Cardano with a suite of vaults that auto-compound staking, lending, and DEX-LP positions to maximize yield.",
    tagline: "Yield optimization suite for Cardano DeFi",
    icon: "/img/app-icons/optim-finance.jpg",
    website: "https://www.optim.finance/",
    source: null,
    category: "lending",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "OptimFi",
  },
  {
    title: "Farmroll",
    description:
      "Cardano community engagement platform with token-gated rewards, automated participation tracking, and AI-driven campaign tools for projects.",
    tagline: "AI-driven community engagement and rewards",
    icon: "/img/app-icons/farmroll.png",
    website: "https://farmroll.io/",
    source: null,
    category: "other",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Empowa",
    description:
      "Join a RWA project looking to enable 1 million African families to become owners of a climate-smart home across Africa by 2030.",
    tagline: "RWA project for climate-smart housing in Africa",
    icon: "/img/app-icons/empowa.png",
    website: "https://empowa.io/",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Strike Finance",
    description:
      "DeFi derivatives protocol on Cardano offering perpetual futures with on-chain margin, leverage, and oracle-priced settlement.",
    tagline: "Perpetual futures derivatives protocol on Cardano",
    preview: require("./app-screenshots/strike.webp"),
    icon: "/img/app-icons/strike.png",
    statsLabel: "strike-finance",
    website: "https://www.strikefinance.org/",
    source: "https://github.com/strike-finance/perpetuals-smart-contracts",
    category: "dex",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: true,
    x: "strikeperps",
  },
  {
    title: "Snek.fun",
    description:
      "Fair-launch memecoin launchpad on Cardano. Tokens launch in seconds for a flat fee with built-in liquidity protection and no team allocations.",
    tagline: "Fair-launch memecoin launchpad on Cardano",
    icon: "/img/app-icons/snek-fun.jpg",
    website: "https://snek.fun/",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "snekdotfun",
  },
  {
    title: "Xerberus",
    description:
      "Xerberus' Risk Ratings deliver automated, objective, and real-time insights derived from on-chain data, providing investors and dApps with accurate risk assessments.",
    tagline: "Real-time on-chain risk ratings for assets",
    icon: "/img/app-icons/xerberus.jpg",
    website: "https://www.xerberus.io/",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "Xerberus",
  },
  {
    title: "Masumi",
    description:
      "Masumi is a decentralized protocol empowering AI agents to collaborate seamlessly and monetize their services efficiently.",
    tagline: "Decentralized protocol for AI agent collaboration",
    icon: "/img/app-icons/masumi.png",
    statsLabel: "masumi",
    website: "https://www.masumi.network",
    source: "https://github.com/masumi-network",
    category: "marketplace",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "MasumiNetwork",
    spotlight: {
      url: "https://developers.cardano.org/blog/2025-06-24-june/",
      title: "Cardano Developer Interview: June 2025",
      date: "2025-06-24",
    },
  },
  {
    title: "Finest",
    description:
      "Invest in tokenized real-world assets on Cardano. Fully regulated and compliant under European securities frameworks for institutional access.",
    tagline: "Tokenized real-world asset investing in Europe",
    icon: "/img/app-icons/finest.png",
    website: "https://www.finest.investments/",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Butane",
    description:
      "Decentralized synthetics platform on Cardano enabling on-chain price exposure to off-chain assets via collateralized synthetic positions.",
    tagline: "Decentralized synthetics platform on Cardano",
    icon: "/img/app-icons/butane.jpg",
    website: "https://butane.dev/",
    source: "https://github.com/butaneprotocol/butane-contracts",
    category: "lending",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Bodega Market",
    description:
      "Prediction market on Cardano for speculating on real-world event outcomes. Settles outcomes on-chain using oracle data and Plutus smart contracts.",
    tagline: "Cardano prediction market for real-world events",
    preview: require("./app-screenshots/bodega.webp"),
    extraPreviews: [
      require("./app-screenshots/bodega-market.webp"),
    ],
    icon: "/img/app-icons/bodega.png",
    statsLabel: "bodega",
    website: "https://v3.bodegamarket.io",
    source: "https://github.com/bodega-market/bodega-market-smart-contracts",
    category: "marketplace",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: true,
  },
  {
    title: "Infinity Rising",
    description:
      "Open-world sandbox MMO and multiverse simulator set between Cornucopias in the sky, the broken Earth below, and worlds beyond. Explore, craft, build, trade.",
    tagline: "Open-world sandbox MMO and multiverse simulator",
    icon: "/img/app-icons/infinity-rising.jpg",
    website: "https://infinityrising.com",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "InfinityRisingX",
  },
  {
    title: "Reeve",
    description:
      "Project (also known as Ledger on the Blockchain or LOB) developing a Cardano-based decentralized ledger for digital recording of accounting data.",
    tagline: "Decentralized ledger for accounting records",
    icon: "/img/brand-assets/cardano-starburst-blue.svg",
    website: "https://www.cardanofoundation.org/reeve#mission",
    source: "https://github.com/cardano-foundation/cf-reeve-platform",
    category: "notary",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Ascent Rivals",
    description:
      "Multiplayer racing-combat game with dual-engine twin-stick controls. Compete in tournaments, place rival contracts, and master risk-reward death racing.",
    tagline: "Multiplayer racing-combat game with rival contracts",
    icon: "/img/app-icons/ascent-rivals.jpg",
    website: "https://www.ascentrivals.com/",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "AscentRivals",
  },
  {
    title: "Asteria",
    description:
      "Fully on-chain strategy game built for developers. Pilot a spaceship across a 2D grid where every entity is a Cardano eUTXO and Plutus contract.",
    tagline: "On-chain strategy game where everything is a UTxO",
    icon: "/img/app-icons/asteria.png",
    website: "https://asteria.txpipe.io",
    source: "https://github.com/txpipe/asteria",
    category: "game",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Ale & Axes",
    description:
      "Mobile and browser fantasy RPG built on Cardano. NFTs unlock in-game perks, advanced tokenomics reward long-term play, and web2 and web3 gamers play together.",
    tagline: "Mobile and browser fantasy RPG on Cardano",
    icon: "/img/app-icons/ale-axes.jpg",
    website: "https://aleaxes.com/",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "Mynth",
    description:
      "Cross-chain swap network bridging Cardano with any-token-to-any-token routes across multiple chains. Settles cross-chain trades through audited relays.",
    tagline: "Cross-chain swap network for any token pair",
    icon: "/img/app-icons/mynth.png",
    website: "https://mynth.ai",
    source: null,
    category: "bridge",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Clarity Protocol",
    description:
      "Community governance and management toolkit usable by any Cardano project. Provides proposal flows, voting, treasury controls, and member registries.",
    tagline: "Community governance toolkit for Cardano projects",
    icon: "/img/app-icons/clarity-protocol.jpg",
    website: "https://www.clarity.community/",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Indigo",
    description:
      "Autonomous synthetics protocol on Cardano for on-chain price exposure to real-world assets. Mints iAssets backed by collateralized debt positions.",
    tagline: "Synthetics protocol for on-chain RWA exposure",
    preview: require("./app-screenshots/indigo.webp"),
    extraPreviews: [
      require("./app-screenshots/indigo-earn.webp"),
      require("./app-screenshots/indigo-dao.webp"),
    ],
    icon: "/img/app-icons/indy.png",
    statsLabel: "indigo-protocol",
    website: "https://indigoprotocol.io/",
    source: "https://github.com/IndigoProtocol/indigo-smart-contracts",
    category: "lending",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "indigo_protocol",
  },
  {
    title: "Orcfax",
    description:
      "Decentralized oracle service publishing real-world event data to Cardano. Data is delivered to on-chain Plutus contracts in eUTXO-native format.",
    tagline: "Decentralized oracle for real-world data on Cardano",
    icon: "/img/app-icons/orcfax.jpg",
    website: "https://orcfax.io",
    source: "https://github.com/orcfax/orcfax-aiken",
    category: "other",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "orcfax",
  },
  {
    title: "Arp Radio",
    description:
      "Cardano music ecosystem player. Discover, mint, and play CIP-60 music NFT collections in a custom audio player tuned to consensus and slot timing.",
    tagline: "Music NFT player based on CIP-60 token standard",
    icon: "/img/app-icons/arp-radio.webp",
    website: "https://arpradio.media",
    source: null,
    category: "other",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "CGOV",
    description:
      "A governance monitoring dashboard to track and analyze on-chain governance actions, including active, ratified, and expired proposals on the Cardano blockchain.",
    tagline: "Governance dashboard for proposals and voting",
    icon: "/img/app-icons/cgov.png",
    website: "https://app.cgov.io/",
    source: "https://github.com/nomos-guild/cgov",
    category: "governance",
    properties: ["opensource"],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Treasury Explorer",
    description:
      "A dashboard for exploring and analyzing Cardano's treasury data, providing insights into treasury balance, withdrawals, and funding allocations.",
    tagline: "Cardano treasury balance and outflows dashboard",
    icon: "/img/app-icons/cardano-treasury.png",
    website: "https://cardanotreasury.fi/",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Sundae Treasury Dashboard",
    description:
      "A smart contract-based treasury management platform by Sundae Labs for transparent milestone-based fund disbursements from Cardano governance actions.",
    tagline: "Milestone-based treasury disbursement platform",
    icon: "/img/app-icons/sundae-treasury.svg",
    website: "https://treasury.sundae.fi/",
    source: "https://github.com/SundaeSwap-finance/treasury-contracts",
    category: "governance",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Supply Summary",
    description:
      "Explore historical trends in Cardano's ada supply distribution, including reserves, rewards, treasury, and deposits across epochs.",
    tagline: "Historical Ada supply and treasury distribution",
    icon: "/img/brand-assets/cardano-starburst-blue.svg",
    website: "https://cardano.org/insights/supply/summary/",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "WanBridge",
    description:
      "Decentralized cross-chain bridge infrastructure connecting Cardano with multiple EVM and non-EVM networks via threshold-signature relayers.",
    tagline: "Cross-chain bridge for EVM and non-EVM networks",
    preview: require("./app-screenshots/wanbridge.webp"),
    icon: "/img/app-icons/wanbridge.svg",
    statsLabel: "wanchain",
    website: "https://bridge.wanchain.org/AssetBridge",
    source: null,
    category: "bridge",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "UVerify",
    description: "Every fingerprint is a fully interactive decentralized app: customziable, shareable, instantly verifiable, and permanent. No blockchain experience required.",
    tagline: "UVerify records tamper-proof fingerprints on Cardano",
    preview: require("./app-screenshots/uverify.webp"),
    extraPreviews: [
      require("./app-screenshots/uverify-file-integrity.webp"),
      require("./app-screenshots/uverify-connected-goods.webp"),
    ],
    icon: "/img/app-icons/uverify.png",
    statsLabel: "uverify",
    website: "https://uverify.io",
    source: "https://github.com/UVerify-io",
    category: "notary",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "uvfyhq",
    spotlight: {
      url: "https://developers.cardano.org/blog/2025-06-13-media-cardano-developer-office-hours/",
      title: "Cardano Developer Office Hours",
      date: "2025-06-13",
    },
  },
  {
    title: "CommitProof",
    description: "Prove what you knew and when. Hash any file or text locally, then commit the proof to Cardano. Your original never leaves your device. The timestamp is public and verifiable.",
    tagline: "Tamper-proof timestamps for files and ideas",
    preview: require("./app-screenshots/commitproof.webp"),
    extraPreviews: [
      require("./app-screenshots/commitproof-committed.webp"),
      require("./app-screenshots/commitproof-verify.webp"),
    ],
    icon: "/img/app-icons/commitproof.svg",
    statsLabel: "commitproof",
    metadataLabel: 8413,
    website: "https://commitproof.com",
    source: null,
    category: "notary",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "CommitProof",
  },
  {
    title: "Plutus Quiz V1000",
    description:
      "Free-to-enter knowledge quiz built on Cardano Plutus smart contracts. Players submit encrypted answers on-chain; the highest scorer claims the prize.",
    tagline: "On-chain Plutus quiz with prize pool",
    icon: "/img/app-icons/gnp1quiz.jpeg",
    statsLabel: "GNP1Quiz",
    website: "https://server-tools.grahamsnumberplus1.com/quiz_V1000/quiz-V1000.html",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "TapDano",
    description: "Verifiable proof infrastructure combining NFC hardware identity with on-chain records on Cardano. Enables cryptographic proof of attendance and compliance.",
    tagline: "NFC hardware identity with on-chain proof",
    icon: "/img/app-icons/tapdano.png",
    metadataLabel: 544,
    website: "https://tapdano.com",
    source: null,
    category: "identity",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Claimpaign",
    description:
      "Cardano airdrop tool for real-world token distribution. Recipients claim from QR codes instead of receiving wallet pushes, putting them in control (CIP-99).",
    tagline: "QR-based airdrop tool for in-person campaigns",
    preview: require("./app-screenshots/claimpaign.webp"),
    extraPreviews: [
      require("./app-screenshots/claimpaign-qrcodes.webp"),
      require("./app-screenshots/claimpaign-analytics.webp"),
    ],
    icon: "/img/app-icons/claimpaign.png",
    statsLabel: "claimpaign",
    metadataLabel: 8414,
    website: "https://claimpaign.com",
    source: null,
    category: "distribution",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "claimpaign",
  },
  {
    title: "Wayup",
    description:
      "Cardano NFT marketplace by Anvil. Continues the smart contracts of JpgStore as the platform sunsets, so existing listings and royalties keep working.",
    tagline: "Cardano NFT marketplace by Anvil, continuing JpgStore",
    preview: require("./app-screenshots/wayup.webp"),
    extraPreviews: [
      require("./app-screenshots/wayup-home.webp"),
    ],
    icon: "/img/app-icons/wayup.png",
    statsLabel: "wayup",
    website: "https://www.wayup.io",
    source: null,
    category: "marketplace",
    properties: ["nft"],
    maintainerPick: true,
    beginnerFriendly: true,
    x: "wayupio",
  },
  {
    title: "Surf Lending",
    description:
      "Pooled lending protocol with isolated markets, each with its own risk profile, for earning interest and borrowing against Cardano native tokens.",
    tagline: "Isolated lending markets on Cardano",
    preview: require("./app-screenshots/surflending.webp"),
    extraPreviews: [
      require("./app-screenshots/surflending-staking.webp"),
    ],
    icon: "/img/app-icons/surflending.png",
    website: "https://surflending.org",
    source: "https://github.com/flow-lending/flow-lending-smart-contracts",
    category: "lending",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "surfcardano",
  },
  {
    title: "Hizz",
    description:
      "Hizz is a live Cardano trading terminal for fast token discovery, AI-powered signals, smart wallet tracking, and seamless trade execution across the Cardano ecosystem.",
    tagline: "The Cardano terminal for AI signals and smart trading.",
    preview: require("./app-screenshots/hizz.webp"),
    extraPreviews: [
      require("./app-screenshots/hizz_pair.webp"),
      require("./app-screenshots/hizz_signal.webp"),
    ],
    icon: "/img/app-icons/hizz.png",
    website: "https://www.hizz.io",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "hizz_io",
  },
  {
    title: "Extended UTxO",
    description:
      "An interactive course on Cardano's Extended UTxO model. Work through playgrounds and simulators, then build and validate your own transactions in a sandbox.",
    tagline: "Interactive course on Cardano's eUTxO model",
    preview: require("./app-screenshots/extended-utxo.webp"),
    extraPreviews: [
      require("./app-screenshots/extended-utxo-journey.webp"),
      require("./app-screenshots/extended-utxo-builder.webp"),
    ],
    icon: "/img/app-icons/extended-utxo.svg",
    website: "https://extendedutxo.com",
    source: null,
    category: "education",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Bending AI",
    description:
      "Cardano DeFi analytics platform with AI-powered insights, real-time token and wallet tracking, and on-chain data visualization for traders and investors.",
    tagline: "AI-powered Cardano DeFi analytics and tracking",
    preview: require("./app-screenshots/bending-ai.jpg"),
    icon: "/img/app-icons/bending-ai.png",
    website: "https://bending.ai",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Pyth Pro",
    description:
      "Pull-based oracle delivering low-latency price feeds for crypto, equities, FX, and commodities to Cardano DeFi, sourced directly from institutional data publishers.",
    tagline: "Low-latency price feeds for Cardano DeFi",
    icon: "/img/app-icons/pyth.jpg",
    website: "https://www.pyth.network",
    source: "https://github.com/pyth-network/pyth-crosschain/tree/main/lazer/contracts/cardano",
    category: "other",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "PythNetwork",
  },
  {
    title: "DRepTalk",
    description:
      "Governance tool for Cardano: delegate your voting power to a DRep, register as a DRep, and discuss every on-chain governance action beside live vote data.",
    tagline: "Delegate, register as a DRep, and discuss governance",
    preview: require("./app-screenshots/dreptalk-home.webp"),
    extraPreviews: [
      require("./app-screenshots/dreptalk.webp"),
      require("./app-screenshots/dreptalk-discussion.webp"),
    ],
    icon: "/img/app-icons/dreptalk.svg",
    statsLabel: "dreptalk.com",
    website: "https://dreptalk.com",
    source: "https://github.com/katomm/dreptalk.com",
    category: "governance",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    x: "dreptalkcom",
  },
{
  title: "EchoForge",
  description: "EchoForge is a B2B2C identity and proof layer on Cardano, built around one principle: keep it simple. Its live products let anyone prove things on-chain for a flat $1 in ADA. EchoCert anchors certificates and credentials so they can be independently verified on-chain. EchoUploader anchors a file's SHA-256 hash as a permanent proof of existence; the file itself never leaves the user's device. EchoID, a wallet-based identity and tiering layer, has its backend live; it has no standalone public frontend and is currently rendered through EchoDash and the ForgeCard kiosk route. All USD prices settle in ADA via an on-chain oracle.",
  tagline: "Anchoring and proof, building toward an identity layer, building toward an identity layer",
  preview: require("./app-screenshots/EchoForge.jpg"),
  extraPreviews: [
    require("./app-screenshots/EchoCert.png"),
    require("./app-screenshots/EchoUploader.png"),
    require("./app-screenshots/EchoDash.png"),
  ],
  icon: "/img/app-icons/EchoForge.svg",
  website: "https://echoforgellc.tech",
  source: "https://github.com/EchoForge-Dev/Aiken_Smart-Contract",
  category: "notary",
  properties: ["opensource"],
  maintainerPick: false,
  beginnerFriendly: false,
  x: "EchoForgeEF",
},
];

export const TagList = Object.keys(Tags);

// Recent submissions count — the last N entries appended to Showcases get a NEW badge.
// New entries are conventionally appended at the end (see add-app.md).
export const RECENT_APPS_COUNT = 5;

// Length constraints enforced by the schema validator and documented in add-app.md.
export const TITLE_MAX_LEN = 25;
export const TAGLINE_MAX_LEN = 60;
export const DESCRIPTION_MIN_LEN = 120;
export const DESCRIPTION_MAX_LEN = 180;

// Derive a stable URL slug from each Showcase title. Mirrors scripts/generate-apps-metadata.js
// so /apps/<slug> in the runtime matches the routes registered by plugins/apps-routes.
function slugifyTitle(title) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
Showcases.forEach((showcase) => {
  showcase.slug = slugifyTitle(showcase.title);
});

function sortShowcases() {
  let result = Showcases;

  // Sort by site name
  result = sortBy(result, (showcase) => showcase.title.toLowerCase());

  // Sort by favorite tag, favorite first
  result = sortBy(result, (showcase) => !showcase.maintainerPick);
  return result;
}

export const SortedShowcases = sortShowcases();

// Fail-fast on common errors
function ensureShowcaseValid(showcase) {
  function checkFields() {
    const keys = Object.keys(showcase);
    const validKeys = [
      "title",
      "slug",
      "description",
      "tagline",
      "preview",
      "extraPreviews",
      "website",
      "source",
      "category",
      "properties",
      "maintainerPick",
      "beginnerFriendly",
      "icon",
      "statsLabel",
      "metadataLabel",
      "statsNote",
      "walletFeatures",
      "spotlight",
      "x",
    ];
    const unknownKeys = difference(keys, validKeys);
    if (unknownKeys.length > 0) {
      throw new Error(
        `Site contains unknown attribute names=[${unknownKeys.join(",")}]`
      );
    }
  }

  function checkTitle() {
    if (!showcase.title) {
      throw new Error("Site title is missing");
    }
    if (showcase.title.length > TITLE_MAX_LEN) {
      throw new Error(
        `title exceeds ${TITLE_MAX_LEN} chars (${showcase.title.length}): ${showcase.title}`
      );
    }
  }

  function checkDescription() {
    if (!showcase.description) {
      throw new Error("Site description is missing");
    }
    const len = showcase.description.length;
    if (len < DESCRIPTION_MIN_LEN || len > DESCRIPTION_MAX_LEN) {
      throw new Error(
        `description must be ${DESCRIPTION_MIN_LEN}-${DESCRIPTION_MAX_LEN} chars, got ${len}: ${showcase.description}`
      );
    }
  }

  function checkWebsite() {
    if (!showcase.website) {
      throw new Error("Site website is missing");
    }
    const isHttpUrl =
      showcase.website.startsWith("http://") ||
      showcase.website.startsWith("https://");
    if (!isHttpUrl) {
      throw new Error(
        `Site website does not look like a valid url: ${showcase.website}`
      );
    }
  }

  function checkPreview() {
    if (showcase.preview == null) return; // optional — card omits the image area entirely
    if (
      showcase.preview instanceof String &&
      (showcase.preview.startsWith("http") || showcase.preview.startsWith("//"))
    ) {
      throw new Error(
        `Site has bad image preview=[${showcase.preview}].\nThe image should be hosted on the Developer Portal GitHub, and not use remote HTTP or HTTPS URLs`
      );
    }
  }

  function checkCategory() {
    if (!showcase.category || typeof showcase.category !== "string") {
      throw new Error(`Missing or invalid category: ${JSON.stringify(showcase.category)}`);
    }
    if (!Categories[showcase.category]) {
      throw new Error(
        `Unknown category=${showcase.category}\nAvailable categories: ${CategoryList.join(", ")}`
      );
    }
  }

  function checkProperties() {
    if (!Array.isArray(showcase.properties)) {
      throw new Error(`properties must be an array, got ${typeof showcase.properties}`);
    }
    const unknown = difference(showcase.properties, PropertyList);
    if (unknown.length > 0) {
      throw new Error(
        `Unknown properties=[${unknown.join(",")}]\nAvailable properties: ${PropertyList.join(", ")}`
      );
    }
  }

  function checkBooleanFlags() {
    for (const key of ["maintainerPick", "beginnerFriendly"]) {
      if (typeof showcase[key] !== "boolean") {
        throw new Error(`${key} must be a boolean, got ${typeof showcase[key]}`);
      }
    }
  }

  function checkOpenSource() {
    if (typeof showcase.source === "undefined") {
      throw new Error(
        "The source attribute is required.\nIf your Cardano project is not open-source, please make it explicit with 'source: null'"
      );
    } else {
      const hasOpenSourceProp = showcase.properties.includes("opensource");
      if (showcase.source === null && hasOpenSourceProp) {
        throw new Error(
          "You can't add the opensource property to a site that does not have a link to source code."
        );
      } else if (showcase.source && !hasOpenSourceProp) {
        throw new Error(
          "For open-source sites, please add 'opensource' to properties."
        );
      }
    }
  }

  function checkTagline() {
    if (showcase.tagline === undefined) return;
    if (typeof showcase.tagline !== "string" || !showcase.tagline.trim()) {
      throw new Error("tagline must be a non-empty string when set");
    }
    if (showcase.tagline.length > TAGLINE_MAX_LEN) {
      throw new Error(
        `tagline exceeds ${TAGLINE_MAX_LEN} chars (${showcase.tagline.length}): ${showcase.tagline}`
      );
    }
  }

  function checkMetadataLabel() {
    if (showcase.metadataLabel === undefined) return;
    if (!Number.isInteger(showcase.metadataLabel) || showcase.metadataLabel <= 0) {
      throw new Error(
        `metadataLabel must be a positive integer (CIP metadata label), got ${JSON.stringify(showcase.metadataLabel)}`
      );
    }
  }

  function checkX() {
    if (showcase.x === undefined) return;
    if (typeof showcase.x !== "string" || !/^[A-Za-z0-9_]{1,15}$/.test(showcase.x)) {
      throw new Error(
        `x must be a Twitter/X handle (1-15 chars, A-Z 0-9 _, no @, no URL), got ${JSON.stringify(showcase.x)}`
      );
    }
  }

  function checkSpotlight() {
    if (showcase.spotlight === undefined) return;
    const s = showcase.spotlight;
    if (!s || typeof s !== "object") {
      throw new Error("spotlight must be an object {url, title, date}");
    }
    for (const key of ["url", "title", "date"]) {
      if (typeof s[key] !== "string" || !s[key]) {
        throw new Error(`spotlight.${key} must be a non-empty string`);
      }
    }
    if (!/^https?:\/\//.test(s.url)) {
      throw new Error(`spotlight.url must be an http(s) URL: ${s.url}`);
    }
  }

  try {
    checkFields();
    checkTitle();
    checkDescription();
    checkWebsite();
    checkPreview();
    checkCategory();
    checkProperties();
    checkBooleanFlags();
    checkOpenSource();
    checkTagline();
    checkMetadataLabel();
    checkX();
    checkSpotlight();
  } catch (e) {
    throw new Error(
      `Showcase site with title=${showcase.title} contains errors:\n${e.message}`,
      { cause: e }
    );
  }
}

Showcases.forEach(ensureShowcaseValid);
