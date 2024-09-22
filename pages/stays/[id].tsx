// pages/stays/[id].js
import { useRouter } from 'next/router';
import { StayListing } from '../components/SingleListingPage';
import { mockStayListing } from '../data/mockData';

export default function StayPage({ stay }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!stay) {
    return <div>Stay not found</div>;
  }

  return <StayListing stay={stay} />;
}

export async function getServerSideProps({ params }) {
  // In a real application, you would fetch the data from an API here
  // For now, we'll use the mock data
  const stay = mockStayListing;

  // If the stay doesn't exist, return notFound
  if (!stay) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      stay,
    },
  };
}