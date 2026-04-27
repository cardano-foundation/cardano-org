---
title: App List
description: Render a compact list of Cardano applications by tag using the AppList component on cardano.org.
---

import AppList from "@site/src/components/AppList";

## App List

The [`<AppList>`](/docs/get-involved/components/app-list) component displays a compact, ranked list of Cardano apps filtered by category tags. Apps are sorted by transaction count (when available), then by favorites, and finally alphabetically.

## Basic Usage

```jsx
<AppList 
  categories={['dex']} 
  limit={5} 
  categoryTitle="DEX" 
/>
```

## Result

<AppList 
  categories={['dex']} 
  limit={5} 
  categoryTitle="DEX" 
/>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `categories` | `string[]` | `[]` | Array of category ids to filter apps (e.g., `['dex']`, `['wallet']`). Empty array shows all apps. |
| `beginnerFriendly` | `boolean` | `false` | When true, only apps with `beginnerFriendly: true` are shown. |
| `limit` | `number` | `5` | Maximum number of apps to display. Set to `null` to show all. |
| `categoryTitle` | `string` | `"Apps"` | Title displayed in the component header. |
| `showTxCount` | `boolean` | `false` | Whether to display transaction counts next to each app. |

## Ranking Logic

Apps are sorted in the following order:

1. **Apps with transaction data** (sorted by transaction count, descending)
2. **Favorite apps** (among apps without transaction data)
3. **Alphabetically** (as final tiebreaker)

## Examples

### DEX with Transaction Counts

```jsx
<AppList 
  categories={['dex']} 
  limit={5} 
  categoryTitle="Decentralized Exchanges" 
  showTxCount={true}
/>
```

<AppList 
  categories={['dex']} 
  limit={5} 
  categoryTitle="Decentralized Exchanges" 
  showTxCount={true}
/>

### Marketplaces

```jsx
<AppList 
  categories={['marketplace']} 
  limit={5} 
  categoryTitle="Marketplaces" 
  showTxCount={true}
/>
```

<AppList 
  categories={['marketplace']} 
  limit={5} 
  categoryTitle="Marketplaces" 
  showTxCount={true}
/>

### Wallets (No Transaction Counts)

```jsx
<AppList 
  categories={['wallet']} 
  limit={5} 
  categoryTitle="Wallets" 
  showTxCount={false}
/>
```

<AppList 
  categories={['wallet']} 
  limit={5} 
  categoryTitle="Wallets" 
  showTxCount={false}
/>

### Multiple Tags

You can combine multiple tags to show apps from different categories:

```jsx
<AppList 
  categories={['dex', 'lending']} 
  limit={8} 
  categoryTitle="DeFi Protocols" 
  showTxCount={true}
/>
```

<AppList 
  categories={['dex', 'lending']} 
  limit={8} 
  categoryTitle="DeFi Protocols" 
  showTxCount={true}
/>

### All Apps (No Filter)

```jsx
<AppList 
  categories={[]} 
  limit={10} 
  categoryTitle="Popular Apps" 
  showTxCount={true}
/>
```

<AppList 
  categories={[]} 
  limit={10} 
  categoryTitle="Popular Apps" 
  showTxCount={true}
/>

## Available Tags

Common tags you can use to filter apps. Please see `src/data/apps.js` for detailed list.

- `dex` - Decentralized exchanges
- `lending` - Lending and borrowing protocols
- `wallet` - Wallets
- `explorer` - Blockchain explorers
- `marketplace` - General marketplaces


## See All Link

The "See all" button automatically generates the correct link:

- Single tag: `/apps?tags=dex`
- Multiple tags: `/apps?tags=dex&tags=lending&operator=OR`
- No tags: `/apps`

## Mobile Optimization

The component is fully responsive:

- **Desktop**: 2-line descriptions, larger icons (56px)
- **Mobile**: 1-line descriptions, smaller icons (48px), compact spacing

## Transaction Data

Transaction counts are sourced from `/src/data/app-stats.json` and matched to apps using fuzzy title matching. Apps without transaction data are still displayed but ranked lower (unless marked as favorites).

:::info Want to see your app ranked by transactions?

Learn how to make your app's transactions identifiable on-chain in our [Transaction Rankings Guide](/docs/get-involved/tx-rankings). This helps us track and display accurate transaction counts for your app.

:::

## Icons

Apps can optionally include an `icon` field in `/src/data/apps.js`:

```js
{
  title: "Minswap Dex",
  icon: "/img/app-icons/minswap.svg",
  // ... other fields
}
```

If no icon is provided, the component displays a gradient badge with the first letter of the app name.

## Integration Example

Here's how you might use this component on a landing page:

```jsx
import AppList from '@site/src/components/AppList';

export default function HomePage() {
  return (
    <div>
      <h1>Explore the Cardano Ecosystem</h1>
      
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))' }}>
        <AppList 
          categories={['dex']} 
          limit={5} 
          categoryTitle="Top DEXes" 
          showTxCount={true}
        />
        
        <AppList 
          categories={['wallet']} 
          limit={5} 
          categoryTitle="Wallets" 
        />
      </div>
    </div>
  );
}
```
