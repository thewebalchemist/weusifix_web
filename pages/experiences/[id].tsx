// pages/experiences/[id].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ExperienceListing } from '../../components/SingleListingPage';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface Experience {
  _id: string;
  title: string;
  description: string;
  // Add other experience properties here
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

  return <ExperienceListing experience={experience} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const client = await clientPromise;
  const db = client.db();

  const experience = await db.collection('listings').findOne({ _id: new ObjectId(id), type: 'experience' });

  if (!experience) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      experience: JSON.parse(JSON.stringify(experience)),
    },
  };
};