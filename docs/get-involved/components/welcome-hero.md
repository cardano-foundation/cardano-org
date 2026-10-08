---
title: Welcome Hero
description: The homepage hero of cardano.org with the animated ledger history in the background, title, description, and call to action buttons.
---

## WelcomeHero

The hero at the top of the homepage. It shows a large two-line title, a description, and call to action buttons on top of the animated history of the cardano-ledger repository. A small badge in the corner shows the year of the animation and opens a short explanation with a link to `/ledger-history`.

It is made for the homepage only. Every other page uses [Site Hero](./site-hero.md).

Because it renders a full-width hero with a WebGL animation, there is no live preview here, only the usage pattern.

## Basic Usage

```jsx
import WelcomeHero from '@site/src/components/Layout/WelcomeHero';
import { translate } from '@docusaurus/Translate';

<WelcomeHero
  title={[
    translate({ id: 'home.hero.title', message: 'Made for trust.' }),
    translate({ id: 'home.hero.title2', message: 'Built to last.' }),
  ]}
  description={translate({ id: 'home.hero.description', message: 'Cardano is a public blockchain bringing assurance to critical operations.' })}
  showWhatIsCardano={false}
>
  {/* Optional content below the buttons */}
</WelcomeHero>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` \| `string[]` | - | The page `<h1>`. An array puts each entry on its own line. |
| `description` | `string` | - | Text below the title. |
| `showWhatIsCardano` | `boolean` | `true` | Shows the "What is Cardano?" button next to "Get Started". The homepage turns it off because it links to that page further down. |
| `children` | `node` | - | Content rendered below the buttons, such as the intent chips on the homepage. |

## Behavior

- The animation needs WebGL. Without it, the hero shows a static background image and hides the year badge.
- The animation runs on a dark blue ground in both themes, because it blends its colors additively and needs a dark background to show.

## Translation

- The consumer passes `title` and `description` already translated.
- The button labels and the badge texts are translated inside the component, with IDs under `home.hero.*`.

## Related components

- [Site Hero](./site-hero.md): the hero for every other page.
