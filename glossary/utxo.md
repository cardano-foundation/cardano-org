---
title: UTXO
slug: utxo
short: Unspent Transaction Output, the accounting model Cardano shares with Bitcoin where transactions consume whole earlier outputs and create new ones, similar to spending banknotes and getting change back.
category: general
aliases: [UTxO, Unspent Transaction Output]
mentalModel: "Think of each UTxO as a digital banknote. You can't spend half a $20 bill; you hand over the whole note and receive change back as a new note."
related: [eutxo]
sources:
  - title: "Bitcoin: A Peer-to-Peer Electronic Cash System (Nakamoto, 2008)"
    url: "https://bitcoin.org/bitcoin.pdf"
---

Cardano extends this model with the eUTXO design, which allows outputs to carry script logic and datum alongside the value.
