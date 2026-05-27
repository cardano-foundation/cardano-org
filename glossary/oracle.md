---
title: oracle
slug: oracle
short: A trusted feed that brings off-chain information onto the blockchain so smart contracts can react to it.
category: smart-contracts
aliases: ["Price Oracle", "Data Oracle"]
related: [smart-contract, dapp]
---

A service that publishes off-chain information — exchange rates, weather, sports results, real-world identity attestations — onto the blockchain in a form smart contracts can consume. Without oracles, on-chain code only sees on-chain data; with them, it can react to the real world.

Because contracts trust the oracle's output blindly, oracle design matters: most production oracles aggregate multiple independent data sources to reduce the risk of a single bad feed corrupting downstream contracts.
