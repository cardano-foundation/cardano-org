import React, { useEffect, useRef } from "react";
import { useLocation, useHistory } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import Link from "@docusaurus/Link";
import {translate} from '@docusaurus/Translate';
import companies from "@site/src/data/logosCompanies.json";
import styles from "./styles.module.css";

function getCompanyId(company) {
  return company.id || company.imageName;
}

function SpotlightPanel({ company, onClose }) {
  if (!company) return null;

  return (
    <div className={styles.spotlightInner} key={getCompanyId(company)}>
      <button
        className={styles.spotlightClose}
        onClick={onClose}
        aria-label="Close spotlight"
      >
        ×
      </button>
      <ThemedImage
        className={styles.spotlightLogo}
        alt={company.companyName}
        sources={{
          light: useBaseUrl(`/img/logos/${company.imageName}.svg`),
          dark: useBaseUrl(`/img/logos/${company.imageName}-dark.svg`),
        }}
      />
      <h3 className={styles.spotlightName}>{company.companyName}</h3>
      {company.category && (
        <span className={styles.spotlightCategory}>{company.category}</span>
      )}
      {company.description ? (
        <p
          className={styles.spotlightDescription}
          dangerouslySetInnerHTML={{ __html: company.description }}
        />
      ) : (
        <p className={styles.spotlightKnownFor}>
          Known for: {company.knownFor}
        </p>
      )}
      <Link className={styles.spotlightLink} href={company.link}>
        Visit website →
      </Link>
    </div>
  );
}

function LogoCell({ company, isActive, onClick }) {
  return (
    <div
      className={`${styles.logoCell} ${isActive ? styles.logoCellActive : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      title={company.companyName}
    >
      <ThemedImage
        className={styles.logoImage}
        alt={company.companyName}
        sources={{
          light: useBaseUrl(`/img/logos/${company.imageName}.svg`),
          dark: useBaseUrl(`/img/logos/${company.imageName}-dark.svg`),
        }}
      />
      {company.showCompanyName && company.companyName && (
        <span className={styles.companyName}>{company.companyName}</span>
      )}
    </div>
  );
}

export default function CompaniesShowcase() {
  const location = useLocation();
  const history = useHistory();
  const spotlightRef = useRef(null);

  const params = new URLSearchParams(location.search);
  const activeTab = params.get("tab");

  const activeCompany = activeTab
    ? companies.find((c) => getCompanyId(c) === activeTab)
    : null;

  useEffect(() => {
    if (activeCompany && spotlightRef.current) {
      spotlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

  function handleSelect(company) {
    const id = getCompanyId(company);
    const newParams = new URLSearchParams(location.search);
    if (activeTab === id) {
      newParams.delete("tab");
    } else {
      newParams.set("tab", id);
    }
    const search = newParams.toString();
    history.push({
      pathname: location.pathname,
      search: search ? `?${search}` : "",
    });
  }

  function handleClose() {
    const newParams = new URLSearchParams(location.search);
    newParams.delete("tab");
    const search = newParams.toString();
    history.push({
      pathname: location.pathname,
      search: search ? `?${search}` : "",
    });
  }

  return (
    <div>
      <div
        ref={spotlightRef}
        className={`${styles.spotlight} ${activeCompany ? styles.spotlightOpen : ""}`}
      >
        {activeCompany && (
          <SpotlightPanel company={activeCompany} onClose={handleClose} />
        )}
      </div>
      <div className={styles.grid}>
        {companies.map((company) => (
          <LogoCell
            key={getCompanyId(company)}
            company={company}
            isActive={activeTab === getCompanyId(company)}
            onClick={() => handleSelect(company)}
          />
        ))}
        <Link to="/docs/get-involved/add-company" className={styles.addCard}>
          <svg className={styles.addIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          <span className={styles.addLabel}>
            {translate({id: 'entities.addCompany', message: 'Add your company'})}
          </span>
        </Link>
      </div>
    </div>
  );
}
