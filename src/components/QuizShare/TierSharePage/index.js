import React from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import SiteHero from '@site/src/components/Layout/SiteHero';
import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import styles from './styles.module.css';

// Prebuilt, per-tier landing pages that a shared quiz result links to
// instead of the plain /quiz hub. Social platforms build link previews
// server-side from the shared URL's OG tags, so a personal result can never
// show up there, this is the workaround: one static page per tier, each
// with its own OG image, so a shared Gold result at least previews as Gold.
// noindex + a canonical back to /quiz keep these out of search, they exist
// for link previews only, the real content lives at the hub.
const QUIZ_URL = 'https://cardano.org/quiz';

const TIER_CONTENT = {
  bronze: {
    ogPageName: 'quiz-share-bronze',
    title: translate({id: 'quiz.tierPage.bronze.title', message: 'Bronze in the Cardano quiz'}),
    lead: translate({
      id: 'quiz.tierPage.bronze.lead',
      message: 'Someone earned Bronze in the Cardano quiz. How well do you know Cardano?',
    }),
    tierLabel: translate({id: 'quiz.tier.bronze', message: 'Bronze'}),
  },
  silver: {
    ogPageName: 'quiz-share-silver',
    title: translate({id: 'quiz.tierPage.silver.title', message: 'Silver in the Cardano quiz'}),
    lead: translate({
      id: 'quiz.tierPage.silver.lead',
      message: 'Someone earned Silver in the Cardano quiz. How well do you know Cardano?',
    }),
    tierLabel: translate({id: 'quiz.tier.silver', message: 'Silver'}),
  },
  gold: {
    ogPageName: 'quiz-share-gold',
    title: translate({id: 'quiz.tierPage.gold.title', message: 'Gold in the Cardano quiz'}),
    lead: translate({
      id: 'quiz.tierPage.gold.lead',
      message: 'Someone earned Gold in the Cardano quiz. How well do you know Cardano?',
    }),
    tierLabel: translate({id: 'quiz.tier.gold', message: 'Gold'}),
  },
};

const TierSharePage = ({tier}) => {
  const content = TIER_CONTENT[tier];

  return (
    <Layout title={content.title} description={content.lead}>
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href={QUIZ_URL} />
      </Head>
      <OpenGraphInfo pageName={content.ogPageName} title={content.title} description={content.lead} />
      <SiteHero title={content.title} description={content.lead} bannerType="starburst" />
      <BackgroundWrapper backgroundType="zoom">
        <BoundaryBox>
          <div className={styles.tierPage}>
            <span className={clsx(styles.tierBadge, styles[`tier_${tier}`])}>{content.tierLabel}</span>
            <Link to="/quiz" className={styles.cta}>
              {translate({id: 'quiz.tierPage.cta', message: 'Take the Cardano quiz'})}
            </Link>
          </div>
        </BoundaryBox>
      </BackgroundWrapper>
    </Layout>
  );
};

export default TierSharePage;
