---
title: Component Name
description: One sentence on what the component renders and when to use it on cardano.org.
---

{/*
  Template for a component doc page. Copy this file to
  docs/get-involved/components/<kebab-case-name>.md, fill in every section and
  delete what does not apply. Files starting with an underscore are not built,
  so this template never appears on the site.

  Rules that keep the page from going stale:
  - Do not attribute examples to a source file ("from src/pages/x.js"). Pages
    change, the example then points at code that no longer uses the component.
  - Name the pages that use the component only when you checked them with
    `git grep` while writing, and keep the list short.
  - Write prop names exactly as the component destructures them. A module with
    several exports gets one props table per export.
  - The props table lists the same props as the JSDoc block above the
    component.
*/}

import ComponentName from '@site/src/components/Layout/ComponentName';

## ComponentName

What it renders, in two or three sentences. Describe the visible result: layout, heading, button, background it expects.

## When to use

- The situation it is made for.
- When to pick a different component instead, with a link to it.

## Basic Usage

```jsx
import ComponentName from '@site/src/components/Layout/ComponentName';
import { translate } from '@docusaurus/Translate';

<ComponentName
  title={translate({ id: 'myPage.section.title', message: 'Section title' })}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | What it does. Mark required props with *required* in the Default column. |
| `headingLevel` | `number` | `2` | Heading level of the title, `0` renders a non-heading element. The look stays the same. |
| `className` | `string` | - | Extra class on the outer element. |

## Live Preview

Render the component with sample props. Pass `headingLevel={2}` or lower so the doc page keeps a single `<h1>`.

<ComponentName title="Sample title" headingLevel={2} />

When a live preview is not possible, replace this section with one sentence that says why, for example:

- it needs runtime data such as a connected wallet or an API response,
- it changes the document itself, such as meta tags,
- it renders a full page or a full-width page hero.

## Variants

Optional. Show each variant or important prop combination, with a short live preview or snippet.

## Accessibility

- Which element carries the heading, and how the level is chosen.
- Keyboard behavior and ARIA attributes, if the component is interactive.
- Reduced motion, if it animates.

## Translation

- Which strings the consumer passes in already translated.
- Which strings the component translates itself, with their translation IDs.

## Styling

- The classes or CSS variables a page can use to adjust it, and the `className` hook.
- Dark mode behavior.

## Related components

- [Other Component](./other-component.md): when to use it instead.
