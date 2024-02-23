import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { parseTextWithLinks } from "@site/src/utils/textUtils";
//import styles from "./component-name.module.css"; // in case you need local css for this component
//import { makeStyles, Typography, Box } from '@material-ui/core'; // in case you need some material-ui

//
// This component:
// shows a dotted image on the left, below solution and product
// shows a header with some description on the right
// can be inverted with isImageRight:true
// please note that products expects an array even if there is only one product, because we want to
// link to products soon and use the learn more button to dive deeper into content.

export default function UseCase({
  title,
  description,
  solutions,
  product,
  buttonLink,
  imageName,
  isImageRight,
}) {
  // Construct the image URL using the imageName prop, we may want to handle image load errors in the future
  const imageUrl = useBaseUrl(`/img/dotted-icons/${imageName}.svg`);

  // Swap columns based on isImageRight flag
  const imageColumnClass = clsx("col col--4", styles.imageSection, {
    [styles.imageRight]: isImageRight,
  });
  const textColumnClass = clsx("col col--8", styles.textSection, {
    [styles.textRight]: isImageRight,
  });

  return (
    <div className={clsx("row", styles.container)}>
      <div className={imageColumnClass}>
        <img src={imageUrl} alt={title} />
        <div className={styles.solutions}>Solutions</div>
        <div className={styles.solutionsContent}>{solutions}</div>
        <div className={styles.product}>Products</div>
        <div className={styles.productContent}>
          {parseTextWithLinks(product)}
        </div>
      </div>
      <div className={textColumnClass}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{parseTextWithLinks(description)}</p>
        <Link
          href={buttonLink}
          className={clsx("button button--primary", styles.buttonLink)}
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}

UseCase.defaultProps = {
  isImageRight: false, // Default layout will have the image on the left
};
