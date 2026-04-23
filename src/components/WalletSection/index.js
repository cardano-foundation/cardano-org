import clsx from "clsx";
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import Link from "@docusaurus/Link";
import {translate} from '@docusaurus/Translate';

export default function WalletSection() {
  return (
    <section className={styles.partnerSection}>
      <Divider text={translate({id: 'walletSection.divider', message: 'Cardano Wallets'})} id="wallets" />
      <TitleWithText
        title={translate({id: 'walletSection.cta.title', message: 'Find the Right Wallet for You'})}
        description={[
          translate({id: 'walletSection.cta.description', message: 'A wallet lets you store, send, and receive ada. There are many options for different platforms and needs. Use our Wallet Finder to compare features and pick the one that fits you best.'}),
        ]}
        titleType="black"
        headingDot={true}
      />
      <div className={styles.ctaContainer}>
        <Link className={clsx("button button--primary button--lg")} to="/wallets">
          {translate({id: 'walletSection.cta.button', message: 'Find a Wallet'})}
        </Link>
      </div>
    </section>
  );
}
