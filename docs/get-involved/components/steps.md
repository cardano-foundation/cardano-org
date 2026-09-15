---
title: Steps
description: Numbered steps in a row of cards, using the Steps component.
---

## Steps

An ordered list rendered as cards in a row, each with its number, a title, and a line of text: "How to apply" on the [grants and funding page](/grants-funding) and "How an upgrade happens" on the [roadmap](/roadmap). The number comes from a CSS counter, so the order in the array is the order on the page. Three per row, one column under 996px.

## Basic Usage

```jsx
import Steps from '@site/src/components/Layout/Steps';

<Steps
  items={[
    { key: "pick", title: "Pick a program", text: "Ideas go to Catalyst, products to an accelerator." },
    { key: "apply", title: "Apply on the official site", text: "Only use the links in the program details." },
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ key, title, text }>` | - | One step each. `text` may be a string or a node, for example the output of `parseMarkdownLikeText`. |

## Files

| File | Role |
|------|------|
| `src/components/Layout/Steps/index.js` | The list. |
| `src/components/Layout/Steps/styles.module.css` | Tokens only. |
