import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';  //Default Styling
import logosCompanies from '@site/src/data/logosCompanies.json';
import logosEntities from '@site/src/data/logosEntities.json';

const logoData = {
  logosCompanies,
  logosEntities,
};

// shows a logo with a link, forces svg to ensure quality
// "companyName" in the json file is optional, therefore
// if the logo consists of the company name leave the field out (example: Sundae Labs)
function LogoWithLink({ imageName, link, companyName, knownFor, showCompanyName }) {
  const logoElement = (
    <Link to={link}>
      <ThemedImage
        alt={`Company logo of ${companyName}`}
        sources={{
          light: useBaseUrl(`/img/logos/${imageName}.svg`),
          dark: useBaseUrl(`/img/logos/${imageName}-dark.svg`),
        }}
      />
    </Link>
  );

  return (
    <div className={styles.logoContainer}>
      <div className={styles.imageWrap}>
        {knownFor ? (
          <Tippy content={`Known for: ${knownFor}`} 
                 offset={[10, 20]}
                 trigger="mouseenter focusin click"
                 touch="hold">
            {logoElement}
          </Tippy>
        ) : (
          logoElement
        )}
      </div>
      {showCompanyName && companyName && (
        <div className={styles.companyName}>{companyName}</div>
      )}
    </div>
  );
}

function PartnerItem({ imageName, label, link, companyName, knownFor, showCompanyName }) {
  return <LogoWithLink imageName={imageName} link={link} companyName={companyName} knownFor={knownFor} showCompanyName={showCompanyName} />;
}

export default function HomePartnersSection({ jsonFileName }) {
  const partnerItems = logoData[jsonFileName] || [];

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