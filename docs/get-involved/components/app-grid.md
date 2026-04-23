---
title: App Grid
---

## AppGrid

The `AppGrid` component displays a responsive grid of Cardano applications, with transaction statistics and rankings. It can filter apps by any tag (or multiple tags) and sorts them by transaction volume.

## Basic Usage

```jsx
import AppGrid from '@site/src/components/AppGrid';

<AppGrid tags={['dex']} />
```

**Live Preview:**

import AppGrid from '@site/src/components/AppGrid';

<AppGrid tags={['dex']} limit={4} />

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tags` | `string[]` | `['dex']` | Array of tags to filter apps by. Apps matching ANY of the tags will be shown. |
| `limit` | `number` | `null` | Maximum number of apps to display. Shows all if not specified. |
| `showRank` | `boolean` | `true` | Whether to display rank badges (#1, #2, etc.) on app cards. |
| `showStats` | `boolean` | `true` | Whether to display transaction statistics on app cards. |
| `gridTitle` | `string` | `null` | Optional title to display above the grid. |
| `ctaText` | `string` | `"Visit"` | Text for the call-to-action button on each card. |
| `moreLink` | `string` | `null` | Custom link for the "More Apps" card. Defaults to `/apps?tags=...` |
| `moreTitle` | `string` | `"More Apps"` | Title for the "More Apps" card. |

---

## Features

### Flexible Tag Filtering
Filter apps by any tag or combination of tags:
- Single tag: `tags={['dex']}` or `tags={['lending']}`
- Multiple tags: `tags={['dex', 'lending']}` (shows apps with ANY of these tags)

### Automatic Ranking
Apps are automatically ranked by their 30-day transaction volume:
- **Top 3 apps** get highlighted rank badges
- Ranking is based on real on-chain transaction data
- Apps without transaction data appear after ranked ones (alphabetically)

### Transaction Statistics
Each app card displays:
- 30-day transaction count
- Visual rank badge for top performers
- Bar chart icon for quick recognition

### Responsive Grid
- Desktop: Multi-column layout (auto-fills based on screen width)
- Mobile: Single column for optimal readability
- Cards maintain consistent height and spacing

### Icon Support
Apps can display custom logos via the `icon` field in `apps.js`:
- Supports SVG, PNG, WebP, JPEG
- Falls back to initial letter badge if no icon provided

---

## Examples

### DEX Grid (Default)

```jsx
<AppGrid
  tags={['dex']}
  limit={4}
  gridTitle="Top Cardano DEXs"
  ctaText="Visit DEX"
  moreTitle="More DEXes"
/>
```

<AppGrid
  tags={['dex']}
  limit={4}
  gridTitle="Top Cardano DEXs"
  ctaText="Visit DEX"
  moreTitle="More DEXes"
/>

---

### Lending Platforms

```jsx
<AppGrid
  tags={['lending']}
  limit={4}
  gridTitle="Lending Platforms"
  ctaText="Visit Platform"
  moreTitle="More Lending"
/>
```

<AppGrid
  tags={['lending']}
  limit={4}
  gridTitle="Lending Platforms"
  ctaText="Visit Platform"
  moreTitle="More Lending"
/>

---

### Marketplaces

```jsx
<AppGrid
  tags={['marketplace']}
  limit={4}
  gridTitle="Marketplaces"
/>
```

<AppGrid
  tags={['marketplace']}
  limit={4}
  gridTitle="Marketplaces"
/>

---

### Without Rankings

Useful for showcasing apps without emphasizing competitive ranking:

```jsx
<AppGrid
  tags={['dex']}
  limit={6}
  showRank={false}
/>
```

<AppGrid
  tags={['dex']}
  limit={6}
  showRank={false}
/>

---

### Without Statistics

Clean display focusing only on app information:

```jsx
<AppGrid
  tags={['wallet']}
  limit={4}
  showStats={false}
