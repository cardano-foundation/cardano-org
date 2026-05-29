---
title: Seed Phrase
slug: seed-phrase
short: A sequence of words, typically 15 or 24 on Cardano (and sometimes 12 or 27), that lets any compatible wallet recover access to your accounts on the blockchain.
category: wallets
level: beginner
aliases: [Mnemonic, "Recovery Phrase", "Mnemonic Phrase", "Backup Phrase"]
mentalModel: "Like signing into your Google account from a new browser brings back your bookmarks: any wallet that knows your seed phrase finds the same accounts on the blockchain."
related: [wallet, spending-password]
---

A sequence of words generated when you first set up a wallet. On Cardano the length depends on the wallet: Yoroi generates 15 words, while Daedalus and Lace generate 24; 12-word phrases come from older or BIP-39-compatible wallets, and Daedalus paper wallets use a 27-word format. It is the master key from which all of the wallet's private keys are derived, and the only thing you need to recover your funds if your device is lost, broken, or wiped.

Anyone who has your seed phrase has full control of your funds. Write it down on paper or stamp it into metal; never store it in a screenshot, cloud document, or anything that syncs online. No legitimate person, app, or support agent will ever ask you to type it or share it.
