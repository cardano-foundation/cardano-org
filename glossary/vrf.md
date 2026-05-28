---
title: VRF
slug: vrf
short: A cryptographic function that produces a verifiably random output; Cardano uses it inside Ouroboros to elect each slot's block leader fairly and unpredictably.
category: consensus
level: advanced
aliases: [Verifiable Random Function]
mentalModel: "A sealed envelope only one validator can open. Each stake pool privately checks whether it 'won' the right to produce the next block; everyone else can verify the win later, but no one can predict it in advance."
related: [ouroboros, slot-leader, kes]
---

Because the VRF output is private until revealed, an attacker cannot pre-emptively target the validator who will produce a given block; this is what makes Ouroboros resistant to adaptive-corruption attacks.
