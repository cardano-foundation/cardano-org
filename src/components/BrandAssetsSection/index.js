import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider"; 
import TitleWithText from "@site/src/components/Layout/TitleWithText"; 
import { FaDownload } from "react-icons/fa6";
 

export default function BrandAssetsSection() {

  return (
    <div>
        <Divider text="Download" id="download"/>
        <a href="/downloads/cardano-brand-assets.zip">
          <FaDownload className={styles.downloadIcon} />
          <p>Download all Cardano brand assets from this page.</p></a>

        <Divider text="Starburst" id="starburst"/>
        <div className={styles.logoContainer}>
          <img
            src={useBaseUrl("img/brand-assets/cardano-starburst-white.svg")}
            alt={"Cardano Starburst Logo White"}
            className={clsx(styles.logo, styles.white)}
          />
          <img
            src={useBaseUrl("img/brand-assets/cardano-starburst-black.svg")}
            alt={"Cardano Starburst Logo Black"}
            className={styles.logo}
          />
          <img
            src={useBaseUrl("img/brand-assets/cardano-starburst-blue.svg")}
            alt={"Cardano Starburst Logo Blue"}
            className={styles.logo}
          />
        </div>

        <Divider text="Stacked" id="stacked"/>
        <div className={styles.logoContainer}>
          <img
            src={useBaseUrl("img/brand-assets/cardano-stacked-white.svg")}
            alt={"Cardano Starburst Logo White"}
            className={clsx(styles.logo, styles.white)}
          />
          <img
            src={useBaseUrl("img/brand-assets/cardano-stacked-black.svg")}
            alt={"Cardano Starburst Logo Black"}
            className={styles.logo}
          />
          <img
            src={useBaseUrl("img/brand-assets/cardano-stacked-blue.svg")}
            alt={"Cardano Starburst Logo Blue"}
            className={styles.logo}
          />
        </div>

        <Divider text="Horizontal (default)" id="default"/>
        <div className={styles.logoContainer}>
          <img
            src={useBaseUrl("img/brand-assets/cardano-horizontal-white.svg")}
            alt={"Cardano Logo White"}
            className={clsx(styles.logo, styles.white)}
          />
          <img
            src={useBaseUrl("img/brand-assets/cardano-horizontal-black.svg")}
            alt={"Cardano Logo Black"}
            className={styles.logo}
          />
          <img
            src={useBaseUrl("img/brand-assets/cardano-horizontal-blue.svg")}
            alt={"Cardano Logo Blue"}
            className={styles.logo}
          />
        </div>
      
        <TitleWithText
              
              description={[
                "Our logo is at the heart of the brand identity. While it is the most recognizable part of the brand \
                identity it is not the only component. The horizontal logo (shown here) is the primary version and \
                should be used as the default version.",

                "Please note the [Cardano Foundation Trademark Policy](https://cardanofoundation.org/en/trademark-policy).",
              ]}
              titleType="black"
              headingDot={true}
            />
    </div>
  );
  }

