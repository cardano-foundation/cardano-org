---
title: d parameter
slug: d-parameter
short: The Shelley-era protocol parameter that controlled the share of blocks produced by federated genesis nodes versus community stake pools.
category: consensus
level: advanced
aliases: ["Decentralization Parameter", "d"]
related: [genesis-keys, byron, shelley, vasil, stake-pool]
---

A protocol parameter from the Shelley era written `d` that determined how block production was split between the federated nodes run by the genesis entities and the growing set of community stake pools.

`d` was introduced at the Shelley hard fork (July 2020) with an initial value of 1.0 (fully federated), declined incrementally as decentralization progressed, and reached 0 on March 31, 2021, leaving block production entirely in the hands of community SPOs. The parameter was removed from the protocol at the Vasil hard fork once the federation no longer played any role in producing blocks.
