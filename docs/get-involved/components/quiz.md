---
title: Quiz
description: Embed a multi-question quiz with scoring and retry handling using the Quiz component on cardano.org.
---

## Quiz

The `Quiz` component displays an interactive quiz with multiple-choice questions. It supports random question selection, immediate feedback, explanations, and score tracking. Perfect for educational content and knowledge testing.

## Basic Usage

```jsx
import Quiz from '@site/src/components/Quiz';
import quizData from '@site/src/data/quiz-demo.json';

<Quiz quizData={quizData} />
```

**Live Preview:**

import Quiz from '@site/src/components/Quiz';
import quizData from '@site/src/data/quiz-demo.json';

<Quiz quizData={quizData} questionCount={5} allowRetry={false}/>

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quizData` | `object` | *required* | Quiz data object containing questions and metadata |
| `questionCount` | `number` | `5` | Number of questions to randomly select from the quiz |
| `allowRetry` | `boolean` | `true` | Whether users can retry an incorrect answer before moving to the next question |
| `passingScore` | `number` | `60` | Minimum percentage required to pass (0-100) |
| `onRecord` | `function` | `null` | `(correct, total) => void`, called once when the quiz finishes. Passing a function switches the component into hub mode, see [Hub Mode](#hub-mode) below |
| `academyCta` | `object` | `null` | `{href, label}` shown as a follow-up link on the hub mode result screen. Ignored outside hub mode |

---

## Quiz Data Format

The quiz component expects a JSON file with the following structure:

```json
{
  "title": "Quiz Title",
  "description": "Optional description of the quiz",
  "questions": [
    {
      "id": 1,
      "question": "What is a dapp?",
      "options": [
        "A decentralized application running on a blockchain",
        "A car company",
        "A database error",
        "A food delivery service"
      ],
      "correctAnswer": 0,
      "explanation": "A dapp is a decentralized application..."
    }
  ]
}
```

### Field Descriptions

- **title** (string, optional): Main title displayed above the quiz
- **description** (string, optional): Brief description shown below the title
- **questions** (array, required): Array of question objects
  - **id** (number): Unique identifier for the question
  - **question** (string): The question text
  - **options** (array of strings): 4 answer choices (displayed as A, B, C, D)
  - **correctAnswer** (number): Index of the correct option (0-3)
  - **explanation** (string, optional): Explanation shown after answering

---

## Features

### Random Question Selection
- Automatically selects random questions from the provided data
- Control the number of questions with `questionCount` prop
- Each quiz session shows different questions (if pool is large enough)

### Interactive Feedback
- **Visual states**: Questions cards change color based on correct/incorrect answers
- **Immediate feedback**: Shows whether answer is correct or incorrect
- **Explanations**: Optional detailed explanations after each answer
- **Try again**: Allows retry on incorrect answers (configurable via `allowRetry` prop)

### Progress Tracking
- **Progress bar**: Visual indicator showing current question position
- **Score tracking**: Calculates final score as percentage
- **Results screen**: Shows final score with pass/fail indication (configurable via `passingScore` prop)

### Answer Randomization
- **Shuffled options**: Answer positions vary for each question to prevent pattern memorization
- **Shuffled questions**: Random question selection from the pool each session

### Visual Design
- **Color-coded states**:
  - Green: Correct answers
  - Red: Incorrect answers
  - Purple: Selected (before checking)
  - Gray: Unselected
- **Icons**: Checkmark for correct, X for incorrect
- **Smooth transitions**: All state changes are animated

---

## Examples

### Basic Quiz (5 Questions)

```jsx
<Quiz quizData={quizData} questionCount={5} />
```

### Full Quiz (All Questions)

To show all available questions, set `questionCount` to a high number:

```jsx
<Quiz quizData={quizData} questionCount={100} />
```

### Quiz Without Retry Option

Disable the retry button for incorrect answers:

```jsx
<Quiz quizData={quizData} allowRetry={false} />
```

<Quiz quizData={quizData} questionCount={3} allowRetry={false} />

---

### Custom Passing Score

Set a higher passing threshold (e.g., 80%):

```jsx
<Quiz quizData={quizData} passingScore={80} />
```

<Quiz quizData={quizData} questionCount={3} passingScore={80} />

---

### Strict Quiz Mode

Combine no retry with a high passing score:

```jsx
<Quiz quizData={quizData} allowRetry={false} passingScore={80} />
```

<Quiz quizData={quizData} questionCount={3} allowRetry={false} passingScore={80} />

---

### Scam Awareness Quiz

Using the scam awareness quiz (10 questions):

```jsx
import scamQuiz from '@site/src/data/quiz-scams.json';

