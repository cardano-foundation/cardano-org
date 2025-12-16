import React, { useState, useEffect } from "react";
import data from "@site/src/data/exchanges.json";
import styles from "./styles.module.css";

const { regions, countries } = data;
const STORAGE_KEY = 'cardano-selected-country';

// Logo mapping for exchanges 
const EXCHANGE_LOGOS = {
  "Kraken": "/img/exchanges/kraken.png",
  "Bitpanda": "/img/exchanges/bitpanda.png",
  "NBX": "/img/exchanges/nbx.png",
  "Binance": "/img/exchanges/binance.svg",
  "Binance US": "/img/exchanges/binance.svg",
  "Coinbase": "/img/exchanges/coinbase.png",
  "Bitvavo": "/img/exchanges/bitvavo.svg",
  "LCX": "/img/exchanges/lcx.png",
  "Robinhood": "/img/exchanges/robinhood.png",
  "Trade Republic": "/img/exchanges/traderepublic.jpg",
  "BISON": "/img/exchanges/bison.svg",
  "Bitfinex": "/img/exchanges/bitfinex.jpg",
  "HTX": "/img/exchanges/htx.jpg",
  "SwissBorg": "/img/exchanges/swissborg.jpg",
  "Revolut": "/img/exchanges/revolut.jpg",
  "Upbit": "/img/exchanges/upbit.png",
};

function getExchangesForCountry(countryName) {
  const country = countries[countryName];
  if (!country) return { exchanges: [], notice: null };

  const countryExchanges = country.exchanges || [];

  const regionExchanges = (country.regions || [])
    .flatMap((r) => regions[r] || []);

  // prevent duplicates
  const seen = new Set();
  const merged = [...countryExchanges, ...regionExchanges].filter((ex) => {
    const key = ex.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    exchanges: merged,
    notice: country.notice || null
  };
}

function ExchangeCard({ exchange }) {
  const logoUrl = EXCHANGE_LOGOS[exchange.name];
  const initial = exchange.name.charAt(0).toUpperCase();

  return (
    <div className={styles.exchangeCard}>
      <div className={styles.exchangeHeader}>
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={exchange.name} 
            className={styles.exchangeLogo}
            onError={(e) => {
              // Fallback zu Initial-Badge wenn Logo nicht lädt
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {!logoUrl && (
          <div className={styles.exchangeInitial}>
            {initial}
          </div>
        )}
        <h4 className={styles.exchangeName}>{exchange.name}</h4>
      </div>

      <div className={styles.badgeContainer}>
        {exchange.ada && (
          <span className={`${styles.badge} ${styles.badgeAda}`}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
            </svg>
            ADA
          </span>
        )}
        {exchange.cnt && (
          <span className={`${styles.badge} ${styles.badgeCnt}`}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            CNT
          </span>
        )}
      </div>

      <a 
        href={exchange.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.exchangeLink}
      >
        Visit Exchange
      </a>
    </div>
  );
}

export default function ExchangePicker() {
  // Load saved country from localStorage
  const getSavedCountry = () => {
    if (typeof window === 'undefined') return "";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Verify the saved country still exists in our data
      return saved && countries[saved] ? saved : "";
    } catch (e) {
      return "";
    }
  };

  const [selected, setSelected] = useState(getSavedCountry);

  // Save country to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && selected) {
      try {
        localStorage.setItem(STORAGE_KEY, selected);
      } catch (e) {
        console.error('Failed to save country to localStorage', e);
      }
    }
  }, [selected]);

  // Top 3 countries by analytics Sept, October, November 2025
  const topCountries = ["USA", "Germany", "China"];
  const allCountryNames = Object.keys(countries).sort();
  
  const { exchanges, notice } = selected ? getExchangesForCountry(selected) : { exchanges: [], notice: null };

  return (
    <div className={styles.container}>
      <div className={styles.selectContainer}>
        <label className={styles.selectLabel} htmlFor="country-select">
          Select your country:
        </label>
        <select
          id="country-select"
          className={styles.countrySelect}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">-- Choose a country --</option>
          <optgroup label="Popular">
            {topCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </optgroup>
          <optgroup label="All Countries">
            {allCountryNames.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {selected && (
        <div>
          {notice && (
            <div className={styles.notice}>
              {notice}
            </div>
          )}
          <h3 className={styles.resultsHeader}>
            {exchanges.length} {exchanges.length === 1 ? 'exchange' : 'exchanges'} in {selected}
          </h3>
          {exchanges.length === 0 ? (
            <p className={styles.noResults}>
              No exchanges listed yet for this country.
            </p>
          ) : (
            <div className={styles.exchangeGrid}>
              {exchanges.map((ex) => (
                <ExchangeCard key={ex.name} exchange={ex} />
              ))}
              <a 
                href="https://github.com/cardano-foundation/cardano-org/issues/355" 
                target="_blank"
                rel="noopener noreferrer"
                className={styles.addExchangeCard}
              >
                <div className={styles.addExchangeContent}>
                  <svg className={styles.addExchangeIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <h4 className={styles.addExchangeTitle}>Add Your Exchange</h4>
                  <p className={styles.addExchangeDescription}>
                    Help us expand this list by contributing exchanges for {selected}
                  </p>
                </div>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
