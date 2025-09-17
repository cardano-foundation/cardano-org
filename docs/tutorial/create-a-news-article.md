---
sidebar_position: 3
---

# Create a News Article

We are using the blog feature of Docusaurus for the news on cardano.org. It creates a **page for each blog post**, but also a **blog index page**, a **tag system**, an **RSS** feed.

## Guidelines for creating a News Article

All news articles on cardano.org are summaries that link to existing articles. Here's what we seek and will approve for content:

- **Engagement Requests**: Content should encourage active participation or action from the community.
- **Simplify Complex Topics**: Explain complex subjects (like finance, regulation, legal issues, governance, infrastructure, operations, resilience, or development) in simple terms. Summarize significant community events such as large meetups, workshops, working group activities, votes, polls, surveys, or governance actions.
- **Non-Approved Content**: We will not promote content focused on sales, self-promotion, vague or general event announcements, launching new tokens/platforms/apps/services, or unsubstantiated claims about being the best, first, largest, or fastest.
- **Summary**: Content should primarily benefit the community, not just individuals or companies, and must link back to a detailed blog or news article for more information.

### Purpose of the Summary
- The summary of a news article aims to provide readers with a brief overview of the content and encourage them to read the full article.

### Content of the Summary
- Keep the summary concise (40-60 words) and informative, highlighting the key points of the article.
- Avoid adding additional information or personal opinions not present in the article.

### Use of Links
- Do not include additional links to external sources or resources within the summary.
Links within the summary should only direct to internal pages of the website offering relevant content.

### Formatting and Structure
- Write the summary in clear, understandable sentences.
- Ensure proper formatting for readability.

### Review and Approval
- Before merging the pull request, the summary is reviewed for accuracy, relevance, and compliance with this guideline.

### Why this guideline?
This guideline ensures that readers receive a concise and informative preview of the article without being distracted by external sources. Additionally, it helps prevent the attraction of individuals posting articles solely for Search Engine Optimization (SEO) purposes, maintaining the integrity of the platform's content.

:::tip

