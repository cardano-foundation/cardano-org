---
title: lovelace
slug: lovelace
short: The smallest divisible unit of ada. One ada equals 1,000,000 lovelaces.
category: tokens
aliases: [Lovelaces]
mentalModel: "Like cents to a dollar, only finer: one ada splits into a million lovelaces. All on-chain amounts are tracked in lovelace; wallet UIs convert to ada for display."
related: [ada]
---

The smallest divisible unit of ada. One ada equals 1,000,000 lovelaces. Named after Ada Lovelace, the same person ada itself is named after, mirroring the satoshi convention from Bitcoin.

On-chain, every amount — fees, balances, transaction outputs — is stored as an integer count of lovelaces. Wallets and explorers usually display values in ada for readability, but under the hood the protocol always works in whole lovelaces.
