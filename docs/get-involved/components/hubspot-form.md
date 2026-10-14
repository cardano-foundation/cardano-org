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

The form ids live in `hubspot.config.js` at the repository root. Add an entry there and spread it into the component:

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

```jsx
import HubSpotForm from '@site/src/components/Layout/HubSpotForm';
import HubSpotConfig from '@site/hubspot.config';

<HubSpotForm {...HubSpotConfig.contactForm} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `formId` | `string` | *required* | HubSpot form id. |
| `portalId` | `string` | *required* | HubSpot portal id. |
| `region` | `string` | *required* | HubSpot region, for example `na1`. |
| `id` | `string` | *required* | Id of the `div` the form renders into. Unique on the page and a valid CSS identifier. |
| `className` | `string` | - | Extra class on the outer `div`. |

There is no live preview on this page, because a working form would send real submissions to HubSpot.

## Behavior

- The script loads the first time a form mounts. After a visit to another form page it is already there, and the form renders at once.
- When the component unmounts before the script has loaded, the late script does not render a form any more.
- A change of `formId`, `portalId`, `region`, or `id` renders the form again.
- If HubSpot is blocked, the `div` stays empty.

## Styling and known limits

`src/components/Layout/HubSpotForm/hs.css` styles the markup HubSpot renders (`hs-*` classes, `.input` wrappers, `textarea`). It is global CSS, because HubSpot's markup has no module classes. It also sets the Infima button variables (`--ifm-button-*`) on `:root`, so for the whole site. Scoping these rules under the form wrapper is a planned follow-up.
