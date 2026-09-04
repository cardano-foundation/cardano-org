import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { translate } from '@docusaurus/Translate';
import SiteHero from '@site/src/components/Layout/SiteHero';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import SpacerBox from '@site/src/components/Layout/SpacerBox';
import useLocalStorage from '@site/src/utils/useLocalStorage';
import { LOCAL_KEY, LEGACY_STEP_KEY, emptyLocal, isValidLocal } from '@site/src/utils/getStarted/storage.mjs';
import { computeStations, firstOpenIndex } from '@site/src/utils/getStarted/stations.mjs';
import { STATION_QUESTIONS } from '@site/src/utils/getStarted/questions.mjs';
import { UNKNOWN } from '@site/src/utils/getStarted/status.mjs';
import { formatAda } from '@site/src/utils/cardano/lovelace.mjs';
import useAccountStatus from '@site/src/components/GetStarted/useAccountStatus';
import Station, { scrollToAnchor } from '@site/src/components/GetStarted/Station';
import ProgressRail from '@site/src/components/GetStarted/ProgressRail';
import LiveTip from '@site/src/components/GetStarted/LiveTip';
import ConnectStation from '@site/src/components/GetStarted/ConnectStation';
import WalletPicker from '@site/src/components/GetStarted/WalletPicker';
import PhraseSimulator from '@site/src/components/GetStarted/PhraseSimulator';
import CheckQuestion from '@site/src/components/GetStarted/CheckQuestion';
import Completion, { poolSentence, voteSentence } from '@site/src/components/GetStarted/Completion';
import gs from '@site/src/components/GetStarted/styles.module.css';
import styles from './get-started.module.css';

const ANCHORS = { wallet: 'wallet', phrase: 'phrase', connect: 'connect', ada: 'ada', delegate: 'delegate' };

function stationState(done) {
  if (done === true) return 'done';
  if (done === UNKNOWN) return 'unknown';
  return 'open';
}

function Questions({ station }) {
  return STATION_QUESTIONS[station].map((q) => <CheckQuestion key={q.id} quiz={q.quiz} id={q.id} />);
}

function WhyBlock({ image, alt, children }) {
  const src = useBaseUrl(`/img/dotted-icons/${image}.svg`);
  return (
    <>
      <img src={src} alt={alt} className={gs.whyImage} loading="lazy" />
      <div>{children}</div>
    </>
  );
}

