import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { BsChatLeftTextFill } from "react-icons/bs";
import { FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

import styles from "./styles.module.css";

/**
 * Ambassador entry shape (src/data/ambassadorsData.json):
 *   { name, role (country name), country (ISO-2), link (forum URL),
 *     x?: string,         // optional Twitter/X URL or @handle
 *     linkedin?: string,  // optional LinkedIn URL
 *     youtube?: string }  // optional YouTube channel URL
 */

const PALETTE = [
  "#3a5fd6",
  "#7c5be0",
  "#10a17a",
  "#d99808",
  "#dc2c5a",
  "#00a3a3",
  "#5b80ff",
];

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function normaliseSocial(value, prefix) {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const handle = value.replace(/^@/, "");
  return `${prefix}${handle}`;
}

export default function AmbassadorCard({ ambassador, contributionLabel }) {
  const flag = useBaseUrl(`img/flags/${ambassador.country}.svg`);
  const initial = ambassador.name.trim().charAt(0).toUpperCase();
  const xUrl = normaliseSocial(ambassador.x, "https://x.com/");
  const linkedinUrl = normaliseSocial(ambassador.linkedin, "https://www.linkedin.com/in/");
  const youtubeUrl = ambassador.youtube || null;

  return (
    <div className={styles.card}>
      <div className={styles.avatarWrap}>
        <div className={styles.avatar} style={{ backgroundColor: avatarColor(ambassador.name) }} aria-hidden="true">
          {initial}
        </div>
        <img src={flag} alt="" className={styles.flag} />
      </div>
      <div className={styles.name}>{ambassador.name}</div>
      <div className={styles.role}>{ambassador.role}</div>
      {contributionLabel && <div className={styles.tag}>{contributionLabel}</div>}
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
