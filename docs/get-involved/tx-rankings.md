---
title: Transaction Rankings
description: How transaction rankings on the cardano.org apps page work, where the data comes from, and how an app maps to its statsLabel.
---

## Transaction Rankings

## Overview

Some applications and on-chain standards listed on cardano.org are ranked according to their on-chain transaction activity. This ranking is purely data-driven and is intended to help users discover applications and protocols that are currently seeing meaningful real-world usage within the Cardano ecosystem.

### Methodology

To determine transaction activity, we aggregate and correlate multiple on-chain and off-chain data sources, including:
- Transaction labels, used to associate transactions with known applications or use cases.
- Script hashes, mapped to applications using curated registries:
- The CRFA off-chain data registry
https://github.com/mezuny/crfa-offchain-data-registry
- The Cardano contracts registry maintained by StricaHQ
https://github.com/StricaHQ/cardano-contracts-registry

By combining these sources, we can more reliably attribute transactions to specific applications and calculate relative activity levels.

### Important notes
- Rankings reflect usage activity, not endorsement, code quality, security, or governance maturity.
- Data quality depends on the completeness and accuracy of available labels and registries; unlabelled or newly deployed contracts may be underrepresented.
- Rankings are periodically updated as new on-chain data becomes available. (currently not real time)

This approach aims to balance transparency, reproducibility, and practical usefulness for users exploring the Cardano application ecosystem.

## Current Implementation

Transaction-based rankings are currently displayed on:
- **[Leaderboard](/apps/leaderboard)** - unified ranking of apps and on-chain metadata standards by transaction volume, with 30-day and 1-year period toggle
- **[AppGrid Component](/docs/get-involved/components/app-grid)** - on the [Where to get ada](/where-to-get-ada#exchanges) page
- **[AppList Component](/docs/get-involved/components/app-list#all-apps-no-filter)**

Apps with transaction data show:
- Total transaction count for the selected period
- Ranking position within their category e.g., #1, #2, #3 (optional)
- Gold badges for top 3 positions (optional)

## Important Notes

:::caution Not All Apps Are Tracked Yet
Not all applications' transactions are currently being tracked. If your app is not ranked or shows lower numbers than expected, your transactions may not be identifiable on-chain yet.
:::

## How to Get Your Transactions Tracked

There are two paths to appear on the leaderboard, depending on how your project uses the Cardano blockchain.

### Path 1: App Tracking (Smart Contracts / Script Hashes)

If your project deploys smart contracts on Cardano, your transactions are attributed via script hashes mapped through curated registries ([CRFA](https://github.com/mezuny/crfa-offchain-data-registry), [StricaHQ](https://github.com/StricaHQ/cardano-contracts-registry)).

To appear on the leaderboard with your app's icon and details:

1. Add your application to `src/data/apps.js` (see [Add your Application](/docs/get-involved/add-app))
2. Include a `statsLabel` field in your entry that matches your `label` in the stats data
3. The matching logic checks for an exact match on `statsLabel`, with a fallback to normalized title matching

Example:
```javascript
{
  title: "Your Project",
  statsLabel: "yourproject",  // must match the label in tx-stats.json
  // ... other fields
}
```

### Path 2: Metadata-Based Tracking (CIP-20 and Other CIPs)

Cardano transactions can carry structured metadata using numeric labels. Transactions using verified metadata labels are automatically tracked and ranked on the leaderboard alongside apps.

**CIP-20 Transaction Messages** is the most widely used metadata standard. It allows attaching human-readable messages to any Cardano transaction using metadata label `674`.

JSON format:
```json
{
  "674": {
    "msg": [
      "Your message here (max 64 bytes per string)"
    ]
  }
}
```

Key details:
- Each string in the `msg` array is limited to 64 bytes
- Multiple strings are concatenated for display
- Messages are stored permanently on-chain
- See the official spec: [CIP-20 - Transaction message/comment metadata](https://cips.cardano.org/cip/CIP-20)

**Other verified metadata standards** that are automatically tracked include:

| Label | Standard | Category |
|-------|----------|----------|
| 674 | CIP-20 Transaction Messages | General |
| 721 | CIP-25 NFT Token Standard | Minting |
| 777 | CIP-27 Royalties Standard | Minting |
| 94 | CIP-94 Governance Polls | Governance |
| 1694 | Voltaire Governance | Governance |
| 61284 | CIP-15 Catalyst Registration | Governance |
| 61285 | CIP-15 Catalyst Witness | Governance |
| 87/88 | Milkomeda Protocol | Bridge |
| 1226 | Oracle Metadata | Oracle |

## How It All Connects

The data flow from blockchain to leaderboard:

1. **On-chain transactions** are processed by the stats pipeline
2. The pipeline produces `tx-stats.json` containing two arrays:
   - `appStats` — transactions attributed to applications via script hashes
   - `metadataLabelStats` — transactions using registered metadata labels
3. The **leaderboard page** merges both arrays (verified metadata only) and ranks everything by transaction count
4. `appStats` entries are matched to `src/data/apps.js` via the `statsLabel` field to display icons, descriptions, and website links
5. `metadataLabelStats` entries are shown with their CIP description and mapped to existing categories (Governance, Bridge, Minting, etc.)

Both types of entries are ranked together in a single unified leaderboard, giving a complete picture of what is driving on-chain activity on Cardano.

*For questions or to request tracking for your project, please reach out via [GitHub Issues](https://github.com/cardano-foundation/cardano-org/issues).*
