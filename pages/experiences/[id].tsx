// pages/experiences/[id].js
import { useRouter } from 'next/router';
import { ExperienceListing } from '../components/SingleListingPage';
import { mockExperienceListing } from '../data/mockData';


export default function ExperiencePage({ experience }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!experience) {
    return <div>Experience not found</div>;
  }

  return <ExperienceListing experience={experience} />;
}

export async function getServerSideProps({ params }) {
  // In a real application, you would fetch the data from an API here
  // For now, we'll use the mock data
  const experience = mockExperienceListing;

  // If the experience doesn't exist, return notFound
  if (!experience) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      experience,
    },
  };
}