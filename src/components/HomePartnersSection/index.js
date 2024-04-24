import clsx from "clsx";
import Heading from "@theme/Heading";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";

// shows a partner (svg) logo and a link below
function LogoWithLink({ imageName, label, link }) {
  return (
    <div className={styles.logoContainer}>
      <div className={styles.imageWrap}>
        <ThemedImage
          alt={label}
          sources={{
            light: useBaseUrl(`/img/logos/${imageName}.svg`),
            dark: useBaseUrl(`/img/logos/${imageName}-dark.svg`),
          }}
        />
      </div>
      <div className={styles.linkWrap}>
        <Link to={link} className={styles.link}>
          {label}
        </Link>
      </div>
    </div>
  );
}

// the actual list of partners
const PartnerItemList = [
  {
    imageName: "cardanofoundation",
    label: "About the Cardano Foundation",
    link: "/partners?tab=cardanofoundation",
  },
  {
    imageName: "emurgo",
    label: "About EMURGO",
    link: "/partners?tab=emurgo",
  },
  {
    imageName: "iog",
    label: "About Input Output",
    link: "/partners?tab=iog",
  },
  {
    imageName: "intersect",
    label: "About Intersect",
    link: "/partners?tab=intersect",
  },
  {
    imageName: "pragma",
    label: "About PRAGMA",
    link: "/partners?tab=pragma",
  },
  
];

function PartnerItem({ imageName, label, link }) {
  return <LogoWithLink imageName={imageName} label={label} link={link} />;
}

// FIXME: text feels outdated, today there are way more entitites, we should aim to increase this soon
export default function HomePartnersSection() {
  return (
    <section className={styles.partnerSection}>
      <Divider text="Entities" />
      <TitleWithText
        description="Multiple independent entities collaborate within a decentralized team framework to drive Cardano forward, ensuring that it remains aligned with its core mission as it progresses and develops. These are a few of them:"
        titleType="none"
        headingDot={false}
      />
      <div className={styles.discoverWrap}>
        <div className={styles.discoverItems}>
          {PartnerItemList.map((props, idx) => (
            <PartnerItem key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
