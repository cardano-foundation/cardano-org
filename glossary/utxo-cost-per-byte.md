---
title: UTxO Cost per Byte
slug: utxo-cost-per-byte
short: The protocol parameter that prices each byte of on-chain storage a UTxO occupies, used to derive the minimum ada that must accompany any new output.
category: general
level: intermediate
aliases: ["utxoCostPerByte", "Min UTxO", "Min-Ada"]
mentalModel: "Storage rent paid up front. Sending an output to the chain locks a small amount of ada proportional to its serialized size; that ada is fully returned the moment the output is later spent."
related: [utxo, eutxo, native-token, ada]
---

The minimum-ada rule prevents the ledger from filling up with dust outputs and tiny native-token amounts that would otherwise cost the network more to store than they were worth. Wallets compute the required minimum at transaction-construction time as `(160 + serialized size of the output) × utxoCostPerByte`, where the fixed 160-byte overhead accounts for the transaction input and the output's entry in the UTxO map, then ensure the output carries at least that much ada alongside any tokens.

Because the deposit is refundable on spend, holding many small UTxOs simply ties up ada temporarily rather than burning it.
