import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { translate } from '@docusaurus/Translate';
import partners from '@site/src/data/homePartners.json';
import styles from './styles.module.css';

function PartnerLogo({ companyName, imageName, width, height }) {
  const src = useBaseUrl(`/img/partners/${imageName}.png`);
  const alt = translate(
    { id: 'home.partners.logoAlt', message: '{name} logo' },
    { name: companyName }
  );

  return (
    <li className={styles.item}>
      <img src={src} alt={alt} width={width} height={height} />
    </li>
  );
}

export default function HomePartnerLogos() {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.row}>
        {partners.map((partner) => (
          <PartnerLogo key={partner.imageName} {...partner} />
        ))}
      </ul>
    </div>
  );
}
