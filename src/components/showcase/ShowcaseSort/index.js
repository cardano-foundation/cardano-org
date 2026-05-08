import React, { useCallback } from "react";
import { useHistory, useLocation } from "@docusaurus/router";
import { translate } from "@docusaurus/Translate";

import styles from "./styles.module.css";

export const SortQueryStringKey = "sort";

export const SORT_IDS = {
  FEATURED: "featured",
  ALPHABETICAL: "alphabetical",
  MOST_ACTIVE: "mostActive",
};

export const DEFAULT_SORT = SORT_IDS.FEATURED;

export const SORT_OPTIONS = [
  {
    id: SORT_IDS.FEATURED,
    label: translate({ id: "apps.sort.featured", message: "Featured" }),
  },
  {
    id: SORT_IDS.ALPHABETICAL,
    label: translate({ id: "apps.sort.alphabetical", message: "A to Z" }),
  },
  {
    id: SORT_IDS.MOST_ACTIVE,
    label: translate({ id: "apps.sort.mostActive", message: "Most active" }),
  },
];

export function readSortOption(search) {
  const value = new URLSearchParams(search).get(SortQueryStringKey);
  if (!value) return DEFAULT_SORT;
  return SORT_OPTIONS.some((o) => o.id === value) ? value : DEFAULT_SORT;
}

export default function ShowcaseSort() {
  const location = useLocation();
  const history = useHistory();
  const current = readSortOption(location.search);

  const handleChange = useCallback(
    (e) => {
      const next = new URLSearchParams(location.search);
      if (e.target.value === DEFAULT_SORT) {
        next.delete(SortQueryStringKey);
      } else {
        next.set(SortQueryStringKey, e.target.value);
      }
      history.push({ ...location, search: next.toString() });
    },
    [location, history]
  );

  return (
    <label className={styles.sortLabel}>
      <span className={styles.sortLabelText}>
        {translate({ id: "apps.sort.label", message: "Sort" })}
      </span>
      <select
        className={styles.sortSelect}
        value={current}
        onChange={handleChange}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
