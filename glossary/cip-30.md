---
title: CIP-30
slug: cip-30
short: "The standard that lets a website talk to a browser-extension wallet, so dApps can request addresses, ask the wallet to sign a transaction, and submit it, all without handling the user's keys."
category: wallets
aliases: ["dApp-Wallet Web Bridge", "Wallet Connector", "window.cardano"]
mentalModel: "The handshake every Cardano dApp uses to reach your wallet. The page asks for permission, the wallet exposes a small set of functions, and from then on the dApp can read your addresses and request signatures, but the private keys never leave the wallet."
related: [wallet, dapp, cip, cip-8, stake-address]
sources:
  - title: "CIP-30: Cardano dApp-Wallet Web Bridge"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030"
  - title: "CIP-95: Web-Wallet Bridge, Conway ledger era"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0095"
---

CIP-30 defines the JavaScript interface a wallet injects into the page as `window.cardano.<walletName>`. After the user approves a connection through `enable()`, the dApp can call a fixed set of methods: read used and unused addresses, fetch the network id, query balances and UTxOs, ask the wallet to sign a transaction (`signTx`) or arbitrary data (`signData`), and submit a finished transaction (`submitTx`). Because the wallet performs every signature internally, the website never sees the seed phrase or private keys.

Almost every "Connect Wallet" button in the Cardano ecosystem speaks CIP-30, which is what lets the same dApp work with Eternl, Lace, VESPR, Typhon and others without custom integrations. CIP-95 extends the same bridge for the Conway era so wallets can also expose governance data and sign DRep registration and votes. When you build a transaction flow, always compare the wallet's reported network id against the network your app expects before signing, so a user on the wrong network gets a clear message instead of a cryptic failure.
