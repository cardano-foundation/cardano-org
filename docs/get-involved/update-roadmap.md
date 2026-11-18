---
sidebar_label: Update the roadmap
sidebar_position: 11
title: Update the roadmap
description: How to keep the network upgrades page at /roadmap accurate when a hard fork reaches its next step, changes scope, or is enacted.
---

The [network upgrades page](/roadmap) shows the hard forks being built and every hard fork so far. An upcoming hard fork comes from one entry in `src/data/roadmap.js`, an enacted one from `src/data/hardforks.js`, which the [hard forks page](/hardforks) reads too. The page makes no network request, so it changes only through a pull request. This page explains the fields and the rules.

## Rules

- **The hard fork plan and the working group minutes are the source.** The [hard fork plan](https://product.cardano.intersectmbo.org/hardfork-planning/dijkstra/) gives the scope, the protocol version, and the code completion target. The [hard fork working group minutes](https://cardanoupgrades.docs.intersectmbo.org/general/hard-fork-working-group-meeting-minutes) report each step a hard fork reaches. The text only says what they confirm.
- **Every entry links to the section that backs it.** A change links to its CIP, or to its section of the plan where it has no CIP. A note links to the plan and to the minutes it relies on.
- **Facts, not promotion.** Say what a change does, in one or two sentences. A figure goes in only if the linked page states it.
- **Nothing dated in the text.** The code completion target from the plan is the only date. Change it when the plan changes it.
- **Proper names stay in English.** A name such as "Ouroboros Peras" is a plain string. Wrap every other string in `translate()` so it reaches Crowdin.

## Fields of a hard fork

Entries of `getHardForks()`, next one first.

| Field | Required | Description |
|-------|----------|-------------|
| `key` | yes | Stable identifier, kebab-case. Also the anchor: `/roadmap#<key>` opens the entry. |
| `name` | yes | For example "Dijkstra, phase 1", through `translate()`. |
| `era` | yes | The ledger era the hard fork belongs to. Labels its band on the line of protocol versions. |
| `version` | yes | The protocol major version the hard fork moves the Cardano mainnet to, or `null` while the plan gives none. With a version, the hard fork appears on the line of protocol versions. |
| `stage` | yes | How far along it is, see below. The path and the progress segments are drawn from it. |
| `note` | yes | One or two sentences under the path: the code completion target, and what the minutes report. Links are written `[text]({name})`, with the addresses passed as values. |
| `changes` | yes | What the hard fork brings, in the order of the hard fork plan. See the fields below. |

## Stages

| `stage` | Set it when |
|---------|-------------|
| `development` | The hard fork is in the plan and cannot be tested on a network yet. |
| `devnet` | The minutes report that its changes can be tested on the developer testnet. |
| `preview` | The hard fork is enacted on the Preview testnet. |
| `preprod` | The hard fork is enacted on the Preprod testnet. |
| `vote` | The hard fork initiation action is submitted on the Cardano mainnet. |
| `mainnet` | The action is ratified and waits for the epoch boundary where it takes effect. |

## Fields of a change

Entries of a hard fork's `changes`. Each entry is one cell on the page.

| Field | Required | Description |
|-------|----------|-------------|
| `key` | yes | Stable identifier, kebab-case. |
| `name` | yes | Name of the change, as the plan or the CIP calls it. Proper names are plain strings, descriptive names go through `translate()`. |
| `text` | yes | One or two sentences on what changes, written from the plan or from the abstract of the CIP. |
| `source` | yes | `cip(number)` where a CIP exists, `hardForkPlan(section)` where it does not. |

## Updating a hard fork

When a hard fork reaches its next step, set its `stage` and update its `note`. The address of the minutes is `WORKING_GROUP_MINUTES_URL` at the top of the file. When the plan changes the scope, the target, or the protocol version, change those fields. Mention the source in the pull request.

## Adding a hard fork

1. Add an entry to `getHardForks()` in `src/data/roadmap.js`, following the fields above. Use `translate()` with ids prefixed `roadmap.fork.<key>.` for the hard fork and `roadmap.change.<key>.` for a change.
2. Run `yarn write-translations --override` and keep only the new keys in `i18n/en/code.json`.
3. Run `yarn lint`, `yarn test`, and `yarn build`, then check `/roadmap/` in light and dark mode, and open the entry.
4. Open a pull request with the source you used in the description.

## When a hard fork is enacted

1. Remove its entry from `getHardForks()`.
2. Add an entry at the top of `getHardForkHistory()` in `src/data/hardforks.js` with the era, the date, the name, a one-sentence description, the epoch, the protocol version, and the transaction ID of the governance action. Move `active: true` to the new entry. Its anchor on the page is `/roadmap#protocol-version-<number>`.
3. Add or update the glossary entry of the hard fork in `glossary/`.
