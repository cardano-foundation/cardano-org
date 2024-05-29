---
sidebar_position: 1
---

# Create a Page

Add **Markdown or React** files to `src/pages` to create a **standalone page**:

- `src/pages/index.js` → `localhost:3000/`
- `src/pages/foo.md` → `localhost:3000/foo`
- `src/pages/foo/bar.js` → `localhost:3000/foo/bar`

## Create your first React Page

Create a file at `src/pages/my-react-page.js`:

```jsx title="src/pages/my-react-page.js"
import React from 'react';
import Layout from '@theme/Layout';

export default function MyReactPage() {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  );
}
```

A new page is now available at [http://localhost:3000/my-react-page](http://localhost:3000/my-react-page).

## Create your first Markdown Page

Create a file at `src/pages/my-markdown-page.md`:

```mdx title="src/pages/my-markdown-page.md"
# My Markdown page

This is a Markdown page
```

A new page is now available at [http://localhost:3000/my-markdown-page](http://localhost:3000/my-markdown-page).


## Create a page using existing components

To make meaningful contributions you need to know how to build pages that look in the design of cardano.org. We have built some standard components for you that you can use.

Create a file at `src/pages/hello-world.js`:

```jsx title="src/pages/hello-world.js"
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Hello World"
      description="This is just an example how easy it is to create pages."
      bannerType="starburst"
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
        </BoundaryBox>
      </main>
    </Layout>
  );
}

```

A new page is now available at [http://localhost:3000/hello-world](http://localhost:3000/hello-world) and it will look like this:

![img](/img/docs/tutorial/tutorial-step-1.jpg)

### Select different Site Hero designs

The `<SiteHero>` component allows you to easily switch the header design by changing `bannerType=`. In our hello-world example try setting it to `ada` or any of these values:

`ada`, `dots`, `fluid`, `overlap`, `zoomRedWhite`, `zoomRedWhiteDark`, `zoomBlueRed`, `waves`, `starburst`, `braidBlue`, `braidRedBlue`, `braidBlack`, `ouroboros`.

Example overview of each bannerType is available at [http://localhost:3000/example-components-sitehero](http://localhost:3000/example-components-sitehero)

```jsx {4}
<SiteHero
      title="Hello World"
      description="This is just an example how easy it is to create pages."
      bannerType="ada"
    />

```

### Add more text

Add more text with another `<TitleWithText>` component. This time set headingDot to false.

```jsx {8} 
<TitleWithText 
      title="Title without the dot"
      description={[
        "some line of text with some **styling** in bold.",
        "Another line of text with an [link](https://developers.cardano.org)."
      ]}
      titleType="black"
      headingDot={false}
    />
```

### Add more components

To add a little bit of space at the end of the content we add the `<SpacerBox>` and to change the background we will wrap everything in a `<BackgroundWrapper>`. Please apply the highlighted changes:

```jsx {6-7,29,52-53} title="src/pages/hello-world.js"
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Hello World"
      description="This is just an example how easy it is to create pages."
      bannerType="ada"
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

          <TitleWithText 
                title="Title without the dot"
                description={[
                  "some line of text with some **styling** in bold.",
                  "Another line of text with an [link](https://developers.cardano.org)."
                ]}
                titleType="black"
                headingDot={false}
              />
          </BoundaryBox>
          <SpacerBox size="medium" />
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}

```

## Result

Your hello world page at [http://localhost:3000/hello-world](http://localhost:3000/hello-world) will now look like this:

![img](/img/docs/tutorial/tutorial-step-2.jpg)