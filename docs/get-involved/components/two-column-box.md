---
title: Two Column Box
description: Render two columns of plain paragraphs that collapse to one on small screens using the TwoColumnBox component on cardano.org.
---

import TwoColumnBox from '@site/src/components/Layout/TwoColumnBox';

## TwoColumnBox

Two equal text columns (`col--6` each) that stack into one column on narrow screens. Each side takes a string or an array and renders one paragraph per entry. There is no title. The component does not parse markdown itself, so pass the entries through `parseMarkdownLikeText` when they contain links or bold text.

Used on `/stake-pool-operation`, right after a [Divider](./divider.md).

## Basic Usage

```jsx
import Divider from '@site/src/components/Layout/Divider';
import TwoColumnBox from '@site/src/components/Layout/TwoColumnBox';
import { parseMarkdownLikeText } from '@site/src/utils/textUtils';
import { translate } from '@docusaurus/Translate';

<Divider headingLevel={2} text={translate({ id: 'myPage.staking.divider', message: 'What is staking?' })} />
<TwoColumnBox
  leftText={parseMarkdownLikeText([
    translate({ id: 'myPage.staking.leftText', message: 'Ada held on the Cardano network represents a stake in the network, with the size of the stake proportional to the amount of ada held.' }),
  ])}
  rightText={parseMarkdownLikeText([
    translate({ id: 'myPage.staking.rightText1', message: 'There are two ways an ada holder can earn rewards: by delegating their stake to a [stake pool](/glossary/stake-pool) run by someone else, or by running their own stake pool.' }),
  ])}
/>
```

Fill only `leftText` to keep a single paragraph at reading width with the right half empty.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leftText` | `string` \| `node` \| `array` | - | Text for the left column. An array renders one `<p>` per entry, anything else renders one `<p>`. Strings are shown as is, wrap them in `parseMarkdownLikeText` for links and bold text. |
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
