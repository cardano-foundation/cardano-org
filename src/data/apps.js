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

// List of available tags. The tag and the label should be in singular. (PLEASE DO NOT ADD NEW TAGS)
export const Tags = {
  // PLEASE DO NOT USE THIS TAG: maintainers add the favorite project tag  (process TBD)
  // Favorite
  favorite: {
    label: "Favorite",
    description:
      "Favorite Cardano apps that you must absolutely check-out.",
    color: '#e9669e',  // Vibrant Pink
  },

  // Accounting
  accounting: {
    label: "Accounting",
    description: "Tools providing specialised analytics for financial purposes, including portfolio tracking.",
    icon: null,
    color: '#85BB65',  // Dollar Bill Green
  },

  // Analytics
  analytics: {
    label: "Analytics",
    description: "Tools that provide special insights related to Cardano.",
    icon: null,
    color: '#6A8EAE',  // Cool Steel Blue
  },

  // PLEASE DO NOT USE THIS TAG: maintainers add the good for beginners tag (process TBD)
  // Beginner friendly, will be shown as suggest to explore the ecosystem in "get-started"
  goodForBeginners: {
    label: "Beginner friendly",
    description:
      "Cardano apps that are good for beginners to start with.",
    color: '#228660ff',  // Vibrant Green
  },

  // Bridge 
  bridge: {
    label: "Bridge",
    description: "Projects that provide cross-chain bridge support.",
    icon: null,
    color: '#FFC107',  // Golden Yellow
  },

  // Block Explorer
  explorer: {
    label: "Block Explorer",
    description:
      "Block explorers are browsers for the Cardano blockchain. They can display the contents of individual blocks and transactions.",
    icon: null,
    color: '#2E3B4E',  // Deep Navy Blue
  },

  // DAO Tool
  daotool: {
    label: "DAO Tool",
    description: "DAO tools help in the proper control and management of a DAO.",
    icon: null,
    color: '#37BEB0',  // Bright Cyan
  },

  // DEX
  dex: {
    label: "DEX",
    description: "Decentralised exchanges allow direct peer-to-peer cryptocurrency transactions to take place online securely.",
    icon: null,
    color: '#3D5AFE',  // Bright Blue
  },

  // Ecosystem
  ecosystem: {
    label: "Ecosystem",
    description: "Projects that map out the Cardano Ecosystem.",
    icon: null,
    color: '#9C27B0',  // Purple
  },

  // Educational
  educational: {
    label: "Educational",
    description: "Educational projects that will help you onboarding to Cardano.",
    icon: null,
    color: '#D81B60',  // Hot Pink
  },

  // Funding 
  funding: {
    label: "Funding",
    description: "Projects aimed at providing funding assistance to individuals.",
    icon: null,
    color: '#004BA0',  // Rich Blue
  },

  // Game, don't tag your game with nft 
  game: {
    label: "Game",
    description: "Games on the Cardano blockchain.",
    icon: null,
    color: '#008080',  // Teal
  },

  // Gateways
  gateway: {
    label: "Gateway",
    description: "Payment Gateway Providers.",
    icon: null,
    color: '#FF5722',  // Bright Orange
  },

  // Governance
  governance: {
    label: "Governance",
    description: "Governance tools.",
    icon: null,
    color: '#673AB7',  // Deep Purple
  },

  // Identity
  identity: {
    label: "Identity",
    description: "Decentralized identifiers (DIDs).",
    icon: null,
    color: '#212121',  // Solid Black
  },

  // Lending 
  lending: {
    label: "Lending",
    description: "Projects that provide lending and borrowing of ada.",
    icon: null,
    color: '#9E1C1C',  // Deep Red
  },

  // Marketplace 
  marketplace: {
    label: "Marketplace",
    description: "Marketplace where you can buy or sell NFTs.",
    icon: null,
    color: '#E53935',  // Bright Red
  },

  // Meta data projects
  metadata: {
    label: "Metadata",
    description: "Transaction metadata.",
    icon: null,
    color: '#00ACC1',  // Bright Teal
  },

  // Minting 
  minting: {
    label: "Minting",
    description: "Minting Tool.",
    icon: null,
    color: '#42A5F5',  // Light Blue
  },

  // Mobile, add mobile tag only if you provide an exceptional mobile experience like a mobile app. (not a responsive site) 
  mobile: {
    label: "Mobile",
    description: "Great mobile experience.",
    icon: null,
    color: '#3e09deff',  // Dark blue
  },

   // Music
  music: {
    label: "Music",
    description: "Music-related projects on Cardano.",
    icon: null,
    color: '#7757d9ff',  // Vibrant Purple
  },

  // NFT, don't add image based NFTs (only wallets, marketplaces, utility nft like adahandle)
  nft: {
    label: "NFT",
    description: "App that supports or uses NFTs.",
    icon: null,
    color: '#B8860B',  // Dark Gold
  },

  // Open-Source 
  opensource: {
    label: "Open-Source",
    description: "Open-Source sites can be useful for inspiration.",
    icon: null,
    color: '#8C2F00',  // Dark Orange-Red
  },

  // Oracle
  oracle: {
    label: "Oracle",
    description: "Oracles provide smart contracts with external data.",
    icon: null,
    color: '#1E88E5',  // Medium Blue
  },

  // Pool Tool
  pooltool: {
    label: "Pool Tool",
    description: "Pool tools provide delegates with the necessary tools to find a good pool.",
    icon: null,
    color: '#6C6FFF',  // Soft Blue
  },

  // Social
  social: {
    label: "Social",
    description: "Sites that use the Cardano blockchain for social messaging, groups and sharing.",
    icon: null,
    color: '#4d6545',  // Custom: Olive (green-grey)
  },

  // Stable Coins
  stablecoin: {
    label: "Stable Coins",
    description: "Backed or algorithmic stable coins.",
    icon: null,
    color: '#FF1744',  // Bright Red
  },

  // Wallets, don't forget to add the "mobile"-tag if you provide a mobile app as well.
  wallet: {
    label: "Wallet",
    description: "Cardano wallets store the public and/or private keys to access and manage your funds.",
    icon: null,
    color: '#7BC8A6',  // Soft Green
  },
};

