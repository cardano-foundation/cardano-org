---
title: Layer 2 Card
description: Display an ecosystem project with a colour-coded status pill using the Layer2Card component on cardano.org.
---

## Layer2Card

The `Layer2Card` component displays a single ecosystem project as a card: a logo tile, the project name, a colour-coded **status pill**, a short description, and an optional call-to-action link. It powers the project grids on the [Layer 2](/layer-2) page and is generic enough to list any set of projects by status.

## Features

- **Colour-coded status pill** - one accent colour per project status
- **Logo tile with monogram fallback** - shows a logo image, or the project's first letter when no logo is provided
- **Optional call-to-action** - when a `cta` is set, the whole card becomes a link; external URLs open in a new tab
- **Dark mode support** - card surface, text, and status tints adapt to the active theme
- **Equal-height cards** - designed to sit in a CSS grid with the CTA pinned to the bottom

## Basic Usage

```jsx
import Layer2Card from '@site/src/components/Layer2Card';

<Layer2Card
  name="Hydra"
  status="production-ready"
  description="Hydra processes transactions in off-chain mini-ledgers called Heads, which use the same ledger rules as Cardano's layer 1 chain."
  cta={{ label: "Go to Repository", href: "https://github.com/cardano-scaling/hydra" }}
/>
```

To render a grid of cards, map over your data and wrap the cards in a grid container (see `src/pages/layer-2.js` and `src/data/layer-2.js` for a full example).

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Project name. Brand names are not translated. |
| `status` | string | Yes | One of the status keys below. Drives the pill colour and label. |
| `description` | string | Yes | Short paragraph describing the project. |
| `cta` | object | No | `{ label, href }` for the footer link. When set, the whole card links to `href`. |
| `logo` | string | No | Path to a logo image (resolved with `useBaseUrl`). Rendered inside the logo tile. |
| `monogram` | string | No | Letter shown when no `logo` is given. Defaults to the first letter of `name`. |
| `logoBackground` | string | No | CSS colour for the logo tile. Defaults to a light-blue tint. Use a brand colour behind real logos (e.g. `#0a0a0a`). |
| `logoColor` | string | No | CSS colour for the monogram letter. Defaults to the brand blue. Use `#ffffff` on a dark `logoBackground`. |

## Status values

Pass one of these keys as `status`. Each maps to a fixed colour and label:

| `status` | Label | Accent |
|----------|-------|--------|
| `production-ready` | PRODUCTION-READY | Blue |
| `in-production` | IN PRODUCTION | Blue |
| `deployed` | DEPLOYED | Green |
| `mainnet` | MAINNET | Green |
| `in-development` | IN DEVELOPMENT | Purple |
| `proof-of-concept` | PROOF OF CONCEPT | Amber |
| `status-tbc` | STATUS TBC | Grey |

An unrecognised `status` renders no pill.

## Live Demo

import Layer2Card from '@site/src/components/Layer2Card';

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px'}}>
  <Layer2Card
    name="Hydra"
    status="production-ready"
    description="Off-chain mini-ledgers called Heads that reuse Cardano's layer 1 ledger rules for higher throughput at lower cost."
    cta={{ label: "Go to Repository", href: "https://github.com/cardano-scaling/hydra" }}
  />
  <Layer2Card
    name="Midnight"
    status="deployed"
    description="A partner chain focused on data protection and programmable privacy, using its own consensus and native token."
    cta={{ label: "Go to Website", href: "https://midnight.network" }}
  />
  <Layer2Card
    name="Midgard"
    status="in-development"
    description="Cardano's first optimistic rollup: off-chain transactions with a fraud-proof challenge period."
  />
</div>

## Styling

The component uses CSS modules. Override styles by targeting these classes:

- `.card` - the card container
- `.linkCard` - added when the card is a link (hover elevation)
- `.logoTile` / `.monogram` / `.logoImage` - the logo tile and its contents
- `.name` - the project name
- `.statusPill` / `.statusDot` - the status pill and its dot
- `.statusBlue`, `.statusGreen`, `.statusPurple`, `.statusAmber`, `.statusGrey` - per-status colours
- `.description` - the description paragraph
- `.cta` - the footer call-to-action text

## Notes

- Provide project descriptions and status labels through `@docusaurus/Translate` so they remain translatable; brand `name` values stay untranslated.
- When placing cards in a grid, give the grid a fixed minimum column width (e.g. `minmax(320px, 1fr)`) so cards keep a consistent width rather than stretching to fill partial rows.
- On coloured (non-white) section backgrounds the card itself stays white; only the surrounding section heading needs inverted (white) text.
