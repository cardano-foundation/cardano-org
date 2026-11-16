import React from "react";
import Layout from "@theme/Layout";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import Explorer from "@site/src/components/Medusa/Explorer";
import { translate } from "@docusaurus/Translate";

export default function LedgerHistoryPage() {
  const title = translate({ id: "ledgerHistory.page.title", message: "The cardano-ledger history" });
  const description = translate({
    id: "ledgerHistory.page.description",
    message: "Watch the cardano-ledger repository grow month by month since 2018, era by era, in an interactive 3D visualization.",
  });
  return (
    <Layout title={title} description={description}>
      <OpenGraphInfo pageName="ledger-history" title={title} description={description} />
      <main>
        <Explorer />
      </main>
    </Layout>
  );
}
