import React, { Suspense, lazy } from "react";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Heading from "@theme/Heading";
import { translate } from "@docusaurus/Translate";
import InsightsLayout from "@site/src/components/Layout/InsightsLayout";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import InsightsFooter from "@site/src/components/Layout/InsightsFooter";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import TreasuryDonations from "@site/src/components/TreasuryDonations";
import useHashRescroll from "@site/src/utils/useHashRescroll";
import styles from "./styles.module.css";

const TreasuryFlows = lazy(() => import(/* webpackChunkName: "treasury-live" */ "@site/src/components/TreasuryOverview/TreasuryFlows"));
const TreasuryIncome = lazy(() => import(/* webpackChunkName: "treasury-funding" */ "@site/src/components/TreasuryOverview/TreasuryIncome"));
const TreasuryOutlook = lazy(() => import(/* webpackChunkName: "treasury-funding" */ "@site/src/components/TreasuryOverview/TreasuryOutlook"));

export const meta = {
  pageName: "treasury",
  pageTitle: translate({ id: "insightsTreasury.meta.pageTitle", message: "Cardano Treasury in Numbers" }),
  pageDescription: translate({
    id: "insightsTreasury.meta.pageDescription",
    message: "The treasury's balance, flows and income from on-chain data, a projection for the reserves, and treasury donations from a regularly updated snapshot.",
  }),
  title: translate({ id: "insightsTreasury.meta.title", message: "Cardano Treasury in Numbers" }),
  date: "2026-10-01",
  og: {
    title: translate({ id: "insightsTreasury.og.title", message: "Cardano Treasury in Numbers" }),
    description: translate({
      id: "insightsTreasury.og.description",
      message: "How the Cardano treasury is funded and how its balance changes, from on-chain data.",
    }),
  },
  tags: ["treasury", "economics", "fees"],
  indexed: true,
};

// Client-only island. One fallback serves SSR and the lazy chunk, and its
// height keeps the layout steady while the live data loads.
function ClientOnly({ minHeight, children }) {
  const fallback = <div style={{ minHeight }} />;
  return <BrowserOnly fallback={fallback}>{() => <Suspense fallback={fallback}>{children}</Suspense>}</BrowserOnly>;
}

function PageContent() {
  useHashRescroll();
  return (
    <>
      <TitleWithText
        description={[
          translate({
            id: "insightsTreasury.intro",
            message: "**The Cardano treasury in numbers.** How its balance changed over the last 12 months, where its income comes from, how the reserves could develop and what the treasury received through treasury donations.",
          }),
        ]}
        headingDot
      />
      <p>
        <Link to="/governance/treasury">
          {translate({ id: "insightsTreasury.explainerLink", message: "What the treasury is and how spending is decided" })}
        </Link>
      </p>

      <section id="flows" className={styles.section}>
        <Heading as="h2">{translate({ id: "governance.treasury.flows.title", message: "Balance and flows over the last 12 months" })}</Heading>
        <ClientOnly minHeight={220}>
          <TreasuryFlows />
        </ClientOnly>
      </section>

      <section id="income" className={styles.section}>
        <Heading as="h2">{translate({ id: "insightsTreasury.income.title", message: "Income from reserves and fees" })}</Heading>
        <ClientOnly minHeight={900}>
          <TreasuryIncome />
        </ClientOnly>
      </section>

      <section id="outlook" className={styles.section}>
        <Heading as="h2">{translate({ id: "insightsTreasury.outlook.title", message: "Reserves outlook" })}</Heading>
        <ClientOnly minHeight={560}>
          <TreasuryOutlook />
        </ClientOnly>
      </section>

      <section id="donations" className={styles.section}>
        <Heading as="h2">{translate({ id: "insightsTreasury.donations.title", message: "Treasury donations" })}</Heading>
        <p>
          {translate({
            id: "governance.treasury.donations.intro",
            message: "Projects can return unused ada from treasury-funded work through a transaction called a treasury donation. The figures below include all treasury donations, whatever their purpose.",
          })}
        </p>
        <TreasuryDonations />
        <p>
          <Link to="/governance/treasury#donate">
            {translate({ id: "insightsTreasury.donations.toolLink", message: "Return funds or contribute" })}
          </Link>
        </p>
      </section>

      <InsightsFooter lastUpdated="Dynamic" />
    </>
  );
}

export default function TreasuryInsightsPage() {
  return (
    <InsightsLayout meta={meta}>
      <OpenGraphInfo {...meta.og} />
      <PageContent />
    </InsightsLayout>
  );
}
