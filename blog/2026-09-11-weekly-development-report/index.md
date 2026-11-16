---
slug: 2026-09-11-weekly-development-report
title: "Leios improves downloads and caching as Plutus merges casing on Data"
description: "Leios download logic now bounds time and memory, adds a transaction cache, fixes node disconnects, and caps mempool ledger reads, while Plutus merges casing on Data and Hydra patches a critical security flaw."
authors: [iog]
tags: [development]
---

The Leios download logic was rewritten to bound time and memory, a transaction cache was added, unwanted node disconnects were fixed, and mempool ledger reads were capped, while ledger state garbage collection was threaded. Plutus merged casing on Data, advanced the keepPolicies and dropPolicies built-ins for the future Dijkstra era, and released Plu-tan 1.0, the static analyzer for Plutus scripts. Hydra shipped 2.4.1, a security release removing an optimized transaction-validation path that could let a malicious participant get invalid transactions into confirmed snapshots.

<div style={{ textAlign: 'right' }}>
[**Read more**](https://www.essentialcardano.io/development-update/weekly-development-report-as-of-2026-09-11)
</div>

![weekly development report banner](./banner.jpg)
