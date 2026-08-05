import React from 'react';
import { translate } from '@docusaurus/Translate';
import HorizontalScroller from '@site/src/components/HorizontalScroller';
import FeaturedEventCard from '@site/src/components/Events/FeaturedEventCard';

// Highlighted (curated) events shown as a horizontally scrollable row above the
// full list.
export default function FeaturedEvents({ events, labels }) {
  if (!events.length) return null;
  return (
    <HorizontalScroller
      ariaLabel={translate({ id: 'events.featured.title', message: 'Featured upcoming events' })}
      prevLabel={translate({ id: 'events.carousel.prev', message: 'Previous' })}
      nextLabel={translate({ id: 'events.carousel.next', message: 'Next' })}
    >
      {events.map((event) => (
        <FeaturedEventCard
          key={`${event.title}-${event.startDate}`}
          event={event}
          labels={labels}
        />
      ))}
    </HorizontalScroller>
  );
}
