---
title: Genesis Keys
slug: genesis-keys
short: The seven cryptographic keys created at Cardano's launch that signed every block during the federated Byron era and gradually yielded block production through Shelley.
category: consensus
related: [byron, ouroboros, genesis-block, d-parameter]
---

The seven cryptographic keys minted at the launch of Cardano and distributed across the three genesis entities: three to Input Output, two to the Cardano Foundation, and two to EMURGO. During the federated Byron era these keys signed every block; as the `d` protocol parameter declined through Shelley, block production shifted to community stake pools.

`d` reached 0 on March 31, 2021, leaving block production fully in community hands. The Genesis Keys still held a federated governance role after that: under a 5-of-7 threshold across the three genesis entities, they were the only keys that could submit protocol-parameter updates and initiate hard forks. That last role ended when the Chang hard fork started the Conway era; the keys were burned on August 30, 2024, and on-chain CIP-1694 governance replaced them.
