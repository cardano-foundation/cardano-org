import React, { useEffect, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';


// shows a logo with a link, forces svg to ensure quality.
function LogoWithLink({ imageName, label, link, companyName }) {
  return (
    <div className={styles.logoContainer}>
      <div className={styles.imageWrap}>
        <Link to={link}>
          <ThemedImage
            alt={label}
            sources={{
              light: useBaseUrl(`/img/logos/${imageName}.svg`),
              dark: useBaseUrl(`/img/logos/${imageName}-dark.svg`),
            }}
          />
        </Link>
      </div>
      {companyName && <div className={styles.companyName}>{companyName}</div>}
    </div>
  );
}

function PartnerItem({ imageName, label, link, companyName }) {
  return <LogoWithLink imageName={imageName} label={label} link={link} companyName={companyName} />;
}

export default function HomePartnersSection({ jsonFileName }) {
  const [partnerItems, setPartnerItems] = useState([]);

  useEffect(() => {
    import(`@site/src/data/${jsonFileName}.json`)
      .then((module) => setPartnerItems(module.default))
      .catch((error) => console.error('Error loading partner items:', error));
  }, [jsonFileName]);

  return (
      <div className={styles.logoGridContainer}>
        <div className={styles.logoGrid}>
          {partnerItems.map((props, idx) => (
            <PartnerItem key={idx} {...props} />
          ))}
        </div>
      </div>
  );
}