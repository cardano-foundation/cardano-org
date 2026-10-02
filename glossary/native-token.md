---
title: Native Token
slug: native-token
short: "A token created and managed directly on the Cardano blockchain using its built-in token functionality, without requiring smart contracts."
category: tokens
aliases: ["Native Asset", Token, "Cardano Token"]
mentalModel: "A token treated as a first-class citizen by the protocol, like ada itself. No smart contract is needed between you and the token. Transfers, fees, and accounting use the same machinery the chain uses for ada."
related: [mary, nft, eutxo, policy-id, programmable-token]
---

Introduced in the Mary hard fork. Because native tokens are part of the ledger itself, transfers cost the same as ada transfers and don't depend on a separate smart contract being deployed and audited.

Once minted, an ordinary native token follows whoever controls the address it sits at, and its issuer cannot enforce rules on later transfers. A [programmable token](/glossary/programmable-token/) adds such rules: it is still a native token, but a shared smart contract holds it, transfers have to pass rules set by its issuer, and running those rules adds script fees.