export default function GetStarted() {
  const { siteConfig: { customFields }, i18n: { currentLocale } } = useDocusaurusContext();
  const chain = useAccountStatus();
  const [local, setLocal] = useLocalStorage(LOCAL_KEY, emptyLocal(), isValidLocal);

  // The retired wizard stored its step under this key.
  useEffect(() => {
    try { localStorage.removeItem(LEGACY_STEP_KEY); } catch (e) { /* storage unavailable */ }
  }, []);

  const labels = {
    wallet: translate({ id: 'getStarted.station.wallet.title', message: 'Your wallet' }),
    phrase: translate({ id: 'getStarted.station.phrase.title', message: 'Your recovery phrase' }),
    connect: translate({ id: 'getStarted.station.connect.title', message: 'You, on the chain' }),
    ada: translate({ id: 'getStarted.station.ada.title', message: 'Your first ada' }),
    delegate: translate({ id: 'getStarted.station.delegate.title', message: 'Stake and vote' }),
  };
  const stations = computeStations({ local, account: chain.account, status: chain.status })
    .map((s) => ({ ...s, anchor: ANCHORS[s.key], label: labels[s.key] }));
  const openIndex = firstOpenIndex(stations);
  const state = (key) => stationState(stations.find((s) => s.key === key).done);
  const confirmed = chain.account?.ownership === 'wallet-confirmed';

  return (
    <Layout
      title={translate({ id: 'getStarted.meta.title', message: 'Get Started with Cardano, Your First Steps' })}
      description={translate({ id: 'getStarted.meta.description', message: 'Set up a Cardano wallet, back up your recovery phrase, get your first ada and delegate your stake and vote. Five guided steps, with your wallet activity confirmed on the chain.' })}
    >
      <OpenGraphInfo pageName="get-started" />
      <SiteHero
        title={translate({ id: 'getStarted.hero.title', message: 'Get started with Cardano' })}
        description={translate({ id: 'getStarted.hero.description', message: 'Set up a wallet, get your first ada and put it to work. About 20 minutes to set up, plus transfer time. Your wallet activity is confirmed on the chain.' })}
        bannerType="fluidBlue"
      >
        <LiveTip apiUrl={customFields.CARDANO_ORG_API_URL} locale={currentLocale} />
        {openIndex !== null && openIndex > 0 && (
          <p className={styles.continueLink}>
            <a href={`#${stations[openIndex].anchor}`} onClick={(e) => { e.preventDefault(); scrollToAnchor(stations[openIndex].anchor); }}>
              {translate({ id: 'getStarted.hero.continue', message: 'Continue at step {number}' }, { number: openIndex + 1 })}
            </a>
          </p>
        )}
      </SiteHero>
      <main>
        <ProgressRail
          stations={stations}
          account={chain.account}
          status={chain.status}
          names={chain.names}
          checking={chain.checking}
          error={chain.error}
          lastChecked={chain.lastChecked}
          onRefresh={chain.refresh}
          onForget={chain.forget}
          nextIndex={openIndex}
          locale={currentLocale}
        />
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <SpacerBox size="small" />
            <div className={styles.journey}>

            <Station anchor={ANCHORS.wallet} number={1} title={labels.wallet} state={state('wallet')} nextAnchor={ANCHORS.phrase}
              why={(
                <WhyBlock image="wallet-hot" alt="">
                  <p>{translate({ id: 'getStarted.station.wallet.why', message: 'A wallet holds keys, not coins. Your ada lives on the chain, and the wallet is how you prove it is yours.' })}</p>
                  <p>{translate({ id: 'getStarted.station.wallet.action', message: 'Install one of these wallets for your device, or compare them all in the Wallet Finder.' })}</p>
                </WhyBlock>
              )}
              action={<WalletPicker installed={local.walletInstalled} onInstalledChange={(v) => setLocal({ ...local, walletInstalled: v })} />}
              question={<Questions station="wallet" />}
            />

            <Station anchor={ANCHORS.phrase} number={2} title={labels.phrase} state={state('phrase')} nextAnchor={ANCHORS.connect}
              why={(
                <div>
                  <p>{translate({ id: 'getStarted.station.phrase.why', message: 'Twelve to twenty-four words are the only backup. There is no company, no support desk and no reset. Whoever has the words has the ada.' })}</p>
                  <p>{translate({ id: 'getStarted.station.phrase.action', message: 'Practise the check your wallet will ask for, with a demo phrase. Then write your real one on paper and keep it offline.' })}</p>
                  <p>
                    <Link to="/common-scams">
                      {translate({ id: 'getStarted.station.phrase.scamLink', message: 'Be aware of the most common scams.' })}
                    </Link>
                  </p>
                </div>
              )}
              action={<PhraseSimulator passed={local.phrasePracticePassed} onPassed={() => setLocal({ ...local, phrasePracticePassed: true })} />}
              question={<Questions station="phrase" />}
            />

            <Station anchor={ANCHORS.connect} number={3} title={labels.connect} state={state('connect')} nextAnchor={ANCHORS.ada}
              why={(
                <WhyBlock image="chains" alt="">
                  <p>{translate({ id: 'getStarted.station.connect.why', message: 'Your address is public, like an account number. You can share it with anyone. Your phrase you share with no one.' })}</p>
                  <p>{translate({ id: 'getStarted.station.connect.action', message: 'Connect your wallet, or paste a receiving address.' })}</p>
                </WhyBlock>
              )}
              action={<ConnectStation account={chain.account} setAccount={chain.setAccount} forget={chain.forget} status={chain.status} lastResult={chain.lastResult} checking={chain.checking} locale={currentLocale} />}
              question={<Questions station="connect" />}
            />

            <Station anchor={ANCHORS.ada} number={4} title={labels.ada} state={state('ada')} nextAnchor={ANCHORS.delegate}
              why={(
                <div>
                  <p>{translate({ id: 'getStarted.station.ada.why', message: 'Most people buy their first ada on an exchange. On the exchange it is theirs, in your wallet it is yours.' })}</p>
                  <p>{translate({ id: 'getStarted.station.ada.action', message: 'Choose a way to get ada, then send it to your own address.' })}</p>
                </div>
              )}
              action={(
                <p>
                  <Link className="button button--primary" to="/where-to-get-ada">
                    {translate({ id: 'getStarted.station.ada.button', message: 'See where to get ada' })}
                  </Link>
                </p>
              )}
              proof={chain.account && (
                <p>
                  {chain.status.ada === true && (confirmed
                    ? translate({ id: 'getStarted.station.ada.proofWallet', message: '{amount} ada in your wallet.' }, { amount: formatAda(chain.status.balanceLovelace, currentLocale) })
                    : translate({ id: 'getStarted.station.ada.proofAddress', message: '{amount} ada in this account.' }, { amount: formatAda(chain.status.balanceLovelace, currentLocale) }))}
                  {chain.status.ada === false && (confirmed
                    ? translate({ id: 'getStarted.station.ada.none', message: 'No ada yet. Once your transfer arrives, refresh to see it here.' })
                    : translate({ id: 'getStarted.station.ada.noneAddress', message: 'No ada in this account yet. Once a transfer arrives, refresh to see it here.' }))}
                  {chain.status.ada === UNKNOWN && (chain.checking && chain.lastResult === null
                    ? translate({ id: 'getStarted.station.ada.checking', message: 'Checking the balance on the chain.' })
                    : translate({ id: 'getStarted.station.ada.unknown', message: 'Could not check the balance yet. Refresh to try again.' }))}
                </p>
              )}
              question={<Questions station="ada" />}
            />

            <Station anchor={ANCHORS.delegate} number={5} title={labels.delegate} state={state('delegate')} nextAnchor="done"
              why={(
                <WhyBlock image="proof-of-stake" alt="">
                  <p>{translate({ id: 'getStarted.station.delegate.why', message: 'Delegation moves rights, not ada. Your ada stays spendable, the pool produces blocks with it, your DRep votes with it. A vote delegation is also required before staking rewards can be withdrawn.' })}</p>
                  <p>{translate({ id: 'getStarted.station.delegate.action', message: 'Delegate to a stake pool and to a DRep, both from your wallet, in either order.' })}</p>
                </WhyBlock>
              )}
              action={(
                <p>
                  <Link className="button button--primary" to="/stake-pool-delegation">
                    {translate({ id: 'getStarted.station.delegate.stakeButton', message: 'Delegate your ada' })}
                  </Link>{' '}
                  <Link className="button button--outline button--primary" to="/governance/delegate">
                    {translate({ id: 'getStarted.station.delegate.voteButton', message: 'Delegate your vote' })}
                  </Link>
                </p>
              )}
              proof={chain.account && (
                <div>
                  <p>
                    {chain.status.stake === true && poolSentence(chain.status, chain.names)}
                    {chain.status.stake === false && translate({ id: 'getStarted.station.delegate.stakeOpen', message: 'Not staked yet.' })}
                    {chain.status.stake === UNKNOWN && translate({ id: 'getStarted.station.delegate.stakeUnknown', message: 'Could not check the stake delegation yet.' })}
                  </p>
                  <p>
                    {chain.status.vote === true && voteSentence(chain.status, chain.names)}
                    {chain.status.vote === false && translate({ id: 'getStarted.station.delegate.voteOpen', message: 'No vote delegation yet.' })}
                    {chain.status.vote === UNKNOWN && translate({ id: 'getStarted.station.delegate.voteUnknown', message: 'Could not check the vote delegation yet.' })}
                  </p>
                  {chain.status.stakeRegistered === false && (
                    <p>{translate({ id: 'getStarted.station.delegate.notRegistered', message: 'Your stake key is not registered yet. Your wallet registers it with your first delegation, stake or vote.' })}</p>
                  )}
                </div>
              )}
              question={<Questions station="delegate" />}
            />

            <section id="done" tabIndex={-1} className={gs.station} aria-labelledby="done-title">
              <h2 id="done-title" className={styles.srOnly}>{translate({ id: 'getStarted.done.sectionTitle', message: 'Summary' })}</h2>
              <Completion stations={stations} account={chain.account} status={chain.status} names={chain.names} />
            </section>

            <p className={styles.overviewLink}>
              {translate({ id: 'getStarted.intro.overviewLinkText', message: 'Not sure what Cardano is yet?' })}{' '}
              <Link to="/what-is-cardano">{translate({ id: 'getStarted.intro.overviewLinkLabel', message: 'Start with the overview.' })}</Link>
            </p>
            </div>
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
