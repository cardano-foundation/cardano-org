import React from "react";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

export default function DRepDelegate() {
  return (
    <div className={styles.container}>
      <p className="black-text">
        {translate({
          id: "governance.delegate.stub",
          message: "DRep delegation tool is being prepared.",
        })}
      </p>
    </div>
  );
}
