// pages/events/[id].js
import { useRouter } from 'next/router';
import { EventListing } from '../components/SingleListingPage';
import { mockEventListing } from '../data/mockData';


export default function EventPage({ event }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return <EventListing event={event} />;
}

export async function getServerSideProps({ params }) {
  // In a real application, you would fetch the data from an API here
  // For now, we'll use the mock data
  const event = mockEventListing;

  // If the event doesn't exist, return notFound
  if (!event) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      event,
    },
  };
}