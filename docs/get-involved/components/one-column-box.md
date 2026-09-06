---
title: One Column Box
description: Render one or more plain paragraphs in a full-width column using the OneColumnBox component on cardano.org.
---

import OneColumnBox from '@site/src/components/Layout/OneColumnBox';

## OneColumnBox

A full-width text block. It takes a string or an array of strings and renders each as a paragraph inside an Infima `col--12` column. There is no title, no styling beyond the column, and no markdown parsing. It is the simplest way to place body copy between other layout components.

Used on `/stake-pool-delegation` and `/stake-pool-operation`.

## Basic Usage

From `src/pages/stake-pool-delegation.js`:

```jsx
import OneColumnBox from '@site/src/components/Layout/OneColumnBox';
import { translate } from '@docusaurus/Translate';

<OneColumnBox
  text={[
    translate({ id: 'stakePoolDelegation.whatIsStake.text1', message: 'Ada held on the Cardano network represents a stake in the network, with the size of the stake proportional to the amount of ada held. The ability to delegate or pledge a stake is fundamental to how Cardano works.' }),
    translate({ id: 'stakePoolDelegation.whatIsStake.text2', message: 'There are two ways an ada holder can earn rewards: by delegating their stake to a stake pool run by someone else, or running their own stake pool.' }),
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` \| `string[]` | - | The paragraph text. A string renders one `<p>`, an array renders one `<p>` per entry. Plain strings, no markdown parsing. |

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
- For links or bold text inside the copy, use [Title With Text](./title-with-text.md), which parses markdown-like syntax.
- For two columns of text, see [Two Column Box](./two-column-box.md).
