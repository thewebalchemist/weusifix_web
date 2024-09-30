// pages/events/[slug].tsx

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { EventListing } from '@/components/SingleListingPage';
import { supabase } from '@/lib/supabase';
import Head from 'next/head';

interface Event {
  id: string;
  listing_type: 'event';
  title: string;
  description: string;
  address: string;
  images: string[];
  listing_user_details: {
    name: string;
    email: string;
    phoneNumber: string;
    profilePic: string | null;
    bio: string;
    socialMedia: {
      website: string;
      facebook: string;
      twitter: string;
      instagram: string;
      youtube: string;
    }
  };
  event_date: string;
  event_time: string;
  capacity: number; // Changed to number
  event_pricing: Array<{ type: string; price: number }>; // Changed price to number
  price_currency: string;
  booking_enabled: boolean;
  video_link: string;
  slug: string;
  location: string; // Assuming it's stored as a string in the format "(lat,lng)"
  category: string; // Added category field
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

  const { data: event, error } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .eq('listing_type', 'event')
    .single();

  if (error || !event) {
    return {
      notFound: true,
    };
  }

  // Parse the location string into an array of numbers
  if (event.location) {
    event.location = event.location.replace(/[()]/g, '').split(',').map(Number);
  }

  return {
    props: {
      event,
    },
  };
};