---
title: App Icon
description: Render an app's icon with a letter avatar fallback using the AppIcon component on cardano.org.
---

import AppIcon from '@site/src/components/AppIcon';
import { Showcases } from '@site/src/data/apps';

## AppIcon

The icon of one showcase entry, sized for a tile or a row. It renders `app.icon` through `useBaseUrl`, so the path works in every locale. When the entry has no `icon` or the image fails to load, it falls back to a colored letter avatar: the first letter of the title on the category color from `Categories`.

It exists to be used inside [App Tile](./app-tile.md) and [App Row](./app-row.md). Use it on its own only when you build a new app-related component and need the same icon treatment.

## Basic Usage

From `src/components/AppRow/index.js`:

```jsx
import AppIcon from '@site/src/components/AppIcon';

<AppIcon app={app} size="row" className={styles.icon} />
```

From `src/components/AppTile/index.js`:

```jsx
<AppIcon app={app} size="tile" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `app` | `object` | - | One showcase entry. Reads `icon`, `title`, and `category`. Required. |
| `size` | `'tile' \| 'row'` | `'tile'` | Picks the tile or the smaller row size class. Any value other than `'row'` uses the tile size. |
| `className` | `string` | - | Additional class name on the outer `<span>`. |

## Live Preview

<div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
  <AppIcon app={Showcases[0]} />
  <AppIcon app={Showcases[0]} size="row" />
  <AppIcon app={{ title: 'Fallback', category: 'wallet' }} />
</div>

## Notes

- The element is `aria-hidden` and the image has an empty `alt`. The app title must be visible next to it, which the tile and row components guarantee.
- The image loads lazily.
- New showcase submissions must include an `icon`, see [Add an App](../add-app.md). The fallback stays for older entries and broken images.
