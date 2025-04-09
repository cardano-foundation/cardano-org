import React, { useState } from "react";
import Divider from "@site/src/components/Layout/Divider";
import Collapsible from "react-collapsible";
import { ReactFlowProvider } from "@xyflow/react";
import FlowChart from "../ReactFlow";
import styles from "./styles.module.css";
import delegationFAQ2 from "@site/src/data/delegationFAQ2.json";

const jsonData = {
  delegationFAQ2,
};

export default function FAQGraphs({ jsonFileName = "delegationFAQ2" }) {
  const [activeIndex, setActiveIndex] = useState(null);

  // Get the appropriate data based on the prop
  const faqList = jsonData[jsonFileName] || [];

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <Divider text="Governance Action Charts" id="governance-action-charts" />
      {faqList.map((faq, index) => (
        <div
          key={index}
          className={`Collapsible ${index % 2 === 0 ? "even" : "odd"} ${
            activeIndex === index ? "active" : ""
          }`}
          onClick={() => handleClick(index)}
        >
          <Collapsible trigger={faq.question}>
            <div className={styles.faqContent}>
              <ReactFlowProvider>
                <FlowChart graphData={faq.graphData} />
              </ReactFlowProvider>
            </div>
          </Collapsible>
        </div>
      ))}
    </div>
  );
}
