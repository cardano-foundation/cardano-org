---
sidebar_position: 6
title: Create a Markdown Page
---

## Create a Markdown Page

Creating documentation pages with Markdown is the easiest way to contribute to cardano.org. Markdown pages automatically get the site header/hero banner and follow the site's design.

## Where to create your page

### Documentation pages (with sidebar)
Add Markdown files to `/docs/` subdirectories to create documentation pages that appear in the sidebar:

- `/docs/get-involved/my-page.md` - appears in the "Get Involved" section
- Content will be organized according to folder structure

### Standalone pages (without sidebar)
Add Markdown files directly to `/docs/` root for standalone pages without a sidebar:

- `/docs/communities/` - the Communities page
- `/docs/glossary/` - the Glossary page

These pages are independent and don't belong to a specific documentation section.

## Create your first documentation page

Create a file at `/docs/get-involved/my-first-page.md`:

```markdown title="/docs/get-involved/my-first-page.md"
---
title: My First Page
sidebar_position: 10
---

The Cardano community has many different social channels where you can connect with other members.

## Getting Started

Here's how to get started...

## Next Steps

Continue exploring...
```

Your page is now available at `http://localhost:3000/docs/get-involved/my-first-page`

## Frontmatter configuration

Every Markdown page starts with frontmatter (the section between `---` markers) that configures the page:

### Essential fields

```markdown
---
title: My Page Title
sidebar_position: 5
---
```

- **`title`**: Sets the page title (shown in browser tab, sidebar, and breadcrumbs)
- **`sidebar_position`**: Controls order in the sidebar (lower numbers appear first)

### Optional fields

```markdown
---
title: My Page Title
sidebar_position: 5
description: A short description for SEO and social sharing
displayed_sidebar: null
---
```

- **`description`**: Meta description for SEO and social media previews
- **`displayed_sidebar: null`**: Hides the sidebar (useful for standalone pages)

## Important: Don't use H1 headings

**The site hero banner already displays the page title, so you should NOT use `# H1` headings in your content.** Any H1 headings will be automatically hidden by CSS to prevent duplication.

Start your content immediately after the frontmatter, or begin with `## H2` headings:

```markdown
---
title: Online Communities
---

The Cardano community has many different social channels...

## Forums

Here are the main forums...
```



## Customize the hero banner

By default, documentation pages show the "Get Involved" hero banner. To customize it for specific pages, you need to modify `/src/theme/DocRoot/Layout/index.js`:

```javascript
// Check path and set custom hero
if (location.pathname.includes('/communities')) {
  heroTitle = 'Online Communities';
  heroDescription = 'Connect with fellow Cardano community members...';
  heroBannerType = 'braidBlue';
}
```

Add a new condition for your page's path to set custom hero values.

### Available banner types

Choose from these banner designs:
- `braidBlack` (default for docs)
- `braidBlue`
- `ada`
- `waves`
- `starburst`
- `fluid`

See the [SiteHero component documentation](/docs/get-involved/components/site-hero) for examples of each banner type.

## Markdown syntax

Use standard Markdown formatting:

### Text formatting

```markdown
**bold text**
*italic text*
[link text](https://cardano.org)
```

### Lists

```markdown
- Bullet point
- Another bullet point

1. Numbered item
2. Another numbered item
```

### Code blocks

````markdown
```javascript
const greeting = "Hello World";
```
````

### Admonitions (callouts)

```markdown
:::note
This is a note
:::

:::tip
This is a tip
:::

:::warning
This is a warning
:::
```

## Next steps

- For more advanced layouts using React components, see [Create a React Page](/docs/get-involved/create-react-page)
- Browse [available components](/docs/get-involved/components/) to enhance your pages
- Check out [existing pages](/docs/communities/) for inspiration
