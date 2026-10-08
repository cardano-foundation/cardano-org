import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";
import { getHeading } from "@site/src/utils/heading";

// Layer 2 ecosystem card. Displays a project's logo tile, name, a colour-coded
// status pill, a short description and an optional call-to-action link.
//
// Mirrors the "L2Card" component from the cardano.org design system. Used on
// the /layer-2 page but generic enough to list any project by status.

const STATUSES = {
  "production-ready": {
    className: styles.statusBlue,
    label: translate({ id: "layer2.status.productionReady", message: "Production-ready" }),
  },
  "in-production": {
    className: styles.statusBlue,
    label: translate({ id: "layer2.status.inProduction", message: "In production" }),
  },
  deployed: {
    className: styles.statusGreen,
    label: translate({ id: "layer2.status.deployed", message: "Deployed" }),
  },
  mainnet: {
    className: styles.statusGreen,
    label: translate({ id: "layer2.status.mainnet", message: "Mainnet" }),
  },
  "in-development": {
    className: styles.statusPurple,
    label: translate({ id: "layer2.status.inDevelopment", message: "In development" }),
  },
  "proof-of-concept": {
    className: styles.statusAmber,
    label: translate({ id: "layer2.status.proofOfConcept", message: "Proof of concept" }),
  },
  "status-tbc": {
    className: styles.statusGrey,
    label: translate({ id: "layer2.status.tbc", message: "Status TBC" }),
  },
};

function StatusPill({ status }) {
  const variant = STATUSES[status];
  if (!variant) {
    return null;
  }
  return (
    <span className={clsx(styles.statusPill, variant.className)}>
      <span className={styles.statusDot} aria-hidden="true" />
      {variant.label}
    </span>
  );
}

/**
 * Layer 2 project card with logo tile, name, status pill, description and optional link.
 *
 * @param {object} props
 * @param {string} props.name Project name (brand name, not translated).
 * @param {string} props.status Key of STATUSES, drives the pill color and label. Unknown keys hide the pill.
 * @param {string} props.description Short paragraph describing the project.
 * @param {string} [props.logo] Path to a logo image. Falls back to a monogram.
 * @param {string} [props.monogram] Letter shown when no logo is given. Falls back to the first letter of name.
 * @param {string} [props.logoBackground] CSS color of the logo tile.
 * @param {string} [props.logoColor] CSS color of the monogram letter.
 * @param {{label: string, href: string}} [props.cta] Footer link. With href the whole card becomes the link.
 * @param {number} [props.headingLevel=3] Heading level of the name. The look stays the same.
 * @param {string} [props.className] Extra class on the card.
 */
export default function Layer2Card({
  name,
  status,
  description,
  logo,
  monogram,
  logoBackground,
  logoColor,
  cta,
  headingLevel,
  className,
}) {
  const { Tag, lookClassName } = getHeading(headingLevel, 3);
  const logoUrl = useBaseUrl(logo);
  const letter = (monogram || name || "").trim().charAt(0).toUpperCase();
  const isExternal = cta?.href && /^https?:\/\//.test(cta.href);
  const tileStyle = logoBackground ? { background: logoBackground } : undefined;

  const content = (
    <>
      <div className={styles.top}>
        <div className={styles.nameRow}>
          <span className={styles.logoTile} style={tileStyle} aria-hidden="true">
            {logo ? (
              <img src={logoUrl} alt="" className={styles.logoImage} />
            ) : (
              <span className={styles.monogram} style={logoColor ? { color: logoColor } : undefined}>
                {letter}
              </span>
            )}
          </span>
          <Tag className={clsx(styles.name, lookClassName)}>{name}</Tag>
        </div>
        <StatusPill status={status} />
        <p className={styles.description}>{description}</p>
      </div>
      {cta?.label && (
        <span className={styles.cta}>
          {cta.label}
          <span aria-hidden="true"> →</span>
        </span>
      )}
    </>
  );

  if (cta?.href) {
    return (
      <Link
        to={cta.href}
        className={clsx(styles.card, styles.linkCard, className)}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </Link>
    );
  }

  return <article className={clsx(styles.card, className)}>{content}</article>;
}
