---
sidebar_position: 3
---

# Create a News Article

We are using the blog feature of Docusaurus for the news on cardano.org. It creates a **page for each blog post**, but also a **blog index page**, a **tag system**, an **RSS** feed.

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

## Guidelines (work in progress)

We need to agree on clear guidelines for the news. To provide an initial guide, here's what we seek and will approve for content:

- **Engagement Requests**: Content should encourage active participation or action from the community.
- **Simplify Complex Topics**: Explain complex subjects (like finance, regulation, legal issues, governance, infrastructure, operations, resilience, or development) in simple terms. Summarize significant community events such as large meetups, workshops, working group activities, votes, polls, surveys, or governance actions.
- **Non-Approved Content**: We will not promote content focused on sales, self-promotion, vague announcements, launching new tokens/platforms/apps/services, or unsubstantiated claims about being the best, first, largest, or fastest.
- **Summary**: Content should primarily benefit the community, not just individuals or companies, and must link back to a detailed blog or news article for more information.