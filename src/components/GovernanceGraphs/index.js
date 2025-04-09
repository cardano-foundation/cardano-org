import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import "@xyflow/react/dist/style.css";
import styles from "./styles.module.css";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { useColorMode } from "@docusaurus/theme-common";

// Fallback component in case ReactFlow fails
const FallbackComponent = ({ data }) => (
  <div className={styles.flowError}>
    <p>Graph visualization unavailable</p>
    <p>Data preview:</p>
    <pre style={{ fontSize: "11px", overflow: "auto", maxHeight: "200px" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

export default function FlowChart({
  graphData,
  title = "cardano-governance-flow",
}) {
  const reactFlowRef = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const isBrowser = useIsBrowser();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const processData = (data, isDark) => {
    if (!data?.nodes || !data?.edges) return { nodes: [], edges: [] };

    const colorMap = {
      light: {
        background: "#fff",
        text: "#000",
        nodeColors: {
          "#e6f7ff": "#e6f7ff",
          "#f6ffed": "#f6ffed",
          "#fff7e6": "#fff7e6",
          "#f9f0ff": "#f9f0ff",
          "#fff1f0": "#fff1f0",
          "#d9f7be": "#d9f7be",
        },
        borderColors: {
          "#1890ff": "#1890ff",
          "#52c41a": "#52c41a",
          "#fa8c16": "#fa8c16",
          "#722ed1": "#722ed1",
          "#f5222d": "#f5222d",
        },
        edgeColors: {
          "#1890ff": "#1890ff",
          "#52c41a": "#52c41a",
          "#fa8c16": "#fa8c16",
          "#722ed1": "#722ed1",
          "#f5222d": "#f5222d",
        },
      },
      dark: {
        background: "#1b1b1d",
        text: "#ffffff",
        nodeColors: {
          "#e6f7ff": "#173a59",
          "#f6ffed": "#1e3320",
          "#fff7e6": "#3d2e14",
          "#f9f0ff": "#2d1a45",
          "#fff1f0": "#3e1a18",
          "#d9f7be": "#2d4016",
        },
        borderColors: {
          "#1890ff": "#40a9ff",
          "#52c41a": "#73d13d",
          "#fa8c16": "#ffa940",
          "#722ed1": "#9254de",
          "#f5222d": "#ff4d4f",
        },
        edgeColors: {
          "#1890ff": "#40a9ff",
          "#52c41a": "#73d13d",
          "#fa8c16": "#ffa940",
          "#722ed1": "#9254de",
          "#f5222d": "#ff4d4f",
        },
      },
    };

    // Process nodes with theme-specific styles
    const processedNodes = data.nodes.map((node) => {
      const updatedNode = {
        ...node,
        draggable: true,
        type: node.type || "default",
        style: { ...node.style },
      };

      if (isDark) {
        if (updatedNode.style.backgroundColor) {
          updatedNode.style.backgroundColor =
            colorMap.dark.nodeColors[updatedNode.style.backgroundColor] ||
            updatedNode.style.backgroundColor;
        }

        if (updatedNode.style.border) {
          updatedNode.style.border = updatedNode.style.border.replace(
            /#[0-9a-f]{3,6}/i,
            (match) => colorMap.dark.borderColors[match] || match
          );
        }

        updatedNode.style.color = colorMap.dark.text;
      }

      return updatedNode;
    });

    const processedEdges = data.edges.map((edge) => {
      const updatedEdge = { ...edge };

      if (isDark && updatedEdge.style && updatedEdge.style.stroke) {
        updatedEdge.style = {
          ...updatedEdge.style,
          stroke:
            colorMap.dark.edgeColors[updatedEdge.style.stroke] ||
            updatedEdge.style.stroke,
        };
      }

      // Update label styles for dark mode
      if (isDark && edge.label) {
        updatedEdge.labelStyle = {
          ...(edge.labelStyle || {}),
          fill: colorMap.dark.text,
          fontWeight: "bold",
        };

        updatedEdge.labelBgStyle = {
          ...(edge.labelBgStyle || {}),
          fill: "#3a3a3c",
          fillOpacity: 0.8,
        };
      }

      return updatedEdge;
    });

    return {
      nodes: processedNodes,
      edges: processedEdges,
    };
  };

  // Process data with current theme
  const processedData = processData(graphData, isDarkMode);
  const [nodes, setNodes, onNodesChange] = useNodesState(processedData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(processedData.edges);

  // Update nodes and edges when theme changes
  useEffect(() => {
    if (graphData) {
      const themeProcessedData = processData(graphData, isDarkMode);
      setNodes(themeProcessedData.nodes);
      setEdges(themeProcessedData.edges);
    }
  }, [isDarkMode, graphData, setNodes, setEdges]);

  // Capture the current state of the graph and download it in a PNG
  const downloadImage = useCallback(
    (e) => {
      e.stopPropagation();

      if (reactFlowRef.current === null || !reactFlowInstance || downloading) {
        return;
      }

      const flowElement = reactFlowRef.current.querySelector(".react-flow");
      if (!flowElement) {
        console.error("Flow element not found");
        return;
      }

      const downloadPanel = reactFlowRef.current.querySelector(
        ".react-flow__panel-top-right"
      );
      let panelOriginalDisplay = null;

      if (downloadPanel) {
        panelOriginalDisplay = downloadPanel.style.display;
        downloadPanel.style.display = "none";
      }

      const currentTransform = reactFlowInstance.getViewport();

      reactFlowInstance.fitView({ padding: 0.2 });

      setTimeout(() => {
        const edgeTextBgs = Array.from(
          flowElement.querySelectorAll(".react-flow__edge-textbg")
        );

        const originalBgFills = [];
        const originalBgOpacities = [];

        edgeTextBgs.forEach((bg, index) => {
          originalBgFills[index] = bg.style.fill;
          originalBgOpacities[index] = bg.style.fillOpacity;

          bg.style.fill = "transparent";
          bg.style.fillOpacity = "0";
        });

        toPng(flowElement, {
          backgroundColor: isDarkMode ? "#1b1b1d" : "#fff",
          pixelRatio: 2,
          quality: 1,
          style: {
            fontKerning: "normal",
            textRendering: "optimizeLegibility",
          },
          filter: (node) => {
            // Filter out problematic text backgrounds and any panels
            return (
              !node.classList ||
              (!node.classList.contains("react-flow__edge-textbg") &&
                !node.classList.contains("react-flow__panel"))
            );
          },
        })
          .then((dataUrl) => {
            setDownloading(true);

            const link = document.createElement("a");
            link.download = `${title.toLowerCase().replace(/\s+/g, "-")}${
              isDarkMode ? "-dark" : ""
            }.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            edgeTextBgs.forEach((bg, index) => {
              bg.style.fill = originalBgFills[index];
              bg.style.fillOpacity = originalBgOpacities[index];
            });

            if (downloadPanel && panelOriginalDisplay !== null) {
              downloadPanel.style.display = panelOriginalDisplay;
            }

            reactFlowInstance.setViewport(currentTransform);
            setTimeout(() => setDownloading(false), 500);
          })
          .catch((error) => {
            console.error("Error generating image:", error);
            setDownloading(true);

            edgeTextBgs.forEach((bg, index) => {
              bg.style.fill = originalBgFills[index];
              bg.style.fillOpacity = originalBgOpacities[index];
            });

            if (downloadPanel && panelOriginalDisplay !== null) {
              downloadPanel.style.display = panelOriginalDisplay;
            }

            reactFlowInstance.setViewport(currentTransform);
            setTimeout(() => setDownloading(false), 500);
          });
      }, 500);
    },
    [reactFlowInstance, title, isDarkMode]
  );

  // Initialize the ReactFlow instance
  const onInit = useCallback((instance) => {
    console.log("Flow initialized");
    setReactFlowInstance(instance);
  }, []);

  if (!processedData.nodes || !processedData.edges) {
    return <FallbackComponent data={graphData} />;
  }

  try {
    return (
      <div
        className={`${styles.flowContainer} ${
          isDarkMode ? styles.darkMode : ""
        }`}
        ref={reactFlowRef}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={true}
          elementsSelectable={true}
          zoomOnScroll={true}
          panOnDrag={true}
        >
          <Background color={isDarkMode ? "#333" : "#aaa"} gap={16} />
          <Panel position="top-right">
            <button
              onClick={(e) => downloadImage(e)}
              className={`button ${styles.downloadButton}`}
              disabled={downloading}
            >
              {downloading ? "Downloading..." : "Download Image"}
            </button>
          </Panel>
        </ReactFlow>
      </div>
    );
  } catch (error) {
    console.error("Error rendering ReactFlow:", error);
    return <FallbackComponent data={graphData} />;
  }
}
