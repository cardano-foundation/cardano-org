---
title: CIP-99
slug: cip-99
short: "A standard claim flow that lets newcomers receive ada or tokens at a real-world event by scanning a QR code with their wallet, replacing paper wallets."
category: wallets
aliases: ["Proof of Onboarding"]
mentalModel: "A vending-machine moment for onboarding. Instead of handing someone a printed paper wallet at a booth, you show a QR code; they scan it with a supporting wallet and the assets land in an address they already control."
related: [wallet, ada, native-token]
sources:
  - title: "CIP-99: Proof of Onboarding"
    url: "https://github.com/cardano-foundation/CIPs/tree/master/CIP-0099"
---

CIP-99 standardizes how a project distributes ada or native tokens to users at events and campaigns without the friction of paper wallets. It extends the Cardano URI scheme with a `web+cardano://claim/v1` form that carries a faucet URL and a claim code, and it defines the request and response format, including status codes for success, queuing, and errors, that a wallet and the project's server use to complete the transfer. The "proof of onboarding" name comes from the fact that the flow also lets organizers measure how many people actually claimed.

For the recipient the experience is a single scan: a supporting wallet reads the QR code, talks to the faucet, and deposits the assets into an address the user already holds, so there is no seed phrase to transcribe and no separate paper wallet to import later. Wallet support is what makes the standard usable in the field; Eternl and VESPR implemented the claim flow early, and Lace now supports it as well.
