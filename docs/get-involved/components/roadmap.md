---
title: Roadmap
description: The upcoming-upgrade cards, the history strip, and the phase row of the roadmap page, using the Roadmap components.
---

## Roadmap

The building blocks of the [roadmap](/roadmap). `OutcomeCards` renders the three "What's changing" cards and `ReaderCards` the three "What it means for you" cards, both rows of the shared [RoleCard](./role-card.md). `UpgradeTimeline` renders every upgrade, the ones being built first and then every enacted one newest first, as one card shape in the shared [HorizontalScroller](./horizontal-scroller.md): when, a status pill where it says something, name, era, one sentence, one link. `PhaseStrip` renders the five development phases in one row. The "live today" strip on the page is the shared [StatsBar](./stats-bar.md) with figures derived from the first entries of the data.

All content comes from `src/data/roadmap.js`; see [Update the roadmap](../add-roadmap-entry.md) for the fields.

## Basic Usage

```jsx
import { OutcomeCards, UpgradeTimeline, ReaderCards, PhaseStrip } from '@site/src/components/Roadmap';

<OutcomeCards />
<UpgradeTimeline />
<ReaderCards />
<PhaseStrip />
```

## Exports

| Export | Description |
|--------|-------------|
| `OutcomeCards` | Three `RoleCard`s from `getOutcomes()`. |
| `UpgradeTimeline` | Scroller of cards from `getUpcoming()` then `getUpgrades()`. Cards have the anchors `#upcoming-<key>` and `#upgrade-<key>`, which glossary entries and the phases link to. |
| `ReaderCards` | Three `RoleCard`s from `getReaders()`, each listing one line per upgrade being built from `forReaders`. |
| `PhaseStrip` | One row of five from `getPhases()`, each linking to its glossary entry. |
| `useFormatDate` | Hook returning a function that formats an ISO date for the current locale, used by the timeline and the page's strip. |

## Stage

`describeStage(stage)` in `src/data/roadmap.js` is the single place that turns a card's `stage` into the pill tone and label, the same pattern as `describeStatus` on the grants page. The words match the steps in the page's "How an upgrade happens" section.

## Files

| File | Role |
|------|------|
| `src/components/Roadmap/index.js` | Outcome and reader cards, the timeline, phases, and the date hook. |
| `src/components/Roadmap/styles.module.css` | Tokens only. |
| `src/pages/roadmap.js` | The page: hero, strip, sections, FAQ, CTA. |
| `src/data/roadmap.js` | All content and `describeStage`. |
