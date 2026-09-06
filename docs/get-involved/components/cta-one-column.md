---
title: CTA One Column
description: Render a centered call to action with an optional title, text, and a white button using the CtaOneColumn component on cardano.org.
---

import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import CtaOneColumn from '@site/src/components/Layout/CtaOneColumn';

## CtaOneColumn

A single centered column with an optional heading, an optional paragraph, and one large white button below. The wrapper sets white text, so it is meant to sit inside a dark or colored [Background Wrapper](./background-wrapper.md) such as `solidBlue`, `ada`, or `gradientDark`. On a light background the title and text are invisible.

`ExplainerPage` uses this component for its closing call-to-action band, and pages such as `/learn`, `/exchanges`, `/developers`, `/solutions`, `/ouroboros`, and the stake pool pages use it directly.

## Basic Usage

Taken from `src/pages/learn.js`:

```jsx
import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import CtaOneColumn from '@site/src/components/Layout/CtaOneColumn';
import { ACADEMY_CTA_URL } from '@site/src/data/learningPath';
import { translate } from '@docusaurus/Translate';

<BackgroundWrapper backgroundType="solidBlue">
  <BoundaryBox>
    <CtaOneColumn
      title={translate({ id: "learn.cta.title", message: "Want a certificate at the end? The Cardano Academy offers free courses on everything above." })}
      buttonLabel={translate({ id: "learn.cta.button", message: "Explore the Academy" })}
      buttonLink={ACADEMY_CTA_URL}
    />
  </BoundaryBox>
</BackgroundWrapper>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Optional heading rendered as an `<h1>`. Skipped when empty. |
| `text` | `string` | - | Optional paragraph below the title, rendered as a plain string (no markdown parsing). Skipped when empty. |
| `buttonLabel` | `string` | - | Label of the button. The button is always rendered, so always pass a label. |
| `buttonLink` | `string` | - | Target of the button, passed to the Docusaurus `Link`, so internal paths and external URLs both work. |

## Live Preview

<BackgroundWrapper backgroundType="solidBlue">
  <BoundaryBox>
    <CtaOneColumn
      title="Talk to the Cardano Foundation's Core Integrations team"
      text="Reach out for tailored support, real-time updates, and integration queries."
      buttonLabel="Contact the Core Integrations team"
      buttonLink="/contact"
    />
  </BoundaryBox>
</BackgroundWrapper>

## Notes

- Consumers pass already translated strings (`translate()` calls). The component itself contains no text.
- `text` is rendered as is. If you need links or bold text inside the paragraph, use [Title With Text](./title-with-text.md) instead, which parses markdown-like syntax.
- The button uses the white `buttonWhite` style on top of `button button--primary button--lg`, which is why it only looks right on a dark background.
- For a two-column variant with a button on either side, see [CTA Two Column](./cta-two-column.md).
