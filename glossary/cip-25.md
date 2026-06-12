---
title: CIP-25
slug: cip-25
short: "The convention that tells wallets and marketplaces how to read an NFT's name, image, and attributes from the metadata attached when the token was minted."
category: tokens
aliases: ["NFT Metadata Standard", "721 metadata", "Media NFT Metadata Standard"]
mentalModel: "The agreed JSON shape that turns a raw native token into a recognizable NFT. Without it a token is just a policy id and a name; with it, every wallet and marketplace knows where to find the picture, the title, and the traits."
related: [nft, native-token, policy-id, cip-68]
sources:
  - title: "CIP-25: Media NFT Metadata Standard"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0025"
---

CIP-25 places a JSON document in the minting transaction's metadata under the label `721`, keyed by the token's policy id and asset name. The document carries a `name`, an `image` (usually an `ipfs://` link), an optional `mediaType`, and any number of custom attributes. Because the data is written at mint time as transaction metadata, it is cheap and simple, and it became the de facto way NFTs are described on Cardano.

The trade-off is that the metadata is effectively frozen: it can only change if the policy stays open and the token is re-minted, which most collections deliberately prevent by time-locking the policy. When a project needs metadata that a smart contract can read on-chain or update over time, [CIP-68](/glossary/cip-68/) is the newer alternative that stores the data in a datum instead of in transaction metadata.
