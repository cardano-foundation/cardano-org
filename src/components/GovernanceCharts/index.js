import React, { useState, useEffect, useRef } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import GovernanceGraphs from "@site/src/components/GovernanceGraphs";
import {translate} from '@docusaurus/Translate';
import styles from "./styles.module.css";
import generalCharts from "@site/src/data/governanceChartsGeneral.json";
import infoActionCharts from "@site/src/data/governanceChartsInfoActions.json";
import protocolParamCharts from "@site/src/data/governanceChartsProtocolParams.json";
import criticalParamCharts from "@site/src/data/governanceChartsCriticalParams.json";

// Simple markdown to HTML converter
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

// Categories and data mapping
const CATEGORIES = {
  GENERAL: "General",
  INFO_ACTIONS: "Info Actions",
  PROTOCOL_PARAMETER_CHANGES: "Protocol Parameter Changes",
  CRITICAL_PARAMETER_CHANGES: "Critical Parameter Changes",
};

const CATEGORY_DATA = {
  [CATEGORIES.GENERAL]: generalCharts,
  [CATEGORIES.INFO_ACTIONS]: infoActionCharts,
  [CATEGORIES.PROTOCOL_PARAMETER_CHANGES]: protocolParamCharts,
  [CATEGORIES.CRITICAL_PARAMETER_CHANGES]: criticalParamCharts,
};

// Cardano governance parameters list
const manualParametersList = [
  // Network Parameters
  "maxBlockBodySize",
  "maxTxSize",
  "maxBlockHeaderSize",
  "maxValueSize",
  "maxBlockExecutionUnits",
  "maxTxExecutionUnits",

  // Economic Parameters
  "txFeePerByte",
  "txFeeFixed",
  "minFeeRefScriptCoinsPerByte",
  "utxoCostPerByte",
  "govDeposit",
  "minPoolCost",
  "stakeAddressDeposit",
  "stakePoolDeposit",
  "treasuryCut",
  "monetaryExpansion",
  "executionUnitPrices",

  // Technical Parameters
  "stakePoolTargetNum",
  "poolPledgeInfluence",
  "poolRetireMaxEpoch",
  "collateralPercentage",
  "maxCollateralInputs",
  "costModels",

  // Governance Parameters
  "dRepDeposit",
  "committeeMinSize",
  "committeeMaxTermLength",
  "dRepActivity",
  "govActionLifetime",

  // Voting Thresholds
  "dvtCommitteeNoConfidence",
  "dvtCommitteeNormal",
  "dvtHardForkInitiation",
  "dvtMotionNoConfidence",
  "dvtPPEconomicGroup",
  "dvtPPGovGroup",
  "dvtPPNetworkGroup",
  "dvtPPTechnicalGroup",
  "dvtTreasuryWithdrawal",
  "dvtUpdateToConstitution",
];

// Extract parameters from text
const extractParameters = (parameterDetails) => {
  if (!parameterDetails) return [];
  const paramsList = [];
  for (const param of manualParametersList) {
    if (parameterDetails.toLowerCase().includes(param.toLowerCase())) {
      paramsList.push(param);
    }
  }
  return paramsList;
};

// shallow equality for arrays (order-insensitive)
const sameSet = (a = [], b = []) => {
  if (a.length !== b.length) return false;
  const sa = new Set(a);
  for (const x of b) if (!sa.has(x)) return false;
  return true;
};

