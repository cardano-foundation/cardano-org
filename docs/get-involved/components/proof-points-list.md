---
title: Proof Points List
description: Render alternating rows of icon, title, tagline, and text with an optional closing button using the ProofPointsList component on cardano.org.
---

import ProofPointsList from '@site/src/components/ProofPointsList';
import { FaLock, FaCalculator } from 'react-icons/fa';

## ProofPointsList

A `<section>` with a `<ul>` of proof points. Each row has an icon on one side and a title (`<h2>`), a short tagline, and a paragraph on the other, alternating sides row by row. An optional primary button closes the list.

The rows are data driven. `src/data/whatIsCardanoProofPoints.js` exports `getProofPoints()`, the single source for the seven points. `/what-is-cardano` renders all of them, the homepage (`HomeProofPointsSection`) renders four of them plus a button into the full page. The section heading is not part of this component, callers render it through [Title With Text](./title-with-text.md).

## Basic Usage

From `src/components/HomeProofPointsSection/index.js`:

```jsx
import { translate } from '@docusaurus/Translate';
import TitleWithText from '@site/src/components/Layout/TitleWithText';
import ProofPointsList from '@site/src/components/ProofPointsList';
import { getProofPoints } from '@site/src/data/whatIsCardanoProofPoints';

const HOME_KEYS = ["staking", "fees", "governance", "research"];
const allPoints = getProofPoints();
const points = HOME_KEYS.map((key) => allPoints.find((point) => point.key === key)).filter(Boolean);

<TitleWithText
  title={translate({ id: "home.proofPoints.title", message: "What makes Cardano different?" })}
  headingDot={true}
  titleType="black"
/>
<ProofPointsList
  points={points}
  cta={{
    label: translate({ id: "home.proofPoints.cta", message: "See all differences" }),
    to: "/what-is-cardano",
  }}
/>
```

The full list without a button, from `src/pages/what-is-cardano.js`:

```jsx
<ProofPointsList points={getProofPoints()} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `points` | `Array<{ key, icon, title, tagline, text }>` | - | The rows. `key` must be unique, `icon` is a React element, the three strings are rendered as plain text. Required. |
| `cta` | `{ label, to }` | - | Optional. When passed, a primary button with `label` linking to `to` renders below the list. |

## Live Preview

<ProofPointsList
  points={[
    {
      key: "staking",
      icon: <FaLock />,
      title: "Staking without strings",
      tagline: "Non-custodial, liquid staking",
      text: "Delegating ada to a stake pool never moves it out of your wallet. There is no lock-up period and no slashing. You can spend or re-delegate at any time.",
    },
    {
      key: "fees",
      icon: <FaCalculator />,
      title: "Fees you can predict",
      tagline: "Deterministic transactions",
      text: "A fee on Cardano is a simple formula of a fixed part plus the transaction size, set by protocol parameters rather than an auction.",
    },
  ]}
  cta={{ label: "See all differences", to: "/what-is-cardano" }}
/>

## Notes

- Strings are rendered as is, there is no markdown parsing. Keep links out of the text or add them to the surrounding page.
- The data file builds each point with literal `translate()` calls so Crowdin can extract them. Do the same when you add a point.
- Titles are `<h2>` through the theme `Heading`, so they take part in the page outline. Place the list under an `<h1>` or a titled section.
- The icon wrapper is `aria-hidden`, the icons are decorative.
