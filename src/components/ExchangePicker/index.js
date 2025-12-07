import React, { useState } from "react";
import data from "@site/src/data/exchanges.json";
import styles from "./styles.module.css";

const { regions, countries } = data;

// Logo mapping for exchanges (from CoinGecko and official sources)
const EXCHANGE_LOGOS = {
  "Kraken": "/img/exchanges/kraken.png",
  "Bitpanda": "/img/exchanges/bitpanda.png",
  "NBX": "/img/exchanges/nbx.png",
  "Binance": "/img/exchanges/binance.svg",
  "Binance US": "/img/exchanges/binance.svg",
  "Coinbase": "/img/exchanges/coinbase.png",
  "Bitvavo": "/img/exchanges/bitvavo.svg",
  // Revolut: No logo available - uses initial badge
  "LCX": "/img/exchanges/lcx.png",
};

function getExchangesForCountry(countryName) {
  const country = countries[countryName];
  if (!country) return [];

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

  return merged;
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
  const [selected, setSelected] = useState("");

  const countryNames = Object.keys(countries).sort();
  const exchanges = selected ? getExchangesForCountry(selected) : [];

  return (
    <div className={styles.container}>
      <div className={styles.selectContainer}>
         
        <select
          className={styles.countrySelect}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">-- Choose a country --</option>
          {countryNames.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
