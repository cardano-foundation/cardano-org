---
sidebar_position: 4
title: Add your Community
description: Add your Cardano community to the online communities directory. Eligibility criteria, required fields, and review process.
---

Thank you for considering adding your community to the [Community](/community) page!

## Requirements

Before submitting your community, please ensure it meets all of the following criteria:

- **Cardano-focused**: The community must genuinely focus on Cardano and its ecosystem
- **Welcoming environment**: Open and respectful to people from all backgrounds
- **Active community**: Regular posts, discussions, or interactions (aim for 1000+ members)
- **Non-commercial**: Not primarily used for marketing or promotion
- **Accessible**: No paywalls, registration walls, or private-only access
- **Well-moderated**: Reliable moderation by a team (not just one person) to maintain a healthy and safe space
- **Code of Conduct**: All community members should adhere to the [Community Code of Conduct](/community-code-of-conduct). Communities may have additional specific rules, but must align with these core principles

## How to submit

The channels on the Community page come from one data file: `src/data/communities.mjs`. Open a pull request that adds one object to the `COMMUNITIES` list.

A global channel, shown on the card of its platform:

```js
{ id: 'discord-example', name: 'Example Discord', url: 'https://discord.gg/...', platform: 'discord', group: 'channel' },
```

A language group, shown under "Communities in your language and region":

```js
{ id: 'telegram-french', name: 'Cardano French', url: 'https://t.me/...', platform: 'telegram', group: 'local', language: 'fr' },
```

- `id` is unique and uses lowercase letters, digits and hyphens.
- `platform` is one of `forum`, `discord`, `telegram`, `reddit`, `stackexchange` or `facebook`.
- A language group carries the two-letter `language` code. If the language is new, add its own name to `LANGUAGE_NAMES` in the same file.
- A regional group carries `region` instead of `language`. Region labels are translated and live in `src/pages/community.js`, so mention a new region in the pull request.
- Run `yarn test:community` before you push. It checks the fields of every entry.

Do not add new sections. In the pull request, say briefly how the community meets the requirements above (moderation team, size, activity).

## Need help?

If you're new to GitHub or need assistance with the pull request process, you can:

- Check out GitHub's guide on [creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
- Ask for help in the [Cardano Forum](https://forum.cardano.org)
- Reach out through one of the existing [community channels](/community)   
 