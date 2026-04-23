---
title: Highlight Callout
---

import HighlightCallout from '@site/src/components/Layout/HighlightCallout';
import { FaShieldAlt, FaInfoCircle } from 'react-icons/fa';

## HighlightCallout

A soft tinted strip with an optional icon and free-form content. Use it for short summaries, key takeaways, or governance statements that should stand apart from surrounding text.

## Basic Usage

```jsx
import HighlightCallout from '@site/src/components/Layout/HighlightCallout';
import { FaShieldAlt } from 'react-icons/fa';

<HighlightCallout icon={<FaShieldAlt />}>
  Together, they represent, validate, and safeguard Cardano governance.
  No single group can make decisions alone.
</HighlightCallout>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | – | Icon shown in a tinted circle on the left. Omit for a text-only callout. |
| `children` | `ReactNode` | – | Body content (plain text, paragraphs, or any React node). |
| `className` | `string` | – | Additional class name on the root element. |

## Live Preview

<HighlightCallout icon={<FaShieldAlt />}>
  Together, they represent, validate, and safeguard Cardano governance.
  No single group can make decisions alone.
</HighlightCallout>

<br />

<HighlightCallout icon={<FaInfoCircle />}>
  This component pairs well with sections that explain ecosystem roles or principles.
</HighlightCallout>
