import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import TitleBox from "@site/src/components/Layout/TitleBox";

//
// This component shows a simple header with some text below.
// title, text, and slight text are optional

export default function GovernanceBlueSection({}) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <div className={clsx("container", styles.sectionWrapper)}>
      <h1 className={styles.title}>
        A Model To Marginalize None,
        <br />
        And Give Power To All.
      </h1>
      <p className={styles.text}>
        Our current systems do not work for everyone. A better, more positive
        future is possible. If the world is to serve the many, it must be agreed
        to by the many. Consensus must drive progress and where disagreement
        occurs, it must drive creative solutions.
      </p>
    </div>
  );
}
