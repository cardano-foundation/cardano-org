---
title: Edit On GitHub Callout
description: Close a page with a callout that invites readers to correct it on GitHub, using the EditOnGitHubCallout component on cardano.org.
---

import EditOnGitHubCallout from '@site/src/components/Layout/EditOnGitHubCallout';

## EditOnGitHubCallout

`EditOnGitHubCallout` closes a page whose content lives in the repository. It shows an icon tile, a heading, one line of text, and a button with the GitHub mark that opens the file on GitHub in a new tab. It sits above a hairline at the end of the page.

The app detail pages (`/apps/<slug>`) and the glossary terms (`/glossary/<slug>`) use it.

## When to use

- A page generated from a data file or a Markdown file in this repository, where a reader can fix a mistake with a pull request.
- Docs pages already have Docusaurus' own "Edit this page" link, they do not need it.

## Basic Usage

```jsx
import EditOnGitHubCallout from '@site/src/components/Layout/EditOnGitHubCallout';
import { translate } from '@docusaurus/Translate';

<EditOnGitHubCallout
  title={translate({ id: 'myPage.improveHeading', message: 'Spotted something off?' })}
  description={translate({ id: 'myPage.improveCopy', message: 'This page is open source. Submit a pull request to update or correct it.' })}
  href={`https://github.com/cardano-foundation/cardano-org/edit/staging/glossary/${term.slug}.md`}
  buttonLabel={translate({ id: 'myPage.improveButton', message: 'Edit {title} on GitHub' }, { title: term.title })}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `node` | *required* | Heading of the callout. |
| `description` | `node` | *required* | One line on why and how to help. |
| `href` | `string` | *required* | Link to the file on GitHub. External links open in a new tab with `rel="noopener noreferrer"`, a site path stays in the same tab. |
| `buttonLabel` | `node` | *required* | Text of the button next to the GitHub mark. |
| `headingLevel` | `number` | `2` | Heading level of the title, `0` renders a `div`. The look stays the same. |
| `className` | `string` | - | Extra class on the callout. |

## Live Preview

<EditOnGitHubCallout
  title="Spotted something off?"
  description="This page is open source. Submit a pull request to update or correct it."
  href="https://github.com/cardano-foundation/cardano-org/edit/staging/docs/get-involved/components/edit-on-github-callout.md"
  buttonLabel="Edit this page on GitHub"
/>

## Notes

- The heading is an `h2` by default, so it fits at the end of a page whose sections are `h2` as well.
