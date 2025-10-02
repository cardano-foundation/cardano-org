import { useEffect, useMemo, useState } from "react";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import events from "@site/src/data/events.json";

const EVENTS_PER_PAGE = 5;

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="events-pagination"
      aria-label="Events pagination"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "1rem"
      }}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          backgroundColor: "white",
          cursor: currentPage === 1 ? "not-allowed" : "pointer"
        }}
      >
        Previous
      </button>
      <ul style={{ display: "flex", gap: "0.5rem", listStyle: "none", margin: 0, padding: 0 }}>
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber}>
            <button
              type="button"
              onClick={() => onPageChange(pageNumber)}
              style={{
                padding: "0.5rem 0.85rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: pageNumber === currentPage ? "#0056D2" : "white",
                color: pageNumber === currentPage ? "#fff" : "inherit",
                cursor: pageNumber === currentPage ? "default" : "pointer"
              }}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          backgroundColor: "white",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer"
        }}
      >
        Next
      </button>
    </nav>
  );
}

function EventDateTitle({ startDate, endDate, title, link }) {
  const options = { timeZone: 'UTC', month: 'long' };
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const startMonthStr = start.toLocaleDateString('en-US', options);
  const startDay = start.getUTCDate();
  // Create a consistent date string like "August 6" or "August 6-7"
  const range = end 
    ? `${startMonthStr} ${startDay}-${end.getUTCDate()}` 
    : `${startMonthStr} ${startDay}`;

  return (
    <>
      <span style={{ color: "#666" }}>{range}, </span>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#0056D2" }}>
          {title}
        </a>
      ) : (
        title
      )}
    </>
  );
}

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Cardano Events"
      description={[
        "Upcoming Cardano events in one place, so you never miss a chance to connect, learn, and grow with the Cardano Community."
      ]}
      bannerType="dots"
    />
  );
}

export default function Home() {
  const today = new Date();
  // Create a new date object representing the start of today in UTC
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const todayTimestamp = todayUTC.getTime();

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const sortedEvents = [...events].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    const upcoming = sortedEvents.filter((event) => new Date(event.startDate) >= todayUTC);
    const past = sortedEvents
      .filter((event) => new Date(event.startDate) < todayUTC && event.recapVideo)
      .reverse();

    return {
      upcomingEvents: upcoming,
      pastEvents: past,
    };
  }, [todayTimestamp]);

  const upcomingTotalPages = Math.ceil(upcomingEvents.length / EVENTS_PER_PAGE);
  const pastTotalPages = Math.ceil(pastEvents.length / EVENTS_PER_PAGE);

  useEffect(() => {
    if (upcomingTotalPages === 0) {
      if (upcomingPage !== 1) {
        setUpcomingPage(1);
      }
      return;
    }

    if (upcomingPage > upcomingTotalPages) {
      setUpcomingPage(upcomingTotalPages);
    }
  }, [upcomingEvents, upcomingPage, upcomingTotalPages]);

  useEffect(() => {
    if (pastTotalPages === 0) {
      if (pastPage !== 1) {
        setPastPage(1);
      }
      return;
    }

    if (pastPage > pastTotalPages) {
      setPastPage(pastTotalPages);
    }
  }, [pastEvents, pastPage, pastTotalPages]);

  const paginatedUpcomingEvents = useMemo(() => {
    const startIndex = (upcomingPage - 1) * EVENTS_PER_PAGE;
    return upcomingEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE);
  }, [upcomingEvents, upcomingPage]);

  const paginatedPastEvents = useMemo(() => {
    const startIndex = (pastPage - 1) * EVENTS_PER_PAGE;
    return pastEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE);
  }, [pastEvents, pastPage]);

  return (
    <Layout
    title="Cardano Events | cardano.org"
    description="Upcoming Cardano events in one place, so you never miss a chance to connect, learn, and grow with the Cardano Community."
    >
      <OpenGraphInfo pageName="events" /> 
      <HomepageHeader />
      <main>
      
      <BoundaryBox>
        <Divider text="Discover Cardano Events Worldwide" id ="worldwide"/>
        <div className="event-platforms">
          <a
            className="platform-card"
            href="https://luma.com/CardanoEvents"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Luma.com"
          >
            <figure>
              <img
                src={`/img/events/platform-luma.png`}
                alt="Luma.com"
              />
              <figcaption>Events on Luma.com</figcaption>
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
              <img
                src={`/img/events/platform-meetup.png`}
                alt="Meetup.com"
              />
              <figcaption>Events on Meetup.com</figcaption>
            </figure>
          </a>
        </div>
      </BoundaryBox>

      <BackgroundWrapper backgroundType={"zoom"}>
      <BoundaryBox>
            <Divider text="Upcoming highlighted Events" id ="upcoming"/>
            <ul>
              {paginatedUpcomingEvents.map(event => (
                <li key={event.title} style={{ borderBottom: "1px solid #eee", paddingBottom: "2rem", marginBottom: "2rem" }}>
                  <h3>
                    <EventDateTitle
                      startDate={event.startDate}
                      endDate={event.endDate}
                      title={event.title}
                      link={event.link}
                    />
                  </h3>
                  <div className="event-content">
                    {event.image && (
                      <img
                        src={`/img/events/${event.image}`}
                        alt={event.title}
                        style={{
                          width: "240px",
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                      />
                    )}
                    <div>
                      <p>{event.description}</p>
                      <p>
                        <span title="Event Location">📍 {event.location}</span><br />
                        <span title="Event Organiser">👥 {event.organizer}</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={upcomingPage}
              totalPages={upcomingTotalPages}
              onPageChange={setUpcomingPage}
            />
        </BoundaryBox>


        <BoundaryBox>
            <Divider text="Past Highlighted Events" id="past"/>
            <ul>
              {paginatedPastEvents.map(event => (
                <li key={event.title} style={{ borderBottom: "1px solid #eee", paddingBottom: "2rem", marginBottom: "2rem" }}>
                  <h3>
                    <EventDateTitle
                      startDate={event.startDate}
                      endDate={event.endDate}
                      title={event.title}
                      link={event.link}
                    />
                  </h3>
                  <div className="event-content">
                    {event.recapVideo ? (
                      <div style={{ marginTop: "1rem" }}>
                        <a
                          href={`https://www.youtube.com/watch?v=${event.recapVideo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <img
                            src={`https://img.youtube.com/vi/${event.recapVideo}/hqdefault.jpg`}
                            alt={`Recap thumbnail for ${event.title}`}
                            style={{
                              width: "520px",
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: "8px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                            }}
                          />
                        </a>
                      </div>
                    ) : event.image && (
                      <img
                        src={`/img/events/${event.image}`}
                        alt={event.title}
                        style={{
                          width: "240px",
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                      />
                    )}
                    <div>
                      {event.recapVideo && (
                        <p>
                          <strong>Recap available: </strong> <a
                            href={`https://www.youtube.com/watch?v=${event.recapVideo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >Watch here</a>
                        </p>
                      )}
                      <p>{event.description}</p>
                      <p>
                        <span title="Event Location">📍 {event.location}</span><br />
                        <span title="Event Organiser">👥 {event.organizer}</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={pastPage}
              totalPages={pastTotalPages}
              onPageChange={setPastPage}
            />
         </BoundaryBox>
      </BackgroundWrapper>

      
        <SpacerBox size="medium"/>
      </main>
    </Layout>
  );
}