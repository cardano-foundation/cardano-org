---
title: Stats Bar
description: One elevated bar of headline figures, each a big value over a short label, using the StatsBar component.
---

## StatsBar

A row of figures in one elevated bar: the headline numbers on the [grants and funding page](/grants-funding) and the "live today" strip on the [roadmap](/roadmap). Values are rendered as given, so they are in the server HTML for crawlers and readers without JavaScript. On screens under 768px the figures stack.

## Basic Usage

```jsx
import StatsBar from '@site/src/components/Layout/StatsBar';

<StatsBar
  ariaLabel="Funding at a glance"
  items={[
    { key: "total", value: "$200M+", label: "Committed to builders" },
    { key: "programs", value: "10", label: "Programs" },
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ key, value, label, extra? }>` | - | One figure each. `value` and `label` are strings or nodes; `extra` renders after the value, for example an info button or a StatusPill. |
| `ariaLabel` | `string` | - | Name of the group for assistive technology. |

## Files

| File | Role |
|------|------|
| `src/components/Layout/StatsBar/index.js` | The bar. |
| `src/components/Layout/StatsBar/styles.module.css` | Tokens only. |
