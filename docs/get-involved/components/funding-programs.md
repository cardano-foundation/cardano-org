---
title: Funding Programs
description: A persona switcher of program cards that open a details dialog, plus the headline stats strip, using the FundingPrograms components.
---

## FundingPrograms

The building blocks of the [grants and funding page](/grants-funding). `FundingPrograms` renders the persona switcher: one tab per group ("I have an idea", "I have a product", "I contribute to open source") above one grid of program cards, with the group's title and one-line intro. Clicking a card's Details button opens the shared [Modal](https://github.com/cardano-foundation/cardano-org/tree/staging/src/components/Modal) with the program's details. `FundingStats` renders the headline figures above it.

All content comes from `src/data/funding.js`; see [Add a funding program](../add-funding-program.md) for the fields.

## Basic Usage

```jsx
import FundingPrograms from '@site/src/components/FundingPrograms';
import FundingStats from '@site/src/components/FundingPrograms/FundingStats';

<FundingStats />
<FundingPrograms />
```

## Props

| Component | Prop | Type | Description |
|-----------|------|------|-------------|
| `FundingPrograms` | none | | The switcher. Groups come from `getFundingGroups()` (tab order, persona label, title, intro), cards from `getProgramsByGroup()`. |
| `FundingStats` | none | | One elevated bar with the figures from `getFundingStats()`. The first carries an info button that opens the "How we count" breakdown in the shared Modal. |
| `ProgramLogo` | `program`, `size` | object, `'card' \| 'dialog'` | Square tile with the program's `logo` (`logoDark` in dark mode) or a monogram fallback. |
| `ProgramCard` | `program` | object | One program: tile and name, status and type tags, tagline, check facts (`audience`, `funding`), and the Details button. |
| `ProgramDetails` | `program` | object | The modal body: pills, run by, description, and the apply button. |

## Status

`describeStatus(program, today, formatDate)` in `src/data/funding.js` is the single place that turns `cadence` and `window` into the pill tone and label. `useFundingStatus(program)` is the only hook: it reads `customFields.BUILD_DATE` (so server and client agree on "today") and the current locale (for the date in "Open until") and calls that function. The components render what they get.

## Anchors

All panels render (`forceRenderTabPanel`), so every program is in the HTML and CSS hides the inactive panels. A URL hash selects a tab: `#accelerators` opens that group, and `#program-<key>` opens the program's group and scrolls to its card.

## Files

| File | Role |
|------|------|
| `src/components/FundingPrograms/index.js` | Persona switcher: tabs, intro, grid, hash handling. |
| `src/components/FundingPrograms/ProgramCard.js` | Card with the Details button. |
| `src/components/FundingPrograms/ProgramDetails.js` | Modal body. |
| `src/components/FundingPrograms/FundingStats.js` | Stats bar with the breakdown dialog. |
| `src/components/FundingPrograms/ProgramLogo.js` | Logo tile with monogram fallback. |
| `src/components/FundingPrograms/useFundingStatus.js` | Build date and locale, then `describeStatus`. |
| `src/components/FundingPrograms/styles.module.css` | Component styles. |
