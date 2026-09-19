---
title: Minimum ada (min-UTxO)
slug: min-ada
short: The minimum amount of ada that must accompany any new transaction output, derived from the output's serialized size to prevent dust in the UTxO set.
category: general
level: beginner
aliases: ["min-UTxO", "minUTxO", "minimum ada", "min lovelace"]
mentalModel: "Rent paid up front for the space your output occupies on the ledger. It is fully returned the moment the output is spent, so it is locked, not lost."
related: [utxo, eutxo, utxo-cost-per-byte, transaction-fee]
sources:
  - title: "CIP-55: Protocol Parameters (Babbage Era)"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0055"
  - title: "Cardano Ledger (IntersectMBO): formal specifications and implementations"
    url: "https://github.com/IntersectMBO/cardano-ledger"
---

Since the Babbage era the minimum ada for an output is `(160 + serialized output size in bytes) × utxoCostPerByte`, where `utxoCostPerByte` (`coinsPerUTxOByte`) is 4,310 lovelace per byte on mainnet. The fixed 160-byte overhead accounts for the transaction input and the output's entry in the UTxO map. A simple ada-only output therefore requires roughly 1 ada; outputs holding native tokens, a script, or an inline datum are larger and require more. The ada is refundable on spend.
