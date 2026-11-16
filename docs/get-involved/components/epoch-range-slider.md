---
title: Epoch Range Slider
description: Let readers pick a range of Cardano epochs with a two-handle slider that remembers the choice, using the EpochRangeSlider component on cardano.org.
---

import { useState } from 'react';
import EpochRangeSlider from '@site/src/components/Layout/EpochRangeSlider';

export function SliderDemo() {
  const [range, setRange] = useState({ start: 560, end: 660 });
  return (
    <EpochRangeSlider
      title="Select Epoch Range"
      min={210}
      max={660}
      start={range.start}
      end={range.end}
      onChange={setRange}
      startLabel="Start:"
      endLabel="End:"
      epochLabel="Epoch"
    >
      <p style={{ margin: 0 }}>Selected {range.end - range.start + 1} epochs.</p>
    </EpochRangeSlider>
  );
}

## EpochRangeSlider

`EpochRangeSlider` shows a box with a two-handle slider that selects a range of epochs, with the first and last epoch and their dates above it. `useEpochRange` keeps the selected range in a cookie, so the reader finds the same range on the next visit. The `/insights/supply/summary` and `/insights/transactions` pages use both.

## When to use

- An /insights page that shows data over a range of epochs.
- To step through single epochs, use [Insights Epoch Nav](./insights-epoch-nav.md).

## Basic Usage

```jsx
import EpochRangeSlider, { useEpochRange } from '@site/src/components/Layout/EpochRangeSlider';
import { MIN_EPOCH } from '@site/src/utils/insights/epochs';
import { translate } from '@docusaurus/Translate';

const [range, setRange] = useEpochRange({ cookieName: 'my_page_epoch_range', min: MIN_EPOCH + 1, max: currentEpochNo });

<EpochRangeSlider
  title={translate({ id: 'myPage.epochSelect.title', message: 'Select Epoch Range' })}
  min={MIN_EPOCH + 1}
  max={currentEpochNo}
  start={range?.start}
  end={range?.end}
  onChange={setRange}
  startLabel={translate({ id: 'myPage.epochSelect.start', message: 'Start:' })}
  endLabel={translate({ id: 'myPage.epochSelect.end', message: 'End:' })}
  epochLabel={translate({ id: 'myPage.epochSelect.epoch', message: 'Epoch' })}
>
  {isLoading && <p>{translate({ id: 'myPage.loading', message: 'Loading data...' })}</p>}
</EpochRangeSlider>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `node` | - | Heading of the box. |
| `min` | `number` | - | Lowest selectable epoch. |
| `max` | `number` | - | Latest epoch. Without it only the title and the children show. |
| `start` | `number` | - | First selected epoch. |
| `end` | `number` | - | Last selected epoch. |
| `onChange` | `({ start, end }) => void` | - | Called while the reader moves a handle. |
| `startLabel` | `node` | - | Label before the first epoch, for example "Start:". |
| `endLabel` | `node` | - | Label before the last epoch, for example "End:". |
| `epochLabel` | `node` | - | Word before the selected epoch numbers. |
| `children` | `node` | - | Status lines below the slider, inside the box. |

## Live Preview

<SliderDemo />

## Remembering the range

`useEpochRange` returns `[range, setRange]`. `range` is `null` until the latest epoch is known, then it holds `{ start, end }`. It reads the cookie once, uses it when it is still valid, and otherwise selects the last 100 epochs. Every change is saved again.

Its options are `cookieName` (one per page), `min`, `max`, `defaultSpan` (epochs selected by default, 100), and `days` (how long the cookie is kept, 1).

## Accessibility

- Each handle is a native range input, so keyboard users move it with the arrow keys.
- Mouse users click on the track to move the nearer handle there and drag it. These click areas are hidden from screen readers, because the range inputs cover the same function.

## Translation

The component has no text of its own except the scale under the track. Pass the title and labels translated.
