---
title: Tabs
description: Switch between panels of related content with accessible tabs using the Tabs component on cardano.org, as pill tabs or as parts for a custom layout.
---

import Tabs from '@site/src/components/Layout/Tabs';

## Tabs

`Tabs` switches between a few parallel views of the same kind, such as regions, audiences, or product variants. It comes in two forms:

- **`Tabs`** builds the tabs from a list of items in a shared look. The `pill` look shows a row of pill-shaped tabs above the panel, the selected pill filled with the brand blue. It powers the regulatory context per jurisdiction on [Programmable Tokens](/programmable-tokens).
- **The parts** `TabsRoot`, `TabList`, `Tab`, and `TabPanel` give the same behavior to a layout of your own. The paths stepper on `/governance`, the role cards on `/governance/accountability`, and the persona switcher on `/grants-funding` are built with them.

Both use [react-tabs](https://github.com/reactjs/react-tabs) for the tab roles, keyboard handling, and focus management.

## When to use

- A handful of parallel views where readers look at one at a time. With more than about five options, or when readers need to compare views side by side, show the content stacked instead.
- For questions and answers, use [Accordion](./accordion.md).
- Inside a Markdown doc page, Docusaurus' own `@theme/Tabs` is fine for code samples in several languages. Use this component on site pages.

## Basic Usage

```jsx
import Tabs from '@site/src/components/Layout/Tabs';
import { translate } from '@docusaurus/Translate';

const items = [
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

<Tabs
  items={items}
  ariaLabel={translate({ id: 'example.tabs.label', message: 'Jurisdiction' })}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{ id, label, content }[]` | `[]` | Tabs in display order. `id` must be unique within the component, `label` is the tab text, `content` is the panel. |
| `variant` | `string` | `pill` | Look of the tabs. Only `pill` exists so far. |
| `ariaLabel` | `string` | - | Accessible name of the tab list. Pass a translated string. |
| `defaultIndex` | `number` | `0` | Tab that starts selected. Out of range values fall back to `0`. |
| `selectedIndex` | `number` | - | Selected tab for controlled use, together with `onSelect`. |
| `onSelect` | `(index, lastIndex, event) => boolean \| void` | - | Called when the reader picks a tab. Returning `false` cancels the change. |
| `forceRenderTabPanel` | `boolean` | `true` | Renders the content of every panel, so all of it is in the HTML. |
| `className` | `string` | - | Extra class on the wrapper. |

## Live Preview

<Tabs
  ariaLabel="Example jurisdictions"
  items={[
    { id: 'eu', label: 'European Union', content: <p>MiFID II, MiCA, and the EU DLT Pilot Regime apply to tokenized assets in the European Union.</p> },
    { id: 'ch', label: 'Switzerland', content: <p>The DLT Act has a dedicated legal category for ledger-based securities, in force since August 1, 2021.</p> },
    { id: 'uk', label: 'United Kingdom', content: <p>The Digital Securities Sandbox enables distributed ledger market infrastructure for securities.</p> },
  ]}
/>

## Parts for a custom layout

When the tabs need a look of their own, such as cards or a stepper, build them from the parts and style them with your own classes. The parts keep the behavior and hide the inactive panels.

```jsx
import { TabsRoot, TabList, Tab, TabPanel } from '@site/src/components/Layout/Tabs';

<TabsRoot selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
  <TabList className={styles.cards}>
    {roles.map((role) => (
      <Tab key={role.id} className={styles.card} selectedClassName={styles.cardSelected}>
        {role.title}
      </Tab>
    ))}
  </TabList>
  {roles.map((role) => (
    <TabPanel key={role.id}>{role.details}</TabPanel>
  ))}
</TabsRoot>
```

`TabList` and `TabPanel` elements can sit anywhere inside `TabsRoot`, for example in two columns of a grid. Pass `forceRenderTabPanel={false}` when a panel should only mount while it is selected, as the account step on `/get-started` does.

### TabsRoot

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedIndex` | `number` | - | Selected tab for controlled use, together with `onSelect`. |
| `defaultIndex` | `number` | `0` | Tab that starts selected when uncontrolled. |
| `onSelect` | `(index, lastIndex, event) => boolean \| void` | - | Called when the reader picks a tab. Returning `false` cancels the change. |
| `forceRenderTabPanel` | `boolean` | `true` | Renders the content of every panel. |
| `reserveSpace` | `boolean` | `false` | Inactive panels stay in the layout but invisible. Use it for panels stacked in one grid cell, so the box keeps the height of the tallest panel when the reader switches tabs, as the install snippets on `/ai` do. |
| `className` | `string` | - | Extra class on the root element. |
| `children` | `node` | - | `TabList` and `TabPanel` elements. |

### TabList, Tab, TabPanel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Extra class on the list, tab, or panel. |
| `selectedClassName` | `string` | - | `Tab` and `TabPanel` only. Extra class while the tab or panel is selected. |

Other props, such as `aria-label` on `TabList` or `tabIndex` on `TabPanel`, are passed on to the element.

## Deep links with useHashTab

`useHashTab` keeps the selected tab in sync with the URL hash, so a link such as `/governance#delegate` opens the right tab. Every hash change selects the tab again, so in-page links to a tab work too. Pass its result to `TabsRoot`:

```jsx
import { TabsRoot, TabList, Tab, TabPanel, useHashTab } from '@site/src/components/Layout/Tabs';
import { scrollBehavior } from '@site/src/utils/jsUtils';

const [selectedIndex, select] = useHashTab({
  ids: ['understand', 'delegate', 'lead'],
  onHashSelect: () => wrapperRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }),
});

<TabsRoot selectedIndex={selectedIndex} onSelect={select}>…</TabsRoot>
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ids` | `string[]` | `[]` | Hash id of each tab, in tab order. |
| `indexForHash` | `(hash) => number` | - | Maps hashes that are not tab ids to a tab, for example `#program-orion` to the tab that lists that program. Return `-1` for no match. |
| `storageKey` | `string` | - | Remembers the reader's last tab in localStorage and restores it on the next visit when the URL has no tab hash. |
| `onHashSelect` | `(hash, index) => void` | - | Called after a hash selected a tab, for example to scroll to it. |

A hash in the URL always wins over the stored tab. Restoring from storage does not scroll, so a normal visit starts at the top of the page.

## Accessibility

- The tabs follow the WAI-ARIA tabs pattern: `role="tablist"`, `role="tab"`, and `role="tabpanel"`, with `aria-selected` and `aria-controls`.
- Arrow keys move between tabs and wrap at either end, Home and End jump to the first and last tab, and only the selected tab is in the tab order.
- In the `pill` look, panels are focusable (`tabIndex={0}`), so keyboard users can reach content without links. With the parts, pass `tabIndex={0}` to `TabPanel` if the panels need it.
- Inactive panels are hidden with `display: none`, so screen readers and the Tab key skip them.

## Translation

The component has no text of its own. Pass labels, panel content, and `ariaLabel` already translated.

## Styling

- The `pill` look uses theme tokens for surfaces, borders, and text. The selected pill uses a darker step of the brand blue in dark mode to keep white text legible.
- Pills wrap onto a second line on narrow screens.
- With the parts, all looks come from your own classes. The parts only remove list bullets, set the pointer cursor, and hide inactive panels.

## Related components

- [Accordion](./accordion.md): expandable questions and answers.
