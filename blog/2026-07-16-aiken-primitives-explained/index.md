---
slug: 2026-07-16-aiken-primitives-explained
title: "Aiken’s BLS12-381 Primitives Wide Possibilities Explained"
description: "Cardano's Plutus Core ships native BLS12-381 elliptic-curve primitives that let Aiken scripts aggregate signatures, verify zero-knowledge proofs, and build anonymous credentials on-chain without oracles."
authors: [cf]
tags: [development, developers]
---

Cardano's Plutus Core ships first-class built-in primitives for the pairing-friendly BLS12-381 elliptic curve, exposing scalar multiplication, point addition, hash-to-curve, and pairing checks that any Plutus or Aiken script can run natively without external services or trusted oracles. The article walks through the curve and the Aiken API, then builds four concrete protocols on top of those primitives: BLS signature aggregation and multi-sig, key derivation from passwords and seeds, verifiable random functions for privacy and leader selection, and BBS+ signatures for anonymous credentials with selective disclosure. A follow-up will compose the same primitives into zk-SNARKs and polynomial commitment schemes.

<div style={{ textAlign: 'right' }}>
 [**Read more**](https://cardanofoundation.org/blog/aiken-primitives-explained)
</div>

![aiken primitives explained](./banner.jpg)
