import React, { useState } from "react";
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
import { translate } from "@docusaurus/Translate";

const coreColors = [
  { name: "Blue", hex: "#0033AD", rgb: "0 / 51 / 173", pantone: "286" },
  { name: "Black", hex: "#000000", rgb: "0 / 0 / 0", pantone: "Process Black" },
  { name: "White", hex: "#FFFFFF", rgb: "255 / 255 / 255", pantone: "—", needsBorder: true },
  { name: "Paper", hex: "#f8f8f5", rgb: "248 / 248 / 245", pantone: "—", needsBorder: true },
];

const secondaryColors = [
  { name: "Red", hex: "#ff5553", rgb: "255 / 85 / 83", pantone: "178" },
  { name: "Green", hex: "#3b7982", rgb: "59 / 121 / 130", pantone: "569" },
];

function Swatch({ color }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(color.hex).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  }

  const isLight = color.name === "White" || color.name === "Paper";

  return (
    <div className={styles.swatch}>
      <div
        className={styles.swatchColor}
        style={{
          backgroundColor: color.hex,
          border: color.needsBorder ? "1px solid var(--ifm-color-emphasis-300)" : "none",
        }}
      />
      <div className={styles.swatchMeta}>
        <strong className={styles.swatchName}>{color.name}</strong>
        <button
          className={styles.swatchHex}
          onClick={handleCopy}
          title={translate({ id: "brandAssets.colors.copyHex", message: "Copy hex value" })}
        >
          {copied
            ? translate({ id: "brandAssets.colors.copied", message: "Copied!" })
            : color.hex}
        </button>
        <span className={styles.swatchDetail}>RGB {color.rgb}</span>
        {color.pantone !== "—" && (
          <span className={styles.swatchDetail}>Pantone {color.pantone}</span>
        )}
      </div>
    </div>
  );
}

export default function ColorPalette() {
  return (
    <div>
      <Divider
        text={translate({ id: "brandAssets.colors.coreTitle", message: "Core Colors" })}
        id="core-colors"
      />
      <div className={styles.coreColorGrid}>
        {coreColors.map((c) => (
          <Swatch key={c.name} color={c} />
        ))}
      </div>

      <Divider
        text={translate({ id: "brandAssets.colors.secondaryTitle", message: "Secondary Colors" })}
        id="secondary-colors"
      />
      <div className={styles.secondaryColorGrid}>
        {secondaryColors.map((c) => (
          <Swatch key={c.name} color={c} />
        ))}
      </div>
    </div>
  );
}
