---
title: KES
slug: kes
short: Key Evolving Signatures. Block-signing keys that move forward in time to limit the damage of a key compromise.
category: consensus
aliases: ["Key Evolving Signatures", "KES Keys"]
mentalModel: "A one-way ratchet on a signing key. Each period, the key updates so that an older state can no longer be reconstructed; even if today's key leaks, yesterday's blocks remain trustworthy because the earlier key state has been erased."
related: [stake-pool, vrf]
---

Key Evolving Signatures (KES) are the cryptographic keys a stake pool uses to sign the blocks it produces. The keys evolve forward at the start of each KES period; the previous key state is deleted and cannot be recovered. This limits the damage from a compromised hot key: an attacker who steals it can sign only future blocks within the remaining lifetime, never rewrite history.

Operators rotate KES keys periodically to keep them within the protocol's accepted lifetime.
