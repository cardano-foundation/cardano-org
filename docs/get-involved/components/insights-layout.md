---
title: Insights Layout
description: Page shell for the /insights data pages, with meta driven title, hero, zoom background, and boundary box, using the InsightsLayout component on cardano.org.
---

## InsightsLayout

The shell shared by every page under `/insights`. It wraps the Docusaurus `Layout`, renders a [Site Hero](./site-hero.md) from the page's `meta` export, and places the children inside a `zoom` [Background Wrapper](./background-wrapper.md) and a [Boundary Box](./boundary-box.md), followed by a medium [Spacer Box](./spacer-box.md).

Every insights page exports a `meta` object that both this layout and the insights index read. The layout uses four of its fields, the rest (`pageName`, `date`, `og`, `tags`, `indexed`) are for the index and for [Open Graph Info](./open-graph-info.md).

Because it renders a full page, there is no live preview here. `src/pages/insights/template/index.js` is the reference page to copy.

## Basic Usage

From `src/pages/insights/template/index.js`:

```jsx
import { translate } from '@docusaurus/Translate';
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';

export const meta = {
  pageName: 'template',
  pageTitle: translate({ id: 'insightsTemplate.meta.pageTitle', message: 'Cardano Insights Template' }),
  pageDescription: translate({ id: 'insightsTemplate.meta.pageDescription', message: 'Insights Template' }),
  title: translate({ id: 'insightsTemplate.meta.title', message: 'This is just an insights template' }),
  date: '2025-03-17',
  og: {
    title: translate({ id: 'insightsTemplate.og.title', message: 'This is just an insights template | Cardano.org' }),
    description: translate({ id: 'insightsTemplate.og.description', message: 'Detailed description for open graph pages, and more.' }),
  },
  tags: ['governance'],
  indexed: false,
};

export default function InsightsTemplate() {
  return (
    <InsightsLayout meta={meta}>
      <OpenGraphInfo pageName={meta.pageName} title={meta.og.title} description={meta.og.description} />
      <p>Page content, charts, and text go here.</p>
      <InsightsFooter lastUpdated={meta.date} />
    </InsightsLayout>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `meta` | `object` | - | The page's `meta` export. Required. |
| `children` | `ReactNode` | - | The page content, rendered inside the boundary box. |

### Fields read from `meta`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `meta.pageTitle` | `string` | - | Passed to `Layout` as the document title. |
| `meta.pageDescription` | `string` | - | Passed to `Layout` as the meta description and reused as the hero description. |
| `meta.title` | `string` | - | The hero heading. |
| `meta.bannerType` | `string` | `'braidBlue'` | Optional [Site Hero](./site-hero.md) banner. Falls back to `braidBlue` when missing. |

## Notes

- All `meta` strings are `translate()` calls in the page file so Crowdin can extract them. The layout itself contains no text.
- Put [Insights Footer](./insights-footer.md) at the end of the children to show the last-updated line.
- The insights index only lists pages whose `meta.indexed` is not `false`, so set it to `false` for drafts and templates.
