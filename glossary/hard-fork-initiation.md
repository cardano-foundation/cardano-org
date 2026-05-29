---
title: Hard Fork Initiation
slug: hard-fork-initiation
short: A CIP-1694 governance action type that schedules and triggers a Cardano hard fork by on-chain vote.
category: governance
aliases: ["Hard Fork Action"]
link: /governance
related: [governance-action, hard-fork, cip-1694, drep, chang]
---

A governance action type that proposes scheduling a hard fork at a specific epoch. Like other Conway actions it goes through DRep, Constitutional Committee, and stake pool operator voting; once it passes, the protocol switches to the new major version at the chosen epoch, provided node operators have already installed the required software upgrade beforehand.

Hard fork initiations were among the first action types enabled by the Chang hard fork in September 2024, making Cardano one of the first blockchains where protocol upgrades themselves are governed on-chain rather than by founder decree.