<Quiz quizData={scamQuiz} questionCount={5} passingScore={80} />
```

import scamQuiz from '@site/src/data/quiz-scams.json';

<Quiz quizData={scamQuiz} questionCount={5} passingScore={80} />

---

## Hub Mode

Passing an `onRecord` function switches `Quiz` into hub mode. The results screen always shows the segmented green and red progress bar every result screen uses. On top of that, a run scoring 60 percent or higher also gets a rendered result badge image (bronze, silver, or gold), a [share button](./quiz-share.md) for that badge, and an optional academy call-to-action. A run below 60 percent lands in a fourth "learning" state instead: no badge and no share button, just the bar, the score text, and an encouragement to try again.

```jsx
import Quiz from '@site/src/components/Quiz';
import useQuizProgress from '@site/src/utils/useQuizProgress';
import { getQuizCatalog } from '@site/src/data/quiz/catalog';
import { getAcademyCta } from '@site/src/data/quiz/academy';

const { record } = useQuizProgress();
const entry = getQuizCatalog()[0];
const quizData = entry.getData();

<Quiz
  quizData={quizData}
  questionCount={quizData.questionCount}
  allowRetry={false}
  onRecord={(correct, total) => record(entry.id, correct, total)}
  academyCta={getAcademyCta(entry.academyKey, entry.id)}
/>
```

### The owner pattern

`useQuizProgress` reads and writes a single `localStorage` entry that covers every quiz on the hub. Instantiate it exactly once, in the page or hub component that owns the overall progress state, never inside `Quiz` itself, which stays unaware of storage or quiz identity entirely. The [`QuizHub`](https://github.com/cardano-foundation/cardano-org/blob/staging/src/components/QuizHub/index.js) component is the reference implementation: it holds the one `useQuizProgress` instance and hands each quiz card its own scoped callback:

```jsx
onRecord={(correct, total) => record(entry.id, correct, total)}
```

`Quiz` only ever reports a result up through whatever callback its owner gave it. This keeps the engine reusable and testable without pulling storage concerns into it.

### Why hub quizzes disable retry

Hub quizzes pass `allowRetry={false}`. The `allowRetry` prop lets a user retry a single question immediately after answering it wrong, before moving on, within the same run. If that were allowed in hub mode, a user could keep retrying every missed question until they got it right and always walk away with a perfect score, which would make the gold tier meaningless. Classic (non-hub) usage keeps `allowRetry` at its default of `true`, since there is no tier or share step to protect there.

### Classic usage is unchanged

Outside hub mode, `Quiz` behaves exactly as it always has: `onRecord` and `academyCta` default to `null`, no tier badge or share button appears, and restarting the quiz reuses the same sampled question set rather than drawing a new one. Hub mode resamples on restart instead, so a repeat attempt at gold pulls a fresh set of questions from the pool.

---

## Creating Quiz Data

### Step 1: Create JSON File

Create a new JSON file in `/src/data/` (e.g., `quiz-cardano-advanced.json`):

```json
{
  "title": "Advanced Cardano Quiz",
  "description": "Test your deeper knowledge of Cardano",
  "questions": [
    {
      "id": 1,
      "question": "Your question here?",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of the correct answer."
    }
  ]
}
```

### Step 2: Import and Use

```jsx
import Quiz from '@site/src/components/Quiz';
import advancedQuiz from '@site/src/data/quiz-cardano-advanced.json';

