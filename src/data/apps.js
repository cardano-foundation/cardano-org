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
//   preview: require("./app-images/example.png"),
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
      "Mint and burn DJED, Cardano's overcollateralized stablecoin, with our open-source platform. Transparent alternative to DJED.xyz - accessible 24/7 anywhere. Built by Artifex Labs for the Cardano community.",
    preview: require("./app-images/open-djed.png"),
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
      "Demonstrates several use cases for transaction metadata. You can sign messages and create proof of existence for files.",
    preview: require("./app-images/cardanowall.png"),
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
      "NFT Minting, FIAT & Crypto Sales, Token Launches, Secondary Markets - all available at the press of a button.",
    preview: require("./app-images/nmkr.png"),
    website: "https://www.nmkr.io/",
    source: null,
    category: "minting",
    properties: ["nft"],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "AdaStat",
    description:
      "The browser, inconspicuous at first glance, offers a great many statistics and insights.",
    preview: require("./app-images/adastat.png"),
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
      "List of Cardano Explorers built by the community for the community.",
    preview: require("./app-images/cf-explorer.png"),
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
        "An independent Cardano Explorer that provides useful all-in-one dashboards additionally.",
    preview: require("./app-images/cexplorer.png"),
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
      "A combination of block explorer and pool tool, using its own implementation of db-sync.",
    preview: require("./app-images/cardanoscan.png"),
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
      "Block explorer that brought out a new, refreshing concept to visualize transactions.",
    preview: require("./app-images/poolpm.png"),
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
      "One of the most feature-rich, unbiased pool tools. Also offers a native app.",
    preview: require("./app-images/pooltool.png"),
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
    preview: require("./app-images/adalite.png"),
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
    preview: require("./app-images/atomicwallet.png"),
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
      "Daedalus is a full node and developed by IOHK, one of the founding entities of Cardano.",
    preview: require("./app-images/daedalus.png"),
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
      "Yoroi is a lightweight node and developed by EMURGO, one of the founding entities of Cardano.",
    preview: require("./app-images/yoroi.png"),
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
    title: "Cardano Warriors",
    description: "The retro RPG NFT Collection minted in Cardano Blockchain.",
    preview: require("./app-images/cardanowarriors.png"),
    website: "https://cardanowarriors.io/",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardano Updates",
    description:
      "Follow the development of Cardano in real time without the hassle of GitHub.",
    preview: require("./app-images/cardanoupdates.png"),
    website: "https://cardanoupdates.com",
    source: null,
    category: "analytics",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Pool Stats",
    description: "Pool tool and insights visualized by heat maps.",
    preview: require("./app-images/poolstats.png"),
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
      "Payment gateway provider to accept ada payments and ada donations.",
    preview: require("./app-images/nowpayments.png"),
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
      "Payment gateway provider to accept ada payments and ada donations.",
    preview: require("./app-images/cotiadapay.png"),
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
      "Gimbalabs is a collaborative community and space where dApps and OpenSource tools are developed in the \"Playground\" (Project-Based Learning experiences). All are welcome to join every Tuesday at 4pm UTC!",
    preview: require("./app-images/gimbalabs.png"),
    website: "https://gimbalabs.com",
    source: "https://gitlab.com/gimbalabs",
    category: "educational",
    properties: ["opensource"],
    maintainerPick: true,
    beginnerFriendly: false,
  },
  {
    title: "Eternl",
    description:
      "The alternative Cardano light wallet in the browser. Aims to add features most requested by the Cardano community.",
    preview: require("./app-images/eternl.jpg"),
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
      "Create your own native tokens and NFT in a few clicks without any code.",
    preview: require("./app-images/token-builder.png"),
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
      "An advanced CNFT maker. You just pay network fees.",
    preview: require("./app-images/cardano-tools.io.png"),
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
    preview: require("./app-images/typhonwallet.png"),
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
      "A detailed Staking Rewards Calculator thats shows expected return to the operator and delegators of each pool based on the current and alternative network parameters. It also runs a Monte Carlo simulation to show possible variability in the return.",
    preview: require("./app-images/staking-rewards-calculator.png"),
    website: "https://cardano.org/calculator/",
    source: null,
    category: "pooltool",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Cardahub - A services hub on Cardano",
    description:
      "One stop shop for everything CNFT. A smart-contract NFT platform on Cardano where user can mint, distribute, list and buy NFT in a few clicks.",
    preview: require("./app-images/cardahub.png"),
    website: "https://cardahub.io",
    source: null,
    category: "marketplace",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "ADAdice",
    description:
      "A fully on-chain, provably fair game of dice on the Cardano blockchain.",
    preview: require("./app-images/adadice.png"),
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
      "MuesliSwap is a new decentralized exchange (DEX) operating on the Smart Bitcoin Cash blockchain and Cardano.",
    preview: require("./app-images/muesliswap.png"),
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
      "SundaeSwap is a native, scalable decentralized exchange and automated liquidity provision protocol.",
    preview: require("./app-images/sundaeswap.png"),
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
    preview: require("./app-images/dripdropz.png"),
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
    description: "Start exploring ADAZOO, battle and capture CNFT's. Brag to your friends, show off your stats.",
    preview: require("./app-images/adazoo.png"),
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
      "Minswap is a multi-pool decentralized exchange on Cardano.",
    preview: require("./app-images/minswap.png"),
    icon: "/img/app-icons/minswap.svg",
    statsLabel: "minswap",
    website: "https://minswap.org",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: true,
    beginnerFriendly: true,
  },
  {
    title: "GameChanger Wallet",
    description:
      "The ultimate wallet experience for the Web, with native NFT and token features, powered by Cardano and third party applications.",
    preview: require("./app-images/gamechanger.png"),
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
    preview: require("./app-images/gerowallet.png"),
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
      "Discover projects and dApps building on Cardano along with the developer tools you can use to build on Cardano. Explore similar projects and tools with ease and simply find you way back to where you started.",
    preview: require("./app-images/buildoncardano.png"),
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
      "Explore 650+ Projects Building on Cardano.",
    preview: require("./app-images/cardanocube.png"),
    website: "https://www.cardanocube.io",
    source: null,
    category: "ecosystem",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "JPG Store",
    description:
      "Discover artwork, explore communities, and support artists on Cardano.",
    preview: require("./app-images/jpg.png"),
    icon: "/img/app-icons/jpgstore.jpg",
    statsLabel: "jpg.store",
    website: "https://www.jpg.store",
    source: null,
    category: "marketplace",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: true,
  },
  {
    title: "Pavia",
    description:
      "Create, explore and trade in the Cardano virtual world owned by its users.",
    preview: require("./app-images/pavia.png"),
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
      "The DEX on Cardano. Native and fast AMM decentralized exchange platform.",
    preview: require("./app-images/wingriders.jpg"),
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
      "Aggregation of existing catalyst proposals, results, feedbacks and many more.",
    preview: require("./app-images/lidonation.png"),
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
      "Visual blockchain explorer for Cardano.",
    preview: require("./app-images/eutxo.png"),
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
      "A community integration tool that allows stakepool operators and NFT projects to connect and engage with their audience, verify their delegators and holders, create polls, whitelists and more via Discord, Website, and other social media apps.",
    preview: require("./app-images/vibrant.png"),
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
      "An NFT marketplace for buying, reading, and selling eBooks and Audiobooks.",
    preview: require("./app-images/book-token.png"),
    website: "https://www.book.io",
    source: null,
    category: "marketplace",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
    icon: "/img/app-icons/bookio.jpg",
  },
  {
    title: "NuFi Wallet",
    description:
      "Non-custodial, multi-chain wallet with in-app DEX.",
    preview: require("./app-images/nufiwallet.png"),
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
    title: "Carda Station",
    description:
      "Explore this virtual world on the moon with an in game avatar, and interact with other players through hangouts, games or events.",
    preview: require("./app-images/cardastation.png"),
    website: "https://cardastation.com/",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "CNFTLab Party",
    description:
      "Tool for minting CNFTs, manage your policyID, create royalties and start minting in few seconds.",
    preview: require("./app-images/cnftlab-party.png"),
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
      "All-in-one platform that offers free token distribution, comprehensive charts, NFT generation, and mint facilitation.",
    preview: require("./app-images/taptools.png"),
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
    preview: require("./app-images/dune.png"),
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
      "ChainPort is a next-gen hard-security blockchain bridge that lets you hop across EVM chains to Cardano at a click.",
    preview: require("./app-images/chainport.png"),
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
    preview: require("./app-images/petregistry.png"),
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
      "Create and mint NFTs on Cardano all in your browser - without trusting a third party for minting.",
    preview: require("./app-images/cardano-studio.png"),
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
      "Shows geographical distribution of Cardano stake pool relay nodes with flexible map features.",
    preview: require("./app-images/monadpool-relay-map.png"),
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
      "Move supported tokens cross-chain, from BSC to Cardano and vice versa.",
    preview: require("./app-images/finitum-bridge.png"),
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
      "Graphical, configurable analytics specialising in Cardano PoS decentralisation metrics.",
    preview: require("./app-images/balance-analytics.png"),
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
      "A standardized NFT that developers and users can use to associate an address with a custom and human-readable address.",
    preview: require("./app-images/adahandle.png"),
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
      "A new light wallet platform from IOG, one of the creators of Cardano. Manually verified by an independent auditor, Lace lets you quickly, easily, and securely manage your digital assets and enjoy Web3.",
    preview: require("./app-images/lace.png"),
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
    title: "Do it with Lovelace",
    description:
      "A Cardano-based dApp platform for easy and secure donations with a focus on community impact and transparency.",
    preview: require("./app-images/do-it-with-lovelace.png"),
    website: "https://app.doitwithlovelace.io",
    source: null,
    category: "funding",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Aada.finance",
    description:
      "Aada is a peer-to-peer lending and borrowing protocol on the Cardano blockchain.",
    preview: require("./app-images/aada-finance.png"),
    icon: "/img/app-icons/aada.finance.png",
    website: "https://app.aada.finance",
    source: null,
    category: "lending",
    properties: ["nft"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Continuity Token",
    description:
      "$COTO provides secure, global and long-lasting cold storage backups of Cardano NFT media.",
    preview: require("./app-images/coto.png"),
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
      "VESPR is a non-custodial mobile light wallet for the Cardano network, prioritizing the security and safety of your digital assets while ensuring exceptional ease-of-use. Your private keys and assets always remain under your control.",
    preview: require("./app-images/vesprwallet.png"),
    icon: "/img/app-icons/vespr.jpg",
    statsLabel: "vespr",
    website: "https://www.vespr.xyz/#/",
    source: null,
    category: "wallet",
    properties: ["nft", "mobile"],
    maintainerPick: true,
    beginnerFriendly: false,
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
      "DexHunter is a decentralized exchange aggregator with real-time alerts and an easy to use interface.",
    preview: require("./app-images/dexhunter.png"),
    icon: "/img/app-icons/dexhunter.svg",
    statsLabel: "dexhunter",
    website: "https://www.dexhunter.io/",
    source: null,
    category: "dex",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Liqwid",
    description:
      "Liqwid is a non-custodial pooled lending protocol with liquid staking built on Cardano.",
    preview: require("./app-images/liqwid.webp"),
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
    preview: require("./app-images/charli3.jpg"),
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
      "Learn blockchain fundamentals, consensus algorithms, and encryption methods. You’ll explore transaction models, risk mitigation, and scaling solutions. Additionally, you’ll delve into the Cardano blockchain, its governance, and practical uses of ada, including staking and decentralized applications.​",
    preview: require("./app-images/cardano-academy.jpg"),
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
    preview: require("./app-images/govtools.jpg"),
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
      "Chang Watch provides various donut charts with insights on vote distribution and DReps.",
    preview: require("./app-images/changwatch.jpg"),
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
    preview: require("./app-images/medusa_wallet_poster.png"),
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
      "Dano Finance is a DeFi platform for lending, borrowing, and trading — all in one.",
    preview: require("./app-images/dano-finance.png"),
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
      "Secure your treasury and participant in governance, as a team with multi-signature.",
    preview: require("./app-images/mesh-multisig-platform.jpg"),
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
      "Tempo is a governance tool designed to streamline and enhance Cardano’s decision-making processes. We make it easier for DReps to register, gain delegations, and engage with their delegators. Additionally, Tempo supports DAOs and SPOs by providing essential tools for governance and transparency.",
    preview: require("./app-images/tempo.png"),
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
      "Track and monitor all assets in any wallet or locked in Cardano DeFi smart contracts.",
    preview: require("./app-images/nio_app.png"),
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
      "Begin Wallet a non-custodial light Cardano Wallet, available as an Extension and Mobile. We offer payment link compatibility with deep link support, Begin ID user name based on ENS protocol for Wallet Address. Hardware wallet support Ledger and Keystone. Based on our own open source cryptographic core.",
    preview: require("./app-images/begin.png"),
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
      "Onboard is a platform that allows creators to effortlessly distribute Cardano airdrops at in-person events.",
    preview: require("./app-images/onboard-ninja.jpg"),
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
      "Stuff.io is the global leader in true digital ownership, enabling consumers to genuinely own, share, gift, or resell their digital media like movies, music, ebooks, audiobooks, and podcasts.",
    preview: require("./app-images/stuff-io.png"),
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
      "Manages identity across platforms using decentralized public key infrastructure and verifiable credentials: ensuring data privacy and ownership with tamper proofing and quantum resistance. Built on KERI and optionally anchored to Cardano.",
    preview: require("./app-images/veridian2.png"),
    website: "https://www.veridian.id/",
    source: "https://github.com/cardano-foundation/veridian-wallet",
    category: "identity",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Governance Space",
    description:
      "A blockchain governance platform for DAOs, projects, and institutions: providing indexing & analytics for DReps, governance actions, budget proposals & discussions, committee members, live events, and more.",
    preview: require("./app-images/govspace.png"),
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
    preview: require("./app-images/adastack.png"),
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
      "Are you looking for an efficient way to connect and track your ADA wallets? ADAM Cardano app for iOS and Android is designed to help track all your Cardano stacking rewards, wallets and funds from a single, cohesive interface. ADAM app also exclusively provides stunning price widgets, packed with valuable price insights.",
    preview: require("./app-images/adam.png"),
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
      "A simple tool to help every Cardano stakeholder participate in on-chain governance with confidence.",
    preview: require("./app-images/cf-voting-tool.png"),
    icon: "/img/app-icons/cf-voting-tool.svg",
    website: "https://voting.cardanofoundation.org/",
    source: "https://github.com/cardano-foundation/cardano-governance-voting-tool",
    category: "governance",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "NEWM",
    description:
      "Decentralized music streaming platform that enables artists to own and monetize their creative content through fractionalized IP rights, direct fan tipping, music rights marketplace, and real-time royalty payouts.",
    preview: require("./app-images/newm.png"),
    website: "https://newm.io/",
    source: "https://github.com/projectNEWM/",
    category: "music",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Andamio",
    description:
      "Verified trust protocol for distributed work. Organizations can mint credentials, verify skills, and find contributors. Individuals can learn, discover opportunities, join project teams, and launch their own projects.",
    preview: require("./app-images/andamio.png"),
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
    preview: require("./app-images/cswap.png"),
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
      "FluidTokens is the leading Cardano-Bitcoin DeFi ecosystem, presenting a diverse range of services like lending, borrowing, staking, sponsored transactions and an array of other inventive products including rental options, boosted stake features, and more.",
    preview: require("./app-images/fluidtokens.png"),
    icon: "/img/app-icons/fluidtoken.png",
    website: "https://fluidtokens.com/",
    source: "https://github.com/fluidtokens",
    category: "lending",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Genius Yield",
    description:
      "All-in-one platform, that combines an order book DEX with an automated yield optimizer.",
    preview: require("./app-images/genius-yield.png"),
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
    preview: require("./app-images/iagon.png"),
    icon: "/img/app-icons/iagon.png",
    website: "https://iagon.com",
    source: null,
    category: "marketplace",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Yamfore",
    description:
      "Yamfore streamlines lending on the Cardano blockchain with its decentralized platform that eliminates the need for traditional lenders. Utilizing an internal stablecoin reserve, it offers indefinite loan durations and no margin calls, ensuring borrowers are safe from loan liquidation during market volatility.",
    preview: require("./app-images/yamfore.png"),
    website: "https://www.yamfore.com/",
    source: "https://github.com/BigBlymp/yamfore-resources",
    category: "lending",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "VyFinance",
    description:
      "VyFinance is Decentralized Finance protocol built on Cardano that includes features such as a decentralised exchange (DEx), redistributive mechanism (BAR), governance, lottery and token/NFT Vaults.",
    preview: require("./app-images/vyfi.png"),
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
      "Decentralized open-source protocol for efficient market-making and trading on Cardano.",
    preview: require("./app-images/splash.png"),
    icon: "/img/app-icons/splash.svg",
    website: "https://www.splash.trade/",
    source: "https://github.com/splashprotocol/splash-core",
      category: "dex",
      properties: ["opensource"],
      maintainerPick: false,
      beginnerFriendly: false,
      statsLabel: "splash",
  },
  {
    title: "Palmyra",
    description:
      "Empowering inclusion for underserved commodities through RWA Tokenization.",
    preview: require("./app-images/palmyra.png"),
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
      "Optimize your yield with a decentralized suite of products.",
    preview: require("./app-images/optim.png"),
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
      "Crypto engagement platform designed to enhance community interaction, incentivized participation, and AI-driven automation",
    preview: require("./app-images/farmroll.png"),
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
      "Tokeo is a feature-rich Bitcoin and Cardano wallet that lets you securely store, manage, and trade your BTC, ADA, Runes, Cardano Native Tokens, Ordinals and NFTs, while providing seamless access to the Bitcoin and Cardano blockchain ecosystem.",
    preview: require("./app-images/tokeo.png"),
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
    preview: require("./app-images/empowa.png"),
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
      "DeFi derivatives protocol revolutionizing perpetual futures trading on the Cardano blockchain.",
    preview: require("./app-images/strike.png"),
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
    title: "Smart Places",
    description:
      "Geo-location based SocialFi Network where owning digital land means owning opportunity. Each Landplot is a unique Virtual piece representing a real-world location.",
    preview: require("./app-images/smart-places.png"),
    website: "https://smartplaces.io/",
    source: null,
    category: "social",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Snek.fun",
    description:
      "Snek.fun is a fair-launch token launchpad on Cardano, designed for effortless memecoin creation. Users can launch a token in seconds for a flat fee, with built-in liquidity protection and no team allocations. Tokens are automatically listed via Splash DEX with LP burned, ensuring transparency and rug-pull resistance.",
    preview: require("./app-images/snek-fun.png"),
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
    preview: require("./app-images/xerberus.png"),
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
    preview: require("./app-images/masumi.png"),
    icon: "/img/app-icons/masumi.png",
    statsLabel: "masumi",
    website: "https://www.masumi.network",
    source: "https://github.com/masumi-network",
    category: "marketplace",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Encoins",
    description:
      "ENCOINS is a decentralized private accounts and payments protocol on the Cardano blockchain.",
    preview: require("./app-images/encoins.png"),
    website: "https://www.encoins.io/",
    source: "https://github.com/encryptedcoins",
    category: "identity",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Finest",
    description:
      "Invest in tokenized real world assets. Fully regulated and compliant in Europe.",
    preview: require("./app-images/finest.png"),
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
      "Butane is a fast, powerful, and innovative decentralised synthetics platform built on the Cardano blockchain.",
    preview: require("./app-images/butane.png"),
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
      "As a prediction market, we provide a unique platform where you can speculate on the outcomes of real-world events, leveraging the security, scalability, and transparency that only Cardano can offer.",
    preview: require("./app-images/bodega.png"),
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
    title: "Cornucopias",
    description:
      "Open world MMO set in a world where humanity has ascended from the Earth's surface and created a breathtaking new world in the sky. ",
    preview: require("./app-images/cornucopias.png"),
    website: "https://cornucopias.io/",
    source: null,
    category: "game",
    properties: [],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "Reeve",
    description:
      "The Reeve project, aka Ledger on the Blockchain (LOB), project aims to develop a solution that supports the adoption of Blockchain as a decentralised ledger, for digital recording and storing of accounting and financial information.",
    preview: require("./app-images/reeve.png"),
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
      "A competitive multiplayer racing-combat game featuring dual-engine twin-stick controls. Compete in sponsored tournaments, earn credits, place contracts on rivals, and master risk-reward combat mechanics in death-racing esports.",
    preview: require("./app-images/ascent-rivals.png"),
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
      "USDM is a fully backed USD stablecoin on Cardano, designed for seamless transactions and DeFi applications.",
    preview: require("./app-images/usdm.png"),
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
      "A fully on-chain strategy game for devs. Pilot a spaceship in a 2D grid where everything is a UTxO. ",
    preview: require("./app-images/asteria.png"),
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
      "A mobile & browser fantasy RPG built on Cardano, with native token $WYRM as the main in-game currency, and NFTs unlocking unique in-game perks. The game features advanced tokenomics that reward long-term strategy and engagement. Playable by both web2 and web3 gamers.",
    preview: require("./app-images/ale-axes.png"),
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
      "Layer-zero network for any token to any token on any blockchain swaps.",
    preview: require("./app-images/mynth.png"),
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
      "Clarity Protocol provides community governance and management tools usable by any Cardano project.",
    preview: require("./app-images/clarity.png"),
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
      "Indigo is an autonomous synthetics protocol for on-chain price exposure to real-world assets, built on Cardano.",
    preview: require("./app-images/indigo.png"),
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
      "Orcfax is a decentralized oracle service designed to publish data about real world events to the Cardano blockchain. Orcfax data is made available to on-chain smart contracts in Cardano's eUTXO native format using the Orcfax Protocol.",
    preview: require("./app-images/orcfax.png"),
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
      "Discover the Cardano music ecosystem- where the key center is consensus and the tempo is in slots!  Explore and mint music NFTs and play your collections in our unique player, leveraging the CIP-60 token standard!",
    preview: require("./app-images/arpradio.png"),
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
    preview: require("./app-images/cgov.png"),
    icon: "/img/app-icons/cgov.svg",
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
    preview: require("./app-images/cardano-treasury-explorer.png"),
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
    preview: require("./app-images/sundae-treasury.png"),
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
    preview: require("./app-images/cardano-supply-summary.png"),
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
    preview: require("./app-images/cardanocube-governance.png"),
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
      "Decentralised cross-chain bridge infrastructure connecting Cardano with multiple EVM and non-EVM networks.",
    preview: require("./app-images/wanchain.png"),
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
    preview: require("./app-images/uverify.png"),
    icon: "/img/app-icons/uverify.png",
    statsLabel: "uverify",
    website: "https://app.uverify.io",
    source: "https://github.com/UVerify-io",
    category: "notary",
    properties: ["opensource"],
    maintainerPick: false,
    beginnerFriendly: false,
  },
  {
    title: "CommitProof",
    description: "CommitProof lets you prove what you knew and when. Hash your ideas client-side, anchor the proof on Cardano, and verify it anytime. Your original never leaves your device.",
    preview: require("./app-images/commitproof.png"),
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
      "A free-to-enter, knowledge-based quiz built on Cardano smart contracts. Players submit answers on-chain via Plutus, and the highest scorer can claim the prize. Encrypted submissions and hashed answers ensure fairness.",
    preview: require("./app-images/gnp1quiz.jpeg"),
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
    description: "Enterprise-grade verifiable proof infrastructure combining NFC hardware identity with immutable on-chain records. Enables cryptographically signed, bilateral proof of attendance and corporate compliance actions on Cardano.",
    preview: require("./app-images/tapdano.png"),
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
      "Cardano airdrop tool built for real-world token distribution. Instead of sending tokens to random wallets, you create QR code claim campaigns that put recipients in control. (based on CIP-99)",
    preview: require("./app-images/claimpaign.png"),
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
    preview: require("./app-images/wayup.png"),
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
      "description",
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
  } catch (e) {
    throw new Error(
      `Showcase site with title=${showcase.title} contains errors:\n${e.message}`,
      { cause: e }
    );
  }
}

Showcases.forEach(ensureShowcaseValid);
