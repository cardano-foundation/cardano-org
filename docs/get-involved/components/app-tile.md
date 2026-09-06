---
title: App Tile
description: Render one app from the showcase as a linked card with icon, blurb, activity, and category using the AppTile component on cardano.org.
---

import AppTile, { StarBadge, RankBadge } from '@site/src/components/AppTile';
import { Showcases } from '@site/src/data/apps';

## AppTile

A card for one entry of the app showcase in `src/data/apps.js`. It links to `/apps/<slug>` and shows the [App Icon](./app-icon.md), an optional badge in the top right, the title, the blurb (`tagline`, falling back to `description`), the compact transaction count when the app's category is trackable and has activity, the category label, and up to two property labels.

The card is the unit inside [App Grid](./app-grid.md), the `AppTileCarousel`, the related apps on an app detail page, and the tool lists on `/governance` and `/governance/delegate`. The component is memoized.

Two badge helpers are exported alongside the default: `StarBadge` (a star, "Maintainer pick") and `RankBadge` (a `#n` rank).

## Basic Usage

From `src/pages/governance/delegate.js`:

```jsx
import AppTile, { StarBadge } from '@site/src/components/AppTile';
import { Showcases } from '@site/src/data/apps';

const DELEGATION_APPS = Showcases.filter((app) => app.properties.includes('drepdelegation'));

<div className={styles.altGrid}>
  {DELEGATION_APPS.map((app) => (
    <AppTile key={app.slug} app={app} badge={app.maintainerPick ? <StarBadge /> : null} />
  ))}
</div>
```

A rank badge, as `AppTileCarousel` receives it through `renderBadge`:

```jsx
<AppTile app={app} badge={<RankBadge rank={index + 1} />} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `app` | `object` | - | One showcase entry. Needs at least `slug`, `title`, `category`, and `properties` (an array). `icon`, `tagline`, and `description` are optional. Required. |
| `badge` | `ReactNode` | `null` | Rendered in the header next to the icon. Use `<StarBadge />`, `<RankBadge rank={n} />`, or any small element. |

### StarBadge

No props. Renders a star with `aria-label="Maintainer pick"`.

### RankBadge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rank` | `number` | - | Shown as `#rank` with a matching `aria-label`. |

## Live Preview

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem'}}>
  <AppTile app={Showcases[0]} badge={<StarBadge />} />
  <AppTile app={Showcases[1]} badge={<RankBadge rank={2} />} />
</div>

## Notes

- Always pass entries from `Showcases`. The `slug` is derived from the title at load time, and `app.properties.slice` throws when `properties` is missing.
- The transaction count comes from `getAppStats` in `src/utils/appStats.js` and only shows for categories marked `trackable` in `Categories`. See [Transaction Rankings](../tx-rankings.md) for how the stats are produced.
- The only text inside the component is the activity unit ("tx"), translated as `apps.activity.unit`. Category and property labels come from `Categories` and `Properties`.
- For a compact horizontal list, use [App Row](./app-row.md) instead.
