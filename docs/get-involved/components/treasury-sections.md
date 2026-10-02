---
title: Treasury Sections
description: Building blocks for the treasury explainer and the treasury insights page on cardano.org, their data sources and how pages combine them.
---

## Treasury sections

The treasury explainer (`/governance/treasury`) and the treasury insights page (`/insights/treasury`) share a set of section components. Each component renders only its figures, list or charts. The page around it provides the section heading, the explanatory text and any links, so the same block can sit on both pages with different context.

All live components need the browser. Load them with `React.lazy` and wrap them in `ClientOnly` from `src/components/TreasurySections/ClientOnly.js`, which combines `BrowserOnly`, `Suspense` and a fallback with a fixed `minHeight`. They share one request per Koios endpoint, no matter how many of them are on the page.

| Component | Path | Data | Used on |
|-----------|------|------|---------|
| `TreasuryFunded` | `src/components/TreasurySections/TreasuryFunded.js` | Koios `/proposal_list` (enacted treasury withdrawals), the 12-month line uses the current epoch from the clock | `/governance/treasury` |
| `TreasuryFlows` | `src/components/TreasurySections/TreasuryFlows.js` | Koios `/totals` and `/proposal_list`, donation snapshot | `/insights/treasury` |
| `TreasuryIncome` | `src/components/TreasurySections/TreasuryIncome.js` | Koios `/totals` | `/insights/treasury` |
| `TreasuryOutlook` | `src/components/TreasurySections/TreasuryOutlook.js` | Koios `/totals` | `/insights/treasury` |
| `TreasuryDonations` | `src/components/TreasuryDonations/index.js` | `src/data/treasury-donations.json` (static, no request) | `/insights/treasury` |
| `DonateSection` | `src/components/TreasuryDonations/DonateSection.js` | none, loads the wallet tool on demand | `/governance/treasury` |

## Basic usage

From `src/pages/insights/treasury/index.js`:

```jsx
import ClientOnly from "@site/src/components/TreasurySections/ClientOnly";

const TreasuryFlows = lazy(() => import("@site/src/components/TreasurySections/TreasuryFlows"));

<section id="flows">
  <Heading as="h2">Balance and flows over the last 12 months</Heading>
  <ClientOnly minHeight={220}>
    <TreasuryFlows />
  </ClientOnly>
</section>
```

`minHeight` reserves space while the data loads, so the page moves less when the figures appear.

## Props

| Component | Prop | Type | Description |
|-----------|------|------|-------------|
| `DonateSection` | `anchorId` | `string` | Anchor id of the donation section. A link to `#<anchorId>` opens the closed wallet form. The page uses the same id for its `Divider`. |

The other components take no props.

## Data and maintenance

- Math lives in `src/utils/insights/treasuryMath.mjs` and is tested with `yarn test:treasury-math`.
- The donation snapshot comes from `yarn update-treasury-donations`. Run it together with the transaction stats update, ideally every epoch. If it falls behind, the insights page shows the donation total with "up to epoch" in its label.
- A failed request shows a short notice with a link to the supply insights inside the affected section only.

There is no live preview here because the components load live on-chain data.
