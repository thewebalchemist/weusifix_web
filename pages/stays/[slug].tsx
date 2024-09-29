import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { StayListing } from '@/components/SingleListingPage';
import { supabase } from '@/lib/supabase';
import Head from 'next/head';

interface Stay {
  id: string;
  listing_type: 'stay';
  title: string;
  description: string;
  address: string;
  images: string[];
  stay_price: string;
  price_currency: string;
  check_in_time: string;
  check_out_time: string;
  amenities?: string[];
  stay_availability: Array<{ start: string; end: string }>;
  listing_user_details: {
    name: string;
    email: string;
    phone_number: string;
    profile_pic: string | null;
    bio: string;
    social_media: {
      website: string;
      facebook: string;
      twitter: string;
      instagram: string;
      youtube: string;
    }
  };
  booking_enabled: boolean;
  slug: string;
  location: [number, number];
}

interface StayPageProps {
  stay: Stay | null;
}

export default function StayPage({ stay }: StayPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!stay) {
    return <div>Stay not found</div>;
  }

  return (
    <>
      <Head>
        <title>{stay.title} | Weusifix</title>
        <meta name="description" content={stay.description.substring(0, 160)} />
      </Head>
      <StayListing stay={stay} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  const { data: stay, error } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .eq('listing_type', 'stay')
    .single();

  if (error || !stay) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      stay,
    },
  };
};