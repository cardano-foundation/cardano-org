import React from "react";
import { translate } from "@docusaurus/Translate";
import { HiUsers, HiGlobeAlt, HiTranslate, HiChatAlt2 } from "react-icons/hi";
import styles from "./styles.module.css";

export default function AmbassadorsStatsRow({ ambassadorsCount, countriesCount, languages, channels, platforms }) {
  const items = [
    {
      icon: <HiUsers />,
      value: ambassadorsCount,
      label: translate({ id: "ambassadors.stats.ambassadors.label", message: "Ambassadors" }),
      caption: translate({ id: "ambassadors.stats.ambassadors.caption", message: "Global community leaders" }),
    },
    {
      icon: <HiGlobeAlt />,
      value: countriesCount,
      label: translate({ id: "ambassadors.stats.countries.label", message: "Countries" }),
      caption: translate({ id: "ambassadors.stats.countries.caption", message: "Represented worldwide" }),
    },
    {
      icon: <HiTranslate />,
      value: `${languages}+`,
      label: translate({ id: "ambassadors.stats.languages.label", message: "Languages" }),
      caption: translate({ id: "ambassadors.stats.languages.caption", message: "Making Cardano accessible" }),
    },
    {
      icon: <HiChatAlt2 />,
      value: channels,
      label: translate({ id: "ambassadors.stats.channels.label", message: "Moderated channels" }),
      caption: translate(
        { id: "ambassadors.stats.channels.caption", message: "Across {platforms} platforms" },
        { platforms }
      ),
    },
  ];

  return (
    <div className={styles.row}>
      {items.map((s, i) => (
        <div key={i} className={styles.tile}>
          <span className={styles.iconBubble} aria-hidden="true">{s.icon}</span>
          <div className={styles.tileBody}>
            <div className={styles.value}>{s.value}</div>
            <div className={styles.label}>{s.label}</div>
            <div className={styles.caption}>{s.caption}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
