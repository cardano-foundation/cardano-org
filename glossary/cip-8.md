---
title: CIP-8
slug: cip-8
short: "The standard for signing arbitrary data with a wallet key, used to prove control of an address without sending a transaction or paying a fee."
category: wallets
aliases: ["Message Signing", "signData", "COSE signing"]
mentalModel: "Signing a piece of paper to prove it is yours, instead of moving money to prove you can. The wallet signs a message with the same key that controls an address, and anyone can verify it without anything touching the chain."
related: [wallet, cip-30, bech32]
sources:
  - title: "CIP-8: Message Signing"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0008"
---

CIP-8 defines how a Cardano key signs an arbitrary payload using the COSE (CBOR Object Signing and Encryption) format, producing a signature plus the public key needed to verify it. Because no transaction is built and nothing is submitted, message signing costs no fee and never appears on-chain; it simply demonstrates that the signer holds the private key behind a given address.

This is the mechanism behind "sign in with Cardano" logins, ownership checks, and gated access: a service hands the wallet a challenge, the wallet signs it, and the service verifies the result against the claimed address. In practice apps reach CIP-8 through the [CIP-30](/glossary/cip-30/) `signData` method, which implements this signing flow inside the dApp-wallet bridge. It is deliberately distinct from signing a transaction, so approving a login can never move your funds.
