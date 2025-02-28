import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";

// Translation dictionary
const translations = {
  en: {
    title: "Staking Calculator",
    description: "See how much you could potentially earn by staking ada and learn how rewards are calculated.",
    rewardTitle: "Reward Calculator",
    rewardDescription: "This calculator is provided for guidance only.",
  },
  jp: {
    title: "ステーキング計算機",
    description: "エイダをステーキングすることでどれくらいの報酬が得られるか、計算方法を学びましょう。",
    rewardTitle: "報酬計算機",
    rewardDescription: "報酬計算機が必要なライブデータを読み込むまで数秒お待ちください。",
  }
};

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Staking Calculator"
      description="See how much you could potentially earn by staking ada and learn how rewards are calculated."
      bannerType="dots"
    />
  );
}

export default function Home() {
  // Get the 'lang' parameter from URL, default to 'en'
  const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const lang = urlParams.get("lang") === "jp" ? "jp" : "en"; // Only allow 'en' or 'jp'
  
  // Select translations based on language
  const t = translations[lang];

  return (
    <Layout
      title={`${t.title} | cardano.org`}
      description={t.description}
    >
      <OpenGraphImage pageName="calculator" />
      <SiteHero
        title={t.title}
        description={t.description}
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
          src={`/crewardcalculator?lang=${lang}`} 
          style={{ width: "100%", height: "100vh", border: "none" }} 
        ></iframe>
      </main>
    </Layout>
  );
}
