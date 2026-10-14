import React from "react";
import clsx from "clsx";
import LogoTile from "@site/src/components/Layout/LogoTile";

import { Categories } from "@site/src/data/apps";
import { resolveIconSrc } from "@site/src/utils/appIcon";

import styles from "./styles.module.css";

// Render an app's icon through LogoTile. When the icon is missing or fails to
// load, a letter avatar shows instead: the app's first letter on its category
// color.
//
// Per project memory (project_icon-mandatory.md), `icon` is mandatory for new submissions
// after Phase 6a's bulk-sweep, but the fallback stays for legacy entries and broken-image
// resilience.
/**
 * App icon image with a colored letter avatar as fallback.
 *
 * @param {object} props
 * @param {object} props.app App entry from the showcase data.
 * @param {string} [props.size="tile"] Icon size: "tile" or "row".
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function AppIcon({ app, size = "tile", className }) {
  return (
    <LogoTile
      src={resolveIconSrc(app)}
      name={app.title}
      className={clsx(size === "row" ? styles.appIconRow : styles.appIconTile, className)}
      style={{ "--logo-fallback-bg": Categories[app.category]?.color ?? "#888" }}
    />
  );
}
