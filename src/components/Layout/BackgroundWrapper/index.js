import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

//
// This component:
// wrap components in a background style that can be selected
// most of the time you do not want to put a <BackgroundWrapper> as a child of <BoundaryBox>
// while it is usually fine to have a <BoundaryBox as a child of a <BackgroundWrapper>

/**
 * Wraps a page section in one of the shared background styles.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children Section content.
 * @param {string} [props.backgroundType] One of solidGrey, solidBlue, zoom, zoomBlueRight,
 *   zoomBlueCenter, gradientDark, gradientLight, ada, adaLight. Without it the section has no background.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function BackgroundWrapper({ children, backgroundType, className, ...rest }) {
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
    case "zoomBlueRight":
      wrapperClassName = styles.backgroundZoomBlueRight;
      break;
    case "zoomBlueCenter":
      wrapperClassName = styles.backgroundZoomBlueCenter;
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
    case "adaLight":
      wrapperClassName = styles.backgroundAdaLight;
      break;
    default:
      wrapperClassName = styles.backgroundNone;
  }

  return (
    <div className={clsx(wrapperClassName, className)} {...rest}>
      {children}
    </div>
  );
}
