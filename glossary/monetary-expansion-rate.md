---
title: Monetary Expansion Rate
slug: monetary-expansion-rate
short: The protocol parameter (often called ρ) that controls what fraction of the remaining ada reserve is released into the reward pot each epoch.
category: consensus
level: intermediate
aliases: ["monetaryExpansion", "Rho", "ρ"]
mentalModel: "The drip rate from the unminted reserve. Every epoch, a small slice of the ada that has never circulated moves into the reward pot; what is left there is split between stake pool rewards and the treasury before payout."
related: [rewards, treasury, treasury-cut, ada]
---

The reserve started at the genesis supply minus the initial circulating ada. Each epoch, the protocol moves `ρ × remaining_reserve` lovelaces into the reward pot. Because the reserve shrinks over time, the absolute amount released per epoch declines geometrically: the network keeps issuing rewards, but at an ever smaller rate.

The treasury cut (`τ`) is taken from this reward pot before the rest is paid to stake pools and delegators.
