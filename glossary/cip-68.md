---
title: CIP-68
slug: cip-68
short: "A token metadata standard that stores an asset's metadata in an on-chain datum a smart contract can read and update, rather than in the frozen transaction metadata used by CIP-25."
category: tokens
level: advanced
aliases: ["Datum Metadata Standard"]
mentalModel: "Metadata that lives where contracts can see it. Instead of a label-721 note locked into the mint transaction, the data sits in a datum on a UTxO, so a validator can read it and, if the design allows, change it later."
related: [datum, native-token, nft, cip-25, reference-input]
sources:
  - title: "CIP-68: Datum Metadata Standard"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0068"
---

CIP-68 splits an asset into a pair that shares one policy id: a reference token (asset-name label `100`) that holds the metadata, and the user-facing token the holder actually owns (`222` for an NFT, `333` for a fungible token, `444` for a rich fungible token). The metadata itself is stored as an inline datum on the UTxO that carries the reference token, so any Plutus script can read it directly on-chain instead of relying on off-chain indexers, which is something [CIP-25](/glossary/cip-25/) metadata cannot offer.

This design makes metadata programmable: because the reference token's datum can be spent and recreated by an authorized transaction, traits can evolve (game items that level up, dynamic art, identity records) while collectors keep holding the same user token. The cost is more moving parts than CIP-25, so simple static collections often still use CIP-25 while projects that need contract-readable or updatable metadata reach for CIP-68.
