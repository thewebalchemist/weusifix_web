import React from 'react';
import { EventListing, ExperienceListing, ServiceListing, StayListing } from '../single-page';
import { mockEventListing, mockExperienceListing, mockServiceListing, mockStayListing } from './mockData';


function Data() {
  return (
    <div>
      <h1>Service Listing Example</h1>
      <ServiceListing service={mockServiceListing} />

      <h1>Event Listing Example</h1>
      <EventListing event={mockEventListing} />

      <h1>Stay Listing Example</h1>
      <StayListing stay={mockStayListing} />

      <h1>Experience Listing Example</h1>
      <ExperienceListing experience={mockExperienceListing} />
    </div>
  );
}

export default Data;