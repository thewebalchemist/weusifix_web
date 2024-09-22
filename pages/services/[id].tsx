import { useRouter } from 'next/router';
import { ServiceListing } from '../components/SingleListingPage';
import { mockServiceListing } from '../data/mockData';


export default function ServicePage({ service }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!service) {
    return <div>Service not found</div>;
  }

  return <ServiceListing service={service} />;
}

export async function getServerSideProps({ params }) {
  // In a real application, you would fetch the data from an API here
  // For now, we'll use the mock data
  const service = mockServiceListing;

  // If the service doesn't exist, return notFound
  if (!service) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      service,
    },
  };
}