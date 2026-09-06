---
title: Term Explainer
description: Show two random glossary terms from a category under a divider using the TermExplainer component on cardano.org.
---

import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import TermExplainer from '@site/src/components/TermExplainer';

## TermExplainer

A "terms you should know" section. It renders a white [Divider](./divider.md) with the category name, then picks two random terms from that category in `src/data/termsForTermExplainer.json` and shows each with its title and description side by side. The random pick happens on the client after hydration, so the server-rendered page starts with no terms and fills in on load.

Used on `/governance`, `/governance/accountability`, and `/constitution`, always inside a `gradientLight` [Background Wrapper](./background-wrapper.md).

## Basic Usage

From `src/pages/constitution.js`:

```jsx
import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import TermExplainer from '@site/src/components/TermExplainer';

<BackgroundWrapper backgroundType="gradientLight">
  <BoundaryBox>
    <TermExplainer category="governance" />
  </BoundaryBox>
</BackgroundWrapper>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `category` | `string` | - | Key under `categories` in `src/data/termsForTermExplainer.json`. Currently `staking`, `catalyst`, `governance`, or `cip`. An unknown key renders the divider with no terms. |

## Live Preview

<BackgroundWrapper backgroundType="gradientLight">
  <BoundaryBox>
    <TermExplainer category="staking" />
  </BoundaryBox>
</BackgroundWrapper>

## Notes

- The divider text is translated inside the component (`termExplainer.divider`, `{category} Terms you should know`). The raw category key is inserted, so it appears as written in the JSON, for example "governance Terms you should know".
- Term descriptions go through `parseMarkdownLikeText`, so `[label](url)` links and `**bold**` markers in the JSON render as links and bold text.
- The terms in the JSON file are English only and are not part of the Crowdin flow. Add a term to the JSON to make it eligible for the random pick.
- Each reload shows a different pair, which is intended.
