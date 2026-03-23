import React, { useState, useMemo, useCallback, useEffect } from "react";
import Layout from "@theme/Layout";
import {translate} from '@docusaurus/Translate';
import { useHistory, useLocation } from "@docusaurus/router";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import WalletFinderFilters from "@site/src/components/WalletFinderFilters";
import WalletFinderCard from "@site/src/components/WalletFinderCard";
import { getWallets, filterWallets, getBeginnerWallets } from "@site/src/utils/walletFinderUtils";
import { toggleListItem } from "@site/src/utils/jsUtils";
import styles from "./styles.module.css";

const TITLE = translate({id: 'walletFinder.hero.title', message: 'Find a Cardano Wallet'});
const DESCRIPTION = translate({id: 'walletFinder.hero.description', message: 'Compare Cardano wallets by platform, features, and security to find the one that fits your needs'});
const META_TITLE = translate({id: 'walletFinder.meta.title', message: 'Cardano Wallet Finder, Compare and Choose the Best Wallet'});
const META_DESCRIPTION = translate({id: 'walletFinder.meta.description', message: 'Find the best Cardano wallet for you. Filter by platform, staking, NFT support, hardware wallet compatibility, and more. Compare wallets side by side.'});

// Query parameter keys
const MODE_KEY = "mode";
const BEGINNER_PLATFORM_KEY = "device";
const PLATFORMS_KEY = "platforms";
const FEATURES_KEY = "features";
const CUSTODY_KEY = "custody";
const TYPE_KEY = "type";
const OPENSOURCE_KEY = "opensource";

function readParams(search) {
  const params = new URLSearchParams(search);
  return {
    mode: params.get(MODE_KEY) || null,
    beginnerPlatform: params.get(BEGINNER_PLATFORM_KEY) || null,
    platforms: params.getAll(PLATFORMS_KEY),
    features: params.getAll(FEATURES_KEY),
    custody: params.get(CUSTODY_KEY) || null,
    type: params.get(TYPE_KEY) || null,
    openSource: params.get(OPENSOURCE_KEY) === "true" ? true : null,
  };
}

function buildSearch({ mode, beginnerPlatform, platforms, features, custody, type, openSource }) {
  const params = new URLSearchParams();
  if (mode) params.set(MODE_KEY, mode);
  if (beginnerPlatform) params.set(BEGINNER_PLATFORM_KEY, beginnerPlatform);
  platforms.forEach((p) => params.append(PLATFORMS_KEY, p));
  features.forEach((f) => params.append(FEATURES_KEY, f));
  if (custody) params.set(CUSTODY_KEY, custody);
  if (type) params.set(TYPE_KEY, type);
  if (openSource) params.set(OPENSOURCE_KEY, "true");
  return params.toString();
}

function useWalletFilters() {
  const location = useLocation();
  const { push } = useHistory();

  const [state, setState] = useState({
    mode: null,
    beginnerPlatform: null,
    platforms: [],
    features: [],
    custody: null,
    type: null,
    openSource: null,
  });

  useEffect(() => {
    setState(readParams(location.search));
  }, [location]);

  const updateState = useCallback(
    (newState) => {
      const search = buildSearch(newState);
      push({ ...location, search });
    },
    [location, push]
  );

  const setMode = useCallback(
    (mode) => {
      updateState({
        mode,
        beginnerPlatform: null,
        platforms: [],
        features: [],
        custody: null,
        type: null,
        openSource: null,
      });
    },
    [updateState]
  );

  const setBeginnerPlatform = useCallback(
    (platform) => {
      updateState({ ...state, beginnerPlatform: state.beginnerPlatform === platform ? null : platform });
    },
    [state, updateState]
  );

  const togglePlatform = useCallback(
    (key) => {
      updateState({ ...state, platforms: toggleListItem(state.platforms, key) });
    },
    [state, updateState]
  );

  const toggleFeature = useCallback(
    (key) => {
      updateState({ ...state, features: toggleListItem(state.features, key) });
    },
    [state, updateState]
  );

  const setType = useCallback(
    (value) => {
      updateState({ ...state, type: value });
    },
    [state, updateState]
  );

  const toggleOpenSource = useCallback(() => {
    updateState({ ...state, openSource: state.openSource ? null : true });
  }, [state, updateState]);

  const clearAll = useCallback(() => {
    updateState({
      ...state,
      beginnerPlatform: null,
      platforms: [],
      features: [],
      custody: null,
      type: null,
      openSource: null,
    });
  }, [state, updateState]);

  return {
    state,
    setMode,
    setBeginnerPlatform,
    togglePlatform,
    toggleFeature,
    setType,
    toggleOpenSource,
    clearAll,
  };
}

