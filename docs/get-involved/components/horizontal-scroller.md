---
title: Horizontal Scroller
description: Lay out cards in a horizontal scroll-snap track with arrows on desktop and dots on mobile using the HorizontalScroller component on cardano.org.
---

import HorizontalScroller from '@site/src/components/HorizontalScroller';

## HorizontalScroller

A generic carousel track. Each child becomes one snap item in a horizontally scrolling `<ul>`. On screens wider than 600px, previous and next arrow buttons scroll by one item and disable at either end. On smaller screens the arrows hide, the track bleeds to the viewport edges with a fade mask, and a row of progress dots shows the position.

It drives the app tile carousel and the category panels on `/apps`, and the featured and recap event rows on `/events`. The component is memoized.

## Basic Usage

From `src/components/Events/FeaturedEvents/index.js`:

```jsx
import HorizontalScroller from '@site/src/components/HorizontalScroller';
import { translate } from '@docusaurus/Translate';

<HorizontalScroller
  ariaLabel={translate({ id: 'events.featured.title', message: 'Featured upcoming events' })}
  prevLabel={translate({ id: 'events.carousel.prev', message: 'Previous' })}
  nextLabel={translate({ id: 'events.carousel.next', message: 'Next' })}
>
  {events.map((event) => (
    <FeaturedEventCard key={event.title} event={event} labels={labels} />
  ))}
</HorizontalScroller>
```

With narrower items, from `src/components/AppTileCarousel/index.js`:

```jsx
<HorizontalScroller
  ariaLabel={ariaLabel}
  prevLabel={translate({ id: "apps.carousel.prev", message: "Previous" })}
  nextLabel={translate({ id: "apps.carousel.next", message: "Next" })}
  gap="1rem"
  itemWidth="260px"
  itemWidthMobile="220px"
>
  {apps.map((app) => (
    <AppTile key={app.slug} app={app} />
  ))}
</HorizontalScroller>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The items. Each direct child is wrapped in its own `<li>` snap item and stretched to full height. |
| `ariaLabel` | `string` | - | `aria-label` of the `role="region"` wrapper. Pass a translated string. |
| `prevLabel` | `string` | - | `aria-label` of the previous arrow button. Pass a translated string. |
| `nextLabel` | `string` | - | `aria-label` of the next arrow button. Pass a translated string. |
| `gap` | `string` | - | Overrides the `--hs-gap` custom property. The CSS falls back to `1.5rem`. |
| `itemWidth` | `string` | - | Overrides the `--hs-item-width` custom property. The CSS falls back to `300px`. |
| `itemWidthMobile` | `string` | - | Overrides the `--hs-item-width-mobile` custom property, used up to 600px. The CSS falls back to `260px`. |

## Live Preview

<HorizontalScroller ariaLabel="Example scroller" prevLabel="Previous" nextLabel="Next" itemWidth="220px" itemWidthMobile="180px">
  {[1, 2, 3, 4, 5, 6].map((n) => (
    <div key={n} style={{padding: '2rem 1rem', textAlign: 'center', borderRadius: '12px', border: '1px solid var(--ifm-color-emphasis-300)', background: 'var(--ifm-background-surface-color)'}}>
      Item {n}
    </div>
  ))}
</HorizontalScroller>

## Notes

- The three size props are applied as inline CSS custom properties, so they accept any CSS length.
- The scroll position resets to the start whenever the number of children changes.
- Scroll state is measured with a layout effect that only runs in the browser, so the component is safe for server-side rendering.
- The arrows are real `<button>` elements with focus styles, and the dots are `aria-hidden`, so keyboard users navigate through the items themselves.
