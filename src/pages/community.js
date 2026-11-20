import React, { useMemo } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import {
  FaCode,
  FaComments,
  FaDiscord,
  FaFacebook,
  FaLandmark,
  FaLanguage,
  FaPenToSquare,
  FaReddit,
  FaShieldHalved,
  FaStackExchange,
  FaTelegram,
  FaUserGroup,
} from "react-icons/fa6";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import Grid from "@site/src/components/Layout/Grid";
import RoleCard from "@site/src/components/Layout/RoleCard";
import LinkCardRow from "@site/src/components/Layout/LinkCardRow";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import EventList from "@site/src/components/Events/EventList";
import EventCard from "@site/src/components/Events/EventCard";
import curatedEvents from "@site/src/data/events.json";
import forumSnapshot from "@site/src/data/forum-topics.json";
import { FORUM_URL, LANGUAGE_NAMES, getByGroup, getLocalGroups } from "@site/src/data/communities.mjs";
import { mergeEvents, selectByTime, utcDayStartMs } from "@site/src/utils/events/eventModel";
import useLumaEvents from "@site/src/utils/events/useLumaEvents";
import { resolveLegacyAnchor } from "@site/src/utils/community/legacyAnchors.mjs";
import { isSnapshotFresh, floorToThousand } from "@site/src/utils/community/forumSnapshot.mjs";
import useHashTarget from "@site/src/utils/useHashTarget";
import { scrollToElement } from "@site/src/utils/jsUtils";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import styles from "./community.module.css";

const UPCOMING_EVENTS = 3;

// Forum category of the page language, shown next to the English ones.
const FORUM_LOCALE_CATEGORY = {
  de: "/c/deutsch/112",
  ja: "/c/japanese/19",
  es: "/c/espanol/126",
  vi: "/c/ti-ng-vi-t/191",
};

function forumCategoryLinks(locale) {
  const links = [
    { to: `${FORUM_URL}/c/english/announcements/13`, label: translate({ id: "community.forum.category.news", message: "News and Announcements" }) },
    { to: `${FORUM_URL}/c/developers/29`, label: translate({ id: "community.forum.category.developers", message: "Developers" }) },
    { to: `${FORUM_URL}/c/governance/140`, label: translate({ id: "community.forum.category.governance", message: "Governance" }) },
    { to: `${FORUM_URL}/c/staking-delegation/156`, label: translate({ id: "community.forum.category.staking", message: "Staking & Delegation" }) },
  ];
  const own = FORUM_LOCALE_CATEGORY[locale];
  if (own) links.push({ to: `${FORUM_URL}${own}`, label: <span lang={locale}>{LANGUAGE_NAMES[locale]}</span> });
  return links;
}

function platformCards() {
  return [
    {
      platform: "discord",
      icon: <FaDiscord />,
      accent: "violet",
      title: translate({ id: "community.channels.discord.title", message: "Discord" }),
      text: translate({ id: "community.channels.discord.text", message: "Real-time chat with builders, operators and community members." }),
    },
    {
      platform: "telegram",
      icon: <FaTelegram />,
      accent: "blue",
      title: translate({ id: "community.channels.telegram.title", message: "Telegram" }),
      text: translate({ id: "community.channels.telegram.text", message: "Quick questions and everyday conversation." }),
    },
    {
      platform: "reddit",
      icon: <FaReddit />,
      accent: "teal",
      title: translate({ id: "community.channels.reddit.title", message: "Reddit" }),
      text: translate({ id: "community.channels.reddit.text", message: "News, questions and discussion on r/Cardano." }),
    },
    {
      platform: "stackexchange",
      icon: <FaStackExchange />,
      accent: "blue",
      title: translate({ id: "community.channels.stackexchange.title", message: "Stack Exchange" }),
      text: translate({ id: "community.channels.stackexchange.text", message: "Questions and answers for Cardano developers." }),
    },
    {
      platform: "facebook",
      icon: <FaFacebook />,
      accent: "violet",
      title: translate({ id: "community.channels.facebook.title", message: "Facebook" }),
      text: translate({ id: "community.channels.facebook.text", message: "The Cardano community group on Facebook." }),
    },
  ];
}

