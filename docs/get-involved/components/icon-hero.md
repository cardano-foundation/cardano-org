---
title: Icon Hero
description: Frame an icon in a rounded tile with an optional dotted halo using the IconHero component on cardano.org.
---

import IconHero from '@site/src/components/Layout/IconHero';
import { FaVoteYea, FaWallet } from 'react-icons/fa';

## IconHero

A decorative 120px circle (90px on screens up to 768px wide) with a dotted halo, holding a 52px rounded tile in which the icon is centered. The whole element is `aria-hidden`, so it is purely visual and must sit next to a real heading or label.

It is used for the step illustrations in `DelegationFlow`, the tab panels in `GovernancePathsSection`, and the icon of `SurveyCard`.

## Basic Usage

From `src/components/GovernancePathsSection/index.js`:

```jsx
import IconHero from '@site/src/components/Layout/IconHero';
import { FaVoteYea } from 'react-icons/fa';

<IconHero className={styles.panelHero}>
  <FaVoteYea />
</IconHero>
<h2 className={styles.panelTitle}>{path.title}</h2>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The icon to show, usually a `react-icons` component. Sized by the tile's `font-size` (1.5rem, 1.25rem on small screens). |
| `withHalo` | `boolean` | `true` | Renders the dotted radial halo behind the tile. Set to `false` for a plain circle of the same size without the dots. |
| `className` | `string` | - | Additional class name on the outer circle, for positioning within the parent layout. |

## Live Preview

<div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
  <IconHero><FaVoteYea /></IconHero>
  <IconHero withHalo={false}><FaWallet /></IconHero>
</div>

## Notes

- The halo, tile background, and icon color are theme aware and switch for dark mode through `[data-theme='dark']` rules.
- Because the element is `aria-hidden`, never put text or a link inside it.
- For an icon with a title and description in one card, use [Role Card](./role-card.md) instead.
