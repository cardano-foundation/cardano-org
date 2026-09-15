---
sidebar_label: Add a funding venue
sidebar_position: 9
title: Add or update a funding venue
description: How to add a grant, accelerator, fund, or program to the grants and funding page at /grants-funding, and how to keep a card accurate.
---

The [grants and funding page](/grants-funding) lists ways to get funded to build on Cardano. Each card comes from one entry in `src/data/funding.js`. This page explains the fields and the rules for a card.

## Rules for a card

- **The official page is the source.** Every program links to it, and the description only says what that page confirms. If there is no official page yet, leave `link` out so the details show no call to action instead of guessing a URL.
- **Facts, not promotion.** Describe what the venue funds, who runs it, and how it works. No superlatives, no claims that cannot be checked on the source.
- **One fact, one field.** The card shows `tagline`, `audience` and `funding`; the `description` in the dialog adds to them and does not restate them.
- **Nothing dated in the text.** No round dates, running totals, or "the next round is not announced". The page routes readers to the program; it does not report on it. `window` is the only place a date belongs, and it expires on its own.
- **Brand names stay in English.** Wrap every other string in `translate()` so it reaches Crowdin.

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `key` | yes | Stable identifier, kebab-case. Also the card's anchor: `#program-<key>` opens its tab and scrolls to it. |
| `group` | yes | Which tab the card sits in: `grants` ("I have an idea"), `accelerators` ("I have a product"), or `contributors` ("I contribute to open source"). |
| `type` | yes | What kind of money it is: `community-vote`, `treasury`, `grant`, `retainer`, `accelerator`, `venture`, or `event`. Shown as a tag. |
| `name` | yes | Program name. Brand names are plain strings; descriptive names go through `translate()`. |
| `logo` | no | Path under `/img/` to a square mark for the tile, for example `/img/funding/orion-fund.jpg`. Without it the tile shows the first letter of the name. Program marks first; the running entity's mark if the program has none. |
| `logoDark` | no | Alternative mark for dark mode, for single-colour SVGs. |
| `cadence` | yes | `rolling` if you can apply any time, `recurring` if it runs in rounds or cohorts. |
| `window` | no | The current application window as ISO dates, `{ opens, closes }`, either optional. Remove it once it has passed. |
| `tagline` | yes | One line on the card: what this program gives you. |
| `audience` | yes | Three to six words on who it is for, for example "Founders with a live product". |
| `funding` | no | A fixed term of the program in two to five words, for example "Up to $70,000 per team". Leave it out for figures that change per round. |
| `description` | yes | Two or three sentences for the dialog: what it is, how it works, and the way in if it is not obvious. Not the tagline, audience or amount again. |
| `runBy` | yes | The name of the organization that runs it. Anything longer belongs in the description. |
| `link` | yes | `{ href, label? }` for the primary call to action. The button says "Program page" unless `label` says otherwise, for example "Open GovTool". External links open in a new tab. |

## Status

The label on the card is never typed by hand. `describeStatus` in `src/data/funding.js` derives it from `cadence` and `window` against the build date (`customFields.BUILD_DATE` in `docusaurus.config.js`), so a deadline that passes turns into the next state at the next site build:

- **Opens** a date: a window that has not opened yet.
- **Open until** a date: inside a window.
- **Open**: a rolling program.
- **Recurring**: a recurring program between windows.

Cards keep the order of the file, most accessible program first, so put a new entry where a reader should meet it. When a program announces a window, set `window`; a window that has passed stops showing on its own, and is removed at the next edit.

Third-party marks: only use a logo the organization publishes for reuse, and never the emblem of an intergovernmental body such as the UN. When in doubt, leave `logo` out.

## Adding a venue

1. Add an entry to `getFundingVenues()` in `src/data/funding.js`, following the fields above. Use `translate()` with ids prefixed `funding.venue.<key>.`.
2. Run `yarn write-translations --override` and keep only the new keys in `i18n/en/code.json`.
3. Run `yarn lint`, `yarn test`, and `yarn build`, then check `/grants-funding/` in light and dark mode, and open the card's details.
4. Open a pull request with the source you used in the description.

## Updating a venue

Change the fields that changed and mention the source in the pull request. A venue that has shut down is removed.
