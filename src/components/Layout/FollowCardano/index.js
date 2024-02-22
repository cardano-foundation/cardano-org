import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { FaXTwitter, FaRedditAlien, FaDiscourse, FaFacebookF, FaMeetup, FaTelegram, FaStackExchange, FaLinkedin } from 'react-icons/fa6';

// Overview: https://react-icons.github.io/react-icons/, for consistency stick to font awesome 6 (fa6)
const socialLinks = [
  { icon: <FaXTwitter />, url: "https://twitter.com/Cardano", label: "Cardano on X" },
  { icon: <FaRedditAlien />, url: "https://www.reddit.com/r/cardano/", label: "Cardano on Reddit" },
  { icon: <FaDiscourse />, url: "https://forum.cardano.org", label: "Cardano Forum" },  
  { icon: <FaFacebookF />, url: "https://www.facebook.com/groups/CardanoCommunity", label: "Cardano on Facebook" },
  { icon: <FaMeetup />, url: "https://www.meetup.com/pro/cardano/", label: "Cardano Meetup" },
  { icon: <FaTelegram />, url: "https://t.me/CardanoAnnouncements", label: "Cardano on Telegram" },
  { icon: <FaStackExchange />, url: "https://cardano.stackexchange.com/", label: "Cardano StackExchange" },
  { icon: <FaLinkedin />, url: "https://www.linkedin.com/company/cardano-community", label: "Cardano on LinkedIn" },
];

export default function FollowCardano({title, iconForegroundColor, iconBackgroundColor}) {

  return (
    <div className={styles.container}>
      <div className={styles.taglineContainer}>
        <h1>{title}</h1>
        <p className="social__icons">
          {socialLinks.map((social, index) => (
            <Link key={index} href={social.url} aria-label={social.label}>
              <span className={styles.iconWrapper} style={{ 
                '--icon-bg-color': iconBackgroundColor,
                '--icon-fg-color': iconForegroundColor ? iconForegroundColor : '' 
              }}>
                {social.icon}
              </span>
            </Link>
          ))}
        </p>
      </div>
    </div>
  );
}
