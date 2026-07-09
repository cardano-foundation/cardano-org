---
title: Transaction Fee
slug: transaction-fee
short: The lovelace charged to submit a transaction, calculated from the transaction's serialized size in bytes using two public protocol parameters.
category: general
level: beginner
aliases: ["fee", "tx fee", "min fee", "transaction fee"]
mentalModel: "A postage cost. The bigger the letter (the more bytes your transaction occupies), the more the stamp costs, and the stamp price is published, not auctioned."
related: [utxo, eutxo, utxo-cost-per-byte]
sources:
  - title: "CIP-9: Protocol Parameters (Shelley Era)"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0009"
  - title: "CIP-28: Protocol Parameters (Alonzo Era)"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0028"
---

On Cardano the minimum fee for a transaction is `a + b × size`, where *size* is the transaction's serialized size in bytes. On mainnet, *a* (the fixed component, `minFeeB` / `txFeeFixed`) is 155,381 lovelace and *b* (the per-byte component, `minFeeA` / `txFeePerByte`) is 44 lovelace per byte. Both are protocol parameters and can be changed through governance and parameter updates. Because the size is known before submission, the exact fee is knowable in advance.