function involvedCards() {
  return [
    {
      href: "/ambassadors",
      icon: <FaUserGroup />,
      accent: "blue",
      title: translate({ id: "community.involved.ambassadors.title", message: "Become an ambassador" }),
      text: translate({ id: "community.involved.ambassadors.text", message: "Help grow the community as a moderator, translator, meetup organizer or content creator." }),
    },
    {
      href: "/translations",
      icon: <FaLanguage />,
      accent: "violet",
      title: translate({ id: "community.involved.translate.title", message: "Translate cardano.org" }),
      text: translate({ id: "community.involved.translate.text", message: "Bring this website to your language." }),
    },
    {
      href: "/docs/get-involved",
      icon: <FaPenToSquare />,
      accent: "teal",
      title: translate({ id: "community.involved.contribute.title", message: "Contribute to cardano.org" }),
      text: translate({ id: "community.involved.contribute.text", message: "Fix a page, add an app or write a new guide." }),
    },
    {
      href: "/governance",
      icon: <FaLandmark />,
      accent: "blue",
      title: translate({ id: "community.involved.governance.title", message: "Take part in governance" }),
      text: translate({ id: "community.involved.governance.text", message: "Delegate your voting power or become a DRep." }),
    },
    {
      href: "/developers",
      icon: <FaCode />,
      accent: "violet",
      title: translate({ id: "community.involved.build.title", message: "Build on Cardano" }),
      text: translate({ id: "community.involved.build.text", message: "Tools, guides and funding for developers." }),
    },
  ];
}

function regionLabels() {
  return {
    uk: translate({ id: "community.local.region.uk", message: "United Kingdom" }),
  };
}

// One line next to every block that sends visitors into chat groups.
function SafetyLine() {
  return (
    <p className={styles.safetyLine}>
      <FaShieldHalved aria-hidden="true" />
      <span>
        {parseMarkdownLikeText(
          translate({ id: "community.safetyLine", message: "Admins and moderators will never message you first or ask for your password or recovery phrase. [How to stay safe](#safety)" }),
        )}
      </span>
    </p>
  );
}

function ForumCard({ stats, locale }) {
  const number = new Intl.NumberFormat(locale);
  const members = floorToThousand(stats?.members);
  const posts = floorToThousand(stats?.posts);
  return (
    <RoleCard
      icon={<FaComments />}
      title={translate({ id: "community.channels.forum.title", message: "Cardano Forum" })}
      className={styles.forumCard}
    >
      <p>
        {translate({ id: "community.channels.forum.text", message: "The home of long-form discussion: announcements, governance, development and local communities in many languages." })}
      </p>
      {members && posts && (
        <p className={styles.forumStats}>
          <span>{translate({ id: "community.channels.forum.members", message: "{count}+ members" }, { count: number.format(members) })}</span>
          <span>{translate({ id: "community.channels.forum.posts", message: "{count}+ posts" }, { count: number.format(posts) })}</span>
        </p>
      )}
      <Link className="button button--primary" to={FORUM_URL}>
        {translate({ id: "community.hero.forumButton", message: "Visit the forum" })}
      </Link>
    </RoleCard>
  );
}

function PlatformCard({ card }) {
  return (
    // The id sits on a wrapper because #discord and #telegram are link
    // targets of the footer and of old deep links.
    <div id={card.platform} className={styles.platformCell}>
      <RoleCard icon={card.icon} title={card.title} accent={card.accent} className={styles.platformCard}>
        <p>{card.text}</p>
        <ul className={styles.linkList}>
          {getByGroup("channel", card.platform).map((channel) => (
            <li key={channel.id}>
              <Link to={channel.url}>{channel.name}</Link>
            </li>
          ))}
        </ul>
      </RoleCard>
    </div>
  );
}

function ForumTopics({ topics }) {
  return (
    <ol className={styles.topicList}>
      {topics.map((topic) => (
        <li key={topic.id} className={styles.topic}>
          <Link className={styles.topicTitle} to={topic.url}>
            {topic.title}
          </Link>
          <span className={styles.topicCategory}>{topic.category}</span>
        </li>
      ))}
    </ol>
  );
}

