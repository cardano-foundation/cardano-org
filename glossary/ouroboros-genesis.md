---
title: Ouroboros Genesis
slug: ouroboros-genesis
short: An Ouroboros extension that lets a new node pick the honest chain from genesis using a chain-density rule, without trusting an external checkpoint.
category: consensus
aliases: ["Genesis"]
related: [ouroboros, ouroboros-praos, proof-of-stake, checkpoint]
sources:
  - title: "Ouroboros Genesis: Composable Proof-of-Stake Blockchains with Dynamic Availability"
    url: "https://eprint.iacr.org/2018/378"
  - title: "cardano-node mainnet configuration (ConsensusMode)"
    url: "https://github.com/IntersectMBO/cardano-node/blob/master/configuration/cardano/mainnet-config.yaml"
---

Genesis adds a density-based chain selection rule so a brand-new node can sync from the genesis block and converge on the honest chain even if adversaries flood it with alternative histories. It is implemented in cardano-node and is the default consensus mode on the Preview and Preprod testnets.

On mainnet the node still defaults to [Praos](/glossary/ouroboros-praos); Genesis is opt-in via configuration. See the [Ouroboros](/glossary/ouroboros) entry for how Genesis sits next to Praos, Peras and Leios in the protocol family.
