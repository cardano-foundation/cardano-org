---
title: Dotted Image With Text
description: Render a dotted icon illustration next to a heading and text using the DottedImageWithText component on cardano.org.
---

import DottedImageWithText from '@site/src/components/Layout/DottedImageWithText';

## DottedImageWithText

An illustration from `static/img/dotted-icons/` on the left with an optional `<h2>` and text on the right. The two stack vertically on screens up to 768px wide. It is the standard block for feature lists on explainer pages: `/what-is-cardano`, `/how-cardano-works`, `/smart-contracts`, `/defi`, `/ouroboros`, `/what-is-a-wallet`, and `/stake-pool-operation` all use it.

Text goes through `parseMarkdownLikeText`, so `[label](url)` links and `**bold**` markers are rendered as links and bold text.

## Basic Usage

From `src/pages/what-is-cardano.js`:

```jsx
import DottedImageWithText from '@site/src/components/Layout/DottedImageWithText';
import { translate } from '@docusaurus/Translate';

<DottedImageWithText
  imageName="proof-of-stake"
  title={translate({ id: "whatIsCardano.how.consensus.title", message: "Consensus: Ouroboros" })}
  text={[
    translate({
      id: "whatIsCardano.how.consensus.text",
      message: "Time on Cardano is divided into slots of one second and epochs of five days. Slots are assigned at random to stake pools, weighted by how much ada is delegated to them, and the chosen pool produces the next block.",
    }),
  ]}
  headingDot={true}
/>
```

A markdown-style link inside the text, from `src/pages/ouroboros.js`:

```jsx
<DottedImageWithText
  imageName="power-arrows"
  title={translate({ id: 'ouroboros.features.energyEfficient.title', message: 'Energy Efficient' })}
  text={[
    translate({ id: 'ouroboros.features.energyEfficient.text1', message: 'Using Ouroboros, Cardano is able to securely, sustainably, and ethically scale, with up to [four million times the energy efficiency of bitcoin](https://developers.cardano.org/docs/operate-a-stake-pool/basics/consensus-staking/#ouroboros-protocol).' }),
  ]}
  headingDot={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageName` | `string` | - | File name without extension under `static/img/dotted-icons/`. Resolved to `/img/dotted-icons/<imageName>.svg` with the locale base URL. When omitted, no image column renders. |
| `title` | `string` | - | Optional `<h2>` above the text. |
| `text` | `string` \| `string[]` \| `{ list: string[] }` | - | The body. A string renders one paragraph. An array renders each entry in turn, where an entry may again be a string or a `{ list: [...] }` object, which renders a `<ul>`. Every string is parsed for markdown-style links and bold text. |
| `headingDot` | `boolean` | - | Adds the `headingDot` class to the title. |

## Live Preview

<DottedImageWithText
  imageName="proof-of-stake"
  title="Consensus: Ouroboros"
  text={[
    "Time on Cardano is divided into slots of one second and epochs of five days. Slots are assigned at random to stake pools, weighted by how much ada is delegated to them.",
    { list: ["Most slots stay empty, so a block appears roughly every **20 seconds**.", "Running the network needs ordinary servers, not warehouses of mining hardware."] },
  ]}
  headingDot={true}
/>

## Notes

- Only `.svg` files are picked up. The folder also contains a few `.png` files, which this component cannot render.
- The image `alt` text is the `imageName`, so choose descriptive file names.
- Consumers pass already translated strings. Keep the markdown link syntax inside the `message` so it survives translation.
- Available icons at the time of writing: `ada-upturned-hand`, `agriculture`, `chains`, `decentralization`, `desireability`, `dots-with-line`, `education`, `finance`, `get-funded`, `government`, `healthcare`, `innovation`, `machine-squares`, `nft`, `opportunity`, `people`, `pledging`, `power-arrows`, `proof-of-stake`, `proof-of-work`, `purpose`, `research`, `retail`, `saturation`, `technology`, `wallet-cold`, `wallet-hot`. Check `static/img/dotted-icons/` for the current list.
