---
title: Pill Tabs
description: Switch between panels of related content with accessible pill-shaped tabs using the PillTabs component on cardano.org.
---

## PillTabs

The `PillTabs` component shows a row of pill-shaped tab buttons above a content panel. The active pill is filled with the brand blue and the others sit on a neutral surface. It powers the regulatory frameworks per jurisdiction on the [Programmable Tokens](/programmable-tokens) page and works for any small set of parallel views, such as regions, audiences, or product variants.

## Features

- **Accessible tabs** - follows the WAI-ARIA tabs pattern with `role="tablist"`, `role="tab"`, and `role="tabpanel"`, `aria-selected`, and `aria-controls`
- **Keyboard support** - Arrow Left and Arrow Right move between tabs (wrapping at either end), Home and End jump to the first and last tab, and only the active tab is in the tab order
- **Server-rendered panels** - every panel is in the HTML and inactive ones are hidden with the `hidden` attribute, so all content is indexable and readable without JavaScript
- **Any panel content** - each tab takes a React node, so panels can hold cards, lists, or prose
- **Dark mode support** - pill surfaces, borders, and text use theme tokens; the active pill uses a darker step of the brand ramp in dark mode to keep white text legible
- **Wraps on small screens** - pills wrap onto a second line instead of overflowing, and a long label wraps inside its pill

## Basic Usage

```jsx
import PillTabs from '@site/src/components/Layout/PillTabs';
import { translate } from '@docusaurus/Translate';

const tabs = [
  {
    id: 'eu',
    label: translate({ id: 'example.tabs.eu', message: 'European Union' }),
    content: <p>MiCA governs stablecoins and crypto-assets.</p>,
  },
  {
    id: 'ch',
    label: translate({ id: 'example.tabs.ch', message: 'Switzerland' }),
    content: <p>The DLT Act has a dedicated category for ledger-based securities.</p>,
  },
];

<PillTabs
  tabs={tabs}
  ariaLabel={translate({ id: 'example.tabs.label', message: 'Jurisdiction' })}
/>
```

For a full example that builds the tabs from a data module, see `src/components/ProgrammableTokens/RegulatoryFrameworks/index.js` and `src/data/programmable-tokens.js`.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tabs` | array | Yes | List of `{ id, label, content }` objects, in display order. |
| `ariaLabel` | string | Yes | Accessible name of the tab list. Pass a translated string. |
| `defaultIndex` | number | No | Index of the tab that starts active. Defaults to `0`. |
| `className` | string | No | Extra class name for the wrapper element. |

## Tab properties

Each object in `tabs` has these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique key within the component. Used to build the tab and panel element ids. |
| `label` | string | Yes | Text on the pill. |
| `content` | React.ReactNode | Yes | The panel shown while the tab is active. |

## Live Demo

import PillTabs from '@site/src/components/Layout/PillTabs';

<PillTabs
  ariaLabel="Example jurisdictions"
  tabs={[
    { id: 'eu', label: 'European Union', content: <p>MiFID II, MiCA, and the EU DLT Pilot Regime apply to tokenized assets in the European Union.</p> },
    { id: 'ch', label: 'Switzerland', content: <p>The DLT Act has a dedicated legal category for ledger-based securities, in force since August 1, 2021.</p> },
    { id: 'uk', label: 'United Kingdom', content: <p>The Digital Securities Sandbox enables distributed ledger market infrastructure for securities.</p> },
  ]}
/>

## Styling

The component uses CSS modules. Override styles by targeting these classes:

- `.pillTabs` - the wrapper around the tab row and the panels
- `.tabList` - the row of pills (`role="tablist"`)
- `.tab` - one pill button (`.tabActive` is added to the selected one)
- `.panel` - one tab panel (`role="tabpanel"`)

## Notes

- Use tabs for a handful of parallel views of the same kind. With more than about five options, or when readers need to compare views side by side, show the content stacked instead.
- Keep `id` values stable and unique: they end up in the `id` and `aria-controls` attributes.
- Panels are focusable (`tabIndex={0}`) so keyboard users can reach content that has no links. Put headings inside the panel content if the panels are long.
- Provide labels and panel text through `@docusaurus/Translate` so they remain translatable.
