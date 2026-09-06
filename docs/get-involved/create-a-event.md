---
sidebar_position: 5
title: Create an Event Highlight
description: Feature a Cardano event on the events page. How the Luma calendar and the curated highlights fit together, the JSON fields, image guidelines, and how entries are reviewed.
---

## Create a Event Highlight

:::tip

In case you’re not familiar with making pull requests, please submit your request through [this form](https://cardanocommunity.typeform.com/submit-event).

:::

## Guiding Principles

The [cardano.org/events](https://cardano.org/events) page shows the live community calendar from [lu.ma/CardanoEvents](https://lu.ma/CardanoEvents) together with a curated set of highlights that live in this repository.

Its purpose is to amplify events that offer value to a broader audience, showcase major ecosystem progress, or represent Cardano on a global stage. All events featured here must first be submitted to and approved for the Luma calendar and then meet the highlight criteria below.

## How the events page gets its data

The page merges two sources at runtime:

*   **The Luma calendar.** Upcoming events on [lu.ma/CardanoEvents](https://lu.ma/CardanoEvents) are fetched from the official Luma API through the `data.cardano.org` proxy (`src/utils/events/useLumaEvents.js`). This is the full list of meetups, working group calls, and community events. Nothing in the repository needs to change for a Luma event to appear.
*   **Curated highlights.** `src/data/events.json` holds the hand-picked conferences and summits, plus the recap videos of past events. These entries feed the "Featured upcoming events" row at the top of the page and the "Recent event recaps" row at the bottom, and they are also part of the main list.

A few merge rules are worth knowing before you edit the JSON (`src/utils/events/eventModel.js`):

*   **Luma wins on duplicates.** If a curated entry and a Luma event share the same title and start day, the Luma version is shown and the JSON entry is dropped. Use the exact Luma title if you want the two to match.
*   **Recurring series are collapsed.** Events that repeat under the same title (for example the weekly working group calls) are shown as a single row with their next occurrence.
*   **Past events come from the JSON only.** The Luma feed only returns upcoming events, so once an event is over it stays on the page only if it has a curated entry. Past entries with a `recapVideo` appear in "Recent event recaps" and under the "Past" filter.
*   **Featured means curated and upcoming.** The featured row shows the next upcoming curated entries (up to 10). It has no separate flag, so every upcoming JSON entry is a highlight.

## When to add a JSON entry

Add the event on Luma first, in every case. Then add an entry to `events.json` only if the event meets the highlight criteria below and one of these applies:

*   It should be featured in the highlights row above the full list.
*   It is over and you want to add a recap video.
*   It has an external registration page that should be linked instead of the Luma page.

Everything else (regular meetups, working group calls, online community events) belongs on Luma only.

## Criteria for a Highlight

To be featured on cardano.org, an event should represent a significant moment for the ecosystem. We welcome events that fall into one of three key areas:

*   **Treasury Funded**
    This highlights events that showcase the successful outcomes of initiatives funded by the Cardano Treasury via on-chain governance votes.

*   **Broad Reach & Global Presence**
    This includes major conferences and summits that position Cardano as a leader in the global tech community.

    *Examples:* The Cardano Summit, or a premier industry conference like Consensus where Cardano has a dedicated track, booth or keynote address.

*   **Major Ecosystem Milestones**
    This covers significant technological achievements and strategic growth from within the ecosystem.

    *Examples:* The mainnet launch of a key protocol, a major technology or feature unveiling, or a strategic partnership announcement.

*   **Thought Leadership & Workshops**
    This showcases the deep expertise and innovation that drives the ecosystem forward.

    *Examples:* A developer workshop on core technology, a hackathon, or an academic symposium presenting new, peer-reviewed research on Cardano.

**What is Explicitly Excluded from Highlights:** To maintain focus, the following event types will typically only be listed on lu.ma/cardanoevents and not as a highlight:

*   General networking events or social gatherings.
*   Recurring events that don’t meet the highlight criteria.

## Submission Requirements

For your event to be considered, the submission must contain the following:

*   **Event Title:** A clear, concise title.
*   **Event Description:** A brief description of the event, its purpose, and what attendees can expect. **(Max 400 characters)**.
*   **Date:** The exact start and end date (if different than start date). For single-day events, provide the startDate and leave the endDate field empty ("").
*   **Location/Platform:** Venue, City and country.
*   **Organizer(s):** The name of the organizing group or project.
*   **Visual:** A compelling image, ideally in **16:9 landscape format** (see the image notes below).

## Core Content Standards

All content on the event page must be professional and respectful. The following are strictly prohibited:

*   **Spam and Scams:** Fraudulent events, fake airdrops, phishing attempts, and events primarily focused on price speculation.
*   **Selling or Marketing a Token:** Events created for the primary purpose of marketing or directly selling a token (e.g., an ICO/IDO), or to otherwise pressure immediate investment, are prohibited.
*   **Hate Speech and Harassment:** Any content that promotes discrimination, hatred, or violence.
*   **Misleading Information:** Intentionally false information about the event, its purpose, speakers, or organizers.
*   **Offensive or Low-Effort Content:** Submissions with profanity, explicit material, or incomplete/unclear information (incl. announcements without a clear roadmap or milestones).

## Edit the JSON file

Edit the `events.json` file in the `src/data/` directory. Add a new entry at the end of the array using the format below. Every existing entry carries all nine fields, so include each one even when it is empty.

```js title="src/data/events.json"
[
  {
    "title": "Event Title",
    "description": "Event description",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD", // For single-day events leave the endDate field empty ("").
    "location": "City, Country",
    "link": "https://...", // Registration or event page, or the event on lu.ma/CardanoEvents.
    "image": "image-filename.jpg", // File in static/img/events/, or "" for the Cardano logo fallback.
    "organizer": "Organizer name",
    "recapVideo": "" // YouTube video ID, filled in after the event to show it under "Recent event recaps".
  }
]
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Shown on the card. Also the key for de-duplication against Luma and for collapsing recurring series. |
| `description` | Yes | Max 400 characters. The current cards do not render it, it is kept as the record of the submission. |
| `startDate` | Yes | `YYYY-MM-DD`. Decides whether the event is upcoming, past, or featured. |
| `endDate` | Yes | `YYYY-MM-DD`, or `""` for single-day events. Multi-day events span the calendar view. |
| `location` | Yes | Free text, usually city and country. Used by the location label and the search. |
| `link` | Yes | Registration or event page. The card's "View event" link. |
| `image` | Yes | Bare filename under `static/img/events/`. Leave `""` to fall back to the Cardano logo. |
| `organizer` | Yes | Shown on the card and searchable. |
| `recapVideo` | Yes | YouTube video ID (the part after `v=`), or `""`. Only past entries with an ID appear in the recaps row. |

The page also accepts two optional fields that no current entry uses: `category` overrides the derived topic (one of `Conference`, `Meetup`, `Governance`, `Hackathon`, `Workshop`, `Developers`, `Community`, `Other`, the default is `Conference`, or `Hackathon` when the title contains "hackathon"), and `online: true` marks a virtual event for the "Online" filter.

The merge and normalization logic is covered by `yarn test:events` (`scripts/test-events-model.js`). Run `yarn test` before opening a pull request. A JSON syntax error breaks the build, so check that the file still parses after your edit.

### Images

Save the image in the `static/img/events/` folder and reference it by filename only. All event cards render the image in a 16:9 frame: the featured card fits the whole image inside (so logos on a plain background work), the list and recap cards crop it to fill the frame. A landscape image of about 1280 by 720 pixels in JPEG, WebP, or PNG works for all three.

Important Note: The images should not exceed 150 KB per image and must be clearly visible in Dark Mode.

### Adding a recap after the event

Once a recording is published, set `recapVideo` to the YouTube video ID of the existing entry. If the event never had a curated entry (for example a hackathon that was only on Luma), add one now with the dates and location of the past event. The recap card uses the YouTube thumbnail, so the `image` field can stay empty for recap-only entries.
