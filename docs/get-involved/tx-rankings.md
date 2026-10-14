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
- The [CIP-0010 registry](https://github.com/cardano-foundation/CIPs/blob/master/CIP-0010/registry.json), used to verify which transaction metadata labels are registered standards.
- Script hashes, mapped to applications using curated registries:
  - The [CRFA off-chain data registry](https://github.com/mezuny/crfa-offchain-data-registry)
  - The [Cardano contracts registry](https://github.com/StricaHQ/cardano-contracts-registry) maintained by StricaHQ
  - The [Eternl script registry](https://github.com/Tastenkunst/eternl-cardano-registry)

By combining these sources, we can more reliably attribute transactions to specific applications and calculate relative activity levels.

### The ranking script

The rankings are produced by an open-source script: [cardano-foundation/tx-leaderboard-script](https://github.com/cardano-foundation/tx-leaderboard-script).

It connects to a Cardano [db-sync](https://github.com/IntersectMBO/cardano-db-sync) database, reads the latest fully completed epochs, and combines the on-chain data with the registries listed above. Each run emits two reports:
- A 30-day window (6 epochs)
- A 1-year window (73 epochs)

These reports are committed to this repository as `src/data/tx-stats.json` and `src/data/tx-stats-73epochs.json`, which power the leaderboard's 30-day and 1-year toggle.

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

There are three paths to appear on the leaderboard, depending on how your project uses the Cardano blockchain.

### Path 1: App Tracking (Smart Contracts / Script Hashes)

If your project deploys smart contracts on Cardano, your transactions are attributed via script hashes mapped through curated registries ([CRFA](https://github.com/mezuny/crfa-offchain-data-registry), [StricaHQ](https://github.com/StricaHQ/cardano-contracts-registry), [Eternl](https://github.com/Tastenkunst/eternl-cardano-registry)).

To appear on the leaderboard with your app's icon and details:

1. Add your application to `src/data/apps.js` (see [Add your Application](/docs/get-involved/add-app))
2. Include a `statsLabel` field in your entry that matches your `label` in the stats data
3. The matching logic (`src/utils/appStats.js`) resolves in this order:
   1. An exact match of `statsLabel` against the `label` values in `appStats`
   2. If that finds nothing and the entry has a `metadataLabel` (set by maintainers, see Path 2), the entry for that label in `metadataLabelStats`. Nothing else is tried after this step
   3. Otherwise the normalized title: lowercased, whitespace removed, a trailing `dex` stripped (so `Minswap Dex` becomes `minswap`), matched against `appStats`

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

A metadata label counts as verified when it is registered in the [CIP-0010 registry](https://github.com/cardano-foundation/CIPs/blob/master/CIP-0010/registry.json). There is no fixed list: every registered label that carried transactions in the reporting window appears in `metadataLabelStats` with `verified: true`, and the leaderboard shows the verified ones. A label with no activity in the last 30 days is absent from `src/data/tx-stats.json` but can still be in the 1-year file `src/data/tx-stats-73epochs.json`. Examples of verified labels in the current reports:

| Label | Standard | Category on the leaderboard | In the current 30-day file |
|-------|----------|-----------------------------|----------------------------|
| 674 | CIP-20 Transaction Messages | none, shown as "Not Listed" | yes |
| 721 | CIP-25 NFT Token Standard | Minting | yes |
| 777 | CIP-27 Royalties Standard | Minting | yes |
| 1694 | Voltaire Governance | Governance | yes |
| 3692 | CIP-149 DRep Compensation | Governance | yes |
| 61284, 61285, 61286 | CIP-15 Catalyst Registration, Witness, Deregistration | Governance (grouped as Catalyst Voting) | 61284 and 61285 |
| 94 | CIP-94 On-chain Governance Polls | Governance | no, 1-year file only |
| 87, 88 | Milkomeda Protocol and Sidechain | Bridge (grouped as Milkomeda Bridge) | no, 1-year file only |
| 1226 | Oracle Metadata | Oracle | no, 1-year file only |

Project-specific registered labels (for example 8413 CommitProof, 544 TapDano) are tracked the same way. The display names and categories come from the `metadataInfo` table in `src/pages/apps/leaderboard.js`, an unlisted label falls back to the first part of its CIP-0010 description.

### Path 3: CIP-20 Message Allowlist (for apps without smart contracts)

This path is **only for apps whose sole on-chain identifier is a CIP-20 (label 674) message** - for example tools built around certificates plus a message, with no Plutus scripts to register. If you have contracts, use Path 1 instead; it is more complete.

You get per-app attribution by adding an entry to the curated allowlist `data/cip20_apps.json` in the [tx-leaderboard-script](https://github.com/cardano-foundation/tx-leaderboard-script) repository **via a pull request**. Each entry maps a message pattern to your app:

```json
{
  "label": "unfrack.it",
  "displayName": "Unfrack.it",
  "match": ["unfrack"],
  "matchType": "substring"
}
```

- **`label`** - a stable identifier (lowercase). Used as the appStats label, so it can also be your `statsLabel` in `src/data/apps.js`.
- **`displayName`** - the name shown on the leaderboard.
- **`match`** - one or more patterns to look for in your transaction message. A pattern must appear **verbatim** in the message exactly as your app writes it on-chain. Matching is case-insensitive but otherwise literal, so include any punctuation the message contains. Example: unfrack.it tags transactions with `https://unfrack.it`, so `unfrack` or `unfrack.it` both work, but `unfrack it` does not.
- **`matchType`** - `substring` matches when the pattern appears anywhere in the message (use this for a stable tag, e.g. messages like `[adalink] ...` with pattern `adalink`). `exact` matches only when the whole message equals the pattern.

Guidelines for acceptance:
- Pick a pattern distinctive to your app. Generic words like `cardano` or `swap` will be rejected - they would falsely match unrelated transactions.
- Confirm your transactions actually carry the tag, and that it does not collide with another listed app.
- This list is intentionally limited to contract-less apps. Apps with scripts should use Path 1.

## Appearing on the Leaderboard Without an Apps Directory Listing

Not every project with real on-chain activity belongs in the [apps directory](/apps), for example B2B or enterprise solutions without a public app, their own chains or protocols, and bridges. Once such a project is tracked, it shows up on the leaderboard anyway, but as a gray "Not Listed" row without a logo and without a link.

These projects can add a logo, a category, and a link to their official website by opening a pull request that adds an entry to `src/data/leaderboard-unlisted.js`:

```js
"example-protocol": {
  icon: "/img/app-icons/example-protocol.svg",
  category: "bridge",
  website: "https://example.org",
},
```

- **The key** is the exact `label` of your project's entry in the `appStats` array of `src/data/tx-stats.json` (or `src/data/tx-stats-73epochs.json`).
- **`icon`** is a square logo that you add to `static/img/app-icons/` in the same pull request, as SVG or as PNG/WebP of at least 128x128 px.
- **`category`** is a category id from `Categories` in `src/data/apps.js`.
- **`website`** is the official website of your project as an absolute HTTP or HTTPS URL. Affiliate, referral, and campaign links are not accepted.

All three fields are optional. Without `category` the row still shows "Not Listed", without `website` it is not clickable. The build checks every entry and fails with a clear message on an unknown field or category, an invalid URL, or a project that is already listed in the apps directory.

Before you open a pull request, keep in mind:

- **The apps directory comes first.** If your project fits there, [add your application](/docs/get-involved/add-app) instead. A directory listing links the leaderboard row to your app page.
- **Your project must already be tracked** via Path 1 or Path 3. An entry in this file changes how an already tracked project is displayed. It does not add the project to the leaderboard.
- **Metadata labels (Path 2) are not covered.** A metadata label row gets a logo and a link only from an `apps.js` entry that sets `metadataLabel` to that label. A project tracked through its own metadata label but not listed in the apps directory currently has no way to add a logo or link, and the build rejects `metadata-` keys in this file.
- **You get less than a directory listing:** a logo, a category, and a link on the leaderboard, but no app page, no place in the apps directory, and no activity badge there.
- **This is not a way back into the directory.** Projects removed under the [curation policy](/docs/get-involved/apps-curation-policy) do not get an entry here. Their transactions keep counting as a "Not Listed" row.
- Maintainers accept entries at their discretion and may remove them later, for example when the website is gone or the project has shut down.

## How It All Connects

The data flow from blockchain to leaderboard:

1. **On-chain transactions** are processed by the [tx-leaderboard-script](https://github.com/cardano-foundation/tx-leaderboard-script) pipeline
2. The pipeline produces `tx-stats.json` (30-day) and `tx-stats-73epochs.json` (1-year), each containing two arrays:
   - `appStats`: transactions attributed to applications via script hashes
   - `metadataLabelStats`: transactions using registered metadata labels
3. The **leaderboard page** merges both arrays (verified metadata only) and ranks everything by transaction count
4. `appStats` entries are matched to `src/data/apps.js` via the `statsLabel` field or the normalized app title to display icons and categories. The leaderboard row links to the app's page in the [apps directory](/apps)
5. `metadataLabelStats` entries are verified against the CIP-0010 registry. Known labels use the names and categories configured on the leaderboard, other labels use the first part of their CIP-0010 description, or `Label <number>` if there is none. Some labels are combined into grouped rows (for example Catalyst Voting). An entry in `apps.js` that sets `metadataLabel` is linked from that label's row, so the row shows the app's icon and links to its page in the apps directory

`appStats` entries without an apps directory match can get a logo, a category, and a website link from `src/data/leaderboard-unlisted.js` (see [Appearing on the Leaderboard Without an Apps Directory Listing](#appearing-on-the-leaderboard-without-an-apps-directory-listing)). Without a category they show "Not Listed", without a website they are not clickable.

Both types of entries are ranked together in a single unified leaderboard, giving a complete picture of what is driving on-chain activity on Cardano.

*For questions or to request tracking for your project, please reach out via [GitHub Issues](https://github.com/cardano-foundation/cardano-org/issues).*
