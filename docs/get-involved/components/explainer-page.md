---
title: Explainer Page
description: Shared page shell for the site's explainer pages, with meta, FAQPage structured data, hero, section slot, FAQ and call-to-action band.
---

import ExplainerPage from '@site/src/components/Layout/ExplainerPage';

## ExplainerPage

The shell shared by pages such as `/what-is-cardano`, `/how-cardano-works`, `/smart-contracts` and `/defi`. It wraps `Layout` and renders the meta title and description, the FAQPage JSON-LD (when a `faq` is passed), the Open Graph tags, the `SiteHero` banner, a zoom background holding the page sections, the FAQ, and an optional dark call-to-action band. Pages pass already translated strings, the shell itself never calls `translate()`.

Because it renders a full page, there is no live preview here, only the usage pattern.

## Basic Usage

```jsx
import ExplainerPage from '@site/src/components/Layout/ExplainerPage';
import { translate } from '@docusaurus/Translate';

export default function MyExplainerPage() {
  const faq = getMyExplainerFAQ();
  return (
    <ExplainerPage
      title={translate({ id: 'myPage.meta.title', message: 'Page Title' })}
      description={translate({ id: 'myPage.meta.description', message: 'Page description for search engines.' })}
      hero={{
        title: translate({ id: 'myPage.hero.title', message: 'Hero title' }),
        description: translate({ id: 'myPage.hero.description', message: 'Hero description' }),
        bannerType: 'starburst',
      }}
      faq={faq}
      cta={{
        title: translate({ id: 'myPage.cta.title', message: 'Ready to go further?' }),
        buttonLabel: translate({ id: 'myPage.cta.button', message: 'Take the quiz' }),
        buttonLink: '/quiz',
      }}
    >
      <MyFirstSection />
      <MySecondSection />
    </ExplainerPage>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Page title, passed to `Layout` and used for meta and the browser tab. |
| `description` | `string` | - | Meta description, passed to `Layout`. |
| `hero` | `{ title, description, bannerType }` | *required* | Strings and banner for the `SiteHero` at the top of the page. `bannerType` takes the same banner names as `SiteHero` (`starburst`, `waves`, `braidBlue`, `fluidBlue`, and so on). |
| `faq` | `Array<{ question, answer }>` | - | Optional. When passed, renders the FAQPage JSON-LD in `Head` and a `FAQSection` below the children. Omit it on pages without an FAQ. |
| `cta` | `{ title, buttonLabel, buttonLink }` | - | Optional. When passed, renders a `CtaOneColumn` in a dark background band after the main content. Omit it on pages without a closing call to action. |
| `pageName` | `string` | - | Optional, the OG image name under static/img/og, defaults to the site image. |
| `children` | `ReactNode` | - | The page's own sections, rendered inside the zoom background before the FAQ. |
