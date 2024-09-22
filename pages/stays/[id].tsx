// pages/stays/[id].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { StayListing } from '../../components/SingleListingPage';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface Stay {
  _id: string;
  title: string;
  description: string;
  // Add other stay properties here
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

  return <StayListing stay={stay} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const client = await clientPromise;
  const db = client.db();

  const stay = await db.collection('listings').findOne({ _id: new ObjectId(id), type: 'stay' });

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