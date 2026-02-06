---
title: Transaction Rankings
---
 
## Transaction Rankings

:::info Work in Progress
This page is currently being developed. Complete documentation will be available soon.
:::

## Overview

Some applications listed on cardano.org are ranked according to their on-chain transaction activity over the last 30 days. This ranking is purely data-driven and is intended to help users discover applications that are currently seeing meaningful real-world usage within the Cardano ecosystem.

### Methodology

To determine transaction activity, we aggregate and correlate multiple on-chain and off-chain data sources, including:
- Transaction labels, used to associate transactions with known applications or use cases.
- Script hashes, mapped to applications using curated registries:
- The CRFA off-chain data registry
https://github.com/mezuny/crfa-offchain-data-registry
- The Cardano contracts registry maintained by StricaHQ
https://github.com/StricaHQ/cardano-contracts-registry

By combining these sources, we can more reliably attribute transactions to specific applications and calculate relative activity levels over a rolling 30-day window.

### Important notes
- Rankings reflect usage activity, not endorsement, code quality, security, or governance maturity.
- Data quality depends on the completeness and accuracy of available labels and registries; unlabelled or newly deployed contracts may be underrepresented.
- Rankings are periodically updated as new on-chain data becomes available. (currently not real time)

This approach aims to balance transparency, reproducibility, and practical usefulness for users exploring the Cardano application ecosystem.

## Current Implementation

Transaction-based rankings are currently displayed on:
- **[AppGrid Component](/docs/get-involved/components/app-grid)** - on the [Where to get ada](/where-to-get-ada#exchanges) page
- **[AppList Component](/docs/get-involved/components/app-list#all-apps-no-filter)** 

Apps with transaction data show:
- Total transaction count for the last 30 days
- Ranking position within their category e.g., #1, #2, #3 (optional)
- Gold badges for top 3 positions (optional)

## Important Notes

:::caution Not All Apps Are Tracked Yet
Not all applications' transactions are currently being tracked. If your app is not ranked or shows lower numbers than expected, your transactions may not be identifiable on-chain yet.
:::

## How to Make Your App's Transactions Identifiable

**Detailed instructions coming soon.**

To ensure your app's transactions are counted and displayed in rankings, they need to be identifiable on-chain. This typically involves using consistent smart contract addresses or transaction patterns that can be tracked. Detailed guidelines on how to structure your transactions for tracking will be published on this page shortly.
 

*For questions or early access to transaction identification guidelines, please reach out via [GitHub Issues](https://github.com/cardano-foundation/cardano-org/issues).*
