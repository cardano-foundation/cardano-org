---
title: Spacer Box
description: Insert vertical spacing between content blocks using the SpacerBox component.
---

import SpacerBox from "@site/src/components/Layout/SpacerBox";

## SpacerBox

`<SpacerBox>` adds vertical space between two components. It renders an empty element with a top margin, in one of three sizes. Use it instead of `<br />` elements or one-off margins in page CSS.

## Sizes

| `size` | Space |
|---|---|
| `small` (default) | `2rem` |
| `medium` | `4rem` |
| `large` | `6rem` |

`<SpacerBox />` without a size is the same as `<SpacerBox size="small" />`. An unknown size also falls back to `small`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `string` | `small` | `small`, `medium`, or `large`, see the sizes above. |

## Basic Usage

```jsx
import SpacerBox from '@site/src/components/Layout/SpacerBox';

<TitleWithText headingLevel={2} title="First block" />
<SpacerBox size="medium" />
<TitleWithText headingLevel={2} title="Second block" />
```

## Live Preview

The two boxes below are separated by `<SpacerBox size="medium" />`.

<div style={{padding: '0.75rem 1rem', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px'}}>First block</div>
<SpacerBox size="medium" />
<div style={{padding: '0.75rem 1rem', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px'}}>Second block</div>

## Notes

- The space is a margin, so it collapses with the margins of the elements around it. When the next element has a larger top margin of its own, the larger of the two wins and the spacer seems to have no effect.
- SpacerBox only adds vertical space. For space between items in a row, use the gap of the surrounding layout.
