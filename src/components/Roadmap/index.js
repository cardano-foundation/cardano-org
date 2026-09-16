import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import { FaUser, FaCode, FaServer, FaLayerGroup, FaBolt } from "react-icons/fa";
import RoleCard from "@site/src/components/Layout/RoleCard";
import StatusPill from "@site/src/components/Layout/StatusPill";
import HorizontalScroller from "@site/src/components/HorizontalScroller";
import { describeStage, getOutcomes, getPhases, getReaders, getUpcoming, getUpgrades } from "@site/src/data/roadmap";
import styles from "./styles.module.css";

const ICONS = {
  users: <FaUser />,
  builders: <FaCode />,
  operators: <FaServer />,
  capacity: <FaLayerGroup />,
  settlement: <FaBolt />,
  programmability: <FaCode />,
};

// "July 18, 2026" in the reader's locale. Dates are ISO in the data.
export function useFormatDate() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale || "en";
  return (iso) =>
    new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

// What the next upgrades change, one card each.
export function OutcomeCards() {
  return (
    <div className={styles.cards}>
      {getOutcomes().map((outcome) => (
        <RoleCard key={outcome.key} accent={outcome.accent} icon={ICONS[outcome.icon]} title={outcome.title} href={outcome.href}>
          {outcome.text}
        </RoleCard>
      ))}
    </div>
  );
}

// One shape for every upgrade, being built or enacted: a column under one
// rule, with a dot on the rule (accented while the upgrade is ahead or is
// the one running), when, the name, the era, one sentence, one link.
function TimelineCard({ item }) {
  const external = /^https?:/.test(item.link.href);
  return (
    <article id={item.anchor} className={clsx(styles.card, item.pill && styles.cardAccent)}>
      <span className={styles.cardDot} aria-hidden="true" />
      <div className={styles.cardTop}>
        <span className={styles.cardWhen}>{item.when}</span>
        {item.pill && <StatusPill tone={item.pill.tone} label={item.pill.label} className={styles.pill} />}
      </div>
      <h3 className={styles.cardName}>{item.name}</h3>
      <span className={styles.cardEra}>{item.era}</span>
      <p className={styles.cardText}>{item.text}</p>
      {item.fact && <p className={styles.cardFact}>{item.fact}</p>}
      <Link to={item.link.href} className={styles.cardLink} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {item.link.label}
      </Link>
    </article>
  );
}

// The upgrades being built, then every enacted one, newest first.
export function UpgradeTimeline() {
  const formatDate = useFormatDate();
  const upcoming = getUpcoming().map((upgrade) => ({
    key: upgrade.key,
    anchor: `upcoming-${upgrade.key}`,
    pill: describeStage(upgrade.stage),
    when: upgrade.target,
    name: upgrade.name,
    era: upgrade.era,
    text: upgrade.outcome,
    fact: upgrade.fact,
    link: upgrade.links[0],
  }));
  const enacted = getUpgrades().map((upgrade, index) => ({
    key: upgrade.key,
    anchor: `upgrade-${upgrade.key}`,
    pill: index === 0 ? { tone: "success", label: translate({ id: "roadmap.history.live", message: "Live now" }) } : null,
    when: formatDate(upgrade.date),
    name: upgrade.name,
    era: translate({ id: "roadmap.history.eraVersion", message: "{era}, protocol version {version}" }, { era: upgrade.era, version: upgrade.version }),
    text: upgrade.summary,
    link: upgrade.glossary
      ? { href: upgrade.glossary, label: translate({ id: "roadmap.history.readMore", message: "Read more" }) }
      : null,
  }));
  return (
    <HorizontalScroller
      ariaLabel={translate({ id: "roadmap.timeline.ariaLabel", message: "Upgrades" })}
      prevLabel={translate({ id: "roadmap.timeline.prev", message: "Newer upgrades" })}
      nextLabel={translate({ id: "roadmap.timeline.next", message: "Older upgrades" })}
      gap="1rem"
      itemWidth="300px"
      itemWidthMobile="260px"
    >
      {[...upcoming, ...enacted].map((item) => (
        <TimelineCard key={item.key} item={{ ...item, link: item.link || { href: "/glossary/hard-fork", label: translate({ id: "roadmap.history.aboutHardForks", message: "About hard forks" }) } }} />
      ))}
    </HorizontalScroller>
  );
}

// What the upgrades being built mean for each reader, one card per reader
// with one line per upgrade.
export function ReaderCards() {
  const upcoming = getUpcoming();
  return (
    <div className={styles.cards}>
      {getReaders().map((reader) => (
        <RoleCard key={reader.key} icon={ICONS[reader.key]} title={reader.label}>
          <ul className={styles.readerList}>
            {upcoming.map((upgrade) => (
              <li key={upgrade.key}>
                <strong>{upgrade.name}.</strong> {upgrade.forReaders[reader.key]}
              </li>
            ))}
          </ul>
        </RoleCard>
      ))}
    </div>
  );
}

// One development phase: portrait, name linking to its glossary entry, its
// theme, and what it delivered.
function Phase({ phase }) {
  const imageUrl = useBaseUrl(`/img/eras/${phase.key}.avif`);
  return (
    <article className={styles.phase}>
      <img src={imageUrl} alt="" className={styles.phaseImage} loading="lazy" />
      <h3 className={styles.phaseName}>
        <Link to={`/glossary/${phase.key}`}>{phase.name}</Link>
      </h3>
      <span className={styles.phaseTheme}>{phase.theme}</span>
      <ul className={styles.phaseList}>
        {phase.milestones.map((item) => (
          <li key={item.text}>
            {item.upgradeKey ? <Link to={`#upgrade-${item.upgradeKey}`} className={styles.phaseLink}>{item.text}</Link> : item.text}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function PhaseStrip() {
  return (
    <div className={styles.phases}>
      {getPhases().map((phase) => (
        <Phase key={phase.key} phase={phase} />
      ))}
    </div>
  );
}
