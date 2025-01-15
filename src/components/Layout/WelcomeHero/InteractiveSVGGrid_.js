import React, { useEffect, useRef } from "react";
import "./InteractiveSVGGrid.css";
import { interactiveHeaderGridData } from "./interactiveHeaderGridData.js";
import {
  wordOptions0, wordRows0, wordEndCol0, wordStartCol0,
  wordOptions1, wordRows1, wordEndCol1, wordStartCol1,
  wordOptions2, wordRows2, wordEndCol2, wordStartCol2,
  wordOptions3, wordRows3, wordEndCol3, wordStartCol3,
  wordOptions4, wordRows4, wordEndCol4, wordStartCol4,
  wordOptions5, wordRows5, wordEndCol5, wordStartCol5,
  wordOptions6, wordRows6, wordEndCol6, wordStartCol6,
  wordOptions7, wordRows7, wordEndCol7, wordStartCol7,
  wordOptions8, wordRows8, wordEndCol8, wordStartCol8,
  wordOptions9, wordRows9, wordEndCol9, wordStartCol9,
  wordOptions10, wordRows10, wordEndCol10, wordStartCol10,
  wordOptions11, wordRows11, wordEndCol11, wordStartCol11,
  wordOptions12, wordRows12, wordEndCol12, wordStartCol12,
  wordOptions13, wordRows13, wordEndCol13, wordStartCol13,
  wordOptions14, wordRows14, wordEndCol14, wordStartCol14,
  wordOptions15, wordRows15, wordEndCol15, wordStartCol15,
  wordOptions16, wordRows16, wordEndCol16, wordStartCol16,
  wordOptions17, wordRows17, wordEndCol17, wordStartCol17,
  wordOptions18, wordRows18, wordEndCol18, wordStartCol18,
  wordOptions19, wordRows19, wordEndCol19, wordStartCol19,
  wordOptions20, wordRows20, wordEndCol20, wordStartCol20,
  wordOptions21, wordRows21, wordEndCol21, wordStartCol21,
  wordOptions22, wordRows22, wordEndCol22, wordStartCol22,
  wordOptions23, wordRows23, wordEndCol23, wordStartCol23,
  wordOptions24, wordRows24, wordEndCol24, wordStartCol24,
  wordOptions25, wordRows25, wordEndCol25, wordStartCol25,
  wordOptions26, wordRows26, wordEndCol26, wordStartCol26,
  wordOptions27, wordRows27, wordEndCol27, wordStartCol27,
  wordOptions28, wordRows28, wordEndCol28, wordStartCol28,
  wordOptions29, wordRows29, wordEndCol29, wordStartCol29,
  wordOptions30, wordRows30, wordEndCol30, wordStartCol30,
  wordOptions31, wordRows31, wordEndCol31, wordStartCol31,
  wordOptions32, wordRows32, wordEndCol32, wordStartCol32,
  wordOptions33, wordRows33, wordEndCol33, wordStartCol33,
  wordOptions34, wordRows34, wordEndCol34, wordStartCol34,
} from "./ourhistory.js";

const link1Text = ">>> BUY ADA";
const link2Text = ">>> START BUILDING";

