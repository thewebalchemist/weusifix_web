import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import clientPromise from '@/lib/mongodb';
import { ServiceListing, StayListing, EventListing, ExperienceListing } from '@/components/SingleListingPage';

const ListingPage = ({ listing }) => {
  const router = useRouter();
  const { slug } = router.query;

  if (!listing) {
    return <div>Listing not found</div>;
  }

  const ListingComponent = {
    service: ServiceListing,
    stay: StayListing,
    event: EventListing,
    experience: ExperienceListing
  }[listing.listingType];

  return <ListingComponent listing={listing} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string[] };
  
  if (slug.length < 2) {
    return { notFound: true };
  }

  const [listingType, listingSlug] = slug;
  const singularType = listingType.slice(0, -1); // Remove 's' from the end

  const client = await clientPromise;
  const db = client.db();

  const listing = await db.collection('listings').findOne({ 
    listingType: singularType, 
    slug: listingSlug 
  });

  if (!listing) {
    return { notFound: true };
  }

  return {
    props: {
      listing: JSON.parse(JSON.stringify(listing)),
    },
  };
};

export default ListingPage;