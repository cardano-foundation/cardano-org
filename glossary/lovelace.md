---
title: Lovelace
slug: lovelace
short: The smallest divisible unit of ada. One ada equals 1,000,000 lovelaces.
category: tokens
level: beginner
aliases: [Lovelaces]
mentalModel: "Like cents to a dollar, only finer: one ada splits into a million lovelaces. All on-chain ada amounts are tracked in lovelace; wallet UIs convert to ada for display."
related: [ada]
---

The smallest divisible unit of ada. One ada equals 1,000,000 lovelaces. Named after Ada Lovelace, the same person ada itself is named after, mirroring the satoshi convention from Bitcoin.

On-chain, every ada amount is stored as an integer count of lovelaces: fees, balances, transaction outputs. Native-token quantities are counted separately, in their own units. Wallets and explorers usually display values in ada for readability, but under the hood the protocol always works in whole lovelaces.
