import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

// Thin ECharts wrapper. The caller builds the option (theme-aware),
// this component only manages the chart instance.
/**
 * ECharts container that resizes with the window.
 *
 * @param {object} props
 * @param {object} props.option ECharts option, applied without merging on change.
 * @param {number|string} [props.height=380] Chart height.
 * @param {string} [props.ariaLabel] Accessible description of the chart.
 */
export default function TreasuryChart({ option, height = 380, ariaLabel }) {
  const ref = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    chart.current = echarts.init(ref.current);
    const onResize = () => chart.current && chart.current.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.current?.dispose();
      chart.current = null;
    };
  }, []);

  useEffect(() => {
    if (chart.current && option) chart.current.setOption(option, { notMerge: true });
  }, [option]);

  return <div ref={ref} role="img" aria-label={ariaLabel} style={{ height, width: "100%" }} />;
}
