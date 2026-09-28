---
title: Governance Story
description: A scrollytelling explainer of Cardano governance. A canvas behind the chapter cards redraws itself as each chapter scrolls into view.
---

## GovernanceStory

The explainer on [How Cardano decides](/governance/how-it-works). A live opening card and 15 chapters scroll over a canvas that redraws itself for each chapter, and four interactive modules sit between them: who votes on what, a vote simulator that replays real ledger tallies, a guardrail check for the treasury cut, and a role finder.

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
| `epoch.js` | Epoch number and countdown, computed from the mainnet schedule without a network call |
| `VoteMatrix.js`, `CountSimulator.js`, `GuardrailCheck.js`, `RoleFinder.js` | The interactive modules |
| `src/data/governanceStory.js` | Snapshot figures, thresholds, simulator presets, and role finder content |

Each chapter is a `section` with a `data-scene` attribute naming the picture to draw. The engine switches scenes when a chapter card crosses a line in the viewport, and pauses while the story is off screen.

## Data

- The number of active DReps, the committee size, and the treasury balance come live from `data.cardano.org` through `useAccountabilityStats`, with the snapshot as a fallback.
- Everything else is a ledger snapshot. When you refresh it, update `SNAPSHOT` in `src/data/governanceStory.js` and the strings that quote the same figures, and change the epoch and date in the "About the numbers" note.

## Styling

Colors come from design tokens only, including the governance role tokens (`--site-role-*`) described in [Design tokens](/docs/get-involved/design-tokens). The canvas reads the same tokens at runtime and redraws when the theme changes. Breakpoints are 996px, 768px, and 480px.

## Accessibility

- The canvas is decorative (`aria-hidden`). The chapter text carries every point the story makes. A few supporting details are only drawn, such as the names of the ten tenets and the dates of the coming epochs.
- With reduced motion turned on, pictures appear without animation.
- The action type tabs follow the tab pattern with arrow key support. The simulator and the guardrail check announce only their outcome through a polite live region, not every slider step.
