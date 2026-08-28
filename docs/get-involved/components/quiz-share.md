---
title: Quiz Share
description: Let users share a finished quiz result as a badge image with a spoiler-free text summary using the QuizShare component on cardano.org.
---

## Quiz Share

The `QuizShare` component renders a single button that shares a finished quiz run: the result badge PNG (rendered by [`Quiz`](./quiz.md) on the results screen) together with a compact, spoiler-free text summary, a headline, a grid of emoji standing in for correct and incorrect answers, the score, the tier, and a link back to the quiz. It works through a fallback chain, native file share, clipboard image, download, down to a text-only share if the badge is unavailable.

It appears automatically on the [`Quiz`](./quiz.md) hub mode results screen once a run finishes above the `learning` tier, but it can also be used standalone anywhere a finished quiz result needs a share action.

## Basic Usage

```jsx
import QuizShare from '@site/src/components/QuizShare';

<QuizShare
  quizTitle="Wallet Security"
  results={[true, true, false, true, true]}
  score={4}
  total={5}
  tierKey="silver"
  tierLabel="Silver"
/>
```

**Live Preview:**

import QuizShare from '@site/src/components/QuizShare';

<QuizShare
  quizTitle="Wallet Security"
  results={[true, true, false, true, true]}
  score={4}
  total={5}
  tierKey="silver"
  tierLabel="Silver"
/>

Without a `getBadgeBlob` prop, as in the preview above, there is no rendered badge to share, so clicking the button falls straight to the text-only share described below.

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quizTitle` | `string` | *required* | Quiz title, shown in the share headline |
| `results` | `array of boolean` | *required* | One entry per question, `true` for correct, rendered as a blue/white circle grid in the share text |
| `score` | `number` | *required* | Number of correct answers |
| `total` | `number` | *required* | Number of questions |
| `tierKey` | `string` | *required* | Tier key, `bronze`, `silver`, or `gold`. Picks the default `url` (that tier's share page) |
| `tierLabel` | `string` | *required* | Localized tier label shown next to the score, for example `Gold` |
| `url` | `string` | the tier's share page, e.g. `https://cardano.org/quiz/share/gold` | Link included at the end of the share text. Falls back to `https://cardano.org/quiz` if `tierKey` does not match a known tier |
| `getBadgeBlob` | `function` | `undefined` | `() => Promise<Blob>`. Returns the badge PNG render already in flight on the result screen (see [Quiz](./quiz.md#hub-mode)), so the share button reuses that exact image instead of rendering a second one. Left out, or if it rejects, the share falls straight back to the text-only summary |

---

## The Wordle Pattern

The share text is deliberately made of a headline, a row of emoji, the score, the tier, and a link, and nothing else: no question text, no answer options, no explanations. This is the pattern Wordle popularized for its daily grid, and it works for the same reason here: sharing a result never spoils the quiz content for whoever receives it.

```
Cardano Quiz: Wallet Security
🔵🔵⚪🔵🔵 4/5, Silver
Can you get gold? https://cardano.org/quiz/share/silver
```

The text is built by the named export `buildShareText({ quizTitle, results, score, total, tierLabel, url })`, importable on its own for tests or previews without rendering the component:

```js
import { buildShareText } from '@site/src/components/QuizShare';

buildShareText({
  quizTitle: 'Wallet Security',
  results: [true, true, false, true, true],
  score: 4,
  total: 5,
  tierLabel: 'Silver',
  url: 'https://cardano.org/quiz/share/silver',
});
```

This same text travels as the accompanying message alongside the badge image everywhere the image is shared or downloaded, and it is the entire message in the text-only fallback.

---

## Share Chain

Clicking the button tries the badge PNG first, then falls back step by step:

1. **Badge PNG, native file share**: awaits `getBadgeBlob()` for the already-rendered badge, then, where the Web Share API supports sharing files (typically mobile), opens the device's native share sheet with the badge image and the text summary pre-filled. If the user cancels the share sheet, the interaction just ends there.
2. **Badge PNG, clipboard image**: where file sharing is unavailable, for example most desktop browsers, but the Clipboard API can write images (`ClipboardItem`), copies the badge PNG and the text summary together so pasting into a chat or post carries both.
3. **Badge PNG, download**: where even clipboard images are unavailable, downloads the badge PNG to the device and, as a best effort, also copies the text summary to the clipboard alongside it.
4. **Text-only fallback**: the original text-only share, used when `getBadgeBlob` was not provided, the badge failed to render, or every image-sharing route above failed. It follows its own short chain: the Web Share API with just the text if available, otherwise `navigator.clipboard.writeText`, otherwise the click quietly does nothing rather than showing an error.

---

## Internationalization (i18n)

All UI strings use `translate()` from `@docusaurus/Translate`, under the `quiz.share.*` namespace, translatable via `i18n/<locale>/code.json`. The button label reflects the current step of the chain and resets to its idle state after two seconds.

| Key | English Default |
|-----|----------------|
| `quiz.share.button` | Share your result |
| `quiz.share.pending` | Sharing... |
| `quiz.share.imageCopied` | Image copied! |
| `quiz.share.downloaded` | Downloaded! |
| `quiz.share.copied` | Copied! |
| `quiz.share.headline` | Cardano Quiz: \{quizTitle\} |
| `quiz.share.cta` | Can you get gold? \{url\} |
| `quiz.share.badge.brand` | Cardano Quiz |
| `quiz.share.badge.footer` | Self-test · cardano.org/quiz |

The last two keys are drawn on the badge PNG itself, in `src/components/QuizShare/renderBadge.js`, not in the button UI.

---

## Related Components

- **[Quiz](./quiz.md)** - The quiz engine that renders the badge and this button on its hub mode results screen
- **[Quiz Card](./quiz-card.md)** - Call-to-action card for launching a quiz
