import React from "react";
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { translate } from "@docusaurus/Translate";

const minSizes = [
  { context: "Web", size: "64 px" },
  { context: "Tablet", size: "60 px" },
  { context: "Phone", size: "56 px" },
  { context: "Print", size: "20 mm" },
];

const dos = [
  translate({
    id: "brandAssets.usage.do1",
    message: "Use only the specified brand colors",
  }),
  translate({
    id: "brandAssets.usage.do2",
    message: "Maintain the safe area around the logo",
  }),
  translate({
    id: "brandAssets.usage.do3",
    message: "The icon can be used as a standalone element",
  }),
];

const donts = [
  translate({
    id: "brandAssets.usage.dont1",
    message: "Do not stretch, rotate, or distort the logo",
  }),
  translate({
    id: "brandAssets.usage.dont2",
    message: "Do not recolor the logo outside brand colors",
  }),
  translate({
    id: "brandAssets.usage.dont3",
    message: "Do not use the wordmark without the icon",
  }),
];

export default function UsageGuidelines() {
  return (
    <div>
      <Divider
        text={translate({ id: "brandAssets.usage.title", message: "Usage Guidelines" })}
        id="usage-guidelines"
      />

      {/* Minimum sizes */}
      <h3 className={styles.usageHeading}>
        {translate({ id: "brandAssets.usage.minSizes", message: "Minimum Sizes" })}
      </h3>
      <div className={styles.minSizeGrid}>
        {minSizes.map((item) => (
          <div key={item.context} className={styles.minSizeCard}>
            <span className={styles.minSizeContext}>{item.context}</span>
            <span className={styles.minSizeValue}>{item.size}</span>
          </div>
        ))}
      </div>

      {/* Safe area */}
      <h3 className={styles.usageHeading}>
        {translate({ id: "brandAssets.usage.safeArea", message: "Safe Area" })}
      </h3>
      <p className={styles.usageText}>
        {translate({
          id: "brandAssets.usage.safeAreaDesc",
          message:
            "Always maintain a clear space around the logo equal to the width of six dots from the starburst icon. This ensures the logo remains legible and visually distinct in all applications.",
        })}
      </p>

      {/* Do / Don't */}
      <h3 className={styles.usageHeading}>
        {translate({ id: "brandAssets.usage.dosDonts", message: "Do's & Don'ts" })}
      </h3>
      <div className={styles.doDontGrid}>
        <div className={styles.doCard}>
          {dos.map((text, i) => (
            <div key={i} className={styles.doDontItem}>
              <FaCircleCheck className={styles.doIcon} />
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className={styles.dontCard}>
          {donts.map((text, i) => (
            <div key={i} className={styles.doDontItem}>
              <FaCircleXmark className={styles.dontIcon} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Co-branding */}
      <h3 className={styles.usageHeading}>
        {translate({ id: "brandAssets.usage.cobranding", message: "Co-branding" })}
      </h3>
      <p className={styles.usageText}>
        {translate({
          id: "brandAssets.usage.cobrandingDesc",
          message:
            "When the Cardano logo appears alongside a partner logo, the Cardano logo should be displayed at an equal or larger size to maintain brand prominence.",
        })}
      </p>
    </div>
  );
}
