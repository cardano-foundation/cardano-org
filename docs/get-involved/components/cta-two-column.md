---
title: CTA Two Column
description: Render a two-column call to action with independent title, text, and white button per column using the CtaTwoColumn component on cardano.org.
---

import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import CtaTwoColumn from '@site/src/components/Layout/CtaTwoColumn';

## CtaTwoColumn

Two side-by-side columns, each with an optional heading, optional text, and an optional white button. Every part is controlled separately through `left*` and `right*` props. The wrapper sets white text, so place it inside a dark or colored [Background Wrapper](./background-wrapper.md).

The column split adapts to the content. When the right column has a title or text, both columns are `col--6`. When the right column only holds a button (or nothing), the left column widens to `col--7` and the right narrows to `col--5`.

Used on `/exchanges` and `/stake-pool-operation`.

## Basic Usage

Two full columns:

```jsx
import CtaTwoColumn from '@site/src/components/Layout/CtaTwoColumn';
import { translate } from '@docusaurus/Translate';

<CtaTwoColumn
  headingLevel={2}
  leftTitle={translate({ id: "exchanges.learnMore.leftTitle", message: "Exchange integration guide" })}
  leftText={translate({ id: "exchanges.learnMore.leftText", message: "Step-by-step guidance for custodians and listing platforms. Covers the accounting model, transaction handling, native assets, and upgrade practices." })}
  leftButtonLabel={translate({ id: "exchanges.learnMore.leftButtonLabel", message: "Read the full guide" })}
  leftButtonLink="https://developers.cardano.org/docs/build/integrate/exchange-integrations/"
  leftHeadingDot={false}
  rightTitle={translate({ id: "exchanges.learnMore.rightTitle", message: "Integration components overview" })}
  rightText={translate({ id: "exchanges.learnMore.rightText", message: "A shorter reference listing the components used to integrate Cardano into websites, services, and back-office systems." })}
  rightButtonLabel={translate({ id: "exchanges.learnMore.rightButtonLabel", message: "Browse the components" })}
  rightButtonLink="https://developers.cardano.org/docs/build/integrate/overview/"
  rightHeadingDot={false}
/>
```

Text on the left, a centered button on the right:

```jsx
<CtaTwoColumn
  headingLevel={2}
  leftTitle={translate({ id: 'stakePoolOperation.setupCta.title', message: 'How do I set up a stake pool?' })}
  leftText={translate({ id: 'stakePoolOperation.setupCta.text2', message: 'Anybody can learn how to operate a stake pool, but a degree of technical familiarity and knowledge is required.' })}
  leftHeadingDot={true}
  rightButtonLabel={translate({ id: 'stakePoolOperation.setupCta.buttonLabel', message: 'Learn how' })}
  rightButtonLink="https://developers.cardano.org/docs/operators/"
  rightButtonAlign="center"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leftTitle` | `string` | - | Optional title in the left column, an `<h1>` by default (see `headingLevel`). |
| `leftText` | `string` \| `string[]` | - | Optional text in the left column. A string renders one `<p>`, an array renders one `<p>` per entry. Plain strings, no markdown parsing. |
| `leftButtonLabel` | `string` | - | Optional. When set, a white button renders in the left column. |
| `leftButtonLink` | `string` | - | Target of the left button. |
| `leftHeadingDot` | `boolean` | - | Adds the `headingDot` class to the left title. |
| `leftButtonAlign` | `string` | - | `'center'` centers the left button. Any other value keeps the default left alignment. |
| `rightTitle` | `string` | - | Optional title in the right column, an `<h1>` by default (see `headingLevel`). |
| `rightText` | `string` \| `string[]` | - | Optional text in the right column, same rules as `leftText`. |
| `rightButtonLabel` | `string` | - | Optional. When set, a white button renders in the right column. |
| `rightButtonLink` | `string` | - | Target of the right button. |
| `rightHeadingDot` | `boolean` | - | Adds the `headingDot` class to the right title. |
| `rightButtonAlign` | `string` | - | `'center'` centers the right button. Any other value keeps the default left alignment. |
| `headingLevel` | `number` | `1` | Heading level of the left and right titles, 1 to 6. The look stays the same, so the level can follow the page outline, for example `2` below a page hero. |
| `className` | `string` | - | Extra class on the outer element. |

## Live Preview

<BackgroundWrapper backgroundType="solidBlue">
  <BoundaryBox>
    <CtaTwoColumn
      leftTitle="Cardano Wallets"
      leftText="Discover a wide variety of wallets designed to facilitate your interaction with the Cardano ecosystem."
      leftHeadingDot={true}
      rightButtonLabel="Discover Now"
      rightButtonLink="/what-is-ada#wallets"
      rightButtonAlign="center"
      headingLevel={2}
    />
  </BoundaryBox>
</BackgroundWrapper>

## Notes

- Consumers pass already translated strings. The component contains no text of its own.
- Unlike [Dotted Image With Text](./dotted-image-with-text.md), the text here is rendered as is. Markdown-style links or bold markers appear literally.
- Both columns stack vertically on narrow screens through the Infima `row` and `col` classes.
- For a single centered call to action, see [CTA One Column](./cta-one-column.md).