function WalletFinderHeader() {
  return (
    <SiteHero
      title={TITLE}
      description={DESCRIPTION}
      bannerType="wallets"
    />
  );
}

function ModeSelector({ onSelectMode }) {
  return (
    <div className={styles.modeSelector}>
      <button className={styles.modeCard} onClick={() => onSelectMode("beginner")} type="button">
        <span className={styles.modeCardTitle}>
          {translate({id: 'walletFinder.mode.beginner.title', message: "I'm new to Cardano"})}
        </span>
        <span className={styles.modeCardDescription}>
          {translate({id: 'walletFinder.mode.beginner.description', message: 'Show me the easiest options'})}
        </span>
      </button>
      <button className={styles.modeCard} onClick={() => onSelectMode("advanced")} type="button">
        <span className={styles.modeCardTitle}>
          {translate({id: 'walletFinder.mode.advanced.title', message: 'I know what I need'})}
        </span>
        <span className={styles.modeCardDescription}>
          {translate({id: 'walletFinder.mode.advanced.description', message: 'Filter by platform, features, and more'})}
        </span>
      </button>
    </div>
  );
}

function BeginnerFilter({ selected, onSelect, onSwitchMode }) {
  return (
    <div className={styles.beginnerFilter}>
      <span className={styles.beginnerLabel}>
        {translate({id: 'walletFinder.beginner.label', message: 'What device will you use?'})}
      </span>
      <div className={styles.beginnerOptions}>
        <button
          className={`${styles.beginnerPill} ${selected === "mobile" ? styles.beginnerPillActive : ""}`}
          onClick={() => onSelect("mobile")}
          type="button"
        >
          {translate({id: 'walletFinder.beginner.mobile', message: 'Mobile'})}
        </button>
        <button
          className={`${styles.beginnerPill} ${selected === "desktop" ? styles.beginnerPillActive : ""}`}
          onClick={() => onSelect("desktop")}
          type="button"
        >
          {translate({id: 'walletFinder.beginner.desktop', message: 'Desktop'})}
        </button>
        <button className={styles.modeSwitch} onClick={() => onSwitchMode("advanced")} type="button">
          {translate({id: 'walletFinder.beginner.showAllFilters', message: 'Show all filters'})}
        </button>
      </div>
    </div>
  );
}

function ChecklistItem({ children }) {
  return (
    <li className={styles.checklistItem}>
      <span className={styles.checkIcon}>&#10003;</span>
      <span>{children}</span>
    </li>
  );
}

