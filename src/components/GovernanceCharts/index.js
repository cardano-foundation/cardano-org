import React, { useState, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import GovernanceGraphs from "@site/src/components/GovernanceGraphs";
import styles from "./styles.module.css";
import generalCharts from "@site/src/data/governanceChartsGeneral.json";
import infoActionCharts from "@site/src/data/governanceChartsInfoActions.json";
import protocolParamCharts from "@site/src/data/governanceChartsProtocolParams.json";
import criticalParamCharts from "@site/src/data/governanceChartsCriticalParams.json";
import BrowserOnly from "@docusaurus/BrowserOnly";

// Markdown to HTML converter using regular expressions
const markdownToHtml = (markdown) => {
  if (!markdown) return "";

  return markdown
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^\- (.*$)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\s*)+/gm, "<ul>$&</ul>")
    .replace(/^(?!<\/?[a-z][^>]*>)(.+)$/gm, "<p>$1</p>")
    .replace(/\n\s*\n/g, "</p><p>")
    .replace(/<p><\/p>/g, "");
};

// Categories of governance actions
const CATEGORIES = {
  GENERAL: "General",
  INFO_ACTIONS: "Info Actions",
  PROTOCOL_PARAMETER_CHANGES: "Protocol Parameter Changes",
  CRITICAL_PARAMETER_CHANGES: "Critical Parameter Changes",
};

// Map category names to their data files
const CATEGORY_DATA = {
  [CATEGORIES.GENERAL]: generalCharts,
  [CATEGORIES.INFO_ACTIONS]: infoActionCharts,
  [CATEGORIES.PROTOCOL_PARAMETER_CHANGES]: protocolParamCharts,
  [CATEGORIES.CRITICAL_PARAMETER_CHANGES]: criticalParamCharts,
};

export default function GovernanceCharts() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeGraphIndex, setActiveGraphIndex] = useState(null);
  const [graphsData, setGraphsData] = useState({});

  // Organize charts by category on component mount
  useEffect(() => {
    const organizedData = {};

    Object.entries(CATEGORY_DATA).forEach(([category, data]) => {
      organizedData[category] = data.map((chart) => ({
        title: chart.title,
        description: chart.description,
        parameterDetails: chart.parameterDetails,
        graphData: chart.graphData,
      }));
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
  const handleGraphSelect = (index, event) => {
    if (
      event.target.closest(".Collapsible__trigger") ||
      event.target.closest(".graphTitle")
    ) {
      setActiveGraphIndex(index === activeGraphIndex ? null : index);
    }
  };

  // Prevent clicks inside content from closing the dropdown
  const handleContentClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className={styles.governanceChartsContainer}>
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
                  onClick={(e) => handleGraphSelect(index, e)}
                >
                  <div className="Collapsible__trigger">
                    <h4 className={styles.graphTitle}>{graph.title}</h4>
                  </div>
                  {activeGraphIndex === index && (
                    <div
                      className={`${styles.graphContent} Collapsible__contentInner`}
                      onClick={handleContentClick}
                    >
                      <p className={styles.graphDescription}>
                        {graph.description}
                      </p>
                      {graph.parameterDetails && (
                        <div className={styles.parameterDetails}>
                          <h4>Parameter Details</h4>
                          <div
                            className="markdown"
                            dangerouslySetInnerHTML={{
                              __html: markdownToHtml(graph.parameterDetails),
                            }}
                          />
                        </div>
                      )}
                      <div className={styles.graphContainer}>
                        <ReactFlowProvider>
                          <GovernanceGraphs
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

      {/* //Initial state prompt */}
      {!activeCategory && (
        <div className={styles.initialPrompt}>
          <p>Please select a category to view available governance charts.</p>
        </div>
      )}
    </div>
  );
}
