import React from "react";
import clsx from "clsx";
import styles from './styles.module.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
//import styles from "./component-name.module.css"; // in case you need local css for this component
//import { makeStyles, Typography, Box } from '@material-ui/core'; // in case you need some material-ui

//
// This component:
// shows a dotted image on the left, below solution and product
// shows a header with some description on the right
// can be inverted with isImageRight:true

function UseCase({ title, description, solutions, product, buttonLink, isImageRight }) {
  
  const imageColumnClass = clsx(
    'col col--4',
    styles.imageSection,
    { [styles.imageRight]: isImageRight }
  );
  const textColumnClass = clsx(
    'col col--8',
    styles.textSection,
    { [styles.textRight]: isImageRight }
  );

  return (
    <div className={clsx('row', styles.container)}>
      <div className={imageColumnClass}>
        <img src={useBaseUrl('/img/dotted-icons/education.svg')} alt="Use Case" />
        <div className={styles.solutions}>Solutions</div>
        <div className={styles.solutionsContent}>{solutions}</div>
        <div className={styles.product}>Product</div>
        <div className={styles.productContent}>{product}</div>
      </div>
      <div className={textColumnClass}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{parseTextWithLinks(description)}</p>
        <a href={buttonLink} className={clsx('button button--primary', styles.buttonLink)}>Learn more</a>
      </div>
    </div>
  );
}

UseCase.defaultProps = {
  isImageRight: false, // Default layout will have the image on the left
};

export default UseCase;

// Allow markdown to have links in text
function parseTextWithLinks(contentArray) {
  return contentArray.map((content, index) => {
    // If the content is a string, parse it for links
    if (typeof content === 'string') {
      // Split the string into parts and replace markdown-style links with <a> tags
      const parts = content.split(/(\[.*?\]\(.*?\))/).map((part, partIndex) => {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        return match ? <a href={match[2]} key={`link-${index}-${partIndex}`}>{match[1]}</a> : part;
      });
      return <React.Fragment key={`fragment-${index}`}>{parts}</React.Fragment>;
    } else {
      // If the content is not a string (e.g., a React element), return it directly
      return React.cloneElement(content, { key: `element-${index}` });
    }
  });
}