// Add your project to (THE END OF) this list.
// Please don't add the "favorite"-tag yourself.
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
//   tags: ["dex", "opensource"], // don't overdo it usually one or two tags are enough
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
    tags: ["stablecoin", "opensource"],
  },
  {
    title: "Cardano Wall",
    description:
      "Demonstrates several use cases for transaction metadata. You can sign messages and create proof of existence for files.",
    preview: require("./app-images/cardanowall.png"),
    website: "https://cardanowall.com/en/explore/",
    source: null,
    tags: ["favorite", "metadata"],
  },
  {
    title: "NMKR",
    description:
      "NFT Minting, FIAT & Crypto Sales, Token Launches, Secondary Markets - all available at the press of a button.",
    preview: require("./app-images/nmkr.png"),
    website: "https://www.nmkr.io/",
    source: null,
    tags: ["favorite", "minting", "nft"],
  },
  {
    title: "AdaStat",
    description:
      "The browser, inconspicuous at first glance, offers a great many statistics and insights.",
    preview: require("./app-images/adastat.png"),
    website: "https://adastat.net",
    source: null,
    tags: ["explorer"],
  },
  {
    title: "Cardano Explorer Landing Page",
    description:
      "List of Cardano Explorers built by the community for the community.",
    preview: require("./app-images/cf-explorer.png"),
    website: "https://explorer.cardano.org",
    source: "https://github.com/cardano-foundation/cf-explorer-landing",
    tags: ["explorer", "opensource"],
  },
  {
    title: "CExplorer",
    description:
        "An independent Cardano Explorer that provides useful all-in-one dashboards additionally.",
    preview: require("./app-images/cexplorer.png"),
    website: "https://cexplorer.io/",
    source: null,
    tags: ["explorer"],
  },
  {
    title: "Cardano Scan",
    description:
      "A combination of block explorer and pool tool, using its own implementation of db-sync.",
    preview: require("./app-images/cardanoscan.png"),
    website: "https://cardanoscan.io/",
    source: null,
    tags: ["favorite", "explorer"],
  },
  {
    title: "Pool PM",
    description:
      "Block explorer that brought out a new, refreshing concept to visualize transactions.",
    preview: require("./app-images/poolpm.png"),
    website: "https://pool.pm",
    source: null,
    tags: ["favorite", "explorer"],
  },
  {
    title: "PoolTool",
    description:
      "One of the most feature-rich, unbiased pool tools. Also offers a native app.",
    preview: require("./app-images/pooltool.png"),
    website: "https://pooltool.io",
    source: null,
    tags: ["favorite", "pooltool", "analytics", "explorer"],
  },
  {
    title: "AdaLite",
    description:
      "AdaLite was developed by vacuumlabs, they were also responsible for the Cardano Ledger app and won the crypto puzzle at the IOHK Summit 2019.",
    preview: require("./app-images/adalite.png"),
    icon: "/img/app-icons/adalite.jpg",
    website: "https://adalite.io",
    source: null,
    tags: ["wallet"],
  },
  {
    title: "Atomic Wallet",
    description:
      "Multi-cryptocurrency wallet that supports Cardano. During the integration they contributed code to the Cardano Rust library.",
    preview: require("./app-images/atomicwallet.png"),
    icon: "/img/app-icons/atomic.jpg",
    website: "https://atomicwallet.io",
    source: null,
    tags: ["wallet"],
  },
  {
    title: "Daedalus",
    description:
      "Daedalus is a full node and developed by IOHK, one of the founding entities of Cardano.",
    preview: require("./app-images/daedalus.png"),
    website: "https://daedaluswallet.io",
    source: "https://github.com/input-output-hk/daedalus",
    tags: ["wallet", "opensource"],
  },
  {
    title: "Yoroi",
    description:
      "Yoroi is a lightweight node and developed by EMURGO, one of the founding entities of Cardano.",
    preview: require("./app-images/yoroi.png"),
    icon: "/img/app-icons/yoroi.png",
    website: "https://yoroi-wallet.com",
    source: "https://github.com/Emurgo/yoroi-frontend",
    tags: ["favorite", "wallet", "nft", "mobile", "opensource"],
  },
  {
    title: "Cardano Warriors",
    description: "The retro RPG NFT Collection minted in Cardano Blockchain.",
    preview: require("./app-images/cardanowarriors.png"),
    website: "https://cardanowarriors.io/",
    source: null,
    tags: ["game"],
  },
  {
    title: "Cardano Updates",
    description:
      "Follow the development of Cardano in real time without the hassle of GitHub.",
    preview: require("./app-images/cardanoupdates.png"),
    website: "https://cardanoupdates.com",
    source: null,
    tags: ["favorite", "analytics"],
  },
  {
    title: "Pool Stats",
    description: "Pool tool and insights visualized by heat maps.",
    preview: require("./app-images/poolstats.png"),
    website: "https://poolstats.io",
    source: null,
    tags: ["pooltool", "analytics"],
  },
  {
    title: "NOWPayments",
    description:
      "Payment gateway provider to accept ada payments and ada donations.",
    preview: require("./app-images/nowpayments.png"),
    website: "https://nowpayments.io",
    source: null,
    tags: ["favorite", "gateway"],
  },
  {
    title: "Coti adaPay",
    description:
      "Payment gateway provider to accept ada payments and ada donations.",
    preview: require("./app-images/cotiadapay.png"),
    website: "https://adapay.finance/",
    source: null,
    tags: ["gateway"],
  },
  {
    title: "Gimbalabs",
    description:
      "Gimbalabs is a collaborative community and space where dApps and OpenSource tools are developed in the \"Playground\" (Project-Based Learning experiences). All are welcome to join every Tuesday at 4pm UTC!",
    preview: require("./app-images/gimbalabs.png"),
    website: "https://gimbalabs.com",
    source: "https://gitlab.com/gimbalabs",
    tags: ["favorite", "educational", "opensource"],
  },
  {
    title: "Eternl",
    description:
      "The alternative Cardano light wallet in the browser. Aims to add features most requested by the Cardano community.",
    preview: require("./app-images/eternl.jpg"),
    icon: "/img/app-icons/eternl.jpg",
    website: "https://eternl.io",
    source: null,
    tags: ["favorite", "wallet", "nft", "mobile"],
  },
  {
    title: "Cardano Token and NFT Builder",
    description:
      "Create your own native tokens and NFT in a few clicks without any code.",
    preview: require("./app-images/token-builder.png"),
    website: "https://cardano-native-token.com/",
    source: null,
    tags: ["minting", "nft"],
  },
  {
    title: "cardano-tools.io",
    description:
      "An advanced CNFT maker. You just pay network fees.",
    preview: require("./app-images/cardano-tools.io.png"),
    website: "https://cardano-tools.io",
    source: "https://github.com/wutzebaer/cardano-tools",
    tags: ["minting", "nft", "opensource"],
  },
  {
    title: "Typhon",
    description:
      "Light wallet from the creators of cardanoscan.io. It comes with features like NFT gallery, transaction metadata, vote registration, among other features.",
    preview: require("./app-images/typhonwallet.png"),
    icon: "/img/app-icons/typhon.jpg",
    website: "https://typhonwallet.io",
    source: null,
    tags: ["favorite", "wallet", "nft"],
  },
  {
    title: "Staking Rewards Calculator",
    description:
      "A detailed Staking Rewards Calculator thats shows expected return to the operator and delegators of each pool based on the current and alternative network parameters. It also runs a Monte Carlo simulation to show possible variability in the return.",
    preview: require("./app-images/staking-rewards-calculator.png"),
    website: "https://cardano.org/calculator/",
    source: null,
    tags: ["pooltool", "analytics", "educational"],
  },
  {
    title: "Cardahub - A services hub on Cardano",
    description:
      "One stop shop for everything CNFT. A smart-contract NFT platform on Cardano where user can mint, distribute, list and buy NFT in a few clicks.",
    preview: require("./app-images/cardahub.png"),
    website: "https://cardahub.io",
    source: null,
    tags: ["marketplace", "minting", "nft"],
  },
  {
    title: "ADAdice",
    description:
      "A fully on-chain, provably fair game of dice on the Cardano blockchain.",
    preview: require("./app-images/adadice.png"),
    website: "https://www.adadice.com",
    source: null,
    tags: ["game"],
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
    tags: ["favorite", "dex"],
  },
  {
    title: "SundaeSwap",
    description:
      "SundaeSwap is a native, scalable decentralized exchange and automated liquidity provision protocol.",
    preview: require("./app-images/sundaeswap.png"),
    icon: "/img/app-icons/sundaeswap.jpg",
    website: "https://app.sundae.fi",
    source: null,
    tags: ["favorite", "dex"],
  },
  {
    title: "DripDropz",
    description:
      "We provide token dispensing services to the Cardano community. An intuitive platform that offers projects a comprehensive selection of distribution parameters.",
    preview: require("./app-images/dripdropz.png"),
    icon: "/img/app-icons/dripdropz.jpg",
    website: "https://dripdropz.io",
    source: null,
    tags: ["minting"],
  },
  {
    title: "ADAZOO MMORPG and Metaverse",
    description: "Start exploring ADAZOO, battle and capture CNFT's. Brag to your friends, show off your stats.",
    preview: require("./app-images/adazoo.png"),
    website: "https://adazoo.com",
    source: null,
    tags: ["game"],
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
    tags: ["dex", "goodForBeginners"],
  },
  {
    title: "GameChanger Wallet",
    description:
      "The ultimate wallet experience for the Web, with native NFT and token features, powered by Cardano and third party applications.",
    preview: require("./app-images/gamechanger.png"),
    icon: "/img/app-icons/gamechanger.jpg",
    website: "https://gamechanger.finance",
    source: null,
    tags: ["wallet", "nft"],
  },
  {
    title: "GeroWallet",
    description:
      "Start exploring the possibilities of Cardano. Purchase, send, and receive ADA - the cryptocurrency for Cardano. Available as a browser extension.",
    preview: require("./app-images/gerowallet.png"),
    icon: "/img/app-icons/gero.jpg",
    website: "https://gerowallet.io",
    source: null,
    tags: ["wallet"],
  },
  {
    title: "Built on Cardano",
    description:
      "Discover projects and dApps building on Cardano along with the developer tools you can use to build on Cardano. Explore similar projects and tools with ease and simply find you way back to where you started.",
    preview: require("./app-images/buildoncardano.png"),
    website: "https://builtoncardano.com",
    source: null,
    tags: ["ecosystem"],
  },
  {
    title: "CardanoCube",
    description:
      "Explore 650+ Projects Building on Cardano.",
    preview: require("./app-images/cardanocube.png"),
    website: "https://www.cardanocube.io",
    source: null,
    tags: ["ecosystem"],
  },
  {
    title: "JPG Store",
    description:
      "Discover artwork, explore communities, and support artists on Cardano.",
    preview: require("./app-images/jpg.png"),
    icon: "/img/app-icons/jpgstore.jpg",
    website: "https://www.jpg.store",
    source: null,
    tags: ["marketplace", "nft", "goodForBeginners"],
  },
  {
    title: "Pavia",
    description:
      "Create, explore and trade in the Cardano virtual world owned by its users.",
    preview: require("./app-images/pavia.png"),
    website: "https://www.pavia.io",
    source: null,
    tags: ["game"],
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
    tags: ["dex"],
  },
  {
    title: "Lido Nation",
    description:
      "Aggregation of existing catalyst proposals, results, feedbacks and many more.",
    preview: require("./app-images/lidonation.png"),
    website: "https://www.lidonation.com/en/catalyst-explorer",
    source: null,
    tags: ["analytics"],
  },
  {
    title: "eUTxO",
    description:
      "Visual blockchain explorer for Cardano.",
    preview: require("./app-images/eutxo.png"),
    website: "https://eutxo.org",
    source: null,
    tags: ["analytics", "explorer"],
  },
  {
    title: "Vibrant",
    description:
      "A community integration tool that allows stakepool operators and NFT projects to connect and engage with their audience, verify their delegators and holders, create polls, whitelists and more via Discord, Website, and other social media apps.",
    preview: require("./app-images/vibrant.png"),
    website: "https://www.vibrantnet.io",
    source: "https://github.com/nilscodes/hazelnet",
    tags: ["nft", "opensource"],
  },
  {
    title: "Book.io",
    description:
      "An NFT marketplace for buying, reading, and selling eBooks and Audiobooks.",
    preview: require("./app-images/book-token.png"),
    website: "https://www.book.io",
    source: null,
    tags: [ "marketplace", "nft"],
    icon: "/img/app-icons/bookio.jpg",
  },
  {
    title: "NuFi Wallet",
    description:
      "Non-custodial, multi-chain wallet with in-app DEX.",
    preview: require("./app-images/nufiwallet.png"),
    website: "https://nu.fi",
    source: null,
    tags: [ "wallet", "dex", "nft"],
  }, 
  {
    title: "Carda Station",
    description: 
      "Explore this virtual world on the moon with an in game avatar, and interact with other players through hangouts, games or events.",
    preview: require("./app-images/cardastation.png"),
    website: "https://cardastation.com/",
    source: null,
    tags: ["game"],
  },
  {
    title: "STAMPD",
    description: 
      "Use the public blockchains to timestamp your files with indelible proof and mint with linked NFC physical tags for embedment in physical objects.",
    preview: require("./app-images/stampd.png"),
    website: "https://stampd.io/",
    source: null,
    tags: ["minting", "metadata"],
  },
  {
    title: "CNFTLab Party",
    description: 
      "Tool for minting CNFTs, manage your policyID, create royalties and start minting in few seconds.",
    preview: require("./app-images/cnftlab-party.png"),
    website: "https://www.cnftlab.party/",
    source: null,
    tags: ["minting", "nft"],
  },
  {
    title: "TapTools",
    description:
      "All-in-one platform that offers free token distribution, comprehensive charts, NFT generation, and mint facilitation.",
    preview: require("./app-images/taptools.png"),
    website: "https://www.taptools.io",
    source: null,
    tags: [ "favorite", "analytics", "minting"],
  },
  {
    title: "Chainport",
    description: 
      "ChainPort is a next-gen hard-security blockchain bridge that lets you hop across EVM chains to Cardano at a click.",
    preview: require("./app-images/chainport.png"),
    website: "https://www.chainport.io/",
    source: null,
    tags: ["bridge"],
  },
  {
    title: "Cardano Pet Registry",
    description: 
      "A virtually free, non profit, global pet registry system built on the Cardano blockchain, facilitates peer to peer pet rescue and historical proof of pet ownership.",
    preview: require("./app-images/petregistry.png"),
    website: "https://savepet.org",
    source: null,
    tags: ["identity"],
  }, 
  {
    title: "Cardano Studio",
    description:
      "Create and mint NFTs on Cardano all in your browser - without trusting a third party for minting.",
    preview: require("./app-images/cardano-studio.png"),
    website: "https://cardano-studio.app",
    source: null,
    tags: ["minting", "nft"],
  },
  {
    title: "Cardano Relay Map",
    description: 
      "Shows geographical distribution of Cardano stake pool relay nodes with flexible map features.",
    preview: require("./app-images/monadpool-relay-map.png"),
    website: "https://monadpool.com/cardano.html",
    source: null,
    tags: ["analytics"],
  },
  {
    title: "Finitum Bridge",
    description: 
      "Move supported tokens cross-chain, from BSC to Cardano and vice versa.",
    preview: require("./app-images/finitum-bridge.png"),
    website: "https://finitum.io/bridge",
    source: null,
    tags: ["bridge"],
  },
  {
    title: "BALANCE Analytics",
    description:
      "Graphical, configurable analytics specialising in Cardano PoS decentralisation metrics.",
    preview: require("./app-images/balance-analytics.png"),
    website: "https://www.balanceanalytics.io/",
    source: null,
    tags: ["analytics", "pooltool"],
  },
  {
    title: "adahandle",
    description: 
      "A standardized NFT that developers and users can use to associate an address with a custom and human-readable address.",
    preview: require("./app-images/adahandle.png"),
    website: "https://adahandle.com",
    source: null,
    tags: ["identity", "nft"],
  },
  {
    title: "Lace",
    description: 
      "A new light wallet platform from IOG, one of the creators of Cardano. Manually verified by an independent auditor, Lace lets you quickly, easily, and securely manage your digital assets and enjoy Web3.",
    preview: require("./app-images/lace.png"),
    icon: "/img/app-icons/lace.jpg",
    website: "https://www.lace.io/",
    source: "https://github.com/input-output-hk/lace",
    tags: ["favorite", "wallet", "nft", "opensource"],
  },
  {
    title: "Do it with Lovelace",
    description:
      "A Cardano-based dApp platform for easy and secure donations with a focus on community impact and transparency.",
    preview: require("./app-images/do-it-with-lovelace.png"),
    website: "https://app.doitwithlovelace.io",
    source: null,
    tags: ["funding"],
  },
  {
    title: "Aada.finance",
    description: 
      "Aada is a peer-to-peer lending and borrowing protocol on the Cardano blockchain.",
    preview: require("./app-images/aada-finance.png"),
    icon: "/img/app-icons/aada.finance.png",
    website: "https://app.aada.finance",
    source: null,
    tags: ["lending", "marketplace", "nft"],
  },
  {
    title: "Continuity Token",
    description:
      "$COTO provides secure, global and long-lasting cold storage backups of Cardano NFT media.",
    preview: require("./app-images/coto.png"),
    website: "https://continuity.to/",
    source: null,
    tags: ["nft"],
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
    tags: ["favorite", "wallet", "nft", "mobile"],
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
    tags: ["dex"],
  },
  {
    title: "Liqwid",
    description:
      "Liqwid is a non-custodial pooled lending protocol with liquid staking built on Cardano.",
    preview: require("./app-images/liqwid.webp"),
    icon: "/img/app-icons/liquid.png",
    statsLabel: "liqwid finance",
    website: "https://liqwid.finance/",
    source: null,
    tags: ["lending", "marketplace", "goodForBeginners"],
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
    tags: ["oracle", "metadata"],
  },
  {
    title: "Cardano Academy",
    description:
      "Learn blockchain fundamentals, consensus algorithms, and encryption methods. You’ll explore transaction models, risk mitigation, and scaling solutions. Additionally, you’ll delve into the Cardano blockchain, its governance, and practical uses of ada, including staking and decentralized applications.​",
    preview: require("./app-images/cardano-academy.jpg"),
    website: "https://academy.cardanofoundation.org",
    source: null,
    tags: ["favorite", "educational"],
  },
  {
    title: "Cardano Governance Tool",
    description:
      "A collection of tools to delegate voting power, become a DRep, become a direct voter, browse or proposa a governance actions on Cardano blockchain.",
    preview: require("./app-images/govtools.jpg"),
    website: "https://gov.tools",
    source: null,
    tags: ["favorite", "governance"],
  },
  {
    title: "Chang Watch",
    description:
      "Chang Watch provides various donut charts with insights on vote distribution and DReps.",
    preview: require("./app-images/changwatch.jpg"),
    website: "https://www.changwatch.com",
    source: null,
    tags: ["governance", "analytics"],
  },
  {
    title: "Medusa Wallet",
    description:
        "A lightweight Cardano wallet focused on privacy and user protection, enabling easy and secure access to funds even in untrusted or compromised environments. ",
    preview: require("./app-images/medusa_wallet_poster.png"),
    website: "https://adawallet.io",
    source: null,
    tags: ["wallet"],
   },
  {
    title: "Danogo",
    description:
      "Danogo is a yield aggregator that provides lending and borrowing, obtaining optimized rates by combining data from multiple Cardano protocols.",
    preview: require("./app-images/danogo.png"),
    icon: "/img/app-icons/danogo.jpg",
    statsLabel: "danogo",
    website: "https://danogo.io/",
    source: null,
    tags: ["lending", "marketplace", "dex"],
  },
  {
    title: "Multisig Platform",
    description:
      "Secure your treasury and participant in governance, as a team with multi-signature.",
    preview: require("./app-images/mesh-multisig-platform.jpg"),
    website: "https://multisig.meshjs.dev/features",
    source: null,
    tags: ["governance", "wallet", "daotool"],
  },
  {
    title: "Tempo",
    description:
      "Tempo is a governance tool designed to streamline and enhance Cardano’s decision-making processes. We make it easier for DReps to register, gain delegations, and engage with their delegators. Additionally, Tempo supports DAOs and SPOs by providing essential tools for governance and transparency.",
    preview: require("./app-images/tempo.png"),
    website: "https://tempo.vote",
    source: null,
    tags: ["daotool", "governance"],
  },
  {
    title: "Nio",
    description:
      "Track and monitor all assets in any wallet or locked in Cardano DeFi smart contracts.",
    preview: require("./app-images/nio_app.png"),
    website: "https://nioapp.io",
    source: null,
    tags: ["accounting"],
  },
  {
    title: "Begin Wallet",
    description:
      "Begin Wallet a non-custodial light Cardano Wallet, available as an Extension and Mobile. We offer payment link compatibility with deep link support, Begin ID user name based on ENS protocol for Wallet Address. Hardware wallet support Ledger and Keystone. Based on our own open source cryptographic core.",
    preview: require("./app-images/begin.png"),
    icon: "/img/app-icons/begin.jpg",
    website: "https://begin.is",
    source: null,
    tags: ["wallet", "nft", "mobile"],
  },
  {
    title: "Onboard Ninja",
    description:
      "Onboard is a platform that allows creators to effortlessly distribute Cardano airdrops at in-person events.",
    preview: require("./app-images/onboard-ninja.jpg"),
    website: "https://onboard.ninja",
    source: null,
    tags: ["favorite", "minting", "nft"],
  },
    {
    title: "Stuff.io",
    description:
      "Stuff.io is the global leader in true digital ownership, enabling consumers to genuinely own, share, gift, or resell their digital media like movies, music, ebooks, audiobooks, and podcasts.",
    preview: require("./app-images/stuff-io.png"),
    website: "https://stuff.io",
    source: null,
    tags: ["marketplace"],
  },
  {
    title: "Veridian Wallet",
    description: 
      "Manages identity across platforms using decentralized public key infrastructure and verifiable credentials: ensuring data privacy and ownership with tamper proofing and quantum resistance. Built on KERI and optionally anchored to Cardano.",
    preview: require("./app-images/veridian2.png"),
    website: "https://www.veridian.id/",
    source: "https://github.com/cardano-foundation/veridian-wallet",
    tags: ["identity", "opensource"],
  },
  {
    title: "Governance Space",
    description:
      "A blockchain governance platform for DAOs, projects, and institutions: providing indexing & analytics for DReps, governance actions, budget proposals & discussions, committee members, live events, and more.",
    preview: require("./app-images/govspace.png"),
    website: "https://governancespace.com/",
    source: null,
    tags: ["daotool", "governance"],
  },
  {
    title: "Adastack.io",
    description:
      "Comprehensive Cardano ecosystem explorer: Explore intro guides, wallets, DApps, NFTs, games, governance, Project Catalyst, DAOs, development, sidechains, L2s and more.",
    preview: require("./app-images/adastack.png"),
    website: "https://www.adastack.io",
    source: null,
    tags: ["ecosystem", "educational"],
  },
  {
    title: "ADAM Cardano App",
    description:
      "Are you looking for an efficient way to connect and track your ADA wallets? ADAM Cardano app for iOS and Android is designed to help track all your Cardano stacking rewards, wallets and funds from a single, cohesive interface. ADAM app also exclusively provides stunning price widgets, packed with valuable price insights.",
    preview: require("./app-images/adam.png"),
    website: "https://androdevs.de",
    source: null,
    tags: ["accounting", "nft"],
  },
  {
    title: "Cardano Governance Voting Tool",
    description:
      "A simple tool to help every Cardano stakeholder participate in on-chain governance with confidence.",
    preview: require("./app-images/cf-voting-tool.png"),
    website: "https://voting.cardanofoundation.org/",
    source: "https://github.com/cardano-foundation/cardano-governance-voting-tool",
    tags: ["governance", "opensource"],
  },
  {
    title: "NEWM",
    description:
      "Decentralized music streaming platform that enables artists to own and monetize their creative content through fractionalized IP rights, direct fan tipping, music rights marketplace, and real-time royalty payouts.",
    preview: require("./app-images/newm.png"),
    website: "https://newm.io/",
    source: "https://github.com/projectNEWM/",
    tags: ["favorite", "music", "opensource"],
  },
  {
    title: "Andamio",
    description:
      "Verified trust protocol for distributed work. Organizations can mint credentials, verify skills, and find contributors. Individuals can learn, discover opportunities, join project teams, and launch their own projects.",
    preview: require("./app-images/andamio.png"),
    website: "https://www.andamio.io/",
    source: null,
    tags: ["daotool"],
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
    tags: ["dex"],
  },
  {
    title: "FluidTokens",
    description:
      "FluidTokens is the leading Cardano-Bitcoin DeFi ecosystem, presenting a diverse range of services like lending, borrowing, staking, sponsored transactions and an array of other inventive products including rental options, boosted stake features, and more.",
    preview: require("./app-images/fluidtokens.png"),
    icon: "/img/app-icons/fluidtoken.png",
    website: "https://fluidtokens.com/",
    source: "https://github.com/fluidtokens",
    tags: ["lending", "marketplace", "opensource"],
  },
  {
    title: "Genius Yield",
    description:
      "All-in-one platform, that combines an order book DEX with an automated yield optimizer.",
    preview: require("./app-images/genius-yield.png"),
    statsLabel: "geniusyield",
    website: "https://www.geniusyield.co/",
    source: "https://github.com/geniusyield",
    tags: ["dex", "opensource"],
  },
  {
    title: "Iagon",
    description:
      "Iagon is an AI-driven shared storage and compute economy. Bridging decentralization with compliance to revolutionize cloud services.",
    preview: require("./app-images/iagon.png"),
    icon: "/img/app-icons/iagon.png",
    website: "https://iagon.com",
    source: null,
    tags: ["marketplace"],
  },
  {
    title: "Yamfore",
    description:
      "Yamfore streamlines lending on the Cardano blockchain with its decentralized platform that eliminates the need for traditional lenders. Utilizing an internal stablecoin reserve, it offers indefinite loan durations and no margin calls, ensuring borrowers are safe from loan liquidation during market volatility.",
    preview: require("./app-images/yamfore.png"),
    website: "https://www.yamfore.com/",
    source: "https://github.com/BigBlymp/yamfore-resources",
    tags: ["lending", "opensource"],
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
    tags: ["dex"],
  },
  {
    title: "Splash",
    description:
      "Decentralized open-source protocol for efficient market-making and trading on Cardano.",
    preview: require("./app-images/splash.png"),
    icon: "/img/app-icons/splash.svg",
    website: "https://www.splash.trade/",
    source: "https://github.com/splashprotocol/splash-core",
      tags: ["dex", "opensource"],
      statsLabel: "splash",
  },
  {
    title: "Palmyra",
    description:
      "Empowering inclusion for underserved commodities through RWA Tokenization.",
    preview: require("./app-images/palmyra.png"),
    website: "https://palmeconomy.io/",
    source: "https://github.com/zenGate-Global/winter-cardano",
    tags: ["marketplace", "opensource"],
  },
  {
    title: "Optim Finance",
    description:
      "Optimize your yield with a decentralized suite of products.",
    preview: require("./app-images/optim.png"),
    website: "https://www.optim.finance/",
    source: null,
    tags: ["lending", "marketplace"],
  },
  {
    title: "Farmroll",
    description:
      "Crypto engagement platform designed to enhance community interaction, incentivized participation, and AI-driven automation",
    preview: require("./app-images/farmroll.png"),
    website: "https://farmroll.io/",
    source: null,
    tags: ["social"],
  },
  {
    title: "TokeoPay",
    description:
      "Tokeo is a feature-rich Bitcoin and Cardano wallet that lets you securely store, manage, and trade your BTC, ADA, Runes, Cardano Native Tokens, Ordinals and NFTs, while providing seamless access to the Bitcoin and Cardano blockchain ecosystem.",
    preview: require("./app-images/tokeo.png"),
    icon: "/img/app-icons/tokeo.jpg",
    website: "https://tokeo.io/",
    source: null,
    tags: ["wallet", "mobile"],
  },
  {
    title: "Empowa",
    description:
      "Join a RWA project looking to enable 1 million African families to become owners of a climate-smart home across Africa by 2030.",
    preview: require("./app-images/empowa.png"),
    website: "https://empowa.io/",
    source: null,
    tags: ["marketplace"],
  },
  {
    title: "Strike Finance",
    description:
      "DeFi derivatives protocol revolutionizing perpetual futures trading on the Cardano blockchain.",
    preview: require("./app-images/strike.png"),
    icon: "/img/app-icons/strike.png",
    statsLabel: "strike finance",
    website: "https://www.strikefinance.org/",
    source: "https://github.com/strike-finance/perpetuals-smart-contracts",
    tags: ["marketplace", "goodForBeginners", "opensource"],
  },
  {
    title: "Smart Places",
    description:
      "Geo-location based SocialFi Network where owning digital land means owning opportunity. Each Landplot is a unique Virtual piece representing a real-world location.",
    preview: require("./app-images/smart-places.png"),
    website: "https://smartplaces.io/",
    source: null,
    tags: ["social"],
  },
  {
    title: "Snek.fun",
    description:
      "Snek.fun is a fair-launch token launchpad on Cardano, designed for effortless memecoin creation. Users can launch a token in seconds for a flat fee, with built-in liquidity protection and no team allocations. Tokens are automatically listed via Splash DEX with LP burned, ensuring transparency and rug-pull resistance.",
    preview: require("./app-images/snek-fun.png"),
    website: "https://snek.fun/",
    source: null,
    tags: ["marketplace"],
  },
  {
    title: "Xerberus",
    description:
      "Xerberus' Risk Ratings deliver automated, objective, and real-time insights derived from on-chain data, providing investors and dApps with accurate risk assessments.",
    preview: require("./app-images/xerberus.png"),
    website: "https://www.xerberus.io/",
    source: null,
    tags: ["marketplace"],
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
    tags: ["marketplace", "opensource"],
  },
  {
    title: "Encoins",
    description:
      "ENCOINS is a decentralized private accounts and payments protocol on the Cardano blockchain.",
    preview: require("./app-images/encoins.png"),
    website: "https://www.encoins.io/",
    source: "https://github.com/encryptedcoins",
    tags: ["identity", "opensource"],
  },
  {
    title: "Finest",
    description:
      "Invest in tokenized real world assets. Fully regulated and compliant in Europe.",
    preview: require("./app-images/finest.png"),
    website: "https://www.finest.investments/",
    source: null,
    tags: ["marketplace"],
  },
  {
    title: "Butane",
    description:
      "Butane is a fast, powerful, and innovative decentralised synthetics platform built on the Cardano blockchain.",
    preview: require("./app-images/butane.png"),
    icon: "/img/app-icons/butane.jpg",
    website: "https://butane.dev/",
    source: "https://github.com/butaneprotocol/butane-contracts",
    tags: ["opensource", "marketplace"],
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
    tags: ["marketplace", "goodForBeginners", "opensource"],
  },
  {
    title: "Cornucopias",
    description:
      "Open world MMO set in a world where humanity has ascended from the Earth's surface and created a breathtaking new world in the sky. ",
    preview: require("./app-images/cornucopias.png"),
    website: "https://cornucopias.io/",
    source: null,
    tags: ["game"],
  },
  {
    title: "Reeve",
    description:
      "The Reeve project, aka Ledger on the Blockchain (LOB), project aims to develop a solution that supports the adoption of Blockchain as a decentralised ledger, for digital recording and storing of accounting and financial information.",
    preview: require("./app-images/reeve.png"),
    website: "https://www.cardanofoundation.org/reeve#mission",
    source: "https://github.com/cardano-foundation/cf-reeve-platform",
    tags: ["accounting", "opensource"],
  },
  {
    title: "Ascent Rivals",
    description:
      "A competitive multiplayer racing-combat game featuring dual-engine twin-stick controls. Compete in sponsored tournaments, earn credits, place contracts on rivals, and master risk-reward combat mechanics in death-racing esports.",
    preview: require("./app-images/ascent-rivals.png"),
    website: "https://www.ascentrivals.com/",
    source: null,
    tags: ["game"],
  },
  {
    title: "USDM Stablecoin",
    description:
      "USDM is a fully backed USD stablecoin on Cardano, designed for seamless transactions and DeFi applications.",
    preview: require("./app-images/usdm.png"),
    icon: "/img/app-icons/usdm.jpeg",
    website: "https://moneta.global/",
    source: null,
    tags: ["stablecoin"],
  },
  {
    title: "Asteria",
    description:
      "A fully on-chain strategy game for devs. Pilot a spaceship in a 2D grid where everything is a UTxO. ",
    preview: require("./app-images/asteria.png"),
    website: "https://github.com/txpipe/asteria",
    source: "https://github.com/txpipe/asteria",
    tags: ["game", "opensource"],
  },
  {
    title: "Ale & Axes",
    description:
      "A mobile & browser fantasy RPG built on Cardano, with native token $WYRM as the main in-game currency, and NFTs unlocking unique in-game perks. The game features advanced tokenomics that reward long-term strategy and engagement. Playable by both web2 and web3 gamers.",
    preview: require("./app-images/ale-axes.png"),
    website: "https://aleaxes.com/",
    source: null,
    tags: ["game"],
  },
  {
    title: "Mynth",
    description:
      "Layer-zero network for any token to any token on any blockchain swaps.",
    preview: require("./app-images/mynth.png"),
    website: "https://mynth.ai",
    source: null,
    tags: ["bridge", "dex"],
  },
  {
    title: "Clarity Protocol",
    description:
      "Clarity Protocol provides community governance and management tools usable by any Cardano project.",
    preview: require("./app-images/clarity.png"),
    website: "https://www.clarity.community/",
    source: null,
    tags: ["daotool"],
  },
  {
    title: "Indigo",
    description:
      "Indigo is an autonomous synthetics protocol for on-chain price exposure to real-world assets, built on Cardano.",
    preview: require("./app-images/indigo.png"),
    icon: "/img/app-icons/indy.png",
    statsLabel: "indigo",
    website: "https://indigoprotocol.io/",
    source: "https://github.com/IndigoProtocol/indigo-smart-contracts",
    tags: ["marketplace", "opensource"],
  },
  {
    title: "Orcfax",
    description:
      "Orcfax is a decentralized oracle service designed to publish data about real world events to the Cardano blockchain. Orcfax data is made available to on-chain smart contracts in Cardano's eUTXO native format using the Orcfax Protocol.",
    preview: require("./app-images/orcfax.png"),
    website: "https://orcfax.io",
    source: "https://github.com/orcfax/orcfax-aiken",
    tags: ["oracle", "opensource"],
  },
  {
    title: "Arp Radio",
    description:
      "Discover the Cardano music ecosystem- where the key center is consensus and the tempo is in slots!  Explore and mint music NFTs and play your collections in our unique player, leveraging the CIP-60 token standard!",
    preview: require("./app-images/arpradio.png"),
    website: "https://arpradio.media",
    source: null,
    tags: ["music"],
  },
  {
    title: "CGOV",
    description:
      "A governance monitoring dashboard to track and analyze on-chain governance actions, including active, ratified, and expired proposals on the Cardano blockchain.",
    preview: require("./app-images/cgov.png"),
    website: "https://app.cgov.io/",
    source: "https://github.com/nomos-guild/cgov",
    tags: ["governance", "analytics", "opensource"],
  },
  {
    title: "Cardano Treasury Explorer",
    description:
      "A dashboard for exploring and analyzing Cardano's treasury data, providing insights into treasury balance, withdrawals, and funding allocations.",
    preview: require("./app-images/cardano-treasury-explorer.png"),
    website: "https://cardanotreasury.fi/",
    source: null,
    tags: ["governance", "analytics"],
  },
  {
    title: "Sundae Treasury Dashboard",
    description:
      "A smart contract-based treasury management platform by Sundae Labs for transparent milestone-based fund disbursements from Cardano governance actions.",
    preview: require("./app-images/sundae-treasury.png"),
    website: "https://treasury.sundae.fi/",
    source: "https://github.com/SundaeSwap-finance/treasury-contracts",
    tags: ["governance", "opensource"],
  },
  {
    title: "Cardano Supply Summary",
    description:
      "Explore historical trends in Cardano's ada supply distribution, including reserves, rewards, treasury, and deposits across epochs.",
    preview: require("./app-images/cardano-supply-summary.png"),
    website: "https://cardano.org/insights/supply/summary/",
    source: null,
    tags: ["governance", "analytics"],
  },
  {
    title: "CardanoCube Governance Actions",
    description:
      "Browse live on-chain governance proposals shaping Cardano's future, including protocol updates, constitutional amendments, and budget allocations.",
    preview: require("./app-images/cardanocube-governance.png"),
    website: "https://www.cardanocube.com/governance/gov_actions",
    source: null,
    tags: ["governance"],
  },
  {
    title: "Wanchain",
    description:
      "Decentralised cross-chain bridge infrastructure connecting Cardano with multiple EVM and non-EVM networks.",
    preview: require("./app-images/wanchain.png"),
    website: "https://bridge.wanchain.org/AssetBridge",
    source: null,
    tags: ["bridge"],
  },
];

