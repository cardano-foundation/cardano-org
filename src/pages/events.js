import { useMemo, useState } from "react";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import curatedEvents from "@site/src/data/events.json";
import { translate } from "@docusaurus/Translate";
import { mergeEvents } from "@site/src/utils/events/eventModel";
import { EVENT_CATEGORIES } from "@site/src/utils/events/categories";
import useLumaEvents from "@site/src/utils/events/useLumaEvents";
import EventCard from "@site/src/components/Events/EventCard";
import EventHeroControls from "@site/src/components/Events/EventHeroControls";
import TopicFilter from "@site/src/components/Events/TopicFilter";
import EventList from "@site/src/components/Events/EventList";
import FeaturedEvents from "@site/src/components/Events/FeaturedEvents";
import RecapEvents from "@site/src/components/Events/RecapEvents";
import CalendarView from "@site/src/components/Events/CalendarView";
import ViewToggle from "@site/src/components/Events/ViewToggle";

const SUBMIT_EVENT_URL = "https://cardanocommunity.typeform.com/submit-event";
// Curated conference events shown as highlighted cards above the full list.
// The row scrolls horizontally, so we can surface a good number of the next
// upcoming ones (not strictly bound to the current calendar month).
const FEATURED_LIMIT = 10;

function todayUtcStart() {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

function matchesPlace(event, place) {
  if (place === "online") return event.online;
  if (place === "inperson") return !event.online;
  return true;
}

function matchesQuery(event, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return true;
  const haystack = [event.title, event.location?.label, event.organizer]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function matchesCategory(event, category) {
  if (!category) return true;
  return event.category === category;
}

// Categories too generic to offer as a topic button (the catch-all buckets).
const HIDDEN_TOPIC_CATEGORIES = new Set(["Community", "Other"]);

// Distinct categories actually present, in the canonical taxonomy order.
function collectCategories(events) {
  const present = new Set(events.map((e) => e.category).filter(Boolean));
  return Object.keys(EVENT_CATEGORIES).filter(
    (c) => present.has(c) && !HIDDEN_TOPIC_CATEGORIES.has(c),
  );
}

function HomepageHeader({ filters, onChange }) {
  return (
    <SiteHero
      title={translate({ id: "events.hero.title", message: "Cardano Events" })}
      description={[
        translate({
          id: "events.hero.description",
          message:
            "Discover events, meet builders, and grow with the global Cardano community.",
        }),
      ]}
      bannerType="dots"
    >
      <EventHeroControls value={filters} onChange={onChange} />
    </SiteHero>
  );
}

export default function Events() {
  const { entries: lumaEntries } = useLumaEvents();
  const [view, setView] = useState("list");
  const [filters, setFilters] = useState({
    place: "all",
    time: "upcoming",
    query: "",
    category: null,
  });

  const allEvents = useMemo(
    () => mergeEvents(curatedEvents, lumaEntries),
    [lumaEntries],
  );

  const availableCategories = useMemo(() => collectCategories(allEvents), [allEvents]);

  // The calendar spans every month, so it ignores the upcoming/past toggle but
  // still respects place, topic and search.
  const calendarEvents = useMemo(
    () =>
      allEvents.filter(
        (event) =>
          matchesPlace(event, filters.place) &&
          matchesQuery(event, filters.query) &&
          matchesCategory(event, filters.category),
      ),
    [allEvents, filters.place, filters.query, filters.category],
  );

  // Highlighted events are the upcoming curated entries (hand-picked
  // conferences), independent of the filters applied to the full list below.
  const featuredEvents = useMemo(() => {
    const todayTs = todayUtcStart();
    return allEvents
      .filter(
        (event) =>
          event.source === "curated" &&
          (event.startDate ? new Date(event.startDate).getTime() : 0) >= todayTs,
      )
      .slice(0, FEATURED_LIMIT);
  }, [allEvents]);

  // Past curated events that have a recorded recap video.
  const recapEvents = useMemo(() => {
    const todayTs = todayUtcStart();
    return allEvents
      .filter(
        (event) =>
          event.source === "curated" &&
          event.recapVideo &&
          (event.startDate ? new Date(event.startDate).getTime() : 0) < todayTs,
      )
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [allEvents]);

  const isPast = filters.time === "past";

  // Featured is a highlight of the default view. Once the user searches or
  // filters, hide it so the (changing) list moves up into view.
  const isFiltering =
    filters.query.trim() !== "" ||
    filters.place !== "all" ||
    filters.category !== null ||
    filters.time !== "upcoming" ||
    view === "calendar";

  const orderedEvents = useMemo(() => {
    const todayTs = todayUtcStart();
    const filtered = allEvents.filter((event) => {
      const startTs = event.startDate ? new Date(event.startDate).getTime() : 0;
      const isUpcoming = startTs >= todayTs;
      if (filters.time === "upcoming" && !isUpcoming) return false;
      if (filters.time === "past" && isUpcoming) return false;
      return (
        matchesPlace(event, filters.place) &&
        matchesQuery(event, filters.query) &&
        matchesCategory(event, filters.category)
      );
    });
    // Past events read newest first; upcoming and all read soonest first.
    // filter() already returns a fresh array, so reversing in place is safe.
    return isPast ? filtered.reverse() : filtered;
  }, [allEvents, filters, isPast]);

  const registerLabel = translate({ id: "events.card.register", message: "View event" });
  const onlineLabel = translate({ id: "events.card.online", message: "Online" });
  const featuredLabels = {
    register: registerLabel,
    online: onlineLabel,
    thisWeek: translate({ id: "events.featured.thisWeek", message: "This week" }),
  };
  const emptyLabel = isPast
    ? translate({
        id: "events.empty.past",
        message: "No past events match your filters.",
      })
    : translate({
        id: "events.empty.upcoming",
        message:
          "No upcoming events match your filters right now. Check the Cardano calendars below for the latest.",
      });

  return (
    <Layout
      title={translate({
        id: "events.meta.title",
        message: "Cardano Events, Conferences and Meetups",
      })}
      description={translate({
        id: "events.meta.description",
        message:
          "Upcoming Cardano events in one place, so you never miss a chance to connect, learn, and grow with the Cardano Community.",
      })}
    >
      <OpenGraphInfo pageName="events" />
      <HomepageHeader filters={filters} onChange={setFilters} />
      <main>
        {featuredEvents.length > 0 && !isFiltering && (
          <BoundaryBox>
            <Divider
              text={translate({
                id: "events.featured.title",
                message: "Featured upcoming events",
              })}
              id="featured"
            />
            <FeaturedEvents events={featuredEvents} labels={featuredLabels} />
          </BoundaryBox>
        )}

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider
              text={
                view === "calendar"
                  ? translate({ id: "events.divider.calendar", message: "Events Calendar" })
                  : filters.time === "past"
                    ? translate({
                        id: "events.divider.past",
                        message: "Past Events and Recaps",
                      })
                    : filters.time === "all"
                      ? translate({ id: "events.divider.all", message: "All Events" })
                      : translate({
                          id: "events.divider.upcoming",
                          message: "Upcoming Events",
                        })
              }
              id="events"
            />
            <div className="events-toolbar">
              <TopicFilter
                value={filters}
                onChange={setFilters}
                topics={availableCategories}
              />
              <ViewToggle
                value={view}
                onChange={setView}
                listLabel={translate({ id: "events.view.list", message: "List" })}
                calendarLabel={translate({ id: "events.view.calendar", message: "Calendar" })}
              />
            </div>
            {view === "calendar" ? (
              <CalendarView events={calendarEvents} />
            ) : (
              <EventList
                events={orderedEvents}
                emptyLabel={emptyLabel}
                renderCard={(event) => (
                  <EventCard
                    key={`${event.source}-${event.title}-${event.startDate}`}
                    event={event}
                    registerLabel={registerLabel}
                    onlineLabel={onlineLabel}
                  />
                )}
              />
            )}
          </BoundaryBox>
        </BackgroundWrapper>

        {recapEvents.length > 0 && (
          <BoundaryBox>
            <Divider
              text={translate({
                id: "events.recaps.title",
                message: "Recent event recaps",
              })}
              id="recaps"
            />
            <RecapEvents events={recapEvents} />
          </BoundaryBox>
        )}

        <BoundaryBox>
          <Divider
            text={translate({
              id: "events.divider.discover",
              message: "Discover Cardano Events Worldwide",
            })}
            id="worldwide"
          />
          <div className="event-platforms">
            <a
              className="platform-card"
              href="https://luma.com/CardanoEvents"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Luma.com"
            >
              <figure>
                <img src={`/img/events/platform-luma.png`} alt="Luma.com" />
                <figcaption>
                  {translate({ id: "events.platforms.luma", message: "Events on Luma.com" })}
                </figcaption>
              </figure>
            </a>
            <a
              className="platform-card"
              href="https://www.meetup.com/pro/cardano"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meetup.com"
            >
              <figure>
                <img src={`/img/events/platform-meetup.png`} alt="Meetup.com" />
                <figcaption>
                  {translate({ id: "events.platforms.meetup", message: "Events on Meetup.com" })}
                </figcaption>
              </figure>
            </a>
          </div>
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            <strong>
              {translate({
                id: "events.submit.title",
                message: "Want to host a Cardano event?",
              })}
            </strong>
            <br />
            {translate({
              id: "events.submit.description",
              message: "Submit your event to be featured on cardano.org.",
            })}
            <br />
            <a href={SUBMIT_EVENT_URL} target="_blank" rel="noopener noreferrer">
              {translate({ id: "events.submit.cta", message: "Submit your event" })}
            </a>
          </p>
        </BoundaryBox>

        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
