// pages/services/[id].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ServiceListing } from '@/components/SingleListingPage';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Head from 'next/head';

interface Service {
  _id: string;
  listingType: 'service';
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
  serviceCategory: string;
  isIndividual: boolean;
  openingHours: {
    enabled: boolean;
    hours: Record<string, { open: string; close: string; }>;
  };
  availability: {
    enabled: boolean;
    slots: Array<{ start: string; end: string; }>;
  };
  bookingEnabled: boolean;
  videoLink: string;
  slug: string;
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
        <title>{service.title} | Your Website Name</title>
        <meta name="description" content={service.description.substring(0, 160)} />
      </Head>
      <ServiceListing service={service} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  const client = await clientPromise;
  const db = client.db();

  const service = await db.collection('listings').findOne({ slug: slug, listingType: 'service' });

  if (!service) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      service: JSON.parse(JSON.stringify(service)),
    },
  };
};