---
slug: 2026-07-16-introducing-the-cans-protocol
title: "Introducing the CANS protocol: unlocking Bitcoin liquidity for Cardano DeFi"
description: "Input Output's Cyclic Atomic N-party Swap protocol enables trustless cross-chain asset exchanges without bridges, wrapped tokens, or custodians, with a mathematical guarantee that every party receives funds or none do."
authors: [iog]
tags: [interoperability]
---

Input Output's Cyclic Atomic N-party Swap (CANS) protocol arranges participants in a ring where each sends assets once and receives once, with the entire swap enforced as atomic: either everyone gets what they agreed to, or nobody loses anything. The design removes the need for bridges, wrapped tokens, or trusted intermediaries by making signatures conditionally valid behind a shared secret revealed only once every party has locked funds. A reference implementation in Rust, formally verified with up to 20 concurrent parties, shows the approach works in practice today, and any chain with native or verifiable Schnorr signatures can join a swap session.

<div style={{ textAlign: 'right' }}>
 [**Read more**](https://www.iog.io/news/introducing-the-cans-protocol)
</div>

![introducing the cans protocol](./banner.jpg)
