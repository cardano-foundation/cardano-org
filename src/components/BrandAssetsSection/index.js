import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import { FaDownload } from "react-icons/fa6";
import { translate } from "@docusaurus/Translate";

const logoGroups = [
  {
    label: "Cardano Starburst Logo",
    id: "starburst",
    variants: [
      { color: "white", file: "cardano-starburst-white.svg", bg: "dark" },
      { color: "black", file: "cardano-starburst-black.svg", bg: "paper" },
      { color: "blue", file: "cardano-starburst-blue.svg", bg: "light" },
    ],
  },
  {
    label: "Cardano Stacked Logo",
    id: "stacked",
    variants: [
      { color: "white", file: "cardano-stacked-white.svg", bg: "dark" },
      { color: "black", file: "cardano-stacked-black.svg", bg: "paper" },
      { color: "blue", file: "cardano-stacked-blue.svg", bg: "light" },
    ],
  },
  {
    label: "Cardano Horizontal Logo (default)",
    id: "default",
    variants: [
      { color: "white", file: "cardano-horizontal-white.svg", bg: "dark" },
      { color: "black", file: "cardano-horizontal-black.svg", bg: "paper" },
      { color: "blue", file: "cardano-horizontal-blue.svg", bg: "light" },
    ],
  },
];

function LogoCard({ variant, groupLabel }) {
  const src = useBaseUrl(`img/brand-assets/${variant.file}`);
  const bgClass =
    variant.bg === "dark"
      ? styles.cardBgDark
      : variant.bg === "paper"
        ? styles.cardBgPaper
        : styles.cardBgLight;

  return (
    <div className={styles.logoCard}>
      <div className={clsx(styles.logoCardPreview, bgClass)}>
        <img
          src={src}
          alt={`${groupLabel} — ${variant.color} version`}
          className={styles.logoCardImg}
        />
      </div>
      <div className={styles.logoCardFooter}>
        <span className={styles.logoCardLabel}>{variant.color}</span>
        <a
          href={src}
          download={variant.file}
          className={styles.logoCardDownload}
          title={translate({
            id: "brandAssets.logos.downloadSvg",
            message: "Download SVG",
          })}
        >
          <FaDownload />
        </a>
      </div>
    </div>
  );
}

export default function BrandAssetsSection() {
  return (
    <div>
      {logoGroups.map((group) => (
        <div key={group.id}>
          <Divider text={group.label} id={group.id} />
          <div className={styles.logoGrid}>
            {group.variants.map((v) => (
              <LogoCard key={v.file} variant={v} groupLabel={group.label} />
            ))}
          </div>
        </div>
      ))}

      <Divider
        text={translate({ id: "brandAssets.logos.download", message: "Download" })}
        id="download"
      />
      <a href="/downloads/cardano-brand-assets.zip" className={styles.downloadAll}>
        <FaDownload className={styles.downloadIcon} />
        <span>
          {translate({
            id: "brandAssets.logos.downloadAll",
            message: "Download all Cardano brand assets from this page.",
          })}
        </span>
      </a>

      <TitleWithText
        description={[
          translate({
            id: "brandAssets.logos.desc1",
            message:
              "Our logo is at the heart of the brand identity. While it is the most recognizable part of the brand identity it is not the only component. The horizontal logo (shown here) is the primary version and should be used as the default version.",
          }),
          translate({
            id: "brandAssets.logos.desc2",
            message:
              "Please note the [Cardano Foundation Trademark Policy](https://cardanofoundation.org/en/trademark-policy).",
          }),
        ]}
        titleType="black"
        headingDot={true}
      />
    </div>
  );
}
