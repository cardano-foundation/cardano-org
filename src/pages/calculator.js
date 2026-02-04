import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import React, { useEffect, useRef } from "react";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Translation dictionary for calculator-specific content
const translations = {
  en: {
    title: "Staking Calculator",
    description: "See how much you could potentially earn by staking ada and learn how rewards are calculated.",
    rewardTitle: "Reward Calculator",
    rewardDescription: "The Cardano Foundation is not responsible for any differences between estimated and actual rewards. This calculator is for guidance purposes only.",
  },
  jp: {
    title: "ステーキング計算機",
    description: "エイダをステーキングすることでどれくらいの報酬が得られるか、計算方法を学びましょう。",
    rewardTitle: "報酬計算機",
    rewardDescription: "報酬計算機が必要なライブデータを読み込むまで数秒お待ちください。",
  }
};

export default function Home() {
  const iframeRef = useRef(null);
  const { i18n: { currentLocale } } = useDocusaurusContext();

  // Map Docusaurus locale to calculator language
  const langMap = { ja: 'jp', en: 'en' };
  const lang = langMap[currentLocale] || 'en';
  const t = translations[lang] || translations.en;

  useEffect(() => {

    function handleMessage(event) {

      if (event.data.iframeHeight) {
        if (iframeRef.current) {
          iframeRef.current.style.height = `${event.data.iframeHeight}px`;
        }
      }

      if (event.data.requestFullscreen) {
        if (iframeRef.current) {
          if (iframeRef.current.requestFullscreen) {
            iframeRef.current.requestFullscreen();
          } else if (iframeRef.current.mozRequestFullScreen) {
            iframeRef.current.mozRequestFullScreen();
          } else if (iframeRef.current.webkitRequestFullscreen) {
            iframeRef.current.webkitRequestFullscreen();
          } else if (iframeRef.current.msRequestFullscreen) {
            iframeRef.current.msRequestFullscreen();
          }
        }
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const pageTitle = t.title;
  const pageDescription = t.description;

  return (
    <Layout
      title={`${pageTitle} | cardano.org`}
      description={pageDescription}
    >
      <OpenGraphInfo pageName="calculator" />
      <SiteHero
        title={pageTitle}
        description={pageDescription}
        bannerType="dots"
      />
      <main>
        <BoundaryBox>
          <TitleWithText
            title={t.rewardTitle}
            titleType="black"
            description={t.rewardDescription}
            headingDot={true}
          />
        </BoundaryBox>
        {/* Pass the lang parameter dynamically */}
        <iframe
          ref={iframeRef}
          id="myIframe"
          src={`/crewardcalculator/?lang=${lang}`}
          style={{ width: "100%", height: "100vh", border: "none" }}
        ></iframe>
      </main>
    </Layout>
  );
}
