# Quiz Card

The `QuizCard` component is a call-to-action card designed to promote quiz engagement. It displays a title, description, and a button to launch a quiz in a modal. Optionally, it can include a subtle animated attention dot to draw user focus.

## Features

- **Styled Card**: Pre-styled with background, border, and padding
- **Animated Attention Dot**: Optional floating red dot animation (desktop only)
- **Fully Configurable**: All quiz parameters can be customized
- **Responsive**: Works seamlessly on all screen sizes
- **Reusable**: Perfect for sidebars, call-to-action sections, or standalone placement

## Basic Usage

```jsx
import QuizCard from '@site/src/components/QuizCard';
import quizData from '@site/src/data/quiz-demo.json';

<QuizCard
  quizData={quizData}
  title="Test Your Knowledge"
  description="Take the 5-question quiz to see how well you understand the topic."
  questionCount={5}
/>
```

**Live Preview:**

import QuizCard from '@site/src/components/QuizCard';
import quizData from '@site/src/data/quiz-demo.json';

<QuizCard
  quizData={quizData}
  title="Test Your Knowledge"
  description="Take the 5-question quiz to see how well you understand the topic."
  questionCount={5}
/>

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quizData` | `object` | *required* | Quiz data object containing questions |
| `title` | `string` | `'Test Your Knowledge'` | Card heading text |
| `description` | `string` | - | Optional description text below title |
| `buttonText` | `string` | `'Start Quiz'` | Text displayed on the quiz button |
| `questionCount` | `number` | `5` | Number of questions to show |
| `passingScore` | `number` | `60` | Minimum percentage to pass (0-100) |
| `allowRetry` | `boolean` | `true` | Whether users can retry incorrect answers |
| `showDot` | `boolean` | `false` | Show animated attention dot |

## Examples

### Basic Quiz Card

```jsx
<QuizCard
  quizData={quizData}
  title="Quick Knowledge Check"
  description="Test what you've learned in just 3 questions."
  questionCount={3}
/>
```

<QuizCard
  quizData={quizData}
  title="Quick Knowledge Check"
  description="Test what you've learned in just 3 questions."
  questionCount={3}
/>

### Quiz Card with Animated Dot

Perfect for drawing attention in sidebars:

```jsx
<QuizCard
  quizData={quizData}
  title="Security Awareness Quiz"
  description="Can you spot the scams? Take our quiz to find out."
  questionCount={5}
  passingScore={80}
  showDot={true}
/>
```

<QuizCard
  quizData={quizData}
  title="Security Awareness Quiz"
  description="Can you spot the scams? Take our quiz to find out."
  questionCount={5}
  passingScore={80}
  showDot={true}
/>

### Strict Quiz Mode

No retries allowed, high passing score:

```jsx
<QuizCard
  quizData={quizData}
  title="Certification Exam"
  description="Pass this exam with 90% to earn your certificate."
  questionCount={5}
  passingScore={90}
  allowRetry={false}
  buttonText="Begin Exam"
/>
```

<QuizCard
  quizData={quizData}
  title="Certification Exam"
  description="Pass this exam with 90% to earn your certificate."
  questionCount={5}
  passingScore={90}
  allowRetry={false}
  buttonText="Begin Exam"
/>

### Custom Button Text

```jsx
<QuizCard
  quizData={quizData}
  title="Weekly Challenge"
  description="Take on this week's challenge quiz!"
  buttonText="Accept Challenge"
/>
```

<QuizCard
  quizData={quizData}
  title="Weekly Challenge"
  description="Take on this week's challenge quiz!"
  buttonText="Accept Challenge"
/>

### In a Two-Column Layout

Combine with `TwoColumnLayout` for sidebar placement:

```jsx
import TwoColumnLayout from '@site/src/components/TwoColumnLayout';

<TwoColumnLayout
  sidebar={
    <QuizCard
      quizData={quizData}
      title="Test Your Skills"
      description="Quick 5-question quiz on what you just learned."
      showDot={true}
    />
  }
>
  <div>
    {/* Main content here */}
  </div>
</TwoColumnLayout>
```

## Animated Attention Dot

The `showDot` prop enables a subtle red dot animation that moves organically around the card and appears and disappears with smooth transitions. 

### When to Use the Dot

**Good use cases:**
- Important quizzes that users should notice
- Sidebar call-to-action cards
- Above-the-fold quiz promotions
- Pages where quiz engagement is the primary goal

**Avoid using when:**
- Multiple quiz cards are on the same page
- The quiz is secondary to main content
- Page already has many animated elements
- Mobile-first experience is critical

## Styling

The component uses CSS modules for scoped styling. Default styles include:

- **Background**: `var(--ifm-background-surface-color)`
- **Border**: 2px solid with emphasis color
- **Border Radius**: 16px
- **Padding**: 1.5rem
- **Title Font Size**: 1.25rem
- **Description Color**: Emphasis color with proper contrast

### Custom Styling

Wrap the component in a div to add custom styles:

```jsx
<div style={{ maxWidth: '400px', margin: '2rem auto' }}>
  <QuizCard
    quizData={quizData}
    title="Centered Quiz Card"
  />
</div>
```

## Accessibility

- **Semantic HTML**: Uses proper heading hierarchy
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Friendly**: Clear text labels and structure
- **Focus Management**: Modal quiz handles focus appropriately
- **Motion**: Animation can be disabled via CSS `prefers-reduced-motion`

## Real-World Example

The [Common Scams](/common-scams) page uses this component in a sticky sidebar:

```jsx title="src/pages/common-scams.js"
import QuizCard from '@site/src/components/QuizCard';
import TwoColumnLayout from '@site/src/components/TwoColumnLayout';
import scamsQuizData from '@site/src/data/quiz-scams.json';

<TwoColumnLayout
  sidebar={
    <QuizCard
      quizData={scamsQuizData}
      title="Test Your Knowledge"
      description="Take the 5-question quiz to see how well you can identify and avoid common blockchain scams."
      buttonText="Start Quiz"
      questionCount={5}
      passingScore={80}
      allowRetry={false}
      showDot={true}
    />
  }
>
  {/* Main scam education content */}
</TwoColumnLayout>
```

## Integration with Other Components

### With QuizModal

`QuizCard` uses `QuizModal` internally, so all quiz functionality (modal overlay, question flow, scoring) is included automatically.

### With TwoColumnLayout

Perfect for sticky sidebar placement:

```jsx
<TwoColumnLayout sidebar={<QuizCard {...props} />}>
  {/* Content */}
</TwoColumnLayout>
```

### Standalone

Can be used independently anywhere on a page:

```jsx
<div className="my-page-section">
  <h2>Ready to Test Yourself?</h2>
  <QuizCard quizData={quizData} />
</div>
```

## Best Practices

1. **Clear Descriptions**: Tell users what to expect (number of questions, topic)
2. **Appropriate Difficulty**: Match `passingScore` to quiz difficulty
3. **Strategic Placement**: Use in sidebars or at natural break points in content
4. **Dot Sparingly**: Only use `showDot` for high-priority quizzes
5. **Mobile Consideration**: Ensure card fits well in single-column mobile layout
6. **Consistent Styling**: Use across multiple pages for brand consistency

## Performance

- **Lightweight**: Minimal CSS and no heavy dependencies
- **Efficient Animation**: CSS-only animations (no JavaScript)
- **Lazy Loading**: Quiz modal only loads when opened
- **No Layout Shift**: Fixed dimensions prevent content jumps

## Browser Support

Works in all modern browsers that support:
- CSS Grid
- CSS Animations
- CSS Custom Properties (CSS Variables)
- ES6+ JavaScript (for React components)
