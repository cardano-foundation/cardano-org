---
title: Two Column Layout
---

## Two Column Layout

The `TwoColumnLayout` component creates a responsive two-column grid layout with a main content area and a sidebar. The sidebar can optionally be sticky, staying visible as users scroll through long content.

## Features

- **Responsive Design**: Automatically switches to single column on mobile/tablet
- **Sticky Sidebar**: Optional sticky positioning for the sidebar
- **Customizable Ratio**: Adjust the width ratio between columns
- **Flexible Content**: Accepts any React components as children

## Basic Usage

```jsx
import TwoColumnLayout from '@site/src/components/TwoColumnLayout';

<TwoColumnLayout
  sidebar={<div>Sidebar content here</div>}
>
  <div>Main content here</div>
</TwoColumnLayout>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | *required* | Main content for the left column |
| `sidebar` | `ReactNode` | *required* | Content for the right sidebar |
| `sidebarSticky` | `boolean` | `true` | Whether the sidebar should stick when scrolling |
| `sidebarTop` | `string` | `'2rem'` | Top offset for sticky sidebar (CSS value) |
| `ratio` | `string` | `'2:1'` | Column width ratio (e.g., '2:1', '3:1') |

## Examples

### Basic Two-Column Layout

```jsx
<TwoColumnLayout
  sidebar={
    <div style={{ 
      padding: '1.5rem', 
      background: 'var(--ifm-background-surface-color)',
      borderRadius: '12px'
    }}>
      <h3>Quick Links</h3>
      <ul>
        <li>Link 1</li>
        <li>Link 2</li>
        <li>Link 3</li>
      </ul>
    </div>
  }
>
  <div>
    <h1>Main Article</h1>
    <p>Your main content goes here...</p>
  </div>
</TwoColumnLayout>
```

### With Quiz Sidebar

```jsx
import QuizModal from '@site/src/components/QuizModal';
import quizData from '@site/src/data/quiz-demo.json';

<TwoColumnLayout
  sidebar={
    <div style={{ 
      background: 'var(--ifm-background-surface-color)', 
      padding: '1.5rem', 
      borderRadius: '16px',
      border: '2px solid var(--ifm-color-emphasis-200)'
    }}>
      <h3>Test Your Knowledge</h3>
      <p>Take a quick quiz to test what you've learned.</p>
      <QuizModal 
        quizData={quizData} 
        buttonText="Start Quiz"
        questionCount={5}
      />
    </div>
  }
>
  <div>
    <h1>Educational Content</h1>
    <p>Learn about various topics...</p>
  </div>
</TwoColumnLayout>
```

### Custom Column Ratio

Use a 3:1 ratio for a wider main content area:

```jsx
<TwoColumnLayout
  ratio="3:1"
  sidebar={<div>Narrow sidebar</div>}
>
  <div>Wide main content</div>
</TwoColumnLayout>
```

### Non-Sticky Sidebar

```jsx
<TwoColumnLayout
  sidebarSticky={false}
  sidebar={<div>Regular sidebar</div>}
>
  <div>Main content</div>
</TwoColumnLayout>
```

### Custom Sticky Offset

Useful when you have a fixed header:

```jsx
<TwoColumnLayout
  sidebarTop="5rem"
  sidebar={<div>Sidebar with more top spacing</div>}
>
  <div>Main content</div>
</TwoColumnLayout>
```

## Responsive Behavior

### Desktop (>996px)
- Displays two columns side by side
- Sidebar can be sticky if enabled
- Column widths follow the specified ratio

### Mobile/Tablet (≤996px)
- Automatically switches to single column layout
- Sidebar appears below main content
- Sticky positioning is disabled for better mobile UX

## Common Use Cases

1. **Educational Content with Quiz**: Main content on left, quiz button in sticky sidebar
2. **Article with Table of Contents**: Long-form content with navigation sidebar

## Styling

The component uses CSS modules for scoped styling. The layout is built with CSS Grid for robust responsive behavior.

### Custom Styling

You can add custom styles to your sidebar or main content:

```jsx
<TwoColumnLayout
  sidebar={
    <div className="my-custom-sidebar">
      Custom styled sidebar
    </div>
  }
>
  <div className="my-custom-content">
    Custom styled content
  </div>
</TwoColumnLayout>
```

## Best Practices

1. **Keep sidebar content concise**: The sidebar is narrower, so avoid lengthy content
2. **Use sticky wisely**: Not all sidebars need to be sticky; consider the user experience
3. **Mobile-first content**: Ensure sidebar content makes sense when it appears below main content
4. **Avoid heavy images in sticky sidebars**: Can cause performance issues on scroll
5. **Test on various screen sizes**: Ensure your content works well at the 996px breakpoint

## Example

The [Common Scams](/common-scams) page uses this component to display scam information with a quiz sidebar that stays visible as users learn about different threats.

```jsx title="src/pages/common-scams.js"
<TwoColumnLayout
  sidebar={
    <div style={{ 
      background: 'var(--ifm-background-surface-color)', 
      padding: '1.5rem', 
      borderRadius: '16px',
      border: '2px solid var(--ifm-color-emphasis-200)'
    }}>
      <h3>Test Your Knowledge</h3>
      <p>Take our quiz to see how well you can identify scams.</p>
      <QuizModal 
        quizData={scamsQuizData} 
        buttonText="Start Quiz"
      />
    </div>
  }
>
  {/* All scam information content */}
</TwoColumnLayout>
```
