import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { getHeading } from "@site/src/utils/heading";
import { translate } from "@docusaurus/Translate";
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
// Built per render so translate() runs in the active locale
const getSocialLinks = () => [
  {
    icon: <FaXTwitter />,
    url: "https://twitter.com/Cardano",
    label: translate({ id: "followCardano.label.x", message: "Cardano on X" }),
  },
  {
    icon: <FaRedditAlien />,
    url: "https://www.reddit.com/r/cardano/",
    label: translate({ id: "followCardano.label.reddit", message: "Cardano on Reddit" }),
  },
  {
    icon: <FaDiscourse />,
    url: "https://forum.cardano.org",
    label: translate({ id: "followCardano.label.forum", message: "Cardano Forum" }),
  },
  {
    icon: <FaFacebookF />,
    url: "https://www.facebook.com/groups/CardanoCommunity",
    label: translate({ id: "followCardano.label.facebook", message: "Cardano on Facebook" }),
  },
  {
    icon: <FaMeetup />,
    url: "https://www.meetup.com/pro/cardano/",
    label: translate({ id: "followCardano.label.meetup", message: "Cardano Meetup" }),
  },
  {
    icon: <FaTelegram />,
    url: "https://t.me/Cardano",
    label: translate({ id: "followCardano.label.telegram", message: "Cardano on Telegram" }),
  },
  {
    icon: <FaStackExchange />,
    url: "https://cardano.stackexchange.com/",
    label: translate({ id: "followCardano.label.stackexchange", message: "Cardano StackExchange" }),
  },
  {
    icon: <FaLinkedin />,
    url: "https://www.linkedin.com/company/cardano-community",
    label: translate({ id: "followCardano.label.linkedin", message: "Cardano on LinkedIn" }),
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
          {getSocialLinks().map((social, index) => (
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
