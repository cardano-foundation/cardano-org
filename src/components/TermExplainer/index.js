import React, { useEffect, useState } from "react";
import {translate} from '@docusaurus/Translate';
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
import { getTermsForTermExplainer } from "@site/src/data/termsForTermExplainer";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import { shuffle } from "@site/src/utils/random";

// Display names of the term categories. Unknown keys are shown as they are.
function categoryLabel(category) {
  const labels = {
    governance: translate({ id: 'termExplainer.category.governance', message: 'Governance' }),
  };
  return labels[category] || category;
}

export default function TermExplainer({ category }) {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    const categoryTerms = getTermsForTermExplainer()[category];
    if (categoryTerms) {
      const randomTerms = shuffle(categoryTerms).slice(0, 2);
      // Pick random terms on the client only to avoid an SSR hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTerms(randomTerms);
    }
  }, [category]);

  return (
    <div className={styles.sectionWrap}>
      <Divider headingLevel={2} text={translate({id: 'termExplainer.divider', message: '{category} Terms you should know'}, {category: categoryLabel(category)})} white={true} />
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
