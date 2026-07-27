---
title: Open Graph Info
description: Add Open Graph and Twitter card meta tags to a page with the OpenGraphInfo component on cardano.org.
---

import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";

## Open Graph Info

`<OpenGraphInfo>` adds the social-sharing meta tags (Open Graph and Twitter card) for a page, so a link to it shows a proper preview image, title, and description when shared. Add it once near the top of a React page.

## Basic Usage

Image only:

```jsx
<OpenGraphInfo pageName="apps" />
```

With title and description:

```jsx
<OpenGraphInfo
  pageName="apps"
  title="Cardano Apps and dApps"
  description="Discover curated apps live on Cardano mainnet today."
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `pageName` | `string` | Yes | Base name of the preview image. Resolves to `static/img/og/<pageName>.jpg`. |
| `title` | `string` | No | Sets `og:title` and `twitter:title`. Omit to leave the page's own title. |
| `description` | `string` | No | Sets `og:description` and `twitter:description`. |

## Notes

- The preview image **must** live in `static/img/og/` and be a `.jpg` named exactly `<pageName>.jpg`.
- `og:image` and `twitter:image` use the same file; there is no separate Twitter image.
- The canonical `og:url` is derived automatically from the current path, and `og:site_name` from the site config. You do not set these.
- Use `summary_large_image` previews, so design the image for a wide 1.91:1 crop.
