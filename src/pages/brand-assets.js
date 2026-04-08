import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BrandAssetsSection from "../components/BrandAssetsSection";
import ColorPalette from "../components/BrandAssetsSection/ColorPalette";
import TypographyShowcase from "../components/BrandAssetsSection/TypographyShowcase";
import UsageGuidelines from "../components/BrandAssetsSection/UsageGuidelines";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import Head from "@docusaurus/Head";
import { translate } from "@docusaurus/Translate";

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({
        id: "brandAssets.hero.title",
        message: "Brand Assets",
      })}
      description={translate({
        id: "brandAssets.hero.description",
        message:
          "Our brand is a reflection of everything that we create. Here are some of the things that make up our brand and how you can use them.",
      })}
      bannerType="braidRedBlue"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({
        id: "brandAssets.layout.title",
        message: "Cardano Logo Download — Brand Assets, Colors & Guidelines",
      })}
      description={translate({
        id: "brandAssets.layout.description",
        message:
          "Download the official Cardano logo in SVG format. Starburst icon, stacked and horizontal wordmarks in multiple colors, plus brand colors, typography and usage guidelines.",
      })}
    >
      <OpenGraphInfo
        pageName="brand-assets"
        title="Cardano Logo Download — Brand Assets, Colors & Guidelines"
        description="Download the official Cardano logo in SVG format. Starburst icon, stacked and horizontal wordmarks in multiple colors, plus brand colors, typography and usage guidelines."
      />
      <Head>
        <meta
          name="keywords"
          content="Cardano logo, Cardano logo download, Cardano logo SVG, Cardano starburst, Cardano brand assets, Cardano brand guidelines, Cardano colors, Cardano typography"
        />
      </Head>
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <BrandAssetsSection />
        </BoundaryBox>
        <BackgroundWrapper backgroundType={"solidGrey"}>
          <BoundaryBox>
            <ColorPalette />
          </BoundaryBox>
        </BackgroundWrapper>
        <BoundaryBox>
          <TypographyShowcase />
        </BoundaryBox>
        <BackgroundWrapper backgroundType={"solidGrey"}>
          <BoundaryBox>
            <UsageGuidelines />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
