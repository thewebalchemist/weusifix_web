import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ExperienceListing } from '@/components/SingleListingPage';
import { supabase } from '@/lib/supabase';
import Head from 'next/head';

interface Experience {
  id: string;
  listing_type: 'experience';
  title: string;
  description: string;
  address: string;
  images: string[];
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
  experience_category: string;
  duration: string;
  group_size: string;
  experience_pricing: {
    adults: string;
    children: string;
    teens: string;
    groups: string;
    families: string;
  };
  price_currency: string;
  included: string;
  booking_enabled: boolean;
  video_link: string;
  slug: string;
  location: [number, number];
}

interface ExperiencePageProps {
  experience: Experience | null;
}

export default function ExperiencePage({ experience }: ExperiencePageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!experience) {
    return <div>Experience not found</div>;
  }

  return (
    <>
      <Head>
        <title>{experience.title} | Weusifix</title>
        <meta name="description" content={experience.description.substring(0, 160)} />
      </Head>
      <ExperienceListing experience={experience} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  const { data: experience, error } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .eq('listing_type', 'experience')
    .single();

  if (error || !experience) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      experience,
    },
  };
};