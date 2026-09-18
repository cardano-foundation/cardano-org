---
title: Status Pill
description: Small colour-coded label for a lifecycle or availability state using the StatusPill component.
---

import StatusPill from '@site/src/components/Layout/StatusPill';

## StatusPill

A compact, rounded label with a leading dot, for states such as "Open", "Recurring", or "Live on mainnet". The `tone` picks the colour from the semantic tokens; the text is whatever you pass in, already translated. Used by the program cards and dialog on the [grants and funding page](/grants-funding).

## Basic Usage

```jsx
import StatusPill from '@site/src/components/Layout/StatusPill';

<StatusPill tone="success" label="Live on mainnet" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Visible text. Pass a translated string. |
| `tone` | `'info' \| 'success' \| 'warning' \| 'neutral'` | `'neutral'` | Colour of the pill. Unknown values fall back to neutral. |
| `className` | `string` | - | Extra class for layout tweaks, for example margins. |

## Tones

| Tone | Token | Typical use |
|------|-------|-------------|
| `info` | `--ifm-color-primary` on `--site-tint-strong` | Work in progress, informational states. |
| `success` | `--site-success` | Live, open, enacted. |
| `warning` | `--site-warning` | Upcoming deadlines, pending decisions. |
| `neutral` | Infima emphasis scale | Planned, closed, or unknown. |

The tints are mixed from the tokens with `color-mix()`, so the pill follows the theme in light and dark mode without extra colours.

## Live Preview

<div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
  <StatusPill tone="info" label="In development" />
  <StatusPill tone="success" label="Live on mainnet" />
  <StatusPill tone="warning" label="Closes September 30" />
  <StatusPill tone="neutral" label="Planned" />
</div>
