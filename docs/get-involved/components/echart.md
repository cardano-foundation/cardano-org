---
title: EChart
description: Render an Apache ECharts chart that follows its option, resizes with the window, and cleans up after itself, using the EChart component on cardano.org.
---

import EChart from '@site/src/components/Layout/EChart';

export const DEMO_OPTION = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    label: { show: false },
    data: [
      { name: 'Delegated', value: 62 },
      { name: 'Not delegated', value: 38 },
    ],
  }],
};

## EChart

`EChart` draws a chart with [Apache ECharts](https://echarts.apache.org/). It creates the chart once, applies the option you pass whenever it changes, resizes it with the window, and disposes of it when the component unmounts. All charts on `/insights` and `/apps/leaderboard` use it.

## When to use

- Any chart on the site. Do not call `echarts.init` in a page, use this component instead.
- You build the option yourself, including theme colors. Read the color mode with `useColorMode()` and rebuild the option when it changes.

## Basic Usage

```jsx
import EChart from '@site/src/components/Layout/EChart';
import { useColorMode } from '@docusaurus/theme-common';

function SupplyChart({ data }) {
  const { colorMode } = useColorMode();
  const option = useMemo(() => {
    if (!data) return null;
    return { /* series, axes, colors for colorMode */ };
  }, [data, colorMode]);

  return (
    <EChart
      option={option}
      height={400}
      ariaLabel={translate({ id: 'myPage.chart.aria', message: 'Ada supply per epoch' })}
    />
  );
}
```

Build the option in `useMemo` or keep it outside the component. A new object on every render applies the option again on every render.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `option` | `object` | - | ECharts option. Applied whenever the object changes, ignored while `null`. |
| `notMerge` | `boolean` | `true` | Replaces the previous option. Pass `false` to merge, which keeps chart state such as the legend selection when the data changes. |
| `lazyUpdate` | `boolean` | `false` | Defers the update to the next animation frame. |
| `onEvents` | `object` | - | Event handlers by ECharts event name, for example `{ click: (params) => … }`. The latest handlers are always used, so they can close over fresh data. |
| `height` | `number` \| `string` | `400px` | Chart height. A number is pixels. |
| `ariaLabel` | `string` | - | Accessible description of the chart. Gives the chart `role="img"`. |
| `className` | `string` | - | Extra class, for example to set the height per breakpoint. |
| `style` | `object` | - | Inline styles, merged with the height. |

## Live Preview

<EChart option={DEMO_OPTION} height={260} ariaLabel="Example donut chart" />

## Events

`onEvents` takes ECharts event names. The `/insights` line charts open the supply page of an epoch on click:

```jsx
const onEvents = {
  click: (params) => {
    const epoch = chartData.epochs[params.dataIndex];
    if (epoch) window.location.href = `/insights/supply?epoch=${epoch}`;
  },
};

<EChart option={option} notMerge={false} lazyUpdate onEvents={onEvents} />
```

## Styling

The height comes from the CSS variable `--echart-height`, which the `height` prop sets. To change the height at a breakpoint, set the variable in your own class instead of passing `height`:

```css
.categoryPie {
  --echart-height: 350px;
}

@media (max-width: 768px) {
  .categoryPie {
    --echart-height: 390px;
  }
}
```

## Accessibility

A canvas chart is invisible to screen readers. Pass `ariaLabel` with a short description of what the chart shows, and put the key numbers in the text around it.

## Related components

- [Treasury Sections](./treasury-sections.md): treasury charts built on EChart.
- [Insights Layout](./insights-layout.md): the page shell for /insights pages.
