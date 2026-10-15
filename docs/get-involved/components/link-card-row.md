---
title: Link Card Row
description: End a page with a centered row of link cards that point to related pages, using the LinkCardRow component on cardano.org.
---

import LinkCardRow from '@site/src/components/Layout/LinkCardRow';

## LinkCardRow

`LinkCardRow` shows a centered row of small cards, each one a text link to a related page. The cards wrap onto more rows on narrow screens and lift slightly on hover. `/governance/accountability` and `/governance/treasury` end with one.

## When to use

- A short list of "where to go next" links at the end of a page, three or four is the usual count.
- For links with an icon, a title and a description, or a button, use cards of your own in a [Grid](./grid.md), like the learning paths on `/learn`.
- For a single call to action with a button, use a [Page CTA](./page-cta.md).

## Basic Usage

```jsx
import LinkCardRow from '@site/src/components/Layout/LinkCardRow';
import { translate } from '@docusaurus/Translate';

<LinkCardRow
  items={[
    { to: '/constitution', label: translate({ id: 'myPage.out.constitution', message: 'Read the full Constitution' }) },
    { to: '/governance/delegate', label: translate({ id: 'myPage.out.delegate', message: 'Choose or change your DRep' }) },
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{ to, label }[]` | *required* | The cards in order. `to` is the link target, also used as the React key, so keep it unique in a row. `label` is the translated text. An empty array renders an empty row. |
| `className` | `string` | - | Extra class on the row. |

## Live Preview

<LinkCardRow
  items={[
    { to: '/constitution', label: 'Read the full Constitution' },
    { to: '/governance/delegate', label: 'Choose or change your DRep' },
    { to: '/insights/governance-actions', label: 'Explore governance action charts' },
  ]}
/>

## Notes

- Cards are at least 220px and at most 320px wide, so a row holds three or four cards on a desktop screen.
- `to` goes through Docusaurus `Link`, so site paths and hash links work in every locale and external URLs open in a new tab.
- The row takes `items` instead of children, because every card has the same look and only target and text change.
- On hover a card lifts by 2px. With reduced motion it does not move.
