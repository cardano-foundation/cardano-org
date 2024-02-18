import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Divider from '@site/src/components/Divider';
import WalletLink from '@site/src/components/WalletLink'; 
import TitleBox from '../TitleBox';

// Wallets ranked based on (but not exclusively) https://cardano-community.github.io/support-faq/Wallets/list/
// Don't send pull requests for wallets that are not listed for a longer time on https://developers.cardano.org/showcase?tags=wallet
const WalletItemList = [
  {
    title: 'Typhon Wallet',
    imageName: 'typhon-ada',
    text: 'Blazing fast, feature-rich, secure, beautiful web and extension Cardano wallet. Delegate to multiple pools of your choice with multi-accounts.',
    subtext: 'Browser extension for Chrome, Brave and Edge',
    label: 'Get Typhon',
    link: 'https://typhonwallet.io'
  },
  {
    title: 'Flint Wallet',
    imageName: 'flint-ada',
    text: 'Flint’s lightweight and user-friendly design lets you manage your crypto assets and access the world of DeFi with ease.',
    subtext: 'Browser extension and app for iOS and Android',
    label: 'Get Flint',
    link: 'https://flint-wallet.com'
  },
  {
    title: 'Yoroi Wallet',
    imageName: 'yoroi-ada',
    text: 'A user-friendly, [open-source](https://github.com/Emurgo/yoroi-frontend) Cardano wallet with a browser-based interface, providing a convenient way to manage ada holdings securely. Yoroi is also available as mobile app.',
    subtext: 'Browser extension and app for iOS and Android',
    label: 'Get Yoroi',
    link: 'https://yoroi-wallet.com/'
  },
  {
    title: 'Eternl Wallet',
    imageName: 'eternl-ada',
    text: 'The alternative Cardano light wallet in the browser. Aims to add features most requested by the Cardano community. Eternl is also available as mobile app.',
    subtext: 'Browser extension and app for iOS and Android',
    label: 'Get Eternl',
    link: 'https://eternl.io'
  },
];

function WalletItem({title, imageName, text, subtext, label, link}) {
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
    <section className={styles.partnerSection} id="wallets">
      <Divider headline='Cardano Wallets' />
      <div className={styles.walletWrap}>
        <div className={styles.walletItems}>
          
        {WalletItemList.map((props, idx) => (
            <div className={styles.walletItem} key={idx}> {/* Wrapper div with class */}
              <WalletItem key={idx} {...props} />
            </div>
            ))}
        </div>
      </div> 
      <TitleBox
        description='Discover a wide variety of wallets designed to facilitate your interaction with Cardano ecosystem in the [Wallet Showcase](https://developers.cardano.org/showcase?tags=wallet).'
        titleType='none'
      />
    </section>
  );
}
