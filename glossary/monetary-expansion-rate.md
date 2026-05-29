---
title: Monetary Expansion Rate
slug: monetary-expansion-rate
short: The protocol parameter (often called ρ) that controls what fraction of the remaining ada reserve is released into the reward pot each epoch.
category: consensus
level: intermediate
aliases: ["monetaryExpansion", "Rho", "ρ"]
mentalModel: "The drip rate from the unminted reserve. Every epoch a small slice of the ada that has never circulated joins the epoch's transaction fees in the reward pot; the treasury takes its cut before the rest is paid to stake pools and delegators."
related: [rewards, treasury, treasury-cut, ada]
---

The reserve started at the genesis supply minus the initial circulating ada. Each epoch, the protocol moves `ρ × remaining_reserve` lovelaces into the reward pot, where it joins the transaction fees collected during that epoch. Because the reserve shrinks over time, this reserve-draw component declines geometrically: the network keeps issuing rewards, but at an ever smaller rate.

The treasury cut (`τ`) is taken from this reward pot before the rest is paid to stake pools and delegators.
