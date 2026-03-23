import {translate} from '@docusaurus/Translate';

// Platform definitions for wallet finder
export const WalletPlatforms = {
  ios: {
    label: translate({id: 'walletFinder.platforms.ios', message: 'iOS'}),
    description: translate({id: 'walletFinder.platforms.ios.desc', message: 'Available on iPhone and iPad'}),
  },
  android: {
    label: translate({id: 'walletFinder.platforms.android', message: 'Android'}),
    description: translate({id: 'walletFinder.platforms.android.desc', message: 'Available on Android devices'}),
  },
  browser: {
    label: translate({id: 'walletFinder.platforms.browser', message: 'Browser Extension'}),
    description: translate({id: 'walletFinder.platforms.browser.desc', message: 'Available as a browser extension'}),
  },
  desktop: {
    label: translate({id: 'walletFinder.platforms.desktop', message: 'Desktop'}),
    description: translate({id: 'walletFinder.platforms.desktop.desc', message: 'Available for Windows, macOS, or Linux'}),
  },
  web: {
    label: translate({id: 'walletFinder.platforms.web', message: 'Web App'}),
    description: translate({id: 'walletFinder.platforms.web.desc', message: 'Accessible via web browser without installation'}),
  },
};

// Feature definitions for wallet finder
export const WalletFeatures = {
  staking: {
    label: translate({id: 'walletFinder.features.staking', message: 'Staking'}),
    description: translate({id: 'walletFinder.features.staking.desc', message: 'Delegate ada to a stake pool and earn rewards'}),
  },
  nft: {
    label: translate({id: 'walletFinder.features.nft', message: 'NFT Support'}),
    description: translate({id: 'walletFinder.features.nft.desc', message: 'View, send, and manage NFTs'}),
  },
  "dapp-connector": {
    label: translate({id: 'walletFinder.features.dappConnector', message: 'DApp Connector'}),
    description: translate({id: 'walletFinder.features.dappConnector.desc', message: 'Connect to decentralized applications'}),
  },
  "multi-asset": {
    label: translate({id: 'walletFinder.features.multiAsset', message: 'Multi-Asset'}),
    description: translate({id: 'walletFinder.features.multiAsset.desc', message: 'Manage native tokens beyond ada'}),
  },
  "hardware-wallet": {
    label: translate({id: 'walletFinder.features.hardwareWallet', message: 'Hardware Wallet'}),
    description: translate({id: 'walletFinder.features.hardwareWallet.desc', message: 'Connect Ledger or Trezor for extra security'}),
  },
  "multi-account": {
    label: translate({id: 'walletFinder.features.multiAccount', message: 'Multi-Account'}),
    description: translate({id: 'walletFinder.features.multiAccount.desc', message: 'Manage multiple accounts in one wallet'}),
  },
  dex: {
    label: translate({id: 'walletFinder.features.dex', message: 'DEX Integration'}),
    description: translate({id: 'walletFinder.features.dex.desc', message: 'Built-in token swaps'}),
  },
  governance: {
    label: translate({id: 'walletFinder.features.governance', message: 'Governance'}),
    description: translate({id: 'walletFinder.features.governance.desc', message: 'Participate in on-chain voting'}),
  },
  "qr-claim": {
    label: translate({id: 'walletFinder.features.qrClaim', message: 'QR Claim'}),
    description: translate({id: 'walletFinder.features.qrClaim.desc', message: 'Claim tokens via QR codes or claim links (CIP-0099)'}),
  },
  "easy-setup": {
    label: translate({id: 'walletFinder.features.easySetup', message: 'Easy Setup'}),
    description: translate({id: 'walletFinder.features.easySetup.desc', message: 'Get started quickly with deferred seed backup'}),
  },
};

// Custody type definitions
export const WalletCustodyTypes = {
  "non-custodial": {
    label: translate({id: 'walletFinder.custody.nonCustodial', message: 'Non-Custodial'}),
    description: translate({id: 'walletFinder.custody.nonCustodial.desc', message: 'You control your own keys'}),
  },
  custodial: {
    label: translate({id: 'walletFinder.custody.custodial', message: 'Custodial'}),
    description: translate({id: 'walletFinder.custody.custodial.desc', message: 'A third party manages your keys'}),
  },
};

// Wallet type definitions
export const WalletNodeTypes = {
  light: {
    label: translate({id: 'walletFinder.type.light', message: 'Light Wallet'}),
    description: translate({id: 'walletFinder.type.light.desc', message: 'Connects to the network via a server'}),
  },
  "full-node": {
    label: translate({id: 'walletFinder.type.fullNode', message: 'Full Node'}),
    description: translate({id: 'walletFinder.type.fullNode.desc', message: 'Downloads and verifies the entire blockchain'}),
  },
};

// Export lists for iteration
export const WalletPlatformList = Object.keys(WalletPlatforms);
export const WalletFeatureList = Object.keys(WalletFeatures);
export const WalletCustodyList = Object.keys(WalletCustodyTypes);
export const WalletNodeTypeList = Object.keys(WalletNodeTypes);
