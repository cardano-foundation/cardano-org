---
title: Featured Title With Text
description: Render a large heading on the left with description, red quote, and button on the right using the FeaturedTitleWithText component on cardano.org.
---

import FeaturedTitleWithText from '@site/src/components/Layout/FeaturedTitleWithText';

## FeaturedTitleWithText

A two-column feature block. The left column holds a large `<h1>`, the right column holds one or more description paragraphs, a red `<h2>` quote or tagline, and an optional primary button. It is the opening block of the homepage and of `/ouroboros`.

Description paragraphs go through `parseMarkdownLikeText`, so `[label](url)` links and `**bold**` markers are rendered as links and bold text.

## Basic Usage

From `src/pages/ouroboros.js`:

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
/>
```

The homepage (`src/pages/index.js`) passes the quote as an array with a `<br />` element to force a line break:

```jsx
quote={[
  translate({ id: 'home.featured.quote1', message: 'A History Of Impossible,' }),
  <br key="line1" />,
  translate({ id: 'home.featured.quote2', message: 'Made Possible' }),
]}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | The large heading in the left column. Always rendered. |
| `description` | `string` \| `string[]` | - | One paragraph, or one paragraph per array entry, in the right column. Parsed for markdown-style links and bold text. |
| `quote` | `string` \| `node[]` | - | Red `<h2>` below the description. Always rendered, so pass a value. An array of strings and elements is allowed. |
| `buttonLabel` | `string` | - | Label of the primary button. The button only renders when both `buttonLabel` and `buttonLink` are set. |
| `buttonLink` | `string` | - | Target of the button. |
| `headingDot` | `boolean` | - | Adds the `headingDot` class to the title. |

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
/>

## Notes

- Consumers pass already translated strings. Markdown-style links inside a translated message survive translation, so keep the link syntax in the `message`.
- The description paragraphs use the `black-text` class and the quote uses `red-text`, both defined in the global CSS.
- For a lighter heading plus text block without the quote and the two-column split, use [Title With Text](./title-with-text.md).
