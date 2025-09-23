---
sidebar_position: 4
---

# Create a Event Highlight

## Guidelines for Cardano.org Event Highlights Submission

:::tip

In case you’re not familiar with making pull requests, please submit your request through [this form](https://cardanocommunity.typeform.com/to/PmmRcAkO).

:::

## Guiding Principles

The [cardano.org/events](https://cardano.org/events) page is a curated showcase of highlights from the community calendar at [lu.ma/CardanoEvents](https://lu.ma/CardanoEvents).

Its purpose is to amplify events that offer value to a broader audience, showcase major ecosystem progress, or represent Cardano on a global stage. All events featured here must first be submitted to and approved for the Luma calendar and then meet the highlight criteria below.

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

**What is Explicitly Excluded from Highlights:** To maintain focus, the following event types will typically only be listed on lu.ma/cardanoevents and not on the main highlights page:

*   General networking events or social gatherings.
*   Recurring events that don’t meet the highlight criteria.

## Submission Requirements

For your event to be considered, the submission must contain the following:

*   **Event Title:** A clear, concise title.
*   **Event Description:** A brief description of the event, its purpose, and what attendees can expect. **(Max 400 characters)**.
*   **Date:** The exact start and end date (if different than start date).
*   **Location/Platform:** Venue, City and country.
*   **Organizer(s):** The name of the organizing group or project.
*   **Visual:** A compelling image in **.svg or .png** and ideally **square format**.

## Core Content Standards

All content on the event page must be professional and respectful. The following are strictly prohibited:

*   **Spam and Scams:** Fraudulent events, fake airdrops, phishing attempts, and events primarily focused on price speculation.
*   **Selling or Marketing a Token:** Events created for the primary purpose of marketing or directly selling a token (e.g., an ICO/IDO), or to otherwise pressure immediate investment, are prohibited.
*   **Hate Speech and Harassment:** Any content that promotes discrimination, hatred, or violence.
*   **Misleading Information:** Intentionally false information about the event, its purpose, speakers, or organizers.
*   **Offensive or Low-Effort Content:** Submissions with profanity, explicit material, or incomplete/unclear information (incl. announcements without a clear roadmap or milestones).

## Edit the JSON file

Edit the `events.json` file for the Event Highlights in the `src/data/` directory. Add a new entry at the end of the file using the specified format.

The images must be saved in the `static/img/events/` folder.

Important Note: The images should not exceed 150 KB per image and must be clearly visible in Dark Mode.

```js title="src/data/events.json"
[
  {
    "title": "Event Title",
    "description": "Event description",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "location": "Event location",
    "link": "Link to the event page",
    "image": "image-filename.png",
    "organizer": "Organizer name",
    "recapVideo": "YouTube video ID (optional)"
  },
  
]

```


