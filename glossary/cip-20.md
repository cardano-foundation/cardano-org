---
title: CIP-20
slug: cip-20
short: "A standard place to attach a short human-readable message to a transaction, so a memo, note, or comment travels with the payment on-chain."
category: general
aliases: ["Transaction message metadata", "674 metadata", "Transaction comment"]
mentalModel: "The memo field for a Cardano transaction. The ledger ignores it, but wallets, explorers, and exchanges know to look for it, so it is the agreed way to leave a readable note alongside a payment."
related: [api, cip, native-token]
sources:
  - title: "CIP-20: Transaction message/comment metadata"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0020"
---

CIP-20 reserves the transaction metadata label `674` for a `msg` field: an array of UTF-8 strings, each at most 64 bytes, that together form a human-readable message. Splitting the text into 64-byte chunks works around the protocol's per-string metadata limit, and a reader simply joins the pieces back together. The content is purely informational; the ledger never validates or acts on it.

It is the convention exchanges, donation flows, and dApps use to label what a payment is for, and explorers and wallets display it automatically. Note that label `674` is also where the aggregate transaction-message convention lives, so when you tag a transaction's purpose for analytics you attach a specific application label rather than overloading `674` itself, keeping the readable memo separate from machine-readable attribution.
