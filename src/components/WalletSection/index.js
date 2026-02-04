import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
import WalletLink from "@site/src/components/WalletLink";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import {translate} from '@docusaurus/Translate';

// Wallets ranked based on (but not exclusively) https://cardano-community.github.io/support-faq/Wallets/list/
// Please only send pull requests for wallets that are listed on https://cardano.org/apps?tags=wallet. If in doubt, check the official Cardano apps page for wallet listings.
function getWalletItemList() {
  return [
    {
      title: translate({id: 'walletSection.typhon.title', message: 'Typhon Wallet'}),
      imageName: "typhon-ada",
      text: translate({id: 'walletSection.typhon.text', message: 'Blazing fast, feature-rich, secure, beautiful web and extension Cardano wallet. Delegate to multiple pools of your choice with multi-accounts.'}),
      subtext: translate({id: 'walletSection.typhon.subtext', message: 'Browser extension for Chrome, Brave and Edge'}),
      label: translate({id: 'walletSection.typhon.label', message: 'Get Typhon'}),
      link: "https://typhonwallet.io",
    },
    {
      title: translate({id: 'walletSection.vespr.title', message: 'VESPR Wallet'}),
      imageName: "vespr-ada",
      text: translate({id: 'walletSection.vespr.text', message: 'VESPR is a non-custodial mobile light wallet for the Cardano network, prioritizing the security and safety of your digital assets while ensuring exceptional ease-of-use.'}),
      subtext: translate({id: 'walletSection.vespr.subtext', message: 'App for iOS and Android'}),
      label: translate({id: 'walletSection.vespr.label', message: 'Get VESPR'}),
      link: "https://vespr.xyz",
    },
    {
      title: translate({id: 'walletSection.yoroi.title', message: 'Yoroi Wallet'}),
      imageName: "yoroi-ada",
      text: translate({id: 'walletSection.yoroi.text', message: 'A user-friendly, [open-source](https://github.com/Emurgo/yoroi-frontend) Cardano wallet with a browser-based interface, providing a convenient way to manage ada holdings securely. Yoroi is also available as mobile app.'}),
      subtext: translate({id: 'walletSection.yoroi.subtext', message: 'Browser extension and app for iOS and Android'}),
      label: translate({id: 'walletSection.yoroi.label', message: 'Get Yoroi'}),
      link: "https://yoroiwallet.com/",
    },
    {
      title: translate({id: 'walletSection.eternl.title', message: 'Eternl Wallet'}),
      imageName: "eternl-ada",
      text: translate({id: 'walletSection.eternl.text', message: 'The alternative Cardano light wallet in the browser. Aims to add features most requested by the Cardano community. Eternl is also available as mobile app.'}),
      subtext: translate({id: 'walletSection.eternl.subtext', message: 'Browser extension and app for iOS and Android'}),
      label: translate({id: 'walletSection.eternl.label', message: 'Get Eternl'}),
      link: "https://eternl.io",
    },
    {
      title: translate({id: 'walletSection.lace.title', message: 'Lace Wallet'}),
      imageName: "lace-ada",
      text: translate({id: 'walletSection.lace.text', message: 'An [open-source](https://github.com/input-output-hk/lace) light wallet platform from IOG, one of the creators of Cardano. Manually verified by an independent auditor, Lace lets you quickly, easily, and securely manage your digital assets and enjoy Web3.'}),
      subtext: translate({id: 'walletSection.lace.subtext', message: 'Browser extension for Chrome, Brave'}),
      label: translate({id: 'walletSection.lace.label', message: 'Get Lace'}),
      link: "https://www.lace.io",
    },
    {
      title: translate({id: 'walletSection.daedalus.title', message: 'Daedalus Wallet'}),
      imageName: "daedalus-ada",
      text: translate({id: 'walletSection.daedalus.text', message: 'The [open-source](https://github.com/input-output-hk/daedalus) full node wallet for Cardano. It offers enhanced control and security by maintaining a complete copy of the blockchain, but this comes at the cost of a more complex user experience. As a result, they are typically geared towards professional users who require these advanced features.'}),
      subtext: translate({id: 'walletSection.daedalus.subtext', message: 'Only for powerful desktop PCs'}),
      label: translate({id: 'walletSection.daedalus.label', message: 'Get Daedalus'}),
      link: "https://daedaluswallet.io",
    },
    {
      title: translate({id: 'walletSection.explore.title', message: 'Explore Apps'}),
      text: translate({id: 'walletSection.explore.text', message: 'Discover a wide variety of wallets designed to facilitate your interaction.'}),
      subtext: "",
      label: translate({id: 'walletSection.explore.label', message: 'More Wallets'}),
      link: "/apps?tags=wallet",
    },
  ];
}

function WalletItem({ title, imageName, text, subtext, label, link }) {
  return (
    <WalletLink
      title={title}
      imageName={imageName}
      text={text}
      subtext={subtext}
      label={label}
      link={link}
    />
  );
}

export default function WalletSection() {
  const walletItems = getWalletItemList();

  return (
    <section className={styles.partnerSection}>
      <Divider text={translate({id: 'walletSection.divider', message: 'Cardano Wallets'})} id="wallets" />
      <div className={styles.walletWrap}>
        <div className={styles.walletItems}>
          {walletItems.map((props, idx) => (
            <div className={styles.walletItem} key={idx}>
              {" "}
              {/* Wrapper div with class */}
              <WalletItem key={idx} {...props} />
            </div>
          ))}
        </div>
      </div>
      <TitleWithText

        titleType="black"
        headingDot={false}
        slightText={[translate({id: 'walletSection.disclaimer', message: 'The example applications are provided for informational purposes only and not endorsed or approved. Their use is strictly at your own risk. The descriptions have been provided by the respective project teams.'})]}
      />
      <SpacerBox size="large" />
      <TitleWithText
        title={translate({id: 'walletSection.storageTitle', message: 'How Do I Store My Ada And Keep It Safe?'})}
        description={[
          translate({id: 'walletSection.storageDescription1', message: 'A cryptocurrency wallet is a software program designed to store your public and private keys, send and receive digital currencies, monitor your balance, and interact with supported blockchains.'}),
          translate({id: 'walletSection.storageDescription2', message: 'In addition to the variation of wallets available, there are also two types of wallets: a hot wallet and a cold wallet.'}),
        ]}
        titleType="black"
        headingDot={true}
      />

        <DottedImageWithText
          imageName="wallet-hot"
          text={translate({id: 'walletSection.hotWalletText', message: 'A hot wallet is connected to the internet and can be accessed at any time with the requisite keys. Examples of hot wallets include mobile and software wallets, and funds stored on exchanges.'})}
        />
        <DottedImageWithText
          imageName="wallet-cold"
          text={translate({id: 'walletSection.coldWalletText', message: 'A cold wallet is an offline wallet. It is not connected to the internet and is used for securing storing funds that do not have to be frequently accessed. Examples include hardware wallets - which is a secure hardware device that stores the wallet\'s private keys - and paper wallets. Cardano is supported by both Trezor and Ledger hardware wallets.'})}
        />

    </section>
  );
}
