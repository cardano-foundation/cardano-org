---
title: Tokenized Assets
description: Fractional ownership of real-world assets through tokenization on Cardano
sidebar_label: Tokenized Assets
sidebar_position: 13
---

# Tokenized Assets

## The Challenge

Traditional investment in real-world assets like real estate, art, or commodities requires significant capital and involves complex legal and administrative processes. This excludes most people from wealth-building opportunities that have historically been reserved for the wealthy.

Even for those who can invest, assets are often illiquid, making it difficult to access funds when needed. The overhead of buying, selling, and managing these assets further reduces returns.

## How Blockchain Solves This

Asset tokenization divides ownership of real-world assets into digital tokens that can be easily traded:

- **Fractional ownership**: Own a piece of a building, artwork, or other valuable asset
- **Increased liquidity**: Trade tokens 24/7 on decentralized exchanges
- **Reduced barriers**: Lower minimum investments open opportunities to more people
- **Automated compliance**: Smart contracts can enforce regulatory requirements
- **Transparent ownership**: All ownership records are publicly verifiable

Tokenization can apply to virtually any asset class: real estate, infrastructure, commodities, collectibles, intellectual property, and more.

## Compliance Rules on Token Transfers

Tokenized assets can fall under financial regulation. Depending on the asset and the jurisdiction, their issuers may need to limit transfers to verified investors, or freeze and recover tokens for legal reasons. An ordinary native token cannot enforce this, because once minted it follows whoever controls the address it sits at.

[Programmable tokens](/glossary/programmable-token/) add that layer. They are native tokens that holders can only send when the issuer's transfer rules approve, for example an allowlist of verified holders or a limit per transfer. CIP-113, the proposed standard for them on Cardano, is still under review, and the Cardano Foundation maintains an open-source reference implementation.

What an issuer can do beyond that depends on the scripts the token's registry entry names. Some let authorized parties freeze or seize holdings. A substandard can also limit third-party actions to ones that never reduce a holder's balance. The issuer may be able to swap these scripts later, and the shared contracts can be upgraded by whoever holds the upgrade authority of that deployment. Investors should know who can change the rules before they buy.

## Why Cardano

- **Native tokens** provide efficient, secure asset representation
- **Low transaction fees** make small trades economically viable
- **Regulatory awareness** supports compliant tokenization schemes
- **Smart contract security** through formal verification methods
- **Global accessibility** enables worldwide participation

## Get Started

- [Explore Cardano applications](/apps)
- [Developer resources for building on Cardano](https://developers.cardano.org)
- [Developer guide to programmable tokens](https://developers.cardano.org/docs/developers/curriculum/native-tokens/programmable-tokens/)
- [View Enterprise Solutions](/solutions)
