import React from 'react';
import { translate } from '@docusaurus/Translate';
import HorizontalScroller from '@site/src/components/HorizontalScroller';
import RecapCard from '@site/src/components/Events/RecapCard';

// Horizontally scrollable row of past-event recap videos.
export default function RecapEvents({ events }) {
  if (!events.length) return null;
  return (
    <HorizontalScroller
      ariaLabel={translate({ id: 'events.recaps.title', message: 'Recent event recaps' })}
      prevLabel={translate({ id: 'events.carousel.prev', message: 'Previous' })}
      nextLabel={translate({ id: 'events.carousel.next', message: 'Next' })}
    >
      {events.map((event) => (
        <RecapCard key={`${event.title}-${event.recapVideo}`} event={event} />
      ))}
    </HorizontalScroller>
  );
}
