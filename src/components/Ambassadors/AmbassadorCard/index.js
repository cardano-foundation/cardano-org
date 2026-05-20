import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { BsChatLeftTextFill } from "react-icons/bs";
import { FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

import AmbassadorAvatar, { Flag } from "@site/src/components/Ambassadors/AmbassadorAvatar";
import { ambassadorContributions, present } from "@site/src/utils/ambassadorLanguages";
import { ambassadorElementId, ambassadorSlug } from "@site/src/utils/ambassadorSlug";
import styles from "./styles.module.css";

export default function AmbassadorCard({ ambassador, highlighted = false }) {
  const socials = ambassador.socials || {};
  const xUrl = present(socials.x) ? socials.x : null;
  const linkedinUrl = present(socials.linkedIn) ? socials.linkedIn : null;
  const youtubeUrl = present(socials.youtube) ? socials.youtube : null;

  const tagline = present(ambassador.tagline) ? ambassador.tagline : null;
  const areas = ambassadorContributions(ambassador);

  return (
    <div
      id={ambassadorElementId(ambassadorSlug(ambassador.name))}
      className={`${styles.card} ${highlighted ? styles.highlight : ""}`}
    >
      <div className={styles.avatarWrap}>
        <AmbassadorAvatar
          ambassador={ambassador}
          photoClassName={styles.photo}
          initialClassName={styles.avatar}
        />
        <Flag country={ambassador.country} className={styles.flag} />
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{ambassador.name}</div>
        <div className={styles.role}>{ambassador.role}</div>
        {tagline && <div className={styles.tagline}>{tagline}</div>}
        <div className={styles.footer}>
          {areas[0] && <span className={styles.tag}>{areas[0]}</span>}
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
      </div>
    </div>
  );
}
