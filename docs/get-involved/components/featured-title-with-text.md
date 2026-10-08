---
title: Featured Title With Text
description: Render a large heading on the left with description, red quote, and button on the right using the FeaturedTitleWithText component on cardano.org.
---

import FeaturedTitleWithText from '@site/src/components/Layout/FeaturedTitleWithText';

## FeaturedTitleWithText

A two-column feature block. The left column holds a large title (an `<h1>` by default, see `headingLevel`), the right column holds one or more description paragraphs, an optional red `<h2>` quote or tagline, and an optional primary button. It opens the main section of `/ouroboros` and structures the sections of `/fees-and-transactions`.

Description paragraphs go through `parseMarkdownLikeText`, so `[label](url)` links and `**bold**` markers are rendered as links and bold text.

## Basic Usage


```jsx
import FeaturedTitleWithText from '@site/src/components/Layout/FeaturedTitleWithText';
import { translate } from '@docusaurus/Translate';

<FeaturedTitleWithText
  title={translate({ id: 'ouroboros.whatIs.title', message: 'What Is Ouroboros?' })}
  description={[
    translate({ id: 'ouroboros.whatIs.description2', message: 'At the heart of Ouroboros is the concept of infinity. Global networks must be able to grow sustainably and ethically: to provide greater opportunities to the world while also preserving it. This becomes possible with Ouroboros.' }),
    translate({ id: 'ouroboros.whatIs.description3', message: 'Ouroboros facilitates the creation and fruition of distributed, permissionless networks capable of sustainably supporting new markets.' }),
  ]}
  quote={translate({ id: 'ouroboros.whatIs.quote', message: 'Ouroboros exists to define the parameters of the new world: a protocol more secure, scalable, and energy-efficient than anything that has come before.' })}
  buttonLabel={translate({ id: 'ouroboros.whatIs.buttonLabel', message: 'Explore the research' })}
  buttonLink="/research#byron"
  headingDot={false}
  headingLevel={2}
/>
```

To force a line break in the quote, pass an array with a `<br />` element:

```jsx
quote={[
  translate({ id: 'myPage.featured.quote1', message: 'First line,' }),
  <br key="line1" />,
  translate({ id: 'myPage.featured.quote2', message: 'second line' }),
]}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | The large heading in the left column. Always rendered. |
| `description` | `string` \| `string[]` | - | One paragraph, or one paragraph per array entry, in the right column. Parsed for markdown-style links and bold text. |
| `quote` | `string` \| `node[]` | - | Optional red `<h2>` below the description. Without it no quote heading renders. An array of strings and elements is allowed. |
| `buttonLabel` | `string` | - | Label of the primary button. The button only renders when both `buttonLabel` and `buttonLink` are set. |
| `buttonLink` | `string` | - | Target of the button. |
| `headingDot` | `boolean` | - | Adds the `headingDot` class to the title. |
| `headingLevel` | `number` | `1` | Heading level of the title, 1 to 6. The look stays the same, so the level can follow the page outline, for example `2` below a page hero. |
| `className` | `string` | - | Extra class on the outer element. |

## Live Preview

<FeaturedTitleWithText
  title="What Is Ouroboros?"
  description={[
    "Ouroboros is the first provably secure proof-of-stake protocol, and the first blockchain protocol to be based on [peer-reviewed research](/research).",
    "Ouroboros facilitates the creation and fruition of distributed, permissionless networks capable of sustainably supporting new markets.",
  ]}
  quote="A protocol more secure, scalable, and energy-efficient than anything that has come before."
  buttonLabel="Explore the research"
  buttonLink="/research"
  headingDot={true}
  headingLevel={2}
/>

## Notes

- Consumers pass already translated strings. Markdown-style links inside a translated message survive translation, so keep the link syntax in the `message`.
- The description paragraphs use the `black-text` class and the quote uses `red-text`, both defined in the global CSS.
- For a lighter heading plus text block without the quote and the two-column split, use [Title With Text](./title-with-text.md).
