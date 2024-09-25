// pages/[listingType]/[slug].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ServiceListing, EventListing, ExperienceListing, StayListing } from '@/components/SingleListingPage';
import clientPromise from '@/lib/mongodb';
import Head from 'next/head';

interface ListingPageProps {
  listing: any;  // You might want to create a union type for different listing types
}

export default function ListingPage({ listing }: ListingPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Listing not found</div>;
  }

  const ListingComponent = {
    service: ServiceListing,
    event: EventListing,
    experience: ExperienceListing,
    stay: StayListing
  }[listing.listingType];

  return (
    <>
      <Head>
        <title>{listing.title} | Your Website Name</title>
        <meta name="description" content={listing.description.substring(0, 160)} />
      </Head>
      <ListingComponent listing={listing} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { listingType, slug } = context.params as { listingType: string; slug: string };

  const client = await clientPromise;
  const db = client.db();

  const listing = await db.collection('listings').findOne({ 
    listingType: listingType, 
    slug: slug 
  });

  if (!listing) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      listing: JSON.parse(JSON.stringify(listing)),
    },
  };
};