import React, { useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

function WelcomeHeroArtworkContest({ title, description }) {
  const [backgroundImage, setBackgroundImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result); // Set the uploaded image as the background
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header
      className={clsx("hero hero--primary", styles.heroBanner)}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : null,
      }}
    >
      <div className="container">
        <div className={styles.taglineContainer}>
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{description}</p>
        </div>

        <div className={styles.cta}>
          <Link
            className={clsx("button button--primary button--lg", styles.button)}
            to="/where-to-get-ada"
          >
            Where to get ada?
          </Link>
          <Link
            className={clsx("button button--primary button--lg", styles.button)}
            to="/developers"
          >
            Start Building
          </Link>
        </div>

        {/* File Upload Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.uploadInput}
        />

        <div className="sectionCaret">
          <svg x="0px" y="0px" viewBox="0 0 2000 30">
            <polygon
              className="polygon-fill"
              points="1000,30 0,30 0,0 980,0 "
            ></polygon>
            <polygon
              className="polygon-fill"
              points="1000,30 2000,30 2000,0 1020,0 "
            ></polygon>
          </svg>
        </div>
      </div>
    </header>
  );
}

export default WelcomeHeroArtworkContest;