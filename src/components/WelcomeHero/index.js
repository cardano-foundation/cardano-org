import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function WelcomeHero({ title, description, bannerType }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;


  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{title}</h1>
        <p className="hero__subtitle">{description}</p>
      </div>
    </header>
  );
}

export default WelcomeHero;