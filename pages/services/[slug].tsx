// pages/services/[slug].tsx

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ServiceListing } from '@/components/SingleListingPage';
import { supabase } from '@/lib/supabase';
import Head from 'next/head';

interface Service {
  id: string;
  listing_type: 'service';
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
  category: string; // Changed from service_category
  is_individual: boolean;
  opening_hours: {
    enabled: boolean;
    hours: Record<string, { open: string; close: string; }>;
  };
  availability: {
    enabled: boolean;
    slots: Array<{ start: string; end: string; }>;
  };
  booking_enabled: boolean;
  video_link: string;
  slug: string;
  location: string; // Assuming it's stored as a string in the format "(lat,lng)"
}

interface ServicePageProps {
  service: Service | null;
}

export default function ServicePage({ service }: ServicePageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <>
      <Head>
        <title>{service.title} | Weusifix</title>
        <meta name="description" content={service.description.substring(0, 160)} />
      </Head>
      <ServiceListing service={service} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  const { data: service, error } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .eq('listing_type', 'service')
    .single();

  if (error || !service) {
    return {
      notFound: true,
    };
  }

  // Parse the location string into an array of numbers
  if (service.location) {
    service.location = service.location.replace(/[()]/g, '').split(',').map(Number);
  }

  return {
    props: {
      service,
    },
  };
};