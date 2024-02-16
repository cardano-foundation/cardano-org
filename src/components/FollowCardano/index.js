import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { FaTwitter, FaFacebookF, FaYoutube, FaRedditAlien, FaMeetup, FaTelegram, FaLinkedin } from 'react-icons/fa';

const socialLinks = [
  { icon: <FaMeetup />, url: "https://www.meetup.com/pro/cardano/", label: "Cardano Meetup" },
  { icon: <FaTelegram />, url: "https://t.me/CardanoAnnouncements", label: "Cardano on Telegram" },
  { icon: <FaFacebookF />, url: "https://www.facebook.com/groups/CardanoCommunity", label: "Cardano on Facebook" },
  { icon: <FaTwitter />, url: "https://twitter.com/Cardano", label: "Cardano on Twitter" },
  { icon: <FaLinkedin />, url: "https://www.linkedin.com/company/cardano-community", label: "Cardano on LinkedIn" },
  { icon: <FaRedditAlien />, url: "https://www.reddit.com/r/cardano/", label: "Cardano on Reddit" },
  { icon: <FaYoutube />, url: "https://www.youtube.com/channel/UCbQ9vGfezru1YRI1zDCtTGg", label: "Cardano Foundation on YouTube" }, // fixme: check if needs to be removed
];

function FollowCardano() {
  return (
    <div className={styles.container}>
      <div className={styles.taglineContainer}>
        <h1>Follow Cardano</h1>
        <p className="social__icons">
          {socialLinks.map((social, index) => (
            <Link key={index} href={social.url} aria-label={social.label}>
              <span className={styles.iconWrapper}>{social.icon}</span>
            </Link>
          ))}
        </p>
      </div>
    </div>
  );
}

export default FollowCardano;
