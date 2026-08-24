---
title: Quiz Share
description: Let users share a finished quiz result as a Wordle-style, spoiler-free summary using the QuizShare component on cardano.org.
---

## Quiz Share

The `QuizShare` component renders a single button that shares a compact, spoiler-free summary of a finished quiz run: a headline, a grid of emoji standing in for correct and incorrect answers, the score, the tier, and a link back to the quiz. It tries the device share sheet first and falls back to copying the text to the clipboard.

It appears automatically on the [`Quiz`](./quiz.md) hub mode results screen once a run finishes above the `learning` tier, but it can also be used standalone anywhere a finished quiz result needs a share action.

## Basic Usage

```jsx
import QuizShare from '@site/src/components/QuizShare';

<QuizShare
  quizTitle="Wallet Security"
  results={[true, true, false, true, true]}
  score={4}
  total={5}
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
  tierLabel="Silver"
/>

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quizTitle` | `string` | *required* | Quiz title, shown in the share headline |
| `results` | `array of boolean` | *required* | One entry per question, `true` for correct, rendered as a blue/white circle grid |
| `score` | `number` | *required* | Number of correct answers |
| `total` | `number` | *required* | Number of questions |
| `tierLabel` | `string` | *required* | Localized tier label shown next to the score, for example `Gold` |
| `url` | `string` | `'https://cardano.org/quiz'` | Link included at the end of the share text |

---

## The Wordle Pattern

The share text is deliberately made of a headline, a row of emoji, the score, the tier, and a link, and nothing else: no question text, no answer options, no explanations. This is the pattern Wordle popularized for its daily grid, and it works for the same reason here: sharing a result never spoils the quiz content for whoever receives it.

```
Cardano Quiz: Wallet Security
🔵🔵⚪🔵🔵 4/5, Silver
Can you get gold? https://cardano.org/quiz
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
  url: 'https://cardano.org/quiz',
});
```

---

## Share and Clipboard Fallback

Clicking the button follows a short fallback chain:

1. **Web Share API**: if `navigator.share` is available, typically on mobile, it opens the device's native share sheet with the summary text pre-filled.
2. **Clipboard**: if the Web Share API is unavailable, for example on most desktop browsers, or the user cancels the share sheet, the component falls back to `navigator.clipboard.writeText` and the button label changes to `Copied!` for two seconds.
3. **No-op**: if the clipboard is also unavailable, for example permissions denied or a non-HTTPS context, the click quietly does nothing rather than showing an error.

---

## Internationalization (i18n)

All UI strings use `translate()` from `@docusaurus/Translate`, under the `quiz.share.*` namespace, translatable via `i18n/<locale>/code.json`.

| Key | English Default |
|-----|----------------|
| `quiz.share.button` | Share your result |
| `quiz.share.copied` | Copied! |
| `quiz.share.headline` | Cardano Quiz: \{quizTitle\} |
| `quiz.share.cta` | Can you get gold? \{url\} |

---

## Related Components

- **[Quiz](./quiz.md)** - The quiz engine that renders this on its hub mode results screen
- **[Quiz Card](./quiz-card.md)** - Call-to-action card for launching a quiz
