---
title: Logo Tile
description: Show a logo in a square or round tile, with the name's first letters when the image is missing or fails to load, using the LogoTile component on cardano.org.
---

import LogoTile from '@site/src/components/Layout/LogoTile';

## LogoTile

`LogoTile` shows a logo, avatar, or icon in a tile of fixed size. When there is no image, or the image fails to load, the tile shows the first letter of the name instead, or the initials of its first two words. Size, corner radius, colors, and how the image fits come from CSS variables, so each card keeps its own look.

App icons ([App Icon](./app-icon.md)), funding program logos, Layer 2 cards, the wallet finder, the exchange list on `/where-to-get-ada`, and the DRep and pool avatars in [Wallet Delegation](./wallet-delegation.md) all use it.

## When to use

- A logo or avatar next to a name, where a missing image should not leave a gap.
- The tile is decorative and hidden from screen readers, so always show the name as text next to it.
- For a photo or illustration that carries meaning on its own, use a plain `<img>` with `alt` text.

## Basic Usage

```jsx
import LogoTile from '@site/src/components/Layout/LogoTile';
import styles from './styles.module.css';

<div className={styles.header}>
  <LogoTile src={wallet.icon} name={wallet.title} className={styles.logo} />
  <h3>{wallet.title}</h3>
</div>
```

```css
.logo {
  --logo-size: 48px;
  --logo-radius: 8px;
  --logo-fallback-bg: var(--ifm-color-primary);
  --logo-fallback-color: white;
  --logo-fallback-font-size: 1.5rem;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image path, resolved with the base URL. Without it the letters show. |
| `srcDark` | `string` | - | Image path for dark mode. Only used together with `src`. |
| `name` | `string` | - | Name the fallback letters come from. |
| `letters` | `string` | - | Letters to show instead of the ones from `name`, cut to `maxLetters`. Blank falls back to `name`. |
| `maxLetters` | `number` | `1` | `1` shows the first letter, `2` the first letters of the first two words. Empty gives "?". |
| `lazy` | `boolean` | `true` | Loads the image lazily. Set `false` above the fold. |
| `className` | `string` | - | Class on the tile. Set the CSS variables here. |
| `style` | `object` | - | Inline style on the tile, for a variable that comes from data, for example a category color. |

## Live Preview

<div style={{display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
  <LogoTile src="/img/funding/project-catalyst.png" name="Project Catalyst" style={{'--logo-bg': 'var(--site-tint-weak)'}} />
  <LogoTile src="/img/brand-assets/cardano-starburst-blue.svg" srcDark="/img/brand-assets/cardano-starburst-white.svg" name="Cardano Treasury" style={{'--logo-bg': 'var(--site-tint-weak)'}} />
  <LogoTile src="/img/does-not-exist.png" name="Broken Image" style={{'--logo-fallback-bg': 'var(--ifm-color-primary)', '--logo-fallback-color': 'white'}} />
  <LogoTile name="Delegated Representative" maxLetters={2} style={{'--logo-fallback-radius': '50%', '--logo-fallback-bg': 'var(--ifm-color-primary)', '--logo-fallback-color': 'white'}} />
</div>

From left: a logo, a logo with a dark mode variant, an image that fails to load, and two round initials without an image.

## Styling

The tile reads these CSS variables. Set them in the class you pass as `className`, also inside a media query.

| Variable | Default | What it sets |
|----------|---------|--------------|
| `--logo-size` | `48px` | Width and height of the tile. |
| `--logo-radius` | `8px` | Corner radius while the image shows. |
| `--logo-bg` | `transparent` | Background behind the image. |
| `--logo-image-size` | `100%` | Image size inside the tile. A smaller value insets the logo, Layer 2 cards use `28px` in a `40px` tile. |
| `--logo-fit` | `contain` | `object-fit` of the image. Use `cover` for photos. |
| `--logo-fallback-bg` | `--logo-bg` | Background while the letters show. |
| `--logo-fallback-radius` | `--logo-radius` | Corner radius while the letters show, for example `50%` for a round avatar. |
| `--logo-fallback-color` | text color | Color of the letters. |
| `--logo-fallback-font-size` | `1rem` | Size of the letters. |
| `--logo-fallback-weight` | `700` | Weight of the letters. |
| `--logo-fallback-line-height` | `normal` | Line height of the letters. |
| `--logo-fallback-spacing` | `normal` | Letter spacing. |

## Accessibility

- The tile has `aria-hidden="true"` and the image an empty `alt`, because the name always sits next to it as text.
- A failed image switches to the letters. With `srcDark`, a failure counts only for the variant that failed, so the other color mode still shows its image.

## Related components

- [App Icon](./app-icon.md): app icon with the category color as fallback.
- [Wallet Delegation](./wallet-delegation.md): `SnapshotImage` and `Initials` for DRep and pool avatars.