Have a relevant news article but not the technical know-how to create a pull request yourself? No problem! Just [fill out our form](https://cardanocommunity.typeform.com/to/u7hcc7Ix), and we will review your suggestion. Please note that we only accept submissions that comply with the guidelines mentioned on this page.

:::

## Understanding the author file

Every news article needs an author. You can find the authors file in `/blog/authors.yml`. An example entry looks like:

```
builderfest:
  name: Buidler Fest
  url: https://buidl.2024.cardano.org
  image_url: ../img/authors/builderfest.png
```

## Create your first Post

Create a new folder in `/blog` with the name `2024-04-14-hello-world`. Then create an `index.md` in this folder with the following content:

```md title="blog/2024-04-14-hello-world.md.md"
---
slug: hello-world
title: Hello World!
authors: [builderfest]
tags: [greetings]
---

Congratulations, you have made your first news article!

Feel free to play around and edit this post as much as you like.
```

As you can see, we have used `builderfest` as the author and the news article uses all the data from `/blog/authors.yml`.  The `slug`defines the url, it must be unique. The news article is now available at [http://localhost:3000/news/hello-world](http://localhost:3000/news/hello-world) and it will look like this:

![img](/img/docs/tutorial/news-step-1.jpg)

## Add Co-Author and an image 

Copy an image into the 2024-04-14-hello-world folder, then follow the highlighted instructions to add another author and to incorporate the image into the news article: 

```md {4,12} title="blog/2024-04-14-hello-world.md.md"
---
slug: hello-world
title: Hello World!
authors: [builderfest, taptools]
tags: [greetings]
---

Congratulations, you have made your first news article!

Feel free to play around and edit this post as much as you like.

![img](./banner.webp)
```
For banners and other graphic media, please use the following file formats:

Images: `.png`, `.jpg` (or `.jpeg`), `.webp`, and `.svg`.

:::tip

Unfortunately you can not reference themend images(with dark and light mode) like this. Please put them in /img/news.
:::

The result should look like this:
![img](/img/docs/tutorial/news-step-2.jpg)


## Add link to the original article

Cardano.org serves as a hub rather than a primary platform for publishing articles. Consequently, articles should originate from an external source to which they can link back. It is advisable to post a concise summary of the article, approximately 50 to 60 words in length, accompanied by an appealing image. 

Additionally, include a `Read more` link directing readers to the full article on its original website. If the article has an image, add the `Read more` link above it:

```md {10} title="blog/2024-04-14-hello-world.md.md"
---
slug: hello-world
title: Hello World!
authors: [builderfest, taptools]
tags: [greetings]
---

Congratulations, you have made your first news article!

Feel free to play around and edit this post as much as you like. 

<div style={{ textAlign: 'right' }}>
[**Read more**](https://developers.cardano.org) 
</div>

![img](./banner.webp)
```

:::tip

Do not use `<!-- truncate -->` marker in the news articles as it would add another `Read more` link.

:::

-----

## Media Content

To enrich your news articles with media content, follow these guidelines:

Media templates typically start with "date-media," followed by the topic. Here are some examples:

  * `https://cardano.org/news/2024-10-25-media-cardano-summit-2024-day1`
  * `https://cardano.org/news/2024-08-01-media-intersects-structure-lloyd-duhon`

Embedding YouTube Videos (Privacy-Friendly):

:::tip

Always use the **`youtube-nocookie.com`** domain when embedding videos to ensure data privacy.

:::

An example entry looks like:

```html
---
slug: 2024-10-25-media-cardano-summit-2024-day1
title: "Cardano Summit 2024 - Day 1 Highlights"
authors: [cf]
tags: [media, summit, events]
---

An amazing first day at the Cardano Summit 2024 in Dubai! Keynotes: Unveiling the latest in blockchain innovation and envisioning Cardano’s future. Panels: Delving into real-world applications with insights from industry leaders and experts. Cardano Market: Exploring groundbreaking projects, startups, and connecting with the vibrant Cardano community. Community: Meeting passionate people from all corners of the world, exchanging ideas and experiences.

<div style={{ textAlign: 'right' }}>
[**Watch now**](https://www.youtube.com/watch?v=xE4oRFd7EpU)
</div>

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/xE4oRFd7EpU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
```

## News Article Tags

Tags are labels assigned to articles, allowing multiple tags per article and enabling flexible categorization and search. You should always use tags so that there are several hits per tag and they are not too specific. You can find an overview of all tags on https://cardano.org/news/tags

:::tip

When tagging go from specific to broad. Example: weekly development report, development. Not: development, weekly development report.

:::

## AI for Article Summaries

Large Language Models (LLMs) can support the creation of concise and consistent article summaries. The provided prompt configures the LLM as a "Cardano Ecosystem Summarizer" for clear, concise summaries of news, technical updates, and ecosystem developments.

```md {10} title="AI Instructions"
You are a highly specialized and authoritative Cardano Ecosystem Summarizer. 
Your primary role is to produce precise, concise, and professional summaries of news, 
technical updates, and ecosystem developments. Your output language is always English. 

Adhere strictly and without exception to the following directives:
PRIMARY DIRECTIVE: Follow all rules precisely. The goal is to create summaries that 
require zero re-correction.

1. SUMMARY RULES
Word Count: Each summary must be a maximum of 70 words. The ideal length is 60–70 words. 
This is a strict limit.
Paragraph: Write in one single paragraph. Do not use line breaks.
Formatting: Do not include any links, bold, italics, or other markdown formatting.
Cryptocurrency Terminology: Use "ada" (lowercase), unless it is at the start of 
a sentence or when using the ticker symbol (ADA).

Tone: Maintain a neutral, objective, and factual tone.

2. FORMATTING & TEMPLATES
For development reports:
Start with: The [Month] [Day], [Year], development report highlights...
Avoid starting with generic phrases like “This week…”
For forum community digests:
Start with: The [Month] [Day], [Year], Cardano Community Digest highlights...
For all other content (blogs, videos, etc.):
Start with a natural, informative sentence. If an author and date are available, you 
may incorporate them.

3. PROCEDURE FOR HANDLING CONTENT
Step 1: Access Link. Attempt to access the content from the provided URL.
Step 2: Handle Failure. If you cannot access the URL, do not give up. First, try again. 
If that fails, use your search capabilities to find the content.
Step 3: Report Failure. Only if both direct access and searching fail, inform the user 
that you were unable to access the content.
Step 4: Summarize. If successful, create the summary according to all rules.

4. REFERENCE & GLOSSARY
Apply correct terminology consistently based on the official Cardano glossary:
https://cardano.org/docs/glossary/

5. PERFECT SUMMARY EXAMPLE (FEW-SHOT PROMPT)
Input Link: 
https://www.essentialcardano.io/development-update/weekly-development-report-as-of-2025-06-06

Perfect Output: The June 06, 2025, development report highlights the release of 
Lace wallet v.1.23, which features a more accurate pricing feed for Cardano native tokens 
in response to community feedback. On the scaling front, the Mithril team delivered support 
for node v.10.4.1 and UTXO-HD in their tools and advanced the development of the DMQ node. 
The Leios team finalized an analysis of overcollateralization models.

6. PURPOSE
These summaries are for public-facing updates. Your objective is to capture the most 
important points clearly and concisely, ensuring readers are well-informed and encouraged 
to explore further. Prioritize clarity, accuracy, and relevance.

Strict adherence to these instructions is mandatory at all times.

```

:::tip

Provide this prompt as an instruction to your favorite AI tool. Afterwards, you can simply provide links to articles (e.g., blog posts, video transcripts) in the chat. The AI will then generate a summary adhering to the given specifications and considering the Cardano glossary.
:::
## Sources and Selection Criteria

To ensure your news summary is valuable to the community and meets our quality standards, please follow these guidelines for selecting sources and content.


### Content Sources

The goal is to provide concise summaries that direct readers to the original, full articles from trusted sources across the ecosystem. To ensure your news summary is valuable to the community and meets our quality standards.

Your first step is to find a trustworthy and relevant news item. We focus on core sources from within the Cardano ecosystem and key external reports. Here are the primary sources to consult:

* **Cardano Foundation:** Look for official announcements, research papers, financial and activity reports, and strategic partnerships.
    * *Source:* [Cardano Foundation Blog](https://cardanofoundation.org/blog)
* **Input Output Global:** A great source for weekly development reports and deep technical insights into Cardano's technology and development.
    * *Source:* [Input Output Global Blog](https://iohk.io/en/blog/)
* **Cardano Developer Portal:** Here you will find technical articles, tutorials, and quarterly development reports relevant to developers in the ecosystem.
    * *Source:* [Cardano Developer Blog](https://developers.cardano.org/blog/)
    * *Example:* [Quarterly Development Report Q2 2025](https://developers.cardano.org/blog/2025-06-30-quarterly-development-report/)
* **Essential Cardano:** Provides community-driven weekly development reports with concise summaries of technical progress across the ecosystem.
    * *Source:* [Essential Cardano Development Updates](https://www.essentialcardano.io/development-update)
* **EMURGO:** Publishes news on commercial applications, partnerships, and products that expand the ecosystem. Explanatory articles, like the example provided, are a great fit.
    * *Source:* [EMURGO Press & News](https://www.emurgo.io/press-news/)
    * *Example:* [Explainer: The Plomin Hard Fork](https://www.emurgo.io/press-news/explainer-the-plomin-hard-fork-cardano/)
* **Intersect:** Look here for updates on governance actions, committee elections, and member-driven initiatives.
    * *Source:* [Intersect News](https://www.intersectmbo.org/news)
    * *Example:* [Intersect Committee Election Results](https://www.intersectmbo.org/news/intersect-committee-election-results)
* **Cardano Community Digest:** A valuable source for bi-weekly summaries of key topics, development updates, and community activities.
    * *Example:* [Community Digest September 01, 2025](https://forum.cardano.org/t/digest-september-01-2025-recap-video-of-rare-evo-las-vegas-2025-cexplorer-io-article-benefits-of-liquid-staking-leios-a-major-milestone-in-cardanos-scalability-push-tony-thanh-s-on-chain-flappy-bird-demo/148995)
* **Official Cardano Forums:** A direct line to important discussions, proposals, and updates from the community.
    * *Source:* [Cardano Forum (Announcements)](https://forum.cardano.org/c/english/announcements/)
* **External Press:** Articles from reputable media outlets about Cardano are also relevant. You can often find a selection in the [Cardano Foundation Newsroom](https://cardanofoundation.org/newsroom/).


### Content Selection Criteria

To ensure your contribution gets approved, verify that the article you choose meets the following criteria:

* **Direct Relevance & Timeliness:** The content must be current and directly related to the Cardano ecosystem, its technology, or its community.
* **Significant Community Value:** The article should provide clear value. This includes:
    * *Major Updates & Milestones:* Announcements of significant technical upgrades, major partnerships, or key project developments.
    * *Governance & Participation:* Information that encourages community action, such as details on upcoming votes, committee elections, workshops, or major community events.
    * *Educational Content:* Articles that simplify complex topics (e.g., technical concepts, governance processes) and make them accessible to a broader audience.
    * *Media Highlights:* Summaries of important official media like Summit keynotes, panel discussions, or key interviews.
* **Objectivity and Credibility:** The source must be credible, and the content should be factual. Avoid articles based on speculation or unverified claims.
* **What to Avoid:** Summaries of content focused on price speculation, token sales, pure marketing or self-promotion, or unsubstantiated claims (e.g., "the best," "the first") will not be approved.