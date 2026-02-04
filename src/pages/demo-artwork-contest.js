import React, { useState } from "react";
import Layout from "@theme/Layout";
import WelcomeHeroArtworkContest from "@site/src/components/Layout/WelcomeHeroArtworkContest";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <WelcomeHeroArtworkContest
      title={[translate({id: 'artworkContest.hero.title', message: 'Making the world Work Better For All'})]}
      description={translate({id: 'artworkContest.hero.description', message: 'Cardano is a blockchain platform for changemakers, innovators, and visionaries, with the tools and technologies required to create possibility for the many, as well as the few, and bring about positive global change.'})}
    />
  );
}

function FeaturedTitleWithText({ title, description, quote, headingDot }) {
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result); // Set the uploaded image as the preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col col--6">
          <h1 className={headingDot ? "headingDot" : ""}>{title}</h1>
        </div>
        <div className="col col--6">
          {Array.isArray(description) ? (
            description.map((paragraph, index) => (
              <p key={index} className="black-text">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="black-text">{description}</p>
          )}
          <h2 className="red-text">{quote}</h2>



          {/* Display the uploaded image as a preview */}
          {imageSrc && (
            <div>
              <img
                src={imageSrc}
                alt={translate({id: 'artworkContest.imagePreview.alt', message: 'Preview'})}
                style={{ maxWidth: "100%", marginTop: "20px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({id: 'artworkContest.layout.title', message: 'Home | cardano.org'})}
      description={translate({id: 'artworkContest.layout.description', message: 'An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance.'})}
    >
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <FeaturedTitleWithText
              title={translate({id: 'artworkContest.content.title', message: 'Artwork Contest Test Page'})}
              description={[
                translate({id: 'artworkContest.content.description1', message: 'Upload your image here to see how it would look like.'}),
                translate({id: 'artworkContest.content.description2', message: 'Toggle dark mode and resize the browser to see how it adapts.'}),
              ]}
              quote={[
                translate({id: 'artworkContest.content.quote1', message: 'Image will not be submitted,'}),
                <br key="line1" />, /* FIXME: too hacky */
                translate({id: 'artworkContest.content.quote2', message: 'This happens on your machine only'}),
              ]}
              headingDot={true}
            />
            <SpacerBox size="large" />
          </BoundaryBox>
        </BackgroundWrapper>

      </main>
    </Layout>
  );
}