function InteractiveSVGGrid() {
  const containerRef = useRef(null);
  const previouslyClickedRowNoRef = useRef(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    initializeGrid();
    const handleResize = () => {
      container.innerHTML = "";
      initializeGrid();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function initializeGrid() {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";
    generateGrid();
    setHistoryTextOnGrid(wordOptions0, wordRows0, wordEndCol0, wordStartCol0);
    wrapRectanglesWithLink(3, 27, link1Text, "https://cardano.org/where-to-get-ada");
    wrapRectanglesWithLink(3, 29, link2Text, "https://cardano.org/developers");
    toggleRectsWithTextToFlipped();
    attachEventListeners();
  }

  function attachEventListeners() {
    document.querySelectorAll(".rect-container").forEach((containerEl) => {
      containerEl.addEventListener("click", (event) => {
        if (event.target.closest("a") || isAnimatingRef.current) return;
        const rowNo = getRowFromClickedRect(event);
        if (rowNo !== null) lookupHistoricalText(rowNo);
      });
    });
  }

  const rectSize = 13;
  const spacing = 3;
  const rows = 34;
  const cols = 64;
  const blockchainHashColours = [
    "#395dbb",
    "#6785cb",
    "#99acdd",
    "#ccd5ee",
    "#f97c75",
    "#fa9a96",
    "#fcbbb9",
    "#fddddc",
    "#669199",
    "#8aabb2",
    "#b0c7cc",
    "#d7e3e5",
    "#59595b",
    "#808183",
    "#a5a8aa",
    "#d0d1d3",
  ];

  function generateGrid() {
    const container = containerRef.current;
    if (!container) return;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const totalGridWidth = cols * rectSize + (cols - 1) * spacing;
    const totalGridHeight = rows * rectSize + (rows - 1) * spacing;
    const startX = (containerWidth - totalGridWidth) / 2;
    const startY = (containerHeight - totalGridHeight) / 2;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
    const grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(grid);

    const createRect = (row, col, x, y, id) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", "rect-container");
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", rectSize);
      rect.setAttribute("height", rectSize);
      rect.setAttribute(
        "fill",
        blockchainHashColours[Math.floor(Math.random() * blockchainHashColours.length)]
      );
      if (id) rect.setAttribute("id", id);
      if (interactiveHeaderGridData[row]?.[col]?.class) {
        rect.setAttribute("class", interactiveHeaderGridData[row][col].class);
      }
      group.appendChild(rect);
      grid.appendChild(group);
    };

    const viewportWidth = window.innerWidth;
    const extraColumns = Math.ceil((viewportWidth - totalGridWidth) / (rectSize + spacing));
    for (let col = -extraColumns; col < cols + extraColumns; col++) {
      for (let row = 0; row < rows; row++) {
        const x = startX + col * (rectSize + spacing);
        const y = startY + row * (rectSize + spacing);
        const id = col >= 0 && col < cols ? `rect-${row}-${col}` : null;
        createRect(row, col, x, y, id);
      }
    }
    container.appendChild(svg);
  }

  function setHistoryTextOnGrid(wordOptions, wordRows, wordEndCol = null, wordStartCol = null) {
    if ((wordEndCol === null) === (wordStartCol === null)) return;
    wordOptions.forEach((word, i) => {
      const row = wordRows[i];
      word.split("").forEach((char, j) => {
        const col = wordEndCol !== null ? wordEndCol - word.length + 1 + j : wordStartCol + j;
        const rect = document.getElementById(`rect-${row}-${col}`);
        const parentGroup = rect?.parentNode;
        if (!parentGroup?.classList.contains("rect-container")) return;
        const x = parseFloat(rect.getAttribute("x")) + rectSize / 2;
        const y = parseFloat(rect.getAttribute("y")) + rectSize / 2;
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("dy", ".05em");
        text.textContent = char;
        parentGroup.appendChild(text);
      });
    });
    removeEmptyTextElemFromGrid();
  }

  function wrapRectanglesWithLink(startCol, row, text, url) {
    const numRects = text.length;
    const svgNS = "http://www.w3.org/2000/svg";
    for (let col = startCol; col < startCol + numRects; col++) {
      const rectId = `rect-${row}-${col}`;
      const rect = document.getElementById(rectId);
      if (!rect || rect.parentNode.tagName === "a") continue;
      const parentGroup = rect.parentNode;
      const textElement = parentGroup.querySelector("text");
      const link = document.createElementNS(svgNS, "a");
      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      parentGroup.replaceChild(link, rect);
      link.appendChild(rect);
      if (textElement) {
        parentGroup.replaceChild(link, textElement);
        link.appendChild(textElement);
      }
    }
  }

  function removeAllLinksFromGrid() {
    document.querySelectorAll("svg a").forEach((link) => {
      const parentGroup = link.parentNode;
      if (parentGroup) {
        Array.from(link.children).forEach((child) => parentGroup.insertBefore(child, link));
        parentGroup.removeChild(link);
      }
    });
  }

  function addBlockHashTextToRow(row) {
    if (!interactiveHeaderGridData || --row < 0 || row >= interactiveHeaderGridData.length) return;
    interactiveHeaderGridData[row].forEach((cellData, col) => {
      if (!cellData?.text) return;
      const rect = document.getElementById(`rect-${row}-${col}`);
      if (!rect) return;
      const x = parseFloat(rect.getAttribute("x")) + rectSize / 2;
      const y = parseFloat(rect.getAttribute("y")) + rectSize / 2;
      if (isNaN(x) || isNaN(y)) return;
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("dy", ".05em");
      text.textContent = cellData.text;
      rect.parentNode?.appendChild(text);
    });
  }

  function getRowFromClickedRect(event) {
    let clickedElement =
      event.target.tagName === "text"
        ? event.target.closest("g")?.querySelector("rect")
        : event.target;
    if (!clickedElement || clickedElement.tagName !== "rect") return null;
    let match = clickedElement.id?.match(/^rect-(\d+)-(\d+)$/);
    if (!match) {
      const rectY = parseFloat(clickedElement.getAttribute("y"));
      if (isNaN(rectY)) {
        return null;
      }
      clickedElement = Array.from(document.querySelectorAll("rect")).find((r) => {
        return parseFloat(r.getAttribute("y")) === rectY && r.id?.match(/^rect-(\d+)-(\d+)$/);
      });
      if (!clickedElement) {
        return null;
      }
      match = clickedElement.id.match(/^rect-(\d+)-(\d+)$/);
    }
    if (!match) return null;
    const clickedRowNo = parseInt(match[1], 10) + 1;
    if (clickedRowNo === previouslyClickedRowNoRef.current) {
      previouslyClickedRowNoRef.current = null;
    } else {
      previouslyClickedRowNoRef.current = clickedRowNo;
    }
    return previouslyClickedRowNoRef.current || 0;
  }

  function lookupHistoricalText(clickedRowNo) {
    const historyWordOptions = [
      wordOptions0, wordOptions1, wordOptions2, wordOptions3, wordOptions4, wordOptions5,
      wordOptions6, wordOptions7, wordOptions8, wordOptions9, wordOptions10, wordOptions11,
      wordOptions12, wordOptions13, wordOptions14, wordOptions15, wordOptions16, wordOptions17,
      wordOptions18, wordOptions19, wordOptions20, wordOptions21, wordOptions22, wordOptions23,
      wordOptions24, wordOptions25, wordOptions26, wordOptions27, wordOptions28, wordOptions29,
      wordOptions30, wordOptions31, wordOptions32, wordOptions33, wordOptions34,
    ];
    const historyWordRows = [
      wordRows0, wordRows1, wordRows2, wordRows3, wordRows4, wordRows5,
      wordRows6, wordRows7, wordRows8, wordRows9, wordRows10, wordRows11,
      wordRows12, wordRows13, wordRows14, wordRows15, wordRows16, wordRows17,
      wordRows18, wordRows19, wordRows20, wordRows21, wordRows22, wordRows23,
      wordRows24, wordRows25, wordRows26, wordRows27, wordRows28, wordRows29,
      wordRows30, wordRows31, wordRows32, wordRows33, wordRows34,
    ];
    const historyWordEndCols = [
      wordEndCol0, wordEndCol1, wordEndCol2, wordEndCol3, wordEndCol4, wordEndCol5,
      wordEndCol6, wordEndCol7, wordEndCol8, wordEndCol9, wordEndCol10, wordEndCol11,
      wordEndCol12, wordEndCol13, wordEndCol14, wordEndCol15, wordEndCol16, wordEndCol17,
      wordEndCol18, wordEndCol19, wordEndCol20, wordEndCol21, wordEndCol22, wordEndCol23,
      wordEndCol24, wordEndCol25, wordEndCol26, wordEndCol27, wordEndCol28, wordEndCol29,
      wordEndCol30, wordEndCol31, wordEndCol32, wordEndCol33, wordEndCol34,
    ];
    const historyWordStartCols = [
      wordStartCol0, wordStartCol1, wordStartCol2, wordStartCol3, wordStartCol4, wordStartCol5,
      wordStartCol6, wordStartCol7, wordStartCol8, wordStartCol9, wordStartCol10, wordStartCol11,
      wordStartCol12, wordStartCol13, wordStartCol14, wordStartCol15, wordStartCol16, wordStartCol17,
      wordStartCol18, wordStartCol19, wordStartCol20, wordStartCol21, wordStartCol22, wordStartCol23,
      wordStartCol24, wordStartCol25, wordStartCol26, wordStartCol27, wordStartCol28, wordStartCol29,
      wordStartCol30, wordStartCol31, wordStartCol32, wordStartCol33, wordStartCol34,
    ];
    if (clickedRowNo < 0 || clickedRowNo >= historyWordOptions.length) {
      return null;
    }
    const wOpt = historyWordOptions[clickedRowNo];
    const wRows = historyWordRows[clickedRowNo];
    const wECol = historyWordEndCols[clickedRowNo];
    const wSCol = historyWordStartCols[clickedRowNo];
    executeStateChange(clickedRowNo, wOpt, wRows, wECol, wSCol);
  }

  function executeStateChange(clickedRowNo, wOpt, wRows, wECol = null, wSCol = null) {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    if (wECol !== null && wSCol !== null) {
      console.error("Only one of wordEndCol or wordStartCol should be provided.");
      isAnimatingRef.current = false;
      return;
    }
    unflipAllElements();
    setTimeout(() => {
      removeAllLinksFromGrid();
      removeAllTextFromGrid();
      if (wECol !== null) {
        setHistoryTextOnGrid(wOpt, wRows, wECol, null);
      } else if (wSCol !== null) {
        setHistoryTextOnGrid(wOpt, wRows, null, wSCol);
        wrapRectanglesWithLink(3, 27, link1Text, "https://cardano.org/where-to-get-ada");
        wrapRectanglesWithLink(3, 29, link2Text, "https://cardano.org/developers");
      } else {
        console.error("Either wordEndCol or wordStartCol must be provided.");
      }
      if (clickedRowNo) addBlockHashTextToRow(clickedRowNo);
      toggleRectsWithTextToFlipped();
      isAnimatingRef.current = false;
    }, 500);
  }

  function removeAllTextFromGrid() {
    document.querySelectorAll("svg text").forEach((text) => text.remove());
  }

  function removeEmptyTextElemFromGrid() {
    document.querySelectorAll("svg text").forEach((text) => {
      if (!text.textContent.trim()) text.remove();
    });
  }

  function toggleRectsWithTextToFlipped() {
    document.querySelectorAll(".rect-container").forEach((containerEl) => {
      if (containerEl.querySelector("text")?.textContent.trim()) {
        containerEl.classList.toggle("flipped");
      }
    });
  }

  function unflipAllElements() {
    document.querySelectorAll(".rect-container.flipped").forEach((el) => el.classList.remove("flipped"));
  }

  return (
    <div
      id="grid-container"
      ref={containerRef}
      style={{
        width: "100%",
        height: "550px",
        margin: "0 auto",
      }}
    />
  );
}

export default InteractiveSVGGrid;
