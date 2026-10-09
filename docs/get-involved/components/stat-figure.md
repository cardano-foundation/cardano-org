---
title: Stat Figure
description: Show key figures as a large value above a short label, alone or in an equal-column strip, using the StatFigure and StatStrip components on cardano.org.
---

import StatFigure, { StatStrip } from '@site/src/components/Layout/StatFigure';

## StatFigure

`StatFigure` shows one key figure: a large value in the brand blue, a short uppercase label below it, and an optional line of context. `StatStrip` places several figures in equal columns. Together they power the live figures on `/governance`, `/governance/accountability`, and `/insights/treasury`.

## When to use

- A few headline numbers that summarize a page or section, such as a treasury balance or the number of active DReps.
- For a figure inside a card with its own surface, the card look is not part of this component yet. Use the page's own markup until the shared card variant exists.

## Basic Usage

```jsx
import { CountFigure, StatStrip } from '@site/src/components/Layout/StatFigure';
import { translate } from '@docusaurus/Translate';

const formatInt = (v) => Math.round(v).toLocaleString();

<StatStrip columns={4} mobileColumns={2}>
  <CountFigure
    target={dreps}
    format={formatInt}
    href="#dreps"
    label={translate({ id: 'myPage.stat.dreps', message: 'Active DReps' })}
  />
  …
</StatStrip>
```

`CountFigure` counts the number up from 0 once it is known and shows "..." while it is `null`. The caller passes the formatter, because the formats differ between pages (ada amounts, whole numbers, signed changes). Use `StatFigure` directly for values that are already text or that need their own handling.

## StatFigure props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `node` | - | The formatted value. |
| `label` | `node` | - | Short label below the value, one to three words. Shown in uppercase. |
| `sub` | `node` | - | Optional line of context below the label. |
| `loading` | `boolean` | `false` | Shows "..." instead of the value. |
| `href` | `string` | - | Turns the figure into a link with a light hover surface. |
| `compact` | `boolean` | `false` | Less inner padding, the same on all screen sizes. |
| `className` | `string` | - | Extra class on the figure. |

## CountFigure props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `target` | `number` | - | The final number. `null` while loading. |
| `format` | `(number) => node` | - | Formats the animated number for display. |

All other props are the same as for `StatFigure`: `label`, `sub`, `href`, `compact`, and `className`.

## StatStrip props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number` | `4` | Columns on wide screens. |
| `mobileColumns` | `number` | `columns` | Columns at 768px width and below. |
| `className` | `string` | - | Extra class, for example for the outer spacing or the strip variables. |
| `style` | `object` | - | Inline styles, merged with the strip variables. |
| `children` | `node` | - | The figures. |

## Live Preview

<StatStrip columns={3} mobileColumns={1}>
  <StatFigure value="1,234" label="Active DReps" />
  <StatFigure value="1.6B ada" label="Treasury" sub="Updated every epoch" />
  <StatFigure loading label="Current epoch" />
</StatStrip>

## Styling

The strip and figures read CSS variables that a page can set in its own class, for example at a breakpoint of its own:

- `--stat-cols` and `--stat-cols-mobile`: number of columns (the props set them inline).
- `--stat-gap`: space between figures, default `1rem`. Two values set row and column gap.
- `--stat-value-size` and `--stat-value-size-mobile`: size of the value, default `2rem` and `1.5rem`.

`/governance` uses them to keep four figures in a row and stack them below 996px:

```css
.statsRow {
  --stat-cols: 4;
  --stat-gap: 0 2rem;
}

@media (max-width: 996px) {
  .statsRow {
    --stat-cols: 1;
  }
}
```

## Accessibility

- The value and label are plain text, so screen readers read them in order.
- With `href`, the whole figure is one link with the global focus ring.
- The hover transition is turned off for readers who prefer reduced motion.

## Related components

- [Treasury Sections](./treasury-sections.md): treasury figures built on StatFigure.
- [Grid](./grid.md): cards that wrap by width rather than fixed columns.
