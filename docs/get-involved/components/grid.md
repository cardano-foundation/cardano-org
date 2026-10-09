---
title: Grid
description: Lay out cards or tiles in a responsive grid whose columns follow the available width, using the Grid component on cardano.org.
---

import Grid from '@site/src/components/Layout/Grid';

## Grid

`Grid` places cards, tiles, or rows in columns that wrap by a minimum item width. On a wide screen several items share a row, on a narrow one they stack. Use it instead of writing `display: grid` with `repeat(auto-fill, minmax(...))` in page CSS.

It holds the card grids on `/learn`, `/what-is-cardano`, `/wallets`, `/layer-2`, `/use-cases`, and the glossary, and the app tile grids on `/governance`, `/governance/delegate`, `/stake-pool-delegation`, and the app detail pages.

## When to use

- Any set of similar items that should wrap into as many columns as fit.
- For a fixed number of columns or columns of different widths, write the layout in the page's CSS.
- [App Grid](./app-grid.md) is a ready-made grid of app cards with filtering. Use `Grid` for your own items.

## Basic Usage

```jsx
import Grid from '@site/src/components/Layout/Grid';

<Grid minItemWidth="260px">
  {items.map((item) => <Card key={item.id} {...item} />)}
</Grid>
```

A list of items, with the outer margin set by the page:

```jsx
<Grid as="ul" gap="0.85rem" className={styles.termGrid}>
  {terms.map((term) => <li key={term.slug}>…</li>)}
</Grid>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minItemWidth` | `string` | `240px` | Minimum width of a column. A container narrower than this gets one full width column instead of overflowing. |
| `gap` | `string` | `1rem` | Space between items. |
| `fit` | `boolean` | `false` | Stretches the items over empty tracks (`auto-fit`). By default empty tracks stay (`auto-fill`), so a single item keeps its card width instead of spanning the whole row. |
| `stackOnMobile` | `boolean` | `false` | One column at 768px width and below. |
| `as` | `string` | `div` | Element to render. Use `ul` for a list, the bullets and indent are removed. |
| `className` | `string` | - | Extra class, for example for the outer margin. Grid sets no margin of its own. |
| `style` | `object` | - | Inline styles, merged with the grid variables. |
| `children` | `node` | - | The items. |

## Live Preview

<Grid minItemWidth="180px">
  {['Delegation', 'Governance', 'Native tokens', 'Smart contracts', 'Stake pools'].map((label) => (
    <div key={label} style={{padding: '1rem', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px'}}>{label}</div>
  ))}
</Grid>

## Styling

- The grid reads three CSS variables: `--grid-min` (minimum item width), `--grid-gap` (gap), and `--grid-stack-min` (set to `100%` for one column). The props set them inline.
- To change a value at a breakpoint of your own, set the variable in the page class instead of passing the prop, because an inline value wins over a media query. `/layer-2` does this to switch to one column with a smaller gap below 767px:

```css
.grid {
  --grid-gap: 32px;
}

@media (max-width: 767px) {
  .grid {
    --grid-stack-min: 100%;
    --grid-gap: 20px;
  }
}
```

- A `ul` keeps the bottom margin Infima gives lists. Set the margin in `className`.

## Related components

- [App Grid](./app-grid.md): filterable grid of app cards.
- [App Tile](./app-tile.md): the card most app grids hold.
