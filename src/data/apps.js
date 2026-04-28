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
export const Categories = {
  accounting: {
    label: "Accounting",
    description: "Tools providing specialised analytics for financial purposes, including portfolio tracking.",
    color: '#85BB65',  // Dollar Bill Green
    trackable: false,
  },
  analytics: {
    label: "Analytics",
    description: "Tools that provide special insights related to Cardano.",
    color: '#6A8EAE',  // Cool Steel Blue
    trackable: false,
  },
  bridge: {
    label: "Bridge",
    description: "Projects that provide cross-chain bridge support.",
    color: '#FFC107',  // Golden Yellow
    trackable: true,
  },
  daotool: {
    label: "DAO Tool",
    description: "DAO tools help in the proper control and management of a DAO.",
    color: '#37BEB0',  // Bright Cyan
    trackable: true,
  },
  dex: {
    label: "DEX",
    description: "Decentralised exchanges allow direct peer-to-peer cryptocurrency transactions to take place online securely.",
    color: '#3D5AFE',  // Bright Blue
    trackable: true,
  },
  distribution: {
    label: "Distribution",
    description: "Platforms for distributing tokens, airdrops, and rewards to the Cardano community.",
    color: '#E07850',  // Warm Coral
    trackable: true,
  },
  ecosystem: {
    label: "Ecosystem",
    description: "Projects that map out the Cardano Ecosystem.",
    color: '#9C27B0',  // Purple
    trackable: false,
  },
  educational: {
    label: "Educational",
    description: "Educational projects that will help you onboarding to Cardano.",
    color: '#D81B60',  // Hot Pink
    trackable: false,
  },
  explorer: {
    label: "Block Explorer",
    description: "Block explorers are browsers for the Cardano blockchain. They can display the contents of individual blocks and transactions.",
    color: '#2E3B4E',  // Deep Navy Blue
    trackable: false,
  },
  funding: {
    label: "Funding",
    description: "Projects aimed at providing funding assistance to individuals.",
    color: '#004BA0',  // Rich Blue
    trackable: false,
  },
  game: {
    label: "Game",
    description: "Games on the Cardano blockchain.",
    color: '#008080',  // Teal
    trackable: true,
  },
  gateway: {
    label: "Gateway",
    description: "Payment Gateway Providers.",
    color: '#FF5722',  // Bright Orange
    trackable: false,
  },
  governance: {
    label: "Governance",
    description: "Governance tools.",
    color: '#673AB7',  // Deep Purple
    trackable: true,
  },
  identity: {
    label: "Identity",
    description: "Decentralized identifiers (DIDs).",
    color: '#212121',  // Solid Black
    trackable: true,
  },
  lending: {
    label: "Lending",
    description: "Projects that provide lending and borrowing of ada.",
    color: '#9E1C1C',  // Deep Red
    trackable: true,
  },
  marketplace: {
    label: "Marketplace",
    description: "Marketplace where you can buy or sell NFTs.",
    color: '#E53935',  // Bright Red
    trackable: true,
  },
  metadata: {
    label: "Metadata",
    description: "Transaction metadata.",
    color: '#00ACC1',  // Bright Teal
    trackable: true,
  },
  minting: {
    label: "Minting",
    description: "Minting Tool.",
    color: '#42A5F5',  // Light Blue
    trackable: true,
  },
  music: {
    label: "Music",
    description: "Music-related projects on Cardano.",
    color: '#7757d9ff',  // Vibrant Purple
    trackable: false,
  },
  notary: {
    label: "Notary",
    description: "Tools that provide proof of existence or timestamp files on the Cardano blockchain.",
    color: '#5D4037',  // Warm Brown
    trackable: true,
  },
  oracle: {
    label: "Oracle",
    description: "Oracles provide smart contracts with external data.",
    color: '#1E88E5',  // Medium Blue
    trackable: true,
  },
  pooltool: {
    label: "Pool Tool",
    description: "Pool tools provide delegates with the necessary tools to find a good pool.",
    color: '#6C6FFF',  // Soft Blue
    trackable: false,
  },
  social: {
    label: "Social",
    description: "Sites that use the Cardano blockchain for social messaging, groups and sharing.",
    color: '#4d6545',  // Custom: Olive (green-grey)
    trackable: false,
  },
  stablecoin: {
    label: "Stable Coins",
    description: "Backed or algorithmic stable coins.",
    color: '#FF1744',  // Bright Red
    trackable: true,
  },
  wallet: {
    label: "Wallet",
    description: "Cardano wallets store the public and/or private keys to access and manage your funds.",
    color: '#7BC8A6',  // Soft Green
    trackable: false,
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
// EXAMPLE APP ENTRY:
// {
//   title: "Example Dex",
//   description: "A decentralized exchange on Cardano.",
//   preview: require("./app-screenshots/example.png"),
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
      "Mint and burn DJED, Cardano's overcollateralized stablecoin, on an open-source platform. Transparent alternative to DJED.xyz built by Artifex Labs.",
    tagline: "Open-source DJED stablecoin minting platform",
    preview: require("./app-screenshots/open-djed.png"),
    icon: "/img/app-icons/djed.png",
    website: "https://djed.artifex.finance/",
    source: "https://github.com/artifex-labs/open-djed",
    category: "stablecoin",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Wall",
    description:
      "Demonstrates use cases for Cardano transaction metadata. Sign messages, anchor files as proof of existence, and verify them on-chain.",
    tagline: "Sign messages and create proof of existence",
    preview: require("./app-screenshots/cardanowall.png"),
    website: "https://cardanowall.com/en/explore/",
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
    preview: require("./app-screenshots/nmkr.png"),
    icon: "/img/app-icons/nmkr.png",
    website: "https://www.nmkr.io/",
    source: null,
    category: "minting",
    properties: ["nft"],
    maintainerPick: true,
    beginnerFriendly: false,
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
    preview: require("./app-screenshots/adastat.png"),
    icon: "/img/app-icons/adastat.png",
    website: "https://adastat.net",
    source: null,
    category: "explorer",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Explorer Landing Page",
    description:
      "Community-curated index of Cardano block explorers, pool tools, and analytics dashboards built and maintained by the community.",
    tagline: "Community index of Cardano explorers",
    preview: require("./app-screenshots/cf-explorer.png"),
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
    preview: require("./app-screenshots/cexplorer.png"),
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
    preview: require("./app-screenshots/cardanoscan.png"),
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
    preview: require("./app-screenshots/poolpm.png"),
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
    preview: require("./app-screenshots/pooltool.png"),
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
    preview: require("./app-screenshots/adalite.png"),
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
    preview: require("./app-screenshots/atomicwallet.png"),
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
    preview: require("./app-screenshots/daedalus.png"),
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
    title: "Yoroi",
    description:
      "Lightweight Cardano wallet by EMURGO, one of Cardano's founding entities. Available as a browser extension and mobile app with NFT support.",
    tagline: "Lightweight Cardano wallet by EMURGO",
    preview: require("./app-screenshots/yoroi.png"),
    icon: "/img/app-icons/yoroi.png",
    website: "https://yoroi-wallet.com",
    source: "https://github.com/Emurgo/yoroi-frontend",
    category: "wallet",
    properties: ["nft", "mobile", "opensource"],
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
    preview: require("./app-screenshots/cardanoupdates.png"),
    website: "https://cardanoupdates.com",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Pool Stats",
    description: "Cardano stake-pool monitoring with heat-map visualizations of performance, saturation, and rewards across the entire pool universe.",
    tagline: "Pool tool with heat-map visualizations",
    preview: require("./app-screenshots/poolstats.png"),
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
    preview: require("./app-screenshots/nowpayments.png"),
    icon: "/img/app-icons/nowpayments.ico",
    website: "https://nowpayments.io",
    source: null,
    category: "gateway",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Coti adaPay",
    description:
      "Payment gateway by Coti that lets merchants and creators accept ada payments and donations through plug-in checkout integrations.",
    tagline: "Ada payment gateway for merchants and donations",
    preview: require("./app-screenshots/cotiadapay.png"),
    icon: "/img/app-icons/coti-adapay.png",
    website: "https://adapay.finance/",
    source: null,
    category: "gateway",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Gimbalabs",
    description:
      "Collaborative community and space where dApps and open-source tools are developed in the Playground project-based learning experience on Cardano.",
    tagline: "Project-based learning community for Cardano dApps",
    preview: require("./app-screenshots/gimbalabs.png"),
    icon: "/img/app-icons/gimbalabs.jpg",
    website: "https://gimbalabs.com",
    source: "https://gitlab.com/gimbalabs",
    category: "educational",
    properties: ["opensource"],
    maintainerPick: true,
    beginnerFriendly: false,
    spotlight: {
      url: "https://developers.cardano.org/blog/2023-01-02-january/",
      title: "Cardano Developer Spotlight: January 2023",
      date: "2023-01-02",
    },
  },
  {
    title: "Eternl",
    description:
      "Feature-rich Cardano light wallet for browser and mobile, focused on shipping the features most requested by the Cardano community.",
    tagline: "Feature-rich Cardano wallet for browser and mobile",
    preview: require("./app-screenshots/eternl.jpg"),
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
    title: "Cardano Token and NFT Builder",
    description:
      "Create your own native Cardano tokens and NFTs without writing any code, with policy management and metadata templates handled in-app.",
    tagline: "No-code native token and NFT minting tool",
    preview: require("./app-screenshots/token-builder.png"),
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
    preview: require("./app-screenshots/cardano-tools.io.png"),
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
    preview: require("./app-screenshots/typhonwallet.png"),
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
    title: "Staking Rewards Calculator",
    description:
      "Detailed Cardano staking rewards calculator showing expected returns to operators and delegators, with a Monte Carlo simulation for return variability.",
    tagline: "Pool reward calculator with Monte Carlo sim",
    preview: require("./app-screenshots/staking-rewards-calculator.png"),
    website: "https://cardano.org/calculator/",
    source: null,
    category: "pooltool",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "ADAdice",
    description:
      "Fully on-chain, provably fair dice game on Cardano. Every roll, bet, and payout is settled by Plutus smart contracts with no off-chain trust.",
    tagline: "Provably fair on-chain dice game on Cardano",
    preview: require("./app-screenshots/adadice.png"),
    icon: "/img/app-icons/adadice.jpg",
    website: "https://www.adadice.com",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "MuesliSwap",
    description:
      "Order-book DEX with limit orders and matching running natively on Cardano, also operating on Smart Bitcoin Cash for cross-chain orders.",
    tagline: "Order-book DEX on Cardano",
    preview: require("./app-screenshots/muesliswap.png"),
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
    preview: require("./app-screenshots/sundaeswap.png"),
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
    preview: require("./app-screenshots/dripdropz.png"),
    icon: "/img/app-icons/dripdropz.jpg",
    website: "https://dripdropz.io",
    source: null,
    category: "distribution",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "ADAZOO MMORPG and Metaverse",
    description: "MMORPG metaverse on Cardano where players battle and capture CNFT creatures, level up avatars, and trade their collections with other adventurers.",
    tagline: "MMORPG metaverse with battles and CNFT capture",
    preview: require("./app-screenshots/adazoo.png"),
    icon: "/img/app-icons/adazoo.jpg",
    website: "https://adazoo.com",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Minswap Dex",
    description:
      "Multi-pool decentralized exchange on Cardano with deep liquidity, yield farming, and one of the highest-volume venues for native token swaps.",
    tagline: "Multi-pool decentralized exchange on Cardano",
    preview: require("./app-screenshots/minswap.png"),
    icon: "/img/app-icons/minswap.svg",
    statsLabel: "minswap",
    website: "https://minswap.org",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: true,
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
    preview: require("./app-screenshots/gamechanger.png"),
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
    preview: require("./app-screenshots/gerowallet.png"),
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
    preview: require("./app-screenshots/buildoncardano.png"),
    icon: "/img/app-icons/built-on-cardano.jpg",
    website: "https://builtoncardano.com",
    source: null,
    category: "ecosystem",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "CardanoCube",
    description:
      "Curated directory of 650+ projects building on Cardano, organized by category with filters for DeFi, NFTs, governance, infrastructure, and more.",
    tagline: "Directory of 650+ projects building on Cardano",
    preview: require("./app-screenshots/cardanocube.png"),
    icon: "/img/app-icons/cardanocube.png",
    website: "https://www.cardanocube.io",
    source: null,
    category: "ecosystem",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Pavia",
    description:
      "User-owned virtual world on Cardano where players buy land NFTs, build experiences, and trade assets with other residents of the metaverse.",
    tagline: "User-owned virtual world on Cardano",
    preview: require("./app-screenshots/pavia.png"),
    icon: "/img/app-icons/pavia.svg",
    website: "https://www.pavia.io",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "WingRiders",
    description:
      "Native AMM DEX on Cardano focused on fast settlement and predictable fees, with stableswap pools and an integrated yield-farming layer.",
    tagline: "Native AMM DEX on Cardano",
    preview: require("./app-screenshots/wingriders.jpg"),
    icon: "/img/app-icons/wingriders.png",
    statsLabel: "wingriders",
    website: "https://www.wingriders.com",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Lido Nation",
    description:
      "Aggregator for Project Catalyst that surfaces proposals, voting results, community feedback, and DRep activity in a single dashboard.",
    tagline: "Aggregator for Project Catalyst proposals",
    preview: require("./app-screenshots/lidonation.png"),
    icon: "/img/app-icons/lido-nation.png",
    website: "https://www.lidonation.com/en/catalyst-explorer",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "eUTxO",
    description:
      "Visual Cardano blockchain explorer that maps transactions, datums, and assets across the eUTXO model into interactive graphs.",
    tagline: "Visual blockchain explorer for Cardano",
    preview: require("./app-screenshots/eutxo.png"),
    icon: "/img/app-icons/eutxo.png",
    website: "https://eutxo.org",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Vibrant",
    description:
      "Community integration tool for stake-pool operators and NFT projects to verify delegators and holders, run polls, and manage whitelists via Discord.",
    tagline: "Discord verification for stake pools and NFT teams",
    preview: require("./app-screenshots/vibrant.png"),
    icon: "/img/app-icons/vibrant.png",
    website: "https://www.vibrantnet.io",
    source: "https://github.com/nilscodes/hazelnet",
    category: "social",
    properties: ["nft", "opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Book.io",
    description:
      "NFT marketplace where readers buy, read, and resell eBooks and audiobooks. Each title is an asset with verifiable provenance and resale rights.",
    tagline: "NFT marketplace for eBooks and audiobooks",
    preview: require("./app-screenshots/book-token.jpg"),
    icon: "/img/app-icons/book-io.jpg",
    website: "https://www.book.io",
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
    preview: require("./app-screenshots/nufiwallet.png"),
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
    preview: require("./app-screenshots/cnftlab-party.png"),
    icon: "/img/app-icons/cnftlab-party.ico",
    website: "https://www.cnftlab.party/",
    source: null,
    category: "minting",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "TapTools",
    description:
      "All-in-one Cardano portfolio tracker and market analytics with token charts, NFT generation tools, and on-chain activity dashboards.",
    tagline: "Cardano portfolio tracker and market analytics",
    preview: require("./app-screenshots/taptools.jpg"),
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
    preview: require("./app-screenshots/dune.png"),
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
    preview: require("./app-screenshots/chainport.png"),
    icon: "/img/app-icons/chainport.svg",
    website: "https://www.chainport.io/",
    source: null,
    category: "bridge",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Pet Registry",
    description:
      "A virtually free, non profit, global pet registry system built on the Cardano blockchain, facilitates peer to peer pet rescue and historical proof of pet ownership.",
    tagline: "Non-profit pet registry on the Cardano blockchain",
    preview: require("./app-screenshots/petregistry.png"),
    icon: "/img/app-icons/cardano-pet-registry.png",
    website: "https://savepet.org",
    source: null,
    category: "identity",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Studio",
    description:
      "Mint NFTs on Cardano fully in your browser. Keys, metadata, and policy IDs stay on your device — no third party touches the minting flow.",
    tagline: "Self-custody NFT minting in your browser",
    preview: require("./app-screenshots/cardano-studio.png"),
    icon: "/img/app-icons/cardano-studio.jpg",
    website: "https://cardano-studio.app",
    source: null,
    category: "minting",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Relay Map",
    description:
      "Geographic map of Cardano stake-pool relay nodes with filters for region, pool, and operator. Useful for monitoring decentralization in real time.",
    tagline: "Geographic map of Cardano stake-pool relays",
    preview: require("./app-screenshots/monadpool-relay-map.png"),
    icon: "/img/app-icons/cardano-relay-map.png",
    website: "https://monadpool.com/cardano.html",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Finitum Bridge",
    description:
      "Cross-chain bridge for moving supported tokens between Cardano and BSC. Wraps assets on the destination chain with custodian-backed reserves.",
    tagline: "Cross-chain bridge between Cardano and BSC",
    preview: require("./app-screenshots/finitum-bridge.png"),
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
    preview: require("./app-screenshots/balance-analytics.png"),
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
    preview: require("./app-screenshots/adahandle.png"),
    icon: "/img/app-icons/adahandle.jpg",
    website: "https://adahandle.com",
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
    preview: require("./app-screenshots/lace.png"),
    icon: "/img/app-icons/lace.jpg",
    website: "https://www.lace.io/",
    source: "https://github.com/input-output-hk/lace",
    category: "wallet",
    properties: ["nft", "opensource"],
    maintainerPick: false,
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
    preview: require("./app-screenshots/coto.png"),
    icon: "/img/app-icons/continuity-token.svg",
    website: "https://continuity.to/",
    source: null,
    category: "notary",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "VESPR",
    description:
      "Non-custodial mobile light wallet for Cardano. Prioritizes security and ease of use; private keys and assets always remain under the user's control.",
    tagline: "Non-custodial mobile Cardano wallet",
    preview: require("./app-screenshots/vesprwallet.png"),
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
    preview: require("./app-screenshots/dexhunter.png"),
    icon: "/img/app-icons/dexhunter.svg",
    statsLabel: "dexhunter",
    website: "https://www.dexhunter.io/",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
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
    icon: "/img/app-icons/liquid.png",
    statsLabel: "liqwid-finance",
    website: "https://liqwid.finance/",
    source: null,
    category: "lending",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: true,
  },
  {
    title: "Charli3",
    description:
      "Charli3 is a decentralized Oracle solution on Cardano, built natively for the chain, producing fully auditable data records on Cardano ledger.",
    tagline: "Native decentralized oracle on Cardano",
    preview: require("./app-screenshots/charli3.jpg"),
    icon: "/img/app-icons/charli3.jpg",
    statsLabel: "charli3",
    website: "https://charli3.io",
    source: null,
    category: "oracle",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Academy",
    description:
      "Online courses on blockchain fundamentals, consensus algorithms, transaction models, scaling, and Cardano governance, staking, and dApp development.",
    tagline: "Online courses on Cardano and blockchain basics",
    preview: require("./app-screenshots/cardano-academy.jpg"),
    website: "https://academy.cardanofoundation.org",
    source: null,
    category: "educational",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Governance Tool",
    description:
      "A collection of tools to delegate voting power, become a DRep, become a direct voter, browse or proposa a governance actions on Cardano blockchain.",
    tagline: "Delegate, register as DRep, and vote on proposals",
    preview: require("./app-screenshots/govtools.jpg"),
    icon: "/img/app-icons/govtools.svg",
    website: "https://gov.tools",
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
    preview: require("./app-screenshots/changwatch.jpg"),
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
    preview: require("./app-screenshots/medusa_wallet_poster.png"),
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
    preview: require("./app-screenshots/dano-finance.png"),
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
    title: "Multisig Platform",
    description:
      "Secure team treasury management and governance participation on Cardano using native multi-signature scripts and an approval workflow UI.",
    tagline: "Multi-signature treasury and governance for teams",
    preview: require("./app-screenshots/mesh-multisig-platform.jpg"),
    icon: "/img/app-icons/multisig.png",
    website: "https://multisig.meshjs.dev/features",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
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
    preview: require("./app-screenshots/tempo.png"),
    icon: "/img/app-icons/tempo.png",
    website: "https://tempo.vote",
    source: null,
    category: "daotool",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Nio",
    description:
      "Tracks and monitors all assets across Cardano wallets and DeFi smart contracts in one dashboard. Surfaces lending positions, LP shares, and yields.",
    tagline: "Track wallets and DeFi smart contract assets",
    preview: require("./app-screenshots/nio_app.jpg"),
    icon: "/img/app-icons/nio.png",
    website: "https://nioapp.io",
    source: null,
    category: "accounting",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Begin Wallet",
    description:
      "Non-custodial Cardano wallet for browser and mobile with payment links, deep-link support, Begin ID usernames (ENS-style), and Ledger and Keystone hardware support.",
    tagline: "Non-custodial Cardano wallet for browser and mobile",
    preview: require("./app-screenshots/begin.png"),
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
    preview: require("./app-screenshots/onboard-ninja.jpg"),
    icon: "/img/app-icons/onboard-ninja.png",
    website: "https://onboard.ninja",
    source: null,
    category: "distribution",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
    {
    title: "Stuff.io",
    description:
      "Digital-ownership platform on Cardano letting consumers own, share, gift, or resell their movies, music, ebooks, audiobooks, and podcasts as NFTs.",
    tagline: "True digital ownership for media you can resell",
    preview: require("./app-screenshots/stuff-io.png"),
    icon: "/img/app-icons/stuff-io.png",
    website: "https://stuff.io",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Veridian Wallet",
    description:
      "Manages identity across platforms using decentralized public key infrastructure and verifiable credentials. Built on KERI, optionally anchored to Cardano.",
    tagline: "Decentralized identity and verifiable credentials",
    preview: require("./app-screenshots/veridian2.png"),
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
    preview: require("./app-screenshots/govspace.jpg"),
    icon: "/img/app-icons/govspace.png",
    website: "https://governancespace.com/",
    source: null,
    category: "daotool",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Adastack.io",
    description:
      "Comprehensive Cardano ecosystem explorer: Explore intro guides, wallets, DApps, NFTs, games, governance, Project Catalyst, DAOs, development, sidechains, L2s and more.",
    tagline: "Cardano ecosystem explorer and intro guide hub",
    preview: require("./app-screenshots/adastack.png"),
    icon: "/img/app-icons/adastack-io.png",
    website: "https://www.adastack.io",
    source: null,
    category: "ecosystem",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "ADAM Cardano App",
    description:
      "Mobile app (iOS and Android) for tracking your Cardano wallets, staking rewards, and funds in one cohesive interface, with price widgets and insights.",
    tagline: "iOS and Android tracker for Cardano wallets",
    preview: require("./app-screenshots/adam.jpg"),
    icon: "/img/app-icons/adam-cardano-app.png",
    website: "https://androdevs.de",
    source: null,
    category: "accounting",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Governance Voting Tool",
    description:
      "Simple voting tool for Cardano stakeholders to participate in on-chain governance with clear ballot UI, DRep info, and action explanations.",
    tagline: "Simple on-chain governance voting tool",
    preview: require("./app-screenshots/cf-voting-tool.png"),
    icon: "/img/app-icons/cf-voting-tool.svg",
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
    preview: require("./app-screenshots/andamio.png"),
    website: "https://www.andamio.io/",
    source: null,
    category: "daotool",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "CSWAP",
    description:
      "CSWAP Systems is a next-gen decentralized exchange (DEX) that bridges tokens, NFTs, and real-world assets in one seamless trading ecosystem. ",
    tagline: "DEX for tokens, NFTs, and real-world assets",
    preview: require("./app-screenshots/cswap.png"),
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
    preview: require("./app-screenshots/fluidtokens.png"),
    icon: "/img/app-icons/fluidtoken.png",
    website: "https://fluidtokens.com/",
    source: "https://github.com/fluidtokens",
    category: "lending",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
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
    preview: require("./app-screenshots/genius-yield.png"),
    statsLabel: "geniusyield",
    website: "https://www.geniusyield.co/",
    source: "https://github.com/geniusyield",
    category: "dex",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Iagon",
    description:
      "Iagon is an AI-driven shared storage and compute economy. Bridging decentralization with compliance to revolutionize cloud services.",
    tagline: "Decentralized storage and compute marketplace",
    preview: require("./app-screenshots/iagon.png"),
    icon: "/img/app-icons/iagon.png",
    website: "https://iagon.com",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
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
    preview: require("./app-screenshots/vyfi.png"),
    icon: "/img/app-icons/vyfinance.png",
    statsLabel: "vyfinance",
    website: "https://app.vyfi.io/",
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
    preview: require("./app-screenshots/splash.png"),
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
    preview: require("./app-screenshots/palmyra.png"),
    icon: "/img/app-icons/palmyra.png",
    website: "https://palmeconomy.io/",
    source: "https://github.com/zenGate-Global/winter-cardano",
    category: "marketplace",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Optim Finance",
    description:
      "Decentralized yield optimization on Cardano with a suite of vaults that auto-compound staking, lending, and DEX-LP positions to maximize yield.",
    tagline: "Yield optimization suite for Cardano DeFi",
    preview: require("./app-screenshots/optim.png"),
    website: "https://www.optim.finance/",
    source: null,
    category: "lending",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Farmroll",
    description:
      "Cardano community engagement platform with token-gated rewards, automated participation tracking, and AI-driven campaign tools for projects.",
    tagline: "AI-driven community engagement and rewards",
    preview: require("./app-screenshots/farmroll.png"),
    icon: "/img/app-icons/farmroll.png",
    website: "https://farmroll.io/",
    source: null,
    category: "social",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "TokeoPay",
    description:
      "Feature-rich Bitcoin and Cardano wallet for storing and trading BTC, ada, Runes, native tokens, Ordinals, and NFTs across both ecosystems.",
    tagline: "Mobile wallet for Bitcoin, Cardano, and Runes",
    preview: require("./app-screenshots/tokeo.png"),
    icon: "/img/app-icons/tokeo.jpg",
    website: "https://tokeo.io/",
    source: null,
    category: "wallet",
    properties: ["mobile"],
    maintainerPick: false,
    beginnerFriendly: false,
    walletFeatures: {
      platforms: ["ios", "android"],
      custody: "non-custodial",
      features: ["nft", "multi-asset", "qr-claim", "easy-setup"],
      type: "light",
    },
  },
  {
    title: "Empowa",
    description:
      "Join a RWA project looking to enable 1 million African families to become owners of a climate-smart home across Africa by 2030.",
    tagline: "RWA project for climate-smart housing in Africa",
    preview: require("./app-screenshots/empowa.jpg"),
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
    preview: require("./app-screenshots/strike.png"),
    icon: "/img/app-icons/strike.png",
    statsLabel: "strike-finance",
    website: "https://www.strikefinance.org/",
    source: "https://github.com/strike-finance/perpetuals-smart-contracts",
    category: "marketplace",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: true,
  },
  {
    title: "Snek.fun",
    description:
      "Fair-launch memecoin launchpad on Cardano. Tokens launch in seconds for a flat fee with built-in liquidity protection and no team allocations.",
    tagline: "Fair-launch memecoin launchpad on Cardano",
    preview: require("./app-screenshots/snek-fun.jpg"),
    icon: "/img/app-icons/snek-fun.jpg",
    website: "https://snek.fun/",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Xerberus",
    description:
      "Xerberus' Risk Ratings deliver automated, objective, and real-time insights derived from on-chain data, providing investors and dApps with accurate risk assessments.",
    tagline: "Real-time on-chain risk ratings for assets",
    preview: require("./app-screenshots/xerberus.jpg"),
    website: "https://www.xerberus.io/",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Masumi",
    description:
      "Masumi is a decentralized protocol empowering AI agents to collaborate seamlessly and monetize their services efficiently.",
    tagline: "Decentralized protocol for AI agent collaboration",
    preview: require("./app-screenshots/masumi.png"),
    icon: "/img/app-icons/masumi.png",
    statsLabel: "masumi",
    website: "https://www.masumi.network",
    source: "https://github.com/masumi-network",
    category: "marketplace",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
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
    preview: require("./app-screenshots/finest.png"),
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
    preview: require("./app-screenshots/butane.png"),
    icon: "/img/app-icons/butane.jpg",
    website: "https://butane.dev/",
    source: "https://github.com/butaneprotocol/butane-contracts",
    category: "marketplace",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Bodega Market",
    description:
      "Prediction market on Cardano for speculating on real-world event outcomes. Settles outcomes on-chain using oracle data and Plutus smart contracts.",
    tagline: "Cardano prediction market for real-world events",
    preview: require("./app-screenshots/bodega.png"),
    icon: "/img/app-icons/bodega.png",
    statsLabel: "bodega",
    website: "https://www.bodegamarket.xyz/",
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
    preview: require("./app-screenshots/infinity-rising.png"),
    icon: "/img/app-icons/infinity-rising.jpg",
    website: "https://infinityrising.com",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Reeve",
    description:
      "Project (also known as Ledger on the Blockchain or LOB) developing a Cardano-based decentralized ledger for digital recording of accounting data.",
    tagline: "Decentralized ledger for accounting records",
    preview: require("./app-screenshots/reeve.png"),
    website: "https://www.cardanofoundation.org/reeve#mission",
    source: "https://github.com/cardano-foundation/cf-reeve-platform",
    category: "accounting",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Ascent Rivals",
    description:
      "Multiplayer racing-combat game with dual-engine twin-stick controls. Compete in tournaments, place rival contracts, and master risk-reward death racing.",
    tagline: "Multiplayer racing-combat game with rival contracts",
    preview: require("./app-screenshots/ascent-rivals.png"),
    icon: "/img/app-icons/ascent-rivals.jpg",
    website: "https://www.ascentrivals.com/",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "USDM Stablecoin",
    description:
      "Fully backed USD stablecoin on Cardano with off-chain reserves and monthly attestations. Designed for payments, treasury, and DeFi applications.",
    tagline: "Fully backed USD stablecoin on Cardano",
    preview: require("./app-screenshots/usdm.png"),
    icon: "/img/app-icons/usdm.jpeg",
    statsLabel: "$usdm",
    statsNote: "mint/burn only",
    website: "https://moneta.global/",
    source: null,
    category: "stablecoin",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Asteria",
    description:
      "Fully on-chain strategy game built for developers. Pilot a spaceship across a 2D grid where every entity is a Cardano eUTXO and Plutus contract.",
    tagline: "On-chain strategy game where everything is a UTxO",
    preview: require("./app-screenshots/asteria.png"),
    icon: "/img/app-icons/asteria.png",
    website: "https://github.com/txpipe/asteria",
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
    preview: require("./app-screenshots/ale-axes.jpg"),
    icon: "/img/app-icons/ale-axes.jpg",
    website: "https://aleaxes.com/",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Mynth",
    description:
      "Cross-chain swap network bridging Cardano with any-token-to-any-token routes across multiple chains. Settles cross-chain trades through audited relays.",
    tagline: "Cross-chain swap network for any token pair",
    preview: require("./app-screenshots/mynth.png"),
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
    preview: require("./app-screenshots/clarity.png"),
    website: "https://www.clarity.community/",
    source: null,
    category: "daotool",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Indigo",
    description:
      "Autonomous synthetics protocol on Cardano for on-chain price exposure to real-world assets. Mints iAssets backed by collateralized debt positions.",
    tagline: "Synthetics protocol for on-chain RWA exposure",
    preview: require("./app-screenshots/indigo.png"),
    icon: "/img/app-icons/indy.png",
    statsLabel: "indigo-protocol",
    website: "https://indigoprotocol.io/",
    source: "https://github.com/IndigoProtocol/indigo-smart-contracts",
    category: "marketplace",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Orcfax",
    description:
      "Decentralized oracle service publishing real-world event data to Cardano. Data is delivered to on-chain Plutus contracts in eUTXO-native format.",
    tagline: "Decentralized oracle for real-world data on Cardano",
    preview: require("./app-screenshots/orcfax.png"),
    website: "https://orcfax.io",
    source: "https://github.com/orcfax/orcfax-aiken",
    category: "oracle",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Arp Radio",
    description:
      "Cardano music ecosystem player. Discover, mint, and play CIP-60 music NFT collections in a custom audio player tuned to consensus and slot timing.",
    tagline: "Music NFT player based on CIP-60 token standard",
    preview: require("./app-screenshots/arpradio.png"),
    website: "https://arpradio.media",
    source: null,
    category: "music",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "CGOV",
    description:
      "A governance monitoring dashboard to track and analyze on-chain governance actions, including active, ratified, and expired proposals on the Cardano blockchain.",
    tagline: "Governance dashboard for proposals and voting",
    preview: require("./app-screenshots/cgov.png"),
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
    preview: require("./app-screenshots/cardano-treasury-explorer.png"),
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
    preview: require("./app-screenshots/sundae-treasury.png"),
    icon: "/img/app-icons/sundae-treasury.svg",
    website: "https://treasury.sundae.fi/",
    source: "https://github.com/SundaeSwap-finance/treasury-contracts",
    category: "governance",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Supply Summary",
    description:
      "Explore historical trends in Cardano's ada supply distribution, including reserves, rewards, treasury, and deposits across epochs.",
    tagline: "Historical Ada supply and treasury distribution",
    preview: require("./app-screenshots/cardano-supply-summary.png"),
    icon: "/img/brand-assets/cardano-starburst-blue.svg",
    website: "https://cardano.org/insights/supply/summary/",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "CardanoCube Governance Actions",
    description:
      "Browse live on-chain governance proposals shaping Cardano's future, including protocol updates, constitutional amendments, and budget allocations.",
    tagline: "Live on-chain governance proposal browser",
    preview: require("./app-screenshots/cardanocube-governance.png"),
    icon: "/img/app-icons/cardanocube.png",
    website: "https://www.cardanocube.com/governance/gov_actions",
    source: null,
    category: "governance",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Wanchain",
    description:
      "Decentralized cross-chain bridge infrastructure connecting Cardano with multiple EVM and non-EVM networks via threshold-signature relayers.",
    tagline: "Cross-chain bridge for EVM and non-EVM networks",
    preview: require("./app-screenshots/wanchain.png"),
    icon: "/img/app-icons/wanchain.svg",
    website: "https://bridge.wanchain.org/AssetBridge",
    source: null,
    category: "bridge",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "UVerify",
    description: "UVerify opens up blockchain technology to everyone, no matter your background. Effortlessly secure your file or text hashes on the Cardano blockchain.",
    tagline: "Anchor file and text hashes on the Cardano chain",
    preview: require("./app-screenshots/uverify.png"),
    icon: "/img/app-icons/uverify.png",
    statsLabel: "uverify",
    website: "https://app.uverify.io",
    source: "https://github.com/UVerify-io",
    category: "notary",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
    spotlight: {
      url: "https://developers.cardano.org/blog/2025-06-13-media-cardano-developer-office-hours/",
      title: "Cardano Developer Office Hours",
      date: "2025-06-13",
    },
  },
  {
    title: "CommitProof",
    description: "CommitProof lets you prove what you knew and when. Hash your ideas client-side, anchor the proof on Cardano, and verify it anytime. Your original never leaves your device.",
    tagline: "Client-side hash anchoring with on-chain proof",
    preview: require("./app-screenshots/commitproof.png"),
    icon: "/img/app-icons/commitproof.svg",
    statsLabel: "commitproof",
    website: "https://commitproof.com",
    source: null,
    category: "notary",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Smart Contract Quiz V1000",
    description:
      "Free-to-enter knowledge quiz built on Cardano Plutus smart contracts. Players submit encrypted answers on-chain; the highest scorer claims the prize.",
    tagline: "On-chain Plutus quiz with prize pool",
    preview: require("./app-screenshots/gnp1quiz.jpeg"),
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
    preview: require("./app-screenshots/tapdano.jpg"),
    icon: "/img/app-icons/tapdano.png",
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
    preview: require("./app-screenshots/claimpaign.png"),
    icon: "/img/app-icons/claimpaign.png",
    statsLabel: "claimpaign",
    website: "https://claimpaign.com",
    source: null,
    category: "distribution",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Wayup",
    description:
      "Cardano NFT marketplace by Anvil. Continues the smart contracts of JpgStore as the platform sunsets, so existing listings and royalties keep working.",
    tagline: "Cardano NFT marketplace by Anvil, continuing JpgStore",
    preview: require("./app-screenshots/wayup.jpg"),
    icon: "/img/app-icons/wayup.png",
    statsLabel: "wayup",
    website: "https://www.wayup.io",
    source: null,
    category: "marketplace",
    properties: ["nft"],
    maintainerPick: true,
    beginnerFriendly: true,
  },
];

export const TagList = Object.keys(Tags);

// Recent submissions count — the last N entries appended to Showcases get a NEW badge.
// New entries are conventionally appended at the end (see add-app.md).
export const RECENT_APPS_COUNT = 5;

// Length constraints enforced by the schema validator and documented in add-app.md.
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
      "website",
      "source",
      "category",
      "properties",
      "maintainerPick",
      "beginnerFriendly",
      "icon",
      "statsLabel",
      "statsNote",
      "walletFeatures",
      "spotlight",
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
    if (
      !showcase.preview ||
      (showcase.preview instanceof String &&
        (showcase.preview.startsWith("http") ||
          showcase.preview.startsWith("//")))
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
    checkSpotlight();
  } catch (e) {
    throw new Error(
      `Showcase site with title=${showcase.title} contains errors:\n${e.message}`,
      { cause: e }
    );
  }
}

Showcases.forEach(ensureShowcaseValid);
