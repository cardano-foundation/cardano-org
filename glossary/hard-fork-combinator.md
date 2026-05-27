---
title: Hard Fork Combinator
slug: hard-fork-combinator
short: Cardano's mechanism for stitching protocol era transitions onto a single live chain without splitting it.
category: network
aliases: [HFC]
related: [hard-fork, byron, shelley, goguen, voltaire]
---

A piece of Cardano's consensus design that lets the protocol's rule set switch — for example from the Byron rules to the Shelley rules — while the underlying chain keeps growing as one. Older blocks remain valid in the new era's view of the world, and the network does not need to be paused or split to enable the change.

The combinator is what makes hard forks on Cardano feel like seamless upgrades rather than coordinated chain-restart events.
