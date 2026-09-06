---
title: Two Column Box
description: Render two columns of plain paragraphs that collapse to one on small screens using the TwoColumnBox component on cardano.org.
---

import TwoColumnBox from '@site/src/components/Layout/TwoColumnBox';

## TwoColumnBox

Two equal text columns (`col--6` each) that stack into one column on narrow screens. Each side takes a string or an array of strings and renders one paragraph per entry. No title, no markdown parsing.

Used on `/stake-pool-delegation` and `/stake-pool-operation`, usually right after a [Divider](./divider.md).

## Basic Usage

From `src/pages/stake-pool-delegation.js`. The page only fills the left column, which leaves the right half empty and keeps the paragraph at reading width:

```jsx
import Divider from '@site/src/components/Layout/Divider';
import TwoColumnBox from '@site/src/components/Layout/TwoColumnBox';
import { translate } from '@docusaurus/Translate';

<Divider text={translate({ id: 'stakePoolDelegation.whatIsDelegation.divider', message: 'What is stake delegation?' })} />
<TwoColumnBox
  leftText={[
    translate({ id: 'stakePoolDelegation.whatIsDelegation.text', message: 'Delegation is the process by which ada holders delegate the stake associated with their ada to a stake pool. It allows ada holders that do not have the skills or desire to run a node to participate in the network and be rewarded in proportion to the amount of stake delegated.' }),
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leftText` | `string` \| `string[]` | - | Text for the left column. A string renders one `<p>`, an array renders one `<p>` per entry. Plain strings, no markdown parsing. |
| `rightText` | `string` \| `string[]` | - | Text for the right column, same rules as `leftText`. |

## Live Preview

<TwoColumnBox
  leftText="Delegation is the process by which ada holders delegate the stake associated with their ada to a stake pool."
  rightText={[
    "It allows ada holders that do not have the skills or desire to run a node to participate in the network.",
    "They are rewarded in proportion to the amount of stake delegated.",
  ]}
/>

## Notes

- Consumers pass already translated strings.
- An omitted side still renders an empty `<p>` inside its column, which is harmless but means the layout stays two columns wide.
- The text color is inherited, so the box works on light and dark backgrounds.
- For a single full-width column, see [One Column Box](./one-column-box.md).
