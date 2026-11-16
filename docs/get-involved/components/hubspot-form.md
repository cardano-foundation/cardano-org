---
title: HubSpot Form
description: Embed a HubSpot form, such as the contact form or the Community Digest sign-up, using the HubSpotForm component on cardano.org.
---

## HubSpotForm

`HubSpotForm` embeds a form from HubSpot. It loads HubSpot's form script once and lets HubSpot render the form into an empty `div`. The contact form on `/contact` (topic "another inquiry") and the Community Digest sign-up on `/newsletter` use it.

## When to use

- A form that is managed in HubSpot, so submissions land there.
- For a form that only links somewhere else, use a button or a [Page CTA](./page-cta.md) instead.

## Basic Usage

The form ids live in `hubspot.config.js` at the repository root. Add an entry there and pass its key:

```js title="hubspot.config.js"
const HubSpotConfig = {
  contactForm: {
    portalId: '7759219',
    formId: '87e356e8-908d-4d11-93ba-ecdcd8227c4f',
    region: 'na1',
    id: 'hubspotForm'
  },
};
```

`id` is the id of the `div` the form renders into. Keep it unique on the page and a valid CSS identifier.

```jsx
import HubSpotForm from '@site/src/components/Layout/HubSpotForm';

<HubSpotForm form="contactForm" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `form` | `string` | *required* | Key of the form in `hubspot.config.js`. |
| `className` | `string` | - | Extra class on the outer `div`. |

There is no live preview on this page, because a working form would send real submissions to HubSpot.

## Behavior

- HubSpot's script loads once per page view, the first time a form mounts, and every form shares it. After a visit to another form page the form renders at once.
- When the component unmounts before the script has loaded, the late script does not render a form any more.
- A change of `form` renders the form again.
- If HubSpot is blocked, the `div` stays empty.

## Styling

`src/components/Layout/HubSpotForm/styles.module.css` styles the markup HubSpot renders (`hs-*` classes, `.input` wrappers, `textarea`). HubSpot's markup has no module classes, so the rules reach it through `:global` under the form wrapper and do not affect other forms on the site. The site-wide Infima button variables (`--ifm-button-*`) live in `src/css/custom.css`.
