import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Divider from '@site/src/components/Divider';
import LogoWithLink from '@site/src/components/LogoWithLink'; 
import TitleBox from '../TitleBox';

const PartnerItemList = [
  {
    imageName: 'cardanofoundation',
    label: 'Explore the Cardano Foundation',
    link: 'partners'
  },
  {
    imageName: 'iog',
    label: 'Find out Input Output Global',
    link: 'partners'
  },
  {
    imageName: 'emurgo',
    label: 'Learn about EMURGO',
    link: 'partners'
  },
];

function PartnerItem({imageName, label, link}) {
  return (
        <LogoWithLink
            imageName={imageName}
            label={label}
            link={link}
        />
  );
}

export default function PartnerSection() {
  return (
    <section className={styles.partnerSection}>
      <Divider headline='Partners' />
      <TitleBox
        description='A decentralized team works across three independent entities to ensure that Cardano stays true to its purpose as we advance and evolve.'
        titleType='none'
        headingDot={false}
      />
      <div className={styles.discoverWrap}>
        <div className={styles.discoverItems}>
          
        {PartnerItemList.map((props, idx) => (
              <PartnerItem key={idx} {...props} />
            ))}
        </div>
      </div> 
     
    </section>
  );
}
