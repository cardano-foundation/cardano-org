---
title: Accordion
description: Show a list of expandable questions and answers with accessible toggle buttons using the Accordion component on cardano.org.
---

## Accordion

The `Accordion` component renders a list of expandable question and answer rows: a semibold question on the left, a plus or minus icon on the right, and the answer revealed underneath when the row is open. Rows sit directly on the page background and are separated by hairlines. It powers the FAQ on the [Sustainability](/sustainability) page and works for any short list of disclosures.

## Features

- **Accessible toggles** - every row is a real `<button>` inside an `<h3>` with `aria-expanded` and `aria-controls`; the open answer is a labeled `role="region"`
- **Single-open by default** - opening a row closes the others; pass `allowMultiple` to keep several open at once
- **Optional starting state** - `defaultOpenIndex` opens one row on first render
- **Rich answers** - string arrays support `- ` bullet lines, `[text](url)` links, and `**bold**`, or pass any React node
- **Dark mode support** - text, borders, and icons use theme-aware tokens, and there is no card surface to invert
- **Reduced motion** - the only animation is the color transition on hover, and it is disabled for users who prefer reduced motion

## Basic Usage

```jsx
import Accordion from '@site/src/components/Layout/Accordion';

const items = [
  {
    question: "Is Cardano environmentally friendly?",
    answer: [
      "Yes. Cardano's Ouroboros proof-of-stake protocol was designed for low energy consumption from day one.",
      "- Verified by the Crypto Carbon Ratings Institute (CCRI)",
      "- Reported under the EU's MiCA framework",
    ],
  },
  {
    question: "Where can I read the full report?",
    answer: ["The report is linked from the [Sustainability](/sustainability) page."],
  },
];

<Accordion items={items} defaultOpenIndex={0} />
```

Keep the questions and answers in a data module or JSON file wrapped with `@docusaurus/Translate`, as `src/data/sustainability.js` does, rather than writing them inline in JSX.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | array | Yes | List of `{ question, answer }` objects, in display order. |
| `defaultOpenIndex` | number | No | Index of the row that starts open. Defaults to `null` (all closed). |
| `allowMultiple` | boolean | No | When `true`, opening a row does not close the others. Defaults to `false`. |
| `className` | string | No | Extra class name for the wrapper element. |

## Item properties

Each object in `items` has these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `question` | string | Yes | The row heading, rendered as the button label. |
| `answer` | string[] or React.ReactNode | Yes | Either an array of strings (one paragraph each; lines starting with `- ` become bullet points, and `[text](url)` and `**bold**` are supported) or a React node. |

## Live Demo

import Accordion from '@site/src/components/Layout/Accordion';

<Accordion
  defaultOpenIndex={0}
  items={[
    {
      question: "Is Cardano environmentally friendly?",
      answer: [
        "Yes, Cardano is environmentally friendly by design. Its Ouroboros proof-of-stake protocol runs on everyday hardware, and the Crypto Carbon Ratings Institute (CCRI) independently verified the network's energy consumption and carbon footprint.",
      ],
    },
    {
      question: "What does the answer format support?",
      answer: [
        "Each string in the array becomes a paragraph. Lines starting with a dash become bullet points:",
        "- **Bold text** with double asterisks",
        "- Links such as [the Sustainability page](/sustainability)",
        "- Plain text",
      ],
    },
    {
      question: "Can I pass a React node instead?",
      answer: <p>Yes. Anything that renders, such as this paragraph element, can be passed as the answer.</p>,
    },
  ]}
/>

## Styling

The component uses CSS modules. Override styles by targeting these classes:

- `.accordion` - the wrapper around all rows
- `.item` - one question and answer row (`.itemOpen` is added while it is expanded)
- `.heading` - the `<h3>` around the trigger button
- `.trigger` - the toggle button
- `.question` - the question text inside the button
- `.icon` - the plus or minus icon
- `.panel` - the answer region shown when the row is open

## Notes

- Answers use the same string-array format as the FAQ JSON files in `src/data/` (for example `delegationFAQ.json`), so existing FAQ data can be passed to `items` unchanged.
- Choose between the two FAQ components by design: use [`FAQSection`](../faq-component.md) when you want the "FAQ" Divider heading and the alternating row backgrounds; use `Accordion` for the plain-row design with hairlines and a plus or minus icon.
- Rows render as `<h3>` elements, so place the component under a section heading rather than directly under the page title.
- Provide questions and answers through `@docusaurus/Translate` so they remain translatable.
