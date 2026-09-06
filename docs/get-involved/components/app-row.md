---
title: App Row
description: Render one app from the showcase as a compact linked row with icon, blurb, activity, and category using the AppRow component on cardano.org.
---

import AppRow from '@site/src/components/AppRow';
import { Showcases } from '@site/src/data/apps';

## AppRow

The list-style counterpart of [App Tile](./app-tile.md). One horizontal row that links to `/apps/<slug>` and shows the [App Icon](./app-icon.md) at row size, the title with inline markers (a star for maintainer picks, a dot for apps with activity, a NEW badge for the newest entries), the blurb, and on the right the compact transaction count and the category label.

It is used for the rows inside the category panels on `/apps` (`CategoryPanelsCarousel`) and for the flat list further down the same page. The component is memoized.

## Basic Usage

Inside a category panel, where the category is already the panel heading, from `src/components/CategoryPanelsCarousel/index.js`:

```jsx
import AppRow from '@site/src/components/AppRow';

<ul className={styles.panelList}>
  {apps.map((app) => (
    <li key={app.slug}>
      <AppRow app={app} hideCategory />
    </li>
  ))}
</ul>
```

In the mixed list on `/apps`, where the category label is useful:

```jsx
<AppRow app={app} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `app` | `object` | - | One showcase entry from `Showcases`. Needs `slug`, `title`, and `category`. `icon`, `tagline`, `description`, and `maintainerPick` are optional. Required. |
| `hideCategory` | `boolean` | `false` | Hides the category label on the right. Use it when the row sits under a heading that already names the category. |

## Live Preview

<ul style={{listStyle: 'none', padding: 0, maxWidth: '40rem'}}>
  <li><AppRow app={Showcases[0]} /></li>
  <li><AppRow app={Showcases[1]} hideCategory /></li>
</ul>

## Notes

- The NEW badge marks the last `RECENT_APPS_COUNT` entries of the `Showcases` array (five at the time of writing), so the order of `src/data/apps.js` matters.
- The activity dot and count only appear for categories marked `trackable` in `Categories` and with a transaction count above zero.
- The component translates its own labels (`apps.activity.unit`, `apps.new`, `apps.maintainerPick`). Consumers pass no text.
- For a card layout, use [App Tile](./app-tile.md).
