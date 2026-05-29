---
title: Treasury Cut
slug: treasury-cut
short: The protocol parameter (often called τ) that decides what fraction of each epoch's reward pot is moved to the on-chain treasury before the remainder is paid to stake pools and delegators.
category: consensus
level: intermediate
aliases: ["treasuryCut", "Tau", "τ"]
mentalModel: "A standing tax on block rewards that funds the community piggy bank. A fixed share of every epoch's reward pot is automatically routed to the treasury before delegators see their cut."
related: [rewards, treasury, monetary-expansion-rate, treasury-withdrawal]
---

The mainnet value has been `0.20` (20%) since Shelley. Together with the monetary expansion rate, the treasury cut decides the long-run balance between user-facing staking rewards and on-chain treasury accumulation.

The treasury can only be spent through a [treasury withdrawal](/glossary/treasury-withdrawal) governance action.
