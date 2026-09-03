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
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

// Hint: You can preselect a topic with http://localhost:3000/contact?topic=iog
// or http://localhost:3000/contact?topic=sponsor etc

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'contact.hero.title', message: 'Contact'})}
      description={translate({id: 'contact.hero.description', message: 'Cardano is supported by the Cardano Foundation, IOG, EMURGO, Intersect, PRAGMA and others. Fill out the contact form below and we will put you in touch with the team best placed to assist you.'})}
      bannerType="fluidBlue"
    />
  );
}

function JoinIntersect() {
  return (
    <div>
      <TitleWithText
        title={translate({id: 'contact.intersect.title', message: 'Intersect - one of the member-based organizations'})}
        description={[
          translate({id: 'contact.intersect.description', message: 'Intersect is a member-based organization for the Cardano ecosystem tasked with ensuring its continuity and future development.'}),
        ]}
        titleType="black"
        headingDot={false}
      />
      <br />
      <Link
        className="button button--primary button--lg"
        href="https://members.intersectmbo.org/registration"
      >
        {translate({id: 'contact.intersect.buttonLabel', message: 'Join Intersect'})}
      </Link>
    </div>
  );
}

function TechnicalIssueForm() {
  return (
    <div>
      <TitleWithText
        title={translate({id: 'contact.technicalIssue.title', message: 'Report a technical issue'})}
        description={[
          translate({id: 'contact.technicalIssue.description', message: 'To get help for one of the following wallets, please raise a support ticket.'}),
          {
            list: ["Daedalus", "Lace"],
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
        {translate({id: 'contact.technicalIssue.buttonLabel', message: 'Raise Ticket'})}
      </Link>
    </div>
  );
}

function SponsorshipForm() {
  return (
    <div>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/LNXdLDhsQmA?si=1Q3HejtLiyfAoPY-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <TitleWithText
        title={translate({id: 'contact.sponsorship.title', message: 'Event sponsorship'})}
        description={[
          translate({id: 'contact.sponsorship.description1', message: 'Thank you for your interest in sponsoring Cardano events. The Cardano Summit 2026 will not take place, the community voted against funding it from the treasury. The Cardano Foundation still hosts and attends events around the world, and sponsorship opportunities can be tailored to your organization\'s goals.'}),
          translate({id: 'contact.sponsorship.description2', message: 'Use the Cardano Foundation contact form to tell the events team about your organization and the kind of event or sponsorship you have in mind. They will get back to you to discuss options.'}),
        ]}
        titleType="black"
        headingDot={false}
      />
      <br />
      <Link className="button button--primary button--lg" href="https://cardanofoundation.org/contact">
        {translate({id: 'contact.sponsorship.buttonLabel', message: 'Contact the Cardano Foundation'})}
      </Link>
    </div>
  );
}

export default function Home() {

  const location = useLocation(); // Use the useLocation hook to access the current location
  const [selectedTopic, setSelectedTopic] = useState(null); // State for the topic
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Extract 'type' query parameter from URL
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("topic");
    if (type) {
      // Preselect the topic from the URL query; it is also user-selectable.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTopic(type);
    }
  }, [location]); // Dependency array, re-run effect if location changes

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  return (
    <Layout
    title={translate({id: 'contact.meta.title', message: 'Contact Cardano, Get in Touch'})}
    description={translate({id: 'contact.meta.description', message: 'Get in touch with the Cardano ecosystem. Reach the Cardano Foundation, Intersect, IOG, or EMURGO for partnerships, support, or sponsorship inquiries.'})}
    >
      <OpenGraphInfo pageName="contact" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <Divider text={translate({id: 'contact.divider.hereToHelp', message: 'Here to help'})} />
          <TitleWithText title={translate({id: 'contact.helpSection.title', message: 'What Can We Help You With?'})} headingDot={true} />
          {/* Topic Selection, each topic will render a different component */}
          {translate({id: 'contact.select.prefix', message: 'I have'})}
          <select
            className={clsx("selectField", "selectFieldArrow")}
            onChange={handleTopicChange}
            value={selectedTopic ?? ""}
            aria-label={translate({id: 'contact.select.label', message: 'What can we help you with?'})}
          >
            <option value="">{translate({id: 'contact.select.placeholder', message: 'not yet decided (please select)'})}</option>
            <option value="iog">
              {translate({id: 'contact.select.option.technicalIssue', message: 'a technical issue with Daedalus or Lace'})}
            </option>
            <option value="intersect">{translate({id: 'contact.select.option.intersect', message: 'the intention to join Intersect'})}</option>
            <option value="sponsor">
              {translate({id: 'contact.select.option.sponsor', message: 'the desire to sponsor a Cardano event'})}
            </option>
            <option value="different">{translate({id: 'contact.select.option.different', message: 'another inquiry'})}</option>
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
