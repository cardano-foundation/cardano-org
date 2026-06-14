---
title: CIP-19
slug: cip-19
short: "The specification for how a Cardano address is structured in binary: which network it belongs to, the payment credential, and the optional staking credential."
category: wallets
aliases: ["Cardano Addresses", "Address format"]
mentalModel: "The blueprint for what the bytes inside an address actually mean. Bech32 is the readable wrapper you see; CIP-19 is the structure underneath that says which network, who can spend, and which stake key earns the rewards."
related: [bech32, stake-address, wallet]
sources:
  - title: "CIP-19: Cardano Addresses"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0019"
  - title: "CIP-5: Common Bech32 Prefixes"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0005"
---

CIP-19 defines the byte-level layout of Cardano addresses: a header that encodes the address type and network (mainnet or testnet), followed by a payment credential (a key hash or script hash that controls spending) and, for most everyday addresses, a staking credential that points to the stake key earning rewards. From this it derives the main address types: base addresses (payment plus staking), enterprise addresses (payment only, no staking), pointer addresses, and reward (stake) addresses.

The human-readable strings people copy and paste, with prefixes like `addr1` and `stake1`, are that binary structure encoded in [Bech32](/glossary/bech32/) following the prefixes set out in CIP-5. So CIP-19 and Bech32 work as a pair: CIP-19 says what the address contains, and Bech32 says how to write it down with built-in error detection.
