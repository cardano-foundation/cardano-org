---
sidebar_label: Component Guidelines
sidebar_position: 14
title: Component Guidelines
description: Conventions for building components and pages on cardano.org, dark mode, images, links, translation, and accessibility.
---

Follow these conventions when you add a component or build a page. They keep the site consistent, translatable, and accessible, and several are enforced in CI.

## Reuse before you create

Before writing a new component, check [`src/components/Layout/`](https://github.com/cardano-foundation/cardano-org/tree/staging/src/components/Layout) for an existing primitive. Most pages are composed from [Site Hero](./components/site-hero.md), [Boundary Box](./components/boundary-box.md), [Title With Text](./components/title-with-text.md), [Divider](./components/divider.md), and [Spacer Box](./components/spacer-box.md). Only create a new component when nothing fits and the result is reusable. A one-off layout for a single page usually does not need its own component.

When you do add a reusable component, document it with a page under `docs/get-involved/components/`.

## Styling: use tokens

Style with the [design tokens](./design-tokens.md) rather than hardcoded values. Put component styles in a co-located `styles.module.css` (CSS Modules), and use the shared `--site-*` and `--ifm-*` variables for color, spacing, radius, shadow, and motion.

`yarn test:css` fails the build on undefined variables and known breakpoint typos, so keep to the documented scales.

## Dark mode is required

Every component must be legible in both light and dark mode. This is free if you use tokens and Infima's neutral scale (`--ifm-color-emphasis-*`, `--ifm-background-surface-color`), because those invert automatically.

The common bug is a hardcoded light surface with theme-aware text:

```css
/* Wrong: white never inverts, so text disappears in dark mode */
.box { background: white; color: var(--ifm-color-emphasis-900); }

/* Right: the surface inverts with the theme */
.box { background: var(--ifm-background-surface-color); color: var(--ifm-color-emphasis-900); }
```

Check your work by toggling the theme switch in the navbar.

## Images: resolve with base URL

Non-default locales are served under a path prefix (`/de/`, `/ja/`). A hardcoded `/img/...` path breaks there. Resolve image paths through Docusaurus:

```jsx
import useBaseUrl from "@docusaurus/useBaseUrl";

<img src={useBaseUrl("/img/example.png")} alt="Example" />
```

## Internal links: use Link

Use the Docusaurus `<Link>` component for internal navigation, never a raw `<a href>`. `<Link>` keeps client-side routing and the active locale prefix; a raw anchor triggers a full reload and drops the locale.

```jsx
import Link from "@docusaurus/Link";

<Link to="/governance">Governance</Link>
```

## Translatable text

Wrap any new user-facing string so it can be translated. Do not hardcode English in JSX.

```jsx
import Translate, { translate } from "@docusaurus/Translate";

// As an element
<Translate id="home.hero.title">A new way to transact</Translate>

// Where a plain string is needed (props, alt text)
alt={translate({ id: "home.hero.alt", message: "Cardano logo" })}
```

Translations themselves are managed through Crowdin, not by editing locale files directly.

## Accessibility

Accessibility rules (`jsx-a11y`) run in CI and block the build when violated.

- Use a real `<button>` or `<Link>` for anything clickable. If you must attach `onClick` to a `<div>`, add `role`, `tabIndex={0}`, and a keyboard handler.
- Do not remove focus outlines. The global `:focus-visible` baseline gives every control a consistent ring; keep it.
- Give images meaningful `alt` text, and mark purely decorative images `aria-hidden`.