export default function WalletFinder() {
  const allWallets = useMemo(() => getWallets(), []);
  const {
    state,
    setMode,
    setBeginnerPlatform,
    togglePlatform,
    toggleFeature,
    setType,
    toggleOpenSource,
    clearAll,
  } = useWalletFilters();

  const filteredWallets = useMemo(() => {
    if (state.mode === "beginner" && state.beginnerPlatform) {
      return getBeginnerWallets(allWallets, state.beginnerPlatform);
    }
    if (state.mode === "advanced") {
      return filterWallets(allWallets, state);
    }
    return allWallets;
  }, [allWallets, state]);

  return (
    <Layout title={META_TITLE} description={META_DESCRIPTION}>
      <OpenGraphInfo pageName="wallets" />
      <WalletFinderHeader />
      <main>
        <BackgroundWrapper backgroundType="adaLight">
          <div className="container">
            {state.mode === null && (
              <ModeSelector onSelectMode={setMode} />
            )}

            {state.mode === "beginner" && (
              <BeginnerFilter
                selected={state.beginnerPlatform}
                onSelect={setBeginnerPlatform}
                onSwitchMode={setMode}
              />
            )}

            {state.mode === "advanced" && (
              <>
                <div style={{ paddingTop: "1rem" }}>
                  <button className={styles.modeSwitch} onClick={() => setMode("beginner")} type="button">
                    {translate({id: 'walletFinder.advanced.simplify', message: 'Simplify filters'})}
                  </button>
                </div>
                <WalletFinderFilters
                  selectedPlatforms={state.platforms}
                  selectedFeatures={state.features}
                  selectedType={state.type}
                  openSource={state.openSource}
                  resultCount={filteredWallets.length}
                  onTogglePlatform={togglePlatform}
                  onToggleFeature={toggleFeature}
                  onSetType={setType}
                  onToggleOpenSource={toggleOpenSource}
                  onClearAll={clearAll}
                />
              </>
            )}
          </div>
        </BackgroundWrapper>

        <div className="container margin-top--lg margin-bottom--lg">
          {filteredWallets.length === 0 ? (
            <div className={styles.noResults}>
              <p className={styles.noResultsTitle}>
                {translate({id: 'walletFinder.noResults.title', message: 'No wallets match your criteria'})}
              </p>
              <p>
                {translate({id: 'walletFinder.noResults.description', message: 'Try adjusting your filters to see more results.'})}
              </p>
            </div>
          ) : (
            <div className={styles.walletGrid}>
              {filteredWallets.map((wallet) => (
                <WalletFinderCard key={wallet.title} wallet={wallet} />
              ))}
            </div>
          )}
          <TitleWithText
            titleType="black"
            headingDot={false}
            slightText={[translate({id: 'walletFinder.disclaimer', message: 'The wallets listed are provided for informational purposes only and are not endorsed or approved. Their use is strictly at your own risk. The descriptions have been provided by the respective project teams.'})]}
          />
        </div>

        <SpacerBox size="large" />

        <BoundaryBox>
          <div className={styles.educationSection}>
            <TitleWithText
              title={translate({id: 'walletFinder.checklist.title', message: 'How to Choose a Wallet'})}
              description={[
                translate({id: 'walletFinder.checklist.description', message: 'Choosing the right wallet is an important step. Here are some things to look for:'}),
              ]}
              titleType="black"
              headingDot={true}
            />

            <ul className={styles.checklist}>
              <ChecklistItem>
                {translate({id: 'walletFinder.checklist.item2', message: 'Does it support hardware wallets? Connecting a hardware wallet like Ledger or Trezor adds an extra layer of security.'})}
              </ChecklistItem>
              <ChecklistItem>
                {translate({id: 'walletFinder.checklist.item3', message: 'Is it open source? Open-source code allows the community to review and verify the wallet\'s security.'})}
              </ChecklistItem>
              <ChecklistItem>
                {translate({id: 'walletFinder.checklist.item4', message: 'How long has it been on the market? Established wallets have a longer track record of reliability.'})}
              </ChecklistItem>
            </ul>

            <SpacerBox size="large" />

            <TitleWithText
              title={translate({id: 'walletFinder.storage.title', message: 'Hot Wallets vs Cold Wallets'})}
              description={[
                translate({id: 'walletFinder.storage.description', message: 'There are two main types of wallets based on their internet connectivity.'}),
              ]}
              titleType="black"
              headingDot={true}
            />

            <DottedImageWithText
              imageName="wallet-hot"
              text={translate({id: 'walletFinder.hotWallet.text', message: 'A hot wallet is connected to the internet and can be accessed at any time with the requisite keys. Examples of hot wallets include mobile and software wallets, and funds stored on exchanges.'})}
            />
            <DottedImageWithText
              imageName="wallet-cold"
              text={translate({id: 'walletFinder.coldWallet.text', message: 'A cold wallet is an offline wallet. It is not connected to the internet and is used for securing storing funds that do not have to be frequently accessed. Examples include hardware wallets, which are secure hardware devices that store the wallet\'s private keys, and paper wallets. Cardano is supported by both Trezor and Ledger hardware wallets.'})}
            />

            <SpacerBox size="small" />

          </div>
        </BoundaryBox>
        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
