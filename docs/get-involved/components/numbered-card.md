---
title: Numbered Card
description: Present an ordinal step or principle with an index tile, title, and body using the NumberedCard component on cardano.org.
---

## NumberedCard

The `NumberedCard` component presents a single step or principle as a card: an **index tile** with an ordinal label ("01", "02", and so on), a title, and a short body. It powers the "What Makes Cardano Different" and CCRI methodology grids on the [Sustainability](/sustainability) page and is generic enough to list any ordered set of points.

## Features

- **Index tile** - a 40px rounded tile showing the ordinal label in the brand blue
- **Static content card** - no link or hover behavior; the card is purely presentational
- **Flexible body** - pass a plain string (wrapped in a paragraph for you) or any React nodes
- **Dark mode support** - card surface, text, and tile tint adapt to the active theme
- **Equal-height cards** - fills the height of its grid cell so rows stay aligned

## Basic Usage

```jsx
import NumberedCard from '@site/src/components/NumberedCard';

<NumberedCard index="01" title="Proof of stake instead of proof of work">
  Ouroboros selects validators based on the stake they hold, not on processing power, so the network reaches consensus without the escalating energy needs of proof of work.
</NumberedCard>
```

To render a grid of cards, map over your data and wrap the cards in a grid container (see `src/pages/sustainability.js` and `src/data/sustainability.js` for a full example).

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `index` | string | Yes | Ordinal label shown in the tile. Pass a preformatted string such as `"01"` so leading zeros are kept. |
| `title` | string | Yes | Card heading, rendered as an `<h3>`. |
| `children` | node | Yes | Body content. A plain string is wrapped in a `<p>`; React nodes render as-is. |
| `className` | string | No | Extra class applied to the card container, for page-specific overrides. |

## Live Demo

import NumberedCard from '@site/src/components/NumberedCard';

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px'}}>
  <NumberedCard index="01" title="Proof of stake instead of proof of work">
    Ouroboros selects validators based on the stake they hold, not on processing power, so the network reaches consensus without the escalating energy needs of proof of work.
  </NumberedCard>
  <NumberedCard index="02" title="Decentralized network, minimal energy footprint">
    Thousands of operators secure the network on everyday hardware, with an average power draw per node lower than a traditional incandescent bulb.
  </NumberedCard>
  <NumberedCard index="03" title="The EUTXO model brings transaction efficiency">
    <p>The Extended UTXO model lets Cardano batch multiple transactions into one, reducing costs as well as energy needs.</p>
    <p>Body content can be any React node, such as these two paragraphs.</p>
  </NumberedCard>
</div>

## Styling

The component uses CSS modules. Override styles by targeting these classes:

- `.card` - the card container
- `.index` - the index tile
- `.title` - the card heading
- `.body` - the body wrapper around the paragraph or custom nodes

## Notes

- Provide `title` and body text through `@docusaurus/Translate` so they remain translatable. The `index` label is a display string and does not need translating.
- The card has no link behavior. If a whole card needs to be clickable, use [Layer 2 Card](./layer-2-card.md) with a `cta` instead.
- On colored (non-white) section backgrounds the card stays on the theme surface color, so only the surrounding section heading needs inverted text. The MiCA band on the Sustainability page uses this pattern.
- The card is sized by its grid cell. For the standard three-column layout use `grid-template-columns: repeat(3, minmax(0, 1fr))` with a 32px gap, and collapse to one column under 768px.
