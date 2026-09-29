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
import TreasuryDonations from "@site/src/components/TreasuryDonations";
import { translate } from "@docusaurus/Translate";
import styles from "./treasury.module.css";

const TreasuryOverview = lazy(() =>
  import(/* webpackChunkName: "treasury-overview" */ "@site/src/components/TreasuryOverview")
);
const TreasuryDonate = lazy(() =>
  import(/* webpackChunkName: "treasury-donate" */ "@site/src/components/TreasuryDonate")
);

const overviewFallback = <div style={{ minHeight: 480 }} />;
const donateFallback = (
  <div style={{ textAlign: "center", padding: "3rem 0" }}>
    {translate({ id: "governance.treasury.loading", message: "Loading donation tool…" })}
  </div>
);

function TreasuryHero() {
  return (
    <SiteHero
      title={translate({ id: "governance.treasury.overview.hero.title", message: "The Cardano treasury" })}
      description={translate({
        id: "governance.treasury.overview.hero.description",
        message: "How the community fund is filled and spent, and where its income comes from.",
      })}
      bannerType="braidBlue"
    />
  );
}

function Explainer() {
  return (
    <div className={styles.explainer}>
      <div className={styles.block}>
        <h2>{translate({ id: "governance.treasury.explainer.income.title", message: "Where the money comes from" })}</h2>
        <p>
          {translate({
            id: "governance.treasury.explainer.income.body",
            message: "Every epoch, Cardano pays out rewards from two sources: a share of the remaining reserves and the transaction fees of the previous epoch. 20% of that reward pot goes to the treasury before stake pools and delegators receive the rest. Ada can also flow back through treasury donations, for example when funded work returns money it did not use.",
          })}
        </p>
      </div>
      <div className={styles.block}>
        <h2>{translate({ id: "governance.treasury.explainer.spending.title", message: "How it is spent" })}</h2>
        <p>
          {translate({
            id: "governance.treasury.explainer.spending.body",
            message: "Ada only leaves the treasury through treasury withdrawal actions. Anyone can propose one, and DReps and the Constitutional Committee must approve it under the rules of the Constitution.",
          })}
        </p>
        <p>
          <Link to="/constitution#section-7-treasury-withdrawals-action-standards">
            {translate({ id: "governance.treasury.explainer.spending.constitution", message: "Treasury rules in the Constitution" })}
          </Link>
          {" · "}
          <Link to="/governance/accountability#funding">
            {translate({ id: "governance.treasury.explainer.spending.accountability", message: "What treasury-funded work owes the community" })}
          </Link>
        </p>
      </div>
      <div className={styles.block}>
        <h2>{translate({ id: "governance.treasury.explainer.shift.title", message: "Why the mix shifts over time" })}</h2>
        <p>
          {translate({
            id: "governance.treasury.explainer.shift.body",
            message: "The reserves are finite. Each epoch releases a fixed percentage of what is left, so the amount paid out from them shrinks every year. Transaction fees are the part of the treasury's income that does not depend on the reserves.",
          })}
        </p>
      </div>
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
    </div>
  );
}

export default function TreasuryPage() {
  return (
    <Layout
      title={translate({ id: "governance.treasury.overview.layout.title", message: "The Cardano Treasury - Cardano Governance" })}
      description={translate({
        id: "governance.treasury.overview.layout.description",
        message: "How the Cardano treasury is funded and spent, how its income is split between reserves and fees, and how to donate ada directly from cardano.org.",
      })}
    >
      <OpenGraphInfo
        pageName="governance"
        title={translate({ id: "governance.treasury.overview.og.title", message: "The Cardano treasury" })}
        description={translate({
          id: "governance.treasury.overview.og.description",
          message: "Where the treasury's income comes from, how it is spent, and how ada flows back into it.",
        })}
      />
      <TreasuryHero />
      <main>
        <BoundaryBox>
          <SpacerBox size="small" />
          <Explainer />
          <BrowserOnly fallback={overviewFallback}>
            {() => (
              <Suspense fallback={overviewFallback}>
                <TreasuryOverview />
              </Suspense>
            )}
          </BrowserOnly>
          <TreasuryDonations />
          <SpacerBox size="medium" />
        </BoundaryBox>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text={translate({ id: "governance.treasury.donate.divider", message: "Donate to the treasury" })} id="donate" />
            <BrowserOnly fallback={donateFallback}>
              {() => (
                <Suspense fallback={donateFallback}>
                  <TreasuryDonate />
                </Suspense>
              )}
            </BrowserOnly>
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <div className={styles.crossLinks}>
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