export default function GovernanceCharts({
  initialCategory = null,
  initialParameters = [],
  onSelectionChange,
  urlSignature = '',
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeGraphIndex, setActiveGraphIndex] = useState(null);
  const [graphsData, setGraphsData] = useState({});
  const [allGraphs, setAllGraphs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [parametersDropdownOpen, setParametersDropdownOpen] = useState(false);
  const [selectedParameters, setSelectedParameters] = useState(initialParameters);
  // remember last selection
  const lastReportedRef = useRef({ category: initialCategory || null, parameters: [...initialParameters].sort() });

  const sameSelection = (a, b) => {
    if ((a.category || null) !== (b.category || null)) return false;
    const ap = [...(a.parameters || [])].sort();
    const bp = [...(b.parameters || [])].sort();
    if (ap.length !== bp.length) return false;
    for (let i = 0; i < ap.length; i++) if (ap[i] !== bp[i]) return false;
    return true;
  };
  const [activeChartId, setActiveChartId] = useState(null);

  const parametersDropdownRef = useRef(null);
  const parametersButtonRef = useRef(null);

  const lastUrlSigRef = useRef(urlSignature);

  //useEffect(() => { console.log('PARAMS', selectedParameters) }, [selectedParameters]);

  // React to external URL changes (back/forward or parent updates)
  useEffect(() => {
    // only if URL has realy changed
    if (urlSignature !== lastUrlSigRef.current) {
      if (initialCategory !== activeCategory) {
        setActiveCategory(initialCategory || null);
        setActiveGraphIndex(null);
        setActiveChartId(null);
      }
      if (!sameSet(initialParameters, selectedParameters)) {
        setSelectedParameters(initialParameters || []);
        setActiveGraphIndex(null);
        setActiveChartId(null);
      }
      lastUrlSigRef.current = urlSignature;
      lastReportedRef.current = {
        category: initialCategory || null,
        parameters: [...(initialParameters || [])].sort(),
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSignature, initialCategory, initialParameters]);


  // Initialize charts data
  useEffect(() => {
    const organizedData = {};
    let allGraphsList = [];

    Object.entries(CATEGORY_DATA).forEach(([category, data]) => {
      const categoryGraphs = data.map((chart) => {
        const parameters = extractParameters(chart.parameterDetails);
        const chartId = `${category}:${chart.title}`;
        return {
          id: chartId,
          title: chart.title,
          description: chart.description,
          parameterDetails: chart.parameterDetails,
          graphData: chart.graphData,
          category: category,
          parameters: parameters,
        };
      });
      organizedData[category] = categoryGraphs;
      allGraphsList = [...allGraphsList, ...categoryGraphs];
    });

    setGraphsData(organizedData);
    setAllGraphs(allGraphsList);
  }, []);

  useEffect(() => {
    setActiveGraphIndex(null);
  }, [activeCategory]);

  // Filter charts based on search term and parameters
  useEffect(() => {
    let results = [];

    if (searchTerm || selectedParameters.length > 0) {
      const graphsToFilter = activeCategory
        ? graphsData[activeCategory] || []
        : allGraphs;

      results = graphsToFilter.filter((graph) => {
        const textMatch =
          !searchTerm ||
          graph.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (graph.description &&
            graph.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (graph.parameterDetails &&
            graph.parameterDetails.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (graph.parameters &&
            graph.parameters.some((param) =>
              param.toLowerCase().includes(searchTerm.toLowerCase())
            ));

        const paramMatch =
          selectedParameters.length === 0 ||
          (graph.parameters &&
            selectedParameters.some((param) => graph.parameters.includes(param)));

        return textMatch && paramMatch;
      });
    }

    setSearchResults(results);
  }, [searchTerm, selectedParameters, allGraphs, activeCategory, graphsData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        parametersDropdownOpen &&
        parametersDropdownRef.current &&
        !parametersDropdownRef.current.contains(event.target) &&
        parametersButtonRef.current &&
        !parametersButtonRef.current.contains(event.target)
      ) {
        setParametersDropdownOpen(false);
      }
    };

    if (parametersDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [parametersDropdownOpen]);

  // ────────────────────────────────────────────────────────────────────────
  // URL sync: report selection changes upward
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const current = { category: activeCategory || null, parameters: selectedParameters };
    if (!sameSelection(current, lastReportedRef.current)) {
      lastReportedRef.current = { category: current.category, parameters: [...current.parameters].sort() };
      onSelectionChange?.(current);
    }
  }, [activeCategory, selectedParameters, onSelectionChange]);

  // Event handlers
  const handleCategorySelect = (category) => {
    setActiveCategory(category === activeCategory ? null : category);
    setSearchTerm("");
  };

  const handleGraphSelect = (index, category, event) => {
    if (
      event.target.closest(".Collapsible__trigger") ||
      event.target.closest(".graphTitle")
    ) {
      const selectedGraph =
        searchTerm || selectedParameters.length > 0
          ? searchResults[index]
          : graphsData[category][index];

      const isAlreadyActive = activeChartId === selectedGraph.id;

      if (isAlreadyActive) {
        setActiveChartId(null);
        setActiveGraphIndex(null);
        return;
      }

      if (!(selectedParameters.length > 0)) {
        setActiveCategory(category);
      }

      setActiveChartId(selectedGraph.id);

      if (category && !(selectedParameters.length > 0)) {
        const categoryIndex = graphsData[category].findIndex(
          (graph) => graph.id === selectedGraph.id
        );
        setActiveGraphIndex(categoryIndex);
      }
    }
  };

  const handleParameterSelect = (parameter, nextChecked) => {
    setSelectedParameters((prev) => {
      if (nextChecked) {
        return prev.includes(parameter) ? prev : [...prev, parameter];
      }
      return prev.filter((p) => p !== parameter);
    });
  };

  const removeParameterTag = (parameter) => {
    setSelectedParameters(selectedParameters.filter((p) => p !== parameter));
  };

  const clearAllTags = () => {
    setSelectedParameters([]);
    setSearchTerm("");
    setActiveCategory(null);
  };

  const handleContentClick = (event) => {
    event.stopPropagation();
  };

  const toggleParametersDropdown = () => {
    setParametersDropdownOpen(!parametersDropdownOpen);
  };

  return (
    <div className={styles.governanceChartsContainer}>
      {/* Search and Parameters Dropdown */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            placeholder={translate({id: 'governanceCharts.searchPlaceholder', message: 'Search for charts or parameters...'})}
            value={searchTerm}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchTerm(newValue);
              if (newValue === "") {
                setActiveCategory(null);
              }
            }}
            className={styles.searchInput}
          />
          <button
            className={styles.parametersButton}
            onClick={toggleParametersDropdown}
            ref={parametersButtonRef}
          >
            {translate({id: 'governanceCharts.parametersButton', message: 'Parameters ▼'})}
          </button>
        </div>

        {parametersDropdownOpen && (
          <div
            className={styles.parametersDropdown}
            ref={parametersDropdownRef}
          >
            <div className={styles.dropdownTitle}>{translate({id: 'governanceCharts.availableParameters', message: 'Available Parameters:'})}</div>
              <div className={styles.parametersList}>
                {manualParametersList.map((param, index) => {
                  const checked = selectedParameters.includes(param);
                  return (
                    <label key={param} className={styles.parameterItem}>
                      <input
                        type="checkbox"
                        className={styles.parameterCheckbox}
                        checked={checked}
                        onChange={(e) => {
                          const nextChecked = e.target.checked;
                          setSelectedParameters((prev) => {
                            if (nextChecked) {
                              return prev.includes(param) ? prev : [...prev, param];
                            }
                            return prev.filter((p) => p !== param);
                          });
                        }}
                      />
                      <span className={styles.parameterLabel}>{param}</span>
                    </label>
                  );
                })}
              </div>
            </div>
        )}

        {/* Selected Parameter Tags */}
        {selectedParameters.length > 0 && (
          <div className={styles.selectedTagsContainer}>
            {selectedParameters.map((param, index) => (
              <div key={index} className={styles.parameterTag}>
                {param}
                <button
                  className={styles.removeTagButton}
                  onClick={() => removeParameterTag(param)}
                  aria-label={`Remove ${param} parameter`}
                >
                  ×
                </button>
              </div>
            ))}
            {selectedParameters.length > 1 && (
              <button
                className={`button ${styles.clearTagsButton}`}
                onClick={clearAllTags}
              >
                {translate({id: 'governanceCharts.clearAll', message: 'Clear All'})}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Selection */}
      <div className={styles.categorySelection}>
        <div className={styles.selectionTitle}>{translate({id: 'governanceCharts.selectCategory', message: 'Select a category:'})}</div>
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

      {/* Charts display area */}
      {searchTerm || selectedParameters.length > 0 ? (
        <div className={styles.graphSelection}>
          <div className={styles.selectionTitle}>
            {searchTerm && selectedParameters.length > 0
              ? translate({id: 'governanceCharts.searchAndParamResults', message: 'Search Results & Parameter Filtered Charts:'})
              : searchTerm
              ? translate({id: 'governanceCharts.searchResults', message: 'Search Results:'})
              : translate({id: 'governanceCharts.paramFilteredCharts', message: 'Parameter Filtered Charts:'})}
          </div>
          {searchResults.length > 0 ? (
            <div className={`${styles.graphList} Collapsible`}>
              {searchResults.map((graph, index) => (
                <div
                  key={index}
                  className={`${styles.graphItem} Collapsible ${
                    index % 2 === 0 ? "even" : "odd"
                  } ${activeChartId === graph.id ? "active" : ""}`}
                  onClick={(e) => handleGraphSelect(index, graph.category, e)}
                >
                  <div className="Collapsible__trigger">
                    <h4 className={styles.graphTitle}>
                      <span>{graph.title}</span>
                      <div className={styles.graphCategory}>
                        {graph.category}
                      </div>
                    </h4>
                  </div>
                  {activeChartId === graph.id && (
                    <div
                      className={`${styles.graphContent} Collapsible__contentInner`}
                      onClick={handleContentClick}
                    >
                      <p className={styles.graphDescription}>
                        {graph.description}
                      </p>
                      {graph.parameterDetails && (
                        <div className={styles.parameterDetails}>
                          <h4>{translate({id: 'governanceCharts.parameterDetails', message: 'Parameter Details'})}</h4>
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
          ) : (
            <div className={styles.noResults}>
              {searchTerm && selectedParameters.length > 0
                ? translate({id: 'governanceCharts.noResults.searchAndParams', message: 'No charts found matching "{searchTerm}" with the selected parameters.'}).replace('{searchTerm}', searchTerm)
                : searchTerm
                ? translate({id: 'governanceCharts.noResults.search', message: 'No charts found matching "{searchTerm}"'}).replace('{searchTerm}', searchTerm)
                : translate({id: 'governanceCharts.noResults.params', message: 'No charts found with the selected parameters.'})}
            </div>
          )}
        </div>
      ) : activeCategory &&
        graphsData[activeCategory] &&
        graphsData[activeCategory].length > 0 ? (
        <div className={styles.graphSelection}>
          <div className={styles.selectionTitle}>{translate({id: 'governanceCharts.selectChart', message: 'Select a chart:'})}</div>
          <div className={`${styles.graphList} Collapsible`}>
            {graphsData[activeCategory].map((graph, index) => (
              <div
                key={index}
                className={`${styles.graphItem} Collapsible ${
                  index % 2 === 0 ? "even" : "odd"
                } ${activeChartId === graph.id ? "active" : ""}`}
                onClick={(e) => handleGraphSelect(index, activeCategory, e)}
              >
                <div className="Collapsible__trigger">
                  <h4 className={styles.graphTitle}>
                    <span>{graph.title}</span>
                    <div className={styles.graphCategory}>{graph.category}</div>
                  </h4>
                </div>
                {activeChartId === graph.id && (
                  <div
                    className={`${styles.graphContent} Collapsible__contentInner`}
                    onClick={handleContentClick}
                  >
                    <p className={styles.graphDescription}>
                      {graph.description}
                    </p>
                    {graph.parameterDetails && (
                      <div className={styles.parameterDetails}>
                        <h4>{translate({id: 'governanceCharts.parameterDetails', message: 'Parameter Details'})}</h4>
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
                          title={graph.title.toLowerCase().replace(/\s+/g, "-")}
                        />
                      </ReactFlowProvider>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : activeCategory ? (
        <div className={styles.emptyState}>
          <p>{translate({id: 'governanceCharts.emptyState', message: 'No charts available for this category yet.'})}</p>
        </div>
      ) : (
        <div className={styles.initialPrompt}>
          <p>
            {translate({id: 'governanceCharts.initialPrompt', message: 'Please select a category to view available governance charts, or use the search to find specific charts.'})}
          </p>
        </div>
      )}
    </div>
  );
}
