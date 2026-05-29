---
title: Rollback
slug: rollback
short: When a Cardano node reverts the most recent blocks because the network has converged on a different fork.
category: network
related: [block, ouroboros, slot]
---

A rollback happens when a node discovers that the chain it has been following has been overtaken by a longer chain produced by a different fork. The conflicting tip blocks are reverted, and the node switches to the new chain.

Short rollbacks of one or two blocks are normal during high-traffic periods; deeper rollbacks are rare on Cardano because the Ouroboros chain-selection rule converges quickly. Wallets, explorers, and dApp indexers must handle rollbacks gracefully so they never show users transactions that have since been reverted off the chain.
