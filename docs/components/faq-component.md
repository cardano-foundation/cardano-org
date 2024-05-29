---
sidebar_position: 1
---

# FAQ component

You can pass a JSON file to this component to create your own FAQs sections. This example is based on the [Hello World Page](/docs/tutorial/create-a-page#add-more-components) of the previous tutorial.
 
## Prepare the JSON file

Prepare the JSON file with your questions and answers and place it in `src/data/`. For this example we go with this pinapple on pizza FAQ:

```js title="src/data/pineappleFAQ.json"
[
  {
    "question": "Is pineapple on pizza a popular choice?",
    "answer": [
      "Pineapple on pizza, often referred to as Hawaiian pizza, has a divided fan base. Some people love the sweet and savory combination, while others are staunchly opposed to it. Despite the controversy, it remains a popular choice in many pizzerias around the world."
    ]
  },
  {
    "question": "Who invented pineapple on pizza?",
    "answer": [
      "Pineapple on pizza was invented by Sam Panopoulos in 1962 in Canada. He decided to add canned pineapple to pizza as an experiment, and it surprisingly became a hit with customers."
    ]
  },
  {
    "question": "What are the arguments for and against pineapple on pizza?",
    "answer": [
      "Arguments for pineapple on pizza include:",
      "- The sweet and savory flavor combination is appealing to many.",
      "- It adds a unique taste and texture to the pizza.",
      "- Pineapple provides a refreshing contrast to the richness of the cheese and other toppings.",
      "Arguments against pineapple on pizza include:",
      "- Traditional pizza purists believe fruit does not belong on pizza.",
      "- The texture of cooked pineapple can be off-putting to some.",
      "- The flavor combination may be too unconventional for some tastes."
    ]
  }
]

```

## Add the FAQ component

Based on the Hello World example from the basic tutorial, we have imported the FAQ component here and passed it the file name of the JSON file as a parameter. Please see the highlighted changes:

```jsx {8,43} title="src/pages/pinapple-on-pizza.js"
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import FAQSection from "@site/src/components/FAQSection";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="FAQ Component"
      description="This is just an example how easy it is to use components."
      bannerType="dots"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Cardano - making the world work better for all"
    description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
    >
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <Divider text="Hello" />
            <TitleWithText 
              title="Hello World"
              description={[
                "some line of text",
                "Another line of text."
              ]}
              titleType="black"
              headingDot={true}
            />

          <FAQSection jsonFileName="pineappleFAQ" />
          <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}

```

## Result

Your pineapple on pizza FAQ component at [http://localhost:3000/pineapple-on-pizza](http://localhost:3000/pineapple-on-pizza) will now look like this:

![img](/img/docs/tutorial/tutorial-step-3.jpg)