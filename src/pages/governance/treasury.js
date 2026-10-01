import React, { Suspense, lazy } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import Divider from "@site/src/components/Layout/Divider";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import useHashRescroll from "@site/src/utils/useHashRescroll";
import DonateSection from "@site/src/components/TreasuryDonations/DonateSection";
import { translate } from "@docusaurus/Translate";
import styles from "./treasury.module.css";

const TreasuryFunded = lazy(() => import(/* webpackChunkName: "treasury-live" */ "@site/src/components/TreasuryOverview/TreasuryFunded"));

// Shared by the divider, the donation form and every link to the form.
const DONATE_ANCHOR = "donate";

// Client-only island. One fallback serves SSR and the lazy chunk, and its
// height keeps the layout steady while the live data loads.
function ClientOnly({ minHeight, children }) {
  const fallback = <div style={{ minHeight }} />;
  return <BrowserOnly fallback={fallback}>{() => <Suspense fallback={fallback}>{children}</Suspense>}</BrowserOnly>;
}

function TreasuryHero() {
  return (
    <SiteHero
      title={translate({ id: "governance.treasury.overview.hero.title", message: "The Cardano treasury" })}
      description={translate({
        id: "governance.treasury.overview.hero.description",
        message: "What the treasury is for, how spending is decided, and where its income comes from.",
      })}
      bannerType="braidBlue"
    />
  );
}

