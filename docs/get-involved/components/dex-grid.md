---
title: Dex Grid
---

## DexGrid

The `DexGrid` component displays a responsive grid of decentralized exchanges (DEXs) on Cardano, with transaction statistics and rankings. It automatically filters apps tagged with `dex` and sorts them by transaction volume.

## Basic Usage

```jsx
import DexGrid from '@site/src/components/DexGrid';

<DexGrid />
```

**Live Preview:**

import DexGrid from '@site/src/components/DexGrid';

<DexGrid limit={4} />

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | `number` | `null` | Maximum number of DEXs to display. Shows all if not specified. |
| `showRank` | `boolean` | `true` | Whether to display rank badges (#1, #2, etc.) on DEX cards. |
| `showStats` | `boolean` | `true` | Whether to display transaction statistics on DEX cards. |
| `gridTitle` | `string` | `null` | Optional title to display above the grid. |

---

## Features

### Automatic Ranking
DEXs are automatically ranked by their 30-day transaction volume:
- **Top 3 DEXs** get highlighted rank badges
- Ranking is based on real on-chain transaction data
- DEXs without transaction data appear after ranked ones (alphabetically)

### Transaction Statistics
Each DEX card displays:
- 30-day transaction count
- Visual rank badge for top performers
- Bar chart icon for quick recognition

### Responsive Grid
- Desktop: Multi-column layout (auto-fills based on screen width)
- Mobile: Single column for optimal readability
- Cards maintain consistent height and spacing

### Icon Support
DEXs can display custom logos via the `icon` field in `apps.js`:
- Supports SVG, PNG, WebP, JPEG
- Falls back to initial letter badge if no icon provided

---

## Examples

### Top 4 DEXs with Title

```jsx
<DexGrid 
  limit={4} 
  gridTitle="Top Cardano DEXs"
/>
```

<DexGrid 
  limit={4} 
  gridTitle="Top Cardano DEXs"
/>

---

### Without Rankings

Useful for showcasing DEXs without emphasizing competitive ranking:

```jsx
<DexGrid 
  limit={6} 
  showRank={false}
/>
```

<DexGrid 
  limit={6} 
  showRank={false}
/>

---

### Without Statistics

Clean display focusing only on DEX information:

```jsx
<DexGrid 
  limit={4} 
  showStats={false}
/>
```

<DexGrid 
  limit={4} 
  showStats={false}
/>

---

### All DEXs (No Limit)

```jsx
<DexGrid />
```

This displays all available DEXs in the ecosystem, sorted by transaction volume.

---

## How It Works

### Filtering & Sorting

1. **Filters** all apps with the `dex` tag from `apps.js`
2. **Sorts** by transaction count (descending)
3. **Assigns** DEX-specific ranks (1, 2, 3, etc.)
4. **Applies** limit if specified
5. **Displays** "More DEXes" card when limited

### Transaction Data Matching

The component uses the `statsLabel` field from `apps.js` to match DEXs with their transaction data:

```javascript
{
  title: "Minswap Dex",
  icon: "/img/app-icons/minswap.svg",
  statsLabel: "minswap",  // Matches label in app-stats.json
  tags: ["dex", "token"],
  // ...
}
```

See the [Transaction Rankings Guide](/docs/get-involved/tx-rankings) for details on how transaction data is collected and how to get your DEX tracked.

---

## Customization

### Adding DEX Icons

1. Place your logo in `/static/img/app-icons/`
2. Add the `icon` field to your app in `apps.js`:
   ```javascript
   icon: "/img/app-icons/your-dex.svg"
   ```

### Transaction Data

To display transaction statistics for your DEX:

1. Add the `statsLabel` field to your app entry
2. Ensure the label matches your entry in `/src/data/app-stats.json`
3. See [Transaction Rankings Guide](/docs/get-involved/tx-rankings)

---

## "More DEXes" Card

When using the `limit` prop, a special card appears at the end of the grid:

- Shows the count of remaining DEXs not displayed
- Links to `/apps?tags=dex` to view all DEXs
- Matches the design of DEX cards for consistency

---

## Mobile Optimization

The grid automatically adjusts for mobile devices:

- **Desktop**: Multi-column grid (minimum 280px per card)
- **Tablet**: 2-3 columns depending on screen width
- **Mobile**: Single column for optimal readability
- Cards maintain consistent padding and spacing across all breakpoints

---

## Integration Example

Using DexGrid on a custom page:

```jsx
---
title: Cardano DEX Ecosystem
---

import DexGrid from '@site/src/components/DexGrid';

# Decentralized Exchanges on Cardano

Explore the growing ecosystem of DEXs on Cardano, ranked by real transaction volume.

<DexGrid 
  limit={8} 
  gridTitle="Top DEXs by Volume"
/>

[View All DEXs →](/apps?tags=dex)
```

---

## Related Components

- **[AppList](/docs/get-involved/components/app-list)** - Compact list component for categorized apps
- **Apps Page** - Full app directory with filtering

---

## Technical Notes

- Component sources apps from `/src/data/apps.js`
- Transaction data from `/src/data/app-stats.json`
- Ranking is DEX-specific (not global app ranking)
- Handles missing icons gracefully with fallback badges
- Supports both `require()` and string URL paths for icons
