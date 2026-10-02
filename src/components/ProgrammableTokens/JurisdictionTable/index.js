import React from "react";
import RichText from "@site/src/components/ProgrammableTokens/RichText";
import styles from "./styles.module.css";

// Jurisdiction / framework / requirement table for the /programmable-tokens
// page. A real <table> (the jurisdiction is the row header) styled as open
// rows with hairlines; each framework name sits in its own light-blue tag with
// its footnote reference. Below 768px each row stacks into a block.
//
// Props:
//   table - WHY.table from src/data/programmable-tokens.js

export default function JurisdictionTable({ table }) {
  return (
    <table className={styles.table}>
      <caption className={styles.srOnly}>{table.caption}</caption>
      <thead>
        <tr>
          <th scope="col">{table.headers.jurisdiction}</th>
          <th scope="col">{table.headers.framework}</th>
          <th scope="col">{table.headers.requirement}</th>
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row) => (
          <tr key={row.jurisdiction}>
            <th scope="row" className={styles.jurisdiction}>
              {row.jurisdiction}
            </th>
            <td className={styles.frameworkCell}>
              <div className={styles.frameworkList}>
                {row.frameworks.map((framework) => (
                  <span key={framework} className={styles.framework}>
                    <RichText text={framework} />
                  </span>
                ))}
              </div>
            </td>
            <td className={styles.requirement}>{row.requirement}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