export default function TreasuryPage() {
  useHashRescroll();
  return (
    <Layout
      title={translate({ id: "governance.treasury.overview.layout.title", message: "The Cardano Treasury - Cardano Governance" })}
      description={translate({
        id: "governance.treasury.overview.layout.description",
        message: "What the Cardano treasury is for, how spending is decided, what it has funded recently and how it is funded.",
      })}
    >
      <OpenGraphInfo
        pageName="governance"
        title={translate({ id: "governance.treasury.overview.og.title", message: "The Cardano treasury" })}
        description={translate({
          id: "governance.treasury.overview.og.description",
          message: "What the Cardano treasury is for, how spending is decided and how it is funded.",
        })}
      />
      <TreasuryHero />
      <main>
        <BoundaryBox>
          <SpacerBox size="small" />
          <section id="purpose" className={styles.section}>
            <h2>{translate({ id: "governance.treasury.purpose.title", message: "What the treasury is for" })}</h2>
            <p>
              {translate({
                id: "governance.treasury.purpose.body",
                message: "The Cardano treasury is a pool of ada held by the protocol itself. Ada only leaves it when the community approves it on chain.",
              })}
            </p>
            <p>
              {translate({
                id: "governance.treasury.purpose.uses",
                message: "It can fund any work the community approves, such as development of the protocol and its tools, research, and programs for the community and the ecosystem.",
              })}
            </p>
          </section>


          <section id="funded" className={styles.section}>
            <h2>{translate({ id: "governance.treasury.funded.title", message: "What the treasury funds" })}</h2>
            <p>{translate({ id: "governance.treasury.funded.intro", message: "The most recent treasury withdrawals that took effect:" })}</p>
            <ClientOnly minHeight={320}><TreasuryFunded /></ClientOnly>
            <p className={styles.note}>
              {translate({
                id: "governance.treasury.funded.note",
                message: "An approved withdrawal shows what the community agreed to fund. How the money is paid out and what the work delivers is reported separately.",
              })}{" "}
              <Link to="/governance/accountability#funding">
                {translate({ id: "governance.treasury.explainer.spending.accountability", message: "Standards for treasury-funded work" })}
              </Link>
            </p>
          </section>

          <section id="decisions" className={styles.section}>
            <h2>{translate({ id: "governance.treasury.decisions.title", message: "How spending is decided" })}</h2>
            <p>
              {translate({
                id: "governance.treasury.decisions.body",
                message: "Anyone can propose a treasury withdrawal. It needs approval from DReps and the Constitutional Committee, has to follow the Constitution and has to stay within the net change limit, the cap on how much ada can leave the treasury in a period.",
              })}
            </p>
            <p>
              <Link to="/constitution#section-7-treasury-withdrawals-action-standards">
                {translate({ id: "governance.treasury.explainer.spending.constitution", message: "Treasury rules in the Constitution" })}
              </Link>
              {" · "}
              <Link to="/governance/accountability#funding">
                {translate({ id: "governance.treasury.explainer.spending.accountability", message: "Standards for treasury-funded work" })}
              </Link>
            </p>
          </section>

          <section id="funding" className={styles.section}>
            <h2>{translate({ id: "governance.treasury.funding.title", message: "How the treasury is funded" })}</h2>
            <p>
              {translate({
                id: "governance.treasury.explainer.income.body",
                message: "Every epoch, a period of five days, Cardano combines the transaction fees of the previous epoch with a share of its reserves, the ada that is released into circulation step by step. 20% of this reward pot goes to the treasury, the rest is available as rewards for stake pools and delegators. Rewards that are not paid out return to the reserves. Projects can also return unused funding through a transaction called a treasury donation.",
              })}
            </p>
            <p>
              {translate({
                id: "governance.treasury.explainer.shift.body",
                message: "The reserves are finite. With the same percentage taken each epoch, a smaller reserve releases less ada for the treasury and for rewards. Income from transaction fees depends only on how much the network is used.",
              })}
            </p>
            <p>
              <Link to="/insights/treasury">
                {translate({ id: "governance.treasury.funding.numbersLink", message: "See the treasury in numbers" })}
              </Link>
            </p>
          </section>

          <section id="donations" className={styles.section}>
            <h2>{translate({ id: "governance.treasury.donations.title", message: "Returned funds and donations" })}</h2>
            <p>
              {translate({
                id: "governance.treasury.donations.explainerIntro",
                message: "Projects can return unused ada from treasury-funded work through a transaction called a treasury donation. Anyone can use the same transaction to contribute ada to the treasury.",
              })}
            </p>
            <div className={styles.buttonRow}>
              <a className="button button--primary" href={`#${DONATE_ANCHOR}`}>
                {translate({ id: "governance.treasury.donations.cta", message: "Return unused funds or contribute" })}
              </a>
              <Link to="/insights/treasury#donations">
                {translate({ id: "governance.treasury.donations.figuresLink", message: "Donation figures" })}
              </Link>
            </div>
          </section>
          <p className={styles.terms}>
            {translate({ id: "governance.treasury.explainer.terms", message: "Related terms:" })}{" "}
            <Link to="/glossary/treasury">{translate({ id: "governance.treasury.explainer.term.treasury", message: "Treasury" })}</Link>
            {" · "}
            <Link to="/glossary/treasury-cut">{translate({ id: "governance.treasury.explainer.term.cut", message: "Treasury cut" })}</Link>
            {" · "}
            <Link to="/glossary/treasury-withdrawal">{translate({ id: "governance.treasury.explainer.term.withdrawal", message: "Treasury withdrawal" })}</Link>
            {" · "}
            <Link to="/glossary/treasury-donation">{translate({ id: "governance.treasury.explainer.term.donation", message: "Treasury donation" })}</Link>
          </p>
          <SpacerBox size="medium" />
        </BoundaryBox>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text={translate({ id: "governance.treasury.donate.divider", message: "Donate to the treasury" })} id={DONATE_ANCHOR} />
            <ClientOnly minHeight={120}><DonateSection anchorId={DONATE_ANCHOR} /></ClientOnly>
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <div className={styles.crossLinks}>
              <Link className={styles.crossLinkCard} to="/insights/treasury">
                {translate({ id: "governance.treasury.out.numbers", message: "The treasury in numbers" })}
              </Link>
              <Link className={styles.crossLinkCard} to="/insights/supply/summary#treasury">
                {translate({ id: "governance.treasury.out.history", message: "Full treasury history and withdrawals" })}
              </Link>
              <Link className={styles.crossLinkCard} to="/governance/accountability">
                {translate({ id: "governance.treasury.out.accountability", message: "Standards for treasury-funded work" })}
              </Link>
              <Link className={styles.crossLinkCard} to="/constitution#section-7-treasury-withdrawals-action-standards">
                {translate({ id: "governance.treasury.out.constitution", message: "Read the treasury rules" })}
              </Link>
            </div>
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
