import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

function WelcomeHero({ title, description }) {

  return (
    <div className={styles.yepHeader}>
      <img
        alt=""
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
        className={styles.yepImage}
      />
      <div className={styles.yepShootingStarGroup} aria-hidden="true">
        <div className={styles.yepShootingStar}></div>
        <div className={styles.yepShootingStar}></div>
        <div className={styles.yepShootingStar}></div>
        <div className={styles.yepShootingStar}></div>
        <div className={styles.yepShootingStar}></div>
        <div className={styles.yepShootingStar}></div>
        <div className={styles.yepShootingStar}></div>
      </div>
      <div className={styles.yepPulsingStarGroup} aria-hidden="true">
        <div className={styles.yepPulsingStar}></div>
        <div className={styles.yepPulsingStar}></div>
        <div className={styles.yepPulsingStar}></div>
        <div className={styles.yepPulsingStar}></div>
        <div className={styles.yepPulsingStar}></div>
        <div className={styles.yepPulsingStar}></div>
      </div>
      <div className={styles.yepText}>
        <h1 className={styles.yepTitle}>
          Making The World Work Better For All
        </h1>
        <p className={styles.yepBlurb}>
          Cardano is a blockchain platform for changemakers, innovators, and visionaries, with the tools and technologies required to create possibility for the many, as well as the few, and bring about positive global change.
        </p>
        <div className={styles.yepButtons}>
          <a
            href="/use-cases"
            className={styles.yepButtonPrimary}
          >
            Where to get ada?
          </a>
          <a 
            href="/developers"
            className={styles.yepButtonSecondary}
          >
            Start building
          </a>
        </div>
      </div>
      
      <div className="sectionCaret">
        <svg x="0px" y="0px" viewBox="0 0 2000 30">
          <polygon
            className="polygon-fill"
            points="1000,30 0,30 0,0 980,0 ">
          </polygon>
          <polygon
            className="polygon-fill"
            points="1000,30 2000,30 2000,0 1020,0 ">
          </polygon>
        </svg>
      </div>
      
    </div>

  );
}

export default WelcomeHero;
