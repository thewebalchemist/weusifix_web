// pages/events/[id].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { EventListing } from '../../components/SingleListingPage';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface Event {
  _id: string;
  title: string;
  description: string;
  // Add other event properties here
}

interface EventPageProps {
  event: Event | null;
}

export default function EventPage({ event }: EventPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return <EventListing event={event} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const client = await clientPromise;
  const db = client.db();

  const event = await db.collection('listings').findOne({ _id: new ObjectId(id), type: 'event' });

  if (!event) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      event: JSON.parse(JSON.stringify(event)),
    },
  };
};