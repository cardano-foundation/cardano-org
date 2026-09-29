---
title: Quiz Modal
description: Launch a Quiz inside a Modal from a single button using the QuizModal component on cardano.org.
---

import QuizModal from '@site/src/components/QuizModal';
import quizData from '@site/src/data/quiz-demo.json';

## QuizModal

A one-line composition of [Modal](./modal.md) and [Quiz](./quiz.md): a trigger button that opens the quiz in a dialog labeled "Quiz". All quiz behavior belongs to `Quiz`, all dialog behavior to `Modal`. This component only forwards props.

[Quiz Card](./quiz-card.md) wraps it in a styled card, and `QuizHub` uses it for every quiz on `/quiz`.

## Basic Usage

Classic usage, as [Quiz Card](./quiz-card.md) does it:

```jsx
import QuizModal from '@site/src/components/QuizModal';
import quizData from '@site/src/data/quiz-demo.json';

<QuizModal
  quizData={quizData}
  buttonText="Test Your Knowledge"
  questionCount={5}
  passingScore={60}
  allowRetry={true}
/>
```

Hub mode, from `src/components/QuizHub/index.js`:

```jsx
<QuizModal
  quizData={data}
  questionCount={data.questionCount}
  allowRetry={false}
  onRecord={onRecord}
  academyCta={getAcademyCta(entry.academyKey, entry.id)}
  buttonText={translate({ id: 'quiz.hub.start', message: 'Start quiz' })}
  buttonClassName={styles.cardCta}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quizData` | `object` | - | The quiz JSON, see the [Quiz data format](./quiz.md#quiz-data-format). Required. |
| `buttonText` | `string` | `"Test Your Knowledge"` | Content of the trigger button. Pass a translated string, the default is English only. |
| `questionCount` | `number` | `5` | Forwarded to `Quiz`. Number of questions sampled per run. |
| `allowRetry` | `boolean` | `true` | Forwarded to `Quiz`. Whether a retry button appears after a failed run. |
| `passingScore` | `number` | `60` | Forwarded to `Quiz`. Minimum percentage to pass. |
| `onRecord` | `function` | `null` | Forwarded to `Quiz`. `(correct, total) => void`, switches the quiz into hub mode. |
| `academyCta` | `object` | `null` | Forwarded to `Quiz`. Follow-up link shown on the hub mode result screen. |
| `buttonClassName` | `string` | - | Forwarded to `Modal`. Replaces the default trigger button style. |

## Live Preview

<QuizModal quizData={quizData} buttonText="Try the demo quiz" questionCount={3} />

## Notes

- The dialog label is hardcoded to `"Quiz"`, which also yields the close button label "Close quiz".
- The [Two Column Layout](./two-column-layout.md) example on the common scams page uses [Quiz Card](./quiz-card.md), not this component directly.
- For the full list of quiz props, hub mode, and the data format, read [Quiz](./quiz.md).
