import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { getHeading } from "@site/src/utils/heading";
import Link from "@docusaurus/Link";
import {
  FaXTwitter,
  FaRedditAlien,
  FaDiscourse,
  FaFacebookF,
  FaMeetup,
  FaTelegram,
  FaStackExchange,
  FaLinkedin,
} from "react-icons/fa6";

// Overview: https://react-icons.github.io/react-icons/, for consistency stick to font awesome 6 (fa6)
const socialLinks = [
  {
    icon: <FaXTwitter />,
    url: "https://twitter.com/Cardano",
    label: "Cardano on X",
  },
  {
    icon: <FaRedditAlien />,
    url: "https://www.reddit.com/r/cardano/",
    label: "Cardano on Reddit",
  },
  {
    icon: <FaDiscourse />,
    url: "https://forum.cardano.org",
    label: "Cardano Forum",
  },
  {
    icon: <FaFacebookF />,
    url: "https://www.facebook.com/groups/CardanoCommunity",
    label: "Cardano on Facebook",
  },
  {
    icon: <FaMeetup />,
    url: "https://www.meetup.com/pro/cardano/",
    label: "Cardano Meetup",
  },
  {
    icon: <FaTelegram />,
    url: "https://t.me/Cardano",
    label: "Cardano on Telegram",
  },
  {
    icon: <FaStackExchange />,
    url: "https://cardano.stackexchange.com/",
    label: "Cardano StackExchange",
  },
  {
    icon: <FaLinkedin />,
    url: "https://www.linkedin.com/company/cardano-community",
    label: "Cardano on LinkedIn",
  },
];

/**
 * Title with a row of links to Cardano's social channels.
 *
 * @param {object} props
 * @param {string} props.title Heading text.
 * @param {string} [props.iconForegroundColor] Icon color.
 * @param {string} [props.iconBackgroundColor] Icon background color.
 * @param {number} [props.headingLevel=1] Heading level of the title. The look stays the same.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function FollowCardano({
  title,
  iconForegroundColor,
  iconBackgroundColor,
  headingLevel,
  className,
}) {
  const { Tag, lookClassName } = getHeading(headingLevel, 1);
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.taglineContainer}>
        <Tag className={lookClassName}>{title}</Tag>
        <p className="social__icons">
          {socialLinks.map((social, index) => (
            <Link key={index} href={social.url} aria-label={social.label}>
              <span
                className={styles.iconWrapper}
                style={{
                  "--icon-bg-color": iconBackgroundColor,
                  "--icon-fg-color": iconForegroundColor
                    ? iconForegroundColor
                    : "",
                }}
              >
                {social.icon}
              </span>
            </Link>
          ))}
        </p>
      </div>
    </div>
  );
}