export const TagList = Object.keys(Tags);
function sortShowcases() {
  let result = Showcases;

  // Sort by site name
  result = sortBy(result, (showcase) => showcase.title.toLowerCase());

  // Sort by favorite tag, favorite first
  result = sortBy(result, (showcase) => !showcase.tags.includes("favorite"));
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
      "tags",
      "icon",
      "statsLabel",
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

  function checkTags() {
    if (
      !showcase.tags ||
      !(showcase.tags instanceof Array) ||
      showcase.tags.includes("")
    ) {
      throw new Error(`Bad showcase tags=[${JSON.stringify(showcase.tags)}]`);
    }
    const unknownTags = difference(showcase.tags, TagList);
    if (unknownTags.length > 0) {
      throw new Error(
        `Unknown tags=[${unknownTags.join(
          ","
        )}\nThe available tags are ${TagList.join(",")}`
      );
    }
  }

  function checkOpenSource() {
    if (typeof showcase.source === "undefined") {
      throw new Error(
        "The source attribute is required.\nIf your Cardano project is not open-source, please make it explicit with 'source: null'"
      );
    } else {
      const hasOpenSourceTag = showcase.tags.includes("opensource");
      if (showcase.source === null && hasOpenSourceTag) {
        throw new Error(
          "You can't add the opensource tag to a site that does not have a link to source code."
        );
      } else if (showcase.source && !hasOpenSourceTag) {
        throw new Error(
          "For open-source sites, please add the 'opensource' tag."
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
    checkTags();
    checkOpenSource();
  } catch (e) {
    throw new Error(
      `Showcase site with title=${showcase.title} contains errors:\n${e.message}`
    );
  }
}

Showcases.forEach(ensureShowcaseValid);
