import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import DottedImageWithText  from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox  from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Why Cardano?"
      description="Wondering about Cardano's motiviation?"
      bannerType="dots"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Why Cardano? | cardano.org"
    description="Wondering about Cardano's motiviation?"
    >
      <OpenGraphInfo pageName="developers" />
      <HomepageHeader />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
            <Divider text="How it all began" id="how-it-all-began"/>
            <DottedImageWithText
                imageName="education"
                title="What is Cardano?"
                text={[
                  
                 "Cardano is a blockchain platform and cryptocurrency project that began in 2015. It was created to rethink how cryptocurrencies are designed and developed, with the goal of providing a more balanced and sustainable ecosystem for users and for other systems that might integrate with it. The [cryptocurrency of the Cardano platform is called ada](/what-is-ada). In simple terms, Cardano is a technology that allows people to manage and exhange value, identity and governance over the internet.",

                 "Cardano is often called a third-generation blockchain. Bitcoin was the first generation (focusing on digital money), Ethereum the second (adding smart contracts - programs that run on the blockchain), and Cardano aims to be the next step by solving issues of scalability, interoperability, and sustainability that earlier networks face. It’s an open-source project, meaning its code is public and it’s developed by a broad community of engineers and researchers rather than a single company.",

                ]}
                headingDot={true}
              />


            <DottedImageWithText
                imageName="research"
                title="Why was Cardano created?"
                text={[

                  "The creators of Cardano saw that despite the success of Bitcoin and other cryptocurrencies, there were major challenges preventing mainstream adoption and long-term utility. Cardano’s development started by identifying these problems and setting principles to solve them.",
                  
                  {
                    list: [
                      "**Lack of Sustainability:** Many crypto projects rely on initial funding (like ICOs) and have no built-in way to fund future improvements. This can lead to stagnation. The goal was to establish a sustainable funding mechanism to support long-term development. This led to the idea of a treasury system – a community-controlled fund designed to finance network upgrades and ongoing maintenance.",

                      "**Governance and Evolution:** Early blockchains had no clear way for users to agree on changes or upgrades (leading to disputes and splits like Bitcoin vs. Bitcoin Cash, or Ethereum vs. Ethereum Classic). Cardano’s vision is to enable the community of ada holders to vote on proposals and changes, so the system can upgrade itself over time without breaking. This makes Cardano a self-evolving system that can adapt as needs change.",

                      "**Scalability:** Bitcoin and Ethereum become slow and expensive as more people use them because they were not designed to scale globally. For example, adding more computers (nodes) to those networks doesn’t make them faster; every node still has to process every transaction. Cardano aims to scale to millions or even billions of users.",

                      "**Security and Academic Rigor:** The crypto space sometimes saw new features added without fully studying past research or potential flaws. Cardano’s team took a different approach: study the science (cryptography, distributed systems) and use peer-reviewed research before building. In fact, Cardano is built on [a collection of peer-reviewed papers](/research) and formal methods. By involving expert cryptographers and scientists, Cardano tries to ensure its technology is secure and based on evidence rather than only on quick experimentation.",

                      "**Interoperability:** There are thousands of cryptocurrencies, but they often exist in isolation, unable to interact with each other or with legacy systems. Cardano’s goal is to make it easier for different blockchains and the traditional financial system to connect. For example, Cardano is exploring sidechains technology to allow value and data to move between Cardano and other blockchains. It’s also building in support for standards (similar to how internet protocols work) so it can communicate with banks and regulators if needed, without compromising the core principles of a blockchain.",

                      "**Addressing Real-World Needs:** Ultimately, Cardano’s mission is not just about advancing technology for its own sake. It poses a deeper question: “What is the point of all of it?” The answer lies in providing financial services to those who lack access. In many developing countries, people are without banks, legal identity, credit, or insurance. The goal is to bundle these essential services – money transfers, property records, identity, credit, and more – into one secure platform that can operate on a basic smartphone. In regions where traditional banking is unavailable or unaffordable, a blockchain like Cardano has the potential to be transformative, offering people powerful digital financial tools."
                    ],
                  },

                  
                  
                  

                ]}
                headingDot={false}
              />  
         </BoundaryBox>
      </BackgroundWrapper>

      <BackgroundWrapper backgroundType={"gradientDark"}>
          <BoundaryBox>
            <CtaOneColumn
              title="The original essay from 2017 outlining the background, philosophy and inspiration behind the Cardano blockchain. By Charles Hoskinson."
              buttonLabel={"Read the essay"}
              buttonLink={"https://why.cardano.org/en/introduction/motivation/"}
            />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
    </Layout>
  );
}
