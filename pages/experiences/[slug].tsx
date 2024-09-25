// pages/experiences/[id].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { ExperienceListing } from '../../components/SingleListingPage';
import Head from 'next/head';

interface Experience {
  _id: string;
  listingType: 'experience';
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
  experienceCategory: string;
  duration: string;
  groupSize: string;
  experiencePricing: {
    adults: string;
    children: string;
    teens: string;
    groups: string;
    families: string;
  };
  priceCurrency: string;
  included: string;
  bookingEnabled: boolean;
  videoLink: string;
  slug: string;
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

  const client = await clientPromise;
  const db = client.db();

  const experience = await db.collection('listings').findOne({ slug: slug, listingType: 'experience' });

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