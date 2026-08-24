---
sidebar_label: Design Tokens
sidebar_position: 13
title: Design Tokens
description: The shared color, spacing, radius, shadow, and motion variables to use when styling cardano.org, instead of hardcoded values.
---

Design tokens are the shared styling vocabulary for cardano.org. When you write CSS, reach for a token instead of a raw value. This keeps spacing, color, and motion consistent across pages built by different contributors, and it means a change to the palette or scale happens in one place.

All tokens are CSS custom properties defined in [`src/css/custom.css`](https://github.com/cardano-foundation/cardano-org/blob/staging/src/css/custom.css). They are global, so any `*.module.css` file can use them without an import.

:::tip Enforced in CI
`yarn test:css` fails the build if a `--site-*` or other project variable is used without being defined. Do not invent new hardcoded hex colors or one-off spacing values; use or extend the tokens below.
:::

## How tokens are organized

Two namespaces, by design:

- **`--ifm-*`** are Infima (Docusaurus) variables. Use these for anything the framework already owns: the brand color and its ramp, neutral greys, and surfaces. Docusaurus's own components (navbar, buttons, admonitions) read them too.
- **`--site-*`** are this project's own tokens for everything Infima does not provide: semantic status colors, spacing, radius, elevation, motion, and focus.

**Neutrals have no `--site-*` tokens on purpose.** Use Infima's theme-aware emphasis scale rather than a second grey palette:

| Use | Token |
|-----|-------|
| Body text | `var(--ifm-font-color-base)` |
| Strong text | `var(--ifm-color-emphasis-900)` |
| Muted / secondary text | `var(--ifm-color-emphasis-600)` |
| Borders, dividers | `var(--ifm-color-emphasis-200)` / `-300` |
| Card / panel background | `var(--ifm-background-surface-color)` |
| Page background | `var(--ifm-background-color)` |

These already invert correctly in dark mode, which is why you should not reach for a hardcoded grey.

## Color

### Brand

The Cardano blue and its ramp live on Infima's primary variables. The ramp is a proper mono-hue ladder: darker variants for hover and active states, lighter variants for soft fills.

| Token | Light | Use |
|-------|-------|-----|
| `--ifm-color-primary` | `#0033AD` | Brand blue, default |
| `--ifm-color-primary-dark` | `#002a8e` | Hover on filled buttons/links |
| `--ifm-color-primary-darker` | `#00257d` | Active / pressed |
| `--ifm-color-primary-darkest` | `#001f68` | Strongest accent |
| `--ifm-color-primary-light` … `-lightest` | `#0038be` … `#0042e1` | Lighter accents |

For `rgba()` use the RGB triple: `rgba(var(--ifm-color-primary-rgb), 0.5)`.

In dark mode the whole ramp shifts to a lighter blue automatically; you do not need to handle it per component.

### Semantic status

One canonical value each, with dark-mode variants already defined:

| Token | Light | Meaning |
|-------|-------|---------|
| `--site-success` | `#2da06a` | Success, positive |
| `--site-warning` | `#d97706` | Warning, caution |
| `--site-danger` | `#dc3545` | Error, destructive |
| `--site-info` | brand blue | Informational |

### Brand tints

Translucent primary, for soft fills and hover backgrounds (prefer these over a hardcoded `rgba(0,51,173,…)`):

- `--site-tint-weak`: `rgba(var(--ifm-color-primary-rgb), 0.06)`
- `--site-tint-strong`: `rgba(var(--ifm-color-primary-rgb), 0.12)`

### Quiz result tiers

Badge colors for the bronze/silver/gold results on the [quiz hub](/quiz). Both theme values are listed here, unlike the semantic status tokens above, because `--site-tier-ink` is deliberately not inverted: the tier fills stay light in both themes, so the text and icon color sitting on top of them stays the same dark value in light and dark mode instead of flipping with the rest of the palette.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--site-tier-gold` | `#c9a227` | `#d9b345` | Gold tier badge fill, perfect score |
| `--site-tier-silver` | `#8e9aab` | `#a3aebf` | Silver tier badge fill |
| `--site-tier-bronze` | `#a5673f` | `#c98b5e` | Bronze tier badge fill |
| `--site-tier-ink` | `#1b2333` | `#1b2333` | Text and icon color on top of the tier fills, fixed across themes on purpose |

## Spacing

An 8px-based scale. Use it for padding, margins, and gaps.

| Token | Value |
|-------|-------|
| `--site-space-3xs` | `0.25rem` (4px) |
| `--site-space-2xs` | `0.5rem` (8px) |
| `--site-space-xs` | `0.75rem` (12px) |
| `--site-space-sm` | `1rem` (16px) |
| `--site-space-md` | `1.5rem` (24px) |
| `--site-space-lg` | `2rem` (32px) |
| `--site-space-xl` | `3rem` (48px) |
| `--site-space-2xl` | `4rem` (64px) |
| `--site-space-3xl` | `6rem` (96px) |

For vertical rhythm between sections, the [Spacer Box](./components/spacer-box.md) component wraps `sm` / `lg` / `3xl`.

## Corner radius

| Token | Value | Use |
|-------|-------|-----|
| `--site-radius-sm` | `6px` | Small controls |
| `--site-radius-md` | `8px` | Default card |
| `--site-radius-lg` | `12px` | Large cards |
| `--site-radius-xl` | `16px` | Feature panels |
| `--site-radius-pill` | `999px` | Pills, chips |

Circular elements use `border-radius: 50%` directly.

## Elevation

Four shadow steps, each with a stronger dark-mode variant already defined:

| Token | Use |
|-------|-----|
| `--site-shadow-xs` | Subtle lift |
| `--site-shadow-sm` | Resting card |
| `--site-shadow-md` | Raised card |
| `--site-shadow-lg` | Hover / floating |

## Motion

| Token | Value | Use |
|-------|-------|-----|
| `--site-duration-fast` | `150ms` | Small state changes |
| `--site-duration-base` | `200ms` | Default |
| `--site-duration-slow` | `300ms` | Larger transitions |
| `--site-ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard easing |
| `--site-lift` | `-2px` | Canonical hover lift (`transform: translateY(var(--site-lift))`) |

A typical hover transition:

```css
.card {
  transition: transform var(--site-duration-base) var(--site-ease),
    box-shadow var(--site-duration-base) var(--site-ease);
}
.card:hover {
  transform: translateY(var(--site-lift));
  box-shadow: var(--site-shadow-lg);
}
```

Wrap non-essential animation in `@media (prefers-reduced-motion: reduce)` and disable it there.

## Focus

There is a global keyboard-focus baseline in `custom.css`, so most interactive elements get a consistent ring for free:

```css
:focus-visible {
  outline: 2px solid var(--ifm-color-primary);
  outline-offset: 2px;
}
```

Do not remove focus outlines. If a component needs a shadow-style ring instead of an outline, use `--site-focus-ring`.

## Breakpoints

Breakpoints are **not** tokens: CSS custom properties cannot be used inside `@media` queries, and the project has no preprocessor. Use these three canonical values so component collapse points stay in sync with the navbar and sidebar:

| Width | Use |
|-------|-----|
| `996px` | Primary. Matches the Docusaurus navbar/sidebar collapse. |
| `768px` | Tablet. |
| `480px` | Mobile. |

`yarn test:css` blocks the `966px` typo (a transposition of `996px`) from coming back.

## Adding a token

If you genuinely need a value the scales do not cover, add it to the relevant block in `src/css/custom.css` (with its dark-mode variant if it is a color or shadow) rather than hardcoding it in a component. Keep the naming consistent with the existing `--site-*` groups.
