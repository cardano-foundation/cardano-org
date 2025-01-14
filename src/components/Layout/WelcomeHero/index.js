import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

function WelcomeHero({ title, description }) {

  return (
    <div className="relative isolate overflow-hidden bg-[#0033AD] px-6 py-24 sm:py-32 lg:px-8">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
        className="absolute inset-0 -z-10 object-cover size-full lg:size-auto opacity-40"
      />
      <div className="shootingStarGroup hidden lg:inline" aria-hidden="true">
        <div className={styles.shootingStar}></div>
        <div className={styles.shootingStar}></div>
        <div className={styles.shootingStar}></div>
        <div className={styles.shootingStar}></div>
        <div className={styles.shootingStar}></div>
        <div className={styles.shootingStar}></div>
        <div className={styles.shootingStar}></div>
      </div>
      <div className="pulsingPlanetGroup hidden lg:inline" aria-hidden="true">
        <div className={styles.pulsingPlanet}></div>
        <div className={styles.pulsingPlanet}></div>
        <div className={styles.pulsingPlanet}></div>
        <div className={styles.pulsingPlanet}></div>
        <div className={styles.pulsingPlanet}></div>
        <div className={styles.pulsingPlanet}></div>
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold text-white sm:text-5xl sm:leading-tight">
          Making The World Work Better For All
        </h1>
        <p className="mt-8 text-lg font-regular text-white md:text-xl lg:max-w-xl mx-auto">
          Cardano is a blockchain platform for changemakers, innovators, and visionaries, with the tools and technologies required to create possibility for the many, as well as the few, and bring about positive global change.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6 mx-auto">
          <a
            href="/use-cases"
            className="text-lg font-normal text-black py-2.5 px-5 rounded-full bg-white hover:bg-opacity-80 hover:text-black hover:no-underline"
          >
            Where to get ada?
          </a>
          <a 
            href="/developers"
            className="text-lg font-normal text-white py-2.5 px-5 rounded-full bg-black bg-opacity-10 border border-white hover:bg-opacity-20 hover:text-white hover:no-underline"
          >
            Start building
          </a>
        </div>
      </div>
    </div>

  );
}

export default WelcomeHero;
