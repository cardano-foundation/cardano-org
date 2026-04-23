import React, { useEffect, useState } from "react";
import {translate} from '@docusaurus/Translate';
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
import termsData from "@site/src/data/termsForTermExplainer.json"; // Import all the terms
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";

export default function TermExplainer({ category }) {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    if (category && termsData.categories[category]) {
      const categoryTerms = termsData.categories[category];
      const randomTerms = categoryTerms.sort(() => 0.5 - Math.random()).slice(0, 2);
      setTerms(randomTerms);
    }
  }, [category]);

  return (
    <div className={styles.sectionWrap}>
      <Divider text={translate({id: 'termExplainer.divider', message: '{category} Terms you should know'}).replace('{category}', category)} white={true} />
      <div className={styles.flexBox}>
        {terms.map((term, index) => (
          <div key={index} className={index % 2 === 0 ? styles.leftTextWrap : styles.rightTextWrap}>
            <h2>{term.term}</h2>
            <p>{parseMarkdownLikeText(term.description)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