<Quiz quizData={advancedQuiz} questionCount={8} />
```

---

## Hub Quiz Data Pipeline

Quizzes shown on the [`/quiz`](/quiz) hub go through a separate, stricter pipeline than the freeform JSON files above. It does not apply to quiz files used directly with the classic `<Quiz quizData={...} />` pattern (`quiz-demo.json`, `quiz-scams.json`), those stay hand-authored JSON with no extra tooling.

### 1. Add a JSON source

Create a file in `src/data/quiz/` (for example `src/data/quiz/security.json`):

```json
{
  "id": "security",
  "title": "Wallet Security",
  "description": "Test how well you can spot a scam.",
  "difficulty": "beginner",
  "questionCount": 5,
  "questions": [
    {
      "id": "security-1",
      "question": "What should you never share to keep your wallet safe?",
      "options": [
        "Your seed phrase",
        "Your wallet address",
        "Your favorite dapp",
        "Your ada balance"
      ],
      "correctAnswer": 0,
      "explanation": "Your seed phrase gives full control over your wallet funds. No legitimate service will ever ask for it.",
      "sourceUrl": "https://cardano.org/faqs"
    }
  ]
}
```

Then register the new quiz in `src/data/quiz/catalog.js` so it shows up on the hub.

### 2. Generate the translate() module

```bash
yarn build-quiz
```

This runs `scripts/generate-quiz-modules.js`, which reads every `src/data/quiz/*.json` file and writes a matching module to `src/data/quiz/generated/<id>.js` with literal `translate()` calls around each string (`quiz.<id>.title`, `quiz.<id>.<questionId>.question`, `quiz.<id>.<questionId>.option0`, and so on). Literal calls are required so that `yarn write-translations` can extract every string. Generated files are committed to the repository, always edit the JSON source and re-run this command, never edit `generated/*.js` by hand.

### 3. Validate

```bash
yarn test:quiz-data
```

`scripts/check-quiz.js` enforces, per quiz file:

- `id` is a lowercase slug and matches the filename
- `difficulty` is one of `beginner`, `intermediate`, `advanced`
- the question pool is at least twice `questionCount`, so retries and hub replays draw a fresh sample from the pool, and repeat runs usually differ
- each question has 3 to 4 options and a `correctAnswer` index in range
- `explanation` is at least 30 characters long
- `sourceUrl` is present and its hostname is on an allowlist (`cardano.org`, `docs.cardano.org`, `developers.cardano.org`, `cips.cardano.org`, `essentialcardano.io`, `cardanofoundation.org`), so every explanation links back only to trusted, first-party sources
- no typographic dashes appear in any question, option, or explanation text
- the generated module in `src/data/quiz/generated/` matches its JSON source (run `yarn build-quiz` again if it has drifted)

`yarn build-quiz` also runs automatically as part of `yarn start` and `yarn build`. `yarn test:quiz-data` runs as part of `yarn test`, where its sync check fails the build if the generated module is out of date rather than regenerating it, so `yarn build-quiz` still needs to be run and committed by hand after a source change.

---

## Integration Example

```jsx
import Quiz from '@site/src/components/Quiz';
import quizData from '@site/src/data/quiz-demo.json';

<Quiz quizData={quizData} questionCount={5} />
```

---


## Internationalization (i18n)

All UI strings in the Quiz component (`Correct!`, `Incorrect`, `Check answer`, `Try again`, `Next question`, `Finish quiz`, `Explanation`, score text, etc.) use `translate()` from `@docusaurus/Translate` and can be translated via `i18n/<locale>/code.json` under the `quiz.ui.*` namespace.

Quiz content (questions, options, explanations) comes from the JSON data file. To support multiple languages, create a locale-specific copy (e.g., `quiz-scams.de.json`) and select the correct file in the parent page based on `currentLocale`:

```jsx
import quizDataEn from '@site/src/data/quiz-example.json';
import quizDataDe from '@site/src/data/quiz-example.de.json';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const {i18n: {currentLocale}} = useDocusaurusContext();
const quizData = currentLocale === 'de' ? quizDataDe : quizDataEn;

<Quiz quizData={quizData} />
```

### Available Translation Keys

| Key | English Default |
|-----|----------------|
| `quiz.ui.noQuestions` | No quiz questions available. |
| `quiz.ui.greatJob` | Great job! |
| `quiz.ui.keepLearning` | Keep learning! |
| `quiz.ui.scoreText` | You scored \{score\} out of \{totalQuestions\} |
| `quiz.ui.tryAgain` | Try again |
| `quiz.ui.correct` | Correct! |
| `quiz.ui.incorrect` | Incorrect |
| `quiz.ui.explanation` | Explanation |
| `quiz.ui.learnMore` | Learn more |
| `quiz.ui.checkAnswer` | Check answer |
| `quiz.ui.nextQuestion` | Next question |
| `quiz.ui.finishQuiz` | Finish quiz |

Hub mode adds a further set of keys, for the tier badge, and for the practice-your-mistakes loop on the results screen:

| Key | English Default |
|-----|----------------|
| `quiz.tier.learning` | Keep learning |
| `quiz.tier.bronze` | Bronze |
| `quiz.tier.silver` | Silver |
| `quiz.tier.gold` | Gold |
| `quiz.ui.practiceCleared` | All cleared! |
| `quiz.ui.practiceKeepGoing` | Almost there! |
| `quiz.ui.practiceRemaining` | Review remaining mistakes |
| `quiz.ui.practiceMistakes` | Review your mistakes |
| `quiz.ui.backToQuiz` | Take the full quiz again |
| `quiz.ui.practiceIntro` | Practice round: these are the questions you missed. This round does not change your score. |

The [`QuizShare`](./quiz-share.md) component shown on the hub results screen and the academy call-to-action text carry their own keys, documented on their respective pages.

---

## Related Components

- **[Quiz Card](./quiz-card.md)** - Call-to-action card that launches a `Quiz` in a modal
- **[Quiz Share](./quiz-share.md)** - Result sharing shown on the hub mode results screen
- **[FAQ Component](/docs/get-involved/faq-component)** - For Q&A content without scoring
- **Tutorial pages** - Educational content that can be reinforced with quizzes

---

## Available Quiz Files

Classic, freeform quiz files, used directly with `quizData`:

- **`quiz-demo.json`** - Cardano fundamentals (5 questions)
- **`quiz-scams.json`** - Common scam awareness (10 questions)
- **`quiz-scams.de.json`** - Common scam awareness, German (10 questions)

You can create additional quiz files for different topics.

Hub quizzes live separately, as sources in `src/data/quiz/*.json` that go through the [pipeline](#hub-quiz-data-pipeline) above and are wired into `src/data/quiz/catalog.js`.
