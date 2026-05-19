import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { BsChatLeftTextFill } from "react-icons/bs";
import { FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

import { avatarColor } from "@site/src/utils/ambassadorColors";
import styles from "./styles.module.css";

const PLACEHOLDER = "SOON...";

function present(value) {
  if (!value) return false;
  const trimmed = String(value).trim();
  return trimmed.length > 0 && trimmed !== PLACEHOLDER;
}

function parseAreas(value) {
  if (!present(value)) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AmbassadorCard({ ambassador }) {
  const flag = useBaseUrl(`img/flags/${ambassador.country}.svg`);
  const initial = ambassador.name.trim().charAt(0).toUpperCase();

  const socials = ambassador.socials || {};
  const xUrl = present(socials.x) ? socials.x : null;
  const linkedinUrl = present(socials.linkedIn) ? socials.linkedIn : null;
  const youtubeUrl = present(socials.youtube) ? socials.youtube : null;

  const hasPicture = present(ambassador.profilePicture);
  const tagline = present(ambassador.tagline) ? ambassador.tagline : null;
  const areas = parseAreas(ambassador.areasOfContribution);

  return (
    <div className={styles.card}>
      <div className={styles.avatarWrap}>
        {hasPicture ? (
          <img
            src={ambassador.profilePicture}
            alt=""
            className={styles.photo}
            loading="lazy"
          />
        ) : (
          <div
            className={styles.avatar}
            style={{ backgroundColor: avatarColor(ambassador.name) }}
            aria-hidden="true"
          >
            {initial}
          </div>
        )}
        <img src={flag} alt="" className={styles.flag} />
      </div>
      <div className={styles.name}>{ambassador.name}</div>
      <div className={styles.role}>{ambassador.role}</div>
      {tagline && <div className={styles.tagline}>{tagline}</div>}
      {areas.length > 0 && (
        <div className={styles.tagRow}>
          {areas.map((area) => (
            <span key={area} className={styles.tag}>{area}</span>
          ))}
        </div>
      )}
      <div className={styles.socialRow}>
        <Link
          to={ambassador.link}
          className={styles.socialLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={translate({ id: "ambassadors.directory.socialAria.forum", message: "Forum profile" })}
        >
          <BsChatLeftTextFill />
        </Link>
        {xUrl && (
          <Link
            to={xUrl}
            className={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={translate({ id: "ambassadors.directory.socialAria.x", message: "X profile" })}
          >
            <FaXTwitter />
          </Link>
        )}
        {linkedinUrl && (
          <Link
            to={linkedinUrl}
            className={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={translate({ id: "ambassadors.directory.socialAria.linkedin", message: "LinkedIn profile" })}
          >
            <FaLinkedinIn />
          </Link>
        )}
        {youtubeUrl && (
          <Link
            to={youtubeUrl}
            className={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={translate({ id: "ambassadors.directory.socialAria.youtube", message: "YouTube channel" })}
          >
            <FaYoutube />
          </Link>
        )}
      </div>
    </div>
  );
}
