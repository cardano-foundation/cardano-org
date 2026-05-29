---
title: Stake Address Deposit
slug: stake-address-deposit
short: The refundable amount of ada locked when a wallet registers a stake address so it can delegate or earn rewards, currently 2 ada on mainnet.
category: wallets
level: intermediate
aliases: ["stakeAddressDeposit"]
mentalModel: "A small refundable bond your wallet posts the first time it joins the staking system. The ada comes back to you in full when you deregister the stake address."
related: [stake-address, delegation, wallet]
---

Stake address registration is a one-time setup step that happens automatically the first time you delegate from a new wallet. The deposit discourages registering large numbers of unused stake addresses, which would otherwise inflate the ledger; it is returned in full whenever the address is later deregistered.
