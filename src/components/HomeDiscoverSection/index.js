import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import {translate} from '@docusaurus/Translate';

import DottedImageWithButton from "@site/src/components/Layout/DottedImageWithButton";
import QuoteWithText from "@site/src/components/Layout/QuoteWithText";

function getDiscoverItemList() {
  return [
    {
      imageName: "people",
      buttonLabel: translate({id: 'home.discover.people', message: 'People'}),
      buttonLink: "/discover-cardano#people",
    },
    {
      imageName: "purpose",
      buttonLabel: translate({id: 'home.discover.purpose', message: 'Purpose'}),
      buttonLink: "/discover-cardano#purpose",
    },
    {
      imageName: "research",
      buttonLabel: translate({id: 'home.discover.research', message: 'Research'}),
      buttonLink: "/discover-cardano#research",
    },
    {
      imageName: "technology",
      buttonLabel: translate({id: 'home.discover.technology', message: 'Technology'}),
      buttonLink: "/discover-cardano#technology",
    },
    {
      imageName: "opportunity",
      buttonLabel: translate({id: 'home.discover.opportunity', message: 'Opportunity'}),
      buttonLink: "/discover-cardano#opportunity",
    },
  ];
}

function DiscoverItem({ imageName, buttonLabel, buttonLink }) {
  return (
    <DottedImageWithButton
      imageName={imageName}
      buttonLabel={buttonLabel}
      buttonLink={buttonLink}
    />
  );
}

export default function HomeDiscoverSection() {
  const discoverItems = getDiscoverItemList();
  return (
    <div>
      <div className={styles.discoverWrap}>
        <div className={styles.discoverItems}>
          {discoverItems.map((props, idx) => (
            <DiscoverItem key={idx} {...props} />
          ))}
        </div>
      </div>
      <div className={styles.quoteWrap}>
        <QuoteWithText
          text={translate({id: 'home.discover.quote1', message: 'We have changed science. We have changed what it means to build global systems and sustainable models of exchange and governance.'})}
          quoteType="mixed"
        />
      </div>
      <div className={styles.quoteWrap}>
        <QuoteWithText
          text={translate({id: 'home.discover.quote2', message: 'Alongside the community, entities, and companies building on Cardano, a new future is being defined: a decentralized future without intermediaries, where power is returned to the individual'})}
          quoteType="none"
        />
      </div>
    </div>
  );
}
