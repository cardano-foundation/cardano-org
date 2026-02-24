import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import SiteHero from "@site/src/components/Layout/SiteHero";
import UseCasesGrid from "@site/src/components/UseCasesGrid";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'useCases.hero.title', message: 'Use Cases'})}
      description={translate({id: 'useCases.hero.description', message: 'Cardano: A developing platform built to support enterprises and a wide range of use cases, solving challenges across multiple industries.'})}
      bannerType="fluidBlue"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({id: 'useCases.layout.title', message: 'Use cases for enterprise | cardano.org'})}
      description={translate({id: 'useCases.layout.description', message: 'An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance.'})}
    >
      <OpenGraphInfo pageName="use-cases-for-enterprise" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
          <TitleWithText
              description={[
                translate({id: 'useCases.intro.description', message: "Cardano is a public, permissionless Layer 1 blockchain, perfect for enterprises seeking secure, scalable, and transparent solutions. Whether it's streamlining supply chains, enabling global payments, or tokenizing assets, Cardano offers decentralized innovation with robust security and low energy usage. Empower your business with a blockchain built for trust, collaboration, and global impact."}),
              ]}
            />

            <Divider text={translate({id: 'useCases.divider.identity', message: 'Identity'})} id="identity" />
            <TitleWithText
              title={translate({id: 'useCases.education.title', message: 'Education'})}
              description={[
                translate({id: 'useCases.education.description1', message: "The issuance of academic certifications is heavily centralized. If diplomas, degrees, or other credentials are damaged or lost, the re-issue process is often costly, and the issuing institution might no longer exist. Sharing these credentials is also difficult, as academic achievements are traditionally issued in physical form, which makes it almost impossible to share when and where needed."}),

                translate({id: 'useCases.education.description2', message: "Cardano's blockchain-based identity and credentials solutions address these challenges by securing academic certifications within an immutable and tamper-proof ecosystem. These solutions empower students to take ownership of their achievements, enabling them to instantly share verifiable credentials with institutions or employers."}),

                translate({id: 'useCases.education.description3', message: "With this approach, students maintain full control of their academic records without relying on third-party intermediaries. Institutions can verify credentials instantly, eliminating delays and reducing costs. This creates a seamless and efficient way for students and job seekers to prove their qualifications and achievements with confidence."}),
              ]}
            />

            <UseCasesGrid />

            <SpacerBox size="medium" />

            <Divider text={translate({id: 'useCases.divider.identity', message: 'Identity'})} id="identity" />
            <TitleWithText
              title={translate({id: 'useCases.digitalIdentity.title', message: 'Digital Identity Management'})}
              description={[
                translate({id: 'useCases.digitalIdentity.description1', message: "Identity systems today are often centralized, making them vulnerable to breaches and fraud. Individuals have limited control over their personal data, and verification processes can be slow and expensive."}),

                translate({id: 'useCases.digitalIdentity.description2', message: "Cardano's blockchain allows individuals to own and control their digital identities. With tamper-proof and easily verifiable credentials on the blockchain, this solution reduces fraud, ensures privacy, and streamlines verification processes for governments and businesses alike."}),

              ]}
              headingDot={false}
            />
            <TitleWithText
              title={translate({id: 'useCases.identityFinance.title', message: 'Finance'})}
              description={[
                translate({id: 'useCases.identityFinance.description', message: "Identity verification is a critical step in onboarding new clients for financial institutions and agencies. However, the process is often slow, resource-intensive, and reliant on multiple third parties."}),

              ]}
              headingDot={false}
            />

            <TitleWithText
              title={translate({id: 'useCases.government.title', message: 'Government'})}
              description={[
                translate({id: 'useCases.government.description1', message: "Current systems for issuing and verifying credentials are inefficient and centralized. Control over important documents often remains with the issuing authority rather than the individual, creating a reliance on third-party agencies for verification."}),

                translate({id: 'useCases.government.description2', message: "Cardano's blockchain technology offers a decentralized solution to this problem. By enabling secure, tamper-proof digital credentials, individuals can take full control of their documents. These credentials can be shared and verified instantly, eliminating delays and reducing administrative costs while improving accessibility and trust."}),

              ]}
              headingDot={false}
            />

            <Divider text={translate({id: 'useCases.divider.finance', message: 'Finance'})} id="finance" />
            <TitleWithText
              title={translate({id: 'useCases.defi.title', message: 'Decentralized Finance (DeFi)'})}
              description={[
                translate({id: 'useCases.defi.description1', message: "Access to financial services remains limited for millions worldwide. Centralized institutions control financial systems, leading to inefficiencies, high fees, and restricted inclusivity."}),

                translate({id: 'useCases.defi.description2', message: "Cardano's DeFi ecosystem offers decentralized lending platforms, stablecoins, and decentralized exchanges. By leveraging smart contracts, Cardano provides secure, scalable, and inclusive financial services for users across the globe."}),

                translate({id: 'useCases.defi.description3', message: "[Explore DeFi on Cardano in the showcase.](/apps/?operator=OR&tags=lending&tags=dex)"})
              ]}
              headingDot={true}
            />
            <TitleWithText
              title={translate({id: 'useCases.payments.title', message: 'Payment Methods'})}
              description={[
                translate({id: 'useCases.payments.description1', message: "International payments often face high fees, long processing times, and dependency on intermediaries. These barriers make cross-border transactions inefficient and costly."}),

                translate({id: 'useCases.payments.description2', message: "Cardano enables fast, low-cost, and secure payments using its native token, ada. By eliminating intermediaries, Cardano reduces transaction fees and settlement times, making it ideal for remittances and peer-to-peer transfers."}),

                translate({id: 'useCases.payments.description3', message: "[Browse wallets, gateways and bridges in the showcase.](https://developers.cardano.org/showcase/?operator=OR&tags=gateway&tags=wallet&tags=bridge)"})
              ]}
              headingDot={false}
            />

            <Divider text={translate({id: 'useCases.divider.supplyChain', message: 'Supply Chain'})} id="supply-chain" />
            <TitleWithText
              title={translate({id: 'useCases.agriculture.title', message: 'Agriculture'})}
              description={[
                translate({id: 'useCases.agriculture.description1', message: "The pandemic has highlighted the critical importance of maintaining resilient and transparent supply chains, especially in agriculture. As a primary source of food and sustenance, agriculture's supply chain must remain operational to support livelihoods and ensure the well-being of populations worldwide."}),

                translate({id: 'useCases.agriculture.description2', message: "Cardano's blockchain provides a robust solution for improving transparency and efficiency in agricultural supply chains. By enabling product certification and traceability from farm to table, blockchain ensures that stakeholders—including farmers, transporters, and retailers—can track the journey of goods securely and immutably. This builds trust, enhances sustainability, and ensures accountability at every stage of the process."}),
              ]}
              headingDot={true}
            />
            <TitleWithText
              title={translate({id: 'useCases.retail.title', message: 'Retail'})}
              description={[
                translate({id: 'useCases.retail.description1', message: "[Counterfeit goods pose a significant challenge to the global economy](https://www.visualcapitalist.com/300-billion-counterfeit-goods-problem/), causing financial losses, eroding brand reputation, and reducing customer trust."}),

                translate({id: 'useCases.retail.description2', message: "Cardano's blockchain offers a tamper-proof solution to combat counterfeiting by providing secure, immutable systems for tracking product provenance and ensuring authenticity. Businesses can certify the originality of their products, enabling consumers to verify authenticity instantly and building confidence in the supply chain."}),
              ]}
              headingDot={false}
            />
            <TitleWithText
              title={translate({id: 'useCases.supplyChainManagement.title', message: 'Supply Chain Management'})}
              description={[
                translate({id: 'useCases.supplyChainManagement.description1', message: "Supply chains often lack transparency and efficiency, leading to counterfeit goods, poor quality control, and increased costs."}),

                translate({id: 'useCases.supplyChainManagement.description2', message: "Cardano's blockchain enables real-time tracking and verification of goods. Companies can record every step of a product's journey, from origin to destination, ensuring authenticity and improving logistical processes."}),
              ]}
              headingDot={false}
            />

            <Divider text={translate({id: 'useCases.divider.socialImpact', message: 'Social Impact'})} id="social-impact" />
            <TitleWithText
              title={translate({id: 'useCases.socialPrograms.title', message: 'Social Programs'})}
              description={[
                translate({id: 'useCases.socialPrograms.description1', message: "Social and public programs often suffer from inefficiencies, fraud, and lack of transparency. Donors and beneficiaries lack visibility into how funds are allocated and spent."}),

                translate({id: 'useCases.socialPrograms.description2', message: "Cardano's blockchain can track donations and fund distributions immutably, ensuring accountability. It also facilitates microfinance solutions for unbanked populations, empowering them with access to financial tools."}),
              ]}
              headingDot={true}
            />

            <Divider text={translate({id: 'useCases.divider.dataTechnology', message: 'Data and Technology'})} id="data-technology" />
            <TitleWithText
              title={translate({id: 'useCases.dataStorage.title', message: 'Data Storage'})}
              description={[
                translate({id: 'useCases.dataStorage.description1', message: "Centralized data storage solutions, like server farms, are prone to failures, breaches, and inefficiencies. Storing vast amounts of data in a few physical locations creates vulnerabilities and increases costs."}),

                translate({id: 'useCases.dataStorage.description2', message: "Cardano's blockchain enables decentralized data storage, distributing information across a global network. This approach enhances security, reduces costs, and ensures efficient access and sharing of encrypted data."}),
              ]}
              headingDot={true}
            />
            <TitleWithText
              title={translate({id: 'useCases.tokenizedAssets.title', message: 'Tokenized Assets'})}
              description={[
                translate({id: 'useCases.tokenizedAssets.description1', message: "Investing in traditional assets often requires intermediaries and incurs high fees. Transparency and liquidity are also limited, restricting broader participation."}),

                translate({id: 'useCases.tokenizedAssets.description2', message: "Cardano supports the tokenization of assets like real estate, art, and financial instruments. Blockchain-based tokens allow for fractional ownership, enhanced transparency, and secure transactions."}),
              ]}
              headingDot={false}
            />

            <Divider text={translate({id: 'useCases.divider.diverseOpportunities', message: 'Diverse Opportunities'})} id="diverse" />
            <TitleWithText
              title={translate({id: 'useCases.votingSystems.title', message: 'Voting Systems'})}
              description={[
                translate({id: 'useCases.votingSystems.description1', message: "Election systems often face issues such as fraud, manipulation, and lack of transparency. Traditional voting methods are costly to implement and challenging to audit."}),

                translate({id: 'useCases.votingSystems.description2', message: "Cardano's blockchain can facilitate a secure, tamper-proof voting system. Each vote is recorded immutably, ensuring transparency and eliminating the risk of manipulation."}),
              ]}
              headingDot={true}
            />
            <TitleWithText
              title={translate({id: 'useCases.healthCare.title', message: 'Health Care'})}
              description={[
                translate({id: 'useCases.healthCare.description1', message: "The healthcare industry faces significant challenges in managing patient data securely and efficiently. Patient records are often siloed in centralized systems, leading to delays and inefficiencies. Sharing medical data across institutions and regions is cumbersome, increasing risks to patient care."}),

                translate({id: 'useCases.healthCare.description2', message: "Cardano's blockchain can create a secure, decentralized network for health records. This allows medical professionals to access patient data instantly, no matter where they are. Wearable devices can also integrate with the blockchain, enabling real-time health monitoring and proactive medical interventions."}),
              ]}
              headingDot={false}
            />
            <TitleWithText
              title={translate({id: 'useCases.musicIndustry.title', message: 'Music Industry'})}
              description={[
                translate({id: 'useCases.musicIndustry.description1', message: "Artists and content creators often face challenges in tracking royalties, managing copyright, and ensuring fair revenue distribution. The current systems are opaque and prone to disputes, leaving artists with little transparency or control."}),

                translate({id: 'useCases.musicIndustry.description2', message: "Cardano can transform the music industry by enabling direct, transparent payments to artists through smart contracts. Additionally, a blockchain-based system can manage copyright records, ensuring accurate and immutable tracking of intellectual property."}),
              ]}
              headingDot={false}
            />
            <p style={{ textAlign: "center", marginBottom: "2rem" }}>
              <Link
                to="/solutions"
                className="button button--primary button--lg"
              >
                View Enterprise Solutions
              </Link>
            </p>
          </BoundaryBox>
        </BackgroundWrapper>
        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
