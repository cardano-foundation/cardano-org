---
title: Step Card 
---

## StepCard 

The `StepCard` component creates interactive multi-step guided experiences. It's perfect for onboarding flows, tutorials, or any process that needs to be broken down into sequential steps.

## Features

- **Step indicator** showing current progress (e.g., "1 / 3")
- **Checkbox validation** - users must check a box before continuing
- **Auto-managed state** - handles step progression internally
- **Responsive design** - adapts to mobile and desktop screens
- **Flexible content** - each step can contain any React component

## Basic Usage

```jsx
import StepCard from '@site/src/components/Layout/StepCard';

const steps = [
  {
    title: "Step 1 Title",
    description: "Description of what the user needs to do.",
    content: <p>Your content here</p>,
    checkboxLabel: "I've completed this step.",
  },
  {
    title: "Step 2 Title",
    description: "Next step description.",
    content: <p>More content</p>,
    checkboxLabel: "I'm ready to continue.",
  },
  {
    title: "Final Step",
    description: "All done!",
    content: <p>Summary or next actions</p>,
    finalStep: true,
  },
];

<StepCard steps={steps} />
```

## Step Object Properties

Each step object in the `steps` array can have these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | The main heading for the step |
| `description` | string | Yes | Explanatory text shown below the title |
| `content` | React.ReactNode | Yes | Any React component(s) to display in the step |
| `checkboxLabel` | string | No | Text for the checkbox. Omit for final step |
| `finalStep` | boolean | No | Set to `true` to hide checkbox and continue button |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | array | `[]` | Array of step objects (see above) |
| `initialStep` | number | `1` | Which step to start on (1-indexed) |
| `onStepChange` | function | - | Callback fired when step changes. Receives new step number |


## Live Demo

import StepCard from '@site/src/components/Layout/StepCard';

export const demoSteps = [
  {
    title: "Choose your path",
    description: "This is a simple demo showing how the StepCard component works.",
    content: (
      <div>
        <p>✨ This component helps guide users through multi-step processes.</p>
        <p>Check the box below and click Continue to proceed to the next step.</p>
      </div>
    ),
    checkboxLabel: "I understand how this works.",
  },
  {
    title: "Keep going",
    description: "You're making progress!",
    content: (
      <div>
        <p>🚀 Each step can contain any content you want:</p>
        <ul>
          <li>Lists like this one</li>
          <li>Images, videos, or components</li>
          <li>Forms or interactive elements</li>
        </ul>
      </div>
    ),
    checkboxLabel: "Ready for the final step!",
  },
  {
    title: "All done!",
    description: "You've completed the demo.",
    content: (
      <div>
        <p>🎉 Notice how the final step doesn't have a checkbox or continue button?</p>
        <p>That's because we set <code>finalStep: true</code> on this step object.</p>
      </div>
    ),
    finalStep: true,
  },
];

<StepCard steps={demoSteps} />

## Styling

The component uses CSS modules for styling. You can override styles by targeting these classes:

- `.stepCard` - The main card container
- `.stepIndicator` - The "1 / 3" progress indicator
- `.stepDescription` - The description text
- `.stepContentWrapper` - Wrapper around the custom content
- `.stepActions` - Container for checkbox and button
- `.checkboxLabel` - The checkbox and label
- `.continueButton` - The continue button

## Use Cases

- **Onboarding flows** - Guide new users through setup
- **Tutorials** - Step-by-step learning experiences
- **Forms** - Break long forms into manageable steps
- **Wizards** - Configuration or setup processes
- **Workflows** - Any sequential process

## Notes

- The checkbox must be checked before the Continue button becomes enabled
- Steps are 1-indexed (first step is 1, not 0)
- The `onStepChange` callback is useful for analytics or saving progress
- For the final step, omit `checkboxLabel` or set `finalStep: true` to hide the controls
