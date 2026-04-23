---
title: Connection Line
description: Draw decorative connecting lines between page sections with the ConnectionLine component on cardano.org.
---

import ConnectionLine from '@site/src/components/Layout/ConnectionLine';

## ConnectionLine

A subtle dotted connector with optional endpoint dots. Use it to visually link related cards in flows, steppers, timelines, or relationship diagrams.

## Basic Usage

```jsx
import ConnectionLine from '@site/src/components/Layout/ConnectionLine';

<ConnectionLine direction="horizontal" />
<ConnectionLine direction="vertical" withDots={false} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation of the line. Vertical needs a height-providing parent. |
| `withDots` | `boolean` | `true` | Show small dots at each end of the line. |
| `className` | `string` | – | Additional class name on the root span. |
| `style` | `object` | – | Inline style passed to the root span (useful for setting custom length). |

## Live Preview

**Horizontal**

<div style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0'}}>
  <span>A</span>
  <ConnectionLine direction="horizontal" style={{width: '120px'}} />
  <span>B</span>
</div>

**Vertical**

<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem 0'}}>
  <span>A</span>
  <ConnectionLine direction="vertical" style={{height: '60px'}} />
  <span>B</span>
</div>

## Notes

- Color is derived from a CSS custom property `--connection-color` that you can override on the parent for theming.
- The line is decorative; the component sets `aria-hidden="true"`.
