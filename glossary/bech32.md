---
title: bech32
slug: bech32
short: An address encoding format used for Cardano addresses since the Shelley hard fork.
category: wallets
aliases: [Address, "Cardano Address", "addr1", "stake1"]
mentalModel: "An account number with built-in typo detection. Change one letter by mistake and the address simply rejects itself."
related: [wallet]
sources:
  - title: "CIP-5: Common Bech32 Prefixes"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0005"
  - title: "CIP-19: Cardano Addresses"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0019"
---

An address encoding format used for Cardano addresses since the [Shelley hard fork](/hardforks/). Bech32 provides built-in error detection to protect against accidental misspellings or truncations. Cardano addresses use prefixes like `addr1` for payment addresses and `stake1` for stake addresses. See [CIP-5](https://cips.cardano.org/cip/CIP-5) for common bech32 prefixes and [CIP-19](https://cips.cardano.org/cip/CIP-19) for address structure details.
