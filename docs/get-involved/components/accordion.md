---
title: Accordion
description: Show a list of expandable questions and answers with accessible toggle buttons using the Accordion component on cardano.org.
---

## Accordion

The `Accordion` component renders a list of expandable question and answer rows: a semibold question on the left, a plus or minus icon on the right, and the answer revealed underneath when the row is open. Rows sit directly on the page background and are separated by hairlines. It powers the FAQ on the [Programmable Tokens](/programmable-tokens) page and works for any short list of disclosures.

## Features

- **Accessible toggles** - every row is a real `<button>` inside a heading (an `<h3>` by default, see `headingLevel`) with `aria-expanded` and `aria-controls`; each answer is a labeled `role="region"`, and a closed answer is hidden from the tab order and from assistive technology. When a row closes while focus is in its answer, focus returns to the row's button
- **Smooth open and close** - answers expand and collapse with a height transition done in CSS (a grid row going from `0fr` to `1fr`), with no JavaScript measuring
- **Answers in the HTML** - every answer is rendered, open or closed, so the full text is available to search engines and without JavaScript
- **Single-open by default** - opening a row closes the others; pass `allowMultiple` to keep several open at once
- **Optional starting state** - `defaultOpenIndex` opens one row on first render
- **Rich answers** - string arrays support `- ` bullet lines, `[text](url)` links, and `**bold**`, or pass any React node
- **Dark mode support** - text, borders, and icons use theme-aware tokens, and there is no card surface to invert
- **Reduced motion** - the open and close transition and the hover color change are turned off for users who prefer reduced motion, so rows open instantly

## Basic Usage

```jsx
import Accordion from '@site/src/components/Layout/Accordion';

const items = [
  {
    question: "What are programmable tokens?",
    answer: [
      "Native tokens whose transfers have to pass rules set by their issuer, for example:",
      "- An allowlist of verified holders",
      "- A denylist of sanctioned addresses",
    ],
  },
  {
    question: "Where can I learn more?",
    answer: ["Start with the [programmable token](/glossary/programmable-token) glossary entry."],
  },
];

<Accordion items={items} defaultOpenIndex={0} />
```

Keep the questions and answers in a data module or JSON file wrapped with `@docusaurus/Translate`, as `src/data/programmable-tokens.js` does, rather than writing them inline in JSX.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | array | Yes | List of `{ question, answer }` objects, in display order. |
| `defaultOpenIndex` | number | No | Index of the row that starts open, or an array of indexes. Defaults to `null` (all closed). Ignored when `openKeys` is set. |
| `allowMultiple` | boolean | No | When `true`, opening a row does not close the others. Defaults to `false`. Ignored when `openKeys` is set. |
| `openKeys` | array | No | Open rows for controlled use, by `id` or else by index. With it, the page owns the state: rows only open or close when the page updates `openKeys` in `onToggle`. `[]` closes all. |
| `onToggle` | function | No | Called with `(key, nextIsOpen)` when the reader opens or closes a row. `key` is the row's `id`, or its index when it has none. |
| `headingLevel` | number | No | Heading level of each question, defaults to `3`. `0` renders the question without heading semantics. The look stays the same. |
| `className` | string | No | Extra class name for the wrapper element. |

## Item properties

Each object in `items` has these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | No | Set as the row's HTML `id`, so a link or a script can scroll to it, and used as the row's key in `openKeys`. Must be unique on the page. |
| `question` | string | Yes | The row heading, rendered as the button label. |
| `answer` | string[] or React.ReactNode | Yes | Either an array of strings (one paragraph each; lines starting with `- ` become bullet points, and `[text](url)` and `**bold**` are supported) or a React node. |

## Live Demo

import Accordion from '@site/src/components/Layout/Accordion';
import { useState } from 'react';

<Accordion
  defaultOpenIndex={0}
  items={[
    {
      question: "What are programmable tokens?",
      answer: [
        "Programmable tokens are native tokens that can only change owner when a script approves the transfer, so the issuer can enforce rules such as allowlists, transfer limits, or freezes.",
      ],
    },
    {
      question: "What does the answer format support?",
      answer: [
        "Each string in the array becomes a paragraph. Lines starting with a dash become bullet points:",
        "- **Bold text** with double asterisks",
        "- Links such as [the programmable token glossary entry](/glossary/programmable-token)",
        "- Plain text",
      ],
    },
    {
      question: "Can I pass a React node instead?",
      answer: <p>Yes. Anything that renders, such as this paragraph element, can be passed as the answer.</p>,
    },
  ]}
