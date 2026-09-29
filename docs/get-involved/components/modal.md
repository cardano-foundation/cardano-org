---
title: Modal
description: Open any content in an accessible dialog from a trigger button using the Modal component on cardano.org.
---

import Modal from '@site/src/components/Modal';

## Modal

The shared dialog shell. It renders a trigger button and, once clicked, an overlay with a `role="dialog"` box, a close button, and whatever you pass as children. The overlay is portaled to `document.body`, so a transformed or clipped ancestor (a hovering card, for example) cannot cut it off.

Scroll lock, focus trap, focus restore, and Escape to close come from the `useModalA11y` hook in `src/utils/useModalA11y.js`. Clicking the backdrop also closes the dialog.

[Quiz Modal](./quiz-modal.md) and `SurveyModal` are thin wrappers around this component. Use `Modal` directly when you need a dialog for something else.

## Basic Usage

From `src/components/SurveyModal/index.js`:

```jsx
import Modal from '@site/src/components/Modal';
import Survey from '@site/src/components/Survey';

const SurveyModal = ({ surveyData, buttonText = "Start", questionCount, buttonClassName }) => (
  <Modal label="Survey" buttonText={buttonText} buttonClassName={buttonClassName}>
    <Survey surveyData={surveyData} questionCount={questionCount} />
  </Modal>
);
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Accessible name of the dialog (`aria-label`). Also lowercased into the close button's label, "Close quiz" for `label="Quiz"`. Required. |
| `buttonText` | `string` \| `ReactNode` | - | Content of the trigger button. |
| `buttonClassName` | `string` | - | Class name for the trigger button. When omitted, the built-in blue `startButton` style is used. |
| `children` | `ReactNode` | - | The dialog content. |

## Live Preview

<Modal label="Example" buttonText="Open the example dialog">
  <h2>Hello from the modal</h2>
  <p>Press Escape, click the close button, or click outside the box to close it.</p>
</Modal>

## Notes

- The dialog state lives inside the component. There is no controlled mode and no `onClose` callback.
- `label` is used in string operations, so pass a plain string, and pass a translated one, since it is read by screen readers.
- The close button label is built as `Close ${label.toLowerCase()}` and is not translated separately.
- The overlay and content box are styled in `src/components/Modal/styles.module.css` and respect `prefers-reduced-motion` by dropping the button transitions.
