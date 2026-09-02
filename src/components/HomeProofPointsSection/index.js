import React from "react";
import { translate } from "@docusaurus/Translate";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import ProofPointsList from "@site/src/components/ProofPointsList";
import { getProofPoints } from "@site/src/data/whatIsCardanoProofPoints";

// The homepage shows the four strongest points, the full list lives on
// /what-is-cardano. Keys are looked up so the order here is explicit.
const HOME_KEYS = ["staking", "fees", "governance", "research"];

export default function HomeProofPointsSection() {
  const allPoints = getProofPoints();
  const points = HOME_KEYS.map((key) => allPoints.find((point) => point.key === key)).filter(Boolean);
  return (
    <>
      <TitleWithText
        title={translate({ id: "home.proofPoints.title", message: "What makes Cardano different?" })}
        headingDot={true}
        titleType="black"
      />
      <ProofPointsList
        points={points}
        cta={{
          label: translate({ id: "home.proofPoints.cta", message: "What is Cardano?" }),
          to: "/what-is-cardano",
        }}
      />
    </>
  );
}