/>

## Controlled use

Pass `openKeys` and `onToggle` when the page decides which rows are open, for example to keep one question open across several lists or to open a question from a link elsewhere on the page. Give the rows an `id`, because indexes repeat between lists.

```jsx
const [openId, setOpenId] = useState(null);
const openKeys = openId ? [openId] : [];
const onToggle = (id, nextIsOpen) => setOpenId(nextIsOpen ? id : null);

<Accordion items={delegationQuestions} openKeys={openKeys} onToggle={onToggle} />
<Accordion items={votingQuestions} openKeys={openKeys} onToggle={onToggle} />
<button onClick={() => setOpenId('what-is-a-drep')}>What is a DRep?</button>
```

export function ControlledDemo() {
  const [openId, setOpenId] = useState(null);
  const openKeys = openId ? [openId] : [];
  const onToggle = (id, nextIsOpen) => setOpenId(nextIsOpen ? id : null);
  return (
    <>
      <Accordion openKeys={openKeys} onToggle={onToggle} items={[
        { id: 'demo-delegate', question: 'Can I delegate my ada?', answer: ['Yes, delegation keeps your ada in your wallet.'] },
        { id: 'demo-rewards', question: 'Do I earn rewards?', answer: ['Stake delegation earns rewards every epoch.'] },
      ]} />
      <Accordion openKeys={openKeys} onToggle={onToggle} items={[
        { id: 'demo-drep', question: 'What is a DRep?', answer: ['A delegated representative votes on governance actions.'] },
      ]} />
      <p><button type="button" className="button button--secondary button--sm" onClick={() => setOpenId('demo-drep')}>Open "What is a DRep?"</button></p>
    </>
  );
}

<ControlledDemo />

Only one question is open across both lists, and the button opens a question from outside.

## Heading level

`headingLevel` only changes the element around each question, the look stays the same. The three lists below use level 3 (default), 5, and 0.

export const LEVEL_ITEMS = [
  { question: 'Is the look the same at every level?', answer: ['Yes. Only the element in the page outline changes.'] },
];

<Accordion items={LEVEL_ITEMS} />
<Accordion items={LEVEL_ITEMS} headingLevel={5} />
<Accordion items={LEVEL_ITEMS} headingLevel={0} />

## Styling

The component uses CSS modules. Override styles by targeting these classes:

- `.accordion` - the wrapper around all rows
- `.item` - one question and answer row (`.itemOpen` is added while it is expanded)
- `.heading` - the `<h3>` around the trigger button
- `.trigger` - the toggle button
- `.question` - the question text inside the button
- `.icon` - the plus or minus icon
- `.panel` - the answer region; its grid row animates between closed and open
- `.panelInner` - clips the answer while the panel is collapsing or expanding
- `.panelContent` - the answer text (type, color, and the 940px width cap)

These class names are hashed by CSS modules, so a page cannot target them by name. To restyle a single instance, pass a `className` and target element types under it from the page's CSS module (for example `.faq h3 button`), as `src/pages/programmable-tokens.module.css` does to set a larger question size. Such element selectors depend on the heading level: `h3 button` only matches with the default `headingLevel`.

## Notes

- Answers use the same string-array format as the FAQ JSON files in `src/data/` (for example `operationFAQ.json`), so existing FAQ data can be passed to `items` unchanged.
- Choose between the two FAQ components by design: use [`FAQSection`](../faq-component.md) when you want the "FAQ" Divider heading and the alternating row backgrounds; use `Accordion` for the plain-row design with hairlines and a plus or minus icon.
- Rows render as `<h3>` elements by default, so place the component under a section heading rather than directly under the page title. Set `headingLevel` to match the outline. Use `0` only when the questions are not part of the page outline, the buttons keep their accessible names either way.
- Provide questions and answers through `@docusaurus/Translate` so they remain translatable.
