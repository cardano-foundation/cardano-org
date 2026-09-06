---
sidebar_position: 15
title: Navigation Menu
description: How the five mega menus in the cardano.org navbar are defined in src/data/navbar.js, how the mobile list is derived, and how the labels are translated.
---

## Navigation Menu

The navbar has five menus: **Learn**, **Use**, **Build**, **Participate**, and **Solutions**. All five are defined in one file, `src/data/navbar.js`. `docusaurus.config.js` spreads the result of that file into `themeConfig.navbar.items`, followed by the locale dropdown.

On desktop each menu opens as a mega panel with link columns and an optional featured tile. On mobile the same entries appear as a flat list in the drawer. Both views are derived from the same definition, so they cannot drift apart.

To add, move, or rename an entry: edit `src/data/navbar.js`, add the English translation keys (see [Translation](#translation)), then check the desktop panel and the mobile drawer.

## Menu definition

Each menu is one `megaMenu({label, featured, columns})` call:

```js title="src/data/navbar.js"
megaMenu({
  label: 'Use',
  featured: {
    title: 'Cardano Apps',
    description: 'Explore curated applications built on Cardano.',
    image: '/img/nav/use.webp',
    to: '/apps',
    cta: 'Explore apps',
    placement: 'start',
  },
  columns: [
    {
      title: 'Get set up',
      items: [
        {to: '/wallets', label: 'Find a Wallet', description: 'Find the right wallet for you'},
        {to: '/where-to-get-ada', label: 'Where to get ada?', description: 'Obtain ada to use Cardano'},
      ],
    },
    {
      title: 'Do more',
      items: [
        // ...
      ],
    },
  ],
}),
```

`megaMenu` returns a Docusaurus `dropdown` navbar item with `mega: true`, the full definition under `customProps`, and the flattened mobile list under `items`.

### Items

Every link in a column is an object with these fields:

| Field | Required | Description |
|---|---|---|
| `label` | yes | The link text. It is also the translation key, so changing the label creates a new key. |
| `to` or `href` | one of the two | `to` for a site route, including anchors (`/wallets`, `/governance#tools`). `href` for an external URL (`https://forum.cardano.org`). |
| `description` | no | One line shown under the label in the desktop panel. The mobile drawer drops it. |

Items have no icon or image. The only image in a menu is the featured tile.

### Columns

A column is `{title, items}`. The title is rendered as the column heading. The panel adapts its width to the number of columns (`data-columns` on the menu item, styled in `src/css/custom.css`), three columns is the widest layout in use.

### Featured tile

The optional `featured` object renders a large tile with an image, title, description, and call-to-action text:

| Field | Description |
|---|---|
| `title` | Tile heading, also the translation key for the tile's strings |
| `description` | One or two lines under the title |
| `image` | Path under `static/`, the current tiles live in `static/img/nav/<menu>.webp`. Resolved with `useBaseUrl`, so the plain `/img/...` path works in every locale |
| `to` or `href` | Link target, same rules as for items |
| `cta` | Call-to-action text at the bottom of the tile |
| `placement` | `start` puts the tile before the columns, `end` after them |

A menu without `featured` shows the columns only.

## How the mobile list is derived

`toMobileItems` in `src/data/navbar.js` flattens a definition into the list the Docusaurus drawer expects:

1. The column items are concatenated in order, each reduced to `{label, to}` or `{label, href}`. Descriptions and column titles are dropped.
2. The featured tile becomes a plain link with its `title` as the label, inserted before the items for `placement: 'start'` and after them for `placement: 'end'`.

Because of this, the order in the drawer always matches the reading order of the desktop panel.

## Rendering

`src/theme/NavbarItem/DropdownNavbarItem/index.js` wraps the stock Docusaurus dropdown:

- On desktop, an item with `mega: true` and `customProps.columns` renders the mega panel: it opens on hover with a short delay or on click, closes on Escape, on a click outside, and after navigation, and shifts sideways so it never leaves the viewport. The panel content is mounted on the first open, so its links and tile images are not prefetched on every page load.
- On mobile, or for any dropdown that is not marked `mega`, the original Docusaurus dropdown is rendered with the flat `items` list.

The panel styles are the `.navbar__item--mega` and `.megaMenu*` rules in `src/css/custom.css`.

## Translation

The menu strings are translated in two different places, because the desktop panel and the mobile drawer are rendered by different code.

### Desktop panel: `i18n/en/code.json`

The mega panel translates every string with `translate()` and an id keyed by the English text:

| String | Key |
|---|---|
| Column title | `navbar.mega.column.<column title>` |
| Item label | `navbar.mega.label.<item label>` |
| Item description | `navbar.mega.description.<item label>` |
| Featured tile title, description, and CTA | `navbar.mega.featured.title.<tile title>`, `navbar.mega.featured.description.<tile title>`, `navbar.mega.featured.cta.<tile title>` |

The ids are built at runtime from the menu data, so `yarn write-translations` cannot extract them (it only picks up `translate()` calls with a static id and message). Add the keys to `i18n/en/code.json` by hand in the same pull request, next to the existing `navbar.mega.*` entries:

```json title="i18n/en/code.json"
"navbar.mega.label.Find a Wallet": {
  "message": "Find a Wallet",
  "description": "Mega menu item label"
},
"navbar.mega.description.Find a Wallet": {
  "message": "Find the right wallet for you",
  "description": "Mega menu item description"
}
```

A missing key is not an error: the English text from `navbar.js` is used as the fallback, and the other locales then show English until the key exists and has been translated. Translations for the other locales come through Crowdin, do not edit `i18n/<locale>/code.json` by hand.

### Mobile drawer and menu labels: `navbar.json`

The five menu labels and every entry in the mobile drawer are translated by Docusaurus itself, through `item.label.<label>` keys in `i18n/en/docusaurus-theme-classic/navbar.json`. `yarn write-translations` generates these from the navbar config, including the flattened mobile items and the featured tile titles. Add the `item.label.<label>` key for a new entry there, either by hand or by running `yarn write-translations --locale en` and keeping the `navbar.json` change.

## Checklist for a new entry

1. Add the item to the right column in `src/data/navbar.js`. Keep labels short, the columns are narrow.
2. Add `navbar.mega.label.<label>` and, if the item has a description, `navbar.mega.description.<label>` to `i18n/en/code.json`.
3. Add `item.label.<label>` to `i18n/en/docusaurus-theme-classic/navbar.json`.
4. Run `yarn start` and check the entry in the desktop panel and in the mobile drawer (narrow the window below 996 px).