/>
```

<AppGrid
  tags={['wallet']}
  limit={4}
  showStats={false}
/>

---

### Multiple Tags (DeFi)

Show apps from multiple categories:

```jsx
<AppGrid
  tags={['dex', 'lending']}
  limit={6}
  gridTitle="DeFi Apps"
  ctaText="Open App"
/>
```

<AppGrid
  tags={['dex', 'lending']}
  limit={6}
  gridTitle="DeFi Apps"
  ctaText="Open App"
/>

---

## How It Works

### Filtering & Sorting

1. **Filters** all apps with ANY of the specified tags from `apps.js`
2. **Sorts** by transaction count (descending)
3. **Assigns** category-specific ranks (1, 2, 3, etc.)
4. **Applies** limit if specified
5. **Displays** "More Apps" card when limited

### Transaction Data Matching

The component uses the `statsLabel` field from `apps.js` to match apps with their transaction data:

```javascript
{
  title: "Minswap Dex",
  icon: "/img/app-icons/minswap.svg",
  statsLabel: "minswap",  // Matches label in tx-stats.json
  tags: ["dex"],
  // ...
}
```

See the [Transaction Rankings Guide](/docs/get-involved/tx-rankings) for details on how transaction data is collected and how to get your app tracked.

---

## Customization

### Adding App Icons

1. Place your logo in `/static/img/app-icons/`
2. Add the `icon` field to your app in `apps.js`:
   ```javascript
   icon: "/img/app-icons/your-app.svg"
   ```

### Transaction Data

To display transaction statistics for your app:

1. Add the `statsLabel` field to your app entry
2. Ensure the label matches your entry in `/src/data/tx-stats.json`
3. See [Transaction Rankings Guide](/docs/get-involved/tx-rankings)

---

## "More Apps" Card

When using the `limit` prop, a special card appears at the end of the grid:

- Shows the count of remaining apps not displayed
- Links to `/apps?tags=...` by default (customizable via `moreLink`)
- Matches the design of app cards for consistency

---

## Mobile Optimization

The grid automatically adjusts for mobile devices:

- **Desktop**: Multi-column grid (minimum 280px per card)
- **Tablet**: 2-3 columns depending on screen width
- **Mobile**: Single column for optimal readability
- Cards maintain consistent padding and spacing across all breakpoints

---

## Integration Example

Using AppGrid on a custom page:

```jsx
---
title: Cardano DeFi Ecosystem
---

import AppGrid from '@site/src/components/AppGrid';

# Decentralized Finance on Cardano

Explore the growing DeFi ecosystem on Cardano, ranked by real transaction volume.

<AppGrid
  tags={['dex', 'lending']}
  limit={8}
  gridTitle="Top DeFi Apps by Volume"
  ctaText="Open App"
/>

[View All Apps](/apps)
```

---

## Related Components

- **[AppList](/docs/get-involved/components/app-list)** - Compact list component for categorized apps
- **Apps Page** - Full app directory with filtering

---

## Technical Notes

- Component sources apps from `/src/data/apps.js`
- Transaction data from `/src/data/tx-stats.json`
- Ranking is category-specific (not global app ranking)
- Handles missing icons gracefully with fallback badges
- Supports both `require()` and string URL paths for icons

---

## Migration from DexGrid

The `AppGrid` component replaces the previous `DexGrid` component. To migrate:

```jsx
// Before (DexGrid)
import DexGrid from '@site/src/components/DexGrid';
<DexGrid limit={5} showRank={false} />

// After (AppGrid)
import AppGrid from '@site/src/components/AppGrid';
<AppGrid tags={['dex']} limit={5} showRank={false} ctaText="Visit DEX" moreTitle="More DEXes" />
```

Key differences:
- `tags` prop is now required (defaults to `['dex']`)
- `ctaText` prop allows customizing the button text (was hardcoded as "Visit DEX")
- `moreTitle` prop allows customizing the "more" card title
- `moreLink` prop allows customizing the "more" card link
