import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
import WalletLink from "@site/src/components/WalletLink";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";

// Wallets ranked based on (but not exclusively) https://cardano-community.github.io/support-faq/Wallets/list/
// Don't send pull requests for wallets that are not listed for at least 6 months on https://developers.cardano.org/showcase?tags=wallet
const WalletItemList = [
  {
    title: "Typhon Wallet",
    imageName: "typhon-ada",
    text: "Blazing fast, feature-rich, secure, beautiful web and extension Cardano wallet. Delegate to multiple pools of your choice with multi-accounts.",
    subtext: "Browser extension for Chrome, Brave and Edge",
    label: "Get Typhon",
    link: "https://typhonwallet.io",
  },
  {
    title: "VESPR Wallet",
    imageName: "vespr-ada",
    text: "VESPR is a non-custodial mobile light wallet for the Cardano network, prioritizing the security and safety of your digital assets while ensuring exceptional ease-of-use.",
    subtext: "App for iOS and Android",
    label: "Get VESPR",
    link: "https://vespr.xyz",
  },
  {
    title: "Yoroi Wallet",
    imageName: "yoroi-ada",
    text: "A user-friendly, [open-source](https://github.com/Emurgo/yoroi-frontend) Cardano wallet with a browser-based interface, providing a convenient way to manage ada holdings securely. Yoroi is also available as mobile app.",
    subtext: "Browser extension and app for iOS and Android",
    label: "Get Yoroi",
    link: "https://yoroiwallet.com/",
  },
  {
    title: "Eternl Wallet",
    imageName: "eternl-ada",
    text: "The alternative Cardano light wallet in the browser. Aims to add features most requested by the Cardano community. Eternl is also available as mobile app.",
    subtext: "Browser extension and app for iOS and Android",
    label: "Get Eternl",
    link: "https://eternl.io",
  },
  {
    title: "Lace Wallet",
    imageName: "lace-ada",
    text: "An [open-source](https://github.com/input-output-hk/lace) light wallet platform from IOG, one of the creators of Cardano. Manually verified by an independent auditor, Lace lets you quickly, easily, and securely manage your digital assets and enjoy Web3.",
    subtext: "Browser extension for Chrome, Brave",
    label: "Get Lace",
    link: "https://www.lace.io",
  },
  {
    title: "Daedalus Wallet",
    imageName: "daedalus-ada",
    text: "The [open-source](https://github.com/input-output-hk/daedalus) full node wallet for Cardano. It offers enhanced control and security by maintaining a complete copy of the blockchain, but this comes at the cost of a more complex user experience. As a result, they are typically geared towards professional users who require these advanced features.",
    subtext: "Only for powerful desktop PCs",
    label: "Get Daedalus",
    link: "https://daedaluswallet.io",
  },
];

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
  return (
    <section className={styles.partnerSection}>
      <Divider text="Cardano Wallets" id="wallets" />
      <div className={styles.walletWrap}>
        <div className={styles.walletItems}>
          {WalletItemList.map((props, idx) => (
            <div className={styles.walletItem} key={idx}>
              {" "}
              {/* Wrapper div with class */}
              <WalletItem key={idx} {...props} />
            </div>
          ))}
        </div>
      </div>
      <TitleWithText
        title="More Wallets"
        description={["Discover a wide variety of wallets designed to facilitate your interaction with Cardano ecosystem in the \
        [Wallet Showcase](/apps?tags=wallet)."]}
        titleType="black"
        headingDot={false}
        slightText={["The example applications are provided for informational purposes only and not endorsed or approved. \
        Their use is strictly at your own risk. The descriptions have been provided by the respective project teams."]}
      />
      <SpacerBox size="large" />
      <TitleWithText
        title="How Do I Store My Ada And Keep It Safe?"
        description={[
          "A cryptocurrency wallet is a software program designed to store your public and private keys, send and receive digital currencies, \
          monitor your balance, and interact with supported blockchains.",

          "In addition to the variation of wallets available, there are also two types of wallets: a hot wallet and a cold wallet.",
        ]}
        titleType="black"
        headingDot={true}
      />

        <DottedImageWithText
          imageName="wallet-hot"
          text="A hot wallet is connected to the internet and can be accessed at any time with the requisite keys. Examples of hot wallets include mobile and software wallets, and funds stored on exchanges."
        />
        <DottedImageWithText
          imageName="wallet-cold"
          text="A cold wallet is an offline wallet. It is not connected to the internet and is used for securing storing funds that do not have to be frequently accessed. Examples include hardware wallets - which is a secure hardware device that stores the wallet’s private keys - and paper wallets. Cardano is supported by both Trezor and Ledger hardware wallets."
        />

    </section>
  );
}
