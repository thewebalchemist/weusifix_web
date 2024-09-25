// pages/stays/[id].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { StayListing } from '@/components/SingleListingPage';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Head from 'next/head';

interface Stay {
  _id: string;
  title: string;
  description: string;
  address: string;
  images: string[];
  stayPrice: string;
  priceCurrency: string;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  stayAvailability: Array<{ start: string; end: string }>;
  userDetails: {
    profilePic: string;
    phone: string;
    email: string;
    bio: string;
    socialMedia: {
      website: string;
      facebook: string;
      twitter: string;
      instagram: string;
      youtube: string;
    }
  };
  bookingEnabled: boolean;
  slug: string;
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

  const client = await clientPromise;
  const db = client.db();

  const stay = await db.collection('listings').findOne({ slug: slug, listingType: 'stay' });

  if (!stay) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      stay: JSON.parse(JSON.stringify(stay)),
    },
  };
};