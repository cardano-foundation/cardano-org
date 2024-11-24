import React, { useState } from "react";
import Layout from "@theme/Layout";
import WelcomeHeroArtworkContest from "@site/src/components/Layout/WelcomeHeroArtworkContest";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import SpacerBox from "@site/src/components/Layout/SpacerBox";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <WelcomeHeroArtworkContest
      title={["Making the world Work Better For All"]}
      description="Cardano is a blockchain platform for changemakers, innovators, and visionaries, 
        with the tools and technologies required to create possibility for the many, as well as the few, 
        and bring about positive global change."
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
                alt="Preview"
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
      title="Home | cardano.org"
      description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
    >
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <FeaturedTitleWithText
              title="Artwork Contest Test Page"
              description={[
                "Upload your image here to see how it would look like.",
                "Toggle dark mode and resize the browser to see how it adapts.",
              ]}
              quote={[
                "Image will not be submitted,",
                <br key="line1" />, /* FIXME: too hacky */
                "This happens on your machine only",
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