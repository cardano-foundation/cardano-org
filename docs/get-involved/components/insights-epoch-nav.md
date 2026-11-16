---
title: Insights Epoch Nav
description: Step through Cardano epochs with previous and next buttons and jump to a specific epoch using the InsightsEpochNav component on cardano.org.
---

import { useState } from 'react';
import InsightsEpochNav from '@site/src/components/Layout/InsightsEpochNav';

export function EpochNavDemo() {
  const [epoch, setEpoch] = useState(580);
  return (
    <InsightsEpochNav
      displayedEpoch={epoch}
      currentEpochNo={590}
      minEpoch={208}
      onGoEpoch={setEpoch}
    />
  );
}

## InsightsEpochNav

A compact epoch switcher for /insights pages that show data per epoch. It has previous and next buttons around the current epoch number, and a number field with a "Go" button to jump to any epoch in range. On screens up to 768px the field is replaced by a "Jump…" button that opens it on demand.

The component holds no epoch state of its own. The page passes the displayed epoch in and handles the change in `onGoEpoch`, for example by loading the data and updating the URL. `/insights/supply` uses it.

## Basic Usage

```jsx
import InsightsEpochNav from '@site/src/components/Layout/InsightsEpochNav';

<div className="epochNavSticky">
  <InsightsEpochNav
    displayedEpoch={displayedEpoch}
    currentEpochNo={currentEpochNo}
    minEpoch={MIN_EPOCH}
    onGoEpoch={handleGoEpoch}
  />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `displayedEpoch` | `number` | *required* | The epoch the page shows right now. |
| `currentEpochNo` | `number` \| `null` | - | The latest epoch on chain and the upper limit. While it is `null` (still loading), the next button stays disabled and the jump range ends at `displayedEpoch`. |
| `minEpoch` | `number` | *required* | The lowest epoch the page has data for. |
| `onGoEpoch` | `(epoch: number) => void` | *required* | Called with the target epoch when the reader steps or jumps. Jumping to the displayed epoch does not call it. |

## Live Preview

<EpochNavDemo />

## Behavior

- The jump field accepts only epochs between `minEpoch` and the latest epoch. Out of range input disables "Go" and shows the allowed range.
- Enter in the field jumps, Escape closes the mobile jump row.
- The epoch number is announced to screen readers when it changes (`aria-live="polite"`).

## Styling

- The styles live in the global `nav.css` next to the component, so the class names are not hashed.
- Wrap the component in an element with the class `epochNavSticky` to pin it below the navbar as a rounded bar. On mobile that wrapper turns it into a floating bar at the bottom of the screen.

## Translation

The tooltips, the jump field label, and the range hint are translated with IDs under `insightsEpochNav.*`.

## Related components

- [Insights Layout](./insights-layout.md): the page shell for /insights pages.
