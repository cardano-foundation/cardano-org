import React, { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Panel,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import "@xyflow/react/dist/style.css";
import styles from "./styles.module.css";

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
  // Create a reference to the flow container
  const reactFlowRef = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Process nodes to ensure draggability
  const processData = (data) => {
    if (!data?.nodes || !data?.edges) return { nodes: [], edges: [] };

    return {
      nodes: data.nodes.map((node) => ({
        ...node,
        draggable: true, // Explicitly enable dragging
        type: node.type || "default",
      })),
      edges: data.edges,
    };
  };

  const processedData = processData(graphData);
  const [nodes, setNodes, onNodesChange] = useNodesState(processedData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(processedData.edges);

  // Function to download the current graph as a PNG image
  const downloadImage = useCallback(
    (e) => {
      // Prevent the click event from bubbling up
      e.stopPropagation();

      if (reactFlowRef.current === null || !reactFlowInstance || downloading) {
        return;
      }

      setDownloading(true);

      // Get the flow container element
      const flowElement = reactFlowRef.current.querySelector(".react-flow");
      if (!flowElement) {
        console.error("Flow element not found");
        setDownloading(false);
        return;
      }

      // Store current zoom/pan to restore later
      const currentTransform = reactFlowInstance.getViewport();

      // First fit the view to ensure all nodes are visible
      reactFlowInstance.fitView({ padding: 0.2 });

      // Set a timeout to ensure the view transition is complete before capturing
      setTimeout(() => {
        toPng(flowElement, {
          backgroundColor: "#fff",
          pixelRatio: 2,
          quality: 1,
        })
          .then((dataUrl) => {
            // Create a download link
            const link = document.createElement("a");
            link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            reactFlowInstance.setViewport(currentTransform);
            setDownloading(false);
          })
          .catch((error) => {
            console.error("Error generating image:", error);
            reactFlowInstance.setViewport(currentTransform);
            setDownloading(false);
          });
      }, 500);
    },
    [reactFlowInstance, downloading, title]
  );

  // Function to initialize the ReactFlow instance
  const onInit = useCallback((instance) => {
    console.log("Flow initialized");
    setReactFlowInstance(instance);
  }, []);

  if (!processedData.nodes || !processedData.edges) {
    return <FallbackComponent data={graphData} />;
  }

  try {
    return (
      <div className={styles.flowContainer} ref={reactFlowRef}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .react-flow__node {
            cursor: grab !important;
          }
          .react-flow__node:active {
            cursor: grabbing !important;
          }
          `,
          }}
        />
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
          <Background />
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
