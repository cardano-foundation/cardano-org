import React from "react";
import Layout from "@theme/Layout";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import Explorer from "@site/src/components/Medusa/Explorer";
import { translate } from "@docusaurus/Translate";

export default function MedusaPage() {
  const title = translate({ id: "medusa.page.title", message: "Medusa, the cardano-ledger history" });
  const description = translate({
    id: "medusa.page.description",
    message: "Watch the cardano-ledger repository grow month by month since 2018, hard fork by hard fork, in an interactive 3D visualization.",
  });
  return (
    <Layout title={title} description={description}>
      <OpenGraphInfo pageName="medusa" title={title} description={description} />
      <main>
        <Explorer />
      </main>
    </Layout>
  );
}
