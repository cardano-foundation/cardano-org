---
title: Component Name
description: One sentence on what the component renders and when to use it on cardano.org.
---

{/*
  Template for a component doc page. Copy this file to
  docs/get-involved/components/<kebab-case-name>.md, fill in every section and
  delete what does not apply. The rules for doc pages are in
  docs/get-involved/component-guidelines.md, section "Write the doc page from
  the template".
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
| `headingLevel` | `number` | `1` | Heading level of the title, 1 to 6. The look stays the same. |
| `className` | `string` | - | Extra class on the outer element. |

## Live Preview

<ComponentName title="Sample title" headingLevel={2} />

Without a live preview, replace this section with one sentence that says why.

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
