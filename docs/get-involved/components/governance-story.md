---
title: Governance Story
description: A scrollytelling explainer of Cardano governance. A canvas behind the chapter cards redraws itself as each chapter scrolls into view.
---

## GovernanceStory

The explainer on [How Cardano decides](/governance/how-it-works). Six chapters scroll over a canvas that redraws itself for each chapter: your vote, the three groups, proposals, the constitution, the treasury, and your move. Three interactive modules sit between them: who votes on what, a vote simulator that replays real ledger tallies, and a role finder.

The page explains how governance works today. It is not a history of how Cardano got here, so keep new chapters to that scope.

It is a page-level component. It is not meant to be dropped into other pages, and there should be one per page.

## Usage

```jsx
import GovernanceStory, { GovernanceStorySources } from '@site/src/components/GovernanceStory';

<main>
  <GovernanceStory />
  <BoundaryBox>
    <GovernanceStorySources />
  </BoundaryBox>
</main>
```

Neither component takes props.

## How it is built

| File | Purpose |
|------|---------|
| `index.js` | Chapters, sticky chapter bar, chapter dots, and the canvas stage |
| `engine.js` | Canvas engine. One pool of particles is re-targeted into a new picture for each chapter |
| `labels.js` | Every string the canvas draws, as `translate()` calls |
| `epoch.js` | Epoch number and countdown for the chapter bar, computed from the mainnet schedule without a network call |
| `VoteMatrix.js`, `CountSimulator.js`, `RoleFinder.js` | The interactive modules |
| `src/data/governanceStory.js` | Snapshot figures, thresholds, simulator presets, and role finder content |

Each chapter is a `section` with a `data-scene` attribute naming the picture to draw. The pictures are dot art drawn from one pool of particles. In the three groups chapter, each group is a persona: the committee as a panel behind one bench (one figure per seat, from the live committee size), a DRep raising a voting card in front of the people who delegated to them, and a stake pool operator at a laptop cabled to a server rack. The persona shapes are plain functions in `engine.js` (`benchPts`, `drepPts`, `poolPts`) drawn in design units, so they scale to any screen. The engine switches scenes when a chapter card crosses a line in the viewport, and pauses while the story is off screen.

## Data

- The number of active DReps, the committee size, and the treasury balance come live from `data.cardano.org` through `useAccountabilityStats`, with the snapshot as a fallback.
- Everything else is a ledger snapshot. When you refresh it, update `SNAPSHOT` in `src/data/governanceStory.js` and the strings that quote the same figures, and change the epoch and date in the "About the numbers" note.

## Styling

Colors come from design tokens only, including the governance role tokens (`--site-role-*`) and vote tokens (`--site-vote-*`) described in [Design tokens](/docs/get-involved/design-tokens). The canvas reads the same tokens at runtime and redraws when the theme changes. Breakpoints are 996px, 768px, and 480px.

## Accessibility

- The canvas is decorative (`aria-hidden`). The chapter text carries every point the story makes.
- With reduced motion turned on, pictures appear without animation.
- The action type tabs follow the tab pattern with arrow key support. The simulator announces only its outcome through a polite live region, not every slider step.
