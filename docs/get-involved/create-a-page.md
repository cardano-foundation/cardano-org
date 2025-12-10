---
sidebar_position: 5
title: Create a Page
---

## Create a new Page

There are two main ways to create pages on cardano.org:

## 1. Markdown Pages (Recommended)

**The easiest way to contribute.** Markdown pages automatically get the site header and design, perfect for documentation and content pages.

**Best for:**
- Documentation pages
- [News Articles](create-a-news-article.md)
- Text-heavy content
- Quick contributions

👉 [Learn how to create Markdown pages](/docs/get-involved/create-markdown-page)

## 2. React Pages (Advanced)

**Full control over layout and functionality.** Build custom pages with React components for interactive features and complex designs.

**Best for:**
- Interactive features
- Custom layouts
- Landing pages
- Complex UI requirements

👉 [Learn how to create React pages](/docs/get-involved/create-react-page)

## Quick Start (Markdown)

Create a file at `/docs/get-involved/my-page.md`:

```markdown
---
title: My Page Title
sidebar_position: 10
---

Your content starts here...

## Section Heading

More content...
```

That's it! Your page is ready at `http://localhost:3000/docs/get-involved/my-page`

## Quick Start (React)

Create a file at `src/pages/my-page.js`:

```jsx title="src/pages/my-page.js"
import React from 'react';
import Layout from '@theme/Layout';

export default function MyPage() {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  );
}
```

Your page is ready at `http://localhost:3000/my-page`

## Need Help?

- **New to Markdown?** Start with the [Markdown page guide](/docs/get-involved/create-markdown-page)
- **Need custom layouts?** Check out the [React page guide](/docs/get-involved/create-react-page)
- **Looking for components?** Browse the [component library](/docs/get-involved/components/)

## Page Types Overview

### Documentation Pages
- Located in `/docs/` subdirectories
- Appear in the sidebar
- Best for structured content
- Use Markdown for simplicity

### Standalone Pages
- Located in `/docs/` root
- No sidebar shown with `displayed_sidebar: null`
- Examples: [Communities](../communities.md), [Glossary](../glossary.md)

### Custom Pages
- Located in `/src/pages/`
- Complete layout freedom
- Use React components
- Examples: Homepage, landing pages