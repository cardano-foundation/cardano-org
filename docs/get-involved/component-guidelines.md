---
sidebar_label: Component Guidelines
sidebar_position: 14
title: Component Guidelines
description: Conventions for building components and pages on cardano.org, dark mode, images, links, translation, and accessibility.
---

Follow these conventions when you add a component or build a page. They keep the site consistent, translatable, and accessible, and several are enforced in CI.

## Reuse before you create

Shared components are the default. Before you write a component or page markup, look up what already exists in the [component overview](./components/index.md). Most pages are composed from [Site Hero](./components/site-hero.md), [Boundary Box](./components/boundary-box.md), [Title With Text](./components/title-with-text.md), [Divider](./components/divider.md), and [Spacer Box](./components/spacer-box.md).

If a component almost fits, extend it with an additive prop that leaves existing pages unchanged. Do not copy it into a slightly different version.

### Where a component belongs

| Kind | Location | When | Requirements |
|---|---|---|---|
| Shared component | `src/components/Layout/` | A generic layout or UI pattern with no topic of its own, such as a section title, divider, tabs, accordion, or modal | JSDoc for its props, a doc page under `docs/get-involved/components/`, a row in the overview table |
| Feature widget | `src/components/<Name>/` | Reusable within one topic, such as App Tile or Quiz | JSDoc for its props, a doc page |
| Page-specific component | `src/components/<PageName>/` | Only for an interactive tool (data visualization, wallet or chain flow, calculator, search) or deliberate art direction used on one page | A short explanation in the pull request of why no existing component fits. Its inner parts, such as titles, grids, and FAQ lists, still come from shared components |

Do not add page CSS for a pattern that a shared component already covers, such as a card grid, a section heading block, or an FAQ list. Page CSS is fine for art direction and fine-tuning.

If you are unsure whether something should become a shared component, ask in the issue or pull request before you build it.

### Document props with JSDoc

Describe the props of every shared component and feature widget in a JSDoc block above the component, so editors and AI agents see them where the code is:

```jsx
/**
 * Section title with body text and an optional call to action.
 *
 * @param {object} props
 * @param {string} props.title Heading text.
 * @param {string|Array|object} [props.description] Body text as a string, an array of paragraphs, or `{ list: [...] }`.
 * @param {string} [props.buttonLabel] Label of the optional button.
 * @param {string} [props.buttonLink] Target of the optional button.
 */
export default function TitleWithText({ title, description, buttonLabel, buttonLink }) {
```

The props table on the component's doc page lists the same props.

### Write the doc page from the template

Start a new doc page from `docs/get-involved/components/_template.md`. Files that start with an underscore are not built, so the template only exists in the repository. A doc page covers:

- what the component renders and when to use it, with a link to the alternative,
- a usage example with translated strings,
- a props table that matches the JSDoc block,
- a live preview, or one sentence on why there is none (runtime data such as a wallet or an API response, changes to the document head, a full page or homepage hero),
- accessibility, translation, and styling notes, and related components.

Do not attribute examples to a page file ("from `src/pages/x.js`"), because those examples go stale when the page changes. Name the pages that use a component only after checking them with `git grep`. Write prop names exactly as the component destructures them, with one props table per export for a module with several exports. Live previews pass `headingLevel={2}` or a deeper level, so the doc page keeps a single `<h1>`.

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
