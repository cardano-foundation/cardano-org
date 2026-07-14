import React from "react";
import Layout from "@theme/Layout";
import BrowserOnly from "@docusaurus/BrowserOnly";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import Divider from "@site/src/components/Layout/Divider";
import Link from "@docusaurus/Link";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import AccountabilityRole from "@site/src/components/AccountabilityRole";
import AccountabilityStats from "@site/src/components/AccountabilityStats";
import { getAccountabilityRoles } from "@site/src/data/governanceAccountability";
import { translate } from "@docusaurus/Translate";
import styles from "./accountability.module.css";

function AccountabilityHero() {
  return (
    <SiteHero
      title={translate({ id: "governance.accountability.hero.title", message: "What the community expects" })}
      description={translate({
        id: "governance.accountability.hero.description",
        message:
          "The standards, expectations, and health signals for the people Cardano empowers: DReps, the Constitutional Committee, stake pool operators, and treasury-funded work.",
      })}
      bannerType="braidBlue"
    />
  );
}

export default function AccountabilityPage() {
  return (
    <Layout
      title={translate({ id: "governance.accountability.meta.title", message: "Governance Accountability - Cardano" })}
      description={translate({
        id: "governance.accountability.meta.description",
        message:
          "Community standards, expectations, and aggregate on-chain benchmarks for DReps, the Constitutional Committee, SPOs, and treasury-funded work on Cardano.",
      })}
    >
      <OpenGraphInfo pageName="governance" />
      <AccountabilityHero />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <SpacerBox size="small" />
            <p className="black-text">
              {translate({
                id: "governance.accountability.intro",
                message:
                  "Cardano is governed by its community. This page documents the standards those roles already answer to, drawn from the Constitution and established rules, and shows network-wide health signals. It restates and aggregates; it does not set new rules or grade individuals.",
              })}
            </p>
            <p className={styles.neutralityNote}>
              {translate({
                id: "governance.accountability.neutralityNote",
                message:
                  "Benchmarks here are ecosystem-wide. For data on specific DReps, committee members, or pools, follow the linked tools.",
              })}
            </p>
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
        <BoundaryBox>
          <BrowserOnly fallback={<div style={{ minHeight: 96 }} />}>
            {() => <AccountabilityStats />}
          </BrowserOnly>
          <Divider text={translate({ id: "governance.accountability.divider.roles", message: "Standards by role" })} id="roles" />
          <SpacerBox size="small" />
          {getAccountabilityRoles().map((role) => (
            <AccountabilityRole key={role.id} role={role} liveValue={null} />
          ))}
          <SpacerBox size="medium" />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <div className={styles.crossLinks}>
              <Link className={styles.crossLinkCard} to="/constitution">
                {translate({ id: "governance.accountability.out.constitution", message: "Read the full Constitution" })}
              </Link>
              <Link className={styles.crossLinkCard} to="/governance/delegate">
                {translate({ id: "governance.accountability.out.delegate", message: "Choose or change your DRep" })}
              </Link>
              <Link className={styles.crossLinkCard} to="/insights/governance-actions">
                {translate({ id: "governance.accountability.out.charts", message: "Explore governance action charts" })}
              </Link>
            </div>
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
