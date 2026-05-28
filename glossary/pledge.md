---
title: Pledge
slug: pledge
short: The amount of ada a stake pool operator personally commits to their own pool.
category: consensus
mentalModel: "Skin in the game. By pledging ada, a pool operator signals that they expect their own pool to behave well; the protocol rewards that signal slightly so pools with real commitments stand out from cheap ones."
related: [stake-pool, delegation, a0, k-parameter]
---

The amount of ada a stake pool operator commits to their own pool from their own funds. Pledge is not delegated by others; it stays with the operator. Reward calculations weight pledge through the `a0` parameter, so pools with a meaningful pledge earn slightly more than pools with the same total stake but no operator commitment.
