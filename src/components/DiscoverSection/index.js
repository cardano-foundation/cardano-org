import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

import DottedImageWithButton from '@site/src/components/DottedImageWithButton';
import QuoteWithText from '../QuoteWithText';

const DiscoverItemList = [
  {
    imageName: 'people',
    buttonLabel: 'People',
    buttonLink: 'discover-cardano#people'
  },
  {
    imageName: 'purpose',
    buttonLabel: 'Purpose',
    buttonLink: 'discover-cardano#purpose'
  },
  {
    imageName: 'research',
    buttonLabel: 'Research',
    buttonLink: 'discover-cardano#research'
  },
  {
    imageName: 'technology',
    buttonLabel: 'Technology',
    buttonLink: 'discover-cardano#technology'
  },
  {
    imageName: 'opportunity',
    buttonLabel: 'Opportunity',
    buttonLink: 'discover-cardano#opportunity'
  },
];

function DiscoverItem({imageName, buttonLabel, buttonLink}) {
  return (
       
        <DottedImageWithButton
            imageName={imageName}
            buttonLabel={buttonLabel}
            buttonLink={buttonLink}
        />
       
  );
}

export default function DiscoverSection() {
  return (
    <section className="container">
    <div className={styles.discoverWrap}>
      <div className={styles.discoverItems}>
        
          {DiscoverItemList.map((props, idx) => (
            <DiscoverItem key={idx} {...props} />
          ))}
      </div>
    </div> 
    <div className={styles.quoteWrap}>
      <QuoteWithText
          text={[
            'We have changed science. We have changed what it means to build global systems and \
          sustainable models of exchange and governance.'
        ]}
          quoteType='black'
      />   
    </div>
    </section>
  );
}
