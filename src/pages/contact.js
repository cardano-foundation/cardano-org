import clsx from "clsx";
import Link from "@docusaurus/Link";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import ContactFormHS from "@site/src/components/ContactFormHS";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";

// Hint: You can preselect a topic with http://localhost:3000/contact?topic=iog 
// or http://localhost:3000/contact?topic=sponsor etc

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Contact | cardano.org"
      description="Cardano is supported by the Cardano Foundation, IOG, EMURGO, Intersect, PRAGMA and others. Fill out the contact form below and we will put you in touch with the team best placed to assist you."
      bannerType="fluid"
    />
  );
}

function JoinIntersect() {
  return (
    <div>
      <TitleWithText
        title="Intersect - one of the member-based organizations"
        description={[
          "Intersect is a member-based organization for the Cardano ecosystem tasked with ensuring its continuity and future development.",
        ]}
        titleType="black"
        headingDot={false}
      />
      <br />
      <Link
        className="button button--primary button--lg"
        href="https://members.intersectmbo.org/de/registration"
      >
        Join Intersect
      </Link>
    </div>
  );
}

function TechnicalIssueForm() {
  return (
    <div>
      <TitleWithText
        title="Report a technical issue"
        description={[
          "To get help for one of the following wallets, please raise a support ticket.",
          {
            list: ["Daedalus", "Nami", "Lace"],
          },
        ]}
        titleType="black"
        headingDot={false}
      />
      <br />
      <Link
        className="button button--primary button--lg"
        href="https://iohk.zendesk.com/hc/en-us"
      >
        Raise Ticket
      </Link>
    </div>
  );
}

function SponsorshipForm() {
  return (
    <div>
      <TitleWithText
        title="Cardano Summit Sponsorship"
        description={[
          "Thank you for your interest in sponsoring our annual Cardano Summit! Your support is crucial to the success of our summit, \
          and we're excited about the possibility of partnering with you. Sponsorship opportunities provide significant exposure \
          and can be tailored to meet your organization's needs and goals.",

          "Please fill out the form below to express your interest and provide us with more details about your organization and \
          sponsorship preferences. Our team will review your submission and get in touch with you to discuss potential sponsorship \
          packages and how we can best collaborate for the upcoming event.",
        ]}
        titleType="black"
        headingDot={false}
      />
      <br />
      <Link className="button button--primary button--lg" href="https://summit.cardano.org/sponsor/#become-a-sponsor">
        Sponsorship Request
      </Link>
    </div>
  );
}

export default function Home() {

  const location = useLocation(); // Use the useLocation hook to access the current location
  const [selectedTopic, setSelectedTopic] = useState(null); // State for the topic

  useEffect(() => {
    // Extract 'type' query parameter from URL
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("topic");
    if (type) {
      setSelectedTopic(type);
    }
  }, [location]); // Dependency array, re-run effect if location changes

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  return (
    <Layout
    title="Cardano - making the world work better for all"
    description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
    >
      <OpenGraphImage pageName="contact" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <Divider text="Here to help" />
          <TitleWithText title="What Can We Help You With?" headingDot={true} />
          {/* Topic Selection, each topic will render a different component */}I
          have
          <select
            className={clsx("selectField", "selectFieldArrow")}
            onChange={handleTopicChange}
            value={selectedTopic}
          >
            <option value="">not yet decided (please select)</option>
            <option value="iog">
              a technical issue with Daedalus, Nami or Lace
            </option>
            <option value="intersect">the intention to join Intersect</option>
            <option value="sponsor">
              the desire to sponsor the Cardano Summit
            </option>
            <option value="different">another inquiry</option>
          </select>
          <SpacerBox size="small" />
          {/* Conditional rendering based on user selection */}
          {selectedTopic === "iog" && <TechnicalIssueForm />}
          {selectedTopic === "intersect" && <JoinIntersect />}
          {selectedTopic === "sponsor" && <SponsorshipForm />}
          {selectedTopic === "different" && <ContactFormHS />}
          {/* ... */}
        </BoundaryBox>
        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