function LocalGroup({ group, regions }) {
  return (
    <li className={styles.localItem}>
      {group.language ? (
        <span className={styles.localLabel} lang={group.language}>
          {LANGUAGE_NAMES[group.language]}
        </span>
      ) : (
        <span className={styles.localLabel}>{regions[group.region]}</span>
      )}
      <Link to={group.url}>{group.name}</Link>
    </li>
  );
}

export default function Community() {
  const {
    siteConfig: { customFields },
    i18n: { currentLocale },
  } = useDocusaurusContext();
  // The server and the first client render both count from the build date,
  // so the markup matches. After hydration the real day takes over, which
  // also retires an old forum snapshot on a build that was never refreshed.
  const isBrowser = useIsBrowser();
  const nowMs = isBrowser ? utcDayStartMs() : Date.parse(customFields.BUILD_DATE);

  const { entries: lumaEntries } = useLumaEvents();
  const upcoming = useMemo(
    () => selectByTime(mergeEvents(curatedEvents, lumaEntries), "upcoming", nowMs).slice(0, UPCOMING_EVENTS),
    [lumaEntries, nowMs],
  );
  const showTopics = isSnapshotFresh(forumSnapshot.fetchedAt, nowMs) && forumSnapshot.topics.length > 0;
  const { own, others } = getLocalGroups(currentLocale);
  const regions = regionLabels();
  const [reportToAdmin] = getByGroup("support");

  // Deep links into the retired Online Communities doc arrive with the old
  // heading anchor, in any of the five languages.
  useHashTarget((id) => {
    const target = resolveLegacyAnchor(id);
    if (!target) return;
    window.history.replaceState(null, "", `#${target}`);
    setTimeout(() => scrollToElement(document.getElementById(target)), 100);
  });

  return (
    <Layout
      title={translate({ id: "community.meta.title", message: "Cardano Community: Forum, Chats, Events and Local Groups" })}
      description={translate({ id: "community.meta.description", message: "Find the Cardano community: the forum, Discord and Telegram, upcoming events, groups in your language and ways to get involved." })}
    >
      <OpenGraphInfo pageName="community" />
      <SiteHero
        title={translate({ id: "community.hero.title", message: "Cardano Community" })}
        description={translate({ id: "community.hero.tagline", message: "Thousands of people build, discuss and run Cardano. Here is where to find them." })}
        bannerType="dots"
      >
        <div className={styles.heroButtons}>
          <Link className="button button--pill-white" to={FORUM_URL}>
            {translate({ id: "community.hero.forumButton", message: "Visit the forum" })}
          </Link>
          <Link className="button button--pill-white" to="#events">
            {translate({ id: "community.hero.eventsButton", message: "Find an event" })}
          </Link>
        </div>
      </SiteHero>
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <Divider id="channels" headingLevel={2} text={translate({ id: "community.channels.title", message: "Where the community talks" })} />
            <ForumCard stats={forumSnapshot.stats} locale={currentLocale} />
            <Grid fit minItemWidth="340px" className={styles.platformGrid}>
              {platformCards().map((card) => (
                <PlatformCard key={card.platform} card={card} />
              ))}
            </Grid>
            <SafetyLine />

            <Divider id="forum" headingLevel={2} text={translate({ id: "community.forum.title", message: "Popular on the forum" })} />
            {showTopics && (
              <>
                <p className={styles.sectionText}>
                  {translate({ id: "community.forum.note", message: "Posts written by community members on forum.cardano.org." })}
                </p>
                <ForumTopics topics={forumSnapshot.topics} />
              </>
            )}
            <p className={styles.rowLabel}>{translate({ id: "community.forum.browse", message: "Browse by topic" })}</p>
            <LinkCardRow items={forumCategoryLinks(currentLocale)} />
            <p className={styles.moreLink}>
              <Link className="button button--secondary" to={`${FORUM_URL}/top?period=monthly`}>
                {translate({ id: "community.forum.more", message: "More on the forum" })}
              </Link>
            </p>
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <Divider id="events" headingLevel={2} text={translate({ id: "community.events.title", message: "Meet the community" })} />
          <p className={styles.sectionText}>
            {translate({ id: "community.events.text", message: "Conferences, meetups, workshops and community calls, in person and online." })}
          </p>
          {upcoming.length > 0 && (
            <div className={styles.events}>
              <EventList
                events={upcoming}
                renderCard={(event) => (
                  <EventCard
                    key={`${event.source}-${event.title}-${event.startDate}`}
                    event={event}
                    registerLabel={translate({ id: "events.card.register", message: "View event" })}
                    onlineLabel={translate({ id: "events.card.online", message: "Online" })}
                    recurringLabel={translate({ id: "events.card.recurring", message: "Recurring" })}
                  />
                )}
              />
            </div>
          )}
          <p className={styles.moreLink}>
            <Link className="button button--secondary" to="/events">
              {translate({ id: "community.events.all", message: "See all events" })}
            </Link>
          </p>

          <Divider id="local" headingLevel={2} text={translate({ id: "community.local.title", message: "Communities in your language and region" })} />
          <p className={styles.sectionText}>{translate({ id: "community.local.text", message: "Groups run by local community members." })}</p>
          <SafetyLine />
          {own.length > 0 && (
            <>
              <h3 className={styles.ownLanguage} lang={currentLocale}>
                {LANGUAGE_NAMES[currentLocale]}
              </h3>
              <Grid as="ul" minItemWidth="220px" className={styles.localGrid}>
                {own.map((group) => (
                  <LocalGroup key={group.id} group={group} regions={regions} />
                ))}
              </Grid>
            </>
          )}
          <Grid as="ul" minItemWidth="220px" className={styles.localGrid}>
            {others.map((group) => (
              <LocalGroup key={group.id} group={group} regions={regions} />
            ))}
          </Grid>
          <SpacerBox size="small" />
        </BoundaryBox>

        <BackgroundWrapper backgroundType="solidGrey">
          <BoundaryBox>
            <Divider id="get-involved" headingLevel={2} text={translate({ id: "community.involved.title", message: "Ways to get involved" })} />
            <Grid fit minItemWidth="340px" className={styles.involvedGrid}>
              {involvedCards().map((card) => (
                <RoleCard key={card.href} href={card.href} icon={card.icon} title={card.title} accent={card.accent}>
                  {card.text}
                </RoleCard>
              ))}
            </Grid>

            <Divider id="safety" headingLevel={2} text={translate({ id: "community.safety.title", message: "Stay safe in community channels" })} />
            <HighlightCallout icon={<FaShieldHalved />}>
              <ul className={styles.safetyList}>
                <li>{translate({ id: "community.safety.point1", message: "Admins and moderators will never send you a private message first." })}</li>
                <li>{translate({ id: "community.safety.point2", message: "No one legitimate will ever ask for your recovery phrase, password or private keys." })}</li>
                <li>
                  {parseMarkdownLikeText(
                    translate(
                      { id: "community.safety.point3", message: "Problems with users or moderation in the Telegram channels? Tell [Cardano Report to Admin]({url})." },
                      { url: reportToAdmin.url },
                    ),
                  )}
                </li>
              </ul>
              <p className={styles.safetyLinks}>
                <Link to="/common-scams">{translate({ id: "community.safety.scams", message: "Learn to spot common scams" })}</Link>
                <Link to="/community-code-of-conduct">{translate({ id: "community.safety.conduct", message: "Read the Community Code of Conduct" })}</Link>
              </p>
            </HighlightCallout>
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <Divider id="add" />
          <TitleWithText
            headingLevel={2}
            title={translate({ id: "community.add.title", message: "Is your community missing?" })}
            description={translate({ id: "community.add.text", message: "Communities that are active, open and well moderated can be listed here." })}
            buttonLabel={translate({ id: "community.add.button", message: "Add your community" })}
            buttonLink="/docs/get-involved/add-community"
          />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
