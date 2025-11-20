import React, { useState } from "react";
import data from "@site/src/data/exchanges.json";  

const { regions, countries } = data;

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

export default function ExchangePickerDemo() {
  const [selected, setSelected] = useState("");

  const countryNames = Object.keys(countries).sort();
  const exchanges = selected ? getExchangesForCountry(selected) : [];

  return (
    <div style={{ padding: "1rem 0" }}>
      <label style={{ fontWeight: "bold" }}>
        Select your country:
        <br />
        <select
          style={{ marginTop: "0.5rem", padding: "0.4rem" }}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">--</option>
          {countryNames.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {selected && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Available exchanges in {selected}</h3>
          {exchanges.length === 0 ? (
            <p>No exchanges listed yet.</p>
          ) : (
            <ul>
              {exchanges.map((ex) => (
                <li key={ex.name}>
                  <a
                    href={ex.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ex.name}
                  </a>{" "}
                  {ex.ada && <span>(ada)</span>}{" "}
                  {ex.cnt && <span>(CNT)</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}