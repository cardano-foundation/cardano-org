import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from '@docusaurus/Link';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

 

function WelcomeHero({ title, description, bannerType }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;


  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{title}</h1>
        <p className="hero__subtitle">{description}</p>
        <div className={styles.cta}>
          <Link className={clsx("button button--primary button--lg", styles.button)} to='/discover-cardano'>
          Discover Cardano
          </Link>
          <Link className={clsx("button button--primary button--lg", styles.button)} to='https://cardano.org/developer-portal'>
          Start Building
          </Link>
        </div>
         
          <div class={styles.sectionCaretInner}>
            <svg x="0px" y="0px" viewBox="0 0 2000 30">
              <polygon fill="#ffffff" points="1000,30 0,30 0,0 980,0 "></polygon>
              <polygon fill="#ffffff" points="1000,30 2000,30 2000,0 1020,0 "></polygon>
            </svg>
          </div>
          
      </div>
    </header>
  );
}

export default WelcomeHero;