import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import * as echarts from "echarts";
import styles from "./styles.module.css";

/**
 * ECharts chart that follows its option. Creates the chart once, resizes it
 * with the window, and disposes of it on unmount. The caller builds the
 * option, including theme colors.
 *
 * @param {object} props
 * @param {object} [props.option] ECharts option. Applied whenever the object changes, ignored while `null`.
 * @param {boolean} [props.notMerge=true] Replaces the previous option instead of merging into it. Pass `false` to keep chart state such as the legend selection when the data changes.
 * @param {boolean} [props.lazyUpdate=false] Defers the update to the next animation frame.
 * @param {object} [props.onEvents] Event handlers by ECharts event name, for example `{ click: (params) => ... }`. The latest handlers are always used.
 * @param {number|string} [props.height] Chart height. A number is pixels. Defaults to 400px unless a class sets `--echart-height`.
 * @param {string} [props.ariaLabel] Accessible description. Gives the chart `role="img"`.
 * @param {string} [props.className] Extra class, for example to set `--echart-height` per breakpoint.
 * @param {object} [props.style] Inline styles, merged with the height.
 */
export default function EChart({ option, notMerge = true, lazyUpdate = false, onEvents, height, ariaLabel, className, style }) {
  const ref = useRef(null);
  const chart = useRef(null);
  const handlers = useRef(onEvents);

  useEffect(() => {
    handlers.current = onEvents;
  });

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
    if (chart.current && option) chart.current.setOption(option, { notMerge, lazyUpdate });
  }, [option, notMerge, lazyUpdate]);

  // One stable listener per event name that calls the latest handler, so a
  // caller's handler can close over fresh data without rebinding.
  const eventNames = Object.keys(onEvents || {}).sort().join(",");
  useEffect(() => {
    const instance = chart.current;
    if (!instance || !eventNames) return undefined;
    const bound = eventNames.split(",").map((name) => {
      const listener = (params) => handlers.current?.[name]?.(params);
      instance.on(name, listener);
      return [name, listener];
    });
    return () => bound.forEach(([name, listener]) => instance.off(name, listener));
  }, [eventNames]);

  return (
    <div
      ref={ref}
      className={clsx(styles.chart, className)}
      style={{ "--echart-height": typeof height === "number" ? `${height}px` : height, ...style }}
      {...(ariaLabel && { role: "img", "aria-label": ariaLabel })}
    />
  );
}
