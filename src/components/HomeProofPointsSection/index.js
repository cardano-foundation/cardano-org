import React from "react";
import { translate } from "@docusaurus/Translate";
import ProofPointsList from "@site/src/components/ProofPointsList";
import { getProofPoints } from "@site/src/data/whatIsCardanoProofPoints";

// The homepage shows the four strongest points, the full list lives on
// /what-is-cardano. Keys are looked up so the order here is explicit.
const HOME_KEYS = ["staking", "fees", "governance", "research"];

export default function HomeProofPointsSection() {
  const byKey = new Map(getProofPoints().map((point) => [point.key, point]));
  const points = HOME_KEYS.map((key) => byKey.get(key)).filter(Boolean);
  return (
    <ProofPointsList
      title={translate({ id: "home.proofPoints.title", message: "What makes Cardano different?" })}
      points={points}
      cta={{
        label: translate({ id: "home.proofPoints.cta", message: "What is Cardano?" }),
        to: "/what-is-cardano",
      }}
    />
  );
}
