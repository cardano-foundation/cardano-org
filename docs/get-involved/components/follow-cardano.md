---
title: Follow Cardano
description: Show a centered title with round icon links to Cardano's social channels using the FollowCardano component on cardano.org.
---

import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import FollowCardano from '@site/src/components/Layout/FollowCardano';

## FollowCardano

A centered title above a row of round icon links to Cardano's community channels: X, Reddit, the Cardano Forum, Facebook, Meetup, Telegram, Stack Exchange, and LinkedIn. The channel list is part of the component, so every page that shows it links to the same set.

The homepage and `/newsletter` show it through `FollowCardanoSection`, which adds the "Social" divider and the light gradient background.

## When to use

- To point readers to the official community channels at the end of a page.
- For a single link to one channel, use a normal link or button instead.

## Basic Usage

```jsx
import FollowCardano from '@site/src/components/Layout/FollowCardano';
import { translate } from '@docusaurus/Translate';

<FollowCardano
  title={translate({ id: 'myPage.follow.title', message: 'Get Involved' })}
  headingLevel={2}
  iconForegroundColor="#0136AE"
  iconBackgroundColor="#ffffff"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Heading above the icons. |
| `iconForegroundColor` | `string` | white in light mode, black in dark mode | Color of the icons. Any CSS color. |
| `iconBackgroundColor` | `string` | - | Color of the round background behind each icon. Without it the circles are transparent. |
| `headingLevel` | `number` | `1` | Heading level of the title, 1 to 6. The look stays the same. Pass `2` or lower when the page already has a hero, so it keeps a single `<h1>`. |
| `className` | `string` | - | Extra class on the outer element. |

## Live Preview

<BackgroundWrapper backgroundType="gradientLight">
  <BoundaryBox>
    <FollowCardano
      title="Get Involved"
      headingLevel={2}
      iconForegroundColor="#0136AE"
      iconBackgroundColor="#ffffff"
    />
  </BoundaryBox>
</BackgroundWrapper>

## Accessibility

- Every icon link has a translated `aria-label` such as "Cardano on X", because the icons have no visible text.
- The title is a real heading, set its level with `headingLevel`.

## Translation

- The consumer passes `title` already translated.
- The component translates the link labels itself, with the IDs `followCardano.label.x`, `followCardano.label.reddit`, `followCardano.label.forum`, `followCardano.label.facebook`, `followCardano.label.meetup`, `followCardano.label.telegram`, `followCardano.label.stackexchange`, and `followCardano.label.linkedin`.

## Styling

- The icon colors are set through the CSS variables `--icon-fg-color` and `--icon-bg-color`, which the two color props fill.
- Without `iconForegroundColor` the icons are white in light mode and black in dark mode, so pick colors that work on the background behind the component.
- The title and icons take 70% of the width on wide screens and the full width below 996px.

## Related components

- [Divider](./divider.md): the section label that `FollowCardanoSection` places above it.
- [Background Wrapper](./background-wrapper.md): the background the component sits on.
