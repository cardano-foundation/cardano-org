import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";

// shows a dotted image on the left, below solution and product
// shows a header with some description on the right
// can be inverted with isImageRight:true
// please note that products expects an array even if there is only one product, because we want to
// link to products soon and use the learn more button to dive deeper into content.

function UseCase({
  title,
  description,
  solutions,
  product,
  buttonLink,
  imageName,
  isImageRight,
}) {
  // Construct the image URL using the imageName prop, we may want to handle image load errors in the future
  const imageUrl = useBaseUrl(`/img/dotted-icons/${imageName}.svg`);

  // Swap columns based on isImageRight flag
  const imageColumnClass = clsx("col col--4", styles.imageSection, {
    [styles.imageRight]: isImageRight,
  });
  const textColumnClass = clsx("col col--8", styles.textSection, {
    [styles.textRight]: isImageRight,
  });

  return (
    <div className={clsx("row", styles.enterpriseWrap)}>
      <div className={imageColumnClass}>
        <img src={imageUrl} alt={title} />
        <div className={styles.solutions}>Solutions</div>
        <div className={styles.solutionsContent}>{solutions}</div>
        <div className={styles.product}>Products</div>
        <div className={styles.productContent}>
          {Array.isArray(product) ? (
            <ul>
              {product.map((item, index) => (
                <li key={index}>{parseMarkdownLikeText(item)}</li>
              ))}
            </ul>
          ) : (
            parseMarkdownLikeText(product)
          )}
        </div>
      </div>
      <div className={textColumnClass}>
        <h2 className={styles.title}>{title}</h2>
        {Array.isArray(description) ? (
          description.map((paragraph, index) => (
            <p key={index} className={styles.description}>
              {parseMarkdownLikeText(paragraph)}
            </p>
          ))
        ) : (
          <p className={styles.description}>
            {parseMarkdownLikeText(description)}
          </p>
        )}
        <Link
          href={buttonLink}
          className={clsx("button button--primary", styles.buttonLink)}
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}

UseCase.defaultProps = {
  isImageRight: false, // Default layout will have the image on the left
};

export default function EnterpriseSection({}) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <div>
      <div id="education" />
      <UseCase
        title="Education"
        description={[
          "The issuance of academic certifications is heavily centralized. If diplomas, degrees, \
        or other credentials are damaged or lost, the re-issue process is often costly, and the \
        issuing institution might no longer exist. Sharing these credentials is also difficult, \
        as academic achievements are traditionally issued in physical form, which makes it almost\
        impossible to share when and where needed.",

          "Atala PRISM is an ID & credentials solution built on the Cardano blockchain. Atala PRISM \
        secures academic certifications within an immutable and tamper-proof ecosystem, empowering \
        students to own and share their achievements, and institutions to instantly verify those \
        credentials. Atala PRISM simplifies this process by enabling individuals to instantly share \
        verifiable credentials.",

          "Atala PRISM gives students ownership and control of their academic achievements, with no \
        third-party intermediaries, while removing friction and costly inefficiencies from the process. \
        The result? A seamless way for students and job seekers to prove who they are and what they have \
        achieved.",
        ]}
        solutions="Credential verification"
        product={["Atala SCAN (IOG)"]}
        buttonLink="https://atalaprism.io"
        imageName="education"
        isImageRight={false}
      />

      <div id="retail" />
      <UseCase
        title="Retail"
        description={[
          "In 2018, [counterfeit goods inflicted a (US$)300bn blow to the global economy](https://www.visualcapitalist.com/300-billion-counterfeit-goods-problem/) and the problem \
        is getting worse. If the trend is not reversed, markets will become flooded with fake products, \
        leading to substantial financial losses, damage to brand reputation, and marked reduction in \
        customer confidence.",

          "Anti-counterfeiting initiatives often involve lengthy and costly processes with little discernible \
        effect on the ongoing trade of counterfeit goods. Most fakes are sold online, which means that \
        these rogue traders operate in relative impunity.",

          "Atala SCAN leverages blockchain technology to offer the solution to this problem: A tamper-proof \
        system to establish product provenance and auditability to ensure every product sold is certified \
        original.",
        ]}
        solutions="Product counterfeiting"
        product={["Atala SCAN (IOG)"]}
        buttonLink="https://atalaprism.io"
        imageName="retail"
        isImageRight={true}
      />

      <div id="agriculture" />
      <UseCase
        title="Agriculture"
        description={[
          "The pandemic has starkly shown that maintaining a solid and constant supply chain is a key pillar \
        for the success and sustainability of any industry sector, and indeed for the safety and well-being \
        of the population.",

          "Agriculture is a source of food and sustenance whose supply chain must be kept going at all times, \
        as livelihoods depend on it. Blockchain technology has emerged as a viable method to support all the \
        stakeholders along the supply chain: Farmers, hauliers, and retailers can use blockchain for product \
        certification and traceability, from farm to table, using systems like Atala Trace and EMURGO's \
        proprietary traceability solution for transparency in the supply chain.",
        ]}
        solutions="Supply chain tracking"
        product={[
          "Atala TRACE (IOG)",
          "[EMURGO Solution](https://emurgo.io/industry-cases#supply-chain-and-traceability)",
        ]}
        buttonLink="https://atalaprism.io"
        imageName="agriculture"
        isImageRight={false}
      />

      <div id="government" />
      <UseCase
        title="Government"
        description={[
          "Current credentials issuance and verification systems are inherently flawed. Document and control \
        remains with the issuer, rather than the individual, for example, which creates a strong dependency \
        on third-party agencies to verify the document’s authenticity. This usually involves a manual, costly, \
        and time-consuming process, depending on the location and response time of the issuing authority.",

          "Atala PRISM addresses this flaw through the provision of a digital identity service. Leveraging blockchain \
        technology, Atala PRISM enables users to have full control of their credentials, which they can share \
        and instantly verify anytime, anywhere.",
        ]}
        solutions="Digital identity"
        product={["Atala PRISM (IOG)"]}
        buttonLink="https://iohk.io/en/enterprise/#digital-identity"
        imageName="government"
        isImageRight={true}
      />

      <div id="finance" />
      <UseCase
        title="Finance"
        description={[
          "Identity verification is a key step before accepting new clients into financial institutions or other \
        agencies. Simply opening a new bank account in certain countries takes weeks, for example. Other \
        administrative processes -passport applications, for instance-, even longer. The onboarding process \
        is slow and resource-heavy, often involving multiple third-parties with their own fees, etc.",

          "Atala PRISM can streamline and accelerate onboarding through the utilization of reusable verified \
        credentials. Atala PRISM leverages blockchain technology to deliver a one-click user experience.",
        ]}
        solutions="Onboarding (KYC & AML)"
        product={["Atala PRISM (IOG)"]}
        buttonLink="https://iohk.io/en/enterprise/#consultancy"
        imageName="finance"
        isImageRight={false}
      />

      <div id="healthcare" />
      <UseCase
        title="Health Care"
        description={[
          "Counterfeit and substandard medications pose a significant risk to public health and inflict severe financial \
        loss to legitimate manufacturers. Cost, peer pressure, and other reasons push many people to acquire \
        medications in online pharmacies, which in many cases lack strict controls and regulations surrounding \
        the manufacture and supply of therapeutic drugs. The World Health Organization (WHO) estimates that more \
        than 50% of medications sold online can be categorized as fake or substandard.",

          "This problem can be addressed through a blockchain solution. Atala SCAN can authenticate and verify the origin \
        and supply chain of pharmaceutical products, guaranteeing the safety and well-being of patients worldwide.",
        ]}
        solutions="Counterfeit medicine"
        product={[
          "Atala SCAN (IOG)",
          "[EMURGO Solution](https://emurgo.io/industry-cases#healthcare-and-life-science)",
        ]}
        buttonLink="https://iohk.io/en/enterprise/#consultancy"
        imageName="healthcare"
        isImageRight={true}
      />
    </div>
  );
}
