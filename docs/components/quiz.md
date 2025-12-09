
# Quiz Component

The `Quiz` component displays an interactive quiz with multiple-choice questions. It supports random question selection, immediate feedback, explanations, and score tracking. Perfect for educational content and knowledge testing.

## Basic Usage

```jsx
import Quiz from '@site/src/components/Quiz';
import quizData from '@site/src/data/quiz-basic.json';

<Quiz quizData={quizData} />
```

**Live Preview:**

import Quiz from '@site/src/components/Quiz';
import quizData from '@site/src/data/quiz-basic.json';

<Quiz quizData={quizData} questionCount={5} allowRetry={false}/>

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quizData` | `object` | *required* | Quiz data object containing questions and metadata |
| `questionCount` | `number` | `5` | Number of questions to randomly select from the quiz |
| `allowRetry` | `boolean` | `true` | Whether users can retry incorrect answers |
| `passingScore` | `number` | `60` | Minimum percentage required to pass (0-100) |

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

### Custom Passing Score

Set a higher passing threshold (e.g., 80%):

```jsx
<Quiz quizData={quizData} passingScore={80} />
```

### Strict Quiz Mode

Combine no retry with a high passing score:

```jsx
<Quiz quizData={quizData} allowRetry={false} passingScore={80} />
```

### Custom Quiz Data

Create your own quiz JSON file:

```jsx
import customQuiz from '@site/src/data/quiz-custom.json';

<Quiz quizData={customQuiz} questionCount={10} />
```

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

## User Flow

1. **Start**: User sees first question with 4 options (A, B, C, D)
2. **Select**: User clicks an option (highlights in purple)
3. **Check**: User clicks "Check answer" button
4. **Feedback**: 
   - Correct answer highlights in green
   - Wrong answer highlights in red
   - Explanation appears below options
5. **Continue**: 
   - If incorrect: "Try again" button allows retry
   - "Next question" button proceeds to next question
6. **Complete**: After all questions, results screen shows final score
7. **Retry**: "Try again" button restarts quiz with new random questions

---
 

## Integration Example

Using the quiz component in a documentation page:

```mdx
---
title: Test Your Cardano Knowledge
---

import Quiz from '@site/src/components/Quiz';
import quizData from '@site/src/data/quiz-basic.json';

# Cardano Basics Quiz

After learning about Cardano fundamentals, test your knowledge with this quiz!

<Quiz quizData={quizData} questionCount={5} />

## Keep Learning

- [Cardano Documentation](https://docs.cardano.org)
- [Developer Portal](https://developers.cardano.org)
```

---

## Accessibility

The component includes accessibility features:

- **Keyboard navigation**: Tab through options, Enter to select
- **Screen reader support**: Proper ARIA labels and roles
- **Color contrast**: Meets WCAG AA standards
- **Focus indicators**: Clear visual focus states
- **Disabled states**: Properly disabled buttons after answer selection

---
 
 

## Related Components

- **[FAQ Component](/docs/tutorial/faq-component)** - For Q&A content without scoring
- **Tutorial pages** - Educational content that can be reinforced with quizzes

---

## Example Quiz Files

The repository includes:

- **`quiz-basic.json`** - Cardano fundamentals  

You can create additional quiz files for different topics:
- `quiz-staking.json` - Staking concepts
- `quiz-smart-contracts.json` - Plutus and smart contracts
- `quiz-governance.json` - Cardano governance
