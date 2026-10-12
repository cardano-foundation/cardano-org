---
title: CIP-95
slug: cip-95
short: "The Conway-era extension of the CIP-30 wallet bridge, so DApps can read governance data and request signatures for DRep and committee operations."
category: wallets
aliases: ["Web-Wallet Bridge Conway"]
related: [cip-30, cip-1694, drep, wallet, governance-action]
sources:
  - title: "CIP-95: Web-Wallet Bridge - Conway ledger era"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0095"
---

CIP-95 extends [CIP-30](/glossary/cip-30) for the Conway ledger era. After `enable()`, a supporting wallet can expose governance-related methods so a DApp can query DRep status, vote, and related credentials without handling keys itself. Status: Active on [cips.cardano.org](https://cips.cardano.org/cip/CIP-0095).
