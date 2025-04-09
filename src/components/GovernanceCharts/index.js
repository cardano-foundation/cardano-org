import React, { useState, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowChart from "../ReactFlow";
import styles from "./styles.module.css";
import governanceCharts from "@site/src/data/delegationFAQ2.json";

// Categories of governance actions
const CATEGORIES = {
  GENERAL: "General",
  INFO_ACTIONS: "Info Actions",
  PROTOCOL_PARAMETER_CHANGES: "Protocol Parameter Changes",
  CRITICAL_PARAMETER_CHANGES: "Critical Parameter Changes",
};

export default function GovernanceCharts() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeGraphIndex, setActiveGraphIndex] = useState(null);
  const [graphsData, setGraphsData] = useState({});

  // Organize charts by category on component mount
  useEffect(() => {
    // Group charts by category
    const organizedData = {};

    // Initialize empty arrays for each category
    Object.values(CATEGORIES).forEach((category) => {
      organizedData[category] = [];
    });

    // Sort charts into appropriate categories
    governanceCharts.forEach((chart) => {
      if (chart.category && organizedData[chart.category]) {
        organizedData[chart.category].push({
          title: chart.title,
          description: chart.description,
          graphData: chart.graphData,
        });
      }
    });

    setGraphsData(organizedData);
  }, []);

  // Reset active graph when category changes
  useEffect(() => {
    setActiveGraphIndex(null);
  }, [activeCategory]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  // Handle graph selection
  const handleGraphSelect = (index) => {
    setActiveGraphIndex(index === activeGraphIndex ? null : index);
  };

  return (
    <div className={styles.governanceChartsContainer}>
      {/* Category Selection */}
      <div className={styles.categorySelection}>
        <h3 className={styles.selectionTitle}>Select a category:</h3>
        <div className={styles.categoryButtons}>
          {Object.values(CATEGORIES).map((category) => (
            <button
              key={category}
              className={`button ${styles.categoryButton} ${
                activeCategory === category ? styles.active : ""
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Selection (visible when category is selected) */}
      {activeCategory &&
        graphsData[activeCategory] &&
        graphsData[activeCategory].length > 0 && (
          <div className={styles.graphSelection}>
            <h3 className={styles.selectionTitle}>Select a chart:</h3>
            <div className={`${styles.graphList} Collapsible`}>
              {graphsData[activeCategory].map((graph, index) => (
                <div
                  key={index}
                  className={`${styles.graphItem} Collapsible ${
                    index % 2 === 0 ? "even" : "odd"
                  } ${activeGraphIndex === index ? "active" : ""}`}
                  onClick={() => handleGraphSelect(index)}
                >
                  <div className="Collapsible__trigger">
                    <h4 className={styles.graphTitle}>{graph.title}</h4>
                  </div>
                  {activeGraphIndex === index && (
                    <div
                      className={`${styles.graphContent} Collapsible__contentInner`}
                    >
                      <p className={styles.graphDescription}>
                        {graph.description}
                      </p>
                      <div className={styles.graphContainer}>
                        <ReactFlowProvider>
                          <FlowChart
                            graphData={graph.graphData}
                            title={graph.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}
                          />
                        </ReactFlowProvider>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Empty state when category has no graphs */}
      {activeCategory &&
        (!graphsData[activeCategory] ||
          graphsData[activeCategory].length === 0) && (
          <div className={styles.emptyState}>
            <p>No charts available for this category yet.</p>
          </div>
        )}

      {/* Initial state prompt */}
      {!activeCategory && (
        <div className={styles.initialPrompt}>
          <p>Please select a category to view available governance charts.</p>
        </div>
      )}
    </div>
  );
}
