import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css"; 
import TitleWithText from "@site/src/components/Layout/TitleWithText";

//
// This component shows a simple header with some text below in a box
 
function TitleBox({ title, description, titleType, headingDot, slightText }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  // Use titleType to dynamically change the class for the title
  let titleClassName;

  switch (titleType) {
    case 'red':
      titleClassName = styles.titleTypeRed;
      break;
    case 'green':
      titleClassName = styles.titleTypeGreen;
      break;
    default:
      titleClassName = styles.titleTypeBlack;
  }

  return (
    <div className={styles.titleBoxWrap}>
      <div className={styles.titleBox}>
        <TitleWithText
          title = {title}
          description = {description}
          titleType = {titleType}
          headingDot = {headingDot}
          slightText = {slightText}
        />  
      </div>
    </div>
  );
};

export default TitleBox;