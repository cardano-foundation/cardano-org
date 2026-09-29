---
title: Insights Footer
description: Show the last-updated line at the end of an /insights page using the InsightsFooter component on cardano.org.
---

import InsightsFooter from '@site/src/components/Layout/InsightsFooter';

## InsightsFooter

A small `<footer>` with a top border and the translated sentence `Last updated: {lastUpdated}. Charts are using real time data.` Pages whose charts come from static data pass `liveData={false}` and get `Last updated: {lastUpdated}.` without the real-time claim. It is only meaningful as the last child of an [Insights Layout](./insights-layout.md) page and is used on every page under `/insights`.

## Basic Usage

A fixed date from the page's `meta`, as in `src/pages/insights/template/index.js`:

```jsx
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';

<InsightsFooter lastUpdated={meta.date} />
```

A live value, as in `src/pages/insights/supply/index.js`, where the date and epoch come from the fetched data:

```jsx
<InsightsFooter lastUpdated={`${epochDate} (epoch ${displayedEpoch})`} />
```

Static chart data, as in `src/pages/insights/governance-actions/index.js`, where `meta.updated` holds the date of the last data change:

```jsx
<InsightsFooter lastUpdated={meta.updated} liveData={false} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lastUpdated` | `string` | - | Inserted verbatim into the sentence in place of `{lastUpdated}`. Pass a preformatted date string. |
| `liveData` | `boolean` | `true` | When `false`, the sentence drops "Charts are using real time data." Use it for pages that render static data. |

## Live Preview

<InsightsFooter lastUpdated="2025-03-17" />

## Notes

- The sentence itself is translated inside the component (`insights.footer.text`, or `insights.footer.textStatic` with `liveData={false}`), so consumers only pass the date value.
- Any extra props are ignored. Some pages pass an `epoch` prop, which the component does not read.
- The footer is styled inline with theme tokens (`--ifm-toc-border-color`, `--ifm-color-content-secondary`), so it needs no CSS module and works in dark mode.
