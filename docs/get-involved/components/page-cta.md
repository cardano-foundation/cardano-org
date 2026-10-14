---
title: Page CTA
description: Close a page with a full-width call to action band that has a title, a description, and one or two buttons, using the PageCTA component on cardano.org.
---

import PageCTA from '@site/src/components/Layout/PageCTA';

## PageCTA

A full-width band that closes a page with a short call to action. It renders its own section and container, so it does not need a [Boundary Box](./boundary-box.md) around it. Unlike [CTA One Column](./cta-one-column.md), it works on the normal page background and does not need a dark [Background Wrapper](./background-wrapper.md).

## Basic Usage

```jsx
import PageCTA from "@site/src/components/Layout/PageCTA";

<PageCTA
  title="Built something on Cardano?"
  description="Add your app to this page. The submission process is open and lightweight."
  href="/docs/get-involved/add-app"
  buttonText="Submit your app"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Heading of the band, rendered as an h2. |
| `description` | `string` | - | Text below the heading. |
| `href` | `string` | - | Target of the main button. |
| `buttonText` | `string` | - | Label of the main button. |
| `secondaryButton` | `{ href, label }` | `null` | Optional outline button next to the main one. |
| `variant` | `string` | `"secondary"` | `"secondary"` renders a neutral band with grey buttons, `"primary"` uses brand blue buttons. |

## Live Preview

<PageCTA
  title="Built something on Cardano?"
  description="Add your app to this page. The submission process is open and lightweight."
  href="/docs/get-involved/add-app"
  buttonText="Submit your app"
  secondaryButton={{ href: "/apps", label: "Browse apps" }}
/>

## Notes

- Use it once per page, at the end. For calls to action inside a dark section, use [CTA One Column](./cta-one-column.md) or [CTA Two Column](./cta-two-column.md).
- Pass translated strings, for example through `translate()`, as the [apps page](/apps) does.
