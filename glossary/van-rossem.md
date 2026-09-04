---
title: van Rossem
slug: van-rossem
short: The Conway-era hard fork on July 18, 2026 (protocol version 11) that added new Plutus builtins and was the first Cardano upgrade ratified entirely through on-chain governance.
category: network
link: /hardforks
aliases: ["van Rossem Hard Fork", "Protocol Version 11"]
related: [hard-fork, hard-fork-initiation, conway-era, chang, plomin, dijkstra, plutus-core, plutus]
sources:
  - title: "Cardano upgrade: van Rossem hard fork (Intersect)"
    url: "https://www.intersectmbo.org/news/cardano-upgrade-van-rossem-hard-fork"
  - title: "Hard fork initiation action gov_action13pzmls..."
    url: "https://proposalexaminer.cardanofoundation.org/proposals/gov_action13pzmlsmmktmfareqpl3gzj9nm63ugwvmp3y7urkjhd8rf89tn6msq95mp3f"
---

The third hard fork of the Conway era, enacted at the start of epoch 644 on July 18, 2026. It moved mainnet from protocol version 10 to 11 without opening a new ledger era, so governance and the ledger rules stayed as Plomin left them. The name honors Max van Rossem, a DRep who helped shape the Cardano Constitution and died in 2025.

The upgrade is a smart contract release. It extends Plutus V3 with new builtins: multi-scalar multiplication on BLS12-381 (CIP-133), a native array type (CIP-138), modular exponentiation (CIP-109), a faster `dropList` (CIP-132) and better handling of multi-asset values (CIP-153). A Plutus cost model update, enacted separately on June 18, 2026, set the prices for the new primitives and lowered the cost of several existing ones.

van Rossem was the first hard fork proposed, debated and ratified entirely through CIP-1694 governance. The [hard fork initiation action](https://proposalexaminer.cardanofoundation.org/proposals/gov_action13pzmlsmmktmfareqpl3gzj9nm63ugwvmp3y7urkjhd8rf89tn6msq95mp3f) passed with 77.6 percent of DRep stake, 52.7 percent of stake pool stake and a Constitutional Committee majority. The next hard fork is [Dijkstra](/glossary/dijkstra), which opens a new ledger era.
