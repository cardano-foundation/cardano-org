import clsx from "clsx";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import styles from "./developers.module.css";

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({
        id: "developers.hero.title",
        message: "Build on Cardano",
      })}
      description={translate({
        id: "developers.hero.description",
        message:
          "Everything you need, from your first transaction to production dApps.",
      })}
      bannerType="fluidBlue"
    />
  );
}

function DeveloperShowcase() {
  const portalHeroImg = useBaseUrl("/img/developers/portal-hero.jpeg");
  const startBuildingImg = useBaseUrl("/img/developers/start-building.jpeg");
  const smartContractsImg = useBaseUrl("/img/developers/smart-contracts.jpeg");
  const firstLineImg = useBaseUrl("/img/developers/from-first-line.jpeg");
  const builderToolsImg = useBaseUrl("/img/developers/builder-tools.jpeg");
  const hackathonsImg = useBaseUrl("/img/developers/hackathons.jpeg");
  const officeHoursImg = useBaseUrl("/img/developers/office-hours.jpeg");

  return (
    <div className={styles.showcaseCard}>
      {/* Portal Hero */}
      <div className={styles.portalHero}>
        <img
          src={portalHeroImg}
          alt="Cardano Developer Portal"
          loading="lazy"
        />
        <h2>
          {translate({
            id: "developers.showcase.heading",
            message: "Developer Portal",
          })}
        </h2>
        <p>
          {translate({
            id: "developers.showcase.tagline",
            message:
              "Your central hub for building on Cardano. Documentation, tutorials, tools, and SDKs all in one place.",
          })}
        </p>
        <Link
          className="button button--primary button--lg"
          to="https://developers.cardano.org"
        >
          {translate({
            id: "developers.showcase.cta",
            message: "Explore Developer Portal →",
          })}
        </Link>
      </div>

      <hr className={styles.inCardDivider} />

      {/* Section label */}
      <div className={styles.sectionLabel}>
        {translate({
          id: "developers.features.label",
          message: "What You'll Find",
        })}
      </div>

      {/* Start Building */}
      <Link
        to="https://developers.cardano.org/docs/get-started/client-sdks/overview/"
        className={styles.featureRow}
      >
        <div className={styles.featureScreenshot}>
          <img
            src={startBuildingImg}
            alt="Start Building — SDKs for TypeScript, Python, Rust, Go, Java, C# and more"
            loading="lazy"
          />
        </div>
        <div className={styles.featureText}>
          <h3>
            {translate({
              id: "developers.features.startBuilding.title",
              message: "Start Building",
            })}
          </h3>
          <p>
            {translate({
              id: "developers.features.startBuilding.description",
              message:
                "Production-ready SDKs for every stack. Bootstrap a dApp in seconds, build in your language, and spin up a local devnet with one command.",
            })}
          </p>
          <span className={styles.featureLink}>
            {translate({
              id: "developers.features.startBuilding.linkLabel",
              message: "Browse SDKs and tools",
            })}{" "}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>

      {/* Smart Contracts */}
      <Link
        to="https://developers.cardano.org/docs/smart-contracts/"
        className={clsx(styles.featureRow, styles.featureRowReverse)}
      >
        <div className={styles.featureScreenshot}>
          <img
            src={smartContractsImg}
            alt="Smart Contracts — native tokens, payments, stake pools, and governance"
            loading="lazy"
          />
        </div>
        <div className={styles.featureText}>
          <h3>
            {translate({
              id: "developers.features.smartContracts.title",
              message: "Smart Contracts",
            })}
          </h3>
          <p>
            {translate({
              id: "developers.features.smartContracts.description",
              message:
                "Digital agreements defined in code that automate and enforce contract terms without intermediaries. Leverage the eUTXO model for deterministic execution.",
            })}
          </p>
          <span className={styles.featureLink}>
            {translate({
              id: "developers.features.smartContracts.linkLabel",
              message: "Start with smart contracts",
            })}{" "}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>

      {/* From First Line to Production */}
      <Link
        to="https://developers.cardano.org/docs/build/smart-contracts/lessons/01-hello-world/"
        className={styles.featureRow}
      >
        <div className={styles.featureScreenshot}>
          <img
            src={firstLineImg}
            alt="Courses — interactive tutorials and hands-on challenges"
            loading="lazy"
          />
        </div>
        <div className={styles.featureText}>
          <h3>
            {translate({
              id: "developers.features.firstLine.title",
              message: "From First Line to Production",
            })}
          </h3>
          <p>
            {translate({
              id: "developers.features.firstLine.description",
              message:
                "Interactive courses, hands-on challenges, and step-by-step guides to go from zero to deploying on mainnet.",
            })}
          </p>
          <span className={styles.featureLink}>
            {translate({
              id: "developers.features.firstLine.linkLabel",
              message: "Explore courses",
            })}{" "}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>

      <hr className={styles.inCardDivider} />

      {/* Explore */}
      <div className={styles.sectionLabel}>
        {translate({
          id: "developers.explore.label",
          message: "Explore",
        })}
      </div>
      <div className={styles.toolsGrid}>
        <Link
          to="https://developers.cardano.org/tools"
          className={styles.toolTile}
        >
          <div className={styles.toolTileImage}>
            <img src={builderToolsImg} alt="Builder Tools on the Developer Portal" loading="lazy" />
          </div>
          <div className={styles.toolTileContent}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <div>
              <strong>
                {translate({
                  id: "developers.explore.builderTools.title",
                  message: "Builder Tools",
                })}
              </strong>
              <span>
                {translate({
                  id: "developers.explore.builderTools.description",
                  message: "APIs, indexers, and utilities",
                })}
              </span>
            </div>
          </div>
        </Link>
        <Link
          to="https://developers.cardano.org/hackathons/"
          className={styles.toolTile}
        >
          <div className={styles.toolTileImage}>
            <img src={hackathonsImg} alt="Hackathons and Challenges on the Developer Portal" loading="lazy" />
          </div>
          <div className={styles.toolTileContent}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <div>
              <strong>
                {translate({
                  id: "developers.explore.hackathons.title",
                  message: "Hackathons & Challenges",
                })}
              </strong>
              <span>
                {translate({
                  id: "developers.explore.hackathons.description",
                  message: "Build, compete, and earn rewards",
                })}
              </span>
            </div>
          </div>
        </Link>
        <Link
          to="https://www.addevent.com/calendar/TG807216"
          className={styles.toolTile}
        >
          <div className={styles.toolTileImage}>
            <img src={officeHoursImg} alt="Developer Office Hours" loading="lazy" />
          </div>
          <div className={styles.toolTileContent}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <strong>
                {translate({
                  id: "developers.explore.officeHours.title",
                  message: "Developer Office Hours",
                })}
              </strong>
              <span>
                {translate({
                  id: "developers.explore.officeHours.description",
                  message: "Weekly live Q&A with engineers",
                })}
              </span>
            </div>
          </div>
        </Link>
      </div>

      <hr className={styles.inCardDivider} />

      {/* Bottom links */}
      <div className={styles.inCardLinks}>
        <Link to="/docs/communities/" className={styles.inCardLink}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          {translate({
            id: "developers.community.allCommunities",
            message: "Developer Communities",
          })}
          <span aria-hidden="true">→</span>
        </Link>
        <Link to="https://cardanoupdates.com/" className={styles.inCardLink}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          {translate({
            id: "developers.explore.updateTracker.title",
            message: "Technical Update Tracker",
          })}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({
        id: "developers.meta.title",
        message: "Build on Cardano | cardano.org",
      })}
      description={translate({
        id: "developers.meta.description",
        message:
          "Everything you need, from your first transaction to production dApps.",
      })}
    >
      <OpenGraphInfo pageName="developers" />
      <HomepageHeader />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <SpacerBox size="small" />
          <DeveloperShowcase />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </BackgroundWrapper>

      <BackgroundWrapper backgroundType={"gradientDark"}>
        <BoundaryBox>
          <CtaOneColumn
            title={translate({
              id: "developers.cta.title",
              message: "Ready to start building?",
            })}
            buttonLabel={translate({
              id: "developers.cta.buttonLabel",
              message: "Visit Developer Portal",
            })}
            buttonLink={"https://developers.cardano.org"}
          />
          <SpacerBox size="small" />
        </BoundaryBox>
      </BackgroundWrapper>
    </Layout>
  );
}
