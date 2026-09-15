---
sidebar_label: Update the roadmap
sidebar_position: 9
title: Update the roadmap
description: How to add an upcoming upgrade to the roadmap at /roadmap, move it to the history when it is enacted, and keep the page accurate.
---

The [roadmap](/roadmap) shows what runs on mainnet, what is being built, how an upgrade gets decided, and every upgrade so far. All of it comes from `src/data/roadmap.js`. This page explains the entries and the rules.

## Rules

- **The source is the Intersect upgrade hub and the teams' trackers.** Every upcoming card links its source, and the text only says what the source confirms.
- **Outcome before mechanism.** The "What's changing" cards say what changes for people; the timeline card shows the one-line outcome and one fact; the reader cards say what it means for people who use Cardano, build on it, or run a pool. Name the mechanism after the outcome.
- **Nothing dated by hand.** A `target` exists only when the source states one, worded "Targeted Q4 2026". No "coming soon", no "expected", no dates typed from memory.
- **Stages are the steps.** The stage of a card uses the same words as the "How an upgrade happens" section: `development`, `testnets`, `vote`, `scheduled`. The pill tone and label come from `describeStage()`.
- **Brand and upgrade names stay in English.** Wrap every other string in `translate()` so it reaches Crowdin.

## An outcome

Entries in `getOutcomes()`, the three "What's changing" cards: `key`, `icon` (a key the component maps), `accent` (`blue`, `teal`, or `violet`), `title`, one-sentence `text`, and `href` to where the mechanism is explained. Change them when the upgrades being built change.

## An upcoming upgrade

Entries in `getUpcoming()`, next one first.

| Field | Required | Description |
|-------|----------|-------------|
| `key` | yes | Stable identifier, kebab-case. The card's anchor is `#upcoming-<key>`. |
| `name` | yes | For example "Dijkstra, phase 1". |
| `era` | yes | Ledger era and, where known, protocol version or "intra-era hard fork". |
| `stage` | yes | One of `development`, `testnets`, `vote`, `scheduled`. Drives the pill. |
| `target` | no | The quarter the source states, worded "Targeted Q4 2026". |
| `outcome` | yes | One sentence: what changes for the reader. |
| `fact` | yes | The one figure or headline content worth knowing, from the source, for example "About 2 minutes to settle, down from hours". |
| `forReaders` | yes | `{ users, builders, operators }`, one sentence each, shown in the "What it means for you" cards. |
| `links` | yes | `{ label, href }`; the first entry is the card's link, usually the Intersect overview. |

## An enacted upgrade

Entries in `getUpgrades()`, newest first. The first entry is what the "live today" strip shows.

| Field | Required | Description |
|-------|----------|-------------|
| `key` | yes | Stable identifier. The tile's anchor is `#upgrade-<key>`, used by glossary entries and the phases. |
| `name` | yes | Upgrade name. |
| `era` | yes | Ledger era, through `translate()`. |
| `date` | yes | ISO date of enactment; formatted for the reader's locale. |
| `version` | yes | Major protocol version after the upgrade. |
| `summary` | yes | One sentence on what it introduced. |
| `glossary` | no | Path of the glossary entry, for example `/glossary/plomin`. |

## When a hard fork is enacted

1. Remove its entry from `getUpcoming()` and add one to the top of `getUpgrades()` with the date, version, and summary. The strip, the history, and the phases update from that.
2. If the upgrade completed part of a phase, add it to that phase's `milestones` list in `getPhases()` with its `upgradeKey`.
3. Write or update the glossary entry and set its `link` to `/roadmap`.
4. Run `yarn write-translations --override` and keep only the new keys in `i18n/en/code.json`, then `yarn lint`, `yarn test`, and `yarn build`, and check `/roadmap/` in light and dark mode.
5. Open a pull request with the source you used in the description.

When a target moves or a stage changes, change that field and mention the source in the pull request.
