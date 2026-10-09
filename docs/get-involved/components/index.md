---
sidebar_position: 1
title: Overview
description: Reference for cardano.org's shared React component library. Find the component for a common need, from page heroes and section titles to tabs, FAQs, and modals.
---

## Overview

Shared components are the default on cardano.org. Before you write a component or page markup, find your need in the table below and use the component it points to. If a component almost fits, extend it with an additive prop instead of copying it. The [Component Guidelines](../component-guidelines.md) explain when a page-specific component is fine and what a new shared component needs.

## Find the right component

### Page structure

| I need | Use |
|---|---|
| A page hero with title, text, and banner | [Site Hero](./site-hero.md). The homepage uses [Welcome Hero](./welcome-hero.md) |
| An icon framed in a rounded tile | [Icon Hero](./icon-hero.md) |
| A complete explainer page with hero, sections, FAQ, and call to action | [Explainer Page](./explainer-page.md) |
| A page shell for an /insights data page | [Insights Layout](./insights-layout.md), [Insights Footer](./insights-footer.md) |
| Open Graph and Twitter card meta tags | [Open Graph Info](./open-graph-info.md) |
| Content constrained to the page width | [Boundary Box](./boundary-box.md) |
| A section background (zoom, plain, light) | [Background Wrapper](./background-wrapper.md) |
| Vertical spacing between blocks | [Spacer Box](./spacer-box.md) |
| A labeled section divider with an anchor | [Divider](./divider.md) |
| Decorative lines that connect sections | [Connection Line](./connection-line.md) |

### Text and layout

| I need | Use |
|---|---|
| A section title with text, list, and optional button | [Title With Text](./title-with-text.md) |
| A large title on the left, text and button on the right | [Featured Title With Text](./featured-title-with-text.md) |
| Headline numbers, alone or in a row of equal columns | [Stat Figure](./stat-figure.md) |
| A responsive grid of cards or tiles that wraps by item width | [Grid](./grid.md). For filterable app cards use [App Grid](./app-grid.md) |
| Plain paragraphs in one or two columns | [One Column Box](./one-column-box.md), [Two Column Box](./two-column-box.md) |
| Main content with a sidebar | [Two Column Layout](./two-column-layout.md) |
| A dotted icon illustration next to text | [Dotted Image With Text](./dotted-image-with-text.md) |
| Alternating rows of icon, title, and text | [Proof Points List](./proof-points-list.md) |
| A highlighted note with icon and accent border | [Highlight Callout](./highlight-callout.md) |
| A call to action band | [CTA One Column](./cta-one-column.md), [CTA Two Column](./cta-two-column.md) |
| A call to action band that closes a page on the normal background | [Page CTA](./page-cta.md) |
| A role or persona card | [Role Card](./role-card.md) |
| A title with icon links to Cardano's social channels | [Follow Cardano](./follow-cardano.md) |
| A small status label | [Status Pill](./status-pill.md) |

### Interaction

| I need | Use |
|---|---|
| Tabs that switch between panels, as pills or in a layout of your own | [Tabs](./tabs.md) |
| An FAQ or other expandable questions | [Accordion](./accordion.md) for new pages. Older pages use [FAQ Section](../faq-component.md) |
| A dialog opened from a button | [Modal](./modal.md) |
| A horizontal row of cards with scroll arrows | [Horizontal Scroller](./horizontal-scroller.md) |
| Previous and next buttons to step through epochs | [Insights Epoch Nav](./insights-epoch-nav.md) |
| Two glossary terms from a category | [Term Explainer](./term-explainer.md) |

### Topic widgets

| I need | Use |
|---|---|
| App cards, rows, grids, lists, or icons | [App Tile](./app-tile.md), [App Row](./app-row.md), [App Grid](./app-grid.md), [App List](./app-list.md), [App Icon](./app-icon.md) |
| A wallet picker, network warning, or transaction status | [Wallet Delegation](./wallet-delegation.md) |
| A quiz, its teaser card, modal, or share badge | [Quiz](./quiz.md), [Quiz Card](./quiz-card.md), [Quiz Modal](./quiz-modal.md), [Quiz Share](./quiz-share.md) |
| A layer 2 project card | [Layer 2 Card](./layer-2-card.md) |
| Funding program cards and stats | [Funding Programs](./funding-programs.md) |
| Treasury charts and figures | [Treasury Sections](./treasury-sections.md) |

## Nothing fits?

1. Check whether an existing component can take an additive prop that covers your case.
2. If you need a page-specific tool or deliberate art direction, put it in `src/components/<PageName>/` and explain in the pull request why nothing above fits.
3. If you need a new shared component, ask in the issue or pull request first. It goes in `src/components/Layout/` with JSDoc for its props, a doc page in this folder, and a row in the table above. Start the doc page from `docs/get-involved/components/_template.md`.
