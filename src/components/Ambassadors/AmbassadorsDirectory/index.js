import React, { useMemo, useState } from "react";
import { translate } from "@docusaurus/Translate";
import { HiSearch } from "react-icons/hi";

import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import AmbassadorCard from "@site/src/components/Ambassadors/AmbassadorCard";
import ambassadorsData from "@site/src/data/ambassadorsData.json";
import {
  getLanguageForCountry,
  deriveAvailableLanguages,
  ambassadorContributions,
  deriveAvailableContributions,
} from "@site/src/utils/ambassadorLanguages";
import styles from "./styles.module.css";

const PAGE_SIZE = 24;

function buildCountryOptions(ambassadors) {
  const counts = new Map();
  ambassadors.forEach((a) => {
    if (!counts.has(a.country)) counts.set(a.country, { code: a.country, name: a.role, count: 0 });
    counts.get(a.country).count += 1;
  });
  return Array.from(counts.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export default function AmbassadorsDirectory() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [language, setLanguage] = useState("all");
  const [contribution, setContribution] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sortedData = useMemo(
    () => [...ambassadorsData].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const countryOptions = useMemo(() => buildCountryOptions(sortedData), [sortedData]);
  const languageOptions = useMemo(() => deriveAvailableLanguages(sortedData), [sortedData]);
  const contributionOptions = useMemo(() => deriveAvailableContributions(sortedData), [sortedData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedData.filter((a) => {
      if (country !== "all" && a.country !== country) return false;
      if (language !== "all" && getLanguageForCountry(a.country) !== language) return false;
      if (contribution !== "all" && !ambassadorContributions(a).includes(contribution)) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        (a.role && a.role.toLowerCase().includes(q))
      );
    });
  }, [sortedData, query, country, language, contribution]);

  const total = sortedData.length;
  const visible = filtered.slice(0, visibleCount);

  function handleFilterChange(setter) {
    return (value) => {
      setter(value);
      setVisibleCount(PAGE_SIZE);
    };
  }

  function clearFilters() {
    setQuery("");
    setCountry("all");
    setLanguage("all");
    setContribution("all");
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <section>
      <Divider
        text={translate({ id: "ambassadors.directory.divider", message: "Ambassador Directory" })}
        id="directory"
      />
      <TitleWithText
        title={translate({
          id: "ambassadors.directory.title",
          message: "Search and filter our global network of ambassadors",
        })}
        description={[
          translate(
            {
              id: "ambassadors.directory.intro",
              message:
                "Discover profiles of {count} Cardano Ambassadors representing {countries} countries.",
            },
            { count: total, countries: countryOptions.length }
          ),
        ]}
        titleType="red"
        headingDot={false}
      />

      <div className={styles.filters}>
        <label className={styles.searchField}>
          <HiSearch className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder={translate({
              id: "ambassadors.directory.searchPlaceholder",
              message: "Search by name…",
            })}
            aria-label={translate({
              id: "ambassadors.directory.searchAria",
              message: "Search ambassadors by name",
            })}
            className={styles.searchInput}
          />
        </label>

        <select
          value={country}
          onChange={(e) => handleFilterChange(setCountry)(e.target.value)}
          aria-label={translate({
            id: "ambassadors.directory.countryAria",
            message: "Filter by country",
          })}
          className={styles.select}
        >
          <option value="all">
            {translate({ id: "ambassadors.directory.allCountries", message: "All countries" })}
          </option>
          {countryOptions.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name} ({c.count})
            </option>
          ))}
        </select>

        <select
          value={language}
          onChange={(e) => handleFilterChange(setLanguage)(e.target.value)}
          aria-label={translate({
            id: "ambassadors.directory.languageAria",
            message: "Filter by language",
          })}
          className={styles.select}
        >
          <option value="all">
            {translate({ id: "ambassadors.directory.allLanguages", message: "All languages" })}
          </option>
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <select
          value={contribution}
          onChange={(e) => handleFilterChange(setContribution)(e.target.value)}
          aria-label={translate({
            id: "ambassadors.directory.contributionAria",
            message: "Filter by contribution",
          })}
          className={styles.select}
        >
          <option value="all">
            {translate({ id: "ambassadors.directory.allContributions", message: "All contributions" })}
          </option>
          {contributionOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.resultMeta} aria-live="polite">
        {translate(
          {
            id: "ambassadors.directory.resultMeta",
            message: "Showing {shown} of {total} ambassadors",
          },
          { shown: filtered.length, total }
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>
            {translate({
              id: "ambassadors.directory.empty",
              message: "No ambassadors match your filters.",
            })}
          </p>
          <button type="button" className={styles.clearButton} onClick={clearFilters}>
            {translate({ id: "ambassadors.directory.clear", message: "Clear filters" })}
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {visible.map((ambassador) => (
            <AmbassadorCard key={ambassador.name + ambassador.country} ambassador={ambassador} />
          ))}
        </div>
      )}

      {filtered.length > visibleCount && (
        <div className={styles.loadMoreWrap}>
          <button
            type="button"
            className={styles.loadMore}
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
          >
            {translate({ id: "ambassadors.directory.loadMore", message: "Load more" })}
          </button>
        </div>
      )}
    </section>
  );
}
