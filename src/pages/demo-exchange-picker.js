import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import ExchangePickerDemo from "@site/src/components/ExchangePickerDemo";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import Link from "@docusaurus/Link";
import SpacerBox from "@site/src/components/Layout/SpacerBox";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Exchange Picker Demo"
      description="Pick your country to get ada."
      bannerType="fluidBlue"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Exchange Picker Demo | cardano.org"
    description="Pick your country to get ada"
    >
      <OpenGraphInfo pageName="developers" />
      <HomepageHeader />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
            <Divider text="Exchange Picker Demo" />
            <ExchangePickerDemo />
            <SpacerBox size="medium" />
            Help us to crowd source this data file. <Link href="https://github.com/cardano-foundation/cardano-org/issues/355">Read how.</Link>
         </BoundaryBox>
      </BackgroundWrapper>

       
    </Layout>
  );
}
