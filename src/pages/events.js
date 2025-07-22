import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import events from "@site/src/data/events.json";

function EventDateTitle({ startDate, endDate, title, link }) {
  const options = { timeZone: 'UTC', month: 'long', day: 'numeric' };
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const startStr = start.toLocaleDateString('en-US', options);
  const endStr = end ? end.getDate() : null;

  const range = end ? `${startStr.split(' ')[0]} ${start.getDate()}-${endStr}` : startStr;

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

  return (
    <Layout
    title="Cardano Events | cardano.org"
    description="Upcoming Cardano events in one place, so you never miss a chance to connect, learn, and grow with the Cardano Community."
    >
      <OpenGraphInfo pageName="events" /> 
      <HomepageHeader />
      <main>
        
      <BackgroundWrapper backgroundType={"zoom"}>
      <BoundaryBox>
            <Divider text="Upcoming events" id ="upcoming"/>
            <ul>
              {events
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .filter(event => new Date(event.startDate) >= new Date())
                .map(event => (
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
        </BoundaryBox>

        
        <BoundaryBox>
            <Divider text="Past Events" id="past"/>
            <ul>
              {events
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .filter(event => new Date(event.startDate) < new Date())
                .map(event => (
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
         </BoundaryBox>
      </BackgroundWrapper>

      
        <SpacerBox size="medium"/>
      </main>
    </Layout>
  );
}