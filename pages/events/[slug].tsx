// pages/events/[slug].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { EventListing } from '@/components/SingleListingPage';
import clientPromise from '@/lib/mongodb';
import Head from 'next/head';

interface Event {
  _id: string;
  listingType: 'event';
  title: string;
  description: string;
  address: string;
  images: string[];
  userDetails: {
    profilePic: string;
    email: string;
    phone: string;
    bio: string;
    socialMedia: {
      website: string;
      facebook: string;
      twitter: string;
      instagram: string;
      youtube: string;
    }
  };
  eventDate: string;
  eventTime: string;
  capacity: string;
  eventPricing: Array<{ type: string; price: string }>;
  priceCurrency: string;
  bookingEnabled: boolean;
  videoLink: string;
  slug: string;
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

  return (
    <>
      <Head>
        <title>{event.title} | Weusifix</title>
        <meta name="description" content={event.description.substring(0, 160)} />
      </Head>
      <EventListing event={event} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  const client = await clientPromise;
  const db = client.db();

  const event = await db.collection('listings').findOne({ slug: slug, listingType: 'event' });

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