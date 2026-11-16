---
title: App Tile
description: Render one app from the showcase as a linked card with icon, blurb, activity, and category using the AppTile component on cardano.org.
---

import AppTile, { StarBadge, RankBadge } from '@site/src/components/AppTile';
import { Showcases } from '@site/src/data/apps';

## AppTile

A card for one entry of the app showcase in `src/data/apps.js`. It links to `/apps/<slug>` and shows the [App Icon](./app-icon.md), an optional badge in the top right, the title, the blurb (`tagline`, falling back to `description`), the compact transaction count when the app's category is trackable and has activity, the category label, and up to two property labels.

The card is used in the carousels on `/apps` (through [AppTileCarousel](#apptilecarousel)), the activity section on the homepage, the related apps on an app detail page, and the tool lists on `/governance`, `/governance/delegate`, and `/stake-pool-delegation`. [App Grid](./app-grid.md) renders its own card and does not use `AppTile`. The component is memoized.

Two badge helpers are exported alongside the default: `StarBadge` (a star, "Maintainer pick") and `RankBadge` (a `#n` rank).

## Basic Usage

A list of tools with a maintainer pick star:

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

A rank badge:

```jsx
<AppTile app={app} badge={<RankBadge rank={index + 1} />} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `app` | `object` | - | One showcase entry. Needs at least `slug`, `title`, `category`, and `properties` (an array). `icon`, `tagline`, and `description` are optional. Required. |
| `badge` | `ReactNode` | `null` | Rendered in the header next to the icon. Use `<StarBadge />`, `<RankBadge rank={n} />`, or any small element. |
| `showProperties` | `boolean` | `true` | Shows up to two property labels after the category. `false` keeps the meta row to activity and category, as on the homepage. |
| `headingLevel` | `number` | `3` | Heading level of the app name, 1 to 6. The look stays the same, so the level can follow the page outline, for example `2` below a page hero. |
| `className` | `string` | - | Extra class on the outer element. |

### StarBadge

No props. Renders a star with a translated "Maintainer pick" label (`apps.detail.maintainerPick`).

### RankBadge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rank` | `number` | - | Shown as `#rank` with a translated "Rank n" label (`apps.rankBadge`). |

## Live Preview

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem'}}>
  <AppTile app={Showcases[0]} badge={<StarBadge />} />
  <AppTile app={Showcases[1]} badge={<RankBadge rank={2} />} />
</div>

## Notes

- Always pass entries from `Showcases`. The `slug` is derived from the title at load time, and `app.properties.slice` throws when `properties` is missing.
- The transaction count comes from `getAppStats` in `src/utils/appStats.js` and only shows for categories marked `trackable` in `Categories`. See [Transaction Rankings](../tx-rankings.md) for how the stats are produced.
- The texts inside the component are the activity unit ("tx", `apps.activity.unit`) and the badge labels. Category and property labels come from `Categories` and `Properties` in `src/data/apps.js` and are English only.
- For a compact horizontal list, use [App Row](./app-row.md) instead.

## AppTileCarousel

`AppTileCarousel` puts a row of `AppTile` cards into a [Horizontal Scroller](./horizontal-scroller.md) with the card widths used on `/apps` (260px, 220px on mobile). Scrolling, arrows, and dots come from the scroller.

```jsx
import AppTileCarousel from '@site/src/components/AppTileCarousel';
import { RankBadge } from '@site/src/components/AppTile';
import { translate } from '@docusaurus/Translate';

<AppTileCarousel
  apps={apps}
  ariaLabel={translate({ id: 'myPage.mostActive', message: 'Most active apps' })}
  renderBadge={(app, index) => <RankBadge rank={index + 1} />}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apps` | `object[]` | *required* | Showcase entries, in display order. |
| `ariaLabel` | `string` | - | Accessible name of the carousel. |
| `renderBadge` | `(app, index) => ReactNode` | - | Returns the badge for each card, for example a `StarBadge` or a `RankBadge`. |
