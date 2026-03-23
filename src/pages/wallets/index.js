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
import { getWallets, filterWallets } from "@site/src/utils/walletFinderUtils";
import { toggleListItem } from "@site/src/utils/jsUtils";
import styles from "./styles.module.css";

const TITLE = translate({id: 'walletFinder.hero.title', message: 'Find a Wallet'});
const DESCRIPTION = translate({id: 'walletFinder.hero.description', message: 'Find the right Cardano wallet for your needs'});

// Query parameter keys
const PLATFORMS_KEY = "platforms";
const FEATURES_KEY = "features";
const CUSTODY_KEY = "custody";
const TYPE_KEY = "type";
const OPENSOURCE_KEY = "opensource";

function readParams(search) {
  const params = new URLSearchParams(search);
  return {
    platforms: params.getAll(PLATFORMS_KEY),
    features: params.getAll(FEATURES_KEY),
    custody: params.get(CUSTODY_KEY) || null,
    type: params.get(TYPE_KEY) || null,
    openSource: params.get(OPENSOURCE_KEY) === "true" ? true : null,
  };
}

function buildSearch({ platforms, features, custody, type, openSource }) {
  const params = new URLSearchParams();
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

  const [filters, setFilters] = useState({
    platforms: [],
    features: [],
    custody: null,
    type: null,
    openSource: null,
  });

  // Sync from URL on mount and navigation
  useEffect(() => {
    setFilters(readParams(location.search));
  }, [location]);

  const updateFilters = useCallback(
    (newFilters) => {
      const search = buildSearch(newFilters);
      push({ ...location, search });
    },
    [location, push]
  );

  const togglePlatform = useCallback(
    (key) => {
      const newPlatforms = toggleListItem(filters.platforms, key);
      updateFilters({ ...filters, platforms: newPlatforms });
    },
    [filters, updateFilters]
  );

  const toggleFeature = useCallback(
    (key) => {
      const newFeatures = toggleListItem(filters.features, key);
      updateFilters({ ...filters, features: newFeatures });
    },
    [filters, updateFilters]
  );

  const setType = useCallback(
    (value) => {
      updateFilters({ ...filters, type: value });
    },
    [filters, updateFilters]
  );

  const toggleOpenSource = useCallback(() => {
    updateFilters({
      ...filters,
      openSource: filters.openSource ? null : true,
    });
  }, [filters, updateFilters]);

  const clearAll = useCallback(() => {
    updateFilters({
      platforms: [],
      features: [],
      custody: null,
      type: null,
      openSource: null,
    });
  }, [updateFilters]);

  return {
    filters,
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
    filters,
    togglePlatform,
    toggleFeature,
    setType,
    toggleOpenSource,
    clearAll,
  } = useWalletFilters();

  const filteredWallets = useMemo(
    () => filterWallets(allWallets, filters),
    [allWallets, filters]
  );

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <OpenGraphInfo pageName="wallets" />
      <WalletFinderHeader />
      <main>
        <BackgroundWrapper backgroundType="adaLight">
          <div className="container">
            <WalletFinderFilters
              selectedPlatforms={filters.platforms}
              selectedFeatures={filters.features}
              selectedType={filters.type}
              openSource={filters.openSource}
              resultCount={filteredWallets.length}
              onTogglePlatform={togglePlatform}
              onToggleFeature={toggleFeature}
              onSetType={setType}
              onToggleOpenSource={toggleOpenSource}
              onClearAll={clearAll}
            />
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
