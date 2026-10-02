---
slug: 2026-09-25-weekly-development-report
title: "Leios prototype database splits into rollback and settled files"
description: "Endorser Blocks move to the settled file in the background, Lace 2.3 reworks staking and DRep browsing, and Hydra fixes a Mesh SDK deposit lockout."
authors: [iog]
tags: [development]
---

Certified Endorser Blocks move from the rollback file to the settled one in the background, so each database file can live on its own disk, and garbage collection marks rows before deleting them in batches instead of blocking the node. Lace 2.3 shipped reworked staking and DRep browsers with broader hardware wallet support, Hydra fixed a Mesh SDK deposit lockout and replaced 13 slow end-to-end tests with 30 unit tests, and Plutus closed out its September milestones.

<div style={{ textAlign: 'right' }}>
[**Read more**](https://www.essentialcardano.io/development-update/weekly-development-report-2026-09-25)
</div>

![weekly development report banner](./banner.png)
