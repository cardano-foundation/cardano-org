---
title: One Column Box
description: Render one or more plain paragraphs in a full-width column using the OneColumnBox component on cardano.org.
---

import OneColumnBox from '@site/src/components/Layout/OneColumnBox';

## OneColumnBox

A full-width text block. It takes a string or an array and renders each entry as a paragraph inside an Infima `col--12` column. There is no title and no styling beyond the column. The component does not parse markdown itself, so pass the entries through `parseMarkdownLikeText` when they contain links or bold text. It is the simplest way to place body copy between other layout components.

Used on `/stake-pool-operation`.

## Basic Usage

```jsx
import OneColumnBox from '@site/src/components/Layout/OneColumnBox';
import { parseMarkdownLikeText } from '@site/src/utils/textUtils';
import { translate } from '@docusaurus/Translate';

<OneColumnBox
  text={parseMarkdownLikeText([
    translate({ id: 'myPage.stakePool.text1', message: 'Stake pools may be either public or private. A public stake pool is a Cardano network node with a public address that other users can delegate to, and receive rewards.' }),
    translate({ id: 'myPage.stakePool.text2', message: 'The more stake that is delegated to a stake pool, the greater chance it has of being selected as a [slot leader](/glossary/slot-leader).' }),
  ])}
/>
```

Without links or bold text, pass the strings directly: `text={[translate(...), translate(...)]}`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` \| `node` \| `array` | - | The paragraph text. An array renders one `<p>` per entry, anything else renders one `<p>`. Strings are shown as is, wrap them in `parseMarkdownLikeText` for links and bold text. |

## Live Preview

<OneColumnBox
  text={[
    "Ada held on the Cardano network represents a stake in the network, with the size of the stake proportional to the amount of ada held.",
    "There are two ways an ada holder can earn rewards: by delegating their stake to a stake pool run by someone else, or running their own stake pool.",
  ]}
/>

## Notes

- Consumers pass already translated strings.
- The text color is inherited, so the box works on light and dark backgrounds alike.
- For a block with a section title, use [Title With Text](./title-with-text.md), which also parses markdown-like syntax on its own.
- For two columns of text, see [Two Column Box](./two-column-box.md).
