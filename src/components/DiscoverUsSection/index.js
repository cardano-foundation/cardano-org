import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import SpacerBox from "@site/src/components/Layout/SpacerBox";

//
// See Us, Know Us, Join Us

function LogoLink({ imageName, to }) {
  const imageUrl = useBaseUrl(`/img/logos/${imageName}.svg`);

  return (
    <div className={styles.logoWrap}>
      <Link to={to}>
        <img src={imageUrl} alt={imageName} />
      </Link>
    </div>
  );
}

export default function DiscoverUsSection({}) {
  const context = useDocusaurusContext();

  return (
    <div className="container">
      <div className={clsx("container", styles.boxWrap)}>
        <div className={styles.leftColumn}>
          <p>See Us</p>
          <p>Know Us</p>
          <p>Join Us</p>
        </div>
        <div className={styles.rightColumn}>
          <p>
            We strive to deliver positive global change and, together, with our
            partners, power a new age of possibility.{" "}
          </p>

          <p>
            A future that serves the many as well as the few, and which empowers
            individuals, societies, and businesses to imagine and create new
            ways of transacting, interacting, creating, and governing.
          </p>

          <LogoLink
            imageName={"cardanofoundation-white"}
            to={"/entities/?tab=cardano-foundation#entities"}
          />
          <p>
          The Cardano Foundation is an independent, Swiss-based not-for-profit organization. The Foundation is tasked with advancing the public digital infrastructure Cardano and works to anchor it as a utility for financial and social systems, thus empowering the digital architects of the future.<br /><br />The Foundation facilitates the worldwide advancement of Cardano in enterprise applications. It develops infrastructure tooling—including where there may not be an immediate commercial use case—plus strengthens operational resilience, and drives diversity of on-infrastructure use cases as well as the development of sound and representative governance.
          </p>

          <LogoLink
            imageName={"emurgo-white"}
            to={"/entities/?tab=emurgo#entitiesn"}
          />
          <p>
          EMURGO is a blockchain technology company and a founding entity of the Cardano blockchain that provides products and services to drive the adoption of Cardano’s Web3 ecosystem. Established in 2015 in Japan, EMURGO's mission is to facilitate commercial adoption through dynamic partnerships with existing ecosystem members and the seamless integration of new entrants.
          </p>

          <LogoLink
            imageName={"iog-white"}
            to={"/entities/?tab=iog#entities"}
          />
          <p>
          Input Output is a research and engineering company and venture studio that builds blockchain and Web3 products to empower everyone, everywhere.<br /><br />Founded by Charles Hoskinson and Jeremy Wood, Input Output was one of the three pioneer entities behind Cardano,  originally contracted to design, build, and help maintain the Cardano platform. A fully decentralized company, Input Output is comprised of dynamic, innovative teams– based all over the world, collectively committed to innovation through delivering the highest standards in software engineering based on rigorous peer-to-peer reviewed science.
          </p>
          <LogoLink
            imageName={"intersect-white"}
            to={"/entities/?tab=intersect#entities"}
          />
          <p>
          Intersect is a not-for-profit member-based organization for the Cardano ecosystem. Intersect acts as a champion for distributed development and is committed to empowering the Cardano community to build together and drive the blockchain forward. Our mission is to ensure, through our members, the lasting continuity and progressive development of Cardano - fostering a self-sustaining ecosystem that’s fit-for-purpose, perpetually future-proof, resilient, secure, and transparent.
          </p>
          <LogoLink
            imageName={"pragma-white"}
            to={"/entities/?tab=pragma#entities"}
          />
          <p>
          PRAGMA is a member-based, not-for-profit open source Association for blockchain software projects. It aims to foster an alternative open-source ecosystem for Cardano and beyond. A team of passionate software engineers from various backgrounds who build open-source tools for developers aiming for mass adoption.
          </p>

          <SpacerBox size="medium" />
        </div>
      </div>
    </div>
  );
}
