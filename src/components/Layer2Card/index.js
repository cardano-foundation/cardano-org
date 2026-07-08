import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

// Layer 2 ecosystem card. Displays a project's logo tile, name, a colour-coded
// status pill, a short description and an optional call-to-action link.
//
// Mirrors the "L2Card" component from the cardano.org design system. Used on
// the /layer-2 page but generic enough to list any project by status.
//
// Props:
//   name           - project name (brand name, not translated)
//   status         - one of the STATUSES keys below (drives the pill colour + label)
//   description    - short paragraph describing the project
//   logo           - optional path to a logo image; falls back to a monogram
//   monogram       - optional letter shown when no logo is given (defaults to name[0])
//   logoBackground - optional CSS colour for the logo tile (defaults to a light blue tint)
//   logoColor      - optional CSS colour for the monogram letter (defaults to the brand blue)
//   cta            - optional { label, href } for the footer link / card target

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

export default function Layer2Card({
  name,
  status,
  description,
  logo,
  monogram,
  logoBackground,
  logoColor,
  cta,
}) {
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
          <h3 className={styles.name}>{name}</h3>
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
        className={clsx(styles.card, styles.linkCard)}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </Link>
    );
  }

  return <article className={styles.card}>{content}</article>;
}
