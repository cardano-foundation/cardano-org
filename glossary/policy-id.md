---
title: policy ID
slug: policy-id
short: The unique on-chain identifier of a native token's minting policy.
category: tokens
aliases: ["Token Policy ID", "Minting Policy ID"]
related: [native-token, nft, mary]
---

The unique identifier of a native token's minting policy on Cardano. Two tokens with the same name but different policy IDs are distinct assets; the policy ID is what guarantees that one issuer's tokens cannot be confused with another's.

Technically the policy ID is the hash of the minting policy script, which defines who can mint or burn tokens of that policy and under what conditions.
