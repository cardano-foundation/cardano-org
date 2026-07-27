---
title: Title With Text
description: Render a section title with body text, optional list, and an optional call-to-action using the TitleWithText component on cardano.org.
---

import TitleWithText from "@site/src/components/Layout/TitleWithText";

## Title With Text

`<TitleWithText>` renders a title followed by body text, and optionally a call-to-action button. It is one of the most-used building blocks for React pages.

## Basic Usage

```jsx
<TitleWithText
  title="What is Cardano?"
  description="A proof-of-stake blockchain platform for changemakers, innovators, and visionaries."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | | The heading. Rendered as an `<h1>`, so treat it as the primary heading of its section. |
| `description` | `string` \| `array` \| `object` | | Body content (see formats below). |
| `titleType` | `"red"` \| `"green"` \| _(other)_ | black | Title color. Any other value renders the default black. |
| `headingDot` | `boolean` | `false` | Adds the decorative leading dot to the title. |
| `slightText` | `string[]` | | Extra muted lines rendered below the description. |
| `buttonLabel` | `string` | | Call-to-action label. Requires `buttonLink` to appear. |
| `buttonLink` | `string` | | Destination for the button. Requires `buttonLabel`. |

## Description formats

`description` accepts three shapes, and text runs through basic Markdown parsing (bold, links):

- **String** renders as a paragraph:

  ```jsx
  <TitleWithText title="Governance" description="Ada holders shape the platform." />
  ```

- **`{ list: [...] }`** renders a bullet list:

  ```jsx
  <TitleWithText
    title="Why Cardano"
    description={{ list: ["Peer-reviewed research", "Formal methods", "Sustainable"] }}
  />
  ```

- **Array** renders each entry in order (mix paragraphs and lists):

  ```jsx
  <TitleWithText
    title="Overview"
    description={["An intro paragraph.", { list: ["Point one", "Point two"] }]}
  />
  ```

## With a call-to-action

```jsx
<TitleWithText
  title="Get started"
  description="Set up a wallet and receive your first ada."
  buttonLabel="Get a wallet"
  buttonLink="/what-is-a-wallet"
/>
```
