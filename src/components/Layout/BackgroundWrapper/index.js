import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

//
// This component:
// wrap components in a background wrapper

export default function BackgroundWrapper({ children, backgroundType }) {
  // Use backgroundType to dynamically change the class for the background
  let wrapperClassName;

  switch (backgroundType) {
    case "solidGrey":
      wrapperClassName = styles.backgroundSolidGrey;
      break;
    case "solidBlue":
      wrapperClassName = styles.backgroundSolidBlue;
      break;
    case "zoom":
      wrapperClassName = styles.backgroundZoom;
      break;
    case "gradientDark":
      wrapperClassName = styles.backgroundGradientDark;
      break;
    case "gradientLight":
      wrapperClassName = styles.backgroundGradientLight;
      break;
    case "ada":
      wrapperClassName = styles.backgroundAda;
      break;
    default:
      wrapperClassName = styles.backgroundNone;
  }

  return <div className={wrapperClassName}>{children}</div>;
}
