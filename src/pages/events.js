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
import useLumaEvents from "@site/src/utils/events/useLumaEvents";
import EventCard from "@site/src/components/Events/EventCard";
import EventFilters from "@site/src/components/Events/EventFilters";
import EventList from "@site/src/components/Events/EventList";

const SUBMIT_EVENT_URL = "https://cardanocommunity.typeform.com/submit-event";

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

function matchesTag(event, tag) {
  if (!tag) return true;
  return Array.isArray(event.tags) && event.tags.includes(tag);
}

// Tags that make poor filter chips: the guidelines pin and "Virtual", which the
// in-person/online toggle already covers.
const EXCLUDED_TAGS = new Set(["\u{1F310} Virtual", "\u{1F4A1} Event Submission Guidelines"]);
const MAX_TAG_CHIPS = 8;

function collectTags(events) {
  const counts = new Map();
  for (const event of events) {
    for (const tag of event.tags || []) {
      if (EXCLUDED_TAGS.has(tag)) continue;
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TAG_CHIPS)
    .map(([tag]) => tag);
}

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({ id: "events.hero.title", message: "Cardano Events" })}
      description={[
        translate({
          id: "events.hero.description",
          message:
            "Upcoming Cardano events in one place, so you never miss a chance to connect, learn, and grow with the Cardano Community.",
        }),
      ]}
      bannerType="dots"
    />
  );
}

export default function Events() {
  const { entries: lumaEntries } = useLumaEvents();
  const [filters, setFilters] = useState({
    place: "all",
    time: "upcoming",
    query: "",
    tag: null,
  });

  const allEvents = useMemo(
    () => mergeEvents(curatedEvents, lumaEntries),
    [lumaEntries],
  );

  const availableTags = useMemo(() => collectTags(allEvents), [allEvents]);

  const isPast = filters.time === "past";

  const orderedEvents = useMemo(() => {
    const todayTs = todayUtcStart();
    const filtered = allEvents.filter((event) => {
      const startTs = event.startDate ? new Date(event.startDate).getTime() : 0;
      const isUpcoming = startTs >= todayTs;
      if (!isPast && !isUpcoming) return false;
      if (isPast && isUpcoming) return false;
      return (
        matchesPlace(event, filters.place) &&
        matchesQuery(event, filters.query) &&
        matchesTag(event, filters.tag)
      );
    });
    // Past events read newest first, upcoming read soonest first. filter()
    // already returns a fresh array, so reversing in place is safe.
    return isPast ? filtered.reverse() : filtered;
  }, [allEvents, filters, isPast]);

  const filterLabels = useMemo(
    () => ({
      searchPlaceholder: translate({
        id: "events.filter.searchPlaceholder",
        message: "Search events or locations",
      }),
      timeGroup: translate({ id: "events.filter.timeGroup", message: "Time" }),
      placeGroup: translate({ id: "events.filter.placeGroup", message: "Location" }),
      timeUpcoming: translate({ id: "events.filter.timeUpcoming", message: "Upcoming" }),
      timePast: translate({ id: "events.filter.timePast", message: "Past" }),
      placeAll: translate({ id: "events.filter.placeAll", message: "All" }),
      placeInPerson: translate({
        id: "events.filter.placeInPerson",
        message: "In person",
      }),
      placeOnline: translate({ id: "events.filter.placeOnline", message: "Online" }),
      tagGroup: translate({ id: "events.filter.tagGroup", message: "Topic" }),
      tagAll: translate({ id: "events.filter.tagAll", message: "All topics" }),
    }),
    [],
  );

  const registerLabel = translate({ id: "events.card.register", message: "View event" });
  const onlineLabel = translate({ id: "events.card.online", message: "Online" });
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
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider
              text={
                isPast
                  ? translate({
                      id: "events.divider.past",
                      message: "Past Events and Recaps",
                    })
                  : translate({
                      id: "events.divider.upcoming",
                      message: "Upcoming Events",
                    })
              }
              id="events"
            />
            <EventFilters
              value={filters}
              onChange={setFilters}
              labels={filterLabels}
              tags={availableTags}
            />
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
          </BoundaryBox>
        </BackgroundWrapper>

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
