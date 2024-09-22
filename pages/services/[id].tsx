// pages/services/[id].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ServiceListing } from '../../components/SingleListingPage';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface Service {
  _id: string;
  title: string;
  description: string;
  // Add other service properties here
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

  return <ServiceListing service={service} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const client = await clientPromise;
  const db = client.db();

  const service = await db.collection('listings').findOne({ _id: new ObjectId(id), type: 'service' });

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