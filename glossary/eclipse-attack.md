---
title: Eclipse Attack
slug: eclipse-attack
short: A network attack where a node is isolated from honest peers and connected only to attacker-controlled nodes.
category: network
level: advanced
related: [proof-of-stake-attacks, ouroboros]
---

A network attack where a node is isolated from honest peers and connected only to attacker-controlled nodes. This prevents the node from seeing the legitimate chain. The node still fully validates everything it receives, but the attacker can feed it a stale or attacker-controlled view of the chain, enabling double-spends or transaction censorship against the victim.
